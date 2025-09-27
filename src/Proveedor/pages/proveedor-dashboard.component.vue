<template>
  <v-app>
    <!-- Header -->
    <v-app-bar app color="#1db9fc" density="comfortable" elevation="2">
      <v-container class="d-flex align-center justify-space-between">
        <!-- Sección del nombre de la app y el ícono -->
        <div class="d-flex align-center">
          <v-icon class="mr-2" color="white">mdi-tshirt-crew</v-icon>
          <v-toolbar-title class="text-white font-weight-bold">TextilChain</v-toolbar-title>
        </div>

        <!-- Sección del nombre del proveedor, ícono de perfil y cerrar sesión -->
        <div class="d-flex align-center">
          <!-- Ícono de perfil -->
          <v-avatar size="40" class="mr-2">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>

          <!-- Nombre del proveedor -->
          <span class="text-white mr-3">{{ userName }}</span> <!-- Usar un simple elemento HTML -->

          <!-- Ícono de cerrar sesión -->
          <v-btn @click="logout" icon color="white">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-main>
      <v-container fluid class="pa-6">
        <!-- Pestañas de navegación -->
        <v-row justify="center" spacing="4">
          <v-col cols="12" md="8">
            <v-tabs v-model="activeTab" color="primary" background-color="grey lighten-4" dark>
              <v-tab>Generar Claves</v-tab>
              <v-tab>Registrar Materia Prima</v-tab>
              <v-tab>Ver Materias Registradas</v-tab>
            </v-tabs>

            <v-tab-items v-model="activeTab">
              <!-- Generar claves -->
              <v-tab-item v-if="activeTab === 0">
                <v-card elevation="3" class="pa-4 rounded-lg" style="background-color: #f0f0f0;">
                  <generate-keys @keysGenerated="updatePublicKey" />
                </v-card>
              </v-tab-item>

              <!-- Registrar Materia Prima -->
              <v-tab-item v-if="activeTab === 1">
                <register-raw-material />
              </v-tab-item>

              <!-- Ver Materias Registradas -->
              <v-tab-item v-if="activeTab === 2">
                <v-card elevation="3" class="pa-4 rounded-lg" style="background-color: #f0f0f0;">
                  <materias-proveedor />
                </v-card>
              </v-tab-item>
            </v-tab-items>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { getUserData } from "@/Login/services/login-api.service.js";
import GenerateKeys from "@/public/components/generate-keys.component.vue";
import RegisterRawMaterial from "@/Proveedor/components/register-raw-material.component.vue";
import MateriasProveedor from "@/Proveedor/components/materias-proveedor.component.vue";

export default {
  name: "ProveedorDashboard",
  components: {
    GenerateKeys,
    RegisterRawMaterial,
    MateriasProveedor,
  },
  data() {
    return {
      userName: "",
      publicKey: "",
      activeTab: 0,
    };
  },
  created() {
    this.fetchUserData();
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
    async fetchUserData() {
      const userId = this.getUserIdFromToken();

      if (userId) {
        try {
          const response = await getUserData(userId);
          this.userName = response.data.data.username || "Proveedor";
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
          this.userName = "Proveedor";
        }
      } else {
        this.userName = "Proveedor";
      }
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      this.$router.push("/");
    },

    updatePublicKey(publicKey) {
      this.publicKey = publicKey;
    },
  },
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
  background-color: #ffffff;
}

.v-card {
  border-radius: 16px;
}

.v-alert {
  font-size: 14px;
}
</style>
