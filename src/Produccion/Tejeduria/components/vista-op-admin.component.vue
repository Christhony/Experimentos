<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold">Todas las Órdenes de Producción</h2>
      </v-col>
    </v-row>

    <v-data-table
        :headers="headers"
        :items="ordenes"
        class="elevation-1"
        items-per-page="10"
        density="comfortable"
    >
      <template #item="{ item }">
        <tr>
          <td>{{ item.numeroOrdenProduccion }}</td>
          <td>{{ item.maquina }}</td>
          <td>
            <ul class="pl-2 ma-0">
              <li v-for="(lote, i) in item.lotes" :key="i">
                <strong>ID:</strong> {{ lote.loteId }} – <strong>Kg:</strong> {{ lote.cantidad }}
              </li>
            </ul>
          </td>
          <td>{{ item.nombreOperario }}</td>
          <td>{{ item.destino }}</td>
          <td>
            <v-chip :color="estadoColor(item.estado)" dark small>
              {{ item.estado }}
            </v-chip>
          </td>
          <td>
            <div><strong>Creación:</strong> {{ formatFecha(item.fechaCreacion) }}</div>
            <div><strong>Inicio:</strong> {{ item.timestampInicio ? formatFecha(item.timestampInicio) : 'Pendiente' }}</div>
            <div><strong>Fin:</strong> {{ item.timestampFin ? formatFecha(item.timestampFin) : 'Pendiente' }}</div>
          </td>
          <td>
            <div>{{ item.pesoTelaObtenida }} kg</div>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-alert v-if="ordenes.length === 0" type="info" class="mt-4">
      No hay órdenes disponibles para mostrar.
    </v-alert>
  </v-container>
</template>

<script>
import { getOrdenesVisibles } from '@/Produccion/Tejeduria/services/tejeduria-api.service';

export default {
  name: 'VistaOpAdmin',
  data() {
    return {
      ordenes: [],
      headers: [
        { title: 'N° OP', value: 'numeroOrdenProduccion' },
        { title: 'Máquina', value: 'maquina' },
        { title: 'Lotes', value: 'lotes' },
        { title: 'Operario', value: 'nombreOperario' },
        { title: 'Destino', value: 'destino' },
        { title: 'Estado', value: 'estado' },
        { title: 'Fechas', value: 'fechas' },
        { title: 'Peso Obtenido', value: 'pesoTelaObtenida' },
      ],
    };
  },
  async created() {
    await this.cargarOrdenes();
  },
  methods: {
    async cargarOrdenes() {
      try {
        const userId = this.getUserIdFromToken();
        if (!userId) return;
        const ordenes = await getOrdenesVisibles(userId);
        this.ordenes = ordenes;
      } catch (err) {
        console.error('Error al cargar órdenes visibles:', err);
      }
    },
    getUserIdFromToken() {
      const token = localStorage.getItem('token');
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      } catch (e) {
        return null;
      }
    },
    formatFecha(timestamp) {
      const date = new Date(Number(timestamp) * 1000);
      return date.toLocaleString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    },
    estadoColor(estado) {
      switch (estado) {
        case 'Programado': return 'blue';
        case 'En Proceso': return 'orange';
        case 'Finalizado': return 'green';
        default: return 'grey';
      }
    },
  },
};
</script>

<style scoped>
.v-data-table {
  border-radius: 12px;
}
ul {
  padding-left: 1rem;
  margin: 0;
}
li {
  font-size: 0.85rem;
}
</style>
