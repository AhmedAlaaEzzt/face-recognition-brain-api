import express, { request, response } from "express";
import Database from "./data/database.js";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt-nodejs";

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl:true
  },
});


const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  response.send("it's working :)");
});

app.post("/signin", (request, response) => {
  const { email, password } = request.body;
  if(!email || !password){
    return response.status(400).json('incorrect user conditionals!')
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select("*")
          .from("users")
          .where("email", "=", email)
          .then(user =>{
            response.json(user);
          })
          .catch(err =>  response.status(400).json("unable to get user!"))
        
        }else{
          response.status(400).json("Wrong credentials!")
        }
    })
    .catch(err=> response.status(400).json("Wrong credentials!"))

});

app.post("/register", (request, response) => {
  const { email, name, password } = request.body;
  if(!email || !name || !password){
    return response.status(400).json('incorrect form submission!')
  }
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            response.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => response.status(400).json("unable to register"));
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

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      console.log(entries);
      response.json(entries[0]);
    })
    .catch((err) => response.status(400).json("unable to get entries"));

});

app.listen(process.env.PORT || 3000, ()=>{
  console.log(`app is running on port ${process.env.PORT}`)
});
