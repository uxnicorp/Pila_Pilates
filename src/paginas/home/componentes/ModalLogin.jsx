import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import startLogin from '../helper/startLogin';

const ModalLogin = ({ show, handleClose }) => {

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate()

    //Captura cambios de los input
    const onInputChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (user.email.trim() === "" || user.password.trim() === "") {
            Swal.fire({
                title: '¡Error!',
                text: 'Todos los campos son obligatorios.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                customClass: {
                    popup: 'mi-popup',
                    title: 'mi-titulo',
                    confirmButton: 'mi-boton',
                    htmlContainer: 'mi-texto'
                }
            });
            return;
        }

        // Validación del email
        if (user.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            Swal.fire({
                icon: 'error',
                title: 'Email inválido',
                text: 'Por favor, ingrese un email válido.',
                confirmButtonText: 'Aceptar',
                iconColor: 'var(--blanco)',
                customClass: {
                    popup: 'mi-popup',
                    title: 'mi-titulo',
                    confirmButton: 'mi-boton',
                    htmlContainer: 'mi-texto'
                }
            });
            return;
        }

        else {
            //LLAMADO AL BACKEND
            startLogin(user.email, user.password, navigate)
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton className='modal-style'>
                    <Modal.Title>Ingresá con tu usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-style'>
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
                <Modal.Footer className='modal-style'>
                    <Button className='btn-modal btn-modal-close' onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button className='btn-modal btn-modal-send' onClick={onSubmit}>
                        Ingresar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalLogin;