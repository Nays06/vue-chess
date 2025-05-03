<template>
    <div class="settings-container">
        <h1>Настройки</h1>

        <div class="settings-section">
            <h2>Цвета доски</h2>
            <div class="color-settings">
                <div class="color-picker">
                    <label for="light-square-color">Светлые клетки:</label>
                    <div class="color-preview" :style="{ backgroundColor: lightSquareColor }"></div>
                    <input type="color" id="light-square-color" v-model="lightSquareColor" @change="saveSettings" />
                </div>

                <div class="color-picker">
                    <label for="dark-square-color">Тёмные клетки:</label>
                    <div class="color-preview" :style="{ backgroundColor: darkSquareColor }"></div>
                    <input type="color" id="dark-square-color" v-model="darkSquareColor" @change="saveSettings" />
                </div>
            </div>

            <div class="board-preview">
                <h3>Предпросмотр доски</h3>
                <div class="chess-board-preview" :style="boardStyle">
                    <div v-for="row in 3" :key="`preview-row-${row}`" class="preview-row">
                        <div v-for="col in 3" :key="`preview-cell-${row}-${col}`" class="preview-cell" :class="{
                            'preview-light-square': (row + col) % 2 === 0,
                            'preview-dark-square': (row + col) % 2,
                            'preview-light-square': (row + col) % 2 === 0,
                            'preview-dark-square': (row + col) % 2 !== 0
                        }">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <h2>Стиль фигур</h2>
            <div class="piece-style-settings">
                <div v-for="style in pieceStyles" :key="`style-${style}`" class="piece-style-option"
                    :class="{ 'selected-style': pieceStyle === style }" @click="selectPieceStyle(style)">
                    <h4>{{ formatStyleName(style) }}</h4>
                    <div class="piece-preview">
                        <img :src="`src/assets/img/chessesPacks/${style}/wK.png`" alt="Белый король"
                            class="piece-image" />
                        <img :src="`src/assets/img/chessesPacks/${style}/wQ.png`" alt="Белый ферзь"
                            class="piece-image" />
                        <img :src="`src/assets/img/chessesPacks/${style}/bK.png`" alt="Черный король"
                            class="piece-image" />
                        <img :src="`src/assets/img/chessesPacks/${style}/bQ.png`" alt="Черный ферзь"
                            class="piece-image" />
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-actions">
            <button @click="resetToDefaults" class="reset-button">Сбросить настройки</button>
            <button @click="saveSettings" class="save-button">Сохранить</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useChessStore } from '@/stores/chess';

const chessStore = useChessStore();
const settings = computed(() => chessStore.settings);
const pieceStyles = computed(() => chessStore.pieceStyles);


const lightSquareColor = ref(settings.value.lightSquareColor);
const darkSquareColor = ref(settings.value.darkSquareColor);
const pieceStyle = ref(settings.value.pieceStyle);


const boardStyle = computed(() => ({
    '--preview-light-square-color': lightSquareColor.value,
    '--preview-dark-square-color': darkSquareColor.value
}));


onMounted(() => {
    lightSquareColor.value = settings.value.lightSquareColor;
    darkSquareColor.value = settings.value.darkSquareColor;
    pieceStyle.value = settings.value.pieceStyle;
});


function selectPieceStyle(style) {
    pieceStyle.value = style;
    saveSettings();
}


function saveSettings() {
    localStorage.setItem('KTChessVueJSSettings', JSON.stringify({ lightSquareColor: lightSquareColor.value, darkSquareColor: darkSquareColor.value, pieceStyle: pieceStyle.value }))
    chessStore.updateSettings({
        lightSquareColor: lightSquareColor.value,
        darkSquareColor: darkSquareColor.value,
        pieceStyle: pieceStyle.value
    });
}


function resetToDefaults() {
    lightSquareColor.value = '#f0d9b5';
    darkSquareColor.value = '#b58863';
    pieceStyle.value = 'adventurer';
    saveSettings();
}


function formatStyleName(style) {
    return style.charAt(0).toUpperCase() + style.slice(1);
}
</script>

<style scoped>
.settings-container {
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.settings-section {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
}

.color-settings {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}

.color-picker {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.color-preview {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    border: 1px solid #ddd;
}

.board-preview {
    margin-top: 30px;
}

.chess-board-preview {
    display: flex;
    flex-direction: column;
    border: 2px solid #2c3e50;
    width: 150px;
    height: 150px;
    margin-top: 10px;
}

.preview-row {
    display: flex;
    flex: 1;
}

.preview-cell {
    flex: 1;
}

.preview-light-square {
    background-color: var(--preview-light-square-color, #f0d9b5);
}

.preview-dark-square {
    background-color: var(--preview-dark-square-color, #b58863);
}

.piece-style-settings {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.piece-style-option {
    padding: 15px;
    border: 2px solid #f0f0f0;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.3s, transform 0.2s;
}

.piece-style-option:hover {
    border-color: #42b983;
    transform: translateY(-5px);
}

.selected-style {
    border-color: #42b983;
    background-color: rgba(66, 185, 131, 0.1);
}

.piece-preview {
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
}

.piece-image {
    width: 30px;
    height: 30px;
}

.settings-info {
    margin-top: 30px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
}

.info-box {
    margin: 15px 0;
    padding: 10px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ddd;
}

pre {
    white-space: pre-wrap;
    font-size: 14px;
    overflow-x: auto;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
}

.scan-button {
    background-color: #3498db;
}

.settings-actions {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 20px;
}

.reset-button {
    background-color: #e74c3c;
}

.save-button {
    background-color: #42b983;
}
</style>