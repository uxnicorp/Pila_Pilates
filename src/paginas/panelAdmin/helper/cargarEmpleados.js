import Swal from "sweetalert2";
import authApi from "../../../api/authApi"; // Asegúrate de que la ruta es correcta

export const cargarEmpleados = async (setEmpleados, navigate) => {
  try {
    // Hacemos la petición GET al endpoint específico de empleados
    const resp = await authApi.get('/admin/empleados'); 

    // Validar si la respuesta es exitosa y tiene el array de empleados
    if (resp.data.ok && Array.isArray(resp.data.empleados)) {
      setEmpleados(resp.data.empleados); // Actualiza el estado con los empleados
    } else {
      console.error('Formato de respuesta inesperado:', resp.data);
      throw new Error('Formato de respuesta inesperado del servidor');
    }
  } catch (error) {
    console.error('Error al cargar empleados:', error);
    
    const errorMessage = error.response?.data?.msg || error.message || 'Error desconocido al cargar empleados';
    
    Swal.fire({
      title: 'ERROR',
      text: errorMessage,
      icon: 'error',
      background: '#f9f9f9',
      confirmButtonColor: '#ffc107',
      customClass: {
        title: 'swal2-title-custom',
        content: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom',
      },
    });

    // Manejo de error 401 (no autenticado) - Solo si se proporciona navigate
    if (error.response?.status === 401 && navigate) {
      localStorage.removeItem('token');
      navigate('/*');
    }

    // Propagar el error para que el componente pueda manejarlo también
    throw error;
  }
};