var density = Ti.Platform.displayCaps.logicalDensityFactor;
var ic = require('To.ImageCache');
var chipColors = {
  1: '#FCFFFA',
  5: '#90382C',
  25: '#007533',
  50: '#0056D6',
  100: '#222222'
};
var imgf;

/**
 * 
 * @param {Object} Arguments, Should contain top, left, width and value properties
 */
var createChip = function(args) {

  var fileName = 'chip-' + args.width + '-' + args.value;

  var blob = ic.getBlob(fileName);
  if (!blob) {
      blob = createImage(args.value, args.width);
      ic.storeBlob(fileName, blob);
  }
  
  var wrapper = Ti.UI.createView({
    width: args.width,
    height: args.width,
    left: args.left,
    top: args.top
  });
  
  wrapper.add(Ti.UI.createImageView({
    image: blob,
    width: Ti.UI.FILL,
    height: Ti.UI.FILL,
    hires: true,
    touchEnabled: false
  }));
  
  wrapper.flip = flip;
  wrapper.turn = turn;
  wrapper.color = determineColor(args.value);
  wrapper.value = args.value;
  wrapper.side = "front";

  return wrapper;
};

/**
 * 
 * @param {integer} Determines the color of the chip based on the value 
 */
function determineColor(value) {
  var color = "#FCFFFA";

  if (chipColors.hasOwnProperty(value)){
    return chipColors[value];
  }

  return chipColors[1];
}

function flip() {
  var chip = this.children[0];
  var width = chip.width;
  chip.animate(Ti.UI.createAnimation({
    duration: 250,
    width: 1
  }), function(){
    chip.animate(Ti.UI.createAnimation({
      duration: 250,
      width: width
    }));
  });
}

function turn() {
  var wrapper = this;
  var chip = this.children[0];

  var sideView = Ti.UI.createView({
    width: chip.width,
    backgroundColor: wrapper.color,
    height: 0.1
  });

  var animationSpeed = 250;

  if (wrapper.side === "front") {
    wrapper.add(sideView);
    sideView.animate(Ti.UI.createAnimation({
      duration: animationSpeed,
      height: 20
    }));
    chip.animate(Ti.UI.createAnimation({
      duration: animationSpeed,
      height: 0.1
    }));
  }
  wrapper.side = "side";


}

function createImage(value, width) {
  if (!imgf) imgf = require('ti.imagefactory');
  var color = determineColor(value);
  var view = Ti.UI.createView({
    width: width * density,
    height: width * density,
    borderRadius: width * density / 2,
    backgroundColor: color,
    borderWidth: 1,
    borderColor: "#aaa"
  });
  
  var borderView = Ti.UI.createView({
    width: width * density / 1.4,
    height: width * density / 1.4,
    borderRadius: width * density / 1.4 / 2,
    backgroundColor: value === 1 ? '#11000000' : '#33000000',
    zIndex: 1
  });
  
  view.add(borderView);

  view.add(Ti.UI.createView({
    width: width * density / 1.5,
    height: width * density / 1.5,
    borderRadius: width * density / 1.5 / 2,
    backgroundColor: color,
    zIndex: 3
  }));


  var barView = Ti.UI.createView({
    width: width * density / 1.4,
    height: width * density / 1.4
  });
  
  barView.add(Ti.UI.createView({
    width: width * density / 13,
    top: 0,
    height: Ti.UI.FILL,
    backgroundColor: value === 1 ? "#0056D6"  : "#fff"
  }));
  
  /*
   WHITE BARS
  */
  var whiteBarImage = barView.toImage();
  borderView.add(createWhiteBarImage(whiteBarImage, 0, width));
  borderView.add(createWhiteBarImage(whiteBarImage, 30, width));  
  borderView.add(createWhiteBarImage(whiteBarImage, 60, width));  
  borderView.add(createWhiteBarImage(whiteBarImage, 90, width));  
  borderView.add(createWhiteBarImage(whiteBarImage, 120, width));  
  borderView.add(createWhiteBarImage(whiteBarImage, 150, width));  

  /*
    EDGE ICONS
  */

  createEdgeIcon(value === 1 ? 'diamonds_blue' : 'diamonds_white', 0, view, width);
  createEdgeIcon(value === 1 ? 'diamonds_blue' : 'diamonds_white', 180, view, width);


  createEdgeIcon(value === 1 ? 'clubs_blue' : 'clubs_white', 125, view, width);
  createEdgeIcon(value === 1 ? 'clubs_blue' : 'clubs_white', 305, view, width);

  createEdgeIcon(value === 1 ? 'spades_blue' : 'spades_white', 45, view, width);
  createEdgeIcon(value === 1 ? 'spades_blue' : 'spades_white', 225, view, width);

  createEdgeIcon(value === 1 ? 'hearts_blue' : 'hearts_white', 90, view, width);
  createEdgeIcon(value === 1 ? 'hearts_blue' : 'hearts_white', 270, view, width);


  view.add(Ti.UI.createLabel({
    font: {
      fontSize: width/3,
      fontWeight: 'bold'
    },
    color: value === 1 ? "#0056D6"  : "#fff",
    text: value,
    zIndex: 4
  }));

  return view.toImage();
}

function createEdgeIcon(type, rotation, view, width) {

  var icon = Ti.UI.createImageView({
    height: width * density / 9,
    image: '/images/icons/' + type + '.png',
    hires: true
  }).toImage();

  var image = Ti.UI.createImageView({
    height: width * density / (rotation % 90 === 0 ? 9 : 6.5),
    image: imgf.imageWithRotation(icon, {degrees: rotation}),
    hires: true
  });

  var positioning = width * density / 8.5;
  switch (rotation) {
    case 0: 
      image.top = 6;
    break;
    case 45:
      image.top = positioning;
      image.right = positioning;
    break;
    case 90: 
      image.right = 6;
    break;
    case 125:
      image.right = positioning;
      image.bottom = positioning;
    break;
    case 180: 
      image.bottom = 6;
    break;
    case 225:
      image.left = positioning;
      image.bottom = positioning;
    break;
    case 270: 
      image.left = 6;
    break;
    case 305:
      image.left = positioning;
      image.top = positioning;
    break;
  }

  view.add(image);
}

function createWhiteBarImage(blob, rotation, width) {
  var bar = imgf.imageWithRotation(blob, {degrees: rotation});
  var padding = rotation == 0 || rotation == 90 ? 0 : -50;
  return Ti.UI.createImageView({
    image: bar,
    top: padding,
    bottom: padding,
    right: padding,
    left: padding
  });
}

module.exports = {
  createChip: createChip
};
