/*
 * Exercise 1
 * What happens here? What is this and what’s o?
 */
function F() {
  function C() {
    return this;
  }
  return C();
}
var o = new F();
/*
 * Here this === window because C() was called without new.
 * Also o === window because new F() returns the object returned by C() which is 
 * this, and this is window. You can make the call to C() a constructor call:
 */
function F() {
  function C() {
    return this;
  }
  return new C();
}
var o = new F();
/* 
 * Here this is the object created by the C constructor. So is o.
 */
o.constructor.name; //"C"
/*
 * It becomes more interesting with ES5's strict mode. In strict mode, non-constructor 
 * invocations result in this being undefined, not the global object. With "use strict" 
 * inside F() or C()'s body, this would be undefined in C(). Therefore return C() 
 * cannot return the non-object undefined (because all constructor invocations return 
 * some sort of object) and returns F's this (which is in the closure scope). Try 
 * it:
 */
function F() {
  "use strict";
  this.name = "I am F()";
  function C() {
    console.log(this); // undefined
    return this;
  }
  return C();
}
/*
 * Testing:
 */
var o = new F();
o.name; //"I am F()"
/* 
 * Exercise 2 
 * What happens when invoking this constructor with new?
 */
function C() {
  this.a = 1;
  return false;
}
/*
 * And testing:
 */
typeof new C(); //"object"
new C().a; //1
/*
 * new C() is an object, not boolean, because constructor invocations always produce 
 * an object. It's the this object you get unless you return some other object in 
 * your constructor. Returning non-objects doesn't work and you still get this.
 */
/*
 * Exercise 3
 * What does this do?
 */
var c = [1, 2, [1, 2]];
c.sort();
c; //[1, Array[2], 2]
/*
 * This is because sort() compares strings. [1, 2].toString() is "1,2" so it comes 
 * after "1" and before "2". Same thing with join():
 */
c.join('--');
c; //"1--1,2--2"
/*
 * Exercise 4
 * Pretend String() doesn't exist and create MyString() mimicking String(). Treat 
 * the input primitive strings as arrays (array access officially supported in ES5).
 * Here's a sample implementation with just the methods the exercise asked for. 
 * Feel free to continue with the rest of the methods. See Appendix C for the full 
 * list.
 */
function MyString(input) {
  var index = 0;

  // cast to string
  this._value = '' + input;

  // set all numeric properties for array access
  while (input[index] !== undefined) {
    this[index] = input[index];
    index++;
  }

  // remember the length
  this.length = index;
}

MyString.prototype = {
  constructor: MyString,
  valueOf: function valueOf() {
    return this._value;
  },
  toString: function toString() {
    return this.valueOf();
  },
  charAt: function charAt(index) {
    return this[parseInt(index, 10) || 0];
  },
  concat: function concat() {
    var prim = this.valueOf();
    for (var i = 0, len = arguments.length; i < len; i++) {
      prim += arguments[i];
    }
    return prim;
  },
  slice: function slice(from, to) {
    var result = '',
        original = this.valueOf();
    if (from === undefined) {
      return original;
    }
    if (from > this.length) {
      return result;
    }
    if (from < 0) {
      from = this.length - from;
    }
    if (to === undefined || to > this.length) {
      to = this.length;
    }
    if (to < 0) {
      to = this.length + to;
    }
    // end of validation, actual slicing loop now
    for (var i = from; i < to; i++) {
      result += original[i];
    }
    return result;
  },
  split: function split(re) {
    var index = 0,
        result = [],
        original = this.valueOf(),
        match,
        pattern = '',
        modifiers = 'g';

    if (re instanceof RegExp) {
      // split with regexp but always set "g"
      pattern = re.source;
      modifiers += re.multiline  ? 'm' : '';
      modifiers += re.ignoreCase ? 'i' : '';
    } else {
      // not a regexp, probably a string, we'll convert it
      pattern = re;
    }
    re = RegExp(pattern, modifiers);

    while (match = re.exec(original)) {
      result.push(this.slice(index, match.index));
      index = match.index + new MyString(match[0]).length;
    }
    result.push(this.slice(index));
    return result;
  }
};
/*
 * Testing:
 */
var s = new MyString('hello');
s.length; //5
s[0]; //"h"
s.toString(); //"hello"
s.valueOf(); //"hello"
s.charAt(1); //"e"
s.charAt('2'); //"l"
s.charAt('e'); //"h"
s.concat(' world!'); //"hello world!"
s.slice(1, 3); //"el"
s.slice(0, -1); //"hell"
s.split('e'); //["h", "llo"]
s.split('l'); //["he", "", "o"]
/*
 * Feel free to play splitting with a regular expression.
 */

