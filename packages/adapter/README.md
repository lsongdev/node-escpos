
## Adapter

### Constructors

You can choose your adapter type as USB, Serial, Bluetooth, Network, or Console.

### Methods

#### open(function callback[err])

Claims the current device USB (or other device type), if the printer is already in use by other process this will fail and return the error parameter.

By default, the USB adapter will set the first printer found .

Triggers the callback function when done.

#### close(function callback)

Closes the current device and releases its USB interface.

----
