/*
 * Exercise 1
 * Multiple inheritance by mixing into the prototype, e.g.:
 * var my = objectMulti(obj, another_obj, a_third, {
 *   additional: "properties"
 * });
 */
/*
 * A possible solution:
 */
function objectMulti() {
  var Constr,
      i,
      prop,
      mixme;

  // constructor that sets own properties
  var Constr = function (props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  };

  // mix into the prototype
  for (var i = 0; i < arguments.length - 1; i++) {
    var mixme = arguments[i];
    for (var prop in mixme) {
      Constr.prototype[prop] = mixme[prop];
    }
  }

  return new Constr(arguments[arguments.length - 1]);
}
/*
 * Testing:
 */
var obj_a = {a: 1};
var obj_b = {a: 2, b: 2};
var obj_c = {c: 3};
var my = objectMulti(obj_a, obj_b, obj_c, {hello: "world"});
my.a; //2
/*
 * Property a is 2 because obj_b overwrote the property with the same name from 
 * obj_a (last one wins).
 */
my.b; //2
my.c; //3
my.hello; //"world"
my.hasOwnProperty('a'); //false
my.hasOwnProperty('hello'); //true
/*
 * Exercise 2
 * Practice with the canvas example at http://www.phpied.com/files/canvas/
 * 2.1. Drawing a few triangles, squares, and rectangles
 */
new Triangle(
  new Point(100, 155),
  new Point(30, 50),
  new Point(220, 00)
).draw();

new Triangle(
  new Point(10, 15),  
  new Point(300, 50),
  new Point(20, 400)
).draw();

new Square(new Point(150, 150), 300).draw();
new Square(new Point(222, 222), 222).draw();

new Rectangle(new Point(100, 10), 200, 400).draw();
new Rectangle(new Point(400, 200), 200, 100).draw();
/*
 * 2.2. Add Rhombus, Kite, Pentagon, Trapezoid, Circle (reimplements draw());
 */

function Kite(center, diag_a, diag_b, height) {
  this.points = [
    new Point(center.x - diag_a / 2, center.y),
    new Point(center.x, center.y + (diag_b - height)),
    new Point(center.x + diag_a / 2, center.y),
    new Point(center.x, center.y - height)
  ];
  this.getArea = function () {
    return diag_a * diag_b / 2;
  };
}

function Rhombus(center, diag_a, diag_b) {
  Kite.call(this, center, diag_a, diag_b, diag_b / 2);
}

function Trapezoid(p1, side_a, p2, side_b) {
  this.points = [
    p1,
    p2,
    new Point(p2.x + side_b, p2.y),
    new Point(p1.x + side_a, p1.y)
  ];

  this.getArea = function () {
    var height = p2.y - p1.y;
    return height * (side_a + side_b) / 2;
  };
}

// regular pentagon, all edges have the same length
function Pentagon(center, edge) {
  var r = edge / (2 * Math.sin(Math.PI / 5)),
      x = center.x,
      y = center.y;

  this.points = [
    new Point(x + r, y),
    new Point(x + r * Math.cos(2 * Math.PI / 5), y - r * Math.sin(2 * Math.PI / 5)),
    new Point(x - r * Math.cos(    Math.PI / 5), y - r * Math.sin(    Math.PI / 5)),
    new Point(x - r * Math.cos(    Math.PI / 5), y + r * Math.sin(    Math.PI / 5)),
    new Point(x + r * Math.cos(2 * Math.PI / 5), y + r * Math.sin(2 * Math.PI / 5))
  ];

  this.getArea = function () {
    return 1.72 * edge * edge;
  };
}

function Circle(center, radius) {
  this.getArea = function () {
    return Math.pow(radius, 2) * Math.PI;
  };
  
  this.getPerimeter = function () {
    return 2 * radius * Math.PI;
  };  
  
  this.draw = function () {
    var ctx = this.context;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  };
}

(function () {
  var s = new Shape();
  Kite.prototype = s;
  Rhombus.prototype = s;
  Trapezoid.prototype = s;
  Pentagon.prototype = s;
  Circle.prototype = s;
}());
Testing:
new Kite(new Point(300, 300), 200, 300, 100).draw();
new Rhombus(new Point(200, 200), 350, 200).draw();
new Trapezoid(
  new Point(100, 100), 100, 
  new Point(50, 250), 400).draw();
new Pentagon(new Point(400, 400), 100).draw();
new Circle(new Point(500, 300), 270).draw();
/*
 * The result of testing the new shapes
 */

