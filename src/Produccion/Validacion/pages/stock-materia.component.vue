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
          <v-row justify="center" align="start" dense>
            <v-col cols="12">
              <stock-materia-view />
            </v-col>

            <v-col cols="12" md="4">
              <crear-op-component />
            </v-col>

            <v-col cols="12" md="8">
              <vista-op-component />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import SidebarComponent from "@/public/components/sidebar-produccion.component.vue";
import HeaderComponent from "@/public/components/header.component.vue";
import StockMateriaView from "@/Produccion/Validacion/components/stock-materia-view.component.vue";
import CrearOpComponent from "@/Produccion/Validacion/components/crear-op.component.vue";
import VistaOpComponent from "@/Produccion/Validacion/components/vista-op.component.vue";

export default {
  name: "StockMateriaPage",
  components: {
    HeaderComponent,
    SidebarComponent,
    StockMateriaView,
    CrearOpComponent,
    VistaOpComponent,
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
