# Project Name

## Overview
This project is a full-stack application built using React for the frontend, Node.js for the backend, and Flask for handling AI-powered queries using LangChain and Google Generative AI.

## Tech Stack
- **Frontend**: React (Created using Create React App)
- **Backend**: Node.js, Flask
- **AI Integration**: LangChain, Google Generative AI, Gemini API
- **Debugging**: ChatGPT

## Project Structure
```
fsd/
├── src/
│   ├── App.js
│   ├── QueryForm.js
│   ├── QueryForm.css
├── server.js
├── server.py

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js
- Python 3.x
- pip (Python package manager)

### Setup

#### 1. Clone the repository
```sh
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

#### 2. Install frontend dependencies
```sh
cd fsd
npm install
```

#### 3. Install backend dependencies
Navigate to the Flask server directory and install the required Python modules.
```sh
pip install flask langchain langchain_google_genai
```

## Usage

### Running the Backend
```sh
python server.py
```
This will start the Flask server.

### Running the Node.js Server
```sh
node server.js
```
### Running the Frontend
```sh
npm start
```
This will start the React development server.

## Query Processing
1. The user inputs a query in natural language through the frontend.
2. The query is sent to the backend, where it is processed using the **Gemini API**.
3. The Gemini API converts the natural language query into an **SQL query**.
4. The generated SQL query is executed on the database.
5. The results are formatted into a table and sent back to the frontend for display.

## API Integration
The backend uses LangChain, Google Generative AI, and Gemini API to process user queries dynamically.

## Note
In server.py, in place of [API_KEY], please replace it with your own Gemini API Key

## Contributing
Feel free to submit pull requests or open issues for suggestions and improvements.

## License
This project is licensed under the MIT License.

