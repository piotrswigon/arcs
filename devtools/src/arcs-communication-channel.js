import {PolymerElement} from '../deps/@polymer/polymer/polymer-element.js';
import {html} from '../deps/@polymer/polymer/lib/utils/html-tag.js';
import './common/modal-window.js';
import './arcs-shared.js';

class ArcsCommunicationChannel extends PolymerElement {
  static get template() {
    return html`
    <style include="shared-styles">
      [panel] {
        padding: 24px;
      }
      h1 {
        font-family: 'Google Sans', Helvetica;
        margin-block-start: 0;
      }
      [group] {
        margin-top: 16px;
        display: flex;
      }
      input[type="radio"] {
        margin-right: 6px;
      }
      label {
        line-height: 20px;
      }
      aside {
        color: var(--dark-gray);
        margin-top: 4px;
      }
    </style>
    <modal-window id="modal">
      <div panel>
        <!-- Disable extension mode when not in the extension -->
        <h1>Connection Details</h1>
        <aside>How do you want to connect to Arcs?</aside>
        <div group>
          <input type="radio" id="extension" name="mode" value="extension">
          <div>
            <label for="extension">Chrome Extension</label>
            <aside>Local Web-Shell.</aside>
          </div>
        </div>
        <div group>
          <input type="radio" id="websocket" name="mode" value="websocket">
          <div>
            <label for="websocket">WebSocket</label>
            <aside>Planner-Shell, Tests.</aside>
            <input placeholder="localhost:8787" value="{{websocketAddress::input}}">
          </div>
        </div>
        <div group>
          <input type="radio" id="webrtc" name="mode" value="webrtc">
          <div>
            <label for="webrtc">WebRTC</label>
            <aside>Remote Web-Shell, Arcs on Android.</aside>
          </div>
        </div>
      </div>
    </modal-window>
    `;
  }

  static get is() { return 'arcs-communication-channel'; }

  ready() {
    super.ready();
    document.addEventListener('send-message', ({detail}) => {
      if (this._preInitMsgQueue) {
        this._preInitMsgQueue.push(detail);
      } else {
        this._fire(detail);
      }
    });
    // We perform below after the event loop tick to let other polymer elements
    // to go through ready() handlers before we let the events in.
    setTimeout(() => {
      if (window._msgRaceConditionGuard) {
        // devtools.js loaded first (most likely in standalone mode),
        // we'll let it know we're ready to receive.
        document.dispatchEvent(new Event('arcs-communication-channel-ready'));
      } else {
        // We loaded first (most likely in extension mode),
        // let's wait for devtools.js.
        window._msgRaceConditionGuard = 'devtools-webapp-loaded';
        this._preInitMsgQueue = [];
        document.addEventListener('arcs-communication-channel-ready', e => {
          for (const msg of this._preInitMsgQueue) {
            this._fire(msg);
          }
          this._preInitMsgQueue = undefined;
        });
      }
    }, 0);
  }

  open() {
    this.$.modal.open();
  }

  _fire(msg) {
    document.dispatchEvent(new CustomEvent('command', {detail: msg}));
  }
}

window.customElements.define(ArcsCommunicationChannel.is, ArcsCommunicationChannel);
