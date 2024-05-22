 //Definire le variabili globali
var canvas = document.getElementById("memoryCanvas");
var ctx = canvas.getContext("2d");
var cards = [];
var flippedCards = [];
var isFlipped = false;
var lockBoard = false;

// Immagini per le carte
var images = [
    "image1.jpg",
    "image2.jpg",
    "image3.jpg",
    "image4.jpg",
    "image1.jpg",
    "image2.jpg",
    "image3.jpg",
    "image4.jpg"
];

// Avvia il gioco quando si clicca sul pulsante "Start Game"
function startGame() {
    cards = createCards(images);
    cards = shuffleArray(cards);

    drawBoard();
}

// Crea le carte in base alle immagini fornite
function createCards(images) {
    var cardArray = [];
    for (var i = 0; i < images.length; i++) {
        var card = {
            image: images[i],
            isFlipped: false
        };
        cardArray.push(card);
    }
    return cardArray;
}

// Mescola l'array delle carte
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Disegna il tabellone di gioco
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        if (card.isFlipped) {
            drawCardImage(card.image, i);
        } else {
            drawCardCover(i);
        }
    }
}

// Disegna la copertina della carta
function drawCardCover(index) {
    var row = Math.floor(index / 4);
    var col = index % 4;

    var x = col * 100;
    var y = row * 100;

    ctx.fillStyle = "#3498db";
    ctx.fillRect(x, y, 80, 80);
}

// Disegna l'immagine della carta
function drawCardImage(image, index) {
    var row = Math.floor(index / 4);
    var col = index % 4;

    var x = col * 100;
    var y = row * 100;

    var img = new Image();
    img.src = image;
    ctx.drawImage(img, x, y, 80, 80);
}

// Gestisce il clic su una carta
function flipCard(index) {
    if (lockBoard) return;
    if (flippedCards.length === 0 || flippedCards.length === 1 && flippedCards[0] !== index) {
        cards[index].isFlipped = true;
        flippedCards.push(index);
    }

    if (flippedCards.length === 2) {
        lockBoard = true;
        setTimeout(checkMatch, 1000);
    }

    drawBoard();
}



// Aggiunge event listener al canvas
canvas.addEventListener("click", function(event) {
    if (!lockBoard) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;/*la seguente funzione traduce le coordinate del clic del mouse sul canvas
                                         in una posizione all'interno della griglia del gioco e chiama la
                                         funzione flipCard per gestire la scoperta della carta in quella posizione*/
        var col = Math.floor(x / 100);
        var row = Math.floor(y / 100);

        var index = row * 4 + col;
        flipCard(index);
    }
    
}); 

// Controlla se tutte le carte sono state scoperte
function checkVictory() {
    var allFlipped = cards.every(function(card) {
        return card.isFlipped;
    });

    if (allFlipped) {
        alert("Hai vinto!");
        // Puoi aggiungere ulteriori azioni da eseguire in caso di vittoria
    }
}

// Aggiorna la funzione checkMatch per chiamare checkVictory dopo aver controllato le carte
function checkMatch() {
    var [firstCard, secondCard] = flippedCards;
    if (cards[firstCard].image === cards[secondCard].image) {
        // Le carte sono uguali, lasciale scoperte
    } else {
        // Le carte non sono uguali, girale di nuovo
        cards[firstCard].isFlipped = false;
        cards[secondCard].isFlipped = false;
    }

    flippedCards = [];
    lockBoard = false;
    drawBoard();

    // Controlla la vittoria dopo ogni mossa
    checkVictory();
}
