import api from '@/httpClient';

// Obtener las órdenes del operario (por su userId)
export const getOrdenesPorUsuario = async (userId) => {
    try {
        const response = await api.get(`/tejeduria/ordenes/${userId}`);
        return response.data.ordenes; // <-- extraer solo el array si el backend devuelve { ordenes: [...] }
    } catch (error) {
        console.error("❌ Error al obtener órdenes del operario:", error);
        throw error;
    }
};

// Iniciar una orden de producción
export const iniciarOrden = async (id, userId) => {
    try {
        const response = await api.post('/tejeduria/iniciar', { id, userId });
        return response.data;
    } catch (error) {
        console.error("❌ Error al iniciar la orden:", error);
        throw error;
    }
};

// Finalizar una orden de producción
export const finalizarOrden = async (id, pesoTelaObtenida, relacionLoteHilo, userId) => {
    try {
        const response = await api.post('/tejeduria/finalizar', {
            id,
            pesoTelaObtenida,
            relacionLoteHilo,
            userId
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error al finalizar la orden:", error);
        throw error;
    }
};

// Registrar observación durante ejecución
export const registrarObservacion = async (id, texto, userId) => {
    try {
        const response = await api.post('/tejeduria/observacion', {
            id,
            texto,
            userId
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error al registrar observación:", error);
        throw error;
    }
};


export const getOrdenesVisibles = async (userId) => {
    try {
        const response = await api.get(`/tejeduria/ordenes/visibles/${userId}`);
        return response.data.ordenes || [];
    } catch (error) {
        console.error('Error al obtener órdenes visibles:', error);
        throw error;
    }
};
// Obtener el resumen del usuario (rol_id, is_admin, cargo_id)
export const getResumenUsuario = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}/resumen`);
        return response.data.user; // Devuelve el objeto con role_id, is_admin, cargo_id
    } catch (error) {
        console.error("❌ Error al obtener el resumen del usuario:", error);
        throw error;
    }
};

