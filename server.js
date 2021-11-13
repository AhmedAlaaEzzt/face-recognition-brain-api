import express, { request, response } from "express";
import Database from "./data/database.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  response.send(Database.Users);
});

app.post("/signin", (request, response) => {
  const {email,password } = request.body;

  const user = Database.Users.find(user => user.email === email && user.password === password)
  
  if (user) {
    response.json(user);
  } else {
    response.status(400).json("Wrong credentials!");
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

app.put("/image/:id", (request, response) => {
  const { id } = request.params;
  const user = Database.Users.find(user => user.id === id);

  if(user){
    user.entries++;
    return response.json(user.entries);
  }else{
    response.status(400).json("not found");
  }

});


app.listen(3000);
