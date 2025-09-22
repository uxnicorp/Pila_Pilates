import Swal from 'sweetalert2';
import authApi from '../../../api/authApi';

export const crearTurnosPorLote = async (turnos, navigate = null) => {
    try {
        // Hacer la petición POST al endpoint de crear turnos en lote
        const resp = await authApi.post('/admin/lote', {
            turnos: turnos // Enviamos el array de turnos
        });

        // Mostrar alerta de éxito
        Swal.fire({
            title: '¡Éxito!',
            text: `Se crearon ${resp.data.turnos.length} turnos correctamente.`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            background: '#f9f9f9',
            confirmButtonColor: '#28a745',
            customClass: {
                title: 'swal2-title-custom',
                content: 'swal2-content-custom',
                confirmButton: 'swal2-confirm-custom',
            },
        });

        return resp.data;

    } catch (error) {
        const msgError = error.response?.data?.msg || 'Error al crear los turnos';
        console.error("Error creando turnos:", error.response);

        Swal.fire({
            title: '¡Error!',
            text: msgError,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            background: '#f9f9f9',
            confirmButtonColor: '#dc3545',
            customClass: {
                title: 'swal2-title-custom',
                content: 'swal2-content-custom',
                confirmButton: 'swal2-confirm-custom',
            },
        });

        if (error.response?.status === 401 && navigate) {
            localStorage.removeItem("token");
            navigate("/*");
        }

        throw error;
    }
};