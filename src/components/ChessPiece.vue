<!-- src/components/ChessPiece.vue -->
<template>
  <div class="chess-piece" :class="[piece.color, piece.type]"
    :style="{ pointerEvents: currentPlayer === piece.color ? 'auto' : 'none', cursor: currentPlayer === piece.color ? 'pointer' : 'not-allowed' }">
    <img :src="pieceImagePath" :alt="pieceAlt" class="piece-image" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useChessStore } from '@/stores/chess';

const chessStore = useChessStore();

const props = defineProps({
  piece: {
    type: Object,
    required: true
  },
  pieceStyle: {
    type: String,
    default: 'pixel'
  }
});

const currentPlayer = computed(() => chessStore.currentPlayer);


const pieceImagePath = computed(() => {
  const colorPrefix = props.piece.color === 'white' ? 'w' : 'b';
  let typeCode;

  switch (props.piece.type) {
    case 'king': typeCode = 'K'; break;
    case 'queen': typeCode = 'Q'; break;
    case 'rook': typeCode = 'R'; break;
    case 'bishop': typeCode = 'B'; break;
    case 'knight': typeCode = 'N'; break;
    case 'pawn': typeCode = 'P'; break;
    default: typeCode = '?';
  }

  return `./img/chessesPacks/${props.pieceStyle}/${colorPrefix}${typeCode}.png`;
});


const pieceAlt = computed(() => {
  return `${props.piece.color} ${props.piece.type}`;
});
</script>

<style scoped>
.chess-piece {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  user-select: none;
}

.piece-image {
  width: 85%;
  height: 85%;
  object-fit: contain;
  user-select: none;
  transition: transform 0.3s ease;
}

.chess-piece:hover .piece-image {
  transform: scale(1.1);
}
</style>