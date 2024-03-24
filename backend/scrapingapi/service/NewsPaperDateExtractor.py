import re
import requests
from bs4 import BeautifulSoup
from datetime import datetime


class NewsPaperDateExtractor:
    def extract_date_by_source(self, url):
        # Custom logic for extracting date based on the source
        if "newagebd.net" in url:
            print(url)
            return self.extract_date_newage(url)
        elif "justnewsbd.com" in url:
            print(url)
            return self.extract_date_justnewsbd(url)
        elif "dhakatribune.com" in url:
            print(url)
            return self.extract_date_dhakatribune(url)

        elif "bangladeshmonitor.com.bd" in url:
            print(url)
            return self.extract_date_bangladeshmonitor(url)

        elif "risingbd.com" in url:
            print(url)
            return self.extract_date_risingbd(url)

        elif "dailyindustry.news" in url:
            print(url)
            return self.extract_date_dailyindustry(url)

        elif "unb.com.bd" in url:
            print(url)
            return self.extract_date_unb(url)

        elif "en.prothomalo.com" in url:
            print(url)
            return self.extract_date_en_prothomalo(url)

        elif "jagonews24.com/en" in url:
            print(url)
            return self.extract_date_jagonews24(url)

        elif "bangladeshpost.net" in url:
            print(url)
            return self.extract_date_bangladeshpost(url)

        elif "/www.thefinancialexpress.com" in url:
            print("/www.thefinancialexpress.com")
            return self.extract_date_financialexpress(url)

        elif "thedailystar.net" in url:
            print(url)
            return self.extract_date_dailystar(url)

        elif "rtvonline.com" in url:
            print(url)
            return self.extract_date_rtvonline(url)

        elif "en.ittefaq.com" in url:
            print(url)
            return self.extract_date_ittefaq(url)

        elif "dailycountrytodaybd.com" in url:
            print(url)
            return self.extract_date_dailycountrytoday(url)

        elif "bssnews.net" in url:
            print(url)
            return self.extract_datetime_bss(url)

        elif "bdnews24.com" in url:
            print(url)
            return self.extract_date_bdnews24(url)

        elif "businesspostbd.com" in url:
            print(url)
            return self.extract_datetime_businesspost(url)

        elif "dailyasianage.com" in url:
            print("daily asian age 1")
            print(url)
            return self.extract_date_dailyasianage(url)

        elif "/today.thefinancialexpress.com" in url:
            print("today financial express")
            print(url)
            return self.extract_date_todayfinancialexpress(url)

        return None

    @staticmethod
    def extract_date_newage(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        soup = BeautifulSoup(response.text, "html.parser")
        article_text = soup.find_all(text=re.compile(r"Published: \d{2}:\d{2}, \w+ \d{2},\d{4}"))

        if article_text:
            # Extract the first matching text
            date_text = article_text[0]
            # Use regex to extract the date and time
            match = re.search(r"Published: (\d{2}:\d{2}), (\w+ \d{2},\d{4})", date_text)
            if match:
                time_str, date_str = match.groups()
                datetime_obj = datetime.strptime(f"{date_str} {time_str}", "%b %d,%Y %H:%M")
                formatted_datetime = datetime_obj.strftime("%m/%d/%Y %I:%M:%S %p")
                return formatted_datetime

        return None

    @staticmethod
    def extract_date_justnewsbd(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        soup = BeautifulSoup(response.text, "html.parser")
        publish_time_div = soup.find("div", class_="publish-time")

        if publish_time_div:
            publish_time_text = publish_time_div.get_text(strip=True)
            # The date format seems to be '08 January 2021, 16:37'. We'll use regex to extract this
            match = re.search(r"(\d{2} \w+ \d{4}, \d{2}:\d{2})", publish_time_text)
            if match:
                datetime_str = match.group(1)
                datetime_obj = datetime.strptime(datetime_str, "%d %B %Y, %H:%M")
                formatted_datetime = datetime_obj.strftime("%m/%d/%Y %I:%M:%S %p")
                return formatted_datetime

        return None

    @staticmethod
    def extract_date_todayfinancialexpress(url):
        print("today")
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            # Based on the structure shown, we are looking for the 'i' tag with class 'fa-clock-o'
            time_icon = soup.find("i", class_="fa-clock-o")
            if time_icon:
                # The time is in the next sibling of the 'i' tag which is a text node
                date_time_str = time_icon.next_sibling.strip()
                # Convert to datetime object
                publish_date = datetime.strptime(date_time_str, "%B %d, %Y %H:%M:%S")
                # Format the datetime object
                formatted_date = publish_date.strftime("%m/%d/%Y %I:%M:%S %p")
                return formatted_date
            else:
                print("Time icon not found.")
                return None
        else:
            print(f"Failed to retrieve content from {url}")
            return None

    @staticmethod
    def extract_date_dailyasianage(url):
        print("Mine")
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")

            # Find the paragraph with the published date
            date_paragraph = soup.find("div", class_="col-md-12 P_time").find("p")
            if date_paragraph:
                # Extract the date and time text
                date_text = date_paragraph.get_text(strip=True).replace("Published:", "").strip()
                # Convert to datetime object
                publish_date = datetime.strptime(date_text, "%I:%M %p, %d %B %Y")
                # Format the datetime object
                formatted_date = publish_date.strftime("%m/%d/%Y %I:%M:%S %p")
                return formatted_date
            else:
                print("Date paragraph not found.")
                return None
        else:
            print(f"Failed to retrieve content from {url}")
            return None

    @staticmethod
    def extract_date_dhakatribune(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            parsed_html = BeautifulSoup(response.text, "lxml")
            date_pattern = r"Publish\s*:\s*(\d{1,2}\s\w{3}\s\d{4}),\s*(\d{1,2}:\d{2}\s\w{2})"
            matches = re.search(date_pattern, parsed_html.text)

            if matches:
                publish_date_str = matches.group(1) + ", " + matches.group(2)
                publish_date = datetime.strptime(publish_date_str, "%d %b %Y, %I:%M %p")
                formatted_date = publish_date.strftime("%m/%d/%Y %I:%M:%S %p")
                return formatted_date
        return None

    @staticmethod
    def extract_date_bangladeshmonitor(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            html_text = soup.get_text()
            # Search for a date pattern in the entire HTML text
            date_match = re.search(r"\bDate: (\d{2} \w+, \d{4})\b", html_text)

            if date_match:
                date_str = date_match.group(1)
                datetime_obj = datetime.strptime(date_str, "%d %B, %Y")
                # Set the time to midnight
                datetime_with_midnight = datetime.combine(datetime_obj.date(), datetime.min.time())
                # Format the datetime with the time set to midnight
                formatted_datetime = datetime_with_midnight.strftime("%m/%d/%Y %I:%M:%S %p")
                return formatted_datetime

        return None

    @staticmethod
    def extract_date_risingbd(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")

            # Find the 'div' with the class 'DPublishTime'
            publish_time_div = soup.find("div", class_="DPublishTime")

            if publish_time_div:
                # Within this div, find the 'span' with the class 'Ptime'
                publish_time_span = publish_time_div.find("span", class_="Ptime")

                if publish_time_span:
                    # Extract the text from the span and split by 'Update:' to get the published date
                    publish_time_text = publish_time_span.get_text(strip=True).split("Update:")[0]
                    # Remove the 'Published:' part and any trailing whitespace
                    publish_time_text = re.sub(r"Published:\s*", "", publish_time_text).strip()
                    # Print the extracted publish time text for debugging
                    print("Extracted publish time text:", publish_time_text)
                    # Convert the publishing time text to a datetime object
                    date_format = "%H:%M, %d %B %Y"
                    try:
                        publish_datetime = datetime.strptime(publish_time_text, date_format)
                        return publish_datetime.strftime("%m/%d/%Y %I:%M:%S %p")
                    except ValueError as e:
                        print(f"Error parsing date: {e}")
                        return None
        else:
            print(f"Failed to retrieve the page: HTTP {response.status_code}")

        return None

    @staticmethod
    def extract_date_bdnews24(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            date_div = soup.find("div", class_="wBeSy W-N65")
            if date_div:
                date_text = date_div.get_text(strip=True).replace("Published :", "").strip()
                date_formats = [
                    "%d %B %Y, %I:%M %p",
                    "%d %b %Y, %I:%M %p",
                ]  # List of date formats to try

                for date_format in date_formats:
                    try:
                        date_time_obj = datetime.strptime(date_text, date_format)
                        formatted_date_time = date_time_obj.strftime("%m/%d/%Y %I:%M:%S %p")
                        return formatted_date_time
                    except ValueError:
                        continue  # If the format does not match, continue to the next format

                print("Date format error: No matching format for date string.")
                return None
            else:
                print("Date div not found.")
                return None
        else:
            print(f"Failed to retrieve content from {url}: HTTP {response.status_code}")
            return None

    @staticmethod
    def extract_date_dailyindustry(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")

            # Finding the date container
            date_container = soup.find("span", class_="bdaia-current-time")

            if date_container:
                date_str = date_container.get_text(strip=True)
                try:
                    # Assuming the date format is "Month DD, YYYY"
                    datetime_obj = datetime.strptime(date_str, "%B %d, %Y")
                    # Appending midnight time
                    formatted_datetime = datetime_obj.strftime("%m/%d/%Y 12:00:00 AM")
                    return formatted_datetime
                except ValueError:
                    return "Date format is incorrect or not found"

        return None

    @staticmethod
    def extract_date_en_prothomalo(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            time_tag = soup.find("time")
            if time_tag:
                datetime_str = time_tag["datetime"]
                # Parsing the datetime string to a datetime object
                datetime_obj = datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M:%S%z")
                # Formatting the datetime object to the desired format
                formatted_datetime = datetime_obj.strftime("%m/%d/%Y %I:%M:%S %p")
                return formatted_datetime
        return None

    @staticmethod
    def extract_date_jagonews24(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, "html.parser")

            datetime_element = soup.find("i", class_="fa fa-clock-o text-danger")
            if datetime_element:
                date_time_str = datetime_element.find_next_sibling(text=True).strip()
                datetime_obj = datetime.strptime(date_time_str, "%d %B %Y, %I:%M %p")
                formatted_datetime = datetime_obj.strftime("%m/%d/%Y %I:%M:%S %p")
                return formatted_datetime

        return None

    @staticmethod
    def extract_date_bangladeshpost(url):
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            date_info = soup.find("div", style=lambda value: value and "margin-left:10px" in value)
            if date_info:
                date_str = re.search(
                    r"Published\s*:\s*(\d{1,2} \w{3} \d{4} \d{1,2}:\d{2} [APM]{2})",
                    date_info.get_text(),
                )
                if date_str:
                    publish_date = datetime.strptime(date_str.group(1), "%d %b %Y %I:%M %p")
                    formatted_date = publish_date.strftime("%m/%d/%Y %I:%M:%S %p")
                    return formatted_date

        return None

    @staticmethod
    def extract_date_unb(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            # soup = BeautifulSoup(response.text, "lxml")
            date_pattern = r"Publish-.*?>(.*?)<\/li>"
            parsed_html = response.text
            matches = re.search(date_pattern, parsed_html, re.DOTALL)

            # Extracting and converting the publishing date
            if matches:
                publish_date_str = matches.group(1).strip()
                date_str = re.sub("<[^<]+?>", "", publish_date_str).strip()  # Removes HTML tags
                publish_date = datetime.strptime(date_str, "%B %d, %Y, %I:%M %p")
                formatted_date = publish_date.strftime("%m/%d/%Y %I:%M:%S %p")
                return formatted_date
        return None

    @staticmethod
    def extract_date_financialold2(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            # Find the <time> tag
            time_tag = soup.find("time")
            # Check if the <time> tag is found and attempt to parse and format the date
            if time_tag:
                date_text = time_tag.get_text()
                if re.match(r"\w+\s\d{1,2},\s\d{4}", date_text):
                    try:
                        # Parse the date string into a datetime object for 24-hour format
                        publishing_date = datetime.strptime(date_text, "%b %d, %Y %H:%M")
                    except ValueError:
                        # If there's a ValueError, it could be because the time is in 12-hour format with AM/PM
                        publishing_date = datetime.strptime(date_text, "%b %d, %Y %I:%M %p")
                    # Format the datetime object
                    formatted_date = publishing_date.strftime("%m/%d/%Y %I:%M:%S %p")
                    return formatted_date
        return None

    @staticmethod
    def extract_date_financialexpress(url):
        print("extract_date_financialexpress")
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)
        # published_date = None
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")

            # Extracting the published date
            published_time_tag = soup.find("time")
            print(published_time_tag)
            date_text = published_time_tag.get_text(strip=True) if published_time_tag else None
            # Assuming the date format is ""
            # date_text = datetime.strptime(published_date_str, '%b %d, %Y %H:%M') if published_date_str else None
            # published_date = date_text.strftime('%m/%d/%Y %I:%M:%S %p') if date_text else None

            date_formats = ["%b %d, %Y %H:%M", "%B %d, %Y %H:%M"]  # Add more formats if needed

            for date_format in date_formats:
                try:
                    datetime_obj = datetime.strptime(date_text, date_format)
                    formatted_date = datetime_obj.strftime("%m/%d/%Y %I:%M:%S %p")
                    return formatted_date
                except ValueError:
                    continue  # If the format does not match, continue to the next format

            print(f"Date format error: No matching format for date string {date_text}")
            return None
        else:
            print(f"Failed to retrieve content from {url}")

    @staticmethod
    def extract_date_dailystar(url):
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            date_div = soup.find(
                "div", class_="date"
            )  # Update class based on actual HTML structure
            if date_div:
                datetime_str = date_div.get_text().strip()
                # First try to find the initial publication date
                match = re.search(r"(\w+ \w+ \d+, \d{4} \d{2}:\d{2} [APM]{2})", datetime_str)
                if match:
                    datetime_str = match.group(1)
                else:
                    # If not found, use the last update date
                    match = re.search(
                        r"Last update on: (\w+ \w+ \d+, \d{4} \d{2}:\d{2} [APM]{2})", datetime_str
                    )
                    if match:
                        datetime_str = match.group(1)
                    else:
                        return None
                publish_date = datetime.strptime(datetime_str, "%a %b %d, %Y %I:%M %p")
                formatted_date = publish_date.strftime("%m/%d/%Y %I:%M:%S %p")
                return formatted_date
        return None

    @staticmethod
    def extract_date_rtvonline(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            # Find the element that contains the date and time
            date_element = soup.find("div", class_="rpt_info_section")
            if date_element:
                date_text = date_element.get_text(strip=True)
                # Remove the leading "Rtv news|  " text
                date_text = re.sub(r"^.*?\|\s+", "", date_text)
                date_formats = ["%d %B %Y, %H:%M", "%d %b %Y, %H:%M"]  # Add more formats if needed

                for date_format in date_formats:
                    try:
                        datetime_obj = datetime.strptime(date_text, date_format)
                        formatted_date = datetime_obj.strftime("%m/%d/%Y %I:%M:%S %p")
                        return formatted_date
                    except ValueError:
                        continue  # If the format does not match, continue to the next format

                print(f"Date format error: No matching format for date string {date_text}")
                return None
        else:
            print(f"Failed to retrieve content from {url}")

    @staticmethod
    def extract_date_ittefaq(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")

            # Locate the span with class 'tts_time'
            date_span = soup.find("span", class_="tts_time")
            if date_span:
                date_str = date_span.get(
                    "content"
                )  # Get the 'content' attribute which has the date and time
                # Parse the date from ISO 8601 format
                datetime_obj = datetime.fromisoformat(date_str)
                # Format the datetime object into the desired string format
                formatted_date = datetime_obj.strftime("%m/%d/%Y %I:%M:%S %p")
                return formatted_date
            else:
                print("Date element not found.")
                return None
        else:
            print(f"Failed to retrieve content from {url}: HTTP {response.status_code}")
            return None

    @staticmethod
    def extract_date_dailycountrytoday(url):
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            # Find the element that contains the date and time
            date_element = soup.find("a", href=lambda href: href and "date" in href)
            if date_element:
                date_text = date_element.get_text(strip=True)
                # Assuming the date format is "April 23, 2024"
                datetime_obj = datetime.strptime(date_text, "%B %d, %Y")
                # Format the datetime object
                formatted_date = datetime_obj.strftime("%m/%d/%Y %I:%M:%S %p")
                return formatted_date
            else:
                print("Date element not found.")
                return None
        else:
            print(f"Failed to retrieve content from {url}: HTTP {response.status_code}")
            return None

    @staticmethod
    def extract_datetime_bss(url):
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/58.0.3029.110 Safari/537.3",
            "Accept-Language": "en-US,en;q=0.5",
        }
        response = requests.get(url, headers=headers, timeout=20)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            # Find the element that contains the date and time
            date_time_element = soup.find("div", class_="entry_update")
            if date_time_element:
                date_text = date_time_element.get_text(strip=True)
                # Parse the datetime object according to the expected format
                # Assuming the date format is "17 May 2024, 16:22"
                date_formats = ["%d %B %Y, %H:%M", "%d %b %Y, %H:%M"]  # Add more formats if needed

                for date_format in date_formats:
                    try:
                        datetime_obj = datetime.strptime(date_text, date_format)
                        formatted_date = datetime_obj.strftime("%m/%d/%Y %I:%M:%S %p")
                        return formatted_date
                    except ValueError:
                        continue  # If the format does not match, continue to the next format

                print(f"Date format error: No matching format for date string {date_text}")
                return None
        else:
            print(f"Failed to retrieve content from {url}")

    @staticmethod
    def extract_datetime_businesspost(url):
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/58.0.3029.110 Safari/537.3",
            "Accept-Language": "en-US,en;q=0.5",
        }
        response = requests.get(url, headers=headers, timeout=20)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            # Find the element that contains the date and time
            date_time_element = soup.find("span", class_="w3-text-gray")
            if date_time_element:
                # Extract the text and split by '|' to separate date and update time if available
                date_text = date_time_element.get_text(strip=True).split("|")[0].strip()
                # Parse the datetime object according to the expected format
                date_formats = ["%d %B %Y, %H:%M", "%d %b %Y, %H:%M"]  # Add more formats if needed

                for date_format in date_formats:
                    try:
                        datetime_obj = datetime.strptime(date_text, date_format)
                        formatted_date = datetime_obj.strftime("%m/%d/%Y %I:%M:%S %p")
                        return formatted_date
                    except ValueError:
                        continue  # If the format does not match, continue to the next format

                print(f"Date format error: No matching format for date string {date_text}")
                return None
        else:
            print(f"Failed to retrieve content from {url}")
