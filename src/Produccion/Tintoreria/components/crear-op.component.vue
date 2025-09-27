<template>
  <v-card class="pa-4" max-width="800">
    <v-card-title>Crear Orden de Tintorería</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="formularioValido">
        <v-select
            v-model="form.opSeleccionada"
            :items="ordenesProduccion"
            label="Selecciona OP de origen"
            item-title="texto"
            item-value="valor"
            :rules="[v => !!v || 'OP requerida']"
            @update:modelValue="actualizarStock"
            dense
            required
        />

        <v-text-field
            v-model.number="form.cantidad"
            label="Cantidad a usar (kg)"
            type="number"
            :rules="[
            v => !!v || 'Cantidad requerida',
            v => v > 0 || 'Debe ser mayor a 0',
            v => v <= form.stockDisponible || `Máximo permitido: ${form.stockDisponible} kg`
          ]"
            dense
            required
        />

        <v-btn
            color="primary"
            class="mt-4"
            @click="enviarFormulario"
            :disabled="!formularioValido || cargando"
        >
          Crear Orden
        </v-btn>
      </v-form>
    </v-card-text>

    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="3000">
      {{ snackbar.texto }}
    </v-snackbar>
  </v-card>
</template>

<script>
import {
  obtenerStockPorNumeroOP,
  crearOrdenDeTintoreria
} from '@/Produccion/Tintoreria/services/tintoreria-api.service';

export default {
  name: 'FormularioCrearOrdenTintoreria',
  data() {
    return {
      formularioValido: false,
      cargando: false,
      ordenesProduccion: [],
      stockAgrupado: [],
      form: {
        opSeleccionada: null,
        cantidad: '',
        stockDisponible: 0
      },
      snackbar: {
        visible: false,
        texto: '',
        color: '',
      }
    };
  },
  async created() {
    await this.cargarStockInicial();
  },
  methods: {
    async cargarStockInicial() {
      try {
        const stock = await obtenerStockPorNumeroOP();
        this.stockAgrupado = stock;

        this.ordenesProduccion = stock.map(op => ({
          texto: `OP #${op.numeroOrdenProduccion} – ${op.stockDisponible} kg`,
          valor: Number(op.numeroOrdenProduccion),
          stockDisponible: Number(op.stockDisponible)
        }));
      } catch (error) {
        this.snackbar = {
          visible: true,
          texto: '❌ Error al cargar el stock inicial.',
          color: 'error'
        };
        console.error("❌ Error al cargar stock:", error);
      }
    },

    actualizarStock(numeroSeleccionado) {
      const seleccion = this.ordenesProduccion.find(op => op.valor === numeroSeleccionado);
      this.form.stockDisponible = seleccion ? seleccion.stockDisponible : 0;
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

    async enviarFormulario() {
      this.cargando = true;
      try {
        const userId = this.getUserIdFromToken();
        const { opSeleccionada, cantidad } = this.form;

        if (!userId || !opSeleccionada || !cantidad) {
          this.snackbar = {
            visible: true,
            texto: '❌ Faltan datos requeridos.',
            color: 'error'
          };
          return;
        }

        await crearOrdenDeTintoreria({
          numeroOrdenProduccion: opSeleccionada,
          peso: cantidad,
          userId
        });

        this.snackbar = {
          visible: true,
          texto: '✅ Orden de Tintorería creada con éxito',
          color: 'success'
        };

        this.$refs.form.reset();
        this.form = {
          opSeleccionada: null,
          cantidad: '',
          stockDisponible: 0
        };
      } catch (error) {
        console.error("❌ Error al crear la orden:", error);
        this.snackbar = {
          visible: true,
          texto: error?.message || '❌ Error al crear la orden',
          color: 'error'
        };
      } finally {
        this.cargando = false;
      }
    }
  }
};
</script>

<style scoped>
.v-card {
  margin-top: 20px;
}
.v-select,
.v-text-field {
  margin-bottom: 20px;
}
</style>
