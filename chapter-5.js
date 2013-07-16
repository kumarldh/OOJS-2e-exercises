/*
 * Exercise 1
 * Create an object called shape that has a type property and a getType() method.
 */
var shape = {
  type: 'shape',
  getType: function () {
    return this.type;
  }
};
/*
 * Exercise 2: A Triangle() constructor
 */
function Triangle(a, b, c) {
  this.a = a;
  this.b = b;
  this.c = c;
}
Triangle.prototype = shape;
Triangle.prototype.constructor = Triangle;
Triangle.prototype.type = 'triangle';
/*
 * Exercise 3: Adding getPerimeter() method
 */
Triangle.prototype.getPerimeter = function () {
  return this.a + this.b + this.c;
};
/*
 * Exercise 4: Test
 */
var t = new Triangle(1, 2, 3);
t.constructor === Triangle; //true
shape.isPrototypeOf(t); //true
t.getPerimeter(); //6
t.getType(); //"triangle"
/*
 * Exercise 5. Loop over t showing only own properties and methods:
 */
for (var i in t) {
  if (t.hasOwnProperty(i)) {
    console.log(i, '=', t[i]);
  }
}
/*
 * Exercise 6. Randomize array elements
 */
Array.prototype.shuffle = function () {
  return this.sort(function () {
    return Math.random() - 0.5;
  });
};
/*
 * Testing:
 */
[1, 2, 3, 4, 5, 6, 7, 8, 9].shuffle(); //[4, 2, 3, 1, 5, 6, 8, 9, 7]
[1, 2, 3, 4, 5, 6, 7, 8, 9].shuffle(); //[2, 7, 1, 3, 4, 5, 8, 9, 6]
[1, 2, 3, 4, 5, 6, 7, 8, 9].shuffle(); //[4, 2, 1, 3, 5, 6, 8, 9, 7]