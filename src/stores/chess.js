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
      lightSquareColor:
        JSON.parse(localStorage.getItem("KTChessVueJSSettings"))
          .lightSquareColor || "#f0d9b5",
      darkSquareColor:
        JSON.parse(localStorage.getItem("KTChessVueJSSettings"))
          .darkSquareColor || "#b58863",
      pieceStyle:
        JSON.parse(localStorage.getItem("KTChessVueJSSettings")).pieceStyle ||
        "adventurer",
    },
    pieceStyles: [
      "adventurer",
      "alpha",
      "berlin",
      "cardinal",
      "cheq",
      "chess_samara",
      "chess7",
      "chess24",
      "chesscom",
      "chessnut",
      "companion",
      "condal",
      "dash",
      "dilena",
      "dubrovny",
      "fantasy",
      "fresca",
      "glass",
      "graffiti",
      "graffiti_light",
      "kingdom",
      "kosal",
      "leipzig",
      "letter",
      "lucena",
      "maestro",
      "magnetic",
      "marble",
      "maya",
      "mediaeval",
      "merida",
      "metro",
      "pirouetti",
      "pixel",
      "reilly",
      "riohacha",
      "spatial",
      "staunty",
      "symbol",
      "symmetric",
      "tatiana",
      "tournament",
      "tournament_metal",
      "uscf",
      "wikipedia",
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

      const isMoveAvailable = this.availableMoves.some(
        ([row, col]) => row === toRow && col === toCol
      );

      if (!isMoveAvailable) return false;

      const movingPiece = this.selectedPiece.piece;
      const capturedPiece = this.board[toRow][toCol];

      if (movingPiece.type === "pawn") {
        if (
          (movingPiece.color === "white" && toRow === 0) ||
          (movingPiece.color === "black" && toRow === 7)
        ) {
          movingPiece.type = "queen";
        }
      }

      this.moveHistory.push({
        piece: movingPiece,
        from: [fromRow, fromCol],
        to: [toRow, toCol],
        captured: capturedPiece,
        timestamp: new Date(),
      });

      this.board[toRow][toCol] = movingPiece;
      this.board[fromRow][fromCol] = null;

      this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";

      this.selectedPiece = null;
      this.availableMoves = [];

      if (capturedPiece && capturedPiece.type === "king") {
        this.gameOver = true;
        this.winner = movingPiece.color === "white" ? "Белый" : "Черный";
      }

      return true;
    },

    calculateAvailableMoves(position, piece) {
      const [row, col] = position;
      const moves = [];

      switch (piece.type) {
        case "pawn":
          const direction = piece.color === "white" ? -1 : 1;
          const startRow = piece.color === "white" ? 6 : 1;

          if (
            isValidPosition(row + direction, col) &&
            !this.board[row + direction][col]
          ) {
            moves.push([row + direction, col]);

            if (row === startRow && !this.board[row + 2 * direction][col]) {
              moves.push([row + 2 * direction, col]);
            }
          }

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

function initializeBoard() {
  const board = Array(8)
    .fill()
    .map(() => Array(8).fill(null));

  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: "pawn", color: "black" };
    board[6][col] = { type: "pawn", color: "white" };
  }

  board[0][0] = { type: "rook", color: "black" };
  board[0][7] = { type: "rook", color: "black" };
  board[7][0] = { type: "rook", color: "white" };
  board[7][7] = { type: "rook", color: "white" };

  board[0][1] = { type: "knight", color: "black" };
  board[0][6] = { type: "knight", color: "black" };
  board[7][1] = { type: "knight", color: "white" };
  board[7][6] = { type: "knight", color: "white" };

  board[0][2] = { type: "bishop", color: "black" };
  board[0][5] = { type: "bishop", color: "black" };
  board[7][2] = { type: "bishop", color: "white" };
  board[7][5] = { type: "bishop", color: "white" };

  board[0][3] = { type: "queen", color: "black" };
  board[7][3] = { type: "queen", color: "white" };

  board[0][4] = { type: "king", color: "black" };
  board[7][4] = { type: "king", color: "white" };

  return board;
}

function isValidPosition(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}
