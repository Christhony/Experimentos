<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold">Stock de Telas por Numero de Orden de Producción</h2>
      </v-col>
    </v-row>

    <v-data-table
        :headers="headers"
        :items="stockPorOP"
        class="elevation-1"
        items-per-page="10"
        density="comfortable"
    >
      <template #item="{ item, index }">
        <tr>
          <td>{{ index + 1 }}</td>
          <td>{{ item.numeroOrdenProduccion }}</td>
          <td>{{ item.producidoTotal }}</td>
          <td>{{ item.stockDisponible }}</td>
          <td>
            <span v-if="item.ordenes.length">
              {{ item.ordenes.map(o => o.lote).join(', ') }}
            </span>
            <span v-else>-</span>
          </td>
          <td>
            <v-btn small @click="mostrarOrdenes(item)">Ver órdenes</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Modal -->
    <v-dialog v-model="dialogoOrdenes" max-width="600">
      <v-card>
        <v-card-title class="headline">
          Órdenes incluidas en OP #{{ ordenesActual?.numeroOrdenProduccion }}
        </v-card-title>
        <v-card-text>
          <ul v-if="ordenesActual?.ordenes?.length">
            <li
                v-for="(orden, index) in ordenesActual.ordenes"
                :key="index"
            >
              opId {{ orden.opId }} – Lote: {{ orden.lote }} – Peso: {{ orden.peso }} kg – {{ formatFecha(orden.timestampFin) }}
            </li>
          </ul>
          <p v-else>No hay órdenes asociadas.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialogoOrdenes = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-alert v-if="!stockPorOP.length && !cargando" type="info" class="mt-4">
      No hay stock de telas disponibles.
    </v-alert>
  </v-container>
</template>

<script>
import { obtenerStockPorNumeroOP } from '@/Produccion/Tintoreria/services/tintoreria-api.service';

export default {
  name: 'StockTelasPorOP',
  data() {
    return {
      stockPorOP: [],
      dialogoOrdenes: false,
      ordenesActual: null,
      cargando: false,
      headers: [
        { title: '#', value: 'index' },
        { title: 'N° OP', value: 'numeroOrdenProduccion' },
        { title: 'Producido (kg)', value: 'producidoTotal' },
        { title: 'Stock Disponible (kg)', value: 'stockDisponible' },
        { title: 'Lotes Asociados', value: 'lotes' },
        { title: 'Acciones', value: 'acciones', sortable: false },
      ],
    };
  },
  async created() {
    await this.cargarStock();
  },
  methods: {
    async cargarStock() {
      try {
        this.cargando = true;
        this.stockPorOP = await obtenerStockPorNumeroOP();
      } catch (error) {
        console.error("❌ Error al cargar el stock:", error);
      } finally {
        this.cargando = false;
      }
    },
    mostrarOrdenes(item) {
      this.ordenesActual = item;
      this.dialogoOrdenes = true;
    },
    formatFecha(timestamp) {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
.v-data-table {
  border-radius: 12px;
}
</style>
