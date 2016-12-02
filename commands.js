/**
 * ESC/POS _ (Constants)
 */
var _ = {
  LF  : '\x0a',
  FS  : '\x1c',
  FF  : '\x0c',
  GS  : '\x1d',
  DLE : '\x10',
  EOT : '\x04',
  NUL : '\x00',
  ESC : '\x1b',
  EOL : '\n'
};


/**
 * [FEED_CONTROL_SEQUENCES Feed control sequences]
 * @type {Object}
 */
_.FEED_CONTROL_SEQUENCES = {
  CTL_LF  : '\x0a',   // Print and line feed
  CTL_FF  : '\x0c',   // Form feed
  CTL_CR  : '\x0d',   // Carriage return
  CTL_HT  : '\x09',   // Horizontal tab
  CTL_VT  : '\x0b',   // Vertical tab
};

_.LINE_SPACING = {
  LS_DEFAULT : '\x1b\x32',
  LS_SET     : '\x1b\x33'
};

/**
 * [HARDWARE Printer hardware]
 * @type {Object}
 */
_.HARDWARE = {
  HW_INIT   : '\x1b\x40'         , // Clear data in buffer and reset modes
  HW_SELECT : '\x1b\x3d\x01'     , // Printer select
  HW_RESET  : '\x1b\x3f\x0a\x00' , // Reset printer hardware
};

/**
 * [CASH_DRAWER Cash Drawer]
 * @type {Object}
 */
_.CASH_DRAWER = {
  CD_KICK_2 : '\x1b\x70\x00'      , // Sends a pulse to pin 2 []
  CD_KICK_5 : '\x1b\x70\x01'      , // Sends a pulse to pin 5 []
};

/**
 * [PAPER Paper]
 * @type {Object}
 */
_.PAPER = {
  PAPER_FULL_CUT  : '\x1d\x56\x00' , // Full cut paper
  PAPER_PART_CUT  : '\x1d\x56\x01' , // Partial cut paper
  PAPER_CUT_A     : '\x1d\x56\x41' , // Partial cut paper
  PAPER_CUT_B     : '\x1d\x56\x42' , // Partial cut paper
};

/**
 * [TEXT_FORMAT Text format]
 * @type {Object}
 */
_.TEXT_FORMAT = {
  TXT_NORMAL      : '\x1b\x21\x00', // Normal text
  TXT_2HEIGHT     : '\x1b\x21\x10', // Double height text
  TXT_2WIDTH      : '\x1b\x21\x20', // Double width text

  TXT_UNDERL_OFF  : '\x1b\x2d\x00', // Underline font OFF
  TXT_UNDERL_ON   : '\x1b\x2d\x01', // Underline font 1-dot ON
  TXT_UNDERL2_ON  : '\x1b\x2d\x02', // Underline font 2-dot ON
  TXT_BOLD_OFF    : '\x1b\x45\x00', // Bold font OFF
  TXT_BOLD_ON     : '\x1b\x45\x01', // Bold font ON

  TXT_FONT_A      : '\x1b\x4d\x00', // Font type A
  TXT_FONT_B      : '\x1b\x4d\x01', // Font type B
  TXT_FONT_C      : '\x1b\x4d\x02', // Font type C

  TXT_ALIGN_LT    : '\x1b\x61\x00', // Left justification
  TXT_ALIGN_CT    : '\x1b\x61\x01', // Centering
  TXT_ALIGN_RT    : '\x1b\x61\x02', // Right justification
};

/**
 * [BARCODE_FORMAT Barcode format]
 * @type {Object}
 */
_.BARCODE_FORMAT = {
  BARCODE_TXT_OFF : '\x1d\x48\x00' , // HRI barcode chars OFF
  BARCODE_TXT_ABV : '\x1d\x48\x01' , // HRI barcode chars above
  BARCODE_TXT_BLW : '\x1d\x48\x02' , // HRI barcode chars below
  BARCODE_TXT_BTH : '\x1d\x48\x03' , // HRI barcode chars both above and below

  BARCODE_FONT_A  : '\x1d\x66\x00' , // Font type A for HRI barcode chars
  BARCODE_FONT_B  : '\x1d\x66\x01' , // Font type B for HRI barcode chars

  BARCODE_HEIGHT  : '\x1d\x68\x64' , // Barcode Height [1-255]
  BARCODE_WIDTH   : '\x1d\x77\x03' , // Barcode Width  [2-6]

  BARCODE_UPC_A   : '\x1d\x6b\x00' , // Barcode type UPC-A
  BARCODE_UPC_E   : '\x1d\x6b\x01' , // Barcode type UPC-E
  BARCODE_EAN13   : '\x1d\x6b\x02' , // Barcode type EAN13
  BARCODE_EAN8    : '\x1d\x6b\x03' , // Barcode type EAN8
  BARCODE_CODE39  : '\x1d\x6b\x04' , // Barcode type CODE39
  BARCODE_ITF     : '\x1d\x6b\x05' , // Barcode type ITF
  BARCODE_NW7     : '\x1d\x6b\x06' , // Barcode type NW7
  BARCODE_CODE93  : '\x1d\x6b\x07' , // Barcode type CODE93
  BARCODE_CODE128 : '\x1d\x6b\x08' , // Barcode type CODE128
};

/**
 * [CODE2D_FORMAT description]
 * @type {Object}
 */
_.CODE2D_FORMAT = {
  TYPE_PDF417     : _.GS  + 'Z' + '\x00',
  TYPE_DATAMATRIX : _.GS  + 'Z' + '\x01',
  TYPE_QR         : _.GS  + 'Z' + '\x02',
  CODE2D          : _.ESC + 'Z'         ,
  QR_LEVEL_L      : 'L', // correct level 7%
  QR_LEVEL_M      : 'M', // correct level 15%
  QR_LEVEL_Q      : 'Q', // correct level 25%
  QR_LEVEL_H      : 'H'  // correct level 30%
};

/**
 * [IMAGE_FORMAT Image format]
 * @type {Object}
 */
_.IMAGE_FORMAT = {
  S_RASTER_N      : '\x1d\x76\x30\x00' , // Set raster image normal size
  S_RASTER_2W     : '\x1d\x76\x30\x01' , // Set raster image double width
  S_RASTER_2H     : '\x1d\x76\x30\x02' , // Set raster image double height
  S_RASTER_Q      : '\x1d\x76\x30\x03' , // Set raster image quadruple
};

/**
 * [BITMAP_FORMAT description]
 * @type {Object}
 */
_.BITMAP_FORMAT = {
  BITMAP_S8     : '\x1b\x2a\x00',
  BITMAP_D8     : '\x1b\x2a\x01',
  BITMAP_S24    : '\x1b\x2a\x20',
  BITMAP_D24    : '\x1b\x2a\x21'
};

/**
 * [GSV0_FORMAT description]
 * @type {Object}
 */
_.GSV0_FORMAT = {
  GSV0_NORMAL   : '\x1d\x76\x30\x00',
  GSV0_DW       : '\x1d\x76\x30\x01',
  GSV0_DH       : '\x1d\x76\x30\x02',
  GSV0_DWDH     : '\x1d\x76\x30\x03'
};



/**
 * [exports description]
 * @type {[type]}
 */
module.exports = _;
