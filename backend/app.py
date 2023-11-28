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
        `Total Number of People Killed`,
        `Total Number of People Injured`,
        `Reason_or_cause_for_Accident`,
        `ACCIDENT Datetime_from_url`,
        `Exact Location of Accident`,
        `District of Accident`,
        `Accident_Type` 
    FROM `all_accidents_data` 
    WHERE `Country? (Bangladesh or Other country)` = "Bangladesh" 
    ORDER BY u_id DESC 
    LIMIT 5
    """
    cursor.execute(query)
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    print((rows))
    return jsonify(rows)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
