import api from "@/httpClient";

export const getRoles = async () => {
    try {
        const response = await api.get('/users/roles/todos');
        return response.data?.data || []; // 🔧 esto es lo correcto
    } catch (error) {
        console.error("Error al obtener los roles:", error?.response?.data?.message || error.message);
        throw new Error("No se pudieron obtener los roles. Intenta nuevamente.");
    }
};


export const getPages = async () => {
    try {
        const response = await api.get('/users/pages');
        return response.data?.data || [];
    } catch (error) {
        console.error("Error al obtener las páginas:", error?.response?.data?.message || error.message);
        throw new Error("No se pudieron obtener las páginas.");
    }
};

export const getCargos = async () => {
    try {
        const response = await api.get('/users/cargos');
        return response.data?.data || [];
    } catch (error) {
        console.error("Error al obtener los cargos:", error?.response?.data?.message || error.message);
        throw new Error("No se pudieron obtener los cargos.");
    }
};


// Función para crear un usuario
export const createUser = async (userData) => {
    try {
        if (userData.role_id === 3 && !userData.cargoInfo?.cargo_id) {
            throw new Error("Falta el cargo para operario.");
        }

        const response = await api.post('/users/register', userData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el usuario:", error?.response?.data?.message || error.message);
        throw new Error("No se pudo crear el usuario. Verifica los datos e intenta nuevamente.");
    }
};


// Función para actualizar un usuario
export const updateUser = async (user_id, userData) => {
    try {
        const response = await api.put(`/users/${user_id}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el usuario:", error?.response?.data?.message || error.message);
        throw new Error("No se pudo actualizar el usuario. Verifica los datos e intenta nuevamente.");
    }
};


// Función para eliminar un usuario
export const deleteUser = async (user_id) => {
    try {
        const response = await api.delete(`/users/${user_id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el usuario:", error?.response?.data?.message || error.message);
        throw new Error("No se pudo eliminar el usuario. Verifica e intenta nuevamente.");
    }
};

export const getUsersByRole = async (roleId) => {
    try {
        const response = await api.get(`/users/role/${roleId}`);

        const users = response?.data?.data || [];

        console.log(`Usuarios obtenidos para el rol ${roleId}:`, users);

        return users;
    } catch (error) {
        const errorMessage =
            error?.response?.data?.message || error.message || "Error desconocido al obtener usuarios.";
        console.error(`Error al obtener usuarios para el rol ${roleId}:`, errorMessage);
        throw new Error(errorMessage);
    }
};


// Función para activar la cuenta (actualizar contraseña)
export const activateAccount = async (token, password) => {
    try {
        const response = await api.post('/users/activate-account', {
            token,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Error al activar la cuenta:", error?.response?.data?.error || error.message);
        throw new Error("No se pudo activar la cuenta. Intenta nuevamente.");
    }
};
