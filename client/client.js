console.log("client.js is executing");
var socket = io();
let player1 = false;
let x = document.getElementsByClassName("roomsId").value;
function createGame() {
    player1 = true;
    socket.emit('createGame');  // samjho
}
let roomUniqID = null;


function joinGame() {


    roomUniqID = document.getElementById("roomUniqID").value;
    if (roomUniqID !== '') {
        socket.emit('joinGame', { roomUniqID: roomUniqID });
    }
}
socket.on('newGame', (data) => {
    roomUniqID = data.roomUniqID;
    document.getElementById('initial').style.display = 'none';
    document.getElementById('gamePlay').style.display = 'block';
    let copybutton = document.createElement('button');
    copybutton.style.display = 'block';
    copybutton.innerText = 'Copy Code';
    copybutton.id = 'copy';

    copybutton.addEventListener('click', () => {
        navigator.clipboard.writeText(roomUniqID).then(function () {

        })
    })


    document.getElementById('waitarea').innerHTML = `Waiting for opponent,please share code <u>${roomUniqID}</u> to join`;
    document.getElementById('waitarea').appendChild(copybutton);
})
socket.on('playersConnected', () => {
    // Hide the waiting area when players are connected
    console.log('Received playersConnected event');
    document.getElementById('initial').style.display = 'none';
    document.getElementById('waitarea').style.display = 'none';
    document.getElementById('gamerea').style.display = 'block';

});
function sendChoice(rpsValue) {
    const choiceEvent = player1 ? 'p1Choice' : 'p2Choice';
    socket.emit(choiceEvent, {
        rpsValue: rpsValue,
        roomUniqID: roomUniqID
    })
    let plybt = document.createElement('button');
    let optt = document.createElement('div');
    optt.id = "adddon";

    let crtt = document.createElement('img');
    crtt.id = "adonimg"
    plybt.style.display = 'block';
    plybt.id = "choices"
    plybt.className = "adding"
    document.getElementById('player1Choice').innerHTML = "";
    document.getElementById('player1Choice').appendChild(plybt);
    if (rpsValue === 'Rock') {
        crtt.src = "fist.png";
        console.log(true)
        crtt.className = "rockk";
        document.getElementById('choices').appendChild(optt);
        document.getElementById('adddon').appendChild(crtt);
    }

    if (rpsValue === 'Scissor') {
        crtt.src = "scissors (2).png";
        crtt.className = "scissor";
        document.getElementById('choices').appendChild(optt);
        document.getElementById('adddon').appendChild(crtt);

    }
    if (rpsValue === 'Paper') {
        crtt.src = "hand-paper.png";
        document.getElementById('choices').appendChild(optt);
        document.getElementById('adddon').appendChild(crtt);

    }


}

socket.on('p1Choice', (data) => {

    console.log("sdsd");
    createOpponentChoiceButton(data);

})
socket.on('p2Choice', (data) => {

    console.log("ssd");
    createOpponentChoiceButton(data);

})
function createOpponentChoiceButton(data) {
    document.getElementById('opponentState').innerHTML = "Opponent made a choice"
    let opt = document.createElement('button');
    let opt2 = document.createElement('div');
    opt2.id = "addon";
    opt.id = "optbtn";
    let crt = document.createElement('img');
    crt.id = "adonimg"

    // opt.innerText = data.rpsValue;
    console.log(data.rpsValue);
    opt.className = 'ijx';

    opt.style.display = 'none';
    document.getElementById('player2Choice').appendChild(opt);
    if (data.rpsValue === 'Rock') {
        crt.src = "fist.png";
        crt.className = "rockk";
        document.getElementById('optbtn').appendChild(opt2);
        document.getElementById('addon').appendChild(crt);

    }
    if (data.rpsValue === 'Scissor') {
        crt.src = "scissors (2).png";
        crt.className = "scissor";
        document.getElementById('optbtn').appendChild(opt2);
        document.getElementById('addon').appendChild(crt);

    }
    if (data.rpsValue === 'Paper') {
        crt.src = "hand-paper.png";
        crt.className = "scissor"
        document.getElementById('optbtn').appendChild(opt2);
        document.getElementById('addon').appendChild(crt);

    }

}
socket.on('result', (data) => {

    let winnerText = '';
    if (data.winner == 'd')
        winnerText = "draw";
    else {
        if (data.winner == 'p1' && player1) {
            winnerText = "You Win";
        }
        else if (data.winner == 'p1') {
            winnerText = "You Loose";
        }
        else if (data.winner == 'p2' && !player1) {
            winnerText = "You Win";
        }
        else if (data.winner == 'p2') {
            winnerText = "You Loose";
        }
    }
    document.getElementById("opponentState").style.display = 'none';
    document.getElementById("optbtn").style.display = 'block';
    document.getElementById("winnerArea").innerHTML = winnerText;


    if (winnerText === "You Loose") {
        document.getElementById("winnerArea").className = "loose";
    }
    if (winnerText === "You Win") {
        document.getElementById("winnerArea").className = "win";
    }
    if (winnerText === "draw") {
        document.getElementById("winnerArea").className = "draw";
    }


})