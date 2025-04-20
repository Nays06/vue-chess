// src/stores/chess.js
import { defineStore } from "pinia";

export const useChessStore = defineStore("chess", {
  state: () => ({
    board: initializeBoard(),
    currentPlayer: "white",
    selectedPiece: null,
    moveHistory: [],
    availableMoves: [],
    gameOver: false,
    winner: null,
    settings: {
      lightSquareColor: "#f0d9b5",
      darkSquareColor: "#b58863",
      pieceStyle: "adventurer",
    },
    pieceStyles: [
        'adventurer',
        'alpha',
        'berlin',
        'cardinal',
        'cheq',
        'chess_samara',
        'chess7',
        'chess24',
        'chesscom',
        'chessnut',
        'companion',
        'condal',
        'dash',
        'dilena',
        'dubrovny',
        'fantasy',
        'fresca',
        'glass',
        'graffiti',
        'graffiti_light',
        'kingdom',
        'kosal',
        'leipzig',
        'letter',
        'lucena',
        'maestro',
        'magnetic',
        'marble',
        'maya',
        'mediaeval',
        'merida',
        'metro',
        'pirouetti',
        'pixel',
        'reilly',
        'riohacha',
        'spatial',
        'staunty',
        'symbol',
        'symmetric',
        'tatiana',
        'tournament',
        'tournament_metal',
        'uscf',
        'wikipedia',
    ],
  }),

  actions: {
    selectPiece(position) {
      const [row, col] = position;
      const piece = this.board[row][col];

      if (!piece || piece.color !== this.currentPlayer || this.gameOver) {
        return false;
      }

      this.selectedPiece = { position, piece };
      this.availableMoves = this.calculateAvailableMoves(position, piece);
      return true;
    },

    movePiece(toPosition) {
      if (!this.selectedPiece) return false;

      const [fromRow, fromCol] = this.selectedPiece.position;
      const [toRow, toCol] = toPosition;

      // Проверяем, входит ли целевая позиция в возможные ходы
      const isMoveAvailable = this.availableMoves.some(
        ([row, col]) => row === toRow && col === toCol
      );

      if (!isMoveAvailable) return false;

      const movingPiece = this.selectedPiece.piece;
      const capturedPiece = this.board[toRow][toCol];

      // Специальные правила для пешек
      if (movingPiece.type === "pawn") {
        // Проверка на превращение пешки
        if (
          (movingPiece.color === "white" && toRow === 0) ||
          (movingPiece.color === "black" && toRow === 7)
        ) {
          movingPiece.type = "queen";
        }
      }

      // Запись хода в историю
      this.moveHistory.push({
        piece: movingPiece,
        from: [fromRow, fromCol],
        to: [toRow, toCol],
        captured: capturedPiece,
        timestamp: new Date(),
      });

      // Выполнение хода
      this.board[toRow][toCol] = movingPiece;
      this.board[fromRow][fromCol] = null;

      // Переключение игрока
      this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";

      // Сброс выбранной фигуры и доступных ходов
      this.selectedPiece = null;
      this.availableMoves = [];

      // Проверка на окончание игры (король захвачен)
      if (capturedPiece && capturedPiece.type === "king") {
        this.gameOver = true;
        this.winner = movingPiece.color;
      }

      return true;
    },

    calculateAvailableMoves(position, piece) {
      const [row, col] = position;
      const moves = [];

      switch (piece.type) {
        case "pawn":
          // Направление движения пешки зависит от цвета
          const direction = piece.color === "white" ? -1 : 1;
          const startRow = piece.color === "white" ? 6 : 1;

          // Ход вперед на одну клетку
          if (
            isValidPosition(row + direction, col) &&
            !this.board[row + direction][col]
          ) {
            moves.push([row + direction, col]);

            // Ход вперед на две клетки с начальной позиции
            if (row === startRow && !this.board[row + 2 * direction][col]) {
              moves.push([row + 2 * direction, col]);
            }
          }

          // Взятие по диагонали
          for (const offset of [-1, 1]) {
            if (
              isValidPosition(row + direction, col + offset) &&
              this.board[row + direction][col + offset] &&
              this.board[row + direction][col + offset].color !== piece.color
            ) {
              moves.push([row + direction, col + offset]);
            }
          }
          break;

        case "rook":
          // Ладья ходит по вертикали и горизонтали
          for (const [dx, dy] of [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
          ]) {
            let r = row + dx;
            let c = col + dy;

            while (isValidPosition(r, c)) {
              if (!this.board[r][c]) {
                moves.push([r, c]);
              } else {
                if (this.board[r][c].color !== piece.color) {
                  moves.push([r, c]);
                }
                break;
              }
              r += dx;
              c += dy;
            }
          }
          break;

        case "knight":
          // Конь ходит буквой "Г"
          for (const [dx, dy] of [
            [1, 2],
            [2, 1],
            [2, -1],
            [1, -2],
            [-1, -2],
            [-2, -1],
            [-2, 1],
            [-1, 2],
          ]) {
            const r = row + dx;
            const c = col + dy;

            if (
              isValidPosition(r, c) &&
              (!this.board[r][c] || this.board[r][c].color !== piece.color)
            ) {
              moves.push([r, c]);
            }
          }
          break;

        case "bishop":
          // Слон ходит по диагонали
          for (const [dx, dy] of [
            [1, 1],
            [1, -1],
            [-1, -1],
            [-1, 1],
          ]) {
            let r = row + dx;
            let c = col + dy;

            while (isValidPosition(r, c)) {
              if (!this.board[r][c]) {
                moves.push([r, c]);
              } else {
                if (this.board[r][c].color !== piece.color) {
                  moves.push([r, c]);
                }
                break;
              }
              r += dx;
              c += dy;
            }
          }
          break;

        case "queen":
          // Ферзь ходит как ладья и слон вместе
          for (const [dx, dy] of [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
            [1, 1],
            [1, -1],
            [-1, -1],
            [-1, 1],
          ]) {
            let r = row + dx;
            let c = col + dy;

            while (isValidPosition(r, c)) {
              if (!this.board[r][c]) {
                moves.push([r, c]);
              } else {
                if (this.board[r][c].color !== piece.color) {
                  moves.push([r, c]);
                }
                break;
              }
              r += dx;
              c += dy;
            }
          }
          break;

        case "king":
          // Король ходит на одну клетку в любом направлении
          for (const [dx, dy] of [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
            [1, 1],
            [1, -1],
            [-1, -1],
            [-1, 1],
          ]) {
            const r = row + dx;
            const c = col + dy;

            if (
              isValidPosition(r, c) &&
              (!this.board[r][c] || this.board[r][c].color !== piece.color)
            ) {
              moves.push([r, c]);
            }
          }
          break;
      }

      return moves;
    },

    resetGame() {
      this.board = initializeBoard();
      this.currentPlayer = "white";
      this.selectedPiece = null;
      this.moveHistory = [];
      this.availableMoves = [];
      this.gameOver = false;
      this.winner = null;
    },

    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings };
    },
  },
});

