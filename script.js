// Deck array
var createDeck = [];

// Tracking bet points
var betPoints = 0;

// Image tenor
var winImage =
  '<img src="https://c.tenor.com/tw0owCZcG2UAAAAC/congrats-congratulations.gif"/>';

var confusedImage =
  '<img src="https://c.tenor.com/HnJpjRirG5UAAAAC/jackie-chan-meme.gif"/>';

var loseImage =
  '<img src="https://c.tenor.com/SIkFPWob0yUAAAAM/failure-fail.gif"/>';

// Dealer object consists of the dealer data
var dealerObject = {
  name: "Dealer",
  cards: [],
  totalCardValue: 0,
  cardHidden: true,
};

// Player object consists of the player data
var playerObject = {
  name: "",
  cards: [],
  totalCardValue: 0,
  points: 100,
};

// Tracking current player
var currentPlayer = playerObject;

// Game modes
var playerStand = false;
var gameOver = false;

// Create deck function
var makeDeck = function () {
  //A deck contains of 52 cards
  //which ranks 1-13 that includes 1 as Ace, 11 as jack, 12 as queen, 13 as king
  var cardDeck = [];

  //1-4 suits : hearts, clubs, diamonds, spades
  var cardSuits = ["hearts ♥️", "clubs ♣️", "diamonds ♦️", "spades ♠️"];

  // we want to loop card suits array using an index that starts from 0
  var suitsIndex = 0;
  // looping 4 sutis
  while (suitsIndex < cardSuits.length) {
    var currentSuit = cardSuits[suitsIndex];

    // looping card rank from 1-13
    // rank counter will start from 1 because the card starts from 1 not 0
    var rankCounter = 1;
    while (rankCounter <= 13) {
      var cardName = rankCounter;
      var cardValue = rankCounter;

      if (cardName == 1) {
        cardName = "Ace";
        cardValue = 11;
      } else if (cardName == 11) {
        cardName = "Jack";
        cardValue = 10;
      } else if (cardName == 12) {
        cardName = "Queen";
        cardValue = 10;
      } else if (cardName == 13) {
        cardName = "King";
        cardValue = 10;
      }

      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        value: cardValue,
      };

      cardDeck.push(card);
      rankCounter += 1;
    }
    suitsIndex += 1;
  }
  return cardDeck;
};

var getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

//Shuffle card function
var shuffleCards = function (cardDeck) {
  // Loop over the card deck array once
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    // Select a random index in the deck
    var randomIndex = getRandomIndex(cardDeck.length);
    // Select the card that corresponds to randomIndex
    var randomCard = cardDeck[randomIndex];
    // Select the card that corresponds to currentIndex
    var currentCard = cardDeck[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    // Increment currentIndex
    currentIndex = currentIndex + 1;
  }
  // Return the shuffled deck
  return cardDeck;
};

// Draw a card function
var getCard = function (hand) {
  return hand.push(createDeck.pop());
};

var countCards = function (hand) {
  var score = 0;
  var counter = 0;
  var numOfAces = 0;

  //Check if there is ace in the card
  while (counter < hand.length) {
    if (hand[counter].name === "Ace") {
      numOfAces += 1;
    }

    score += hand[counter].value;
    console.log("score:" + score);
    counter += 1;
  }

  if (numOfAces > 0 && score > 21) {
    var counterAces = 0;
    while (counterAces < numOfAces) {
      console.log("score ace 11:" + score);
      score -= 10;
      console.log("score ace 1:" + score);
      if (score < 21) {
        break;
      }
      counterAces += 1;
    }
  }
  return score;
};

// A function to change the card object into a string
var getCardToString = function (hand) {
  var counter = 0;

  var output = `${playerObject.name}, you have drawn: <br>`;

  if (hand == dealerObject.cards) {
    output = `Dealer has drawn: <br>`;
  }

  while (counter < hand.length) {
    var text = hand[counter].name + " of " + hand[counter].suit;
    if (hand == dealerObject.cards && counter > 0 && dealerObject.cardHidden) {
      text = "[Hidden]";
    }
    console.log(text);
    output += text + "<br>";
    counter += 1;
  }

  return output;
};

// This function is to check if the player or dealer has wins a blackjack or bust
var check = function (hand) {
  var addMessage = "";

  // Check if player has blackjack then player after getting the card
  if (hand.totalCardValue == 21) {
    if (currentPlayer == playerObject) {
      winPoints = betPoints * 2;
      playerObject.points += winPoints;
      addMessage += ` ${winImage} <br> Your bet points has been twiced. You won ${winPoints} points! It has been added to your current points.`;
      betPoints = 0;
    } else {
      addMessage += ` ${loseImage} <br> You lose ${betPoints} points. Dealer wins! Better luck next time!`;
    }
    gameOver = true;
    dealerObject.cardHidden = false;
    return `<br><br> Its blackjack. ${hand.name} won! ${addMessage} <br><br>`;

    // Check if its busts
  } else if (hand.totalCardValue > 21) {
    if (currentPlayer == dealerObject) {
      winPoints = betPoints * 2;
      playerObject.points += winPoints;
      addMessage += `${winImage} <br> Your bet points has been twiced. You won ${winPoints} points! It has been added to your current points.`;
      betPoints = 0;
    } else {
      addMessage += ` ${loseImage} <br> You lose ${betPoints} points. Dealer wins! Better luck next time!`;
    }
    gameOver = true;
    dealerObject.cardHidden = false;
    return `<br><br> ${hand.name} busts. ${addMessage} <br><br>`;
  } else {
    if (hand.name != "Dealer") {
      return `<br><br> Do you want to [H]it or [S]tand? (H/S)`;
    }

    return "Dealer hits.";
  }
};

