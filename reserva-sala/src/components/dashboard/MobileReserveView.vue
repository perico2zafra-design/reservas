<template>
  <div class="mobile-reserve-view pb-10">
    <!-- Header Section -->
    <div class="px-6 pt-8 pb-4">
      <div class="d-flex align-center justify-space-between mb-1">
        <h1 class="text-h4 font-weight-black text-playfair elite-title">Reservar</h1>
        <v-btn icon="mdi-tune-vertical" variant="text" color="slate-400" size="small" />
      </div>
      <p class="text-body-2 text-slate-500 font-weight-medium">Busque por nombre o filtre por capacidad.</p>
    </div>

    <!-- Quick Search & Filters -->
    <div class="px-4 mb-4">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Buscar instalación..."
        variant="solo"
        flat
        rounded="xl"
        class="search-bar-elite mb-4"
        hide-details
        bg-color="white"
      />
      
      <div class="d-flex ga-2 overflow-x-auto no-scrollbar py-2">
        <v-chip
          v-for="cat in categories"
          :key="cat"
          :class="['filter-chip-premium', { 'chip-active': selectedCategory === cat }]"
          variant="flat"
          rounded="lg"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </v-chip>
      </div>
    </div>

    <!-- Rooms List -->
    <div class="px-4">
      <v-row density="comfortable">
        <v-col v-for="room in filteredRooms" :key="room.id" cols="12" class="mb-5">
          <v-card 
            rounded="24" 
            class="reserve-room-card elevation-8"
            @click="$router.push('/room/' + room.id)"
          >
            <v-img 
              :src="room.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'" 
              height="220" 
              cover
              class="align-end"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height bg-slate-50">
                  <v-progress-circular indeterminate color="amber-darken-1" size="24" width="2" />
                </div>
              </template>
              
              <template v-slot:error>
                <div class="d-flex flex-column align-center justify-center fill-height bg-slate-100 text-slate-400">
                  <v-icon icon="mdi-image-off-outline" size="48" class="mb-2" />
                  <span class="text-caption font-weight-bold">Imagen no disponible</span>
                </div>
              </template>
              
              <!-- Subtle Gradient Overlay -->
              <div class="card-glass-overlay pa-5">
                <div class="d-flex justify-space-between align-end">
                  <div class="room-info">
                    <div class="d-flex align-center mb-1">
                      <v-chip size="x-small" color="amber-darken-1" class="text-uppercase font-weight-black px-2 me-2" variant="flat">
                        Premium
                      </v-chip>
                    </div>
                    <h3 class="text-h5 font-weight-black text-white leading-tight mb-1 text-shadow">{{ room.name }}</h3>
                    <div class="d-flex align-center text-white opacity-90 text-caption font-weight-bold">
                      <v-icon icon="mdi-account-group" size="14" class="me-1" color="amber-lighten-4" />
                      {{ room.capacity }} personas
                    </div>
                  </div>
                  
                  <v-btn 
                    color="amber-darken-1" 
                    size="large" 
                    rounded="xl" 
                    class="font-weight-black px-6 elite-btn"
                    elevation="4"
                  >
                    RESERVAR
                  </v-btn>
                </div>
              </div>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Empty State -->
      <div v-if="filteredRooms.length === 0" class="text-center py-12">
        <v-icon icon="mdi-magnify-close" size="64" color="slate-300" class="mb-4" />
        <h3 class="text-h6 text-slate-600 font-weight-bold">No se encontraron espacios</h3>
        <p class="text-body-2 text-slate-400">Intenta con otros términos de búsqueda.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBookingStore } from '@/stores/booking';

const bookingStore = useBookingStore();
const search = ref('');
const selectedCategory = ref('Todas');
const categories = ['Todas', 'Pequeñas', 'Medianas', 'Grandes'];

const filteredRooms = computed(() => {
  let rooms = bookingStore.rooms;
  
  // Search filter
  if (search.value) {
    rooms = rooms.filter(r => r.name.toLowerCase().includes(search.value.toLowerCase()));
  }
  
  // Capacity filter
  if (selectedCategory.value === 'Pequeñas') {
    rooms = rooms.filter(r => r.capacity < 10);
  } else if (selectedCategory.value === 'Medianas') {
    rooms = rooms.filter(r => r.capacity >= 10 && r.capacity <= 30);
  } else if (selectedCategory.value === 'Grandes') {
    rooms = rooms.filter(r => r.capacity > 30);
  }
  
  return rooms;
});
</script>

<style scoped>
.mobile-reserve-view {
  background: #f1f5f9; /* Slate 100 */
  min-height: 100vh;
}

.text-playfair {
  font-family: 'Playfair Display', serif !important;
}

.elite-title {
  color: #0f172a;
  letter-spacing: -0.5px;
}

.text-slate-500 { color: #64748b; }
.text-slate-600 { color: #475569; }

.search-bar-elite :deep(.v-field) {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  font-weight: 500;
}

.filter-chip-premium {
  background: white !important;
  color: #64748b !important;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 0.65rem;
  border: 1px solid #e2e8f0 !important;
  transition: all 0.3s ease;
}

.chip-active {
  background: #0f172a !important;
  color: #fbbf24 !important;
  border-color: #0f172a !important;
}

.reserve-room-card {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.reserve-room-card:active {
  transform: scale(0.97);
}

.card-glass-overlay {
  width: 100%;
  background: linear-gradient(to top, 
    rgba(15, 23, 42, 0.95) 0%, 
    rgba(15, 23, 42, 0.4) 60%, 
    transparent 100%
  );
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.elite-btn {
  letter-spacing: 1px;
  font-size: 0.75rem !important;
}

.leading-tight { line-height: 1.2; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
