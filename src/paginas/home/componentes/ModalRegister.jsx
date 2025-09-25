import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { starRegister } from '../helper/startRegister';
import { useNavigate } from 'react-router-dom';

const ModalRegistro = ({ show, handleClose }) => {

  //uso form por formulario en vez de user.
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: ""
  });

  const navigate = useNavigate()

  //Captura cambios de los input
  const onInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Validación simple
    if (
      !form.nombre.trim() ||
      !form.apellido.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.telefono.trim()
    ) {
      Swal.fire({
        title: '¡Error!',
        text: 'Todos los campos son obligatorios.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }

    // Validación del nombre
    if (form.nombre.length > 0 && !/^[a-zA-Z\s]+$/.test(form.nombre)) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre inválido',
        text: 'El nombre solo puede contener letras y espacios.',
      });
      return;
    }

    // Validación apellido
    if (form.apellido.length > 0 && !/^[a-zA-Z\s]+$/.test(form.apellido)) {
      Swal.fire({
        icon: 'error',
        title: 'Apellido inválido',
        text: 'El apellido solo puede contener letras y espacios.',
      });
      return;
    }

    // Validación del email
    if (form.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Email inválido',
        text: 'Por favor, ingrese un email válido.',
      });
      return;
    }


    //falta validacion de un numero de telefono
    if (form.telefono.length < 8 || form.telefono.length > 15 || isNaN(form.telefono)) {
      Swal.fire({
        icon: 'error',
        title: 'Teléfono inválido',
        text: 'El teléfono debe tener entre 8 y 15 caracteres numéricos.',
      });
      return;
    }



    else {
      // Callback al padre (ej: enviar al backend)
      starRegister(form.nombre, form.apellido, form.email, form.password, form.telefono, navigate)

      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className='modal-style'>
        <Modal.Title>Registrate</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-style'>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={onInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              placeholder="Tu apellido"
              value={form.apellido}
              onChange={onInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="name@empresa.com"
              value={form.email}
              onChange={onInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="********"
              value={form.password}
              onChange={onInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="tel"
              name="telefono"
              placeholder="5491122334458"
              value={form.telefono}
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
          Registrarme
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistro;
