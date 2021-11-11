import express, { request, response } from "express";
import Database from "./data/database.js";
const app = express();

app.use(express.json());

app.get("/", (request, response) => {
  response.send(Database.Users);
});

app.post("/signin", (request, response) => {
  if (
    request.body.email === Database.Users[0].email &&
    request.body.password === Database.Users[0].password
  ) {
    response.json("success");
  } else {
    response.status(400).json("error loggin in");
  }
});

app.post("/register", (request, response) => {
  const { email, name, password } = request.body;
  Database.Users.push({
    id: "2311",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  response.json(Database.Users[Database.Users.length - 1]);
});

app.get("/profile/:id", (request, response) => {
  const { id } = request.params;
  let found = false;
  Database.Users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return response.json(user);
    }
  });

  if (!found) {
    response.status(400).json("not found");
  }
});

app.put("/image", (request, response) => {
  const { id } = request.body;
  let found = false;
  Database.Users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return response.json(user.entries);
    }
  });

  if (!found) {
    response.status(400).json("not found");
  }
});


app.listen(3000, () => {
  console.log("app is running on port 3000");
});
