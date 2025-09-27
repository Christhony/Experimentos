<template>
  <v-app>
    <v-layout>
      <!-- Header -->
      <header-component />

      <!-- Sidebar -->
      <sidebar-component />

      <!-- Contenido principal -->
      <v-main class="main-content">
        <v-container fluid class="dashboard-container">
          <v-row justify="center" align="stretch" dense>
            <!-- Si es admin global o admin de tejeduría -->
            <vista-op-admin v-if="esAdminGlobal || esAdminTejeduria" />

            <!-- Si es operario normal -->
            <template v-else>
              <vista-op-operario />
              <vista-op-finalizadas />
            </template>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import SidebarComponent from "@/public/components/sidebar-produccion.component.vue";
import HeaderComponent from "@/public/components/header.component.vue";
import VistaOpOperario from "@/Produccion/Tejeduria/components/vista-op-operario.component.vue";
import VistaOpFinalizadas from "@/Produccion/Tejeduria/components/op-finalizada.component.vue";
import VistaOpAdmin from "@/Produccion/Tejeduria/components/vista-op-admin.component.vue";

import { getResumenUsuario } from "@/Produccion/Tejeduria/services/tejeduria-api.service";

export default {
  name: "TejeduriaPage",
  components: {
    HeaderComponent,
    SidebarComponent,
    VistaOpOperario,
    VistaOpFinalizadas,
    VistaOpAdmin,
  },
  data() {
    return {
      esAdminGlobal: false,
      esAdminTejeduria: false,
    };
  },
  async created() {
    await this.verificarRolUsuario();
  },
  methods: {
    getUserIdFromToken() {
      const token = localStorage.getItem("token");
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.userId;
      } catch (e) {
        console.error("❌ Error al decodificar el token:", e);
        return null;
      }
    },
    async verificarRolUsuario() {
      const userId = this.getUserIdFromToken();
      if (!userId) {
        this.$router.push("/login");
        return;
      }

      try {
        const resumen = await getResumenUsuario(userId);
        this.esAdminGlobal = resumen.role_id === 1;
        this.esAdminTejeduria = resumen.role_id === 3 && resumen.is_admin === 1;
      } catch (error) {
        console.error("❌ Error al obtener resumen de usuario:", error);
      }
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  background-color: #f5f9fc;
  min-height: 100vh;
  padding-top: 24px;
}
.main-content {
  background-color: #f5f9fc;
}
</style>
