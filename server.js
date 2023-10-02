

const http = require("http");
const cors = require('cors');



const app = require("express")();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });
console.log("Enter a port betwwen 1024 to  4915");
var init = true;
var port;
var commandss = process.openStdin();
    commandss.addListener("data", function(d) {
        
        var input = d.toString().trim();
        if(init){ //initial input is server port
            
            port = input;
            app.listen(port, () => console.log("Listening on port.." + port));
            init = false;
        }
        else if(input == "LIST"){
            console.log("Connections are the following:");
            for(var i = 0; i < clients.length; i++){
                console.log(clients[i]);
            }
        }
        else if(input == "KILL"){
            connection.close();
            console.log("Closed!");
        }


        if(input == "QUIT"){
            connection.close();
                console.log("Closed!");
            
          }

    });


app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
//app.listen(9091, () => console.log("Listening on port.. 9091"))

const websocketServer = require("websocket").server;
const httpserver = http.createServer();
httpserver.listen(9090, function(){
    console.log("Listening.. on")
});


//hashmaps fr the client
const clients = {};
const games = {};

const wsServer = new websocketServer({
    "httpServer": httpserver
});
wsServer.on("request", request => {

    const connection = request.accept(null, request.origin);
    connection.on("open", function(){
        console.log("Opened!");
    });
    
    connection.on("close", function(){
        console.log("Closed!");
    });
    ///////////////////////
    ///////Testing commands


    


        ///////////////
    connection.on("message", function(message){
        const result = JSON.parse(message.utf8Data);

        //I have received a message from the client

        //if there is create request
        if (result.method === "create") {
            const clientId = result.clientId;
            const gameId = generateRandomString();
            games[gameId] = {
                "id": gameId,
                "clients": []
            }

            const payLoad = {
                "method": "create",
                "game" : games[gameId]
            }

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }

        //if there is join request
        if(result.method === "join"){
            const clientId  = result.clientId;
            const aUser = result.user; ///////////////////////////////
            const gameId = result.gameId; 
            const game = games[gameId];
            if(game.clients.length > 2){
                //cannot enter the game
                return;
            }

            const color = {"0": "#D95862", "1": "#D95862"}[game.clients.length];

            game.clients.push({
                "clientId": clientId,
                "user": aUser,
                "color": color
            })

            const payLoad = {
                "method": "join",
                "game": game
            }

            console.log(aUser)

            //loop through all clients tell the people joined
            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad));
            })
        }
    });

    //generate a new clientId
    const clientId = generateRandomString();
    clients[clientId] = {
        "connection": connection
    }

    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }

    //send this back to the client
    connection.send(JSON.stringify(payLoad));
});


function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }

