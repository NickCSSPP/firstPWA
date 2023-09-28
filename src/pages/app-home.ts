import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {

  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() message = 'Welcome!';

  static get styles() {
    return [
      styles,
      css`
      #welcomeBar {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      #welcomeCard,
      #infoCard {
        padding: 18px;
        padding-top: 0px;
      }

      sl-card::part(footer) {
        display: flex;
        justify-content: flex-end;
      }

      @media(min-width: 750px) {
        sl-card {
          width: 70vw;
        }
      }


      @media (horizontal-viewport-segments: 2) {
        #welcomeBar {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }

        #welcomeCard {
          margin-right: 64px;
        }
      }
    `];
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
    console.log('This is your home page');
  }

  share() {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: 'PWABuilder pwa-starter',
        text: 'Check out the PWABuilder pwa-starter!',
        url: 'https://github.com/pwa-builder/pwa-starter',
      });
    }
  }

  render() {
    return html`
      <app-header></app-header>

      <main>
        <div id="welcomeBar">
          <sl-card id="welcomeCard">
            <div slot="header">
              <h2>${this.message}</h2>
            </div>

            <p>
              Hello, I'm Nick Surgent and this is my PWA Starter. This starter is built with
              PWABuilder's pwa-starter, if you are interested in trying it out, here is the
              <a href="https://docs.pwabuilder.com/#/starter/quick-start"> link</a>.
            </p>

            <p id="mainInfo">
              If you are interested in making your own PWA and
              testing it out, check out their website at
              <a href="https://pwabuilder.com">PWABuilder</a>.
            </p>

            ${'share' in navigator
              ? html`<sl-button slot="footer" variant="primary" @click="${this.share}">Share this Starter!</sl-button>`
              : null}
          </sl-card>

          <sl-card id="infoCard">
            <h2>About Me</h2>

            <p>
            I am a Senior at Point Park University studying Applied Computer Science with
            a focus in software design and development.  I have experience with Javascript,
            PHP, SQL, HTML, and CSS.
            </p>

            <p>
            I have previously worked on projects in web development and game development.
            Currently I am working on learning more about mobile development and my current
            project is creating this PWA.
            </p>

          </sl-card>

          <sl-button href="${resolveRouterPath('about')}" variant="primary">Contact Information</sl-button>
        </div>
      </main>
    `;
  }
}
