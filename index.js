const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Serve static files from the 'client' directory
app.use(express.static(__dirname + '/client'));  // dhyan dena hai

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
const rooms = {};

io.on('connection', (socket) => {
    console.log("user connected");
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
    // Server-side code
    socket.on('createGame', () => {
        // Generate a unique room ID
        const roomUniqID = makeid(6);

        // Create a new room in the 'rooms' object
        rooms[roomUniqID] = {};

        // Join the socket (client) to the newly created room
        socket.join(roomUniqID);

        // Emit a 'newGame' event back to the client with the room ID
        socket.emit('newGame', { roomUniqID: roomUniqID });
    });
    socket.on('joinGame', (data) => {
        console.log(data.roomUniqID);
        if (rooms[data.roomUniqID] != null) {
            socket.join(data.roomUniqID);
        }
        socket.to(data.roomUniqID).emit('playersConnected', {});

        socket.emit('playersConnected');
    })
    socket.on('p1Choice', (data) => {
        let rpsValue = data.rpsValue;
        rooms[data.roomUniqID].p1Choice = rpsValue;
        socket.to(data.roomUniqID).emit('p1Choice', { rpsValue: data.rpsValue });
        if (rooms[data.roomUniqID].p2Choice != null) {
            declareWinner(data.roomUniqID);
        }
    })
    socket.on('p2Choice', (data) => {
        let rpsValue = data.rpsValue;
        rooms[data.roomUniqID].p2Choice = rpsValue;
        socket.to(data.roomUniqID).emit('p2Choice', { rpsValue: data.rpsValue });
        if (rooms[data.roomUniqID].p1Choice != null) {
            declareWinner(data.roomUniqID);
        }
    })
});
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
function declareWinner(roomId) {
    let p1 = rooms[roomId].p1Choice;
    let p2 = rooms[roomId].p2Choice;
    let winner = null;
    if (p1 == p2)
        winner = 'd';
    else if (p1 == 'Paper') {
        if (p2 == 'Scissor')
            winner = "p2";
        else
            winner = 'p1';
    }
    else if (p1 == 'Rock') {
        if (p2 == 'Scissor')
            winner = "p1";
        else
            winner = 'p2';
    }
    else if (p1 == 'Scissor') {
        if (p2 == 'Rock')
            winner = "p2";
        else
            winner = 'p1';
    }
    io.sockets.to(roomId).emit('result', {
        winner: winner
    });
    rooms[roomId].p1Choice = null;
    rooms[roomId].p2Choice = null;

}
server.listen(3000, () => {
    console.log("running");
});
