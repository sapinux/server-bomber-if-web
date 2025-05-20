// Importando os módulos necessários
const WebSocketServer = require('ws');

// Criando um novo servidor websocket
const wss = new WebSocketServer.Server({ port: 3000 })

//vetor para armazenar os players
var players = [];

//contador dos clientes
var cliente_id = 0;

wss.on("connection", ws => {
	cliente_id ++;
    
    // código que deve ser executado logo após o jogador se conectar
    console.log("Um novo Player conectado!");

    // quando o cliente nos envia uma mensagem
    ws.on("message", data => {
        console.log(`O cliente nos enviou: ${data}`);
        var data_cliente = JSON.parse(data);        //decodifica a mensagem recebida do cliente
        var event_name = data_cliente.event_name;

        switch (event_name) {
            case "create_player_request":
                var player = {
                    id: cliente_id,
                    name: data_cliente.name,
                    x: 0,
                    y: 0,
                    socket_object: ws,
                }
                players.push(player);   //cliente adicionado ao vetor players

                console.log(players);   //depuração

                //agora temos que dizer ao cliente que sim, de fato, nós o criamos


                break;
        }

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