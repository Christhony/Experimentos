<template>
  <v-container fluid class="pa-6">
    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="5000">
      {{ snackbar.message }}
    </v-snackbar>

    <!-- Título -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-text h2 class="font-weight-bold">Validar Materias Primas Registradas</v-text>
      </v-col>
    </v-row>

    <!-- Lista de materias -->
    <v-row v-if="materias.length > 0" justify="start" spacing="4">
      <v-col v-for="(materia, index) in materias" :key="index" cols="12" md="6" lg="4">
        <v-card class="mb-4 shadow-lg" :elevation="2">
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon color="primary" class="mr-2">mdi-package-variant</v-icon>
            {{ materia.nombreMateria }}
          </v-card-title>

          <v-card-subtitle class="text-body-2">Información del registro</v-card-subtitle>

          <v-card-text>
            <p><strong>Descripción:</strong> {{ materia.descripcion }}</p>
            <p><strong>Peso Neto:</strong> {{ materia.pesoNeto }} {{ materia.unidadMedida }}</p>
            <p><strong>Proveedor (wallet):</strong> {{ materia.proveedor }}</p>
            <p><strong>Orden de Referencia:</strong> {{ materia.ordenReferencia }}</p>
            <p><strong>Compañía:</strong> {{ materia.supplierCompany }}</p>
            <p><strong>Estado:</strong> {{ materia.estado }}</p>
            <div v-for="(link, i) in materia.ipfsLinks" :key="i" class="d-flex align-center mb-2">
              <v-icon color="green darken-1" class="mr-2">mdi-file-certificate</v-icon>
              <span class="font-weight-medium">Certificado {{ i + 1 }}:</span>
              <v-btn small color="primary" class="ml-3" @click="visualizarArchivo(link, `certificado_${i + 1}.pdf`)">
                Visualizar Certificado
              </v-btn>
            </div>
            <p v-if="materia.motivoRechazo"><strong>Motivo de rechazo:</strong> {{ materia.motivoRechazo }}</p>
            <p><strong>Fecha de Registro:</strong> {{ formatFecha(materia.fechaRegistro) }}</p>
            <p v-if="materia.fechaAceptacion"><strong>Fecha de Aceptación:</strong> {{
              formatFecha(materia.fechaAceptacion) }}</p>
            <p v-if="materia.fechaRechazo"><strong>Fecha de Rechazo:</strong> {{ formatFecha(materia.fechaRechazo) }}
            </p>
          </v-card-text>

          <!-- Botones para validar -->
          <v-card-actions v-if="materia.estado === 'Enviado'">
            <v-btn color="success" @click="aceptar(materia)">Aceptar</v-btn>
            <v-btn color="error" @click="rechazoDialog(index)">Rechazar</v-btn>
          </v-card-actions>

          <!-- Campo para ingresar motivo de rechazo -->
          <v-card-text v-if="rechazoIndex === index">
            <v-textarea v-model="motivoRechazo" label="Motivo del rechazo" auto-grow rows="2" outlined dense />
            <v-btn color="error" class="mt-2" @click="enviarRechazo(materia)">Enviar Rechazo</v-btn>
            <v-btn class="mt-2" @click="rechazoIndex = null">Cancelar</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Si no hay registros -->
    <v-row v-else justify="center">
      <v-col cols="12" class="text-center">
        <v-alert type="info" elevation="2" class="pa-4">
          No se han encontrado materias primas registradas.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  getTodasLasMateriasPrimas,
  aceptarMateriaPrima,
  rechazarMateriaPrima,
  visualizarCertificado,
} from "@/Produccion/Validacion/services/validar-api.service";

export default {
  name: "ValidarMaterias",
  data() {
    return {
      materias: [],
      rechazoIndex: null,
      motivoRechazo: "",
      snackbar: {
        show: false,
        message: "",
        color: "success",
      },
    };
  },
  async created() {
    this.cargarMaterias();
  },
  methods: {
    getUserIdFromToken() {
      const token = localStorage.getItem('token');
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      } catch (error) {
        console.error('Error al decodificar token:', error);
        return null;
      }
    },
    async cargarMaterias() {
      try {
        this.materias = await getTodasLasMateriasPrimas();
      } catch (error) {
        console.error("Error al cargar las materias primas:", error);
        this.mostrarSnackbar("Error al cargar las materias primas", "error");
      }
    },
    mostrarSnackbar(mensaje, color = "success") {
      this.snackbar.message = mensaje;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    async aceptar(materia) {
      const userId = this.getUserIdFromToken();
      if (!userId) {
        this.mostrarSnackbar("Sesión no válida. Vuelve a iniciar sesión.", "error");
        return;
      }

      try {
        const response = await aceptarMateriaPrima(materia.id, userId);
        this.mostrarSnackbar(`Materia aceptada  (hash: ${response.hash.slice(0, 10)}...)`, "success");
        await this.cargarMaterias();
      } catch (error) {
        console.error("Error al aceptar:", error);
        this.mostrarSnackbar("Error al aceptar materia prima", "error");
      }
    },
    rechazoDialog(index) {
      this.rechazoIndex = index;
      this.motivoRechazo = "";
    },
    async enviarRechazo(materia) {
      const userId = this.getUserIdFromToken();
      if (!userId) {
        this.mostrarSnackbar("Sesión no válida. Vuelve a iniciar sesión.", "error");
        return;
      }

      if (!this.motivoRechazo.trim()) {
        this.mostrarSnackbar("Por favor ingresa un motivo de rechazo", "warning");
        return;
      }

      try {
        const response = await rechazarMateriaPrima(materia.id, this.motivoRechazo, userId);
        this.mostrarSnackbar(`Materia rechazada  (hash: ${response.hash.slice(0, 10)}...)`, "success");
        this.rechazoIndex = null;
        await this.cargarMaterias();
      } catch (error) {
        console.error(" Error al rechazar:", error);
        this.mostrarSnackbar("Error al rechazar materia prima", "error");
      }
    },
    formatFecha(timestamp) {
      if (!timestamp) return "Sin fecha";
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

    async visualizarArchivo(cid, filename) {
      try {
        await visualizarCertificado(cid, filename);
      } catch (e) {
        this.mostrarSnackbar("Error al visualizar certificado", "error");
      }
    },

  },


};
</script>

<style scoped>
.v-card-title {
  background-color: #f5f5f5;
}
</style>
