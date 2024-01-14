import json
import mysql.connector
import pandas as pd
import requests
from bs4 import BeautifulSoup
from mysql.connector import Error
from datetime import datetime, timedelta
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from scrapingapi.service.GPT4Api import GPT4Api
from scrapingapi.service.Common import Common
from scrapingapi.service.SaveDataToDatabase import SaveDataToDatabase
from scrapingapi.service.DuplicateCheck import DuplicateCheck


class ScrapingApi:
    def __init__(self):
        self.common = Common()
        self.save_data_to_database = SaveDataToDatabase()

    def run_scraping(self, db_config):
        try:
            # Get existing data from database
            db_data = self.get_data_from_database(db_config)
            existing_urls = [row["url"] for row in db_data]

            # Get latest news from newage
            newage_df = self.scrape_new_age(existing_urls)

            # Get latest news from dailystar
            dailystar_df = self.scrape_daily_star(existing_urls)

            # Get latest news form google alerts
            filtered_new_data = self.process_google_alerts(
                db_data, newage_df, dailystar_df
            )
            # Combine all news
            combined_df = self.merge_and_process_dataframes(
                existing_urls, newage_df, dailystar_df, filtered_new_data
            )
            # Get response from GPT4
            gpt4_api = GPT4Api()
            final_dataframe = gpt4_api.gpt4_response(combined_df)

            # Rename columns to database columns
            final_dataframe.rename(
                columns={
                    "is_type_of_accident_road_accident_or_train_accident_or_waterways_accident_or_plane_accident": "accident_type",
                    "is_reason_or_cause_for_the_accident_ploughed_or_ram_or_hit_or_collision_or_breakfail_or_others": "reason_or_cause_for_accident",
                },
                inplace=True,
            )

            duplicate_check = DuplicateCheck()
            final_dataframe_after_removing_duplicate = (
                duplicate_check.duplicate_data_check(final_dataframe, db_data)
            )

            save_to_database = self.save_data_to_database.save_to_database(
                final_dataframe_after_removing_duplicate
            )

            print("save_to_database", save_to_database)

            return save_to_database

        except Exception as e:
            print(f"An error occurred: {e}")
            raise

    def scrape_new_age(self, existing_urls):
        # db_data = self.get_data(db_config)
        # existing_urls = [row['url'] for row in db_data]

        # Scrape the New Age website
        newage_upperframe = []

        for page in range(0, 10, 10):
            print("Processing page:", int(page / 10))
            page_url = f"https://www.newagebd.net/tags/Road%20accident/{page}"
            print(page_url)

            try:
                response = requests.get(page_url)
                soup = BeautifulSoup(response.text, "html.parser")
                articles = soup.find_all(
                    "li"
                )  # Update this selector based on actual website structure

                for article in articles:
                    try:
                        article_url = article.find("h3").find("a")["href"].strip()
                        if article_url not in existing_urls:
                            existing_urls.append(article_url)
                            text, date, title = self.common.extract_article_from_url(
                                article_url
                            )
                            if text and date:
                                newage_upperframe.append(
                                    (date, article_url, text, title)
                                )
                    except Exception as e:
                        print(e)
            except Exception as e:
                print(f"Error processing page {page_url}: {e}")

        # Create DataFrame for New Age articles
        newage_df = pd.DataFrame(
            newage_upperframe,
            columns=[
                "accident_datetime_from_url",
                "url",
                "articles_text_from_url",
                "article_title",
            ],
        )
        newage_df["source"] = "newagebd"
        newage_df["accident_datetime_from_url"] = pd.to_datetime(
            newage_df["accident_datetime_from_url"], errors="coerce"
        )
        newage_df.sort_values(
            by="accident_datetime_from_url", na_position="last", inplace=True
        )

        return newage_df

    def scrape_daily_star(self, existing_urls):
        dailystar_upperframe = []
        # Scrape the website
        for page in range(0, 1):  # Example for 2 pages
            if page == 0:
                page_url = (
                    "https://www.thedailystar.net/news/bangladesh/accidents-fires"
                )
            else:
                page_url = f"https://www.thedailystar.net/news/bangladesh/accidents-fires?page={page}"

            print(f"Processing {page_url}")

            try:
                response = requests.get(page_url)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, "html.parser")
                    if page == 0:
                        self.extract_articles_dailystar(
                            soup,
                            "panel-pane pane-category-news no-title block",
                            existing_urls,
                            dailystar_upperframe,
                        )
                    self.extract_articles_dailystar(
                        soup,
                        "panel-pane pane-category-load-more no-title block",
                        existing_urls,
                        dailystar_upperframe,
                    )
                else:
                    print(f"Failed to retrieve page: {response.status_code}")

            except Exception as e:
                print(f"Error processing page {page_url}: {e}")

        # Create DataFrame for The Daily Star articles
        dailystar_df = pd.DataFrame(
            dailystar_upperframe,
            columns=[
                "accident_datetime_from_url",
                "url",
                "articles_text_from_url",
                "article_title",
            ],
        )
        dailystar_df["source"] = "dailystar"
        dailystar_df["accident_datetime_from_url"] = pd.to_datetime(
            dailystar_df["accident_datetime_from_url"], errors="coerce"
        )
        dailystar_df.sort_values(
            by="accident_datetime_from_url", na_position="last", inplace=True
        )

        return dailystar_df

    def extract_articles_dailystar(
        self, soup, container_class, existing_urls, dailystar_upperframe
    ):
        articles_container = soup.find("div", class_=container_class)
        if not articles_container:
            return []

        articles = articles_container.find_all("div", class_="card")
        for article in articles:
            try:
                article_url = (
                    "https://www.thedailystar.net"
                    + article.find("a", href=True)["href"].strip()
                )
                if article_url not in existing_urls:
                    existing_urls.append(article_url)
                    (
                        article_text,
                        article_date,
                        article_title,
                    ) = self.common.extract_article_from_url(article_url)
                    if article_text:
                        dailystar_upperframe.append(
                            (article_date, article_url, article_text, article_title)
                        )
            except Exception as e:
                print(f"Error in article parsing: {e}")

    # google alerts
    @staticmethod
    def process_google_alerts(db_data, newage_df, dailystar_df):
        # Read data from Google Sheets
        url = (
            "https://script.googleusercontent.com/macros/echo?user_content_key=TBl6w-PXrtKncKWautn1veXtaFQ"
            "-ecpXFPa4IBZdXJxUJIcW8JdyIIZaxEvUTIYFKMtR9sclfRRHqVQOwH"
            "-fCTmBM2kqG_Jwm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnIR7_8zx0SnAcTyKhiDjFJog"
            "Eiq0GCvu9ZDlbPhWKtOpxfFKrF4gmjL3PvqrvDPP0zxQI-yyFg9nj-F6zXSU5dNfc25gsAtQqtz9Jw9Md8uu&lib="
            "MdKNnO8w5eDiIr8Ec6LLzmCFdP9j9HByt"
        )  # Replace with your web app URL
        response = requests.get(url)

        if response.status_code == 200:
            data = json.loads(response.text)
            # print(data)
        else:
            print("Failed to retrieve data:", response.status_code)
        headers = data[0]  # This is the first row, which contains the column names
        rows = data[1:]  # This is the rest of your data

        def standardize_date(date_str):
            try:
                # Assuming the date format in your data is like
                date_obj = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
                return date_obj.strftime("%m/%d/%Y %I:%M:%S %p")
            except ValueError:
                print(f"Error processing date: {date_str}")
                return None

        # Process Google Alerts data

        new_data_df = pd.DataFrame(rows, columns=headers)
        # Assuming 'new_data_df' is the DataFrame loaded from the Google Sheet
        # new_data_df['Date & Time'] = pd.to_datetime(new_data_df['Date & Time'].apply(standardize_date))
        new_data_df["Date & Time"] = pd.to_datetime(
            new_data_df["Date & Time"].apply(standardize_date), errors="coerce"
        )
        new_data_df["Date & Time"] += timedelta(hours=12)
        new_data_df["source"] = "google alerts"
        new_data_df = new_data_df.drop_duplicates(subset="URL")

        # Assuming you have a column 'accident_datetime_from_url' in existing_df
        google_alerts_df = [row for row in db_data if row["source"] == "google alerts"]
        most_recent_date_google_alerts = max(
            row["accident_datetime_from_url"] for row in google_alerts_df
        )

        cut_off_date = most_recent_date_google_alerts - timedelta(
            days=2
        )  # Adjust the number of days as needed
        # Filter new_data_df for recent entries
        recent_google_alerts_df = new_data_df[
            pd.to_datetime(new_data_df["Date & Time"]) >= cut_off_date
        ]
        # Existing Google Alerts URLs
        existing_google_alerts_urls = set(
            row["url"] for row in db_data if row["source"] == "google alerts"
        )

        # Filter recent_google_alerts_df for new URLs
        new_filtered_data = recent_google_alerts_df[
            ~recent_google_alerts_df["URL"].isin(existing_google_alerts_urls)
        ]

        # Exclude articles with URLs already in New Age and The Daily Star
        google_alerts_urls_to_exclude = set(
            newage_df["url"].tolist() + dailystar_df["url"].tolist()
        )
        filtered_new_data = new_filtered_data[
            ~new_filtered_data["URL"].isin(google_alerts_urls_to_exclude)
        ]

        filtered_new_data["accident_datetime_from_url"] = filtered_new_data[
            "Date & Time"
        ]

        return filtered_new_data

    def merge_and_process_dataframes(
        self, existing_urls, newage_df, dailystar_df, filtered_new_data
    ):
        articles_data = []
        for index, row in filtered_new_data.iterrows():
            print("index:", index)
            date_time = row["accident_datetime_from_url"]
            source = row["source"]
            url = row["URL"]

            if url not in existing_urls:
                try:
                    # Process the new URL
                    existing_urls.append(url)  # Append the new URL to the existing list
                    (
                        article_text,
                        article_date,
                        article_title,
                    ) = self.common.extract_article_from_url(url)
                    article_date = date_time if article_date is None else article_date
                    if article_text:  # assuming you meant article_text here
                        articles_data.append(
                            (article_date, url, article_text, source, article_title)
                        )
                except Exception as e:
                    print(f"Error in article parsing for URL {url}: {e}")

        # Create a DataFrame for the new articles
        new_articles_df = pd.DataFrame(
            articles_data,
            columns=[
                "accident_datetime_from_url",
                "url",
                "articles_text_from_url",
                "source",
                "article_title",
            ],
        )

        # Merge DataFrames
        combined_df = pd.concat([newage_df, dailystar_df, new_articles_df]).reset_index(
            drop=True
        )
        combined_df["accident_datetime_from_url"] = pd.to_datetime(
            combined_df["accident_datetime_from_url"], errors="coerce"
        )

        combined_df.sort_values(
            by="accident_datetime_from_url", na_position="last", inplace=True
        )
        combined_df = combined_df.drop_duplicates(subset="url")

        df = []
        # Check if there is any new data to process
        if not combined_df.empty:
            # Apply the standardize_date function to the 'Date & Time' colum
            # Function to calculate text similarity
            def calculate_similarity(text_list):
                vectorized = TfidfVectorizer()
                tfidf_matrix = vectorized.fit_transform(text_list)
                similarity_matrix = cosine_similarity(tfidf_matrix)
                return similarity_matrix

            # Revised function to check relevance based on keywords
            def is_relevant_article(text, accident_keywords):
                text_lower = text.lower()
                return any(keyword in text_lower for keyword in accident_keywords)

            # Accident-related keywords
            accident_keywords = [
                "road accident",
                "accident",
                "accidents",
                "traffic",
                "capsize",
                "overturned",
                "slam",
                "capsize",
                "hit",
                "ran over",
                "run over",
                "collided",
                "road accidents",
                "traffic",
                "collision",
                "crashed",
                "collision",
                "collisions",
                "train crash",
                "road and railway accidents",
                "railway accidents",
                "crashes",
                "crash",
            ]

            # Apply relevance filter
            combined_df["Relevant"] = combined_df["articles_text_from_url"].apply(
                lambda x: is_relevant_article(x, accident_keywords)
            )

            # Filter to keep only relevant articles
            relevant_df = combined_df[combined_df["Relevant"]]

            # Initialize 'Duplicate' column to False in relevant DataFrame
            relevant_df["Duplicate"] = False

            # Process for each unique date for duplicate detection
            relevant_df["Date"] = pd.to_datetime(
                relevant_df["accident_datetime_from_url"]
            ).dt.date
            unique_dates = relevant_df["Date"].unique()

            for date in unique_dates:
                daily_articles = relevant_df[relevant_df["Date"] == date]
                if len(daily_articles) > 1:
                    summaries = daily_articles["articles_text_from_url"].tolist()
                    similarity_matrix = calculate_similarity(summaries)

                    # Mark duplicates
                    for i in range(len(similarity_matrix)):
                        for j in range(i + 1, len(similarity_matrix)):
                            if (
                                similarity_matrix[i][j] > 0.9
                            ):  # Adjust threshold as needed
                                relevant_df.at[
                                    daily_articles.index[j], "Duplicate"
                                ] = True

            # Filter out duplicates
            ultimate_final_df = relevant_df[~relevant_df["Duplicate"]]

            # Display the final DataFrame

            df = pd.DataFrame(
                ultimate_final_df,
                columns=[
                    "accident_datetime_from_url",
                    "url",
                    "articles_text_from_url",
                    "source",
                    "article_title",
                ],
            )

        else:
            print("No new data to process.")

        df = df.reset_index(drop=True)

        return df

    @staticmethod
    def get_data_from_database(db_config):
        conn = None
        cursor = None
        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor(dictionary=True)

            query = """
            SELECT * FROM `all_accidents_data`
            """

            cursor.execute(query)
            rows = cursor.fetchall()
            return rows

        except Error as e:
            print(f"Error: {e}")
            raise

        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()
