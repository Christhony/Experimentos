<template>
  <v-container fluid class="pa-6 register-material-container">
    <v-card class="shadow-lg rounded-3" elevation="12">
      <v-card-title class="text-h5 font-weight-bold">
        <v-icon color="primary" class="mr-2">mdi-pencil-outline</v-icon>
        Registrar Materia Prima
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="registerRawMaterial">
          <v-text-field label="Nombre de la Materia Prima" v-model="rawMaterial.nombreMateria" :rules="[rules.required]"
            outlined dense prepend-icon="mdi-palette" />

          <v-textarea label="Descripción" v-model="rawMaterial.descripcion" :rules="[rules.required]" outlined dense
            prepend-icon="mdi-text" rows="2" />

          <v-text-field label="Peso Neto" v-model="rawMaterial.pesoNeto" :rules="[rules.required]" outlined dense
            type="number" prepend-icon="mdi-weight-kilogram" />

          <v-text-field label="Unidad de Medida" v-model="rawMaterial.unidadMedida" outlined dense
            prepend-icon="mdi-ruler" readonly />

          <v-text-field label="Orden de Referencia" v-model="rawMaterial.ordenReferencia" :rules="[rules.required]"
            outlined dense prepend-icon="mdi-file-document-outline" />

          <v-text-field label="Empresa Proveedora" v-model="rawMaterial.supplierCompany" :rules="[rules.required]"
            outlined dense prepend-icon="mdi-industry" />

          <v-text-field label="Enlaces IPFS" v-model="rawMaterial.ipfsLinks" :rules="[rules.required]" outlined dense
            prepend-icon="mdi-link" hint="Separa los enlaces con comas" persistent-hint
            :readonly="uploadedFile.cid !== null" />

          <!-- Selector de archivo estilizado -->
          <div class="d-flex flex-column align-center justify-center border-dashed pa-8 rounded-lg mb-4"
            style="border: 2px dashed #1976D2; cursor: pointer;" @click="$refs.fileInput.click()">
            <template v-if="!archivoSeleccionado">
              <v-icon size="48" color="primary">mdi-plus</v-icon>
              <span class="mt-2">Haz clic para seleccionar un archivo</span>
            </template>

            <template v-else>
              <v-icon size="48" color="success">{{ getFileIcon(archivoSeleccionado.name) }}</v-icon>
              <span class="mt-2 text-subtitle-2 font-weight-medium text-success">
                {{ archivoSeleccionado.name }}
              </span>
              <span class="text-caption">Archivo cargado correctamente</span>
            </template>

            <input ref="fileInput" type="file" accept=".pdf,image/*" style="display: none;" @change="onFileSelected" />
          </div>

          <v-btn v-if="uploadedFile.cid" color="success" class="mt-2" @click="visualizarArchivo">
            Visualizar img/pdf
          </v-btn>

          <v-btn type="submit" color="primary" class="w-100 mt-4">
            Registrar
          </v-btn>
        </v-form>
      </v-card-text>

      <v-alert v-if="formError" type="warning" elevation="2" dense class="mt-4">
        <v-icon left color="warning">mdi-alert-circle</v-icon>
        <strong>¡Advertencia!</strong> Completa todos los campos obligatorios.
      </v-alert>

      <v-card-actions v-if="transactionHash">
        <v-alert type="success" elevation="2" dense>
          <v-icon left color="success">mdi-check-circle</v-icon>
          <strong>Transacción registrada con éxito:</strong>
          <p>{{ transactionHash }}</p>
        </v-alert>
      </v-card-actions>
    </v-card>
  </v-container>
</template>



<script>
import { registerRawMaterial, uploadEncryptedFile } from "@/Proveedor/services/rawMaterial-api.service.js";
import axios from "axios";

export default {
  name: "RegisterRawMaterial",
  data() {
    return {
      archivoSeleccionado: null,
      rawMaterial: {
        nombreMateria: "",
        descripcion: "",
        pesoNeto: "",
        unidadMedida: "Kg",
        ordenReferencia: "",
        supplierCompany: "",
        ipfsLinks: ""
      },
      uploadedFile: {
        cid: "",
        filename: ""
      },
      transactionHash: null,
      formError: false,
      rules: {
        required: (v) => !!v || "Este campo es obligatorio"
      }
    };
  },
  computed: {
    isFormValid() {
      const r = this.rawMaterial;
      return (
        r.nombreMateria &&
        r.descripcion &&
        r.pesoNeto &&
        r.unidadMedida &&
        r.ordenReferencia &&
        r.supplierCompany &&
        r.ipfsLinks
      );
    }
  },
  methods: {
    onFileSelected(event) {
      this.archivoSeleccionado = event.target.files[0];
      this.handleFileUpload(); // ahora sí llama a tu lógica tal cual la escribiste
    },
    getFileIcon(fileName) {
      const ext = fileName.split('.').pop().toLowerCase();
      if (ext === 'pdf') return 'mdi-file-pdf-box';
      if (['jpg', 'jpeg', 'png'].includes(ext)) return 'mdi-file-image';
      if (['doc', 'docx'].includes(ext)) return 'mdi-file-word-box';
      return 'mdi-file';
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

    async registerRawMaterial() {
      if (!this.isFormValid) {
        this.formError = true;
        return;
      }

      this.formError = false;
      const userId = this.getUserIdFromToken();
      if (!userId) {
        console.error("No se encontró un userId válido en el token");
        return;
      }

      const rawMaterialData = {
        ...this.rawMaterial,
        ipfsLinks: this.rawMaterial.ipfsLinks.split(",").map(link => link.trim()),
        userId
      };

      try {
        const tx = await registerRawMaterial(rawMaterialData);
        this.transactionHash = tx.transactionHash || tx.hash;
      } catch (error) {
        console.error("Error al registrar la materia prima:", error);
      }
    },

    async handleFileUpload() {
      const file = this.archivoSeleccionado;
      if (!file) {
        console.warn("Archivo no válido o no seleccionado");
        return;
      }

      try {
        const response = await uploadEncryptedFile(file);
        this.uploadedFile.cid = response.cid;
        this.uploadedFile.filename = file.name;

        const url = `https://gateway.pinata.cloud/ipfs/${response.cid}`;
        this.rawMaterial.ipfsLinks = this.rawMaterial.ipfsLinks
          ? `${this.rawMaterial.ipfsLinks},${url}`
          : url;

      } catch (error) {
        console.error("Error al subir el archivo encriptado:", error);
      }
    },

    async visualizarArchivo() {
      const { cid, filename } = this.uploadedFile;
      if (!cid || !filename) return;

      try {
        const response = await axios.get("http://localhost:5000/api/ipfs/download-decrypted", {
          params: { cid, filename },
          responseType: "blob"
        });

        const blob = new Blob([response.data], { type: response.headers["content-type"] });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank"); // esto hace que se abra como visor PDF si el tipo es correcto

      } catch (error) {
        console.error("Error al visualizar el archivo:", error);
      }
    }

  }
};
</script>



<style scoped>
.register-material-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.v-btn {
  font-size: 16px;
  padding: 12px;
  transition: all 0.3s ease;
}

.v-btn:hover {
  background-color: #28a745;
}

.v-card {
  border-radius: 16px;
}

.v-alert {
  font-size: 14px;
}

.border-dashed {
  border-style: dashed;
  transition: background-color 0.2s ease;
}

.border-dashed:hover {
  background-color: #f4f6fa;
}
</style>
