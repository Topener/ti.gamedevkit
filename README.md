# Titanium Game Dev Kit

The Titanium Game Dev Kit contains multiple libraries for making simple games. Right now primarily focussed on card games. Any requests are appreciated (submit a ticket) as I'm looking for ways of expanding this collection of library

## Current Libraries

- ti.gamedevkit/cards
- ti.gamedevkit/chips

## Installation

To install, copy any library file you want to have to your project, plus copy the assets folder as well (keep directory structure). 

**Dependency**: You need to install the [to.imagecache](https://github.com/Topener/To.ImageCache/) module as well.

### ti.gamedevkit.cards

The cards library allows you to instantly make a deck of cards, with helper functions like shuffle, flip and animate to position.

**Usage** 

First, you need to create a new `DeckInstance`

```js
var deckInstance = new (require('ti.gamedevkit/cards'))({
    backImage: '/path/to/image.png', 
    animationSpeed: 750
});
```

There are 2 properties that can be provided at this stage. 

- **backImage** - the image on the backside of the card. Good dimension for back is 932 x 1376 (or that ratio). Image has to be local
- **animationSpeed** - For all animation purposes, like flip or animateTo

`DeckInstance` has a couple exposed methods

- **createDeck(deckArgs)** - Creates a new deck of playing cards. Will return an array of all 52 cards
- **getDeck(deckArgs)** - returns existing deck of cards, or will generate a new deck if one has not yet been created
- **createCard(deckArgs)** - Create a new card with custom attributes.
  
  `deckArgs` is an object which contains configuration for creation of the cards. Most properties are only used for the `createCard` method
   - **left** - The left/x property for positioning of the card(s)
   - **top** - The top/y property for positioning of the card(s)
   - **height** - The height of the card, width is deducted from this
   - **type** - (createCard only) - The type of the card. Posibilities: hearts/clubs/diamonds/spades
   - **number** - (createCard only) - The number of the card. Commonly 2-10 & J/Q/K/A
   - **face** - (createCard only) - The facing of the card (back/front)
   - **hand** - (createCard Only) - The hand the card is supposed to be in, up to your own interpretation. Default is `main`
   - **state** - (createCard only) - State of the hand, up to your interpretation. Set to "deck" when using `createDeck` method 
- **dealDeckCardToPosition()** - deals the top card to a new position and returns said card

- **setBackImage()** - Set the back image for all cards provided
- **shuffle()** - will shuffle cards randomly, using zIndex for UI purposes
- **reset()** - Resets all cards to original position and flips them with backs up, then does a shuffle
- **getBack()** returns a blob of the image for the backside of the cards
- **getTopCardFromDeck()** - Based on sorting of the deck will return the card on the top

  * 
  *
