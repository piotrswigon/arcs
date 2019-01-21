/// BareSpecifier=@vaadin/vaadin-text-field/theme/lumo/vaadin-password-field-styles
import '../../../vaadin-lumo-styles/font-icons.js';
import '../../../vaadin-lumo-styles/sizing.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';

const $_documentContainer = html`<dom-module id="lumo-password-field" theme-for="vaadin-password-field">
  <template>
    <style>
      [part="reveal-button"]::before {
        content: var(--lumo-icons-eye);
      }

      :host([password-visible]) [part="reveal-button"]::before {
        content: var(--lumo-icons-eye-disabled);
      }

      /* Make it easy to hide the button across the whole app */
      [part="reveal-button"] {
        display: var(--lumo-password-field-reveal-button-display, block);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);