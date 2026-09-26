var nD=Object.defineProperty;var rD=(r,e,t)=>e in r?nD(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var j=(r,e,t)=>rD(r,typeof e!="symbol"?e+"":e,t);/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sD=()=>{};var yf={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ip=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},iD=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const s=r[t++];if(s<128)e[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=r[t++];e[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=r[t++],o=r[t++],a=r[t++],B=((s&7)<<18|(i&63)<<12|(o&63)<<6|a&63)-65536;e[n++]=String.fromCharCode(55296+(B>>10)),e[n++]=String.fromCharCode(56320+(B&1023))}else{const i=r[t++],o=r[t++];e[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},op={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const i=r[s],o=s+1<r.length,a=o?r[s+1]:0,B=s+2<r.length,c=B?r[s+2]:0,h=i>>2,f=(i&3)<<4|a>>4;let C=(a&15)<<2|c>>6,_=c&63;B||(_=64,o||(C=64)),n.push(t[h],t[f],t[C],t[_])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(ip(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):iD(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const i=t[r.charAt(s++)],a=s<r.length?t[r.charAt(s)]:0;++s;const c=s<r.length?t[r.charAt(s)]:64;++s;const f=s<r.length?t[r.charAt(s)]:64;if(++s,i==null||a==null||c==null||f==null)throw new oD;const C=i<<2|a>>4;if(n.push(C),c!==64){const _=a<<4&240|c>>2;if(n.push(_),f!==64){const R=c<<6&192|f;n.push(R)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class oD extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const aD=function(r){const e=ip(r);return op.encodeByteArray(e,!0)},Ha=function(r){return aD(r).replace(/\./g,"")},ap=function(r){try{return op.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function up(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uD=()=>up().__FIREBASE_DEFAULTS__,BD=()=>{if(typeof process>"u"||typeof yf>"u")return;const r=yf.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},cD=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&ap(r[1]);return e&&JSON.parse(e)},Eu=()=>{try{return sD()||uD()||BD()||cD()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Bp=r=>{var e,t;return(t=(e=Eu())==null?void 0:e.emulatorHosts)==null?void 0:t[r]},lD=r=>{const e=Bp(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},cp=()=>{var r;return(r=Eu())==null?void 0:r.config},lp=r=>{var e;return(e=Eu())==null?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hp{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hD(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",s=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...r};return[Ha(JSON.stringify(t)),Ha(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Je(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function fD(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Je())}function fp(){var e;const r=(e=Eu())==null?void 0:e.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function dD(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function CD(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function pD(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function gD(){const r=Je();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function dp(){return!fp()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Cp(){return!fp()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function Hc(){try{return typeof indexedDB=="object"}catch{return!1}}function pp(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)==null?void 0:i.message)||"")}}catch(t){e(t)}})}function mD(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ED="FirebaseError";class un extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=ED,Object.setPrototypeOf(this,un.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ns.prototype.create)}}class ns{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?_D(i,n):"Error",a=`${this.serviceName}: ${o} (${s}).`;return new un(s,a,n)}}function _D(r,e){try{let t=0,n="";for(;t<r.length;){const s=r.indexOf("{$",t);if(s===-1){n+=r.substring(t);break}const i=r.indexOf("}",s+2);if(i===-1){n+=r.substring(t);break}const o=r.substring(s+2,i),a=e[o];n+=r.substring(t,s)+(a!=null?String(a):`<${o}?>`),t=i+1}return n}catch{return r}}function DD(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function tr(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const s of t){if(!n.includes(s))return!1;const i=r[s],o=e[s];if(wf(i)&&wf(o)){if(!tr(i,o))return!1}else if(i!==o)return!1}for(const s of n)if(!t.includes(s))return!1;return!0}function wf(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wo(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function Oi(r){const e={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[s,i]=n.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function Fi(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function ID(r,e){const t=new yD(r,e);return t.subscribe.bind(t)}class yD{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let s;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");wD(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:n},s.next===void 0&&(s.next=AB),s.error===void 0&&(s.error=AB),s.complete===void 0&&(s.complete=AB);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function wD(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function AB(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ve(r){return r&&r._delegate?r._delegate:r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zs(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Uc(r){return(await fetch(r,{credentials:"include"})).ok}class Mt{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TD{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new hp;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&n.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),n=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(n)return null;throw s}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(RD(e))try{this.getOrInitializeService({instanceIdentifier:wr})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch{}}}}clearInstance(e=wr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=wr){return this.instances.has(e)}getOptions(e=wr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(i);n===a&&o.resolve(s)}return s}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(n)??new Set;s.add(e),this.onInitCallbacks.set(n,s);const i=this.instances.get(n);return i&&e(i,n),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const s of n)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:AD(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=wr){return this.component?this.component.multipleInstances?e:wr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function AD(r){return r===wr?void 0:r}function RD(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vD{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new TD(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ce;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(ce||(ce={}));const bD={debug:ce.DEBUG,verbose:ce.VERBOSE,info:ce.INFO,warn:ce.WARN,error:ce.ERROR,silent:ce.SILENT},SD=ce.INFO,PD={[ce.DEBUG]:"log",[ce.VERBOSE]:"log",[ce.INFO]:"info",[ce.WARN]:"warn",[ce.ERROR]:"error"},ND=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),s=PD[e];if(s)console[s](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class jc{constructor(e){this.name=e,this._logLevel=SD,this._logHandler=ND,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ce))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?bD[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ce.DEBUG,...e),this._logHandler(this,ce.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ce.VERBOSE,...e),this._logHandler(this,ce.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ce.INFO,...e),this._logHandler(this,ce.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ce.WARN,...e),this._logHandler(this,ce.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ce.ERROR,...e),this._logHandler(this,ce.ERROR,...e)}}const OD=(r,e)=>e.some(t=>r instanceof t);let Tf,Af;function FD(){return Tf||(Tf=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function xD(){return Af||(Af=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const gp=new WeakMap,XB=new WeakMap,mp=new WeakMap,RB=new WeakMap,qc=new WeakMap;function LD(r){const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("success",i),r.removeEventListener("error",o)},i=()=>{t(Cn(r.result)),s()},o=()=>{n(r.error),s()};r.addEventListener("success",i),r.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&gp.set(t,r)}).catch(()=>{}),qc.set(e,r),e}function kD(r){if(XB.has(r))return;const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",o),r.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",i),r.addEventListener("error",o),r.addEventListener("abort",o)});XB.set(r,e)}let ZB={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return XB.get(r);if(e==="objectStoreNames")return r.objectStoreNames||mp.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Cn(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function VD(r){ZB=r(ZB)}function MD(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(vB(this),e,...t);return mp.set(n,e.sort?e.sort():[e]),Cn(n)}:xD().includes(r)?function(...e){return r.apply(vB(this),e),Cn(gp.get(this))}:function(...e){return Cn(r.apply(vB(this),e))}}function GD(r){return typeof r=="function"?MD(r):(r instanceof IDBTransaction&&kD(r),OD(r,FD())?new Proxy(r,ZB):r)}function Cn(r){if(r instanceof IDBRequest)return LD(r);if(RB.has(r))return RB.get(r);const e=GD(r);return e!==r&&(RB.set(r,e),qc.set(e,r)),e}const vB=r=>qc.get(r);function _u(r,e,{blocked:t,upgrade:n,blocking:s,terminated:i}={}){const o=indexedDB.open(r,e),a=Cn(o);return n&&o.addEventListener("upgradeneeded",B=>{n(Cn(o.result),B.oldVersion,B.newVersion,Cn(o.transaction),B)}),t&&o.addEventListener("blocked",B=>t(B.oldVersion,B.newVersion,B)),a.then(B=>{i&&B.addEventListener("close",()=>i()),s&&B.addEventListener("versionchange",c=>s(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}function wa(r,{blocked:e}={}){const t=indexedDB.deleteDatabase(r);return e&&t.addEventListener("blocked",n=>e(n.oldVersion,n)),Cn(t).then(()=>{})}const HD=["get","getKey","getAll","getAllKeys","count"],UD=["put","add","delete","clear"],bB=new Map;function Rf(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(bB.get(e))return bB.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,s=UD.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(s||HD.includes(t)))return;const i=async function(o,...a){const B=this.transaction(o,s?"readwrite":"readonly");let c=B.store;return n&&(c=c.index(a.shift())),(await Promise.all([c[t](...a),s&&B.done]))[0]};return bB.set(e,i),i}VD(r=>({...r,get:(e,t,n)=>Rf(e,t)||r.get(e,t,n),has:(e,t)=>!!Rf(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jD{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(qD(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function qD(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ec="@firebase/app",vf="0.16.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const En=new jc("@firebase/app"),KD="@firebase/app-compat",JD="@firebase/analytics-compat",zD="@firebase/analytics",QD="@firebase/app-check-compat",$D="@firebase/app-check",WD="@firebase/auth",YD="@firebase/auth-compat",XD="@firebase/database",ZD="@firebase/data-connect",eI="@firebase/database-compat",tI="@firebase/functions",nI="@firebase/functions-compat",rI="@firebase/installations",sI="@firebase/installations-compat",iI="@firebase/messaging",oI="@firebase/messaging-compat",aI="@firebase/performance",uI="@firebase/performance-compat",BI="@firebase/remote-config",cI="@firebase/remote-config-compat",lI="@firebase/storage",hI="@firebase/storage-compat",fI="@firebase/firestore",dI="@firebase/ai",CI="@firebase/firestore-compat",pI="firebase",gI="12.18.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tc="[DEFAULT]",mI={[ec]:"fire-core",[KD]:"fire-core-compat",[zD]:"fire-analytics",[JD]:"fire-analytics-compat",[$D]:"fire-app-check",[QD]:"fire-app-check-compat",[WD]:"fire-auth",[YD]:"fire-auth-compat",[XD]:"fire-rtdb",[ZD]:"fire-data-connect",[eI]:"fire-rtdb-compat",[tI]:"fire-fn",[nI]:"fire-fn-compat",[rI]:"fire-iid",[sI]:"fire-iid-compat",[iI]:"fire-fcm",[oI]:"fire-fcm-compat",[aI]:"fire-perf",[uI]:"fire-perf-compat",[BI]:"fire-rc",[cI]:"fire-rc-compat",[lI]:"fire-gcs",[hI]:"fire-gcs-compat",[fI]:"fire-fst",[CI]:"fire-fst-compat",[dI]:"fire-vertex","fire-js":"fire-js",[pI]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const to=new Map,EI=new Map,nc=new Map;function bf(r,e){try{r.container.addComponent(e)}catch(t){En.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function rn(r){const e=r.name;if(nc.has(e))return En.debug(`There were multiple attempts to register component ${e}.`),!1;nc.set(e,r);for(const t of to.values())bf(t,r);for(const t of EI.values())bf(t,r);return!0}function rs(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function Tt(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _I={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},hn=new ns("app","Firebase",_I);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DI{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new Mt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw hn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ei=gI;function II(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n={name:tc,automaticDataCollectionEnabled:!0,...e},s=n.name;if(typeof s!="string"||!s)throw hn.create("bad-app-name",{appName:String(s)});if(t||(t=cp()),!t)throw hn.create("no-options");const i=to.get(s);if(i)if(tr(t,i.options)){if(tr(n,i.config))return i;throw hn.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(i.config),newValue:JSON.stringify(n)})}else throw hn.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(i.options),newValue:JSON.stringify(t)});const o=new vD(s);for(const B of nc.values())o.addComponent(B);const a=new DI(t,n,o);return to.set(s,a),a}function Kc(r=tc){const e=to.get(r);if(!e&&r===tc&&cp())return II();if(!e)throw hn.create("no-app",{appName:r});return e}function h0(){return Array.from(to.values())}function Ot(r,e,t){let n=mI[r]??r;t&&(n+=`-${t}`);const s=n.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const o=[`Unable to register library "${n}" with version "${e}":`];s&&o.push(`library name "${n}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),En.warn(o.join(" "));return}rn(new Mt(`${n}-version`,()=>({library:n,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yI="firebase-heartbeat-database",wI=1,no="firebase-heartbeat-store";let SB=null;function Ep(){return SB||(SB=_u(yI,wI,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(no)}catch(t){console.warn(t)}}}}).catch(r=>{throw hn.create("idb-open",{originalErrorMessage:r.message})})),SB}async function TI(r){try{const t=(await Ep()).transaction(no),n=await t.objectStore(no).get(_p(r));return await t.done,n}catch(e){if(e instanceof un)En.warn(e.message);else{const t=hn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});En.warn(t.message)}}}async function Sf(r,e){try{const n=(await Ep()).transaction(no,"readwrite");await n.objectStore(no).put(e,_p(r)),await n.done}catch(t){if(t instanceof un)En.warn(t.message);else{const n=hn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});En.warn(n.message)}}}function _p(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AI=1024,RI=30;class vI{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new SI(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Pf();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>RI){const o=PI(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){En.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Pf(),{heartbeatsToSend:n,unsentEntries:s}=bI(this._heartbeatsCache.heartbeats),i=Ha(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return En.warn(t),""}}}function Pf(){return new Date().toISOString().substring(0,10)}function bI(r,e=AI){const t=[];let n=r.slice();for(const s of r){const i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),Nf(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Nf(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class SI{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Hc()?pp().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await TI(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return Sf(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return Sf(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}else return}}function Nf(r){return Ha(JSON.stringify({version:2,heartbeats:r})).length}function PI(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let n=1;n<r.length;n++)r[n].date<t&&(t=r[n].date,e=n);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function NI(r){rn(new Mt("platform-logger",e=>new jD(e),"PRIVATE")),rn(new Mt("heartbeat",e=>new vI(e),"PRIVATE")),Ot(ec,vf,r),Ot(ec,vf,"esm2020"),Ot("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */NI("");function Dp(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const OI=Dp,Ip=new ns("auth","Firebase",Dp());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ua=new jc("@firebase/auth");function yp(r,...e){Ua.logLevel<=ce.WARN&&Ua.warn(`Auth (${ei}): ${r}`,...e)}function Ta(r,...e){Ua.logLevel<=ce.ERROR&&Ua.error(`Auth (${ei}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gt(r,...e){throw Jc(r,...e)}function Yt(r,...e){return Jc(r,...e)}function wp(r,e,t){const n={...OI(),[e]:t};return new ns("auth","Firebase",n).create(e,{appName:r.name})}function Xt(r){return wp(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Jc(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return Ip.create(r,...e)}function re(r,e,...t){if(!r)throw Jc(e,...t)}function fn(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Ta(e),new Error(e)}function _n(r,e){r||fn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rc(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.href)||""}function FI(){return Of()==="http:"||Of()==="https:"}function Of(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xI(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(FI()||CD()||"connection"in navigator)?navigator.onLine:!0}function LI(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class To{constructor(e,t){this.shortDelay=e,this.longDelay=t,_n(t>e,"Short delay should be less than long delay!"),this.isMobile=fD()||pD()}get(){return xI()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zc(r,e){_n(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tp{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;fn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;fn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;fn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kI={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const VI=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],MI=new To(3e4,6e4);function lr(r,e){return r.tenantId&&!e.tenantId?{...e,tenantId:r.tenantId}:e}async function An(r,e,t,n,s={}){return Ap(r,s,async()=>{let i={},o={};n&&(e==="GET"?o=n:i={body:JSON.stringify(n)});const a=wo({...o,key:r.config.apiKey}).slice(1),B=await r._getAdditionalHeaders();B["Content-Type"]="application/json",r.languageCode&&(B["X-Firebase-Locale"]=r.languageCode);const c={method:e,headers:B,...i};return dD()||(c.referrerPolicy="strict-origin-when-cross-origin"),r.emulatorConfig&&Zs(r.emulatorConfig.host)&&(c.credentials="include"),Tp.fetch()(await Rp(r,r.config.apiHost,t,a),c)})}async function Ap(r,e,t){r._canInitEmulator=!1;const n={...kI,...e};try{const s=new HI(r),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw Ba(r,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const a=i.ok?o.errorMessage:o.error.message,[B,c]=a.split(" : ");if(B==="FEDERATED_USER_ID_ALREADY_LINKED")throw Ba(r,"credential-already-in-use",o);if(B==="EMAIL_EXISTS")throw Ba(r,"email-already-in-use",o);if(B==="USER_DISABLED")throw Ba(r,"user-disabled",o);const h=n[B]||B.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw wp(r,h,c);Gt(r,h)}}catch(s){if(s instanceof un)throw s;Gt(r,"network-request-failed",{message:String(s)})}}async function Ao(r,e,t,n,s={}){const i=await An(r,e,t,n,s);return"mfaPendingCredential"in i&&Gt(r,"multi-factor-auth-required",{_serverResponse:i}),i}async function Rp(r,e,t,n){const s=`${e}${t}?${n}`,i=r,o=i.config.emulator?zc(r.config,s):`${r.config.apiScheme}://${s}`;return VI.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}function GI(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class HI{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(Yt(this.auth,"network-request-failed")),MI.get())})}}function Ba(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const s=Yt(r,e,n);return s.customData._tokenResponse=t,s}function Ff(r){return r!==void 0&&r.enterprise!==void 0}class UI{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return GI(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function jI(r,e){return An(r,"GET","/v2/recaptchaConfig",lr(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qI(r,e){return An(r,"POST","/v1/accounts:delete",e)}async function ja(r,e){return An(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gi(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function KI(r,e=!1){const t=ve(r),n=await t.getIdToken(e),s=Qc(n);re(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:n,authTime:Gi(PB(s.auth_time)),issuedAtTime:Gi(PB(s.iat)),expirationTime:Gi(PB(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function PB(r){return Number(r)*1e3}function Qc(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return Ta("JWT malformed, contained fewer than 3 sections"),null;try{const s=ap(t);return s?JSON.parse(s):(Ta("Failed to decode base64 JWT payload"),null)}catch(s){return Ta("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function xf(r){const e=Qc(r);return re(e,"internal-error"),re(typeof e.exp<"u","internal-error"),re(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ps(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof un&&JI(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function JI({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zI{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const n=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,n)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sc{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Gi(this.lastLoginAt),this.creationTime=Gi(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qa(r){var f;const e=r.auth,t=await r.getIdToken(),n=await Ps(r,ja(e,{idToken:t}));re(n==null?void 0:n.users.length,e,"internal-error");const s=n.users[0];r._notifyReloadListener(s);const i=(f=s.providerUserInfo)!=null&&f.length?vp(s.providerUserInfo):[],o=$I(r.providerData,i),a=r.isAnonymous,B=!(r.email&&s.passwordHash)&&!(o!=null&&o.length),c=a?B:!1,h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new sc(s.createdAt,s.lastLoginAt),isAnonymous:c};Object.assign(r,h)}async function QI(r){const e=ve(r);await qa(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function $I(r,e){return[...r.filter(n=>!e.some(s=>s.providerId===n.providerId)),...e]}function vp(r){return r.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function WI(r,e){const t=await Ap(r,{},async()=>{const n=wo({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=r.config,o=await Rp(r,s,"/v1/token",`key=${i}`),a=await r._getAdditionalHeaders();a["Content-Type"]="application/x-www-form-urlencoded";const B={method:"POST",headers:a,body:n};return r.emulatorConfig&&Zs(r.emulatorConfig.host)&&(B.credentials="include"),Tp.fetch()(o,B)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function YI(r,e){return An(r,"POST","/v2/accounts:revokeToken",lr(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rs{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){re(e.idToken,"internal-error"),re(typeof e.idToken<"u","internal-error"),re(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):xf(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){re(e.length!==0,"internal-error");const t=xf(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(re(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:s,expiresIn:i}=await WI(e,t);this.updateTokensAndExpiration(n,s,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:s,expirationTime:i}=t,o=new Rs;return n&&(re(typeof n=="string","internal-error",{appName:e}),o.refreshToken=n),s&&(re(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(re(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Rs,this.toJSON())}_performRefresh(){return fn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xn(r,e){re(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Vt{constructor({uid:e,auth:t,stsTokenManager:n,...s}){this.providerId="firebase",this.proactiveRefresh=new zI(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new sc(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await Ps(this,this.stsTokenManager.getToken(this.auth,e));return re(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return KI(this,e)}reload(){return QI(this)}_assign(e){this!==e&&(re(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Vt({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){re(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await qa(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Tt(this.auth.app))return Promise.reject(Xt(this.auth));const e=await this.getIdToken();return await Ps(this,qI(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const n=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,o=t.photoURL??void 0,a=t.tenantId??void 0,B=t._redirectEventId??void 0,c=t.createdAt??void 0,h=t.lastLoginAt??void 0,{uid:f,emailVerified:C,isAnonymous:_,providerData:R,stsTokenManager:L}=t;re(f&&L,e,"internal-error");const G=Rs.fromJSON(this.name,L);re(typeof f=="string",e,"internal-error"),xn(n,e.name),xn(s,e.name),re(typeof C=="boolean",e,"internal-error"),re(typeof _=="boolean",e,"internal-error"),xn(i,e.name),xn(o,e.name),xn(a,e.name),xn(B,e.name),xn(c,e.name),xn(h,e.name);const Q=new Vt({uid:f,auth:e,email:s,emailVerified:C,displayName:n,isAnonymous:_,photoURL:o,phoneNumber:i,tenantId:a,stsTokenManager:G,createdAt:c,lastLoginAt:h});return R&&Array.isArray(R)&&(Q.providerData=R.map(te=>({...te}))),B&&(Q._redirectEventId=B),Q}static async _fromIdTokenResponse(e,t,n=!1){const s=new Rs;s.updateFromServerResponse(t);const i=new Vt({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:n});return await qa(i),i}static async _fromGetAccountInfoResponse(e,t,n){const s=t.users[0];re(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?vp(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),a=new Rs;a.updateFromIdToken(n);const B=new Vt({uid:s.localId,auth:e,stsTokenManager:a,isAnonymous:o}),c={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new sc(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(B,c),B}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lf=new Map;function dn(r){_n(r instanceof Function,"Expected a class definition");let e=Lf.get(r);return e?(_n(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,Lf.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}bp.type="NONE";const kf=bp;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Aa(r,e,t){return`firebase:${r}:${e}:${t}`}class vs{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:s,name:i}=this.auth;this.fullUserKey=Aa(this.userKey,s.apiKey,i),this.fullPersistenceKey=Aa("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await ja(this.auth,{idToken:e}).catch(()=>{});return t?Vt._fromGetAccountInfoResponse(this.auth,t,e):null}return Vt._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new vs(dn(kf),e,n);const s=(await Promise.all(t.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let i=s[0]||dn(kf);const o=Aa(n,e.config.apiKey,e.name);let a=null;for(const c of t)try{const h=await c._get(o);if(h){let f;if(typeof h=="string"){const C=await ja(e,{idToken:h}).catch(()=>{});if(!C)break;f=await Vt._fromGetAccountInfoResponse(e,C,h)}else f=Vt._fromJSON(e,h);c!==i&&(a=f),i=c;break}}catch{}const B=s.filter(c=>c._shouldAllowMigration);return!i._shouldAllowMigration||!B.length?new vs(i,e,n):(i=B[0],a&&await i._set(o,a.toJSON()),await Promise.all(t.map(async c=>{if(c!==i)try{await c._remove(o)}catch{}})),new vs(i,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vf(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Op(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Sp(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(xp(e))return"Blackberry";if(Lp(e))return"Webos";if(Pp(e))return"Safari";if((e.includes("chrome/")||Np(e))&&!e.includes("edge/"))return"Chrome";if(Fp(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function Sp(r=Je()){return/firefox\//i.test(r)}function Pp(r=Je()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Np(r=Je()){return/crios\//i.test(r)}function Op(r=Je()){return/iemobile/i.test(r)}function Fp(r=Je()){return/android/i.test(r)}function xp(r=Je()){return/blackberry/i.test(r)}function Lp(r=Je()){return/webos/i.test(r)}function $c(r=Je()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function XI(r=Je()){var e;return $c(r)&&!!((e=window.navigator)!=null&&e.standalone)}function ZI(){return gD()&&document.documentMode===10}function kp(r=Je()){return $c(r)||Fp(r)||Lp(r)||xp(r)||/windows phone/i.test(r)||Op(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vp(r,e=[]){let t;switch(r){case"Browser":t=Vf(Je());break;case"Worker":t=`${Vf(Je())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${ei}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ey{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=i=>new Promise((o,a)=>{try{const B=e(i);o(B)}catch(B){a(B)}});n.onAbort=t,this.queue.push(n);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ty(r,e={}){return An(r,"GET","/v2/passwordPolicy",lr(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ny=6;class ry{constructor(e){var n;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??ny,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((n=e.allowedNonAlphanumericCharacters)==null?void 0:n.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let s=0;s<e.length;s++)n=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sy{constructor(e,t,n,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Mf(this),this.idTokenSubscription=new Mf(this),this.beforeStateQueue=new ey(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Ip,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=dn(t)),this._initializationPromise=this.queue(async()=>{var n,s,i;if(!this._deleted&&(this.persistenceManager=await vs.create(this,e),(n=this._resolvePersistenceManagerAvailable)==null||n.call(this),!this._deleted)){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)==null?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await ja(this,{idToken:e}),n=await Vt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(Tt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let n=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(i=this.redirectUser)==null?void 0:i._redirectEventId,a=n==null?void 0:n._redirectEventId,B=await this.tryRedirectSignIn(e);(!o||o===a)&&(B!=null&&B.user)&&(n=B.user,s=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(n)}catch(o){n=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return re(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await qa(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=LI()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Tt(this.app))return Promise.reject(Xt(this));const t=e?ve(e):null;return t&&re(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&re(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Tt(this.app)?Promise.reject(Xt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Tt(this.app)?Promise.reject(Xt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(dn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await ty(this),t=new ry(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ns("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await YI(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&dn(e)||this._popupRedirectResolver;re(t,this,"argument-error"),this.redirectPersistenceManager=await vs.create(this,[dn(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)==null?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(re(a,this,"internal-error"),a.then(()=>{o||i(this.currentUser)}),typeof t=="function"){const B=e.addObserver(t,n,s);return()=>{o=!0,B()}}else{const B=e.addObserver(t);return()=>{o=!0,B()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return re(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Vp(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const n=await this._getAppCheckToken();return n&&(e["X-Firebase-AppCheck"]=n),e}async _getAppCheckToken(){var t;if(Tt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&yp(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function hr(r){return ve(r)}class Mf{constructor(e){this.auth=e,this.observer=null,this.addObserver=ID(t=>this.observer=t)}get next(){return re(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Du={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function iy(r){Du=r}function Mp(r){return Du.loadJS(r)}function oy(){return Du.recaptchaEnterpriseScript}function ay(){return Du.gapiScript}function uy(r){return`__${r}${Math.floor(Math.random()*1e6)}`}class By{constructor(){this.enterprise=new cy}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class cy{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ly="recaptcha-enterprise",Gp="NO_RECAPTCHA",Gf="onFirebaseAuthREInstanceReady";class jn{constructor(e){this.type=ly,this.auth=hr(e)}async verify(e="verify",t=!1){async function n(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,a)=>{jI(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(B=>{if(B.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{const c=new UI(B);return i.tenantId==null?i._agentRecaptchaConfig=c:i._tenantRecaptchaConfigs[i.tenantId]=c,o(c.siteKey)}}).catch(B=>{a(B)})})}function s(i,o,a){const B=window.grecaptcha;Ff(B)?B.enterprise.ready(()=>{B.enterprise.execute(i,{action:e}).then(c=>{o(c)}).catch(()=>{o(Gp)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new By().execute("siteKey",{action:"verify"}):new Promise((i,o)=>{n(this.auth).then(async a=>{if(!t&&Ff(window.grecaptcha)&&jn.scriptInjectionDeferred)await jn.scriptInjectionDeferred.promise,s(a,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let B=oy();B.length!==0&&(B+=a+`&onload=${Gf}`),jn.scriptInjectionDeferred=new hp,window[Gf]=()=>{var c;(c=jn.scriptInjectionDeferred)==null||c.resolve()},Mp(B).then(()=>{var c;return(c=jn.scriptInjectionDeferred)==null?void 0:c.promise}).then(()=>{s(a,i,o)}).catch(c=>{o(c)})}}).catch(a=>{o(a)})})}}jn.scriptInjectionDeferred=null;async function Hf(r,e,t,n=!1,s=!1){const i=new jn(r);let o;if(s)o=Gp;else try{o=await i.verify(t)}catch{o=await i.verify(t,!0)}const a={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in a){const B=a.phoneEnrollmentInfo.phoneNumber,c=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:B,recaptchaToken:c,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){const B=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:B,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return n?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function ic(r,e,t,n,s){var i;if((i=r._getRecaptchaConfig())!=null&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const o=await Hf(r,e,t,t==="getOobCode");return n(r,o)}else return n(r,e).catch(async o=>{if(o.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await Hf(r,e,t,t==="getOobCode");return n(r,a)}else return Promise.reject(o)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hy(r,e){const t=rs(r,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(tr(i,e??{}))return s;Gt(s,"already-initialized")}return t.initialize({options:e})}function fy(r,e){const t=(e==null?void 0:e.persistence)||[],n=(Array.isArray(t)?t:[t]).map(dn);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}function dy(r,e,t){const n=hr(r);re(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const s=!1,i=Hp(e),{host:o,port:a}=Cy(e),B=a===null?"":`:${a}`,c={url:`${i}//${o}${B}/`},h=Object.freeze({host:o,port:a,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!n._canInitEmulator){re(n.config.emulator&&n.emulatorConfig,n,"emulator-config-failed"),re(tr(c,n.config.emulator)&&tr(h,n.emulatorConfig),n,"emulator-config-failed");return}n.config.emulator=c,n.emulatorConfig=h,n.settings.appVerificationDisabledForTesting=!0,Zs(o)?Uc(`${i}//${o}${B}`):py()}function Hp(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function Cy(r){const e=Hp(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(n);if(s){const i=s[1];return{host:i,port:Uf(n.substr(i.length+1))}}else{const[i,o]=n.split(":");return{host:i,port:Uf(o)}}}function Uf(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function py(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wc{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return fn("not implemented")}_getIdTokenResponse(e){return fn("not implemented")}_linkToIdToken(e,t){return fn("not implemented")}_getReauthenticationResolver(e){return fn("not implemented")}}async function gy(r,e){return An(r,"POST","/v1/accounts:update",e)}async function my(r,e){return An(r,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ey(r,e){return Ao(r,"POST","/v1/accounts:signInWithPassword",lr(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _y(r,e){return Ao(r,"POST","/v1/accounts:signInWithEmailLink",lr(r,e))}async function Dy(r,e){return Ao(r,"POST","/v1/accounts:signInWithEmailLink",lr(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ro extends Wc{constructor(e,t,n,s=null){super("password",n),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new ro(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new ro(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ic(e,t,"signInWithPassword",Ey);case"emailLink":return _y(e,{email:this._email,oobCode:this._password});default:Gt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const n={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ic(e,n,"signUpPassword",my);case"emailLink":return Dy(e,{idToken:t,email:this._email,oobCode:this._password});default:Gt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bs(r,e){return Ao(r,"POST","/v1/accounts:signInWithIdp",lr(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Iy="http://localhost";class Kr extends Wc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Kr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Gt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:s,...i}=t;if(!n||!s)return null;const o=new Kr(n,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return bs(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,bs(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,bs(e,t)}buildRequest(){const e={requestUri:Iy,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=wo(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yy(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function wy(r){const e=Oi(Fi(r)).link,t=e?Oi(Fi(e)).deep_link_id:null,n=Oi(Fi(r)).deep_link_id;return(n?Oi(Fi(n)).link:null)||n||t||e||r}class Yc{constructor(e){const t=Oi(Fi(e)),n=t.apiKey??null,s=t.oobCode??null,i=yy(t.mode??null);re(n&&s&&i,"argument-error"),this.apiKey=n,this.operation=i,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=wy(e);try{return new Yc(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ti{constructor(){this.providerId=ti.PROVIDER_ID}static credential(e,t){return ro._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=Yc.parseLink(t);return re(n,"argument-error"),ro._fromEmailAndCode(e,n.code,n.tenantId)}}ti.PROVIDER_ID="password";ti.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ti.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Up{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ro extends Up{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn extends Ro{constructor(){super("facebook.com")}static credential(e){return Kr._fromParams({providerId:qn.PROVIDER_ID,signInMethod:qn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return qn.credentialFromTaggedObject(e)}static credentialFromError(e){return qn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return qn.credential(e.oauthAccessToken)}catch{return null}}}qn.FACEBOOK_SIGN_IN_METHOD="facebook.com";qn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn extends Ro{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Kr._fromParams({providerId:Kn.PROVIDER_ID,signInMethod:Kn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Kn.credentialFromTaggedObject(e)}static credentialFromError(e){return Kn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Kn.credential(t,n)}catch{return null}}}Kn.GOOGLE_SIGN_IN_METHOD="google.com";Kn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jn extends Ro{constructor(){super("github.com")}static credential(e){return Kr._fromParams({providerId:Jn.PROVIDER_ID,signInMethod:Jn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Jn.credentialFromTaggedObject(e)}static credentialFromError(e){return Jn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Jn.credential(e.oauthAccessToken)}catch{return null}}}Jn.GITHUB_SIGN_IN_METHOD="github.com";Jn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zn extends Ro{constructor(){super("twitter.com")}static credential(e,t){return Kr._fromParams({providerId:zn.PROVIDER_ID,signInMethod:zn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return zn.credentialFromTaggedObject(e)}static credentialFromError(e){return zn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return zn.credential(t,n)}catch{return null}}}zn.TWITTER_SIGN_IN_METHOD="twitter.com";zn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jp(r,e){return Ao(r,"POST","/v1/accounts:signUp",lr(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,s=!1){const i=await Vt._fromIdTokenResponse(e,n,s),o=jf(n);return new Dn({user:i,providerId:o,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const s=jf(n);return new Dn({user:e,providerId:s,_tokenResponse:n,operationType:t})}}function jf(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function f0(r){var s;if(Tt(r.app))return Promise.reject(Xt(r));const e=hr(r);if(await e._initializationPromise,(s=e.currentUser)!=null&&s.isAnonymous)return new Dn({user:e.currentUser,providerId:null,operationType:"signIn"});const t=await jp(e,{returnSecureToken:!0}),n=await Dn._fromIdTokenResponse(e,"signIn",t,!0);return await e._updateCurrentUser(n.user),n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ka extends un{constructor(e,t,n,s){super(t.code,t.message),this.operationType=n,this.user=s,Object.setPrototypeOf(this,Ka.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,s){return new Ka(e,t,n,s)}}function qp(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Ka._fromErrorAndOperation(r,i,e,n):i})}async function Ty(r,e,t=!1){const n=await Ps(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return Dn._forOperation(r,"link",n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Kp(r,e,t=!1){const{auth:n}=r;if(Tt(n.app))return Promise.reject(Xt(n));const s="reauthenticate";try{const i=await Ps(r,qp(n,s,e,r),t);re(i.idToken,n,"internal-error");const o=Qc(i.idToken);re(o,n,"internal-error");const{sub:a}=o;return re(r.uid===a,n,"user-mismatch"),Dn._forOperation(r,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&Gt(n,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jp(r,e,t=!1){if(Tt(r.app))return Promise.reject(Xt(r));const n="signIn",s=await qp(r,n,e),i=await Dn._fromIdTokenResponse(r,n,s);return t||await r._updateCurrentUser(i.user),i}async function Ay(r,e){return Jp(hr(r),e)}async function d0(r,e){return Kp(ve(r),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zp(r){const e=hr(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function C0(r,e,t){if(Tt(r.app))return Promise.reject(Xt(r));const n=hr(r),o=await ic(n,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",jp).catch(B=>{throw B.code==="auth/password-does-not-meet-requirements"&&zp(r),B}),a=await Dn._fromIdTokenResponse(n,"signIn",o);return await n._updateCurrentUser(a.user),a}function p0(r,e,t){return Tt(r.app)?Promise.reject(Xt(r)):Ay(ve(r),ti.credential(e,t)).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&zp(r),n})}function g0(r,e){return Ry(ve(r),null,e)}async function Ry(r,e,t){const{auth:n}=r,i={idToken:await r.getIdToken(),returnSecureToken:!0};t&&(i.password=t);const o=await Ps(r,gy(n,i));await r._updateTokensIfNecessary(o,!0)}function vy(r,e,t,n){return ve(r).onIdTokenChanged(e,t,n)}function by(r,e,t){return ve(r).beforeAuthStateChanged(e,t)}function m0(r,e,t,n){return ve(r).onAuthStateChanged(e,t,n)}function E0(r){return ve(r).signOut()}const Ja="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qp{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ja,"1"),this.storage.removeItem(Ja),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sy=1e3,Py=10;class $p extends Qp{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=kp(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),s=this.localCache[t];n!==s&&e(t,s,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,a,B)=>{this.notifyListeners(o,B)});return}const n=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(n);!t&&this.localCache[n]===o||this.notifyListeners(n,o)},i=this.storage.getItem(n);ZI()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Py):s()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},Sy)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}$p.type="LOCAL";const Ny=$p;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wp extends Qp{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Wp.type="SESSION";const Yp=Wp;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oy(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iu{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const n=new Iu(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:s,data:i}=t.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:s});const a=Array.from(o).map(async c=>c(t.origin,i)),B=await Oy(a);t.ports[0].postMessage({status:"done",eventId:n,eventType:s,response:B})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Iu.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xc(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fy{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((a,B)=>{const c=Xc("",20);s.port1.start();const h=setTimeout(()=>{B(new Error("unsupported_event"))},n);o={messageChannel:s,onMessage(f){const C=f;if(C.data.eventId===c)switch(C.data.status){case"ack":clearTimeout(h),i=setTimeout(()=>{B(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),a(C.data.response);break;default:clearTimeout(h),clearTimeout(i),B(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zt(){return window}function xy(r){Zt().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xp(){return typeof Zt().WorkerGlobalScope<"u"&&typeof Zt().importScripts=="function"}async function Ly(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function ky(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)==null?void 0:r.controller)||null}function Vy(){return Xp()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zp="firebaseLocalStorageDb",My=1,za="firebaseLocalStorage",eg="fbase_key";class vo{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function yu(r,e){return r.transaction([za],e?"readwrite":"readonly").objectStore(za)}function Gy(){const r=indexedDB.deleteDatabase(Zp);return new vo(r).toPromise()}function tg(){const r=indexedDB.open(Zp,My);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(za,{keyPath:eg})}catch(s){t(s)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(za)?e(n):(n.close(),await Gy(),e(await tg()))})})}async function qf(r,e,t){const n=yu(r,!0).put({[eg]:e,value:t});return new vo(n).toPromise()}async function Hy(r,e){const t=yu(r,!1).get(e),n=await new vo(t).toPromise();return n===void 0?null:n.value}function Kf(r,e){const t=yu(r,!0).delete(e);return new vo(t).toPromise()}const Uy=800,jy=3;class ng{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=tg(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(this.isClosing||t++>jy)throw n;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return Xp()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Iu._getInstance(Vy()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,n;if(this.activeServiceWorker=await Ly(),!this.activeServiceWorker)return;this.sender=new Fy(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(n=e[0])!=null&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||ky()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await qf(e,Ja,"1"),await Kf(e,Ja)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>qf(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>Hy(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Kf(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(s=>{const i=yu(s,!1).getAll();return new vo(i).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)n.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!n.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}catch(e){return this.isClosing||yp(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Uy)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}ng.type="LOCAL";const qy=ng;new To(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ky(r,e){return e?dn(e):(re(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zc extends Wc{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return bs(e,this._buildIdpRequest())}_linkToIdToken(e,t){return bs(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return bs(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Jy(r){return Jp(r.auth,new Zc(r),r.bypassAuthState)}function zy(r){const{auth:e,user:t}=r;return re(t,e,"internal-error"),Kp(t,new Zc(r),r.bypassAuthState)}async function Qy(r){const{auth:e,user:t}=r;return re(t,e,"internal-error"),Ty(t,new Zc(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rg{constructor(e,t,n,s,i=!1){this.auth=e,this.resolver=n,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:s,tenantId:i,error:o,type:a}=e;if(o){this.reject(o);return}const B={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(B))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Jy;case"linkViaPopup":case"linkViaRedirect":return Qy;case"reauthViaPopup":case"reauthViaRedirect":return zy;default:Gt(this.auth,"internal-error")}}resolve(e){_n(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){_n(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $y=new To(2e3,1e4);class As extends rg{constructor(e,t,n,s,i){super(e,t,s,i),this.provider=n,this.authWindow=null,this.pollId=null,As.currentPopupAction&&As.currentPopupAction.cancel(),As.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return re(e,this.auth,"internal-error"),e}async onExecution(){_n(this.filter.length===1,"Popup operations only handle one event");const e=Xc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Yt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Yt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,As.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;if((n=(t=this.authWindow)==null?void 0:t.window)!=null&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Yt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,$y.get())};e()}}As.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wy="pendingRedirect",Ra=new Map;class Yy extends rg{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=Ra.get(this.auth._key());if(!e){try{const n=await Xy(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}Ra.set(this.auth._key(),e)}return this.bypassAuthState||Ra.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Xy(r,e){const t=tw(e),n=ew(r);if(!await n._isAvailable())return!1;const s=await n._get(t)==="true";return await n._remove(t),s}function Zy(r,e){Ra.set(r._key(),e)}function ew(r){return dn(r._redirectPersistence)}function tw(r){return Aa(Wy,r.config.apiKey,r.name)}async function nw(r,e,t=!1){if(Tt(r.app))return Promise.reject(Xt(r));const n=hr(r),s=Ky(n,e),o=await new Yy(n,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await n._persistUserIfCurrent(o.user),await n._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rw=600*1e3;class sw{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!iw(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!sg(e)){const s=((n=e.error.code)==null?void 0:n.split("auth/")[1])||"internal-error";t.onError(Yt(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=rw&&this.cachedEventUids.clear(),this.cachedEventUids.has(Jf(e))}saveEventToCache(e){this.cachedEventUids.add(Jf(e)),this.lastProcessedEventTime=Date.now()}}function Jf(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function sg({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function iw(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return sg(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ow(r,e={}){return An(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,uw=/^https?/;async function Bw(r){if(r.config.emulator)return;const{authorizedDomains:e}=await ow(r);for(const t of e)try{if(cw(t))return}catch{}Gt(r,"unauthorized-domain")}function cw(r){const e=rc(),{protocol:t,hostname:n}=new URL(e);if(r.startsWith("chrome-extension://")){const o=new URL(r);return o.hostname===""&&n===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===n}if(!uw.test(t))return!1;if(aw.test(r))return n===r;const s=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lw=new To(3e4,6e4);function zf(){const r=Zt().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function hw(r){return new Promise((e,t)=>{var s,i,o;function n(){zf(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{zf(),t(Yt(r,"network-request-failed"))},timeout:lw.get()})}if((i=(s=Zt().gapi)==null?void 0:s.iframes)!=null&&i.Iframe)e(gapi.iframes.getContext());else if((o=Zt().gapi)!=null&&o.load)n();else{const a=uy("iframefcb");return Zt()[a]=()=>{gapi.load?n():t(Yt(r,"network-request-failed"))},Mp(`${ay()}?onload=${a}`).catch(B=>t(B))}}).catch(e=>{throw va=null,e})}let va=null;function fw(r){return va=va||hw(r),va}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dw=new To(5e3,15e3),Cw="__/auth/iframe",pw="emulator/auth/iframe",gw={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},mw=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Ew(r){const e=r.config;re(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?zc(e,pw):`https://${r.config.authDomain}/${Cw}`,n={apiKey:e.apiKey,appName:r.name,v:ei},s=mw.get(r.config.apiHost);s&&(n.eid=s);const i=r._getFrameworks();return i.length&&(n.fw=i.join(",")),`${t}?${wo(n).slice(1)}`}async function _w(r){const e=await fw(r),t=Zt().gapi;return re(t,r,"internal-error"),e.open({where:document.body,url:Ew(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:gw,dontclear:!0},n=>new Promise(async(s,i)=>{await n.restyle({setHideOnLeave:!1});const o=Yt(r,"network-request-failed"),a=Zt().setTimeout(()=>{i(o)},dw.get());function B(){Zt().clearTimeout(a),s(n)}n.ping(B).then(B,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dw={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Iw=500,yw=600,ww="_blank",Tw="http://localhost";class Qf{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Aw(r,e,t,n=Iw,s=yw){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let a="";const B={...Dw,width:n.toString(),height:s.toString(),top:i,left:o},c=Je().toLowerCase();t&&(a=Np(c)?ww:t),Sp(c)&&(e=e||Tw,B.scrollbars="yes");const h=Object.entries(B).reduce((C,[_,R])=>`${C}${_}=${R},`,"");if(XI(c)&&a!=="_self")return Rw(e||"",a),new Qf(null);const f=window.open(e||"",a,h);re(f,r,"popup-blocked");try{f.focus()}catch{}return new Qf(f)}function Rw(r,e){const t=document.createElement("a");t.href=r,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vw="__/auth/handler",bw="emulator/auth/handler",Sw=encodeURIComponent("fac");async function $f(r,e,t,n,s,i){re(r.config.authDomain,r,"auth-domain-config-required"),re(r.config.apiKey,r,"invalid-api-key");const o={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:n,v:ei,eventId:s};if(e instanceof Up){e.setDefaultLanguage(r.languageCode),o.providerId=e.providerId||"",DD(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,f]of Object.entries({}))o[h]=f}if(e instanceof Ro){const h=e.getScopes().filter(f=>f!=="");h.length>0&&(o.scopes=h.join(","))}r.tenantId&&(o.tid=r.tenantId);const a=o;for(const h of Object.keys(a))a[h]===void 0&&delete a[h];const B=await r._getAppCheckToken(),c=B?`#${Sw}=${encodeURIComponent(B)}`:"";return`${Pw(r)}?${wo(a).slice(1)}${c}`}function Pw({config:r}){return r.emulator?zc(r,bw):`https://${r.authDomain}/${vw}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NB="webStorageSupport";class Nw{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Yp,this._completeRedirectFn=nw,this._overrideRedirectResult=Zy}async _openPopup(e,t,n,s){var o;_n((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const i=await $f(e,t,n,rc(),s);return Aw(e,i,Xc())}async _openRedirect(e,t,n,s){await this._originValidation(e);const i=await $f(e,t,n,rc(),s);return xy(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(_n(i,"If manager is not set, promise should be"),i)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await _w(e),n=new sw(e);return t.register("authEvent",s=>(re(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:n.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(NB,{type:NB},s=>{var o;const i=(o=s==null?void 0:s[0])==null?void 0:o[NB];i!==void 0&&t(!!i),Gt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Bw(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return kp()||Pp()||$c()}}const Ow=Nw;var Wf="@firebase/auth",Yf="1.13.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fw{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){re(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xw(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Lw(r){rn(new Mt("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=n.options;re(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const B={apiKey:o,authDomain:a,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Vp(r)},c=new sy(n,s,i,B);return fy(c,t),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),rn(new Mt("auth-internal",e=>{const t=hr(e.getProvider("auth").getImmediate());return(n=>new Fw(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ot(Wf,Yf,xw(r)),Ot(Wf,Yf,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kw=300,Vw=lp("authIdTokenMaxAge")||kw;let Xf=null;const Mw=r=>async e=>{const t=e&&await e.getIdTokenResult(),n=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>Vw)return;const s=t==null?void 0:t.token;Xf!==s&&(Xf=s,await fetch(r,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function _0(r=Kc()){const e=rs(r,"auth");if(e.isInitialized())return e.getImmediate();const t=hy(r,{popupRedirectResolver:Ow,persistence:[qy,Ny,Yp]}),n=lp("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(n,location.origin);if(location.origin===i.origin){const o=Mw(i.toString());by(t,o,()=>o(t.currentUser)),vy(t,a=>o(a))}}const s=Bp("auth");return s&&dy(t,`http://${s}`),t}function Gw(){var r;return((r=document.getElementsByTagName("head"))==null?void 0:r[0])??document}iy({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=s=>{const i=Yt("internal-error");i.customData=s,t(i)},n.type="text/javascript",n.charset="UTF-8",Gw().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Lw("Browser");var Zf=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Yn,ig;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(w,E){function I(){}I.prototype=E.prototype,w.F=E.prototype,w.prototype=new I,w.prototype.constructor=w,w.D=function(v,A,P){for(var D=Array(arguments.length-2),ft=2;ft<arguments.length;ft++)D[ft-2]=arguments[ft];return E.prototype[A].apply(v,D)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(n,t),n.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(w,E,I){I||(I=0);const v=Array(16);if(typeof E=="string")for(var A=0;A<16;++A)v[A]=E.charCodeAt(I++)|E.charCodeAt(I++)<<8|E.charCodeAt(I++)<<16|E.charCodeAt(I++)<<24;else for(A=0;A<16;++A)v[A]=E[I++]|E[I++]<<8|E[I++]<<16|E[I++]<<24;E=w.g[0],I=w.g[1],A=w.g[2];let P=w.g[3],D;D=E+(P^I&(A^P))+v[0]+3614090360&4294967295,E=I+(D<<7&4294967295|D>>>25),D=P+(A^E&(I^A))+v[1]+3905402710&4294967295,P=E+(D<<12&4294967295|D>>>20),D=A+(I^P&(E^I))+v[2]+606105819&4294967295,A=P+(D<<17&4294967295|D>>>15),D=I+(E^A&(P^E))+v[3]+3250441966&4294967295,I=A+(D<<22&4294967295|D>>>10),D=E+(P^I&(A^P))+v[4]+4118548399&4294967295,E=I+(D<<7&4294967295|D>>>25),D=P+(A^E&(I^A))+v[5]+1200080426&4294967295,P=E+(D<<12&4294967295|D>>>20),D=A+(I^P&(E^I))+v[6]+2821735955&4294967295,A=P+(D<<17&4294967295|D>>>15),D=I+(E^A&(P^E))+v[7]+4249261313&4294967295,I=A+(D<<22&4294967295|D>>>10),D=E+(P^I&(A^P))+v[8]+1770035416&4294967295,E=I+(D<<7&4294967295|D>>>25),D=P+(A^E&(I^A))+v[9]+2336552879&4294967295,P=E+(D<<12&4294967295|D>>>20),D=A+(I^P&(E^I))+v[10]+4294925233&4294967295,A=P+(D<<17&4294967295|D>>>15),D=I+(E^A&(P^E))+v[11]+2304563134&4294967295,I=A+(D<<22&4294967295|D>>>10),D=E+(P^I&(A^P))+v[12]+1804603682&4294967295,E=I+(D<<7&4294967295|D>>>25),D=P+(A^E&(I^A))+v[13]+4254626195&4294967295,P=E+(D<<12&4294967295|D>>>20),D=A+(I^P&(E^I))+v[14]+2792965006&4294967295,A=P+(D<<17&4294967295|D>>>15),D=I+(E^A&(P^E))+v[15]+1236535329&4294967295,I=A+(D<<22&4294967295|D>>>10),D=E+(A^P&(I^A))+v[1]+4129170786&4294967295,E=I+(D<<5&4294967295|D>>>27),D=P+(I^A&(E^I))+v[6]+3225465664&4294967295,P=E+(D<<9&4294967295|D>>>23),D=A+(E^I&(P^E))+v[11]+643717713&4294967295,A=P+(D<<14&4294967295|D>>>18),D=I+(P^E&(A^P))+v[0]+3921069994&4294967295,I=A+(D<<20&4294967295|D>>>12),D=E+(A^P&(I^A))+v[5]+3593408605&4294967295,E=I+(D<<5&4294967295|D>>>27),D=P+(I^A&(E^I))+v[10]+38016083&4294967295,P=E+(D<<9&4294967295|D>>>23),D=A+(E^I&(P^E))+v[15]+3634488961&4294967295,A=P+(D<<14&4294967295|D>>>18),D=I+(P^E&(A^P))+v[4]+3889429448&4294967295,I=A+(D<<20&4294967295|D>>>12),D=E+(A^P&(I^A))+v[9]+568446438&4294967295,E=I+(D<<5&4294967295|D>>>27),D=P+(I^A&(E^I))+v[14]+3275163606&4294967295,P=E+(D<<9&4294967295|D>>>23),D=A+(E^I&(P^E))+v[3]+4107603335&4294967295,A=P+(D<<14&4294967295|D>>>18),D=I+(P^E&(A^P))+v[8]+1163531501&4294967295,I=A+(D<<20&4294967295|D>>>12),D=E+(A^P&(I^A))+v[13]+2850285829&4294967295,E=I+(D<<5&4294967295|D>>>27),D=P+(I^A&(E^I))+v[2]+4243563512&4294967295,P=E+(D<<9&4294967295|D>>>23),D=A+(E^I&(P^E))+v[7]+1735328473&4294967295,A=P+(D<<14&4294967295|D>>>18),D=I+(P^E&(A^P))+v[12]+2368359562&4294967295,I=A+(D<<20&4294967295|D>>>12),D=E+(I^A^P)+v[5]+4294588738&4294967295,E=I+(D<<4&4294967295|D>>>28),D=P+(E^I^A)+v[8]+2272392833&4294967295,P=E+(D<<11&4294967295|D>>>21),D=A+(P^E^I)+v[11]+1839030562&4294967295,A=P+(D<<16&4294967295|D>>>16),D=I+(A^P^E)+v[14]+4259657740&4294967295,I=A+(D<<23&4294967295|D>>>9),D=E+(I^A^P)+v[1]+2763975236&4294967295,E=I+(D<<4&4294967295|D>>>28),D=P+(E^I^A)+v[4]+1272893353&4294967295,P=E+(D<<11&4294967295|D>>>21),D=A+(P^E^I)+v[7]+4139469664&4294967295,A=P+(D<<16&4294967295|D>>>16),D=I+(A^P^E)+v[10]+3200236656&4294967295,I=A+(D<<23&4294967295|D>>>9),D=E+(I^A^P)+v[13]+681279174&4294967295,E=I+(D<<4&4294967295|D>>>28),D=P+(E^I^A)+v[0]+3936430074&4294967295,P=E+(D<<11&4294967295|D>>>21),D=A+(P^E^I)+v[3]+3572445317&4294967295,A=P+(D<<16&4294967295|D>>>16),D=I+(A^P^E)+v[6]+76029189&4294967295,I=A+(D<<23&4294967295|D>>>9),D=E+(I^A^P)+v[9]+3654602809&4294967295,E=I+(D<<4&4294967295|D>>>28),D=P+(E^I^A)+v[12]+3873151461&4294967295,P=E+(D<<11&4294967295|D>>>21),D=A+(P^E^I)+v[15]+530742520&4294967295,A=P+(D<<16&4294967295|D>>>16),D=I+(A^P^E)+v[2]+3299628645&4294967295,I=A+(D<<23&4294967295|D>>>9),D=E+(A^(I|~P))+v[0]+4096336452&4294967295,E=I+(D<<6&4294967295|D>>>26),D=P+(I^(E|~A))+v[7]+1126891415&4294967295,P=E+(D<<10&4294967295|D>>>22),D=A+(E^(P|~I))+v[14]+2878612391&4294967295,A=P+(D<<15&4294967295|D>>>17),D=I+(P^(A|~E))+v[5]+4237533241&4294967295,I=A+(D<<21&4294967295|D>>>11),D=E+(A^(I|~P))+v[12]+1700485571&4294967295,E=I+(D<<6&4294967295|D>>>26),D=P+(I^(E|~A))+v[3]+2399980690&4294967295,P=E+(D<<10&4294967295|D>>>22),D=A+(E^(P|~I))+v[10]+4293915773&4294967295,A=P+(D<<15&4294967295|D>>>17),D=I+(P^(A|~E))+v[1]+2240044497&4294967295,I=A+(D<<21&4294967295|D>>>11),D=E+(A^(I|~P))+v[8]+1873313359&4294967295,E=I+(D<<6&4294967295|D>>>26),D=P+(I^(E|~A))+v[15]+4264355552&4294967295,P=E+(D<<10&4294967295|D>>>22),D=A+(E^(P|~I))+v[6]+2734768916&4294967295,A=P+(D<<15&4294967295|D>>>17),D=I+(P^(A|~E))+v[13]+1309151649&4294967295,I=A+(D<<21&4294967295|D>>>11),D=E+(A^(I|~P))+v[4]+4149444226&4294967295,E=I+(D<<6&4294967295|D>>>26),D=P+(I^(E|~A))+v[11]+3174756917&4294967295,P=E+(D<<10&4294967295|D>>>22),D=A+(E^(P|~I))+v[2]+718787259&4294967295,A=P+(D<<15&4294967295|D>>>17),D=I+(P^(A|~E))+v[9]+3951481745&4294967295,w.g[0]=w.g[0]+E&4294967295,w.g[1]=w.g[1]+(A+(D<<21&4294967295|D>>>11))&4294967295,w.g[2]=w.g[2]+A&4294967295,w.g[3]=w.g[3]+P&4294967295}n.prototype.v=function(w,E){E===void 0&&(E=w.length);const I=E-this.blockSize,v=this.C;let A=this.h,P=0;for(;P<E;){if(A==0)for(;P<=I;)s(this,w,P),P+=this.blockSize;if(typeof w=="string"){for(;P<E;)if(v[A++]=w.charCodeAt(P++),A==this.blockSize){s(this,v),A=0;break}}else for(;P<E;)if(v[A++]=w[P++],A==this.blockSize){s(this,v),A=0;break}}this.h=A,this.o+=E},n.prototype.A=function(){var w=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);w[0]=128;for(var E=1;E<w.length-8;++E)w[E]=0;E=this.o*8;for(var I=w.length-8;I<w.length;++I)w[I]=E&255,E/=256;for(this.v(w),w=Array(16),E=0,I=0;I<4;++I)for(let v=0;v<32;v+=8)w[E++]=this.g[I]>>>v&255;return w};function i(w,E){var I=a;return Object.prototype.hasOwnProperty.call(I,w)?I[w]:I[w]=E(w)}function o(w,E){this.h=E;const I=[];let v=!0;for(let A=w.length-1;A>=0;A--){const P=w[A]|0;v&&P==E||(I[A]=P,v=!1)}this.g=I}var a={};function B(w){return-128<=w&&w<128?i(w,function(E){return new o([E|0],E<0?-1:0)}):new o([w|0],w<0?-1:0)}function c(w){if(isNaN(w)||!isFinite(w))return f;if(w<0)return G(c(-w));const E=[];let I=1;for(let v=0;w>=I;v++)E[v]=w/I|0,I*=4294967296;return new o(E,0)}function h(w,E){if(w.length==0)throw Error("number format error: empty string");if(E=E||10,E<2||36<E)throw Error("radix out of range: "+E);if(w.charAt(0)=="-")return G(h(w.substring(1),E));if(w.indexOf("-")>=0)throw Error('number format error: interior "-" character');const I=c(Math.pow(E,8));let v=f;for(let P=0;P<w.length;P+=8){var A=Math.min(8,w.length-P);const D=parseInt(w.substring(P,P+A),E);A<8?(A=c(Math.pow(E,A)),v=v.j(A).add(c(D))):(v=v.j(I),v=v.add(c(D)))}return v}var f=B(0),C=B(1),_=B(16777216);r=o.prototype,r.m=function(){if(L(this))return-G(this).m();let w=0,E=1;for(let I=0;I<this.g.length;I++){const v=this.i(I);w+=(v>=0?v:4294967296+v)*E,E*=4294967296}return w},r.toString=function(w){if(w=w||10,w<2||36<w)throw Error("radix out of range: "+w);if(R(this))return"0";if(L(this))return"-"+G(this).toString(w);const E=c(Math.pow(w,6));var I=this;let v="";for(;;){const A=ge(I,E).g;I=Q(I,A.j(E));let P=((I.g.length>0?I.g[0]:I.h)>>>0).toString(w);if(I=A,R(I))return P+v;for(;P.length<6;)P="0"+P;v=P+v}},r.i=function(w){return w<0?0:w<this.g.length?this.g[w]:this.h};function R(w){if(w.h!=0)return!1;for(let E=0;E<w.g.length;E++)if(w.g[E]!=0)return!1;return!0}function L(w){return w.h==-1}r.l=function(w){return w=Q(this,w),L(w)?-1:R(w)?0:1};function G(w){const E=w.g.length,I=[];for(let v=0;v<E;v++)I[v]=~w.g[v];return new o(I,~w.h).add(C)}r.abs=function(){return L(this)?G(this):this},r.add=function(w){const E=Math.max(this.g.length,w.g.length),I=[];let v=0;for(let A=0;A<=E;A++){let P=v+(this.i(A)&65535)+(w.i(A)&65535),D=(P>>>16)+(this.i(A)>>>16)+(w.i(A)>>>16);v=D>>>16,P&=65535,D&=65535,I[A]=D<<16|P}return new o(I,I[I.length-1]&-2147483648?-1:0)};function Q(w,E){return w.add(G(E))}r.j=function(w){if(R(this)||R(w))return f;if(L(this))return L(w)?G(this).j(G(w)):G(G(this).j(w));if(L(w))return G(this.j(G(w)));if(this.l(_)<0&&w.l(_)<0)return c(this.m()*w.m());const E=this.g.length+w.g.length,I=[];for(var v=0;v<2*E;v++)I[v]=0;for(v=0;v<this.g.length;v++)for(let A=0;A<w.g.length;A++){const P=this.i(v)>>>16,D=this.i(v)&65535,ft=w.i(A)>>>16,mr=w.i(A)&65535;I[2*v+2*A]+=D*mr,te(I,2*v+2*A),I[2*v+2*A+1]+=P*mr,te(I,2*v+2*A+1),I[2*v+2*A+1]+=D*ft,te(I,2*v+2*A+1),I[2*v+2*A+2]+=P*ft,te(I,2*v+2*A+2)}for(w=0;w<E;w++)I[w]=I[2*w+1]<<16|I[2*w];for(w=E;w<2*E;w++)I[w]=0;return new o(I,0)};function te(w,E){for(;(w[E]&65535)!=w[E];)w[E+1]+=w[E]>>>16,w[E]&=65535,E++}function se(w,E){this.g=w,this.h=E}function ge(w,E){if(R(E))throw Error("division by zero");if(R(w))return new se(f,f);if(L(w))return E=ge(G(w),E),new se(G(E.g),G(E.h));if(L(E))return E=ge(w,G(E)),new se(G(E.g),E.h);if(w.g.length>30){if(L(w)||L(E))throw Error("slowDivide_ only works with positive integers.");for(var I=C,v=E;v.l(w)<=0;)I=he(I),v=he(v);var A=ue(I,1),P=ue(v,1);for(v=ue(v,2),I=ue(I,2);!R(v);){var D=P.add(v);D.l(w)<=0&&(A=A.add(I),P=D),v=ue(v,1),I=ue(I,1)}return E=Q(w,A.j(E)),new se(A,E)}for(A=f;w.l(E)>=0;){for(I=Math.max(1,Math.floor(w.m()/E.m())),v=Math.ceil(Math.log(I)/Math.LN2),v=v<=48?1:Math.pow(2,v-48),P=c(I),D=P.j(E);L(D)||D.l(w)>0;)I-=v,P=c(I),D=P.j(E);R(P)&&(P=C),A=A.add(P),w=Q(w,D)}return new se(A,w)}r.B=function(w){return ge(this,w).h},r.and=function(w){const E=Math.max(this.g.length,w.g.length),I=[];for(let v=0;v<E;v++)I[v]=this.i(v)&w.i(v);return new o(I,this.h&w.h)},r.or=function(w){const E=Math.max(this.g.length,w.g.length),I=[];for(let v=0;v<E;v++)I[v]=this.i(v)|w.i(v);return new o(I,this.h|w.h)},r.xor=function(w){const E=Math.max(this.g.length,w.g.length),I=[];for(let v=0;v<E;v++)I[v]=this.i(v)^w.i(v);return new o(I,this.h^w.h)};function he(w){const E=w.g.length+1,I=[];for(let v=0;v<E;v++)I[v]=w.i(v)<<1|w.i(v-1)>>>31;return new o(I,w.h)}function ue(w,E){const I=E>>5;E%=32;const v=w.g.length-I,A=[];for(let P=0;P<v;P++)A[P]=E>0?w.i(P+I)>>>E|w.i(P+I+1)<<32-E:w.i(P+I);return new o(A,w.h)}n.prototype.digest=n.prototype.A,n.prototype.reset=n.prototype.u,n.prototype.update=n.prototype.v,ig=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=c,o.fromString=h,Yn=o}).apply(typeof Zf<"u"?Zf:typeof self<"u"?self:typeof window<"u"?window:{});var ca=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var og,xi,ag,ba,oc,ug,Bg,cg;(function(){var r,e=Object.defineProperty;function t(u){u=[typeof globalThis=="object"&&globalThis,u,typeof window=="object"&&window,typeof self=="object"&&self,typeof ca=="object"&&ca];for(var l=0;l<u.length;++l){var d=u[l];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var n=t(this);function s(u,l){if(l)e:{var d=n;u=u.split(".");for(var p=0;p<u.length-1;p++){var S=u[p];if(!(S in d))break e;d=d[S]}u=u[u.length-1],p=d[u],l=l(p),l!=p&&l!=null&&e(d,u,{configurable:!0,writable:!0,value:l})}}s("Symbol.dispose",function(u){return u||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(u){return u||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(u){return u||function(l){var d=[],p;for(p in l)Object.prototype.hasOwnProperty.call(l,p)&&d.push([p,l[p]]);return d}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function a(u){var l=typeof u;return l=="object"&&u!=null||l=="function"}function B(u,l,d){return u.call.apply(u.bind,arguments)}function c(u,l,d){return c=B,c.apply(null,arguments)}function h(u,l){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),u.apply(this,p)}}function f(u,l){function d(){}d.prototype=l.prototype,u.Z=l.prototype,u.prototype=new d,u.prototype.constructor=u,u.Ob=function(p,S,N){for(var z=Array(arguments.length-2),ae=2;ae<arguments.length;ae++)z[ae-2]=arguments[ae];return l.prototype[S].apply(p,z)}}var C=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?u=>u&&AsyncContext.Snapshot.wrap(u):u=>u;function _(u){const l=u.length;if(l>0){const d=Array(l);for(let p=0;p<l;p++)d[p]=u[p];return d}return[]}function R(u,l){for(let p=1;p<arguments.length;p++){const S=arguments[p];var d=typeof S;if(d=d!="object"?d:S?Array.isArray(S)?"array":d:"null",d=="array"||d=="object"&&typeof S.length=="number"){d=u.length||0;const N=S.length||0;u.length=d+N;for(let z=0;z<N;z++)u[d+z]=S[z]}else u.push(S)}}class L{constructor(l,d){this.i=l,this.j=d,this.h=0,this.g=null}get(){let l;return this.h>0?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function G(u){o.setTimeout(()=>{throw u},0)}function Q(){var u=w;let l=null;return u.g&&(l=u.g,u.g=u.g.next,u.g||(u.h=null),l.next=null),l}class te{constructor(){this.h=this.g=null}add(l,d){const p=se.get();p.set(l,d),this.h?this.h.next=p:this.g=p,this.h=p}}var se=new L(()=>new ge,u=>u.reset());class ge{constructor(){this.next=this.g=this.h=null}set(l,d){this.h=l,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let he,ue=!1,w=new te,E=()=>{const u=Promise.resolve(void 0);he=()=>{u.then(I)}};function I(){for(var u;u=Q();){try{u.h.call(u.g)}catch(d){G(d)}var l=se;l.j(u),l.h<100&&(l.h++,u.next=l.g,l.g=u)}ue=!1}function v(){this.u=this.u,this.C=this.C}v.prototype.u=!1,v.prototype.dispose=function(){this.u||(this.u=!0,this.N())},v.prototype[Symbol.dispose]=function(){this.dispose()},v.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function A(u,l){this.type=u,this.g=this.target=l,this.defaultPrevented=!1}A.prototype.h=function(){this.defaultPrevented=!0};var P=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var u=!1,l=Object.defineProperty({},"passive",{get:function(){u=!0}});try{const d=()=>{};o.addEventListener("test",d,l),o.removeEventListener("test",d,l)}catch{}return u})();function D(u){return/^[\s\xa0]*$/.test(u)}function ft(u,l){A.call(this,u?u.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,u&&this.init(u,l)}f(ft,A),ft.prototype.init=function(u,l){const d=this.type=u.type,p=u.changedTouches&&u.changedTouches.length?u.changedTouches[0]:null;this.target=u.target||u.srcElement,this.g=l,l=u.relatedTarget,l||(d=="mouseover"?l=u.fromElement:d=="mouseout"&&(l=u.toElement)),this.relatedTarget=l,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=u.clientX!==void 0?u.clientX:u.pageX,this.clientY=u.clientY!==void 0?u.clientY:u.pageY,this.screenX=u.screenX||0,this.screenY=u.screenY||0),this.button=u.button,this.key=u.key||"",this.ctrlKey=u.ctrlKey,this.altKey=u.altKey,this.shiftKey=u.shiftKey,this.metaKey=u.metaKey,this.pointerId=u.pointerId||0,this.pointerType=u.pointerType,this.state=u.state,this.i=u,u.defaultPrevented&&ft.Z.h.call(this)},ft.prototype.h=function(){ft.Z.h.call(this);const u=this.i;u.preventDefault?u.preventDefault():u.returnValue=!1};var mr="closure_listenable_"+(Math.random()*1e6|0),w_=0;function T_(u,l,d,p,S){this.listener=u,this.proxy=null,this.src=l,this.type=d,this.capture=!!p,this.ha=S,this.key=++w_,this.da=this.fa=!1}function Qo(u){u.da=!0,u.listener=null,u.proxy=null,u.src=null,u.ha=null}function $o(u,l,d){for(const p in u)l.call(d,u[p],p,u)}function A_(u,l){for(const d in u)l.call(void 0,u[d],d,u)}function Dh(u){const l={};for(const d in u)l[d]=u[d];return l}const Ih="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function yh(u,l){let d,p;for(let S=1;S<arguments.length;S++){p=arguments[S];for(d in p)u[d]=p[d];for(let N=0;N<Ih.length;N++)d=Ih[N],Object.prototype.hasOwnProperty.call(p,d)&&(u[d]=p[d])}}function Wo(u){this.src=u,this.g={},this.h=0}Wo.prototype.add=function(u,l,d,p,S){const N=u.toString();u=this.g[N],u||(u=this.g[N]=[],this.h++);const z=rB(u,l,p,S);return z>-1?(l=u[z],d||(l.fa=!1)):(l=new T_(l,this.src,N,!!p,S),l.fa=d,u.push(l)),l};function nB(u,l){const d=l.type;if(d in u.g){var p=u.g[d],S=Array.prototype.indexOf.call(p,l,void 0),N;(N=S>=0)&&Array.prototype.splice.call(p,S,1),N&&(Qo(l),u.g[d].length==0&&(delete u.g[d],u.h--))}}function rB(u,l,d,p){for(let S=0;S<u.length;++S){const N=u[S];if(!N.da&&N.listener==l&&N.capture==!!d&&N.ha==p)return S}return-1}var sB="closure_lm_"+(Math.random()*1e6|0),iB={};function wh(u,l,d,p,S){if(Array.isArray(l)){for(let N=0;N<l.length;N++)wh(u,l[N],d,p,S);return null}return d=Rh(d),u&&u[mr]?u.J(l,d,a(p)?!!p.capture:!1,S):R_(u,l,d,!1,p,S)}function R_(u,l,d,p,S,N){if(!l)throw Error("Invalid event type");const z=a(S)?!!S.capture:!!S;let ae=aB(u);if(ae||(u[sB]=ae=new Wo(u)),d=ae.add(l,d,p,z,N),d.proxy)return d;if(p=v_(),d.proxy=p,p.src=u,p.listener=d,u.addEventListener)P||(S=z),S===void 0&&(S=!1),u.addEventListener(l.toString(),p,S);else if(u.attachEvent)u.attachEvent(Ah(l.toString()),p);else if(u.addListener&&u.removeListener)u.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function v_(){function u(d){return l.call(u.src,u.listener,d)}const l=b_;return u}function Th(u,l,d,p,S){if(Array.isArray(l))for(var N=0;N<l.length;N++)Th(u,l[N],d,p,S);else p=a(p)?!!p.capture:!!p,d=Rh(d),u&&u[mr]?(u=u.i,N=String(l).toString(),N in u.g&&(l=u.g[N],d=rB(l,d,p,S),d>-1&&(Qo(l[d]),Array.prototype.splice.call(l,d,1),l.length==0&&(delete u.g[N],u.h--)))):u&&(u=aB(u))&&(l=u.g[l.toString()],u=-1,l&&(u=rB(l,d,p,S)),(d=u>-1?l[u]:null)&&oB(d))}function oB(u){if(typeof u!="number"&&u&&!u.da){var l=u.src;if(l&&l[mr])nB(l.i,u);else{var d=u.type,p=u.proxy;l.removeEventListener?l.removeEventListener(d,p,u.capture):l.detachEvent?l.detachEvent(Ah(d),p):l.addListener&&l.removeListener&&l.removeListener(p),(d=aB(l))?(nB(d,u),d.h==0&&(d.src=null,l[sB]=null)):Qo(u)}}}function Ah(u){return u in iB?iB[u]:iB[u]="on"+u}function b_(u,l){if(u.da)u=!0;else{l=new ft(l,this);const d=u.listener,p=u.ha||u.src;u.fa&&oB(u),u=d.call(p,l)}return u}function aB(u){return u=u[sB],u instanceof Wo?u:null}var uB="__closure_events_fn_"+(Math.random()*1e9>>>0);function Rh(u){return typeof u=="function"?u:(u[uB]||(u[uB]=function(l){return u.handleEvent(l)}),u[uB])}function tt(){v.call(this),this.i=new Wo(this),this.M=this,this.G=null}f(tt,v),tt.prototype[mr]=!0,tt.prototype.removeEventListener=function(u,l,d,p){Th(this,u,l,d,p)};function ut(u,l){var d,p=u.G;if(p)for(d=[];p;p=p.G)d.push(p);if(u=u.M,p=l.type||l,typeof l=="string")l=new A(l,u);else if(l instanceof A)l.target=l.target||u;else{var S=l;l=new A(p,u),yh(l,S)}S=!0;let N,z;if(d)for(z=d.length-1;z>=0;z--)N=l.g=d[z],S=Yo(N,p,!0,l)&&S;if(N=l.g=u,S=Yo(N,p,!0,l)&&S,S=Yo(N,p,!1,l)&&S,d)for(z=0;z<d.length;z++)N=l.g=d[z],S=Yo(N,p,!1,l)&&S}tt.prototype.N=function(){if(tt.Z.N.call(this),this.i){var u=this.i;for(const l in u.g){const d=u.g[l];for(let p=0;p<d.length;p++)Qo(d[p]);delete u.g[l],u.h--}}this.G=null},tt.prototype.J=function(u,l,d,p){return this.i.add(String(u),l,!1,d,p)},tt.prototype.K=function(u,l,d,p){return this.i.add(String(u),l,!0,d,p)};function Yo(u,l,d,p){if(l=u.i.g[String(l)],!l)return!0;l=l.concat();let S=!0;for(let N=0;N<l.length;++N){const z=l[N];if(z&&!z.da&&z.capture==d){const ae=z.listener,Ue=z.ha||z.src;z.fa&&nB(u.i,z),S=ae.call(Ue,p)!==!1&&S}}return S&&!p.defaultPrevented}function S_(u,l){if(typeof u!="function")if(u&&typeof u.handleEvent=="function")u=c(u.handleEvent,u);else throw Error("Invalid listener argument");return Number(l)>2147483647?-1:o.setTimeout(u,l||0)}function vh(u){u.g=S_(()=>{u.g=null,u.i&&(u.i=!1,vh(u))},u.l);const l=u.h;u.h=null,u.m.apply(null,l)}class P_ extends v{constructor(l,d){super(),this.m=l,this.l=d,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:vh(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function li(u){v.call(this),this.h=u,this.g={}}f(li,v);var bh=[];function Sh(u){$o(u.g,function(l,d){this.g.hasOwnProperty(d)&&oB(l)},u),u.g={}}li.prototype.N=function(){li.Z.N.call(this),Sh(this)},li.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var BB=o.JSON.stringify,N_=o.JSON.parse,O_=class{stringify(u){return o.JSON.stringify(u,void 0)}parse(u){return o.JSON.parse(u,void 0)}};function Ph(){}function Nh(){}var hi={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function cB(){A.call(this,"d")}f(cB,A);function lB(){A.call(this,"c")}f(lB,A);var Er={},Oh=null;function Xo(){return Oh=Oh||new tt}Er.Ia="serverreachability";function Fh(u){A.call(this,Er.Ia,u)}f(Fh,A);function fi(u){const l=Xo();ut(l,new Fh(l))}Er.STAT_EVENT="statevent";function xh(u,l){A.call(this,Er.STAT_EVENT,u),this.stat=l}f(xh,A);function Bt(u){const l=Xo();ut(l,new xh(l,u))}Er.Ja="timingevent";function Lh(u,l){A.call(this,Er.Ja,u),this.size=l}f(Lh,A);function di(u,l){if(typeof u!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){u()},l)}function Ci(){this.g=!0}Ci.prototype.ua=function(){this.g=!1};function F_(u,l,d,p,S,N){u.info(function(){if(u.g)if(N){var z="",ae=N.split("&");for(let Ie=0;Ie<ae.length;Ie++){var Ue=ae[Ie].split("=");if(Ue.length>1){const Qe=Ue[0];Ue=Ue[1];const Ut=Qe.split("_");z=Ut.length>=2&&Ut[1]=="type"?z+(Qe+"="+Ue+"&"):z+(Qe+"=redacted&")}}}else z=null;else z=N;return"XMLHTTP REQ ("+p+") [attempt "+S+"]: "+l+`
`+d+`
`+z})}function x_(u,l,d,p,S,N,z){u.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+S+"]: "+l+`
`+d+`
`+N+" "+z})}function us(u,l,d,p){u.info(function(){return"XMLHTTP TEXT ("+l+"): "+k_(u,d)+(p?" "+p:"")})}function L_(u,l){u.info(function(){return"TIMEOUT: "+l})}Ci.prototype.info=function(){};function k_(u,l){if(!u.g)return l;if(!l)return null;try{const N=JSON.parse(l);if(N){for(u=0;u<N.length;u++)if(Array.isArray(N[u])){var d=N[u];if(!(d.length<2)){var p=d[1];if(Array.isArray(p)&&!(p.length<1)){var S=p[0];if(S!="noop"&&S!="stop"&&S!="close")for(let z=1;z<p.length;z++)p[z]=""}}}}return BB(N)}catch{return l}}var Zo={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},kh={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Vh;function hB(){}f(hB,Ph),hB.prototype.g=function(){return new XMLHttpRequest},Vh=new hB;function pi(u){return encodeURIComponent(String(u))}function V_(u){var l=1;u=u.split(":");const d=[];for(;l>0&&u.length;)d.push(u.shift()),l--;return u.length&&d.push(u.join(":")),d}function bn(u,l,d,p){this.j=u,this.i=l,this.l=d,this.S=p||1,this.V=new li(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Mh}function Mh(){this.i=null,this.g="",this.h=!1}var Gh={},fB={};function dB(u,l,d){u.M=1,u.A=ta(Ht(l)),u.u=d,u.R=!0,Hh(u,null)}function Hh(u,l){u.F=Date.now(),ea(u),u.B=Ht(u.A);var d=u.B,p=u.S;Array.isArray(p)||(p=[String(p)]),ef(d.i,"t",p),u.C=0,d=u.j.L,u.h=new Mh,u.g=Ef(u.j,d?l:null,!u.u),u.P>0&&(u.O=new P_(c(u.Y,u,u.g),u.P)),l=u.V,d=u.g,p=u.ba;var S="readystatechange";Array.isArray(S)||(S&&(bh[0]=S.toString()),S=bh);for(let N=0;N<S.length;N++){const z=wh(d,S[N],p||l.handleEvent,!1,l.h||l);if(!z)break;l.g[z.key]=z}l=u.J?Dh(u.J):{},u.u?(u.v||(u.v="POST"),l["Content-Type"]="application/x-www-form-urlencoded",u.g.ea(u.B,u.v,u.u,l)):(u.v="GET",u.g.ea(u.B,u.v,null,l)),fi(),F_(u.i,u.v,u.B,u.l,u.S,u.u)}bn.prototype.ba=function(u){u=u.target;const l=this.O;l&&Nn(u)==3?l.j():this.Y(u)},bn.prototype.Y=function(u){try{if(u==this.g)e:{const ae=Nn(this.g),Ue=this.g.ya(),Ie=this.g.ca();if(!(ae<3)&&(ae!=3||this.g&&(this.h.h||this.g.la()||uf(this.g)))){this.K||ae!=4||Ue==7||(Ue==8||Ie<=0?fi(3):fi(2)),CB(this);var l=this.g.ca();this.X=l;var d=M_(this);if(this.o=l==200,x_(this.i,this.v,this.B,this.l,this.S,ae,l),this.o){if(this.U&&!this.L){t:{if(this.g){var p,S=this.g;if((p=S.g?S.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!D(p)){var N=p;break t}}N=null}if(u=N)us(this.i,this.l,u,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,pB(this,u);else{this.o=!1,this.m=3,Bt(12),_r(this),gi(this);break e}}if(this.R){u=!0;let Qe;for(;!this.K&&this.C<d.length;)if(Qe=G_(this,d),Qe==fB){ae==4&&(this.m=4,Bt(14),u=!1),us(this.i,this.l,null,"[Incomplete Response]");break}else if(Qe==Gh){this.m=4,Bt(15),us(this.i,this.l,d,"[Invalid Chunk]"),u=!1;break}else us(this.i,this.l,Qe,null),pB(this,Qe);if(Uh(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ae!=4||d.length!=0||this.h.h||(this.m=1,Bt(16),u=!1),this.o=this.o&&u,!u)us(this.i,this.l,d,"[Invalid Chunked Response]"),_r(this),gi(this);else if(d.length>0&&!this.W){this.W=!0;var z=this.j;z.g==this&&z.aa&&!z.P&&(z.j.info("Great, no buffering proxy detected. Bytes received: "+d.length),wB(z),z.P=!0,Bt(11))}}else us(this.i,this.l,d,null),pB(this,d);ae==4&&_r(this),this.o&&!this.K&&(ae==4?Cf(this.j,this):(this.o=!1,ea(this)))}else eD(this.g),l==400&&d.indexOf("Unknown SID")>0?(this.m=3,Bt(12)):(this.m=0,Bt(13)),_r(this),gi(this)}}}catch{}finally{}};function M_(u){if(!Uh(u))return u.g.la();const l=uf(u.g);if(l==="")return"";let d="";const p=l.length,S=Nn(u.g)==4;if(!u.h.i){if(typeof TextDecoder>"u")return _r(u),gi(u),"";u.h.i=new o.TextDecoder}for(let N=0;N<p;N++)u.h.h=!0,d+=u.h.i.decode(l[N],{stream:!(S&&N==p-1)});return l.length=0,u.h.g+=d,u.C=0,u.h.g}function Uh(u){return u.g?u.v=="GET"&&u.M!=2&&u.j.Aa:!1}function G_(u,l){var d=u.C,p=l.indexOf(`
`,d);return p==-1?fB:(d=Number(l.substring(d,p)),isNaN(d)?Gh:(p+=1,p+d>l.length?fB:(l=l.slice(p,p+d),u.C=p+d,l)))}bn.prototype.cancel=function(){this.K=!0,_r(this)};function ea(u){u.T=Date.now()+u.H,jh(u,u.H)}function jh(u,l){if(u.D!=null)throw Error("WatchDog timer not null");u.D=di(c(u.aa,u),l)}function CB(u){u.D&&(o.clearTimeout(u.D),u.D=null)}bn.prototype.aa=function(){this.D=null;const u=Date.now();u-this.T>=0?(L_(this.i,this.B),this.M!=2&&(fi(),Bt(17)),_r(this),this.m=2,gi(this)):jh(this,this.T-u)};function gi(u){u.j.I==0||u.K||Cf(u.j,u)}function _r(u){CB(u);var l=u.O;l&&typeof l.dispose=="function"&&l.dispose(),u.O=null,Sh(u.V),u.g&&(l=u.g,u.g=null,l.abort(),l.dispose())}function pB(u,l){try{var d=u.j;if(d.I!=0&&(d.g==u||gB(d.h,u))){if(!u.L&&gB(d.h,u)&&d.I==3){try{var p=d.Ba.g.parse(l)}catch{p=null}if(Array.isArray(p)&&p.length==3){var S=p;if(S[0]==0){e:if(!d.v){if(d.g)if(d.g.F+3e3<u.F)oa(d),sa(d);else break e;yB(d),Bt(18)}}else d.xa=S[1],0<d.xa-d.K&&S[2]<37500&&d.F&&d.A==0&&!d.C&&(d.C=di(c(d.Va,d),6e3));Jh(d.h)<=1&&d.ta&&(d.ta=void 0)}else Ir(d,11)}else if((u.L||d.g==u)&&oa(d),!D(l))for(S=d.Ba.g.parse(l),l=0;l<S.length;l++){let Ie=S[l];const Qe=Ie[0];if(!(Qe<=d.K))if(d.K=Qe,Ie=Ie[1],d.I==2)if(Ie[0]=="c"){d.M=Ie[1],d.ba=Ie[2];const Ut=Ie[3];Ut!=null&&(d.ka=Ut,d.j.info("VER="+d.ka));const yr=Ie[4];yr!=null&&(d.za=yr,d.j.info("SVER="+d.za));const On=Ie[5];On!=null&&typeof On=="number"&&On>0&&(p=1.5*On,d.O=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;const Fn=u.g;if(Fn){const ua=Fn.g?Fn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ua){var N=p.h;N.g||ua.indexOf("spdy")==-1&&ua.indexOf("quic")==-1&&ua.indexOf("h2")==-1||(N.j=N.l,N.g=new Set,N.h&&(mB(N,N.h),N.h=null))}if(p.G){const TB=Fn.g?Fn.g.getResponseHeader("X-HTTP-Session-Id"):null;TB&&(p.wa=TB,be(p.J,p.G,TB))}}d.I=3,d.l&&d.l.ra(),d.aa&&(d.T=Date.now()-u.F,d.j.info("Handshake RTT: "+d.T+"ms")),p=d;var z=u;if(p.na=mf(p,p.L?p.ba:null,p.W),z.L){zh(p.h,z);var ae=z,Ue=p.O;Ue&&(ae.H=Ue),ae.D&&(CB(ae),ea(ae)),p.g=z}else ff(p);d.i.length>0&&ia(d)}else Ie[0]!="stop"&&Ie[0]!="close"||Ir(d,7);else d.I==3&&(Ie[0]=="stop"||Ie[0]=="close"?Ie[0]=="stop"?Ir(d,7):IB(d):Ie[0]!="noop"&&d.l&&d.l.qa(Ie),d.A=0)}}fi(4)}catch{}}var H_=class{constructor(u,l){this.g=u,this.map=l}};function qh(u){this.l=u||10,o.PerformanceNavigationTiming?(u=o.performance.getEntriesByType("navigation"),u=u.length>0&&(u[0].nextHopProtocol=="hq"||u[0].nextHopProtocol=="h2")):u=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=u?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Kh(u){return u.h?!0:u.g?u.g.size>=u.j:!1}function Jh(u){return u.h?1:u.g?u.g.size:0}function gB(u,l){return u.h?u.h==l:u.g?u.g.has(l):!1}function mB(u,l){u.g?u.g.add(l):u.h=l}function zh(u,l){u.h&&u.h==l?u.h=null:u.g&&u.g.has(l)&&u.g.delete(l)}qh.prototype.cancel=function(){if(this.i=Qh(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const u of this.g.values())u.cancel();this.g.clear()}};function Qh(u){if(u.h!=null)return u.i.concat(u.h.G);if(u.g!=null&&u.g.size!==0){let l=u.i;for(const d of u.g.values())l=l.concat(d.G);return l}return _(u.i)}var $h=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function U_(u,l){if(u){u=u.split("&");for(let d=0;d<u.length;d++){const p=u[d].indexOf("=");let S,N=null;p>=0?(S=u[d].substring(0,p),N=u[d].substring(p+1)):S=u[d],l(S,N?decodeURIComponent(N.replace(/\+/g," ")):"")}}}function Sn(u){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let l;u instanceof Sn?(this.l=u.l,mi(this,u.j),this.o=u.o,this.g=u.g,Ei(this,u.u),this.h=u.h,EB(this,tf(u.i)),this.m=u.m):u&&(l=String(u).match($h))?(this.l=!1,mi(this,l[1]||"",!0),this.o=_i(l[2]||""),this.g=_i(l[3]||"",!0),Ei(this,l[4]),this.h=_i(l[5]||"",!0),EB(this,l[6]||"",!0),this.m=_i(l[7]||"")):(this.l=!1,this.i=new Ii(null,this.l))}Sn.prototype.toString=function(){const u=[];var l=this.j;l&&u.push(Di(l,Wh,!0),":");var d=this.g;return(d||l=="file")&&(u.push("//"),(l=this.o)&&u.push(Di(l,Wh,!0),"@"),u.push(pi(d).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.u,d!=null&&u.push(":",String(d))),(d=this.h)&&(this.g&&d.charAt(0)!="/"&&u.push("/"),u.push(Di(d,d.charAt(0)=="/"?K_:q_,!0))),(d=this.i.toString())&&u.push("?",d),(d=this.m)&&u.push("#",Di(d,z_)),u.join("")},Sn.prototype.resolve=function(u){const l=Ht(this);let d=!!u.j;d?mi(l,u.j):d=!!u.o,d?l.o=u.o:d=!!u.g,d?l.g=u.g:d=u.u!=null;var p=u.h;if(d)Ei(l,u.u);else if(d=!!u.h){if(p.charAt(0)!="/")if(this.g&&!this.h)p="/"+p;else{var S=l.h.lastIndexOf("/");S!=-1&&(p=l.h.slice(0,S+1)+p)}if(S=p,S==".."||S==".")p="";else if(S.indexOf("./")!=-1||S.indexOf("/.")!=-1){p=S.lastIndexOf("/",0)==0,S=S.split("/");const N=[];for(let z=0;z<S.length;){const ae=S[z++];ae=="."?p&&z==S.length&&N.push(""):ae==".."?((N.length>1||N.length==1&&N[0]!="")&&N.pop(),p&&z==S.length&&N.push("")):(N.push(ae),p=!0)}p=N.join("/")}else p=S}return d?l.h=p:d=u.i.toString()!=="",d?EB(l,tf(u.i)):d=!!u.m,d&&(l.m=u.m),l};function Ht(u){return new Sn(u)}function mi(u,l,d){u.j=d?_i(l,!0):l,u.j&&(u.j=u.j.replace(/:$/,""))}function Ei(u,l){if(l){if(l=Number(l),isNaN(l)||l<0)throw Error("Bad port number "+l);u.u=l}else u.u=null}function EB(u,l,d){l instanceof Ii?(u.i=l,Q_(u.i,u.l)):(d||(l=Di(l,J_)),u.i=new Ii(l,u.l))}function be(u,l,d){u.i.set(l,d)}function ta(u){return be(u,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),u}function _i(u,l){return u?l?decodeURI(u.replace(/%25/g,"%2525")):decodeURIComponent(u):""}function Di(u,l,d){return typeof u=="string"?(u=encodeURI(u).replace(l,j_),d&&(u=u.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u):null}function j_(u){return u=u.charCodeAt(0),"%"+(u>>4&15).toString(16)+(u&15).toString(16)}var Wh=/[#\/\?@]/g,q_=/[#\?:]/g,K_=/[#\?]/g,J_=/[#\?@]/g,z_=/#/g;function Ii(u,l){this.h=this.g=null,this.i=u||null,this.j=!!l}function Dr(u){u.g||(u.g=new Map,u.h=0,u.i&&U_(u.i,function(l,d){u.add(decodeURIComponent(l.replace(/\+/g," ")),d)}))}r=Ii.prototype,r.add=function(u,l){Dr(this),this.i=null,u=Bs(this,u);let d=this.g.get(u);return d||this.g.set(u,d=[]),d.push(l),this.h+=1,this};function Yh(u,l){Dr(u),l=Bs(u,l),u.g.has(l)&&(u.i=null,u.h-=u.g.get(l).length,u.g.delete(l))}function Xh(u,l){return Dr(u),l=Bs(u,l),u.g.has(l)}r.forEach=function(u,l){Dr(this),this.g.forEach(function(d,p){d.forEach(function(S){u.call(l,S,p,this)},this)},this)};function Zh(u,l){Dr(u);let d=[];if(typeof l=="string")Xh(u,l)&&(d=d.concat(u.g.get(Bs(u,l))));else for(u=Array.from(u.g.values()),l=0;l<u.length;l++)d=d.concat(u[l]);return d}r.set=function(u,l){return Dr(this),this.i=null,u=Bs(this,u),Xh(this,u)&&(this.h-=this.g.get(u).length),this.g.set(u,[l]),this.h+=1,this},r.get=function(u,l){return u?(u=Zh(this,u),u.length>0?String(u[0]):l):l};function ef(u,l,d){Yh(u,l),d.length>0&&(u.i=null,u.g.set(Bs(u,l),_(d)),u.h+=d.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const u=[],l=Array.from(this.g.keys());for(let p=0;p<l.length;p++){var d=l[p];const S=pi(d);d=Zh(this,d);for(let N=0;N<d.length;N++){let z=S;d[N]!==""&&(z+="="+pi(d[N])),u.push(z)}}return this.i=u.join("&")};function tf(u){const l=new Ii;return l.i=u.i,u.g&&(l.g=new Map(u.g),l.h=u.h),l}function Bs(u,l){return l=String(l),u.j&&(l=l.toLowerCase()),l}function Q_(u,l){l&&!u.j&&(Dr(u),u.i=null,u.g.forEach(function(d,p){const S=p.toLowerCase();p!=S&&(Yh(this,p),ef(this,S,d))},u)),u.j=l}function $_(u,l){const d=new Ci;if(o.Image){const p=new Image;p.onload=h(Pn,d,"TestLoadImage: loaded",!0,l,p),p.onerror=h(Pn,d,"TestLoadImage: error",!1,l,p),p.onabort=h(Pn,d,"TestLoadImage: abort",!1,l,p),p.ontimeout=h(Pn,d,"TestLoadImage: timeout",!1,l,p),o.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=u}else l(!1)}function W_(u,l){const d=new Ci,p=new AbortController,S=setTimeout(()=>{p.abort(),Pn(d,"TestPingServer: timeout",!1,l)},1e4);fetch(u,{signal:p.signal}).then(N=>{clearTimeout(S),N.ok?Pn(d,"TestPingServer: ok",!0,l):Pn(d,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(S),Pn(d,"TestPingServer: error",!1,l)})}function Pn(u,l,d,p,S){try{S&&(S.onload=null,S.onerror=null,S.onabort=null,S.ontimeout=null),p(d)}catch{}}function Y_(){this.g=new O_}function _B(u){this.i=u.Sb||null,this.h=u.ab||!1}f(_B,Ph),_B.prototype.g=function(){return new na(this.i,this.h)};function na(u,l){tt.call(this),this.H=u,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}f(na,tt),r=na.prototype,r.open=function(u,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=u,this.D=l,this.readyState=1,wi(this)},r.send=function(u){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const l={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};u&&(l.body=u),(this.H||o).fetch(new Request(this.D,l)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,yi(this)),this.readyState=0},r.Pa=function(u){if(this.g&&(this.l=u,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=u.headers,this.readyState=2,wi(this)),this.g&&(this.readyState=3,wi(this),this.g)))if(this.responseType==="arraybuffer")u.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in u){if(this.j=u.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;nf(this)}else u.text().then(this.Oa.bind(this),this.ga.bind(this))};function nf(u){u.j.read().then(u.Ma.bind(u)).catch(u.ga.bind(u))}r.Ma=function(u){if(this.g){if(this.o&&u.value)this.response.push(u.value);else if(!this.o){var l=u.value?u.value:new Uint8Array(0);(l=this.B.decode(l,{stream:!u.done}))&&(this.response=this.responseText+=l)}u.done?yi(this):wi(this),this.readyState==3&&nf(this)}},r.Oa=function(u){this.g&&(this.response=this.responseText=u,yi(this))},r.Na=function(u){this.g&&(this.response=u,yi(this))},r.ga=function(){this.g&&yi(this)};function yi(u){u.readyState=4,u.l=null,u.j=null,u.B=null,wi(u)}r.setRequestHeader=function(u,l){this.A.append(u,l)},r.getResponseHeader=function(u){return this.h&&this.h.get(u.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const u=[],l=this.h.entries();for(var d=l.next();!d.done;)d=d.value,u.push(d[0]+": "+d[1]),d=l.next();return u.join(`\r
`)};function wi(u){u.onreadystatechange&&u.onreadystatechange.call(u)}Object.defineProperty(na.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(u){this.m=u?"include":"same-origin"}});function rf(u){let l="";return $o(u,function(d,p){l+=p,l+=":",l+=d,l+=`\r
`}),l}function DB(u,l,d){e:{for(p in d){var p=!1;break e}p=!0}p||(d=rf(d),typeof u=="string"?d!=null&&pi(d):be(u,l,d))}function Fe(u){tt.call(this),this.headers=new Map,this.L=u||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}f(Fe,tt);var X_=/^https?$/i,Z_=["POST","PUT"];r=Fe.prototype,r.Fa=function(u){this.H=u},r.ea=function(u,l,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+u);l=l?l.toUpperCase():"GET",this.D=u,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Vh.g(),this.g.onreadystatechange=C(c(this.Ca,this));try{this.B=!0,this.g.open(l,String(u),!0),this.B=!1}catch(N){sf(this,N);return}if(u=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var S in p)d.set(S,p[S]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const N of p.keys())d.set(N,p.get(N));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(N=>N.toLowerCase()=="content-type"),S=o.FormData&&u instanceof o.FormData,!(Array.prototype.indexOf.call(Z_,l,void 0)>=0)||p||S||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[N,z]of d)this.g.setRequestHeader(N,z);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(u),this.v=!1}catch(N){sf(this,N)}};function sf(u,l){u.h=!1,u.g&&(u.j=!0,u.g.abort(),u.j=!1),u.l=l,u.o=5,of(u),ra(u)}function of(u){u.A||(u.A=!0,ut(u,"complete"),ut(u,"error"))}r.abort=function(u){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=u||7,ut(this,"complete"),ut(this,"abort"),ra(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ra(this,!0)),Fe.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?af(this):this.Xa())},r.Xa=function(){af(this)};function af(u){if(u.h&&typeof i<"u"){if(u.v&&Nn(u)==4)setTimeout(u.Ca.bind(u),0);else if(ut(u,"readystatechange"),Nn(u)==4){u.h=!1;try{const N=u.ca();e:switch(N){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var d;if(!(d=l)){var p;if(p=N===0){let z=String(u.D).match($h)[1]||null;!z&&o.self&&o.self.location&&(z=o.self.location.protocol.slice(0,-1)),p=!X_.test(z?z.toLowerCase():"")}d=p}if(d)ut(u,"complete"),ut(u,"success");else{u.o=6;try{var S=Nn(u)>2?u.g.statusText:""}catch{S=""}u.l=S+" ["+u.ca()+"]",of(u)}}finally{ra(u)}}}}function ra(u,l){if(u.g){u.m&&(clearTimeout(u.m),u.m=null);const d=u.g;u.g=null,l||ut(u,"ready");try{d.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function Nn(u){return u.g?u.g.readyState:0}r.ca=function(){try{return Nn(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(u){if(this.g){var l=this.g.responseText;return u&&l.indexOf(u)==0&&(l=l.substring(u.length)),N_(l)}};function uf(u){try{if(!u.g)return null;if("response"in u.g)return u.g.response;switch(u.F){case"":case"text":return u.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in u.g)return u.g.mozResponseArrayBuffer}return null}catch{return null}}function eD(u){const l={};u=(u.g&&Nn(u)>=2&&u.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<u.length;p++){if(D(u[p]))continue;var d=V_(u[p]);const S=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const N=l[S]||[];l[S]=N,N.push(d)}A_(l,function(p){return p.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ti(u,l,d){return d&&d.internalChannelParams&&d.internalChannelParams[u]||l}function Bf(u){this.za=0,this.i=[],this.j=new Ci,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Ti("failFast",!1,u),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Ti("baseRetryDelayMs",5e3,u),this.Za=Ti("retryDelaySeedMs",1e4,u),this.Ta=Ti("forwardChannelMaxRetries",2,u),this.va=Ti("forwardChannelRequestTimeoutMs",2e4,u),this.ma=u&&u.xmlHttpFactory||void 0,this.Ua=u&&u.Rb||void 0,this.Aa=u&&u.useFetchStreams||!1,this.O=void 0,this.L=u&&u.supportsCrossDomainXhr||!1,this.M="",this.h=new qh(u&&u.concurrentRequestLimit),this.Ba=new Y_,this.S=u&&u.fastHandshake||!1,this.R=u&&u.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=u&&u.Pb||!1,u&&u.ua&&this.j.ua(),u&&u.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&u&&u.detectBufferingProxy||!1,this.ia=void 0,u&&u.longPollingTimeout&&u.longPollingTimeout>0&&(this.ia=u.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=Bf.prototype,r.ka=8,r.I=1,r.connect=function(u,l,d,p){Bt(0),this.W=u,this.H=l||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.J=mf(this,null,this.W),ia(this)};function IB(u){if(cf(u),u.I==3){var l=u.V++,d=Ht(u.J);if(be(d,"SID",u.M),be(d,"RID",l),be(d,"TYPE","terminate"),Ai(u,d),l=new bn(u,u.j,l),l.M=2,l.A=ta(Ht(d)),d=!1,o.navigator&&o.navigator.sendBeacon)try{d=o.navigator.sendBeacon(l.A.toString(),"")}catch{}!d&&o.Image&&(new Image().src=l.A,d=!0),d||(l.g=Ef(l.j,null),l.g.ea(l.A)),l.F=Date.now(),ea(l)}gf(u)}function sa(u){u.g&&(wB(u),u.g.cancel(),u.g=null)}function cf(u){sa(u),u.v&&(o.clearTimeout(u.v),u.v=null),oa(u),u.h.cancel(),u.m&&(typeof u.m=="number"&&o.clearTimeout(u.m),u.m=null)}function ia(u){if(!Kh(u.h)&&!u.m){u.m=!0;var l=u.Ea;he||E(),ue||(he(),ue=!0),w.add(l,u),u.D=0}}function tD(u,l){return Jh(u.h)>=u.h.j-(u.m?1:0)?!1:u.m?(u.i=l.G.concat(u.i),!0):u.I==1||u.I==2||u.D>=(u.Sa?0:u.Ta)?!1:(u.m=di(c(u.Ea,u,l),pf(u,u.D)),u.D++,!0)}r.Ea=function(u){if(this.m)if(this.m=null,this.I==1){if(!u){this.V=Math.floor(Math.random()*1e5),u=this.V++;const S=new bn(this,this.j,u);let N=this.o;if(this.U&&(N?(N=Dh(N),yh(N,this.U)):N=this.U),this.u!==null||this.R||(S.J=N,N=null),this.S)e:{for(var l=0,d=0;d<this.i.length;d++){t:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(l+=p,l>4096){l=d;break e}if(l===4096||d===this.i.length-1){l=d+1;break e}}l=1e3}else l=1e3;l=hf(this,S,l),d=Ht(this.J),be(d,"RID",u),be(d,"CVER",22),this.G&&be(d,"X-HTTP-Session-Id",this.G),Ai(this,d),N&&(this.R?l="headers="+pi(rf(N))+"&"+l:this.u&&DB(d,this.u,N)),mB(this.h,S),this.Ra&&be(d,"TYPE","init"),this.S?(be(d,"$req",l),be(d,"SID","null"),S.U=!0,dB(S,d,null)):dB(S,d,l),this.I=2}}else this.I==3&&(u?lf(this,u):this.i.length==0||Kh(this.h)||lf(this))};function lf(u,l){var d;l?d=l.l:d=u.V++;const p=Ht(u.J);be(p,"SID",u.M),be(p,"RID",d),be(p,"AID",u.K),Ai(u,p),u.u&&u.o&&DB(p,u.u,u.o),d=new bn(u,u.j,d,u.D+1),u.u===null&&(d.J=u.o),l&&(u.i=l.G.concat(u.i)),l=hf(u,d,1e3),d.H=Math.round(u.va*.5)+Math.round(u.va*.5*Math.random()),mB(u.h,d),dB(d,p,l)}function Ai(u,l){u.H&&$o(u.H,function(d,p){be(l,p,d)}),u.l&&$o({},function(d,p){be(l,p,d)})}function hf(u,l,d){d=Math.min(u.i.length,d);const p=u.l?c(u.l.Ka,u.l,u):null;e:{var S=u.i;let ae=-1;for(;;){const Ue=["count="+d];ae==-1?d>0?(ae=S[0].g,Ue.push("ofs="+ae)):ae=0:Ue.push("ofs="+ae);let Ie=!0;for(let Qe=0;Qe<d;Qe++){var N=S[Qe].g;const Ut=S[Qe].map;if(N-=ae,N<0)ae=Math.max(0,S[Qe].g-100),Ie=!1;else try{N="req"+N+"_"||"";try{var z=Ut instanceof Map?Ut:Object.entries(Ut);for(const[yr,On]of z){let Fn=On;a(On)&&(Fn=BB(On)),Ue.push(N+yr+"="+encodeURIComponent(Fn))}}catch(yr){throw Ue.push(N+"type="+encodeURIComponent("_badmap")),yr}}catch{p&&p(Ut)}}if(Ie){z=Ue.join("&");break e}}z=void 0}return u=u.i.splice(0,d),l.G=u,z}function ff(u){if(!u.g&&!u.v){u.Y=1;var l=u.Da;he||E(),ue||(he(),ue=!0),w.add(l,u),u.A=0}}function yB(u){return u.g||u.v||u.A>=3?!1:(u.Y++,u.v=di(c(u.Da,u),pf(u,u.A)),u.A++,!0)}r.Da=function(){if(this.v=null,df(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var u=4*this.T;this.j.info("BP detection timer enabled: "+u),this.B=di(c(this.Wa,this),u)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Bt(10),sa(this),df(this))};function wB(u){u.B!=null&&(o.clearTimeout(u.B),u.B=null)}function df(u){u.g=new bn(u,u.j,"rpc",u.Y),u.u===null&&(u.g.J=u.o),u.g.P=0;var l=Ht(u.na);be(l,"RID","rpc"),be(l,"SID",u.M),be(l,"AID",u.K),be(l,"CI",u.F?"0":"1"),!u.F&&u.ia&&be(l,"TO",u.ia),be(l,"TYPE","xmlhttp"),Ai(u,l),u.u&&u.o&&DB(l,u.u,u.o),u.O&&(u.g.H=u.O);var d=u.g;u=u.ba,d.M=1,d.A=ta(Ht(l)),d.u=null,d.R=!0,Hh(d,u)}r.Va=function(){this.C!=null&&(this.C=null,sa(this),yB(this),Bt(19))};function oa(u){u.C!=null&&(o.clearTimeout(u.C),u.C=null)}function Cf(u,l){var d=null;if(u.g==l){oa(u),wB(u),u.g=null;var p=2}else if(gB(u.h,l))d=l.G,zh(u.h,l),p=1;else return;if(u.I!=0){if(l.o)if(p==1){d=l.u?l.u.length:0,l=Date.now()-l.F;var S=u.D;p=Xo(),ut(p,new Lh(p,d)),ia(u)}else ff(u);else if(S=l.m,S==3||S==0&&l.X>0||!(p==1&&tD(u,l)||p==2&&yB(u)))switch(d&&d.length>0&&(l=u.h,l.i=l.i.concat(d)),S){case 1:Ir(u,5);break;case 4:Ir(u,10);break;case 3:Ir(u,6);break;default:Ir(u,2)}}}function pf(u,l){let d=u.Qa+Math.floor(Math.random()*u.Za);return u.isActive()||(d*=2),d*l}function Ir(u,l){if(u.j.info("Error code "+l),l==2){var d=c(u.bb,u),p=u.Ua;const S=!p;p=new Sn(p||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||mi(p,"https"),ta(p),S?$_(p.toString(),d):W_(p.toString(),d)}else Bt(2);u.I=0,u.l&&u.l.pa(l),gf(u),cf(u)}r.bb=function(u){u?(this.j.info("Successfully pinged google.com"),Bt(2)):(this.j.info("Failed to ping google.com"),Bt(1))};function gf(u){if(u.I=0,u.ja=[],u.l){const l=Qh(u.h);(l.length!=0||u.i.length!=0)&&(R(u.ja,l),R(u.ja,u.i),u.h.i.length=0,_(u.i),u.i.length=0),u.l.oa()}}function mf(u,l,d){var p=d instanceof Sn?Ht(d):new Sn(d);if(p.g!="")l&&(p.g=l+"."+p.g),Ei(p,p.u);else{var S=o.location;p=S.protocol,l=l?l+"."+S.hostname:S.hostname,S=+S.port;const N=new Sn(null);p&&mi(N,p),l&&(N.g=l),S&&Ei(N,S),d&&(N.h=d),p=N}return d=u.G,l=u.wa,d&&l&&be(p,d,l),be(p,"VER",u.ka),Ai(u,p),p}function Ef(u,l,d){if(l&&!u.L)throw Error("Can't create secondary domain capable XhrIo object.");return l=u.Aa&&!u.ma?new Fe(new _B({ab:d})):new Fe(u.ma),l.Fa(u.L),l}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function _f(){}r=_f.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function aa(){}aa.prototype.g=function(u,l){return new Dt(u,l)};function Dt(u,l){tt.call(this),this.g=new Bf(l),this.l=u,this.h=l&&l.messageUrlParams||null,u=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(u?u["X-Client-Protocol"]="webchannel":u={"X-Client-Protocol":"webchannel"}),this.g.o=u,u=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(u?u["X-WebChannel-Content-Type"]=l.messageContentType:u={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.sa&&(u?u["X-WebChannel-Client-Profile"]=l.sa:u={"X-WebChannel-Client-Profile":l.sa}),this.g.U=u,(u=l&&l.Qb)&&!D(u)&&(this.g.u=u),this.A=l&&l.supportsCrossDomainXhr||!1,this.v=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!D(l)&&(this.g.G=l,u=this.h,u!==null&&l in u&&(u=this.h,l in u&&delete u[l])),this.j=new cs(this)}f(Dt,tt),Dt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Dt.prototype.close=function(){IB(this.g)},Dt.prototype.o=function(u){var l=this.g;if(typeof u=="string"){var d={};d.__data__=u,u=d}else this.v&&(d={},d.__data__=BB(u),u=d);l.i.push(new H_(l.Ya++,u)),l.I==3&&ia(l)},Dt.prototype.N=function(){this.g.l=null,delete this.j,IB(this.g),delete this.g,Dt.Z.N.call(this)};function Df(u){cB.call(this),u.__headers__&&(this.headers=u.__headers__,this.statusCode=u.__status__,delete u.__headers__,delete u.__status__);var l=u.__sm__;if(l){e:{for(const d in l){u=d;break e}u=void 0}(this.i=u)&&(u=this.i,l=l!==null&&u in l?l[u]:void 0),this.data=l}else this.data=u}f(Df,cB);function If(){lB.call(this),this.status=1}f(If,lB);function cs(u){this.g=u}f(cs,_f),cs.prototype.ra=function(){ut(this.g,"a")},cs.prototype.qa=function(u){ut(this.g,new Df(u))},cs.prototype.pa=function(u){ut(this.g,new If)},cs.prototype.oa=function(){ut(this.g,"b")},aa.prototype.createWebChannel=aa.prototype.g,Dt.prototype.send=Dt.prototype.o,Dt.prototype.open=Dt.prototype.m,Dt.prototype.close=Dt.prototype.close,cg=function(){return new aa},Bg=function(){return Xo()},ug=Er,oc={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Zo.NO_ERROR=0,Zo.TIMEOUT=8,Zo.HTTP_ERROR=6,ba=Zo,kh.COMPLETE="complete",ag=kh,Nh.EventType=hi,hi.OPEN="a",hi.CLOSE="b",hi.ERROR="c",hi.MESSAGE="d",tt.prototype.listen=tt.prototype.J,xi=Nh,Fe.prototype.listenOnce=Fe.prototype.K,Fe.prototype.getLastError=Fe.prototype.Ha,Fe.prototype.getLastErrorCode=Fe.prototype.ya,Fe.prototype.getStatus=Fe.prototype.ca,Fe.prototype.getResponseJson=Fe.prototype.La,Fe.prototype.getResponseText=Fe.prototype.la,Fe.prototype.send=Fe.prototype.ea,Fe.prototype.setWithCredentials=Fe.prototype.Fa,og=Fe}).apply(typeof ca<"u"?ca:typeof self<"u"?self:typeof window<"u"?window:{});/*!
* re2js
* RE2JS is the JavaScript port of RE2, a regular expression engine that provides linear time matching
*
* @version v2.8.6
* @author Oleksii Vasyliev
* @homepage https://github.com/le0pard/re2js#readme
* @repository github:le0pard/re2js
* @license MIT
*/var ye,V=(ye=class{},j(ye,"FOLD_CASE",1),j(ye,"LITERAL",2),j(ye,"CLASS_NL",4),j(ye,"DOT_NL",8),j(ye,"ONE_LINE",16),j(ye,"NON_GREEDY",32),j(ye,"PERL_X",64),j(ye,"UNICODE_GROUPS",128),j(ye,"WAS_DOLLAR",256),j(ye,"LOOKBEHIND",512),j(ye,"MATCH_NL",ye.CLASS_NL|ye.DOT_NL),j(ye,"PERL",ye.CLASS_NL|ye.ONE_LINE|ye.PERL_X|ye.UNICODE_GROUPS),j(ye,"POSIX",0),j(ye,"UNANCHORED",0),j(ye,"ANCHOR_START",1),j(ye,"ANCHOR_BOTH",2),ye);const ls={CASE_INSENSITIVE:1,DOTALL:2,MULTILINE:4,DISABLE_UNICODE_GROUPS:8,LONGEST_MATCH:16,LOOKBEHINDS:512},so=128,ac=new Int32Array(so),uc=new Int32Array(so),la=65535;for(let r=0;r<so;r++)r>=97&&r<=122?ac[r]=r-32:ac[r]=r,r>=65&&r<=90?uc[r]=r+32:uc[r]=r;var YB,O=(YB=class{static toUpperCase(r){if(r<so)return ac[r];const e=String.fromCodePoint(r).toUpperCase(),t=e.codePointAt(0)>la?2:1;if(e.length>t)return r;const n=String.fromCodePoint(e.codePointAt(0)).toLowerCase(),s=n.codePointAt(0)>la?2:1;return n.length>s||n.codePointAt(0)!==r?r:e.codePointAt(0)}static toLowerCase(r){if(r<so)return uc[r];const e=String.fromCodePoint(r).toLowerCase(),t=e.codePointAt(0)>la?2:1;if(e.length>t)return r;const n=String.fromCodePoint(e.codePointAt(0)).toUpperCase(),s=n.codePointAt(0)>la?2:1;return n.length>s||n.codePointAt(0)!==r?r:e.codePointAt(0)}},j(YB,"CODES",new Map([["\x07",7],["\b",8],["	",9],[`
`,10],["\v",11],["\f",12],["\r",13],[" ",32],['"',34],["$",36],["&",38],["'",39],["(",40],[")",41],["*",42],["+",43],["-",45],[".",46],["0",48],["1",49],["2",50],["3",51],["4",52],["5",53],["6",54],["7",55],["8",56],["9",57],[":",58],["<",60],[">",62],["?",63],["A",65],["B",66],["C",67],["F",70],["P",80],["Q",81],["U",85],["Z",90],["[",91],["\\",92],["]",93],["^",94],["_",95],["`",96],["a",97],["b",98],["f",102],["i",105],["m",109],["n",110],["r",114],["s",115],["t",116],["v",118],["x",120],["z",122],["{",123],["|",124],["}",125]])),YB),g=class{constructor(r,e=!1){this.data=r,this.isStride1=e,this.SIZE=e?2:3}getLo(r){return this.data[r*this.SIZE]}getHi(r){return this.data[r*this.SIZE+1]}getStride(r){return this.isStride1?1:this.data[r*this.SIZE+2]}get length(){return this.data.length/this.SIZE}};const lg=new Uint8Array(256);for(let r=0,e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";r<64;r++)lg[e.charCodeAt(r)]=r;const hg=r=>{const e=[];let t=0,n=0;for(let s=0;s<r.length;s++){let i=lg[r.charCodeAt(s)];t|=(i&31)<<n,(i&32)===0?(e.push(t),t=0,n=0):n+=5}return e},m=(r,e)=>{const t=hg(r),n=e?t.length/2:t.length/3,s=new Uint32Array(n*3);let i=0,o=0;for(let a=0;a<n;a++)i+=t[o++],s[a*3]=i,i+=t[o++],s[a*3+1]=i,s[a*3+2]=e?1:t[o++];return s},Hw=r=>{const e=hg(r),t=new Map;let n=0;for(let s=0;s<e.length;s+=2){n+=e[s];const i=e[s+1],o=i>>>1^-(i&1);t.set(n,n+o)}return t};var ha=class{constructor(r){this.initializer=r,this.cache=new Map}has(r){return r in this.initializer}get(r){if(this.cache.has(r))return this.cache.get(r);const e=this.initializer[r],t=e?e():null;return this.cache.set(r,t),t}},Hn,Ct=(Hn=class{static get CASE_ORBIT(){return this._CASE_ORBIT||(this._CASE_ORBIT=Hw("rCgCIgCY+rQI4QiCuuBLgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCCgCBgCBgCBgCBgCBgCBgCB+7OB-BB-BB-BB-BB-BBskQB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BC-BB-BB-BB-BB-BB-BB-BByHBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBxHBCBBBCBBBCBBB3SBmMBkNBCBBBCBBB8MBCBBB6MB6MBCBBC+EB0MB2MBCBBB6MB+MBiGBmNBiNBCBBBmKBikzCBmNBqNBkIBsNBCBBBCBBBCBBB0NBCBBB0NDCBBB0NBCBBByNByNBCBBBCBBB2NBCBBDCBBCwDFCBCBDBCBCBDBCBCBDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB9EBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBCBDBCBBBhGBvDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBjICCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBH2iVBCBBBlKBwiVB+jVB+jVBCBBBlMBqEBuEBCBBBCBBBCBBBCBBBCBBB+hVB4hVB8hVBjNB7MC5MB5MCzMC1MB+0yCE5MB20yCC9MBu2yCBwyyCBo0yCChNBlNBo0yCBu-UBi0yCDlNC6-UBpNDrNIu+UDzNCm0yCBzNE0yyCBzNBpEBxNBxNBtEG1NLqxyCBkxyCnFoFrBCBBBCBBDCBBEkIBkIBkICoHHsCCqCBqCBqCCgEC+DB+DBmkOBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCC+BBgCBgCBgCBgCBgCBgCBgCBgCBrCBpCBpCBpCBmjOB-BB8BB-BB-BBgEB-BB-BByBBqgOBsDB-BBtwBB-BB-BB-BBsBBgDBCB-BB-BB-BBeB-BB-BB61OB-BB-BB-DB9DB9DBQB7DBmCE9CBrDBPBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBrFB-EBOBnHB3FB-FCCBBBNBCBBCjIBjIBjIBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB8kMB-BB6kMB-BB-BB-BB-BB-BB-BB-BB-BB-BBokMB-BB-BBkkMBkkMB-BB-BB-BB-BB-BB-BB-BB4jMB-BB-BB-BB-BB-BB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EBCBBBCBoiMBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBJCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBeBCBBBCBBBCBBBCBBBCBBBCBBBCBBBdBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDL-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-C64CgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOCgmOGgmODg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FDg8FBg8FBg8FhVg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBQBQBQBQBQBQDPBPBPBPBPBPjkC7mMB5mMBnmMBjmMBCBlmMB3lMBpiMBk8kCBCBBG-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FD-7FB-7FB-7F6FoglCEsuHRwjlCyDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCB0DBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBG1DD97OCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPEQCQCQCQCPCPCPCPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPB0EB0EBsFBsFBsFBsFBoGBoGBgIBgIBgHBgHB8HB8HDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQCSFPBPBzEBzEBRCxnOFSFrFBrFBrFBrFBREQBQClkOFPBPBnGBnGFQBQCljOCODPBPB-GB-GBNHSF-HB-HB7HB7HBRqJ53OE9tQBrmQH4Bc3BSgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfECBByZ0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzB34BgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CBCBBBt-UBruHBt+UB1iVBviVBCBBBCBBBCBBB3hVB5-UB9hVB7hVCCBBCCBBI9jVB9jVBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBICBBBCBBECBBN-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOC-lOG-lOzoeCBBBCBBBCBBBCBBBCBBBCBl8kCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBTCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBnECBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBKCBBBCBBBnglCBCBBBCBBBCBBBCBBBCBBECBBBvyyCDCBBBCBBBgDCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBn0yCB90yCB10yCBh0yCBn0yCCjxyCBzyyCBpxyCBg6BBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB-CBl0yCBvjlCBCBBBCBBBt2yCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBhkzCZCBB9a-5Bd-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCm6TCBB7gBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCH-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BmlBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvChDwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCFvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvC1DuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCCuCBuCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCCtCBtCk2BgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEO-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-D+CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCL-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-B74CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhrVgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BD1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BtxekCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjC")),this._CASE_ORBIT}static get Print(){return this._Print||(this._Print=new g(m("hB9CBjBLBCpWBDFBFGBCCCBSBCsMBClBBDxBBDCBC2BBJaBFFBSVBC-FBCvBBD6BBDkDBP6BBDwBBDOBCbBDCCBJBGfBIqCBCgFBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYBDCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPBLCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGBCCBCHBDBBDVBCGBCBBCEBDIBDBBDCBICBFBBCEBDRBLBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBGMBCCBCWBCPBDIBCCBCDBIBBCCBCBBDDBDJBIVBCCBCWBCJBCEBDIBCCBCDBIBBGCBCDBDJBCCBNMBCCBCyBBCCBCFBFPBDZBCCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBN5BBFcBmBBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDBhBnCBCjBBFmBBCjBBCOBCMBmBlGBCGGD4LBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBH1CBDFBD-TBCbBE4CBIVBKXBKTBNMBCCBCBBN9CBDJBHJBHNBCKBH4CBIqBBGlCBLeBCLBFLBFEEBoBBDEBMrBBFZBHKBE9BBDgCBCcBDKBHJBHNBDtBBDLBVsCBClFBJ7BBEOBE9BBGqBBDKBJqBBG1QBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBSXBJuBBSBBDaBCMBEhBBPgBBQrEBF5UBXKBWz4BBD9LBGsBBCGGD3BBIBBPXBKGBCGBCGBCGBCGBCGBCGBCGBC9DBjBZBC4CBN1GBbPBC+BBC1CBDmDBGqBBC9CBC1CBKvBBCszcBE2BBK7KBV3FBJ8GBV7BBEJBH3BBJlCBJLBHzDBMdBEtCBCKBFgBBC2BBKNBDJBDmDBZbBLFBDFBDFBKGBCGBC7BBF9DBDJBHj9KBNWBFwBBloItLBDpDBnBGBNEBGZBCEBCCCBCCBCCBoUBhBpBBHyBBCSBCDBFEBCmEBF9FBEFBDFBDFBDCBEGBCGBOBBDLBCZBCSBCBBCOBDNBjB6DBGCBFsBBE3CBCMBEwBwBBsBBjEcBEwBBQbBFjBBKdBGqBBGdBCkBBFNBrB9EBDJBHjBBFjBBFnBBJzBBMLBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBCnCBJIBxBSBCBBGgBBEaBGaBnB3BBFTBDxBBCBBGHBCCBCcBDCBFJBIIBI-BBhBmBBFLBK1BBEcBDaBGZBIDBNGBxCoCB4ByBBOyBBItBBJJBHlBBEcBJBBxGeBCpBBCCBDBBRFBJIBiBtBBJpBBXZBnBbBVWBKtCBFjBBK9BBCEBOYBIJBH0BBCRBJmBBK-CBCTBMRBCuBB-BGBCCCBCBCOBCKBH6BBGJBHDBCHBDBBDVBCGBCBBCEBCJBDBBDCBDHHGGBDGBEEBMJBCDDClBBCJBCDDCDBCJBCBBJBBe7CBCEBfnCBJJBnF1BBDlBBjBkCBMJBHMBU5BBHJBHTBdaBDOBFWB6F7BBlDyCBNHBDDDBGBCBBCdBCBBDLBKJBnCHBDtBBDKBcnCBJyCBOoCBIJB3CHB5ChBBPJBHIBCsBBCNBLcBEfBDVBCNBqCGBCBBCrBBECCBCCBHBJJBHFBCBBCkBBCBBCFBIJBHrBBFJB3HYBIQBCoBBEcB2CQQBwBBO6cBnDuDBCEBMjGBtyCiDBOvhBBRVBL68DBGmSB61G5BBn2B4RBIeBCJBFwCBCJBHdBDFBLlCBLJBCGBCUBGSBxN5BBnG6CBGYBDYBtBqCBF4BBIQBhCEBMGBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBDDBh7D8HBEzNBHWBQQBQtBBDWBKzDB9B1HBLmBBDpCBJvDBWlCB7DTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBD9VBQEBCOBxiBeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBENBDJBFBBhKeBS5BBGxOxOBoBB3GqBBFhGhGBdBCVBJBBhHGBCDBCBBCOBCkGBDPBqBrCBFJBFBByYjCBtC8BBjGDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBBvIrBBFjDBNOBDOBCOBCkBBLtFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBmgB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIBnkzVvHB",!1))),this._Print}static get Upper(){return this.CATEGORIES.get("Lu")}},j(Hn,"_CASE_ORBIT",null),j(Hn,"_Print",null),j(Hn,"CATEGORIES",new ha({C:()=>new g(m("AfBgDgBBOrWrWBHHBCBICCVuMuMnBBBzBBBE4B4BBGBcDBHQBXhGhGxBBB8BBBmDNB8BBByBBBQddBCCMEBhBGBsCiFiFJBBDBBXIICCBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBPMMBEB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKMMBDBbEByBPBDBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCB-FCBHBBHBBHBBECBIIIBLBDBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIB-BGGBLBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMBxhBPBXJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBF-6DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBrCHBxDUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIlkzVBxHvw-FB",!1)),Cc:()=>new g(m("AfgDgB",!0)),Cf:()=>new g(m("tFzqBzqBBEBXhGhGyBhMhMBxCxCs5D9-B9-BBDBbEByBEBCJBw03B6H6HBBBimEQQj7IPBhjiBDBwmFHBn0rYffB+CB",!1)),Cn:()=>new g(m("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBDBvzIBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-BB---BBB---BBB",!1)),Co:()=>new g(m("gg4B-nGh4hc9--BD9--B",!0)),Cs:()=>new g(m("gg2B--B",!0)),L:()=>new g(m("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICCiEEBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoCaBFDBuBqBBkBBBCiDBCQQBIIBLLBBBDRRCdBe4CBMZZBfBKBBFGGBUBFKKEYYBXBIKBGXBCGBRpBB7B1BBETTIJBQPBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNGB7BBBCCCBDBCXBCCCBIBCBBKDDBDBCWWBCBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNSSBkBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBkBFFkC4CBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBzC+C+CBtBBSHB3BdBOBBLrBBbjBBqBCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBhC1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBF1B1BB8zC8zCBjHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBxC2O2OBrBrBBDBGBBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBReBDlCByBIBDmDBDxCBVQBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBdRRBDBCJBLEBCoBBYCBCHBVWBEEEBwBBCEEBDDBDBDCCZCBDKBICBNFBDFBDFBKGBCGBCqBBCNBHyDBej9KBNWBFwBBloItLBDpDBnBGBNEBGCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBxB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOjBBnBbBKWB7HpBBHBBRFB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB1D-BBgBHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBqBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBGjCjCBLBhCBBCPPBNNB0mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBn7F0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFBmI9BBzEsBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCCBCBBCGBDEBKBBhHGBCDBCBBCOBCkGB8BjCBI1lB1lBBCBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),LC:()=>new g(m("hCZBHZB7BLLBVBCeBCiGBCDBFvGBDZBhGDBDBBECBCHHCCBCCCBSBCyCBCqEBJlFBClBBKoBB44ClBBCGGDqBBDCBhV1CBDFBjkCKBGqBBDCBhCrBBgCMBChBBmD1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGBmIFFDJBCEEBDBHGCBCBCFBFDDBCBGEBF1B1BB8zC8zCB6DBDmDBHDBEBBNlBBCGGzoetBBTbBnEtCBCWBEDBCsCBZBBE2Z2ZBpBBGIBIvCBh6TGBNEBqgBZBHZBmlBvCBhDjBBFjBB1DKBCOBCGBCBBCKBCOBCGBCBBk2ByBBOyBB+CVBLVB74C-BBhrV-BBhBYBDYBtpZ0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BJBCTBHFB2uCjCB",!1)),Ll:()=>new g(m("hDZB7BqBqBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDZBiGCCEEEBBBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBDCB5XFBjkCIBC2D2DBqBBgCMBChBBnD0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBBzIEEBEEcKFDBBJDBF2B2Bs1CvBBCEEBGCFCCBCCBEBGiDCBIICFFNlBBCGG0oesBCUaCoEMCBBBC+BCBGBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCbEE2ZqBBGIBIvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFB4vChBB",!1)),Lm:()=>new g(m("wVRBFLBPEBICCmEGG-OnHnHlFBBuIBBFgBgBKEEhFoFoF1mBgEgE2R72B72BsDkTkTxOFBvF+BBOjBjBBjBByVOORMBg-CBByHgGgG2OsBsBBDBGiDiDB+C+CBBB34bjnBjnBBEBvIzDzDdBB6DIBxCYYpDDBEBB2OXXqEtDtDWBBoDDBKngVngVuBBBh-BFBCpBBCIB0sBhBhB2K04D04DnrTDB9PCBpBBBnRMBhCBBCPPB9-P9-PBCBCGBCBByhM9BBqGGBud0Q0QsSAB",!1)),Lo:()=>new g(m("qFQQhIFFBCBxGBB7ZaBFDBuBfBCJBkBBBCiDBCZZBLLBBBDRRCdBe4CBMZZBfBWVBrBYBIKBGXBCGBRoBB8B1BBETTIJBROBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNFB8BBBCCCBDBCXBCCCBIBCBBKDDBDBYDBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNyDyDBnKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPByDrTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBpBkCkCBhBBC0BBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBxFuBBSHB3BdBOBBLrBBbjBBqBCBLdByDDBCFBCBBE7hB7hBBCB4-C3BBZWBKGBCGBCGBCGBCGBCGBCGBCGBoR2B2BF1CBJCCB4CBFGGBpBBC9CBSfBxBPBhQ-tGBhC0wUBC2jBBkCnBBJrIBFPBLBBjCyByBBkCBqFoDoDEGBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBuBEBDIBLEBCoBBYCBCHBVPBCFBEEEBwBBCEEBDDBDBDCCZBBEKBIPPBEBDFBDFBKGBCGByEiBBej9KBNWBFwBBloItLBDpDBkCCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBqDJBCsBBDeBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBhEtCBjDnBBJzBB9CzBBN2JBKVBLHB5EFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4FjBBnBDBCxJxJBoBBHBBRCBCBB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB0GHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBnBBCBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBB0BUBGSB0NnBB2MqCBGwFwFB0mHBqBfBiDyDBuwIiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBxzI2P2PBrBBiBiKiKBcBTrBBlPaBmHdBDwGwGBdBCCBCBBCGBDEBKiHiHBFBCDBCBBCOBCkGB8pBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Lt:()=>new g(m("lOGDnB2sH2sHBGBJHBJHBNQQwBAB",!1)),Lu:()=>new g(m("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBG+B+B9zCvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBB",!1)),M:()=>new g(m("gYvDB0IGBoIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCgBB3BCBCRBCGBLBBeCB5BCCBFBDBBDCBKLLBbbDCB5BCCBDBFBBDCBEffBEEMCB5BCCBGBCCBCCBVBBXFBCCB5BCCBFBDBBDCBICBLBBf8B8BBDBECBCDBKpBpBBDB4BCCBFBCCBCDBIBBMBBeCB5BCCBFBCCBCDBIBBMBBQNNBCB4BBBCGBCCBCDBKLLBeeBBBnCFFBEBCCCBGBTBB+BDDBFBNHBjDDDBHBMGBqCBBcECFBByBTBCBBGKBCjBBKlDlDBSBYDBFCBCCBDGBEDBOLBCLLBCBgWCBzdDBdCBeBBfBBhCfBKuBuBBBBC2D2DBjBjB3DLBFLB8GEB6BJBCcBDxBxBBsBBDLBVEBwBQBnBIBNCBfMB5BNBxBTB5ECBCUBFHHDCBnG-BBxWgBB--CCBuEhDhDBeBrRFBqDBB1udDBCJBhBBBxCBBxIEEFYYBDBF0C0CBzBzBBQBbRBOnBnBBGBaMBtBDBwBNBlBkCkCBMBNJJBuBuBBBBzBCCBBBDBBGBBCqBqBBDBGBBtHHBCBBx5TiXiXBOBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB7DCB2BOBqBDDBLLBCBuBKBI+B+BBBBlBNBRBBtBNNBBBxBNBJDBCBB9CLBHDD+ELBWDB4BBBCGBDBBDCBKLLBDDBFBEEBkCIBCDDCDBCEBCPPBzCzCBQBYyCyCBSBsHGBDIBcBBzCQBrDMBmDOBhIOB2HFBCBBDDBCCCBuEuEBFBDGBEddBIBpBGBCDBJKKBJBvBPBnGHBoGHBCHBzCVBCNB7DFBECCBCCBFBCjCjCBDBCBBCEB8KDBKBBCxBxBBFBEEBYmnFmnFHOBpmLRBhuCEB8BGB5gBCCB1BBIDByCMMBslTslTBizEizEBsBBDWB-QEBEFBJHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),Mc:()=>new g(m("joC4B4BDCBJDBCBBzBBB7BCBHBBDBBLsBsB7BCBjC7B7BBBBJCCB2B2BB7B7BCHHBDDBLLnDBBCBBECBCCBLqBqBBBB+BDB+BBB7BCCBDBDBBCBBKBBdPPB7B7BBBBGCBCCBLrBrBBsCsCBBBHHBTBBrKBBgCsFsFBFFHDDBaaBLLBBBDGBWBBDFBDLLBBB5zBffiEIIBGBCBB7KDBDCBFBBCFBhHBB7BCCKCCBJJBEByExBxBGCCBDBCBB+BffFBBD9B9BDCBCEEBxBxBBGBJBBsFWW35EBB0-dBBD5C5CBzBzBBOBvEBBwBxBxBBFFBDDBBBvDBBDBBZuBuBCuDuDDBBGuHuHBCCBCCBCC0gZCCgEuBuBBBBFBB0DZZB8B8BxBCBKBBO+C+CBBBEBBCrFrFBBBgBBB7BBBCDBDBBDCBKLLB1C1CBBBIDDCDBCBBCmDmDBBBJBBErDrDBBBHCCBCBDuHuHBBBHDBDyDyDBBBJBBCuDuDCBBHoDoDCBBFmImIBBBK4H4HBEBCBBFDDCvEvEBBBJDBF1C1CeBB-BqGqGECCoGPPrDIID2G2GBDBFBBC-K-KBNNxBBBJBBCpvQpvQBBBlxD2BBpDBB0rYBBHFB",!1)),Me:()=>new g(m("okBBB1xF-wB-wBBCBCCBsshBCB",!1)),Mn:()=>new g(m("gYvDB0IEBqIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCfB4BCCFHBFEEBFBLBBe7B7BFDBJVVBbbDBB6BFFBFFBDDBBBEffBEEMBB6BFFBDBCBBFVVBXXBEBC7B7BDCCBCBJIIBMMBff+BNNzBEE4BCCBBBGCBCDBIBBMBBe7B7BDHHGBBVBBdBB6BBBFDBJVVBeepCIIBBBC7C7CDGBNHBjDDDBHBMGBqCBBcEC4BNBCEBCBBGKBCjBBKnDnDBCBCFBCBBDBBaBBFCBRDBODDBHHQgWgWBBBzdCBeBBfBBfBBhCBBCGBJDDBJBKuBuBBBBC2D2DBjBjB3DCBFBBKHHBBB8GBBD7B7BCGBCCCDHBHJBDxBxBBMBCeBDLBVDBxBCCBDBCGGpBIBNBBhBDBDBBCCB5BCCBEECCB7BHBDBB5ECBCMBCGBFHHEBBnG-BBxWMBFEEBKB--CCBuEhDhDBeBrRDBsDBB1udFFBIBhBBBxCBBxIEEFaaBGG4EBBbRBOnBnBBGBaKBvBCBxBDDBCBDBBoBkCkCBEBDBBDBBNJJwB0B0BCCBDBBGBBCrBrBBJJvHDDFx5Tx5TiXPBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB8D3B3BBNBqBDDBLLBBByBDBDBBI+B+BBBBlBEBCHB-BNNB1B1BBHBLDBDgDgDBBBDCCBHHD+E+EEHBWBB6BBBEmBmBBFBEEBnCFBOECPBB2CHBDCBCYY1CFBCFFBCCBvHvHBCBHBBCBBcBB2CHBDCCBrDrDCDDBEBCmDmDCDDBCBCEBkIIBCBBhIBBCFFxEDBDBBFhBhBBIBpBFBDDBJKKBEBDCBvBMBCBBnGCCBBBCqGqGBFBCFBCzCzCBUBDGBCBBCBB7DFBECCBCCBFBCpCpCBEEC8K8KBMMB1B1BBDBGCCYmnFmnFHOBpmLLBECBhuCEB8BGB5gBgCgCBCByC5lT5lTBizEizEBsBBDWBhRCBSHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),N:()=>new g(m("wBJB5DBBGDDBBBitBJBnEJBnGJB9MJB3DJBFFBtDJB3DJB3DJBDFBvDMB0DJBJGBoDJBpDGBISBuDJBhDJB3DJBnCTBtIJBnCJBwWTBybCBwHJBHJBXJBtJJBhEKBmFJBHJB3FJB3CJBnEJBHJB3gBEEBEBHJBnGyBBDEB3W7BBvCVB3TdBqrBqYqYaIBPCB4KDBrEJBfHBCOBhBJBoBOBh7cJB9FJBhKFB7EJBnBJBnGJBXJB3CJB3MJB34UJBuPsBBN4BBSBB2KaBlBDBeJJnEEBrGJBvdHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBxBJBHJB3IeB-EJBrBDBxDGBnEdBhEJB9BJBxEJBITB8HJB3KJB3DJB3LJBnDJBHTBtCLBlNSB+CJB3UJB3CcBkHJBnCJB3BJBnLJBnDUBshBuDBimPJBnpCJB3CJBnEJBCGBvQJBnIWB+KCB6nXJBnuBTBNTBtDYB2iBxBBhqCJBnNJB3PJB4HJBtWIBhEJB4Y6BBCCBCDBtCsBBCOBjeMBk3CJB",!1)),Nd:()=>new g(m("wBJnxBJnEJnGJ9MJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJhDJ3DJnCJ3IJnCJn6BJnBJtJJhEJnFJHJ3FJ3CJnEJHJnuiBJnVJnBJnGJXJ3CJ3MJ34UJnsBJnkCJHJ9YJhEJ9BJxEJ3IJ3KJ3DJ3LJnDJHTtCJnNJnDJ3UJ3CJ3HJnCJ3BJnLJ3uQJnpCJ3CJnEJ3QJ37XJ12CxBhqCJnNJ3PJ4HJ2aJ30EJ",!0)),Nl:()=>new g(m("u3FCBwzCiBBDDB-zDaaBHBPCBs1dJBxyW0BBtOJJnEEBrhIuDBm8SCB",!1)),No:()=>new g(m("yFBBGDDBBB2pCFB5LFB5DCBmEGB6GGBSIByNJB2hBTB0jBJBhP20B20BEFBHJBnGPBqB3W3WB6BBvCVB3TdBqrB1kB1kBBCBrEJBfHBCOBhBJBoBOBxrdFBymWsBBiCDBSBB2KaBlBDB1pBHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBhLeB-EJBrBDBxDGBnETB8LTBmqBBBvNIBobSB0aUBn8SGB-YWBqhZTBNTBtDYBvqFIBid6BBCCBCDBtCsBBCOBjeMB",!1)),P:()=>new g(m("hBCBCFBCDBLBBEBBbCBCccCkBkBGEELBBEEE-VJJzOFBqBBB0BCCDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCmBmBBCBoCrCrCBDBFBBwDFBsFlTlTBHB4EuTuTtBBBvCCBoCBB+ECBCCBmBKB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBM9Z9ZBWBJTBCMBCLBfBBPBB6TDBeBB+hBNBwCBBgBJB0MVBgCDBhBBB8XDBCBBxDwEwEBtBBCfBDLBkNCBFJBDLBRNNjD7C7CjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HzqUzqUBxGxGBIBXiBBCNBCFFCBB2ECBCFBCDBLBBEBBbCBCccCCCBFB7MCB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDByO-J-JjBlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Pc:()=>new g(m("-Cg-Hg-HBUU-u3BBBZCBwHAB",!1)),Pd:()=>new g(m("tB9qB9qB0BiyDiyDmgBqgCqgCBEBiwDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Pe:()=>new g(m("pB0B0BgB+1D+1DC-6B-6BqtC4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECtBGCtNICEGCDBB-ozB6G6GeOCESSCCCrF0B0BgBGD",!1)),Pf:()=>new g(m("7F+6H+6HEddpuDCCFDDQEE",!1)),Pi:()=>new g(m("rFt7Ht7HDBBDaapuDCCFDDQEE",!1)),Po:()=>new g(m("hBCBCCBDECBLLBEEBcclCGGPBBI-V-VJzOzOBEBqB3B3BDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCxDxDrCEBFBBwDFBsFlTlTBHBmY9D9DBBBoCBB+ECBCCBmBFBCDB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBMjajaBJJBGBJIBDDBDCBEKBCCCBIB7kDDBCBBxDwEwEBFFBBBDDDBHBCBBCDDBLLBDBCJBDDBCCCBLBDCBtNCB6B+F+FjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HlxUlxUBFBDXXVBBDDBECBCDBICBHCCB2E2EBBBCCBDECBLLBEEBcclBDDB7M7MBBB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDB0ZlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Ps:()=>new g(m("oBzBzBgB-1D-1DC-6B-6B-rCEEnB4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECaTTCECtNICEGCDipzBipzB4GeeCMCESSCCCrFzBzBgBEEDAB",!1)),S:()=>new g(m("kBHHRCBgBCCcCCkBEBCBBDCCBCBDEEfgBgBrODBNNBGGBCCCBPB2DPPBxDxDsErIrIBBB3DCBDDDBvGvGLUUB4H4HIBBpEqLqLBHHB2H2H-DjEjEBGBlEwGwGqBmGmGiGCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WuLuLlL+E+EBgBBiLJBKIBhiBCCBBBMCBOCBOCBOBBmCOOoBCBOCBUhBB-BBBCDBCBBLCCBBBGFBCECFMMBFFBDBGDBC7B7BBFFB2LBFcBD+HBXKByCtCBXnTBtBwBBDeBLyMBX+BBFfBD1LBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBB8CBB0HBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BB6RWBKBBoDBB+EDBLDB+RCBiHPPB+9T+9TpEgBBuLPBhCBB3BHBtBDBjDCCBBBD7E7EHRRBBBgBCCcCCiEGBCGBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSmWmWBiKiKBGBnjC2kC2kCBbBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQQBgDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBrbaagBaagBaagBaagBaa9B-PB4BDBzBHBCNBCBBp2BwNwNttCEE+DiOiOBvIvIBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Sc:()=>new g(m("kB+D+DBCBqnB8D8DzPBBzPBBI2H2HoImSmS8sClmClmCBgBB37hBkuVkuVtD7E7E8GBBEBB3-HDB-4wBxtCxtC",!1)),Sk:()=>new g(m("+CCCoCHHFEEqQDBNNBGGBCCCBPB2DPPBjoBjoB15FCCBBBMCBOCBOCBOBB9kEBBkzdWBKBBoDBBxePPBniUniUBPB8bCCjF4g9B4g9BBDB",!1)),Sm:()=>new g(m("rBRRBBB+BCCuBFFmBgBgB-XwQwQBBB8xGOOoBCBOCBsEoBoBBDBHlClCBDBGBBFGDIgBgBBDDCgBgBBqIBhBBB7CffBXBpBFB2OKK3BHBwDxKxKBDBDeBLPBhIiEBX+BBFfBDhIBxBUBDFB9+zB5Z5ZCCBlFRRBBB+BCCkEHHBCBitDBBhrwBx+Bx+BagBgBagBgBagBgBagBgBat5Ft5FB-uC-uCBHB",!1)),So:()=>new g(m("mFDDFCCyerIrIBgEgEBvGvGLUUB4H4HkQ2L2LjEFBClElEwGqBqBoMCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WzWzW+EhBBiLJBKIBksBBBCDBCBBLCCBHHBEBCECFMMBPPCBBC7B7BBKKBDBDDBCBBCBBCGBCeBDBBCCCBdBtIHBFTBDGBDwCBCdBanBBHnCBXKByCtCBX2FBCIBC1BBJuDBC3HBtBrBBhC-HBhQvBBWBBHmBBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBBxKBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BBibDBLBBC+R+RBBBqqUPBuLPBhCBB3BHBuBCBlPEEFBBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSpgBpgBBGBnjC2kC2kCBGBFQBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQPBhDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBqlB-PB4BDBzBHBCNBCBBp2B96C96CiEyWyWBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E6HBG4WBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBB-B3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Z:()=>new g(m("gBgEgEgvFgsCgsCBJBeBBGwBwBh9DAB",!1)),Zl:()=>new g(m("ohIA",!0)),Zp:()=>new g(m("phIA",!0)),Zs:()=>new g(m("gBgEgEgvFgsCgsCBJBlBwBwBh9DAB",!1)),ASCII_Hex_Digit:()=>new g(m("wBJIFbF",!0)),Alphabetic:()=>new g(m("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICC3CeeBQBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoBNBCCCBCCBCCJaBFDBeKBG3BBCGBPlDBCHBFHBFCBLCBDRRBuBBOkDBZgBBKBBFGGBWBDSBUYBIKBGXBCGBIJJBoBBLLBEGBHrCBCPBCCBFOBOSBCHBDBBDVBCGBCEEBCBEHBDBBDBBCJJFBBCEBNBBLFFBBBCFBFBBDVBCGBCBBCBBCBBFEBFBBDBBFIIBCBCSSBEBMCBCIBCCBCVBCGBCBBCEBEIBCCBCBBEQQBCBWDBFCBCHBDBBDVBCGBCBBCEBEHBDBBDBBKBBFBBCEBORRBCCBEBECBCDBEBBCCCBEEBEEBBBELBFEBECBCCBEHHpBMBCCBCWBCPBEHBCCBCCBJBBCCBCBBDDBdDBCHBCCBCWBCJBCEBEHBCCBCCBJBBGCBCDBOCBNMBCCBCoBBDHBCCBCCBCGGBCBIEBXFBCCBCRBEXBCIBCDDBFBJFBCCCBGBTBBO5BBGGBH0B0BBECBDBCXBCCCBRBCCBDEBCHHPDBhBgCgCBGBCjBBFSBFPBCjBBkC2BBCDDBDBR-BBLDBDlBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBEKBITBMUBNTBNMBCCBCBBNzBBDSBPFFkC4CBIqBBGlCBLeBCLBFIBYdBDEBMrBBFZB3BbBF+BBDTBzBYYBMMBBByBzBBCOBCHB0BpBBDDBLrBBCKBP2BBXCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBUhBBM1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBFSSBnBBuZzBB34BkHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBCfBwB2O2OBBBaIBIEBDEBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBGHBEwDBoBIBDmDBDxCBVUBCgBBZzBBNjCBCtBtBBEBECCBBBLgBBGiBBOcBEyBBCLBQRRBOBLEBC2BBKNBTWBEkCBCCCZCBDPBDDBMFBDFBDFBKGBCGBCqBBCNBH6DBWj9KBNWBFwBBloItLBDpDBnBGBNEBGLBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmC0BBsIcBEwBBwBfBOdBGqBBGdBDjBBFHBCEBrB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCDBCBBGHBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOnBBjBbBEGGBVB7HpBBCBBEBBRFBzBCBEcBLJJBUBrBRBvBUBcWBKlCBsBEBL4BBKOOBXBYyBBSDBJiBBEKKB+BBCDBKBBLCCkBRBChBBDHHBCB-BGBCCCBCBCOBCJBI4BBYDBCHBDBBDVBCGBCBBCEBEHBDBBDBBEHHGGBdJBCDDClBBCJBCDDCDBCBBECCtBhCBCCBCDBVCBfhCBDBBC5F5FB0BBDGBaFBjB+BBCEE8B1BBDoCoCBZBDNBWGB6F4BBoD-BBgBHBDDDBGBCBBCdBCBBDBBDDB+CHBDtBBDFBCCCBccBxBBDJBSnCBGTTBnCBoDHB5CgBBgBIBCsBBCGBCyByBBcBDVBCNBqCGBCBBCrBBECCBCCBBBCDDBZZBEBCBBCkBBCBBCDBCYYBqBBlIWBKQBCoBBECBwDwCwCB4cBnDuDBSjGBtyCgDBQvhBBSFBa68DBGmSB61GuBBy2B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBF4BBIQBhCBBCNNBFBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBFi7Fi7FBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCVBJBBhHGBCDBCBBCOBCkGB8BjCBEEE1lBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1TZBHZBHZB3zD-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Dash:()=>new g(m("tB9qB9qB0BiyDiyDmgBqgCqgCBEB+BoBoBQnMnMlgDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Emoji:()=>new g(m("jBHHGJBwDFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDrGrGhFBBNBBPDDBIBsCZBCBBYVVDIBWBBvFhBBDvDBDBBCCBDyCBDCBCmIBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDDBEJBECCBEEDJBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Emoji_Component:()=>new g(m("jBHHGJB0+H2G2Gsp3B3+8B3+8BBYB8PEBxtBDBtzhY-CB",!1)),Emoji_Modifier:()=>new g(m("7-8DE",!0)),Emoji_Modifier_Base:()=>new g(m("9wJ8G8GRDB4jzD9B9BBBBDDDBBB2DBBDKBWSBEFFBBBCCBICCZqGqGBFFWFFBvFvFBBBEEB0CRRBBBKMMgSDDJHBHKKBIBDCB5B+B+BBCCBCCSCBCMBmHCBrBIB",!1)),Emoji_Presentation:()=>new g(m("64IBBuGDBEDDqQBBWBBzBLBsBUUOJJBSSBGGBJJGWWIBBCFFDIIFBBdkBkBCFFBBBC+B+BBBBZPP8aBB0BFFvlxDrGrG-FDDBIBsCZBCZZVDDBDBCCBWBBvFgBBNIBClCBCVBNqBBFEBNQBEEEBlCBCCCB5FBD+BBODBCXBTbbBOO3C0CBxBlCBHEEBBBDDBEDBMBBIIBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Extended_Pictographic:()=>new g(m("pFFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDoBoBBCBlDLBQBBQPPBmBmBBIBxDBBNBBPDDBIBU3BBcOBLVVDIBCDBKWBH7FBDvDBDBBCCBDyCBDCBCDBG9HBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDQBECCBEBDMB7GlBBNDB5BHBLFBpBHBfBBNDBDNBKmBBNuBBCJBC4FB5CHBPxEBhI9fB",!1)),Hex_Digit:()=>new g(m("wBJIFbFq1-BJIFbF",!0)),Lowercase:()=>new g(m("hDZBwBLLFlBlBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDiBBIBBfEBhDsBsBCEEDDBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBCDB5XFBjkCIBC2D2DB+FBiC0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBB6DOORMBuDEEBEEcKFDBBJDBFiBiBBOBFsasaBYBn6BvBBCEEBGCFCCBCCBGBEiDCBIICFFNlBBCGG0oesBCUaCBBBmEMCBBBC8BCBIBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCWDBCCCBBB2ZqBBCNBHvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBkODDBBBCpBBCIBmoByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFBmI9BB1lChBB",!1)),Math:()=>new g(m("rBRRBBBgBeeCuBuBFmBmBgB5W5WBBBDbbBDDBBBwQCBuwGccBBBMEEOPPBCBWEBMEBiCMBFEEBFFBDBTFFDJBCDDBEBHEEBDDBCCBBBCFBENBClClCBWBCFBCBBFBBFfBCHHBPPBqIBJDBVBB7CffBZBCZZMGB+NBBNJBFFBFBBDBBEEBPCCDFBMHBGBB6BCCeDBKCBxK-BBhI-PBxBUBDFB9+zB4Z4ZBEBCjFjFRCBeCCeCCkEHHBCBitDBBhrwBwoBwoBBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBBhwFDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB-uCIB",!1)),Quotation_Mark:()=>new g(m("iBFFkEQQ96HHBaBBowDqOqOBCBOCBixzBDB+FFF7CBB",!1)),Terminal_Punctuation:()=>new g(m("hBLLCMMBEE-ZJJiQ6B6BpCPPCCB1FsBsBBJBCsHsHB3B3BBEBCHBgBmImIB1nB1nBBtFtFFFB4JBB2YHBmY9D9DBBBoCBB+ECBEoBoBBCBDBB7JBBjLDBjFBBLBBCCBeCB8FEB-BBBldYYBKKBBBwlDCBzJOOFLLCBBEBBtNBB8ndBBuICBkHEB-LBB3CBBgD4E4EBBB0ECBgERRB6H6HnxUDDB6B6BBBBCDBqFLLCMMBEEiCDD7hBxBxBnkBoGoG3JBB5EFBlCFB6CDB5dEBtBDB+FGBxDDBgECBiEBBHRRB5C5CBDBtDrJrJB2D2DBBBNBBnLDBEOBqDBB6HCBmQCC8HBB4CBBFBB-MCBuBmUmUBrCrCBspBspBBDB6vRBBmEiCiCBBBLqRqRBoJoJBnwTnwTovHDB",!1)),Uppercase:()=>new g(m("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBGbbBOBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBBvgCZBHZBHZB",!1)),White_Space:()=>new g(m("JEBTlDlDbgvFgvFgsCKBeBBGwBwBh9DAB",!1))})),j(Hn,"SCRIPTS",new ha({Adlam:()=>new g(m("go6DrCFJFB",!0)),Ahom:()=>new g(m("g4lCaDOFW",!0)),Anatolian_Hieroglyphs:()=>new g(m("ggxCmS",!0)),Arabic:()=>new g(m("gwBEBCFBCNBCCBCfBCJBMZBCrDBChBBxCvBBxHhBBGqCBCcBxy8BtPBDvEBhBPBxDEBCmEBk7DeBkCFBJIBiBFBh43BDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB",!1)),Armenian:()=>new g(m("xpBlBDxBDCks9BE",!0)),Avestan:()=>new g(m("g4iC1BEG",!0)),Balinese:()=>new g(m("g4GsCCxB",!0)),Bamum:()=>new g(m("g1pB3CpowB4R",!0)),Bassa_Vah:()=>new g(m("w26CdDF",!0)),Batak:()=>new g(m("g+GzBJD",!0)),Bengali:()=>new g(m("gsCDBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYB",!1)),Beria_Erfe:()=>new g(m("g17CYDY",!0)),Bhaiksuki:()=>new g(m("ggnCICsBCNLc",!0)),Bopomofo:()=>new g(m("qXB6wLqBxDf",!0)),Brahmi:()=>new g(m("ggkCtCFjBKA",!0)),Braille:()=>new g(m("ggK-H",!0)),Buginese:()=>new g(m("gwGbDB",!0)),Buhid:()=>new g(m("g6FT",!0)),Canadian_Aboriginal:()=>new g(m("ggF-TxRlC7tgCP",!0)),Carian:()=>new g(m("g1gCwB",!0)),Caucasian_Albanian:()=>new g(m("wphCzBMA",!0)),Chakma:()=>new g(m("gokC0BCR",!0)),Cham:()=>new g(m("gwqB2BKNDJDD",!0)),Cherokee:()=>new g(m("g9E1CDFz7lBvC",!0)),Chorasmian:()=>new g(m("w9jCb",!0)),Common:()=>new g(m("AgCBbFBbuBBCOBCEBYgBgBiOmBBGEBDTB1DKKHCC+THHPEEhB9E9ElQiEiEB6mB6mB2MDBjJwvBwvBBBBoCBBsGBBCumBumBOIIBCBCFBCCBDmYmYBKBD2CBCKBEKBCOBShBB-BlBBCCBDFBCaBCQBqBCBF5UBXKBW-cBhIzTBDpEBhQ9CBzMUBCCCBXBQHBFDB8CBBE7C7CB0E0EBOBhBlBBKxBxBB+BBgBwCBwB5C5CBmFBhuG-BBhoWhBBnDCBmFJB1HhFhFsMPPBzuUzuUBxGxGBIBXiBBCSBCDB0ECCBeBbFBbKBLuBuBBhChCBFBCGBLEBjICBFsBBEIBxCMB0BsBBlHaBltuBDB96D8HBEzNBHWBQQBgDzDB9B1HBLmBBD9BBEQBJBBIdBF8BB2GTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBByjFjCBtC8BBjWrBBFjDBNOBDOBCOBCkBBLtFB5BZBCBBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBnghYffB+CB",!1)),Coptic:()=>new g(m("ifNxkKzDGG",!0)),Cuneiform:()=>new g(m("ggoC5cnDuDCEMjG",!0)),Cypriot:()=>new g(m("ggiCFBDCCBqBBCBBEDD",!1)),Cypro_Minoan:()=>new g(m("w8rCiD",!0)),Cyrillic:()=>new g(m("ggBkEBDoFBx6FKBhFtCtCojEfBhie-CBv8VBBhw4B9BBiBAB",!1)),Deseret:()=>new g(m("gghCvC",!0)),Devanagari:()=>new g(m("goCwCFODZh7nBfhwcJ",!0)),Dives_Akuru:()=>new g(m("gomCGBDDDBGBCBBCdBCBBDLBKJB",!1)),Dogra:()=>new g(m("ggmC7B",!0)),Duployan:()=>new g(m("ggvDqDGMEIIJDD",!0)),Egyptian_Hieroglyphs:()=>new g(m("ggsC1iBL68D",!0)),Elbasan:()=>new g(m("gohCnB",!0)),Elymaic:()=>new g(m("g-jCW",!0)),Ethiopic:()=>new g(m("gwEoCBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBnvGWBKGBCGBCGBCGBCGBCGBCGBCGBjpfFBDFBDFBKGBCGBylvCGBCDBCBBCOB",!1)),Garay:()=>new g(m("gqjClBEcJB",!0)),Georgian:()=>new g(m("glElBBCGGDqBBCDBx8CqBBDCBhiElBBCGG",!1)),Glagolitic:()=>new g(m("ggL-Ch9sDGCQDGCBCE",!0)),Gothic:()=>new g(m("w5gCa",!0)),Grantha:()=>new g(m("g4kCDBCHBDBBDVBCGBCBBCEBDIBDBBDCBDHHGGBDGBEEB",!1)),Greek:()=>new g(m("wbDBCCBDDBCFFCCCBBBCCCBSBC+BBPPBnpGEBzBEBFEB1ChKhKBUBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBoJ-xiB-xiB7uVuCBSgj0Bgj0BBkCB",!1)),Gujarati:()=>new g(m("h0CCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGB",!1)),Gunjala_Gondi:()=>new g(m("grnCFCBCkBCBCFIJ",!0)),Gurmukhi:()=>new g(m("hwCCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPB",!1)),Gurung_Khema:()=>new g(m("go4C5B",!0)),Han:()=>new g(m("g0LZBC4CBN1GBwBCCaIBPDBle-tGBhC-vUBhoWtLBDpDBpodBBNGBqgkB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Hangul:()=>new g(m("goE-HvxHBiI9CyDeiCei3dckUj9KNWFwBl9JeEFDFDFDC",!0)),Hanifi_Rohingya:()=>new g(m("gojCnBJJ",!0)),Hanunoo:()=>new g(m("g5FU",!0)),Hatran:()=>new g(m("gniCSCBGE",!0)),Hebrew:()=>new g(m("xsB2BBJaBFFBpp9BZBCEBCCCBCCBCCBIB",!1)),Hiragana:()=>new g(m("hiM1CBHCBi7-C+IBTeeBBBulQAB",!1)),Imperial_Aramaic:()=>new g(m("giiCVCI",!0)),Inherited:()=>new g(m("gYvDB2IBBlOKBbhXhXBCB8qEtBBDLBlPCBCMBCGBFHHEBBnG-BBtQBBjGgBB65DDBsDBBmrzBPBRNBwejHjH7iEl+uBl+uBBsBBDWBhRCBSHBDGBfDBz6rYvHB",!1)),Inscriptional_Pahlavi:()=>new g(m("g7iCSGH",!0)),Inscriptional_Parthian:()=>new g(m("g6iCVDH",!0)),Javanese:()=>new g(m("gsqBtCDJFB",!0)),Kaithi:()=>new g(m("gkkCiCLA",!0)),Kannada:()=>new g(m("gkDMCCCWCJCEDICCCDIBGCCDDJCC",!0)),Katakana:()=>new g(m("hlM5CBDCBxHPBxGuBBC3CBvgzBJBCsBBzisBDBCGBCBBCgJgJBBBzBPPBCB",!1)),Kawi:()=>new g(m("g4nCQCoBEc",!0)),Kayah_Li:()=>new g(m("goqBtBCA",!0)),Kharoshthi:()=>new g(m("gwiCDCBGHCCCcDCFJII",!0)),Khitan_Small_Script:()=>new g(m("k-7C84G84GB0OBqBAB",!1)),Khmer:()=>new g(m("g8F9CDJHJnPf",!0)),Khojki:()=>new g(m("gwkCRCuB",!0)),Khudawadi:()=>new g(m("w1kC6BGJ",!0)),Kirat_Rai:()=>new g(m("gq7C5B",!0)),Lao:()=>new g(m("h0DBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDB",!1)),Latin:()=>new g(m("hCZBHZBwBQQGWBCeBCgOBoBEB8wGlBBHwBBGDBGMBClCBiC-HByLOORMBuEBBHccSoBB42CfBj1elDBExCBVOBxZqBBCIBCDB38TGB7gBZBHZBmhCFBCpBBCIBm61BeBHFB",!1)),Lepcha:()=>new g(m("ggH3BEOEC",!0)),Limbu:()=>new g(m("goGeBCLBFLBFEEBKB",!1)),Linear_A:()=>new g(m("gwhC2JKVLH",!0)),Linear_B:()=>new g(m("gggCLCZCSCBCODNjB6D",!0)),Lisu:()=>new g(m("wmpBvBx1eA",!0)),Lycian:()=>new g(m("g0gCc",!0)),Lydian:()=>new g(m("gpiCZGA",!0)),Mahajani:()=>new g(m("wqkCmB",!0)),Makasar:()=>new g(m("g3nCY",!0)),Malayalam:()=>new g(m("goDMCCCyBCCCFFPDZ",!0)),Mandaic:()=>new g(m("giCbDA",!0)),Manichaean:()=>new g(m("g2iCmBFL",!0)),Marchen:()=>new g(m("wjnCfDVCN",!0)),Masaram_Gondi:()=>new g(m("gonCGBCBBCrBBECCBCCBHBJJB",!1)),Medefaidrin:()=>new g(m("gy7C6C",!0)),Meetei_Mayek:()=>new g(m("g3qBWqGtBDJ",!0)),Mende_Kikakui:()=>new g(m("gg6DkGDP",!0)),Meroitic_Cursive:()=>new g(m("gtiCXFTDtB",!0)),Meroitic_Hieroglyphs:()=>new g(m("gsiCf",!0)),Miao:()=>new g(m("g47CqCF4BIQ",!0)),Modi:()=>new g(m("gwlCkCMJ",!0)),Mongolian:()=>new g(m("ggGBBDCCBSBH4CBIqBB2t-BMB",!1)),Mro:()=>new g(m("gy6CeCJFB",!0)),Multani:()=>new g(m("g0kCGBCCCBCBCOBCKB",!1)),Myanmar:()=>new g(m("ggE-EhqmBeiDfxibT",!0)),Nabataean:()=>new g(m("gkiCeJI",!0)),Nag_Mundari:()=>new g(m("wm5DpB",!0)),Nandinagari:()=>new g(m("gtmCHDtBDK",!0)),New_Tai_Lue:()=>new g(m("gsGrBFZHKEB",!0)),Newa:()=>new g(m("gglC7CCE",!0)),Nko:()=>new g(m("g+B6BDC",!0)),Nushu:()=>new g(m("h-7CvsQvsQBqMB",!1)),Nyiakeng_Puachue_Hmong:()=>new g(m("go4DsBENDJFB",!0)),Ogham:()=>new g(m("g0Fc",!0)),Ol_Chiki:()=>new g(m("wiHvB",!0)),Ol_Onal:()=>new g(m("wu5DqBFA",!0)),Old_Hungarian:()=>new g(m("gkjCyBOyBIF",!0)),Old_Italic:()=>new g(m("g4gCjBKC",!0)),Old_North_Arabian:()=>new g(m("g0iCf",!0)),Old_Permic:()=>new g(m("w6gCqB",!0)),Old_Persian:()=>new g(m("g9gCjBFN",!0)),Old_Sogdian:()=>new g(m("g4jCnB",!0)),Old_South_Arabian:()=>new g(m("gziCf",!0)),Old_Turkic:()=>new g(m("ggjCoC",!0)),Old_Uyghur:()=>new g(m("w7jCZ",!0)),Oriya:()=>new g(m("h4CCCHDBDVCGCBCEDIDBDCICFBCEDR",!0)),Osage:()=>new g(m("wlhCjBFjB",!0)),Osmanya:()=>new g(m("gkhCdDJ",!0)),Pahawh_Hmong:()=>new g(m("g46ClCLJCGCUGS",!0)),Palmyrene:()=>new g(m("gjiCf",!0)),Pau_Cin_Hau:()=>new g(m("g2mC4B",!0)),Phags_Pa:()=>new g(m("giqB3B",!0)),Phoenician:()=>new g(m("goiCbEA",!0)),Psalter_Pahlavi:()=>new g(m("g8iCRIDNG",!0)),Rejang:()=>new g(m("wpqBjBMA",!0)),Runic:()=>new g(m("g1FqCEK",!0)),Samaritan:()=>new g(m("ggCtBDO",!0)),Saurashtra:()=>new g(m("gkqBlCJL",!0)),Sharada:()=>new g(m("gskC-ChsCH",!0)),Shavian:()=>new g(m("wihCvB",!0)),Siddham:()=>new g(m("gslC1BDlB",!0)),Sidetic:()=>new g(m("gqiCZ",!0)),SignWriting:()=>new g(m("gg2DrUQECO",!0)),Sinhala:()=>new g(m("hsDCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBt-gCTB",!1)),Sogdian:()=>new g(m("w5jCpB",!0)),Sora_Sompeng:()=>new g(m("wmkCYIJ",!0)),Soyombo:()=>new g(m("wymCyC",!0)),Sundanese:()=>new g(m("g8G-BhIH",!0)),Sunuwar:()=>new g(m("g+mChBPJ",!0)),Syloti_Nagri:()=>new g(m("ggqBsB",!0)),Syriac:()=>new g(m("g4BNC7BDCxIK",!0)),Tagalog:()=>new g(m("g4FVKA",!0)),Tagbanwa:()=>new g(m("g7FMCCCB",!0)),Tai_Le:()=>new g(m("wqGdDE",!0)),Tai_Tham:()=>new g(m("gxG+BCcDKHJHN",!0)),Tai_Viet:()=>new g(m("g0qBiCZE",!0)),Tai_Yo:()=>new g(m("g25DeCVJB",!0)),Takri:()=>new g(m("g0lC5BHJ",!0)),Tamil:()=>new g(m("i8CBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBm+kCxBBOAB",!1)),Tangsa:()=>new g(m("wz6CuCCJ",!0)),Tangut:()=>new g(m("g-7CgBgBB+3GBhQeBiDyDB",!1)),Telugu:()=>new g(m("ggDMCCCWCPDICCCDIBCCCBDDDJII",!0)),Thaana:()=>new g(m("g8BxB",!0)),Thai:()=>new g(m("hwD5BGb",!0)),Tibetan:()=>new g(m("g4DnCCjBFmBCjBCOCGFB",!0)),Tifinagh:()=>new g(m("wpL3BIBPA",!0)),Tirhuta:()=>new g(m("gklCnCJJ",!0)),Todhri:()=>new g(m("guhCzB",!0)),Tolong_Siki:()=>new g(m("wtnCrBFJ",!0)),Toto:()=>new g(m("w04De",!0)),Tulu_Tigalari:()=>new g(m("g8kCJBCDDClBBCJBCDDCDBCJBCBBJBB",!1)),Ugaritic:()=>new g(m("g8gCdCA",!0)),Unknown:()=>new g(m("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-FB",!1)),Vai:()=>new g(m("gopBrJ",!0)),Vithkuqi:()=>new g(m("wrhCKCOCGCBCKCOCGCB",!0)),Wancho:()=>new g(m("g24D5BGA",!0)),Warang_Citi:()=>new g(m("glmCyCNA",!0)),Yezidi:()=>new g(m("g0jCpBCCDB",!0)),Yi:()=>new g(m("ggoBskBE2B",!0)),Zanabazar_Square:()=>new g(m("gwmCnC",!0))})),j(Hn,"FOLD_CATEGORIES",new ha({L:()=>new g(m("laA",!0)),LC:()=>new g(m("laA",!0)),Ll:()=>new g(m("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGC3HrBrBCEEJHHCCBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHxC9zC9zCBuBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Lt:()=>new g(m("kOCCBCCBCClBCCtsHHBJHBJHBMQQwBAB",!1)),Lu:()=>new g(m("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpL2B2Bs1CvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1)),M:()=>new g(m("5cgBgBlgHAB",!1)),Mn:()=>new g(m("5cgBgBlgHAB",!1)),Emoji:()=>new g(m("8mJA",!0)),Extended_Pictographic:()=>new g(m("8mJA",!0)),Lowercase:()=>new g(m("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHuBPBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Math:()=>new g(m("ycGDCHHFMMDDDCHHFAB",!1)),Uppercase:()=>new g(m("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpLiBiBBOBFsasaBYBn6BvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1))})),j(Hn,"FOLD_SCRIPT",new ha({Common:()=>new g(m("8cgBgB",!1)),Greek:()=>new g(m("1FwUwU",!1)),Inherited:()=>new g(m("5cgBgBlgHAB",!1))})),Hn),we,$=(we=class{static is32(e,t){let n=0,s=e.length;for(;n<s;){const i=n+Math.floor((s-n)/2),o=e.getLo(i),a=e.getHi(i);if(o<=t&&t<=a){const B=e.getStride(i);return(t-o)%B===0}t<o?s=i:n=i+1}return!1}static is(e,t){if(t<=we.MAX_LATIN1){for(let n=0;n<e.length;n++){if(t>e.getHi(n))continue;const s=e.getLo(n);if(t<s)return!1;const i=e.getStride(n);return(t-s)%i===0}return!1}return e.length>0&&t>=e.getLo(0)&&we.is32(e,t)}static isUpper(e){if(e<=we.MAX_LATIN1){const t=String.fromCodePoint(e);return t.toUpperCase()===t&&t.toLowerCase()!==t}return we.is(Ct.Upper,e)}static isPrint(e){return e<=we.MAX_LATIN1?e>=32&&e<we.MAX_ASCII||e>=161&&e!==173:we.is(Ct.Print,e)}static simpleFold(e){if(Ct.CASE_ORBIT.has(e))return Ct.CASE_ORBIT.get(e);const t=O.toLowerCase(e);return t!==e?t:O.toUpperCase(e)}static equalsIgnoreCase(e,t){if(e===t)return!0;if(e<0||t<0)return!1;if(e<=we.MAX_ASCII&&t<=we.MAX_ASCII)return 65<=e&&e<=90&&(e|=32),65<=t&&t<=90&&(t|=32),e===t;for(let n=we.simpleFold(e);n!==e;n=we.simpleFold(n))if(n===t)return!0;return!1}},j(we,"MAX_RUNE",1114111),j(we,"MAX_ASCII",127),j(we,"MAX_LATIN1",255),j(we,"MAX_BMP",65535),j(we,"MIN_FOLD",65),j(we,"MAX_FOLD",125251),j(we,"MIN_HIGH_SURROGATE",55296),j(we,"MAX_HIGH_SURROGATE",56319),j(we,"MIN_LOW_SURROGATE",56320),j(we,"MAX_LOW_SURROGATE",57343),j(we,"MIN_SUPPLEMENTARY_CODE_POINT",65536),we);const el=256,fg=new Uint8Array(el);for(let r=0;r<el;r++)fg[r]=97<=r&&r<=122||65<=r&&r<=90||48<=r&&r<=57||r===95?1:0;let OB=null,FB=null;var Pe,X=(Pe=class{static emptyInts(){return[]}static isByteArray(e){return Array.isArray(e)||e instanceof Uint8Array}static isalnum(e){return O.CODES.get("0")<=e&&e<=O.CODES.get("9")||O.CODES.get("a")<=e&&e<=O.CODES.get("z")||O.CODES.get("A")<=e&&e<=O.CODES.get("Z")}static unhex(e){return O.CODES.get("0")<=e&&e<=O.CODES.get("9")?e-O.CODES.get("0"):O.CODES.get("a")<=e&&e<=O.CODES.get("f")?e-O.CODES.get("a")+10:O.CODES.get("A")<=e&&e<=O.CODES.get("F")?e-O.CODES.get("A")+10:-1}static escapeRune(e){let t="";if($.isPrint(e))Pe.METACHARACTERS.indexOf(String.fromCodePoint(e))>=0&&(t+="\\"),t+=String.fromCodePoint(e);else switch(e){case O.CODES.get('"'):t+='\\"';break;case O.CODES.get("\\"):t+="\\\\";break;case O.CODES.get("	"):t+="\\t";break;case O.CODES.get(`
`):t+="\\n";break;case O.CODES.get("\r"):t+="\\r";break;case O.CODES.get("\b"):t+="\\b";break;case O.CODES.get("\f"):t+="\\f";break;default:{let n=e.toString(16);e<256?(t+="\\x",n.length===1&&(t+="0"),t+=n):t+=`\\x{${n}}`;break}}return t}static stringToRunes(e){const t=String(e),n=[];let s=0;for(;s<t.length;){const i=t.codePointAt(s);n.push(i),s+=i>$.MAX_BMP?2:1}return n}static runeToString(e){return String.fromCodePoint(e)}static isWordRune(e){return e<el?fg[e]===1:!1}static emptyOpContext(e,t){let n=0;return e<0&&(n|=Pe.EMPTY_BEGIN_TEXT|Pe.EMPTY_BEGIN_LINE),e===10&&(n|=Pe.EMPTY_BEGIN_LINE),t<0&&(n|=Pe.EMPTY_END_TEXT|Pe.EMPTY_END_LINE),t===10&&(n|=Pe.EMPTY_END_LINE),Pe.isWordRune(e)!==Pe.isWordRune(t)?n|=Pe.EMPTY_WORD_BOUNDARY:n|=Pe.EMPTY_NO_WORD_BOUNDARY,n}static quoteMeta(e){return e.split("").map(t=>Pe.METACHARACTERS.indexOf(t)>=0?`\\${t}`:t).join("")}static charCount(e){return e>$.MAX_BMP?2:1}static toArray(e){const t=e.length,n=new Array(t);for(let s=0;s<t;s++)n[s]=e[s];return n}static stringToUtf8ByteArray(e){if(globalThis.TextEncoder)return OB||(OB=new TextEncoder),OB.encode(e);{let t=[],n=0;for(let s=0;s<e.length;s++){let i=e.charCodeAt(s);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=i&63|128):(i&64512)===$.MIN_HIGH_SURROGATE&&s+1<e.length&&(e.charCodeAt(s+1)&64512)===$.MIN_LOW_SURROGATE?(i=$.MIN_SUPPLEMENTARY_CODE_POINT+((i&1023)<<10)+(e.charCodeAt(++s)&1023),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=i&63|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=i&63|128)}return t}}static utf8ByteArrayToString(e){if(globalThis.TextDecoder){FB||(FB=new TextDecoder("utf-8"));const t=e instanceof Uint8Array?e:new Uint8Array(e);return FB.decode(t)}else{let t=[],n=0,s=0;for(;n<e.length;){let i=e[n++];if(i<128)t[s++]=String.fromCharCode(i);else if(i>191&&i<224){let o=e[n++];t[s++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=e[n++],a=e[n++],B=e[n++],c=((i&7)<<18|(o&63)<<12|(a&63)<<6|B&63)-$.MIN_SUPPLEMENTARY_CODE_POINT;t[s++]=String.fromCharCode($.MIN_HIGH_SURROGATE+(c>>10)),t[s++]=String.fromCharCode($.MIN_LOW_SURROGATE+(c&1023))}else{let o=e[n++],a=e[n++];t[s++]=String.fromCharCode((i&15)<<12|(o&63)<<6|a&63)}}return t.join("")}}},j(Pe,"METACHARACTERS","\\.+*?()|[]{}^$"),j(Pe,"EMPTY_BEGIN_LINE",1),j(Pe,"EMPTY_END_LINE",2),j(Pe,"EMPTY_BEGIN_TEXT",4),j(Pe,"EMPTY_END_TEXT",8),j(Pe,"EMPTY_WORD_BOUNDARY",16),j(Pe,"EMPTY_NO_WORD_BOUNDARY",32),j(Pe,"EMPTY_ALL",-1),Pe);const dg=(r=[],e=0)=>{const t=Object.create(null);for(let n=0;n<r.length;n++){const s=r[n],i=e+n;t[s]=i,t[i]=s}return Object.freeze(t)};var Wn,Jr=(Wn=class{getEncoding(){throw Error("not implemented")}asCharSequence(){throw Error("not implemented")}asBytes(){throw Error("not implemented")}length(){throw Error("not implemented")}isUTF8Encoding(){return this.getEncoding()===Wn.Encoding.UTF_8}isUTF16Encoding(){return this.getEncoding()===Wn.Encoding.UTF_16}},j(Wn,"Encoding",dg(["UTF_16","UTF_8"])),Wn),ed=class extends Jr{constructor(r=null){super(),this.bytes=r}getEncoding(){return Jr.Encoding.UTF_8}asCharSequence(){return X.utf8ByteArrayToString(this.bytes)}asBytes(){return this.bytes}length(){return this.bytes.length}},Uw=class extends Jr{constructor(r=null){super(),this.charSequence=r}getEncoding(){return Jr.Encoding.UTF_16}asCharSequence(){return this.charSequence}asBytes(){return X.stringToUtf8ByteArray(this.charSequence.toString())}length(){return this.charSequence.length}},Or=class{static utf16(r){return new Uw(r)}static utf8(r){return X.isByteArray(r)?new ed(r):new ed(X.stringToUtf8ByteArray(r))}},ct=class{static EOF(){return-8}constructor(){this.end=0}canCheckPrefix(){return!0}endPos(){return this.end}hasString(){return!1}hasAnyString(){return!1}prefixLength(){return 0}},jw=class extends ct{constructor(r,e=0,t=r.length){super(),this.bytes=r,this.start=e,this.end=t}hasString(r,e){const t=r.bytes;if(t.length===0)return!0;const n=this.indexOf(this.bytes,t,this.start+e);return n!==-1&&n<=this.end-t.length}hasAnyString(r,e){return r.ac8?r.ac8.searchUTF8(this.bytes,this.start+e,this.end):!1}step(r){if(r+=this.start,r>=this.end)return ct.EOF();const e=this.bytes[r]&255;if(e<128)return e<<3|1;if(e>=194&&e<=223&&r+1<this.end){const t=this.bytes[r+1]&255;return(t&192)!==128?e<<3|1:((e&31)<<6|t&63)<<3|2}else if(e>=224&&e<=239&&r+2<this.end){const t=this.bytes[r+1]&255;if((t&192)!==128)return e<<3|1;const n=this.bytes[r+2]&255;return(n&192)!==128?e<<3|1:((e&15)<<12|(t&63)<<6|n&63)<<3|3}else if(e>=240&&e<=244&&r+3<this.end){const t=this.bytes[r+1]&255;if((t&192)!==128)return e<<3|1;const n=this.bytes[r+2]&255;if((n&192)!==128)return e<<3|1;const s=this.bytes[r+3]&255;return(s&192)!==128?e<<3|1:((e&7)<<18|(t&63)<<12|(n&63)<<6|s&63)<<3|4}else return e<<3|1}index(r,e){e+=this.start;const t=this.indexOf(this.bytes,r.prefixUTF8,e);return t<0?t:t-e}context(r){r+=this.start;let e=-1;if(r>this.start&&r<=this.end){let n=r-1;if(e=this.bytes[n--],e>=128){let s=r-4;for(s<this.start&&(s=this.start);n>=s&&(this.bytes[n]&192)===128;)n--;n<this.start&&(n=this.start),e=this.step(n-this.start)>>3}}const t=r<this.end?this.step(r-this.start)>>3:-1;return X.emptyOpContext(e,t)}indexOf(r,e,t=0){let n=e.length;if(n===0)return t<=this.end?t:-1;const s=e[0];let i=this.end-n;const o=typeof r.indexOf=="function";let a=t;for(;a<=i;){if(o){if(a=r.indexOf(s,a),a===-1||a>i)return-1}else{for(;a<=i&&r[a]!==s;)a++;if(a>i)return-1}let B=!0;for(let c=1;c<n;c++)if(r[a+c]!==e[c]){B=!1;break}if(B)return a;a++}return-1}prefixLength(r){return r.prefixUTF8.length}},qw=class extends ct{constructor(r,e=0,t=r.length){super(),this.charSequence=r,this.start=e,this.end=t}hasString(r,e){const t=this.charSequence.indexOf(r.str,this.start+e);return t!==-1&&t<=this.end-r.str.length}hasAnyString(r,e){return r.ac16?r.ac16.searchUTF16(this.charSequence,this.start+e,this.end):!1}step(r){if(r+=this.start,r>=this.end)return ct.EOF();const e=this.charSequence.charCodeAt(r);if(e<$.MIN_HIGH_SURROGATE||e>$.MAX_HIGH_SURROGATE||r+1>=this.end)return e<<3|1;const t=this.charSequence.charCodeAt(r+1);return t>=$.MIN_LOW_SURROGATE&&t<=$.MAX_LOW_SURROGATE?(e-$.MIN_HIGH_SURROGATE)*1024+(t-$.MIN_LOW_SURROGATE)+$.MIN_SUPPLEMENTARY_CODE_POINT<<3|2:e<<3|1}index(r,e){e+=this.start;const t=this.charSequence.indexOf(r.prefix,e);return t<0||t>this.end-r.prefix.length?-1:t-e}context(r){r+=this.start;const e=r>this.start&&r<=this.end?this.charSequence.charCodeAt(r-1):-1,t=r<this.end?this.charSequence.charCodeAt(r):-1;return X.emptyOpContext(e,t)}prefixLength(r){return r.prefix.length}},Se=class{static fromUTF8(r,e=0,t=r.length){return new jw(r,e,t)}static fromUTF16(r,e=0,t=r.length){return new qw(r,e,t)}},bo=class extends Error{constructor(r){super(r),this.name="RE2JSException"}},Ae=class extends bo{constructor(r,e=null){let t=`error parsing regexp: ${r}`;e&&(t+=`: \`${e}\``),super(t),this.name="RE2JSSyntaxException",this.message=t,this.error=r,this.input=e}getDescription(){return this.error}getPattern(){return this.input}},Kw=class extends bo{constructor(r){super(r),this.name="RE2JSCompileException"}},dt=class extends bo{constructor(r){super(r),this.name="RE2JSGroupException"}},Jw=class extends bo{constructor(r){super(r),this.name="RE2JSFlagsException"}},Hi=class extends bo{constructor(r){super(r),this.name="RE2JSInternalException"}},kr,td=(kr=class{static quoteReplacement(e,t=!1){return t?e.indexOf("\\")<0&&e.indexOf("$")<0?e:e.split("").map(n=>{const s=n.codePointAt(0);return s===O.CODES.get("\\")||s===O.CODES.get("$")?`\\${n}`:n}).join(""):e.indexOf("$")<0?e:e.split("").map(n=>n.codePointAt(0)===O.CODES.get("$")?"$$":n).join("")}constructor(e,t){if(e===null)throw new Error("pattern is null");this.patternInput=e;const n=this.patternInput.re2();this.patternGroupCount=n.numberOfCapturingGroups(),this.groups=[],this.namedGroups=n.namedGroups,this.numberOfInstructions=n.numberOfInstructions(),t instanceof Jr?this.resetMatcherInput(t):X.isByteArray(t)?this.resetMatcherInput(Or.utf8(t)):this.resetMatcherInput(Or.utf16(t))}pattern(){return this.patternInput}reset(){return this.matcherInputLength=this.matcherInput.length(),this.appendPos=0,this.hasMatch=!1,this.hasGroups=!1,this.anchorFlag=0,this}resetMatcherInput(e){if(e===null)throw new Error("input is null");return e instanceof Jr||(X.isByteArray(e)?e=Or.utf8(e):e=Or.utf16(e)),this.matcherInput=e,this.reset(),this}start(e=0){if(typeof e=="string"){const t=this.namedGroups[e];if(!Number.isFinite(t))throw new dt(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e]}end(e=0){if(typeof e=="string"){const t=this.namedGroups[e];if(!Number.isFinite(t))throw new dt(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e+1]}programSize(){return this.numberOfInstructions}group(e=0){if(typeof e=="string"){const s=this.namedGroups[e];if(!Number.isFinite(s))throw new dt(`group '${e}' not found`);e=s}const t=this.start(e),n=this.end(e);return t<0&&n<0?null:this.substring(t,n)}getNamedGroups(){if(!this.hasMatch)throw new dt("perhaps no match attempted");const e=Object.create(null);for(const t of Object.keys(this.namedGroups))e[t]=this.group(t);return e}groupCount(){return this.patternGroupCount}loadGroup(e){if(e<0||e>this.patternGroupCount)throw new dt(`Group index out of bounds: ${e}`);if(!this.hasMatch)throw new dt("perhaps no match attempted");if(e===0||this.hasGroups)return;const t=this.matcherInputLength,n=this.patternInput.re2().matchMachineInput(this.matcherInput,this.groups[0],t,this.anchorFlag,1+this.patternGroupCount);if(!n[0])throw new dt("inconsistency in matching group data");this.groups=n[1],this.hasGroups=!0}matches(){return this.genMatch(0,V.ANCHOR_BOTH)}lookingAt(){return this.genMatch(0,V.ANCHOR_START)}find(e=null){if(e!==null){if(e<0||e>this.matcherInputLength)throw new dt(`start index out of bounds: ${e}`);return this.reset(),this.genMatch(e,0)}if(e=0,this.hasMatch&&(e=this.groups[1],this.groups[0]===this.groups[1])){const t=(this.matcherInput.isUTF16Encoding()?Se.fromUTF16(this.matcherInput.asCharSequence(),0,this.matcherInputLength):Se.fromUTF8(this.matcherInput.asBytes(),0,this.matcherInputLength)).step(e);t<0?e++:e+=t&7}return this.genMatch(e,V.UNANCHORED)}genMatch(e,t){const n=this.patternInput.re2().matchMachineInput(this.matcherInput,e,this.matcherInputLength,t,1);return n[0]?(this.groups=n[1],this.hasMatch=!0,this.hasGroups=this.patternGroupCount===0,this.anchorFlag=t,!0):(this.hasMatch=!1,!1)}substring(e,t){return this.matcherInput.isUTF8Encoding()?X.utf8ByteArrayToString(this.matcherInput.asBytes().slice(e,t)):this.matcherInput.asCharSequence().substring(e,t).toString()}inputLength(){return this.matcherInputLength}appendReplacement(e,t=!1){let n="";const s=this.start(),i=this.end();return this.appendPos<s&&(n+=this.substring(this.appendPos,s)),this.appendPos=i,n+=t?this.appendReplacementInternalJava(e):this.appendReplacementInternalJs(e),n}appendReplacementInternalJava(e){let t="",n=0;const s=e.length;let i=0;for(;i<s;){const o=e.codePointAt(i);if(o===O.CODES.get("\\")){if(n<i&&(t+=e.substring(n,i)),i++,i>=s)throw new dt("character to be escaped is missing");n=i,i++;continue}if(o===O.CODES.get("$")){if(n<i&&(t+=e.substring(n,i)),i+1>=s)throw new dt("Illegal group reference: group index is missing");const a=e.codePointAt(i+1);if(O.CODES.get("0")<=a&&a<=O.CODES.get("9")){let B=a-O.CODES.get("0"),c=i+2;for(;c<s;c++){const f=e.codePointAt(c);if(f<O.CODES.get("0")||f>O.CODES.get("9")||B*10+f-O.CODES.get("0")>this.patternGroupCount)break;B=B*10+f-O.CODES.get("0")}if(B>this.patternGroupCount)throw new dt(`n > number of groups: ${B}`);const h=this.group(B);h!==null&&(t+=h),i=c,n=i}else if(a===O.CODES.get("{")){let B=i+2;for(;B<s&&e.codePointAt(B)!==O.CODES.get("}");)B++;if(B>=s)throw new dt("named capture group is missing trailing '}'");const c=e.substring(i+2,B),h=this.group(c);h!==null&&(t+=h),i=B+1,n=i}else throw new dt("Illegal group reference");continue}i++}return n<s&&(t+=e.substring(n,s)),t}appendReplacementInternalJs(e){let t="",n=0;const s=e.length;for(let i=0;i<s-1;i++)if(e.codePointAt(i)===O.CODES.get("$")){let o=e.codePointAt(i+1);if(O.CODES.get("$")===o){n<i&&(t+=e.substring(n,i)),t+="$",i++,n=i+1;continue}else if(O.CODES.get("&")===o){n<i&&(t+=e.substring(n,i));const a=this.group(0);a!==null?t+=a:t+="$&",i++,n=i+1;continue}else if(O.CODES.get("`")===o){n<i&&(t+=e.substring(n,i)),t+=this.substring(0,this.start(0)),i++,n=i+1;continue}else if(O.CODES.get("'")===o){n<i&&(t+=e.substring(n,i)),t+=this.substring(this.end(0),this.matcherInputLength),i++,n=i+1;continue}else if(O.CODES.get("1")<=o&&o<=O.CODES.get("9")){let a=o-O.CODES.get("0");for(n<i&&(t+=e.substring(n,i)),i+=2;i<s&&(o=e.codePointAt(i),!(o<O.CODES.get("0")||o>O.CODES.get("9")||a*10+o-O.CODES.get("0")>this.patternGroupCount));i++)a=a*10+o-O.CODES.get("0");if(a>this.patternGroupCount){t+=`$${a}`,n=i,i--;continue}const B=this.group(a);B!==null&&(t+=B),n=i,i--;continue}else if(o===O.CODES.get("<")){n<i&&(t+=e.substring(n,i)),i++;let a=i+1;for(;a<e.length&&e.codePointAt(a)!==O.CODES.get(">")&&e.codePointAt(a)!==O.CODES.get(" ");)a++;if(a===e.length||e.codePointAt(a)!==O.CODES.get(">")){t+=e.substring(i-1,a+1),n=a+1,i=a;continue}const B=e.substring(i+1,a);if(Object.prototype.hasOwnProperty.call(this.namedGroups,B)){const c=this.group(B);c!==null&&(t+=c)}else t+=`$<${B}>`;n=a+1,i=a;continue}}return n<s&&(t+=e.substring(n,s)),t}appendTail(){return this.substring(this.appendPos,this.matcherInputLength)}replaceAll(e,t=!1){return this.replace(e,!0,t)}replaceFirst(e,t=!1){return this.replace(e,!1,t)}replace(e,t=!0,n=!1){let s="";this.reset();const i=typeof e=="function",o=Object.keys(this.namedGroups).length>0;let a=null;if(i){if(this.groupCount()>=kr.MAX_REPLACER_ARGS)throw new dt("Too many capture groups to safely invoke replacer function");a=this.matcherInput.isUTF8Encoding()?this.matcherInput.asBytes():this.matcherInput.asCharSequence()}for(;this.find()&&(s+=i?this.appendReplacementFunc(e,o,a):this.appendReplacement(e,n),!!t););return s+=this.appendTail(),s}appendReplacementFunc(e,t,n){let s="";const i=this.start(),o=this.end();this.appendPos<i&&(s+=this.substring(this.appendPos,i)),this.appendPos=o;const a=this.buildReplacerArgs(i,t,n);return s+=String(e(...a)),s}buildReplacerArgs(e,t,n){const s=[this.group(0)],i=this.groupCount();for(let o=1;o<=i;o++){const a=this.start(o);a<0?s.push(void 0):s.push(this.substring(a,this.end(o)))}if(s.push(e),s.push(n),t){const o=this.getNamedGroups();for(const a in o)o[a]===null&&(o[a]=void 0);s.push(o)}return s}},j(kr,"MAX_REPLACER_ARGS",65535),kr),fe,x=(fe=class{static isRuneOp(e){return fe.RUNE<=e&&e<=fe.RUNE_ANY_NOT_NL}static escapeRunes(e){let t='"';for(let n of e)t+=X.escapeRune(n);return t+='"',t}constructor(e){this.op=e,this.out=0,this.arg=0,this.runes=[],this.next=null}matchRune(e){if(this.runes.length===1){const o=this.runes[0];return(this.arg&V.FOLD_CASE)!==0?$.equalsIgnoreCase(o,e):e===o}const t=this.runes.length;if(t===0)return!1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return!1;if(e<=this.runes[o+1])return!0}return!1}let n=0,s=t>>1;for(;s>1;){const o=s>>1;n+=this.runes[n+o<<1]<=e?o:0,s-=o}n+=this.runes[n<<1]<=e?1:0;const i=n-1;return i>=0&&e<=this.runes[i<<1|1]}matchRunePos(e){if(this.runes.length===1){const o=this.runes[0];return(this.arg&V.FOLD_CASE)!==0?$.equalsIgnoreCase(o,e)?0:-1:e===o?0:-1}const t=this.runes.length;if(t===0)return-1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return-1;if(e<=this.runes[o+1])return Math.floor(o/2)}return-1}let n=0,s=t>>1;for(;s>1;){const o=s>>1;n+=this.runes[n+o<<1]<=e?o:0,s-=o}n+=this.runes[n<<1]<=e?1:0;const i=n-1;return i>=0&&e<=this.runes[i<<1|1]?i:-1}toString(){switch(this.op){case fe.ALT:return`alt -> ${this.out}, ${this.arg}`;case fe.ALT_MATCH:return`altmatch -> ${this.out}, ${this.arg}`;case fe.CAPTURE:return`cap ${this.arg} -> ${this.out}`;case fe.EMPTY_WIDTH:return`empty ${this.arg} -> ${this.out}`;case fe.MATCH:return`match${this.arg!==0?` ${this.arg}`:""}`;case fe.FAIL:return"fail";case fe.NOP:return`nop -> ${this.out}`;case fe.LB_WRITE:return`lbwrite ${this.arg} -> ${this.out}`;case fe.LB_CHECK:return`lbcheck ${this.arg} -> ${this.out}`;case fe.RUNE:return this.runes===null?"rune <null>":["rune ",fe.escapeRunes(this.runes),(this.arg&V.FOLD_CASE)!==0?"/i":""," -> ",this.out].join("");case fe.RUNE1:return`rune1 ${fe.escapeRunes(this.runes)} -> ${this.out}`;case fe.RUNE_ANY:return`any -> ${this.out}`;case fe.RUNE_ANY_NOT_NL:return`anynotnl -> ${this.out}`;default:throw new Error("unhandled case in Inst.toString")}}},j(fe,"ALT",1),j(fe,"ALT_MATCH",2),j(fe,"CAPTURE",3),j(fe,"EMPTY_WIDTH",4),j(fe,"FAIL",5),j(fe,"MATCH",6),j(fe,"NOP",7),j(fe,"RUNE",8),j(fe,"RUNE1",9),j(fe,"RUNE_ANY",10),j(fe,"RUNE_ANY_NOT_NL",11),j(fe,"LB_WRITE",12),j(fe,"LB_CHECK",13),fe),nd=class{constructor(r){this.sparse=new Int32Array(r),this.densePcs=new Int32Array(r),this.denseCaps=null,this.size=0,this.ncap=0}init(r){this.ncap=r;const e=this.densePcs.length*r;(!this.denseCaps||this.denseCaps.length<e)&&(this.denseCaps=new Int32Array(e))}contains(r){const e=this.sparse[r];return e<this.size&&this.densePcs[e]===r}isEmpty(){return this.size===0}add(r){const e=this.size++;return this.sparse[r]=e,this.densePcs[e]=r,e}clear(){this.size=0}toString(){let r="{";for(let e=0;e<this.size;e++)e!==0&&(r+=", "),r+=this.densePcs[e];return r+="}",r}},zw=class Bc{static fromRE2(e){const t=new Bc;return t.prog=e.prog,t.re2=e,t.q0=new nd(t.prog.numInst()),t.q1=new nd(t.prog.numInst()),t.matched=!1,t.matchcap=new Int32Array(t.prog.numCap<2?2:t.prog.numCap),t.ncap=0,t}static fromMachine(e){return Bc.fromRE2(e.re2)}constructor(){this.prog=null,this.re2=null,this.q0=null,this.q1=null,this.matched=!1,this.matchcap=null,this.ncap=0,this.lbTable=null}init(e){this.ncap=e,e>this.matchcap.length?this.matchcap=new Int32Array(e).fill(-1):this.matchcap.fill(-1),this.q0.init(e),this.q1.init(e),this.prog.numLb>0&&((!this.lbTable||this.lbTable.length<this.prog.numLb+1)&&(this.lbTable=new Int32Array(this.prog.numLb+1)),this.lbTable.fill(-1))}submatches(){return this.ncap===0?X.emptyInts():X.toArray(this.matchcap.subarray(0,this.ncap))}match(e,t,n){const s=this.re2.cond;if(s===X.EMPTY_ALL||(n===V.ANCHOR_START||n===V.ANCHOR_BOTH)&&t!==0)return!1;this.matched=!1,this.matchcap.fill(-1);let i=this.prog.numLb>0?0:t,o=t,a=this.q0,B=this.q1,c=e.step(i),h=c>>3,f=c&7,C=-1,_=0;c!==ct.EOF()&&(c=e.step(i+f),C=c>>3,_=c&7);let R;for(i===0?R=X.emptyOpContext(-1,h):R=e.context(i);;){if(a.isEmpty()){if((s&X.EMPTY_BEGIN_TEXT)!==0&&i!==0||(n===V.ANCHOR_START||n===V.ANCHOR_BOTH)&&i!==0||this.matched)break;if(this.prog.numLb===0&&this.re2.prefix.length!==0&&C!==this.re2.prefixRune&&e.canCheckPrefix()){const Q=e.index(this.re2,i);if(Q<0)break;i+=Q,c=e.step(i),h=c>>3,f=c&7,c=e.step(i+f),C=c>>3,_=c&7,R=e.context(i)}}if(i===0&&this.prog.numLb>0)for(let Q=0;Q<this.prog.lbStarts.length;Q++)this.add(a,this.prog.lbStarts[Q],i,this.matchcap,0,R);!this.matched&&(i===0||n===V.UNANCHORED)&&i>=o&&(this.ncap>0&&(this.matchcap[0]=i),this.add(a,this.prog.start,i,this.matchcap,0,R));const L=i+f;if(R=e.context(L),this.step(a,B,i,L,h,R,n,i===e.endPos()),f===0||this.ncap===0&&this.matched)break;i+=f,h=C,f=_,h!==-1&&(c=e.step(i+f),C=c>>3,_=c&7);const G=a;a=B,B=G}return B.clear(),this.matched}matchSet(e,t,n){const s=this.re2.cond;if(s===X.EMPTY_ALL)return[];if((n===V.ANCHOR_START||n===V.ANCHOR_BOTH)&&t!==0)return[];let i=this.prog.numLb>0?0:t,o=t,a=this.q0,B=this.q1,c=e.step(i),h=c>>3,f=c&7,C=-1,_=0;c!==ct.EOF()&&(c=e.step(i+f),C=c>>3,_=c&7);let R=i===0?X.emptyOpContext(-1,h):e.context(i);const L=new Set;for(;!(a.isEmpty()&&((s&X.EMPTY_BEGIN_TEXT)!==0&&i!==0||(n===V.ANCHOR_START||n===V.ANCHOR_BOTH)&&i!==0));){if(i===0&&this.prog.numLb>0)for(let te=0;te<this.prog.lbStarts.length;te++)this.add(a,this.prog.lbStarts[te],i,this.matchcap,0,R);(i===0||n===V.UNANCHORED)&&i>=o&&this.add(a,this.prog.start,i,this.matchcap,0,R);const G=i+f;R=e.context(G);for(let te=0;te<a.size;te++){const se=a.densePcs[te],ge=this.prog.inst[se],he=te*this.ncap;let ue=!1;switch(ge.op){case x.MATCH:if(n===V.ANCHOR_BOTH&&i!==e.endPos())break;L.add(ge.arg);break;case x.RUNE:ue=ge.matchRune(h);break;case x.RUNE1:ue=h===ge.runes[0];break;case x.RUNE_ANY:ue=!0;break;case x.RUNE_ANY_NOT_NL:ue=h!==10;break;default:continue}ue&&this.add(B,ge.out,G,a.denseCaps,he,R)}if(a.clear(),f===0)break;i+=f,h=C,f=_,h!==-1&&(c=e.step(i+f),C=c>>3,_=c&7);const Q=a;a=B,B=Q}return B.clear(),Array.from(L).sort((G,Q)=>G-Q)}step(e,t,n,s,i,o,a,B){const c=this.re2.longest;for(let h=0;h<e.size;h++){const f=e.densePcs[h],C=h*this.ncap;if(c&&this.matched&&this.ncap>0&&this.matchcap[0]<e.denseCaps[C])continue;const _=this.prog.inst[f];let R=!1;switch(_.op){case x.MATCH:if(a===V.ANCHOR_BOTH&&!B)break;if(this.ncap>0&&(!c||!this.matched||this.matchcap[1]<n)){e.denseCaps[C+1]=n;for(let L=0;L<this.ncap;L++)this.matchcap[L]=e.denseCaps[C+L]}c||(e.size=0),this.matched=!0;break;case x.RUNE:R=_.matchRune(i);break;case x.RUNE1:R=i===_.runes[0];break;case x.RUNE_ANY:R=!0;break;case x.RUNE_ANY_NOT_NL:R=i!==10;break;default:continue}R&&this.add(t,_.out,s,e.denseCaps,C,o)}e.clear()}add(e,t,n,s,i,o){for(;;){if(t===0||e.contains(t))return;const a=e.add(t),B=this.prog.inst[t];switch(B.op){case x.FAIL:return;case x.ALT:case x.ALT_MATCH:this.add(e,B.out,n,s,i,o),t=B.arg;continue;case x.EMPTY_WIDTH:if((B.arg&~o)===0){t=B.out;continue}return;case x.NOP:t=B.out;continue;case x.CAPTURE:if(B.arg<this.ncap){const c=s[i+B.arg];s[i+B.arg]=n,this.add(e,B.out,n,s,i,o),s[i+B.arg]=c;return}else{t=B.out;continue}case x.LB_WRITE:this.lbTable[Math.abs(B.arg)]=n,t=B.out;continue;case x.LB_CHECK:if(B.arg>0){if(this.lbTable[B.arg]===n){t=B.out;continue}}else if(this.lbTable[-B.arg]!==n){t=B.out;continue}return;case x.MATCH:case x.RUNE:case x.RUNE1:case x.RUNE_ANY:case x.RUNE_ANY_NOT_NL:if(this.ncap>0){const c=a*this.ncap;for(let h=0;h<this.ncap;h++)e.denseCaps[c+h]=s[i+h]}return;default:throw new Hi("unhandled")}}}};const rd=r=>{let e=-2128831035;for(let t=0;t<r.length;t++)e^=r[t],e=Math.imul(e,16777619);return e},Qw=(r,e)=>{if(r.length!==e.length)return!1;for(let t=0;t<r.length;t++)if(r[t]!==e[t])return!1;return!0};var $w=class{constructor(r,e,t=[]){this.nfaStates=r,this.isMatch=e,this.matchIDs=t,this.nextLatin1=new Array($.MAX_LATIN1+1).fill(null),this.nextLatin1Anchored=new Array($.MAX_LATIN1+1).fill(null),this.transKeys=[],this.transVals=[],this.lastSeen=0}},ln,Ww=(ln=class{constructor(e,t=8388608){this.prog=e,this.stateCache=new Map,this.stateCount=0,this.startState=null,this.stateLimit=Math.max(1,Math.floor(t/ln.STATE_MEMORY_ESTIMATE)),this.cacheClears=0,this.failed=!1,this.clock=0}computeClosure(e){const t=new Set,n=[...e];let s=!1;const i=[];for(;n.length>0;){const a=n.pop();if(t.has(a))continue;t.add(a);const B=this.prog.getInst(a);switch(B.op){case x.MATCH:s=!0,i.includes(B.arg)||i.push(B.arg);break;case x.ALT:case x.ALT_MATCH:n.push(B.out),n.push(B.arg);break;case x.NOP:case x.CAPTURE:n.push(B.out);break;case x.EMPTY_WIDTH:case x.LB_WRITE:case x.LB_CHECK:return null}}const o=Int32Array.from(t).sort();return i.sort((a,B)=>a-B),{pcs:o,isMatch:s,matchIDs:i}}getState(e){const t=this.computeClosure(e);if(!t)return null;const n=t.pcs,s=rd(n);let i=this.stateCache.get(s);if(i)for(let a=0;a<i.length;a++){const B=i[a];if(Qw(B.nfaStates,n))return B.lastSeen=++this.clock,B}else i=[],this.stateCache.set(s,i);if(this.failed)return null;if(this.stateCount>=this.stateLimit){if(this.cacheClears++,this.cacheClears>=ln.MAX_CACHE_CLEARS)return this.failed=!0,this.stateCache.clear(),this.stateCount=0,this.startState=null,null;this.evictCache(),i=this.stateCache.get(s),i||(i=[],this.stateCache.set(s,i))}const o=new $w(n,t.isMatch,t.matchIDs);return o.lastSeen=++this.clock,i.push(o),this.stateCount++,o}evictCache(){const e=[];for(const o of this.stateCache.values())for(let a=0;a<o.length;a++)e.push(o[a]);e.sort((o,a)=>o.lastSeen-a.lastSeen);const t=Math.max(1,Math.floor(this.stateLimit/2)),n=e.length-t,s=e.slice(n),i=new Set(s);this.stateCache.clear(),this.stateCount=0;for(let o=0;o<s.length;o++){const a=s[o];a.nextLatin1.fill(null),a.nextLatin1Anchored.fill(null),a.transKeys.length=0,a.transVals.length=0;const B=rd(a.nfaStates);let c=this.stateCache.get(B);c||(c=[],this.stateCache.set(B,c)),c.push(a),this.stateCount++}this.startState&&!i.has(this.startState)&&(this.startState=null)}step(e,t,n){if(t<=$.MAX_LATIN1)if(n===V.UNANCHORED){const o=e.nextLatin1[t];if(o!==null)return o}else{const o=e.nextLatin1Anchored[t];if(o!==null)return o}else{const o=t+(n===V.UNANCHORED?0:$.MAX_RUNE+1),a=e.transKeys,B=a.length;for(let c=0;c<B;c++)if(a[c]===o)return e.transVals[c]}const s=[];for(let o=0;o<e.nfaStates.length;o++){const a=e.nfaStates[o],B=this.prog.getInst(a);x.isRuneOp(B.op)&&B.matchRune(t)&&s.push(B.out)}n===V.UNANCHORED&&s.push(this.prog.start);const i=this.getState(s);if(t<=$.MAX_LATIN1)n===V.UNANCHORED?e.nextLatin1[t]=i:e.nextLatin1Anchored[t]=i;else{const o=t+(n===V.UNANCHORED?0:$.MAX_RUNE+1);e.transKeys.push(o),e.transVals.push(i)}return i}match(e,t,n){if((n===V.ANCHOR_START||n===V.ANCHOR_BOTH)&&t!==0)return!1;if(!this.startState&&(this.startState=this.getState([this.prog.start]),!this.startState))return null;let s=e.endPos(),i=this.startState;if(i.isMatch)if(n===V.ANCHOR_BOTH){if(t===s)return!0}else return!0;let o=t;for(;o<s;){const a=e.step(o),B=a>>3,c=a&7;if(c===0)break;if(i=n===V.UNANCHORED&&B<=$.MAX_LATIN1&&i.nextLatin1[B]||this.step(i,B,n),i===null)return null;if(i.lastSeen=++this.clock,i.isMatch)if(n===V.ANCHOR_BOTH){if(o+c===s)return!0}else return!0;if(i.nfaStates.length===0&&n!==V.UNANCHORED)return!1;o+=c}return!1}matchSet(e,t,n){if((n===V.ANCHOR_START||n===V.ANCHOR_BOTH)&&t!==0)return[];if(!this.startState&&(this.startState=this.getState([this.prog.start]),!this.startState))return null;let s=e.endPos(),i=this.startState;const o=new Set,a=(c,h)=>{c.isMatch&&(n===V.ANCHOR_BOTH?h===s&&c.matchIDs.forEach(f=>o.add(f)):c.matchIDs.forEach(f=>o.add(f)))};a(i,t);let B=t;for(;B<s;){const c=e.step(B),h=c>>3,f=c&7;if(f===0)break;if(i=n===V.UNANCHORED&&h<=$.MAX_LATIN1&&i.nextLatin1[h]||this.step(i,h,n),i===null)return null;if(i.lastSeen=++this.clock,B+=f,a(i,B),i.nfaStates.length===0&&n!==V.UNANCHORED)break}return Array.from(o).sort((c,h)=>c-h)}},j(ln,"MAX_CACHE_CLEARS",5),j(ln,"STATE_MEMORY_ESTIMATE",838),ln);const Yw=32,Xw=500,xB=256,Zw=256*1024;var eT=class{constructor(){this.end=0,this.cap=new Int32Array(0),this.matchcap=new Int32Array(0),this.ncap=0,this.jobPc=new Int32Array(xB),this.jobArg=new Uint8Array(xB),this.jobPos=new Int32Array(xB),this.jobLen=0,this.visited=new Uint32Array(0)}reset(r,e,t){this.end=e,this.jobLen=0,this.ncap=t;const n=r.numInst()*(e+1)+Yw-1>>>5;this.visited.length<n?this.visited=new Uint32Array(n):this.visited.fill(0,0,n),this.cap.length<t?this.cap=new Int32Array(t).fill(-1):this.cap.fill(-1,0,t),this.matchcap.length<t?this.matchcap=new Int32Array(t).fill(-1):this.matchcap.fill(-1,0,t)}shouldVisit(r,e){const t=r*(this.end+1)+e,n=t>>>5,s=1<<(t&31);return(this.visited[n]&s)!==0?!1:(this.visited[n]|=s,!0)}push(r,e,t,n){if(r.prog.getInst(e).op!==x.FAIL&&(n||this.shouldVisit(e,t))){if(this.jobLen>=this.jobPc.length){const s=this.jobPc.length*2,i=new Int32Array(s);i.set(this.jobPc),this.jobPc=i;const o=new Uint8Array(s);o.set(this.jobArg),this.jobArg=o;const a=new Int32Array(s);a.set(this.jobPos),this.jobPos=a}this.jobPc[this.jobLen]=e,this.jobArg[this.jobLen]=n?1:0,this.jobPos[this.jobLen]=t,this.jobLen++}}tryBacktrack(r,e,t,n,s){const i=r.longest;for(this.push(r,t,n,!1);this.jobLen>0;){this.jobLen--;let o=this.jobPc[this.jobLen],a=this.jobArg[this.jobLen]===1,B=this.jobPos[this.jobLen],c=!0;for(;!(!c&&!this.shouldVisit(o,B));){c=!1;const h=r.prog.getInst(o);switch(h.op){case x.FAIL:throw new Hi("unexpected InstFail");case x.ALT:if(a){a=!1,o=h.arg;continue}else{this.push(r,o,B,!0),o=h.out;continue}case x.ALT_MATCH:{const f=r.prog.getInst(h.out);if(x.isRuneOp(f.op)){this.push(r,h.arg,B,!1),o=h.arg,B=this.end;continue}this.push(r,h.out,this.end,!1),o=h.out;continue}case x.RUNE:{const f=e.step(B);if(f===ct.EOF()||!h.matchRune(f>>3))break;B+=f&7,o=h.out;continue}case x.RUNE1:{const f=e.step(B);if(f===ct.EOF()||f>>3!==h.runes[0])break;B+=f&7,o=h.out;continue}case x.RUNE_ANY_NOT_NL:{const f=e.step(B);if(f===ct.EOF()||f>>3===10)break;B+=f&7,o=h.out;continue}case x.RUNE_ANY:{const f=e.step(B);if(f===ct.EOF())break;B+=f&7,o=h.out;continue}case x.CAPTURE:if(a){this.cap[h.arg]=B;break}else{h.arg<this.ncap&&(this.push(r,o,this.cap[h.arg],!0),this.cap[h.arg]=B),o=h.out;continue}case x.EMPTY_WIDTH:{const f=e.context(B);if((h.arg&~f)!==0)break;o=h.out;continue}case x.NOP:o=h.out;continue;case x.MATCH:{if(s===V.ANCHOR_BOTH&&B!==this.end)break;if(this.ncap===0)return!0;this.ncap>1&&(this.cap[1]=B);const f=this.matchcap[1];if((f===-1||i&&B>0&&B>f)&&this.matchcap.set(this.cap),!i||B===this.end)return!0;break}case x.LB_WRITE:case x.LB_CHECK:throw new Hi("Backtracker cannot evaluate Lookbehind instructions");default:throw new Hi("bad inst")}break}}return i&&this.matchcap.length>1&&this.matchcap[1]>=0}};const fa=[];var da=class Cg{static shouldBacktrack(e){return e.numInst()<=Xw}static maxBitStateLen(e){return Cg.shouldBacktrack(e)?Math.floor(Zw/e.numInst()):0}static execute(e,t,n,s,i){const o=e.cond;if(o===X.EMPTY_ALL||(s===V.ANCHOR_START||s===V.ANCHOR_BOTH)&&n!==0||(o&X.EMPTY_BEGIN_TEXT)!==0&&n!==0)return null;const a=fa.length>0?fa.pop():new eT,B=t.endPos();a.reset(e.prog,B,i);let c=!1;if((o&X.EMPTY_BEGIN_TEXT)!==0||s===V.ANCHOR_START||s===V.ANCHOR_BOTH)a.ncap>0&&(a.cap[0]=n),a.tryBacktrack(e,t,e.prog.start,n,s)&&(c=!0);else{let f=-1;for(;n<=B&&f!==0;n+=f){if(e.prefix.length>0){const _=t.index(e,n);if(_<0)break;n+=_}if(a.ncap>0&&(a.cap[0]=n),a.tryBacktrack(e,t,e.prog.start,n,s)){c=!0;break}const C=t.step(n);f=C===ct.EOF()?0:C&7}}if(!c)return fa.push(a),null;const h=i===0?[]:X.toArray(a.matchcap.subarray(0,i));return fa.push(a),h}},sd=class{constructor(r){this.sparse=new Uint32Array(r),this.dense=new Uint32Array(r),this.size=0,this.nextIndex=0}empty(){return this.nextIndex>=this.size}next(){return this.dense[this.nextIndex++]}clear(){this.size=0,this.nextIndex=0}contains(r){return r<this.sparse.length&&this.sparse[r]<this.size&&this.dense[this.sparse[r]]===r}insert(r){this.contains(r)||this.insertNew(r)}insertNew(r){r>=this.sparse.length||(this.sparse[r]=this.size,this.dense[this.size]=r,this.size++)}};const tT=(r,e,t,n)=>{const s=r.length,i=e.length;let o=0,a=0;const B=[],c=[];let h=!0,f=-1;const C=_=>{const R=_?r:e,L=_?o:a,G=_?t:n;return f>0&&R[L]<=B[f]?!1:(B.push(R[L],R[L+1]),_?o+=2:a+=2,f+=2,c.push(G),!0)};for(;o<s||a<i;)if(a>=i?h=C(!0):o>=s||e[a]<r[o]?h=C(!1):h=C(!0),!h)return null;return{merged:B,next:c}};var nT=class{constructor(r){this.start=r.start,this.numCap=r.numCap,this.inst=new Array(r.inst.length);for(let e=0;e<r.inst.length;e++){const t=r.inst[e],n=new x(t.op);n.out=t.out,n.arg=t.arg,n.runes=t.runes?t.runes.slice():[],n.next=null,this.inst[e]=n}}};const rT=r=>{const e=new nT(r);for(let t=0;t<e.inst.length;t++){const n=e.inst[t];if(n.op!==x.ALT&&n.op!==x.ALT_MATCH)continue;let s="out",i="arg",o=e.inst[n[i]];if(o.op!==x.ALT&&o.op!==x.ALT_MATCH&&(s="arg",i="out",o=e.inst[n[i]],o.op!==x.ALT&&o.op!==x.ALT_MATCH))continue;const a=e.inst[n[s]];if(a.op===x.ALT||a.op===x.ALT_MATCH)continue;let B="out",c="arg",h=!1;o.out===t?h=!0:o.arg===t&&(h=!0,B="arg",c="out"),h&&(o[B]=n[s]),n[s]===o[B]&&(n[i]=o[c])}return e},sT=r=>{if(r.inst.length>=1e3)return null;const e=new sd(r.inst.length),t=new sd(r.inst.length),n=new Array(r.inst.length),s=new Array(r.inst.length).fill(!1),i=o=>{let a=!0;const B=r.inst[o];if(t.contains(o))return!0;switch(t.insert(o),B.op){case x.ALT:case x.ALT_MATCH:{a=i(B.out)&&i(B.arg);let c=s[B.out],h=s[B.arg];if(c&&h)return!1;if(h){const R=B.out;B.out=B.arg,B.arg=R;const L=c;c=h,h=L}c&&(s[o]=!0,B.op=x.ALT_MATCH);const f=n[B.out]||[],C=n[B.arg]||[],_=tT(f,C,B.out,B.arg);if(!_)return!1;n[o]=_.merged,B.next=new Uint32Array(_.next);break}case x.CAPTURE:case x.EMPTY_WIDTH:case x.NOP:a=i(B.out),s[o]=s[B.out],n[o]=n[B.out]?n[B.out].slice():[],B.next=new Uint32Array(Math.floor(n[o].length/2)+1).fill(B.out);break;case x.MATCH:case x.FAIL:s[o]=B.op===x.MATCH;break;case x.RUNE:{if(s[o]=!1,B.next&&B.next.length>0)break;if(e.insert(B.out),!B.runes||B.runes.length===0){n[o]=[],B.next=new Uint32Array([B.out]);break}let c=[];if(B.runes.length===1&&(B.arg&V.FOLD_CASE)!==0){const h=B.runes[0];c.push(h,h);for(let f=$.simpleFold(h);f!==h;f=$.simpleFold(f))c.push(f,f);c.sort((f,C)=>f-C)}else for(let h=0;h<B.runes.length;h++)c.push(B.runes[h]);n[o]=c,B.next=new Uint32Array(Math.floor(c.length/2)+1).fill(B.out),B.op=x.RUNE;break}case x.RUNE1:{if(s[o]=!1,B.next&&B.next.length>0)break;e.insert(B.out);let c=[];if((B.arg&V.FOLD_CASE)!==0){const h=B.runes[0];c.push(h,h);for(let f=$.simpleFold(h);f!==h;f=$.simpleFold(f))c.push(f,f);c.sort((f,C)=>f-C)}else c.push(B.runes[0],B.runes[0]);n[o]=c,B.next=new Uint32Array(Math.floor(c.length/2)+1).fill(B.out),B.op=x.RUNE;break}case x.RUNE_ANY:if(s[o]=!1,B.next&&B.next.length>0)break;e.insert(B.out),n[o]=[0,$.MAX_RUNE],B.next=new Uint32Array([B.out]);break;case x.RUNE_ANY_NOT_NL:if(s[o]=!1,B.next&&B.next.length>0)break;e.insert(B.out),n[o]=[0,9,11,$.MAX_RUNE],B.next=new Uint32Array(Math.floor(n[o].length/2)+1).fill(B.out);break}return a};for(e.clear(),e.insert(r.start);!e.empty();)if(t.clear(),!i(e.next()))return null;for(let o=0;o<r.inst.length;o++)n[o]&&(r.inst[o].runes=n[o]);return r},iT=(r,e)=>{for(let t=0;t<e.inst.length;t++){const n=e.inst[t];switch(n.op){case x.ALT:case x.ALT_MATCH:case x.RUNE:break;case x.CAPTURE:case x.EMPTY_WIDTH:case x.NOP:case x.MATCH:case x.FAIL:r.inst[t].next=null;break;case x.RUNE1:case x.RUNE_ANY:case x.RUNE_ANY_NOT_NL:r.inst[t].next=null,r.inst[t].op=n.op,r.inst[t].runes=n.runes?n.runes.slice():[];break}}};var id=class pg{static compile(e){if(e.start===0||e.numLb>0)return null;const t=e.inst[e.start];if(t.op!==x.EMPTY_WIDTH||(t.arg&X.EMPTY_BEGIN_TEXT)===0)return null;let n=!1;for(let i=0;i<e.inst.length;i++)if(e.inst[i].op===x.ALT||e.inst[i].op===x.ALT_MATCH){n=!0;break}for(let i=0;i<e.inst.length;i++){const o=e.inst[i],a=e.inst[o.out].op;switch(o.op){case x.ALT:case x.ALT_MATCH:if(a===x.MATCH||e.inst[o.arg].op===x.MATCH)return null;break;case x.EMPTY_WIDTH:if(a===x.MATCH){if((o.arg&X.EMPTY_END_TEXT)===X.EMPTY_END_TEXT)continue;return null}break;default:if(a===x.MATCH&&n)return null;break}}let s=rT(e);return s=sT(s),s!==null&&iT(s,e),s}static next(e,t){const n=e.matchRunePos(t);return n>=0?e.next[n]:e.op===x.ALT_MATCH?e.out:0}static execute(e,t,n,s,i){const o=e.onepass;if(!o)return null;const a=new Int32Array(i).fill(-1);let B=!1,c=t.step(n),h=c>>3,f=c&7,C=ct.EOF(),_=-1,R=0;c!==ct.EOF()&&(C=t.step(n+f),C!==ct.EOF()&&(_=C>>3,R=C&7));let L=n===0?X.emptyOpContext(-1,h):t.context(n),G=o.start,Q;for(;;){switch(Q=o.inst[G],G=Q.out,Q.op){case x.MATCH:return s===V.ANCHOR_BOTH&&n!==t.endPos()?null:(B=!0,a.length>0&&(a[0]=0,a[1]=n),i===0?[]:X.toArray(a));case x.RUNE:if(!Q.matchRune(h))return null;break;case x.RUNE1:if(h!==Q.runes[0])return null;break;case x.RUNE_ANY:break;case x.RUNE_ANY_NOT_NL:if(h===10)return null;break;case x.ALT:case x.ALT_MATCH:G=pg.next(Q,h);continue;case x.FAIL:return null;case x.NOP:continue;case x.EMPTY_WIDTH:if((Q.arg&~L)!==0)return null;continue;case x.CAPTURE:Q.arg<a.length&&(a[Q.arg]=n);continue;default:throw new Hi("bad inst")}if(f===0)break;L=X.emptyOpContext(h,_),n+=f,h=_,f=R,h!==-1&&(C=t.step(n+f),C!==ct.EOF()?(_=C>>3,R=C&7):(_=-1,R=0))}return B?i===0?[]:X.toArray(a):null}},Z,T=(Z=class{static isPseudoOp(e){return e>=Z.Op.LEFT_PAREN}static emptySubs(){return[]}static quoteIfHyphen(e){return e===O.CODES.get("-")?"\\":""}static fromRegexp(e){const t=new Z(e.op);return t.flags=e.flags,t.subs=e.subs,t.runes=e.runes,t.cap=e.cap,t.min=e.min,t.max=e.max,t.name=e.name,t.namedGroups=e.namedGroups,t.lb=e.lb,t}constructor(e){this.op=e,this.flags=0,this.subs=Z.emptySubs(),this.runes=[],this.min=0,this.max=0,this.cap=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}reinit(){this.flags=0,this.subs=Z.emptySubs(),this.runes=[],this.cap=0,this.min=0,this.max=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}toString(){return this.appendTo()}appendTo(){let e="";switch(this.op){case Z.Op.NO_MATCH:e+="[^\\x00-\\x{10FFFF}]";break;case Z.Op.EMPTY_MATCH:e+="(?:)";break;case Z.Op.STAR:case Z.Op.PLUS:case Z.Op.QUEST:case Z.Op.REPEAT:{const t=this.subs[0];switch(t.op>Z.Op.CAPTURE||t.op===Z.Op.LITERAL&&t.runes.length>1?e+=`(?:${t.appendTo()})`:e+=t.appendTo(),this.op){case Z.Op.STAR:e+="*";break;case Z.Op.PLUS:e+="+";break;case Z.Op.QUEST:e+="?";break;case Z.Op.REPEAT:e+=`{${this.min}`,this.min!==this.max&&(e+=",",this.max>=0&&(e+=this.max)),e+="}";break}(this.flags&V.NON_GREEDY)!==0&&(e+="?");break}case Z.Op.CONCAT:for(let t of this.subs)t.op===Z.Op.ALTERNATE?e+=`(?:${t.appendTo()})`:e+=t.appendTo();break;case Z.Op.ALTERNATE:{let t="";for(let n of this.subs)e+=t,t="|",e+=n.appendTo();break}case Z.Op.LITERAL:(this.flags&V.FOLD_CASE)!==0&&(e+="(?i:");for(let t of this.runes)e+=X.escapeRune(t);(this.flags&V.FOLD_CASE)!==0&&(e+=")");break;case Z.Op.ANY_CHAR_NOT_NL:e+="(?-s:.)";break;case Z.Op.ANY_CHAR:e+="(?s:.)";break;case Z.Op.PLB:e+=`(?<=${this.subs[0].appendTo()})`;break;case Z.Op.NLB:e+=`(?<!${this.subs[0].appendTo()})`;break;case Z.Op.CAPTURE:this.name===null||this.name.length===0?e+="(":e+=`(?P<${this.name}>`,this.subs[0].op!==Z.Op.EMPTY_MATCH&&(e+=this.subs[0].appendTo()),e+=")";break;case Z.Op.BEGIN_TEXT:e+="\\A";break;case Z.Op.END_TEXT:(this.flags&V.WAS_DOLLAR)!==0?e+="(?-m:$)":e+="\\z";break;case Z.Op.BEGIN_LINE:e+="^";break;case Z.Op.END_LINE:e+="$";break;case Z.Op.WORD_BOUNDARY:e+="\\b";break;case Z.Op.NO_WORD_BOUNDARY:e+="\\B";break;case Z.Op.CHAR_CLASS:if(this.runes.length%2!==0){e+="[invalid char class]";break}if(e+="[",this.runes.length===0)e+="^\\x00-\\x{10FFFF}";else if(this.runes[0]===0&&this.runes[this.runes.length-1]===$.MAX_RUNE){e+="^";for(let t=1;t<this.runes.length-1;t+=2){const n=this.runes[t]+1,s=this.runes[t+1]-1;e+=Z.quoteIfHyphen(n),e+=X.escapeRune(n),n!==s&&(e+="-",e+=Z.quoteIfHyphen(s),e+=X.escapeRune(s))}}else for(let t=0;t<this.runes.length;t+=2){const n=this.runes[t],s=this.runes[t+1];e+=Z.quoteIfHyphen(n),e+=X.escapeRune(n),n!==s&&(e+="-",e+=Z.quoteIfHyphen(s),e+=X.escapeRune(s))}e+="]";break;default:e+=this.op;break}return e}maxCap(){let e=0;if(this.op===Z.Op.CAPTURE&&(e=this.cap),this.subs!==null)for(let t of this.subs){const n=t.maxCap();e<n&&(e=n)}return e}equals(e){if(!(e!==null&&e instanceof Z)||this.op!==e.op)return!1;switch(this.op){case Z.Op.END_TEXT:if((this.flags&V.WAS_DOLLAR)!==(e.flags&V.WAS_DOLLAR))return!1;break;case Z.Op.LITERAL:case Z.Op.CHAR_CLASS:if(this.runes===null&&e.runes===null)break;if(this.runes===null||e.runes===null||this.runes.length!==e.runes.length)return!1;for(let t=0;t<this.runes.length;t++)if(this.runes[t]!==e.runes[t])return!1;break;case Z.Op.ALTERNATE:case Z.Op.CONCAT:if(this.subs.length!==e.subs.length)return!1;for(let t=0;t<this.subs.length;++t)if(!this.subs[t].equals(e.subs[t]))return!1;break;case Z.Op.STAR:case Z.Op.PLUS:case Z.Op.QUEST:if((this.flags&V.NON_GREEDY)!==(e.flags&V.NON_GREEDY)||!this.subs[0].equals(e.subs[0]))return!1;break;case Z.Op.REPEAT:if((this.flags&V.NON_GREEDY)!==(e.flags&V.NON_GREEDY)||this.min!==e.min||this.max!==e.max||!this.subs[0].equals(e.subs[0]))return!1;break;case Z.Op.CAPTURE:if(this.cap!==e.cap||(this.name===null?e.name!==null:this.name!==e.name)||!this.subs[0].equals(e.subs[0]))return!1;break;case Z.Op.PLB:case Z.Op.NLB:if(this.lb!==e.lb||!this.subs[0].equals(e.subs[0]))return!1;break}return!0}},j(Z,"Op",dg(["NO_MATCH","EMPTY_MATCH","LITERAL","CHAR_CLASS","ANY_CHAR_NOT_NL","ANY_CHAR","BEGIN_LINE","END_LINE","BEGIN_TEXT","END_TEXT","WORD_BOUNDARY","NO_WORD_BOUNDARY","CAPTURE","STAR","PLUS","QUEST","REPEAT","CONCAT","ALTERNATE","PLB","NLB","LEFT_PAREN","VERTICAL_BAR"])),Z),od=class{constructor(r){this.next=[Object.create(null)],this.fail=[0],this.match=[!1];for(const t of r){let n=0;for(let s=0;s<t.length;s++){const i=t[s];i in this.next[n]||(this.next.push(Object.create(null)),this.fail.push(0),this.match.push(!1),this.next[n][i]=this.next.length-1),n=this.next[n][i]}this.match[n]=!0}const e=[];for(const t in this.next[0])if(Object.prototype.hasOwnProperty.call(this.next[0],t)){const n=this.next[0][t];this.fail[n]=0,e.push(n)}for(;e.length>0;){const t=e.shift();for(const n in this.next[t])if(Object.prototype.hasOwnProperty.call(this.next[t],n)){const s=this.next[t][n];let i=this.fail[t];for(;i!==0&&!(n in this.next[i]);)i=this.fail[i];n in this.next[i]?this.fail[s]=this.next[i][n]:this.fail[s]=0,this.match[s]=this.match[s]||this.match[this.fail[s]],e.push(s)}}}searchUTF16(r,e,t){let n=0;for(let s=e;s<t;s++){const i=r.charCodeAt(s);for(;n!==0&&!(i in this.next[n]);)n=this.fail[n];if(i in this.next[n]&&(n=this.next[n][i]),this.match[n])return!0}return!1}searchUTF8(r,e,t){let n=0;for(let s=e;s<t;s++){const i=r[s];for(;n!==0&&!(i in this.next[n]);)n=this.fail[n];if(i in this.next[n]&&(n=this.next[n][i]),this.match[n])return!0}return!1}},Wt,pe=(Wt=class{constructor(e){this.type=e,this.subs=[],this.str="",this.bytes=null,this.ac16=null,this.ac8=null}eval(e,t){switch(this.type){case Wt.Type.NONE:return!0;case Wt.Type.EXACT:return e.hasString(this,t);case Wt.Type.AND:for(let n=0;n<this.subs.length;n++)if(!this.subs[n].eval(e,t))return!1;return!0;case Wt.Type.OR:if(this.ac16&&this.ac8)return e.hasAnyString(this,t);for(let n=0;n<this.subs.length;n++)if(this.subs[n].eval(e,t))return!0;return!1;default:return!0}}},j(Wt,"Type",{NONE:0,EXACT:1,AND:2,OR:3}),Wt),oT=class Bn{static build(e){const t=Bn.fromRegexp(e);return Bn.simplify(t)}static fromRegexp(e){if(!e)return new pe(pe.Type.NONE);switch(e.op){case T.Op.PLB:case T.Op.NLB:case T.Op.NO_MATCH:case T.Op.EMPTY_MATCH:case T.Op.BEGIN_LINE:case T.Op.END_LINE:case T.Op.BEGIN_TEXT:case T.Op.END_TEXT:case T.Op.WORD_BOUNDARY:case T.Op.NO_WORD_BOUNDARY:case T.Op.CHAR_CLASS:case T.Op.ANY_CHAR_NOT_NL:case T.Op.ANY_CHAR:return new pe(pe.Type.NONE);case T.Op.LITERAL:{if(e.runes.length===0||(e.flags&V.FOLD_CASE)!==0)return new pe(pe.Type.NONE);const t=new pe(pe.Type.EXACT);let n="";for(let s=0;s<e.runes.length;s++)n+=String.fromCodePoint(e.runes[s]);return t.str=n,t.bytes=X.stringToUtf8ByteArray(t.str),t}case T.Op.CAPTURE:case T.Op.PLUS:return Bn.fromRegexp(e.subs[0]);case T.Op.REPEAT:return e.min>=1?Bn.fromRegexp(e.subs[0]):new pe(pe.Type.NONE);case T.Op.CONCAT:{const t=new pe(pe.Type.AND);for(const n of e.subs)t.subs.push(Bn.fromRegexp(n));return t}case T.Op.ALTERNATE:{const t=new pe(pe.Type.OR);for(const n of e.subs)t.subs.push(Bn.fromRegexp(n));return t}default:return new pe(pe.Type.NONE)}}static simplify(e){if(e.type===pe.Type.EXACT||e.type===pe.Type.NONE)return e;if(e.type===pe.Type.AND){const t=[];for(const n of e.subs){const s=Bn.simplify(n);if(s.type!==pe.Type.NONE)if(s.type===pe.Type.AND)for(let i=0;i<s.subs.length;i++)t.push(s.subs[i]);else t.push(s)}return t.length===0?new pe(pe.Type.NONE):t.length===1?t[0]:(e.subs=t,e)}if(e.type===pe.Type.OR){const t=[];for(const o of e.subs){const a=Bn.simplify(o);if(a.type===pe.Type.NONE)return new pe(pe.Type.NONE);if(a.type===pe.Type.OR)for(let B=0;B<a.subs.length;B++)t.push(a.subs[B]);else t.push(a)}if(t.length===0)return new pe(pe.Type.NONE);if(t.length===1)return t[0];const n=new Set,s=[];for(const o of t)o.type===pe.Type.EXACT?n.has(o.str)||(n.add(o.str),s.push(o)):s.push(o);e.subs=s;let i=!0;for(const o of s)if(o.type!==pe.Type.EXACT){i=!1;break}return i&&s.length>1&&(e.ac16=new od(s.map(o=>{const a=[];for(let B=0;B<o.str.length;B++)a.push(o.str.charCodeAt(B));return a})),e.ac8=new od(s.map(o=>o.bytes))),e}return e}},St=class{constructor(r=0,e=0){this.head=r,this.tail=e}},aT=class{constructor(){this.inst=[],this.start=0,this.numCap=2,this.lbStarts=[],this.numLb=0}getInst(r){return this.inst[r]}numInst(){return this.inst.length}addInst(r){this.inst.push(new x(r))}skipNop(r){let e=this.inst[r];for(;e.op===x.NOP||e.op===x.CAPTURE;)e=this.inst[r],r=e.out;return e}prefix(){let r="",e=this.skipNop(this.start);if(!x.isRuneOp(e.op)||e.runes.length!==1)return[e.op===x.MATCH,r];for(;x.isRuneOp(e.op)&&e.runes.length===1&&(e.arg&V.FOLD_CASE)===0;)r+=String.fromCodePoint(e.runes[0]),e=this.skipNop(e.out);return[e.op===x.MATCH,r]}startCond(){let r=0,e=this.start;e:for(;;){const t=this.inst[e];switch(t.op){case x.EMPTY_WIDTH:r|=t.arg;break;case x.FAIL:return-1;case x.CAPTURE:case x.NOP:break;default:break e}e=t.out}return r}patch(r,e){let t=r.head;for(;t!==0;){const n=this.inst[t>>1];(t&1)===0?(t=n.out,n.out=e):(t=n.arg,n.arg=e)}}append(r,e){if(r.head===0)return e;if(e.head===0)return r;const t=this.inst[r.tail>>1];return(r.tail&1)===0?t.out=e.head:t.arg=e.head,new St(r.head,e.tail)}toString(){let r="";for(let e=0;e<this.inst.length;e++){const t=r.length;r+=e,e===this.start&&(r+="*"),r+="        ".substring(r.length-t),r+=this.inst[e],r+=`
`}return r}},Ca=class{constructor(r=0,e=new St,t=!1){this.i=r,this.out=e,this.nullable=t}},uT=class Es{static ANY_RUNE_NOT_NL(){return[0,O.CODES.get(`
`)-1,O.CODES.get(`
`)+1,$.MAX_RUNE]}static ANY_RUNE(){return[0,$.MAX_RUNE]}static compileRegexp(e){const t=new Es,n=t.compile(e);return t.prog.patch(n.out,t.newInst(x.MATCH).i),t.prog.start=n.i,t.prog}static compileSet(e){const t=new Es;if(e.length===0)return t.prog.start=t.newInst(x.FAIL).i,t.prog;let n=[];for(let i=0;i<e.length;i++){const o=t.compile(e[i]),a=t.newInst(x.MATCH);t.prog.getInst(a.i).arg=i,t.prog.patch(o.out,a.i),n.push(o.i)}let s=n[0];for(let i=1;i<n.length;i++){const o=t.newInst(x.ALT),a=t.prog.getInst(o.i);a.out=s,a.arg=n[i],s=o.i}return t.prog.start=s,t.prog}constructor(){this.prog=new aT,this.newInst(x.FAIL)}newInst(e){return this.prog.addInst(e),new Ca(this.prog.numInst()-1,new St,!0)}nop(){const e=this.newInst(x.NOP);return e.out=new St(e.i<<1,e.i<<1),e}fail(){return new Ca}cap(e){const t=this.newInst(x.CAPTURE);return t.out=new St(t.i<<1,t.i<<1),this.prog.getInst(t.i).arg=e,this.prog.numCap<e+1&&(this.prog.numCap=e+1),t}cat(e,t){return e.i===0||t.i===0?this.fail():(this.prog.patch(e.out,t.i),new Ca(e.i,t.out,e.nullable&&t.nullable))}alt(e,t){if(e.i===0)return t;if(t.i===0)return e;const n=this.newInst(x.ALT),s=this.prog.getInst(n.i);return s.out=e.i,s.arg=t.i,n.out=this.prog.append(e.out,t.out),n.nullable=e.nullable||t.nullable,n}loop(e,t){const n=this.newInst(x.ALT),s=this.prog.getInst(n.i);return t?(s.arg=e.i,n.out=new St(n.i<<1,n.i<<1)):(s.out=e.i,n.out=new St(n.i<<1|1,n.i<<1|1)),this.prog.patch(e.out,n.i),n}quest(e,t){const n=this.newInst(x.ALT),s=this.prog.getInst(n.i);return t?(s.arg=e.i,n.out=new St(n.i<<1,n.i<<1)):(s.out=e.i,n.out=new St(n.i<<1|1,n.i<<1|1)),n.out=this.prog.append(n.out,e.out),n}star(e,t){return e.nullable?this.quest(this.plus(e,t),t):this.loop(e,t)}plus(e,t){return new Ca(e.i,this.loop(e,t).out,e.nullable)}empty(e){const t=this.newInst(x.EMPTY_WIDTH);return this.prog.getInst(t.i).arg=e,t.out=new St(t.i<<1,t.i<<1),t}rune(e,t){const n=this.newInst(x.RUNE);n.nullable=!1;const s=this.prog.getInst(n.i);return s.runes=e,t&=V.FOLD_CASE,(e.length!==1||$.simpleFold(e[0])===e[0])&&(t&=-2),s.arg=t,n.out=new St(n.i<<1,n.i<<1),(t&V.FOLD_CASE)===0&&e.length===1||e.length===2&&e[0]===e[1]?s.op=x.RUNE1:e.length===2&&e[0]===0&&e[1]===$.MAX_RUNE?s.op=x.RUNE_ANY:e.length===4&&e[0]===0&&e[1]===O.CODES.get(`
`)-1&&e[2]===O.CODES.get(`
`)+1&&e[3]===$.MAX_RUNE&&(s.op=x.RUNE_ANY_NOT_NL),n}lookBehind(e,t){const n=this.newInst(x.LB_WRITE);this.prog.getInst(n.i).arg=t;const s=this.rune(Es.ANY_RUNE(),0),i=this.star(s,!0),o=this.cat(i,e);this.prog.patch(o.out,n.i);const a=this.newInst(x.LB_CHECK);return this.prog.getInst(a.i).arg=t,this.prog.lbStarts.push(o.i),Math.abs(t)>this.prog.numLb&&(this.prog.numLb=Math.abs(t)),a.out=new St(a.i<<1,a.i<<1),a}compile(e){switch(e.op){case T.Op.NO_MATCH:return this.fail();case T.Op.EMPTY_MATCH:return this.nop();case T.Op.LITERAL:if(e.runes.length===0)return this.nop();{let t=null;for(let n of e.runes){const s=this.rune([n],e.flags);t=t===null?s:this.cat(t,s)}return t}case T.Op.CHAR_CLASS:return this.rune(e.runes,e.flags);case T.Op.ANY_CHAR_NOT_NL:return this.rune(Es.ANY_RUNE_NOT_NL(),0);case T.Op.ANY_CHAR:return this.rune(Es.ANY_RUNE(),0);case T.Op.BEGIN_LINE:return this.empty(X.EMPTY_BEGIN_LINE);case T.Op.END_LINE:return this.empty(X.EMPTY_END_LINE);case T.Op.BEGIN_TEXT:return this.empty(X.EMPTY_BEGIN_TEXT);case T.Op.END_TEXT:return this.empty(X.EMPTY_END_TEXT);case T.Op.WORD_BOUNDARY:return this.empty(X.EMPTY_WORD_BOUNDARY);case T.Op.NO_WORD_BOUNDARY:return this.empty(X.EMPTY_NO_WORD_BOUNDARY);case T.Op.PLB:case T.Op.NLB:return this.lookBehind(this.compile(e.subs[0]),e.lb);case T.Op.CAPTURE:{const t=this.cap(e.cap<<1),n=this.compile(e.subs[0]),s=this.cap(e.cap<<1|1);return this.cat(this.cat(t,n),s)}case T.Op.STAR:return this.star(this.compile(e.subs[0]),(e.flags&V.NON_GREEDY)!==0);case T.Op.PLUS:return this.plus(this.compile(e.subs[0]),(e.flags&V.NON_GREEDY)!==0);case T.Op.QUEST:return this.quest(this.compile(e.subs[0]),(e.flags&V.NON_GREEDY)!==0);case T.Op.CONCAT:if(e.subs.length===0)return this.nop();{let t=null;for(let n of e.subs){const s=this.compile(n);t=t===null?s:this.cat(t,s)}return t}case T.Op.ALTERNATE:if(e.subs.length===0)return this.nop();{let t=null;for(let n of e.subs){const s=this.compile(n);t=t===null?s:this.alt(t,s)}return t}default:throw new Kw("regexp: unhandled case in compile")}}},BT=class It{static simplify(e){if(e===null)return null;switch(e.op){case T.Op.PLB:case T.Op.NLB:case T.Op.CAPTURE:{const t=It.simplify(e.subs[0]);if(t!==e.subs[0]){const n=T.fromRegexp(e);return n.runes=[],n.subs=[t],n}return e}case T.Op.CONCAT:case T.Op.ALTERNATE:{const t=[];let n=!1;for(let s=0;s<e.subs.length;s++){const i=e.subs[s],o=It.simplify(i);if(o!==i&&(n=!0),e.op===T.Op.CONCAT){if(o.op===T.Op.NO_MATCH)return new T(T.Op.NO_MATCH);if(o.op===T.Op.EMPTY_MATCH){n=!0;continue}if(o.op===T.Op.CONCAT){n=!0;for(let a=0;a<o.subs.length;a++)t.push(o.subs[a]);continue}}else if(e.op===T.Op.ALTERNATE){if(o.op===T.Op.NO_MATCH){n=!0;continue}if(o.op===T.Op.ALTERNATE){n=!0;for(let a=0;a<o.subs.length;a++)t.push(o.subs[a]);continue}}t.push(o)}if(n){if(t.length===0)return new T(e.op===T.Op.CONCAT?T.Op.EMPTY_MATCH:T.Op.NO_MATCH);if(t.length===1)return t[0];const s=T.fromRegexp(e);return s.runes=[],s.subs=t,s}return e}case T.Op.CHAR_CLASS:return e.runes===null?e:e.runes.length===0?new T(T.Op.NO_MATCH):e.runes.length===2&&e.runes[0]===0&&e.runes[1]===$.MAX_RUNE?new T(T.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===O.CODES.get(`
`)-1&&e.runes[2]===O.CODES.get(`
`)+1&&e.runes[3]===$.MAX_RUNE?new T(T.Op.ANY_CHAR_NOT_NL):e;case T.Op.STAR:case T.Op.PLUS:case T.Op.QUEST:{const t=It.simplify(e.subs[0]);return It.simplify1(e.op,e.flags,t,e)}case T.Op.REPEAT:{if(e.min===0&&e.max===0)return new T(T.Op.EMPTY_MATCH);const t=It.simplify(e.subs[0]);if(e.max===-1){if(e.min===0)return It.simplify1(T.Op.STAR,e.flags,t,null);if(e.min===1)return It.simplify1(T.Op.PLUS,e.flags,t,null);const s=new T(T.Op.CONCAT),i=[];for(let o=0;o<e.min-1;o++)i.push(t);return i.push(It.simplify1(T.Op.PLUS,e.flags,t,null)),s.subs=i.slice(0),It.simplify(s)}if(e.min===1&&e.max===1)return t;let n=null;if(e.min>0){n=[];for(let s=0;s<e.min;s++)n.push(t)}if(e.max>e.min){let s=It.simplify1(T.Op.QUEST,e.flags,t,null);for(let i=e.min+1;i<e.max;i++){const o=new T(T.Op.CONCAT);o.subs=[t,s],s=It.simplify1(T.Op.QUEST,e.flags,o,null)}if(n===null)return s;n.push(s)}if(n!==null){const s=new T(T.Op.CONCAT);return s.subs=n.slice(0),It.simplify(s)}return new T(T.Op.NO_MATCH)}}return e}static simplify1(e,t,n,s){if(n.op===T.Op.EMPTY_MATCH)return n;if(n.op===T.Op.NO_MATCH)return e===T.Op.PLUS?n:new T(T.Op.EMPTY_MATCH);if(e===n.op&&(t&V.NON_GREEDY)===(n.flags&V.NON_GREEDY))return n;if(s!==null&&s.op===e&&(s.flags&V.NON_GREEDY)===(t&V.NON_GREEDY)&&n===s.subs[0])return s;const i=new T(e);return i.flags=t,i.subs=[n],i}},Ce=class{constructor(r,e){this.sign=r,this.cls=e}};const ad=[48,57],ud=[9,10,12,13,32,32],Bd=[48,57,65,90,95,95,97,122],cd=new Map([["\\d",new Ce(1,ad)],["\\D",new Ce(-1,ad)],["\\s",new Ce(1,ud)],["\\S",new Ce(-1,ud)],["\\w",new Ce(1,Bd)],["\\W",new Ce(-1,Bd)]]),ld=[48,57,65,90,97,122],hd=[65,90,97,122],fd=[0,127],dd=[9,9,32,32],Cd=[0,31,127,127],pd=[48,57],gd=[33,126],md=[97,122],Ed=[32,126],_d=[33,47,58,64,91,96,123,126],Dd=[9,13,32,32],Id=[65,90],yd=[48,57,65,90,95,95,97,122],wd=[48,57,65,70,97,102],Td=new Map([["[:alnum:]",new Ce(1,ld)],["[:^alnum:]",new Ce(-1,ld)],["[:alpha:]",new Ce(1,hd)],["[:^alpha:]",new Ce(-1,hd)],["[:ascii:]",new Ce(1,fd)],["[:^ascii:]",new Ce(-1,fd)],["[:blank:]",new Ce(1,dd)],["[:^blank:]",new Ce(-1,dd)],["[:cntrl:]",new Ce(1,Cd)],["[:^cntrl:]",new Ce(-1,Cd)],["[:digit:]",new Ce(1,pd)],["[:^digit:]",new Ce(-1,pd)],["[:graph:]",new Ce(1,gd)],["[:^graph:]",new Ce(-1,gd)],["[:lower:]",new Ce(1,md)],["[:^lower:]",new Ce(-1,md)],["[:print:]",new Ce(1,Ed)],["[:^print:]",new Ce(-1,Ed)],["[:punct:]",new Ce(1,_d)],["[:^punct:]",new Ce(-1,_d)],["[:space:]",new Ce(1,Dd)],["[:^space:]",new Ce(-1,Dd)],["[:upper:]",new Ce(1,Id)],["[:^upper:]",new Ce(-1,Id)],["[:word:]",new Ce(1,yd)],["[:^word:]",new Ce(-1,yd)],["[:xdigit:]",new Ce(1,wd)],["[:^xdigit:]",new Ce(-1,wd)]]);var Ln=class Un{static charClassToString(e,t){let n="[";for(let s=0;s<t;s+=2){s>0&&(n+=" ");const i=e[s],o=e[s+1];i===o?n+=`0x${i.toString(16)}`:n+=`0x${i.toString(16)}-0x${o.toString(16)}`}return n+="]",n}static cmp(e,t,n,s){const i=e[t]-n;return i!==0?i:s-e[t+1]}static qsortIntPair(e,t,n){const s=((t+n)/2|0)&-2,i=e[s],o=e[s+1];let a=t,B=n;for(;a<=B;){for(;a<n&&Un.cmp(e,a,i,o)<0;)a+=2;for(;B>t&&Un.cmp(e,B,i,o)>0;)B-=2;if(a<=B){if(a!==B){let c=e[a];e[a]=e[B],e[B]=c,c=e[a+1],e[a+1]=e[B+1],e[B+1]=c}a+=2,B-=2}}t<B&&Un.qsortIntPair(e,t,B),a<n&&Un.qsortIntPair(e,a,n)}constructor(e=X.emptyInts()){this.r=e,this.len=e.length}toArray(){return this.len===this.r.length?this.r:this.r.slice(0,this.len)}cleanClass(){if(this.len<4)return this;Un.qsortIntPair(this.r,0,this.len-2);let e=2;for(let t=2;t<this.len;t+=2){const n=this.r[t],s=this.r[t+1];if(n<=this.r[e-1]+1){s>this.r[e-1]&&(this.r[e-1]=s);continue}this.r[e]=n,this.r[e+1]=s,e+=2}return this.len=e,this}appendLiteral(e,t){return(t&V.FOLD_CASE)!==0?this.appendFoldedRange(e,e):this.appendRange(e,e)}appendRange(e,t){if(this.len>0){for(let n=2;n<=4;n+=2)if(this.len>=n){const s=this.r[this.len-n],i=this.r[this.len-n+1];if(e<=i+1&&s<=t+1)return e<s&&(this.r[this.len-n]=e),t>i&&(this.r[this.len-n+1]=t),this}}return this.r[this.len++]=e,this.r[this.len++]=t,this}appendFoldedRange(e,t){if(e<=$.MIN_FOLD&&t>=$.MAX_FOLD)return this.appendRange(e,t);if(t<$.MIN_FOLD||e>$.MAX_FOLD)return this.appendRange(e,t);e<$.MIN_FOLD&&(this.appendRange(e,$.MIN_FOLD-1),e=$.MIN_FOLD),t>$.MAX_FOLD&&(this.appendRange($.MAX_FOLD+1,t),t=$.MAX_FOLD);for(let n=e;n<=t;n++){this.appendRange(n,n);for(let s=$.simpleFold(n);s!==n;s=$.simpleFold(s))this.appendRange(s,s)}return this}appendClass(e){for(let t=0;t<e.length;t+=2)this.appendRange(e[t],e[t+1]);return this}appendFoldedClass(e){for(let t=0;t<e.length;t+=2)this.appendFoldedRange(e[t],e[t+1]);return this}appendNegatedClass(e){let t=0;for(let n=0;n<e.length;n+=2){const s=e[n],i=e[n+1];t<=s-1&&this.appendRange(t,s-1),t=i+1}return t<=$.MAX_RUNE&&this.appendRange(t,$.MAX_RUNE),this}appendTable(e){for(let t=0;t<e.length;++t){const n=e.getLo(t),s=e.getHi(t),i=e.getStride(t);if(i===1){this.appendRange(n,s);continue}for(let o=n;o<=s;o+=i)this.appendRange(o,o)}return this}appendNegatedTable(e){let t=0;for(let n=0;n<e.length;++n){const s=e.getLo(n),i=e.getHi(n),o=e.getStride(n);if(o===1){t<=s-1&&this.appendRange(t,s-1),t=i+1;continue}for(let a=s;a<=i;a+=o)t<=a-1&&this.appendRange(t,a-1),t=a+1}return t<=$.MAX_RUNE&&this.appendRange(t,$.MAX_RUNE),this}appendTableWithSign(e,t){return t<0?this.appendNegatedTable(e):this.appendTable(e)}negateClass(){let e=0,t=0;for(let n=0;n<this.len;n+=2){const s=this.r[n],i=this.r[n+1];e<=s-1&&(this.r[t]=e,this.r[t+1]=s-1,t+=2),e=i+1}return this.len=t,e<=$.MAX_RUNE&&(this.r[this.len++]=e,this.r[this.len++]=$.MAX_RUNE),this}appendClassWithSign(e,t){return t<0?this.appendNegatedClass(e):this.appendClass(e)}appendGroup(e,t){let n=e.cls;return t&&(n=new Un().appendFoldedClass(n).cleanClass().toArray()),this.appendClassWithSign(n,e.sign)}toString(){return Un.charClassToString(this.r,this.len)}},cT=class{constructor(r){this.str=r,this.position=0}pos(){return this.position}rewindTo(r){this.position=r}more(){return this.position<this.str.length}peek(){return this.str.codePointAt(this.position)}skip(r){this.position+=r}skipString(r){this.position+=r.length}pop(){const r=this.str.codePointAt(this.position);return this.position+=X.charCount(r),r}lookingAt(r){return this.str.startsWith(r,this.position)}rest(){return this.str.substring(this.position)}from(r){return this.str.substring(r,this.position)}toString(){return this.rest()}},q,lT=(q=class{static unicodeTable(e){return e==="Any"?{tab:q.ANY_TABLE,fold:q.ANY_TABLE,sign:1}:e==="Ascii"?{tab:q.ASCII_TABLE,fold:q.ASCII_FOLD_TABLE,sign:1}:e==="Assigned"?{tab:Ct.CATEGORIES.get("Cn"),fold:Ct.CATEGORIES.get("Cn"),sign:-1}:e==="Lc"?{tab:Ct.CATEGORIES.get("LC"),fold:Ct.FOLD_CATEGORIES.get("LC"),sign:1}:Ct.CATEGORIES.has(e)?{tab:Ct.CATEGORIES.get(e),fold:Ct.FOLD_CATEGORIES.get(e),sign:1}:Ct.SCRIPTS.has(e)?{tab:Ct.SCRIPTS.get(e),fold:Ct.FOLD_SCRIPT.get(e),sign:1}:null}static minFoldRune(e){if(e<$.MIN_FOLD||e>$.MAX_FOLD)return e;let t=e;const n=e;for(e=$.simpleFold(e);e!==n;e=$.simpleFold(e))t>e&&(t=e);return t}static leadingRegexp(e){if(e.op===T.Op.EMPTY_MATCH)return null;if(e.op===T.Op.CONCAT&&e.subs.length>0){const t=e.subs[0];return t.op===T.Op.EMPTY_MATCH?null:t}return e}static literalRegexp(e,t){const n=new T(T.Op.LITERAL);return n.flags=t,n.runes=X.stringToRunes(e),n}static parse(e,t){return new q(e,t).parseInternal()}static parseRepeat(e){const t=e.pos();if(!e.more()||!e.lookingAt("{"))return-1;e.skip(1);const n=q.parseInt(e);if(n===-1||!e.more())return-1;let s;if(!e.lookingAt(","))s=n;else{if(e.skip(1),!e.more())return-1;if(e.lookingAt("}"))s=-1;else if((s=q.parseInt(e))===-1)return-1}if(!e.more()||!e.lookingAt("}"))return-1;if(e.skip(1),n<0||n>1e3||s===-2||s>1e3||s>=0&&n>s)throw new Ae(q.ERR_INVALID_REPEAT_SIZE,e.from(t));return n<<16|s&$.MAX_BMP}static isValidCaptureName(e){if(e.length===0)return!1;for(let t=0;t<e.length;t++){const n=e.codePointAt(t);if(n!==O.CODES.get("_")&&!X.isalnum(n))return!1}return!0}static parseInt(e){const t=e.pos();for(;e.more()&&e.peek()>=O.CODES.get("0")&&e.peek()<=O.CODES.get("9");)e.skip(1);const n=e.from(t);return n.length===0||n.length>1&&n.codePointAt(0)===O.CODES.get("0")?-1:n.length>8?-2:parseInt(n,10)}static isCharClass(e){return e.op===T.Op.LITERAL&&e.runes.length===1||e.op===T.Op.CHAR_CLASS||e.op===T.Op.ANY_CHAR_NOT_NL||e.op===T.Op.ANY_CHAR}static matchRune(e,t){switch(e.op){case T.Op.LITERAL:return e.runes.length===1&&e.runes[0]===t;case T.Op.CHAR_CLASS:for(let n=0;n<e.runes.length;n+=2)if(e.runes[n]<=t&&t<=e.runes[n+1])return!0;return!1;case T.Op.ANY_CHAR_NOT_NL:return t!==O.CODES.get(`
`);case T.Op.ANY_CHAR:return!0}return!1}static mergeCharClass(e,t){switch(e.op){case T.Op.ANY_CHAR:break;case T.Op.ANY_CHAR_NOT_NL:q.matchRune(t,O.CODES.get(`
`))&&(e.op=T.Op.ANY_CHAR);break;case T.Op.CHAR_CLASS:t.op===T.Op.LITERAL?e.runes=new Ln(e.runes).appendLiteral(t.runes[0],t.flags).toArray():e.runes=new Ln(e.runes).appendClass(t.runes).toArray();break;case T.Op.LITERAL:if(t.runes[0]===e.runes[0]&&t.flags===e.flags)break;e.op=T.Op.CHAR_CLASS,e.runes=new Ln().appendLiteral(e.runes[0],e.flags).appendLiteral(t.runes[0],t.flags).toArray();break}}static parseEscape(e){const t=e.pos();if(e.skip(1),!e.more())throw new Ae(q.ERR_TRAILING_BACKSLASH);let n=e.pop();e:switch(n){case O.CODES.get("1"):case O.CODES.get("2"):case O.CODES.get("3"):case O.CODES.get("4"):case O.CODES.get("5"):case O.CODES.get("6"):case O.CODES.get("7"):if(!e.more()||e.peek()<O.CODES.get("0")||e.peek()>O.CODES.get("7"))break;case O.CODES.get("0"):{let s=n-O.CODES.get("0");for(let i=1;i<3&&!(!e.more()||e.peek()<O.CODES.get("0")||e.peek()>O.CODES.get("7"));i++)s=s*8+e.peek()-O.CODES.get("0"),e.skip(1);return s}case O.CODES.get("x"):{if(!e.more())break;if(n=e.pop(),n===O.CODES.get("{")){let o=0,a=0;for(;;){if(!e.more())break e;if(n=e.pop(),n===O.CODES.get("}"))break;const B=X.unhex(n);if(B<0||(a=a*16+B,a>$.MAX_RUNE))break e;o++}if(o===0)break e;return a}const s=X.unhex(n);if(!e.more())break;n=e.pop();const i=X.unhex(n);if(s<0||i<0)break;return s*16+i}case O.CODES.get("a"):return O.CODES.get("\x07");case O.CODES.get("f"):return O.CODES.get("\f");case O.CODES.get("n"):return O.CODES.get(`
`);case O.CODES.get("r"):return O.CODES.get("\r");case O.CODES.get("t"):return O.CODES.get("	");case O.CODES.get("v"):return O.CODES.get("\v");default:if(n<=$.MAX_ASCII&&!X.isalnum(n))return n;break}throw new Ae(q.ERR_INVALID_ESCAPE,e.from(t))}static parseClassChar(e,t){if(!e.more())throw new Ae(q.ERR_MISSING_BRACKET,e.from(t));return e.lookingAt("\\")?q.parseEscape(e):e.pop()}static concatRunes(e,t){for(let n=0;n<t.length;n++)e.push(t[n]);return e}static hasCapture(e){if(e===null)return!1;if(e.op===T.Op.CAPTURE)return!0;if(e.subs){for(let t of e.subs)if(q.hasCapture(t))return!0}return!1}constructor(e,t=0){this.wholeRegexp=e,this.flags=t,this.numCap=0,this.namedGroups=Object.create(null),this.stack=[],this.free=null,this.numRegexp=0,this.numRunes=0,this.repeats=0,this.height=null,this.size=null,this.nlb=0}newRegexp(e){let t=this.free;return t!==null&&t.subs!==null&&t.subs.length>0?(this.free=t.subs[0],t.reinit(),t.op=e):(t=new T(e),this.numRegexp+=1),t}reuse(e){this.height!==null&&this.height.has(e)&&this.height.delete(e),e.subs!==null&&e.subs.length>0&&(e.subs[0]=this.free),this.free=e}checkLimits(e){if(this.numRunes>q.MAX_RUNES)throw new Ae(q.ERR_LARGE);this.checkSize(e),this.checkHeight(e)}checkSize(e){if(this.size===null){if(this.repeats===0&&(this.repeats=1),e.op===T.Op.REPEAT){let t=e.max;t===-1&&(t=e.min),t<=0&&(t=1),t>Math.floor(q.MAX_SIZE/this.repeats)?this.repeats=q.MAX_SIZE:this.repeats*=t}if(this.numRegexp<Math.floor(q.MAX_SIZE/this.repeats))return;this.size=new Map;for(let t of this.stack)this.checkSize(t)}if(this.calcSize(e,!0)>q.MAX_SIZE)throw new Ae(q.ERR_LARGE)}calcSize(e,t=!1){if(!t&&this.size!==null&&this.size.has(e))return this.size.get(e);let n=0;switch(e.op){case T.Op.LITERAL:n=e.runes.length;break;case T.Op.PLB:case T.Op.NLB:case T.Op.CAPTURE:case T.Op.STAR:n=2+this.calcSize(e.subs[0]);break;case T.Op.PLUS:case T.Op.QUEST:n=1+this.calcSize(e.subs[0]);break;case T.Op.CONCAT:for(let s of e.subs)n=n+this.calcSize(s);break;case T.Op.ALTERNATE:for(let s of e.subs)n=n+this.calcSize(s);e.subs.length>1&&(n=n+e.subs.length-1);break;case T.Op.REPEAT:{let s=this.calcSize(e.subs[0]);if(e.max===-1){e.min===0?n=2+s:n=1+e.min*s;break}n=e.max*s+(e.max-e.min);break}}return n=Math.max(1,n),this.size===null&&(this.size=new Map),this.size.set(e,n),n}checkHeight(e){if(!(this.numRegexp<q.MAX_HEIGHT)){if(this.height===null){this.height=new Map;for(let t of this.stack)this.checkHeight(t)}if(this.calcHeight(e,!0)>q.MAX_HEIGHT)throw new Ae(q.ERR_NESTING_DEPTH)}}calcHeight(e,t=!1){if(!t&&this.height!==null&&this.height.has(e))return this.height.get(e);let n=1;for(let s of e.subs){const i=this.calcHeight(s);n<1+i&&(n=1+i)}return this.height===null&&(this.height=new Map),this.height.set(e,n),n}pop(){return this.stack.pop()}popToPseudo(){const e=this.stack.length;let t=e;for(;t>0&&!T.isPseudoOp(this.stack[t-1].op);)t--;const n=this.stack.slice(t,e);return this.stack=this.stack.slice(0,t),n}push(e){if(this.numRunes+=e.runes.length,e.op===T.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]===e.runes[1]){if(this.maybeConcat(e.runes[0],this.flags&-2))return null;e.op=T.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags&-2}else if(e.op===T.Op.CHAR_CLASS&&e.runes.length===4&&e.runes[0]===e.runes[1]&&e.runes[2]===e.runes[3]&&$.simpleFold(e.runes[0])===e.runes[2]&&$.simpleFold(e.runes[2])===e.runes[0]||e.op===T.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]+1===e.runes[1]&&$.simpleFold(e.runes[0])===e.runes[1]&&$.simpleFold(e.runes[1])===e.runes[0]){if(this.maybeConcat(e.runes[0],this.flags|V.FOLD_CASE))return null;e.op=T.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags|V.FOLD_CASE}else this.maybeConcat(-1,0);return this.stack.push(e),this.checkLimits(e),e}maybeConcat(e,t){const n=this.stack.length;if(n<2)return!1;const s=this.stack[n-1],i=this.stack[n-2];return s.op!==T.Op.LITERAL||i.op!==T.Op.LITERAL||(s.flags&V.FOLD_CASE)!==(i.flags&V.FOLD_CASE)?!1:(i.runes=q.concatRunes(i.runes,s.runes),e>=0?(s.runes=[e],s.flags=t,!0):(this.pop(),this.reuse(s),!1))}newLiteral(e,t){const n=this.newRegexp(T.Op.LITERAL);return n.flags=t,(t&V.FOLD_CASE)!==0&&(e=q.minFoldRune(e)),n.runes=[e],n}literal(e){this.push(this.newLiteral(e,this.flags))}op(e){const t=this.newRegexp(e);return t.flags=this.flags,this.push(t)}repeat(e,t,n,s,i,o){let a=this.flags;if((a&V.PERL_X)!==0&&(i.more()&&i.lookingAt("?")&&(i.skip(1),a^=V.NON_GREEDY),o!==-1))throw new Ae(q.ERR_INVALID_REPEAT_OP,i.from(o));const B=this.stack.length;if(B===0)throw new Ae(q.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));const c=this.stack[B-1];if(T.isPseudoOp(c.op))throw new Ae(q.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));const h=this.newRegexp(e);if(h.min=t,h.max=n,h.flags=a,h.subs=[c],this.stack[B-1]=h,this.checkLimits(h),e===T.Op.REPEAT&&(t>=2||n>=2)&&!this.repeatIsValid(h,1e3))throw new Ae(q.ERR_INVALID_REPEAT_SIZE,i.from(s))}repeatIsValid(e,t){if(e.op===T.Op.REPEAT){let n=e.max;if(n===0)return!0;if(n<0&&(n=e.min),n>t)return!1;n>0&&(t=Math.trunc(t/n))}for(let n of e.subs)if(!this.repeatIsValid(n,t))return!1;return!0}concat(){this.maybeConcat(-1,0);const e=this.popToPseudo();return e.length===0?this.push(this.newRegexp(T.Op.EMPTY_MATCH)):this.push(this.collapse(e,T.Op.CONCAT))}alternate(){const e=this.popToPseudo();return e.length>0&&this.cleanAlt(e[e.length-1]),e.length===0?this.push(this.newRegexp(T.Op.NO_MATCH)):this.push(this.collapse(e,T.Op.ALTERNATE))}cleanAlt(e){e.op===T.Op.CHAR_CLASS&&(e.runes=new Ln(e.runes).cleanClass().toArray(),e.runes.length===2&&e.runes[0]===0&&e.runes[1]===$.MAX_RUNE?(e.runes=[],e.op=T.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===O.CODES.get(`
`)-1&&e.runes[2]===O.CODES.get(`
`)+1&&e.runes[3]===$.MAX_RUNE&&(e.runes=[],e.op=T.Op.ANY_CHAR_NOT_NL))}collapse(e,t){if(e.length===1)return e[0];let n=0;for(let a of e)n+=a.op===t?a.subs.length:1;let s=new Array(n).fill(null),i=0;for(let a of e)if(a.op===t){for(let B=0;B<a.subs.length;B++)s[i++]=a.subs[B];this.reuse(a)}else s[i++]=a;let o=this.newRegexp(t);if(o.subs=s,t===T.Op.ALTERNATE&&(o.subs=this.factor(o.subs),o.subs.length===1)){const a=o;o=o.subs[0],this.reuse(a)}return o}factor(e){if(e.length<2)return e;let t=0,n=e.length,s=0,i=null,o=0,a=0,B=0;for(let h=0;h<=n;h++){let f=null,C=0,_=0;if(h<n){let R=e[t+h];if(R.op===T.Op.CONCAT&&R.subs.length>0&&(R=R.subs[0]),R.op===T.Op.LITERAL&&(f=R.runes,C=R.runes.length,_=R.flags&V.FOLD_CASE),_===a){let L=0;for(;L<o&&L<C&&i[L]===f[L];)L++;if(L>0){o=L;continue}}}if(h!==B)if(h===B+1)e[s++]=e[t+B];else{const R=this.newRegexp(T.Op.LITERAL);R.flags=a,R.runes=i.slice(0,o);for(let Q=B;Q<h;Q++)e[t+Q]=this.removeLeadingString(e[t+Q],o),this.checkLimits(e[t+Q]);const L=this.collapse(e.slice(t+B,t+h),T.Op.ALTERNATE),G=this.newRegexp(T.Op.CONCAT);G.subs=[R,L],e[s++]=G}B=h,i=f,o=C,a=_}n=s,t=0,B=0,s=0;let c=null;for(let h=0;h<=n;h++){let f=null;if(!(h<n&&(f=q.leadingRegexp(e[t+h]),c!==null&&c.equals(f)&&(q.isCharClass(c)||c.op===T.Op.REPEAT&&c.min===c.max&&q.isCharClass(c.subs[0]))))){if(h!==B)if(h===B+1)e[s++]=e[t+B];else{const C=c;for(let L=B;L<h;L++){const G=L!==B;e[t+L]=this.removeLeadingRegexp(e[t+L],G),this.checkLimits(e[t+L])}const _=this.collapse(e.slice(t+B,t+h),T.Op.ALTERNATE),R=this.newRegexp(T.Op.CONCAT);R.subs=[C,_],e[s++]=R}B=h,c=f}}n=s,t=0,B=0,s=0;for(let h=0;h<=n;h++)if(!(h<n&&q.isCharClass(e[t+h]))){if(h!==B)if(h===B+1)e[s++]=e[t+B];else{let f=B;for(let _=B+1;_<h;_++){const R=e[t+f],L=e[t+_];(R.op<L.op||R.op===L.op&&(R.runes!==null?R.runes.length:0)<(L.runes!==null?L.runes.length:0))&&(f=_)}const C=e[t+B];e[t+B]=e[t+f],e[t+f]=C;for(let _=B+1;_<h;_++)q.mergeCharClass(e[t+B],e[t+_]),this.reuse(e[t+_]);this.cleanAlt(e[t+B]),e[s++]=e[t+B]}h<n&&(e[s++]=e[t+h]),B=h+1}n=s,t=0,B=0,s=0;for(let h=0;h<n;++h)h+1<n&&e[t+h].op===T.Op.EMPTY_MATCH&&e[t+h+1].op===T.Op.EMPTY_MATCH||(e[s++]=e[t+h]);return n=s,t=0,e.slice(t,n)}removeLeadingString(e,t){if(e.op===T.Op.CONCAT&&e.subs.length>0){const n=this.removeLeadingString(e.subs[0],t);if(e.subs[0]=n,n.op===T.Op.EMPTY_MATCH)switch(this.reuse(n),e.subs.length){case 0:case 1:e.op=T.Op.EMPTY_MATCH,e.subs=T.emptySubs();break;case 2:{const s=e;e=e.subs[1],this.reuse(s);break}default:e.subs=e.subs.slice(1,e.subs.length);break}return e}return e.op===T.Op.LITERAL&&(e.runes=e.runes.slice(t,e.runes.length),e.runes.length===0&&(e.op=T.Op.EMPTY_MATCH)),e}removeLeadingRegexp(e,t){if(e.op===T.Op.CONCAT&&e.subs.length>0){switch(t&&this.reuse(e.subs[0]),e.subs=e.subs.slice(1,e.subs.length),e.subs.length){case 0:e.op=T.Op.EMPTY_MATCH,e.subs=T.emptySubs();break;case 1:{const n=e;e=e.subs[0],this.reuse(n);break}}return e}return t&&this.reuse(e),this.newRegexp(T.Op.EMPTY_MATCH)}parseInternal(){if((this.flags&V.LITERAL)!==0)return q.literalRegexp(this.wholeRegexp,this.flags);let e=-1,t=-1,n=-1;const s=new cT(this.wholeRegexp);for(;s.more();){let i=-1;e:switch(s.peek()){case O.CODES.get("("):if((this.flags&V.LOOKBEHIND)!==0){if(s.lookingAt("(?<=")){this.parsePosLookBehind(),s.skip(4);break}if(s.lookingAt("(?<!")){this.parseNegLookBehind(),s.skip(4);break}}if((this.flags&V.PERL_X)!==0&&s.lookingAt("(?")){this.parsePerlFlags(s);break}this.op(T.Op.LEFT_PAREN).cap=++this.numCap,s.skip(1);break;case O.CODES.get("|"):this.parseVerticalBar(),s.skip(1);break;case O.CODES.get(")"):this.parseRightParen(),s.skip(1);break;case O.CODES.get("^"):(this.flags&V.ONE_LINE)!==0?this.op(T.Op.BEGIN_TEXT):this.op(T.Op.BEGIN_LINE),s.skip(1);break;case O.CODES.get("$"):(this.flags&V.ONE_LINE)!==0?this.op(T.Op.END_TEXT).flags|=V.WAS_DOLLAR:this.op(T.Op.END_LINE),s.skip(1);break;case O.CODES.get("."):(this.flags&V.DOT_NL)!==0?this.op(T.Op.ANY_CHAR):this.op(T.Op.ANY_CHAR_NOT_NL),s.skip(1);break;case O.CODES.get("["):this.parseClass(s);break;case O.CODES.get("*"):case O.CODES.get("+"):case O.CODES.get("?"):{i=s.pos();let o=null;switch(s.pop()){case O.CODES.get("*"):o=T.Op.STAR;break;case O.CODES.get("+"):o=T.Op.PLUS;break;case O.CODES.get("?"):o=T.Op.QUEST;break}this.repeat(o,t,n,i,s,e);break}case O.CODES.get("{"):{i=s.pos();const o=q.parseRepeat(s);if(o<0){s.rewindTo(i),this.literal(s.pop());break}t=o>>16,n=(o&$.MAX_BMP)<<16>>16,this.repeat(T.Op.REPEAT,t,n,i,s,e);break}case O.CODES.get("\\"):{const o=s.pos();if(s.skip(1),(this.flags&V.PERL_X)!==0&&s.more())switch(s.pop()){case O.CODES.get("A"):this.op(T.Op.BEGIN_TEXT);break e;case O.CODES.get("b"):this.op(T.Op.WORD_BOUNDARY);break e;case O.CODES.get("B"):this.op(T.Op.NO_WORD_BOUNDARY);break e;case O.CODES.get("C"):throw new Ae(q.ERR_INVALID_ESCAPE,"\\C");case O.CODES.get("Q"):{let c=s.rest();const h=c.indexOf("\\E");h>=0?(c=c.substring(0,h),s.skipString(c),s.skipString("\\E")):s.skipString(c);let f=0;for(;f<c.length;){const C=c.codePointAt(f);this.literal(C),f+=X.charCount(C)}break e}case O.CODES.get("z"):this.op(T.Op.END_TEXT);break e;default:s.rewindTo(o);break}else s.rewindTo(o);const a=this.newRegexp(T.Op.CHAR_CLASS);if(a.flags=this.flags,s.lookingAt("\\p")||s.lookingAt("\\P")){const c=new Ln;if(this.parseUnicodeClass(s,c)){a.runes=c.toArray(),this.push(a);break e}}const B=new Ln;if(this.parsePerlClassEscape(s,B)){a.runes=B.toArray(),this.push(a);break e}s.rewindTo(o),this.reuse(a),this.literal(q.parseEscape(s));break}default:this.literal(s.pop());break}e=i}if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length!==1)throw new Ae(q.ERR_MISSING_PAREN,this.wholeRegexp);return this.stack[0].namedGroups=this.namedGroups,this.stack[0]}parsePerlFlags(e){const t=e.pos(),n=e.rest();if(n.startsWith("(?P<")||n.startsWith("(?<")){const a=n.charAt(2)==="P"?4:3,B=n.indexOf(">");if(B<0)throw new Ae(q.ERR_INVALID_NAMED_CAPTURE,n);const c=n.substring(a,B);if(e.skipString(c),e.skip(a+1),!q.isValidCaptureName(c))throw new Ae(q.ERR_INVALID_NAMED_CAPTURE,n.substring(0,B+1));const h=this.op(T.Op.LEFT_PAREN);if(h.cap=++this.numCap,this.namedGroups[c])throw new Ae(q.ERR_DUPLICATE_NAMED_CAPTURE,c);this.namedGroups[c]=this.numCap,h.name=c;return}e.skip(2);let s=this.flags,i=1,o=!1;e:for(;e.more();){const a=e.pop();switch(a){case O.CODES.get("i"):s|=V.FOLD_CASE,o=!0;break;case O.CODES.get("m"):s&=-17,o=!0;break;case O.CODES.get("s"):s|=V.DOT_NL,o=!0;break;case O.CODES.get("U"):s|=V.NON_GREEDY,o=!0;break;case O.CODES.get("-"):if(i<0)break e;i=-1,s=~s,o=!1;break;case O.CODES.get(":"):case O.CODES.get(")"):if(i<0){if(!o)break e;s=~s}a===O.CODES.get(":")&&this.op(T.Op.LEFT_PAREN),this.flags=s;return;default:break e}}throw new Ae(q.ERR_INVALID_PERL_OP,e.from(t))}parsePosLookBehind(){const e=this.newRegexp(T.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=++this.nlb,this.push(e)}parseNegLookBehind(){const e=this.newRegexp(T.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=-++this.nlb,this.push(e)}parseVerticalBar(){this.concat(),this.swapVerticalBar()||this.op(T.Op.VERTICAL_BAR)}swapVerticalBar(){const e=this.stack.length;if(e>=3&&this.stack[e-2].op===T.Op.VERTICAL_BAR&&q.isCharClass(this.stack[e-1])&&q.isCharClass(this.stack[e-3])){let t=this.stack[e-1],n=this.stack[e-3];if(t.op>n.op){const s=n;n=t,t=s,this.stack[e-3]=n}return q.mergeCharClass(n,t),this.reuse(t),this.pop(),!0}if(e>=2){const t=this.stack[e-1],n=this.stack[e-2];if(n.op===T.Op.VERTICAL_BAR)return e>=3&&this.cleanAlt(this.stack[e-3]),this.stack[e-2]=t,this.stack[e-1]=n,!0}return!1}parseRightParen(){if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length<2)throw new Ae(q.ERR_UNEXPECTED_PAREN,this.wholeRegexp);const e=this.pop(),t=this.pop();if(t.op!==T.Op.LEFT_PAREN)throw new Ae(q.ERR_UNEXPECTED_PAREN,this.wholeRegexp);if(this.flags=t.flags,t.lb!==0){if(q.hasCapture(e))throw new Ae(q.ERR_INVALID_CAPTURE_IN_LOOKBEHIND,this.wholeRegexp);t.lb>0?t.op=T.Op.PLB:t.op=T.Op.NLB,t.subs=[e],this.push(t);return}t.cap===0?this.push(e):(t.op=T.Op.CAPTURE,t.subs=[e],this.push(t))}parsePerlClassEscape(e,t){const n=e.pos();if((this.flags&V.PERL_X)===0||!e.more()||e.pop()!==O.CODES.get("\\")||!e.more())return!1;e.pop();const s=e.from(n),i=cd.has(s)?cd.get(s):null;return i===null?!1:(t.appendGroup(i,(this.flags&V.FOLD_CASE)!==0),!0)}parseNamedClass(e,t){const n=e.rest(),s=n.indexOf(":]");if(s<0)return!1;const i=n.substring(0,s+2);e.skipString(i);const o=Td.has(i)?Td.get(i):null;if(o===null)throw new Ae(q.ERR_INVALID_CHAR_RANGE,i);return t.appendGroup(o,(this.flags&V.FOLD_CASE)!==0),!0}parseUnicodeClass(e,t){const n=e.pos();if((this.flags&V.UNICODE_GROUPS)===0||!e.lookingAt("\\p")&&!e.lookingAt("\\P"))return!1;e.skip(1);let s=1,i=e.pop();if(i===O.CODES.get("P")&&(s=-1),!e.more())throw e.rewindTo(n),new Ae(q.ERR_INVALID_CHAR_RANGE,e.rest());i=e.pop();let o;if(i!==O.CODES.get("{"))o=X.runeToString(i);else{const h=e.rest(),f=h.indexOf("}");if(f<0)throw e.rewindTo(n),new Ae(q.ERR_INVALID_CHAR_RANGE,e.rest());o=h.substring(0,f),e.skipString(o),e.skip(1)}o.length!==0&&o.codePointAt(0)===O.CODES.get("^")&&(s=0-s,o=o.substring(1));const a=q.unicodeTable(o);if(a===null)throw new Ae(q.ERR_INVALID_CHAR_RANGE,e.from(n));a.sign<0&&(s=0-s);const B=a.tab,c=a.fold;if((this.flags&V.FOLD_CASE)===0||c===null)t.appendTableWithSign(B,s);else{const h=new Ln().appendTable(B).appendTable(c).cleanClass().toArray();t.appendClassWithSign(h,s)}return!0}parseClass(e){const t=e.pos();e.skip(1);const n=this.newRegexp(T.Op.CHAR_CLASS);n.flags=this.flags;const s=new Ln;let i=1;e.more()&&e.lookingAt("^")&&(i=-1,e.skip(1),(this.flags&V.CLASS_NL)===0&&s.appendRange(O.CODES.get(`
`),O.CODES.get(`
`)));let o=!0;for(;!e.more()||e.peek()!==O.CODES.get("]")||o;){if(e.more()&&e.lookingAt("-")&&(this.flags&V.PERL_X)===0&&!o){const h=e.rest();if(h==="-"||!h.startsWith("-]"))throw e.rewindTo(t),new Ae(q.ERR_INVALID_CHAR_RANGE,e.rest())}o=!1;const a=e.pos();if(e.lookingAt("[:")){if(this.parseNamedClass(e,s))continue;e.rewindTo(a)}if(this.parseUnicodeClass(e,s)||this.parsePerlClassEscape(e,s))continue;e.rewindTo(a);const B=q.parseClassChar(e,t);let c=B;if(e.more()&&e.lookingAt("-")){if(e.skip(1),e.more()&&e.lookingAt("]"))e.skip(-1);else if(c=q.parseClassChar(e,t),c<B)throw new Ae(q.ERR_INVALID_CHAR_RANGE,e.from(a))}(this.flags&V.FOLD_CASE)===0?s.appendRange(B,c):s.appendFoldedRange(B,c)}e.skip(1),s.cleanClass(),i<0&&s.negateClass(),n.runes=s.toArray(),this.push(n)}},j(q,"ERR_INTERNAL_ERROR","regexp/syntax: internal error"),j(q,"ERR_INVALID_CHAR_RANGE","invalid character class range"),j(q,"ERR_INVALID_ESCAPE","invalid escape sequence"),j(q,"ERR_INVALID_NAMED_CAPTURE","invalid named capture"),j(q,"ERR_INVALID_PERL_OP","invalid or unsupported Perl syntax"),j(q,"ERR_INVALID_REPEAT_OP","invalid nested repetition operator"),j(q,"ERR_INVALID_REPEAT_SIZE","invalid repeat count"),j(q,"ERR_MISSING_BRACKET","missing closing ]"),j(q,"ERR_MISSING_PAREN","missing closing )"),j(q,"ERR_MISSING_REPEAT_ARGUMENT","missing argument to repetition operator"),j(q,"ERR_TRAILING_BACKSLASH","trailing backslash at end of expression"),j(q,"ERR_DUPLICATE_NAMED_CAPTURE","duplicate capture group name"),j(q,"ERR_UNEXPECTED_PAREN","unexpected )"),j(q,"ERR_NESTING_DEPTH","expression nests too deeply"),j(q,"ERR_LARGE","expression too large"),j(q,"ERR_INVALID_CAPTURE_IN_LOOKBEHIND","invalid capture in lookbehind"),j(q,"MAX_HEIGHT",1e3),j(q,"MAX_SIZE",3355443),j(q,"MAX_RUNES",33554432),j(q,"ANY_TABLE",new g(new Uint32Array([0,$.MAX_RUNE,1]))),j(q,"ASCII_TABLE",new g(new Uint32Array([0,127,1]))),j(q,"ASCII_FOLD_TABLE",new g(new Uint32Array([0,127,1,383,383,1,8490,8490,1]))),q),hT=class Tr{static initTest(e){const t=Tr.compile(e),n=new Tr(t.expr,t.prog,t.numSubexp,t.longest);return n.cond=t.cond,n.prefix=t.prefix,n.prefixUTF8=t.prefixUTF8,n.prefixComplete=t.prefixComplete,n.prefixRune=t.prefixRune,n.prefilter=t.prefilter,n}static compile(e){return Tr.compileImpl(e,V.PERL,!1)}static compilePOSIX(e){return Tr.compileImpl(e,V.POSIX,!0)}static compileImpl(e,t,n){let s=lT.parse(e,t);const i=s.maxCap();s=BT.simplify(s);const o=oT.build(s),a=uT.compileRegexp(s),B=new Tr(e,a,i,n);B.prefilter=o.type===pe.Type.NONE?null:o;const[c,h]=a.prefix();return B.prefixComplete=c,B.prefix=h,B.prefixUTF8=X.stringToUtf8ByteArray(B.prefix),B.prefix.length>0&&(B.prefixRune=B.prefix.codePointAt(0)),B.namedGroups=s.namedGroups,B}static match(e,t){return Tr.compile(e).match(t)}constructor(e,t,n=0,s=0){this.expr=e,this.prog=t,this.numSubexp=n,this.longest=s,this.cond=t.startCond(),this.prefix=null,this.prefixUTF8=null,this.prefixComplete=!1,this.prefixRune=0,this.machinePool=[],this.dfa=new Ww(this.prog),this.onepass=id.compile(this.prog),this.prefilter=null}matchPrefixComplete(e,t,n,s){if((n===V.ANCHOR_START||n===V.ANCHOR_BOTH)&&t!==0)return null;let i=-1,o=-1;const a=e.prefixLength(this);if(n===V.UNANCHORED){const B=e.index(this,t);if(B<0)return null;i=t+B,o=i+a}else if(n===V.ANCHOR_BOTH){if(e.endPos()!==a||e.index(this,0)!==0)return null;i=0,o=a}else if(n===V.ANCHOR_START){if(e.index(this,0)!==0)return null;i=0,o=a}if(i<0)return null;if(s>0){const B=new Int32Array(s).fill(-1);return B[0]=i,B[1]=o,Array.from(B)}return[]}executeEngine(e,t,n,s){if(this.prefixComplete&&(s===0||this.numSubexp===0))return this.matchPrefixComplete(e,t,n,s);if(this.prefilter!==null&&n===V.UNANCHORED&&!this.prefilter.eval(e,t))return null;if(this.onepass!==null)return id.execute(this,e,t,n,s);if(s>0)return this.prog.numLb===0&&e.endPos()<=da.maxBitStateLen(this.prog)?da.execute(this,e,t,n,s):this.doExecuteNFA(e,t,n,s);if(this.prog.numLb===0){const i=this.dfa.match(e,t,n);if(i!==null)return i?[]:null;if(e.endPos()<=da.maxBitStateLen(this.prog))return da.execute(this,e,t,n,s)}return this.doExecuteNFA(e,t,n,s)}numberOfCapturingGroups(){return this.numSubexp}numberOfInstructions(){return this.prog.numInst()}get(){return this.machinePool.length>0?this.machinePool.pop():null}reset(){this.machinePool.length=0}put(e){this.machinePool.push(e)}toString(){return this.expr}doExecuteNFA(e,t,n,s){let i=this.get();i||(i=zw.fromRE2(this)),i.init(s);const o=i.match(e,t,n)?i.submatches():null;return this.put(i),o}match(e){return this.executeEngine(Se.fromUTF16(e),0,V.UNANCHORED,0)!==null}matchWithGroup(e,t,n,s,i){return e instanceof Jr||(X.isByteArray(e)?e=Or.utf8(e):e=Or.utf16(e)),this.matchMachineInput(e,t,n,s,i)}matchMachineInput(e,t,n,s,i){if(t>n)return[!1,null];const o=e.isUTF16Encoding()?Se.fromUTF16(e.asCharSequence(),0,n):Se.fromUTF8(e.asBytes(),0,n),a=this.executeEngine(o,t,s,2*i);return a===null?[!1,null]:[!0,a]}matchUTF8(e){return this.executeEngine(Se.fromUTF8(e),0,V.UNANCHORED,0)!==null}replaceAll(e,t){return this.replaceAllFunc(e,()=>t,2*e.length+1)}replaceFirst(e,t){return this.replaceAllFunc(e,()=>t,1)}replaceAllFunc(e,t,n){let s=0,i=0,o="";const a=Se.fromUTF16(e);let B=0;for(;i<=e.length;){const c=this.executeEngine(a,i,V.UNANCHORED,2);if(c===null||c.length===0)break;o+=e.substring(s,c[0]),(c[1]>s||c[0]===0)&&(o+=t(e.substring(c[0],c[1])),B++),s=c[1];const h=a.step(i)&7;if(i+h>c[1]?i+=h:i+1>c[1]?i++:i=c[1],B>=n)break}return o+=e.substring(s),o}pad(e){if(e===null)return null;let t=(1+this.numSubexp)*2;if(e.length<t){let n=new Array(t).fill(-1);for(let s=0;s<e.length;s++)n[s]=e[s];e=n}return e}allMatches(e,t,n=s=>s){let s=[];const i=e.endPos();t<0&&(t=i+1);let o=0,a=0,B=-1;for(;a<t&&o<=i;){const c=this.executeEngine(e,o,V.UNANCHORED,this.prog.numCap);if(c===null||c.length===0)break;let h=!0;if(c[1]===o){c[0]===B&&(h=!1);const f=e.step(o);f<0?o=i+1:o+=f&7}else o=c[1];B=c[1],h&&(s.push(n(this.pad(c))),a++)}return s}findUTF8(e){const t=this.executeEngine(Se.fromUTF8(e),0,V.UNANCHORED,2);return t===null?null:e.slice(t[0],t[1])}findUTF8Index(e){const t=this.executeEngine(Se.fromUTF8(e),0,V.UNANCHORED,2);return t===null?null:t.slice(0,2)}find(e){const t=this.executeEngine(Se.fromUTF16(e),0,V.UNANCHORED,2);return t===null?"":e.substring(t[0],t[1])}findIndex(e){return this.executeEngine(Se.fromUTF16(e),0,V.UNANCHORED,2)}findUTF8Submatch(e){const t=this.executeEngine(Se.fromUTF8(e),0,V.UNANCHORED,this.prog.numCap);if(t===null)return null;const n=new Array(1+this.numSubexp).fill(null);for(let s=0;s<n.length;s++)2*s<t.length&&t[2*s]>=0&&(n[s]=e.slice(t[2*s],t[2*s+1]));return n}findUTF8SubmatchIndex(e){return this.pad(this.executeEngine(Se.fromUTF8(e),0,V.UNANCHORED,this.prog.numCap))}findSubmatch(e){const t=this.executeEngine(Se.fromUTF16(e),0,V.UNANCHORED,this.prog.numCap);if(t===null)return null;const n=new Array(1+this.numSubexp).fill(null);for(let s=0;s<n.length;s++)2*s<t.length&&t[2*s]>=0&&(n[s]=e.substring(t[2*s],t[2*s+1]));return n}findSubmatchIndex(e){return this.pad(this.executeEngine(Se.fromUTF16(e),0,V.UNANCHORED,this.prog.numCap))}findAllUTF8(e,t){const n=this.allMatches(Se.fromUTF8(e),t,s=>e.slice(s[0],s[1]));return n.length===0?null:n}findAllUTF8Index(e,t){const n=this.allMatches(Se.fromUTF8(e),t,s=>s.slice(0,2));return n.length===0?null:n}findAll(e,t){const n=this.allMatches(Se.fromUTF16(e),t,s=>e.substring(s[0],s[1]));return n.length===0?null:n}findAllIndex(e,t){const n=this.allMatches(Se.fromUTF16(e),t,s=>s.slice(0,2));return n.length===0?null:n}findAllUTF8Submatch(e,t){const n=this.allMatches(Se.fromUTF8(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.slice(s[2*o],s[2*o+1]));return i});return n.length===0?null:n}findAllUTF8SubmatchIndex(e,t){const n=this.allMatches(Se.fromUTF8(e),t);return n.length===0?null:n}findAllSubmatch(e,t){const n=this.allMatches(Se.fromUTF16(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.substring(s[2*o],s[2*o+1]));return i});return n.length===0?null:n}findAllSubmatchIndex(e,t){const n=this.allMatches(Se.fromUTF16(e),t);return n.length===0?null:n}},fT=class _s{static isHexadecimal(e){return"0"<=e&&e<="9"||"A"<=e&&e<="F"||"a"<=e&&e<="f"}static translate(e){let t="";if(e instanceof RegExp&&(e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.dotAll&&(t+="s"),e=e.source),typeof e!="string")return e;let n="",s=!1,i=e.length;i===0&&(n="(?:)",s=!0);let o=!1,a=0;for(;a<i;){let c=e[a];if(c==="\\"){if(a+1<i)switch(c=e[a+1],c){case"\\":n+="\\\\",a+=2;continue;case"c":if(a+2<i){let C=e[a+2].charCodeAt(0);if(C>=65&&C<=90||C>=97&&C<=122){let _=C%32;n+="\\x",n+=(_>>4).toString(16).toUpperCase(),n+=(_&15).toString(16).toUpperCase(),a+=3,s=!0;continue}}n+="c",a+=2,s=!0;continue;case"u":if(a+2<i){if(e[a+2]==="{"){let C=a+3,_=!1,R=!1;for(;C<i;){const L=e[C];if(L==="}"){R=!0;break}if(!_s.isHexadecimal(L))break;_=!0,C++}if(R&&_){n+="\\x",a+=2,s=!0;continue}}else if(a+5<i){let C=!0;for(let _=0;_<4;_++)if(!_s.isHexadecimal(e[a+2+_])){C=!1;break}if(C){n+="\\x{"+e.substring(a+2,a+6)+"}",a+=6,s=!0;continue}}}n+="u",a+=2,s=!0;continue;case"x":{let C=!1;if(a+2<i&&e[a+2]==="{"){let _=a+3,R=!1,L=!1;for(;_<i;){const G=e[_];if(G==="}"){L=!0;break}if(!_s.isHexadecimal(G))break;R=!0,_++}L&&R&&(C=!0)}else a+3<i&&_s.isHexadecimal(e[a+2])&&_s.isHexadecimal(e[a+3])&&(C=!0);C?(n+="\\x",a+=2):(n+="x",a+=2,s=!0);continue}case"n":case"r":case"t":case"a":case"f":case"v":case"d":case"D":case"s":case"S":case"w":case"W":case"b":case"B":case"p":case"P":case"A":case"z":case"Q":case"E":case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":n+="\\"+c,a+=2;continue;default:{let C=e.codePointAt(a+1);if(C>=48&&C<=57||C>=65&&C<=90||C>=97&&C<=122){let _=X.charCount(C);n+=e.substring(a+1,a+1+_),a+=_+1,s=!0}else{n+="\\";let _=X.charCount(C);n+=e.substring(a+1,a+1+_),a+=_+1}continue}}}else if(c==="/"){n+="\\/",a+=1,s=!0;continue}else if(c==="[")o=!0;else if(c==="]")o=!1;else if(!o&&c==="("&&a+2<i&&e[a+1]==="?"&&e[a+2]==="<"&&a+3<i&&!"=!>)".includes(e[a+3])){n+="(?P<",a+=3,s=!0;continue}let h=e.codePointAt(a),f=X.charCount(h);n+=e.substring(a,a+f),a+=f}const B=s?n:e;return t.length>0?`(?${t})${B}`:B}},Me,tl=(Me=class{static quote(e){return X.quoteMeta(e)}static quoteReplacement(e,t=!1){return td.quoteReplacement(e,t)}static translateRegExp(e){return fT.translate(e)}static compile(e,t=0){let n=e;if((t&Me.CASE_INSENSITIVE)!==0&&(n=`(?i)${n}`),(t&Me.DOTALL)!==0&&(n=`(?s)${n}`),(t&Me.MULTILINE)!==0&&(n=`(?m)${n}`),(t&-544)!==0)throw new Jw("Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS, LONGEST_MATCH, LOOKBEHINDS");let s=V.PERL;(t&Me.DISABLE_UNICODE_GROUPS)!==0&&(s&=-129),(t&Me.LOOKBEHINDS)!==0&&(s|=V.LOOKBEHIND);const i=new Me(e,t);return i.re2Input=hT.compileImpl(n,s,(t&Me.LONGEST_MATCH)!==0),i}static matches(e,t){return Me.compile(e).testExact(t)}static initTest(e,t,n){if(e==null)throw new Error("pattern is null");if(n==null)throw new Error("re2 is null");const s=new Me(e,t);return s.re2Input=n,s}constructor(e,t){this.patternInput=e,this.flagsInput=t,this.re2Input=null}reset(){this.re2Input.reset()}flags(){return this.flagsInput}pattern(){return this.patternInput}re2(){return this.re2Input}matches(e){return this.testExact(e)}matcher(e){return X.isByteArray(e)&&(e=Or.utf8(e)),new td(this,e)}test(e){return X.isByteArray(e)?this.re2Input.matchUTF8(e):this.re2Input.match(e)}testExact(e){const t=X.isByteArray(e)?Se.fromUTF8(e):Se.fromUTF16(e);return this.re2Input.executeEngine(t,0,V.ANCHOR_BOTH,0)!==null}exec(e){const t=this.matcher(e);if(!t.find())return null;const n=[t.group(0)];for(let i=1;i<=t.groupCount();i++){const o=t.group(i);n.push(o===null?void 0:o)}n.index=t.start(0),n.input=e;const s=this.namedGroups();if(Object.keys(s).length>0){const i=t.getNamedGroups();for(const o in i)i[o]===null&&(i[o]=void 0);n.groups=i}else n.groups=void 0;return n}split(e,t=0){const n=this.matcher(e),s=[];let i=0,o=0;for(;n.find();){if(o===0&&n.end()===0){o=n.end();continue}if(t>0&&s.length===t-1)break;if(o===n.start()){if(t===0){i+=1,o=n.end();continue}}else for(;i>0;)s.push(""),i-=1;s.push(n.substring(o,n.start())),o=n.end()}if(t===0&&o!==n.inputLength()){for(;i>0;)s.push(""),i-=1;s.push(n.substring(o,n.inputLength()))}return(t!==0||s.length===0&&!(o===n.inputLength()&&o>0))&&s.push(n.substring(o,n.inputLength())),s}*matchAll(e){const t=this.matcher(e);for(;t.find();){const n=[t.group(0)];for(let i=1;i<=t.groupCount();i++){const o=t.group(i);n.push(o===null?void 0:o)}n.index=t.start(0),n.input=e;const s=this.namedGroups();if(Object.keys(s).length>0){const i=t.getNamedGroups();for(const o in i)i[o]===null&&(i[o]=void 0);n.groups=i}else n.groups=void 0;yield n}}toString(){return this.patternInput}programSize(){return this.re2Input.numberOfInstructions()}groupCount(){return this.re2Input.numberOfCapturingGroups()}namedGroups(){return this.re2Input.namedGroups}equals(e){return this===e?!0:e===null||this.constructor!==e.constructor?!1:this.flagsInput===e.flagsInput&&this.patternInput===e.patternInput}},j(Me,"CASE_INSENSITIVE",ls.CASE_INSENSITIVE),j(Me,"DOTALL",ls.DOTALL),j(Me,"MULTILINE",ls.MULTILINE),j(Me,"DISABLE_UNICODE_GROUPS",ls.DISABLE_UNICODE_GROUPS),j(Me,"LONGEST_MATCH",ls.LONGEST_MATCH),j(Me,"LOOKBEHINDS",ls.LOOKBEHINDS),Me);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ni="12.18.0";function dT(r){ni=r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zr=new jc("@firebase/firestore");function Ds(){return zr.logLevel}function M(r,...e){if(zr.logLevel<=ce.DEBUG){const t=e.map(nl);zr.debug(`Firestore (${ni}): ${r}`,...t)}}function ke(r,...e){if(zr.logLevel<=ce.ERROR){const t=e.map(nl);zr.error(`Firestore (${ni}): ${r}`,...t)}}function Ft(r,...e){if(zr.logLevel<=ce.WARN){const t=e.map(nl);zr.warn(`Firestore (${ni}): ${r}`,...t)}}function nl(r){if(typeof r=="string")return r;try{return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,gg(r,n,t)}function gg(r,e,t){let n=`FIRESTORE (${ni}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw ke(n),new Error(n)}function U(r,e,t,n){let s="Unexpected state";typeof t=="string"?s=t:n=t,r||gg(e,s,n)}function Y(r,e){return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CT(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=CT(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%62))}return n}}function ie(r,e){return r<e?-1:r>e?1:0}function cc(r,e){const t=Math.min(r.length,e.length);for(let n=0;n<t;n++){const s=r.charAt(n),i=e.charAt(n);if(s!==i)return LB(s)===LB(i)?ie(s,i):LB(s)?1:-1}return ie(r.length,e.length)}const pT=55296,gT=57343;function LB(r){const e=r.charCodeAt(0);return e>=pT&&e<=gT}function Ns(r,e,t){return r.length===e.length&&r.every(((n,s)=>t(n,e[s])))}function mg(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te{constructor(e,t){this.comparator=e,this.root=t||Xe.EMPTY}insert(e,t){return new Te(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Xe.BLACK,null,null))}remove(e){return new Te(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Xe.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new pa(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new pa(this.root,e,this.comparator,!1)}getReverseIterator(){return new pa(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new pa(this.root,e,this.comparator,!0)}}class pa{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Xe{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n??Xe.RED,this.left=s??Xe.EMPTY,this.right=i??Xe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new Xe(e??this.key,t??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Xe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return Xe.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Xe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Xe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw W(43730,{key:this.key,value:this.value});if(this.right.isRed())throw W(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw W(27949);return e+(this.isRed()?0:1)}}Xe.EMPTY=null,Xe.RED=!0,Xe.BLACK=!1;Xe.EMPTY=new class{constructor(){this.size=0}get key(){throw W(57766)}get value(){throw W(16141)}get color(){throw W(16727)}get left(){throw W(29726)}get right(){throw W(36894)}copy(e,t,n,s,i){return this}insert(e,t,n){return new Xe(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me{constructor(e){this.comparator=e,this.data=new Te(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Ad(this.data.getIterator())}getIteratorFrom(e){return new Ad(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((n=>{t=t.add(n)})),t}isEqual(e){if(!(e instanceof me)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new me(this.comparator);return t.data=e,t}}class Ad{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function hs(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const F={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class H extends un{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kt="__name__";class jt{constructor(e,t,n){t===void 0?t=0:t>e.length&&W(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&W(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return jt.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof jt?e.forEach((n=>{t.push(n)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=jt.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return ie(e.length,t.length)}static compareSegments(e,t){const n=jt.isNumericId(e),s=jt.isNumericId(t);return n&&!s?-1:!n&&s?1:n&&s?jt.extractNumericId(e).compare(jt.extractNumericId(t)):cc(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Yn.fromString(e.substring(4,e.length-2))}}class Be extends jt{construct(e,t,n){return new Be(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new H(F.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((s=>s.length>0)))}return new Be(t)}static emptyPath(){return new Be([])}}const mT=/^[_a-zA-Z][_a-zA-Z0-9]*$/;let Ke=class Is extends jt{construct(e,t,n){return new Is(e,t,n)}static isValidIdentifier(e){return mT.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Is.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Kt}static keyField(){return new Is([Kt])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new H(F.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;s<e.length;){const a=e[s];if(a==="\\"){if(s+1===e.length)throw new H(F.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const B=e[s+1];if(B!=="\\"&&B!=="."&&B!=="`")throw new H(F.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=B,s+=2}else a==="`"?(o=!o,s++):a!=="."||o?(n+=a,s++):(i(),s++)}if(i(),o)throw new H(F.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Is(t)}static emptyPath(){return new Is([])}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(e){this.fields=e,e.sort(Ke.comparator)}static empty(){return new pt([])}unionWith(e){let t=new me(Ke.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new pt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Ns(this.fields,e.fields,((t,n)=>t.isEqual(n)))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qa(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function fr(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function ET(r,e){const t=[];for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&t.push(e(r[n],n,r));return t}function Eg(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J{constructor(e){this.path=e}static fromPath(e){return new J(Be.fromString(e))}static fromName(e){return new J(Be.fromString(e).popFirst(5))}static empty(){return new J(Be.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Be.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Be.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new J(new Be(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _g(r,e,t){if(!t)throw new H(F.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function _T(r,e,t,n){if(e===!0&&n===!0)throw new H(F.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Rd(r){if(!J.isDocumentKey(r))throw new H(F.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function vd(r){if(J.isDocumentKey(r))throw new H(F.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function So(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function wu(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":W(12329,{type:typeof r})}function lt(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new H(F.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=wu(r);throw new H(F.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function DT(r,e){if(e<=0)throw new H(F.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ge(r,e){const t={typeString:r};return e&&(t.value=e),t}function Po(r,e){if(!So(r))throw new H(F.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const s=e[n].typeString,i="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){t=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${n}' field to equal '${i.value}'`;break}}if(t)throw new H(F.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bd=-62135596800,Sd=1e6;class Ee{static now(){return Ee.fromMillis(Date.now())}static fromDate(e){return Ee.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*Sd);return new Ee(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new H(F.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new H(F.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<bd)throw new H(F.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new H(F.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Sd}_compareTo(e){return this.seconds===e.seconds?ie(this.nanoseconds,e.nanoseconds):ie(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Ee._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Po(e,Ee._jsonSchema))return new Ee(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-bd;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Ee._jsonSchemaVersion="firestore/timestamp/1.0",Ee._jsonSchema={type:Ge("string",Ee._jsonSchemaVersion),seconds:Ge("number"),nanoseconds:Ge("number")};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dg extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Dg("Invalid base64 string: "+i):i}})(e);return new Ne(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new Ne(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ie(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ne.EMPTY_BYTE_STRING=new Ne("");const IT=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function In(r){if(U(!!r,39018),typeof r=="string"){let e=0;const t=IT.exec(r);if(U(!!t,46558,{timestamp:r}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:Re(r.seconds),nanos:Re(r.nanos)}}function Re(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function yn(r){return typeof r=="string"?Ne.fromBase64String(r):Ne.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ig="server_timestamp",yg="__type__",wg="__previous_value__",Tg="__local_write_time__";function Tu(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[yg])==null?void 0:n.stringValue)===Ig}function No(r){const e=r.mapValue.fields[wg];return Tu(e)?No(e):e}function Os(r){const e=In(r.mapValue.fields[Tg].timestampValue);return new Ee(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yT{constructor(e,t,n,s,i,o,a,B,c,h,f,C,_){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=B,this.useFetchStreams=c,this.isUsingEmulator=h,this.apiKey=f,this._customHeaders=C,this.grpcFlowControlWindow=_}}const $a="(default)";class Qr{constructor(e,t){this.projectId=e,this.database=t||$a}static empty(){return new Qr("","")}get isDefaultDatabase(){return this.database===$a}isEqual(e){return e instanceof Qr&&e.projectId===this.projectId&&e.database===this.database}}function wT(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new H(F.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Qr(r.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vr=-1;function Au(r){return r==null}function Fs(r){return r===0&&1/r==-1/0}function Ag(r){return typeof r=="number"&&Number.isInteger(r)&&!Fs(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}function TT(r){return typeof r=="string"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sl="__type__",Rg="__max__",$n={mapValue:{fields:{__type__:{stringValue:Rg}}}},il="__vector__",$r="value",en={nullValue:"NULL_VALUE"},Et={booleanValue:!0},Ye={booleanValue:!1};function He(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Tu(r)?4:vg(r)?9007199254740991:Wr(r)?10:11:W(28295,{value:r})}function xt(r,e,t){if(r===e)return!0;const n=He(r);if(n!==He(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return Os(r).isEqual(Os(e));case 3:return(function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;const a=In(i.timestampValue),B=In(o.timestampValue);return a.seconds===B.seconds&&a.nanos===B.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(i,o){return yn(i.bytesValue).isEqual(yn(o.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(i,o){return Re(i.geoPointValue.latitude)===Re(o.geoPointValue.latitude)&&Re(i.geoPointValue.longitude)===Re(o.geoPointValue.longitude)})(r,e);case 2:return(function(i,o,a){if("integerValue"in i&&"integerValue"in o)return Re(i.integerValue)===Re(o.integerValue);let B,c;if("doubleValue"in i&&"doubleValue"in o)B=Re(i.doubleValue),c=Re(o.doubleValue);else{if(!(a!=null&&a.t))return!1;B=Re(i.integerValue??i.doubleValue),c=Re(o.integerValue??o.doubleValue)}return B===c?!!(a!=null&&a.i)||Fs(B)===Fs(c):!!(a===void 0||a.o)&&isNaN(B)&&isNaN(c)})(r,e,t);case 9:return Ns(r.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>xt(s,i,t)));case 10:case 11:return(function(i,o,a){const B=i.mapValue.fields||{},c=o.mapValue.fields||{};if(Qa(B)!==Qa(c))return!1;for(const h in B)if(B.hasOwnProperty(h)&&(c[h]===void 0||!xt(B[h],c[h],a)))return!1;return!0})(r,e,t);default:return W(52216,{left:r})}}function io(r,e){return(r.values||[]).find((t=>xt(t,e)))!==void 0}function ot(r,e){if(r===e)return 0;const t=He(r),n=He(e);if(t!==n)return ie(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return ie(r.booleanValue,e.booleanValue);case 2:return(function(i,o){const a=Re(i.integerValue||i.doubleValue),B=Re(o.integerValue||o.doubleValue);return a<B?-1:a>B?1:a===B?0:isNaN(a)?isNaN(B)?0:-1:1})(r,e);case 3:return Pd(r.timestampValue,e.timestampValue);case 4:return Pd(Os(r),Os(e));case 5:return cc(r.stringValue,e.stringValue);case 6:return(function(i,o){const a=yn(i),B=yn(o);return a.compareTo(B)})(r.bytesValue,e.bytesValue);case 7:return(function(i,o){const a=i.split("/"),B=o.split("/");for(let c=0;c<a.length&&c<B.length;c++){const h=ie(a[c],B[c]);if(h!==0)return h}return ie(a.length,B.length)})(r.referenceValue,e.referenceValue);case 8:return(function(i,o){const a=ie(Re(i.latitude),Re(o.latitude));return a!==0?a:ie(Re(i.longitude),Re(o.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return Nd(r.arrayValue,e.arrayValue);case 10:return(function(i,o){var C,_,R,L;const a=i.fields||{},B=o.fields||{},c=(C=a[$r])==null?void 0:C.arrayValue,h=(_=B[$r])==null?void 0:_.arrayValue,f=ie(((R=c==null?void 0:c.values)==null?void 0:R.length)||0,((L=h==null?void 0:h.values)==null?void 0:L.length)||0);return f!==0?f:Nd(c,h)})(r.mapValue,e.mapValue);case 11:return(function(i,o){if(i===$n.mapValue&&o===$n.mapValue)return 0;if(i===$n.mapValue)return 1;if(o===$n.mapValue)return-1;const a=i.fields||{},B=Object.keys(a),c=o.fields||{},h=Object.keys(c);B.sort(),h.sort();for(let f=0;f<B.length&&f<h.length;++f){const C=cc(B[f],h[f]);if(C!==0)return C;const _=ot(a[B[f]],c[h[f]]);if(_!==0)return _}return ie(B.length,h.length)})(r.mapValue,e.mapValue);default:throw W(23264,{u:t})}}function Pd(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return ie(r,e);const t=In(r),n=In(e),s=ie(t.seconds,n.seconds);return s!==0?s:ie(t.nanos,n.nanos)}function Nd(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=ot(t[s],n[s]);if(i!==void 0&&i!==0)return i}return ie(t.length,n.length)}function xs(r){return lc(r)}function lc(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const n=In(t);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return yn(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return J.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=lc(i);return n+"]"})(r.arrayValue):"mapValue"in r?(function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${lc(t.fields[o])}`;return s+"}"})(r.mapValue):W(61005,{value:r})}function Sa(r){switch(He(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=No(r);return e?16+Sa(e):16;case 5:return 2*r.stringValue.length;case 6:return yn(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((s,i)=>s+Sa(i)),0)})(r.arrayValue);case 10:case 11:return(function(n){let s=0;return fr(n.fields,((i,o)=>{s+=i.length+Sa(o)})),s})(r.mapValue);default:throw W(13486,{value:r})}}function oo(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function Jt(r){return!!r&&"integerValue"in r}function Fr(r){return!!r&&"doubleValue"in r}function nr(r){return Jt(r)||Fr(r)}function rr(r){return!!r&&"arrayValue"in r}function At(r){return!!r&&"nullValue"in r}function _t(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Mr(r){return!!r&&"mapValue"in r}function Wr(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[sl])==null?void 0:n.stringValue)===il}function hc(r){var e,t;return(t=(((e=r==null?void 0:r.mapValue)==null?void 0:e.fields)||{})[$r])==null?void 0:t.arrayValue}function Ui(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return fr(r.mapValue.fields,((t,n)=>e.mapValue.fields[t]=Ui(n))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ui(r.arrayValue.values[t]);return e}return{...r}}function vg(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===Rg}const bg={mapValue:{fields:{[sl]:{stringValue:il},[$r]:{arrayValue:{}}}}};function AT(r){return"nullValue"in r?en:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?oo(Qr.empty(),J.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?Wr(r)?bg:{mapValue:{}}:W(35942,{value:r})}function RT(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?oo(Qr.empty(),J.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?bg:"mapValue"in r?Wr(r)?{mapValue:{}}:$n:W(61959,{value:r})}function Od(r,e){const t=ot(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function Fd(r,e){const t=ot(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(e){this.value=e}static empty(){return new Ze({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!Mr(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ui(t)}setAll(e){let t=Ke.emptyPath(),n={},s=[];e.forEach(((o,a)=>{if(!t.isImmediateParentOf(a)){const B=this.getFieldsMap(t);this.applyChanges(B,n,s),n={},s=[],t=a.popLast()}o?n[a.lastSegment()]=Ui(o):s.push(a.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());Mr(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return xt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];Mr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){fr(t,((s,i)=>e[s]=i));for(const s of n)delete e[s]}clone(){return new Ze(Ui(this.value))}}function Sg(r){const e=[];return fr(r.fields,((t,n)=>{const s=new Ke([t]);if(Mr(n)){const i=Sg(n.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)})),new pt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ru(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Fs(e)?"-0":e}}function ol(r){return{integerValue:""+r}}function al(r,e,t){return Ag(e)?ol(e):Ru(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vu{constructor(){this._=void 0}}function vT(r,e,t){return r instanceof ao?(function(s,i){const o={fields:{[yg]:{stringValue:Ig},[Tg]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Tu(i)&&(i=No(i)),i&&(o.fields[wg]=i),{mapValue:o}})(t,e):r instanceof Ls?Ng(r,e):r instanceof ks?Og(r,e):r instanceof Vs?(function(s,i){const o=Pg(s,i),a=Wa(o)+Wa(s.l);return Jt(o)&&Jt(s.l)?ol(a):Ru(s.serializer,a)})(r,e):r instanceof uo?(function(s,i){return xd(s,i,Math.min)})(r,e):r instanceof Bo?(function(s,i){return xd(s,i,Math.max)})(r,e):void 0}function bT(r,e,t){return r instanceof Ls?Ng(r,e):r instanceof ks?Og(r,e):t}function Pg(r,e){return r instanceof Vs?nr(e)?e:{integerValue:0}:null}class ao extends vu{}class Ls extends vu{constructor(e){super(),this.elements=e}}function Ng(r,e){const t=Fg(e);for(const n of r.elements)t.some((s=>xt(s,n)))||t.push(n);return{arrayValue:{values:t}}}class ks extends vu{constructor(e){super(),this.elements=e}}function Og(r,e){let t=Fg(e);for(const n of r.elements)t=t.filter((s=>!xt(s,n)));return{arrayValue:{values:t}}}class ul extends vu{constructor(e,t){super(),this.serializer=e,this.l=t}}class Vs extends ul{}class uo extends ul{}class Bo extends ul{}function xd(r,e,t){if(!nr(e))return r.l;const n=t(Wa(e),Wa(r.l));return Jt(e)&&Jt(r.l)?ol(n):Ru(r.serializer,n)}function Wa(r){return Re(r.integerValue||r.doubleValue)}function Fg(r){return rr(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ST{constructor(e,t){this.field=e,this.transform=t}}function PT(r,e){return r.field.isEqual(e.field)&&(function(n,s){return n instanceof Ls&&s instanceof Ls||n instanceof ks&&s instanceof ks?Ns(n.elements,s.elements,xt):n instanceof Vs&&s instanceof Vs||n instanceof uo&&s instanceof uo||n instanceof Bo&&s instanceof Bo?xt(n.l,s.l):n instanceof ao&&s instanceof ao})(r.transform,e.transform)}class NT{constructor(e,t){this.version=e,this.transformResults=t}}class qe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new qe}static exists(e){return new qe(void 0,e)}static updateTime(e){return new qe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Pa(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class bu{}function xg(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new Oo(r.key,qe.none()):new ri(r.key,r.data,qe.none());{const t=r.data,n=Ze.empty();let s=new me(Ke.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new Rn(r.key,n,new pt(s.toArray()),qe.none())}}function OT(r,e,t){r instanceof ri?(function(s,i,o){const a=s.value.clone(),B=kd(s.fieldTransforms,i,o.transformResults);a.setAll(B),i.convertToFoundDocument(o.version,a).setHasCommittedMutations()})(r,e,t):r instanceof Rn?(function(s,i,o){if(!Pa(s.precondition,i))return void i.convertToUnknownDocument(o.version);const a=kd(s.fieldTransforms,i,o.transformResults),B=i.data;B.setAll(Lg(s)),B.setAll(a),i.convertToFoundDocument(o.version,B).setHasCommittedMutations()})(r,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function ji(r,e,t,n){return r instanceof ri?(function(i,o,a,B){if(!Pa(i.precondition,o))return a;const c=i.value.clone(),h=Vd(i.fieldTransforms,B,o);return c.setAll(h),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null})(r,e,t,n):r instanceof Rn?(function(i,o,a,B){if(!Pa(i.precondition,o))return a;const c=Vd(i.fieldTransforms,B,o),h=o.data;return h.setAll(Lg(i)),h.setAll(c),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),a===null?null:a.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((f=>f.field)))})(r,e,t,n):(function(i,o,a){return Pa(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a})(r,e,t)}function FT(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=Pg(n.transform,s||null);i!=null&&(t===null&&(t=Ze.empty()),t.set(n.field,i))}return t||null}function Ld(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&Ns(n,s,((i,o)=>PT(i,o)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class ri extends bu{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Rn extends bu{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Lg(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}})),e}function kd(r,e,t){const n=new Map;U(r.length===t.length,32656,{h:t.length,T:r.length});for(let s=0;s<t.length;s++){const i=r[s],o=i.transform,a=e.data.field(i.field);n.set(i.field,bT(o,a,t[s]))}return n}function Vd(r,e,t){const n=new Map;for(const s of r){const i=s.transform,o=t.data.field(s.field);n.set(s.field,vT(i,o,e))}return n}class Oo extends bu{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class kg extends bu{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ms{constructor(e,t){this.position=e,this.inclusive=t}}function Md(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],o=r.position[s];if(i.field.isKeyField()?n=J.comparator(J.fromName(o.referenceValue),t.key):n=ot(o,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function Gd(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!xt(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vg{}class le extends Vg{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new xT(e,t,n):t==="array-contains"?new VT(e,n):t==="in"?new qg(e,n):t==="not-in"?new MT(e,n):t==="array-contains-any"?new GT(e,n):new le(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new LT(e,n):new kT(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(ot(t,this.value)):t!==null&&He(this.value)===He(t)&&this.matchesComparison(ot(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return W(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class _e extends Vg{constructor(e,t){super(),this.filters=e,this.op=t,this.P=null}static create(e,t){return new _e(e,t)}matches(e){return Gs(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.P!==null||(this.P=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.P}getFilters(){return Object.assign([],this.filters)}}function Gs(r){return r.op==="and"}function fc(r){return r.op==="or"}function Bl(r){return Mg(r)&&Gs(r)}function Mg(r){for(const e of r.filters)if(e instanceof _e)return!1;return!0}function dc(r){if(r instanceof le)return r.field.canonicalString()+r.op.toString()+xs(r.value);if(Bl(r))return r.filters.map((e=>dc(e))).join(",");{const e=r.filters.map((t=>dc(t))).join(",");return`${r.op}(${e})`}}function Gg(r,e){return r instanceof le?(function(n,s){return s instanceof le&&n.op===s.op&&n.field.isEqual(s.field)&&xt(n.value,s.value)})(r,e):r instanceof _e?(function(n,s){return s instanceof _e&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((i,o,a)=>i&&Gg(o,s.filters[a])),!0):!1})(r,e):void W(19439)}function Hg(r,e){const t=r.filters.concat(e);return _e.create(t,r.op)}function Ug(r){return r instanceof le?(function(t){return`${t.field.canonicalString()} ${t.op} ${xs(t.value)}`})(r):r instanceof _e?(function(t){return t.op.toString()+" {"+t.getFilters().map(Ug).join(" ,")+"}"})(r):"Filter"}class xT extends le{constructor(e,t,n){super(e,t,n),this.key=J.fromName(n.referenceValue)}matches(e){const t=J.comparator(e.key,this.key);return this.matchesComparison(t)}}class LT extends le{constructor(e,t){super(e,"in",t),this.keys=jg("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class kT extends le{constructor(e,t){super(e,"not-in",t),this.keys=jg("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function jg(r,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((n=>J.fromName(n.referenceValue)))}class VT extends le{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return rr(t)&&io(t.arrayValue,this.value)}}class qg extends le{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&io(this.value.arrayValue,t)}}class MT extends le{constructor(e,t){super(e,"not-in",t)}matches(e){if(io(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!io(this.value.arrayValue,t)}}class GT extends le{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!rr(t)||!t.arrayValue.values)&&t.arrayValue.values.some((n=>io(this.value.arrayValue,n)))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ya{constructor(e,t="asc"){this.field=e,this.dir=t}}function HT(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{static fromTimestamp(e){return new ee(e)}static min(){return new ee(new Ee(0,0))}static max(){return new ee(new Ee(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e,t,n,s,i,o,a){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=a}static newInvalidDocument(e){return new xe(e,0,ee.min(),ee.min(),ee.min(),Ze.empty(),0)}static newFoundDocument(e,t,n,s){return new xe(e,1,t,ee.min(),n,s,0)}static newNoDocument(e,t){return new xe(e,2,t,ee.min(),ee.min(),Ze.empty(),0)}static newUnknownDocument(e,t){return new xe(e,3,t,ee.min(),ee.min(),Ze.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(ee.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ze.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ze.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ee.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof xe&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new xe(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hs=-1;class Xa{constructor(e,t,n,s){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=s}}function Cc(r){return r.fields.find((e=>e.kind===2))}function Ar(r){return r.fields.filter((e=>e.kind!==2))}Xa.UNKNOWN_ID=-1;class Na{constructor(e,t){this.fieldPath=e,this.kind=t}}class co{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new co(0,vt.min())}}function Kg(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=ee.fromTimestamp(n===1e9?new Ee(t+1,0):new Ee(t,n));return new vt(s,J.empty(),e)}function Jg(r){return new vt(r.readTime,r.key,Hs)}class vt{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new vt(ee.min(),J.empty(),Hs)}static max(){return new vt(ee.max(),J.empty(),Hs)}}function cl(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=J.comparator(r.documentKey,e.documentKey),t!==0?t:ie(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UT{constructor(e,t=null,n=[],s=[],i=null,o=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=a,this.R=null}}function pc(r,e=null,t=[],n=[],s=null,i=null,o=null){return new UT(r,e,t,n,s,i,o)}function Za(r){const e=Y(r);if(e.R===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((n=>dc(n))).join(","),t+="|ob:",t+=e.orderBy.map((n=>(function(i){return i.field.canonicalString()+i.dir})(n))).join(","),Au(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((n=>xs(n))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((n=>xs(n))).join(",")),e.R=t}return e.R}function ll(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!HT(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Gg(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!Gd(r.startAt,e.startAt)&&Gd(r.endAt,e.endAt)}function cn(r){return!!r.isCorePipeline}function hl(r){return!!r.path&&J.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function eu(r,e){return r.filters.filter((t=>t instanceof le&&t.field.isEqual(e)))}function Hd(r,e,t){let n=en,s=!0;for(const i of eu(r,e)){let o=en,a=!0;switch(i.op){case"<":case"<=":o=AT(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,a=!1;break;case"!=":case"not-in":o=en}Od({value:n,inclusive:s},{value:o,inclusive:a})<0&&(n=o,s=a)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];Od({value:n,inclusive:s},{value:o,inclusive:t.inclusive})<0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}function Ud(r,e,t){let n=$n,s=!0;for(const i of eu(r,e)){let o=$n,a=!0;switch(i.op){case">=":case">":o=RT(i.value),a=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,a=!1;break;case"!=":case"not-in":o=$n}Fd({value:n,inclusive:s},{value:o,inclusive:a})>0&&(n=o,s=a)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];Fd({value:n,inclusive:s},{value:o,inclusive:t.inclusive})>0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fo{constructor(e,t=null,n=[],s=[],i=null,o="F",a=null,B=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=a,this.endAt=B,this.I=null,this.A=null,this.V=null,this.startAt,this.endAt}}function zg(r,e,t,n,s,i,o,a){return new Fo(r,e,t,n,s,i,o,a)}function xo(r){return new Fo(r)}function jd(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function jT(r){return J.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Qg(r){return r.collectionGroup!==null}function qi(r){const e=Y(r);if(e.I===null){e.I=[];const t=new Set;for(const i of e.explicitOrderBy)e.I.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new me(Ke.comparator);return o.filters.forEach((B=>{B.getFlattenedFilters().forEach((c=>{c.isInequality()&&(a=a.add(c.field))}))})),a})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.I.push(new Ya(i,n))})),t.has(Ke.keyField().canonicalString())||e.I.push(new Ya(Ke.keyField(),n))}return e.I}function Rt(r){const e=Y(r);return e.A||(e.A=qT(e,qi(r))),e.A}function qT(r,e){if(r.limitType==="F")return pc(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new Ya(s.field,i)}));const t=r.endAt?new Ms(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Ms(r.startAt.position,r.startAt.inclusive):null;return pc(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function gc(r,e){const t=r.filters.concat([e]);return new Fo(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function tu(r,e,t){return new Fo(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function KT(r,e){return ll(Rt(r),Rt(e))&&r.limitType===e.limitType}function Ki(r){return`Query(target=${(function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map((s=>Ug(s))).join(", ")}]`),Au(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map((s=>xs(s))).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map((s=>xs(s))).join(",")),`Target(${n})`})(Rt(r))}; limitType=${r.limitType})`}function Su(r,e){return e.isFoundDocument()&&(function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):J.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)})(r,e)&&(function(n,s){for(const i of qi(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(r,e)&&(function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0})(r,e)&&(function(n,s){return!(n.startAt&&!(function(o,a,B){const c=Md(o,a,B);return o.inclusive?c<=0:c<0})(n.startAt,qi(n),s)||n.endAt&&!(function(o,a,B){const c=Md(o,a,B);return o.inclusive?c>=0:c>0})(n.endAt,qi(n),s))})(r,e)}function fl(r){return(e,t)=>{let n=!1;for(const s of qi(r)){const i=JT(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function JT(r,e,t){const n=r.field.isKeyField()?J.comparator(e.key,t.key):(function(i,o,a){const B=o.data.field(i),c=a.data.field(i);return B!==null&&c!==null?ot(B,c):W(42886)})(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return W(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zT{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ve,de;function QT(r){switch(r){case F.OK:return W(64938);case F.CANCELLED:case F.UNKNOWN:case F.DEADLINE_EXCEEDED:case F.RESOURCE_EXHAUSTED:case F.INTERNAL:case F.UNAVAILABLE:case F.UNAUTHENTICATED:return!1;case F.INVALID_ARGUMENT:case F.NOT_FOUND:case F.ALREADY_EXISTS:case F.PERMISSION_DENIED:case F.FAILED_PRECONDITION:case F.ABORTED:case F.OUT_OF_RANGE:case F.UNIMPLEMENTED:case F.DATA_LOSS:return!0;default:return W(15467,{code:r})}}function $g(r){if(r===void 0)return ke("GRPC error has no .code"),F.UNKNOWN;switch(r){case Ve.OK:return F.OK;case Ve.CANCELLED:return F.CANCELLED;case Ve.UNKNOWN:return F.UNKNOWN;case Ve.DEADLINE_EXCEEDED:return F.DEADLINE_EXCEEDED;case Ve.RESOURCE_EXHAUSTED:return F.RESOURCE_EXHAUSTED;case Ve.INTERNAL:return F.INTERNAL;case Ve.UNAVAILABLE:return F.UNAVAILABLE;case Ve.UNAUTHENTICATED:return F.UNAUTHENTICATED;case Ve.INVALID_ARGUMENT:return F.INVALID_ARGUMENT;case Ve.NOT_FOUND:return F.NOT_FOUND;case Ve.ALREADY_EXISTS:return F.ALREADY_EXISTS;case Ve.PERMISSION_DENIED:return F.PERMISSION_DENIED;case Ve.FAILED_PRECONDITION:return F.FAILED_PRECONDITION;case Ve.ABORTED:return F.ABORTED;case Ve.OUT_OF_RANGE:return F.OUT_OF_RANGE;case Ve.UNIMPLEMENTED:return F.UNIMPLEMENTED;case Ve.DATA_LOSS:return F.DATA_LOSS;default:return W(39323,{code:r})}}(de=Ve||(Ve={}))[de.OK=0]="OK",de[de.CANCELLED=1]="CANCELLED",de[de.UNKNOWN=2]="UNKNOWN",de[de.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",de[de.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",de[de.NOT_FOUND=5]="NOT_FOUND",de[de.ALREADY_EXISTS=6]="ALREADY_EXISTS",de[de.PERMISSION_DENIED=7]="PERMISSION_DENIED",de[de.UNAUTHENTICATED=16]="UNAUTHENTICATED",de[de.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",de[de.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",de[de.ABORTED=10]="ABORTED",de[de.OUT_OF_RANGE=11]="OUT_OF_RANGE",de[de.UNIMPLEMENTED=12]="UNIMPLEMENTED",de[de.INTERNAL=13]="INTERNAL",de[de.UNAVAILABLE=14]="UNAVAILABLE",de[de.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){fr(this.inner,((t,n)=>{for(const[s,i]of n)e(s,i)}))}isEmpty(){return Eg(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $T=new Te(J.comparator);function je(){return $T}const Wg=new Te(J.comparator);function vr(...r){let e=Wg;for(const t of r)e=e.insert(t.key,t);return e}function Yg(r){let e=Wg;return r.forEach(((t,n)=>e=e.insert(t,n.overlayedDocument))),e}function Pt(){return Ji()}function Xg(){return Ji()}function Ji(){return new vn((r=>r.toString()),((r,e)=>r.isEqual(e)))}const WT=new Te(J.comparator),YT=new me(J.comparator);function oe(...r){let e=YT;for(const t of r)e=e.add(t);return e}const XT=new me(ie);function dl(){return XT}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ZT(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eA=new Yn([4294967295,4294967295],0);function qd(r){const e=ZT().encode(r),t=new ig;return t.update(e),new Uint8Array(t.digest())}function Kd(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Yn([t,n],0),new Yn([s,i],0)]}class Cl{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Li(`Invalid padding: ${t}`);if(n<0)throw new Li(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new Li(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new Li(`Invalid padding when bitmap length is 0: ${t}`);this.m=8*e.length-t,this.p=Yn.fromNumber(this.m)}S(e,t,n){let s=e.add(t.multiply(Yn.fromNumber(n)));return s.compare(eA)===1&&(s=new Yn([s.getBits(0),s.getBits(1)],0)),s.modulo(this.p).toNumber()}v(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.m===0)return!1;const t=qd(e),[n,s]=Kd(t);for(let i=0;i<this.hashCount;i++){const o=this.S(n,s,i);if(!this.v(o))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new Cl(i,s,t);return n.forEach((a=>o.insert(a))),o}insert(e){if(this.m===0)return;const t=qd(e),[n,s]=Kd(t);for(let i=0;i<this.hashCount;i++){const o=this.S(n,s,i);this.D(o)}}D(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Li extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{constructor(e,t,n,s,i,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,Lo.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new si(ee.min(),s,new Te(ie),je(),je(),oe())}}class Lo{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new Lo(n,t,oe(),oe(),oe())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oa{constructor(e,t,n,s){this.C=e,this.removedTargetIds=t,this.key=n,this.F=s}}class Zg{constructor(e,t){this.targetId=e,this.O=t}}class em{constructor(e,t,n=Ne.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class Jd{constructor(e){this.targetId=e,this.M=0,this.N=zd(),this.L=Ne.EMPTY_BYTE_STRING,this.B=!1,this.U=!0}get current(){return this.B}get resumeToken(){return this.L}get k(){return this.M!==0}get q(){return this.U}$(e){e.approximateByteSize()>0&&(this.U=!0,this.L=e)}K(){let e=oe(),t=oe(),n=oe();return this.N.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:W(38017,{changeType:i})}})),new Lo(this.L,this.B,e,t,n)}W(){this.U=!1,this.N=zd()}G(e,t){this.U=!0,this.N=this.N.insert(e,t)}j(e){this.U=!0,this.N=this.N.remove(e)}H(){this.M+=1}J(){this.M-=1,U(this.M>=0,3241,{M:this.M,targetId:this.targetId})}Y(){this.U=!0,this.B=!0}}const Ri="WatchChangeAggregator";class tA{constructor(e){this.Z=e,this.X=new Map,this.ee=je(),this.te=ga(),this.ne=je(),this.re=ga(),this.ie=new Te(ie)}se(e){for(const t of e.C)e.F&&e.F.isFoundDocument()?this._e(t,e.F):this.oe(t,e.key,e.F);for(const t of e.removedTargetIds)this.oe(t,e.key,e.F)}ae(e){this.forEachTarget(e,(t=>{const n=this.X.get(t);if(n)switch(e.state){case 0:this.ue(t)&&n.$(e.resumeToken);break;case 1:n.J(),n.k||n.W(),n.$(e.resumeToken);break;case 2:n.J(),n.k||this.removeTarget(t);break;case 3:this.ue(t)&&(n.Y(),n.$(e.resumeToken));break;case 4:this.ue(t)&&(this.ce(t),n.$(e.resumeToken));break;default:W(56790,{state:e.state})}else M(Ri,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.X.forEach(((n,s)=>{this.ue(s)&&t(s)}))}le(e){var t;return cn(e)?e.getPipelineSourceType()==="documents"&&((t=e.getPipelineDocuments())==null?void 0:t.length)===1:hl(e)}Ee(e){const t=e.targetId,n=e.O.count,s=this.he(t);if(s){const i=s.target;if(this.le(i))if(n===0){const o=new J(cn(i)?Be.fromString(i.getPipelineDocuments()[0]):i.path);this.oe(t,o,xe.newNoDocument(o,ee.min()))}else U(n===1,20013,"Single document existence filter with count: "+n);else{const o=this.Te(t);if(o!==n){const a=this.Pe(e),B=a?this.Re(a,e,o):1;if(B!==0){this.ce(t);const c=B===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.ie=this.ie.insert(t,c)}}}}}Pe(e){const t=e.O.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let o,a;try{o=yn(n).toUint8Array()}catch(B){if(B instanceof Dg)return Ft("Decoding the base64 bloom filter in existence filter failed ("+B.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw B}try{a=new Cl(o,s,i)}catch(B){return Ft(B instanceof Li?"BloomFilter error: ":"Applying bloom filter failed: ",B),null}return a.m===0?null:a}Re(e,t,n){return t.O.count===n-this.Ve(e,t.targetId)?0:2}Ve(e,t){const n=this.Z.getRemoteKeysForTarget(t);let s=0;return n.forEach((i=>{const o=this.Z.Ae(),a=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(a)||(this.oe(t,i,null),s++)})),s}de(e){const t=new Map;this.X.forEach(((i,o)=>{const a=this.he(o);if(a){if(i.current&&this.le(a.target)){const B=cn(a.target)?Be.fromString(a.target.getPipelineDocuments()[0]):a.target.path,c=new J(B);this.fe(c).has(o)||this.me(o,c)||this.oe(o,c,xe.newNoDocument(c,e))}i.q&&(t.set(o,i.K()),i.W())}}));let n=oe();this.re.forEach(((i,o)=>{let a=!0;o.forEachWhile((B=>{const c=this.he(B);return!c||c.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)})),a&&(n=n.add(i))})),this.ee.forEach(((i,o)=>o.setReadTime(e))),this.ne.forEach(((i,o)=>o.setReadTime(e)));const s=new si(e,t,this.ie,this.ee,this.ne,n);return this.ee=je(),this.te=ga(),this.ne=je(),this.re=ga(),this.ie=new Te(ie),s}_e(e,t){const n=this.X.get(e);if(!n||!this.ue(e))return void M(Ri,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.me(e,t.key)?2:0;n.G(t.key,s),cn(this.he(e).target)&&this.he(e).target.getPipelineFlavor()!=="exact"?this.ne=this.ne.insert(t.key,t):this.ee=this.ee.insert(t.key,t),this.te=this.te.insert(t.key,this.fe(t.key).add(e)),this.re=this.re.insert(t.key,this.pe(t.key).add(e))}oe(e,t,n){const s=this.X.get(e);s&&this.ue(e)?(this.me(e,t)?s.G(t,1):s.j(t),this.re=this.re.insert(t,this.pe(t).delete(e)),this.re=this.re.insert(t,this.pe(t).add(e)),n&&(cn(this.he(e).target)&&this.he(e).target.getPipelineFlavor()!=="exact"?this.ne=this.ne.insert(t,n):this.ee=this.ee.insert(t,n))):M(Ri,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.X.delete(e)}Te(e){const t=this.X.get(e);if(!t)return 0;const n=t.K();return this.Z.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}H(e){let t=this.X.get(e);t||(M(Ri,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new Jd(e),this.X.set(e,t)),t.H()}pe(e){let t=this.re.get(e);return t||(t=new me(ie),this.re=this.re.insert(e,t)),t}fe(e){let t=this.te.get(e);return t||(t=new me(ie),this.te=this.te.insert(e,t)),t}ue(e){const t=this.he(e)!==null;return t||M(Ri,"Detected inactive target",e),t}he(e){const t=this.X.get(e);return t===void 0||t.k?null:this.Z.ge(e)}ce(e){this.X.set(e,new Jd(e)),this.Z.getRemoteKeysForTarget(e).forEach((t=>{this.oe(e,t,null)}))}me(e,t){return this.Z.getRemoteKeysForTarget(e).has(t)}}function ga(){return new Te(J.comparator)}function zd(){return new Te(J.comparator)}const nA={asc:"ASCENDING",desc:"DESCENDING"},rA={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},sA={and:"AND",or:"OR"};class iA{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function mc(r,e){return r.useProto3Json||Au(e)?e:{value:e}}function Us(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function pl(r){const e=In(r);return new Ee(e.seconds,e.nanos)}function tm(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function Fa(r,e){return Us(r,e.toTimestamp())}function ht(r){return U(!!r,49232),ee.fromTimestamp(pl(r))}function gl(r,e){return Ec(r,e).canonicalString()}function Ec(r,e){const t=(function(s){return new Be(["projects",s.projectId,"databases",s.database])})(r).child("documents");return e===void 0?t:t.child(e)}function nm(r){const e=Be.fromString(r);return U(hm(e),10190,{key:e.toString()}),e}function lo(r,e){return gl(r.databaseId,e.path)}function Gr(r,e){const t=nm(e);if(t.get(1)!==r.databaseId.projectId)throw new H(F.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new H(F.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new J(im(t))}function rm(r,e){return gl(r.databaseId,e)}function sm(r){const e=nm(r);return e.length===4?Be.emptyPath():im(e)}function _c(r){return new Be(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function im(r){return U(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function Qd(r,e,t){return{name:lo(r,e),fields:t.value.mapValue.fields}}function oA(r,e,t){const n=Gr(r,e.name),s=ht(e.updateTime),i=e.createTime?ht(e.createTime):ee.min(),o=new Ze({mapValue:{fields:e.fields}}),a=xe.newFoundDocument(n,s,i,o);return t&&a.setHasCommittedMutations(),t?a.setHasCommittedMutations():a}function aA(r,e){let t;if("targetChange"in e){e.targetChange;const n=(function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:W(39313,{state:c})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(c,h){return c.useProto3Json?(U(h===void 0||typeof h=="string",58123),Ne.fromBase64String(h||"")):(U(h===void 0||h instanceof Buffer||h instanceof Uint8Array,16193),Ne.fromUint8Array(h||new Uint8Array))})(r,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&(function(c){const h=c.code===void 0?F.UNKNOWN:$g(c.code);return new H(h,c.message||"")})(o);t=new em(n,s,i,a||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=Gr(r,n.document.name),i=ht(n.document.updateTime),o=n.document.createTime?ht(n.document.createTime):ee.min(),a=new Ze({mapValue:{fields:n.document.fields}}),B=xe.newFoundDocument(s,i,o,a),c=n.targetIds||[],h=n.removedTargetIds||[];t=new Oa(c,h,B.key,B)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=Gr(r,n.document),i=n.readTime?ht(n.readTime):ee.min(),o=xe.newNoDocument(s,i),a=n.removedTargetIds||[];t=new Oa([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=Gr(r,n.document),i=n.removedTargetIds||[];t=new Oa([],i,s,null)}else{if(!("filter"in e))return W(11601,{ye:e});{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new zT(s,i),a=n.targetId;t=new Zg(a,o)}}return t}function nu(r,e){let t;if(e instanceof ri)t={update:Qd(r,e.key,e.value)};else if(e instanceof Oo)t={delete:lo(r,e.key)};else if(e instanceof Rn)t={update:Qd(r,e.key,e.data),updateMask:fA(e.fieldMask)};else{if(!(e instanceof kg))return W(16599,{we:e.type});t={verify:lo(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((n=>(function(i,o){const a=o.transform;if(a instanceof ao)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof Ls)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof ks)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof Vs)return{fieldPath:o.field.canonicalString(),increment:a.l};if(a instanceof uo)return{fieldPath:o.field.canonicalString(),minimum:a.l};if(a instanceof Bo)return{fieldPath:o.field.canonicalString(),maximum:a.l};throw W(20930,{transform:o.transform})})(0,n)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:Fa(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:W(27497)})(r,e.precondition)),t}function Dc(r,e){const t=e.currentDocument?(function(i){return i.updateTime!==void 0?qe.updateTime(ht(i.updateTime)):i.exists!==void 0?qe.exists(i.exists):qe.none()})(e.currentDocument):qe.none(),n=e.updateTransforms?e.updateTransforms.map((s=>(function(o,a){let B=null;if("setToServerValue"in a)U(a.setToServerValue==="REQUEST_TIME",16630,{proto:a}),B=new ao;else if("appendMissingElements"in a){const h=a.appendMissingElements.values||[];B=new Ls(h)}else if("removeAllFromArray"in a){const h=a.removeAllFromArray.values||[];B=new ks(h)}else"increment"in a?B=new Vs(o,a.increment):"minimum"in a?B=new uo(o,a.minimum):"maximum"in a?B=new Bo(o,a.maximum):W(16584,{proto:a});const c=Ke.fromServerFormat(a.fieldPath);return new ST(c,B)})(r,s))):[];if(e.update){e.update.name;const s=Gr(r,e.update.name),i=new Ze({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=(function(B){const c=B.fieldPaths||[];return new pt(c.map((h=>Ke.fromServerFormat(h))))})(e.updateMask);return new Rn(s,i,o,t,n)}return new ri(s,i,t,n)}if(e.delete){const s=Gr(r,e.delete);return new Oo(s,t)}if(e.verify){const s=Gr(r,e.verify);return new kg(s,t)}return W(1463,{proto:e})}function uA(r,e){return r&&r.length>0?(U(e!==void 0,14353),r.map((t=>(function(s,i){let o=s.updateTime?ht(s.updateTime):ht(i);return o.isEqual(ee.min())&&(o=ht(i)),new NT(o,s.transformResults||[])})(t,e)))):[]}function om(r,e){return{documents:[rm(r,e.path)]}}function am(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=rm(r,s);const i=(function(c){if(c.length!==0)return lm(_e.create(c,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const o=(function(c){if(c.length!==0)return c.map((h=>(function(C){return{field:ys(C.field),direction:cA(C.dir)}})(h)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const a=mc(r,e.limit);return a!==null&&(t.structuredQuery.limit=a),e.startAt&&(t.structuredQuery.startAt=(function(c){return{before:c.inclusive,values:c.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(c){return{before:!c.inclusive,values:c.position}})(e.endAt)),{be:t,parent:s}}function um(r){let e=sm(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){U(n===1,65062);const h=t.from[0];h.allDescendants?s=h.collectionId:e=e.child(h.collectionId)}let i=[];t.where&&(i=(function(f){const C=cm(f);return C instanceof _e&&Bl(C)?C.getFilters():[C]})(t.where));let o=[];t.orderBy&&(o=(function(f){return f.map((C=>(function(R){return new Ya(ws(R.field),(function(G){switch(G){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(R.direction))})(C)))})(t.orderBy));let a=null;t.limit&&(a=(function(f){let C;return C=typeof f=="object"?f.value:f,Au(C)?null:C})(t.limit));let B=null;t.startAt&&(B=(function(f){const C=!!f.before,_=f.values||[];return new Ms(_,C)})(t.startAt));let c=null;return t.endAt&&(c=(function(f){const C=!f.before,_=f.values||[];return new Ms(_,C)})(t.endAt)),zg(e,s,o,i,a,"F",B,c)}function BA(r,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return W(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Bm(r,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(r)))}}}}function cm(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=ws(t.unaryFilter.field);return le.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=ws(t.unaryFilter.field);return le.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=ws(t.unaryFilter.field);return le.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=ws(t.unaryFilter.field);return le.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return W(61313);default:return W(60726)}})(r):r.fieldFilter!==void 0?(function(t){return le.create(ws(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return W(58110);default:return W(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return _e.create(t.compositeFilter.filters.map((n=>cm(n))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return W(1026)}})(t.compositeFilter.op))})(r):W(30097,{filter:r})}function cA(r){return nA[r]}function lA(r){return rA[r]}function hA(r){return sA[r]}function ys(r){return{fieldPath:r.canonicalString()}}function ws(r){return Ke.fromServerFormat(r.fieldPath)}function lm(r){return r instanceof le?(function(t){if(t.op==="=="){if(_t(t.value))return{unaryFilter:{field:ys(t.field),op:"IS_NAN"}};if(At(t.value))return{unaryFilter:{field:ys(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(_t(t.value))return{unaryFilter:{field:ys(t.field),op:"IS_NOT_NAN"}};if(At(t.value))return{unaryFilter:{field:ys(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ys(t.field),op:lA(t.op),value:t.value}}})(r):r instanceof _e?(function(t){const n=t.getFilters().map((s=>lm(s)));return n.length===1?n[0]:{compositeFilter:{op:hA(t.op),filters:n}}})(r):W(54877,{filter:r})}function fA(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function hm(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function fm(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}function ho(r,e){const t={fields:{}};return e.forEach(((n,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=n._toProto(r)})),{mapValue:t}}function dm(r){return{stringValue:r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pu(r){return new iA(r,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Nt(Ne.fromBase64String(e))}catch(t){throw new H(F.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Nt(Ne.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Nt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Po(e,Nt._jsonSchema))return Nt.fromBase64String(e.bytes)}}Nt._jsonSchemaVersion="firestore/bytes/1.0",Nt._jsonSchema={type:Ge("string",Nt._jsonSchemaVersion),bytes:Ge("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ko{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new H(F.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ke(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function dA(){return new ko(Kt)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ml{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tn{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new H(F.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new H(F.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return ie(this._lat,e._lat)||ie(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:tn._jsonSchemaVersion}}static fromJSON(e){if(Po(e,tn._jsonSchema))return new tn(e.latitude,e.longitude)}}tn._jsonSchemaVersion="firestore/geoPoint/1.0",tn._jsonSchema={type:Ge("string",tn._jsonSchemaVersion),latitude:Ge("number"),longitude:Ge("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}We.UNAUTHENTICATED=new We(null),We.GOOGLE_CREDENTIALS=new We("google-credentials-uid"),We.FIRST_PARTY=new We("first-party-uid"),We.MOCK_USER=new We("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nn{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cm{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class CA{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(We.UNAUTHENTICATED)))}shutdown(){}}class pA{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class gA{constructor(e){this.ve=e,this.currentUser=We.UNAUTHENTICATED,this.De=0,this.forceRefresh=!1,this.auth=null}start(e,t){U(this.xe===void 0,42304);let n=this.De;const s=B=>this.De!==n?(n=this.De,t(B)):Promise.resolve();let i=new nn;this.xe=()=>{this.De++,this.currentUser=this.Ce(),i.resolve(),i=new nn,e.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const B=i;e.enqueueRetryable((async()=>{await B.promise,await s(this.currentUser)}))},a=B=>{M("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=B,this.xe&&(this.auth.addAuthTokenListener(this.xe),o())};this.ve.onInit((B=>a(B))),setTimeout((()=>{if(!this.auth){const B=this.ve.getImmediate({optional:!0});B?a(B):(M("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new nn)}}),0),o()}getToken(){const e=this.De,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((n=>this.De!==e?(M("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(U(typeof n.accessToken=="string",31837,{Fe:n}),new Cm(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.xe&&this.auth.removeAuthTokenListener(this.xe),this.xe=void 0}Ce(){const e=this.auth&&this.auth.getUid();return U(e===null||typeof e=="string",2055,{Oe:e}),new We(e)}}class mA{constructor(e,t,n){this.Me=e,this.Ne=t,this.Le=n,this.type="FirstParty",this.user=We.FIRST_PARTY,this.Be=new Map}Ue(){return this.Le?this.Le():null}get headers(){this.Be.set("X-Goog-AuthUser",this.Me);const e=this.Ue();return e&&this.Be.set("Authorization",e),this.Ne&&this.Be.set("X-Goog-Iam-Authorization-Token",this.Ne),this.Be}}class EA{constructor(e,t,n){this.Me=e,this.Ne=t,this.Le=n}getToken(){return Promise.resolve(new mA(this.Me,this.Ne,this.Le))}start(e,t){e.enqueueRetryable((()=>t(We.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class $d{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class _A{constructor(e,t){this.ke=t,this.forceRefresh=!1,this.appCheck=null,this.qe=null,this.$e=null,Tt(e)&&e.settings.appCheckToken&&(this.$e=e.settings.appCheckToken)}start(e,t){U(this.xe===void 0,3512);const n=i=>{i.error!=null&&M("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.qe;return this.qe=i.token,M("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.xe=i=>{e.enqueueRetryable((()=>n(i)))};const s=i=>{M("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.xe&&this.appCheck.addTokenListener(this.xe)};this.ke.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.ke.getImmediate({optional:!0});i?s(i):M("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.$e)return Promise.resolve(new $d(this.$e));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(U(typeof t.token=="string",44558,{tokenResult:t}),this.qe=t.token,new $d(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.xe&&this.appCheck.removeTokenListener(this.xe),this.xe=void 0}}function pm(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DA{Ke(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wd="ConnectivityMonitor";class Yd{constructor(){this.Qe=()=>this.We(),this.Ge=()=>this.ze(),this.je=[],this.He()}Ke(e){this.je.push(e)}shutdown(){window.removeEventListener("online",this.Qe),window.removeEventListener("offline",this.Ge)}He(){window.addEventListener("online",this.Qe),window.addEventListener("offline",this.Ge)}We(){M(Wd,"Network connectivity changed: AVAILABLE");for(const e of this.je)e(0)}ze(){M(Wd,"Network connectivity changed: UNAVAILABLE");for(const e of this.je)e(1)}static Je(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ma=null;function Ic(){return ma===null?ma=(function(){return 268435456+Math.round(2147483648*Math.random())})():ma++,"0x"+ma.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kB="RestConnection",IA={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class yA{get Ye(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Ze=t+"://"+e.host,this.Xe=`projects/${n}/databases/${s}`,this.et=this.databaseId.database===$a?`project_id=${n}`:`project_id=${n}&database_id=${s}`}tt(e,t,n,s,i){const o=Ic(),a=this.nt(e,t.toUriEncodedString());M(kB,`Sending RPC '${e}' ${o}:`,a,n);const B={"google-cloud-resource-prefix":this.Xe,"x-goog-request-params":this.et};this.rt(B,s,i);const{host:c}=new URL(a),h=Zs(c);return this.it(e,a,B,n,h).then((f=>(M(kB,`Received RPC '${e}' ${o}: `,f),f)),(f=>{throw Ft(kB,`RPC '${e}' ${o} failed with error: `,f,"url: ",a,"request:",n),f}))}st(e,t,n,s,i,o){return this.tt(e,t,n,s,i)}rt(e,t,n){if(e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+ni})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),n&&n.headers.forEach(((s,i)=>e[i]=s)),this.databaseInfo._customHeaders)for(const s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}nt(e,t){const n=IA[e];let s=`${this.Ze}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wA{constructor(e){this._t=e._t,this.ot=e.ot}ut(e){this.ct=e}lt(e){this.Et=e}ht(e){this.Tt=e}onMessage(e){this.Pt=e}close(){this.ot()}send(e){this._t(e)}Rt(){this.ct()}It(){this.Et()}At(e){this.Tt(e)}Vt(e){this.Pt(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nt="WebChannelConnection",vi=(r,e,t)=>{r.listen(e,(n=>{try{t(n)}catch(s){setTimeout((()=>{throw s}),0)}}))};class Ss extends yA{constructor(e){super(e),this.dt=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static ft(){if(!Ss.gt){const e=Bg();vi(e,ug.STAT_EVENT,(t=>{t.stat===oc.PROXY?M(nt,"STAT_EVENT: detected buffering proxy"):t.stat===oc.NOPROXY&&M(nt,"STAT_EVENT: detected no buffering proxy")})),Ss.gt=!0}}it(e,t,n,s,i){const o=Ic();return new Promise(((a,B)=>{const c=new og;c.setWithCredentials(!0),c.listenOnce(ag.COMPLETE,(()=>{try{switch(c.getLastErrorCode()){case ba.NO_ERROR:const f=c.getResponseJson();M(nt,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(f)),a(f);break;case ba.TIMEOUT:M(nt,`RPC '${e}' ${o} timed out`),B(new H(F.DEADLINE_EXCEEDED,"Request time out"));break;case ba.HTTP_ERROR:const C=c.getStatus();if(M(nt,`RPC '${e}' ${o} failed with status:`,C,"response text:",c.getResponseText()),C>0){let _=c.getResponseJson();Array.isArray(_)&&(_=_[0]);const R=_==null?void 0:_.error;if(R&&R.status&&R.message){const L=(function(Q){const te=Q.toLowerCase().replace(/_/g,"-");return Object.values(F).indexOf(te)>=0?te:F.UNKNOWN})(R.status);B(new H(L,R.message))}else B(new H(F.UNKNOWN,"Server responded with status "+c.getStatus()))}else B(new H(F.UNAVAILABLE,"Connection failed."));break;default:W(9055,{yt:e,streamId:o,wt:c.getLastErrorCode(),bt:c.getLastError()})}}finally{M(nt,`RPC '${e}' ${o} completed.`)}}));const h=JSON.stringify(s);M(nt,`RPC '${e}' ${o} sending request:`,s),c.send(t,"POST",h,n,15)}))}St(e,t,n){const s=Ic(),i=[this.Ze,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},B=this.longPollingOptions.timeoutSeconds;B!==void 0&&(a.longPollingTimeout=Math.round(1e3*B)),this.useFetchStreams&&(a.useFetchStreams=!0),this.rt(a.initMessageHeaders,t,n),a.encodeInitMessageHeaders=!0;const c=i.join("");M(nt,`Creating RPC '${e}' stream ${s}: ${c}`,a);const h=o.createWebChannel(c,a);this.vt(h);let f=!1,C=!1;const _=new wA({_t:R=>{C?M(nt,`Not sending because RPC '${e}' stream ${s} is closed:`,R):(f||(M(nt,`Opening RPC '${e}' stream ${s} transport.`),h.open(),f=!0),M(nt,`RPC '${e}' stream ${s} sending:`,R),h.send(R))},ot:()=>h.close()});return vi(h,xi.EventType.OPEN,(()=>{C||(M(nt,`RPC '${e}' stream ${s} transport opened.`),_.Rt())})),vi(h,xi.EventType.CLOSE,(()=>{C||(C=!0,M(nt,`RPC '${e}' stream ${s} transport closed`),_.At(),this.Dt(h))})),vi(h,xi.EventType.ERROR,(R=>{C||(C=!0,Ft(nt,`RPC '${e}' stream ${s} transport errored. Name:`,R.name,"Message:",R.message),_.At(new H(F.UNAVAILABLE,"The operation could not be completed")))})),vi(h,xi.EventType.MESSAGE,(R=>{var L;if(!C){const G=R.data[0];U(!!G,16349);const Q=G,te=(Q==null?void 0:Q.error)||((L=Q[0])==null?void 0:L.error);if(te){M(nt,`RPC '${e}' stream ${s} received error:`,te);const se=te.status;let ge=(function(w){const E=Ve[w];if(E!==void 0)return $g(E)})(se),he=te.message;se==="NOT_FOUND"&&he.includes("database")&&he.includes("does not exist")&&he.includes(this.databaseId.database)&&Ft(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),ge===void 0&&(ge=F.INTERNAL,he="Unknown error status: "+se+" with message "+te.message),C=!0,_.At(new H(ge,he)),h.close()}else M(nt,`RPC '${e}' stream ${s} received:`,G),_.Vt(G)}})),Ss.ft(),setTimeout((()=>{_.It()}),0),_}terminate(){this.dt.forEach((e=>e.close())),this.dt=[]}vt(e){this.dt.push(e)}Dt(e){this.dt=this.dt.filter((t=>t===e))}rt(e,t,n){super.rt(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return cg()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TA(r){return new Ss(r)}Ss.gt=!1;class gm{constructor(e,t,n=1e3,s=1.5,i=6e4){this.xt=e,this.timerId=t,this.Ct=n,this.Ft=s,this.Ot=i,this.Mt=0,this.Nt=null,this.Lt=Date.now(),this.reset()}reset(){this.Mt=0}Bt(){this.Mt=this.Ot}Ut(e){this.cancel();const t=Math.floor(this.Mt+this.kt()),n=Math.max(0,Date.now()-this.Lt),s=Math.max(0,t-n);s>0&&M("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Mt} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.Nt=this.xt.enqueueAfterDelay(this.timerId,s,(()=>(this.Lt=Date.now(),e()))),this.Mt*=this.Ft,this.Mt<this.Ct&&(this.Mt=this.Ct),this.Mt>this.Ot&&(this.Mt=this.Ot)}qt(){this.Nt!==null&&(this.Nt.skipDelay(),this.Nt=null)}cancel(){this.Nt!==null&&(this.Nt.cancel(),this.Nt=null)}kt(){return(Math.random()-.5)*this.Mt}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xd="PersistentStream";class mm{constructor(e,t,n,s,i,o,a,B){this.xt=e,this.$t=n,this.Kt=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=B,this.state=0,this.Qt=0,this.Wt=null,this.Gt=null,this.stream=null,this.zt=0,this.jt=new gm(e,t)}Ht(){return this.state===1||this.state===5||this.Jt()}Jt(){return this.state===2||this.state===3}start(){this.zt=0,this.state!==4?this.auth():this.Yt()}async stop(){this.Ht()&&await this.close(0)}Zt(){this.state=0,this.jt.reset()}Xt(){this.Jt()&&this.Wt===null&&(this.Wt=this.xt.enqueueAfterDelay(this.$t,6e4,(()=>this.en())))}tn(e){this.nn(),this.stream.send(e)}async en(){if(this.Jt())return this.close(0)}nn(){this.Wt&&(this.Wt.cancel(),this.Wt=null)}rn(){this.Gt&&(this.Gt.cancel(),this.Gt=null)}async close(e,t){this.nn(),this.rn(),this.jt.cancel(),this.Qt++,e!==4?this.jt.reset():t&&t.code===F.RESOURCE_EXHAUSTED?(ke(t.toString()),ke("Using maximum backoff delay to prevent overloading the backend."),this.jt.Bt()):t&&t.code===F.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.sn(),this.stream.close(),this.stream=null),this.state=e,await this.listener.ht(t)}sn(){}auth(){this.state=1;const e=this._n(this.Qt),t=this.Qt;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,s])=>{this.Qt===t&&this.an(n,s)}),(n=>{e((()=>{const s=new H(F.UNKNOWN,"Fetching auth token failed: "+n.message);return this.un(s)}))}))}an(e,t){const n=this._n(this.Qt);this.stream=this.cn(e,t),this.stream.ut((()=>{n((()=>this.listener.ut()))})),this.stream.lt((()=>{n((()=>(this.state=2,this.Gt=this.xt.enqueueAfterDelay(this.Kt,1e4,(()=>(this.Jt()&&(this.state=3),Promise.resolve()))),this.listener.lt())))})),this.stream.ht((s=>{n((()=>this.un(s)))})),this.stream.onMessage((s=>{n((()=>++this.zt==1?this.En(s):this.onNext(s)))}))}Yt(){this.state=5,this.jt.Ut((async()=>{this.state=0,this.start()}))}un(e){return M(Xd,`close with error: ${e}`),this.stream=null,this.close(4,e)}_n(e){return t=>{this.xt.enqueueAndForget((()=>this.Qt===e?t():(M(Xd,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class AA extends mm{constructor(e,t,n,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}cn(e,t){return this.connection.St("Listen",e,t)}En(e){return this.onNext(e)}onNext(e){this.jt.reset();const t=aA(this.serializer,e),n=(function(i){if(!("targetChange"in i))return ee.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?ee.min():o.readTime?ht(o.readTime):ee.min()})(e);return this.listener.hn(t,n)}Tn(e){const t={};t.database=_c(this.serializer),t.addTarget=(function(i,o){let a;const B=o.target;if(a=cn(B)?{pipelineQuery:Bm(i,B)}:hl(B)?{documents:om(i,B)}:{query:am(i,B).be},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=tm(i,o.resumeToken);const c=mc(i,o.expectedCount);c!==null&&(a.expectedCount=c)}else if(o.snapshotVersion.compareTo(ee.min())>0){a.readTime=Us(i,o.snapshotVersion.toTimestamp());const c=mc(i,o.expectedCount);c!==null&&(a.expectedCount=c)}return a})(this.serializer,e);const n=BA(this.serializer,e);n&&(t.labels=n),this.tn(t)}Pn(e){const t={};t.database=_c(this.serializer),t.removeTarget=e,this.tn(t)}}class RA extends mm{constructor(e,t,n,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}get Rn(){return this.zt>0}start(){this.lastStreamToken=void 0,super.start()}sn(){this.Rn&&this.In([])}cn(e,t){return this.connection.St("Write",e,t)}En(e){return U(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,U(!e.writeResults||e.writeResults.length===0,55816),this.listener.An()}onNext(e){U(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.jt.reset();const t=uA(e.writeResults,e.commitTime),n=ht(e.commitTime);return this.listener.Vn(n,t)}dn(){const e={};e.database=_c(this.serializer),this.tn(e)}In(e){const t={streamToken:this.lastStreamToken,writes:e.map((n=>nu(this.serializer,n)))};this.tn(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vA{}class bA extends vA{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.fn=!1}mn(){if(this.fn)throw new H(F.FAILED_PRECONDITION,"The client has already been terminated.")}tt(e,t,n,s){return this.mn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.tt(e,Ec(t,n),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===F.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new H(F.UNKNOWN,i.toString())}))}st(e,t,n,s,i){return this.mn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,a])=>this.connection.st(e,Ec(t,n),s,o,a,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===F.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new H(F.UNKNOWN,o.toString())}))}terminate(){this.fn=!0,this.connection.terminate()}}function SA(r,e,t,n){return new bA(r,e,t,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PA="ComponentProvider",Zd=new Map;function NA(r,e,t,n,s){return new yT(r,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,pm(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,n,s._customHeaders,s.grpcFlowControlWindow)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eC={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Em=41943040;class rt{static withCacheSize(e){return new rt(e,rt.DEFAULT_COLLECTION_PERCENTILE,rt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}rt.DEFAULT_COLLECTION_PERCENTILE=10,rt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,rt.DEFAULT=new rt(Em,rt.DEFAULT_COLLECTION_PERCENTILE,rt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),rt.DISABLED=new rt(-1,0,0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.pn(n),this.gn=n=>t.writeSequenceNumber(n))}pn(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.gn&&this.gn(e),e}}gt.yn=-1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _m="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Dm{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dr(r){if(r.code!==F.FAILED_PRECONDITION||r.message!==_m)throw r;M("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&W(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new b(((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof b?t:b.resolve(t)}catch(t){return b.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):b.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):b.reject(t)}static resolve(e){return new b(((t,n)=>{t(e)}))}static reject(e){return new b(((t,n)=>{n(e)}))}static waitFor(e){return new b(((t,n)=>{let s=0,i=0,o=!1;e.forEach((a=>{++s,a.next((()=>{++i,o&&i===s&&t()}),(B=>n(B)))})),o=!0,i===s&&t()}))}static or(e){let t=b.resolve(!1);for(const n of e)t=t.next((s=>s?b.resolve(s):n()));return t}static forEach(e,t){const n=[];return e.forEach(((s,i)=>{n.push(t.call(this,s,i))})),this.waitFor(n)}static mapArray(e,t){return new b(((n,s)=>{const i=e.length,o=new Array(i);let a=0;for(let B=0;B<i;B++){const c=B;t(e[c]).next((h=>{o[c]=h,++a,a===i&&n(o)}),(h=>s(h)))}}))}static doWhile(e,t){return new b(((n,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):n()};i()}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wt="SimpleDb";class Nu{static open(e,t,n,s){try{return new Nu(t,e.transaction(s,n))}catch(i){throw new zi(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.wn=new nn,this.transaction.oncomplete=()=>{this.wn.resolve()},this.transaction.onabort=()=>{t.error?this.wn.reject(new zi(e,t.error)):this.wn.resolve()},this.transaction.onerror=n=>{const s=El(n.target.error);this.wn.reject(new zi(e,s))}}get bn(){return this.wn.promise}abort(e){e&&this.wn.reject(e),this.aborted||(M(wt,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}Sn(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new FA(t)}}class Xn{static delete(e){return M(wt,"Removing database:",e),br(up().indexedDB.deleteDatabase(e)).toPromise()}static Je(){if(!Hc())return!1;if(Xn.vn())return!0;const e=Je(),t=Xn.Dn(e),n=0<t&&t<10,s=Im(e),i=0<s&&s<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static vn(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)==null?void 0:e.__PRIVATE_USE_MOCK_PERSISTENCE)==="YES"}static xn(e,t){return e.store(t)}static Dn(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.Cn=n,this.Fn=null,Xn.Dn(Je())===12.2&&ke("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async On(e){return this.db||(M(wt,"Opening database:",this.name),this.db=await new Promise(((t,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const o=i.target.result;t(o)},s.onblocked=()=>{n(new zi(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const o=i.target.error;o.name==="VersionError"?n(new H(F.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new H(F.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new zi(e,o))},s.onupgradeneeded=i=>{M(wt,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;this.Cn.Mn(o,s.transaction,i.oldVersion,this.version).next((()=>{M(wt,"Database upgrade to version "+this.version+" complete")}))}}))),this.Nn&&(this.db.onversionchange=t=>this.Nn(t)),this.db}Ln(e){this.Nn=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,s){const i=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.On(e);const a=Nu.open(this.db,e,i?"readonly":"readwrite",n),B=s(a).next((c=>(a.Sn(),c))).catch((c=>(a.abort(c),b.reject(c)))).toPromise();return B.catch((()=>{})),await a.bn,B}catch(a){const B=a,c=B.name!=="FirebaseError"&&o<3;if(M(wt,"Transaction failed with error:",B.message,"Retrying:",c),this.close(),!c)return Promise.reject(B)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Im(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class OA{constructor(e){this.Bn=e,this.Un=!1,this.kn=null}get isDone(){return this.Un}get qn(){return this.kn}set cursor(e){this.Bn=e}done(){this.Un=!0}$n(e){this.kn=e}delete(){return br(this.Bn.delete())}}class zi extends H{constructor(e,t){super(F.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Cr(r){return r.name==="IndexedDbTransactionError"}class FA{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(M(wt,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(M(wt,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),br(n)}add(e){return M(wt,"ADD",this.store.name,e,e),br(this.store.add(e))}get(e){return br(this.store.get(e)).next((t=>(t===void 0&&(t=null),M(wt,"GET",this.store.name,e,t),t)))}delete(e){return M(wt,"DELETE",this.store.name,e),br(this.store.delete(e))}count(){return M(wt,"COUNT",this.store.name),br(this.store.count())}Kn(e,t){const n=this.options(e,t),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new b(((o,a)=>{i.onerror=B=>{a(B.target.error)},i.onsuccess=B=>{o(B.target.result)}}))}{const i=this.cursor(n),o=[];return this.Qn(i,((a,B)=>{o.push(B)})).next((()=>o))}}Wn(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new b(((s,i)=>{n.onerror=o=>{i(o.target.error)},n.onsuccess=o=>{s(o.target.result)}}))}Gn(e,t){M(wt,"DELETE ALL",this.store.name);const n=this.options(e,t);n.zn=!1;const s=this.cursor(n);return this.Qn(s,((i,o,a)=>a.delete()))}jn(e,t){let n;t?n=e:(n={},t=e);const s=this.cursor(n);return this.Qn(s,t)}Hn(e){const t=this.cursor({});return new b(((n,s)=>{t.onerror=i=>{const o=El(i.target.error);s(o)},t.onsuccess=i=>{const o=i.target.result;o?e(o.primaryKey,o.value).next((a=>{a?o.continue():n()})):n()}}))}Qn(e,t){const n=[];return new b(((s,i)=>{e.onerror=o=>{i(o.target.error)},e.onsuccess=o=>{const a=o.target.result;if(!a)return void s();const B=new OA(a),c=t(a.primaryKey,a.value,B);if(c instanceof b){const h=c.catch((f=>(B.done(),b.reject(f))));n.push(h)}B.isDone?s():B.qn===null?a.continue():a.continue(B.qn)}})).next((()=>b.waitFor(n)))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.zn?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function br(r){return new b(((e,t)=>{r.onsuccess=n=>{const s=n.target.result;e(s)},r.onerror=n=>{const s=El(n.target.error);t(s)}}))}let tC=!1;function El(r){const e=Xn.Dn(Je());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new H("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return tC||(tC=!0,setTimeout((()=>{throw n}),0)),n}}return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nC="LruGarbageCollector",ym=1048576;function rC([r,e],[t,n]){const s=ie(r,t);return s===0?ie(e,n):s}class xA{constructor(e){this.Jn=e,this.buffer=new me(rC),this.Yn=0}Zn(){return++this.Yn}Xn(e){const t=[e,this.Zn()];if(this.buffer.size<this.Jn)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();rC(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class wm{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.er=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.tr(6e4)}stop(){this.er&&(this.er.cancel(),this.er=null)}get started(){return this.er!==null}tr(e){M(nC,`Garbage collection scheduled in ${e}ms`),this.er=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.er=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Cr(t)?M(nC,"Ignoring IndexedDB error during garbage collection: ",t):await dr(t)}await this.tr(3e5)}))}}class LA{constructor(e,t){this.nr=e,this.params=t}calculateTargetCount(e,t){return this.nr.rr(e).next((n=>Math.floor(t/100*n)))}nthSequenceNumber(e,t){if(t===0)return b.resolve(gt.yn);const n=new xA(t);return this.nr.forEachTarget(e,(s=>n.Xn(s.sequenceNumber))).next((()=>this.nr.ir(e,(s=>n.Xn(s))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.nr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.nr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(M("LruGarbageCollector","Garbage collection skipped; disabled"),b.resolve(eC)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(M("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),eC):this.sr(e,t)))}getCacheSize(e){return this.nr.getCacheSize(e)}sr(e,t){let n,s,i,o,a,B,c;const h=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((f=>(f>this.params.maximumSequenceNumbersToCollect?(M("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${f}`),s=this.params.maximumSequenceNumbersToCollect):s=f,o=Date.now(),this.nthSequenceNumber(e,s)))).next((f=>(n=f,a=Date.now(),this.removeTargets(e,n,t)))).next((f=>(i=f,B=Date.now(),this.removeOrphanedDocuments(e,n)))).next((f=>(c=Date.now(),Ds()<=ce.DEBUG&&M("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-h}ms
	Determined least recently used ${s} in `+(a-o)+`ms
	Removed ${i} targets in `+(B-a)+`ms
	Removed ${f} documents in `+(c-B)+`ms
Total Duration: ${c-h}ms`),b.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:f}))))}}function Tm(r,e){return new LA(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Am="firestore.googleapis.com",sC=!0;class iC{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new H(F.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Am,this.ssl=sC}else this.host=e.host,this.ssl=e.ssl??sC;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=Em;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<ym)throw new H(F.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(_T("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=pm(e.experimentalLongPollingOptions??{}),(function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new H(F.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new H(F.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new H(F.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new H(F.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&(function(n,s){if(n===s)return!0;if(!n||!s)return!1;const i=Object.keys(n),o=Object.keys(s);if(i.length!==o.length)return!1;for(const a of i)if(n[a]!==s[a])return!1;return!0})(this._customHeaders,e._customHeaders)}}let Ou=class{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new iC({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new H(F.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new H(F.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new iC(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new CA;switch(n.type){case"firstParty":return new EA(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new H(F.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const n=Zd.get(t);n&&(M(PA,"Removing Datastore"),Zd.delete(t),n.terminate())})(this),Promise.resolve()}};function kA(r,e,t,n={}){var c;r=lt(r,Ou);const s=Zs(e),i=r._getSettings(),o={...i,emulatorOptions:r._getEmulatorOptions()},a=`${e}:${t}`;s&&Uc(`https://${a}`),i.host!==Am&&i.host!==a&&Ft("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const B={...i,host:a,ssl:s,emulatorOptions:n};if(!tr(B,o)&&(r._setSettings(B),n.mockUserToken)){let h,f;if(typeof n.mockUserToken=="string")h=n.mockUserToken,f=We.MOCK_USER;else{h=hD(n.mockUserToken,(c=r._app)==null?void 0:c.options.projectId);const C=n.mockUserToken.sub||n.mockUserToken.user_id;if(!C)throw new H(F.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");f=new We(C)}r._authCredentials=new pA(new Cm(h,f))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pr{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new pr(this.firestore,e,this._query)}}class Oe{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Zn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Oe(this.firestore,e,this._key)}toJSON(){return{type:Oe._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(Po(t,Oe._jsonSchema))return new Oe(e,n||null,new J(Be.fromString(t.referencePath)))}}Oe._jsonSchemaVersion="firestore/documentReference/1.0",Oe._jsonSchema={type:Ge("string",Oe._jsonSchemaVersion),referencePath:Ge("string")};class Zn extends pr{constructor(e,t,n){super(e,t,xo(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Oe(this.firestore,null,new J(e))}withConverter(e){return new Zn(this.firestore,e,this._path)}}function y0(r,e,...t){if(r=ve(r),_g("collection","path",e),r instanceof Ou){const n=Be.fromString(e,...t);return vd(n),new Zn(r,null,n)}{if(!(r instanceof Oe||r instanceof Zn))throw new H(F.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Be.fromString(e,...t));return vd(n),new Zn(r.firestore,null,n)}}function VA(r,e,...t){if(r=ve(r),arguments.length===1&&(e=rl.newId()),_g("doc","path",e),r instanceof Ou){const n=Be.fromString(e,...t);return Rd(n),new Oe(r,null,new J(n))}{if(!(r instanceof Oe||r instanceof Zn))throw new H(F.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Be.fromString(e,...t));return Rd(n),new Oe(r.firestore,r instanceof Zn?r.converter:null,new J(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:mt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Po(e,mt._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new mt(e.vectorValues);throw new H(F.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}mt._jsonSchemaVersion="firestore/vectorValue/1.0",mt._jsonSchema={type:Ge("string",mt._jsonSchemaVersion),vectorValues:Ge("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MA=/^__.*__$/;class GA{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new Rn(e,this.data,this.fieldMask,t,this.fieldTransforms):new ri(e,this.data,t,this.fieldTransforms)}}class Rm{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new Rn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function vm(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw W(40011,{dataSource:r})}}class _l{constructor(e,t,n,s,i,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new _l({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePathSegment(e),n}childContextForFieldPath(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePath(),n}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return ru(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(vm(this.dataSource)&&MA.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class HA{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||Pu(e)}createContext(e,t,n,s=!1){return new _l({dataSource:e,methodName:t,targetDoc:n,path:Ke.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Vo(r){const e=r._freezeSettings(),t=Pu(r._databaseId);return new HA(r._databaseId,!!e.ignoreUndefinedProperties,t)}function Dl(r,e,t,n,s,i={}){const o=r.createContext(i.merge||i.mergeFields?2:0,e,t,s);Il("Data must be an object, but it was:",o,n);const a=Pm(n,o);let B,c;if(i.merge)B=new pt(o.fieldMask),c=o.fieldTransforms;else if(i.mergeFields){const h=[];for(const f of i.mergeFields){const C=ir(e,f,t);if(!o.contains(C))throw new H(F.INVALID_ARGUMENT,`Field '${C}' is specified in your field mask but missing from your input data.`);Fm(h,C)||h.push(C)}B=new pt(h),c=o.fieldTransforms.filter((f=>B.covers(f.field)))}else B=null,c=o.fieldTransforms;return new GA(new Ze(a),B,c)}class Fu extends ml{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Fu}}function bm(r,e,t,n){const s=r.createContext(1,e,t);Il("Data must be an object, but it was:",s,n);const i=[],o=Ze.empty();fr(n,((B,c)=>{const h=Om(e,B,t);c=ve(c);const f=s.childContextForFieldPath(h);if(c instanceof Fu)i.push(h);else{const C=sr(c,f);C!=null&&(i.push(h),o.set(h,C))}}));const a=new pt(i);return new Rm(o,a,s.fieldTransforms)}function Sm(r,e,t,n,s,i){const o=r.createContext(1,e,t),a=[ir(e,n,t)],B=[s];if(i.length%2!=0)throw new H(F.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let C=0;C<i.length;C+=2)a.push(ir(e,i[C])),B.push(i[C+1]);const c=[],h=Ze.empty();for(let C=a.length-1;C>=0;--C)if(!Fm(c,a[C])){const _=a[C];let R=B[C];R=ve(R);const L=o.childContextForFieldPath(_);if(R instanceof Fu)c.push(_);else{const G=sr(R,L);G!=null&&(c.push(_),h.set(_,G))}}const f=new pt(c);return new Rm(h,f,o.fieldTransforms)}function UA(r,e,t,n=!1){return sr(t,r.createContext(n?4:3,e))}function sr(r,e,t){if(Nm(r=ve(r)))return Il("Unsupported field value:",e,r),Pm(r,e);if(r instanceof ml)return(function(s,i){if(!vm(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);const o=s._toFieldTransform(i);o&&i.fieldTransforms.push(o)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){const o=[];let a=0;for(const B of s){let c=sr(B,i.childContextForArray(a));c==null&&(c={nullValue:"NULL_VALUE"}),o.push(c),a++}return{arrayValue:{values:o}}})(r,e)}return(function(s,i,o){if((s=ve(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return al(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const a=Ee.fromDate(s);return{timestampValue:Us(i.serializer,a)}}if(s instanceof Ee){const a=new Ee(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Us(i.serializer,a)}}if(s instanceof tn)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Nt)return{bytesValue:tm(i.serializer,s._byteString)};if(s instanceof Oe){const a=i.databaseId,B=s.firestore._databaseId;if(!B.isEqual(a))throw i.createError(`Document reference is for database ${B.projectId}/${B.database} but should be for database ${a.projectId}/${a.database}`);return{referenceValue:gl(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof mt)return(function(B,c){const h=B instanceof mt?B.toArray():B;return{mapValue:{fields:{[sl]:{stringValue:il},[$r]:{arrayValue:{values:h.map((C=>{if(typeof C!="number")throw c.createError("VectorValues must only contain numeric values.");return Ru(c.serializer,C)}))}}}}}})(s,i);if(fm(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${wu(s)}`)})(r,e)}function Pm(r,e){const t={};return Eg(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):fr(r,((n,s)=>{const i=sr(s,e.childContextForField(n));i!=null&&(t[n]=i)})),{mapValue:{fields:t}}}function Nm(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof Ee||r instanceof tn||r instanceof Nt||r instanceof Oe||r instanceof ml||r instanceof mt||fm(r))}function Il(r,e,t){if(!Nm(t)||!So(t)){const n=wu(t);throw n==="an object"?e.createError(r+" a custom object"):e.createError(r+" "+n)}}function ir(r,e,t){if((e=ve(e))instanceof ko)return e._internalPath;if(typeof e=="string")return Om(r,e);throw ru("Field path arguments must be of type string or ",r,!1,void 0,t)}const jA=new RegExp("[~\\*/\\[\\]]");function Om(r,e,t){if(e.search(jA)>=0)throw ru(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new ko(...e.split("."))._internalPath}catch{throw ru(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function ru(r,e,t,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let a=`Function ${e}() called with invalid data`;t&&(a+=" (via `toFirestore()`)"),a+=". ";let B="";return(i||o)&&(B+=" (found",i&&(B+=` in field ${n}`),o&&(B+=` in document ${s}`),B+=")"),new H(F.INVALID_ARGUMENT,a+r+B)}function Fm(r,e){return r.some((t=>t.isEqual(e)))}function xm(r){return typeof r._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){const n=Ze.empty();for(const s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){const i=this.optionDefinitions[s];if(s in e){const o=e[s];let a;i.nestedOptions&&So(o)?a={mapValue:{fields:new at(i.nestedOptions).getOptionsProto(t,o)}}:o&&(a=sr(o,t)??void 0),a&&n.set(Ke.fromServerFormat(i.serverName),a)}}return n}getOptionsProto(e,t,n){const s=this._getKnownOptions(t,e);if(n){const i=new Map(ET(n,((o,a)=>[Ke.fromServerFormat(a),o!==void 0?sr(o,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qA(r){return typeof r=="object"&&r!==null&&!!("nullValue"in r&&(r.nullValue===null||r.nullValue==="NULL_VALUE")||"booleanValue"in r&&(r.booleanValue===null||typeof r.booleanValue=="boolean")||"integerValue"in r&&(r.integerValue===null||typeof r.integerValue=="number"||typeof r.integerValue=="string")||"doubleValue"in r&&(r.doubleValue===null||typeof r.doubleValue=="number")||"timestampValue"in r&&(r.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(r.timestampValue))||"stringValue"in r&&(r.stringValue===null||typeof r.stringValue=="string")||"bytesValue"in r&&(r.bytesValue===null||r.bytesValue instanceof Uint8Array)||"referenceValue"in r&&(r.referenceValue===null||typeof r.referenceValue=="string")||"geoPointValue"in r&&(r.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(r.geoPointValue))||"arrayValue"in r&&(r.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(r.arrayValue))||"mapValue"in r&&(r.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!So(t.fields))})(r.mapValue))||"fieldReferenceValue"in r&&(r.fieldReferenceValue===null||typeof r.fieldReferenceValue=="string")||"functionValue"in r&&(r.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(r.functionValue))||"pipelineValue"in r&&(r.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(r.pipelineValue)))}function KA(r){return new mt(r)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K(r){let e;return r instanceof ss?r:(e=So(r)?WA(r):r instanceof Array?YA(r):Lm(r,void 0),e)}function VB(r){if(r instanceof ss)return r;if(r instanceof mt)return fo(r);if(Array.isArray(r))return fo(KA(r));throw new Error("Unsupported value: "+typeof r)}function yl(r){return TT(r)?xa(r):K(r)}class ss{constructor(){this._protoValueType="ProtoValue"}add(e){return new k("add",[this,K(e)],"add")}asBoolean(){if(this instanceof or)return this;if(this instanceof os)return new Vm(this);if(this instanceof is)return new $A(this);if(this instanceof k)return new km(this);throw new H("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new k("subtract",[this,K(e)],"subtract")}multiply(e){return new k("multiply",[this,K(e)],"multiply")}divide(e){return new k("divide",[this,K(e)],"divide")}mod(e){return new k("mod",[this,K(e)],"mod")}equal(e){return new k("equal",[this,K(e)],"equal").asBoolean()}notEqual(e){return new k("not_equal",[this,K(e)],"notEqual").asBoolean()}lessThan(e){return new k("less_than",[this,K(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new k("less_than_or_equal",[this,K(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new k("greater_than",[this,K(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new k("greater_than_or_equal",[this,K(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){const n=[e,...t].map((s=>K(s)));return new k("array_concat",[this,...n],"arrayConcat")}arrayContains(e){return new k("array_contains",[this,K(e)],"arrayContains").asBoolean()}arrayContainsAll(e){const t=Array.isArray(e)?new ki(e.map(K),"arrayContainsAll"):e;return new k("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){const t=Array.isArray(e)?new ki(e.map(K),"arrayContainsAny"):e;return new k("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new k("array_reverse",[this])}arrayLength(){return new k("array_length",[this],"arrayLength")}equalAny(e){const t=Array.isArray(e)?new ki(e.map(K),"equalAny"):e;return new k("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){const t=Array.isArray(e)?new ki(e.map(K),"notEqualAny"):e;return new k("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new k("exists",[this],"exists").asBoolean()}charLength(){return new k("char_length",[this],"charLength")}like(e){return new k("like",[this,K(e)],"like").asBoolean()}regexContains(e){return new k("regex_contains",[this,K(e)],"regexContains").asBoolean()}regexFind(e){return new k("regex_find",[this,K(e)],"regexFind")}regexFindAll(e){return new k("regex_find_all",[this,K(e)],"regexFindAll")}regexMatch(e){return new k("regex_match",[this,K(e)],"regexMatch").asBoolean()}stringContains(e){return new k("string_contains",[this,K(e)],"stringContains").asBoolean()}startsWith(e){return new k("starts_with",[this,K(e)],"startsWith").asBoolean()}endsWith(e){return new k("ends_with",[this,K(e)],"endsWith").asBoolean()}toLower(){return new k("to_lower",[this],"toLower")}toUpper(){return new k("to_upper",[this],"toUpper")}trim(e){const t=[this];return e&&t.push(K(e)),new k("trim",t,"trim")}ltrim(e){const t=[this];return e&&t.push(K(e)),new k("ltrim",t,"ltrim")}rtrim(e){const t=[this];return e&&t.push(K(e)),new k("rtrim",t,"rtrim")}type(){return new k("type",[this])}isType(e){return new k("is_type",[this,fo(e)],"isType").asBoolean()}stringConcat(e,...t){const n=[e,...t].map(K);return new k("string_concat",[this,...n],"stringConcat")}stringIndexOf(e){return new k("string_index_of",[this,K(e)],"stringIndexOf")}stringRepeat(e){return new k("string_repeat",[this,K(e)],"stringRepeat")}stringReplaceAll(e,t){return new k("string_replace_all",[this,K(e),K(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new k("string_replace_one",[this,K(e),K(t)],"stringReplaceOne")}concat(e,...t){const n=[e,...t].map(K);return new k("concat",[this,...n],"concat")}reverse(){return new k("reverse",[this],"reverse")}arrayFilter(e,t){return new k("array_filter",[this,K(e),t],"arrayFilter")}arrayTransform(e,t){return new k("array_transform",[this,K(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,n){return new k("array_transform",[this,K(e),K(t),n],"arrayTransformWithIndex")}arraySlice(e,t){const n=[this,K(e)];return t!==void 0&&n.push(K(t)),new k("array_slice",n,"arraySlice")}arrayFirst(){return new k("array_first",[this],"arrayFirst")}arrayFirstN(e){return new k("array_first_n",[this,K(e)],"arrayFirstN")}arrayLast(){return new k("array_last",[this],"arrayLast")}arrayLastN(e){return new k("array_last_n",[this,K(e)],"arrayLastN")}arrayMaximum(){return new k("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new k("maximum_n",[this,K(e)],"arrayMaximumN")}arrayMinimum(){return new k("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new k("minimum_n",[this,K(e)],"arrayMinimumN")}arrayIndexOf(e){return new k("array_index_of",[this,K(e),K("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new k("array_index_of",[this,K(e),K("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new k("array_index_of_all",[this,K(e)],"arrayIndexOfAll")}byteLength(){return new k("byte_length",[this],"byteLength")}ceil(){return new k("ceil",[this])}floor(){return new k("floor",[this])}abs(){return new k("abs",[this])}exp(){return new k("exp",[this])}mapGet(e){return new k("map_get",[this,fo(e)],"mapGet")}mapSet(e,t,...n){const s=[this,K(e),K(t),...n.map(K)];return new k("map_set",s,"mapSet")}mapKeys(){return new k("map_keys",[this],"mapKeys")}mapValues(){return new k("map_values",[this],"mapValues")}mapEntries(){return new k("map_entries",[this],"mapEntries")}getField(e){return new k("get_field",[this,K(e)],"get_field")}count(){return yt._create("count",[this],"count")}sum(){return yt._create("sum",[this],"sum")}average(){return yt._create("average",[this],"average")}minimum(){return yt._create("minimum",[this],"minimum")}maximum(){return yt._create("maximum",[this],"maximum")}first(){return yt._create("first",[this],"first")}last(){return yt._create("last",[this],"last")}arrayAgg(){return yt._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return yt._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return yt._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){const n=[e,...t];return new k("maximum",[this,...n.map(K)],"logicalMaximum")}logicalMinimum(e,...t){const n=[e,...t];return new k("minimum",[this,...n.map(K)],"minimum")}vectorLength(){return new k("vector_length",[this],"vectorLength")}cosineDistance(e){return new k("cosine_distance",[this,VB(e)],"cosineDistance")}dotProduct(e){return new k("dot_product",[this,VB(e)],"dotProduct")}euclideanDistance(e){return new k("euclidean_distance",[this,VB(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new k("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new k("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new k("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new k("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new k("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new k("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new k("timestamp_add",[this,K(e),K(t)],"timestampAdd")}timestampSubtract(e,t){return new k("timestamp_subtract",[this,K(e),K(t)],"timestampSubtract")}timestampDiff(e,t){return new k("timestamp_diff",[this,yl(e),K(t)],"timestampDiff")}timestampExtract(e,t){const n=[this,K(e)];return t&&n.push(K(t)),new k("timestamp_extract",n,"timestampExtract")}documentId(){return new k("document_id",[this],"documentId")}parent(){return new k("parent",[this],"parent")}substring(e,t){const n=K(e);return new k("substring",t===void 0?[this,n]:[this,n,K(t)],"substring")}arrayGet(e){return new k("array_get",[this,K(e)],"arrayGet")}isError(){return new k("is_error",[this],"isError").asBoolean()}ifError(e){const t=new k("if_error",[this,K(e)],"ifError");return e instanceof or?t.asBoolean():t}isAbsent(){return new k("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new k("map_remove",[this,K(e)],"mapRemove")}mapMerge(e,...t){const n=K(e),s=t.map(K);return new k("map_merge",[this,n,...s],"mapMerge")}pow(e){return new k("pow",[this,K(e)])}trunc(e){return e===void 0?new k("trunc",[this]):new k("trunc",[this,K(e)],"trunc")}round(e){return e===void 0?new k("round",[this]):new k("round",[this,K(e)],"round")}collectionId(){return new k("collection_id",[this])}length(){return new k("length",[this])}ln(){return new k("ln",[this])}sqrt(){return new k("sqrt",[this])}stringReverse(){return new k("string_reverse",[this])}ifAbsent(e){return new k("if_absent",[this,K(e)],"ifAbsent")}ifNull(e){return new k("if_null",[this,K(e)],"ifNull")}coalesce(e,...t){return new k("coalesce",[this,K(e),...t.map(K)],"coalesce")}join(e){return new k("join",[this,K(e)],"join")}log10(){return new k("log10",[this])}arraySum(){return new k("sum",[this])}split(e){return new k("split",[this,K(e)])}timestampTruncate(e,t){const n=[this,K(e)];return t&&n.push(K(t)),new k("timestamp_trunc",n)}ascending(){return XA(this)}descending(){return ZA(this)}as(e){return new zA(this,e,"as")}}class yt{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,n){const s=new yt(e,t);return s._methodName=n,s}as(e){return new JA(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}}class JA{constructor(e,t,n){this.aggregate=e,this.alias=t,this._methodName=n}_readUserData(e){this.aggregate._readUserData(e)}}class zA{constructor(e,t,n){this.expr=e,this.alias=t,this._methodName=n,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}}class ki extends ss{constructor(e,t){super(),this.ur=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.ur.map((t=>t._toProto(e)))}}}_readUserData(e){this.ur.forEach((t=>t._readUserData(e)))}}class is extends ss{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new k("geo_distance",[this,K(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}}function xa(r){return QA(r,"field")}function QA(r,e){return new is(typeof r=="string"?Kt===r?dA()._internalPath:ir("field",r):r._internalPath,e)}class os extends ss{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){const t=new os(e,void 0);return t._protoValue=e,t}_toProto(e){return U(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,qA(this._protoValue)||(this._protoValue=sr(this.value,e))}}function fo(r,e){return Lm(r,"constant")}function Lm(r,e){const t=new os(r,e);return typeof r=="boolean"?new Vm(t):t}class k extends ss{constructor(e,t,n,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,n!==void 0&&(this._methodName=n),s!==void 0&&(this._options=s)}get _optionsUtil(){return new at({})}_toProto(e){const t={functionValue:{name:this.name,args:this.params.map((n=>n._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}}class or extends ss{get _methodName(){return this._expr._methodName}countIf(){return yt._create("count_if",[this],"countIf")}not(){return new k("not",[this],"not").asBoolean()}conditional(e,t){return new k("conditional",[this,e,t],"conditional")}ifError(e){const t=K(e),n=new k("if_error",[this,t],"ifError");return t instanceof or?n.asBoolean():n}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}}class km extends or{constructor(e){super(),this._expr=e,this.expressionType="Function"}}class Vm extends or{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}}class $A extends or{constructor(e){super(),this._expr=e,this.expressionType="Field"}}function WA(r,e){const t=[];for(const n in r)if(Object.prototype.hasOwnProperty.call(r,n)){const s=r[n];t.push(fo(n)),t.push(K(s))}return new k("map",t,"map")}function YA(r){return(function(t,n){return new k("array",t.map((s=>K(s))),n)})(r,"array")}function XA(r){return new wl(yl(r),"ascending","ascending")}function ZA(r){return new wl(yl(r),"descending","descending")}class wl{constructor(e,t,n){this.expr=e,this.direction=t,this._methodName=n,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:dm(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}}class Mm extends bt{get _name(){return"add_fields"}get _optionsUtil(){return new at({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[ho(e,this.fields)]}}_readUserData(e){super._readUserData(e),ur(this.fields,e)}}class Gm extends bt{get _name(){return"aggregate"}get _optionsUtil(){return new at({})}constructor(e,t,n){super(n),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[ho(e,this.accumulators),ho(e,this.groups)]}}_readUserData(e){super._readUserData(e),ur(this.groups,e),ur(this.accumulators,e)}}class Hm extends bt{get _name(){return"distinct"}get _optionsUtil(){return new at({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[ho(e,this.groups)]}}_readUserData(e){super._readUserData(e),ur(this.groups,e)}}class Mo extends bt{get _name(){return"collection"}get _optionsUtil(){return new at({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.Er=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.Er}]}}_readUserData(e){super._readUserData(e)}}class Go extends bt{get _name(){return"collection_group"}get _optionsUtil(){return new at({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}}class xu extends bt{get _name(){return"database"}get _optionsUtil(){return new at({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}}class Lu extends bt{get _name(){return"documents"}get _optionsUtil(){return new at({})}constructor(e,t){if(super(t),!e||e.length===0)throw new H(F.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");const n=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(n);if(s.size!==n.length)throw new H(F.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.hr=n,this.Tr=s}_toProto(e){return{...super._toProto(e),args:this.hr.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}}class Ho extends bt{get _name(){return"where"}get _optionsUtil(){return new at({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),ur(this.condition,e)}}class ar extends bt{get _name(){return"limit"}get _optionsUtil(){return new at({})}constructor(e,t){U(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[al(e,this.limit)]}}}class oC extends bt{get _name(){return"offset"}get _optionsUtil(){return new at({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[al(e,this.offset)]}}}class eR extends bt{get _name(){return"select"}get _optionsUtil(){return new at({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[ho(e,this.selections)]}}_readUserData(e){super._readUserData(e),ur(this.selections,e)}}class zt extends bt{get _name(){return"sort"}get _optionsUtil(){return new at({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),ur(this.orderings,e)}}class Tl extends bt{get _name(){return"replace_with"}get _optionsUtil(){return new at({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),dm(Tl.Pr)]}}_readUserData(e){super._readUserData(e),ur(this.map,e)}}Tl.Pr="full_replace";function ur(r,e){return xm(r)?r._readUserData(e):Array.isArray(r)?r.forEach((t=>t._readUserData(e))):r instanceof Map?r.forEach((t=>t._readUserData(e))):Object.values(r).forEach((t=>t._readUserData(e))),r}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi{constructor(e,t,n,s){this._db=e,this.userDataReader=t,this._userDataWriter=n,this.stages=s}Ar(e,t){const n=this.userDataReader.createContext(3,e);return xm(t)?t._readUserData(n):Array.isArray(t)?t.forEach((s=>s._readUserData(n))):t.forEach((s=>s._readUserData(n))),t}where(e){const t=this.stages.map((n=>n));return this.Ar("where",e),t.push(new Ho(e,{})),new Qi(this._db,this.userDataReader,this._userDataWriter,t)}limit(e){const t=this.stages.map((n=>n));return t.push(new ar(e,{})),new Qi(this._db,this.userDataReader,this._userDataWriter,t)}sort(e,...t){const n=this.stages.map((s=>s));return"orderings"in e?n.push(new zt(this.Ar("sort",e.orderings),{})):n.push(new zt(this.Ar("sort",[e,...t]),{})),new Qi(this._db,this.userDataReader,this._userDataWriter,n)}Vr(e){return{pipeline:{stages:this.stages.map((t=>t._toProto(e)))}}}}// Copyright 2024 Google LLC* @license
class st{constructor(e,t,n){this.serializer=e,this.stages=t,this.listenOptions=n,this.isCorePipeline=!0}getPipelineCollection(){return Uo(this)}getPipelineCollectionGroup(){return Al(this)}getPipelineCollectionId(){return Um(this)}getPipelineDocuments(){return su(this)}getPipelineFlavor(){return(function(t){let n="exact";return t.stages.forEach(((s,i)=>{s._name!==Hm.name&&s._name!==Gm.name||(n="keyless"),s._name===eR.name&&n==="exact"&&(n="augmented"),s._name===Mm.name&&i<t.stages.length-1&&n==="exact"&&(n="augmented")})),n})(this)}getPipelineSourceType(){return pn(this)}}function pn(r){const e=r.stages[0];return e instanceof Mo||e instanceof Go||e instanceof xu||e instanceof Lu?e._name:"unknown"}function Uo(r){if(pn(r)==="collection")return r.stages[0].Er}function Al(r){if(pn(r)==="collection_group")return r.stages[0].collectionId}function Um(r){switch(pn(r)){case"collection":return Be.fromString(Uo(r)).lastSegment();case"collection_group":return Al(r);default:return}}function su(r){if(pn(r)==="documents")return r.stages[0].hr}class y{constructor(e,t){this.type=e,this.value=t}static dr(){return new y("ERROR",void 0)}static mr(){return new y("UNSET",void 0)}static pr(){return new y("NULL",en)}static newValue(e){return At(e)?new y("NULL",en):(function(n){return!!n&&"booleanValue"in n})(e)?new y("BOOLEAN",e):Jt(e)?new y("INT",e):Fr(e)?new y("DOUBLE",e):(function(n){return!!n&&"timestampValue"in n&&!!n.timestampValue})(e)?new y("TIMESTAMP",e):(function(n){return!!n&&"stringValue"in n})(e)?new y("STRING",e):(function(n){return!!n&&"bytesValue"in n})(e)?new y("BYTES",e):e.referenceValue?new y("REFERENCE",e):e.geoPointValue?new y("GEO_POINT",e):rr(e)?new y("ARRAY",e):Wr(e)?new y("VECTOR",e):Mr(e)?new y("MAP",e):new y("ERROR",void 0)}gr(){return this.type==="ERROR"||this.type==="UNSET"}yr(){return this.type==="NULL"}}function $i(r){if(!r.gr())return r.value}function jm(r){return r instanceof or?r._expr:r}function ne(r){if((r=jm(r))instanceof is)return new tR(r);if(r instanceof os)return new nR(r);if(r instanceof ki)return new rR(r);if(r instanceof k){if(r.name==="add")return new oR(r);if(r.name==="subtract")return new aR(r);if(r.name==="multiply")return new uR(r);if(r.name==="divide")return new BR(r);if(r.name==="mod")return new cR(r);if(r.name==="and")return new lR(r);if(r.name==="equal")return new yR(r);if(r.name==="not_equal")return new wR(r);if(r.name==="less_than")return new TR(r);if(r.name==="less_than_or_equal")return new AR(r);if(r.name==="greater_than")return new RR(r);if(r.name==="greater_than_or_equal")return new vR(r);if(r.name==="array_concat")return new bR(r);if(r.name==="array_reverse")return new SR(r);if(r.name==="array_contains")return new PR(r);if(r.name==="array_contains_all")return new NR(r);if(r.name==="array_contains_any")return new OR(r);if(r.name==="array_length")return new FR(r);if(r.name==="array_element")return new xR(r);if(r.name==="equal_any")return new qm(r);if(r.name==="not_equal_any")return new fR(r);if(r.name==="is_nan")return new dR(r);if(r.name==="is_not_nan")return new CR(r);if(r.name==="is_null")return new pR(r);if(r.name==="is_not_null")return new gR(r);if(r.name==="is_error")return new mR(r);if(r.name==="exists")return new ER(r);if(r.name==="not")return new ku(r);if(r.name==="or")return new hR(r);if(r.name==="xor")return new Rl(r);if(r.name==="conditional")return new _R(r);if(r.name==="maximum")return new DR(r);if(r.name==="minimum")return new IR(r);if(r.name==="reverse")return new LR(r);if(r.name==="replace_first")return new kR(r);if(r.name==="replace_all")return new VR(r);if(r.name==="char_length")return new MR(r);if(r.name==="byte_length")return new GR(r);if(r.name==="like")return new HR(r);if(r.name==="regex_contains")return new UR(r);if(r.name==="regex_match")return new jR(r);if(r.name==="string_contains")return new qR(r);if(r.name==="starts_with")return new KR(r);if(r.name==="ends_with")return new JR(r);if(r.name==="to_lower")return new zR(r);if(r.name==="to_upper")return new QR(r);if(r.name==="trim")return new $R(r);if(r.name==="string_concat")return new WR(r);if(r.name==="map_get")return new YR(r);if(r.name==="cosine_distance")return new XR(r);if(r.name==="dot_product")return new ZR(r);if(r.name==="euclidean_distance")return new ev(r);if(r.name==="vector_length")return new tv(r);if(r.name==="unix_micros_to_timestamp")return new ov(r);if(r.name==="timestamp_to_unix_micros")return new Bv(r);if(r.name==="unix_millis_to_timestamp")return new av(r);if(r.name==="timestamp_to_unix_millis")return new cv(r);if(r.name==="unix_seconds_to_timestamp")return new uv(r);if(r.name==="timestamp_to_unix_seconds")return new lv(r);if(r.name==="timestamp_add")return new hv(r);if(r.name==="timestamp_subtract")return new fv(r)}throw new Error(`Unknown Expr : ${r}`)}class tR{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===Kt)return y.newValue({referenceValue:lo(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return y.newValue({timestampValue:Fa(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return y.newValue({timestampValue:Fa(e.serializer,t.createTime)});const n=t.data.field(this.expr._fieldPath);return n?Tu(n)?y.newValue((function(i,o){if(i.serverTimestampBehavior==="estimate")return{timestampValue:Fa(i.serializer,ee.fromTimestamp(Os(o)))};if(i.serverTimestampBehavior==="previous"){const a=No(o);if(a)return a}return{nullValue:"NULL_VALUE"}})(e,n)):y.newValue(n):y.mr()}}class nR{constructor(e){this.expr=e}evaluate(e,t){return y.newValue(this.expr._getValue())}}class rR{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.ur.map((s=>ne(s).evaluate(e,t)));return n.some((s=>s.gr()))?y.dr():y.newValue({arrayValue:{values:n.map((s=>s.value))}})}}function et(r){return Fr(r)?Number(r.doubleValue):Number(r.integerValue)}function sn(r){return BigInt(r.integerValue)}const sR=BigInt("0x7fffffffffffffff"),iR=-BigInt("0x8000000000000000");class jo{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length>=2,24778);const n=ne(this.expr.params[0]).evaluate(e,t),s=ne(this.expr.params[1]).evaluate(e,t);let i=this.wr(n,s);for(const o of this.expr.params.slice(2)){const a=ne(o).evaluate(e,t);i=this.wr(i,a)}return i}wr(e,t){if(e.gr()||t.gr())return y.dr();if(e.yr()||t.yr())return y.pr();const n=e.value,s=t.value;if(!Fr(n)&&!Jt(n)||!Fr(s)&&!Jt(s))return y.dr();if(Fr(n)||Fr(s)){const i=this.br(n,s);return i?y.newValue(i):y.dr()}if(Jt(n)&&Jt(s)){const i=this.Sr(n,s);return i===void 0?y.dr():typeof i=="number"?y.newValue({doubleValue:i}):i<iR||i>sR?y.dr():y.newValue({integerValue:`${i}`})}return y.dr()}}function wn(r,e){return He(r)!==He(e)?"TYPE_MISMATCH":_t(r)||_t(e)?"NOT_EQ":At(r)&&At(e)?"EQ":At(r)||At(e)?"NULL":rr(r)&&rr(e)?(function(n,s){var o,a,B;if(((o=n.values)==null?void 0:o.length)!==((a=s.values)==null?void 0:a.length))return"NOT_EQ";let i=!1;for(let c=0;c<(((B=n.values)==null?void 0:B.length)??0);c++){const h=n.values[c],f=s.values[c];switch(wn(h,f)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:W(44609,{vr:h,Dr:f})}}return i?"NULL":"EQ"})(r.arrayValue,e.arrayValue):Wr(r)&&Wr(e)||Mr(r)&&Mr(e)?(function(n,s){const i=n.fields||{},o=s.fields||{};if(Qa(i)!==Qa(o))return"NOT_EQ";let a=!1;for(const B in i)if(i.hasOwnProperty(B)){if(o[B]===void 0)return"NOT_EQ";switch(wn(i[B],o[B])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":a=!0}}return a?"NULL":"EQ"})(r.mapValue,e.mapValue):(function(n,s){return xt(n,s,{o:!1,t:!0,i:!0})})(r,e)?"EQ":"NOT_EQ"}class oR extends jo{Sr(e,t){return sn(e)+sn(t)}br(e,t){return{doubleValue:et(e)+et(t)}}}class aR extends jo{constructor(e){super(e),this.expr=e}Sr(e,t){return sn(e)-sn(t)}br(e,t){return{doubleValue:et(e)-et(t)}}}class uR extends jo{constructor(e){super(e),this.expr=e}Sr(e,t){return sn(e)*sn(t)}br(e,t){return{doubleValue:et(e)*et(t)}}}class BR extends jo{constructor(e){super(e),this.expr=e}Sr(e,t){const n=sn(t);if(n!==BigInt(0))return sn(e)/n}br(e,t){const n=et(t);return n===0?{doubleValue:Fs(n)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:et(e)/n}}}class cR extends jo{constructor(e){super(e),this.expr=e}Sr(e,t){const n=sn(t);if(n!==BigInt(0))return sn(e)%n}br(e,t){const n=et(t);if(n!==0)return{doubleValue:et(e)%n}}}class lR{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const a=ne(o).evaluate(e,t);switch(a.type){case"BOOLEAN":if(!((i=a.value)!=null&&i.booleanValue))return y.newValue(Ye);break;case"NULL":s=!0;break;default:n=!0}}return n?y.dr():s?y.pr():y.newValue(Et)}}class ku{constructor(e){this.expr=e}evaluate(e,t){var s;U(this.expr.params.length===1,9634);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BOOLEAN":return y.newValue({booleanValue:!((s=n.value)!=null&&s.booleanValue)});case"NULL":return y.pr();default:return y.dr()}}}class hR{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const a=ne(o).evaluate(e,t);switch(a.type){case"BOOLEAN":if((i=a.value)!=null&&i.booleanValue)return y.newValue(Et);break;case"NULL":s=!0;break;default:n=!0}}return n?y.dr():s?y.pr():y.newValue(Ye)}}class Rl{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const a=ne(o).evaluate(e,t);switch(a.type){case"BOOLEAN":n=Rl.xor(n,!!((i=a.value)!=null&&i.booleanValue));break;case"NULL":s=!0;break;default:return y.dr()}}return s?y.pr():y.newValue({booleanValue:n})}static xor(e,t){return(e||t)&&!(e&&t)}}class qm{constructor(e){this.expr=e}evaluate(e,t){var o,a;U(this.expr.params.length===2,55094);let n=!1;const s=ne(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":n=!0;break;case"ERROR":case"UNSET":return y.dr()}const i=ne(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return y.dr()}if(n)return y.pr();for(const B of((a=(o=i.value)==null?void 0:o.arrayValue)==null?void 0:a.values)??[])switch(At(s.value)&&At(B)?"EQ":wn(s.value,B)){case"EQ":return y.newValue(Et);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:W(44608,{value:s.value,candidate:B})}return n?y.pr():y.newValue(Ye)}}class fR{constructor(e){this.expr=e}evaluate(e,t){return new ku(new k("not",[new k("equal_any",this.expr.params)])).evaluate(e,t)}}class dR{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===1,23322);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"INT":return y.newValue(Ye);case"DOUBLE":return y.newValue({booleanValue:isNaN(et(n.value))});case"NULL":return y.pr();default:return y.dr()}}}class CR{constructor(e){this.expr=e}evaluate(e,t){return U(this.expr.params.length===1,50406),new ku(new k("not",[new k("is_nan",this.expr.params)])).evaluate(e,t)}}class pR{constructor(e){this.expr=e}evaluate(e,t){switch(U(this.expr.params.length===1,23123),ne(this.expr.params[0]).evaluate(e,t).type){case"NULL":return y.newValue(Et);case"UNSET":case"ERROR":return y.dr();default:return y.newValue(Ye)}}}class gR{constructor(e){this.expr=e}evaluate(e,t){return U(this.expr.params.length===1,23167),new ku(new k("not",[new k("is_null",this.expr.params)])).evaluate(e,t)}}class mR{constructor(e){this.expr=e}evaluate(e,t){return U(this.expr.params.length===1,5228),ne(this.expr.params[0]).evaluate(e,t).type==="ERROR"?y.newValue(Et):y.newValue(Ye)}}class ER{constructor(e){this.expr=e}evaluate(e,t){switch(U(this.expr.params.length===1,6877),ne(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return y.dr();case"UNSET":return y.newValue(Ye);default:return y.newValue(Et)}}}class _R{constructor(e){this.expr=e}evaluate(e,t){var s;U(this.expr.params.length===3,11706);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BOOLEAN":return(s=n.value)!=null&&s.booleanValue?ne(this.expr.params[1]).evaluate(e,t):ne(this.expr.params[2]).evaluate(e,t);case"NULL":return ne(this.expr.params[2]).evaluate(e,t);default:return y.dr()}}}class DR{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((i=>ne(i).evaluate(e,t)));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||ot(i.value,s.value)>0?i:s}return s===void 0?y.pr():s}}class IR{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((i=>ne(i).evaluate(e,t)));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||ot(i.value,s.value)<0?i:s}return s===void 0?y.pr():s}}class ii{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"ERROR":case"UNSET":return y.dr()}const s=ne(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return y.dr()}return this.Cr(n,s)}}class yR extends ii{constructor(e){super(e),this.expr=e}Cr(e,t){if(e.yr()&&t.yr())return y.newValue(Et);if(e.yr()||t.yr()||_t(e.value)||_t(t.value)||He(e.value)!==He(t.value))return y.newValue(Ye);switch(wn(e.value,t.value)){case"EQ":return y.newValue(Et);case"NOT_EQ":return y.newValue(Ye);case"NULL":return y.pr();default:W(44615,{left:e,right:t})}}}class wR extends ii{constructor(e){super(e),this.expr=e}Cr(e,t){switch(wn(e.value,t.value)){case"EQ":return y.newValue(Ye);case"NOT_EQ":case"TYPE_MISMATCH":return y.newValue(Et);case"NULL":return y.pr();default:W(44614,{left:e,right:t})}}}class TR extends ii{constructor(e){super(e),this.expr=e}Cr(e,t){return He(e.value)!==He(t.value)||_t(e.value)||_t(t.value)?y.newValue(Ye):y.newValue({booleanValue:ot(e.value,t.value)<0})}}class AR extends ii{constructor(e){super(e),this.expr=e}Cr(e,t){return He(e.value)!==He(t.value)||_t(e.value)||_t(t.value)?y.newValue(Ye):wn(e.value,t.value)==="EQ"?y.newValue(Et):y.newValue({booleanValue:ot(e.value,t.value)<0})}}class RR extends ii{constructor(e){super(e),this.expr=e}Cr(e,t){return He(e.value)!==He(t.value)||_t(e.value)||_t(t.value)?y.newValue(Ye):y.newValue({booleanValue:ot(e.value,t.value)>0})}}class vR extends ii{constructor(e){super(e),this.expr=e}Cr(e,t){return He(e.value)!==He(t.value)||_t(e.value)||_t(t.value)?y.newValue(Ye):wn(e.value,t.value)==="EQ"?y.newValue(Et):y.newValue({booleanValue:ot(e.value,t.value)>0})}}class bR{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class SR{constructor(e){this.expr=e}evaluate(e,t){var s;U(this.expr.params.length===1,216);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return y.pr();case"ARRAY":{const i=((s=n.value.arrayValue)==null?void 0:s.values)??[];return y.newValue({arrayValue:{values:[...i].reverse()}})}default:return y.dr()}}}class PR{constructor(e){this.expr=e}evaluate(e,t){return U(this.expr.params.length===2,52884),new qm(new k("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}}class NR{constructor(e){this.expr=e}evaluate(e,t){var B,c,h,f;U(this.expr.params.length===2,1392);let n=!1;const s=ne(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return y.dr()}const i=ne(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return y.dr()}if(n)return y.pr();const o=((c=(B=i.value)==null?void 0:B.arrayValue)==null?void 0:c.values)??[],a=((f=(h=s.value)==null?void 0:h.arrayValue)==null?void 0:f.values)??[];for(const C of o){let _=!1;n=!1;for(const R of a){switch(At(C)&&At(R)?"EQ":wn(C,R)){case"EQ":_=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:W(44613,{value:R,search:C})}if(_)break}if(!_)return y.newValue(Ye)}return y.newValue(Et)}}class OR{constructor(e){this.expr=e}evaluate(e,t){var B,c,h,f;U(this.expr.params.length===2,2680);let n=!1;const s=ne(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return y.dr()}const i=ne(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return y.dr()}if(n)return y.pr();const o=((c=(B=i.value)==null?void 0:B.arrayValue)==null?void 0:c.values)??[],a=((f=(h=s.value)==null?void 0:h.arrayValue)==null?void 0:f.values)??[];for(const C of a)for(const _ of o)switch(At(C)&&At(_)?"EQ":wn(C,_)){case"EQ":return y.newValue(Et);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:W(60403,{value:C,search:_})}return n?y.pr():y.newValue(Ye)}}class FR{constructor(e){this.expr=e}evaluate(e,t){var s,i,o;U(this.expr.params.length===1,38605);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return y.pr();case"ARRAY":return y.newValue({integerValue:`${((o=(i=(s=n.value)==null?void 0:s.arrayValue)==null?void 0:i.values)==null?void 0:o.length)??0}`});default:return y.dr()}}}class xR{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class LR{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,1508);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return y.pr();case"BYTES":{const o=(s=n.value)==null?void 0:s.bytesValue;if(typeof o=="string"){const a=Ne.fromBase64String(o).toUint8Array();return a.reverse(),y.newValue({bytesValue:Ne.fromUint8Array(a).toBase64()})}return y.newValue({bytesValue:new Uint8Array(o).reverse()})}case"STRING":{const o=(i=n.value)==null?void 0:i.stringValue,a=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(o),B=Array.from(a,(c=>c.segment)).reverse();return y.newValue({stringValue:B.join("")})}default:return y.dr()}}}class kR{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class VR{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class MR{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===1,19400);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return y.pr();case"STRING":{const s=(function(o){let a=0;for(let B=0;B<o.length;B++){const c=o.codePointAt(B);if(c===void 0)return;if(c<=65535)if(c>=55296&&c<=57343)if(c<=56319){const h=o.codePointAt(B+1);h!==void 0&&h>=56320&&h<=57343?(a+=1,B++):a+=1}else a+=1;else a+=1;else{if(!(c<=1114111))return;a+=1,B++}}return a})(n.value.stringValue);return s===void 0?y.dr():y.newValue({integerValue:s})}default:return y.dr()}}}class GR{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,8486);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BYTES":{const o=(s=n.value)==null?void 0:s.bytesValue;return typeof o=="string"?y.newValue({integerValue:Ne.fromBase64String(o).toUint8Array().length}):y.newValue({integerValue:new Uint8Array(o).length})}case"STRING":{const o=(function(B){let c=0;for(let h=0;h<B.length;h++){const f=B.codePointAt(h);if(f===void 0)return;if(f>=55296&&f<=57343){if(!(f<=56319))return;{const C=B.codePointAt(h+1);if(C===void 0||!(C>=56320&&C<=57343))return;c+=4,h++}}else if(f<=127)c+=1;else if(f<=2047)c+=2;else if(f<=65535)c+=3;else{if(!(f<=1114111))return;c+=4,h++}}return c})((i=n.value)==null?void 0:i.stringValue);return o===void 0?y.dr():y.newValue({integerValue:o})}case"NULL":return y.pr();default:return y.dr()}}}class oi{constructor(e){this.expr=e}evaluate(e,t){var o,a;U(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let n=!1;const s=ne(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":n=!0;break;default:return y.dr()}const i=ne(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":n=!0;break;default:return y.dr()}return n?y.pr():this.Fr((o=s.value)==null?void 0:o.stringValue,(a=i.value)==null?void 0:a.stringValue)}}class HR extends oi{Fr(e,t){try{const n=(function(o){let a="";for(let B=0;B<o.length;B++){const c=o.charAt(B);switch(c){case"_":a+=".";break;case"%":a+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":a+="\\"+c;break;default:a+=c}}return"^"+a+"$"})(t),s=tl.compile(n);return y.newValue({booleanValue:s.matches(e)})}catch(n){return Ft(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${n}`),y.dr()}}}class UR extends oi{Fr(e,t){try{const n=tl.compile(t);return y.newValue({booleanValue:n.test(e)})}catch{return Ft(`Invalid regex pattern found in regex_contains: ${t}, returning error`),y.dr()}}}class jR extends oi{Fr(e,t){try{return y.newValue({booleanValue:tl.compile(t).matches(e)})}catch{return Ft(`Invalid regex pattern found in regex_match: ${t}, returning error`),y.dr()}}}class qR extends oi{Fr(e,t){return y.newValue({booleanValue:e.includes(t)})}}class KR extends oi{Fr(e,t){return y.newValue({booleanValue:e.startsWith(t)})}}class JR extends oi{Fr(e,t){return y.newValue({booleanValue:e.endsWith(t)})}}class zR{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,29079);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return y.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.toLowerCase()});case"NULL":return y.pr();default:return y.dr()}}}class QR{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,60487);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return y.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.toUpperCase()});case"NULL":return y.pr();default:return y.dr()}}}class $R{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,28544);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return y.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.trim()});case"NULL":return y.pr();default:return y.dr()}}}class WR{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((o=>ne(o).evaluate(e,t)));let s="",i=!1;for(const o of n)switch(o.type){case"STRING":s+=o.value.stringValue;break;case"NULL":i=!0;break;default:return y.dr()}return i?y.pr():y.newValue({stringValue:s})}}class YR{constructor(e){this.expr=e}evaluate(e,t){var o,a,B,c;U(this.expr.params.length===2,4483);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"UNSET":return y.mr();case"MAP":break;default:return y.dr()}const s=ne(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return y.dr();const i=(c=(a=(o=n.value)==null?void 0:o.mapValue)==null?void 0:a.fields)==null?void 0:c[(B=s.value)==null?void 0:B.stringValue];return i===void 0?y.mr():y.newValue(i)}}class vl{constructor(e){this.expr=e}evaluate(e,t){var c,h;U(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let n=!1;const s=ne(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":n=!0;break;default:return y.dr()}const i=ne(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":n=!0;break;default:return y.dr()}if(n)return y.pr();const o=hc(s.value),a=hc(i.value);if(o===void 0||a===void 0||((c=o.values)==null?void 0:c.length)!==((h=a.values)==null?void 0:h.length))return y.dr();const B=this.Or(o,a);return B===void 0||isNaN(B)?y.dr():y.newValue({doubleValue:B})}}class XR extends vl{Or(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return;let i=0,o=0,a=0;for(let c=0;c<n.length;c++){if(!nr(n[c])||!nr(s[c]))return;const h=et(n[c]),f=et(s[c]);i+=h*f,o+=h*h,a+=f*f}const B=Math.sqrt(o)*Math.sqrt(a);if(B!==0)return 1-Math.max(-1,Math.min(1,i/B))}}class ZR extends vl{Or(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return 0;let i=0;for(let o=0;o<n.length;o++){if(!nr(n[o])||!nr(s[o]))return;i+=et(n[o])*et(s[o])}return i}}class ev extends vl{Or(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return 0;let i=0;for(let o=0;o<n.length;o++){if(!nr(n[o])||!nr(s[o]))return;const a=et(n[o]),B=et(s[o]);i+=Math.pow(a-B,2)}return Math.sqrt(i)}}class tv{constructor(e){this.expr=e}evaluate(e,t){var s;U(this.expr.params.length===1,39044);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"VECTOR":{const i=hc(n.value);return y.newValue({integerValue:((s=i==null?void 0:i.values)==null?void 0:s.length)??0})}case"NULL":return y.pr();default:return y.dr()}}}const Co=BigInt(-62135596800),po=BigInt(253402300799),iu=BigInt(1e3),er=BigInt(1e6),nv=Co*iu,rv=po*iu+BigInt(999),sv=Co*er,iv=po*er+BigInt(999999);function bl(r){return r>=sv&&r<=iv}function Km(r){return r>=Co&&r<=po}function go(r,e){const t=BigInt(r);return!(t<Co||t>po)&&!(e<0||e>=1e9)&&(t!==Co||e===0)&&!(t===po&&e>999999999)}function Jm(r,e){return e<0?{seconds:r-1,nanos:e+1e9}:{seconds:r,nanos:e}}function Sl(r){return BigInt(r.seconds)*er+BigInt(Math.trunc(r.nanoseconds/1e3))}class Pl{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"INT":return this.toTimestamp(BigInt(n.value.integerValue));case"NULL":return y.pr();default:return y.dr()}}}class ov extends Pl{toTimestamp(e){if(!bl(e))return y.dr();let t=Number(e/er),n=Number(e%er*BigInt(1e3));const s=Jm(t,n);return t=s.seconds,n=s.nanos,go(t,n)?y.newValue({timestampValue:{seconds:t,nanos:n}}):y.dr()}}class av extends Pl{toTimestamp(e){if(!(function(o){return o>=nv&&o<=rv})(e))return y.dr();let t=Number(e/iu),n=Number(e%iu*BigInt(1e6));const s=Jm(t,n);return t=s.seconds,n=s.nanos,go(t,n)?y.newValue({timestampValue:{seconds:t,nanos:n}}):y.dr()}}class uv extends Pl{toTimestamp(e){if(!Km(e))return y.dr();const t=Number(e);return y.newValue({timestampValue:{seconds:t,nanos:0}})}}class Nl{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);const n=ne(this.expr.params[0]).evaluate(e,t);switch(n.type){case"TIMESTAMP":break;case"NULL":return y.pr();default:return y.dr()}const s=pl(n.value.timestampValue);return go(s.seconds,s.nanoseconds)?this.Mr(s):y.dr()}}class Bv extends Nl{Mr(e){const t=Sl(e);return bl(t)?y.newValue({integerValue:`${t.toString()}`}):y.dr()}}class cv extends Nl{Mr(e){const t=Sl(e),n=t/BigInt(1e3),s=t%BigInt(1e3);return n>BigInt(0)||s===BigInt(0)?y.newValue({integerValue:n.toString()}):y.newValue({integerValue:(n-BigInt(1)).toString()})}}class lv extends Nl{Mr(e){const t=BigInt(e.seconds);return Km(t)?y.newValue({integerValue:t.toString()}):y.dr()}}class zm{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let n=!1;const s=ne(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":n=!0;break;default:return y.dr()}const i=ne(this.expr.params[1]).evaluate(e,t);let o;switch(i.type){case"STRING":if(o=(function(te){switch(te){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),o===void 0)return y.dr();break;case"NULL":n=!0;break;default:return y.dr()}const a=ne(this.expr.params[2]).evaluate(e,t);switch(a.type){case"INT":break;case"NULL":n=!0;break;default:return y.dr()}if(n)return y.pr();const B=BigInt(a.value.integerValue);let c;try{switch(o){case"microsecond":c=B;break;case"millisecond":c=B*BigInt(1e3);break;case"second":c=B*BigInt(1e6);break;case"minute":c=B*BigInt(6e7);break;case"hour":c=B*BigInt(36e8);break;case"day":c=B*BigInt(864e8);break;default:return y.dr()}if(o!=="microsecond"&&B!==BigInt(0)&&c/B!==BigInt(this.Nr(o)))return y.dr()}catch(Q){return Ft(`Error during timestamp arithmetic: ${Q}`),y.dr()}const h=pl(s.value.timestampValue);if(!go(h.seconds,h.nanoseconds))return y.dr();const f=Sl(h),C=this.Lr(f,c);if(!bl(C))return y.dr();const _=Number(C/er),R=C%er,L=Number((R<0?R+er:R)*BigInt(1e3)),G=R<0?_-1:_;return go(G,L)?y.newValue({timestampValue:{seconds:G,nanos:L}}):y.dr()}Nr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}}class hv extends zm{Lr(e,t){return e+t}}class fv extends zm{Lr(e,t){return e-t}}function mo(r){if((r=jm(r))instanceof is)return`fld(${r.fieldName})`;if(r instanceof os)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof Oe?`ref(${t.path})`:t instanceof mt?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(r.value)})`;if(r instanceof k)return`fn(${r.name},[${r.params.map(mo).join(",")}])`;if(r.expressionType==="ListOfExpressions")return`list([${r.ur.map(mo).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(r,null,2)}`)}function dv(r){if(r instanceof Mm)return`${r._name}(${Ea(r.fields)})`;if(r instanceof Gm){let e=`${r._name}(${Ea(r.accumulators)})`;return r.groups.size>0&&(e+=`grouping(${Ea(r.groups)})`),e}if(r instanceof Hm)return`${r._name}(${Ea(r.groups)})`;if(r instanceof Mo)return`${r._name}(${r.Er})`;if(r instanceof Go)return`${r._name}(${r.collectionId})`;if(r instanceof xu)return`${r._name}()`;if(r instanceof Lu)return`${r._name}(${r.hr.sort()})`;if(r instanceof Ho)return`${r._name}(${mo(r.condition)})`;if(r instanceof ar)return`${r._name}(${r.limit})`;if(r instanceof zt)return`${r._name}(${(function(t){return t.map((n=>`${mo(n.expr)}${n.direction}`)).join(",")})(r.orderings)})`;throw new Error(`Unrecognized stage ${r._name}`)}function Ea(r){return`${Array.from(r.entries()).sort().map((([e,t])=>`${e}=${mo(t)}`)).join(",")}`}function gn(r){return r.stages.map((e=>dv(e))).join("|")}function Qm(r,e){return gn(r)===gn(e)}function Le(r){return r instanceof st}function aC(r){return Le(r)?gn(r):Ki(r)}function $m(r){return Le(r)?gn(r):(function(t){return`${Za(Rt(t))}|lt:${t.limitType}`})(r)}function Vu(r,e){return r instanceof st&&e instanceof st?Qm(r,e):!(r instanceof st&&!(e instanceof st)||!(r instanceof st)&&e instanceof st)&&KT(r,e)}function Mu(r){return cn(r)?gn(r):Za(r)}function Ol(r,e){return r instanceof st&&e instanceof st?Qm(r,e):!(r instanceof st&&!(e instanceof st)||!(r instanceof st)&&e instanceof st)&&ll(r,e)}function Cv(r,e){const t=(function(s){let i=!1;const o=[];for(const a of s)if(a instanceof zt)if(i=!0,a.orderings.some((B=>B.expr instanceof is&&B.expr.fieldName===Kt)))o.push(a);else{const B=a.orderings.map((c=>c));B.push(xa(Kt).ascending()),o.push(new zt(B,{}))}else a instanceof ar&&(i||(o.push(new zt([xa(Kt).ascending()],{})),i=!0)),o.push(a);return i||o.push(new zt([xa(Kt).ascending()],{})),o})(r.stages);if(r.userDataReader){const n=r.userDataReader.createContext(3,"toCorePipeline");t.forEach((s=>s._readUserData(n)))}return new st(r.userDataReader.serializer,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fl{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&OT(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=ji(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=ji(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=Xg();return this.mutations.forEach((s=>{const i=e.get(s.key),o=i.overlayedDocument;let a=this.applyToLocalView(o,i.mutatedFields);a=t.has(s.key)?null:a;const B=xg(o,a);B!==null&&n.set(s.key,B),o.isValidDocument()||o.convertToNoDocument(ee.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),oe())}isEqual(e){return this.batchId===e.batchId&&Ns(this.mutations,e.mutations,((t,n)=>Ld(t,n)))&&Ns(this.baseMutations,e.baseMutations,((t,n)=>Ld(t,n)))}}class xl{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){U(e.mutations.length===n.length,58842,{Br:e.mutations.length,Ur:n.length});let s=(function(){return WT})();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new xl(e,t,n,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ou="";function it(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=uC(e)),e=pv(r.get(t),e);return uC(e)}function pv(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":t+="";break;case ou:t+="";break;default:t+=i}}return t}function uC(r){return r+ou+""}function Qt(r){const e=r.length;if(U(e>=2,64408,{path:r}),e===2)return U(r.charAt(0)===ou&&r.charAt(1)==="",56145,{path:r}),Be.emptyPath();const t=e-2,n=[];let s="";for(let i=0;i<e;){const o=r.indexOf(ou,i);switch((o<0||o>t)&&W(50515,{path:r}),r.charAt(o+1)){case"":const a=r.substring(i,o);let B;s.length===0?B=a:(s+=a,B=s,s=""),n.push(B);break;case"":s+=r.substring(i,o),s+="\0";break;case"":s+=r.substring(i,o+1);break;default:W(61167,{path:r})}i=o+2}return new Be(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rr="remoteDocuments",qo="owner",fs="owner",Eo="mutationQueues",gv="userId",Lt="mutations",BC="batchId",xr="userMutationsIndex",cC=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function La(r,e){return[r,it(e)]}function Wm(r,e,t){return[r,it(e),t]}const mv={},js="documentMutations",au="remoteDocumentsV14",Ev=["prefixPath","collectionGroup","readTime","documentId"],ka="documentKeyIndex",_v=["prefixPath","collectionGroup","documentId"],Ym="collectionGroupIndex",Dv=["collectionGroup","readTime","prefixPath","documentId"],_o="remoteDocumentGlobal",yc="remoteDocumentGlobalKey",qs="targets",Xm="queryTargetsIndex",Iv=["canonicalId","targetId"],Ks="targetDocuments",yv=["targetId","path"],Ll="documentTargetsIndex",wv=["path","targetId"],uu="targetGlobalKey",Hr="targetGlobal",Do="collectionParents",Tv=["collectionId","parent"],Js="clientMetadata",Av="clientId",Gu="bundles",Rv="bundleId",Hu="namedQueries",vv="name",kl="indexConfiguration",bv="indexId",wc="collectionGroupIndex",Sv="collectionGroup",Wi="indexState",Pv=["indexId","uid"],Zm="sequenceNumberIndex",Nv=["uid","sequenceNumber"],Yi="indexEntries",Ov=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],eE="documentKeyIndex",Fv=["indexId","uid","orderedDocumentKey"],Uu="documentOverlays",xv=["userId","collectionPath","documentId"],Tc="collectionPathOverlayIndex",Lv=["userId","collectionPath","largestBatchId"],tE="collectionGroupOverlayIndex",kv=["userId","collectionGroup","largestBatchId"],Vl="globals",Vv="name",nE=[Eo,Lt,js,Rr,qs,qo,Hr,Ks,Js,_o,Do,Gu,Hu],Mv=[...nE,Uu],rE=[Eo,Lt,js,au,qs,qo,Hr,Ks,Js,_o,Do,Gu,Hu,Uu],sE=rE,Ml=[...sE,kl,Wi,Yi],Gv=Ml,iE=[...Ml,Vl],Hv=iE;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oE(r,e,t){const n=r.store(Lt),s=r.store(js),i=[],o=IDBKeyRange.only(t.batchId);let a=0;const B=n.jn({range:o},((h,f,C)=>(a++,C.delete())));i.push(B.next((()=>{U(a===1,47070,{batchId:t.batchId})})));const c=[];for(const h of t.mutations){const f=Wm(e,h.key.path,t.batchId);i.push(s.delete(f)),c.push(h.key)}return b.waitFor(i).next((()=>c))}function Bu(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw W(14731);e=r.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ac extends Dm{constructor(e,t){super(),this.kr=e,this.currentSequenceNumber=t}}function ze(r,e){const t=Y(r);return Xn.xn(t.kr,e)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gl{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t{constructor(e,t,n,s,i=ee.min(),o=ee.min(),a=Ne.EMPTY_BYTE_STRING,B=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=B}withSequenceNumber(e){return new $t(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new $t(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new $t(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new $t(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aE{constructor(e){this.qr=e}}function Uv(r,e){let t;if(e.document)t=oA(r.qr,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=J.fromSegments(e.noDocument.path),s=Xr(e.noDocument.readTime);t=xe.newNoDocument(n,s),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return W(56709);{const n=J.fromSegments(e.unknownDocument.path),s=Xr(e.unknownDocument.version);t=xe.newUnknownDocument(n,s)}}return e.readTime&&t.setReadTime((function(s){const i=new Ee(s[0],s[1]);return ee.fromTimestamp(i)})(e.readTime)),t}function lC(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:cu(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=(function(i,o){return{name:lo(i,o.key),fields:o.data.value.mapValue.fields,updateTime:Us(i,o.version.toTimestamp()),createTime:Us(i,o.createTime.toTimestamp())}})(r.qr,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:Yr(e.version)};else{if(!e.isUnknownDocument())return W(57904,{document:e});n.unknownDocument={path:t.path.toArray(),version:Yr(e.version)}}return n}function cu(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function Yr(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function Xr(r){const e=new Ee(r.seconds,r.nanoseconds);return ee.fromTimestamp(e)}function Sr(r,e){const t=(e.baseMutations||[]).map((i=>Dc(r.qr,i)));for(let i=0;i<e.mutations.length-1;++i){const o=e.mutations[i];if(i+1<e.mutations.length&&e.mutations[i+1].transform!==void 0){const a=e.mutations[i+1];o.updateTransforms=a.transform.fieldTransforms,e.mutations.splice(i+1,1),++i}}const n=e.mutations.map((i=>Dc(r.qr,i))),s=Ee.fromMillis(e.localWriteTimeMs);return new Fl(e.batchId,s,t,n)}function Vi(r,e){const t=Xr(e.readTime),n=e.lastLimboFreeSnapshotVersion!==void 0?Xr(e.lastLimboFreeSnapshotVersion):ee.min();let s;return s=(function(o){return o.structuredPipeline!==void 0})(e.query)?(function(o,a){var h,f;const B=o.structuredPipeline;U((((h=B==null?void 0:B.pipeline)==null?void 0:h.stages)??[]).length>0,1845);const c=(f=B==null?void 0:B.pipeline)==null?void 0:f.stages.map(jv);return new st(a,c)})(e.query,r.qr):(function(o){return o.documents!==void 0})(e.query)?(function(o){const a=o.documents.length;return U(a===1,1966,{count:a}),Rt(xo(sm(o.documents[0])))})(e.query):(function(o){return Rt(um(o))})(e.query),new $t(s,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,Ne.fromBase64String(e.resumeToken))}function uE(r,e){const t=Yr(e.snapshotVersion),n=Yr(e.lastLimboFreeSnapshotVersion);let s;s=cn(e.target)?Bm(r.qr,e.target):hl(e.target)?om(r.qr,e.target):am(r.qr,e.target).be;const i=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:Mu(e.target),readTime:t,resumeToken:i,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function BE(r){const e=um({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?tu(e,e.limit,"L"):e}function _a(r,e){return new Gl(e.largestBatchId,Dc(r.qr,e.overlayMutation))}function hC(r,e){const t=e.path.lastSegment();return[r,it(e.path.popLast()),t]}function fC(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:Yr(n.readTime),documentKey:it(n.documentKey.path),largestBatchId:n.largestBatchId}}function jv(r){switch(r.name){case"collection":return new Mo(r.args[0].referenceValue,{});case"collection_group":return new Go(r.args[1].stringValue,{});case"database":return new xu({});case"documents":return new Lu(r.args.map((e=>e.referenceValue)),{});case"where":return new Ho(Rc(r.args[0]),{});case"limit":{const e=r.args[0].integerValue??r.args[0].doubleValue;return new ar(typeof e=="number"?e:Number(e),{})}case"sort":return new zt(r.args.map((e=>(function(n){var i,o;const s=(i=n.mapValue)==null?void 0:i.fields;return new wl(Rc(s.expression),(o=s.direction)==null?void 0:o.stringValue,"orderingFromProto")})(e))),{});default:throw new Error(`Stage type: ${r.name} not supported.`)}}function Rc(r){return r.fieldReferenceValue?new is(ir("_exprFromProto",r.fieldReferenceValue),"_exprFromProto"):r.functionValue?(function(t){var n;return new k(t.functionValue.name,((n=t.functionValue.args)==null?void 0:n.map(Rc))||[])})(r):os._fromProto(r)}class ju{constructor(e,t,n,s){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=s,this.$r={}}static Kr(e,t,n,s){U(e.uid!=="",64387);const i=e.isAuthenticated()?e.uid:"";return new ju(i,t,n,s)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return kn(e).jn({index:xr,range:n},((s,i,o)=>{t=!1,o.done()})).next((()=>t))}addMutationBatch(e,t,n,s){const i=Ts(e),o=kn(e);return o.add({}).next((a=>{U(typeof a=="number",49019);const B=new Fl(a,t,n,s),c=(function(_,R,L){const G=L.baseMutations.map((te=>nu(_.qr,te))),Q=L.mutations.map((te=>nu(_.qr,te)));return{userId:R,batchId:L.batchId,localWriteTimeMs:L.localWriteTime.toMillis(),baseMutations:G,mutations:Q}})(this.serializer,this.userId,B),h=[];let f=new me(((C,_)=>ie(C.canonicalString(),_.canonicalString())));for(const C of s){const _=Wm(this.userId,C.key.path,a);f=f.add(C.key.path.popLast()),h.push(o.put(c)),h.push(i.put(_,mv))}return f.forEach((C=>{h.push(this.indexManager.addToCollectionParentIndex(e,C))})),e.addOnCommittedListener((()=>{this.$r[a]=B.keys()})),b.waitFor(h).next((()=>B))}))}lookupMutationBatch(e,t){return kn(e).get(t).next((n=>n?(U(n.userId===this.userId,48,"Unexpected user for mutation batch",{userId:n.userId,batchId:t}),Sr(this.serializer,n)):null))}Qr(e,t){return this.$r[t]?b.resolve(this.$r[t]):this.lookupMutationBatch(e,t).next((n=>{if(n){const s=n.keys();return this.$r[t]=s,s}return null}))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return kn(e).jn({index:xr,range:s},((o,a,B)=>{a.userId===this.userId&&(U(a.batchId>=n,47524,{Wr:n}),i=Sr(this.serializer,a)),B.done()})).next((()=>i))}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=Vr;return kn(e).jn({index:xr,range:t,reverse:!0},((s,i,o)=>{n=i.batchId,o.done()})).next((()=>n))}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,Vr],[this.userId,Number.POSITIVE_INFINITY]);return kn(e).Kn(xr,t).next((n=>n.map((s=>Sr(this.serializer,s)))))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=La(this.userId,t.path),s=IDBKeyRange.lowerBound(n),i=[];return Ts(e).jn({range:s},((o,a,B)=>{const[c,h,f]=o,C=Qt(h);if(c===this.userId&&t.path.isEqual(C))return kn(e).get(f).next((_=>{if(!_)throw W(61480,{Gr:o,batchId:f});U(_.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:_.userId,batchId:f}),i.push(Sr(this.serializer,_))}));B.done()})).next((()=>i))}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new me(ie);const s=[];return t.forEach((i=>{const o=La(this.userId,i.path),a=IDBKeyRange.lowerBound(o),B=Ts(e).jn({range:a},((c,h,f)=>{const[C,_,R]=c,L=Qt(_);C===this.userId&&i.path.isEqual(L)?n=n.add(R):f.done()}));s.push(B)})),b.waitFor(s).next((()=>this.zr(e,n)))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1,i=La(this.userId,n),o=IDBKeyRange.lowerBound(i);let a=new me(ie);return Ts(e).jn({range:o},((B,c,h)=>{const[f,C,_]=B,R=Qt(C);f===this.userId&&n.isPrefixOf(R)?R.length===s&&(a=a.add(_)):h.done()})).next((()=>this.zr(e,a)))}zr(e,t){const n=[],s=[];return t.forEach((i=>{s.push(kn(e).get(i).next((o=>{if(o===null)throw W(35274,{batchId:i});U(o.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:o.userId,batchId:i}),n.push(Sr(this.serializer,o))})))})),b.waitFor(s).next((()=>n))}removeMutationBatch(e,t){return oE(e.kr,this.userId,t).next((n=>(e.addOnCommittedListener((()=>{this.jr(t.batchId)})),b.forEach(n,(s=>this.referenceDelegate.markPotentiallyOrphaned(e,s))))))}jr(e){delete this.$r[e]}performConsistencyCheck(e){return this.checkEmpty(e).next((t=>{if(!t)return b.resolve();const n=IDBKeyRange.lowerBound((function(o){return[o]})(this.userId)),s=[];return Ts(e).jn({range:n},((i,o,a)=>{if(i[0]===this.userId){const B=Qt(i[1]);s.push(B)}else a.done()})).next((()=>{U(s.length===0,56720,{Hr:s.map((i=>i.canonicalString()))})}))}))}containsKey(e,t){return cE(e,this.userId,t)}Jr(e){return lE(e).get(this.userId).next((t=>t||{userId:this.userId,lastAcknowledgedBatchId:Vr,lastStreamToken:""}))}}function cE(r,e,t){const n=La(e,t.path),s=n[1],i=IDBKeyRange.lowerBound(n);let o=!1;return Ts(r).jn({range:i,zn:!0},((a,B,c)=>{const[h,f,C]=a;h===e&&f===s&&(o=!0),c.done()})).next((()=>o))}function kn(r){return ze(r,Lt)}function Ts(r){return ze(r,js)}function lE(r){return ze(r,Eo)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qv{getBundleMetadata(e,t){return dC(e).get(t).next((n=>{if(n)return(function(i){return{id:i.bundleId,createTime:Xr(i.createTime),version:i.version}})(n)}))}saveBundleMetadata(e,t){return dC(e).put((function(s){return{bundleId:s.id,createTime:Yr(ht(s.createTime)),version:s.version}})(t))}getNamedQuery(e,t){return CC(e).get(t).next((n=>{if(n)return(function(i){return{name:i.name,query:BE(i.bundledQuery),readTime:Xr(i.readTime)}})(n)}))}saveNamedQuery(e,t){return CC(e).put((function(s){return{name:s.name,readTime:Yr(ht(s.readTime)),bundledQuery:s.bundledQuery}})(t))}}function dC(r){return ze(r,Gu)}function CC(r){return ze(r,Hu)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qu{constructor(e,t){this.serializer=e,this.userId=t}static Kr(e,t){const n=t.uid||"";return new qu(e,n)}getOverlay(e,t){return ds(e).get(hC(this.userId,t)).next((n=>n?_a(this.serializer,n):null))}getOverlays(e,t){const n=Pt();return b.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}getAllOverlays(e,t){const n=Pt();return ds(e).jn(((s,i)=>{const o=_a(this.serializer,i);o.largestBatchId>t&&n.set(o.getKey(),o)})).next((()=>n))}saveOverlays(e,t,n){const s=[];return n.forEach(((i,o)=>{const a=new Gl(t,o);s.push(this.Yr(e,a))})),b.waitFor(s)}removeOverlaysForBatchId(e,t,n){const s=new Set;t.forEach((o=>s.add(it(o.getCollectionPath()))));const i=[];return s.forEach((o=>{const a=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);i.push(ds(e).Gn(Tc,a))})),b.waitFor(i)}getOverlaysForCollection(e,t,n){const s=Pt(),i=it(t),o=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return ds(e).Kn(Tc,o).next((a=>{for(const B of a){const c=_a(this.serializer,B);s.set(c.getKey(),c)}return s}))}getOverlaysForCollectionGroup(e,t,n,s){const i=Pt();let o;const a=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return ds(e).jn({index:tE,range:a},((B,c,h)=>{const f=_a(this.serializer,c);i.size()<s||f.largestBatchId===o?(i.set(f.getKey(),f),o=f.largestBatchId):h.done()})).next((()=>i))}Yr(e,t){return ds(e).put((function(s,i,o){const[a,B,c]=hC(i,o.mutation.key);return{userId:i,collectionPath:B,documentId:c,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:nu(s.qr,o.mutation)}})(this.serializer,this.userId,t))}}function ds(r){return ze(r,Uu)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kv{Zr(e){return ze(e,Vl)}getSessionToken(e){return this.Zr(e).get("sessionToken").next((t=>{const n=t==null?void 0:t.value;return n?Ne.fromUint8Array(n):Ne.EMPTY_BYTE_STRING}))}setSessionToken(e,t){return this.Zr(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pr{constructor(){}Xr(e,t){this.ei(e,t),t.ti()}ei(e,t){if("nullValue"in e)this.ni(t,5);else if("booleanValue"in e)this.ni(t,10),t.ri(e.booleanValue?1:0);else if("integerValue"in e)this.ni(t,15),t.ri(Re(e.integerValue));else if("doubleValue"in e){const n=Re(e.doubleValue);isNaN(n)?this.ni(t,13):(this.ni(t,15),Fs(n)?t.ri(0):t.ri(n))}else if("timestampValue"in e){let n=e.timestampValue;this.ni(t,20),typeof n=="string"&&(n=In(n)),t.ii(`${n.seconds||""}`),t.ri(n.nanos||0)}else if("stringValue"in e)this.si(e.stringValue,t),this._i(t);else if("bytesValue"in e)this.ni(t,30),t.oi(yn(e.bytesValue)),this._i(t);else if("referenceValue"in e)this.ai(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.ni(t,45),t.ri(n.latitude||0),t.ri(n.longitude||0)}else"mapValue"in e?vg(e)?this.ni(t,Number.MAX_SAFE_INTEGER):Wr(e)?this.ui(e.mapValue,t):(this.ci(e.mapValue,t),this._i(t)):"arrayValue"in e?(this.li(e.arrayValue,t),this._i(t)):W(19022,{Ei:e})}si(e,t){this.ni(t,25),this.hi(e,t)}hi(e,t){t.ii(e)}ci(e,t){const n=e.fields||{};this.ni(t,55);for(const s of Object.keys(n))this.si(s,t),this.ei(n[s],t)}ui(e,t){var o,a;const n=e.fields||{};this.ni(t,53);const s=$r,i=((a=(o=n[s].arrayValue)==null?void 0:o.values)==null?void 0:a.length)||0;this.ni(t,15),t.ri(Re(i)),this.si(s,t),this.ei(n[s],t)}li(e,t){const n=e.values||[];this.ni(t,50);for(const s of n)this.ei(s,t)}ai(e,t){this.ni(t,37),J.fromName(e).path.forEach((n=>{this.ni(t,60),this.hi(n,t)}))}ni(e,t){e.ri(t)}_i(e){e.ri(2)}}Pr.Ti=new Pr;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cs=255;function Jv(r){if(r===0)return 8;let e=0;return r>>4||(e+=4,r<<=4),r>>6||(e+=2,r<<=2),r>>7||(e+=1),e}function pC(r){const e=64-(function(n){let s=0;for(let i=0;i<8;++i){const o=Jv(255&n[i]);if(s+=o,o!==8)break}return s})(r);return Math.ceil(e/8)}class zv{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Pi(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ri(n.value),n=t.next();this.Ii()}Ai(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Vi(n.value),n=t.next();this.di()}fi(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Ri(n);else if(n<2048)this.Ri(960|n>>>6),this.Ri(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Ri(480|n>>>12),this.Ri(128|63&n>>>6),this.Ri(128|63&n);else{const s=t.codePointAt(0);this.Ri(240|s>>>18),this.Ri(128|63&s>>>12),this.Ri(128|63&s>>>6),this.Ri(128|63&s)}}this.Ii()}mi(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Vi(n);else if(n<2048)this.Vi(960|n>>>6),this.Vi(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Vi(480|n>>>12),this.Vi(128|63&n>>>6),this.Vi(128|63&n);else{const s=t.codePointAt(0);this.Vi(240|s>>>18),this.Vi(128|63&s>>>12),this.Vi(128|63&s>>>6),this.Vi(128|63&s)}}this.di()}pi(e){const t=this.gi(e),n=pC(t);this.yi(1+n),this.buffer[this.position++]=255&n;for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=255&t[s]}wi(e){const t=this.gi(e),n=pC(t);this.yi(1+n),this.buffer[this.position++]=~(255&n);for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=~(255&t[s])}bi(){this.Si(Cs),this.Si(255)}Di(){this.xi(Cs),this.xi(255)}reset(){this.position=0}seed(e){this.yi(e.length),this.buffer.set(e,this.position),this.position+=e.length}Ci(){return this.buffer.slice(0,this.position)}gi(e){const t=(function(i){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,i,!1),new Uint8Array(o.buffer)})(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let s=1;s<t.length;++s)t[s]^=n?255:0;return t}Ri(e){const t=255&e;t===0?(this.Si(0),this.Si(255)):t===Cs?(this.Si(Cs),this.Si(0)):this.Si(t)}Vi(e){const t=255&e;t===0?(this.xi(0),this.xi(255)):t===Cs?(this.xi(Cs),this.xi(0)):this.xi(e)}Ii(){this.Si(0),this.Si(1)}di(){this.xi(0),this.xi(1)}Si(e){this.yi(1),this.buffer[this.position++]=e}xi(e){this.yi(1),this.buffer[this.position++]=~e}yi(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class Qv{constructor(e){this.Fi=e}oi(e){this.Fi.Pi(e)}ii(e){this.Fi.fi(e)}ri(e){this.Fi.pi(e)}ti(){this.Fi.bi()}}class $v{constructor(e){this.Fi=e}oi(e){this.Fi.Ai(e)}ii(e){this.Fi.mi(e)}ri(e){this.Fi.wi(e)}ti(){this.Fi.Di()}}class bi{constructor(){this.Fi=new zv,this.ascending=new Qv(this.Fi),this.descending=new $v(this.Fi)}seed(e){this.Fi.seed(e)}Oi(e){return e===0?this.ascending:this.descending}Ci(){return this.Fi.Ci()}reset(){this.Fi.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nr{constructor(e,t,n,s){this.Mi=e,this.Ni=t,this.Li=n,this.Bi=s}Ui(){const e=this.Bi.length,t=e===0||this.Bi[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.Bi,0),t!==e?n.set([0],this.Bi.length):++n[n.length-1],new Nr(this.Mi,this.Ni,this.Li,n)}ki(e,t,n){return{indexId:this.Mi,uid:e,arrayValue:Va(this.Li),directionalValue:Va(this.Bi),orderedDocumentKey:Va(t),documentKey:n.path.toArray()}}qi(e,t,n){const s=this.ki(e,t,n);return[s.indexId,s.uid,s.arrayValue,s.directionalValue,s.orderedDocumentKey,s.documentKey]}}function Vn(r,e){let t=r.Mi-e.Mi;return t!==0?t:(t=gC(r.Li,e.Li),t!==0?t:(t=gC(r.Bi,e.Bi),t!==0?t:J.comparator(r.Ni,e.Ni)))}function gC(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}function Va(r){return Cp()?(function(t){let n="";for(let s=0;s<t.length;s++)n+=String.fromCharCode(t[s]);return n})(r):r}function mC(r){return typeof r!="string"?r:(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(r)}class EC{constructor(e){this.$i=new me(((t,n)=>Ke.comparator(t.field,n.field))),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.Ki=e.orderBy,this.Qi=[];for(const t of e.filters){const n=t;n.isInequality()?this.$i=this.$i.add(n):this.Qi.push(n)}}get Wi(){return this.$i.size>1}Gi(e){if(U(e.collectionGroup===this.collectionId,49279),this.Wi)return!1;const t=Cc(e);if(t!==void 0&&!this.zi(t))return!1;const n=Ar(e);let s=new Set,i=0,o=0;for(;i<n.length&&this.zi(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.$i.size>0){const a=this.$i.getIterator().getNext();if(!s.has(a.field.canonicalString())){const B=n[i];if(!this.ji(a,B)||!this.Hi(this.Ki[o++],B))return!1}++i}for(;i<n.length;++i){const a=n[i];if(o>=this.Ki.length||!this.Hi(this.Ki[o++],a))return!1}return!0}Ji(){if(this.Wi)return null;let e=new me(Ke.comparator);const t=[];for(const n of this.Qi)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new Na(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new Na(n.field,0))}for(const n of this.Ki)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new Na(n.field,n.dir==="asc"?0:1)));return new Xa(Xa.UNKNOWN_ID,this.collectionId,t,co.empty())}zi(e){for(const t of this.Qi)if(this.ji(t,e))return!0;return!1}ji(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}Hi(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hE(r){var t,n;if(U(r instanceof le||r instanceof _e,20012),r instanceof le){if(r instanceof qg){const s=((n=(t=r.value.arrayValue)==null?void 0:t.values)==null?void 0:n.map((i=>le.create(r.field,"==",i))))||[];return _e.create(s,"or")}return r}const e=r.filters.map((s=>hE(s)));return _e.create(e,r.op)}function Wv(r){if(r.getFilters().length===0)return[];const e=Sc(hE(r));return U(fE(e),7391),vc(e)||bc(e)?[e]:e.getFilters()}function vc(r){return r instanceof le}function bc(r){return r instanceof _e&&Bl(r)}function fE(r){return vc(r)||bc(r)||(function(t){if(t instanceof _e&&fc(t)){for(const n of t.getFilters())if(!vc(n)&&!bc(n))return!1;return!0}return!1})(r)}function Sc(r){if(U(r instanceof le||r instanceof _e,34018),r instanceof le)return r;if(r.filters.length===1)return Sc(r.filters[0]);const e=r.filters.map((n=>Sc(n)));let t=_e.create(e,r.op);return t=lu(t),fE(t)?t:(U(t instanceof _e,64498),U(Gs(t),40251),U(t.filters.length>1,57927),t.filters.reduce(((n,s)=>Hl(n,s))))}function Hl(r,e){let t;return U(r instanceof le||r instanceof _e,38388),U(e instanceof le||e instanceof _e,25473),t=r instanceof le?e instanceof le?(function(s,i){return _e.create([s,i],"and")})(r,e):_C(r,e):e instanceof le?_C(e,r):(function(s,i){if(U(s.filters.length>0&&i.filters.length>0,48005),Gs(s)&&Gs(i))return Hg(s,i.getFilters());const o=fc(s)?s:i,a=fc(s)?i:s,B=o.filters.map((c=>Hl(c,a)));return _e.create(B,"or")})(r,e),lu(t)}function _C(r,e){if(Gs(e))return Hg(e,r.getFilters());{const t=e.filters.map((n=>Hl(r,n)));return _e.create(t,"or")}}function lu(r){if(U(r instanceof le||r instanceof _e,11850),r instanceof le)return r;const e=r.getFilters();if(e.length===1)return lu(e[0]);if(Mg(r))return r;const t=e.map((s=>lu(s))),n=[];return t.forEach((s=>{s instanceof le?n.push(s):s instanceof _e&&(s.op===r.op?n.push(...s.filters):n.push(s))})),n.length===1?n[0]:_e.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yv{constructor(){this.Yi=new Ul}addToCollectionParentIndex(e,t){return this.Yi.add(t),b.resolve()}getCollectionParents(e,t){return b.resolve(this.Yi.getEntries(t))}addFieldIndex(e,t){return b.resolve()}deleteFieldIndex(e,t){return b.resolve()}deleteAllFieldIndexes(e){return b.resolve()}createTargetIndexes(e,t){return b.resolve()}getDocumentsMatchingTarget(e,t){return b.resolve(null)}getIndexType(e,t){return b.resolve(0)}getFieldIndexes(e,t){return b.resolve([])}getNextCollectionGroupToUpdate(e){return b.resolve(null)}getMinOffset(e,t){return b.resolve(vt.min())}getMinOffsetFromCollectionGroup(e,t){return b.resolve(vt.min())}updateCollectionGroup(e,t,n){return b.resolve()}updateIndexEntries(e,t){return b.resolve()}}class Ul{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new me(Be.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new me(Be.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DC="IndexedDbIndexManager",Da=new Uint8Array(0);class Xv{constructor(e,t){this.databaseId=t,this.Zi=new Ul,this.Xi=new vn((n=>Za(n)),((n,s)=>ll(n,s))),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.Zi.has(t)){const n=t.lastSegment(),s=t.popLast();e.addOnCommittedListener((()=>{this.Zi.add(t)}));const i={collectionId:n,parent:it(s)};return IC(e).put(i)}return b.resolve()}getCollectionParents(e,t){const n=[],s=IDBKeyRange.bound([t,""],[mg(t),""],!1,!0);return IC(e).Kn(s).next((i=>{for(const o of i){if(o.collectionId!==t)break;n.push(Qt(o.parent))}return n}))}addFieldIndex(e,t){const n=Si(e),s=(function(a){return{indexId:a.indexId,collectionGroup:a.collectionGroup,fields:a.fields.map((B=>[B.fieldPath.canonicalString(),B.kind]))}})(t);delete s.indexId;const i=n.add(s);if(t.indexState){const o=gs(e);return i.next((a=>{o.put(fC(a,this.uid,t.indexState.sequenceNumber,t.indexState.offset))}))}return i.next()}deleteFieldIndex(e,t){const n=Si(e),s=gs(e),i=ps(e);return n.delete(t.indexId).next((()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))).next((()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))))}deleteAllFieldIndexes(e){const t=Si(e),n=ps(e),s=gs(e);return t.Gn().next((()=>n.Gn())).next((()=>s.Gn()))}createTargetIndexes(e,t){return b.forEach(this.es(t),(n=>this.getIndexType(e,n).next((s=>{if(s===0||s===1){const i=new EC(n).Ji();if(i!=null)return this.addFieldIndex(e,i)}}))))}getDocumentsMatchingTarget(e,t){const n=ps(e);let s=!0;const i=new Map;return b.forEach(this.es(t),(o=>this.ts(e,o).next((a=>{s&&(s=!!a),i.set(o,a)})))).next((()=>{if(s){let o=oe();const a=[];return b.forEach(i,((B,c)=>{M(DC,`Using index ${(function(se){return`id=${se.indexId}|cg=${se.collectionGroup}|f=${se.fields.map((ge=>`${ge.fieldPath}:${ge.kind}`)).join(",")}`})(B)} to execute ${Za(t)}`);const h=(function(se,ge){const he=Cc(ge);if(he===void 0)return null;for(const ue of eu(se,he.fieldPath))switch(ue.op){case"array-contains-any":return ue.value.arrayValue.values||[];case"array-contains":return[ue.value]}return null})(c,B),f=(function(se,ge){const he=new Map;for(const ue of Ar(ge))for(const w of eu(se,ue.fieldPath))switch(w.op){case"==":case"in":he.set(ue.fieldPath.canonicalString(),w.value);break;case"not-in":case"!=":return he.set(ue.fieldPath.canonicalString(),w.value),Array.from(he.values())}return null})(c,B),C=(function(se,ge){const he=[];let ue=!0;for(const w of Ar(ge)){const E=w.kind===0?Hd(se,w.fieldPath,se.startAt):Ud(se,w.fieldPath,se.startAt);he.push(E.value),ue&&(ue=E.inclusive)}return new Ms(he,ue)})(c,B),_=(function(se,ge){const he=[];let ue=!0;for(const w of Ar(ge)){const E=w.kind===0?Ud(se,w.fieldPath,se.endAt):Hd(se,w.fieldPath,se.endAt);he.push(E.value),ue&&(ue=E.inclusive)}return new Ms(he,ue)})(c,B),R=this.ns(B,c,C),L=this.ns(B,c,_),G=this.rs(B,c,f),Q=this.ss(B.indexId,h,R,C.inclusive,L,_.inclusive,G);return b.forEach(Q,(te=>n.Wn(te,t.limit).next((se=>{se.forEach((ge=>{const he=J.fromSegments(ge.documentKey);o.has(he)||(o=o.add(he),a.push(he))}))}))))})).next((()=>a))}return b.resolve(null)}))}es(e){let t=this.Xi.get(e);return t||(e.filters.length===0?t=[e]:t=Wv(_e.create(e.filters,"and")).map((n=>pc(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt))),this.Xi.set(e,t),t)}ss(e,t,n,s,i,o,a){const B=(t!=null?t.length:1)*Math.max(n.length,i.length),c=B/(t!=null?t.length:1),h=[];for(let f=0;f<B;++f){const C=t?this._s(t[f/c]):Da,_=this.us(e,C,n[f%c],s),R=this.cs(e,C,i[f%c],o),L=a.map((G=>this.us(e,C,G,!0)));h.push(...this.createRange(_,R,L))}return h}us(e,t,n,s){const i=new Nr(e,J.empty(),t,n);return s?i:i.Ui()}cs(e,t,n,s){const i=new Nr(e,J.empty(),t,n);return s?i.Ui():i}ts(e,t){const n=new EC(t),s=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,s).next((i=>{let o=null;for(const a of i)n.Gi(a)&&(!o||a.fields.length>o.fields.length)&&(o=a);return o}))}getIndexType(e,t){let n=2;const s=this.es(t);return b.forEach(s,(i=>this.ts(e,i).next((o=>{o?n!==0&&o.fields.length<(function(B){let c=new me(Ke.comparator),h=!1;for(const f of B.filters)for(const C of f.getFlattenedFilters())C.field.isKeyField()||(C.op==="array-contains"||C.op==="array-contains-any"?h=!0:c=c.add(C.field));for(const f of B.orderBy)f.field.isKeyField()||(c=c.add(f.field));return c.size+(h?1:0)})(i)&&(n=1):n=0})))).next((()=>(function(o){return o.limit!==null})(t)&&s.length>1&&n===2?1:n))}ls(e,t){const n=new bi;for(const s of Ar(e)){const i=t.data.field(s.fieldPath);if(i==null)return null;const o=n.Oi(s.kind);Pr.Ti.Xr(i,o)}return n.Ci()}_s(e){const t=new bi;return Pr.Ti.Xr(e,t.Oi(0)),t.Ci()}Es(e,t){const n=new bi;return Pr.Ti.Xr(oo(this.databaseId,t),n.Oi((function(i){const o=Ar(i);return o.length===0?0:o[o.length-1].kind})(e))),n.Ci()}rs(e,t,n){if(n===null)return[];let s=[];s.push(new bi);let i=0;for(const o of Ar(e)){const a=n[i++];for(const B of s)if(this.hs(t,o.fieldPath)&&rr(a))s=this.Ts(s,o,a);else{const c=B.Oi(o.kind);Pr.Ti.Xr(a,c)}}return this.Ps(s)}ns(e,t,n){return this.rs(e,t,n.position)}Ps(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].Ci();return t}Ts(e,t,n){const s=[...e],i=[];for(const o of n.arrayValue.values||[])for(const a of s){const B=new bi;B.seed(a.Ci()),Pr.Ti.Xr(o,B.Oi(t.kind)),i.push(B)}return i}hs(e,t){return!!e.filters.find((n=>n instanceof le&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in")))}getFieldIndexes(e,t){const n=Si(e),s=gs(e);return(t?n.Kn(wc,IDBKeyRange.bound(t,t)):n.Kn()).next((i=>{const o=[];return b.forEach(i,(a=>s.get([a.indexId,this.uid]).next((B=>{o.push((function(h,f){const C=f?new co(f.sequenceNumber,new vt(Xr(f.readTime),new J(Qt(f.documentKey)),f.largestBatchId)):co.empty(),_=h.fields.map((([R,L])=>new Na(Ke.fromServerFormat(R),L)));return new Xa(h.indexId,h.collectionGroup,_,C)})(a,B))})))).next((()=>o))}))}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next((t=>t.length===0?null:(t.sort(((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:ie(n.collectionGroup,s.collectionGroup)})),t[0].collectionGroup)))}updateCollectionGroup(e,t,n){const s=Si(e),i=gs(e);return this.Rs(e).next((o=>s.Kn(wc,IDBKeyRange.bound(t,t)).next((a=>b.forEach(a,(B=>i.put(fC(B.indexId,this.uid,o,n))))))))}updateIndexEntries(e,t){const n=new Map;return b.forEach(t,((s,i)=>{const o=n.get(s.collectionGroup);return(o?b.resolve(o):this.getFieldIndexes(e,s.collectionGroup)).next((a=>(n.set(s.collectionGroup,a),b.forEach(a,(B=>this.Is(e,s,B).next((c=>{const h=this.As(i,B);return c.isEqual(h)?b.resolve():this.Vs(e,i,B,c,h)})))))))}))}ds(e,t,n,s){return ps(e).put(s.ki(this.uid,this.Es(n,t.key),t.key))}fs(e,t,n,s){return ps(e).delete(s.qi(this.uid,this.Es(n,t.key),t.key))}Is(e,t,n){const s=ps(e);let i=new me(Vn);return s.jn({index:eE,range:IDBKeyRange.only([n.indexId,this.uid,Va(this.Es(n,t))])},((o,a)=>{i=i.add(new Nr(n.indexId,t,mC(a.arrayValue),mC(a.directionalValue)))})).next((()=>i))}As(e,t){let n=new me(Vn);const s=this.ls(t,e);if(s==null)return n;const i=Cc(t);if(i!=null){const o=e.data.field(i.fieldPath);if(rr(o))for(const a of o.arrayValue.values||[])n=n.add(new Nr(t.indexId,e.key,this._s(a),s))}else n=n.add(new Nr(t.indexId,e.key,Da,s));return n}Vs(e,t,n,s,i){M(DC,"Updating index entries for document '%s'",t.key);const o=[];return(function(B,c,h,f,C){const _=B.getIterator(),R=c.getIterator();let L=hs(_),G=hs(R);for(;L||G;){let Q=!1,te=!1;if(L&&G){const se=h(L,G);se<0?te=!0:se>0&&(Q=!0)}else L!=null?te=!0:Q=!0;Q?(f(G),G=hs(R)):te?(C(L),L=hs(_)):(L=hs(_),G=hs(R))}})(s,i,Vn,(a=>{o.push(this.ds(e,t,n,a))}),(a=>{o.push(this.fs(e,t,n,a))})),b.waitFor(o)}Rs(e){let t=1;return gs(e).jn({index:Zm,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},((n,s,i)=>{i.done(),t=s.sequenceNumber+1})).next((()=>t))}createRange(e,t,n){n=n.sort(((o,a)=>Vn(o,a))).filter(((o,a,B)=>!a||Vn(o,B[a-1])!==0));const s=[];s.push(e);for(const o of n){const a=Vn(o,e),B=Vn(o,t);if(a===0)s[0]=e.Ui();else if(a>0&&B<0)s.push(o),s.push(o.Ui());else if(B>0)break}s.push(t);const i=[];for(let o=0;o<s.length;o+=2){if(this.ps(s[o],s[o+1]))return[];const a=s[o].qi(this.uid,Da,J.empty()),B=s[o+1].qi(this.uid,Da,J.empty());i.push(IDBKeyRange.bound(a,B))}return i}ps(e,t){return Vn(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(yC)}getMinOffset(e,t){return b.mapArray(this.es(t),(n=>this.ts(e,n).next((s=>s||W(44426))))).next(yC)}}function IC(r){return ze(r,Do)}function ps(r){return ze(r,Yi)}function Si(r){return ze(r,kl)}function gs(r){return ze(r,Wi)}function yC(r){U(r.length!==0,28825);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;cl(s,e)<0&&(e=s),t<s.largestBatchId&&(t=s.largestBatchId)}return new vt(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tn{constructor(e){this.gs=e}next(){return this.gs+=2,this.gs}static ys(){return new Tn(0)}static ws(){return new Tn(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zv{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.bs(e).next((t=>{const n=new Tn(t.highestTargetId);return t.highestTargetId=n.next(),this.Ss(e,t).next((()=>t.highestTargetId))}))}getLastRemoteSnapshotVersion(e){return this.bs(e).next((t=>ee.fromTimestamp(new Ee(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(e){return this.bs(e).next((t=>t.highestListenSequenceNumber))}setTargetsMetadata(e,t,n){return this.bs(e).next((s=>(s.highestListenSequenceNumber=t,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),t>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=t),this.Ss(e,s))))}addTargetData(e,t){return this.vs(e,t).next((()=>this.bs(e).next((n=>(n.targetCount+=1,this.Ds(t,n),this.Ss(e,n))))))}updateTargetData(e,t){return this.vs(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next((()=>ms(e).delete(t.targetId))).next((()=>this.bs(e))).next((n=>(U(n.targetCount>0,8065),n.targetCount-=1,this.Ss(e,n))))}removeTargets(e,t,n){let s=0;const i=[];return ms(e).jn(((o,a)=>{const B=Vi(this.serializer,a);B.sequenceNumber<=t&&n.get(B.targetId)===null&&(s++,i.push(this.removeTargetData(e,B)))})).next((()=>b.waitFor(i))).next((()=>s))}forEachTarget(e,t){return ms(e).jn(((n,s)=>{const i=Vi(this.serializer,s);t(i)}))}bs(e){return wC(e).get(uu).next((t=>(U(t!==null,2888),t)))}Ss(e,t){return wC(e).put(uu,t)}vs(e,t){return ms(e).put(uE(this.serializer,t))}Ds(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.bs(e).next((t=>t.targetCount))}getTargetData(e,t){const n=Mu(t),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return ms(e).jn({range:s,index:Xm},((o,a,B)=>{const c=Vi(this.serializer,a);Ol(t,c.target)&&(i=c,B.done())})).next((()=>i))}addMatchingKeys(e,t,n){const s=[],i=Qn(e);return t.forEach((o=>{const a=it(o.path);s.push(i.put({targetId:n,path:a})),s.push(this.referenceDelegate.addReference(e,n,o))})),b.waitFor(s)}removeMatchingKeys(e,t,n){const s=Qn(e);return b.forEach(t,(i=>{const o=it(i.path);return b.waitFor([s.delete([n,o]),this.referenceDelegate.removeReference(e,n,i)])}))}removeMatchingKeysForTargetId(e,t){const n=Qn(e),s=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),s=Qn(e);let i=oe();return s.jn({range:n,zn:!0},((o,a,B)=>{const c=Qt(o[1]),h=new J(c);i=i.add(h)})).next((()=>i))}containsKey(e,t){const n=it(t.path),s=IDBKeyRange.bound([n],[mg(n)],!1,!0);let i=0;return Qn(e).jn({index:Ll,zn:!0,range:s},(([o,a],B,c)=>{o!==0&&(i++,c.done())})).next((()=>i>0))}ge(e,t){return ms(e).get(t).next((n=>n?Vi(this.serializer,n):null))}}function ms(r){return ze(r,qs)}function wC(r){return ze(r,Hr)}function Qn(r){return ze(r,Ks)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eb{constructor(e,t){this.db=e,this.garbageCollector=Tm(this,t)}rr(e){const t=this.xs(e);return this.db.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}xs(e){let t=0;return this.ir(e,(n=>{t++})).next((()=>t))}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}ir(e,t){return this.Cs(e,((n,s)=>t(s)))}addReference(e,t,n){return Ia(e,n)}removeReference(e,t,n){return Ia(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return Ia(e,t)}Fs(e,t){return(function(s,i){let o=!1;return lE(s).Hn((a=>cE(s,a,i).next((B=>(B&&(o=!0),b.resolve(!B)))))).next((()=>o))})(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.Cs(e,((o,a)=>{if(a<=t){const B=this.Fs(e,o).next((c=>{if(!c)return i++,n.getEntry(e,o).next((()=>(n.removeEntry(o,ee.min()),Qn(e).delete((function(f){return[0,it(f.path)]})(o)))))}));s.push(B)}})).next((()=>b.waitFor(s))).next((()=>n.apply(e))).next((()=>i))}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return Ia(e,t)}Cs(e,t){const n=Qn(e);let s,i=gt.yn;return n.jn({index:Ll},(([o,a],{path:B,sequenceNumber:c})=>{o===0?(i!==gt.yn&&t(new J(Qt(s)),i),i=c,s=B):i=gt.yn})).next((()=>{i!==gt.yn&&t(new J(Qt(s)),i)}))}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Ia(r,e){return Qn(r).put((function(n,s){return{targetId:0,path:it(n.path),sequenceNumber:s}})(e,r.currentSequenceNumber))}// Copyright 2024 Google LLC* @license
function dE(r,e){var n;let t=e;for(const s of r.stages)t=tb({serializer:r.serializer,serverTimestampBehavior:(n=r.listenOptions)==null?void 0:n.serverTimestampBehavior},s,t);return t}function Ku(r,e){return dE(r,[e]).length>0}function CE(r,e){return Le(r)?Ku(r,e):Su(r,e)}function tb(r,e,t){if(e instanceof Mo)return(function(s,i,o){return o.filter((a=>a.isFoundDocument()&&`/${a.key.getCollectionPath().canonicalString()}`===i.Er))})(0,e,t);if(e instanceof Ho)return(function(s,i,o){return o.filter((a=>{const B=$i(ne(i.condition).evaluate(s,a));return B!==void 0&&xt(B,Et)}))})(r,e,t);if(e instanceof Go)return(function(s,i,o){return o.filter((a=>a.isFoundDocument()&&a.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof xu)return(function(s,i,o){return o.filter((a=>a.isFoundDocument()))})(0,0,t);if(e instanceof Lu)return(function(s,i,o){return o.filter((a=>a.isFoundDocument()&&i.Tr.has(a.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof ar)return(function(s,i,o){return o.slice(0,i.limit)})(0,e,t);if(e instanceof zt)return(function(s,i,o){const a=i.orderings.map((B=>({Os:ne(B.expr),direction:B.direction})));return[...o].sort(((B,c)=>{for(const{Os:h,direction:f}of a){const C=$i(h.evaluate(s,B)),_=$i(h.evaluate(s,c)),R=ot(C??en,_??en);if(R!==0)return f==="ascending"?R:-R}return 0}))})(r,e,t);throw new Error(`Unknown stage: ${e._name}`)}function Pc(r){const e=(function(n){for(let s=n.stages.length-1;s>=0;s--){const i=n.stages[s];if(i instanceof zt)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(r);return(t,n)=>{for(const s of e){const i=$i(ne(s.expr).evaluate({serializer:r.serializer},t)),o=$i(ne(s.expr).evaluate({serializer:r.serializer},n)),a=ot(i||en,o||en);if(a!==0)return s.direction==="ascending"?a:-a}return 0}}function MB(r){for(let e=r.stages.length-1;e>=0;e--){const t=r.stages[e];if(t instanceof ar)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pE{constructor(){this.changes=new vn((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,xe.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?b.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nb{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Mn(e).put(n)}removeEntry(e,t,n){return Mn(e).delete((function(i,o){const a=i.path.toArray();return[a.slice(0,a.length-2),a[a.length-2],cu(o),a[a.length-1]]})(t,n))}updateMetadata(e,t){return this.getMetadata(e).next((n=>(n.byteSize+=t,this.Ms(e,n))))}getEntry(e,t){let n=xe.newInvalidDocument(t);return Mn(e).jn({index:ka,range:IDBKeyRange.only(Pi(t))},((s,i)=>{n=this.Ns(t,i)})).next((()=>n))}Ls(e,t){let n={size:0,document:xe.newInvalidDocument(t)};return Mn(e).jn({index:ka,range:IDBKeyRange.only(Pi(t))},((s,i)=>{n={document:this.Ns(t,i),size:Bu(i)}})).next((()=>n))}getEntries(e,t){let n=je();return this.Bs(e,t,((s,i)=>{const o=this.Ns(s,i);n=n.insert(s,o)})).next((()=>n))}getAllEntries(e){let t=je();return Mn(e).jn(((n,s)=>{const i=this.Ns(J.fromSegments(s.prefixPath.concat(s.collectionGroup,s.documentId)),s);t=t.insert(i.key,i)})).next((()=>t))}Us(e,t){let n=je(),s=new Te(J.comparator);return this.Bs(e,t,((i,o)=>{const a=this.Ns(i,o);n=n.insert(i,a),s=s.insert(i,Bu(o))})).next((()=>({documents:n,ks:s})))}Bs(e,t,n){if(t.isEmpty())return b.resolve();let s=new me(RC);t.forEach((B=>s=s.add(B)));const i=IDBKeyRange.bound(Pi(s.first()),Pi(s.last())),o=s.getIterator();let a=o.getNext();return Mn(e).jn({index:ka,range:i},((B,c,h)=>{const f=J.fromSegments([...c.prefixPath,c.collectionGroup,c.documentId]);for(;a&&RC(a,f)<0;)n(a,null),a=o.getNext();a&&a.isEqual(f)&&(n(a,c),a=o.hasNext()?o.getNext():null),a?h.$n(Pi(a)):h.done()})).next((()=>{for(;a;)n(a,null),a=o.hasNext()?o.getNext():null}))}getDocumentsMatchingQuery(e,t,n,s,i){const o=Le(t)?Be.fromString(Uo(t)):t.path,a=[o.popLast().toArray(),o.lastSegment(),cu(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],B=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Mn(e).Kn(IDBKeyRange.bound(a,B,!0)).next((c=>{i==null||i.incrementDocumentReadCount(c.length);let h=je();for(const f of c){const C=this.Ns(J.fromSegments(f.prefixPath.concat(f.collectionGroup,f.documentId)),f);C.isFoundDocument()&&(CE(t,C)||s.has(C.key))&&(h=h.insert(C.key,C))}return h}))}getAllFromCollectionGroup(e,t,n,s){let i=je();const o=AC(t,n),a=AC(t,vt.max());return Mn(e).jn({index:Ym,range:IDBKeyRange.bound(o,a,!0)},((B,c,h)=>{const f=this.Ns(J.fromSegments(c.prefixPath.concat(c.collectionGroup,c.documentId)),c);i=i.insert(f.key,f),i.size===s&&h.done()})).next((()=>i))}newChangeBuffer(e){return new rb(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next((t=>t.byteSize))}getMetadata(e){return TC(e).get(yc).next((t=>(U(!!t,20021),t)))}Ms(e,t){return TC(e).put(yc,t)}Ns(e,t){if(t){const n=Uv(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(ee.min())))return n}return xe.newInvalidDocument(e)}}function gE(r){return new nb(r)}class rb extends pE{constructor(e,t){super(),this.qs=e,this.trackRemovals=t,this.$s=new vn((n=>n.toString()),((n,s)=>n.isEqual(s)))}applyChanges(e){const t=[];let n=0,s=new me(((i,o)=>ie(i.canonicalString(),o.canonicalString())));return this.changes.forEach(((i,o)=>{const a=this.$s.get(i);if(t.push(this.qs.removeEntry(e,i,a.readTime)),o.isValidDocument()){const B=lC(this.qs.serializer,o);s=s.add(i.path.popLast());const c=Bu(B);n+=c-a.size,t.push(this.qs.addEntry(e,i,B))}else if(n-=a.size,this.trackRemovals){const B=lC(this.qs.serializer,o.convertToNoDocument(ee.min()));t.push(this.qs.addEntry(e,i,B))}})),s.forEach((i=>{t.push(this.qs.indexManager.addToCollectionParentIndex(e,i))})),t.push(this.qs.updateMetadata(e,n)),b.waitFor(t)}getFromCache(e,t){return this.qs.Ls(e,t).next((n=>(this.$s.set(t,{size:n.size,readTime:n.document.readTime}),n.document)))}getAllFromCache(e,t){return this.qs.Us(e,t).next((({documents:n,ks:s})=>(s.forEach(((i,o)=>{this.$s.set(i,{size:o,readTime:n.get(i).readTime})})),n)))}}function TC(r){return ze(r,_o)}function Mn(r){return ze(r,au)}function Pi(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function AC(r,e){const t=e.documentKey.path.toArray();return[r,cu(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function RC(r,e){const t=r.path.toArray(),n=e.path.toArray();let s=0;for(let i=0;i<t.length-2&&i<n.length-2;++i)if(s=ie(t[i],n[i]),s)return s;return s=ie(t.length,n.length),s||(s=ie(t[t.length-2],n[n.length-2]),s||ie(t[t.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sb{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mE{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(n=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(n!==null&&ji(n.mutation,s,pt.empty(),Ee.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.getLocalViewOfDocuments(e,n,oe()).next((()=>n))))}getLocalViewOfDocuments(e,t,n=oe()){const s=Pt();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,n).next((i=>{let o=vr();return i.forEach(((a,B)=>{o=o.insert(a,B.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const n=Pt();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,oe())))}populateOverlays(e,t,n){const s=[];return n.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,a)=>{t.set(o,a)}))}))}computeViews(e,t,n,s){let i=je();const o=Ji(),a=(function(){return Ji()})();return t.forEach(((B,c)=>{const h=n.get(c.key);s.has(c.key)&&(h===void 0||h.mutation instanceof Rn)?i=i.insert(c.key,c):h!==void 0?(o.set(c.key,h.mutation.getFieldMask()),ji(h.mutation,c,h.mutation.getFieldMask(),Ee.now())):o.set(c.key,pt.empty())})),this.recalculateAndSaveOverlays(e,i).next((B=>(B.forEach(((c,h)=>o.set(c,h))),t.forEach(((c,h)=>a.set(c,new sb(h,o.get(c)??null)))),a)))}recalculateAndSaveOverlays(e,t){const n=Ji();let s=new Te(((o,a)=>o-a)),i=oe();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const a of o)a.keys().forEach((B=>{const c=t.get(B);if(c===null)return;let h=n.get(B)||pt.empty();h=a.applyToLocalView(c,h),n.set(B,h);const f=(s.get(a.batchId)||oe()).add(B);s=s.insert(a.batchId,f)}))})).next((()=>{const o=[],a=s.getReverseIterator();for(;a.hasNext();){const B=a.getNext(),c=B.key,h=B.value,f=Xg();h.forEach((C=>{if(!i.has(C)){const _=xg(t.get(C),n.get(C));_!==null&&f.set(C,_),i=i.add(C)}})),o.push(this.documentOverlayCache.saveOverlays(e,c,f))}return b.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.recalculateAndSaveOverlays(e,n)))}getDocumentsMatchingQuery(e,t,n,s){return Le(t)?this.getDocumentsMatchingPipeline(e,t,n,s):jT(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Qg(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):b.resolve(Pt());let a=Hs,B=i;return o.next((c=>b.forEach(c,((h,f)=>(a<f.largestBatchId&&(a=f.largestBatchId),i.get(h)?b.resolve():this.remoteDocumentCache.getEntry(e,h).next((C=>{B=B.insert(h,C)}))))).next((()=>this.populateOverlays(e,c,i))).next((()=>this.computeViews(e,B,c,oe()))).next((h=>({batchId:a,changes:Yg(h)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new J(t)).next((n=>{let s=vr();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let o=vr();return this.indexManager.getCollectionParents(e,i).next((a=>b.forEach(a,(B=>{const c=(function(f,C){return new Fo(C,null,f.explicitOrderBy.slice(),f.filters.slice(),f.limit,f.limitType,f.startAt,f.endAt)})(t,B.child(i));return this.getDocumentsMatchingCollectionQuery(e,c,n,s).next((h=>{h.forEach(((f,C)=>{o=o.insert(f,C)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s)))).next((o=>this.retrieveMatchingLocalDocuments(i,o,(a=>Su(t,a)))))}getDocumentsMatchingPipeline(e,t,n,s){if(pn(t)==="collection_group"){const i=Al(t);let o=vr();return this.indexManager.getCollectionParents(e,i).next((a=>b.forEach(a,(B=>{const c=(function(f,C){const _=f.stages.map((R=>R instanceof Go?new Mo(C.canonicalString(),{}):R));return new st(f.serializer,_)})(t,B.child(i));return this.getDocumentsMatchingPipeline(e,c,n,s).next((h=>{h.forEach(((f,C)=>{o=o.insert(f,C)}))}))})).next((()=>o))))}{let i;return this.getOverlaysForPipeline(e,t,n.largestBatchId).next((o=>{switch(i=o,pn(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s);case"documents":let a=oe();for(const B of su(t))a=a.add(J.fromPath(B));return this.remoteDocumentCache.getEntries(e,a);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new H("invalid-argument",`Invalid pipeline source to execute offline: ${gn(t)}`)}})).next((o=>this.retrieveMatchingLocalDocuments(i,o,(a=>Ku(t,a)))))}}retrieveMatchingLocalDocuments(e,t,n){e.forEach(((i,o)=>{const a=o.getKey();t.get(a)===null&&(t=t.insert(a,xe.newInvalidDocument(a)))}));let s=vr();return t.forEach(((i,o)=>{const a=e.get(i);a!==void 0&&ji(a.mutation,o,pt.empty(),Ee.now()),n(o)&&(s=s.insert(i,o))})),s}getOverlaysForPipeline(e,t,n){switch(pn(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,Be.fromString(Uo(t)),n);case"collection_group":throw new H("invalid-argument",`Unexpected collection group pipeline: ${gn(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,su(t).map((s=>J.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,n);default:throw new H("invalid-argument",`Failed to get overlays for pipeline: ${gn(t)}`)}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ib{constructor(e){this.serializer=e,this.Ks=new Map,this.Qs=new Map}getBundleMetadata(e,t){return b.resolve(this.Ks.get(t))}saveBundleMetadata(e,t){return this.Ks.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:ht(s.createTime)}})(t)),b.resolve()}getNamedQuery(e,t){return b.resolve(this.Qs.get(t))}saveNamedQuery(e,t){return this.Qs.set(t.name,(function(s){return{name:s.name,query:BE(s.bundledQuery),readTime:ht(s.readTime)}})(t)),b.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ob{constructor(){this.overlays=new Te(J.comparator),this.Ws=new Map}getOverlay(e,t){return b.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Pt();return b.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}getAllOverlays(e,t){const n=Pt();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&n.set(s,i)})),b.resolve(n)}saveOverlays(e,t,n){return n.forEach(((s,i)=>{this.Yr(e,t,i)})),b.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.Ws.get(n);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Ws.delete(n)),b.resolve()}getOverlaysForCollection(e,t,n){const s=Pt(),i=t.length+1,o=new J(t.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const B=a.getNext().value,c=B.getKey();if(!t.isPrefixOf(c.path))break;c.path.length===i&&B.largestBatchId>n&&s.set(B.getKey(),B)}return b.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new Te(((c,h)=>c-h));const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===t&&c.largestBatchId>n){let h=i.get(c.largestBatchId);h===null&&(h=Pt(),i=i.insert(c.largestBatchId,h)),h.set(c.getKey(),c)}}const a=Pt(),B=i.getIterator();for(;B.hasNext()&&(B.getNext().value.forEach(((c,h)=>a.set(c,h))),!(a.size()>=s)););return b.resolve(a)}Yr(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.Ws.get(s.largestBatchId).delete(n.key);this.Ws.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new Gl(t,n));let i=this.Ws.get(t);i===void 0&&(i=oe(),this.Ws.set(t,i)),this.Ws.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ab{constructor(){this.sessionToken=Ne.EMPTY_BYTE_STRING}getSessionToken(e){return b.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,b.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jl{constructor(){this.Gs=new me($e.zs),this.js=new me($e.Hs)}isEmpty(){return this.Gs.isEmpty()}addReference(e,t){const n=new $e(e,t);this.Gs=this.Gs.add(n),this.js=this.js.add(n)}Js(e,t){e.forEach((n=>this.addReference(n,t)))}removeReference(e,t){this.Ys(new $e(e,t))}Zs(e,t){e.forEach((n=>this.removeReference(n,t)))}Xs(e){const t=new J(new Be([])),n=new $e(t,e),s=new $e(t,e+1),i=[];return this.js.forEachInRange([n,s],(o=>{this.Ys(o),i.push(o.key)})),i}e_(){this.Gs.forEach((e=>this.Ys(e)))}Ys(e){this.Gs=this.Gs.delete(e),this.js=this.js.delete(e)}t_(e){const t=new J(new Be([])),n=new $e(t,e),s=new $e(t,e+1);let i=oe();return this.js.forEachInRange([n,s],(o=>{i=i.add(o.key)})),i}containsKey(e){const t=new $e(e,0),n=this.Gs.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class $e{constructor(e,t){this.key=e,this.n_=t}static zs(e,t){return J.comparator(e.key,t.key)||ie(e.n_,t.n_)}static Hs(e,t){return ie(e.n_,t.n_)||J.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ub{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Wr=1,this.r_=new me($e.zs)}checkEmpty(e){return b.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.Wr;this.Wr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new Fl(i,t,n,s);this.mutationQueue.push(o);for(const a of s)this.r_=this.r_.add(new $e(a.key,i)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return b.resolve(o)}lookupMutationBatch(e,t){return b.resolve(this.i_(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.s_(n),i=s<0?0:s;return b.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return b.resolve(this.mutationQueue.length===0?Vr:this.Wr-1)}getAllMutationBatches(e){return b.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new $e(t,0),s=new $e(t,Number.POSITIVE_INFINITY),i=[];return this.r_.forEachInRange([n,s],(o=>{const a=this.i_(o.n_);i.push(a)})),b.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new me(ie);return t.forEach((s=>{const i=new $e(s,0),o=new $e(s,Number.POSITIVE_INFINITY);this.r_.forEachInRange([i,o],(a=>{n=n.add(a.n_)}))})),b.resolve(this.__(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;J.isDocumentKey(i)||(i=i.child(""));const o=new $e(new J(i),0);let a=new me(ie);return this.r_.forEachWhile((B=>{const c=B.key.path;return!!n.isPrefixOf(c)&&(c.length===s&&(a=a.add(B.n_)),!0)}),o),b.resolve(this.__(a))}__(e){const t=[];return e.forEach((n=>{const s=this.i_(n);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){U(this.o_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.r_;return b.forEach(t.mutations,(s=>{const i=new $e(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.r_=n}))}jr(e){}containsKey(e,t){const n=new $e(t,0),s=this.r_.firstAfterOrEqual(n);return b.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,b.resolve()}o_(e,t){return this.s_(e)}s_(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}i_(e){const t=this.s_(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bb{constructor(e){this.a_=e,this.docs=(function(){return new Te(J.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,o=this.a_(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return b.resolve(n?n.document.mutableCopy():xe.newInvalidDocument(t))}getEntries(e,t){let n=je();return t.forEach((s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():xe.newInvalidDocument(s))})),b.resolve(n)}getAllEntries(e){let t=je();return this.docs.forEach(((n,s)=>{t=t.insert(n,s.document)})),b.resolve(t)}getDocumentsMatchingQuery(e,t,n,s){let i,o;Le(t)?(i=Be.fromString(Uo(t)),o=h=>Ku(t,h)):(i=t.path,o=h=>Su(t,h));let a=je();const B=new J(i.child("__id-9223372036854775808__")),c=this.docs.getIteratorFrom(B);for(;c.hasNext();){const{key:h,value:{document:f}}=c.getNext();if(!i.isPrefixOf(h.path))break;h.path.length>i.length+1||cl(Jg(f),n)<=0||(s.has(f.key)||o(f))&&(a=a.insert(f.key,f.mutableCopy()))}return b.resolve(a)}getAllFromCollectionGroup(e,t,n,s){W(9500)}u_(e,t){return b.forEach(this.docs,(n=>t(n)))}newChangeBuffer(e){return new cb(this)}getSize(e){return b.resolve(this.size)}}class cb extends pE{constructor(e){super(),this.qs=e}applyChanges(e){const t=[];return this.changes.forEach(((n,s)=>{s.isValidDocument()?t.push(this.qs.addEntry(e,s)):this.qs.removeEntry(n)})),b.waitFor(t)}getFromCache(e,t){return this.qs.getEntry(e,t)}getAllFromCache(e,t){return this.qs.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lb{constructor(e){this.persistence=e,this.c_=new vn((t=>Mu(t)),Ol),this.lastRemoteSnapshotVersion=ee.min(),this.highestTargetId=0,this.l_=0,this.E_=new jl,this.targetCount=0,this.h_=Tn.ys()}forEachTarget(e,t){return this.c_.forEach(((n,s)=>t(s))),b.resolve()}getLastRemoteSnapshotVersion(e){return b.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return b.resolve(this.l_)}allocateTargetId(e){return this.highestTargetId=this.h_.next(),b.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.l_&&(this.l_=t),b.resolve()}vs(e){this.c_.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.h_=new Tn(t),this.highestTargetId=t),e.sequenceNumber>this.l_&&(this.l_=e.sequenceNumber)}addTargetData(e,t){return this.vs(t),this.targetCount+=1,b.resolve()}updateTargetData(e,t){return this.vs(t),b.resolve()}removeTargetData(e,t){return this.c_.delete(t.target),this.E_.Xs(t.targetId),this.targetCount-=1,b.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.c_.forEach(((o,a)=>{a.sequenceNumber<=t&&n.get(a.targetId)===null&&(this.c_.delete(o),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),s++)})),b.waitFor(i).next((()=>s))}getTargetCount(e){return b.resolve(this.targetCount)}getTargetData(e,t){const n=this.c_.get(t)||null;return b.resolve(n)}addMatchingKeys(e,t,n){return this.E_.Js(t,n),b.resolve()}removeMatchingKeys(e,t,n){this.E_.Zs(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),b.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.E_.Xs(t),b.resolve()}getMatchingKeysForTargetId(e,t){const n=this.E_.t_(t);return b.resolve(n)}containsKey(e,t){return b.resolve(this.E_.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ql{constructor(e,t){this.T_={},this.overlays={},this.P_=new gt(0),this.R_=!1,this.R_=!0,this.I_=new ab,this.referenceDelegate=e(this),this.A_=new lb(this),this.indexManager=new Yv,this.remoteDocumentCache=(function(s){return new Bb(s)})((n=>this.referenceDelegate.V_(n))),this.serializer=new aE(t),this.d_=new ib(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.R_=!1,Promise.resolve()}get started(){return this.R_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new ob,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.T_[e.toKey()];return n||(n=new ub(t,this.referenceDelegate),this.T_[e.toKey()]=n),n}getGlobalsCache(){return this.I_}getTargetCache(){return this.A_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.d_}runTransaction(e,t,n){M("MemoryPersistence","Starting transaction:",e);const s=new hb(this.P_.next());return this.referenceDelegate.f_(),n(s).next((i=>this.referenceDelegate.m_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}p_(e,t){return b.or(Object.values(this.T_).map((n=>()=>n.containsKey(e,t))))}}class hb extends Dm{constructor(e){super(),this.currentSequenceNumber=e}}class Ju{constructor(e){this.persistence=e,this.g_=new jl,this.y_=null}static w_(e){return new Ju(e)}get b_(){if(this.y_)return this.y_;throw W(60996)}addReference(e,t,n){return this.g_.addReference(n,t),this.b_.delete(n.toString()),b.resolve()}removeReference(e,t,n){return this.g_.removeReference(n,t),this.b_.add(n.toString()),b.resolve()}markPotentiallyOrphaned(e,t){return this.b_.add(t.toString()),b.resolve()}removeTarget(e,t){this.g_.Xs(t.targetId).forEach((s=>this.b_.add(s.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.b_.add(i.toString())))})).next((()=>n.removeTargetData(e,t)))}f_(){this.y_=new Set}m_(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return b.forEach(this.b_,(n=>{const s=J.fromPath(n);return this.S_(e,s).next((i=>{i||t.removeEntry(s,ee.min())}))})).next((()=>(this.y_=null,t.apply(e))))}updateLimboDocument(e,t){return this.S_(e,t).next((n=>{n?this.b_.delete(t.toString()):this.b_.add(t.toString())}))}V_(e){return 0}S_(e,t){return b.or([()=>b.resolve(this.g_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.p_(e,t)])}}class hu{constructor(e,t){this.persistence=e,this.v_=new vn((n=>it(n.path)),((n,s)=>n.isEqual(s))),this.garbageCollector=Tm(this,t)}static w_(e,t){return new hu(e,t)}f_(){}m_(e){return b.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}rr(e){const t=this.xs(e);return this.persistence.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}xs(e){let t=0;return this.ir(e,(n=>{t++})).next((()=>t))}ir(e,t){return b.forEach(this.v_,((n,s)=>this.Fs(e,n,s).next((i=>i?b.resolve():t(s)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.u_(e,(o=>this.Fs(e,o,t).next((a=>{a||(n++,i.removeEntry(o,ee.min()))})))).next((()=>i.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.v_.set(t,e.currentSequenceNumber),b.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.v_.set(n,e.currentSequenceNumber),b.resolve()}removeReference(e,t,n){return this.v_.set(n,e.currentSequenceNumber),b.resolve()}updateLimboDocument(e,t){return this.v_.set(t,e.currentSequenceNumber),b.resolve()}V_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Sa(e.data.value)),t}Fs(e,t,n){return b.or([()=>this.persistence.p_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.v_.get(t);return b.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fb{constructor(e){this.serializer=e}Mn(e,t,n,s){const i=new Nu("createOrUpgrade",t);n<1&&s>=1&&((function(B){B.createObjectStore(qo)})(e),(function(B){B.createObjectStore(Eo,{keyPath:gv}),B.createObjectStore(Lt,{keyPath:BC,autoIncrement:!0}).createIndex(xr,cC,{unique:!0}),B.createObjectStore(js)})(e),vC(e),(function(B){B.createObjectStore(Rr)})(e));let o=b.resolve();return n<3&&s>=3&&(n!==0&&((function(B){B.deleteObjectStore(Ks),B.deleteObjectStore(qs),B.deleteObjectStore(Hr)})(e),vC(e)),o=o.next((()=>(function(B){const c=B.store(Hr),h={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:ee.min().toTimestamp(),targetCount:0};return c.put(uu,h)})(i)))),n<4&&s>=4&&(n!==0&&(o=o.next((()=>(function(B,c){return c.store(Lt).Kn().next((f=>{B.deleteObjectStore(Lt),B.createObjectStore(Lt,{keyPath:BC,autoIncrement:!0}).createIndex(xr,cC,{unique:!0});const C=c.store(Lt),_=f.map((R=>C.put(R)));return b.waitFor(_)}))})(e,i)))),o=o.next((()=>{(function(B){B.createObjectStore(Js,{keyPath:Av})})(e)}))),n<5&&s>=5&&(o=o.next((()=>this.D_(i)))),n<6&&s>=6&&(o=o.next((()=>((function(B){B.createObjectStore(_o)})(e),this.x_(i))))),n<7&&s>=7&&(o=o.next((()=>this.C_(i)))),n<8&&s>=8&&(o=o.next((()=>this.F_(e,i)))),n<9&&s>=9&&(o=o.next((()=>{(function(B){B.objectStoreNames.contains("remoteDocumentChanges")&&B.deleteObjectStore("remoteDocumentChanges")})(e)}))),n<10&&s>=10&&(o=o.next((()=>this.O_(i)))),n<11&&s>=11&&(o=o.next((()=>{(function(B){B.createObjectStore(Gu,{keyPath:Rv})})(e),(function(B){B.createObjectStore(Hu,{keyPath:vv})})(e)}))),n<12&&s>=12&&(o=o.next((()=>{(function(B){const c=B.createObjectStore(Uu,{keyPath:xv});c.createIndex(Tc,Lv,{unique:!1}),c.createIndex(tE,kv,{unique:!1})})(e)}))),n<13&&s>=13&&(o=o.next((()=>(function(B){const c=B.createObjectStore(au,{keyPath:Ev});c.createIndex(ka,_v),c.createIndex(Ym,Dv)})(e))).next((()=>this.M_(e,i))).next((()=>e.deleteObjectStore(Rr)))),n<14&&s>=14&&(o=o.next((()=>this.N_(e,i)))),n<15&&s>=15&&(o=o.next((()=>(function(B){B.createObjectStore(kl,{keyPath:bv,autoIncrement:!0}).createIndex(wc,Sv,{unique:!1}),B.createObjectStore(Wi,{keyPath:Pv}).createIndex(Zm,Nv,{unique:!1}),B.createObjectStore(Yi,{keyPath:Ov}).createIndex(eE,Fv,{unique:!1})})(e)))),n<16&&s>=16&&(o=o.next((()=>{t.objectStore(Wi).clear()})).next((()=>{t.objectStore(Yi).clear()}))),n<17&&s>=17&&(o=o.next((()=>{(function(B){B.createObjectStore(Vl,{keyPath:Vv})})(e)}))),n<18&&s>=18&&Cp()&&(o=o.next((()=>{t.objectStore(Wi).clear()})).next((()=>{t.objectStore(Yi).clear()}))),o}x_(e){let t=0;return e.store(Rr).jn(((n,s)=>{t+=Bu(s)})).next((()=>{const n={byteSize:t};return e.store(_o).put(yc,n)}))}D_(e){const t=e.store(Eo),n=e.store(Lt);return t.Kn().next((s=>b.forEach(s,(i=>{const o=IDBKeyRange.bound([i.userId,Vr],[i.userId,i.lastAcknowledgedBatchId]);return n.Kn(xr,o).next((a=>b.forEach(a,(B=>{U(B.userId===i.userId,18650,"Cannot process batch from unexpected user",{batchId:B.batchId});const c=Sr(this.serializer,B);return oE(e,i.userId,c).next((()=>{}))}))))}))))}C_(e){const t=e.store(Ks),n=e.store(Rr);return e.store(Hr).get(uu).next((s=>{const i=[];return n.jn(((o,a)=>{const B=new Be(o),c=(function(f){return[0,it(f)]})(B);i.push(t.get(c).next((h=>h?b.resolve():(f=>t.put({targetId:0,path:it(f),sequenceNumber:s.highestListenSequenceNumber}))(B))))})).next((()=>b.waitFor(i)))}))}F_(e,t){e.createObjectStore(Do,{keyPath:Tv});const n=t.store(Do),s=new Ul,i=o=>{if(s.add(o)){const a=o.lastSegment(),B=o.popLast();return n.put({collectionId:a,parent:it(B)})}};return t.store(Rr).jn({zn:!0},((o,a)=>{const B=new Be(o);return i(B.popLast())})).next((()=>t.store(js).jn({zn:!0},(([o,a,B],c)=>{const h=Qt(a);return i(h.popLast())}))))}O_(e){const t=e.store(qs);return t.jn(((n,s)=>{const i=Vi(this.serializer,s),o=uE(this.serializer,i);return t.put(o)}))}M_(e,t){const n=t.store(Rr),s=[];return n.jn(((i,o)=>{const a=t.store(au),B=(function(f){return f.document?new J(Be.fromString(f.document.name).popFirst(5)):f.noDocument?J.fromSegments(f.noDocument.path):f.unknownDocument?J.fromSegments(f.unknownDocument.path):W(36783)})(o).path.toArray(),c={prefixPath:B.slice(0,B.length-2),collectionGroup:B[B.length-2],documentId:B[B.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};s.push(a.put(c))})).next((()=>b.waitFor(s)))}N_(e,t){const n=t.store(Lt),s=gE(this.serializer),i=new ql(Ju.w_,this.serializer.qr);return n.Kn().next((o=>{const a=new Map;return o.forEach((B=>{let c=a.get(B.userId)??oe();Sr(this.serializer,B).keys().forEach((h=>c=c.add(h))),a.set(B.userId,c)})),b.forEach(a,((B,c)=>{const h=new We(c),f=qu.Kr(this.serializer,h),C=i.getIndexManager(h),_=ju.Kr(h,this.serializer,C,i.referenceDelegate);return new mE(s,_,f,C).recalculateAndSaveOverlaysForDocumentKeys(new Ac(t,gt.yn),B).next()}))}))}}function vC(r){r.createObjectStore(Ks,{keyPath:yv}).createIndex(Ll,wv,{unique:!0}),r.createObjectStore(qs,{keyPath:"targetId"}).createIndex(Xm,Iv,{unique:!0}),r.createObjectStore(Hr)}const Gn="IndexedDbPersistence",GB=18e5,HB=5e3,UB="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",db="main";class Kl{constructor(e,t,n,s,i,o,a,B,c,h,f=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.xt=i,this.window=o,this.document=a,this.L_=c,this.B_=h,this.U_=f,this.P_=null,this.R_=!1,this.isPrimary=!1,this.networkEnabled=!0,this.k_=null,this.inForeground=!1,this.q_=null,this.K_=null,this.Q_=Number.NEGATIVE_INFINITY,this.W_=C=>Promise.resolve(),!Kl.Je())throw new H(F.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new eb(this,s),this.G_=t+db,this.serializer=new aE(B),this.z_=new Xn(this.G_,this.U_,new fb(this.serializer)),this.I_=new Kv,this.A_=new Zv(this.referenceDelegate,this.serializer),this.remoteDocumentCache=gE(this.serializer),this.d_=new qv,this.window&&this.window.localStorage?this.j_=this.window.localStorage:(this.j_=null,h===!1&&ke(Gn,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.H_().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new H(F.FAILED_PRECONDITION,UB);return this.J_(),this.Y_(),this.Z_(),this.runTransaction("getHighestListenSequenceNumber","readonly",(e=>this.A_.getHighestSequenceNumber(e)))})).then((e=>{this.P_=new gt(e,this.L_)})).then((()=>{this.R_=!0})).catch((e=>(this.z_&&this.z_.close(),Promise.reject(e))))}X_(e){return this.W_=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.z_.Ln((async t=>{t.newVersion===null&&await e()}))}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.xt.enqueueAndForget((async()=>{this.started&&await this.H_()})))}H_(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",(e=>ya(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.eo(e).next((t=>{t||(this.isPrimary=!1,this.xt.enqueueRetryable((()=>this.W_(!1))))}))})).next((()=>this.no(e))).next((t=>this.isPrimary&&!t?this.ro(e).next((()=>!1)):!!t&&this.io(e).next((()=>!0)))))).catch((e=>{if(Cr(e))return M(Gn,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return M(Gn,"Releasing owner lease after error during lease refresh",e),!1})).then((e=>{this.isPrimary!==e&&this.xt.enqueueRetryable((()=>this.W_(e))),this.isPrimary=e}))}eo(e){return Ni(e).get(fs).next((t=>b.resolve(this.so(t))))}_o(e){return ya(e).delete(this.clientId)}async oo(){if(this.isPrimary&&!this.ao(this.Q_,GB)){this.Q_=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",(t=>{const n=ze(t,Js);return n.Kn().next((s=>{const i=this.uo(s,GB),o=s.filter((a=>i.indexOf(a)===-1));return b.forEach(o,(a=>n.delete(a.clientId))).next((()=>o))}))})).catch((()=>[]));if(this.j_)for(const t of e)this.j_.removeItem(this.co(t.clientId))}}Z_(){this.K_=this.xt.enqueueAfterDelay("client_metadata_refresh",4e3,(()=>this.H_().then((()=>this.oo())).then((()=>this.Z_()))))}so(e){return!!e&&e.ownerId===this.clientId}no(e){return this.B_?b.resolve(!0):Ni(e).get(fs).next((t=>{if(t!==null&&this.ao(t.leaseTimestampMs,HB)&&!this.lo(t.ownerId)){if(this.so(t)&&this.networkEnabled)return!0;if(!this.so(t)){if(!t.allowTabSynchronization)throw new H(F.FAILED_PRECONDITION,UB);return!1}}return!(!this.networkEnabled||!this.inForeground)||ya(e).Kn().next((n=>this.uo(n,HB).find((s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,o=!this.inForeground&&s.inForeground,a=this.networkEnabled===s.networkEnabled;if(i||o&&a)return!0}return!1}))===void 0))})).next((t=>(this.isPrimary!==t&&M(Gn,`Client ${t?"is":"is not"} eligible for a primary lease.`),t)))}async shutdown(){this.R_=!1,this.Eo(),this.K_&&(this.K_.cancel(),this.K_=null),this.ho(),this.To(),await this.z_.runTransaction("shutdown","readwrite",[qo,Js],(e=>{const t=new Ac(e,gt.yn);return this.ro(t).next((()=>this._o(t)))})),this.z_.close(),this.Po()}uo(e,t){return e.filter((n=>this.ao(n.updateTimeMs,t)&&!this.lo(n.clientId)))}Ro(){return this.runTransaction("getActiveClients","readonly",(e=>ya(e).Kn().next((t=>this.uo(t,GB).map((n=>n.clientId))))))}get started(){return this.R_}getGlobalsCache(){return this.I_}getMutationQueue(e,t){return ju.Kr(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.A_}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new Xv(e,this.serializer.qr.databaseId)}getDocumentOverlayCache(e){return qu.Kr(this.serializer,e)}getBundleCache(){return this.d_}runTransaction(e,t,n){M(Gn,"Starting transaction:",e);const s=t==="readonly"?"readonly":"readwrite",i=(function(B){return B===18?Hv:B===17?iE:B===16?Gv:B===15?Ml:B===14?sE:B===13?rE:B===12?Mv:B===11?nE:void W(60245)})(this.U_);let o;return this.z_.runTransaction(e,s,i,(a=>(o=new Ac(a,this.P_?this.P_.next():gt.yn),t==="readwrite-primary"?this.eo(o).next((B=>!!B||this.no(o))).next((B=>{if(!B)throw ke(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.xt.enqueueRetryable((()=>this.W_(!1))),new H(F.FAILED_PRECONDITION,_m);return n(o)})).next((B=>this.io(o).next((()=>B)))):this.Io(o).next((()=>n(o)))))).then((a=>(o.raiseOnCommittedEvent(),a)))}Io(e){return Ni(e).get(fs).next((t=>{if(t!==null&&this.ao(t.leaseTimestampMs,HB)&&!this.lo(t.ownerId)&&!this.so(t)&&!(this.B_||this.allowTabSynchronization&&t.allowTabSynchronization))throw new H(F.FAILED_PRECONDITION,UB)}))}io(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return Ni(e).put(fs,t)}static Je(){return Xn.Je()}ro(e){const t=Ni(e);return t.get(fs).next((n=>this.so(n)?(M(Gn,"Releasing primary lease."),t.delete(fs)):b.resolve()))}ao(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(ke(`Detected an update time that is in the future: ${e} > ${n}`),!1))}J_(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.q_=()=>{this.xt.enqueueAndForget((()=>(this.inForeground=this.document.visibilityState==="visible",this.H_())))},this.document.addEventListener("visibilitychange",this.q_),this.inForeground=this.document.visibilityState==="visible")}ho(){this.q_&&(this.document.removeEventListener("visibilitychange",this.q_),this.q_=null)}Y_(){var e;typeof((e=this.window)==null?void 0:e.addEventListener)=="function"&&(this.k_=()=>{this.Eo();const t=/(?:Version|Mobile)\/1[456]/;dp()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.xt.enterRestrictedMode(!0),this.xt.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener("pagehide",this.k_))}To(){this.k_&&(this.window.removeEventListener("pagehide",this.k_),this.k_=null)}lo(e){var t;try{const n=((t=this.j_)==null?void 0:t.getItem(this.co(e)))!==null;return M(Gn,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return ke(Gn,"Failed to get zombied client id.",n),!1}}Eo(){if(this.j_)try{this.j_.setItem(this.co(this.clientId),String(Date.now()))}catch(e){ke("Failed to set zombie client id.",e)}}Po(){if(this.j_)try{this.j_.removeItem(this.co(this.clientId))}catch{}}co(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function Ni(r){return ze(r,qo)}function ya(r){return ze(r,Js)}function EE(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jl{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.Ao=n,this.Vo=s}static fo(e,t){let n=oe(),s=oe();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Jl(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cb(r,e){return J.comparator(r.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pb{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _E{constructor(){this.mo=!1,this.po=!1,this.yo=100,this.wo=(function(){return dp()?8:Im(Je())>0?6:4})()}initialize(e,t){this.bo=e,this.indexManager=t,this.mo=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.So(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.vo(e,t,s,n).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new pb;return this.Do(e,t,o).next((a=>{if(i.result=a,this.po)return this.xo(e,t,o,a.size)}))})).next((()=>i.result))}xo(e,t,n,s){return Le(t)?b.resolve():n.documentReadCount<this.yo?(Ds()<=ce.DEBUG&&M("QueryEngine","SDK will not create cache indexes for query:",Ki(t),"since it only creates cache indexes for collection contains","more than or equal to",this.yo,"documents"),b.resolve()):(Ds()<=ce.DEBUG&&M("QueryEngine","Query:",Ki(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.wo*s?(Ds()<=ce.DEBUG&&M("QueryEngine","The SDK decides to create cache indexes for query:",Ki(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Rt(t))):b.resolve())}So(e,t){if(Le(t))return b.resolve(null);let n=t;if(jd(n))return b.resolve(null);let s=Rt(n);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(n.limit!==null&&i===1&&(n=tu(n,null,"F"),s=Rt(n)),this.indexManager.getDocumentsMatchingTarget(e,s).next((o=>{const a=oe(...o);return this.bo.getDocuments(e,a).next((B=>this.indexManager.getMinOffset(e,s).next((c=>{const h=this.Co(n,B);return this.Fo(n,h,a,c.readTime)?this.So(e,tu(n,null,"F")):this.Oo(e,h,n,c)}))))})))))}vo(e,t,n,s){return(Le(t)?(function(o){for(const a of o.stages){if(a instanceof ar||a instanceof oC)return!1;if(a instanceof Ho){if(a.condition instanceof km&&a.condition._expr.name==="exists"&&a.condition._expr.params[0]instanceof is&&a.condition._expr.params[0].fieldName===Kt)continue;return!1}}return!0})(t):jd(t))||s.isEqual(ee.min())?b.resolve(null):this.bo.getDocuments(e,n).next((i=>{const o=this.Co(t,i);return this.Fo(t,o,n,s)?b.resolve(null):(Ds()<=ce.DEBUG&&M("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),aC(t)),this.Oo(e,o,t,Kg(s,Hs)).next((a=>a)))}))}Co(e,t){let n,s;return Le(e)?(n=new me(Cb),s=i=>Ku(e,i)):(n=new me(fl(e)),s=i=>Su(e,i)),t.forEach(((i,o)=>{s(o)&&(n=n.add(o))})),n}Fo(e,t,n,s){if(Le(e))return(function(a){return a.stages.some((B=>B instanceof ar||B instanceof oC))})(e);if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Do(e,t,n){return Ds()<=ce.DEBUG&&M("QueryEngine","Using full collection scan to execute query:",aC(t)),this.bo.getDocumentsMatchingQuery(e,t,vt.min(),n)}Oo(e,t,n,s){return this.bo.getDocumentsMatchingQuery(e,n,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zl="LocalStore",gb=3e8;class mb{constructor(e,t,n,s){this.persistence=e,this.Mo=t,this.serializer=s,this.No=new Te(ie),this.Lo=new vn((i=>Mu(i)),Ol),this.Bo=new Map,this.Uo=e.getRemoteDocumentCache(),this.A_=e.getTargetCache(),this.d_=e.getBundleCache(),this.ko(n)}ko(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new mE(this.Uo,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Uo.setIndexManager(this.indexManager),this.Mo.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.No)))}}function DE(r,e,t,n){return new mb(r,e,t,n)}async function IE(r,e){const t=Y(r);return await t.persistence.runTransaction("Handle user change","readonly",(n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next((i=>(s=i,t.ko(e),t.mutationQueue.getAllMutationBatches(n)))).next((i=>{const o=[],a=[];let B=oe();for(const c of s){o.push(c.batchId);for(const h of c.mutations)B=B.add(h.key)}for(const c of i){a.push(c.batchId);for(const h of c.mutations)B=B.add(h.key)}return t.localDocuments.getDocuments(n,B).next((c=>({qo:c,removedBatchIds:o,addedBatchIds:a})))}))}))}function Eb(r,e){const t=Y(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const s=e.batch.keys(),i=t.Uo.newChangeBuffer({trackRemovals:!0});return(function(a,B,c,h){const f=c.batch,C=f.keys();let _=b.resolve();return C.forEach((R=>{_=_.next((()=>h.getEntry(B,R))).next((L=>{const G=c.docVersions.get(R);U(G!==null,48541),L.version.compareTo(G)<0&&(f.applyToRemoteDocument(L,c),L.isValidDocument()&&(L.setReadTime(c.commitVersion),h.addEntry(L)))}))})),_.next((()=>a.mutationQueue.removeMutationBatch(B,f)))})(t,n,e,i).next((()=>i.apply(n))).next((()=>t.mutationQueue.performConsistencyCheck(n))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(a){let B=oe();for(let c=0;c<a.mutationResults.length;++c)a.mutationResults[c].transformResults.length>0&&(B=B.add(a.batch.mutations[c].key));return B})(e)))).next((()=>t.localDocuments.getDocuments(n,s)))}))}function yE(r){const e=Y(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.A_.getLastRemoteSnapshotVersion(t)))}function _b(r,e){const t=Y(r),n=e.snapshotVersion;let s=t.No;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=t.Uo.newChangeBuffer({trackRemovals:!0});s=t.No;const a=[];e.targetChanges.forEach(((h,f)=>{const C=s.get(f);if(!C)return;a.push(t.A_.removeMatchingKeys(i,h.removedDocuments,f).next((()=>t.A_.addMatchingKeys(i,h.addedDocuments,f))));let _=C.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(f)!==null?_=_.withResumeToken(Ne.EMPTY_BYTE_STRING,ee.min()).withLastLimboFreeSnapshotVersion(ee.min()):h.resumeToken.approximateByteSize()>0&&(_=_.withResumeToken(h.resumeToken,n)),s=s.insert(f,_),(function(L,G,Q){return L.resumeToken.approximateByteSize()===0||G.snapshotVersion.toMicroseconds()-L.snapshotVersion.toMicroseconds()>=gb?!0:Q.addedDocuments.size+Q.modifiedDocuments.size+Q.removedDocuments.size>0})(C,_,h)&&a.push(t.A_.updateTargetData(i,_))}));let B=je(),c=oe();if(e.documentUpdates.forEach((h=>{e.resolvedLimboDocuments.has(h)&&a.push(t.persistence.referenceDelegate.updateLimboDocument(i,h))})),a.push(Db(i,o,e.documentUpdates).next((h=>{B=h.$o,c=h.Ko}))),!n.isEqual(ee.min())){const h=t.A_.getLastRemoteSnapshotVersion(i).next((f=>t.A_.setTargetsMetadata(i,i.currentSequenceNumber,n)));a.push(h)}return b.waitFor(a).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,B,c))).next((()=>B))})).then((i=>(t.No=s,i)))}function Db(r,e,t){let n=oe(),s=oe();return t.forEach((i=>n=n.add(i))),e.getEntries(r,n).next((i=>{let o=je();return t.forEach(((a,B)=>{const c=i.get(a);B.isFoundDocument()!==c.isFoundDocument()&&(s=s.add(a)),B.isNoDocument()&&B.version.isEqual(ee.min())?(e.removeEntry(a,B.readTime),o=o.insert(a,B)):!c.isValidDocument()||B.version.compareTo(c.version)>0||B.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(B),o=o.insert(a,B)):M(zl,"Ignoring outdated watch update for ",a,". Current version:",c.version," Watch version:",B.version)})),{$o:o,Ko:s}}))}function Ib(r,e){const t=Y(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(n=>(e===void 0&&(e=Vr),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e))))}function fu(r,e){const t=Y(r);return t.persistence.runTransaction("Allocate target","readwrite",(n=>{let s;return t.A_.getTargetData(n,e).next((i=>i?(s=i,b.resolve(s)):t.A_.allocateTargetId(n).next((o=>(s=new $t(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.A_.addTargetData(n,s).next((()=>s)))))))})).then((n=>{const s=t.No.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.No=t.No.insert(n.targetId,n),t.Lo.set(e,n.targetId)),n}))}async function zs(r,e,t){const n=Y(r),s=n.No.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,(o=>n.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!Cr(o))throw o;M(zl,`Failed to update sequence numbers for target ${e}: ${o}`)}n.No=n.No.remove(e),n.Lo.delete(s.target)}function Nc(r,e,t){const n=Y(r);let s=ee.min(),i=oe();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(B,c,h){const f=Y(B),C=f.Lo.get(h);return C!==void 0?b.resolve(f.No.get(C)):f.A_.getTargetData(c,h)})(n,o,Le(e)?e:Rt(e)).next((a=>{if(a)return s=a.lastLimboFreeSnapshotVersion,n.A_.getMatchingKeysForTargetId(o,a.targetId).next((B=>{i=B}))})).next((()=>n.Mo.getDocumentsMatchingQuery(o,e,t?s:ee.min(),t?i:oe()))).next((a=>(TE(n,a),{documents:a,Qo:i})))))}function wE(r,e){const t=Y(r),n=Y(t.A_),s=t.No.get(e);return s?Promise.resolve(s.target??null):t.persistence.runTransaction("Get target data","readonly",(i=>n.ge(i,e).next((o=>(o==null?void 0:o.target)??null))))}function Oc(r,e){const t=Y(r),n=t.Bo.get(e)||ee.min();return t.persistence.runTransaction("Get new document changes","readonly",(s=>t.Uo.getAllFromCollectionGroup(s,e,Kg(n,Hs),Number.MAX_SAFE_INTEGER))).then((s=>(TE(t,s),s)))}function TE(r,e){e.forEach(((t,n)=>{const s=n.key.getCollectionGroup(),i=r.Bo.get(s)||ee.min();n.readTime.compareTo(i)>0&&r.Bo.set(s,n.readTime)}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yb{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Jo=0,this.Yo=null,this.Zo=!0}Xo(){this.Jo===0&&(this.ea("Unknown"),this.Yo=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.Yo=null,this.ta("Backend didn't respond within 10 seconds."),this.ea("Offline"),Promise.resolve()))))}na(e){this.state==="Online"?this.ea("Unknown"):(this.Jo++,this.Jo>=1&&(this.ra(),this.ta(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ea("Offline")))}set(e){this.ra(),this.Jo=0,e==="Online"&&(this.Zo=!1),this.ea(e)}ea(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ta(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Zo?(ke(t),this.Zo=!1):M("OnlineStateTracker",t)}ra(){this.Yo!==null&&(this.Yo.cancel(),this.Yo=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const on="RemoteStore";class wb{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.ia=[],this.sa=new Map,this._a=new Map,this.oa=new Map,this.aa=new Tn(1e3),this.ua=new Tn(1001),this.ca=new Set,this.la=[],this.Ea=i,this.Ea.Ke((o=>{n.enqueueAndForget((async()=>{as(this)&&(M(on,"Restarting streams for network reachability change."),await(async function(B){const c=Y(B);c.ca.add(4),await Ko(c),c.ha.set("Unknown"),c.ca.delete(4),await zu(c)})(this))}))})),this.ha=new yb(n,s)}}async function zu(r){if(as(r))for(const e of r.la)await e(!0)}async function Ko(r){for(const e of r.la)await e(!1)}function Fc(r,e){return r._a.get(e)||void 0}function Qu(r,e){const t=Y(r),n=Fc(t,e.targetId);if(n!==void 0&&t.sa.has(n))return;const s=(function(a,B){const c=Fc(a,B);c!==void 0&&a.oa.delete(c);const h=(function(C,_){return _%2!=0?C.ua.next():C.aa.next()})(a,B);return a._a.set(B,h),a.oa.set(h,B),h})(t,e.targetId);M(on,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new $t(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.sa.set(s,i),Wl(t)?$l(t):ui(t).Jt()&&Ql(t,i)}function Qs(r,e){const t=Y(r),n=ui(t),s=Fc(t,e);M(on,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t.sa.delete(s),t._a.delete(e),t.oa.delete(s),n.Jt()&&AE(t,s),t.sa.size===0&&(n.Jt()?n.Xt():as(t)&&t.ha.set("Unknown"))}function Ql(r,e){if(r.Ta.H(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ee.min())>0){const t=r.oa.get(e.targetId);if(t===void 0)return void M(on,"SDK target ID not found for remote ID: "+e.targetId);const n=r.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(n)}ui(r).Tn(e)}function AE(r,e){r.Ta.H(e),ui(r).Pn(e)}function $l(r){r.Ta=new tA({getRemoteKeysForTarget:e=>{const t=r.oa.get(e);return t!==void 0?r.remoteSyncer.getRemoteKeysForTarget(t):oe()},ge:e=>r.sa.get(e)||null,Ae:()=>r.datastore.serializer.databaseId}),ui(r).start(),r.ha.Xo()}function Wl(r){return as(r)&&!ui(r).Ht()&&r.sa.size>0}function as(r){return Y(r).ca.size===0}function RE(r){r.Ta=void 0}async function Tb(r){r.ha.set("Online")}async function Ab(r){r.sa.forEach(((e,t)=>{Ql(r,e)}))}async function Rb(r,e){RE(r),Wl(r)?(r.ha.na(e),$l(r)):r.ha.set("Unknown")}async function vb(r,e,t){if(r.ha.set("Online"),e instanceof em&&e.state===2&&e.cause)try{await(async function(s,i){const o=i.cause;for(const a of i.targetIds){if(s.sa.has(a)){const B=s.oa.get(a);B!==void 0&&(await s.remoteSyncer.rejectListen(B,o),s._a.delete(B),s.oa.delete(a)),s.sa.delete(a)}s.Ta.removeTarget(a)}})(r,e)}catch(n){M(on,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await du(r,n)}else if(e instanceof Oa?r.Ta.se(e):e instanceof Zg?r.Ta.Ee(e):r.Ta.ae(e),!t.isEqual(ee.min()))try{const n=await yE(r.localStore);t.compareTo(n)>=0&&await(function(i,o){const a=i.Ta.de(o);a.targetChanges.forEach(((c,h)=>{if(c.resumeToken.approximateByteSize()>0){const f=i.sa.get(h);f&&i.sa.set(h,f.withResumeToken(c.resumeToken,o))}})),a.targetMismatches.forEach(((c,h)=>{const f=i.sa.get(c);if(!f)return;i.sa.set(c,f.withResumeToken(Ne.EMPTY_BYTE_STRING,f.snapshotVersion)),AE(i,c);const C=new $t(f.target,c,h,f.sequenceNumber);Ql(i,C)}));const B=(function(h,f){const C=new Map;f.targetChanges.forEach(((R,L)=>{const G=h.oa.get(L);G!==void 0&&C.set(G,R)}));let _=new Te(ie);return f.targetMismatches.forEach(((R,L)=>{const G=h.oa.get(R);G!==void 0&&(_=_.insert(G,L))})),new si(f.snapshotVersion,C,_,f.documentUpdates,f.augmentedDocumentUpdates,f.resolvedLimboDocuments)})(i,a);return i.remoteSyncer.applyRemoteEvent(B)})(r,t)}catch(n){M(on,"Failed to raise snapshot:",n),await du(r,n)}}async function du(r,e,t){if(!Cr(e))throw e;r.ca.add(1),await Ko(r),r.ha.set("Offline"),t||(t=()=>yE(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{M(on,"Retrying IndexedDB access"),await t(),r.ca.delete(1),await zu(r)}))}function vE(r,e){return e().catch((t=>du(r,t,e)))}async function ai(r){const e=Y(r),t=Br(e);let n=e.ia.length>0?e.ia[e.ia.length-1].batchId:Vr;for(;bb(e);)try{const s=await Ib(e.localStore,n);if(s===null){e.ia.length===0&&t.Xt();break}n=s.batchId,Sb(e,s)}catch(s){await du(e,s)}bE(e)&&SE(e)}function bb(r){return as(r)&&r.ia.length<10}function Sb(r,e){r.ia.push(e);const t=Br(r);t.Jt()&&t.Rn&&t.In(e.mutations)}function bE(r){return as(r)&&!Br(r).Ht()&&r.ia.length>0}function SE(r){Br(r).start()}async function Pb(r){Br(r).dn()}async function Nb(r){const e=Br(r);for(const t of r.ia)e.In(t.mutations)}async function Ob(r,e,t){const n=r.ia.shift(),s=xl.from(n,e,t);await vE(r,(()=>r.remoteSyncer.applySuccessfulWrite(s))),await ai(r)}async function Fb(r,e){e&&Br(r).Rn&&await(async function(n,s){if((function(o){return QT(o)&&o!==F.ABORTED})(s.code)){const i=n.ia.shift();Br(n).Zt(),await vE(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await ai(n)}})(r,e),bE(r)&&SE(r)}async function bC(r,e){const t=Y(r);t.asyncQueue.verifyOperationInProgress(),M(on,"RemoteStore received new credentials");const n=as(t);t.ca.add(3),await Ko(t),n&&t.ha.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.ca.delete(3),await zu(t)}async function xc(r,e){const t=Y(r);e?(t.ca.delete(2),await zu(t)):e||(t.ca.add(2),await Ko(t),t.ha.set("Unknown"))}function ui(r){return r.Pa||(r.Pa=(function(t,n,s){const i=Y(t);return i.mn(),new AA(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{ut:Tb.bind(null,r),lt:Ab.bind(null,r),ht:Rb.bind(null,r),hn:vb.bind(null,r)}),r.la.push((async e=>{e?(r.Pa.Zt(),Wl(r)?$l(r):r.ha.set("Unknown")):(await r.Pa.stop(),RE(r))}))),r.Pa}function Br(r){return r.Ra||(r.Ra=(function(t,n,s){const i=Y(t);return i.mn(),new RA(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{ut:()=>Promise.resolve(),lt:Pb.bind(null,r),ht:Fb.bind(null,r),An:Nb.bind(null,r),Vn:Ob.bind(null,r)}),r.la.push((async e=>{e?(r.Ra.Zt(),await ai(r)):(await r.Ra.stop(),r.ia.length>0&&(M(on,`Stopping write stream with ${r.ia.length} pending writes`),r.ia=[]))}))),r.Ra}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yl{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ia(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ia(this.observer.error,e):ke("Uncaught Error in snapshot listener:",e.toString()))}Aa(){this.muted=!0}Ia(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xl{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new nn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const o=Date.now()+n,a=new Xl(e,t,o,s,i);return a.start(n),a}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new H(F.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Zl(r,e){if(ke("AsyncQueue",`${e}: ${r}`),Cr(r))return new H(F.UNAVAILABLE,`${e}: ${r}`);throw r}const Xi="IndexBackfiller";class xb{constructor(e,t){this.asyncQueue=e,this.va=t,this.task=null}start(){this.Da(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}Da(e){M(Xi,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,(async()=>{this.task=null;try{const t=await this.va.xa();M(Xi,`Documents written: ${t}`)}catch(t){Cr(t)?M(Xi,"Ignoring IndexedDB error during index backfill: ",t):await dr(t)}await this.Da(6e4)}))}}class Lb{constructor(e,t){this.localStore=e,this.persistence=t}async xa(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",(t=>this.Ca(t,e)))}Ca(e,t){const n=new Set;let s=t,i=!0;return b.doWhile((()=>i===!0&&s>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((o=>{if(o!==null&&!n.has(o))return M(Xi,`Processing collection: ${o}`),this.Fa(e,o,s).next((a=>{s-=a,n.add(o)}));i=!1})))).next((()=>t-s))}Fa(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next((s=>this.localStore.localDocuments.getNextDocuments(e,t,s,n).next((i=>{const o=i.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next((()=>this.Oa(s,i))).next((a=>(M(Xi,`Updating offset: ${a}`),this.localStore.indexManager.updateCollectionGroup(e,t,a)))).next((()=>o.size))}))))}Oa(e,t){let n=e;return t.changes.forEach(((s,i)=>{const o=Jg(i);cl(o,n)>0&&(n=o)})),new vt(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PE="firestore_clients";function SC(r,e){return`${PE}_${r}_${e}`}const NE="firestore_mutations";function PC(r,e,t){let n=`${NE}_${r}_${t}`;return e.isAuthenticated()&&(n+=`_${e.uid}`),n}const OE="firestore_targets";function jB(r,e){return`${OE}_${r}_${e}`}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qt="SharedClientState";class Cu{constructor(e,t,n,s){this.user=e,this.batchId=t,this.state=n,this.error=s}static Ma(e,t,n){const s=JSON.parse(n);let i,o=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return o&&s.error&&(o=typeof s.error.message=="string"&&typeof s.error.code=="string",o&&(i=new H(s.error.code,s.error.message))),o?new Cu(e,t,s.state,i):(ke(qt,`Failed to parse mutation state for ID '${t}': ${n}`),null)}Na(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Zi{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static Ma(e,t){const n=JSON.parse(t);let s,i=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return i&&n.error&&(i=typeof n.error.message=="string"&&typeof n.error.code=="string",i&&(s=new H(n.error.code,n.error.message))),i?new Zi(e,n.state,s):(ke(qt,`Failed to parse target state for ID '${e}': ${t}`),null)}Na(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class pu{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Ma(e,t){const n=JSON.parse(t);let s=typeof n=="object"&&n.activeTargetIds instanceof Array,i=dl();for(let o=0;s&&o<n.activeTargetIds.length;++o)s=Ag(n.activeTargetIds[o]),i=i.add(n.activeTargetIds[o]);return s?new pu(e,i):(ke(qt,`Failed to parse client data for instance '${e}': ${t}`),null)}}class eh{constructor(e,t){this.clientId=e,this.onlineState=t}static Ma(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new eh(t.clientId,t.onlineState):(ke(qt,`Failed to parse online state: ${e}`),null)}}class Lc{constructor(){this.activeTargetIds=dl()}La(e){this.activeTargetIds=this.activeTargetIds.add(e)}Ba(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Na(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class qB{constructor(e,t,n,s,i){this.window=e,this.xt=t,this.persistenceKey=n,this.Ua=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.ka=this.qa.bind(this),this.$a=new Te(ie),this.started=!1,this.Ka=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Qa=SC(this.persistenceKey,this.Ua),this.Wa=(function(B){return`firestore_sequence_number_${B}`})(this.persistenceKey),this.$a=this.$a.insert(this.Ua,new Lc),this.Ga=new RegExp(`^${PE}_${o}_([^_]*)$`),this.za=new RegExp(`^${NE}_${o}_(\\d+)(?:_(.*))?$`),this.ja=new RegExp(`^${OE}_${o}_(\\d+)$`),this.Ha=(function(B){return`firestore_online_state_${B}`})(this.persistenceKey),this.Ja=(function(B){return`firestore_bundle_loaded_v2_${B}`})(this.persistenceKey),this.window.addEventListener("storage",this.ka)}static Je(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Ro();for(const n of e){if(n===this.Ua)continue;const s=this.getItem(SC(this.persistenceKey,n));if(s){const i=pu.Ma(n,s);i&&(this.$a=this.$a.insert(i.clientId,i))}}this.Ya();const t=this.storage.getItem(this.Ha);if(t){const n=this.Za(t);n&&this.Xa(n)}for(const n of this.Ka)this.qa(n);this.Ka=[],this.window.addEventListener("pagehide",(()=>this.shutdown())),this.started=!0}writeSequenceNumber(e){this.setItem(this.Wa,JSON.stringify(e))}getAllActiveQueryTargets(){return this.eu(this.$a)}isActiveQueryTarget(e){let t=!1;return this.$a.forEach(((n,s)=>{s.activeTargetIds.has(e)&&(t=!0)})),t}addPendingMutation(e){this.tu(e,"pending")}updateMutationState(e,t,n){this.tu(e,t,n),this.nu(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const s=this.storage.getItem(jB(this.persistenceKey,e));if(s){const i=Zi.Ma(e,s);i&&(n=i.state)}}return t&&this.ru.La(e),this.Ya(),n}removeLocalQueryTarget(e){this.ru.Ba(e),this.Ya()}isLocalQueryTarget(e){return this.ru.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(jB(this.persistenceKey,e))}updateQueryState(e,t,n){this.iu(e,t,n)}handleUserChange(e,t,n){t.forEach((s=>{this.nu(s)})),this.currentUser=e,n.forEach((s=>{this.addPendingMutation(s)}))}setOnlineState(e){this.su(e)}notifyBundleLoaded(e){this._u(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.ka),this.removeItem(this.Qa),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return M(qt,"READ",e,t),t}setItem(e,t){M(qt,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){M(qt,"REMOVE",e),this.storage.removeItem(e)}qa(e){const t=e;if(t.storageArea===this.storage){if(M(qt,"EVENT",t.key,t.newValue),t.key===this.Qa)return void ke("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.xt.enqueueRetryable((async()=>{if(this.started){if(t.key!==null){if(this.Ga.test(t.key)){if(t.newValue==null){const n=this.ou(t.key);return this.au(n,null)}{const n=this.uu(t.key,t.newValue);if(n)return this.au(n.clientId,n)}}else if(this.za.test(t.key)){if(t.newValue!==null){const n=this.cu(t.key,t.newValue);if(n)return this.lu(n)}}else if(this.ja.test(t.key)){if(t.newValue!==null){const n=this.Eu(t.key,t.newValue);if(n)return this.hu(n)}}else if(t.key===this.Ha){if(t.newValue!==null){const n=this.Za(t.newValue);if(n)return this.Xa(n)}}else if(t.key===this.Wa){const n=(function(i){let o=gt.yn;if(i!=null)try{const a=JSON.parse(i);U(typeof a=="number",30636,{Tu:i}),o=a}catch(a){ke(qt,"Failed to read sequence number from WebStorage",a)}return o})(t.newValue);n!==gt.yn&&this.sequenceNumberHandler(n)}else if(t.key===this.Ja){const n=this.Pu(t.newValue);await Promise.all(n.map((s=>this.syncEngine.Ru(s))))}}}else this.Ka.push(t)}))}}get ru(){return this.$a.get(this.Ua)}Ya(){this.setItem(this.Qa,this.ru.Na())}tu(e,t,n){const s=new Cu(this.currentUser,e,t,n),i=PC(this.persistenceKey,this.currentUser,e);this.setItem(i,s.Na())}nu(e){const t=PC(this.persistenceKey,this.currentUser,e);this.removeItem(t)}su(e){const t={clientId:this.Ua,onlineState:e};this.storage.setItem(this.Ha,JSON.stringify(t))}iu(e,t,n){const s=jB(this.persistenceKey,e),i=new Zi(e,t,n);this.setItem(s,i.Na())}_u(e){const t=JSON.stringify(Array.from(e));this.setItem(this.Ja,t)}ou(e){const t=this.Ga.exec(e);return t?t[1]:null}uu(e,t){const n=this.ou(e);return pu.Ma(n,t)}cu(e,t){const n=this.za.exec(e),s=Number(n[1]),i=n[2]!==void 0?n[2]:null;return Cu.Ma(new We(i),s,t)}Eu(e,t){const n=this.ja.exec(e),s=Number(n[1]);return Zi.Ma(s,t)}Za(e){return eh.Ma(e)}Pu(e){return JSON.parse(e)}async lu(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Iu(e.batchId,e.state,e.error);M(qt,`Ignoring mutation for non-active user ${e.user.uid}`)}hu(e){return this.syncEngine.Au(e.targetId,e.state,e.error)}au(e,t){const n=t?this.$a.insert(e,t):this.$a.remove(e),s=this.eu(this.$a),i=this.eu(n),o=[],a=[];return i.forEach((B=>{s.has(B)||o.push(B)})),s.forEach((B=>{i.has(B)||a.push(B)})),this.syncEngine.Vu(o,a).then((()=>{this.$a=n}))}Xa(e){this.$a.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}eu(e){let t=dl();return e.forEach(((n,s)=>{t=t.unionWith(s.activeTargetIds)})),t}}class FE{constructor(){this.du=new Lc,this.fu={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.du.La(e),this.fu[e]||"not-current"}updateQueryState(e,t,n){this.fu[e]=t}removeLocalQueryTarget(e){this.du.Ba(e)}isLocalQueryTarget(e){return this.du.activeTargetIds.has(e)}clearQueryState(e){delete this.fu[e]}getAllActiveQueryTargets(){return this.du.activeTargetIds}isActiveQueryTarget(e){return this.du.activeTargetIds.has(e)}start(){return this.du=new Lc,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xE(){return typeof window<"u"?window:null}function Ma(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ur{static emptySet(e){return new Ur(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||J.comparator(t.key,n.key):(t,n)=>J.comparator(t.key,n.key),this.keyedMap=vr(),this.sortedSet=new Te(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Ur)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new Ur;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NC{constructor(){this.mu=new Te(J.comparator)}track(e){const t=e.doc.key,n=this.mu.get(t);n?e.type!==0&&n.type===3?this.mu=this.mu.insert(t,e):e.type===3&&n.type!==1?this.mu=this.mu.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.mu=this.mu.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.mu=this.mu.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.mu=this.mu.remove(t):e.type===1&&n.type===2?this.mu=this.mu.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.mu=this.mu.insert(t,{type:2,doc:e.doc}):W(63341,{ye:e,pu:n}):this.mu=this.mu.insert(t,e)}gu(){const e=[];return this.mu.inorderTraversal(((t,n)=>{e.push(n)})),e}}class $s{constructor(e,t,n,s,i,o,a,B,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=B,this.hasCachedResults=c}static fromInitialDocuments(e,t,n,s,i){const o=[];return t.forEach((a=>{o.push({type:0,doc:a})})),new $s(e,t,Ur.emptySet(t),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Vu(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kb{constructor(){this.yu=void 0,this.wu=[]}bu(){return this.wu.some((e=>e.Su()))}}class Vb{constructor(){this.queries=OC(),this.onlineState="Unknown",this.vu=new Set}terminate(){(function(t,n){const s=Y(t),i=s.queries;s.queries=OC(),i.forEach(((o,a)=>{for(const B of a.wu)B.onError(n)}))})(this,new H(F.ABORTED,"Firestore shutting down"))}}function OC(){return new vn((r=>$m(r)),Vu)}async function th(r,e){const t=Y(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.bu()&&e.Su()&&(n=2):(i=new kb,n=e.Su()?0:1);try{switch(n){case 0:i.yu=await t.onListen(s,!0);break;case 1:i.yu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const a=Zl(o,`Initialization of query '${Le(e.query)?gn(e.query):Ki(e.query)}' failed`);return void e.onError(a)}t.queries.set(s,i),i.wu.push(e),e.Du(t.onlineState),i.yu&&e.xu(i.yu)&&rh(t)}async function nh(r,e){const t=Y(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const o=i.wu.indexOf(e);o>=0&&(i.wu.splice(o,1),i.wu.length===0?s=e.Su()?0:1:!i.bu()&&e.Su()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function Mb(r,e){const t=Y(r);let n=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const a of o.wu)a.xu(s)&&(n=!0);o.yu=s}}n&&rh(t)}function Gb(r,e,t){const n=Y(r),s=n.queries.get(e);if(s)for(const i of s.wu)i.onError(t);n.queries.delete(e)}function rh(r){r.vu.forEach((e=>{e.next()}))}var kc;(function(r){r.Default="default",r.Cache="cache"})(kc||(kc={}));class sh{constructor(e,t,n){this.query=e,this.Cu=t,this.Fu=!1,this.Ou=null,this.onlineState="Unknown",this.options=n||{}}xu(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new $s(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Fu?this.Mu(e)&&(this.Cu.next(e),t=!0):this.Nu(e,this.onlineState)&&(this.Lu(e),t=!0),this.Ou=e,t}onError(e){this.Cu.error(e)}Du(e){this.onlineState=e;let t=!1;return this.Ou&&!this.Fu&&this.Nu(this.Ou,e)&&(this.Lu(this.Ou),t=!0),t}Nu(e,t){if(!e.fromCache||!this.Su())return!0;const n=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Mu(e){if(e.docChanges.length>0)return!0;const t=this.Ou&&this.Ou.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Lu(e){e=$s.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Fu=!0,this.Cu.next(e)}Su(){return this.options.source!==kc.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LE{constructor(e){this.key=e}}class kE{constructor(e){this.key=e}}class Hb{constructor(e,t){this.query=e,this.Gu=t,this.zu=null,this.hasCachedResults=!1,this.current=!1,this.ju=oe(),this.mutatedKeys=oe(),this.Hu=Le(e)?Pc(e):fl(e),this.Ju=new Ur(this.Hu)}get Yu(){return this.Gu}Zu(e,t){const n=t?t.Xu:new NC,s=t?t.Ju:this.Ju;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,a=!1;const[B,c]=this.ec(this.query,s);e.inorderTraversal(((f,C)=>{const _=s.get(f),R=CE(this.query,C)?C:null,L=!!_&&this.mutatedKeys.has(_.key),G=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations);let Q=!1;_&&R?_.data.isEqual(R.data)?L!==G&&(n.track({type:3,doc:R}),Q=!0):this.tc(_,R)||(n.track({type:2,doc:R}),Q=!0,(B&&this.Hu(R,B)>0||c&&this.Hu(R,c)<0)&&(a=!0)):!_&&R?(n.track({type:0,doc:R}),Q=!0):_&&!R&&(n.track({type:1,doc:_}),Q=!0,(B||c)&&(a=!0)),Q&&(R?(o=o.add(R),i=G?i.add(f):i.delete(f)):(o=o.delete(f),i=i.delete(f)))}));const h=this.nc(this.query);if(h)if(Le(this.query)){const f=[];o.forEach((R=>f.push(R)));const C=dE(this.query,f);let _=new Ur(Pc(this.query));for(const R of C)_=_.add(R);o.forEach((R=>{_.has(R.key)||(i=i.delete(R.key),n.track({type:1,doc:R}))})),o=_}else{const f=this.rc(this.query);for(;o.size>h;){const C=f==="F"?o.last():o.first();o=o.delete(C.key),i=i.delete(C.key),n.track({type:1,doc:C})}}return{Ju:o,Xu:n,Fo:a,mutatedKeys:i}}nc(e){var t;return Le(e)?(t=MB(e))==null?void 0:t.limit:e.limit||void 0}rc(e){if(Le(e)){const t=MB(e);return t&&t.limit<0?"L":"F"}return e.limitType}ec(e,t){var n;if(Le(e)){const s=(n=MB(e))==null?void 0:n.limit;return[t.size===s?t.last():null,null]}return[e.limitType==="F"&&t.size===this.nc(this.query)?t.last():null,e.limitType==="L"&&t.size===this.nc(this.query)?t.first():null]}tc(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.Ju;this.Ju=e.Ju,this.mutatedKeys=e.mutatedKeys;const o=e.Xu.gu();o.sort(((h,f)=>(function(_,R){const L=G=>{switch(G){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return W(20277,{ye:G})}};return L(_)-L(R)})(h.type,f.type)||this.Hu(h.doc,f.doc))),this.sc(n),s=s??!1;const a=t&&!s?this._c():[],B=this.ju.size===0&&this.current&&!s?1:0,c=B!==this.zu;return this.zu=B,o.length!==0||c?{snapshot:new $s(this.query,e.Ju,i,o,e.mutatedKeys,B===0,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),oc:a}:{oc:a}}Du(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ju:this.Ju,Xu:new NC,mutatedKeys:this.mutatedKeys,Fo:!1},!1)):{oc:[]}}ac(e){return!this.Gu.has(e)&&!!this.Ju.has(e)&&!this.Ju.get(e).hasLocalMutations}sc(e){e&&(e.addedDocuments.forEach((t=>this.Gu=this.Gu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Gu=this.Gu.delete(t))),this.current=e.current)}_c(){if(!this.current)return[];const e=this.ju;this.ju=oe(),this.Ju.forEach((n=>{this.ac(n.key)&&(this.ju=this.ju.add(n.key))}));const t=[];return e.forEach((n=>{this.ju.has(n)||t.push(new kE(n))})),this.ju.forEach((n=>{e.has(n)||t.push(new LE(n))})),t}uc(e){this.Gu=e.Qo,this.ju=oe();const t=this.Zu(e.documents);return this.applyChanges(t,!0)}cc(){return $s.fromInitialDocuments(this.query,this.Ju,this.mutatedKeys,this.zu===0,this.hasCachedResults)}}const Bi="SyncEngine";class Ub{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class jb{constructor(e){this.key=e,this.lc=!1}}class qb{constructor(e,t,n,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Ec={},this.hc=new vn((a=>$m(a)),Vu),this.Tc=new Map,this.Pc=new Set,this.Rc=new Te(J.comparator),this.Ic=new Map,this.Ac=new jl,this.Vc={},this.dc=new Map,this.fc=Tn.ws(),this.onlineState="Unknown",this.mc=void 0}get isPrimaryClient(){return this.mc===!0}}async function Kb(r,e,t=!0){const n=$u(r);let s;const i=n.hc.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.cc()):s=await VE(n,e,t,!0),s}async function Jb(r,e){const t=$u(r);await VE(t,e,!0,!1)}async function VE(r,e,t,n){const s=await fu(r.localStore,Le(e)?e:Rt(e)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,t);let a;return n&&(a=await ih(r,e,i,o==="current",s.resumeToken)),r.isPrimaryClient&&t&&Qu(r.remoteStore,s),a}async function ih(r,e,t,n,s){r.gc=(f,C,_)=>(async function(L,G,Q,te){let se=G.view.Zu(Q);se.Fo&&(se=await Nc(L.localStore,G.query,!1).then((({documents:w})=>G.view.Zu(w,se))));const ge=te&&te.targetChanges.get(G.targetId),he=te&&te.targetMismatches.get(G.targetId)!=null,ue=G.view.applyChanges(se,L.isPrimaryClient,ge,he);return Vc(L,G.targetId,ue.oc),ue.snapshot})(r,f,C,_);const i=await Nc(r.localStore,e,!0),o=new Hb(e,i.Qo),a=o.Zu(i.documents),B=Lo.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),c=o.applyChanges(a,r.isPrimaryClient,B);Vc(r,t,c.oc);const h=new Ub(e,t,o);return r.hc.set(e,h),r.Tc.has(t)?r.Tc.get(t).push(e):r.Tc.set(t,[e]),c.snapshot}async function zb(r,e,t){const n=Y(r),s=n.hc.get(e),i=n.Tc.get(s.targetId);if(i.length>1)return n.Tc.set(s.targetId,i.filter((o=>!Vu(o,e)))),void n.hc.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await zs(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),t&&Qs(n.remoteStore,s.targetId),Ws(n,s.targetId)})).catch(dr)):(Ws(n,s.targetId),await zs(n.localStore,s.targetId,!0))}async function Qb(r,e){const t=Y(r),n=t.hc.get(e),s=t.Tc.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),Qs(t.remoteStore,n.targetId))}async function $b(r,e,t){const n=Bh(r);try{const s=await(function(o,a){const B=Y(o),c=Ee.now(),h=a.reduce(((_,R)=>_.add(R.key)),oe());let f,C;return B.persistence.runTransaction("Locally write mutations","readwrite",(_=>{let R=je(),L=oe();return B.Uo.getEntries(_,h).next((G=>{R=G,R.forEach(((Q,te)=>{te.isValidDocument()||(L=L.add(Q))}))})).next((()=>B.localDocuments.getOverlayedDocuments(_,R))).next((G=>{f=G;const Q=[];for(const te of a){const se=FT(te,f.get(te.key).overlayedDocument);se!=null&&Q.push(new Rn(te.key,se,Sg(se.value.mapValue),qe.exists(!0)))}return B.mutationQueue.addMutationBatch(_,c,Q,a)})).next((G=>{C=G;const Q=G.applyToLocalDocumentSet(f,L);return B.documentOverlayCache.saveOverlays(_,G.batchId,Q)}))})).then((()=>({batchId:C.batchId,changes:Yg(f)})))})(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),(function(o,a,B){let c=o.Vc[o.currentUser.toKey()];c||(c=new Te(ie)),c=c.insert(a,B),o.Vc[o.currentUser.toKey()]=c})(n,s.batchId,t),await gr(n,s.changes),await ai(n.remoteStore)}catch(s){const i=Zl(s,"Failed to persist write");t.reject(i)}}async function ME(r,e){const t=Y(r);try{const n=await _b(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const o=t.Ic.get(i);o&&(U(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.lc=!0:s.modifiedDocuments.size>0?U(o.lc,14607):s.removedDocuments.size>0&&(U(o.lc,42227),o.lc=!1))})),await gr(t,n,e)}catch(n){await dr(n)}}function FC(r,e,t){const n=Y(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.hc.forEach(((i,o)=>{const a=o.view.Du(e);a.snapshot&&s.push(a.snapshot)})),(function(o,a){const B=Y(o);B.onlineState=a;let c=!1;B.queries.forEach(((h,f)=>{for(const C of f.wu)C.Du(a)&&(c=!0)})),c&&rh(B)})(n.eventManager,e),s.length&&n.Ec.hn(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function Wb(r,e,t){const n=Y(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.Ic.get(e),i=s&&s.key;if(i){let o=new Te(J.comparator);o=o.insert(i,xe.newNoDocument(i,ee.min()));const a=oe().add(i),B=new si(ee.min(),new Map,new Te(ie),o,je(),a);await ME(n,B),n.Rc=n.Rc.remove(i),n.Ic.delete(e),uh(n)}else await zs(n.localStore,e,!1).then((()=>Ws(n,e,t))).catch(dr)}async function Yb(r,e){const t=Y(r),n=e.batch.batchId;try{const s=await Eb(t.localStore,e);ah(t,n,null),oh(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await gr(t,s)}catch(s){await dr(s)}}async function Xb(r,e,t){const n=Y(r);try{const s=await(function(o,a){const B=Y(o);return B.persistence.runTransaction("Reject batch","readwrite-primary",(c=>{let h;return B.mutationQueue.lookupMutationBatch(c,a).next((f=>(U(f!==null,37113),h=f.keys(),B.mutationQueue.removeMutationBatch(c,f)))).next((()=>B.mutationQueue.performConsistencyCheck(c))).next((()=>B.documentOverlayCache.removeOverlaysForBatchId(c,h,a))).next((()=>B.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,h))).next((()=>B.localDocuments.getDocuments(c,h)))}))})(n.localStore,e);ah(n,e,t),oh(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await gr(n,s)}catch(s){await dr(s)}}function oh(r,e){(r.dc.get(e)||[]).forEach((t=>{t.resolve()})),r.dc.delete(e)}function ah(r,e,t){const n=Y(r);let s=n.Vc[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.Vc[n.currentUser.toKey()]=s}}function Ws(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Tc.get(e))r.hc.delete(n),t&&r.Ec.yc(n,t);r.Tc.delete(e),r.isPrimaryClient&&r.Ac.Xs(e).forEach((n=>{r.Ac.containsKey(n)||GE(r,n)}))}function GE(r,e){r.Pc.delete(e.path.canonicalString());const t=r.Rc.get(e);t!==null&&(Qs(r.remoteStore,t),r.Rc=r.Rc.remove(e),r.Ic.delete(t),uh(r))}function Vc(r,e,t){for(const n of t)n instanceof LE?(r.Ac.addReference(n.key,e),Zb(r,n)):n instanceof kE?(M(Bi,"Document no longer in limbo: "+n.key),r.Ac.removeReference(n.key,e),r.Ac.containsKey(n.key)||GE(r,n.key)):W(19791,{wc:n})}function Zb(r,e){const t=e.key,n=t.path.canonicalString();r.Rc.get(t)||r.Pc.has(n)||(M(Bi,"New document in limbo: "+t),r.Pc.add(n),uh(r))}function uh(r){for(;r.Pc.size>0&&r.Rc.size<r.maxConcurrentLimboResolutions;){const e=r.Pc.values().next().value;r.Pc.delete(e);const t=new J(Be.fromString(e)),n=r.fc.next();r.Ic.set(n,new jb(t)),r.Rc=r.Rc.insert(t,n),Qu(r.remoteStore,new $t(Rt(xo(t.path)),n,"TargetPurposeLimboResolution",gt.yn))}}async function gr(r,e,t){const n=Y(r),s=[],i=[],o=[];n.hc.isEmpty()||(n.hc.forEach(((a,B)=>{o.push(n.gc(B,e,t).then((c=>{var h;if((c||t)&&n.isPrimaryClient){const f=c?!c.fromCache:(h=t==null?void 0:t.targetChanges.get(B.targetId))==null?void 0:h.current;n.sharedClientState.updateQueryState(B.targetId,f?"current":"not-current")}if(c){s.push(c);const f=Jl.fo(B.targetId,c);i.push(f)}})))})),await Promise.all(o),n.Ec.hn(s),await(async function(B,c){const h=Y(B);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",(f=>b.forEach(c,(C=>b.forEach(C.Ao,(_=>h.persistence.referenceDelegate.addReference(f,C.targetId,_))).next((()=>b.forEach(C.Vo,(_=>h.persistence.referenceDelegate.removeReference(f,C.targetId,_)))))))))}catch(f){if(!Cr(f))throw f;M(zl,"Failed to update sequence numbers: "+f)}for(const f of c){const C=f.targetId;if(!f.fromCache){const _=h.No.get(C),R=_.snapshotVersion,L=_.withLastLimboFreeSnapshotVersion(R);h.No=h.No.insert(C,L)}}})(n.localStore,i))}async function eS(r,e){const t=Y(r);if(!t.currentUser.isEqual(e)){M(Bi,"User change. New user:",e.toKey());const n=await IE(t.localStore,e);t.currentUser=e,(function(i,o){i.dc.forEach((a=>{a.forEach((B=>{B.reject(new H(F.CANCELLED,o))}))})),i.dc.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await gr(t,n.qo)}}function tS(r,e){const t=Y(r),n=t.Ic.get(e);if(n&&n.lc)return oe().add(n.key);{let s=oe();const i=t.Tc.get(e);if(!i)return s;for(const o of i??[]){const a=t.hc.get(o);s=s.unionWith(a.view.Yu)}return s}}async function nS(r,e){const t=Y(r),n=await Nc(t.localStore,e.query,!0),s=e.view.uc(n);return t.isPrimaryClient&&Vc(t,e.targetId,s.oc),s}async function rS(r,e){const t=Y(r);return Oc(t.localStore,e).then((n=>gr(t,n)))}async function sS(r,e,t,n){const s=Y(r),i=await(function(a,B){const c=Y(a),h=Y(c.mutationQueue);return c.persistence.runTransaction("Lookup mutation documents","readonly",(f=>h.Qr(f,B).next((C=>C?c.localDocuments.getDocuments(f,C):b.resolve(null)))))})(s.localStore,e);i!==null?(t==="pending"?await ai(s.remoteStore):t==="acknowledged"||t==="rejected"?(ah(s,e,n||null),oh(s,e),(function(a,B){Y(Y(a).mutationQueue).jr(B)})(s.localStore,e)):W(6720,"Unknown batchState",{bc:t}),await gr(s,i)):M(Bi,"Cannot apply mutation batch with id: "+e)}async function iS(r,e){const t=Y(r);if($u(t),Bh(t),e===!0&&t.mc!==!0){const n=t.sharedClientState.getAllActiveQueryTargets(),s=await xC(t,n.toArray());t.mc=!0,await xc(t.remoteStore,!0);for(const i of s)Qu(t.remoteStore,i)}else if(e===!1&&t.mc!==!1){const n=[];let s=Promise.resolve();t.Tc.forEach(((i,o)=>{t.sharedClientState.isLocalQueryTarget(o)?n.push(o):s=s.then((()=>(Ws(t,o),zs(t.localStore,o,!0)))),Qs(t.remoteStore,o)})),await s,await xC(t,n),(function(o){const a=Y(o);a.Ic.forEach(((B,c)=>{Qs(a.remoteStore,c)})),a.Ac.e_(),a.Ic=new Map,a.Rc=new Te(J.comparator)})(t),t.mc=!1,await xc(t.remoteStore,!1)}}async function xC(r,e,t){const n=Y(r),s=[],i=[];for(const o of e){let a;const B=n.Tc.get(o);if(B&&B.length!==0){a=await fu(n.localStore,Le(B[0])?B[0]:Rt(B[0]));for(const c of B){const h=n.hc.get(c),f=await nS(n,h);f.snapshot&&i.push(f.snapshot)}}else{const c=await wE(n.localStore,o);a=await fu(n.localStore,c),await ih(n,HE(c),o,!1,a.resumeToken)}s.push(a)}return n.Ec.hn(i),s}function HE(r){return cn(r)?r:zg(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function oS(r){return(function(t){return Y(Y(t).persistence).Ro()})(Y(r).localStore)}async function aS(r,e,t,n){const s=Y(r);if(s.mc)return void M(Bi,"Ignoring unexpected query state notification.");const i=s.Tc.get(e);if(i&&i.length>0)switch(t){case"current":case"not-current":{let o;if(Le(i[0]))switch(pn(i[0])){case"collection_group":case"collection":o=await Oc(s.localStore,Um(i[0]));break;case"documents":o=await(function(c,h){const f=Y(c),C=oe(...su(h).map((_=>J.fromPath(_))));return f.persistence.runTransaction("Get documents for pipeline","readonly",(_=>f.Uo.getEntries(_,C))).then((_=>_))})(s.localStore,i[0]);break;default:Ft(""),o=vr()}else o=await Oc(s.localStore,(function(c){return c.collectionGroup||(c.path.length%2==1?c.path.lastSegment():c.path.get(c.path.length-2))})(i[0]));const a=si.createSynthesizedRemoteEventForCurrentChange(e,t==="current",Ne.EMPTY_BYTE_STRING);await gr(s,o,a);break}case"rejected":await zs(s.localStore,e,!0),Ws(s,e,n);break;default:W(64155,t)}}async function uS(r,e,t){const n=$u(r);if(n.mc){for(const s of e){if(n.Tc.has(s)&&n.sharedClientState.isActiveQueryTarget(s)){M(Bi,"Adding an already active target "+s);continue}const i=await wE(n.localStore,s),o=await fu(n.localStore,i);await ih(n,HE(i),o.targetId,!1,o.resumeToken),Qu(n.remoteStore,o)}for(const s of t)n.Tc.has(s)&&await zs(n.localStore,s,!1).then((()=>{Qs(n.remoteStore,s),Ws(n,s)})).catch(dr)}}function $u(r){const e=Y(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=ME.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=tS.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Wb.bind(null,e),e.Ec.hn=Mb.bind(null,e.eventManager),e.Ec.yc=Gb.bind(null,e.eventManager),e}function Bh(r){const e=Y(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Yb.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Xb.bind(null,e),e}class Io{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Pu(e.databaseInfo.databaseId),this.sharedClientState=this.Sc(e),this.persistence=this.vc(e),await this.persistence.start(),this.localStore=this.Dc(e),this.gcScheduler=this.xc(e,this.localStore),this.indexBackfillerScheduler=this.Cc(e,this.localStore)}xc(e,t){return null}Cc(e,t){return null}Dc(e){return DE(this.persistence,new _E,e.initialUser,this.serializer)}vc(e){return new ql(Ju.w_,this.serializer)}Sc(e){return new FE}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Io.provider={build:()=>new Io};class BS extends Io{constructor(e){super(),this.cacheSizeBytes=e}xc(e,t){U(this.persistence.referenceDelegate instanceof hu,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new wm(n,e.asyncQueue,t)}vc(e){const t=this.cacheSizeBytes!==void 0?rt.withCacheSize(this.cacheSizeBytes):rt.DEFAULT;return new ql((n=>hu.w_(n,t)),this.serializer)}}class UE extends Io{constructor(e,t,n){super(),this.Fc=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Fc.initialize(this,e),await Bh(this.Fc.syncEngine),await ai(this.Fc.remoteStore),await this.persistence.X_((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}Dc(e){return DE(this.persistence,new _E,e.initialUser,this.serializer)}xc(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new wm(n,e.asyncQueue,t)}Cc(e,t){const n=new Lb(t,this.persistence);return new xb(e.asyncQueue,n)}vc(e){const t=EE(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?rt.withCacheSize(this.cacheSizeBytes):rt.DEFAULT;return new Kl(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,xE(),Ma(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Sc(e){return new FE}}class cS extends UE{constructor(e,t){super(e,t,!1),this.Fc=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Fc.syncEngine;this.sharedClientState instanceof qB&&(this.sharedClientState.syncEngine={Iu:sS.bind(null,t),Au:aS.bind(null,t),Vu:uS.bind(null,t),Ro:oS.bind(null,t),Ru:rS.bind(null,t)},await this.sharedClientState.start()),await this.persistence.X_((async n=>{await iS(this.Fc.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())}))}Sc(e){const t=xE();if(!qB.Je(t))throw new H(F.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=EE(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new qB(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class yo{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>FC(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=eS.bind(null,this.syncEngine),await xc(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new Vb})()}createDatastore(e){const t=Pu(e.databaseInfo.databaseId),n=TA(e.databaseInfo);return SA(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return(function(n,s,i,o,a){return new wb(n,s,i,o,a)})(this.localStore,this.datastore,e.asyncQueue,(t=>FC(this.syncEngine,t,0)),(function(){return Yd.Je()?new Yd:new DA})())}createSyncEngine(e,t){return(function(s,i,o,a,B,c,h){const f=new qb(s,i,o,a,B,c);return h&&(f.mc=!0),f})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=Y(s);M(on,"RemoteStore shutting down."),i.ca.add(5),await Ko(i),i.Ea.shutdown(),i.ha.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}yo.provider={build:()=>new yo};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cr="FirestoreClient";class lS{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=s,this.user=We.UNAUTHENTICATED,this.clientId=rl.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async o=>{M(cr,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(n,(o=>(M(cr,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new nn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Zl(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function KB(r,e){r.asyncQueue.verifyOperationInProgress(),M(cr,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener((async s=>{n.isEqual(s)||(await IE(e.localStore,s),n=s)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function LC(r,e){r.asyncQueue.verifyOperationInProgress();const t=await hS(r);M(cr,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((n=>bC(e.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,s)=>bC(e.remoteStore,s))),r._onlineComponents=e}async function hS(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){M(cr,"Using user provided OfflineComponentProvider");try{await KB(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===F.FAILED_PRECONDITION||s.code===F.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;Ft("Error using user provided cache. Falling back to memory cache: "+t),await KB(r,new Io)}}else M(cr,"Using default OfflineComponentProvider"),await KB(r,new BS(void 0));return r._offlineComponents}async function jE(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(M(cr,"Using user provided OnlineComponentProvider"),await LC(r,r._uninitializedComponentsProvider._online)):(M(cr,"Using default OnlineComponentProvider"),await LC(r,new yo))),r._onlineComponents}function fS(r){return jE(r).then((e=>e.syncEngine))}async function gu(r){const e=await jE(r),t=e.eventManager;return t.onListen=Kb.bind(null,e.syncEngine),t.onUnlisten=zb.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Jb.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Qb.bind(null,e.syncEngine),t}function dS(r,e,t,n){const s=new Yl(n),i=new sh(e,s,t);return r.asyncQueue.enqueueAndForget((async()=>th(await gu(r),i))),()=>{s.Aa(),r.asyncQueue.enqueueAndForget((async()=>nh(await gu(r),i)))}}function CS(r,e,t={}){const n=new nn;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,a,B,c){const h=new Yl({next:C=>{h.Aa(),o.enqueueAndForget((()=>nh(i,f)));const _=C.docs.has(a);!_&&C.fromCache?c.reject(new H(F.UNAVAILABLE,"Failed to get document because the client is offline.")):_&&C.fromCache&&B&&B.source==="server"?c.reject(new H(F.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(C)},error:C=>c.reject(C)}),f=new sh(xo(a.path),h,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return th(i,f)})(await gu(r),r.asyncQueue,e,t,n))),n.promise}function pS(r,e,t={}){const n=new nn;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,a,B,c){const h=new Yl({next:C=>{h.Aa(),o.enqueueAndForget((()=>nh(i,f))),C.fromCache&&B.source==="server"?c.reject(new H(F.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(C)},error:C=>c.reject(C)}),f=new sh(a instanceof Qi?Cv(a):a,h,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return th(i,f)})(await gu(r),r.asyncQueue,e,t,n))),n.promise}function gS(r,e){const t=new nn;return r.asyncQueue.enqueueAndForget((async()=>$b(await fS(r),e,t))),t.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let qE=class{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Oe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new mS(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(ir("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},mS=class extends qE{data(){return super.data()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ES{convertValue(e,t="none"){switch(He(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Re(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(yn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw W(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return fr(e,((s,i)=>{n[s]=this.convertValue(i,t)})),n}convertVectorValue(e){var n,s,i;const t=(i=(s=(n=e.fields)==null?void 0:n[$r].arrayValue)==null?void 0:s.values)==null?void 0:i.map((o=>Re(o.doubleValue)));return new mt(t)}convertGeoPoint(e){return new tn(Re(e.latitude),Re(e.longitude))}convertArray(e,t){return(e.values||[]).map((n=>this.convertValue(n,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=No(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(Os(e));default:return null}}convertTimestamp(e){const t=In(e);return new Ee(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=Be.fromString(e);U(hm(n),9688,{name:e});const s=new Qr(n.get(1),n.get(3)),i=new J(n.popFirst(5));return s.isEqual(t)||ke(`A document reference to ${i} refers to a different database (${s.projectId}/${s.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ch(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kC="AsyncQueue";class VC{constructor(e=Promise.resolve()){this.qc=[],this.$c=!1,this.Kc=[],this.Qc=null,this.Wc=!1,this.Gc=!1,this.zc=[],this.jt=new gm(this,"async_queue_retry"),this.jc=()=>{const n=Ma();n&&M(kC,"Visibility state changed to "+n.visibilityState),this.jt.qt()},this.Hc=e;const t=Ma();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.jc)}get isShuttingDown(){return this.$c}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Jc(),this.Yc(e)}enterRestrictedMode(e){if(!this.$c){this.$c=!0,this.Gc=e||!1;const t=Ma();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.jc)}}enqueue(e){if(this.Jc(),this.$c)return new Promise((()=>{}));const t=new nn;return this.Yc((()=>this.$c&&this.Gc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.qc.push(e),this.Zc())))}async Zc(){if(this.qc.length!==0){try{await this.qc[0](),this.qc.shift(),this.jt.reset()}catch(e){if(!Cr(e))throw e;M(kC,"Operation failed with retryable error: "+e)}this.qc.length>0&&this.jt.Ut((()=>this.Zc()))}}Yc(e){const t=this.Hc.then((()=>(this.Wc=!0,e().catch((n=>{throw this.Qc=n,this.Wc=!1,ke("INTERNAL UNHANDLED ERROR: ",MC(n)),n})).then((n=>(this.Wc=!1,n))))));return this.Hc=t,t}enqueueAfterDelay(e,t,n){this.Jc(),this.zc.indexOf(e)>-1&&(t=0);const s=Xl.createAndSchedule(this,e,t,n,(i=>this.Xc(i)));return this.Kc.push(s),s}Jc(){this.Qc&&W(47125,{el:MC(this.Qc)})}verifyOperationInProgress(){}async tl(){let e;do e=this.Hc,await e;while(e!==this.Hc)}nl(e){for(const t of this.Kc)if(t.timerId===e)return!0;return!1}rl(e){return this.tl().then((()=>{this.Kc.sort(((t,n)=>t.targetTimeMs-n.targetTimeMs));for(const t of this.Kc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.tl()}))}il(e){this.zc.push(e)}Xc(e){const t=this.Kc.indexOf(e);this.Kc.splice(t,1)}}function MC(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class an extends Ou{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new VC,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new VC(e),this._firestoreClient=void 0,await e}}}function A0(r,e,t){t||(t=$a);const n=rs(r,"firestore");if(n.isInitialized(t)){const s=n.getImmediate({identifier:t}),i=n.getOptions(t);if(tr(i,e))return s;throw new H(F.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new H(F.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<ym)throw new H(F.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&Zs(e.host)&&Uc(e.host),n.initialize({options:e,instanceIdentifier:t})}function R0(r,e){const t=typeof r=="object"?r:Kc(),n=typeof r=="string"?r:e,s=rs(t,"firestore").getImmediate({identifier:n});if(!s._initialized){const i=lD("firestore");i&&kA(s,...i)}return s}function Jo(r){if(r._terminated)throw new H(F.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||_S(r),r._firestoreClient}function _S(r){var n,s,i,o;const e=r._freezeSettings(),t=NA(r._databaseId,((n=r._app)==null?void 0:n.options.appId)||"",r._persistenceKey,(s=r._app)==null?void 0:s.options.apiKey,e);r._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((o=e.localCache)!=null&&o._onlineComponentProvider)&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new lS(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(B){const c=B==null?void 0:B._online.build();return{_offline:B==null?void 0:B._offline.build(c),_online:c}})(r._componentsProvider))}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lh extends ES{constructor(e){super(),this.firestore=e}convertBytes(e){return new Nt(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Oe(this.firestore,null,t)}}class Mi{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class jr extends qE{constructor(e,t,n,s,i,o){super(e,t,n,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ga(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(ir("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new H(F.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=jr._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}jr._jsonSchemaVersion="firestore/documentSnapshot/1.0",jr._jsonSchema={type:Ge("string",jr._jsonSchemaVersion),bundleSource:Ge("string","DocumentSnapshot"),bundleName:Ge("string"),bundle:Ge("string")};class Ga extends jr{data(e={}){return super.data(e)}}class qr{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Mi(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new Ga(this._firestore,this._userDataWriter,n.key,n,new Mi(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new H(F.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((a=>{Le(s._snapshot.query)?Pc(s._snapshot.query):fl(s.query._query);const B=new Ga(s._firestore,s._userDataWriter,a.doc.key,a.doc,new Mi(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);return a.doc,{type:"added",doc:B,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((a=>i||a.type!==3)).map((a=>{const B=new Ga(s._firestore,s._userDataWriter,a.doc.key,a.doc,new Mi(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);let c=-1,h=-1;return a.type!==0&&(c=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),h=o.indexOf(a.doc.key)),{type:DS(a.type),doc:B,oldIndex:c,newIndex:h}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new H(F.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=qr._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=rl.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function DS(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return W(61501,{type:r})}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */qr._jsonSchemaVersion="firestore/querySnapshot/1.0",qr._jsonSchema={type:Ge("string",qr._jsonSchemaVersion),bundleSource:Ge("string","QuerySnapshot"),bundleName:Ge("string"),bundle:Ge("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function KE(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new H(F.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class hh{}class JE extends hh{}function v0(r,e,...t){let n=[];e instanceof hh&&n.push(e),n=n.concat(t),(function(i){const o=i.filter((B=>B instanceof fh)).length,a=i.filter((B=>B instanceof Wu)).length;if(o>1||o>0&&a>0)throw new H(F.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(n);for(const s of n)r=s._apply(r);return r}class Wu extends JE{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new Wu(e,t,n)}_apply(e){const t=this._parse(e);return zE(e._query,t),new pr(e.firestore,e.converter,gc(e._query,t))}_parse(e){const t=Vo(e.firestore);return(function(i,o,a,B,c,h,f){let C;if(c.isKeyField()){if(h==="array-contains"||h==="array-contains-any")throw new H(F.INVALID_ARGUMENT,`Invalid Query. You can't perform '${h}' queries on documentId().`);if(h==="in"||h==="not-in"){HC(f,h);const R=[];for(const L of f)R.push(GC(B,i,L));C={arrayValue:{values:R}}}else C=GC(B,i,f)}else h!=="in"&&h!=="not-in"&&h!=="array-contains-any"||HC(f,h),C=UA(a,o,f,h==="in"||h==="not-in");return le.create(c,h,C)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function b0(r,e,t){const n=e,s=ir("where",r);return Wu._create(s,n,t)}class fh extends hh{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new fh(e,t)}_parse(e){const t=this._queryConstraints.map((n=>n._parse(e))).filter((n=>n.getFilters().length>0));return t.length===1?t[0]:_e.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let o=s;const a=i.getFlattenedFilters();for(const B of a)zE(o,B),o=gc(o,B)})(e._query,t),new pr(e.firestore,e.converter,gc(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class dh extends JE{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new dh(e,t,n)}_apply(e){return new pr(e.firestore,e.converter,tu(e._query,this._limit,this._limitType))}}function S0(r){return DT("limit",r),dh._create("limit",r,"F")}function GC(r,e,t){if(typeof(t=ve(t))=="string"){if(t==="")throw new H(F.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Qg(e)&&t.indexOf("/")!==-1)throw new H(F.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(Be.fromString(t));if(!J.isDocumentKey(n))throw new H(F.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return oo(r,new J(n))}if(t instanceof Oe)return oo(r,t._key);throw new H(F.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${wu(t)}.`)}function HC(r,e){if(!Array.isArray(r)||r.length===0)throw new H(F.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function zE(r,e){const t=(function(s,i){for(const o of s)for(const a of o.getFlattenedFilters())if(i.indexOf(a.op)>=0)return a.op;return null})(r.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new H(F.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new H(F.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function UC(r){return(function(t,n){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1})(r,["next","error","complete"])}class IS{constructor(e){let t;this.kind="persistent",e!=null&&e.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=TS(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}function P0(r){return new IS(r)}class yS{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=yo.provider,this._offlineComponentProvider={build:t=>new UE(t,e==null?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class wS{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=yo.provider,this._offlineComponentProvider={build:t=>new cS(t,e==null?void 0:e.cacheSizeBytes)}}}function TS(r){return new yS(r==null?void 0:r.forceOwnership)}function N0(){return new wS}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AS{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Vo(e)}set(e,t,n){this._verifyNotCommitted();const s=JB(e,this._firestore),i=ch(s.converter,t,n),o=Dl(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,n);return this._mutations.push(o.toMutation(s._key,qe.none())),this}update(e,t,n,...s){this._verifyNotCommitted();const i=JB(e,this._firestore);let o;return o=typeof(t=ve(t))=="string"||t instanceof ko?Sm(this._dataReader,"WriteBatch.update",i._key,t,n,s):bm(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(o.toMutation(i._key,qe.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=JB(e,this._firestore);return this._mutations=this._mutations.concat(new Oo(t._key,qe.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new H(F.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function JB(r,e){if((r=ve(r)).firestore!==e)throw new H(F.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function O0(r){r=lt(r,Oe);const e=lt(r.firestore,an),t=Jo(e);return CS(t,r._key).then((n=>QE(e,r,n)))}function F0(r){r=lt(r,pr);const e=lt(r.firestore,an),t=Jo(e),n=new lh(e);return KE(r._query),pS(t,r._query).then((s=>new qr(e,n,r,s)))}function x0(r,e,t){r=lt(r,Oe);const n=lt(r.firestore,an),s=ch(r.converter,e,t),i=Vo(n);return zo(n,[Dl(i,"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,qe.none())])}function L0(r,e,t,...n){r=lt(r,Oe);const s=lt(r.firestore,an),i=Vo(s);let o;return o=typeof(e=ve(e))=="string"||e instanceof ko?Sm(i,"updateDoc",r._key,e,t,n):bm(i,"updateDoc",r._key,e),zo(s,[o.toMutation(r._key,qe.exists(!0))])}function k0(r){return zo(lt(r.firestore,an),[new Oo(r._key,qe.none())])}function V0(r,e){const t=lt(r.firestore,an),n=VA(r),s=ch(r.converter,e),i=Vo(r.firestore);return zo(t,[Dl(i,"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,qe.exists(!1))]).then((()=>n))}function M0(r,...e){var c,h,f;r=ve(r);let t={includeMetadataChanges:!1,source:"default"},n=0;typeof e[n]!="object"||UC(e[n])||(t=e[n++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(UC(e[n])){const C=e[n];e[n]=(c=C.next)==null?void 0:c.bind(C),e[n+1]=(h=C.error)==null?void 0:h.bind(C),e[n+2]=(f=C.complete)==null?void 0:f.bind(C)}let i,o,a;if(r instanceof Oe)o=lt(r.firestore,an),a=xo(r._key.path),i={next:C=>{e[n]&&e[n](QE(o,r,C))},error:e[n+1],complete:e[n+2]};else{const C=lt(r,pr);o=lt(C.firestore,an),a=C._query;const _=new lh(o);i={next:R=>{e[n]&&e[n](new qr(o,_,C,R))},error:e[n+1],complete:e[n+2]},KE(r._query)}const B=Jo(o);return dS(B,a,s,i)}function zo(r,e){const t=Jo(r);return gS(t,e)}function QE(r,e,t){const n=t.docs.get(e._key),s=new lh(r);return new jr(r,s,e._key,n,new Mi(t.hasPendingWrites,t.fromCache),e.converter)}function G0(r){return r=lt(r,an),Jo(r),new AS(r,(e=>zo(r,e)))}const jC="@firebase/firestore",qC="4.17.1";(function(e,t=!0){dT(ei),rn(new Mt("firestore",((n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),a=new an(new gA(n.getProvider("auth-internal")),new _A(o,n.getProvider("app-check-internal")),wT(o,s),o);return i={useFetchStreams:t,...i},a._setSettings(i),a}),"PUBLIC").setMultipleInstances(!0)),Ot(jC,qC,e),Ot(jC,qC,"esm2020")})();var RS="firebase",vS="12.18.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ot(RS,vS,"app");const $E="@firebase/installations",Ch="0.6.24";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WE=1e4,YE=`w:${Ch}`,XE="FIS_v2",bS="https://firebaseinstallations.googleapis.com/v1",SS=3600*1e3,PS="installations",NS="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OS={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Zr=new ns(PS,NS,OS);function ZE(r){return r instanceof un&&r.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function e_({projectId:r}){return`${bS}/projects/${r}/installations`}function t_(r){return{token:r.token,requestStatus:2,expiresIn:xS(r.expiresIn),creationTime:Date.now()}}async function n_(r,e){const n=(await e.json()).error;return Zr.create("request-failed",{requestName:r,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function r_({apiKey:r}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":r})}function FS(r,{refreshToken:e}){const t=r_(r);return t.append("Authorization",LS(e)),t}async function s_(r){const e=await r();return e.status>=500&&e.status<600?r():e}function xS(r){return Number(r.replace("s","000"))}function LS(r){return`${XE} ${r}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kS({appConfig:r,heartbeatServiceProvider:e},{fid:t}){const n=e_(r),s=r_(r),i=e.getImmediate({optional:!0});if(i){const c=await i.getHeartbeatsHeader();c&&s.append("x-firebase-client",c)}const o={fid:t,authVersion:XE,appId:r.appId,sdkVersion:YE},a={method:"POST",headers:s,body:JSON.stringify(o)},B=await s_(()=>fetch(n,a));if(B.ok){const c=await B.json();return{fid:c.fid||t,registrationStatus:2,refreshToken:c.refreshToken,authToken:t_(c.authToken)}}else throw await n_("Create Installation",B)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i_(r){return new Promise(e=>{setTimeout(e,r)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function VS(r){return btoa(String.fromCharCode(...r)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MS=/^[cdef][\w-]{21}$/,Mc="";function GS(){try{const r=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(r),r[0]=112+r[0]%16;const t=HS(r);return MS.test(t)?t:Mc}catch{return Mc}}function HS(r){return VS(r).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ci(r){return`${r.appName}!${r.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ys=new Map;function o_(r,e){const t=ci(r);a_(t,e),qS(t,e)}function US(r,e){u_();const t=ci(r);let n=Ys.get(t);n||(n=new Set,Ys.set(t,n)),n.add(e)}function jS(r,e){const t=ci(r),n=Ys.get(t);n&&(n.delete(e),n.size===0&&Ys.delete(t),B_())}function a_(r,e){const t=Ys.get(r);if(t)for(const n of t)n(e)}function qS(r,e){const t=u_();t&&t.postMessage({key:r,fid:e}),B_()}let Lr=null;function u_(){return!Lr&&"BroadcastChannel"in self&&(Lr=new BroadcastChannel("[Firebase] FID Change"),Lr.onmessage=r=>{a_(r.data.key,r.data.fid)}),Lr}function B_(){Ys.size===0&&Lr&&(Lr.close(),Lr=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const KS="firebase-installations-database",JS=1,es="firebase-installations-store";let zB=null;function ph(){return zB||(zB=_u(KS,JS,{upgrade:(r,e)=>{switch(e){case 0:r.createObjectStore(es)}}})),zB}async function mu(r,e){const t=ci(r),s=(await ph()).transaction(es,"readwrite"),i=s.objectStore(es),o=await i.get(t);return await i.put(e,t),await s.done,(!o||o.fid!==e.fid)&&o_(r,e.fid),e}async function c_(r){const e=ci(r),n=(await ph()).transaction(es,"readwrite");await n.objectStore(es).delete(e),await n.done}async function Yu(r,e){const t=ci(r),s=(await ph()).transaction(es,"readwrite"),i=s.objectStore(es),o=await i.get(t),a=e(o);return a===void 0?await i.delete(t):await i.put(a,t),await s.done,a&&(!o||o.fid!==a.fid)&&o_(r,a.fid),a}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gh(r){let e;const t=await Yu(r.appConfig,n=>{const s=zS(n),i=QS(r,s);return e=i.registrationPromise,i.installationEntry});return t.fid===Mc?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function zS(r){const e=r||{fid:GS(),registrationStatus:0};return l_(e)}function QS(r,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(Zr.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},n=$S(r,t);return{installationEntry:t,registrationPromise:n}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:WS(r)}:{installationEntry:e}}async function $S(r,e){try{const t=await kS(r,e);return mu(r.appConfig,t)}catch(t){throw ZE(t)&&t.customData.serverCode===409?await c_(r.appConfig):await mu(r.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function WS(r){let e=await KC(r.appConfig);for(;e.registrationStatus===1;)await i_(100),e=await KC(r.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:n}=await gh(r);return n||t}return e}function KC(r){return Yu(r,e=>{if(!e)throw Zr.create("installation-not-found");return l_(e)})}function l_(r){return YS(r)?{fid:r.fid,registrationStatus:0}:r}function YS(r){return r.registrationStatus===1&&r.registrationTime+WE<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function XS({appConfig:r,heartbeatServiceProvider:e},t){const n=ZS(r,t),s=FS(r,t),i=e.getImmediate({optional:!0});if(i){const c=await i.getHeartbeatsHeader();c&&s.append("x-firebase-client",c)}const o={installation:{sdkVersion:YE,appId:r.appId}},a={method:"POST",headers:s,body:JSON.stringify(o)},B=await s_(()=>fetch(n,a));if(B.ok){const c=await B.json();return t_(c)}else throw await n_("Generate Auth Token",B)}function ZS(r,{fid:e}){return`${e_(r)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mh(r,e=!1){let t;const n=await Yu(r.appConfig,i=>{if(!h_(i))throw Zr.create("not-registered");const o=i.authToken;if(!e&&nP(o))return i;if(o.requestStatus===1)return t=eP(r,e),i;{if(!navigator.onLine)throw Zr.create("app-offline");const a=sP(i);return t=tP(r,a),a}});return t?await t:n.authToken}async function eP(r,e){let t=await JC(r.appConfig);for(;t.authToken.requestStatus===1;)await i_(100),t=await JC(r.appConfig);const n=t.authToken;return n.requestStatus===0?mh(r,e):n}function JC(r){return Yu(r,e=>{if(!h_(e))throw Zr.create("not-registered");const t=e.authToken;return iP(t)?{...e,authToken:{requestStatus:0}}:e})}async function tP(r,e){try{const t=await XS(r,e),n={...e,authToken:t};return await mu(r.appConfig,n),t}catch(t){if(ZE(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await c_(r.appConfig);else{const n={...e,authToken:{requestStatus:0}};await mu(r.appConfig,n)}throw t}}function h_(r){return r!==void 0&&r.registrationStatus===2}function nP(r){return r.requestStatus===2&&!rP(r)}function rP(r){const e=Date.now();return e<r.creationTime||r.creationTime+r.expiresIn<e+SS}function sP(r){const e={requestStatus:1,requestTime:Date.now()};return{...r,authToken:e}}function iP(r){return r.requestStatus===1&&r.requestTime+WE<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function oP(r){const e=r,{installationEntry:t,registrationPromise:n}=await gh(e);return n?n.catch(console.error):mh(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function aP(r,e=!1){const t=r;return await uP(t),(await mh(t,e)).token}async function uP(r){const{registrationPromise:e}=await gh(r);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BP(r,e){const{appConfig:t}=r;return US(t,e),()=>{jS(t,e)}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cP(r){if(!r||!r.options)throw QB("App Configuration");if(!r.name)throw QB("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!r.options[t])throw QB(t);return{appName:r.name,projectId:r.options.projectId,apiKey:r.options.apiKey,appId:r.options.appId}}function QB(r){return Zr.create("missing-app-config-values",{valueName:r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f_="installations",lP="installations-internal",hP=r=>{const e=r.getProvider("app").getImmediate(),t=cP(e),n=rs(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:n,_delete:()=>Promise.resolve()}},fP=r=>{const e=r.getProvider("app").getImmediate(),t=rs(e,f_).getImmediate();return{getId:()=>oP(t),getToken:s=>aP(t,s)}};function dP(){rn(new Mt(f_,hP,"PUBLIC")),rn(new Mt(lP,fP,"PRIVATE"))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */dP();Ot($E,Ch);Ot($E,Ch,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CP="/firebase-messaging-sw.js",pP="/firebase-cloud-messaging-push-scope",d_="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",gP="https://fcmregistrations.googleapis.com/v1",C_="google.c.a.c_id",mP="google.c.a.c_l",EP="google.c.a.ts",_P="google.c.a.e",zC=1e4;var QC;(function(r){r[r.DATA_MESSAGE=1]="DATA_MESSAGE",r[r.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(QC||(QC={}));/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */var Xs;(function(r){r.PUSH_RECEIVED="push-received",r.NOTIFICATION_CLICKED="notification-clicked",r.FID_REGISTERED="fid-registered"})(Xs||(Xs={}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kt(r){const e=new Uint8Array(r);return btoa(String.fromCharCode(...e)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function p_(r){const e="=".repeat((4-r.length%4)%4),t=(r+e).replace(/\-/g,"+").replace(/_/g,"/"),n=atob(t),s=new Uint8Array(n.length);for(let i=0;i<n.length;++i)s[i]=n.charCodeAt(i);return s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $B="fcm_token_details_db",DP=5,$C="fcm_token_object_Store";async function IP(r){if("databases"in indexedDB&&!(await indexedDB.databases()).map(i=>i.name).includes($B))return null;let e=null;return(await _u($B,DP,{upgrade:async(n,s,i,o)=>{if(s<2||!n.objectStoreNames.contains($C))return;const a=o.objectStore($C),B=await a.index("fcmSenderId").get(r);if(await a.clear(),!!B){if(s===2){const c=B;if(!c.auth||!c.p256dh||!c.endpoint)return;e={token:c.fcmToken,createTime:c.createTime??Date.now(),subscriptionOptions:{auth:c.auth,p256dh:c.p256dh,endpoint:c.endpoint,swScope:c.swScope,vapidKey:typeof c.vapidKey=="string"?c.vapidKey:kt(c.vapidKey)}}}else if(s===3){const c=B;e={token:c.fcmToken,createTime:c.createTime,subscriptionOptions:{auth:kt(c.auth),p256dh:kt(c.p256dh),endpoint:c.endpoint,swScope:c.swScope,vapidKey:kt(c.vapidKey)}}}else if(s===4){const c=B;e={token:c.fcmToken,createTime:c.createTime,subscriptionOptions:{auth:kt(c.auth),p256dh:kt(c.p256dh),endpoint:c.endpoint,swScope:c.swScope,vapidKey:kt(c.vapidKey)}}}}}})).close(),await wa($B),await wa("fcm_vapid_details_db"),await wa("undefined"),yP(e)?e:null}function yP(r){if(!r||!r.subscriptionOptions)return!1;const{subscriptionOptions:e}=r;return typeof r.createTime=="number"&&r.createTime>0&&typeof r.token=="string"&&r.token.length>0&&typeof e.auth=="string"&&e.auth.length>0&&typeof e.p256dh=="string"&&e.p256dh.length>0&&typeof e.endpoint=="string"&&e.endpoint.length>0&&typeof e.swScope=="string"&&e.swScope.length>0&&typeof e.vapidKey=="string"&&e.vapidKey.length>0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wP={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","fid-registration-failed":"A problem occurred while creating an FCM registration via FID: {$errorInfo}","fid-unregister-failed":"A problem occurred while unregistering the FCM registration via FID: {$errorInfo}","fid-registration-idb-schema-unavailable":"Unable to read or persist FID registration metadata because the messaging IndexedDB schema is unavailable (for example, the database could not be upgraded to the latest version).","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used.","invalid-on-registered-handler":"No onRegistered callback handler was provided or registered. Implement onRegistered() before register()."},De=new ns("messaging","Messaging",wP);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WC="firebase-messaging-database",YC=2,ts="firebase-messaging-store",mn="firebase-messaging-fid-registration-store",TP={openDB:_u,deleteDB:wa};let XC=TP,eo=null;function AP(r,e,t){switch(e){case 0:if(r.createObjectStore(ts),t===1)break;case 1:t===2&&r.createObjectStore(mn)}}function ZC(r){return{upgrade:(e,t)=>{AP(e,t,r)},blocked:()=>{},blocking:(e,t,n)=>{var s;eo=null,(s=n.target)==null||s.close()},terminated:()=>{eo=null}}}function Xu(){return eo||(eo=XC.openDB(WC,YC,ZC(2)).catch(()=>XC.openDB(WC,YC-1,ZC(1)))),eo}function g_(r,e){return r.objectStoreNames.contains(e)}function m_(r){if(!g_(r,mn))throw De.create("fid-registration-idb-schema-unavailable")}async function RP(r){const e=Zu(r),n=await(await Xu()).transaction(ts).objectStore(ts).get(e);if(n)return n;{const s=await IP(r.appConfig.senderId);if(s)return await Eh(r,s),s}}async function Eh(r,e){const t=Zu(r),n=await Xu(),s=[ts],i=g_(n,mn);i&&s.push(mn);const o=n.transaction(s,"readwrite");return await o.objectStore(ts).put(e,t),i&&await o.objectStore(mn).delete(t),await o.done,e}async function E_(r){const e=Zu(r),t=await Xu();return m_(t),await t.transaction(mn).objectStore(mn).get(e)}async function vP(r,e){const t=Zu(r),n=await Xu();m_(n);const s=n.transaction([ts,mn],"readwrite");return await s.objectStore(mn).put(e,t),await s.objectStore(ts).delete(t),await s.done,e}function Zu({appConfig:r}){return r.appId}const ep="@firebase/messaging",Gc="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bP=3,SP=1e3;async function PP(r,e){const t=await tB(r),n=_h(e,r.appConfig.appName,!1),s={method:"POST",headers:t,body:JSON.stringify(n)};let i;try{i=await(await fetch(eB(r.appConfig),s)).json()}catch(o){throw De.create("token-subscribe-failed",{errorInfo:o==null?void 0:o.toString()})}if(i.error){const o=i.error.message;throw De.create("token-subscribe-failed",{errorInfo:o})}if(!i.token)throw De.create("token-subscribe-no-token");return i.token}async function NP(r,e){var B;const t=await tB(r),n=_h(e,r.appConfig.appName,!0),s={method:"POST",headers:t,body:JSON.stringify(n)};let i;try{i=await kP(()=>fetch(eB(r.appConfig),s),bP,SP)}catch(c){throw De.create("fid-registration-failed",{errorInfo:c==null?void 0:c.toString()})}if(i.ok)return{responseFid:await OP(i)};let o;try{o=await i.json()}catch{throw De.create("fid-registration-failed",{errorInfo:i.statusText})}const a=((B=o.error)==null?void 0:B.message)??i.statusText;throw De.create("fid-registration-failed",{errorInfo:a})}async function OP(r){const e=await r.text();if(!e.trim())throw De.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response body is empty"});let t;try{t=JSON.parse(e)}catch{throw De.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response body is not valid JSON"})}const n=t.name;if(typeof n!="string"||n.length===0)throw De.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response did not include a non-empty name"});return FP(n)}const tp="/registrations/";function FP(r){const e=r.indexOf(tp);if(e!==-1){const t=r.slice(e+tp.length);if(t.length>0)return t}throw De.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response name is not a valid registration resource name"})}async function xP(r,e){const t=await tB(r),n=_h(e.subscriptionOptions,r.appConfig.appName,!1),s={method:"PATCH",headers:t,body:JSON.stringify(n)};let i;try{i=await(await fetch(`${eB(r.appConfig)}/${e.token}`,s)).json()}catch(o){throw De.create("token-update-failed",{errorInfo:o==null?void 0:o.toString()})}if(i.error){const o=i.error.message;throw De.create("token-update-failed",{errorInfo:o})}if(!i.token)throw De.create("token-update-no-token");return i.token}async function LP(r,e){const n={method:"DELETE",headers:await tB(r)};try{const i=await(await fetch(`${eB(r.appConfig)}/${e}`,n)).json();if(i.error){const o=i.error.message;throw De.create("token-unsubscribe-failed",{errorInfo:o})}}catch(s){throw De.create("token-unsubscribe-failed",{errorInfo:s==null?void 0:s.toString()})}}async function kP(r,e,t){let n;for(let s=0;s<e;s++)try{return await r()}catch(i){if(n=i,s<e-1){const o=t*Math.pow(2,s);await new Promise(a=>setTimeout(a,o))}}throw n}function eB({projectId:r}){return`${gP}/projects/${r}/registrations`}async function tB({appConfig:r,installations:e}){const t=await e.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":r.apiKey,"x-goog-firebase-installations-auth":`FIS ${t}`})}function VP(r,e){var t,n;try{if(/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(r))return new URL(r).host}catch{}try{if(typeof self<"u"&&((t=self.location)!=null&&t.href))return new URL(r,self.location.origin).host}catch{}return typeof self<"u"&&((n=self.location)!=null&&n.host)?self.location.host:e}function _h({p256dh:r,auth:e,endpoint:t,vapidKey:n,swScope:s},i,o){const a={web:{origin:VP(s,i),endpoint:t,auth:e,p256dh:r}};return o&&(a.fcm_sdk_version=Gc),n!==d_&&(a.web.applicationPubKey=n),a}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MP=10080*60*1e3;async function GP(r){const e=await UP(r.swRegistration,r.vapidKey),t={vapidKey:r.vapidKey,swScope:r.swRegistration.scope,endpoint:e.endpoint,auth:kt(e.getKey("auth")),p256dh:kt(e.getKey("p256dh"))},n=await RP(r.firebaseDependencies);if(n){if(jP(n.subscriptionOptions,t))return Date.now()>=n.createTime+MP?HP(r,{token:n.token,createTime:Date.now(),subscriptionOptions:t}):n.token;try{await LP(r.firebaseDependencies,n.token)}catch(s){console.warn(s)}return np(r.firebaseDependencies,t)}else return np(r.firebaseDependencies,t)}async function HP(r,e){try{const t=await xP(r.firebaseDependencies,e),n={...e,token:t,createTime:Date.now()};return await Eh(r.firebaseDependencies,n),t}catch(t){throw t}}async function np(r,e){const n={token:await PP(r,e),createTime:Date.now(),subscriptionOptions:e};return await Eh(r,n),n.token}async function UP(r,e){const t=await r.pushManager.getSubscription();return t||r.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:p_(e)})}function jP(r,e){const t=e.vapidKey===r.vapidKey,n=e.endpoint===r.endpoint,s=e.auth===r.auth,i=e.p256dh===r.p256dh;return t&&n&&s&&i}function qP(r,e){const t=r.onRegisteredHandler;t&&(typeof t=="function"?t(e):t.next(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function KP(r){try{r.swRegistration=await navigator.serviceWorker.register(CP,{scope:pP}),r.swRegistration.update().catch(()=>{}),await JP(r.swRegistration)}catch(e){throw De.create("failed-service-worker-registration",{browserErrorMessage:e==null?void 0:e.message})}}async function JP(r){return new Promise((e,t)=>{const n=setTimeout(()=>t(new Error(`Service worker not registered after ${zC} ms`)),zC),s=r.installing||r.waiting;r.active?(clearTimeout(n),e()):s?s.onstatechange=i=>{var o;((o=i.target)==null?void 0:o.state)==="activated"&&(s.onstatechange=null,clearTimeout(n),e())}:(clearTimeout(n),t(new Error("No incoming service worker found.")))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function __(r,e){if(!e&&!r.swRegistration&&await KP(r),!(!e&&r.swRegistration)){if(!(e instanceof ServiceWorkerRegistration))throw De.create("invalid-sw-registration");r.swRegistration=e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function D_(r,e){e?r.vapidKey=e:r.vapidKey||(r.vapidKey=d_)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rp=3;async function zP(r,e){const t=await QP(r.swRegistration,r.vapidKey),n={vapidKey:r.vapidKey,swScope:r.swRegistration.scope,endpoint:t.endpoint,auth:kt(t.getKey("auth")),p256dh:kt(t.getKey("p256dh"))},s=r.firebaseDependencies.installations;for(let i=0;i<rp;i++){const{responseFid:o}=await NP(r.firebaseDependencies,n);if(o===e)return;i<rp-1&&await s.getToken(!0)}throw De.create("fid-registration-failed",{errorInfo:"CreateRegistration response FID does not match Firebase Installation ID"})}async function QP(r,e){const t=await r.pushManager.getSubscription();return t||r.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:p_(e)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $P=10080*60*1e3;async function I_(r,e){if(!navigator)throw De.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw De.create("permission-blocked");if(!r.onRegisteredHandler)throw De.create("invalid-on-registered-handler");await D_(r,e==null?void 0:e.vapidKey),await __(r,e==null?void 0:e.serviceWorkerRegistration);const t=r._registerNotifyChain.catch(()=>{});return r._registerNotifyChain=t.then(async()=>{const n=await r.firebaseDependencies.installations.getId(),s=await E_(r.firebaseDependencies),i=Date.now();if((!s||s.fid!==n||i>=s.lastRegisterTime+$P)&&(await zP(r,n),await vP(r.firebaseDependencies,{fid:n,lastRegisterTime:i,vapidKey:r.vapidKey})),!r.onRegisteredHandler)throw De.create("invalid-on-registered-handler");qP(r,n)}),r._registerNotifyChain}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WP(r,e){return BP(e,()=>{(async()=>!r.onRegisteredHandler||!await E_(r.firebaseDependencies)||await I_(r).catch(()=>{}))()})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sp(r){const e={from:r.from,collapseKey:r.collapse_key,messageId:r.fcmMessageId};return YP(e,r),XP(e,r),ZP(e,r),e}function YP(r,e){if(!e.notification)return;r.notification={};const t=e.notification.title;t&&(r.notification.title=t);const n=e.notification.body;n&&(r.notification.body=n);const s=e.notification.image;s&&(r.notification.image=s);const i=e.notification.icon;i&&(r.notification.icon=i)}function XP(r,e){e.data&&(r.data=e.data)}function ZP(r,e){var s,i,o,a;if(!e.fcmOptions&&!((s=e.notification)!=null&&s.click_action))return;r.fcmOptions={};const t=((i=e.fcmOptions)==null?void 0:i.link)??((o=e.notification)==null?void 0:o.click_action);t&&(r.fcmOptions.link=t);const n=(a=e.fcmOptions)==null?void 0:a.analytics_label;n&&(r.fcmOptions.analyticsLabel=n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function e0(r){return typeof r=="object"&&!!r&&C_ in r}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function t0(r){if(!r||!r.options)throw WB("App Configuration Object");if(!r.name)throw WB("App Name");const e=["projectId","apiKey","appId","messagingSenderId"],{options:t}=r;for(const n of e)if(!t[n])throw WB(n);return{appName:r.name,projectId:t.projectId,apiKey:t.apiKey,appId:t.appId,senderId:t.messagingSenderId}}function WB(r){return De.create("missing-app-config-values",{valueName:r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n0{constructor(e,t,n){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.onRegisteredHandler=null,this.onUnregisteredHandler=null,this._registerNotifyChain=Promise.resolve(),this._fidChangeUnsubscribe=null,this.logEvents=[],this.logQueue={state:"stopped"};const s=t0(e);this.firebaseDependencies={app:e,appConfig:s,installations:t,analyticsProvider:n}}_delete(){return this._fidChangeUnsubscribe&&(this._fidChangeUnsubscribe(),this._fidChangeUnsubscribe=null),this.logQueue.state==="scheduled"&&clearTimeout(this.logQueue.timerId),this.logQueue={state:"stopped"},Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function y_(r,e){if(!navigator)throw De.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw De.create("permission-blocked");return await D_(r,e==null?void 0:e.vapidKey),await __(r,e==null?void 0:e.serviceWorkerRegistration),GP(r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function r0(r,e,t){const n=s0(e);(await r.firebaseDependencies.analyticsProvider.get()).logEvent(n,{message_id:t[C_],message_name:t[mP],message_time:t[EP],message_device_time:Math.floor(Date.now()/1e3)})}function s0(r){switch(r){case Xs.NOTIFICATION_CLICKED:return"notification_open";case Xs.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function i0(r,e){const t=e.data;if(!t.isFirebaseMessaging)return;if(r.onMessageHandler&&t.messageType===Xs.PUSH_RECEIVED&&(typeof r.onMessageHandler=="function"?r.onMessageHandler(sp(t)):r.onMessageHandler.next(sp(t))),r.onRegisteredHandler&&t.messageType===Xs.FID_REGISTERED){const s=t.fid;typeof r.onRegisteredHandler=="function"?r.onRegisteredHandler(s):r.onRegisteredHandler.next(s)}const n=t.data;e0(n)&&n[_P]==="1"&&await r0(r,t.messageType,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const o0=r=>{const e=new n0(r.getProvider("app").getImmediate(),r.getProvider("installations-internal").getImmediate(),r.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",t=>i0(e,t)),e._fidChangeUnsubscribe=WP(e,r.getProvider("installations").getImmediate()),e},a0=r=>{const e=r.getProvider("messaging").getImmediate();return{getToken:n=>y_(e,n),register:n=>I_(e,n)}};function u0(){rn(new Mt("messaging",o0,"PUBLIC")),rn(new Mt("messaging-internal",a0,"PRIVATE")),Ot(ep,Gc),Ot(ep,Gc,"esm2020")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function B0(){try{await pp()}catch{return!1}return typeof window<"u"&&Hc()&&mD()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function c0(r,e){if(!navigator)throw De.create("only-available-in-window");return r.onMessageHandler=e,()=>{r.onMessageHandler=null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function H0(r=Kc()){return B0().then(e=>{if(!e)throw De.create("unsupported-browser")},e=>{throw De.create("indexed-db-unsupported")}),rs(ve(r),"messaging").getImmediate()}async function U0(r,e){return r=ve(r),y_(r,e)}function j0(r,e){return r=ve(r),c0(r,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */u0();export{H0 as A,U0 as B,j0 as C,M0 as D,ti as E,k0 as F,G0 as G,Kc as a,_0 as b,N0 as c,A0 as d,R0 as e,VA as f,h0 as g,O0 as h,II as i,p0 as j,y0 as k,F0 as l,L0 as m,x0 as n,m0 as o,P0 as p,v0 as q,d0 as r,E0 as s,V0 as t,g0 as u,C0 as v,b0 as w,S0 as x,f0 as y,B0 as z};
