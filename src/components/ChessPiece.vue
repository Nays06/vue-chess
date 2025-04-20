<!-- src/components/ChessPiece.vue -->
<template>
    <div class="chess-piece" :class="[piece.color, piece.type]">
      <img :src="pieceImagePath" :alt="pieceAlt" class="piece-image" />
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
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
  
  // Путь к изображению фигуры
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
    
    return `src/assets/img/chessesPacks/${props.pieceStyle}/${colorPrefix}${typeCode}.png`;
  });
  
  // Альтернативный текст для изображения (для доступности)
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
  }
  
  .piece-image {
    width: 85%;
    height: 85%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
  
  .chess-piece:hover .piece-image {
    transform: scale(1.1);
  }
  </style>