const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs"); // Import the 'fs' module
const twilio = require('twilio'); // Import Twilio SDK
require('dotenv').config();  // Load environment variables from .env file

const app = express();
const PORT = 5000;

// Twilio credentials from the .env file
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
console.log("🚀 ~ TWILIO_PHONE_NUMBER:", TWILIO_PHONE_NUMBER)

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const FILE_PATH = "records.json"; // Path to the JSON file where records are stored

app.use(cors());
app.use(bodyParser.json());

// Helper function to read data from the JSON file
const readRecordsFromFile = () => {
    try {
        const data = fs.readFileSync(FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file:", err);
        return [];
    }
};

// Helper function to write data to the JSON file
const writeRecordsToFile = (records) => {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(records, null, 2), "utf8");
    } catch (err) {
        console.error("Error writing to file:", err);
    }
};

// Get all records
app.get("/api/records", (req, res) => {
    const records = readRecordsFromFile();
    res.json(records);
});

// Create a new record
app.post("/api/records", (req, res) => {
    const { name, phone_number } = req.body;
    const records = readRecordsFromFile();
    const newRecord = { id: uuidv4(), name, phone_number };
    records.push(newRecord);
    writeRecordsToFile(records); // Write updated records back to the file
    res.status(201).json(newRecord);
});

// Edit a record
app.put("/api/records/:id", (req, res) => {
    const { id } = req.params;
    const { name, phone_number } = req.body;
    const records = readRecordsFromFile();
    const record = records.find((r) => r.id === id);

    if (record) {
        record.name = name;
        record.phone_number = phone_number;
        writeRecordsToFile(records); // Write updated records back to the file
        res.json(record);
    } else {
        res.status(404).json({ message: "Record not found" });
    }
});

// Delete a record
app.delete("/api/records/:id", (req, res) => {
    const { id } = req.params;
    let records = readRecordsFromFile();
    records = records.filter((r) => r.id !== id);
    writeRecordsToFile(records); // Write updated records back to the file
    res.json({ message: "Record deleted" });
});

// Simulate a "Call ABC" feature using Twilio
app.post("/api/call", (req, res) => {
    const { phone } = req.body;
    
    console.log(`Calling ${phone} via Moon configuration...`);
  
    // Make a call using Twilio's API
    client.calls
      .create({
        to: phone,
        // from: '+17068073519', // Your Twilio phone number
        from: "+17068073519",
        url: 'http://demo.twilio.com/docs/voice.xml', // URL for handling the call (can be customized)
      })
      .then(call => {
        console.log(call.sid);
        res.json({ message: `Call initiated to ${phone}` });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Failed to initiate call' });
      });
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
