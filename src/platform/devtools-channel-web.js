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

    const peerName = new URLSearchParams(window.location.search).get('remote-devtools');
    this.remoteDebugging = !!peerName;

    if (!this.remoteDebugging) {
      document.addEventListener('arcs-debug-in', e => this._handleMessage(e.detail));
    } else {
      console.log(`Connecting to Remote Arcs Explorer '${peerName}'`);
      const peer = new Peer();
      const conn = peer.connect(peerName, {reliable: true});
      conn.on('open', () => {
        console.log('Connection opened!');
        this.conn = conn;
        conn.on('data', msg => {
          if (msg === 'init') { // is 'init' needed?
            DevtoolsBroker.markConnected();
          } else {
            this._handleMessage(JSON.parse(msg));
          }
        });
      });

      conn.on('error', x => console.log(x));
    }
  }

  _flush(messages) {
    if (this.remoteDebugging) {
      if (this.conn) {
        this.conn.send(JSON.stringify(messages));
      } else {
        throw new Error(); // maybe?
      }
    } else {
      document.dispatchEvent(new CustomEvent('arcs-debug-out', {detail: messages}));
    }
  }
}
