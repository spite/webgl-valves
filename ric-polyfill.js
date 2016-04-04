// please read this conversation before making any decision
// https://twitter.com/WebReflection/status/648925435120734208
var requestIdleCallback = requestIdleCallback || (function (rAF) {
  // (C) Andrea Giammarchi - @WebReflection - Mit Style
  function Deadline(timemout) {
    this._now = Date.now();
    this._timemout = this._now + timemout;

    Object.defineProperty( this, 'didTimeout', {
        get: function() {
            return this._timemout <= Date.now();
        }
    } );


  }
  Deadline.prototype.timeRemaining = function () {
      return Math.max(0, this._timemout - Date.now());
    }
    
   /* Deadline.prototype.didTimeout
    didTimeout: {
      get: function () {
        return this._timemout <= Date.now();
      },
      set: Object
    }
  });*/
  return function requestIdleCallback(callback, maxDelay) {
    var
      start,
      previously,
      // remember JPU in 2007 ?
      // http://webreflection.blogspot.de/2007/09/jpu-javascript-cpu-monitor.html
      // here we assume that busy means it cannot execute within 20ms
      // something that should actually go around 16
      busy = 20,
      delay = Math.abs(maxDelay || 50),
      dl = new Deadline(delay),
      loop = function loop(now) {
        if (!start) {
          start = now;
          // skip actually the first check regardless
          // since the minimum is 50ms
          previously = now - busy;
        }
        if ((now - previously) < busy || dl.didTimeout) {
          rID = 0;
          callback(dl);
        } else {
          previously = now;
          rID = rAF(loop);
        }
      },
      rID = rAF(loop)
    ;
    return function(){ return rID; };
  };
}(requestAnimationFrame));

var cancelIdleCallback = cancelIdleCallback || function (rICBack) {
  cancelAnimationFrame(rICBack());
};