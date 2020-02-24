
## ESCPOS Screen

## Installation

## Example

```js
```

### Constructors

#### Screen(device)

```javascript
const usbDevice = new escpos.USB();
const usbScreen = new escpos.Screen(usbDevice);

const serialDevice = new escpos.Serial('/dev/ttyUSB0');
const serialScreen = new escpos.Screen(serialDevice);

const bluetoothDevice = new escpos.Bluetooth('01:23:45:67:89:AB', 1);
const bluetoothScreen = new escpos.Screen(bluetoothDevice);

const networkDevice = new escpos.Network('localhost');
const networkScreen = new escpos.Screen(networkDevice);
```

### Methods

#### clear()

Clears all displayed characters.

#### clearLine()

Clears the line containing the cursor.

#### moveUp()

Moves the cursor up one line.

#### moveLeft()

Moves the cursor one character position to the left.

#### moveRight()

Moves the cursor one character position to the right.

#### moveDown()

Moves the cursor down one line.

#### moveHome()

Moves the cursor to the left-most position on the upper line (home position).

#### moveMaxRight()

Moves the cursor to the right-most position on the current line.

#### moveMaxLeft()

Moves the cursor to the left-most position on the current line.

#### moveBottom()

Moves the cursor to the bottom position.

#### move(n, m)

Moves the cursor to the nth position on the mth line.

#### overwrite()

Selects overwrite mode as the screen display mode.

#### verticalScroll()

Selects vertical scroll mode as the screen display mode.

#### horizontalScroll()

Selects horizontal scroll mode as the display screen mode.

#### cursor(display)

Turn cursor display mode on/off.

"display" Refers to the on/off boolean state.

#### blink(step)

Sets display screen blank interval.
"step" Refers to the blink interval. The interval [ON= step × 50 ms] / [OFF = step × 50 ms] is repeated.

#### timer(h, m)

Sets the counter time and displays it in the bottom right of the screen.
"h" Refers to hours: 0≤ h ≤ 23
"m" Refers to minutes: 0≤ m ≤ 59

#### displayTimer()

Displays the time counter at the right side of the bottom line.

#### brightness(level)

Sets the brightness of the fluorescent character display tube.
"level" Refers to brightness level: 1 ≤ level ≤ 4

#### reverse(n)

Selects or cancels reverse display of the characters received after this command.
"n" Refers selects/cancels reverse boolean state.

#### text("text", encodeType)

Prints raw text. Raises TextError exception.

For the encode type, see the [iconv-lite wiki document](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings). Escpos uses `iconv-lite` for encoding.

If the type is undefined, the default type is GB18030.

#### encode("encodeType")

Sets the encoding value globally. default type is GB18030 (Chinese)

#### close(function callback)

Flush buffer and closes the current device.

----
