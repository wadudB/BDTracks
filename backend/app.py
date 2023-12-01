from flask import Flask, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database configuration
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "bdtracks",
}


@app.route("/data", methods=["GET"])
def get_data():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    # Your specific SQL query
    query = """
    SELECT 
        `total_number_of_people_killed`,
        `total_number_of_people_injured`,
        `reason_or_cause_for_accident`,
        `accident_datetime_from_url`,
        `exact_location_of_accident`,
        `district_of_accident`,
        `accident_type`,
        `primary_vehicle_involved`,
        `secondary_vehicle_involved`,
        `tertiary_vehicle_involved`
    FROM `bangladesh_daily_accidents_2023` 
    # WHERE `is_country_bangladesh_or_other_country` = "Bangladesh" 
    # AND `is_the_accident_data_yearly_monthly_or_daily` = "daily"
    ORDER BY `accident_datetime_from_url` DESC;
    """

    # LIMIT 2000;
    cursor.execute(query)
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    # print((rows))
    return jsonify(rows)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
