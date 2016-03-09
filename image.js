var _ = require('lodash');
var getPixels = require("get-pixels")

var rgb = function(pixel){
  return {
    r: pixel[0],
    g: pixel[1],
    b: pixel[2],
    a: pixel[3]
  };
};

var size = function(img){
  return {
    width : img.shape[0],
    height: img.shape[1],
    colors: img.shape[2]
  };
};

getPixels('/Users/Lsong/Desktop/test2x2.png', function(err, result){
  var pixels = _.chunk(result.data, size(result).colors).map(function(pixel){
    return rgb(pixel)
  })
  .map(function(colors){
    return _.omit(colors, 'a')
  })
  .map(function(pixel){
    return _.sum(_.values(pixel))
  })
  .map(function(color){
    return color / 255;
  })
  .map(function(color){
    return Math.floor(color);
  });
  console.log(pixels);
});
