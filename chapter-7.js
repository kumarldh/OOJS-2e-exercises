/*
 * Exercise 1
 * 1.1. Title clock
 */
setInterval(function () {
  document.title = new Date().toTimeString();
}, 1000);
/*
 * 1.2. Animate resizing of a 200x200 popup to 400x400
 */
var w = window.open(
    'http://phpied.com',
    'my',
    'width = 200, height = 200');

var i = setInterval((function () {
  var size = 200;
  return function () {
    size += 5;
    w.resizeTo(size, size);
    if (size === 400) {
      clearInterval(i);
    }
  };
}()), 100);
/*
 * Every 100ms (1/10th of a second) the popup size increases with 5 pixels. You 
 * keep a reference to the interval i so you can clear it once done. The variable 
 * size tracks the popup size (and why not keep it private inside a closure).
 * 1.3. Earthquake
 */
var i = setInterval((function () {
  var start = +new Date(); // Date.now() in ES5
  return function () {
    w.moveTo(
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100));
    if (new Date() - start > 5000) {
      clearInterval(i);
    }
  };
}()), 20);
/*
 * Try exercises 1.1 through 1.3. but using requestAnimationFrame() instead of setInterval().
 */
/*
 * Exercise 2 
 * 2.1. A different walkDOM() with a callback
 */
function walkDOM(n, cb) {
  cb(n);
  var i,
      children = n.childNodes,
      len = children.length,
      child;
  for (i = 0; i < len; i++) {
    child = n.childNodes[i];
    if (child.hasChildNodes()) {
      walkDOM(child, cb);
    }
  }
}
/*
 * Testing:
 */
walkDOM(
    document.documentElement,
    console.dir.bind(console));
/*
 *        html
 *        head
 *        title
 *        body
 *        h1
 *        ...
 */
/*
 * 2.2. Remove content and clean up functions
 */
// helper
function isFunction(f) {
  return Object.prototype.toString.call(f) ===
    "[object Function]";
}

function removeDom(node) {
  var i, len, attr;

  // first drill down inspecting the children
  // and only after that remove the current node
  while (node.firstChild) {
    removeDom(node.firstChild);
  }

  // not all nodes have attributes, e.g. text nodes don't
  len = node.attributes ? node.attributes.length : 0;

  // cleanup loop
  // e.g. node === <body>, 
  // node.attributes[0].name === "onload"
  // node.onload === function()...
  // node.onload is not enumerable so we can't use 
  // a for-in loop and have to go the attributes route
  for (i = 0; i < len; i++) {
    attr = node[node.attributes[i].name];
    if (isFunction(attr)) {
      // console.log(node, attr);
      attr = null;
    }
  }

  node.parentNode.removeChild(node);
}
/*
 * Testing:
 */
removeDom(document.body);
/*
 * 2.3. Include scripts dynamically
 */
function include(url) {
  var s = document.createElement('script');
  s.src = url;
  document.getElementsByTagName('head')[0].appendChild(s);
}
/*
 * Testing:
 */
include("http://www.phpied.com/files/jinc/1.js");
include("http://www.phpied.com/files/jinc/2.js");
/*
 * Exercise 3: Events
 * 3.1. Event utility
 */
