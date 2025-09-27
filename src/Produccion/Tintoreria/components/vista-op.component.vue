<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold">Órdenes de Tintorería</h2>
      </v-col>
    </v-row>

    <v-data-table
        :headers="headers"
        :items="ordenes"
        class="elevation-1"
        items-per-page="100"
        density="comfortable"
    >
      <template #item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.numeroOrdenProduccion }}</td>
          <td>{{ item.pesoTela }} kg</td>
          <td>
            <v-chip :color="estadoColor(item.estado)" small dark>
              {{ estadoTexto(item.estado) }}
            </v-chip>
          </td>
          <td>
            <div><strong>Creación:</strong> {{ formatFecha(item.fechaCreacion) }}</div>
            <div v-if="item.faseTenido?.timestampInicio">
              <strong>Tenido:</strong> {{ formatFecha(item.faseTenido.timestampInicio) }}
            </div>
            <div v-if="item.faseSecado?.timestampInicio">
              <strong>Secado:</strong> {{ formatFecha(item.faseSecado.timestampInicio) }}
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-alert v-if="ordenes.length === 0" type="info" class="mt-4">
      No hay órdenes de tintorería registradas.
    </v-alert>
  </v-container>
</template>

<script>
import { obtenerTodasLasOrdenesTintoreria } from '@/Produccion/Tintoreria/services/tintoreria-api.service';

export default {
  name: 'VistaOrdenesTintoreria',
  data() {
    return {
      ordenes: [],
      headers: [
        { title: 'ID', value: 'id' },
        { title: 'N° Orden Prod.', value: 'numeroOrdenProduccion' },
        { title: 'Peso Tela', value: 'pesoTela' },
        { title: 'Estado', value: 'estado' },
        { title: 'Fechas', value: 'fechaCreacion' }
      ]
    };
  },
  async created() {
    await this.cargarOrdenes();
  },
  methods: {
    async cargarOrdenes() {
      try {
        const res = await obtenerTodasLasOrdenesTintoreria();
        this.ordenes = res.data.map((o, index) => ({
          ...o,
          id: index,
          pesoTela: Number(o.pesoTela),
        }));
      } catch (error) {
        console.error("❌ Error al obtener órdenes de tintorería:", error);
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
    estadoTexto(estadoCode) {
      return ["Programado", "En Tenido", "En Secado", "Finalizado"][estadoCode] || "Desconocido";
    },
    estadoColor(estadoCode) {
      return ["grey", "blue", "orange", "green"][estadoCode] || "red";
    }
  }
};
</script>

<style scoped>
.v-data-table {
  border-radius: 12px;
}
.v-chip {
  font-weight: 500;
}
</style>
