<template>
  <div class="container">
    <h2>Detalles de la Materia Prima</h2>

    <!-- Mostrar detalles de la materia prima -->
    <div v-if="materiaPrima">
      <p><strong>Tipo de Material:</strong> {{ materiaPrima.tipoMaterial }}</p>
      <p><strong>Cantidad:</strong> {{ materiaPrima.cantidad }}</p>
      <p><strong>Proveedor:</strong> {{ materiaPrima.proveedor }}</p>
      <p><strong>Orden de Referencia:</strong> {{ materiaPrima.ordenReferencia }}</p>
      <p><strong>Proveedor Compañía:</strong> {{ materiaPrima.supplierCompany }}</p>
      <p><strong>Estado:</strong> {{ materiaPrima.estado }}</p>
      <p><strong>Enlaces IPFS:</strong> {{ materiaPrima.ipfsLinks.join(', ') }}</p>
      <p v-if="materiaPrima.motivoRechazo"><strong>Motivo de Rechazo:</strong> {{ materiaPrima.motivoRechazo }}</p>
    </div>

    <div v-else>
      <p>No se pudo encontrar la materia prima.</p>
    </div>
  </div>
</template>

<script>
import { getMateriaPrima } from "@/Proveedor/services/rawMaterial-api.service.js";

export default {
  name: "MateriaPrimaDetail",
  data() {
    return {
      materiaPrima: null,
    };
  },
  created() {
    this.fetchMateriaPrima();
  },
  methods: {
    async fetchMateriaPrima() {
      const materiaId = this.$route.params.id;

      try {
        const materia = await getMateriaPrima(materiaId);
        this.materiaPrima = materia;
      } catch (error) {
        console.error("Error al obtener los detalles de la materia prima:", error);
      }
    },
  },
};
</script>

<style scoped>
</style>
