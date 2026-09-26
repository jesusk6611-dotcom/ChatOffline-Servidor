const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const servidor = http.createServer(app);

const wss = new WebSocket.Server({
    server: servidor
});

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        nome: "ChatOffline",
        status: "online"
    });
});

const clientes = new Set();

wss.on("connection", (ws) => {

    clientes.add(ws);

    ws.send(JSON.stringify({
        tipo: "conexao",
        mensagem: "Conectado ao servidor ChatOffline."
    }));

    ws.on("message", (dados) => {

        let mensagem;

        try {
            mensagem = JSON.parse(dados.toString());
        } catch (erro) {
            return;
        }

        clientes.forEach((cliente) => {

            if (
                cliente.readyState === WebSocket.OPEN
            ) {
                cliente.send(
                    JSON.stringify(mensagem)
                );
            }

        });
    });

    ws.on("close", () => {
        clientes.delete(ws);
    });

    ws.on("error", () => {
        clientes.delete(ws);
    });
});

servidor.listen(PORT, () => {
    console.log(
        `ChatOffline servidor iniciado na porta ${PORT}`
    );
});
