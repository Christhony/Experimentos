<template>
  <v-row justify="center" class="mt-6">
    <v-col cols="12" sm="10" md="6" lg="5">
      <div class="text-center">
        <v-icon size="40" color="success" class="mb-2">mdi-key</v-icon>

        <h2 class="text-h6 font-weight-bold mb-4">
          {{ publicKey ? 'Aquí puedes ver tu clave pública' : 'Genera tus claves para firmar' }}
        </h2>
        <!-- Botón para generar clave pública -->
        <v-btn
            v-if="!publicKey"
            color="success"
            style="max-width: 250px; width: 100%;"
            class="mx-auto"
            @click="generateKeys"
        >
          <v-icon start>mdi-lock</v-icon>
          Generar clave
        </v-btn>

        <!-- Alerta con clave pública -->
        <v-alert
            v-if="publicKey"
            type="info"
            class="text-left mt-4"
            density="comfortable"
            variant="tonal"
        >
          <div class="font-weight-medium mb-2">Clave pública:</div>
          <div class="text-break">{{ publicKey }}</div>
        </v-alert>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { generateKeys, getPublicKey } from "@/public/services/public-api.service.js";

export default {
  name: "GenerateKeys",
  data() {
    return {
      publicKey: "",
    };
  },
  created() {
    this.fetchPublicKey();
  },
  methods: {
    getUserIdFromToken() {
      const token = localStorage.getItem("token");
      if (!token) return null;

      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.userId;
      } catch (e) {
        console.error("Error al decodificar el token:", e);
        return null;
      }
    },

    // Fetch la clave pública
    async fetchPublicKey() {
      const userId = this.getUserIdFromToken();
      if (!userId) {
        console.error("User ID no encontrado en el token.");
        return;
      }

      try {
        const publicKey = await getPublicKey(userId);
        if (publicKey) {
          this.publicKey = publicKey;
        }
      } catch (error) {
        console.error("Error al obtener la clave pública:", error);
      }
    },

    // Generar las claves
    async generateKeys() {
      const userId = this.getUserIdFromToken();
      if (!userId) {
        console.error("User ID no encontrado en el token.");
        return;
      }

      try {
        const response = await generateKeys(userId);
        this.publicKey = response.publicKey;
        this.$emit("keysGenerated", this.publicKey);
      } catch (error) {
        console.error("Error al generar las claves:", error);
      }
    },
  },
};
</script>

<style scoped>
.text-break {
  word-break: break-word;
}
</style>
