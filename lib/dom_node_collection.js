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


    const arr = this.parent();
    for(let i = 0; i < kids.length; i++){
      removeChild(kids[i]);
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
