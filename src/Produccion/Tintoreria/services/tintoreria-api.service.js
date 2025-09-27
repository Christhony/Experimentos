import api from "@/httpClient";

// ✅ Obtener el stock agrupado por número de OP
export const obtenerStockPorNumeroOP = async () => {
    try {
        const response = await api.get(`/tejeduria/stock-por-op`);
        return response.data.data;
    } catch (error) {
        console.error("❌ Error al obtener stock por número de OP:", error);
        throw error;
    }
};
// ✅ Crear una orden de Tintorería
export const crearOrdenDeTintoreria = async ({ numeroOrdenProduccion, peso, userId }) => {
    try {
        const response = await api.post(`/tintoreria/crear`, {
            numeroOrdenProduccion,
            peso,
            userId
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error al crear orden de Tintorería:", error.response?.data || error);
        throw new Error(error.response?.data?.message || "Error al crear orden de Tintorería");
    }
};


// ✅ Obtener todas las órdenes de Tintorería
export const obtenerTodasLasOrdenesTintoreria = async () => {
    try {
        const response = await api.get('/tintoreria/ordenes');
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener órdenes de Tintorería:", error.response?.data || error);
        throw new Error(error.response?.data?.message || "Error al obtener órdenes de Tintorería");
    }
};