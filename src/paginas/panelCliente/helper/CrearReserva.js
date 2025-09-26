import Swal from 'sweetalert2';
import authApi from '../../../api/authApi';

export const crearReserva = async (reservaData, navigate = null) => {
    try {
        // Hacer la petición POST al endpoint de crear reserva
        const resp = await authApi.post('/reserva/crearReserva', reservaData);

        // Mostrar alerta de éxito
        Swal.fire({
            title: '¡Éxito!',
            text: `Reserva creada correctamente para el ${new Date(resp.data.reserva.fecha).toLocaleDateString('es-ES')} a las ${resp.data.reserva.hora}.`,
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
        const msgError = error.response?.data?.msg || 'Error al crear la reserva';
        console.error("Error creando reserva:", error.response);

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