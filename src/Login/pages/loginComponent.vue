<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card elevation="12" class="pa-4">
              <v-card-title class="text-h5 text-center">
                <v-icon color="primary" class="mr-2">mdi-login</v-icon>
                Iniciar Sesión
              </v-card-title>

              <v-card-text>
                <v-form @submit.prevent="submitForm" ref="formRef" v-model="formValid">
                  <v-text-field
                      v-model="email"
                      label="Correo electrónico"
                      :rules="emailRules"
                      prepend-icon="mdi-email"
                      type="email"
                      required
                  ></v-text-field>

                  <v-text-field
                      v-model="password"
                      label="Contraseña"
                      prepend-icon="mdi-lock"
                      type="password"
                      :rules="passwordRules"
                      required
                  ></v-text-field>

                  <v-btn type="submit" color="primary" block class="mt-4">
                    <v-icon left>mdi-check</v-icon>
                    Entrar
                  </v-btn>

                  <v-row class="d-flex justify-center mt-3">
                    <v-col cols="auto">
                      <v-btn text @click="recoverPassword">¿Olvidaste tu contraseña?</v-btn>
                    </v-col>
                  </v-row>
                </v-form>

                <v-alert v-if="error" type="error" class="mt-3">
                  {{ error }}
                </v-alert>
              </v-card-text>

              <v-card-actions class="justify-center">
                <!-- Botón Limpiar sin modal -->
                <v-btn text @click="resetForm">
                  <v-icon left color="red">mdi-close-circle</v-icon>
                  Limpiar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '@/Login/services/login-api.service.js'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref(null)
const formValid = ref(false)
const formRef = ref(null)

const emailRules = [
  (v) => !!v || 'El correo es requerido',
  (v) => /.+@.+\..+/.test(v) || 'El correo debe ser válido'
]

const passwordRules = [(v) => !!v || 'La contraseña es obligatoria']

const submitForm = async () => {
  error.value = null
  if (!formRef.value.validate()) return

  try {
    const response = await loginUser({ email: email.value, password: password.value })
    const token = response.data.data.token
    if (!token) {
      error.value = 'Token no recibido. Intenta nuevamente.'
      return
    }

    let decodedToken
    try {
      decodedToken = JSON.parse(atob(token.split('.')[1]))
    } catch {
      error.value = 'Error al procesar el token.'
      return
    }

    const { userId, role_id } = decodedToken
    if (!userId || !role_id) {
      error.value = 'Datos de usuario incompletos.'
      return
    }

    localStorage.setItem('token', token)

    // Rutas basadas en el rol
    if (role_id === 1) {
      router.push('/inicio')
    } else if (role_id === 3) {
      router.push('/inicio')
    } else if (role_id === 2) {
      router.push('/proveedor-dashboard')
    } else {
      error.value = 'No tienes permisos para acceder.'
    }
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = 'Credenciales incorrectas.'
    } else {
      error.value = 'Error al iniciar sesión.'
    }
  }
}

const resetForm = () => {
  email.value = ''
  password.value = ''
  formRef.value.reset()
}

const recoverPassword = () => {
  router.push('/recuperar-contraseña')
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #2196F3, #21CBF3);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
