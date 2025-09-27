<template>
  <v-app>
    <v-layout>
      <!-- Encabezado -->
      <header-component />

      <!-- Sidebar lateral -->
      <sidebar-component />

      <!-- Contenido principal -->
      <v-main class="main-content">
        <v-container fluid class="dashboard-container">
          <v-row dense align="stretch" no-gutters>
            <!-- Formulario: Crear Usuario -->
            <v-col cols="12" md="6" class="pa-4">
              <v-card elevation="4" class="form-card equal-card">
                <v-card-title class="text-h6 font-weight-bold">
                  👤 Crear Usuario
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <create-user />
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Tabla: Lista de Usuarios -->
            <v-col cols="12" md="6" class="pa-4">
              <v-card elevation="4" class="table-card equal-card">
                <v-card-title class="text-h6 font-weight-bold">
                  📋 Usuarios Registrados
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <user-list />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import CreateUser from "@/Produccion/Admin/components/create-user.component.vue";
import UserList from "@/Produccion/Admin/components/user-list.component.vue";
import SidebarComponent from "@/public/components/sidebar-produccion.component.vue";
import HeaderComponent from "@/public/components/header.component.vue";

export default {
  name: "AdminDashboard",
  components: {
    HeaderComponent,
    SidebarComponent,
    CreateUser,
    UserList,
  },
};
</script>

<style scoped>
.dashboard-container {
  background-color: #f5f9fc;
  min-height: 100vh;
  padding-top: 16px;
}
.main-content {
  background-color: #f5f9fc;
}
.form-card,
.table-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}
.equal-card {
  height: 100%;
}
.v-card-title {
  padding-bottom: 8px;
}
.v-card-text {
  flex: 1;
  padding-top: 12px;
}
</style>