const app = require("express")();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "seu_host",
  user: "seu_usuario",
  password: "sua_senha",
  database: "seu_banco_de_dados",
});

app.get("/rng", (req, res) => {
  const numbers = [];

  for (let i = 0; i < 10; i++) { //Você pode alterar o tanto de numeros sorteados no i < 10
    const randomNumber = Math.floor(Math.random() * 100);
    numbers.push(randomNumber);
  }

  const values = numbers.map((number) => [number]);
  const query = "INSERT INTO nome_da_sua_tabela (nome_da_sua_coluna) VALUES ?";

  connection.query(query, [values], (error, results) => {
    if (error) {
      console.error("Erro ao inserir os números no banco de dados:", error);
      res
        .status(500)
        .json({
          error: "Não consegui encontrar sua tabela/banco de dados ~_~",
        });
    } else {
      console.log("Números inseridos com sucesso no banco de dados");
      res.json({
        message:
          "10 Numeros foram sorteados e inseridos ao seu banco de dados! Favor verificar. Necessita de novos numeros? recarregue a pagina xD",
      });
    }
  });
});

app.listen(3000, () => console.log("Server Running"));
