import api   from "@/httpClient";

export const getTodasLasMateriasPrimas = async () => {
    try {
        const response = await api.get('/materia-prima/todas');
        return response.data.materias;
    } catch (error) {
        console.error("Error al obtener todas las materias primas:", error);
        throw error;
    }
};
export const aceptarMateriaPrima = async (id, userId) => {
    try {
        const response = await api.post('/materia-prima/aceptar', { id, userId });
        return response.data;
    } catch (error) {
        console.error("Error al aceptar la materia prima:", error);
        throw error;
    }
};

export const rechazarMateriaPrima = async (id, motivo, userId) => {
    try {
        const response = await api.post('/materia-prima/rechazar', { id, motivo, userId });
        return response.data;
    } catch (error) {
        console.error("Error al rechazar la materia prima:", error);
        throw error;
    }
};

export const getTodosLosLotes = async () => {
    try {
        const response = await api.get('/materia-prima/lotes');
        return response.data.lotes;
    } catch (error) {
        console.error("Error al obtener los lotes:", error);
        throw error;
    }
};

export const getStockPorLote = async (loteId) => {
    try {
        const response = await api.get(`/materia-prima/stock/${loteId}`);
        return response.data.stock;
    } catch (error) {
        console.error("Error al obtener el stock por lote:", error);
        throw error;
    }
};



/*export const consumirStock = async (loteId, cantidad, userId) => {
    try {
        const response = await api.post('/materia-prima/stock/consumir', {
            loteId,
            cantidad,
            userId
        });
        return response.data;
    } catch (error) {
        console.error("Error al consumir stock:", error);
        throw error;
    }
};*/

export const crearOrdenProduccion = async ({ numeroOrdenProduccion, maquina, lotes, operario, nombreOperario, destino, adminId }) => {
    try {
        const response = await api.post('/tejeduria/crear', {
            numeroOrdenProduccion,
            maquina,
            lotes,
            operario,
            nombreOperario,
            destino,
            adminId,
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear la orden de producción:', error);
        throw error;
    }
};


// Lotes disponibles
export const getLotesDisponibles = async () => {
    try {
        const response = await api.get('/materia-prima/lotes-disponibles');
        return response.data.lotes;
    } catch (error) {
        console.error("Error al obtener lotes disponibles:", error);
        throw error;
    }
};

export const getOperariosTejedores = async () => {
    try {
        const response = await api.get('/users/usuarios/operarios-tejedor');
        return response.data?.data || [];
    } catch (error) {
        console.error("Error al obtener operarios tejedores:", error);
        throw error;
    }
};


export const getTodasLasOrdenes = async () => {
    try {
        const response = await api.get('/tejeduria/ordenes');
        return response.data; // Debe devolver { ordenes: [...] }
    } catch (error) {
        console.error(" Error al obtener órdenes:", error);
        throw error;
    }
};

import axios from 'axios';

export const visualizarCertificado = async (cid, filename) => {
  try {
    const response = await axios.get('http://localhost:5000/api/ipfs/download-decrypted', {
      params: { cid, filename },
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error al visualizar certificado:', error);
    throw error;
  }
};

