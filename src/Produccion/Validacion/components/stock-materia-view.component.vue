<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold">Stock de Materias Primas Aceptadas</h2>
      </v-col>
    </v-row>

    <v-data-table
        :headers="headers"
        :items="stock"
        class="elevation-1"
        items-per-page="100"
        density="comfortable"
    >
      <template #item="{ item }">
        <tr>
          <td>{{ item.loteId }}</td>
          <td>{{ item.nombreMateria }}</td>
          <td>{{ item.descripcion }}</td>
          <td>{{ item.pesoTotal }}</td>
          <td>{{ item.supplierCompany }}</td>
          <td>{{ formatFecha(item.fechaIngreso) }}</td>
          <td>
            <v-btn small @click="mostrarMovimientos(item)">Ver movimientos</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Modal de movimientos -->
    <v-dialog v-model="dialogoMovimientos" max-width="600">
      <v-card>
        <v-card-title class="headline">Movimientos del Lote {{ movimientoActual?.loteId }}</v-card-title>
        <v-card-text>
          <ul v-if="movimientoActual?.movimientos?.length > 0">
            <li v-for="(mov, index) in movimientoActual.movimientos" :key="index">
              {{ mov }}
            </li>
          </ul>
          <p v-else>No hay movimientos registrados.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialogoMovimientos = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-alert v-if="stock.length === 0" type="info" class="mt-4">
      No hay materias primas disponibles en stock.
    </v-alert>
  </v-container>
</template>

<script>
import { getLotesDisponibles } from '@/Produccion/Validacion/services/validar-api.service';

export default {
  name: 'StockMateriaView',
  data() {
    return {
      stock: [],
      dialogoMovimientos: false,
      movimientoActual: null,
      headers: [
        { title: 'Lote', value: 'loteId' },
        { title: 'Nombre', value: 'nombreMateria' },
        { title: 'Descripción', value: 'descripcion' },
        { title: 'Peso Total (kg)', value: 'pesoTotal' },
        { title: 'Proveedor', value: 'supplierCompany' },
        { title: 'Fecha Ingreso', value: 'fechaIngreso' },
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
        const lotes = await getLotesDisponibles();
        this.stock = lotes.map(lote => ({
          loteId: lote.loteId,
          nombreMateria: lote.nombreMateria,
          descripcion: lote.descripcion,
          pesoTotal: lote.pesoTotal,
          supplierCompany: lote.supplierCompany,
          fechaIngreso: lote.fechaIngreso,
          movimientos: lote.movimientos,
        }));
      } catch (error) {
        console.error(" Error al cargar el stock:", error);
      }
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
    mostrarMovimientos(item) {
      this.movimientoActual = item;
      this.dialogoMovimientos = true;
    },
  },
};
</script>

<style scoped>
.v-data-table {
  border-radius: 12px;
}
</style>
