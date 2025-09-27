<template>
  <v-container>
    <!-- Card que contiene la tabla y el botón -->
    <v-card>
      <v-card-title class="text-h6 font-weight-light">
        Lista de Órdenes de Corte
      </v-card-title>

      <v-card-actions>
        <!-- Botón para crear orden de corte -->
        <v-btn
            color="primary"
            @click="abrirModal"
            class="ml-auto"
            size="small"
        >
          Crear Orden de Corte
        </v-btn>
      </v-card-actions>

      <v-card-text>
        <v-data-table
            :headers="headers"
            :items="ordenesCorte"
            item-key="id"
            class="elevation-1"
            dense
            hide-default-footer
        >
          <template v-slot:item.actions="{ item }">
            <!-- Acciones de cada fila, si es necesario -->
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal para crear una nueva orden de corte -->
    <v-dialog v-model="modalVisible" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 font-weight-light">
          Crear Orden de Corte
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="handleSubmit" v-model="formValid">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-select
                    v-model="form.loteSeleccionado"
                    :items="lotesPlanos"
                    item-title="label"
                    item-value="loteId"
                    label="Seleccionar Lote"
                    :rules="[v => !!v || 'Seleccione un lote']"
                    dense
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                    v-model="form.operarioId"
                    :items="operarios"
                    item-title="username"
                    item-value="user_id"
                    label="Operario de Corte"
                    :rules="[v => !!v || 'Seleccione un operario']"
                    dense
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                    v-model="form.modelo"
                    label="Modelo"
                    :rules="[v => !!v || 'Modelo requerido']"
                    dense
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                    v-model="form.talla"
                    label="Talla"
                    :rules="[v => !!v || 'Talla requerida']"
                    dense
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                    v-model.number="form.pesoTelaTenida"
                    label="Peso a cortar (kg)"
                    type="number"
                    :rules="[v => v > 0 || 'Peso inválido']"
                    dense
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                    v-model="form.maquina"
                    label="Máquina"
                    :rules="[v => !!v || 'Máquina requerida']"
                    dense
                />
              </v-col>
            </v-row>

            <v-btn
                type="submit"
                color="primary"
                :disabled="!formValid || loading"
                class="mt-4"
                size="small"
            >
              Crear OP de Corte
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  getStockRealDeConfeccion,
  getOperariosConfeccionCorte,
  crearOrdenCorte,
  getOrdenesCorte
} from '@/Produccion/Confeccion/services/confeccion-api.service';

const formValid = ref(false);
const loading = ref(false);

const stock = ref([]);
const operarios = ref([]);
const ordenesCorte = ref([]);
const modalVisible = ref(false); // Control de visibilidad del modal

const form = ref({
  loteSeleccionado: null,
  operarioId: null,
  modelo: '',
  talla: '',
  pesoTelaTenida: 1,
  adminId: null,
  maquina: ''
});

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

const lotesPlanos = computed(() => {
  return stock.value.flatMap(grupo =>
      grupo.ordenes.map(lote => ({
        loteId: lote.id,
        numeroOrdenProduccion: grupo.numeroOrdenProduccion,
        color: lote.color,
        peso: lote.pesoFinal,
        label: `${lote.color} - ${lote.pesoFinal} kg (OP ${grupo.numeroOrdenProduccion})`
      }))
  );
});

const headers = [
  { text: 'ID', align: 'start', key: 'id', width: 60 },
  { text: 'Modelo', align: 'start', key: 'modelo' },
  { text: 'Talla', align: 'start', key: 'talla' },
  { text: 'Operario', align: 'start', key: 'operarioCorte' },
  { text: 'Máquina', align: 'start', key: 'maquina' },
  { text: 'Fecha de Corte', align: 'start', key: 'fechaCorte' }
];

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      form.value.adminId = payload.userId;
    }

    stock.value = await getStockRealDeConfeccion();
    operarios.value = await getOperariosConfeccionCorte();
    ordenesCorte.value = await getOrdenesCorte(); // Obtener las órdenes de corte existentes
  } catch (error) {
    console.error('❌ Error al cargar datos iniciales:', error);
    snackbar.value = {
      show: true,
      text: '❌ Error al cargar datos iniciales',
      color: 'error'
    };
  }
});

const handleSubmit = async () => {
  try {
    loading.value = true;

    const lote = form.value.loteSeleccionado;

    // Verificación de loteId
    if (lote?.loteId === undefined || lote.loteId === null) {
      throw new Error('El lote seleccionado no tiene un loteId válido.');
    }

    // Llamada a la API para crear la orden de corte
    await crearOrdenCorte(
        Number(lote.loteId),
        Number(lote.numeroOrdenProduccion),
        form.value.modelo,
        form.value.talla,
        form.value.operarioId,
        Number(form.value.pesoTelaTenida),
        form.value.adminId,
        form.value.maquina
    );

    snackbar.value = {
      show: true,
      text: '✅ Orden de corte creada exitosamente',
      color: 'success'
    };

    form.value = {
      loteSeleccionado: null,
      operarioId: null,
      modelo: '',
      talla: '',
      pesoTelaTenida: 1,
      adminId: form.value.adminId,
      maquina: ''
    };

    modalVisible.value = false; // Cerrar el modal
  } catch (err) {
    snackbar.value = {
      show: true,
      text: `❌ ${err.message}`,
      color: 'error'
    };
  } finally {
    loading.value = false;
  }
};

const abrirModal = () => {
  modalVisible.value = true;
};
</script>

<style scoped>
/* Estilo minimalista */
.v-card-title {
  font-size: 16px;
  font-weight: lighter;
}

.v-data-table {
  font-size: 12px;
}

.v-btn {
  font-size: 12px;
}

.v-select,
.v-text-field {
  font-size: 12px;
  margin-bottom: 10px;
}

.v-snackbar {
  font-size: 14px;
}
</style>