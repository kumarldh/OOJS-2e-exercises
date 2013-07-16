/*
 * Exercise 1: Convert hex colors to rgb()
 */
function getRGB(hex) {
  return "rgb(" +
    parseInt(hex[1] + hex[2], 16) + ", " +
    parseInt(hex[3] + hex[4], 16) + ", " +
    parseInt(hex[5] + hex[6], 16) + ")";
}
/*
 * Testing:
 */
getRGB("#00ff00"); //"rgb(0, 255, 0)"
getRGB("#badfad"); //"rgb(186, 223, 173)"
/*
 * One problem with this solution is that array access to strings like hex[0] is 
 * not in ECMAScript3, although many browsers have supported it for a long time 
 * and is now described in ES5. But at this point in the book, there was yet no 
 * discussion of objects and methods. Otherwise an ES3-compatible solution would 
 * be to use one of the string methods such as charAt() or substring() or slice(). 
 * You can also use an array to avoid too much string concatenation.
 */
function getRGB2(hex) {
  var result = [];
  result.push(parseInt(hex.slice(1, 3), 16));
  result.push(parseInt(hex.slice(3, 5), 16));
  result.push(parseInt(hex.slice(5), 16));
  return "rgb(" + result.join(", ") + ")";
}
/*
 * Bonus exercise: rewrite the function above using a loop so you don’t have to 
 * type parseInt() three times, but just once.
 * Exercise 2
 * 2.1.
 */
parseInt(1e1); //10
/*
 * Here you're parsing something that is already an integer:
 */
parseInt(10); //10
1e1; //10
/*
 * 2.2.
 */
parseInt('1e1'); //1
/*
 * Here the parsing of a string gives up on the first non-integer value. parseInt() 
 * doesn't understand exponential literals, it expects integer notation.
 * 2.3.
 */
parseFloat('1e1'); //10
/*
 * This is parsing the string '1e1' while expecting it to be in decimal notation, 
 * including exponential.
 * 2.4.
 */
isFinite(0 / 10); //true
/*
 * Because 0/10 is 0 and 0 is finite.
 * 2.5.
 */
isFinite(20 / 0); //false
/*
 * Because division by 0 is Infinity.
 */
20 / 0; //Infinity
/*
 * 2.6.
 */
isNaN(parseInt(NaN)); //true
/*
 * Parsing the special NaN value is NaN.
 * Exercise 3
 * What is the result of:
 */
var a = 1;
function f() {
  function n() {
    alert(a);
  }
  var a = 2;
  n();
}
f();
/*
 * This snippet alerts 2 even though n() was defined before the assignment a = 2. 
 * Inside the function n() you see the variable a that is in the same scope and you 
 * access its most recent value at the time invocation of f() (and hence n()). Due 
 * to hoisting f() act as if it was:
 */
function f() {
  var a;
  function n() {
    alert(a);
  }
  a = 2;
  n();
}
/*
 * More interestingly, consider this code:
 */
var a = 1;
function f() {
  function n() {
    alert(a);
  }
  n();
  var a = 2;
  n();
}
f();
/*
 * It alerts undefined and then 2. You might expect the first alert to say 1, but 
 * again due to variable hoisting, the declaration (not initialization) of a is 
 * moved to the top of the function. As if f() was:
 */
var a = 1;
function f() {
  var a; // a is now undefined
  function n() {
    alert(a);
  }
  n(); // alert undefined
  a = 2;
  n(); // alert 2
}
f();
/* 
 * The local a "shadows" the global a, even if it's at the bottom.
 * Exercise 4. Why all these alert "Boo!"
 * 4.1. 
 */
var f = alert;
eval('f("Boo!")');
/*
 * You can assign a function to a different variable. So f() points to alert(). Evaluating this string is like doing:
 */
f("Boo");
/* 
 * 4.2.
 */
var e;
var f = alert;
eval('e=f')('Boo!');
/*
 * eval() returns the result on the evaluation. In this case it's an assignment e = f which also returns the new value of e. Like:
 */
var a = 1;
var b;
var c = (b = a);
c; //1
/* 
 * So eval('e=f') gives you a pointer to alert() which is executed immediately with "Boo!".
 */
/* 
 * 4.3.
 */
(function(){
  return alert;
})()('Boo!');
/*
 * The immediate (self-invoking) anonymous function returns a pointer to the function alert(), which is also immediately invoked with a parameter "Boo!".
 */