// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'game',
      component: GameView
    },
    {
      path: '/settings',
      name: 'settings',
      // Ленивая загрузка компонента настроек
      component: () => import('../views/SettingsView.vue')
    }
  ]
})

export default router