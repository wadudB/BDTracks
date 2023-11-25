
# BDTracks



## Getting Started

These instructions will get your copy of the project up and running on your local machine for development and testing purposes.





## Prerequisites

What things you need to install the software and how to install them:
- Python 3.7 or higher
- Node.js 20 or higher
- npm (usually comes with Node.js)


## Installation

A step-by-step series of examples that tell you how to get a development environment running.

#### Setting up the Backend
Navigate to the backend directory:
```bash
  cd backend
```
Create a Python virtual environment and activate it:
 - #### Windows:
    ```bash
      python -m venv venv
      venv\Scripts\activate
    ```
Install the required Python packages:
```bash
  pip install Flask
```
#### Setting up the Frontend
Navigate to the frontend directory:
```bash
  cd frontend
```
Install the necessary npm packages:
```bash
  npm install
```
## Run Locally

To run the application, you need to start both the frontend and backend servers.

#### Start the Flask Backend:

 - #### Navigate to the backend directory and run:
    ```bash
    python app.py
    ```
#### Start the React Frontend:
 - #### Open a new terminal, navigate to the frontend directory, and run:
    ```bash
    python app.py
    ```
The React application will be available at http://localhost:3000, and the Flask backend at http://localhost:5000.

## Built With

**React.js:** The web framework used for the frontend

**Vite:** Frontend build tool

**Flask:** Backend framework


