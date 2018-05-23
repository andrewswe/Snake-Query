const DOMNodeCollection = require('./dom_node_collection');

const docReadyQueue = [];
let documnentReady = false;


const $l = (arg) => {
  switch(typeof arg){
    case "string":
      return getNodesFromString(arg);
    case "function":
      return pushToFuncQueue(arg);
    case "object":
      if(arg instanceof HTMLElement){
        return new DOMNodeCollection(Array.from(arg));
      }
  }
};



const pushToFuncQueue = (func) => {
  if(!documnentReady){
    docReadyQueue.push(func);
  }else {
    func();
  }
};



const getNodesFromString = (arg) => {
  let list;
  if(arg[0] === '#'){
    list = document.getElementsByClassName(arg.slice(1));
  } else if(arg[0] === '.') {
    list = document.getElementById(arg.slice(1));
  } else {
    list = document.querySelectorAll(arg);
  }

  const listArray = Array.prototype.slice.call(list);
  return new DOMNodeCollection(listArray);
};

document.addEventListener('DOMContentLoaded', () => {
  documnentReady = true;
  docReadyQueue.forEach(func => func());
});

$l.extend = (base, ...other) => {
  other.forEach((obj) => {
    for(const prop in obj){
      base[prop] = obj[prop];
    }
  });
};

$l.ajax = (options) => {
  const request = new XMLHttpRequest();
  const defaults = {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    method: "GET",
    url: "",
    success: () => {},
    error: () => {},
    data: {},
  };

  options = $l.extend(defaults, options);
  options.method = options.method.toUpperCase();

  if(options.method === "GET"){
    options.url += `?$(toQuery(options.data))`;
  }

  request.open(options.method, options.url, true);
  request.onload = (e) => {
    if(request.status === 200){
      options.success(request.response);
    }else {
      options.error(request.response);
    }
  };

  request.send(JSON.stringify(options.data));
};

const toQuery = (obj) => {
  let result = "";
  for(const prop in obj){
    if(Object.prototype.hasOwnProperty.call(obj, prop)) {
      result += `$(prop)=$(obj[prop])&`;
    }
  }
  return result.substring(0, result.length - 1);
};

window.$l = $l;
