import os
import re
import pandas as pd
import numpy as np

import openai

# from openai import OpenAI
import difflib
import json


class GPT4Api:
    def gpt4_response(self, df):
        # Initialize
        openai.api_key = os.environ.get("OPENAPI_KEY")
        standard_headers = [
            "news_category",
            "id",
            "number_of_accidents_occured",
            "is_the_accident_data_yearly_monthly_or_daily",
            "day_of_the_week_of_the_accident",
            "exact_location_of_accident",
            "area_of_accident",
            "division_of_accident",
            "district_of_accident",
            "subdistrict_or_upazila_of_accident",
            "is_place_of_accident_highway_or_expressway_or_water_or_others",
            "is_country_bangladesh_or_other_country",
            "is_type_of_accident_road_accident_or_train_accident_or_waterways_accident_or_plane_accident",
            "total_number_of_people_killed",
            "total_number_of_people_injured",
            "is_reason_or_cause_for_the_accident_ploughed_or_ram_or_hit_or_collision_or_breakfail_or_others",
            "primary_vehicle_involved",
            "secondary_vehicle_involved",
            "tertiary_vehicle_involved",
            "any_more_vehicles_involved",
            "available_ages_of_the_deceased",
        ]

        expected_columns = [
            "news_category",
            "id",
            "number_of_accidents_occured",
            "is_the_accident_data_yearly_monthly_or_daily",
            "day_of_the_week_of_the_accident",
            "exact_location_of_accident",
            "area_of_accident",
            "division_of_accident",
            "district_of_accident",
            "subdistrict_or_upazila_of_accident",
            "is_place_of_accident_highway_or_expressway_or_water_or_others",
            "is_country_bangladesh_or_other_country",
            "is_type_of_accident_road_accident_or_train_accident_or_waterways_accident_or_plane_accident",
            "total_number_of_people_killed",
            "total_number_of_people_injured",
            "is_reason_or_cause_for_the_accident_ploughed_or_ram_or_hit_or_collision_or_breakfail_or_others",
            "primary_vehicle_involved",
            "secondary_vehicle_involved",
            "tertiary_vehicle_involved",
            "any_more_vehicles_involved",
            "available_ages_of_the_deceased",
            "accident_datetime_from_url",
            "url",
            "source",
            "accident_id_number_url",
            "contents_whole_gpt_response",
            "articles_text_from_url",
            "article_title",
        ]

        standard_headers_snake_case = [
            self.to_snake_case(header) for header in standard_headers
        ]
        # Define the snake case headers DataFrame
        template_df = pd.DataFrame(columns=expected_columns)

        # Apply standardize_column_names to each DataFrame in processed_dataframes

        # Initialize a list to collect the processed dataframes
        processed_dataframes = []
        contents = []

        # Set the start index
        start_index = 0
        # Counter for tracking number of runs
        run_counter = 0
        save_interval = 20  # Save after every 30 runs

        if not df.empty:
            # Iterate over the rows of the dataframe
            for index, row in df.iterrows():
                # for index, row in df.iterrows():
                article_text = row["articles_text_from_url"]
                accident_datetime_from_url = row["accident_datetime_from_url"]
                accident_id_number_url = index
                url = row["url"]
                source = row["source"]
                article_title = row["article_title"]
                print("index:", index)

                prompt_system = """Task: Extract key details from road accident news articles and format them into structured JSON. Each article, representing a single accident for a place or multiple accidents for different places, a monthly report, or a yearly report, should be converted into a distinct JSON object. Provide the following information in each JSON object:
        
                    - 'news_category': Determine from these categories [Daily Accident Report, Editorial or Opinion piece, Organizational Report on Periodic Accidents, Court Article, Previous Accidents News Update, News Feature Article, Not a related article]. Exclude articles not in the first three categories and put just the category name here and keep other columns null. Not a related article can be outside of Bangladesh or the news is not an article related to the road or plane or train or waterways accidents involving vehicles. Example of Ignore articles can be those which are not related to road crash, workplace accident, fire accidents, murder, subotage, arson attack etc too. Only accidents related to vehicles on road, plane, train, waterways will be considered first. Also keep in mind for first three categories as,
                        - "Daily Accident Report"usually contains daily accident happened that day or previous day in a place or seperate places. If it provides monthly or yearly accident news in it then ignore those.
                        - "Organizational Report on Periodic Accidents" must contain the specific month or specific year accident report on overall Bangladesh. Other periodic report for example half yearly or bi weekly type report should be ignored. Also if it gives like motocycles accidents monthly or yearly report or Dhaka division monthly or yearly report, ignore those too. Only overall bangladesh accident news should be considered. Also specific months means January, February, etc and yearly means 2023, 2024 etc. Sometimes it may talk Road accidents, waterways accidents and train accidents in a single accident report and include all three in different id number. And those accidents must have the total accident number, total death and total injured number on that month or year. So fill those columns, and also id number, type of accident (must be road or waterways or train or plane in these four types), and Country column. Ignore those articles too where its not actually a accident report rather another type of report but it has a line that starts with "Read:" and then say a road accident news so ignore those as they are nothing but just a accident url in the body of the article and put the overall article category as Not a related article.
                        - "Previous Accidents News Update" contains the update of previous accidents like it may say youth dies for some accidents after some days.
                    - 'id': Use a unique number for each accident start from 1. For daily accident report if it talks only about a single accident happened for a place then its only one accident. If it talks about multiple accident in different places and give them seperate id considering each accident place as seperate. For each month or each year it should also give unique id.
                    - 'number_of_accidents_occured': Default to 1 for each accident happened or give the integer number of accidents happened for monthly or yearly. if no accident happened then input as 0. As each seperate accidents are considered as seperate id and json object so it can be 1 for daily accident report or previous accident report. But for monthly and yearly must mention the number of accidents happened.
                    - 'is_the_accident_data_yearly_monthly_or_daily': Determine the frequency only from (Daily, Previous accident update, Monthly, or Yearly) from the text. Ignore other periods. Use only "Daily" for daily accident type news in news category and "Previous accident update" for Previous Accidents News Update category. Mention the reporting organization for Monthly/Yearly reports. Usually article mentions the organization name as Bangladesh police,Government, road safety foundationor, BRTA, nirapad sarak chai, Bangladesh jatri kalyan Samity, Passenger Wellfare association, Save the Road, or Accident research institute etc. So the format for the Monthly or Yearly accident news report must be like this: Monthly (November)(2023)(Road Safety Foundation) or Yearly (2020)(Bangladesh Police) for each. Take help from accident date provided for Month and Year specification if needed.
                    - 'day_of_the_week_of_the_accident': Provide only the day of the week name (Saturday, Sunday etc) if mentioned for daily accident report type news. Take help or hints from the article publishing date time in bangladeshi time provided to find out the which day article is talking if not specifying there.
                    - 'exact_location_of_accident': Specify the exact location if mentioned. use the correct current official location name. for all locations named in the other columns too.
                    - 'area_of_accident': try to find the area name  and put it there or atleast put the  biggest area location mentioned and put it here.
                    - 'division_of_accident', 'district_of_accident', 'subdistrict_or_upazila_of_accident': Fill these based on the text, using Bangladesh administrative divisions, district and subdistrict. Must find the Bangladesh official accurate district, and division from the area or location mentioned by using your intelligence. Sometimes the article title provides the district name where accident takes place. So it is provided and use it with your intelligence.
                    - 'is_place_of_accident_highway_or_expressway_or_water_or_others': Specify the type of place (highway, expressway, flyover, water, train, roads, city roads, village roads, bridge, boat, vessel, ferry, river, railway, or others). streets and roads are synonymous, so use roads.
                    - 'is_country_bangladesh_or_other_country': Must Specify 'Bangladesh' or 'other country', if the location name or accident place name or the from the text you know they are talking about which country's place. use your intelligence.
                    - 'is_type_of_accident_road_accident_or_train_accident_or_waterways_accident_or_plane_accident': Determine the type of accident (Road accident, Train accident, Waterways accident, Plane accident, or Not a listed accident news). For fire accident which can be arson attack type incident or fire accident and if its not a mentioned accident type then put 'Not a listed accident reported news'. Besides those listed ones, other accidents and incidents must be ignored.
                    - 'total_number_of_people_killed', 'total_number_of_people_injured': Must Provide kill or injure counts in integer numbers, if no one killed or injured in the accident then must use 0. Don't use string in this column. Always provide numbers or 0.
                    - 'is_reason_or_cause_for_the_accident_ploughed_or_ram_or_hit_or_collision_or_breakfail_or_others': Describe the reason or cause (ploughed, ram, hit, reckless,plunged, wrong side, racing, tailgating, negligence, collision, break fail, defects, breakdown, crushed, bead weather, overtaking, unfit vehicles, derailment, engine problem, driver fatigue, driver asleep, elctric short circuit, sliped, skidded, unskilled driver, speeding, signal violation, explosion, crashed, run over, hit and run, lost control, fell, tire problem, overturned, or others).
                    - 'primary_vehicle_involved', 'secondary_vehicle_involved', 'tertiary_vehicle_involved': Map the text describing vehicles to generalized vehicle types. Use the following vehicle types:
                        - "Bus" for all types of buses.
                        - "Car" for all types of cars, SUVs.
                        - "Noah".
                        - "Human hauler".
                        - "Trolley".
                        - "Chander Gari".
                        - "Auto Rickshaw".
                        - "CNG" for CNG vehicle and CNG auto rickshaw.
                        - "Easy-bike"
                        - "Truck".
                        - "Garbage Truck"
                        - "Trailer"
                        - "Motorcycle".
                        - "Microbus".
                        - "Scooter".
                        - "Construction vehicle".
                        - "Bicycle".
                        - "Ambulance".
                        - "Pickup".
                        - "Lorry".
                        - "Paddy cutter vehicles".
                        - "Bulkhead".
                        - "Crane".
                        - "Wrecker".
                        - "Tractor".
                        - "Cart".
                        - "Leguna".
                        - "Nosimon".
                        - "Three-Wheeler".
                        - "Four-Wheeler".
                        - "Votvoti"
                        - "Kariman"
                        - "Mahindra"
                        - "Van".
                        - "Rickshaw".
                        - "Boat".
                        - "Trawler"
                        - "Vessel"
                        - "Launch".
                        - "Tanker".
                        - "Oil Tanker"
                        - "Road roller"
                        - "Power Tiller".
                        - "Excavator".
                        - "Train".
                        - "Airplane".
                        - "Pedestrian" if pedestrians involved in the accident but exclude other non vehicle type objects like Tree, poles etc.
                        - "Other" or give it a type or use your intelligence to give it a type from here or use null.
        
                    - 'any_more_vehicles_involved': Give additional vehicles type name here separated by comma if more than three vehicles are involved. you can put "Pedestrian" here too if needed.
        
        
                    - 'available_ages_of_the_deceased': Give all ages in comma separated if available, otherwise null. Include only ages, no names of the deceased.
        
                    Use null for any missing information. Be as accurate as possible based on the text provided and use your intelligence.
                    """

                prompt_user_confirm = "Please confirm extracting accident data into JSON format as per the instructions."

                prompt_assistant_confirm = "Confirmed. Each accident report will be structured into a separate JSON object as per the guidelines."

                prompt_user_request = f"""
                  Please process the following road accident article and provide the extracted data in JSON format. Each accident should be represented as a separate JSON object with these keys: {', '.join(standard_headers_snake_case)}.
                  Use the provided article publishing datetime (bangladeshi time): {accident_datetime_from_url}, title: {article_title}, and text: {article_text} to fill in the necessary fields accurately.
                  """
                try:
                    # Call to GPT-4 model
                    response = openai.chat.completions.create(
                        model="gpt-4-1106-preview",
                        messages=[
                            {"role": "system", "content": prompt_system},
                            {"role": "user", "content": prompt_user_confirm},
                            {"role": "assistant", "content": prompt_assistant_confirm},
                            {"role": "user", "content": prompt_user_request},
                        ],
                    )

                    json_response_content = response.choices[0].message.content
                    contents.append(json_response_content)
                    json_response_list = [json_response_content]
                    structured_data = self.process_json_response_to_df(
                        json_response_list,
                        accident_datetime_from_url,
                        url,
                        accident_id_number_url,
                        article_text,
                        source,
                        article_title,
                    )

                    if not structured_data.empty:
                        processed_dataframes.append(structured_data)
                except openai.APIError as e:
                    # Handle API error here, e.g. retry or log
                    print(f"OpenAI API returned an API Error: {e}")

                # Increment the run counter
                run_counter += 1

                # Check if it's time to save
                if run_counter % save_interval == 0:
                    # Concatenate the processed dataframes
                    # intermediate_df = pd.concat(processed_dataframes, ignore_index=True)
                    # processed_dataframes2 = [standardize_headers(df) for df in processed_dataframes]
                    processed_dataframes2 = [
                        self.standardize_column_names(df, template_df)
                        for df in processed_dataframes
                    ]

                    # Now concatenate the DataFrames
                    # if previous dataframe or csv is available then only concat the new one with the existing
                    inter_dataframe = pd.concat(
                        processed_dataframes2, ignore_index=True
                    )
                    # Save to file
                    # inter_dataframe.to_csv(
                    #     '/content/drive/MyDrive/road_accident_tracker/new update data all 2020_23/alldata_vdec30_23_intermediate.csv',
                    #     index=False)
                    print(f"Saved progress at index {index}")

                # if run_counter==2:
                #    break

            # After the loop, save any remaining data
            # processed_dataframes2 = [standardize_headers(df) for df in processed_dataframes]
            processed_dataframes2 = [
                self.standardize_column_names(df, template_df)
                for df in processed_dataframes
            ]

            final_dataframe = pd.concat(processed_dataframes2, ignore_index=True)
            # final_dataframe.to_csv(
            #     '/content/drive/MyDrive/road_accident_tracker/new update data all 2020_23/alldata_vdec30_23.csv',
            #     index=False)
            print("Final save complete.")

            # Sort and reset index
            final_dataframe["accident_datetime_from_url"] = pd.to_datetime(
                final_dataframe["accident_datetime_from_url"], errors="coerce"
            )

            final_dataframe.sort_values(
                by="accident_datetime_from_url", ascending=True, inplace=True
            )
            final_dataframe.reset_index(drop=True, inplace=True)
            # final_dataframe

            # Save the re-organized df_new_main to a new CSV file
            # final_dataframe.to_csv('/content/drive/MyDrive/road_accident_tracker/new update data all 2020_23/Final_data_2020_23alldata_v7_ALLLL_googlealerts_main_organized.csv', index=False)

            # final_combined_df = pd.concat([existing_df, final_dataframe], ignore_index=True)
            # final_combined_df.sort_values(by='accident_datetime_from_url', ascending=True, inplace=True)

            # final_combined_df.to_csv('/content/drive/MyDrive/road_accident_tracker/new update data all 2020_23/Final_data_v7_ALLLL_googlealertsNEWAGEBD_dailystar.csv', index=False)
            # final_combined_df

        else:
            print("No new data to process.")

        # final_combined_df.to_csv('/content/drive/MyDrive/road_accident_tracker/new update data all 2020_23/Final_data_v7_ALLLL_googlealertsNEWAGEBD_dailystar.csv', index=False)
        # final_combined_df

        # final_dataframe.to_csv('/content/drive/MyDrive/road_accident_tracker/new update data all 2020_23/alldata_vdec30_23.csv', index=False)
        print("Final save complete.")
        return final_dataframe

    @staticmethod
    def to_snake_case(name):
        # Replace special characters and spaces with underscore
        name = re.sub(r"[\s()?]", "_", name)
        # Convert CamelCase to snake_case
        name = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", name)
        name = re.sub("([a-z0-9])([A-Z])", r"\1_\2", name).lower()
        # Remove any double underscores
        name = re.sub("__+", "_", name)
        # Remove trailing underscores
        name = name.rstrip("_")
        return name

    @staticmethod
    def standardize_column_names(df, template_df, similarity_threshold=0.9):
        standardized_columns = {}

        for col in df.columns:
            # Find the closest match from the template column names
            matches = difflib.get_close_matches(
                col, template_df.columns, n=1, cutoff=similarity_threshold
            )
            if matches:
                # If a close match is found, use it
                standardized_columns[col] = matches[0]
            else:
                # If no close match is found, keep the original name
                standardized_columns[col] = col

        # Rename columns in the DataFrame
        df = df.rename(columns=standardized_columns)

        # Ensure all columns in the template exist in df, fill with NaN if not
        for col in template_df.columns:
            if col not in df.columns:
                df[col] = np.nan

        # Reorder columns to match the template and drop any extra columns
        df = df[template_df.columns]

        return df

    # Step 2: Function to find the closest match for each header.
    @staticmethod
    def find_closest_header(header, standard_headers):
        # This will find the closest match in standard_headers to the header provided.
        closest_matches = difflib.get_close_matches(header, standard_headers)
        return closest_matches[0] if closest_matches else None

    @staticmethod
    def process_json_response_to_df(
        json_responses,
        accident_datetime,
        url,
        accident_id_number_url,
        article_text,
        source,
        article_title,
    ):
        all_accident_data = []

        # Define the expected columns
        expected_columns = [
            "news_category",
            "id",
            "number_of_accidents_occured",
            "is_the_accident_data_yearly_monthly_or_daily",
            "day_of_the_week_of_the_accident",
            "exact_location_of_accident",
            "area_of_accident",
            "division_of_accident",
            "district_of_accident",
            "subdistrict_or_upazila_of_accident",
            "is_place_of_accident_highway_or_expressway_or_water_or_others",
            "is_country_bangladesh_or_other_country",
            "is_type_of_accident_road_accident_or_train_accident_or_waterways_accident_or_plane_accident",
            "total_number_of_people_killed",
            "total_number_of_people_injured",
            "is_reason_or_cause_for_the_accident_ploughed_or_ram_or_hit_or_collision_or_breakfail_or_others",
            "primary_vehicle_involved",
            "secondary_vehicle_involved",
            "tertiary_vehicle_involved",
            "any_more_vehicles_involved",
            "available_ages_of_the_deceased",
            "accident_datetime_from_url",
            "url",
            "source",
            "accident_id_number_url",
            "contents_whole_gpt_response",
            "articles_text_from_url",
            "article_title",
        ]

        # Process each JSON response
        for json_content in json_responses:
            try:
                # Remove any preceding text before JSON blocks (e.g., "1.", "2.", etc.)
                json_blocks = re.split(r"\n\d+\.\s", json_content)

                for block in json_blocks:
                    # Search for the start of the JSON block
                    json_start_index = block.find("```json\n")
                    if json_start_index != -1:
                        # Extract the JSON string starting from the found index
                        json_data = block[json_start_index + len("```json\n") :].split(
                            "\n```"
                        )[0]

                        # Parse the JSON string
                        accident_data = json.loads(json_data)

                        # Validate the type of parsed data
                        if not isinstance(accident_data, (list, dict)):
                            continue

                        # Check if the parsed data is a list of accidents or a single accident
                        if isinstance(accident_data, list):
                            for data in accident_data:
                                if isinstance(data, dict):
                                    full_data = {
                                        col: data.get(col, np.nan)
                                        for col in expected_columns
                                    }
                                    all_accident_data.append(full_data)
                        elif isinstance(accident_data, dict):
                            full_data = {
                                col: accident_data.get(col, np.nan)
                                for col in expected_columns
                            }
                            all_accident_data.append(full_data)

            except json.JSONDecodeError:
                # Skip invalid JSON strings
                continue

        # Create DataFrame from the list of accidents
        if all_accident_data:
            df = pd.DataFrame(all_accident_data)

            # Add additional information to each row in the DataFrame
            df["accident_datetime_from_url"] = accident_datetime
            df["url"] = url
            df["source"] = source
            df["accident_id_number_url"] = accident_id_number_url
            df["contents_whole_gpt_response"] = json.dumps(all_accident_data)
            df["articles_text_from_url"] = article_text
            df["article_title"] = article_title

        else:
            # Create an empty DataFrame with the expected columns if no valid JSON data is found
            df = pd.DataFrame(columns=expected_columns)

        return df
