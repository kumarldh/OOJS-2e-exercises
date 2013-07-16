/*
 * Exercise 1.
 * 1.1.
 */

var a; 
typeof a; //"undefined"
/*
 * When you declare a variable but not initialize it with a value, it automatically 
 * gets the undefined value. You can also check:
 */
a === undefined; //true
/*
 * 1.2.
 */
var s = '1s'; 
s++; //NaN
/*
 * Adding 1 to the string '1s' returns the string '1s1' which is Not A Number, but 
 * the ++ operator should return a number, so it returns the special NaN number.
 */
/*
 * 1.3.
 */
!!"false"; //true
/*
 * The trick part of the question is that "false" is a string and all strings are 
 * true when cast to booleans (except the empty string ""). If the question wasn’t 
 * about the string "false" but the boolean false instead, then the double negation 
 * !! returns the same boolean:
 */

!!false; //false
/*
 * As you'd expect, single negation returns the opposite:
 */
!false; //true
!true; //false
/*
 * You can test with any string and it will cast to a boolean true, except the empty 
 * string:
 */
!!"hello"; //true
!!"0"; //true
!!""; //false
/*
 * 1.4.
 */
!!undefined; //false
/*
 * Here undefined is one of the falsy values and it casts to false. You can try with any of the other falsy values, such the empty string "" in the previous example or NaN, or 0.
 */
/*
 * 1.5.
 */
typeof -Infinity; //"number"
/*
 * The number type includes all numbers, NaN, positive and negative Infinity.
 */
/*
 * 1.6.
 */
10 % "0"; //NaN
/*
 * The string "0" is cast to the number 0. Division by 0 is Infinity, which has 
 * no remainder.
 */
/*
 * 1.7.
 */
undefined == null; //true
/*
 * Comparison with == operator doesn't check the types but converts the operands, 
 * in this case both are falsy values. Strict comparison checks the types too:
 */
undefined === null; //false
/*
 * 1.8.
 */
false === ""; //false
/*
 * Strict comparison between different types (in this case boolean and string) is 
 * doomed to fail, no matter what the values.
 */
/*
 * 1.9.
 */
typeof "2E+2"; //"string"
/*
 * Anything in quotes is a string, even though:
 */
2E+2; //200
typeof 2E+2; //"number"
/*
 * 1.10.
 */
a = 3e+3; 
a++; //3000
/*
 * 3e+3 is 3 with three zeroes, meaning 3000. Then ++ is a post-increment, meaning 
 * it returns the old value and then it increments it and assigns it to a. That's 
 * why you get the return value 3000 in the console, although a is now 3001.
 */
a; //3001

/*
 * Exercise 2.
 */
var v = v || 10;
v; //10
/*
 * If v has never been declared, it's undefined so this is the same as:
 */
var v = undefined || 10;
v; //10
/*
 * However if v has already been defined and initialized with a non-falsy value, 
 * you'll get the previous value.
 */
var v = 100;
var v = v || 10;
v; //100
/*
 * The second use of var doesn't "reset" the variable.
 * If v was already a falsy value (not a 100) the check v || 10 will return 10.
 */
var v = 0;
var v = v || 10;
v; //10

/*
 * Exercise 3: Print the multiplication tables
 */
for (var i = 1; i <= 12; i++) {
  for (var j = 1; j <= 12; j++) {
    console.log(i + ' * ' + j + ' = ' + i * j);
  }
}
/*
 * or
 */
var i = 1, j = 1;
while (i <= 12) {
  while (j <= 12) {
    console.log(i + ' * ' + j + ' = ' + i * j);
    j++;
  }
  i++;
  j = 1;
}