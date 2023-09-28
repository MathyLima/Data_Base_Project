const mysql = require('mysql2')
const express = require('express');

class connection{
    constructor(host,user,password,database){
        this.host = host
        this.user = user
        this.password = password
        this.database = database
        this.connected = connection.connect
    }
connection = mysql.createConnection({
    host : this.host,
    user: this.user,
    password: this.password,
    database: this.database
});
    
}

// connection.connect((error)=>{
//     if(error){
//         console.error('Error connecting to MySQL database',error);
//     }else{
//         console.log('Connected to MySQL database')
//     }
// })

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });
app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT}`)
})