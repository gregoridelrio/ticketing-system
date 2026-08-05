import { defineStore } from 'pinia';
import api from '../api/axios';

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
        this.error = err.response?.data?.message || 'Error al obtener tickets';
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
        this.error = err.response?.data?.message || 'Error al obtener el ticket';
      } finally {
        this.loading = false;
      }
    },

    async createTicket(ticketData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post('/tickets', ticketData);
        this.tickets.unshift(res.data.ticket);
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al crear ticket';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async updateTicket(id, updateData) {
      try {
        const res = await api.patch(`/tickets/${id}`, updateData);
        if (this.currentTicket && this.currentTicket.id === parseInt(id)) {
          this.currentTicket = { ...this.currentTicket, ...res.data.ticket };
        }
        await this.fetchTickets();
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al actualizar ticket';
        return false;
      }
    },

    async addComment(ticketId, content) {
      try {
        const res = await api.post(`/tickets/${ticketId}/comments`, { content });
        if (this.currentTicket) {
          if (!this.currentTicket.comments) this.currentTicket.comments = [];
          this.currentTicket.comments.push(res.data.comment);
        }
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al añadir comentario';
        return false;
      }
    }
  }
});