/// BareSpecifier=@vaadin/vaadin-material-styles/mixins/required-field
import '../color.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="material-required-field">
  <template>
    <style>
      [part="label"] {
        display: block;
        position: absolute;
        top: 8px;
        font-size: 1em;
        line-height: 1;
        height: 20px;
        margin-bottom: -4px;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
        color: var(--material-secondary-text-color);
        transform-origin: 0 75%;
        transform: scale(0.75);
      }

      :host([required]) [part="label"]::after {
        content: " *";
        color: inherit;
      }

      :host([invalid]) [part="label"] {
        color: var(--material-error-text-color);
      }

      [part="error-message"] {
        font-size: .75em;
        line-height: 1;
        color: var(--material-error-text-color);
        margin-top: 6px;
      }

      :host(:not([invalid])) [part="error-message"] {
        margin-top: 0;
        max-height: 0;
        overflow: hidden;
      }

      :host([invalid]) [part="error-message"] {
        animation: reveal 0.2s;
      }

      @keyframes reveal {
        0% {
          opacity: 0;
        }
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);