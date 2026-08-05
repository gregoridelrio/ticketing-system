<template>
  <div class="min-h-screen bg-slate-100">
    <!-- Navbar -->
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-slate-800">Sistema de Tickets</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-slate-600">
            {{ authStore.user?.name }} ({{ authStore.user?.role }})
          </span>
          <button 
            @click="authStore.logout" 
            class="text-xs text-red-600 hover:text-red-800 font-medium cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 py-8">
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Panel de Control</h2>
          <p class="text-sm text-slate-500">Gestiona y revisa el estado de tus incidencias.</p>
        </div>
        <button 
          @click="showCreateModal = true"
          class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          + Nuevo Ticket
        </button>
      </div>

      <!-- Toolbar: Buscador y Filtros -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <!-- Buscador por texto -->
        <div class="relative flex-1">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar por título o ID (#1)..."
            class="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span class="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>

        <!-- Filtro por Estado -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium text-slate-600 whitespace-nowrap">Estado:</label>
          <select 
            v-model="statusFilter"
            class="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">Todos los estados</option>
            <option value="OPEN">Abierto (OPEN)</option>
            <option value="IN_PROGRESS">En Proceso (IN_PROGRESS)</option>
            <option value="RESOLVED">Resuelto (RESOLVED)</option>
          </select>
        </div>
      </div>

      <!-- Tabla de Tickets -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div v-if="ticketStore.loading" class="text-center py-12 text-slate-500">
          Cargando tickets...
        </div>

        <div v-else-if="filteredTickets.length === 0" class="text-center py-12 text-slate-500 text-sm">
          No se encontraron tickets con los criterios aplicados.
        </div>

        <table v-else class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
            <tr 
              v-for="ticket in filteredTickets" 
              :key="ticket.id"
              class="text-sm hover:bg-slate-50 transition-colors"
            >
              <td class="py-3 px-4 text-slate-500 font-mono">#{{ ticket.id }}</td>
              <td class="py-3 px-4 font-medium text-slate-800">{{ ticket.title }}</td>
              <td class="py-3 px-4">
                <span :class="getStatusBadgeClass(ticket.status)">
                  {{ ticket.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-600">{{ ticket.priority }}</td>
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
                  class="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  Ver Detalle →
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Modal para Crear Ticket -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Crear Nuevo Ticket</h3>
        
        <form @submit.prevent="handleCreateTicket" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Título</label>
            <input 
              v-model="newTicket.title" 
              type="text" 
              required 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
            <textarea 
              v-model="newTicket.description" 
              rows="3" 
              required 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Prioridad</label>
            <select 
              v-model="newTicket.priority" 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              @click="showCreateModal = false"
              class="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer"
            >
              Crear Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useTicketStore } from '../stores/tickets';

const authStore = useAuthStore();
const ticketStore = useTicketStore();

const showCreateModal = ref(false);
const searchQuery = ref('');
const statusFilter = ref('ALL');

const newTicket = ref({
  title: '',
  description: '',
  priority: 'MEDIUM'
});

onMounted(() => {
  ticketStore.fetchTickets();
});

// Propiedad computada para filtrar tickets en el cliente en tiempo real
const filteredTickets = computed(() => {
  return ticketStore.tickets.filter(ticket => {
    // Filtro por Estado
    const matchesStatus = statusFilter.value === 'ALL' || ticket.status === statusFilter.value;

    // Filtro por Texto (Título o ID)
    const query = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !query || 
      ticket.title.toLowerCase().includes(query) || 
      ticket.id.toString().includes(query.replace('#', ''));

    return matchesStatus && matchesSearch;
  });
});

const handleCreateTicket = async () => {
  const success = await ticketStore.createTicket(newTicket.value);
  if (success) {
    showCreateModal.value = false;
    newTicket.value = { title: '', description: '', priority: 'MEDIUM' };
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