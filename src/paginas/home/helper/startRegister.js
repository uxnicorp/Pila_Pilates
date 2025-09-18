import Swal from 'sweetalert2';
import authApi from '../../../api/authApi';

export const starRegister = async (nombre, apellido, email, password, telefono, navigate) => {
    try {
        const resp = await authApi.post('/auth/new-user', {
            nombre, apellido, email, password, telefono
        });

        Swal.fire({
            title: '¡Éxito!',
            text: 'Registro enviado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
        navigate("/*");

    } catch (error) {
        const msgError = error.response.data.msg
        console.error("error", error.response)
        Swal.fire({
            title: '¡Error!',
            text: msgError,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        if (error.response?.status === (401)) {
            localStorage.removeItem("token")
        }
    }

}