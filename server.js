import express from "express";
const app = express();


app.get('/', (request, response)=>{
    response.send('this is working!')
})


/**
 *        --> res = this is working
 * signin --> POST = success/fail
 * register --> POST = user
 * profile/:userId --> GET = user
 * image --> PUT --> user
 * 
 */

app.listen(3000, ()=>{
    console.log("app is running on port 3000");
})