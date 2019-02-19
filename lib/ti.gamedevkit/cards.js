var imgf;
var ic = require('To.ImageCache');
var density = Ti.Platform.displayCaps.logicalDensityFactor;

/**
 * 
 * @param {Object} configuration for the deck instance. Right now only supports animationSpeed and backImage 
 */
function instance (conf) {
    var self = this;
    var backSide = false;
    var deck = [];
    var deckArgs;
    var config = {animationSpeed: 750, backImage: '/images/cardbacks/default.jpg'};

    _.each(conf, function(c, i){
        config[i] = c;
    });

    /**
     * @param  {Object} arguments configuration for the deck, like 
     */
    this.createDeck = function (args) {
        deckArgs = args;
        generateBack();
        var types = ['hearts', 'clubs', 'diamonds', 'spades'];
        var type;
        for (var i = 0; i <= 3; i++) {
            for (var j = 1; j <= 13; j++) {
                var number = j;
                if (number === 11) number = "J";
                else if (number === 12) number = "Q";
                else if (number === 13) number = "K";
                else if (number === 1) number = "A";

                var cardArgs = { number: number, type: types[i], face: 'back', state: 'deck' };
                _.each(['left', 'top'], function (prop) {
                    if (args.hasOwnProperty(prop))
                        cardArgs[prop] = args[prop];
                });

                var card = self.createCard(cardArgs);
                if (args.onClick) card.addEventListener('click', args.onClick);
                deck.push(card);
            }
        }
        return self.shuffle(deck);
    }

    
    /**
     * @param  {Array} Array of cards
     */
    this.shuffle = function (array) {

        var numbers = [];
        _.each(array, function (card) {
            card.num = Math.random();
        });

        array.sort(function (a, b) {
            return a.num > b.num;
        });

        _.each(array, function (card, i) {
            card.zIndex = i;
        });

        return array;
    }
    /**
     * Returns an image of the back of the card
     */
    this.getBack = function () {
        return backSide;
    }

    
    /**
     * @param  {Object} Arguments for generating the deck
     */
    this.getDeck = function (args) {
        if (!args && !deck) {
            console.error('Please provide args, deck hasn\'t been initialized yet');
            return false;
        }

        if (args && !deck) {
            self.createDeck(args);
        }
        return deck;
    }

    
    /**
     * Returns top most card from the deck
     */
    this.getTopCardFromDeck = function() {
        var highest = -1;
        var topCard;
      
        _.each(deck, function(card){
          if (card.state === "deck" && card.zIndex > highest){
            highest = card.zIndex;
            topCard = card;
          }
        });
      
        return topCard;
    }
    
    
    /**
     * @param  {float} top the "top" position the cards to need to animate to
     * @param  {float} left the "left" position the cards to need to animate to
     * @param  {boolean} flip if the card needs to flip after animating to position
     */
    this.dealDeckCardToPosition = function(y, x, flip) {

        var card = self.getTopCardFromDeck();
        animateCardToPosition(card, y, x, flip)
        return card;
    }

    function animateCardToPosition(card, y, x, flip) {
        card.animate(Ti.UI.createAnimation({
            duration: config.animationSpeed,
            left: x,
            top: y
        }), function(){
            // setting properties to card for reading reasons
            card.top = y;
            card.left = x;
            if (flip) {
                card.flip();
            }
        });
    }

    this.setBackImage = function (image) {
        config.backImage = image;
        generateBack();
        _.each(deck, function (card) {
            if (card.face !== 'front') {
                card.children[0].image = self.getBack();
            }
        });
    }

    /*
    * Reset all cards:
    * Flip cards if they're turned up
    * Move all cards back to deck
    * Shuffle the deck
    */
    this.reset = function (callback) {
        var cardAnimationTimeout = 0;
        _.each(deck, function (card) {

            card.state = "deck";
            card.opacity = 1;
            if (card.left != deckArgs.left || card.top != deckArgs.top) {
                setTimeout(function () {
                    if (card.face === 'front') {
                        card.flip();
                    }
                    card.animate(Ti.UI.createAnimation({
                        left: deckArgs.left,
                        top: deckArgs.top,
                        duration: 700
                    }), function () {
                        card.left = deckArgs.left;
                        card.top = deckArgs.top;
                    });
                }, cardAnimationTimeout);
                cardAnimationTimeout += 150;

            } else if (card.face === 'front') {
                card.flip();
            }
        });
        setTimeout(function () {
            self.shuffle(deck);
            callback && callback();
        }, cardAnimationTimeout);
    }


    this.createCard = function (args) {
        if (!deckArgs) {
            deckArgs = args;
        }

        if (!self.getBack()) {
            generateBack();
        }


        var blob = ic.getBlob(args.type + '-' + args.number);
        var cardBlob;
        if (blob) {
            cardBlob = blob;
        } else {
            console.log('make image');
            cardBlob = makeImage(args.number, args.type, deckArgs.height);
            ic.storeBlob(args.type + '-' + args.number, cardBlob);
        }

        var card = Ti.UI.createImageView({
            image: cardBlob,
            width: deckArgs.height / 1.42,
            height: deckArgs.height,
            touchEnabled: false
        });


        var cardView = Ti.UI.createView({
            height: deckArgs.height,
            width: deckArgs.height / 1.42,
            face: args.face || 'back'
        });

        if (args.face == 'back') {
            cardView.front = cardBlob;
            card.image = self.getBack();
        }

        if (args.hasOwnProperty('hand')) {
            cardView.hand = args.hand;
        } else {
            cardView.hand = 'main';
        }

        cardView.add(card);
        cardView.flip = flip;
        cardView.animateTo = animateTo;

        _.each(['left', 'right', 'top', 'bottom'], function (prop) {
            if (args.hasOwnProperty(prop))
                cardView[prop] = args[prop];
        });

        cardView.number = args.number;
        cardView.type = args.type;
        cardView.state = args.state;
        return cardView;
    }

    function generateBack() {
        var cardView = Ti.UI.createView({
            height: deckArgs.height,
            width: deckArgs.height / 1.42,
            backgroundColor: "#fff",
            borderRadius: deckArgs.height / 13.3,
            borderWidth: 2,
            borderColor: "#ccc"
        });

        var img = Ti.UI.createImageView({
            height: deckArgs.height / 1.09,
            width: deckArgs.height / 1.61,
            borderRadius: deckArgs.height / 13.3,
            image: config.backImage
        });
        cardView.add(img);
        
        backSide = cardView.toImage();

    }

    function flip() {
        var cardView = this;
        var card = cardView.children[0];

        cardView.flipTo = cardView.face === 'back' ? 'front' : 'back';
        cardView.face = cardView.flipTo;
        card.animate(Ti.UI.createAnimation({
            width: 1,
            duration: 250
        }), function () {
            if (cardView.flipTo == 'back') {
                cardView.front = card.image;
                card.image = self.getBack();
            } else {
                card.image = cardView.front;
            }
            delete cardView.flipTo;
            card.animate(Ti.UI.createAnimation({
                width: deckArgs.height / 1.42,
                duration: 250
            }));
        });
    }

    function animateTo (y, x, flip) {
        animateCardToPosition(this, y, x, flip);
    }

    function makeImage(number, type, height) {
        if (!imgf) imgf = require('ti.imagefactory');

        var cardView = Ti.UI.createView({
            height: height,
            width: height / 1.42,
            backgroundColor: "#fff",
            zIndex: 10,
            borderRadius: height / 13.3,
            borderWidth: 2,
            borderColor: "#ccc"
        });

        var icon = Ti.UI.createImageView({
            image: '/images/ti.gamedevkit/cards/' + type + '.png',
            width: height / 13.3 * density
        });


        var labelImage = Ti.UI.createLabel({
            text: number,
            font: { fontSize: height / 10 * density },
            width: Ti.UI.SIZE,
            color: "#333"
        }).toImage();

        var blob = icon.toImage();
        var rotated = require('ti.imagefactory').imageWithRotation(blob, { degrees: 180 });

        cardView.add(Ti.UI.createImageView({
            width: height / 15,
            image: labelImage,
            left: height / 19.5,
            top: height / 20,
            hires: true
        }));

        cardView.add(Ti.UI.createImageView({
            image: imgf.imageWithRotation(labelImage, { degrees: 180 }),
            width: height / 15,
            right: height / 20,
            bottom: height / 20,
            hires: true
        }));

        cardView.add(Ti.UI.createImageView({
            image: blob,
            width: height / 13.3,
            left: height / 20,
            top: height / 5.71,
            hires: true
        }));

        cardView.add(Ti.UI.createImageView({
            image: rotated,
            width: height / 13.3,
            right: height / 20,
            bottom: height / 5.71,
            hires: true
        }));

        var blob = cardView.toImage();
        return blob;
    }
}

module.exports = instance;