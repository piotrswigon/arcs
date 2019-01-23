/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
'use strict';

import {AbstractDevtoolsChannel} from '../runtime/debug/abstract-devtools-channel.js';
import {DevtoolsBroker} from '../../devtools/shared/devtools-broker.js';

export class DevtoolsChannel extends AbstractDevtoolsChannel {

  // offerSignal(label, signal) {
  //     // https://us-central1-arcs-debugging-switch-demo.cloudfunctions.net/offer
  //     fetch(`http://localhost:8010/arcs-debugging-switch-demo/us-central1/offer`, {
  //       method: 'POST',
  //       headers: {
  //         'content-type': 'application/json; charset=UTF-8'
  //       },
  //       body: JSON.stringify({label, signal})

  //     }).then(response => {
  //       if (response.status !== 200) {
  //         console.log('Looks like there was a problem. Status Code: ' +
  //           response.status);
  //         return;
  //       }
    
  //       // Examine the text in the response
  //       response.json().then(function(data) {
  //         console.log('RESPONSE FROM FUNCTION: ', data);
  //       });
  //     }).catch(function(err) {
  //       console.log('Fetch Error :-S', err);
  //     });    
  // }

  constructor() {
    super();

    const remoteLabel = new URLSearchParams(window.location.search).get('remote-explore');
    this.remoteInspect = !!remoteLabel;

    if (!this.remoteInspect) {
      document.addEventListener('arcs-debug-in', e => this._handleMessage(e.detail));
    } else {

      const notification = document.createElement('div');
      notification.innerText = 'Connecting to Remote Explorer...';
      notification.style.cssText = 'background-color: darkorange; color: white; text-align: center; position: fixed; left: 0; top: 0; right: 0; box-shadow: 0 1px 5px rgba(0,0,0,.5); z-index: 1;';

      const body = document.querySelector('body');
      body.style.paddingTop = '20px';
      body.appendChild(notification);

      const p = new SimplePeer({initiator: true, trickle: false, objectMode: true});

      p.on('signal', (data) => {
        const key = btoa(JSON.stringify(data));
        console.log('SIGNAL', data, key);
        // this.offerSignal(remoteLabel, key);

        const hub = signalhub('arcs-demo', 'https://arcs-debug-switch.herokuapp.com/');//'https://signalhub-jccqtwhdwc.now.sh'); //'http://localhost:8999');//

        hub.subscribe(`${remoteLabel}:answer`).on('data', (message) => {
          console.log('new message received:', message);
          p.signal(JSON.parse(atob(message)));
          hub.close();
        });

        console.log(`broadcasting on ${remoteLabel}:offer`);
        hub.broadcast(`${remoteLabel}:offer`, key);
      });

      p.on('error', (err) => { console.log('error', err); });

      p.on('connect', () => {
        console.log('CONNECT');
      });
      
      p.on('data', (msg) => {
        if (msg === 'init') {
          this.p = p;
          notification.innerText = '..:: Remote Explorer Connected ::..';
          notification.style.background = 'red';
          DevtoolsBroker.markConnected();
        } else {
          this._handleMessage(JSON.parse(msg));
        }
      });

      // const peer = new Peer();
      // const conn = peer.connect(peerName, {reliable: true});
      // conn.on('open', () => {
      //   console.log('Connection opened!');
      //   this.conn = conn;
      //   conn.on('data', msg => {
      //     if (msg === 'init') { // is 'init' needed?
      //       DevtoolsBroker.markConnected();
      //     } else {
      //       this._handleMessage(JSON.parse(msg));
      //     }
      //   });
      // });

      // conn.on('error', x => console.log(x));
    }
  }

  _flush(messages) {
    if (this.remoteInspect) {
      if (this.p) {
        this.p.send(JSON.stringify(messages));
      } else {
        debugger;
        throw new Error(); // maybe?
      }
    } else {
      document.dispatchEvent(new CustomEvent('arcs-debug-out', {detail: messages}));
    }
  }
}
