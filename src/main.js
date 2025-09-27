// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

// Importar router
import router from './router' // todo en minúsculas

// Importar Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Importar íconos
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})

// Crear la app e inyectar Vuetify y el router
createApp(App)
    .use(vuetify)
    .use(router) // Agrega el router aquí
    .mount('#app')
