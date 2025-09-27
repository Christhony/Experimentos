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
          <v-row justify="center" align="start" dense>
            <!-- Stock de telas agrupado por OP -->
            <v-col cols="12">
              <stock-telas-por-op />
            </v-col>

            <!-- Formulario y vista de órdenes lado a lado en pantallas grandes -->
            <v-col cols="12" md="6">
              <formulario-crear-orden-tintoreria />
            </v-col>

            <v-col cols="12" md="6">
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
import StockTelasPorOp from "@/Produccion/Tintoreria/components/stock.component.vue";
import FormularioCrearOrdenTintoreria from "@/Produccion/Tintoreria/components/crear-op.component.vue";
import VistaOpComponent from "@/Produccion/Tintoreria/components/vista-op.component.vue";

export default {
  name: "TintoreriaPage",
  components: {
    HeaderComponent,
    SidebarComponent,
    StockTelasPorOp,
    FormularioCrearOrdenTintoreria,
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