var myevent = (function () {

  // wrap some private stuff in a closure
  var add, remove, toStr = Object.prototype.toString;

  // helper
  function toArray(a) {
    // already an array
    if (toStr.call(a) === '[object Array]') {
      return a;
    }
    
    // duck-typing HTML collections, arguments etc
    var result, i, len;
    if ('length' in a) {
      for (result = [], i = 0, len = a.length; i < len; i++) {
        result[i] = a[i];
      }
      return result;
    }

    // primitives and non-array-like objects
    // become the first and single array element
    return [a];
  }

  // define add() and remove() depending
  // on the browser's capabilities
  if (document.addEventListener) {
    add = function (node, ev, cb) {
      node.addEventListener(ev, cb, false);
    };
    remove = function (node, ev, cb) {
      node.removeEventListener(ev, cb, false);
    };
  } else if (document.attachEvent) {
    add = function (node, ev, cb) {
      node.attachEvent('on' + ev, cb);
    };
    remove = function (node, ev, cb) {
      node.detachEvent('on' + ev, cb);
    };
  } else {
    add = function (node, ev, cb) {
      node['on' + ev] = cb;
    };
    remove = function (node, ev) {
      node['on' + ev] = null;
    };
  }

  // public API
  return {

    addListener: function (element, event_name, callback) {
      // element could also be an array of elements
      element = toArray(element);
      for (var i = 0; i < element.length; i++) {
        add(element[i], event_name, callback);
      }
    },

    removeListener: function (element, event_name, callback) {
      // same as add(), only practicing a different loop
      var i = 0, els = toArray(element), len = els.length;
      for (; i < len; i++) {
        remove(els[i], event_name, callback);
      }
    },

    getEvent: function (event) {
      return event || window.event;
    },

    getTarget: function (event) {
      var e = this.getEvent(event);
      return e.target || e.srcElement;
    },

    stopPropagation: function (event) {
      var e = this.getEvent(event);
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
    },

    preventDefault: function (event) {
      var e = this.getEvent(event);
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }

  };
}());
/*
 * Testing: go to any page with links, execute the following and then click any link.
 */
function myCallback(e) {
  e = myevent.getEvent(e);
  alert(myevent.getTarget(e).href);
  myevent.stopPropagation(e);
  myevent.preventDefault(e);
}
myevent.addListener(document.links, 'click', myCallback);
/*
 * 3.2. Move a div around with the keyboard
 */
// add a div to the bottom of the page
var div = document.createElement('div');
div.style.cssText = 'width: 100px; height: 100px; background: red; position: absolute;';
document.body.appendChild(div);

// remember coordinates
var x = div.offsetLeft;
var y = div.offsetTop;

myevent.addListener(document.body, 'keydown', function (e) {
  // prevent scrolling
  myevent.preventDefault(e);

  switch (e.keyCode) {
    case 37: // left
      x--;
      break;
    case 38: // up
      y--;
      break;
    case 39: // right
      x++;
      break;
    case 40: // down
      y++;
      break;
    default:
      // not interested
  }

  // move
  div.style.left = x + 'px';
  div.style.top  = y + 'px';

});
/*
* Exercise 4: Your own ajax utility
 */
var ajax = {
  getXHR: function () {
    var ids = ['MSXML2.XMLHTTP.3.0',
               'MSXML2.XMLHTTP',
               'Microsoft.XMLHTTP'];
    var xhr;
    if (typeof XMLHttpRequest === 'function') {
      xhr = new XMLHttpRequest();
    } else {
      // IE: try to find an ActiveX object to use
      for (var i = 0; i < ids.length; i++) {
        try {
          xhr = new ActiveXObject(ids[i]);
          break;
        } catch (e) {}
      }
    }
    return xhr;

  },
  request: function (url, method, cb, post_body) {
    var xhr = this.getXHR();
    xhr.onreadystatechange = (function (myxhr) {
      return function () {
        if (myxhr.readyState === 4 && myxhr.status === 200) {
          cb(myxhr);
        }
      };
    }(xhr));
    xhr.open(method.toUpperCase(), url, true);
    xhr.send(post_body || '');
  }
};
/*
 * When testing, remember that same origin restrictions apply, so you have to be 
 * on the same domain. You can go to http://www.phpied.com/files/jinc/, which is 
 * a directory listing and then test in the console:
 */
function myCallback(xhr) {
  alert(xhr.responseText);
}
ajax.request('1.css', 'get', myCallback);
ajax.request('1.css', 'post', myCallback,
             'first=John&last=Smith');
/*
 * The result of the two is the same, but if you look into the Network tab of the 
 * Web Inspector, you can see that the second is indeed a POST request with a body.
 */