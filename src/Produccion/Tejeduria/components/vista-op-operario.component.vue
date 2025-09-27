<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold">Mis Órdenes de Producción</h2>
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
          <td>
            <ul class="pl-2 ma-0">
              <li v-for="(lote, i) in item.lotes" :key="i">
                <strong>ID:</strong> {{ lote.loteId }} – <strong>Kg:</strong> {{ lote.cantidad }}
              </li>
            </ul>
          </td>
          <td>{{ item.nombreOperario }}</td>
          <td>{{ item.destino }}</td>
          <td>{{ item.maquina }}</td>

          <td>
            <v-chip :color="estadoColor(item.estado)" dark small>
              {{ item.estado }}
            </v-chip>
          </td>
          <td>
            <div><strong>Creación:</strong> {{ formatFecha(item.fechaCreacion) }}</div>
            <div v-if="item.timestampInicio"><strong>Inicio:</strong> {{ formatFecha(item.timestampInicio) }}</div>
            <div v-if="item.timestampFin"><strong>Fin:</strong> {{ formatFecha(item.timestampFin) }}</div>
          </td>
          <td>
            <v-btn
                v-if="item.estado === 'Programado'"
                color="orange"
                small
                @click="iniciarOrden(item.id)"
            >
              Iniciar
            </v-btn>
            <v-btn
                v-if="item.estado === 'En Proceso'"
                color="green"
                small
                @click="abrirDialogoFinalizar(item)"
            >
              Finalizar
            </v-btn>
            <v-btn
                v-if="item.estado === 'En Proceso'"
                color="blue"
                small
                @click="abrirDialogoObservacion(item)"
            >
              Observación
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-alert v-if="ordenes.length === 0" type="info" class="mt-4">
      No hay órdenes de producción registradas.
    </v-alert>

    <!-- Diálogo para registrar observación -->
    <v-dialog v-model="observacionDialog" max-width="600">
      <v-card>
        <v-card-title>
          Agregar observación a OP #{{ ordenActual?.id }}
        </v-card-title>
        <v-card-text>
          <v-textarea
              label="Observación"
              v-model="observacionTexto"
              auto-grow
              outlined
              rows="3"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="guardarObservacion">Guardar</v-btn>
          <v-btn text @click="observacionDialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para finalizar orden -->
    <v-dialog v-model="finalizarDialog" max-width="500">
      <v-card>
        <v-card-title>
          Finalizar OP #{{ ordenActual?.id }}
        </v-card-title>
        <v-card-text>
          <v-text-field
              label="Peso de la tela obtenida (kg)"
              v-model="pesoTelaObtenida"
              type="number"
              min="0"
              outlined
              dense
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="guardarFinalizacion">Finalizar</v-btn>
          <v-btn text @click="finalizarDialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {
  getOrdenesPorUsuario,
  iniciarOrden,
  finalizarOrden,
  registrarObservacion
} from '@/Produccion/Tejeduria/services/tejeduria-api.service';

export default {
  name: 'VistaOpOperario',
  data() {
    return {
      ordenes: [],
      headers: [
        { title: 'ID', value: 'id' },
        { title: 'Lotes', value: 'lotes' },
        { title: 'Operario', value: 'nombreOperario' },
        { title: 'Destino', value: 'destino' },
        { title: 'Máquina', value: 'maquina' },
        { title: 'Estado', value: 'estado' },
        { title: 'Fecha de Creación', value: 'fechaCreacion' },
        { title: 'Acciones', value: 'acciones', sortable: false },
      ],
      observacionDialog: false,
      observacionTexto: '',
      finalizarDialog: false,
      pesoTelaObtenida: '',
      ordenActual: null
    };
  },
  async created() {
    await this.cargarOrdenes();
  },
  methods: {
    async cargarOrdenes() {
      try {
        const userId = this.getUserIdFromToken();
        if (!userId) {
          this.$router.push('/login');
          return;
        }
        const ordenes = await getOrdenesPorUsuario(userId);
        this.ordenes = ordenes || [];
      } catch (error) {
        console.error("❌ Error cargando órdenes:", error);
      }
    },
    getUserIdFromToken() {
      const token = localStorage.getItem('token');
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      } catch (e) {
        console.error('Error al decodificar token:', e);
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
    async iniciarOrden(id) {
      try {
        const userId = this.getUserIdFromToken();
        if (!userId) return;
        const tx = await iniciarOrden(id, userId);
        console.log('✅ Orden iniciada:', tx.hash);
        await this.cargarOrdenes();
      } catch (error) {
        console.error("❌ Error al iniciar la orden:", error);
      }
    },
    abrirDialogoFinalizar(orden) {
      this.ordenActual = orden;
      this.pesoTelaObtenida = '';
      this.finalizarDialog = true;
    },
    async guardarFinalizacion() {
      try {
        const userId = this.getUserIdFromToken();
        if (!userId || !this.ordenActual || isNaN(this.pesoTelaObtenida)) return;

        const relacionLote = this.ordenActual?.lotes?.[0]?.loteId || '';

        await finalizarOrden(
            this.ordenActual.id,
            this.pesoTelaObtenida,
            relacionLote,
            userId
        );

        this.finalizarDialog = false;
        this.ordenActual = null;
        await this.cargarOrdenes();
      } catch (error) {
        console.error("❌ Error al finalizar orden:", error);
      }
    },
    abrirDialogoObservacion(orden) {
      this.ordenActual = orden;
      this.observacionTexto = '';
      this.observacionDialog = true;
    },
    async guardarObservacion() {
      try {
        const userId = this.getUserIdFromToken();
        if (!userId || !this.ordenActual || !this.observacionTexto.trim()) return;

        await registrarObservacion(this.ordenActual.id, this.observacionTexto, userId);
        this.observacionDialog = false;
        this.observacionTexto = '';
        this.ordenActual = null;
        await this.cargarOrdenes();
      } catch (error) {
        console.error("❌ Error al registrar observación:", error);
      }
    }
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
