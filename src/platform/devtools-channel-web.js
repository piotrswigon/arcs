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

  constructor() {
    super();

    this.remoteExplore = new URLSearchParams(window.location.search).has('remote-explore');

    if (!this.remoteExplore) {
      document.addEventListener('arcs-debug-in', e => this._handleMessage(e.detail));
    } else {
      console.log(`Connecting to Remote Arcs Explorer`);

      const p = new SimplePeer({initiator: true, trickle: false, objectMode: true});

      p.on('signal', (data) => {
        const key = btoa(JSON.stringify(data));
        console.log('SIGNAL', data, key);
        document.querySelector('body').innerHTML = `
          <a href="https://piotrswigon.github.io/arcs/devtools/?remote-key=${key}" target="_blank">Remote Explorer</a>
          <form>
            <textarea id="incoming" placeholder="Signal..."></textarea>
            <button type="submit">submit</button>
          </form>
        `;
        document.querySelector('form').addEventListener('submit', e => {
          e.preventDefault();
          p.signal(JSON.parse(atob(document.querySelector('#incoming').value)));
        });
      });

      p.on('error', (err) => { console.log('error', err); });

      p.on('connect', () => {
        console.log('CONNECT');
      });
      
      p.on('data', (msg) => {
        console.log('received!', msg);
        if (msg === 'init') {
          this.p = p;
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
    if (this.remoteExplore) {
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
