/// BareSpecifier=@vaadin/vaadin-text-field/theme/material/vaadin-text-area-styles
import './vaadin-text-field-styles.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';

const $_documentContainer = html`<dom-module id="material-text-area" theme-for="vaadin-text-area">
  <template>
    <style include="material-text-field">
      [part="input-field"] {
        height: auto;
        box-sizing: border-box;
      }

      /* NOTE(platosha): double attribute workarounds specifity for Firefox */
      [part="value"][part="value"] {
        padding-top: 0;
        margin-top: 4px;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);