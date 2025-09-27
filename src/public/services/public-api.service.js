import api from "@/httpClient";

export const generateKeys = async (userId) => {
    try {
        const response = await api.post('/users/generate-keys', { userId }); // Endpoint para generar las claves
        return response.data;
    } catch (error) {
        console.error("Error al generar las claves:", error);
        throw error;
    }
};
export const getPublicKey = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}/public-key`);
        return response.data.publicKey;
    } catch (error) {
        console.error("Error al obtener la clave pública:", error);
        throw error;
    }
};
export const getAssignedPages = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}/pages-asignadas`);
        return response.data?.data || [];
    } catch (error) {
        console.error("Error al obtener páginas asignadas:", error);
        throw new Error("No se pudieron obtener las páginas asignadas.");
    }
};

export const getUsuariosRolCargo = async () => {
    try {
      const response = await api.get('/users/usuarios/rol-cargo');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener usuarios con rol y cargo:', error);
      throw error;
    }
  };
