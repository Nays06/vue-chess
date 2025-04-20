<template>
  <header>
    <nav>
      <router-link to="/">Игра</router-link>
      <router-link to="/settings">Настройки</router-link>
    </nav>
  </header>
  <main>
    <router-view />
  </main>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

header {
  background-color: #2c3e50;
  padding: 1rem;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 18px;
  transition: color 0.3s;
}

nav a:hover {
  color: #42b983;
}

main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>