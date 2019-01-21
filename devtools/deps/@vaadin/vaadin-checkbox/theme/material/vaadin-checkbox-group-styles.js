/// BareSpecifier=@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox-group-styles
import '../../../vaadin-material-styles/mixins/required-field.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="material-checkbox-group" theme-for="vaadin-checkbox-group">
  <template>
    <style include="material-required-field">
      :host {
        display: inline-flex;
        position: relative;
        padding-top: 8px;
        margin-bottom: 8px;
        outline: none;
        color: var(--material-body-text-color);
        font-size: var(--material-body-font-size);
        line-height: 24px;
        font-family: var(--material-font-family);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      :host::before {
        line-height: 32px;
      }

      :host([has-label]) {
        padding-top: 24px;
      }

      [part="label"]:empty {
        display: none;
      }

      [part="label"]:empty::before {
        content: " ";
        position: absolute;
      }

      :host([theme~="vertical"]) {
        display: flex;
        flex-direction: column;
      }

      :host([disabled]) [part="label"] {
        color: var(--material-disabled-text-color);
        -webkit-text-fill-color: var(--material-disabled-text-color);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);