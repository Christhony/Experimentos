<template>
  <v-card class="pa-4" max-width="800">
    <v-card-title>Crear Orden de Producción</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="formValid">
        <!-- Número de Orden y Máquina -->
        <v-text-field
            v-model="form.numeroOrdenProduccion"
            label="N° de Orden de Producción"
            type="number"
            required
            dense
        />
        <v-text-field
            v-model="form.maquina"
            label="Máquina utilizada"
            required
            dense
        />

        <!-- LOTES DINÁMICOS -->
        <div v-for="(lote, index) in form.lotesConsumidos" :key="index" class="mb-4">
          <v-select
              v-model="lote.loteId"
              :items="lotesDisponibles"
              item-title="label"
              item-value="loteId"
              label="Selecciona Lote"
              dense
              required
              @update:modelValue="onSelectLote(index)"
          />
          <v-text-field
              v-model="lote.cantidad"
              label="Cantidad a consumir (kg)"
              type="number"
              :rules="[v => v > 0 || 'Debe ser mayor a 0', v => validarStock(index, v)]"
              dense
              required
          />
          <v-btn color="error" icon @click="removerLote(index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>

        <v-btn color="primary" @click="agregarLote" class="mb-4">+ Añadir Lote</v-btn>

        <!-- OPERARIO DE TEJEDURÍA -->
        <v-select
            v-model="form.operario"
            :items="operarios"
            item-title="username"
            item-value="user_id"
            label="Seleccionar Operario de Tejeduría"
            dense
            required
            @update:modelValue="onSelectOperario"
        />
        <v-text-field v-model="form.codigoOperario" label="Código del Operario" readonly dense />
        <v-text-field v-model="form.destino" label="Destino" readonly dense />

        <!-- BOTÓN DE ENVÍO -->
        <v-btn color="primary" class="mt-4" @click="enviarFormulario" :disabled="!formValid">
          Crear Orden
        </v-btn>
      </v-form>
    </v-card-text>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-card>
</template>

<script>
import {
  crearOrdenProduccion,
  getLotesDisponibles,
  getOperariosTejedores,
} from '@/Produccion/Validacion/services/validar-api.service';

export default {
  name: 'CrearOpComponent',
  data() {
    return {
      formValid: false,
      lotesDisponibles: [],
      lotesStockMap: {},
      operarios: [],
      form: {
        numeroOrdenProduccion: '',
        maquina: '',
        lotesConsumidos: [],
        operario: '',
        nombreOperario: '',
        codigoOperario: '',
        destino: 'Tejeduría',
      },
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  async created() {
    await this.cargarDatos();
  },
  methods: {
    async cargarDatos() {
      try {
        const lotes = await getLotesDisponibles();
        this.lotesDisponibles = lotes.map(l => ({
          loteId: l.loteId,
          label: `${l.loteId} - ${l.pesoTotal} kg disponibles`
        }));

        this.lotesStockMap = lotes.reduce((acc, l) => {
          acc[l.loteId] = parseInt(l.pesoTotal);
          return acc;
        }, {});

        this.operarios = await getOperariosTejedores();

      } catch (error) {
        this.snackbar = {
          show: true,
          message: "Error al cargar datos iniciales.",
          color: "error",
        };
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
    agregarLote() {
      this.form.lotesConsumidos.push({ loteId: '', cantidad: '' });
    },
    removerLote(index) {
      this.form.lotesConsumidos.splice(index, 1);
    },
    onSelectOperario(userId) {
      const op = this.operarios.find(o => o.user_id === userId);
      if (op) {
        this.form.nombreOperario = op.username;
        this.form.codigoOperario = op.codigo_operario;
      }
    },
    onSelectLote(index) {
      this.form.lotesConsumidos[index].cantidad = "";
    },
    validarStock(index, valor) {
      const loteId = this.form.lotesConsumidos[index].loteId;
      const disponible = this.lotesStockMap[loteId] || 0;
      const cantidad = parseInt(valor);
      if (cantidad > disponible) {
        return `No puede exceder el stock disponible: ${disponible} kg`;
      }
      return true;
    },
    async enviarFormulario() {
      try {
        const adminId = this.getUserIdFromToken();
        if (!adminId) {
          this.snackbar = {
            show: true,
            message: "Sesión no válida.",
            color: "error",
          };
          return;
        }

        const lotesValidos = this.form.lotesConsumidos
            .filter(l => l.loteId && parseInt(l.cantidad) > 0)
            .map(l => ({
              loteId: l.loteId,
              cantidad: parseInt(l.cantidad)
            }));

        if (!this.form.numeroOrdenProduccion || !this.form.maquina || lotesValidos.length === 0) {
          this.snackbar = {
            show: true,
            message: "Completa todos los campos requeridos.",
            color: "error",
          };
          return;
        }

        const payload = {
          numeroOrdenProduccion: parseInt(this.form.numeroOrdenProduccion),
          maquina: this.form.maquina,
          lotes: lotesValidos,
          operario: this.form.operario,
          nombreOperario: this.form.nombreOperario,
          destino: this.form.destino,
          adminId,
        };

        const respuesta = await crearOrdenProduccion(payload);

        this.snackbar = {
          show: true,
          message: `Orden creada con éxito. Hash: ${respuesta.txHash || '✔'}`,
          color: "success",
        };

        this.$refs.form.reset();
        this.form = {
          numeroOrdenProduccion: '',
          maquina: '',
          lotesConsumidos: [],
          operario: '',
          nombreOperario: '',
          codigoOperario: '',
          destino: 'Tejeduría',
        };

      } catch (error) {
        console.error("❌ Error al crear orden:", error);
        this.snackbar = {
          show: true,
          message: "Error al crear la orden.",
          color: "error",
        };
      }
    }
  }
};
</script>

<style scoped>
.v-card {
  margin-top: 20px;
}
</style>
