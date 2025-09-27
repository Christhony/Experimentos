<template>
  <v-container fluid style="max-width: 1400px; width: 100%;" class="pa-6">
    <v-row justify="center">
      <v-col cols="12" md="12" style="width: 100%;">
        <v-tabs v-model="tab" color="primary" align-tabs="center" center-active grow stacked bg-color="transparent">
          <v-tab value="admins">Administradores</v-tab>
          <v-tab value="proveedores">Proveedores</v-tab>
          <v-tab value="operarios">Operarios</v-tab>
        </v-tabs>

        <v-window v-model="tab" class="mt-4">

          <!-- ADMINISTRADORES -->
          <v-window-item value="admins">
            <v-data-table :headers="headers.admins" :items="admins" items-per-page="5" density="compact" hover
              elevation="1" variant="tonal" fixed-header no-data-text="No hay administradores registrados">
              <template v-slot:[`item.actions`]="{ item }"> <v-icon small color="blue" class="mr-2"
                  @click="editUser(item)">mdi-pencil</v-icon>
                <v-icon small color="red" @click="deleteUser(item)">mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-window-item>

          <!-- PROVEEDORES -->
          <v-window-item value="proveedores">
            <v-data-table :headers="headers.proveedores" :items="proveedores" items-per-page="5" density="compact" hover
              elevation="1" variant="tonal" fixed-header no-data-text="No hay proveedores registrados">
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon small color="blue" class="mr-2" @click="editUser(item)">mdi-pencil</v-icon>
                <v-icon small color="red" @click="deleteUser(item)">mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-window-item>

          <!-- OPERARIOS -->
          <v-window-item value="operarios">
            <v-data-table :headers="headers.operarios" :items="operarios" items-per-page="5" density="compact" hover
              elevation="1" variant="tonal" fixed-header no-data-text="No hay operarios registrados">
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon small color="blue" class="mr-2" @click="editUser(item)">mdi-pencil</v-icon>
                <v-icon small color="red" @click="deleteUser(item)">mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-window-item>

        </v-window>
      </v-col>
    </v-row>

    <!-- DIÁLOGO EDITAR USUARIO -->
    <v-dialog v-model="dialogEditUser" max-width="600" persistent>
      <v-card>
        <v-card-title class="text-h5 font-weight-bold primary--text">
          <v-icon color="primary" class="mr-2">mdi-account-edit</v-icon>
          Editar Usuario
        </v-card-title>

        <v-card-text>
          <v-form ref="editForm">
            <v-row dense>
              <v-col cols="12">
                <v-text-field v-model="userToEdit.username" label="Nombre de Usuario" prepend-inner-icon="mdi-account"
                  variant="outlined" dense required />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="userToEdit.email" label="Correo Electrónico" prepend-inner-icon="mdi-email"
                  type="email" variant="outlined" dense required />
              </v-col>
              <v-col cols="12">
                <v-select v-model="userToEdit.role_id" :items="roles" item-title="role_name" item-value="role_id"
                  label="Rol" prepend-inner-icon="mdi-account-key" variant="outlined" dense disabled />
              </v-col>

              <!-- PROVEEDOR -->
              <v-col cols="12" v-if="userToEdit.role_id === 2">
                <v-text-field v-model="userToEdit.nombre_empresa" label="Nombre de la Empresa"
                  prepend-inner-icon="mdi-office-building" variant="outlined" dense />
              </v-col>
              <v-col cols="12" v-if="userToEdit.role_id === 2">
                <v-text-field v-model="userToEdit.ruc" label="RUC" prepend-inner-icon="mdi-card-account-details"
                  variant="outlined" dense />
              </v-col>

              <!-- OPERARIO -->
              <v-col cols="12" v-if="userToEdit.role_id === 3">
                <v-select v-model="userToEdit.cargo_id" :items="cargos" item-title="nombre" item-value="cargo_id"
                  label="Cargo" prepend-inner-icon="mdi-briefcase" variant="outlined" dense required />
              </v-col>
              <v-col cols="12" v-if="userToEdit.role_id === 3">
                <v-text-field v-model="userToEdit.codigo_operario" label="Código de Operario"
                  prepend-inner-icon="mdi-barcode" variant="outlined" dense required />
              </v-col>

            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogEditUser = false">Cancelar</v-btn>
          <v-btn color="primary" @click="confirmUpdateUser" :loading="isUpdating">Guardar Cambios</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIÁLOGO CONFIRMAR ELIMINACIÓN -->
    <v-dialog v-model="dialogConfirmDelete" max-width="400">
      <v-card>
        <v-card-title class="text-h6 d-flex align-center">
          <v-icon color="warning" class="mr-2">mdi-alert</v-icon>
          Confirmar acción
        </v-card-title>
        <v-card-text>
          ¿Estás seguro que deseas eliminar al usuario
          <strong>{{ userToDelete?.username }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogConfirmDelete = false">Cancelar</v-btn>
          <v-btn color="red" variant="tonal" @click="confirmDeleteUser" :loading="isDeleting">
            <v-icon start>mdi-delete</v-icon>
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
import { getUsersByRole, updateUser, deleteUser, getRoles, getCargos, getPages } from "@/Produccion/Admin/services/admin-api.service";

export default {
  name: "UserList",
  data() {
    return {
      tab: "admins",
      dialogEditUser: false,
      dialogConfirmDelete: false,
      userToEdit: {},
      userToDelete: null,
      isUpdating: false,
      isDeleting: false,
      admins: [],
      proveedores: [],
      operarios: [],
      roles: [],
      headers: {
        admins: [
          { title: "Nº", value: "index" },
          { title: "Usuario", value: "username" },
          { title: "Email", value: "email" },
          { title: "Acciones", value: "actions", sortable: false },
        ],
        proveedores: [
          { title: "Nº", value: "index" },
          { title: "Usuario", value: "username" },
          { title: "Email", value: "email" },
          { title: "Empresa", value: "nombre_empresa" },
          { title: "RUC", value: "ruc" },
          { title: "Acciones", value: "actions", sortable: false },
        ],
        operarios: [
          { title: "Nº", value: "index" },
          { title: "Usuario", value: "username" },
          { title: "Email", value: "email" },
          { title: "Cargo", value: "cargo" },
          { title: "Código", value: "codigo_operario" },
          { title: "Acciones", value: "actions", sortable: false },
        ],
      },
    };
  },
  mounted() {
    this.fetchRoles();
    this.fetchUsersByRole();
  },
  methods: {
    async fetchRoles() {
      try {
        const rolesData = await getRoles();
        this.roles = rolesData;
      } catch (err) {
        console.error("Error al obtener roles:", err.message);
      }
    },

    async fetchCargosAndPages() {
      try {
        const [cargosRes, pagesRes] = await Promise.all([getCargos(), getPages()]);
        this.cargos = Array.isArray(cargosRes) ? cargosRes.map(c => ({
          cargo_id: Number(c.cargo_id),
          nombre: c.nombre
        })) : []; this.pages = Array.isArray(pagesRes) ? pagesRes : [];
      } catch (error) {
        console.error(" Error al obtener cargos o páginas:", error);
      }
    },

    async fetchUsersByRole() {
      const loadRole = async (roleId, stateKey, transform) => {
        try {
          const users = await getUsersByRole(roleId);
          this[stateKey] = users.map((u, i) => transform(u, i));
        } catch (err) {
          console.error(`Error cargando usuarios ${stateKey}:`, err.message);
          this[stateKey] = [];
        }
      };

      await Promise.all([
        loadRole(1, "admins", (u, i) => ({ index: i + 1, user_id: u.user_id, username: u.username, email: u.email, role_id: u.role_id })),
        loadRole(2, "proveedores", (u, i) => ({ index: i + 1, user_id: u.user_id, username: u.username, email: u.email, nombre_empresa: u.nombre_empresa, ruc: u.ruc, role_id: u.role_id })),
        loadRole(3, "operarios", (u, i) => ({
          index: i + 1,
          user_id: u.user_id,
          username: u.username,
          email: u.email,
          cargo: u.cargo,
          cargo_id: Number(u.cargo_id),
          codigo_operario: u.codigo_operario,
          role_id: u.role_id
        })),
      ]);
    },
    async editUser(user) {
      await this.fetchCargosAndPages()
      this.userToEdit = {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        nombre_empresa: user.nombre_empresa,
        ruc: user.ruc,
        cargo_id: user.cargo_id ?? (this.cargos.find(c => c.nombre === user.cargo)?.cargo_id ?? null),
        codigo_operario: user.codigo_operario
      };

      this.dialogEditUser = true;
    },


    async confirmUpdateUser() {
      try {
        this.isUpdating = true;
        await updateUser(this.userToEdit.user_id, this.userToEdit);
        this.dialogEditUser = false;
        await this.fetchUsersByRole();
      } catch (error) {
        console.error("Error al actualizar usuario:", error.message);
      } finally {
        this.isUpdating = false;
      }
    },
    deleteUser(user) {
      this.userToDelete = user;
      this.dialogConfirmDelete = true;
    },
    async confirmDeleteUser() {
      try {
        this.isDeleting = true;
        await deleteUser(this.userToDelete.user_id);
        this.dialogConfirmDelete = false;
        this.userToDelete = null;
        await this.fetchUsersByRole();
      } catch (error) {
        console.error("Error al eliminar usuario:", error.message);
      } finally {
        this.isDeleting = false;
      }
    },
  },
};
</script>

<style scoped>
.pa-6 {
  padding: 24px;
}
</style>
