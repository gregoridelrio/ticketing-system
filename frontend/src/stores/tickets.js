import { defineStore } from 'pinia';
import api from '../api/axios';
import { useToastStore } from './toast';

export const useTicketStore = defineStore('tickets', {
  state: () => ({
    tickets: [],
    currentTicket: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchTickets() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get('/tickets');
        this.tickets = res.data;
      } catch (err) {
        const toastStore = useToastStore();
        this.error = err.response?.data?.message || 'Error al obtener tickets';
        toastStore.addToast(this.error, 'error');
      } finally {
        this.loading = false;
      }
    },

    async fetchTicketById(id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get(`/tickets/${id}`);
        this.currentTicket = res.data;
      } catch (err) {
        const toastStore = useToastStore();
        this.error = err.response?.data?.message || 'Error al obtener el ticket';
        toastStore.addToast(this.error, 'error');
      } finally {
        this.loading = false;
      }
    },

    async createTicket(ticketData) {
      this.loading = true;
      this.error = null;
      const toastStore = useToastStore();
      try {
        const res = await api.post('/tickets', ticketData);
        const newTicket = res.data.ticket || res.data;
        this.tickets.unshift(newTicket);
        toastStore.addToast('Ticket creado exitosamente', 'success');
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al crear ticket';
        toastStore.addToast(this.error, 'error');
        return false;
      } finally {
        this.loading = false;
      }
    },

async updateTicket(id, updateData) {
  const toastStore = useToastStore();
  try {
    const res = await api.patch(`/tickets/${id}`, updateData);
    
    const updated = res.data.ticket || res.data;

    if (this.currentTicket) {
      Object.assign(this.currentTicket, updated);
    }

    toastStore.addToast('Ticket actualizado con éxito', 'success');

    this.fetchTickets().catch(() => {});

    return true;
  } catch (err) {
    console.error('Error en updateTicket:', err);
    this.error = err.response?.data?.message || 'Error al actualizar ticket';
    toastStore.addToast(this.error, 'error');
    return false;
  }
},

    async addComment(ticketId, content) {
      const toastStore = useToastStore();
      try {
        const res = await api.post(`/tickets/${ticketId}/comments`, { content });
        if (this.currentTicket) {
          if (!this.currentTicket.comments) this.currentTicket.comments = [];
          this.currentTicket.comments.push(res.data.comment || res.data);
        }
        toastStore.addToast('Comentario añadido', 'success');
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al añadir comentario';
        toastStore.addToast(this.error, 'error');
        return false;
      }
    }
  }
});