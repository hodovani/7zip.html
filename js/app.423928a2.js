(()=>{"use strict";class e{constructor(e,t,n,s){this._name=e,this._size=t,this._path=n,this._archiveRef=s}get name(){return this._name}get size(){return this._size}extract(){return this._archiveRef.extractSingleFile(this._path)}}class t{static init(e={}){return t._options={workerUrl:"../dist/worker-bundle.js",...e},t._options}static open(e,n=null){return n=n||t._options||t.init()&&console.warn("Automatically initializing using options: ",t._options),new t(e,n).open()}constructor(e,t){this._worker=new Worker(t.workerUrl),this._worker.addEventListener("message",this._workerMsg.bind(this)),this._callbacks=[],this._content={},this._processed=0,this._file=e}async open(){return await this._postMessage({type:"HELLO"},((e,t,n)=>{"READY"===n.type&&e()})),await this._postMessage({type:"OPEN",file:this._file},((e,t,n)=>{"OPENED"===n.type&&e(this)}))}hasEncryptedData(){return this._postMessage({type:"CHECK_ENCRYPTION"},((e,t,n)=>{"ENCRYPTION_STATUS"===n.type&&e(n.status)}))}usePassword(e){return this._postMessage({type:"SET_PASSPHRASE",passphrase:e},((e,t,n)=>{"PASSPHRASE_STATUS"===n.type&&e(n.status)}))}getFilesObject(){return this._processed>0?Promise.resolve().then((()=>this._content)):this._postMessage({type:"LIST_FILES"},((t,n,s)=>{if("ENTRY"===s.type){const t=s.entry,[n,i]=this._getProp(this._content,t.path);return"FILE"===t.type&&(n[i]=new e(t.fileName,t.size,t.path,this)),!0}"END"===s.type&&(this._processed=1,t(this._cloneContent(this._content)))}))}getFilesArray(){return this.getFilesObject().then((e=>this._objectToArray(e)))}extractSingleFile(e){return this._postMessage({type:"EXTRACT_SINGLE_FILE",target:e},((e,t,n)=>{"FILE"===n.type&&e(new File([n.entry.fileData],n.entry.fileName,{type:"application/octet-stream"}))}))}extractFiles(e){return this._processed>1?Promise.resolve().then((()=>this._content)):this._postMessage({type:"EXTRACT_FILES"},((t,n,s)=>{if("ENTRY"===s.type){const[t,n]=this._getProp(this._content,s.entry.path);return"FILE"===s.entry.type&&(t[n]=new File([s.entry.fileData],s.entry.fileName,{type:"application/octet-stream"}),void 0!==e&&setTimeout(e.bind(null,{file:t[n],path:s.entry.path}))),!0}"END"===s.type&&(this._processed=2,this._worker.terminate(),t(this._cloneContent(this._content)))}))}_cloneContent(t){if(t instanceof File||t instanceof e||null===t)return t;const n={};for(const e of Object.keys(t))n[e]=this._cloneContent(t[e]);return n}_objectToArray(t,n=""){const s=[];for(const i of Object.keys(t))t[i]instanceof File||t[i]instanceof e||null===t[i]?s.push({file:t[i]||i,path:n}):s.push(...this._objectToArray(t[i],`${n}${i}/`));return s}_getProp(e,t){const n=t.split("/");""===n[n.length-1]&&n.pop();let s=e,i=null;for(const e of n)s[e]=s[e]||{},i=s,s=s[e];return[i,n[n.length-1]]}_postMessage(e,t){return this._worker.postMessage(e),new Promise(((e,n)=>{this._callbacks.push(this._msgHandler.bind(this,t,e,n))}))}_msgHandler(e,t,n,s){if("BUSY"===s.type)n("worker is busy");else{if("ERROR"!==s.type)return e(t,n,s);n(s.error)}}_workerMsg({data:e}){(0,this._callbacks[this._callbacks.length-1])(e)||this._callbacks.pop()}}var n,s=new Uint8Array(16);function i(){if(!n&&!(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(s)}const r=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,o=function(e){return"string"==typeof e&&r.test(e)};for(var a=[],c=0;c<256;++c)a.push((c+256).toString(16).substr(1));const l=function(e,t,n){var s=(e=e||{}).random||(e.rng||i)();if(s[6]=15&s[6]|64,s[8]=63&s[8]|128,t){n=n||0;for(var r=0;r<16;++r)t[n+r]=s[r];return t}return function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=(a[e[t+0]]+a[e[t+1]]+a[e[t+2]]+a[e[t+3]]+"-"+a[e[t+4]]+a[e[t+5]]+"-"+a[e[t+6]]+a[e[t+7]]+"-"+a[e[t+8]]+a[e[t+9]]+"-"+a[e[t+10]]+a[e[t+11]]+a[e[t+12]]+a[e[t+13]]+a[e[t+14]]+a[e[t+15]]).toLowerCase();if(!o(n))throw TypeError("Stringified UUID is invalid");return n}(s)},p=document.getElementById("fileOutput"),h=document.getElementById("fileInput"),d=document.getElementById("treeView");function u({node:e,liId:t,name:n}){const s=document.getElementById(t);if(e instanceof File){const t=document.createElement("li");t.addEventListener("click",(function(e){e.stopPropagation()})),t.innerText=e.name,t.addEventListener("click",(()=>{const t=new FileReader;t.onload=function(e){p.textContent=e.target.result},t.readAsText(e)})),s.appendChild(t)}else{const t=l(),i=document.createElement("ul");i.classList.add("nested"),i.id=t;const r=document.createElement("li");s.appendChild(r),r.classList.add("folder"),r.addEventListener("click",(function(e){e.preventDefault(),e.stopPropagation(),r.childNodes.forEach((e=>{e.classList.contains("nested")&&e.classList.toggle("active")}))}));const o=document.createElement("span");o.innerText=n,r.appendChild(o),r.appendChild(i);const a=Object.keys(e);if(a.length>0)a.forEach((n=>{u({node:e[n],liId:t,name:n})}));else{const e=document.createElement("span");e.innerHTML="<i>Empty folder</i>",s.appendChild(e)}}}t.init({workerUrl:"public/worker-bundle.js"}),location.href.split("?archiveUrl=")[1]&&fetch(location.href.split("?archiveUrl=")[1]).then((e=>e.blob())).then((async e=>{const n=await t.open(e);let s=await n.extractFiles();d.innerHTML="",u({node:s,liId:"treeView",name:"externalArchive"})})),h.addEventListener("change",(async e=>{const n=e.currentTarget.files[0],s=await t.open(n);let i=await s.extractFiles();d.innerHTML="",u({node:i,liId:"treeView",name:n.name})}))})();
//# sourceMappingURL=app.423928a2.js.map