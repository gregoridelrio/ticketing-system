<template>
  <div class="min-h-screen bg-slate-100">
    <!-- Navbar -->
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-xl font-bold text-slate-900">Sistema de Ticketing</h1>
          <p class="text-xs text-slate-500">Bienvenido, {{ authStore.user?.name }} ({{ authStore.user?.role }})</p>
        </div>
        <button 
          @click="handleLogout" 
          class="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-slate-800">Tickets de Soporte</h2>
        <button 
          @click="showModal = true" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
        >
          + Nuevo Ticket
        </button>
      </div>

      <!-- Spinner / Carga -->
      <div v-if="ticketStore.loading" class="text-center py-12 text-slate-500">
        Cargando tickets...
      </div>

      <!-- Lista de Tickets vacía -->
      <div v-else-if="ticketStore.tickets.length === 0" class="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        No hay tickets registrados en este momento.
      </div>

      <!-- Tabla de Tickets -->
      <div v-else class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <th class="py-3 px-4">ID</th>
              <th class="py-3 px-4">Título</th>
              <th class="py-3 px-4">Estado</th>
              <th class="py-3 px-4">Prioridad</th>
              <th class="py-3 px-4">Creado Por</th>
              <th class="py-3 px-4">Asignado A</th>
              <th class="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="ticket in ticketStore.tickets" :key="ticket.id" class="hover:bg-slate-50 transition-colors">
              <td class="py-3 px-4 text-slate-500">#{{ ticket.id }}</td>
              <td class="py-3 px-4 font-medium text-slate-900">{{ ticket.title }}</td>
              <td class="py-3 px-4">
                <span :class="getStatusBadgeClass(ticket.status)">
                  {{ ticket.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span :class="getPriorityBadgeClass(ticket.priority)">
                  {{ ticket.priority }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-600">{{ ticket.creator?.name || 'N/A' }}</td>
              <td class="py-3 px-4 text-slate-600">
                <span v-if="ticket.assignee?.name" class="font-medium text-slate-700">
                  {{ ticket.assignee.name }}
                </span>
                <span v-else class="text-xs text-slate-400 italic">
                  Sin Asignar
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <router-link 
                  :to="`/tickets/${ticket.id}`" 
                  class="text-indigo-600 font-medium hover:underline text-xs cursor-pointer"
                >
                  Ver Detalle →
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Modal Crear Ticket -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Crear Nuevo Ticket</h3>
        
        <form @submit.prevent="handleCreateTicket" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Título</label>
            <input 
              v-model="newTicket.title" 
              type="text" 
              required 
              placeholder="Ej: Problema con el sistema de pagos"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea 
              v-model="newTicket.description" 
              rows="3" 
              required 
              placeholder="Detalla la incidencia..."
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Prioridad</label>
            <select 
              v-model="newTicket.priority" 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="LOW">Baja (LOW)</option>
              <option value="MEDIUM">Media (MEDIUM)</option>
              <option value="HIGH">Alta (HIGH)</option>
            </select>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              @click="showModal = false" 
              class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="ticketStore.loading"
              class="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useTicketStore } from '../stores/tickets';

const authStore = useAuthStore();
const ticketStore = useTicketStore();
const router = useRouter();

const showModal = ref(false);
const newTicket = reactive({
  title: '',
  description: '',
  priority: 'MEDIUM'
});

onMounted(() => {
  ticketStore.fetchTickets();
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const handleCreateTicket = async () => {
  const success = await ticketStore.createTicket(newTicket);
  if (success) {
    showModal.value = false;
    newTicket.title = '';
    newTicket.description = '';
    newTicket.priority = 'MEDIUM';
  }
};

const getStatusBadgeClass = (status) => {
  const classes = 'inline-block px-2 py-0.5 rounded-md text-xs font-semibold ';
  switch (status) {
    case 'OPEN': return classes + 'bg-red-100 text-red-700';
    case 'IN_PROGRESS': return classes + 'bg-amber-100 text-amber-700';
    case 'RESOLVED': return classes + 'bg-emerald-100 text-emerald-700';
    default: return classes + 'bg-slate-100 text-slate-700';
  }
};

const getPriorityBadgeClass = (priority) => {
  const classes = 'inline-block px-2 py-0.5 rounded-md text-xs font-medium ';
  switch (priority) {
    case 'HIGH': return classes + 'bg-rose-50 text-rose-600 border border-rose-200';
    case 'MEDIUM': return classes + 'bg-sky-50 text-sky-600 border border-sky-200';
    default: return classes + 'bg-slate-50 text-slate-600 border border-slate-200';
  }
};
</script>