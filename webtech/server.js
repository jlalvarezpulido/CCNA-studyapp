const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000; // Ensure your PORT is defined
const directoryPath = path.join(__dirname, 'data');

// Middleware to serve static files and parse JSON requests
app.use(express.static(__dirname));
app.use(express.json());

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve JSON file dynamically
app.get('/data/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'data', req.params.filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading JSON file:", err);
            return res.status(500).json({ error: "Error reading JSON file" });
        }
        res.json(JSON.parse(data));
    });
});
// Update JSON file using a PUT request
app.put('/data/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'data', req.params.filename);

    // Validate request body
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: "Invalid request format. Expected an array of objects." });
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading JSON file:", err);
            return res.status(500).json({ error: "Error reading JSON file" });
        }

        try {
            let currentData = JSON.parse(data);

            if (!Array.isArray(currentData)) {
                currentData = []; // Ensure valid JSON structure
            }

            let updatedData = [...req.body]; // Replace with new data
            fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), (err) => {
                if (err) {
                    console.error("Error writing to JSON file:", err);
                    return res.status(500).json({ error: "Error writing JSON file" });
                }
                res.json({ message: "JSON updated successfully", data: updatedData });
            });
        } catch (parseError) {
            console.error("Error parsing JSON data:", parseError);
            res.status(500).json({ error: "Error parsing JSON file" });
        }
    });
});

app.get('/files', (req, res) => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).json({ error: "Error reading directory" });
        }
        res.json(files);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
