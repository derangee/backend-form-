const express = require("express");
const bodyParser = require("body-parser");
const { db, collection, addDoc, getDocs } = require("./firebase");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

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
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).send("<h1>Invalid input. Name and email are required.</h1><a href='/'>Go back</a>");
    }

    // Add data to Firestore under "Form inputs"
    const docRef = await addDoc(collection(db, "Form inputs"), { name, email });

    res.send(`<h1>Data saved successfully! Document ID: ${docRef.id}</h1><a href='/'>Go back</a>`);
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("<h1>Failed to save data.</h1><a href='/'>Go back</a>");
  }
});

app.get("/get", async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "Form inputs"));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    if (data.length > 0) {
      res.status(200).send(data);
    } else {
      res.status(404).send({ message: "No data found." });
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).send({ message: "Failed to retrieve data." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});