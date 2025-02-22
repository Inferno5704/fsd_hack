import json
import os
from flask import Flask, request, jsonify
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI

# Initialize Flask app
app = Flask(__name__)

# Set API Key (Avoid exposing keys in production)
os.environ["GOOGLE_API_KEY"] = "AIzaSyBGMf8hEEfdWqeMgK98GD2_xQrlwcrJ8-k"

# Initialize LangChain LLM
llm = ChatGoogleGenerativeAI(model="gemini-pro")

# Prompt Template
prompt = PromptTemplate(
    input_variables=["query", "schema"],
    template="""
    Given the user query: "{query}"
    And the database schema: {schema}
    Identify and return the most relevant tables in JSON format.
    And return the SQL query to answer the {query}.
    """,
)

# LangChain LLM chain
chain = LLMChain(llm=llm, prompt=prompt)

def extract_schema(schema_data):
    """Extracts and validates the schema, ensuring it's a list of tables."""
    if isinstance(schema_data, dict):  # Case where schema is inside a key
        if "Schema" in schema_data:
            schema_data = schema_data["Schema"]
        elif "schema" in schema_data:
            schema_data = schema_data["schema"]
        else:
            raise ValueError("Invalid schema format: Missing 'Schema' key")
    
    if not isinstance(schema_data, list):
        raise ValueError("Schema must be a list of objects")

    if not all(isinstance(table, dict) for table in schema_data):
        raise ValueError("Schema must contain only objects")

    return schema_data  # Return the cleaned list of tables

def get_relevant_tables(nl_query, json_schema):
    response = chain.run({"query": nl_query, "schema": json.dumps(json_schema)})
    print("LLM Response:", response)  # Debugging
    return {"response": response}  # Return as a JSON-compatible dictionary

@app.route("/generatesql", methods=["POST"])
def generate_sql():
    try:
        # Debugging: Print raw request data
        print("Raw request data:", request.data.decode("utf-8"))
        
        # Force Flask to parse JSON correctly
        data = request.get_json(force=True)
        print("Parsed JSON:", json.dumps(data, indent=2))  # Debugging
        
        if not data:
            return jsonify({"error": "Invalid JSON format"}), 400

        nl_query = data.get("query")
        json_schema = data.get("schema")

        if not nl_query or not json_schema:
            return jsonify({"error": "Missing query or schema"}), 400

        try:
            json_schema = extract_schema(json_schema)  # Extract and validate schema
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        
        # Call your processing function
        response = get_relevant_tables(nl_query, json_schema)
        print("Generated SQL Response:", response)
        return jsonify(response)  # Ensure JSON response format
    except Exception as e:
        print("Error:", str(e))  # Print error for debugging
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)