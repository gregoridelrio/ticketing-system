<template>
  <div class="min-h-screen bg-slate-100">
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <router-link to="/" class="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer">
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
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span class="text-xs text-slate-400 font-mono">Ticket #{{ ticketStore.currentTicket.id }}</span>
              <h1 class="text-2xl font-bold text-slate-900 mt-1">{{ ticketStore.currentTicket.title }}</h1>
            </div>

            <!-- Select de Estado (Solo ADMIN puede modificar) -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-500 font-medium" v-if="authStore.isAdmin">Estado:</span>
              <select 
                v-if="authStore.isAdmin"
                :value="ticketStore.currentTicket.status" 
                @change="handleStatusChange($event.target.value)"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-800"
              >
                <option value="OPEN">OPEN (Abierto)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (En Proceso)</option>
                <option value="RESOLVED">RESOLVED (Resuelto)</option>
              </select>

              <span v-else :class="getStatusBadgeClass(ticketStore.currentTicket.status)">
                {{ ticketStore.currentTicket.status }}
              </span>
            </div>
          </div>

          <p class="text-slate-700 text-sm whitespace-pre-line mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
            {{ ticketStore.currentTicket.description }}
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-500 border-t border-slate-100 pt-4">
            <div>
              <span class="block font-medium text-slate-400">Creado Por</span>
              <span class="text-slate-700 font-medium">{{ ticketStore.currentTicket.creator?.name || 'N/A' }}</span>
            </div>
            <div>
              <span class="block font-medium text-slate-400">Asignado A</span>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="text-slate-700 font-medium">
                  {{ ticketStore.currentTicket.assignee?.name || 'Sin Asignar' }}
                </span>
                <!-- Botón de Asignarme (ADMIN) -->
                <button 
                  v-if="authStore.isAdmin && ticketStore.currentTicket.assignedTo !== authStore.user?.id" 
                  @click="handleAssignToMe" 
                  class="text-indigo-600 font-medium hover:underline text-[11px] cursor-pointer"
                >
                  (Asignarme)
                </button>
              </div>
            </div>
            <div>
              <span class="block font-medium text-slate-400">Prioridad</span>
              <span class="text-slate-700 font-medium">{{ ticketStore.currentTicket.priority }}</span>
            </div>
            <div>
              <span class="block font-medium text-slate-400">Fecha</span>
              <span class="text-slate-700 font-medium">{{ new Date(ticketStore.currentTicket.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>

        <!-- Sección de Comentarios -->
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 class="text-lg font-bold text-slate-900 mb-4">Comentarios</h2>

          <div v-if="!ticketStore.currentTicket.comments || ticketStore.currentTicket.comments.length === 0" class="text-sm text-slate-500 py-4">
            No hay comentarios en este ticket aún.
          </div>

          <div v-else class="space-y-4 mb-6">
            <div 
              v-for="comment in ticketStore.currentTicket.comments" 
              :key="comment.id"
              class="p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm"
            >
              <div class="flex justify-between text-xs text-slate-500 mb-1">
                <span class="font-semibold text-slate-700">{{ comment.author?.name || 'Usuario' }}</span>
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
import { useAuthStore } from '../stores/auth';
import { useTicketStore } from '../stores/tickets';

const route = useRoute();
const authStore = useAuthStore();
const ticketStore = useTicketStore();
const commentText = ref('');

onMounted(() => {
  ticketStore.fetchTicketById(route.params.id);
});

const handleStatusChange = async (newStatus) => {
  if (!newStatus) return;
  await ticketStore.updateTicket(route.params.id, { status: newStatus });
};

const handleAssignToMe = async () => {
  await ticketStore.updateTicket(route.params.id, { assignedTo: authStore.user.id });
};

const handleAddComment = async () => {
  if (!commentText.value.trim()) return;
  const success = await ticketStore.addComment(route.params.id, commentText.value);
  if (success) {
    commentText.value = '';
  }
};

const getStatusBadgeClass = (status) => {
  const classes = 'inline-block px-2.5 py-1 rounded-md text-xs font-semibold ';
  switch (status) {
    case 'OPEN': return classes + 'bg-red-100 text-red-700';
    case 'IN_PROGRESS': return classes + 'bg-amber-100 text-amber-700';
    case 'RESOLVED': return classes + 'bg-emerald-100 text-emerald-700';
    default: return classes + 'bg-slate-100 text-slate-700';
  }
};
</script>