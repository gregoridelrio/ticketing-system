import { defineStore } from 'pinia';
import api from '../api/axios';
import { useToastStore } from './toast';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role?.toUpperCase() === 'ADMIN'
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      const toastStore = useToastStore();
      try {
        const res = await api.post('/auth/login', credentials);
        this.token = res.data.token;
        this.user = res.data.user;

        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));

        toastStore.addToast(`¡Bienvenido/a, ${this.user.name}!`, 'success');
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al iniciar sesión';
        toastStore.addToast(this.error, 'error');
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;
      const toastStore = useToastStore();
      try {
        await api.post('/auth/register', userData);
        toastStore.addToast('Registro exitoso. Ya puedes iniciar sesión.', 'success');
        return true;
      } catch (err) {
        this.error = err.response?.data?.errors || err.response?.data?.message || 'Error en el registro';
        toastStore.addToast(typeof this.error === 'string' ? this.error : 'Error en los datos de registro', 'error');
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      const toastStore = useToastStore();
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toastStore.addToast('Sesión cerrada correctamente', 'info');
    }
  }
});