const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = 3001;

const mongoUri = process.env.MONGO_URI;
const dbName = "backendForm";
const collectionName = "formInputs";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
let db;
MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); 
  });

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple Form</title>
    </head>
    <body>
      <h1>Submit Your Data</h1>
      <form action="/submit" method="POST">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required><br><br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required><br><br>
        <button type="submit">Submit</button>
      </form>
    </body>
    </html>
  `);
});

app.post("/submit", async (req, res) => {
    const { name, email } = req.body;
    await db.collection(collectionName).insertOne({ name, email });
    res.send(`<h1>Data saved successfully!</h1><a href='/'>Go back</a>`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});