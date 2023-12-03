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
    "database": "bd_tracks",
}


@app.route("/data", methods=["GET"])
def get_data():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    # Your specific SQL query
    query = """
    SELECT * FROM `accident_summary_2023`;
    """

    # LIMIT 2000;
    cursor.execute(query)
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    # print((rows))
    return jsonify(rows)


@app.route("/get_accident_reports", methods=["GET"])
def get_accident_reports():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    # Your specific SQL query
    query = """
    SELECT 
        `accident_datetime_from_url`, 
        `total_number_of_people_injured`, 
        `total_number_of_people_killed`,
        `exact_location_of_accident`,
        `district_of_accident`,`accident_type`
    FROM `all_accidents_data`
    WHERE `is_country_bangladesh_or_other_country` = "Bangladesh"
    And `is_the_accident_data_yearly_monthly_or_daily` = "daily"
    ORDER BY `accident_datetime_from_url` DESC LIMIT 7;
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
