import Swal from 'sweetalert2';
import authApi from '../../../api/authApi';

export const obtenerTurnosParaCalendario = async () => {
    try {
        const resp = await authApi.get('/admin/turnos');
        
        if (resp.data.ok) {
            return resp.data.turnos;
        } else {
            throw new Error('Formato de respuesta inesperado');
        }

    } catch (error) {
        const msgError = error.response?.data?.msg || 'Error al obtener los turnos';
        console.error("Error obteniendo turnos:", error);

        Swal.fire({
            title: '¡Error!',
            text: msgError,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            background: '#f9f9f9',
            confirmButtonColor: '#dc3545',
        });

        throw error;
    }
};