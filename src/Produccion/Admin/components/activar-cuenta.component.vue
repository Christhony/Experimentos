<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="text-h5">Activar Cuenta</v-card-title>
          <v-card-text>
            <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-4">
              Cuenta activada correctamente. Ahora puedes iniciar sesión.
            </v-alert>
            <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">
              {{ errorMessage }}
            </v-alert>
            <v-form @submit.prevent="submitActivation">
              <v-text-field
                v-model="password"
                label="Nueva Contraseña"
                type="password"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                dense
                required
              />
              <v-text-field
                v-model="confirmPassword"
                label="Confirmar Contraseña"
                type="password"
                prepend-inner-icon="mdi-lock-check"
                variant="outlined"
                dense
                required
              />
              <v-btn type="submit" color="primary" block class="mt-4">
                <v-icon start>mdi-check</v-icon>
                Activar Cuenta
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { activateAccount } from "@/Produccion/Admin/services/admin-api.service";

export default {
  name: "ActivarCuenta",
  data() {
    return {
      password: "",
      confirmPassword: "",
      successMessage: false,
      errorMessage: "",
    };
  },
  computed: {
    token() {
      // Leer el token de la URL (query param ?token=xxx)
      return this.$route.query.token || "";
    },
  },
  methods: {
    async submitActivation() {
      try {
        if (!this.token) {
          throw new Error("Token no válido.");
        }
        if (!this.password || !this.confirmPassword) {
          throw new Error("Debes completar ambos campos de contraseña.");
        }
        if (this.password !== this.confirmPassword) {
          throw new Error("Las contraseñas no coinciden.");
        }

        // Enviar al backend
        await activateAccount(this.token, this.password);

        this.successMessage = true;
        this.errorMessage = "";

        // Redirigir al login después de 2 seg
        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } catch (error) {
        console.error("Error al activar la cuenta:", error.message);
        this.errorMessage = error.message;
        this.successMessage = false;
      }
    },
  },
};
</script>
