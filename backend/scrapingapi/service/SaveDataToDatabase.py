import os
import pandas as pd
from flask import jsonify
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

load_dotenv()
# Database connection details - adjust with your XAMPP MySQL settings
user = os.getenv("DB_USER", "default_user")  # 'root' or a default value if not set
password = os.getenv("DB_PASSWORD", "default_password")  # '' or a default value
host = os.getenv("DB_HOST", "localhost")  # 'localhost' or a default value
database = os.getenv("DB_NAME", "default_db")  # 'bdtracks_accidents' or a default value

# Path to your CSV file
csv_file_path = "Final_data_v14.csv"

# Read CSV into a DataFrame
# df = pd.read_csv(csv_file_path)


class SaveDataToDatabase:
    def save_to_database(self, df):
        # df.to_csv("./final.csv", index=False)
        # exit()
        # Rename long column names
        # df.rename(
        #     columns={
        #         "is_type_of_accident_road_accident_or_train_accident_or_waterways_accident_or_plane_accident": "accident_type",
        #         "is_reason_or_cause_for_the_accident_ploughed_or_ram_or_hit_or_collision_or_breakfail_or_others": "reason_or_cause_for_accident"
        #         # Add other long column names here as needed
        #     },
        #     inplace=True,
        # )

        # Parse and convert the datetime column
        # Adjust the format string according to your CSV's datetime format
        # df['accident_datetime_from_url'] = pd.to_datetime(df['accident_datetime_from_url'], format='%m/%d/%Y %H:%M')
        # Format it to MySQL's datetime format
        # df['accident_datetime_from_url'] = df['accident_datetime_from_url'].dt.strftime('%Y-%m-%d %H:%M:%S')

        # Create a SQLAlchemy engine for MySQL connection
        engine = create_engine(
            f"mysql+mysqlconnector://{user}:{password}@{host}/{database}", echo=False
        )

        try:
            # Connect to the database
            with engine.connect() as connection:
                # Begin a transaction
                with connection.begin() as transaction:
                    try:
                        # Check existing table structure
                        inspector = inspect(connection)
                        columns = inspector.get_columns("all_accidents_data")
                        existing_column_names = [column["name"] for column in columns]

                        # Alter table to add new columns if they don't exist
                        for column in df.columns:
                            if column not in existing_column_names:
                                query = f"ALTER TABLE all_accidents_data ADD COLUMN {column} TEXT"
                                # connection.execute(f'ALTER TABLE all_accidents_data_2023 ADD COLUMN {column} TEXT')
                                connection.execute(text(query))

                        # Define chunk size for batch insertion
                        chunksize = 50  # Adjust this size as needed

                        # Insert data in chunks
                        df.to_sql(
                            name="all_accidents_data",
                            con=connection,
                            if_exists="append",
                            index=False,
                            chunksize=chunksize,
                        )

                        # Commit the transaction
                        transaction.commit()

                    except Exception as e:
                        print(f"An error occurred while saving: {e}")
                        # Rollback the transaction in case of error
                        transaction.rollback()
                        raise

            return (
                jsonify({"message": "Data successfully imported into MySQL database"}),
                201,
            )

        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            return e