MyString.prototype.reverse = function reverse() {
    return this.valueOf().split("").reverse().join("");
  };
new MyString("pudding").reverse(); //"gniddup"
/*
 * Exercise 6
 * Imagine Array() is gone and the world needs you to implement MyArray(). Here 
 * are a handful of methods to get you started:
 */
function MyArray(length) {
  // single numeric argument means length
  if (typeof length === 'number' &&
      arguments[1] === undefined) {
    this.length = length;
    return this;
  }
  
  // usual case
  this.length = arguments.length;
  for (var i = 0, len = arguments.length; i < len; i++) {
    this[i] = arguments[i];
  }
  return this;
  
  // later in the book you'll learn how to support
  // a non-constructor invocation too
}

MyArray.prototype = {
  constructor: MyArray,
  join: function join(glue) {
    var result = '';
    if (glue === undefined) {
      glue = ',';
    }
    for (var i = 0; i < this.length - 1; i++) {
      result += this[i] === undefined ? '' : this[i];
      result += glue;
    }
    result += this[i] === undefined ? '' : this[i];
    return result;
  },
  toString: function toString() {
    return this.join();
  },
  push: function push() {
    for (var i = 0, len = arguments.length; i < len; i++) {
      this[this.length + i] = arguments[i];
    }
    this.length += arguments.length;
    return this.length;
  },
  pop: function pop() {
    var poppd = this[this.length - 1];
    delete this[this.length - 1];
    this.length--;
    return poppd;
  }
};
/*
 * Testing:
 */
var a = new MyArray(1, 2, 3, "test");
a.toString(); //"1,2,3,test"
a.length; //4
a[a.length - 1]; //"test"
a.push('boo'); //5
a.toString(); //"1,2,3,test,boo"
a.pop(); //"boo"
a.toString(); //"1,2,3,test"
a.join(','); //"1,2,3,test"
a.join(' isn\'t '); //"1 isn't 2 isn't 3 isn't test"
/*
 * If you found this exercise amusing, don't stop with the join(); go on with as many methods as possible.
 */

/*
 * Exercise 7
 * Create MyMath object that also has rand(), min([]), max([]);
 * The point here is that Math is not a constructor, but an object that has some 
 * "static" properties and methods. Below are some methods to get you started. Let's 
 * also use an immediate function to keep some private utility functions. You can 
 * also take this approach with MyString above, where this._value could be really 
 * private. 
 */
var MyMath = (function () {

  function isArray(ar) {
    return
      Object.prototype.toString.call(ar) ===
        '[object Array]';
  }

  function sort(numbers) {
    // not using numbers.sort() directly because
    // `arguments` is not an array and doesn't have sort()
    return Array.prototype.sort.call(numbers, function (a, b) {
      if (a === b) {
        return 0;
      }
      return  1 * (a > b) - 0.5; // returns 0.5 or -0.5
   });
  }

  return {
    PI:   3.141592653589793,
    E:    2.718281828459045,
    LN10: 2.302585092994046,
    LN2:  0.6931471805599453,
    // ... more constants
    max: function max() {
      // allow unlimitted number of arguments
      // or an array of numbers as first argument
      var numbers = arguments;
      if (isArray(numbers[0])) {
        numbers = numbers[0];
      }
      // we can be lazy: 
      // let Array sort the numbers and pick the last
      return sort(numbers)[numbers.length - 1];
    },
    min: function min() {
      // different approach to handling arguments:
      // call the same function again
      if (isArray(numbers)) {
        return this.min.apply(this, numbers[0]);
      }

      // Different approach to picking the min:
      // sorting the array is an overkill, it’s too much 
      // work since we don't worry about sorting but only 
      // about the smallest number.
      // So let's loop:
      var min = numbers[0];
      for (var i = 1; i < numbers.length; i++) {
        if (min > numbers[i]) {
          min = numbers[i];
        }
      }
      return min;
    },
    rand: function rand(min, max, inclusive) {
      if (inclusive) {
        return Math.round(Math.random() * (max - min) + min);
        // test boundaries for random number
        // between 10 and 100 *inclusive*:
        // Math.round(0.000000 * 90 + 10); // 10
        // Math.round(0.000001 * 90 + 10); // 10
        // Math.round(0.999999 * 90 + 10); // 100

      }
      return Math.floor(Math.random() * (max - min - 1) + min + 1);
      // test boundaries for random number
      // between 10 and 100 *non-inclusive*:
      // Math.floor(0.000000 * (89) + (11)); // 11
      // Math.floor(0.000001 * (89) + (11)); // 11
      // Math.floor(0.999999 * (89) + (11)); // 99
    }
  };
})();
/*
 * After you have finished the book and know about ES5 you can try using defineProperty() 
 * for tighter control and closer replication of the built-ins.
 */