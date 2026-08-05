<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-md p-8 border border-slate-200">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-900">Iniciar Sesión</h1>
        <p class="text-slate-500 text-sm mt-1">Accede al Sistema de Soporte</p>
      </div>

      <div v-if="authStore.error" class="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
          <input 
            v-model="form.email"
            type="email" 
            required 
            placeholder="tu@email.com"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input 
            v-model="form.password"
            type="password" 
            required 
            placeholder="••••••••"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button 
          type="submit" 
          :disabled="authStore.loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {{ authStore.loading ? 'Cargando...' : 'Entrar' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-600">
        ¿No tienes cuenta? 
        <router-link to="/register" class="text-indigo-600 font-medium hover:underline">Regístrate aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  email: '',
  password: ''
});

const handleLogin = async () => {
  const success = await authStore.login(form);
  if (success) {
    router.push('/');
  }
};
</script>