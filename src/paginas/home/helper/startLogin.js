import Swal from 'sweetalert2';
import authApi from '../../../api/authApi';

const startLogin = async (email, password, navigate) => {
    try{
        const res = await authApi.post('/auth/login', {email, password})
        localStorage.setItem('token', res.data.token)
      

        switch(res.data.user.rol){
            case "cliente":
                navigate("/cliente", {state:res.data.user})
                break
            case "admin":
                navigate("/admin", {state:res.data.user})
                break
            case "empleado":
                navigate("/empleado", {state:res.data.user})
                break
            default:
                localStorage.removeItem('token')
        }
    }

    catch (error){
        const msgError = error.response.data.msg
        console.error("error", error.response)
        Swal.fire({
                title: '¡Error!',
                text: msgError,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        if (error.response?.status === (401)){
            localStorage.removeItem("token")
        }
    }
}

export default startLogin