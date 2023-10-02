const mysql = require('mysql2')
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser'); // Importe o body-parser


class Connection {
    constructor(host, user, password, database) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
        this.connected = false; // Inicializar connected como false

        // Crie a conexão mysql utilizando o construtor
        this.connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
        });

        
        this.connect();
    }

    connect() {
        //conectando ao banco de dados
        this.connection.connect((err) => {
            if (err) {
                console.error('Erro ao connectar ao banco de dados:', err);
                this.connected = false;
            } else {
                console.log('Connectado ao banco de dados!');
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


    //create
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

    //research
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
    //deletar
    deleteRow(tableName, id, callback) {
        const sql = `DELETE FROM ${tableName} WHERE id = '${id}'`;
      
        this.connection.query(sql, (err, results) => {
          if (err) {
            console.error('Erro ao remover registro', err);
            callback(err);
          } else {
            console.log('Registro removido com sucesso!');
            callback(null, results);
          }
        });
      }
      
}


// Conexão DB
const connection = new Connection('localhost', 'root', 'Youngmull4!', 'my_db');

const PORT = process.env.PORT || 3001;

const app = express();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Configurar o body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Fazer com que o Node sirva os arquivos do app em React criado
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.post("/api/create_client", (req, res) => {
  // Aqui você pode acessar os dados enviados no corpo da solicitação
  const { nome, busto, quadril, cintura, tecidoPreferencia, ultimaCompra, valorUltimaCompra } = req.body;

  // Faça o processamento necessário com os dados

  // Exemplo: inserir os dados no banco de dados
  const values = [nome, busto, quadril, cintura, tecidoPreferencia, ultimaCompra, valorUltimaCompra];

  connection.createRow('clientes', values, (err, result) => {
    if (err) {
      console.error('Erro ao criar um cliente:', err);
      res.status(500).json({ error: 'Erro ao criar um cliente' });
    } else {
      console.log('Cliente criado com sucesso!');
      res.status(200).json({ message: 'Cliente criado com sucesso!' });
    }
  });
});
app.delete("/api/delete_client",(req,res)=>{
    const {id} = req.body;
    const values = [id]
    connection.deleteRow('clientes',id,(err,result)=>{
        if(err){
            console.error('Erro ao deletar um cliente:',err);
            res.status(500).json({ error: 'Erro ao deletar um cliente'});
        }else{
            console.log('Cliente deletado com sucesso!');
            res.status(200).json({ message: 'Cliente deletado com sucesso!' });
        }
    })
})

app.get("/api/search_clients", (req, res) => {
    const { name } = req.query;
    console.log(name);
    connection.research_by_name('clientes', name, (err, results) => {
      if (err) {
        console.error('Erro ao procurar cliente com nome:', { name }, err);
        res.status(500).json({ error: 'Erro ao procurar cliente' });
      } else {
        console.log('Busca realizada com sucesso!');
        res.status(200).json(results); // Envie os resultados da pesquisa de volta para o cliente
      }
    });
  });
  

// Lidar com as solicitações GET feitas à rota /api
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Todas as outras solicitações GET não tratadas retornarão nosso app em React
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});