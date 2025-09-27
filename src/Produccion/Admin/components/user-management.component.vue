<template>
  <v-container fluid class="pa-6 user-management-container">
    <v-row justify="center" align="start" dense>
      <!-- Formulario: IZQUIERDA -->
      <v-col cols="12" md="5">
        <v-card class="pa-6 form-card">
          <v-card-title class="text-h5 font-weight-bold mb-4 primary--text">
            <v-icon color="primary" class="mr-2">mdi-account-multiple</v-icon>
            Gestión de Usuarios
          </v-card-title>

          <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-4" closable>
            {{ successMessage }}
          </v-alert>

          <v-form @submit.prevent="createUser">
            <v-row dense>
              <v-col cols="12">
                <v-text-field v-model="user.username" label="Nombre de Usuario" prepend-inner-icon="mdi-account"
                  variant="outlined" dense required />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="user.email" label="Correo Electrónico" prepend-inner-icon="mdi-email"
                  type="email" variant="outlined" dense required />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="user.password" label="Contraseña" type="password" prepend-inner-icon="mdi-lock"
                  variant="outlined" dense required />
              </v-col>
              <v-col cols="12">
                <v-select v-model="user.role_id" :items="roles" item-title="role_name" item-value="role_id" label="Rol"
                  prepend-inner-icon="mdi-account-key" variant="outlined" dense @change="onRoleChange" required />
              </v-col>

              <!-- Campos condicionales -->
              <v-col cols="12" v-if="user.role_id === 2">
                <v-text-field v-model="user.nombre_empresa" label="Nombre de la Empresa"
                  prepend-inner-icon="mdi-office-building" variant="outlined" dense required />
              </v-col>
              <v-col cols="12" v-if="user.role_id === 2">
                <v-text-field v-model="user.ruc" label="RUC" prepend-inner-icon="mdi-card-account-details"
                  variant="outlined" dense required />
              </v-col>
              <v-col cols="12" v-if="user.role_id === 3">
                <v-text-field v-model="user.cargo" label="Cargo" prepend-inner-icon="mdi-briefcase" variant="outlined"
                  dense required />
              </v-col>
              <v-col cols="12" v-if="user.role_id === 3">
                <v-text-field v-model="user.codigo_operario" label="Código de Operario" prepend-inner-icon="mdi-barcode"
                  variant="outlined" dense required />
              </v-col>
            </v-row>

            <v-btn type="submit" color="primary" block class="mt-4">
              <v-icon start>mdi-plus</v-icon>
              Crear Usuario
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

      <!-- Tabla: DERECHA -->
      <v-col cols="12" md="7">
        <v-card elevation="4" rounded="lg" class="pa-6">
          <h3 class="mb-4 font-weight-bold text-h6">Usuarios Registrados</h3>

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
                <!-- eslint-disable-next-line vue/valid-v-slot -->
                <template #item.actions="{ item }">
                  <v-icon small color="blue" class="mr-2" @click="editUser(item)">mdi-pencil</v-icon>
                  <v-icon small color="red" @click="deleteUser(item)">mdi-delete</v-icon>
                </template>
              </v-data-table>
            </v-window-item>

            <!-- PROVEEDORES -->
            <v-window-item value="proveedores">
              <v-data-table :headers="headers.proveedores" :items="proveedores" items-per-page="5" density="compact"
                hover elevation="1" variant="tonal" fixed-header no-data-text="No hay proveedores registrados">
                <!-- eslint-disable-next-line vue/valid-v-slot -->
                <template #item.actions="{ item }">
                  <v-icon small color="blue" class="mr-2" @click="editUser(item)">mdi-pencil</v-icon>
                  <v-icon small color="red" @click="deleteUser(item)">mdi-delete</v-icon>
                </template>
              </v-data-table>
            </v-window-item>

            <!-- OPERARIOS -->
            <v-window-item value="operarios">
              <v-data-table :headers="headers.operarios" :items="operarios" items-per-page="5" density="compact" hover
                elevation="1" variant="tonal" fixed-header no-data-text="No hay operarios registrados">
                <!-- eslint-disable-next-line vue/valid-v-slot -->
                <template #item.actions="{ item }">
                  <v-icon small color="blue" class="mr-2" @click="editUser(item)">mdi-pencil</v-icon>
                  <v-icon small color="red" @click="deleteUser(item)">mdi-delete</v-icon>
                </template>
              </v-data-table>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <!-- DIÁLOGO DE EDICIÓN -->
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
                <v-text-field v-model="userToEdit.username" label="Nombre de Usuario" 
                  prepend-inner-icon="mdi-account" variant="outlined" dense required />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="userToEdit.email" label="Correo Electrónico" 
                  prepend-inner-icon="mdi-email" type="email" variant="outlined" dense required />
              </v-col>
              <v-col cols="12">
                <v-select v-model="userToEdit.role_id" :items="roles" item-title="role_name" item-value="role_id" 
                  label="Rol" prepend-inner-icon="mdi-account-key" variant="outlined" dense required />
              </v-col>

              <!-- Campos condicionales -->
              <v-col cols="12" v-if="userToEdit.role_id === 2">
                <v-text-field v-model="userToEdit.nombre_empresa" label="Nombre de la Empresa"
                  prepend-inner-icon="mdi-office-building" variant="outlined" dense required />
              </v-col>
              <v-col cols="12" v-if="userToEdit.role_id === 2">
                <v-text-field v-model="userToEdit.ruc" label="RUC" 
                  prepend-inner-icon="mdi-card-account-details" variant="outlined" dense required />
              </v-col>
              <v-col cols="12" v-if="userToEdit.role_id === 3">
                <v-text-field v-model="userToEdit.cargo" label="Cargo" 
                  prepend-inner-icon="mdi-briefcase" variant="outlined" dense required />
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
          <v-btn color="secondary" @click="dialogEditUser = false">
            Cancelar
          </v-btn>
          <v-btn color="primary" @click="confirmUpdateUser" :loading="isUpdating">
            Guardar Cambios
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIÁLOGO DE CONFIRMACIÓN DE ELIMINACIÓN -->
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
import { createUser, getRoles, getUsersByRole, updateUser, deleteUser } from "@/Produccion/Admin/services/admin-api.service";

