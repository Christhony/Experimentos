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
          <!-- CARD que envuelve Stock + OP Corte -->
          <v-card class="pa-4 mb-4" color="#fafafa">


            <!-- Contenido del card -->
            <v-card-text class="pa-0">
              <v-row dense>
                <!-- Columna 1: Stock -->
                <v-col cols="12" md="6" class="pa-2">
                  <v-card class="pa-4 fill-height-card">
                    <stock-confeccion-component />
                  </v-card>
                </v-col>

                <!-- Columna 2: Órdenes de Corte -->
                <v-col cols="12" md="6" class="pa-2">
                  <v-card class="pa-4 fill-height-card">
                    <crear-op-corte-component />
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Segundo CARD debajo (ejemplo, para que veas cómo poner más cards) -->
          <v-card class="pa-4 mb-4" color="#fafafa">
            <v-card-title class="font-weight-bold text-body-1 mb-2">
              Otro Panel (Ejemplo debajo)
            </v-card-title>
            <v-card-text>
              <!-- Tu contenido aquí -->
              <p>Este es un ejemplo de otro card que puedes poner debajo.</p>
            </v-card-text>
          </v-card>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import SidebarComponent from "@/public/components/sidebar-produccion.component.vue";
import HeaderComponent from "@/public/components/header.component.vue";
import stockConfeccionComponent from "@/Produccion/Confeccion/components/stockConfeccion.component.vue";
import crearOpCorteComponent from "@/Produccion/Confeccion/components/crearOpCorte.component.vue";

export default {
  name: "confeccionComponent",
  components: {
    HeaderComponent,
    SidebarComponent,
    stockConfeccionComponent,
    crearOpCorteComponent
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

/* Para que los cards internos ocupen todo el alto del col */
.fill-height-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Los v-card grandes del panel tienen fondo leve */
.v-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
