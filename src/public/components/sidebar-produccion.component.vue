<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    :permanent="true"
    :mini-variant="!drawer"
    class="custom-drawer"
    width="260"
    mini-variant-width="64"
  >
    <!-- Perfil de usuario -->
    <v-list-item class="profile-section pa-4">
      <template #prepend>
        <v-avatar size="48">
          <v-icon size="48" color="primary">mdi-account-circle</v-icon>
        </v-avatar>
      </template>
      <div v-if="drawer" class="ml-3">
        <div class="font-weight-bold">{{ username }}</div>
        <div class="text-caption">
          <span v-if="role">{{ role }}</span>
          <span v-if="cargo"> - {{ cargo }}</span>
        </div>
      </div>
    </v-list-item>

    <!-- Botón de toggle -->
    <v-btn icon class="toggle-btn" @click="drawer = !drawer" variant="text">
      <v-icon>{{ drawer ? 'mdi-chevron-left' : 'mdi-chevron-right' }}</v-icon>
    </v-btn>

    <v-divider class="my-1"></v-divider>

    <!-- Ítems del menú -->
    <v-list nav density="compact">
      <v-list-item
        v-for="(item, index) in filteredMenuItems"
        :key="index"
        :to="item.to"
        :active="selected === item.to"
        @click="navigateTo(item.to)"
        class="custom-item"
        active-class="active-item"
        link
      >
        <template #prepend>
          <v-icon :color="selected === item.to ? 'primary' : 'grey-darken-2'">
            {{ item.icon }}
          </v-icon>
        </template>
        <v-list-item-title v-if="drawer" class="text-body-2">
          {{ item.text }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-spacer></v-spacer>

    <!-- Logout -->
    <v-divider class="my-1"></v-divider>
    <v-list density="compact">
      <v-list-item @click="logout" class="custom-item" link>
        <template #prepend>
          <v-icon color="red">mdi-logout</v-icon>
        </template>
        <v-list-item-title v-if="drawer" class="text-body-2">Cerrar sesión</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { getAssignedPages } from "@/public/services/public-api.service";
import { getUsuariosRolCargo } from '../services/public-api.service';

// Función para decodificar JWT y obtener payload
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error al decodificar JWT:', e);
    return null;
  }
}

export default {
  name: 'SidebarProduction',
  data() {
    return {
      drawer: true,
      selected: "/inicio",
      username: "Usuario",
      role: "Rol",
      cargo: "",
      allowedRoutes: [],
      allMenuItems: [
        { icon: "mdi-home", text: "Inicio", to: "/inicio" },
        { icon: "mdi-account-cog", text: "Gestión de Usuarios", to: "/admin-dashboard" },
        { icon: "mdi-check-circle-outline", text: "Validación de Materia Prima", to: "/validar-materia-prima" },
        { icon: "mdi-warehouse", text: "Stock de Materia Prima", to: "/stock-materia-prima" },
        { icon: "mdi-tshirt-crew", text: "Tejeduría", to: "/tejeduria" },
        { icon: "mdi-palette-swatch", text: "Tintorería", to: "/tintoreria" },
        { icon: "mdi-tshirt-crew", text: "Confección", to: "/confeccion" },
        { icon: "mdi-eye-check", text: "Inspección", to: "/inspeccion" },
        { icon: "mdi-warehouse", text: "Almacén", to: "/almacen" },
      ],
    };
  },
  computed: {
    filteredMenuItems() {
      return this.allMenuItems.filter(item => this.allowedRoutes.includes(item.to));
    },
  },
  watch: {
    // Actualiza el selected cuando la ruta cambie
    '$route.path'(newPath) {
      this.selected = newPath;
    },
  },
  created() {
    this.loadPagesFromToken();
    this.initUser();
  },
  methods: {
    getUserIdFromToken() {
      const token = localStorage.getItem("token");
      if (!token) return null;
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.userId;
      } catch (error) {
        console.error("Error al decodificar token:", error);
        return null;
      }
    },
    async loadPagesFromToken() {
      const userId = this.getUserIdFromToken();
      if (!userId) return;

      try {
        const pages = await getAssignedPages(userId);
        this.allowedRoutes = pages.map(p => p.ruta);
        localStorage.setItem("userPages", JSON.stringify(this.allowedRoutes));
      } catch (error) {
        console.error("Error al cargar páginas asignadas:", error);
      }
    },
    async initUser() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const decoded = parseJwt(token);
        const currentUserId = decoded ? decoded.userId || decoded.user_id : null;

        if (!currentUserId) throw new Error('No userId found in token');

        const usuarios = await getUsuariosRolCargo();

        const currentUser = usuarios.find((user) => user.user_id === currentUserId);

        if (currentUser) {
          this.username = currentUser.username;
          this.cargo = currentUser.cargo || '';
          this.role =
            currentUser.rol === 'admin'
              ? 'Administrador'
              : currentUser.rol || '';
        } else {
          this.username = 'Usuario';
          this.role = 'Rol desconocido';
          this.cargo = '';
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        this.username = 'Usuario';
        this.role = 'Rol desconocido';
        this.cargo = '';
      }
    },
    navigateTo(to) {
      this.selected = to;
      this.$router.push(to);
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userPages');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.custom-drawer {
  background-color: #f4f6f8;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
}

.profile-section {
  align-items: center;
  justify-content: flex-start;
  display: flex;
}

.toggle-btn {
  position: absolute;
  top: 8px;
  right: -12px;
  background-color: #ffffff;
  border: 2px solid #2196F3;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgb(45, 157, 153);
  z-index: 10;
}

.custom-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: background-color 0.2s ease;
}

.active-item {
  background-color: #2196F3 !important;
  color: white !important;
}

.v-list-item-title {
  font-weight: bold;
}
</style>
