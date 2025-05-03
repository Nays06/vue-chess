<!-- src/views/GameView.vue -->
<template>
  <div class="game-container">
    <div class="game-info">
      <h1>Шахматы на Vue.js</h1>
      <div class="status">
        <template v-if="gameOver">
          <div class="game-over">
            Игра окончена! Победил: <span :class="winner">{{ winner }}</span>
          </div>
        </template>
        <template v-else>
          <div class="current-player">
            Ход: <span :class="currentPlayer">{{ currentPlayer === 'white' ? 'Белый' : 'Черный' }}</span>
          </div>
        </template>
      </div>
      <div class="controls">
        <button @click="resetGame">Новая игра</button>
      </div>
    </div>

    <div class="game-board-container">
      <div class="coordinate row-labels">
        <div v-for="row in 8" :key="`row-${row}`" class="coordinate-label">{{ 9 - row }}</div>
      </div>
      <div class="board-wrapper">
        <div class="chess-board" :style="boardStyle">
          <div v-for="(row, rowIndex) in board" :key="`row-${rowIndex}`" class="board-row">
            <div v-for="(piece, colIndex) in row" :key="`cell-${rowIndex}-${colIndex}`" class="board-cell" :class="{
              'light-square': isLightSquare(rowIndex, colIndex),
              'dark-square': !isLightSquare(rowIndex, colIndex),
              'selected': isSelected(rowIndex, colIndex),
              'available-move': isAvailableMove(rowIndex, colIndex),
              'can-be-eated': isCanEat(rowIndex, colIndex)
            }" @click="handleCellClick(rowIndex, colIndex)">
              <ChessPiece v-if="piece" :piece="piece" :style="pieceStyle" :piece-style="settings.pieceStyle" />
            </div>
          </div>
        </div>
        <div class="coordinate col-labels">
          <div v-for="col in 8" :key="`col-${col}`" class="coordinate-label">
            {{ String.fromCharCode(96 + col) }}
          </div>
        </div>
      </div>
    </div>

    <div class="move-history">
      <h3>История ходов:</h3>
      <div class="history-container">
        <div v-if="moveHistory.length === 0" class="no-moves">
          Пока не сделано ни одного хода
        </div>
        <div v-else class="history-entries">
          <div v-for="(move, index) in moveHistory" :key="`history-${index}`" class="history-entry">
            <span class="move-number">{{ index + 1 }}</span>
            <span :class="move.piece.color">
              {{ getPieceSymbol(move.piece) }} {{ getNotation(move.from) }} → {{ getNotation(move.to) }}
              {{ move.captured ? `x ${getPieceSymbol(move.captured)}` : '' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useChessStore } from '@/stores/chess';
import ChessPiece from '@/components/ChessPiece.vue';

const chessStore = useChessStore();

const board = computed(() => chessStore.board);
const currentPlayer = computed(() => chessStore.currentPlayer);
const selectedPiece = computed(() => chessStore.selectedPiece);
const availableMoves = computed(() => chessStore.availableMoves);
const moveHistory = computed(() => chessStore.moveHistory);
const gameOver = computed(() => chessStore.gameOver);
const winner = computed(() => chessStore.winner);
const settings = computed(() => chessStore.settings);

const boardStyle = computed(() => {
  return {
    '--light-square-color': settings.value.lightSquareColor,
    '--dark-square-color': settings.value.darkSquareColor
  };
});

const pieceStyle = computed(() => ({
  transition: 'transform 0.3s ease'
}));


function isLightSquare(row, col) {
  return (row + col) % 2 === 0;
}


function isSelected(row, col) {
  if (!selectedPiece.value) return false;
  const [selectedRow, selectedCol] = selectedPiece.value.position;
  return row === selectedRow && col === selectedCol;
}

function isAvailableMove(row, col) {
  if (!selectedPiece.value) return false;

  return availableMoves.value.some(([r, c]) =>
    r === row &&
    c === col &&
    !board.value[row][col]
  );
}


function isCanEat(row, col) {
  if (!selectedPiece.value) return false;

  const piece = board.value[row][col];
  if (!piece) return false;

  const [selectedRow, selectedCol] = selectedPiece.value.position;
  const selectedPieceColor = board.value[selectedRow][selectedCol].color;


  return (
    availableMoves.value.some(([r, c]) => r === row && c === col) &&
    piece.color !== selectedPieceColor
  );
}



function handleCellClick(row, col) {
  if (gameOver.value) return;


  if (selectedPiece.value && (isAvailableMove(row, col) || isCanEat(row, col))) {
    chessStore.movePiece([row, col]);
    return;
  }


  chessStore.selectPiece([row, col]);
}


function getNotation([row, col]) {
  const file = String.fromCharCode(97 + col);
  const rank = 8 - row;
  return `${file}${rank}`;
}


function getPieceSymbol(piece) {
  const symbols = {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  };
  return symbols[piece.type] || '';
}


function resetGame() {
  chessStore.resetGame();
}
</script>

<style scoped>
.game-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 1024px) {
  .game-container {
    grid-template-columns: 300px 1fr 300px;
  }
}

.game-info {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.status {
  margin-bottom: 20px;
  font-size: 18px;
}

.white {
  color: #2c3e50;
  font-weight: bold;
}

.black {
  color: #16a085;
  font-weight: bold;
}

.game-over {
  color: #e74c3c;
  font-weight: bold;
  font-size: 20px;
}

.controls {
  display: flex;
  gap: 10px;
}

.game-board-container {
  position: relative;
  display: flex;
  justify-content: center;
}

.board-wrapper {
  display: flex;
  flex-direction: column;
}

.chess-board {
  display: flex;
  flex-direction: column;
  border: 2px solid #2c3e50;
  width: min(80vw, 600px);
  height: min(80vw, 600px);
}

.board-row {
  display: flex;
  flex: 1;
}

.board-cell {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.light-square {
  background-color: var(--light-square-color, #f0d9b5);
}

.dark-square {
  background-color: var(--dark-square-color, #b58863);
}

.selected {
  box-shadow: inset 0 0 0 4px rgba(255, 215, 0, 0.7);
}

.available-move {
  position: relative;
  cursor: pointer;
}

.available-move::after {
  content: '';
  position: absolute;
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background-color: rgba(0, 128, 0, 0.4);
  z-index: 1;
}

.can-be-eated {
  cursor: pointer;
  box-shadow: inset 0 0 0 4px rgba(255, 0, 0, 0.7);
}

.coordinate {
  display: flex;
  font-weight: bold;
  color: #2c3e50;
}

.row-labels {
  flex-direction: column;
  margin-right: 5px;
  margin-top: 20px;
}

.col-labels {
  flex-direction: row;
  justify-content: space-around;
  margin-top: 5px;
}

.coordinate-label {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.move-history {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 600px;
  overflow-y: auto;
}

.history-container {
  margin-top: 10px;
}

.no-moves {
  color: #7f8c8d;
  font-style: italic;
}

.history-entries {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.history-entry {
  padding: 5px;
  border-bottom: 1px solid #f0f0f0;
}

.move-number {
  margin-right: 10px;
  font-weight: bold;
  color: #7f8c8d;
}

.move-tips {
  position: absolute;
  top: 10px;
  right: -250px;
  width: 200px;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1200px) {
  .move-tips {
    position: static;
    width: 100%;
    margin-top: 20px;
  }
}
</style>