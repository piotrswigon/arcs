import {Xen} from '../lib/xen.js';
import {DevtoolsConnection} from '../lib/arcs.js';

const params = (new URL(document.location)).searchParams;
const logLevel = params.get('logLevel') || (params.has('log') ? 2 : Xen.Debug.level);

window.debugLevel = Xen.Debug.level = logLevel;


const body = document.getElementsByTagName('body')[0];

function startUp() {
  body.appendChild(document.createElement('web-shell'));
  // configure root path
  Object.assign(document.querySelector('web-shell'), {
    root: '../..' // path to arcs/
  });  
}

if (params.has('remote-devtools')) {
  body.innerHTML = `<pre>Waiting for Remote Arcs Explorer with peer-id "${params.get('remote-devtools')}"...</pre>`;
  DevtoolsConnection.ensure();
  DevtoolsConnection.onceConnected.then(() => {
    body.innerHTML = '';
    startUp();
  });
} else {
  startUp();
}
