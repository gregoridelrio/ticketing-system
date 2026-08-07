<template>
  <div class="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
    <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-md text-center">
      <h1 class="text-6xl font-black text-indigo-600 mb-2">404</h1>
      <h2 class="text-xl font-bold text-slate-800 mb-2">Página no encontrada</h2>
      <p class="text-sm text-slate-500 mb-6">
        La ruta que intentas visitar no existe o ha sido movida.
      </p>
      <router-link 
        to="/" 
        class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        ← Volver al Panel Principal
      </router-link>
    </div>
  </div>
</template>