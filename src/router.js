
import {createRouter, createWebHistory} from "vue-router";
import proveedorDashboardComponent from "@/Proveedor/pages/proveedor-dashboard.component.vue";
import loginComponent from "@/Login/pages/loginComponent.vue";
import adminDashboardComponent from "@/Produccion/Admin/pages/admin-dashboard.component.vue";
import validarMateriaComponent from "@/Produccion/Validacion/pages/validar-materia.component.vue";
import tejeduriaComponent from "@/Produccion/Tejeduria/pages/tejeduria.component.vue";
import inicioComponent from "@/Produccion/Admin/pages/inicio.component.vue";
import stockMateriaComponent from "@/Produccion/Validacion/pages/stock-materia.component.vue";
import tintoreriaComponent from "@/Produccion/Tintoreria/pages/tintoreria.component.vue";
import activarCuentaComponent from "./Produccion/Admin/components/activar-cuenta.component.vue";
import confeccionComponent from "@/Produccion/Confeccion/pages/confeccion.component.vue";


const  routes =[
    {path:'/', component:loginComponent},
    {path: '/admin-dashboard', component: adminDashboardComponent},
    {path: '/proveedor-dashboard', component: proveedorDashboardComponent},
    {path: '/validar-materia-prima',component: validarMateriaComponent},
    {path:'/tejeduria',component: tejeduriaComponent},
    {path:'/tintoreria',component: tintoreriaComponent},
    {path: '/inicio',component: inicioComponent},
    {path: '/stock-materia-prima',component: stockMateriaComponent},
    {path: '/activar-cuenta', component: activarCuentaComponent},

    {path:'/confeccion',component: confeccionComponent}, // Asumiendo que confección usa el mismo componente de tejeduría


]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router




