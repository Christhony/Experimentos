<template>
  <v-container fluid>
    <v-row justify="center" align="start" dense>
      <v-col cols="12" md="10" style="width: 100%;">

        <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-4" closable>
          Usuario creado exitosamente.
        </v-alert>

        <v-form @submit.prevent="createUser">
          <v-row dense>
            <!-- Datos básicos -->
            <v-col cols="12" md="6">
              <v-text-field v-model="user.username" label="Nombre de Usuario" prepend-inner-icon="mdi-account"
                variant="outlined" dense required />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="user.email" label="Correo Electrónico" prepend-inner-icon="mdi-email" type="email"
                variant="outlined" dense required />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="user.password" label="Contraseña" type="password" prepend-inner-icon="mdi-lock"
                variant="outlined" dense required />
            </v-col>

            <!-- Rol -->
            <v-col cols="12" md="6">
              <v-select v-model.number="user.role_id" :items="roles" item-title="role_name" item-value="role_id"
                label="Rol" prepend-inner-icon="mdi-account-key" variant="outlined" dense @change="onRoleChange"
                required />
            </v-col>

            <!-- Proveedor -->
            <v-col cols="12" md="6" v-if="user.role_id === 2">
              <v-text-field v-model="user.nombre_empresa" label="Nombre de la Empresa"
                prepend-inner-icon="mdi-office-building" variant="outlined" dense required />
            </v-col>
            <v-col cols="12" md="6" v-if="user.role_id === 2">
              <v-text-field v-model="user.ruc" label="RUC" prepend-inner-icon="mdi-card-account-details"
                variant="outlined" dense required />
            </v-col>

            <!-- Operario -->
            <v-col cols="12" md="6" v-if="user.role_id === 3">
              <v-select v-model="selectedCargoId" :items="cargos" item-title="nombre" item-value="cargo_id"
                label="Cargo" prepend-inner-icon="mdi-briefcase" variant="outlined" dense required />
            </v-col>
            <v-col cols="12" md="6" v-if="user.role_id === 3">
              <v-text-field v-model="user.codigo_operario" label="Código de Operario" prepend-inner-icon="mdi-barcode"
                variant="outlined" dense required />
            </v-col>
            <v-col cols="12" md="6" v-if="user.role_id === 3">
              <v-checkbox v-model="isAdminProceso" label="¿Es administrador del proceso?" density="compact" />
            </v-col>

            <!-- Páginas -->
            <v-col cols="12" v-if="user.role_id === 3 && pages.length">
              <h5 class="mb-2">Páginas asignadas:</h5>
              <div
                style="max-height: 180px; overflow-y: auto; border: 1px solid #ccc; border-radius: 8px; padding: 12px;">
                <v-checkbox v-for="page in pages" :key="page.page_id" v-model="selectedPages" :label="page.nombre"
                  :value="page.page_id" density="compact" class="mb-1" />
              </div>
            </v-col>
          </v-row>

          <v-btn type="submit" color="primary" block class="mt-4">
            <v-icon start>mdi-plus</v-icon>
            Crear Usuario
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  createUser,
  getRoles,
  getCargos,
  getPages,
} from "@/Produccion/Admin/services/admin-api.service";

export default {
  name: "CreateUser",
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
        role_id: null,
        nombre_empresa: "",
        ruc: "",
        codigo_operario: "",
      },
      selectedCargoId: null,
      isAdminProceso: false,
      selectedPages: [],
      roles: [],
      cargos: [],
      pages: [],
      successMessage: false,
    };
  },
  mounted() {
    this.fetchRoles();
    if (this.user.role_id === 3) {
      this.fetchCargosAndPages();
    }
  },
  watch: {
    "user.role_id"(newRole) {
      if (Number(newRole) === 3) {
        this.fetchCargosAndPages();
      } else {
        this.clearOperarioData();
      }
    },
  },
  methods: {
    async fetchRoles() {
      try {
        const response = await getRoles();
        this.roles = Array.isArray(response)
          ? response.map((r) => ({
            ...r,
            role_name: r.role_name.trim(),
          }))
          : [];
      } catch (error) {
        console.error("Error al obtener los roles:", error);
      }
    },
    async fetchCargosAndPages() {
      try {
        const [cargosRes, pagesRes] = await Promise.all([getCargos(), getPages()]);
        this.cargos = Array.isArray(cargosRes) ? cargosRes : [];
        this.pages = Array.isArray(pagesRes) ? pagesRes : [];
      } catch (error) {
        console.error(" Error al obtener cargos o páginas:", error);
      }
    },
    async createUser() {
      try {
        if (!this.user.username || !this.user.email || !this.user.password || !this.user.role_id) {
          throw new Error("Por favor completa todos los campos obligatorios.");
        }

        if (this.user.role_id === 2 && (!this.user.nombre_empresa || !this.user.ruc)) {
          throw new Error("Por favor completa los campos de Proveedor.");
        }

        if (this.user.role_id === 3 && (!this.selectedCargoId || !this.user.codigo_operario)) {
          throw new Error("Por favor completa los campos de Operario.");
        }

        const payload = {
          username: this.user.username,
          email: this.user.email,
          password: this.user.password,
          role_id: this.user.role_id,
        };

        if (this.user.role_id === 2) {
          payload.nombre_empresa = this.user.nombre_empresa;
          payload.ruc = this.user.ruc;
        }

        if (this.user.role_id === 3) {
          payload.codigo_operario = this.user.codigo_operario;
          payload.cargoInfo = {
            cargo_id: this.selectedCargoId,
            is_admin: this.isAdminProceso ? 1 : 0,
            paginas: this.selectedPages,
          };
        }

        await createUser(payload);
        this.successMessage = true;
        this.clearForm();
        setTimeout(() => (this.successMessage = false), 3000);
        window.location.reload();

      } catch (error) {
        console.error("Error al crear el usuario:", error);
        alert(error.message || "Error al crear el usuario.");
      }
    },

    clearForm() {
      this.user.nombre_empresa = "";
      this.user.ruc = "";
      this.user.codigo_operario = "";
      this.selectedCargoId = null;
      this.isAdminProceso = false;
      this.selectedPages = [];
    },
    clearOperarioData() {
      this.selectedCargoId = null;
      this.isAdminProceso = false;
      this.selectedPages = [];
      this.cargos = [];
      this.pages = [];
    },
  },
};
</script>

<style scoped>
.text-h6 {
  font-size: 1.25rem;
}

h5 {
  font-size: 1rem;
}
</style>