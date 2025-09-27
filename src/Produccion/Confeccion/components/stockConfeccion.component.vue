<template>
  <v-container fluid class="pa-0">
    <!-- Título (como no hay v-card, usamos un div con clase) -->
    <div class="section-title mb-4">
      Stock de tela teñida para Confección
    </div>

    <!-- Tabla -->
    <v-data-table
        :headers="headers"
        :items="stock"
        :items-per-page="5"
        class="elevation-1"
        density="compact"
        item-value="numeroOrdenProduccion"
    >
      <template #item="{ item }">
        <tr>
          <td colspan="4">
            <v-expansion-panels flat>
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <div class="d-flex justify-space-between w-100 small-text">
                    <span><strong>OP:</strong> {{ item.numeroOrdenProduccion }}</span>
                    <span><strong>Total:</strong> {{ item.pesoTotal }} kg</span>
                    <span><strong>Lotes:</strong> {{ item.ordenes.length }}</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="detalle-wrapper">
                    <v-data-table
                        :headers="detalleHeaders"
                        :items="item.ordenes"
                        class="elevation-0 bordered-table small-text"
                        density="compact"
                        hide-default-footer
                    >
                      <template #item="{ item }">
                        <tr>
                          <td>{{ item.color }}</td>
                          <td>{{ item.pesoFinal }} kg</td>
                          <td>{{ formatFecha(item.fechaEnvio) }}</td>
                          <td>{{ item.nombreOperarioTenido }}</td>
                          <td>{{ item.nombreOperarioSecado }}</td>
                        </tr>
                      </template>
                    </v-data-table>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Alerta cuando no hay stock -->
    <v-alert v-if="stock.length === 0" type="info" class="mt-4">
      Aún no se ha enviado stock a confección.
    </v-alert>
  </v-container>
</template>

<script>
import { getStockRealDeConfeccion } from "@/Produccion/Confeccion/services/confeccion-api.service";

export default {
  name: "StockConfeccionAgrupado",
  data() {
    return {
      stock: [],
      headers: [
        { title: "N° Orden Producción", value: "numeroOrdenProduccion" },
        { title: "Total de Tela (kg)", value: "pesoTotal" },
        { title: "Lotes", value: "expand" }
      ],
      detalleHeaders: [
        { title: "Color", value: "color" },
        { title: "Peso Final (kg)", value: "pesoFinal" },
        { title: "Fecha de Envío", value: "fechaEnvio" },
        { title: "Operario Teñido", value: "nombreOperarioTenido" },
        { title: "Operario Secado", value: "nombreOperarioSecado" }
      ]
    };
  },
  async created() {
    await this.cargarStock();
  },
  methods: {
    async cargarStock() {
      try {
        this.stock = await getStockRealDeConfeccion();
      } catch (error) {
        console.error("❌ Error al cargar stock:", error);
      }
    },
    formatFecha(timestamp) {
      const date = new Date(Number(timestamp) * 1000);
      return date.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
    }
  }
};
</script>

<style scoped>
.v-data-table {
  border-radius: 10px;
}

.detalle-wrapper {
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 4px;
}

.small-text {
  font-size: 13px;
}

.bordered-table >>> thead th {
  background-color: #f8f8f8;
  font-weight: 600;
  font-size: 13px;
  padding: 4px 8px;
}

.bordered-table >>> td {
  font-size: 13px;
  padding: 4px 8px;
}

/* Título sin v-card */
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}
</style>
