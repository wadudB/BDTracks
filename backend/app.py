from flask import Flask, jsonify, request, current_app
import mysql.connector
from mysql.connector import Error
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
    try:
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)

            # SQL query
            query = """
            SELECT * FROM `accident_summary_2023`;
            """

            cursor.execute(query)
            rows = cursor.fetchall()
            return jsonify(rows)
        else:
            return jsonify({"error": "Database connection failed"}), 500
    except Error as e:
        current_app.logger.error(f"Database error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        if "conn" in locals() and conn.is_connected():
            conn.close()


@app.route("/get_accident_reports", methods=["GET"])
def get_accident_reports():
    try:
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)

            # SQL query
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

            cursor.execute(query)
            rows = cursor.fetchall()
            return jsonify(rows)
        else:
            return jsonify({"error": "Database connection failed"}), 500
    except Error as e:
        current_app.logger.error(f"Database error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        if "conn" in locals() and conn.is_connected():
            conn.close()


@app.route("/commodity-data", methods=["GET"])
def commodity_data():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    # SQL query
    query = """
    SELECT * FROM `commodities`;
    """

    # LIMIT 2000;
    cursor.execute(query)
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(rows)


@app.route("/add-commodity", methods=["POST"])
def add_commodity():
    # Connect to the database
    conn = mysql.connector.connect(**db_config)

    # Check if the connection was successful
    if not conn.is_connected():
        return jsonify({"error": "Database connection failed"}), 500

    # Extract the data from the request
    commodity_name = request.json.get("name")
    commodity_price = request.json.get("price")

    try:
        cursor = conn.cursor()
        # Prepare the insert statement
        insert_statement = """
        INSERT INTO commodities (name, price) VALUES (%s, %s)
        """
        # Execute the insert statement
        cursor.execute(insert_statement, (commodity_name, commodity_price))
        # Commit the changes
        conn.commit()
        # Close the cursor and the connection
        cursor.close()
        conn.close()
        return jsonify({"message": "Commodity added successfully"}), 201
    except Error as e:
        # If an error occurs, roll back any changes and close the connection
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({"error": str(e)}), 500


@app.route("/election_data", methods=["GET"])
def election_data():
    try:
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)

            # SQL query
            query = """
            SELECT 
                c.id as ConstituencyID,
                c.name as ConstituencyName,
                can.id as CandidateId,
                can.name as CandidateName,
                can.party as Party,
                can.votes as Votes
            FROM 
                constituencies c
            INNER JOIN 
                candidates can ON c.id = can.constituency_id
            ORDER BY 
                c.id ;
            """

            cursor.execute(query)
            rows = cursor.fetchall()
            return jsonify(rows)
        else:
            return jsonify({"error": "Database connection failed"}), 500
    except Error as e:
        current_app.logger.error(f"Database error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        if "conn" in locals() and conn.is_connected():
            conn.close()


@app.route("/submit_vote", methods=["POST"])
def submit_vote():
    data = request.get_json()
    candidate_id = data.get("candidateId")  # Changed to candidateId

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM candidates WHERE id = %s", (candidate_id,))
    candidate = cursor.fetchone()

    if candidate:
        new_votes = candidate["votes"] + 1
        cursor.execute(
            "UPDATE candidates SET votes = %s WHERE id = %s",
            (new_votes, candidate_id),  # Changed to update by ID
        )
        conn.commit()
        cursor.close()
        conn.close()
        return (
            jsonify({"message": "Vote recorded successfully", "votes": new_votes}),
            200,
        )
    else:
        cursor.close()
        conn.close()
        return jsonify({"message": "Candidate not found"}), 404


if __name__ == "__main__":
    app.run(debug=True, port=5000)
