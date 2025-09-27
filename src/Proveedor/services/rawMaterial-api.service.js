import api   from "@/httpClient";
import axios from "axios";


export const registerRawMaterial = async (rawMaterialData) => {
    try {
        const response = await api.post('/materia-prima/registrar', rawMaterialData);
        return response.data;
    } catch (error) {
        console.error("Error al registrar la materia prima:", error);
        throw error;
    }
};

export const getMateriaPrima = async (id) => {
    try {
        const response = await api.get(`/materia-prima/verRegistro/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener la materia prima:", error);
        throw error;
    }
};


export const getMateriasPorProveedor = async (userId) => {
    try {
        const response = await api.get(`/materia-prima/por-user/${userId}`);
        return response.data.materias;
    } catch (error) {
        console.error("Error al obtener los registros de materia prima:", error);
        throw error;
    }
};

export const editarMateriaPrima = async (datos) => {
    try {
        const response = await api.put("/materia-prima/editar", datos);
        return response.data;
    } catch (error) {
        console.error("Error al editar materia prima:", error);
        throw error;
    }
};

export const eliminarMateriaPrima = async (id, userId) => {
    try {
        const response = await api.delete("/materia-prima/eliminar", {
            data: { id, userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar materia prima:", error);
        throw error;
    }
};


// Descargar y desencriptar archivo desde IPFS

export const uploadEncryptedFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post("http://localhost:5000/api/ipfs/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data; 
};

export const downloadDecryptedFile = async (cid, filename = "archivo.pdf") => {
  const response = await axios.get("http://localhost:5000/api/ipfs/download-decrypted", {
    params: { cid, filename },
    responseType: "blob"
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  return url;
};
