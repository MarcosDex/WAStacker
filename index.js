const express = require("express");
const { Client } = require("pg");
const mysql = require("mysql2");
const path = require("path");
const port = process.env.PORT || 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));

const publicDirectoryPath = path.join(__dirname, "public");
app.use(express.static(publicDirectoryPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "config.html"));
});

app.post("/rng", (req, res) => {
  const { host, user, password, database, dbType, tableName, columnName } =
    req.body;

  if (dbType === "mysql") {
    const connection = mysql.createConnection({
      host,
      user,
      password,
      database,
    });

    connection.connect((err) => {
      if (err) {
        console.error("Erro ao conectar ao banco de dados MySQL:", err);
        res.status(500).json({
          error: "Não foi possível conectar ao banco de dados MySQL",
        });
      } else {
        console.log("Conexão bem-sucedida ao banco de dados MySQL");

        const numbers = [];

        for (let i = 0; i < 10; i++) {
          const randomNumber = Math.floor(Math.random() * 100);
          numbers.push([randomNumber]);
        }

        const query = `INSERT INTO ${tableName} (${columnName}) VALUES ?`;

        connection.query(query, [numbers], (error, results) => {
          if (error) {
            console.error(
              "Erro ao inserir os números no banco de dados MySQL:",
              error
            );
            res.status(500).json({
              error: "Erro ao inserir os números no banco de dados MySQL",
            });
          } else {
            console.log(
              "Números inseridos com sucesso no banco de dados MySQL"
            );
            res.json({
              message:
                "10 números foram sorteados e inseridos no banco de dados MySQL! Favor verificar. Necessita de novos números? Recarregue a página.",
            });
          }
        });
      }
    });
  } else if (dbType === "postgres") {
    const client = new Client({
      host,
      user,
      password,
      database,
    });

    client.connect((err) => {
      if (err) {
        console.error("Erro ao conectar ao banco de dados PostgreSQL:", err);
        res.status(500).json({
          error: "Não foi possível conectar ao banco de dados PostgreSQL",
        });
      } else {
        console.log("Conexão bem-sucedida ao banco de dados PostgreSQL");

        const numbers = [];

        for (let i = 0; i < 10; i++) {
          const randomNumber = Math.floor(Math.random() * 100);
          numbers.push({ id: randomNumber });
        }

        const query = `INSERT INTO ${tableName} (${columnName}) VALUES ($1::jsonb)`;

        client.query(query, [numbers], (error, results) => {
          if (error) {
            console.error(
              "Erro ao inserir os números no banco de dados PostgreSQL:",
              error
            );
            res.status(500).json({
              error: "Erro ao inserir os números no banco de dados PostgreSQL",
            });
          } else {
            console.log(
              "Números inseridos com sucesso no banco de dados PostgreSQL"
            );
            res.json({
              message:
                "10 números foram sorteados e inseridos no banco de dados PostgreSQL! Favor verificar. Necessita de novos números? Recarregue a página.",
            });
          }
        });
      }
    });
  } else {
    res.status(400).json({
      error: "Banco de dados inválido. Escolha 'mysql' ou 'postgres'",
    });
  }
});

app.listen(port, () => console.log("Servidor em execução"));
