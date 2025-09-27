<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold">Órdenes Finalizadas</h2>
      </v-col>
    </v-row>

    <v-data-table
        :headers="headers"
        :items="ordenesFinalizadas"
        class="elevation-1"
        items-per-page="10"
        density="comfortable"
    >
      <template #item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.numeroOrdenProduccion }}</td>
          <td>{{ item.maquina }}</td>
          <td>{{ item.observaciones }}</td>
          <td>
            <ul class="pl-2 ma-0">
              <li v-for="(lote, i) in item.lotes" :key="i">
                <strong>ID:</strong> {{ lote.loteId }} – <strong>Kg:</strong> {{ lote.cantidad }}
              </li>
            </ul>
          </td>
          <td>{{ item.pesoTelaObtenida }} kg</td>
          <td>{{ formatFecha(item.timestampFin) }}</td>
        </tr>
      </template>
    </v-data-table>

    <v-alert v-if="ordenesFinalizadas.length === 0" type="info" class="mt-4">
      No hay órdenes finalizadas.
    </v-alert>
  </v-container>
</template>

<script>
import { getOrdenesPorUsuario } from '@/Produccion/Tejeduria/services/tejeduria-api.service';

export default {
  name: 'OrdenesFinalizadasView',
  data() {
    return {
      ordenesFinalizadas: [],
      headers: [
        { title: 'ID', value: 'id' },
        { title: 'N° OP', value: 'numeroOrdenProduccion' },
        { title: 'Máquina', value: 'maquina' },
        {title: 'Observaciones', value: 'observaciones'},
        { title: 'Lotes', value: 'lotes' },
        { title: 'Peso Tela Obtenida', value: 'pesoTelaObtenida' },
        { title: 'Fecha Fin', value: 'timestampFin' },
      ]
    }
  },
  async created() {
    await this.cargarOrdenesFinalizadas();
  },
  methods: {
    async cargarOrdenesFinalizadas() {
      try {
        const userId = this.getUserIdFromToken();
        if (!userId) return;
        const ordenes = await getOrdenesPorUsuario(userId);
        this.ordenesFinalizadas = ordenes.filter(o => o.estado === 'Finalizado');
      } catch (err) {
        console.error('Error al cargar órdenes finalizadas:', err);
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
    }
  }
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
