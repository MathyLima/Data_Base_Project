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

    //Função para retornar o nome das colunas, dado uma tabela, dinamicamente
    getTableColumns(tableName,callback){
        const sql = `DESCRIBE ${tableName}`;
        this.connection.query(sql,(err,results)=>{
            if(err){
                console.error('Erro ao obter os nomes das colunas: ',err)
            }else{
                const columnNames = results.map((row) => row.Field);
                callback(null,columnNames);
            }
        })
    }

    
    createRow(tableName,values,callback){
        this.getTableColumns(tableName,(err,columnNames)=>{
            if(err){
                console.log('Erro ao obter os nomes das colunas:',err);
                callback(err);
            }else{
                //temos que 'filtrar' as colunas, senao a coluna 'id' será selecionada
                const filteredColumns = columnNames.filter(columnName => columnName !== 'id');
                const columns = filteredColumns.join(', ');
                //placeholders inicialmente é um array, do mesmo tamanho que o array de colunas, e está preenchido por '?', separado de ','
                const placeholders = Array(filteredColumns.length).fill('?').join(', ');
                const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
                //values é passado como argumento para o metodo query, que substituirá os placeholders pelas entradas de 'values'
                this.connection.query(sql,values,(err,results)=>{
                    if(err){
                        console.error('Erro ao inserir registro',err);
                        callback(err);
                    }else{
                        console.log('Registro inserido com sucesso!');
                        callback(null, results);
                    }
                });
            }

        }); 
    }

    research_by_name(tableName,name,callback){
        const sql = `SELECT * FROM ${tableName} WHERE nome_cliente = '${name}' `;
        this.connection.query(sql,(err,results)=>{
            if(err){
                console.error('Erro ao pesquisar nome');
                callback(err);
            }else{
                if (results.length > 0){
                    console.log('Registros encontrados!');
                    results.forEach((row,index)=>{
                        console.log(`Registro ${index + 1}:`);
                        console.log(`ID: ${row.id}`);
                        console.log(`Nome do Cliente: ${row.nome_cliente}`);
                        console.log(`Busto: ${row.busto}`);
                        console.log(`Quadril: ${row.quadril}`);
                        console.log(`Cintura: ${row.cintura}`);
                        console.log(`Última Compra: ${row.ultima_compra}`);
                        console.log(`Tecido de Preferência: ${row.tecido_preferencia}`);
                    });
                }
                    else{
                        console.log('Nenhum registro encontrado');
                    }
                callback(null,results);
                
            }
        });
    }

    deleteRow_by_name(tableName,name,callback){
        const sql = `DELETE FROM ${tableName} WHERE nome_cliente = '${name}'`;
        
        this.connection.query(sql,(err,results)=>{
            if(err){
                console.error('Erro ao remover registro',err);
                callback(err);
            }else{
                console.log('Registro removido com sucesso!');
                callback(null,results);
            }
        })
    }
}
const connection = new Connection('localhost', 'root', 'Youngmull4!', 'my_db');
const values = ['Nome do Cliente', 90.5, 110.0, 80.0, '2023-09-30', 'Algodão'];

// Chame o método createRow com uma função de retorno de chamada
connection.deleteRow_by_name('clientes', 'Nome do Cliente', (err, result) => {
    if (err) {
        console.error('Erro ao criar uma linha na tabela de clientes:', err);
    } else {
        console.log('Linha inserida com sucesso na tabela de clientes!');
        // Faça algo mais após a inserção bem-sucedida, se necessário
    }
});

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