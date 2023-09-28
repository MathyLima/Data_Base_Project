const mysql = require('mysql2')
const path = require('path');
const express = require('express');


class Connection {
    constructor(host, user, password, database) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
        this.connected = false; // Initialize connected property

        // Create the MySQL connection within the constructor
        this.connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
        });

        // Attempt to connect to the database
        this.connect();
    }

    connect() {
        // Establish a connection to the database
        this.connection.connect((err) => {
            if (err) {
                console.error('Error connecting to the database:', err);
                this.connected = false;
            } else {
                console.log('Connected to the database');
                this.connected = true;
            }
        });
    }
}
conection = new Connection()

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

// Fazer com que o Node sirva os arquivos do app em React criado
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Lidar com as solicitações GET feitas à rota /api
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Todas as outras solicitações GET não tratadas retornarão nosso app em React
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});