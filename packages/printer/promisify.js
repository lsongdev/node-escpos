
module.exports = printer => {
  const Printer = printer.constructor;
  const names = Object.getOwnPropertyNames(Printer.prototype);
  names // no need wait functions
  .filter(name => ~['constructor', 'flush', 'close'].indexOf(name))
  .forEach(name => {
    const fn = printer[ name ];
    printer[ name ] = function(){
      return Promise.resolve(fn.apply(printer, arguments));
    }
  });
  // need callback
  [ 'flush', 'close' ].forEach((name) => {
    const fn = printer[name];
    printer[name] = (...args) => {
      return new Promise((resolve, reject) => {
        fn(...args, (err, ...others) => {
          if(err) return reject(err);
          resolve(others);
        });
      });
    }
  });
  return printer;
};
