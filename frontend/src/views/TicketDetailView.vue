<template>
  <div class="min-h-screen bg-slate-100">
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <router-link to="/" class="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Volver al Dashboard
        </router-link>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="ticketStore.loading" class="text-center py-12 text-slate-500">
        Cargando detalle del ticket...
      </div>

      <div v-else-if="ticketStore.currentTicket" class="space-y-6">
        <!-- Tarjeta Principal -->
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div class="flex justify-between items-start mb-4">
            <div>
              <span class="text-xs text-slate-400 font-mono">Ticket #{{ ticketStore.currentTicket.id }}</span>
              <h1 class="text-2xl font-bold text-slate-900 mt-1">{{ ticketStore.currentTicket.title }}</h1>
            </div>
            <div class="flex gap-2">
              <span class="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                {{ ticketStore.currentTicket.status }}
              </span>
            </div>
          </div>

          <p class="text-slate-700 text-sm whitespace-pre-line mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
            {{ ticketStore.currentTicket.description }}
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-500 border-t border-slate-100 pt-4">
            <div>
              <span class="block font-medium text-slate-400">Creado Por</span>
              <span class="text-slate-700">{{ ticketStore.currentTicket.creator?.name }}</span>
            </div>
            <div>
              <span class="block font-medium text-slate-400">Prioridad</span>
              <span class="text-slate-700">{{ ticketStore.currentTicket.priority }}</span>
            </div>
            <div>
              <span class="block font-medium text-slate-400">Fecha</span>
              <span class="text-slate-700">{{ new Date(ticketStore.currentTicket.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>

        <!-- Sección de Comentarios -->
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 class="text-lg font-bold text-slate-900 mb-4">Comentarios</h2>

          <div v-if="ticketStore.currentTicket.comments?.length === 0" class="text-sm text-slate-500 py-4">
            No hay comentarios en este ticket aún.
          </div>

          <div v-else class="space-y-4 mb-6">
            <div 
              v-for="comment in ticketStore.currentTicket.comments" 
              :key="comment.id"
              class="p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm"
            >
              <div class="flex justify-between text-xs text-slate-500 mb-1">
                <span class="font-semibold text-slate-700">{{ comment.author?.name }}</span>
                <span>{{ new Date(comment.createdAt).toLocaleString() }}</span>
              </div>
              <p class="text-slate-700">{{ comment.content }}</p>
            </div>
          </div>

          <!-- Formulario Comentario -->
          <form @submit.prevent="handleAddComment" class="space-y-3">
            <textarea 
              v-model="commentText" 
              rows="3" 
              required 
              placeholder="Escribe una respuesta o actualización..."
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
            <div class="flex justify-end">
              <button 
                type="submit" 
                class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Enviar Comentario
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTicketStore } from '../stores/tickets';

const route = useRoute();
const ticketStore = useTicketStore();
const commentText = ref('');

onMounted(() => {
  ticketStore.fetchTicketById(route.params.id);
});

const handleAddComment = async () => {
  if (!commentText.value.trim()) return;
  const success = await ticketStore.addComment(route.params.id, commentText.value);
  if (success) {
    commentText.value = '';
  }
};
</script>