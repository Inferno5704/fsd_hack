const express = require("express");
const axios = require("axios");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const fetch= require("node-fetch")
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

const upload = multer({ dest: "uploads/" }); // Multer config
const FLASK_API_URL = "http://localhost:5000/generatesql"; // Python API URL

// Route to process both JSON and file input
app.post("/fetchsql", upload.single("file"), async (req, res) => {
    try {
        let schemaData = null;
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: "Missing query parameter" });
        }
        console.log(req.body);
        if (req.file) {
            // Read uploaded JSON file
            const fileContent = fs.readFileSync(req.file.path, "utf-8");
            schemaData = JSON.parse(fileContent);
        } 
        else if (req.body.jsonText) {
            // Handle JSON text input
            try {
                schemaData = JSON.parse(req.body.jsonText);
                //console.log(schemaData);
            } catch (err) {
                return res.status(400).json({ error: "Invalid JSON format" });
            }
        } else {
            return res.status(400).json({ error: "Schema input is required" });
        }
        bo={
          query,
          schema: schemaData
      }
      console.log(bo)
      
        // Send request to Flask API
      
      const response = await fetch("http://127.0.0.1:5000/generatesql", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(bo) // Ensure it's valid JSON
          });
      
          const result = await response.text();  // Get raw response
console.log("Raw Response from Flask:", result);
let cleanResponse;
try {
    const parsedResponse = JSON.parse(result); // Parse outer JSON
    cleanResponse = parsedResponse.response;

    // Remove unnecessary ```json and ```sql tags for clean printing
    cleanResponse = cleanResponse.replace(/```json\n|```sql\n|```/g, "");

    console.log("Formatted Response:\n", cleanResponse);
    res.json(cleanResponse);
} catch (err) {
    console.error("Error parsing response:", err);
}
    
    } catch (error) {
        console.error("Error processing request:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Node.js server running on http://localhost:${PORT}`);
});