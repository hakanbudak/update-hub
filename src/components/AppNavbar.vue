<template>
  <nav class="bg-white shadow border-b border-gray-200">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Sol: Logo -->
      <router-link to="/" class="text-xl font-bold text-indigo-600">
        heybooster
      </router-link>

      <!-- Sağ: Linkler -->
      <div class="space-x-4">
        <router-link
          to="/"
          class="text-gray-600 hover:text-indigo-600 font-medium"
        >
          Güncellemeler
        </router-link>
        <router-link
          to="/add-update"
          class="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded text-sm font-medium"
        >
          + Yeni Ekle
        </router-link>
      </div>
    </div>
  </nav>
</template>