/*
 * Exercises 3 and 4
 * Think of another way to do the inheritance part. Use uber so kids can have access 
 * to their parents. Also get parents to be aware of their children.
 * Keep in mind that not all children inherit Shape, e.g. Rhombus inherits Kite 
 * and Square inherits Rectangle. You end up with something like:
 */
// inherit(Child, Parent)
inherit(Rectangle, Shape);
inherit(Square, Rectangle);
/*
 * In the inheritance pattern from the chapter and the previous exercise, all 
 * children were sharing the same prototype, e.g.:
 */
var s = new Shape();
Kite.prototype = s;
Rhombus.prototype = s;
/*
 * While this is convenient, it also means no one can touch the prototype because 
 * it will affect everyone else's. The drawback is that all custom methods need to 
 * be own properties, e.g. this.getArea.
 * It's a good idea to have methods shared among instances and defined in the prototype 
 * instead of recreating them for every object. The following example moves the 
 * custom getArea() methods to the prototype.
 * In the inheritance function you’ll see, the children only inherit the parent’s 
 * prototype. So own properties such as this.lines will not be set. Therefore you 
 * need to have each child constructor call its uber in order to get the own properties, 
 * e.g.
 * Child.prototype.uber.call(this, args...)
 * Another nice-to-have is carrying over the prototype properties already added 
 * to the child. This allows the child to inherit first and then add more customizations 
 * or the other way around as well, which is just a little more convenient.
 */
function inherit(Child, Parent) {
  // remember prototype
  var extensions = Child.prototype;

  // inheritance with an intermediate F()
  var F = function () {};
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  // reset constructor
  Child.prototype.constructor = Child;
  // remember parent
  Child.prototype.uber = Parent;

  // keep track of who inherits the Parent
  if (!Parent.children) {
    Parent.children = [];
  }
  Parent.children.push(Child);

  // carry over stuff previsouly added to the prototype
  // because the prototype is now overwritten completely
  for (var i in extensions) {
    if (extensions.hasOwnProperty(i)) {
      Child.prototype[i] = extensions[i];
    }
  }
}
/*
 * Everything about Shape(), Line() and Point() stays the same. The changes are in the children only:
 */
function Triangle(a, b, c) {
  Triangle.prototype.uber.call(this);
  this.points = [a, b, c];
}

Triangle.prototype.getArea = function () {
  var p = this.getPerimeter(), s = p / 2;
  return Math.sqrt(s * (s - this.lines[0].length) * (s - this.lines[1].length) * (s - this.lines[2].length));
};


function Rectangle(p, side_a, side_b) {
  // calling parent Shape()
  Rectangle.prototype.uber.call(this);

  this.points = [
    p,
    new Point(p.x + side_a, p.y),
    new Point(p.x + side_a, p.y + side_b),
    new Point(p.x, p.y + side_b)
  ];
}

Rectangle.prototype.getArea = function () {
  // Previsouly we had access to side_a and side_b 
  // inside the constructor closure. No more.
  // option 1: add own properties this.side_a and this.side_b
  // option 2: use what we already have:
  var lines = this.getLines();
  return lines[0].length * lines[1].length;
};


function Square(p, side) {
  this.uber.call(this, p, side, side);
  // this call is shorter than Square.prototype.uber.call()
  // but may backfire in case you inherit 
  // from Square and call uber
  // try it :-)
}
/*
 * Inheritance:
 */
inherit(Triangle, Shape);
inherit(Rectangle, Shape);
inherit(Square, Rectangle);
/*
 * Testing:
 */
var sq = new Square(new Point(0, 0), 100);
sq.draw();
sq.getArea(); //10000
/*
 * Testing that instanceof is correct:
 */
sq.constructor === Square; //true
sq instanceof Square; //true
sq instanceof Rectangle; //true
sq instanceof Shape; //true
/*
 * The children arrays:
 */
Shape.children[1] === Rectangle; //true
Rectangle.children[0] === Triangle; //false
Rectangle.children[0] === Square; //true
Square.children; //undefined
/*
 * And uber looks ok too:
 */
sq.uber === Rectangle; //true
/*
 * Calling isPrototypeOf() also returns expected results:
 */
Shape.prototype.isPrototypeOf(sq); //true
Rectangle.prototype.isPrototypeOf(sq); //true
Triangle.prototype.isPrototypeOf(sq); //false
/*
 * The full code is available at http://www.phpied.com/files/canvas/index2.html together with the additional Kite(), Circle() and so on from the previous exercise.
 */