export default {
  name: "UserManagement",
  data() {
    return {
      tab: "admins",
      user: {
        username: "",
        email: "",
        password: "",
        role_id: null,
        nombre_empresa: "",
        ruc: "",
        cargo: "",
        codigo_operario: "",
      },
      dialogEditUser: false,
      dialogConfirmDelete: false,
      userToEdit: {},
      userToDelete: null,
      roles: [],
      successMessage: "",
      isUpdating: false,
      isDeleting: false,
      admins: [],
      proveedores: [],
      operarios: [],
      headers: {
        admins: [
          { title: "N°", value: "index" },
          { title: "Usuario", value: "username" },
          { title: "Email", value: "email" },
          { title: "Acciones", value: "actions", sortable: false },
        ],
        proveedores: [
          { title: "N°", value: "index" },
          { title: "Usuario", value: "username" },
          { title: "Email", value: "email" },
          { title: "Empresa", value: "nombre_empresa" },
          { title: "RUC", value: "ruc" },
          { title: "Acciones", value: "actions", sortable: false },
        ],
        operarios: [
          { title: "N°", value: "index" },
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
        const response = await getRoles();
        this.roles = response.data;
      } catch (error) {
        console.error("Error al obtener los roles:", error);
        this.showError("Error al cargar los roles");
      }
    },
    async createUser() {
      try {
        await createUser(this.user);
        this.successMessage = "Usuario creado exitosamente";
        this.resetForm();
        await this.fetchUsersByRole();
        setTimeout(() => (this.successMessage = ""), 3000);
      } catch (error) {
        console.error("Error al crear el usuario:", error);
        this.showError("Error al crear el usuario");
      }
    },
    async fetchUsersByRole() {
      try {
        const [admins, proveedores, operarios] = await Promise.all([
          getUsersByRole(1),
          getUsersByRole(2),
          getUsersByRole(3)
        ]);

        this.admins = admins.map((u, i) => ({
          index: i + 1,
          user_id: u.user_id,
          username: u.username || "---",
          email: u.email || "---",
          role_id: u.role_id
        }));

        this.proveedores = proveedores.map((u, i) => ({
          index: i + 1,
          user_id: u.user_id,
          username: u.username || "---",
          email: u.email || "---",
          nombre_empresa: u.nombre_empresa || "---",
          ruc: u.ruc || "---",
          role_id: u.role_id
        }));

        this.operarios = operarios.map((u, i) => ({
          index: i + 1,
          user_id: u.user_id,
          username: u.username || "---",
          email: u.email || "---",
          cargo: u.cargo || "---",
          codigo_operario: u.codigo_operario || "---",
          role_id: u.role_id
        }));
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        this.showError("Error al cargar usuarios");
      }
    },
    onRoleChange() {
      this.user.nombre_empresa = "";
      this.user.ruc = "";
      this.user.cargo = "";
      this.user.codigo_operario = "";
    },
    editUser(user) {
      this.userToEdit = JSON.parse(JSON.stringify(user));
      this.dialogEditUser = true;
    },
    async confirmUpdateUser() {
      try {
        this.isUpdating = true;
        await updateUser(this.userToEdit.user_id, this.userToEdit);
        this.successMessage = "Usuario actualizado exitosamente";
        this.dialogEditUser = false;
        await this.fetchUsersByRole();
        setTimeout(() => (this.successMessage = ""), 3000);
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
        this.showError("Error al actualizar usuario");
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
        this.successMessage = "Usuario eliminado exitosamente";
        this.dialogConfirmDelete = false;
        await this.fetchUsersByRole();
        setTimeout(() => (this.successMessage = ""), 3000);
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        this.showError("Error al eliminar usuario");
      } finally {
        this.isDeleting = false;
      }
    },
    resetForm() {
      this.user = {
        username: "",
        email: "",
        password: "",
        role_id: null,
        nombre_empresa: "",
        ruc: "",
        cargo: "",
        codigo_operario: "",
      };
    },
    showError(message) {
      this.successMessage = message;
      setTimeout(() => (this.successMessage = ""), 3000);
    }
  },
};
</script>

<style scoped>
.user-management-container {
  background: #f5f9fc;
  min-height: 100vh;
}

.form-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.08);
}

.table-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
</style>