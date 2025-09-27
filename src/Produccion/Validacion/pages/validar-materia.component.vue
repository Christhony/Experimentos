<template>
  <v-app>
    <v-layout>
      <!-- Header -->
      <header-component></header-component>

      <!-- Sidebar -->
      <sidebar-component />

      <!-- Contenido principal -->
      <v-main class="main-content">
        <v-container fluid class="dashboard-container">
          <v-row justify="center" align="stretch" dense>
            <!-- Componente de Validación de Materias Primas -->
            <v-col cols="12">
              <v-card class="pa-4" elevation="3" rounded="lg">
                <validar-materias />
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import ValidarMaterias from "@/Produccion/Validacion/components/recepcion-materia.component.vue";
import SidebarComponent from "@/public/components/sidebar-produccion.component.vue";
import HeaderComponent from "@/public/components/header.component.vue";

export default {
  name: "ValidarMateriaPage",
  components: {
    HeaderComponent,
    SidebarComponent,
    ValidarMaterias,
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
