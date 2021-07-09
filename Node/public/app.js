
var client;
const reconnectTimeout = 20000;
const host = "192.168.100.42";
const port = 9001;
const topic = "snake";


const Console = (msg) => {
    $('#console').prepend(`<p>${msg}</p>`);
}

const StartBroker = () => {
    Console(`conectando em ${host} porta: ${port} ...`);
    console.log(`conectando em ${host} porta: ${port} ...`);
    client = new Paho.MQTT.Client(host, port, "snake");
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess: onConnect });

    function onConnect() {
        Console("conectado!");
        console.log("conectado!");
        client.subscribe(topic);

    }

    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("conexao perdida:" + responseObject.errorMessage);
        }
    }

    function onMessageArrived(message) {
        console.log(`nova mensagem: \ntópico:  ${message.destinationName} \nmensagem: ${message.payloadString}`);
        Console(message.payloadString);
        changeDirection(message.payloadString);
    }
}

const PubBroker = (message) => {
    var message = new Paho.MQTT.Message(message);
    message.destinationName = topic;
    client.send(message);
}


const GAME_SPEED = 100;
const CANVAS_BORDER_COLOUR = 'red';
const CANVAS_BACKGROUND_COLOUR = "black";
const SNAKE_COLOUR = '#00ff14';
const SNAKE_BORDER_COLOUR = 'red';
const FOOD_COLOUR = 'white';
const FOOD_BORDER_COLOUR = 'darkred';

let snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 }
]

let score = 0;
//true se a cobra trocou de direcao
let changingDirection = false;

//coordenadas comida
let foodX;
let foodY;

//velocidades horizontais e verticais
let dx = 10;
let dy = 0;



var gameCanvas = null;
var ctx = null;

//verifica se a cobra se tocou ou tocou nas paredes
const didGameEnd = () => {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

//Limpa canvas
const clearCanvas = () => {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.strokestyle = CANVAS_BORDER_COLOUR;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

//Desenha a comida
const drawFood = () => {
    ctx.fillStyle = FOOD_COLOUR;
    ctx.strokestyle = FOOD_BORDER_COLOUR;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}


const advanceSnake = () => {
    //cria a cabeça da cobra
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    //adiciona a cabeça no inicio do corpo
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        $('#score').html(score);
        createFood();
    } else {
        //remove a ultima posicao do corpo
        snake.pop();
    }
}


const createFood = () => {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);
    // se as cordenadas geradas forem onde esta a cobra, gera um local diferente
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsoNsnake = part.x == foodX && part.y == foodY;
        if (foodIsoNsnake) createFood();
    });
}

const drawSnake = () => {
    snake.forEach(drawSnakePart)
}


const drawSnakePart = (snakePart) => {
    ctx.fillStyle = SNAKE_COLOUR;
    ctx.strokestyle = SNAKE_BORDER_COLOUR;
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}


const randomTen = (min, max) => {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}
const StartGame = () => {

    $('#game-partial').load("/gamePartial", () => {
        if (timeout !== undefined)
            clearInterval(timeout);

        gameCanvas = document.getElementById("gameCanvas");
        ctx = gameCanvas.getContext("2d");

        snake = [
            { x: 150, y: 150 },
            { x: 140, y: 150 },
            { x: 130, y: 150 },
            { x: 120, y: 150 },
            { x: 110, y: 150 }
        ]

        score = 0;
        changingDirection = false;

        foodX = null;
        foodY = null;

        dx = 10;
        dy = 0;

        MainGame();
        createFood();
    })
}

var timeout;
const MainGame = () => {
    if (didGameEnd()) return;
    timeout = setInterval(function onTick() {

        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();

        //MainGame();
    }, GAME_SPEED)
}


const changeDirection = (keyPressed) => {
    const filterKey = keyPressed.trim();
    const LEFT_KEY = '4';
    const RIGHT_KEY = '6';
    const UP_KEY = '2';
    const DOWN_KEY = '8';
    const START = 'A';
    debugger;
    console.log(filterKey);

    if (filterKey == START) {
        StartGame();
    }

    if (changingDirection) return;
    changingDirection = true;


    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (filterKey == LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (filterKey == UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (filterKey == RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (filterKey == DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }

  
}


$(() => {

    StartBroker();



})



