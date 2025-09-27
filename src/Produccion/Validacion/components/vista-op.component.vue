<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold">Listado de Órdenes de Producción</h2>
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
          <td>{{ formatFecha(item.fechaCreacion) }}</td>
        </tr>
      </template>
    </v-data-table>

    <v-alert v-if="ordenes.length === 0" type="info" class="mt-4">
      No hay órdenes de producción registradas.
    </v-alert>
  </v-container>
</template>

<script>
import { getTodasLasOrdenes } from '@/Produccion/Validacion/services/validar-api.service';

export default {
  name: 'VistaOpComponent',
  data() {
    return {
      ordenes: [],
      headers: [
        { title: 'N° Orden', value: 'numeroOrdenProduccion' },
        { title: 'Máquina', value: 'maquina' },
        { title: 'Lotes', value: 'lotes' },
        { title: 'Operario', value: 'nombreOperario' },
        { title: 'Destino', value: 'destino' },
        { title: 'Estado', value: 'estado' },
        { title: 'Fecha de Creación', value: 'fechaCreacion' },
      ],
    };
  },
  async created() {
    await this.cargarOrdenes();
  },
  methods: {
    async cargarOrdenes() {
      try {
        const response = await getTodasLasOrdenes();
        this.ordenes = response.ordenes || [];
      } catch (error) {
        console.error(" Error cargando órdenes:", error);
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

.v-chip {
  font-weight: 500;
}

ul {
  padding-left: 1rem;
  margin: 0;
}

li {
  font-size: 0.85rem;
}
</style>
