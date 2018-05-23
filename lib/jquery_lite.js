/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

const l = function(arg, fn){
  if(arg instanceof HTMLElement){
    return new DOMNodeCollection(Array.from(arg));
  }

  let list;

  if (typeof arg === 'string') {
    if(arg[0] === '#'){
      list = document.getElementsByClassName(arg.slice(1));
    } else if(arg[0] === '.') {
      list = document.getElementById(arg.slice(1));
    } else {
      list = document.querySelectorAll(arg);
    }

    const listArray = Array.prototype.slice.call(list);
    return new DOMNodeCollection(listArray);
  }

  let queue = [];
  queue.push(fn);
};

window.$l = l;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(arr){
    this.arr = arr;
  }

  html(str) {
    if(typeof str !== 'undefined'){
      for(let i = 0; i < this.arr.length; i++){
        this.arr[i].innerHTML = str;
      }
    }else{
      return this.arr[0].innerHTML;
    }
  }

  empty() {
    this.html.call(this, '');
  }

  append(arg) {

    for(let i = 0; i < this.arr.length; i++){
      if (typeof arg === 'string'){
        this.arr[i].innerHTML += arg;
      } else if (arg instanceof HTMLElement) {
        this.arr[i].innerHTML += arg.outerHTML;
      } else if(arg instanceof DOMNodeCollection){
        for (let j = 0; j < arg.length; j++) {
          this.arr[i].innerHTML += arg[j].outerHTML;
        }
      }
    }
  }

  attr(attrName){
    for(let i = 0; i < this.arr.length; i++){
      if(this.arr[i].getAttribute(attrName) !== null){
        return this.arr[i].getAttribute(attrName);
      }
    }
    return null;
  }

  addClass(className){
    for (let i = 0; i < this.arr.length; i++) {
      this.arr[i].classList.add(className);
    }

    // let newClass = "";
    //
    // for(let i = 0; i < this.arr.length; i++){
    //   let outHtml = this.arr[i].outerHTML;
    //   for(let j = 0; j < outHtml.length; j++){
    //     let char = outHtml[j];
    //     if(char === '>'){
    //       newClass += ` class="${className}">`;
    //       newClass += outHtml.slice(j + 1);
    //       break;
    //     }
    //     newClass += char;
    //   }
    //   this.arr[i].outerHTML = newClass;
    // }
  }

  removeClass(className) {
    for (let i = 0; i < this.arr.length; i++) {
      this.arr[i].classList.remove(className);
    }
  }

  children() {
    let childrenArr = [];
    for (let i = 0; i < this.arr.length; i++) {
      let group = this.arr[i].children;
      for(let j = 0; j < group.length; j++){
        childrenArr.push(group[j]);
      }
    }

    return new DOMNodeCollection(childrenArr);
  }

  parent() {
    let parentArr = [];
    for (let i = 0; i < this.arr.length; i++) {
      parentArr.push(this.arr[i].parentNode);
    }

    return new DOMNodeCollection(parentArr);
  }

  find(selector){
    const found = document.querySelectorAll(selector);
    let matches = [];
    const children = this.children();

    for (let i = 0; i < found.length; i++) {
      if (children.arr.includes(found[i])) {
        matches.push(found[i]);
      }
    }

    return new DOMNodeCollection(matches);
  }

  remove() {
    let kids = this.children();


    for(let i = 0; i < kids.length; i++){
      let node = kids[i];
      node.parentNode.removeChild(kids[i]);
    }
  }

  on(eventType, fn) {
    for(let i = 0; i < this.arr.length; i++){
      this.arr[i].addEventListener(eventType, fn);
      this.arr[i].callback = fn;
    }
  }

  off(eventType){
    for(let i = 0; i < this.arr.length; i++){
      this.arr[i].removeEventListener(eventType, this.arr[i].callback);
    }
  }
}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);
