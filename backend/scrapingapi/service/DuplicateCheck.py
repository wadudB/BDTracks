import pandas as pd
import copy


class DuplicateCheck:
    TRUE = 1
    FALSE = 0

    def duplicate_data_check(self, final_dataframe, existing_urls):
        try:
            existing_df = pd.DataFrame(existing_urls)

            main_df = copy.deepcopy(final_dataframe)

            if main_df["accident_datetime_from_url"].isna().any():
                print("There are NaN values in the 'accident_datetime_from_url'.")

            # Convert the 'accident_datetime_from_url' to datetime and extract the date
            try:
                main_df["accident_date"] = pd.to_datetime(
                    main_df["accident_datetime_from_url"],
                    errors="coerce",  # Handle conversion errors by setting unparseable dates to NaT
                ).dt.date
            except Exception as e:
                print(f"Conversion to datetime failed: {e}")
                raise

            replacements = {
                "Chittagong": "Chattogram",
                "Jhalokati": "Jhalokathi",
                "Jhalkati": "Jhalokathi",
                "Jhalkathi": "Jhalokathi",
                "Chapainababganj": "Chapainawabganj",
                "Netrakona": "Netrokona",
                "Joipurhat": "Joypurhat",
                "Jaipurhat": "Joypurhat",
                "Shambhuganj": "Shambhugonj",
                "Laxmipur": "Lakshmipur",
                "Bagura": "Bogura",
                "Bogra": "Bogura",
                "Jessore": "Jashore",
                "Barisal": "Barishal",
                "Dagonbhuiya": "Daganbhuiyan",
                "Upazila": "",
                " Bazar": "",
                " bazar": "",
                "upazila": "",
                "Upazilla": "",
                "area": "",
                "Comilla": "Cumilla",
                r"Coxs\s*Bazar": "Cox's Bazar",  # Regex pattern to match 'Coxs Bazar' with optional characters
            }

            # Columns to apply the replacements
            columns_to_update = [
                "exact_location_of_accident",
                "area_of_accident",
                "division_of_accident",
                "district_of_accident",
                "subdistrict_or_upazila_of_accident",
            ]
            # Apply the replacements to each column
            for col in columns_to_update:
                main_df[col] = main_df[col].replace(replacements, regex=True)

            # Use the function to check the new batch of data
            final_dataframe_checked = self.check_new_entries_for_duplicates(main_df, existing_df)

            print("Final save complete for  duplicate")
            return final_dataframe_checked

        except Exception as e:
            # This block will execute if any error occurs in the try block
            print(f"An error occurred in duplicate processing: {e}")
            raise

        finally:
            if "e" in locals() or "e" in globals():
                print("Execution completed with errors.")
            else:
                print("Execution completed successfully.")

    @staticmethod
    def is_day_of_week_match(row_day, compare_row_day):
        # If either value is NaN (or None) or an empty string, consider it a match
        if (
            pd.isnull(row_day)
            or pd.isnull(compare_row_day)
            or row_day == ""
            or compare_row_day == ""
        ):
            return True
        # If neither is NaN nor None, compare them directly
        return row_day == compare_row_day

    def is_duplicate(self, row, compare_row):
        # Check for division, district, and total killed
        must_match = (
            row["division_of_accident"] == compare_row["division_of_accident"]
            and row["district_of_accident"] == compare_row["district_of_accident"]
            and row["accident_type"] == compare_row["accident_type"]
            and row["total_number_of_people_killed"] == compare_row["total_number_of_people_killed"]
        )
        # print('must_match',must_match)
        # Check if day of the week is given and matches

        day_of_week_match = self.is_day_of_week_match(
            row["day_of_the_week_of_the_accident"],
            compare_row["day_of_the_week_of_the_accident"],
        )

        # Check flexible vehicle involvement
        vehicle_match = row["primary_vehicle_involved"] in [
            compare_row["primary_vehicle_involved"],
            compare_row["secondary_vehicle_involved"],
        ] or row["secondary_vehicle_involved"] in [
            compare_row["primary_vehicle_involved"],
            compare_row["secondary_vehicle_involved"],
        ]
        # print('vehicle_match',vehicle_match)

        # Location matching logic: checks if any part of the location matches across the columns
        location_criteria_satisfied = sum(
            any(part in compare_row[loc_col] for part in row[loc_col].split())
            or any(part in row[loc_col] for part in compare_row[loc_col].split())
            for loc_col in [
                "exact_location_of_accident",
                "area_of_accident",
                "subdistrict_or_upazila_of_accident",
            ]
            if pd.notnull(row[loc_col]) and pd.notnull(compare_row[loc_col])
        )
        # print('location_criteria_satisfied',location_criteria_satisfied)
        if location_criteria_satisfied > 0:
            location_criteria_satisfied = location_criteria_satisfied + 1

        # print('location_criteria_satisfied2',location_criteria_satisfied)
        # Check for additional criteria matches
        additional_criteria_match = location_criteria_satisfied
        if row["secondary_vehicle_involved"] in [
            compare_row["primary_vehicle_involved"],
            compare_row["secondary_vehicle_involved"],
        ]:
            additional_criteria_match += 1
        if row["total_number_of_people_injured"] == compare_row["total_number_of_people_injured"]:
            additional_criteria_match += 1
        # print("additional_criteria_match", additional_criteria_match)
        # At least two matches are needed from location and additional columns
        return must_match and vehicle_match and additional_criteria_match >= 2

    def check_new_entries_for_duplicates(self, new_entries, existing_df):
        # Convert dates to datetime in new entries for comparison
        new_entries["accident_date"] = pd.to_datetime(new_entries["accident_date"])
        # Prepare a column for marking duplicates
        new_entries["duplicate_check"] = DuplicateCheck.FALSE

        # Concatenate existing_df and new_entries
        df = pd.concat([existing_df, new_entries], ignore_index=True)

        # Store the length of existing_df to identify t
        existingdf_length = len(existing_df)

        for idx, row in df.iloc[existingdf_length:].iterrows():
            # Find the indices of rows where the date is the sa
            potential_duplicates = df[
                (df["accident_date"] == row["accident_date"])
                | (df["accident_date"] == row["accident_date"] + pd.Timedelta(days=1))
                | (df["accident_date"] == row["accident_date"] - pd.Timedelta(days=1))
            ].index

            # Check against the filtered potential duplicates
            for jdx in potential_duplicates:
                # Skip checking the row with itself
                if jdx == idx:
                    continue

                compare_row = df.loc[jdx]
                if self.is_duplicate(row, compare_row):
                    df.at[idx, "duplicate_check"] = DuplicateCheck.TRUE
                    break  # Once a duplicate is found, no need to check further

        # Return only the new entries portion with updated duplicate status
        return df.iloc[existingdf_length:].reset_index(drop=True)
