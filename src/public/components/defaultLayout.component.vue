<template>
  <v-app>
    <header-component class="fixed-header" />

    <v-layout class="fixed-layout">
      <sidebar-component class="fixed-sidebar" />

      <v-main class="scrollable-main">
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import HeaderComponent from "@/public/components/header.component.vue";
import SidebarComponent from "@/public/components/sidebar-produccion.component.vue";

export default {
  name: "DefaultLayout",
  components: {
    HeaderComponent,
    SidebarComponent,
  },
};
</script>

<style scoped>
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.fixed-layout {
  margin-top: 64px;
}

.fixed-sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  height: calc(100vh - 64px);
  z-index: 999;
}

.scrollable-main {
  margin-left: 260px;
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 64px);
  background-color: #f5f9fc;
}
</style>