var defaultMessage = function () {
  var showDealerHand = getCardToString(dealerObject.cards);
  var showPlayerHand = getCardToString(playerObject.cards);
  return ` ${showDealerHand} Dealer's hand valued at: ${dealerObject.totalCardValue} <br><br> ${showPlayerHand} Your hand valued at: ${playerObject.totalCardValue} <br> Current points: ${playerObject.points}`;
};

var main = function (input) {
  // if game over is true
  if (gameOver) {
    return "The game is over. Please refresh the page for a new game.";
  }
  var output = "";

  // check if deck has already been made
  console.log(createDeck.length);
  if (createDeck.length == 0) {
    createDeck = shuffleCards(makeDeck());
  }

  console.log(createDeck);

  // Check if player name is empty or not
  if (!playerObject.name) {
    if (!input) {
      return ` ${confusedImage} <br><br>The game will start after you enter your name. `;
    }
    playerObject.name = "Player " + input;
    var myImage =
      '<img src="https://c.tenor.com/IkDEp2JfsbcAAAAC/davidt-tennant-doctor-who.gif"/>';
    return ` ${myImage} <br> Welcome ${playerObject.name}, you got a 100 points to play the game. Please input a bet number between 0 and 100 to start the game.`;
  }

  // If bet points still 0
  if (!betPoints) {
    if (!Number(input)) {
      return ` ${confusedImage} <br><br> Please enter a number or a number between 0 or 100.`;
    }
    if (input == 0 || input > 100) {
      return `${confusedImage} <br><br> Please input a bet number between 0 and 100`;
    }
    betPoints = input;
    return `${playerObject.name}, you bet ${betPoints} out of your ${playerObject.points} points. Your current points will be immediately deducted from your bet points! Click submit to draw out cards.`;
  }

  // If player hand is empty
  if (playerObject.cards.length == 0) {
    playerObject.points -= betPoints;

    // 1st card distributed
    getCard(playerObject.cards);
    getCard(dealerObject.cards);

    //2nd card distributed
    getCard(playerObject.cards);
    getCard(dealerObject.cards);

    console.log(playerObject.cards);
    console.log(dealerObject.cards);

    // Count player cards
    playerObject.totalCardValue = countCards(playerObject.cards);
    if (dealerObject.cardHidden) {
      dealerObject.totalCardValue = dealerObject.cards[0].value;
    } else {
      dealerObject.totalCardValue = countCards(dealerObject.cards);
    }

    //Check player cardValue if there is blackjack
    output = check(playerObject);
    return defaultMessage() + output;
  }

  // If player not stand
  if (!playerStand) {
    if (input != "h" && input != "s") {
      return "Please enter [H]it or [S]tand.(H/S)";
    }

    // If player choose to hit
    if (input === "h") {
      getCard(playerObject.cards);
      console.log("Player hits");
      console.log(playerObject.cards);
      playerObject.totalCardValue = countCards(playerObject.cards);
      output = check(playerObject);
      return defaultMessage() + output;
    }

    // If player choose to stand
    if (input === "s") {
      console.log("player stand");
      playerStand = true;
      dealerObject.cardHidden = false;
      currentPlayer = dealerObject;
    }
  }

  // Dealer's turn and check if dealer's hand is less than 17 in order to hit
  if (dealerObject.totalCardValue <= 17) {
    getCard(dealerObject.cards);
    console.log("Dealer hits");
    dealerObject.totalCardValue = countCards(dealerObject.cards);
    output = check(dealerObject);
    if (gameOver) {
      output += ` Please refresh the page for a new game.`;
      return `${defaultMessage()} ${output}`;
    }
  }

  //Check if player stand and dealer hand more than 17
  if (playerStand && dealerObject.totalCardValue > 17) {
    gameOver = true;

    // If player hand is bigger than dealer hand
    if (playerObject.totalCardValue > dealerObject.totalCardValue) {
      winPoints = betPoints * 2;
      playerObject.points += winPoints;
      betPoints = 0;
      return `${defaultMessage()} <br><br> ${winImage} <br> ${
        playerObject.name
      } wins! Your bet points has been twiced. You won ${winPoints} points! It has been added to your current points. Please refresh the page for a new game.`;

      // If player hand is equal to dealer hand
    } else if (playerObject.totalCardValue == dealerObject.totalCardValue) {
      playerObject.points = playerObject.points + betPoints;
      return `${defaultMessage()} <br><br> Its a tie! ${
        playerObject.name
      } Please refresh the page for a new game.`;
    }

    // Else
    losePoints = betPoints;
    betPoints = 0;
    return `${defaultMessage()} <br><br> ${loseImage} <br>Dealer wins! ${
      playerObject.name
    }. You lose ${losePoints} points! Please refresh the page for a new game.`;
  }

  return `${defaultMessage()}. <br><br> Click submit to see Dealer's next move`;
};
