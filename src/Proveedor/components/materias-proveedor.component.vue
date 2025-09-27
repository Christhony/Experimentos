<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-6">
      <v-col cols="12">
        <v-text h2 class="font-weight-bold">Mis Registros de Materia Prima</v-text>
      </v-col>
    </v-row>

    <v-row v-if="materias.length > 0" justify="start" spacing="4">
      <v-col v-for="(materia, index) in materias" :key="index" cols="12" md="6" lg="4">
        <v-card class="mb-4 shadow-lg" :elevation="2">
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon color="primary" class="mr-2">mdi-file-document</v-icon>
            {{ materia.nombreMateria }}
          </v-card-title>

          <v-card-subtitle class="text-body-2">Detalles de la Materia Prima</v-card-subtitle>

          <v-card-text>
            <p><strong>Descripción:</strong> {{ materia.descripcion }}</p>
            <p><strong>Peso Neto:</strong> {{ materia.pesoNeto }} {{ materia.unidadMedida }}</p>
            <p><strong>Proveedor:</strong> {{ materia.proveedor }}</p>
            <p><strong>Orden de Referencia:</strong> {{ materia.ordenReferencia }}</p>
            <p><strong>Empresa Proveedora:</strong> {{ materia.supplierCompany }}</p>
            <p><strong>Estado:</strong> {{ materia.estado }}</p>
            <v-row v-for="(link, i) in materia.ipfsLinks" :key="i" class="mb-2">
              <v-col cols="12">
                <v-sheet class="pa-3 d-flex align-center justify-space-between rounded-lg elevation-1" color="#f5f7fa">
                  <div class="d-flex align-center">
                    <v-icon large color="blue darken-2" class="mr-3">mdi-file-certificate</v-icon>
                    <div>
                      <div class="font-weight-medium text-body-1">Certificado de Materia Prima.pdf</div>
                      <div class="text-caption grey--text">CID: {{ link.substring(0, 12) }}...</div>
                    </div>
                  </div>
                  <v-btn small color="primary" @click="visualizarArchivo(link, 'certificado_materia_prima.pdf')">
                    Ver
                  </v-btn>
                </v-sheet>
              </v-col>
            </v-row>



            <p v-if="materia.motivoRechazo"><strong>Motivo de Rechazo:</strong> {{ materia.motivoRechazo }}</p>
            <p><strong>Fecha de Registro:</strong> {{ formatFecha(materia.fechaRegistro) }}</p>
            <p v-if="materia.fechaAceptacion"><strong>Fecha de Aceptación:</strong> {{
              formatFecha(materia.fechaAceptacion) }}</p>
            <p v-if="materia.fechaRechazo"><strong>Fecha de Rechazo:</strong> {{ formatFecha(materia.fechaRechazo) }}
            </p>
          </v-card-text>

          <v-card-actions v-if="materia.estado === 'Enviado'">
            <v-btn color="primary" @click="abrirModalEditar(materia)">Editar</v-btn>
            <v-btn color="error" @click="confirmarEliminar(materia)">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else justify="center" class="mt-6">
      <v-col cols="12" class="text-center">
        <v-alert type="info" elevation="2" class="pa-4">
          No se han encontrado registros de materia prima para este proveedor.
        </v-alert>
      </v-col>
    </v-row>

    <!-- Modal Editar -->
    <v-dialog v-model="dialogEditar" max-width="600px">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">Editar Materia Prima</v-card-title>
        <v-card-text>
          <v-form ref="formEditar">
            <v-text-field v-model="materiaEdit.nombreMateria" label="Nombre" required dense />
            <v-text-field v-model="materiaEdit.descripcion" label="Descripción" required dense />
            <v-text-field v-model="materiaEdit.pesoNeto" label="Peso Neto" type="number" required dense />
            <v-text-field v-model="materiaEdit.unidadMedida" label="Unidad" required dense />
            <v-text-field v-model="materiaEdit.ordenReferencia" label="Orden Referencia" required dense />
            <v-text-field v-model="materiaEdit.supplierCompany" label="Empresa" required dense />
            <v-text-field v-model="materiaEdit.ipfsLinksText" label="IPFS (separado por coma)" required dense />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="guardarEdicion">Guardar</v-btn>
          <v-btn text @click="dialogEditar = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmación eliminar -->
    <v-dialog v-model="dialogEliminar" max-width="400px">
      <v-card>
        <v-card-title class="headline">¿Eliminar registro?</v-card-title>
        <v-card-text>Esta acción no se puede deshacer.</v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="eliminarMateria">Eliminar</v-btn>
          <v-btn text @click="dialogEliminar = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import {
  getMateriasPorProveedor,
  editarMateriaPrima,
  eliminarMateriaPrima
} from "@/Proveedor/services/rawMaterial-api.service.js";

export default {
  name: "MateriasProveedor",
  data() {
    return {
      materias: [],
      dialogEditar: false,
      dialogEliminar: false,
      materiaEdit: {},
      idAEliminar: null,
      snackbar: {
        show: false,
        message: "",
        color: "success"
      }
    };
  },
  created() {
    this.fetchMateriasPorProveedor();
  },
  methods: {
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
    async fetchMateriasPorProveedor() {
      const userId = this.getUserIdFromToken();
      if (!userId) return;
      this.materias = await getMateriasPorProveedor(userId);
    },
    formatFecha(timestamp) {
      if (!timestamp) return "No registrada";
      const date = new Date(timestamp * 1000);
      return date.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    },
    abrirModalEditar(materia) {
      this.materiaEdit = {
        ...materia,
        ipfsLinksText: materia.ipfsLinks.join(", ")
      };
      this.dialogEditar = true;
    },
    async guardarEdicion() {
      const userId = this.getUserIdFromToken();
      const payload = {
        userId,
        id: this.materiaEdit.id,
        nombreMateria: this.materiaEdit.nombreMateria,
        descripcion: this.materiaEdit.descripcion,
        pesoNeto: parseInt(this.materiaEdit.pesoNeto),
        unidadMedida: this.materiaEdit.unidadMedida,
        ordenReferencia: this.materiaEdit.ordenReferencia,
        supplierCompany: this.materiaEdit.supplierCompany,
        ipfsLinks: this.materiaEdit.ipfsLinksText.split(",").map(i => i.trim())
      };

      try {
        await editarMateriaPrima(payload);
        this.dialogEditar = false;
        this.snackbar = { show: true, message: "Materia actualizada", color: "success" };
        this.fetchMateriasPorProveedor();
      } catch (e) {
        this.snackbar = { show: true, message: "Error al editar", color: "error" };
      }
    },
    confirmarEliminar(materia) {
      this.idAEliminar = materia.id;
      this.dialogEliminar = true;
    },
    async eliminarMateria() {
      const userId = this.getUserIdFromToken();
      try {
        await eliminarMateriaPrima(this.idAEliminar, userId);
        this.dialogEliminar = false;
        this.snackbar = { show: true, message: "Materia eliminada", color: "success" };
        this.fetchMateriasPorProveedor();
      } catch (e) {
        this.snackbar = { show: true, message: "Error al eliminar", color: "error" };
      }
    },

    async visualizarArchivo(cid, filename) {
      try {
        const response = await fetch(`http://localhost:5000/api/ipfs/download-decrypted?cid=${cid}&filename=${filename}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } catch (error) {
        this.snackbar = { show: true, message: "Error al visualizar archivo", color: "error" };
        console.error("Error al visualizar:", error);
      }
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 12px;
  padding: 20px;
}

.v-card-title {
  background-color: #f7f7f7;
}

.v-alert {
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
}
</style>
