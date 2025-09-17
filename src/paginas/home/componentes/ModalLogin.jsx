import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import startLogin from '../helper/startLogin';

const ModalLogin = ({show, handleClose}) => {

    const [user, setUser] = useState({
        email:"",
        password:""
    });

    const navigate = useNavigate()

    //Captura cambios de los input
    const onInputChange = (e) =>{
        setUser({
            ...user,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (user.email.trim() === "" || user.password.trim() === ""){
            Swal.fire({
                title: '¡Error!',
                text: 'Todos los campos son obligatorios.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }else{
            //LLAMADO AL BACKEND
            startLogin(user.email, user.password, navigate)
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ingresá con tu usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                value={user.email}
                                name="email"
                                onChange={onInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="********"
                                value={user.password}
                                name="password"
                                onChange={onInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={onSubmit}>
                        Ingresar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalLogin;
