<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id"
        :class="[
          'p-4 rounded-xl shadow-lg border text-sm font-medium pointer-events-auto flex justify-between items-center transition-all',
          toast.type === 'success' ? 'bg-slate-900 text-emerald-400 border-emerald-500/30' :
          toast.type === 'error' ? 'bg-slate-900 text-red-400 border-red-500/30' :
          'bg-slate-900 text-slate-100 border-slate-700'
        ]"
      >
        <div class="flex items-center gap-2">
          <span>{{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ' }}</span>
          <span>{{ toast.message }}</span>
        </div>
        <button 
          @click="toastStore.removeToast(toast.id)" 
          class="text-xs ml-3 text-slate-400 hover:text-white cursor-pointer"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToastStore } from '../stores/toast';
const toastStore = useToastStore();
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateY(-20px); }
.toast-leave-to { opacity: 0; transform: translateX(100px); }
</style>