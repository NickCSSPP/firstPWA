import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';
import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {
  @property() message = '2048 game remake by Nick Surgent';
  @property({ type: Array }) board: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));
  private touchStartX: number | null = null;
  private touchStartY: number | null = null;

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

        #welcomeCard {
          padding: 18px;
          padding-top: 0px;
        }

        #gameContainer {
          display: grid;
          grid-template-columns: repeat(4, 80px);
          grid-template-rows: repeat(4, 80px);
          gap: 16px;
          padding: 16px;
          max-width: 370px;
          margin: auto;
          background-color: #333;
          border-radius: 8px;
        }

        .tile {
          width: 80px;
          height: 80px;
          background-color: #555;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          border-radius: 8px;
        }

        .slide-in {
          transform: translate(0, 0);
        }


        @media (min-width: 750px) {
          sl-card {
            width: 70vw;
          }
        }
      `,
    ];
  }

  constructor() {
    super();
    this.initializeBoard();
    this.addKeyboardListeners();
  }

  resetGame() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.initializeBoard();
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addSwipeListeners();
    this.requestUpdate();
  }

  addSwipeListeners() {
    const handleTouchStart = (event: TouchEvent) => {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!this.touchStartX || !this.touchStartY) return;

      const touchEndX = event.touches[0].clientX;
      const touchEndY = event.touches[0].clientY;

      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          this.moveTiles('right');
        } else {
          this.moveTiles('left');
        }
      } else {
        if (deltaY > 0) {
          this.moveTiles('down');
        } else {
          this.moveTiles('up');
        }
      }

      this.touchStartX = null;
      this.touchStartY = null;
    };

    this.addEventListener('touchstart', handleTouchStart);
    this.addEventListener('touchmove', handleTouchMove);
  }

  initializeBoard() {
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  renderTile(value: number, row: number, col: number) {
    return html`<div class="tile" style="${this.getTileStyle(row, col)}">${value !== 0 ? value : ''}</div>`;
  }

  getTileStyle(row: number, col: number) {
    const rowIndex = this.board.length - 1 - row;
    const colIndex = col;
    const transform = `translate(${colIndex * 100}%, ${rowIndex * 100}%)`;
    return `${transform};`;
  }

  addKeyboardListeners() {
    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowUp':
          this.moveTiles('up');
          break;
        case 'ArrowDown':
          this.moveTiles('down');
          break;
        case 'ArrowLeft':
          this.moveTiles('left');
          break;
        case 'ArrowRight':
          this.moveTiles('right');
          break;
      }
    });
  }

  moveRowOrColumn(rowOrColumn: number[], direction: 'up' | 'down' | 'left' | 'right') {
    const nonZeroValues: number[] = rowOrColumn.filter(value => value !== 0);
    const resultRowOrColumn: number[] = [];

    for (let i = 0; i < nonZeroValues.length; i++) {
      if (i < nonZeroValues.length - 1 && nonZeroValues[i] === nonZeroValues[i + 1]) {
        resultRowOrColumn.push(nonZeroValues[i] * 2);
        i++;
      } else {
        resultRowOrColumn.push(nonZeroValues[i]);
      }
    }
    const zerosCount = rowOrColumn.length - resultRowOrColumn.length;
    const zerosArray = Array(zerosCount).fill(0);
    if (direction === 'up' || direction === 'left') {
      return resultRowOrColumn.concat(zerosArray);
    } else {
      return direction === 'right' ? zerosArray.concat(resultRowOrColumn.reverse()) : zerosArray.concat(resultRowOrColumn);
    }
  }

  moveTiles(direction: 'up' | 'down' | 'left' | 'right') {
    const updateBoard = () => {
      this.requestUpdate();
      this.addRandomTile();
      setTimeout(() => this.requestUpdate(), 200);
    };

    const newBoard = this.board.map(row => [...row]);
    let moved = false;

    for (let i = 0; i < this.board.length; i++) {
      const rowOrColumn = direction === 'up' || direction === 'down'
        ? this.board.map(row => row[i])
        : direction === 'left'
          ? this.board[i]
          : this.board[i].slice().reverse();

      const movedRowOrColumn = this.moveRowOrColumn(rowOrColumn, direction);
      const finalRowOrColumn = direction === 'right' ? movedRowOrColumn.reverse() : movedRowOrColumn;

      if (!rowOrColumn.every((value, index) => value === finalRowOrColumn[index])) {
        if (direction === 'up' || direction === 'down') {
          newBoard.forEach((row, rowIndex) => row[i] = finalRowOrColumn[rowIndex]);
        } else {
          newBoard[i] = direction === 'left' ? finalRowOrColumn : finalRowOrColumn.reverse();
        }
        moved = true;
      }
    }
    if (moved) {
      this.board = newBoard;
      setTimeout(updateBoard, 0);
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
            <sl-button href="${resolveRouterPath('about')}" variant="primary">Contact me</sl-button>
            <p>
              Combine identical tiles to reach 2048 and win the game. Use the arrow keys to move the tiles.
            </p>
            <button @click="${this.resetGame}">Reset Game</button>
          </sl-card>
        </div>
        <div id="gameContainer">
          ${this.board
            .flat()
            .map((value, index) => this.renderTile(value, Math.floor(index / 4), index % 4))}
        </div>
      </main>
    `;
  }
}
