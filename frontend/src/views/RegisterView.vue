<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-md p-8 border border-slate-200">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-900">Crear Cuenta</h1>
        <p class="text-slate-500 text-sm mt-1">Registra tu usuario en la plataforma</p>
      </div>
      
      <div v-if="authStore.error" class="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
        <p class="font-semibold mb-1" v-if="Array.isArray(authStore.error)">Por favor corrige los siguientes errores:</p>
        <ul v-if="Array.isArray(authStore.error)" class="list-disc list-inside space-y-1">
          <li v-for="(err, index) in authStore.error" :key="index">{{ err }}</li>
        </ul>
        <p v-else>{{ authStore.error }}</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
          <input 
            v-model="form.name"
            type="text" 
            required 
            placeholder="John Doe"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

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

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Rol de Usuario</label>
          <select 
            v-model="form.role"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="USER">Usuario Estándar</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <button 
          type="submit" 
          :disabled="authStore.loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 mt-2"
        >
          {{ authStore.loading ? 'Registrando...' : 'Registrar Cuenta' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-600">
        ¿Ya tienes cuenta? 
        <router-link to="/login" class="text-indigo-600 font-medium hover:underline">Inicia sesión</router-link>
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
  name: '',
  email: '',
  password: '',
  role: 'USER'
});

const handleRegister = async () => {
  const success = await authStore.register(form);
  if (success) {
    router.push('/login');
  }
};
</script>