// Вспомогательные функции
function initializeBoard() {
  const board = Array(8)
    .fill()
    .map(() => Array(8).fill(null));

  // Расстановка пешек
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: "pawn", color: "black" };
    board[6][col] = { type: "pawn", color: "white" };
  }

  // Расстановка ладей
  board[0][0] = { type: "rook", color: "black" };
  board[0][7] = { type: "rook", color: "black" };
  board[7][0] = { type: "rook", color: "white" };
  board[7][7] = { type: "rook", color: "white" };

  // Расстановка коней
  board[0][1] = { type: "knight", color: "black" };
  board[0][6] = { type: "knight", color: "black" };
  board[7][1] = { type: "knight", color: "white" };
  board[7][6] = { type: "knight", color: "white" };

  // Расстановка слонов
  board[0][2] = { type: "bishop", color: "black" };
  board[0][5] = { type: "bishop", color: "black" };
  board[7][2] = { type: "bishop", color: "white" };
  board[7][5] = { type: "bishop", color: "white" };

  // Расстановка ферзей
  board[0][3] = { type: "queen", color: "black" };
  board[7][3] = { type: "queen", color: "white" };

  // Расстановка королей
  board[0][4] = { type: "king", color: "black" };
  board[7][4] = { type: "king", color: "white" };

  return board;
}

function isValidPosition(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}
