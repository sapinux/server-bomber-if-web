// Importando os módulos necessários
const WebSocketServer = require('ws');

// Criando um novo servidor websocket
const wss = new WebSocketServer.Server({ port: 3000 })

wss.on("connection", ws => {
	// código que deve ser executado logo após o jogador se conectar
    console.log("Um novo Player conectado!");

    // quando o cliente nos envia uma mensagem
    ws.on("message", data => {
        console.log(`O cliente nos enviou: ${data}`);

    })
    // lidar com o que fazer quando os clientes se desconectam do servidor
    ws.on("close", () => { 
        console.log("Player desconectou!");
    })

    // tratamento de erro de conexão do cliente
    ws.onerror = function () {
        console.log("Ocorreu algum erro");
    }
});
console.log("O servidor WebSocket está em execução");