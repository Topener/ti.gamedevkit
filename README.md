# Titanium Game Dev Kit

The Titanium Game Dev Kit contains multiple libraries for making simple games. Right now primarily focussed on card games. 

Any requests are appreciated (submit a ticket) as I'm looking for ways of expanding this collection of libraries

## Current Libraries

- [ti.gamedevkit/cards](#tigamedevkitcards)
- [ti.gamedevkit/chips](#tigamedevkitchips)

## Installation

To install, copy any library file you want to have to your project, plus copy the assets folder as well (keep directory structure). 

**Dependency**: You need to install the [to.imagecache](https://github.com/Topener/To.ImageCache/) module as well.

## General note
All libraries are "to-be-used" on a wrapping view you can call your canvas. All elements created rely on positioning based on top/left. For complicated positioning you'll have to keep track of calculations for all positions. This is not build in any of the libraries.

### ti.gamedevkit/cards

The cards library allows you to instantly make a deck of cards, with helper functions like shuffle, flip and animate to position.

**Usage** 

First, you need to create a new `DeckInstance`

```js
var deckInstance = new (require('ti.gamedevkit/cards'))({
    backImage: '/path/to/image.png', 
    animationSpeed: 750
});
```

#### DeckInstance

The deckInstance needs to be created with the following arguments, as also displayed in sample above.

**Arguments** 

- **backImage** - the image on the backside of the card. Good dimension for back is 932 x 1376 (or that ratio). Image has to be local
- **animationSpeed** - For all animation purposes, like flip or animateTo

The deckInstance also has a list of methods exposed

**Methods**

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
- **dealDeckCardToPosition(top, left, flip)** - deals the top card to a new position and returns said card. Provide the top/left positioning attributes for position to animate the card to. An optional flip attribute if you want the card flipped after animation.
- **setBackImage(image)** - Set the back image for all cards provided. Provide blob or local image path. 
- **shuffle()** - will shuffle cards randomly, using zIndex for UI purposes
- **reset()** - Resets all cards to original position and flips them with backs up, then does a shuffle
- **getBack()** returns a blob of the image for the backside of the cards
- **getTopCardFromDeck()** - Based on sorting of the deck will return the card on the top

#### Card

A single card, created through either `deckInstance.createDeck()` or `deckInstance.createCard()` is a View with a nested ImageView containing the card itself. This card has a couple custom properties exposed you can use for identifying the card.

**Properties**

- **face** - The face of the card. Either "front" or "back"
- **state** - The state of the card. Currently defaults to `deck` when using the `createDeck` method.
- **hand** - The hand the card is in. Free to your interpretation. Defaults to "main"
- **number** - The number of the card (2-10 or J/Q/K/A)
- **type** - Type of the card. hearts/clubs/diamonds/spades

**Methods**

- **flip()** - Flips the card
- **animateTo(top ,left, flip)** - Animate the card to the provided top/left position. Optionally a 3rd parameter for if you want the card to flip after animation is done


### ti.gamedevkit/chips

The Chips library is for creating poker chips. There is no logic in this besides a fun "flip" animation.

**Usage**

You can create chips through both Alloy and classic code.

```js
var chip = require('ti.gamedevkit/chips').createChip({
    width: 200,
    value: 25,
    left: 100,
    top: 100
});
```

Alloy:

```xml
    <Chip module="ti.gamedevkit/chips" value="25" left="100" top="100" width="200" />
```

Both methods will result in the same chip element to be created. This chip element has a couple properties exposed

**Properties**
- **value** - The value provided in the createChip method
- **color** - The #hex value of the color of the chip

**Methods**
- **flip()** - Flips the chip. Resulting chip will be same as start, but it is a nice-to-have animation during gameplay

#### Chip Values

The build in chip values (with colors) are
- 1 (#FCFFFA)
- 5 (#90382C)
- 25 (#007533)
- 50 (#0056D6)
- 100 (#222222)

*Note: There currently is no way to override the colors or values unless you hardcode new values in library. (PR is welcome for this). Also, with the white chip (value 1) blue icons are used instead of white (due to conflicting colors otherwise). Keep this in mind with adjusting colors*
