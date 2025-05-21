// Importando os módulos necessários
const WebSocketServer = require('ws');

// Criando um novo servidor websocket
const wss = new WebSocketServer.Server({ port: 3000 })

//vetor para armazenar os players
var players = [];

//limite de players na sala sala
var limite_sala = 3;

//situacao da sala
var sala_aberta = [];

function player(id, sala, name, x, y, ws) {
    this.id = id,
    this.sala = sala,
    this.name = name,
    this.x = x,
    this.y = y,
    this.socket_object = ws
}

wss.on("connection", ws => {
	
    // código que deve ser executado logo após o jogador se conectar
    console.log("Um novo Player conectado!");

    // quando o cliente nos envia uma mensagem
    ws.on("message", data => {
        console.log(`O cliente nos enviou: ${data}`);
        var data_cliente = JSON.parse(data);        //decodifica a mensagem recebida do cliente
        

        switch (data_cliente.event_name) {
            case "create_player_request":
                if (players.length == 0)        //se não houvcer sala
                    players.push([new player(0, 0, data_cliente.name, 0, 0, ws)]);     //cria uma sala e adiciona o player
                else {
                    if ((players[players.length - 1].length < limite_sala) && (sala_aberta[players.length - 1]))    //se a sala estiver abaixo do limite e aberta
                        players[players.length - 1].push(new player(0, 0, data_cliente.name, 0, 0, ws));            //adiciona player na sala
                    else 
                        players.push([new player(0, 0, data_cliente.name, 0, 0, ws)]);              //cria uma sala e adiciona o player
                }

                players[players.length - 1][players[players.length - 1].length - 1].id = players[players.length - 1].length - 1;    //definir id
                players[players.length - 1][players[players.length - 1].length - 1].sala = players.length - 1;                      //definir sala
                sala_aberta[players.length - 1] = true;                                                                             //sala aberta
                
                console.log("sala " + players[players.length - 1][players[players.length - 1].length - 1].sala );   //depuracao
                console.log("jogador " + players[players.length - 1][players[players.length - 1].length - 1].id );  //depuracao
                console.table(players);   //depuração

                //agora temos que dizer ao cliente que sim, de fato, nós o criamos
                ws.send(
                    JSON.stringify({
                        event_name: "Você foi criado!",
                        id: players[players.length - 1][players[players.length - 1].length - 1].id, //envia o id do player
                    })
                )

                break;
            case "position_update":
                
                for (let sala = 0; sala < players.length; sala ++) {        //faz um loop nas salas
                    for (id = 0; id < players[sala].length; id ++) {        //faz um loop nos players
                        if (ws == players[sala][id].socket_object) {        //verifica qual player desconectou
                    
                            console.log(players[sala][id].id);              //depuração
                            console.log("sala: " + sala + " id: " + id);    //depuracao

                            players[sala][id].x = data_cliente.x;
                            players[sala][id].y = data_cliente.y;
                            break; 
                        }
                    }
                }    
            console.table(players[sala][id]);
            break;
        }

    })
    // lidar com o que fazer quando os clientes se desconectam do servidor
    ws.on("close", () => { 
        console.log("Player desconectou!");
        
        for (let sala = 0; sala < players.length; sala ++) {        //faz um loop nas salas
            for (id = 0; id < players[sala].length; id ++) {        //faz um loop nos players
                if (ws == players[sala][id].socket_object) {        //verifica qual player desconectou
                    
                    console.log(players[sala][id].id);              //depuração
                    console.log("sala: " + sala + " id: " + id);    //depuracao

                    players[sala].splice(id, 1,);                   //elimina o player da matriz
                    if (players[sala].length == 0)                  //se não existir player na sala
                        players.splice(sala, 1);                    //elimina a sala
                    break; 
                }
            }
        }
        console.table(players);
        
    })

    // tratamento de erro de conexão do cliente
    ws.onerror = function () {
        console.log("Ocorreu algum erro");
    }
});
console.log("O servidor WebSocket está em execução");