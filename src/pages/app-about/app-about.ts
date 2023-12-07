import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

// You can also import styles from another file
// if you prefer to keep your CSS seperate from your component
import { styles } from './about-styles';

import { styles as sharedStyles } from '../../styles/shared-styles'

import '@shoelace-style/shoelace/dist/components/card/card.js';

@customElement('app-about')
export class AppAbout extends LitElement {
  static styles = [
    sharedStyles,
    styles
  ]

  constructor() {
    super();
  }

  render() {
    return html`
      <app-header ?enableBack="${true}"></app-header>

      <main>
        <h2>Nick Surgent</h2>

        <sl-card>
          <h2>Contact Information</h2>
          <ul>
            <li>Email: nssurge@pointpark.edu</li>
          </ul>
          <p> Email me if you run into any issues with the app or if you have any questions. </p>
        </sl-card>
  </main>
    `;
  }
}
