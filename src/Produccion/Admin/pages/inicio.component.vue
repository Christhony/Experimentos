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

            <v-col cols="12" md="4" class="mb-6">
              <v-card class="pa-4" elevation="3" rounded="lg">
                <generate-keys />
              </v-card>
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
import GenerateKeys from "@/public/components/generate-keys.component.vue";

export default {
  name: "InicioPage",
  components: {
    HeaderComponent,
    SidebarComponent,
    GenerateKeys,

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
