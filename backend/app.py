from flask import Flask, jsonify, request, current_app
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS
import jwt
import datetime
from werkzeug.security import check_password_hash
import hashlib

app = Flask(__name__)
app.config["SECRET_KEY"] = "n1[S(Jc]G]}36$A|[PRv1XtMk~b-(uWG"
CORS(app)

# Database configuration
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "bdtracks_accidents",
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
                can.votes as Votes,
                p.party_id,
                p.alliance,
                p.party as PartyName,
                p.symbol as Party,
                p.color
            FROM 
                constituencies c
            INNER JOIN 
                candidates can ON c.id = can.constituency_id
            INNER JOIN 
                parties p ON can.party_id = p.party_id
            ORDER BY 
                c.id, can.votes DESC;
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
    candidate_id = data.get("candidateId")
    user_agent = request.headers.get("User-Agent")
    user_ip = request.remote_addr  # Gets the IP address

    # Create a unique string and hash it
    unique_string = f"{user_ip}-{user_agent}"
    vote_hash = hashlib.sha256(unique_string.encode()).hexdigest()

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    # Check if hash already exists
    cursor.execute("SELECT * FROM votes WHERE vote_hash = %s", (vote_hash,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return (
            jsonify(
                {
                    "message": "Vote already recorded. Only one vote per user is permitted."
                }
            ),
            403,
        )

    # Continue with voting logic if no duplicate found
    cursor.execute("SELECT * FROM candidates WHERE id = %s", (candidate_id,))
    candidate = cursor.fetchone()

    if candidate:
        new_votes = candidate["votes"] + 1
        cursor.execute(
            "UPDATE candidates SET votes = %s WHERE id = %s",
            (new_votes, candidate_id),
        )
        # Insert vote hash to track
        cursor.execute("INSERT INTO votes (vote_hash) VALUES (%s)", (vote_hash,))
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


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Please provide both username and password"}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and check_password_hash(user["password_hash"], password):
        token = jwt.encode(
            {
                "username": user["username"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
            },
            app.config["SECRET_KEY"],
            algorithm="HS256",
        )

        return jsonify({"token": token}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401


@app.route("/parties", methods=["GET"])
def get_parties():
    try:
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)

            # SQL query
            query = """
            SELECT * FROM `parties`;
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


@app.route("/constituencies", methods=["GET"])
def get_constituencies():
    try:
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)

            # SQL query
            query = """
            SELECT * FROM `constituencies`;
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


@app.route("/add-candidate", methods=["POST"])
def add_candidate():
    data = request.json
    name = data["name"]
    party_id = data["party_id"]
    constituency_id = data["constituency_id"]

    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            cursor = connection.cursor()
            query = """
            INSERT INTO candidates (name, party_id, constituency_id)
            VALUES (%s, %s, %s)
            """
            values = (name, party_id, constituency_id)

            cursor.execute(query, values)
            connection.commit()

            return jsonify({"message": "Candidate added successfully!"}), 201

    except Error as e:
        print("Error while connecting to MySQL", e)
        return jsonify({"message": "Failed to add candidate"}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

    return jsonify({"message": "Unknown error occurred"}), 500


@app.route("/candidates/<int:candidate_id>", methods=["DELETE"])
def delete_candidate(candidate_id):
    try:
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            cursor = conn.cursor()
            # Check if candidate exists
            cursor.execute("SELECT * FROM candidates WHERE id = %s", (candidate_id,))
            candidate = cursor.fetchone()
            if candidate:
                # SQL statement to delete a candidate
                delete_query = "DELETE FROM candidates WHERE id = %s"
                cursor.execute(delete_query, (candidate_id,))
                conn.commit()
                return jsonify({"message": "Candidate deleted successfully"}), 200
            else:
                return jsonify({"message": "Candidate not found"}), 404

    except Error as e:
        current_app.logger.error(f"Database error: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


@app.route("/candidates/<int:candidate_id>", methods=["PUT"])
def update_candidate(candidate_id):
    data = request.get_json()

    try:
        # Establish a database connection
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            cursor = conn.cursor()

        # SQL query to update candidate's information
        update_query = """
        UPDATE candidates 
        SET name=%s, party_id=%s, constituency_id=%s, votes=%s
        WHERE id=%s
        """

        # Values to update in the candidates table
        candidate_data = (
            data["name"],
            data["party_id"],
            data["constituency_id"],
            data["votes"],
            candidate_id,
        )

        # Execute the update operation
        cursor.execute(update_query, candidate_data)
        conn.commit()

        # Close the cursor and the connection
        cursor.close()
        conn.close()

        # Return a success response
        return (
            jsonify({"status": "success", "message": "Candidate updated successfully"}),
            200,
        )

    except mysql.connector.Error as err:
        # Handle errors and return an error response
        return jsonify({"status": "fail", "message": str(err)}), 500


@app.route("/add-party", methods=["POST"])
def add_party():
    data = request.json
    alliance = data["alliance"]
    party = data["party"]
    symbol = data["symbol"]
    color = data["color"]
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            cursor = connection.cursor()
            query = """
            INSERT INTO parties (alliance, party, symbol, color)
            VALUES (%s, %s, %s, %s)
            """
            values = (alliance, party, symbol, color)

            cursor.execute(query, values)
            connection.commit()

            return jsonify({"message": "Party added successfully!"}), 201

    except Error as e:
        print("Error while connecting to MySQL", e)
        return jsonify({"message": "Failed to add Party"}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

    return jsonify({"message": "Unknown error occurred"}), 500


@app.route("/parties/<int:party_id>", methods=["DELETE"])
def delete_party(party_id):
    try:
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            cursor = conn.cursor()
            # Check if party exists
            cursor.execute("SELECT * FROM parties WHERE party_id = %s", (party_id,))
            party = cursor.fetchone()
            if party:
                # SQL statement to delete a party
                delete_query = "DELETE FROM parties WHERE party_id = %s"
                cursor.execute(delete_query, (party_id,))
                conn.commit()
                return jsonify({"message": "Party deleted successfully"}), 200
            else:
                return jsonify({"message": "Party not found"}), 404

    except Error as e:
        current_app.logger.error(f"Database error: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


@app.route("/parties/<int:party_id>", methods=["PUT"])
def update_party(party_id):
    data = request.get_json()

    try:
        # Establish a database connection
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            cursor = conn.cursor()

        # SQL query to update candidate's information
        update_query = """
        UPDATE parties 
        SET alliance=%s, party=%s, symbol=%s, color=%s
        WHERE party_id=%s
        """

        # Values to update in the parties table
        party_data = (
            data["alliance"],
            data["party"],
            data["symbol"],
            data["color"],
            party_id,
        )

        # Execute the update operation
        cursor.execute(update_query, party_data)
        conn.commit()

        # Close the cursor and the connection
        cursor.close()
        conn.close()

        # Return a success response
        return (
            jsonify({"status": "success", "message": "Party updated successfully"}),
            200,
        )

    except mysql.connector.Error as err:
        # Handle errors and return an error response
        return jsonify({"status": "fail", "message": str(err)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
