import express, { request, response } from "express";
import Database from "./data/database.js";
import cors from "cors";
import knex from "knex";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "123",
    database: "smart-brain",
  },
});

// db.select("*").from('users')
//   .then(data => console.log(data));

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  response.send(Database.Users);
});

app.post("/signin", (request, response) => {
  const { email, password } = request.body;

  const user = Database.Users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    response.json(user);
  } else {
    response.status(400).json("Wrong credentials!");
  }
});

app.post("/register", (request, response) => {
  const { email, name, password } = request.body;

  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      response.json(user[0]);
    })
    .catch((err) => response.status(400).json("unable to register"));
});

app.get("/profile/:id", (request, response) => {
  const { id } = request.params;
  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length) response.json(user[0]);
      else response.status(400).json("user not found");
    });
});

app.put("/image/:id", (request, response) => {
  const { id } = request.params;

  /**
   * 
  knex('books')
  .where('published_date', '<', 2000)
  .update({
    status: 'archived',
    thisKeyIsSkipped: undefined
  })
   */
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      console.log(entries);
      response.json(entries[0])
    })
    .catch(err => response.status(400).json('unable to get entries'))

  // const user = Database.Users.find((user) => user.id === id);

  // if (user) {
  //   user.entries++;
  //   return response.json(user.entries);
  // } else {
  //   response.status(400).json("not found");
  // }
});

app.listen(3000);
