import mysql.connector
from mysql.connector import Error
from datetime import datetime, timedelta
import collections
import json
from flask import jsonify


class CalculateSummary:
    def get_summary(self, db_config):
        # Fetching data
        data = self.get_data(db_config)

        # Current date and date 30 days ago
        current_date = datetime.now()
        thirty_days_ago = current_date - timedelta(days=30)

        # Initialize dictionaries to store the totals
        daily_totals_last_30_days = collections.defaultdict(float)
        monthly_totals = collections.defaultdict(float)
        yearly_totals = collections.defaultdict(float)
        vehicle_accident_count = collections.defaultdict(int)
        yearly_vehicle_accident_count = collections.defaultdict(
            lambda: collections.Counter()
        )

        # Initialize dictionaries to store the totals for injured
        daily_injured_totals_last_30_days = collections.defaultdict(float)
        monthly_injured_totals = collections.defaultdict(float)
        yearly_injured_totals = collections.defaultdict(float)
        yearly_accident_totals = collections.defaultdict(float)
        yearly_location_counts = collections.defaultdict(lambda: collections.Counter())
        yearly_accidents_by_district = collections.defaultdict(
            lambda: collections.defaultdict(int)
        )

        # yearly_killed_by_district = collections.defaultdict(
        #     lambda: collections.defaultdict(float)
        # )
        # yearly_injured_by_district = collections.defaultdict(
        #     lambda: collections.defaultdict(float)
        # )

        for entry in data:
            # Extract the datetime of the accident
            accident_date = entry["accident_datetime_from_url"]
            year = accident_date.year
            month = accident_date.month
            day = accident_date.day

            # Convert accidents count to float
            accident_count = entry["number_of_accidents_occured"]
            if accident_count and accident_count.lower() != "unknown":
                accident = float(accident_count)
            else:
                # Handle unknown case here
                accident = 0.0

            # Convert killed count to float
            killed_count = entry["total_number_of_people_killed"]
            if killed_count and killed_count.lower() != "unknown":
                killed = float(killed_count)
            else:
                # Handle unknown case
                killed = 0.0

            # Convert injured count to float
            injured_count = entry["total_number_of_people_injured"]
            if injured_count and injured_count.lower() != "unknown":
                injured = float(injured_count)
            else:
                # Handle unknown case
                injured = 0.0

            vehicles = [
                entry["primary_vehicle_involved"],
                entry["secondary_vehicle_involved"],
                entry["tertiary_vehicle_involved"],
            ], entry["any_more_vehicles_involved"]

            # Check if the accident date is in the last 30 days of its year
            if accident_date.year == current_date.year:
                # For the current year, consider the last 30 days from today
                if accident_date >= thirty_days_ago:
                    daily_key = accident_date.strftime("%Y-%m-%d")
                    daily_totals_last_30_days[daily_key] += killed
            else:
                # For previous years, check if it's within the last 30 days of the year
                if self.is_last_30_days_of_year(accident_date):
                    daily_key = accident_date.strftime("%Y-%m-%d")
                    daily_totals_last_30_days[daily_key] += killed

            # Check if the accident date is in the last 30 days of its year
            if accident_date.year == current_date.year:
                if accident_date >= thirty_days_ago:
                    daily_injured_key = accident_date.strftime("%Y-%m-%d")
                    daily_injured_totals_last_30_days[daily_injured_key] += injured
            else:
                if self.is_last_30_days_of_year(accident_date):
                    daily_injured_key = accident_date.strftime("%Y-%m-%d")
                    daily_injured_totals_last_30_days[daily_injured_key] += injured

            # Aggregate the data for monthly and yearly totals
            yearly_accident_key = year
            yearly_accident_totals[yearly_accident_key] += accident

            monthly_key = (year, month)
            monthly_totals[monthly_key] += killed

            yearly_key = year
            yearly_totals[yearly_key] += killed

            monthly_injured_key = (year, month)
            monthly_injured_totals[monthly_injured_key] += injured

            yearly_injured_key = year
            yearly_injured_totals[yearly_injured_key] += injured

            district = entry["district_of_accident"]
            if district:
                yearly_location_counts[year][district] += 1

            # year = entry['accident_datetime_from_url'].year

            district_year = entry["accident_datetime_from_url"].year
            district_accident = entry["district_of_accident"]
            if district_accident and "cox" in district_accident.lower():
                district_accident = "Cox's Bazar"
            elif district_accident and "cumilla" in district_accident.lower():
                district_accident = "Comilla"
            if district_accident:
                # Assuming 1 accident per entry; adjust logic as needed
                yearly_accidents_by_district[district_year][district_accident] += 1

            for vehicle in vehicles:
                if vehicle and vehicle != "None":
                    # Check if vehicle is a list and iterate through it, otherwise just add the vehicle
                    if isinstance(vehicle, list):
                        for v in vehicle:
                            if v and v != "None":
                                yearly_vehicle_accident_count[year][v] += 1
                    else:
                        yearly_vehicle_accident_count[year][vehicle] += 1

            # yearly_killed_by_district[year][district] += killed
            # yearly_injured_by_district[year][district] += injured

            # for year, districts in yearly_killed_by_district.items():
            #     for district, killed in districts.items():
            #         # Serialize the district's killed and injured counts
            #         killed_json = json.dumps(yearly_killed_by_district[year][district])
            #         injured_json = json.dumps(
            #             yearly_injured_by_district[year][district]
            #         )

        # print("Yearly Vehicle Accident Counts:", dict(yearly_vehicle_accident_count))
        # print(
        #     "Final yearly killed by district:",
        #     json.dumps(yearly_killed_by_district, indent=2),
        # )
        # print(
        #     "Final yearly injured by district:",
        #     json.dumps(yearly_injured_by_district, indent=2),
        # )

        # Now find the most frequent accident location for each year
        most_frequent_locations_per_year = {
            year: locations.most_common(1)[0][0] if locations else None
            for year, locations in yearly_location_counts.items()
        }
        # Print the most frequent locations
        print(
            "Most Frequent Accident Locations per Year:",
            most_frequent_locations_per_year,
        )

        # Call the function with your data
        self.upsert_data(
            daily_totals_last_30_days,
            monthly_totals,
            yearly_totals,
            daily_injured_totals_last_30_days,
            monthly_injured_totals,
            yearly_injured_totals,
            yearly_accident_totals,
            most_frequent_locations_per_year,
            yearly_vehicle_accident_count,
            yearly_accidents_by_district,
            db_config,
        )

    @staticmethod
    def get_data(db_config):
        conn = None
        cursor = None
        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor(dictionary=True)

            query = """
            SELECT
                `number_of_accidents_occured`,
                `total_number_of_people_killed`,
                `total_number_of_people_injured`,
                `district_of_accident`,
                `accident_datetime_from_url`,
                `primary_vehicle_involved`,
                `secondary_vehicle_involved`,
                `tertiary_vehicle_involved`,
                `any_more_vehicles_involved`
            FROM `all_accidents_data` 
            WHERE `is_country_bangladesh_or_other_country` = "Bangladesh" 
            AND `is_the_accident_data_yearly_monthly_or_daily` = "daily"
            AND `duplicate_check` = 0
            ORDER BY `accident_datetime_from_url` DESC;
            """

            cursor.execute(query)
            rows = cursor.fetchall()
            return rows

        except Error as e:
            print(f"Error: {e}")
            return []

        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()

    @staticmethod
    def is_last_30_days_of_year(date):
        """Check if the date is within the last 30 days of the year."""
        year_end = datetime(date.year, 12, 31)
        return (year_end - date).days < 30

    @staticmethod
    def upsert_data(
        daily_totals,
        monthly_totals,
        yearly_totals,
        daily_injured_totals,
        monthly_injured_totals,
        yearly_injured_totals,
        yearly_accident_totals,
        most_frequent_locations_per_year,
        yearly_vehicle_accident_count,
        yearly_accidents_by_district,
        db_config,
    ):
        conn = None
        cursor = None
        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()

            for year, total_killed in yearly_totals.items():
                # Prepare the daily deaths JSON, filtering entries by year and converting dates to strings
                daily_deaths_json = json.dumps(
                    {k: v for k, v in daily_totals.items() if k.startswith(str(year))}
                )
                # Prepare the daily injured JSON
                daily_injured_json = json.dumps(
                    {
                        k: v
                        for k, v in daily_injured_totals.items()
                        if k.startswith(str(year))
                    }
                )
                vehicles_involved_json = json.dumps(yearly_vehicle_accident_count[year])
                # Prepare the monthly deaths JSON
                # Convert the tuple keys to string keys in the format 'YYYY-MM'
                monthly_deaths_json = json.dumps(
                    {
                        f"{k[0]}-{k[1]:02d}": v
                        for k, v in monthly_totals.items()
                        if k[0] == year
                    }
                )

                monthly_injured_json = json.dumps(
                    {
                        f"{k[0]}-{k[1]:02d}": v
                        for k, v in monthly_injured_totals.items()
                        if k[0] == year
                    }
                )

                # New: Serialize district-level killed and injured data
                # killed_by_district_json = json.dumps(
                #     yearly_killed_by_district[year], ensure_ascii=False
                # )
                # injured_by_district_json = json.dumps(
                #     yearly_injured_by_district[year], ensure_ascii=False
                # )

                accidents_by_district_json = json.dumps(
                    yearly_accidents_by_district[year], ensure_ascii=False
                )

                # Upsert the data into the database
                cursor.execute(
                    """
                            INSERT INTO accident_summary_2023 (year, date, total_killed, daily_deaths, 
                            monthly_deaths, total_injured, daily_injured, monthly_injured, last_updated, total_accidents, 
                            accident_hotspot, vehicles_involved, accidents_by_district)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                            ON DUPLICATE KEY UPDATE
                            daily_deaths = VALUES(daily_deaths),
                            monthly_deaths = VALUES(monthly_deaths),
                            total_killed = VALUES(total_killed),
                            daily_injured = VALUES(daily_injured),
                            monthly_injured = VALUES(monthly_injured),
                            total_injured = VALUES(total_injured),
                            last_updated = VALUES(last_updated),
                            total_accidents = VALUES(total_accidents),
                            accident_hotspot = VALUES(accident_hotspot),
                            vehicles_involved = VALUES(vehicles_involved),
                            accidents_by_district = VALUES(accidents_by_district)
                            """,
                    (
                        year,  # year column
                        datetime.now().date(),  # current date for the date column
                        yearly_totals[year],  # total killed for the year
                        daily_deaths_json,  # serialized daily deaths
                        monthly_deaths_json,  # serialized monthly deaths
                        yearly_injured_totals[year],  # total injured for the year
                        daily_injured_json,  # serialized daily injured
                        monthly_injured_json,  # serialized monthly injured
                        datetime.now(),  # current datetime for the last_updated column
                        yearly_accident_totals[year],
                        most_frequent_locations_per_year[year],
                        vehicles_involved_json,
                        accidents_by_district_json,  # Serialized accidents by district
                    ),
                )

            conn.commit()

        except Error as e:
            raise
        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()
