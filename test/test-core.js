import haunted, { useState } from '../core.js';
import { attach, cycle } from './helpers.js';

// This is just to get the lit-html export for testing.
import { html, render } from '../haunted.js';

describe('haunted/core', () => {
  describe('Building', () => {
    it('Can be used to build haunteds', async () => {
      const tag = 'custom-haunted-test';

      const { component } = haunted({
        render(what, where) {
          render(what, where);
        }
      });

      function App() {
        let [name] = useState('Matthew');
        return html`<span>Test-${name}</span>`;
      }

      customElements.define(tag, component(App));
  
      let teardown = attach(tag);
      await cycle();
  
      let span = host.firstChild.shadowRoot.firstElementChild;
      assert.equal(span.textContent, 'Test-Matthew', 'Rendered');
      teardown();
    });
  })

  describe('Components', () => {
    it('has Element prototype setters that are working as expected', async () => {
      const tag = 'component-scrolltop-test';

      const { component } = haunted({
        render(what, where) {
          render(what, where);
        }
      });

      function App() {
        function onClick() {
          this.scrollTop = 400;
        }
        return html`
          <style>
            :host {
              height:500px;
              overflow: scroll;
            }
            .long {
                width: 30px;
                height: 1000px; 
                background: blue;            
            }
          </style>         
          <div class="long"></div>
        `;
      }

      customElements.define(tag, component(App));

      let teardown = attach(tag);
      await cycle();

      host.firstChild.scrollTop = 400;
      assert.equal(host.firstChild.scrollTop, 400, 'Setter worked as expected.');
      teardown();
    });
  })
});
