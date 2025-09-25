import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import "../../../../../estilos-generales/Modales.css"

const ModalPautas = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header className='modal-style'>
        <Modal.Title>Pautas de -PilaPilates+</Modal.Title>
      </Modal.Header>

      <Modal.Body className='modal-style'>
        <i class="bi bi-plus-circle"></i> Solo se permite el ingreso al estudio de la <b>persona que viene a realizar la actividad</b>.<br/><br/>
        <i class="bi bi-plus-circle"></i> La clase debe estar abonada <b>previo</b> a su realización.<br/><br/>
        <i class="bi bi-plus-circle"></i> Todas las clases comienzan <b>en punto</b> y finalizan <b>menos diez</b>.<br/><br/>
        <i class="bi bi-plus-circle"></i> Una vez pasados los diez minutos de comenzada la clase, <b>no se podrá ingresar</b> a la misma.<br/><br/>
        <i class="bi bi-plus-circle"></i> Para <b>reprogramar</b> una clase, es necesario hacerlo con <b>8 horas de anticipación</b>.<br/><br/>
        <i class="bi bi-plus-circle"></i> La clase que fue una vez reprogramada <b>no puede volver a reprogramarse</b>.<br/><br/>
        <i class="bi bi-plus-circle"></i> Antes de entrar al salón, recordar <b>sacarse el calzado</b>.<br/><br/>
        <i class="bi bi-plus-circle"></i> Es <b>obligatorio</b> el uso de <b>medias</b> durante la clase.<br/><br/>
        <i class="bi bi-plus-circle"></i> Dejar el <b>celular en "silencio"</b> durante las clases.<br/><br/>
        <i class="bi bi-plus-circle"></i> Las sesiones <b>no son transferibles</b>.<br/><br/>
        <i class="bi bi-plus-circle"></i> La comunicación, las altas y las clases asignadas sólo son validas si figuran en este sitio web.<br/><br/>
        <i class="bi bi-plus-circle"></i> El estudio se reserva el derecho de admisión.
      </Modal.Body>

      <Modal.Footer className="modal-footer border-0 modal-style">
        <Button onClick={onHide} className='btn-modal-send'>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPautas;