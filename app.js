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
    const { name, email } = req.body;
    const docRef = await addDoc(collection(db, "Form inputs"), { name, email });
    res.send(`<h1>Data saved successfully!</h1><a href='/'>Go back</a>`);
});

app.get("/get", async (req, res) => {
    const input = await getDocs(collection(db, "Form inputs"));
    const data = [];
    input.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});