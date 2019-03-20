import {PolymerElement} from '../../deps/@polymer/polymer/polymer-element.js';
import {html} from '../../deps/@polymer/polymer/lib/utils/html-tag.js';

export class ModalWindow extends PolymerElement {
  static get template() {
    return html`
    <style include="shared-styles">
      :host {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, .3);
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      :host(:not([opened])) {
        display: none;
      }
      [window] {
        background: white;
        min-width: 50vw;
        max-width: 90vw;
        max-height: 90vh;
        min-height: 30vh;
        box-shadow: var(--drop-shadow);
        position: relative;
      }
      [close-button] {
        color: var(--dark-gray);
        cursor: pointer;
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        border-radius: 8px;
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 20;
        padding: 1px 0 0 1px;
      }
      [close-button]:hover {
        background-color: var(--mid-gray);
        color: white;
      }
    </style>
    <div window>
      <div close-button on-click="close">✕</div>
      <slot></slot>
    </div>
    `;
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  constructor() {
    super();
    this.addEventListener('click', e => {
      if (e.path[0] === this) this.close();
    });
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }

  static get is() { return 'modal-window'; }
}

window.customElements.define(ModalWindow.is, ModalWindow);
