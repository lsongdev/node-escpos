var getPixels = require("get-pixels")

var Image = function(){
  return this;
};

Image.prototype.convert = function(){
  var shape   = this.pixels.shape;
  var width   = shape[0];
  var height  = shape[1];
  var size = { width : 0, height: 0 };
  // console.log(shape);
  var border = this.border(width);
  var borderLeft  = new Array(parseInt(border.x)).join('0');
  var borderRight = new Array(parseInt(border.y)).join('0');

  var pix_line = '';
  var image_mask = '1X0';

  var _R = 0;
  var _G = 1;
  var _B = 2;
  var _A = 3;

  var r, g, b, color, swt = 0;

  for(var y=0;y<height;y++){
    size.height += 1;
    size.width  += border.x;
    pix_line    += borderLeft;

    // for(var x=0;x<width;x++){
    //   size.width += 1;
    //   r = this.pixels.get(x, y, _R);
    //   g = this.pixels.get(x, y, _G);
    //   b = this.pixels.get(x, y, _B);
    //
    //   color = r + g + b;
    //   swt   = (swt - 1) * -1;
    //
    //   // for(var k in image_mask){
    //   //   if(color <= 255 * 3 / image_mask.length * ( k + 1 )){
    //   //     if(image_mask[k] == 'X'){
    //   //       pix_line += swt;
    //   //     }else{
    //   //       pix_line += image_mask[k];
    //   //     }
    //   //     break;
    //   //   }else if(color > (255 * 3 / image_mask.length * image_mask.length) && color <= 255 * 3){
    //   //     pix_line += image_mask[2];
    //   //     break;
    //   //   }
    //   // }
    //   pix_line += borderRight;
    //   size.width += border.y;
    //   console.log(pix_line, size);
    // }
  }
  console.log(pix_line);
};

Image.prototype.border = function(size){
  var BIT32  = 32;
  var result = { x: 0, y: 0 };
  if(size % BIT32 == 0){
    return result;
  }
  var border = BIT32 - ( size % BIT32 );
  result.x  = border / 2;
  result.y  = border / 2;
  if(border % 2 != 0) result.y += 1;
  return result;
};

Image.prototype.open = function(filename, callback){
  var self = this;
  getPixels(filename, function(err, pixels){
    self.pixels = pixels;
    callback.apply(self, arguments);
  });
};


new Image().open('/Users/Lsong/Desktop/qr.png', function(){
  this.convert();
});
