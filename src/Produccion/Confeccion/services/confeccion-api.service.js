import api from "@/httpClient";

// Obtener stock real disponible para confección
export async function getStockRealDeConfeccion() {
    try {
        const response = await api.get("/tintoreria/stock/confeccion/real");
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener stock real de confección:", error);
        throw error;
    }
}

// Obtener lista de operarios con cargo "Confección corte"
export async function getOperariosConfeccionCorte() {
    try {
        const response = await api.get("/users/operarios-confeccionCorte");
        return response.data?.data || [];
    } catch (error) {
        console.error("❌ Error al obtener operarios de confección corte:", error);
        throw error;
    }
}

// Crear una orden de corte a partir del stock de Tintorería
export async function crearOrdenCorte(loteTintoreriaId, numeroOrdenProduccion, modelo, talla, operarioId, pesoTelaTenida, adminId, maquina) {
    try {
        const response = await api.post("/confeccion/corte", {
            loteTintoreriaId,
            numeroOrdenProduccion,
            modelo,
            talla,
            operarioId,
            pesoTelaTenida,  // Cambié 'cantidad' por 'pesoTelaTenida'
            adminId,
            maquina  // Asegúrate de pasar el campo 'maquina' también
        });
        return response.data;  // Devuelve la respuesta completa del servidor
    } catch (error) {
        console.error("❌ Error al crear orden de corte:", error.response?.data || error.message);  // Mejor manejo de errores
        throw error;  // Lanza el error para que pueda ser manejado por el frontend
    }
}

// Obtener todas las órdenes de corte
export async function getOrdenesCorte() {
    try {
        const response = await api.get("/confeccion/corte");
        // Asegúrate de manejar correctamente la estructura de la respuesta
        return response.data?.ordenes || [];  // Si no hay 'ordenes', devuelve un array vacío
    } catch (error) {
        console.error("❌ Error al obtener órdenes de corte:", error.response?.data || error.message);  // Mejor manejo de errores
        throw error;  // Lanza el error para que pueda ser manejado por el frontend
    }
}