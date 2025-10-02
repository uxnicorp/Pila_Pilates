import React from 'react';
import { Modal, Button, Card, Container } from 'react-bootstrap';
import "../../../../../estilos-generales/Modales.css"

const ModalPautas = ({ show, onHide }) => {
  const pautas = [
    {
      icon: "bi-person-check",
      title: "Acceso Exclusivo",
      description: "Solo se permite el ingreso al estudio de la persona que viene a realizar la actividad."
    },
    {
      icon: "bi-currency-dollar",
      title: "Pago Anticipado",
      description: "La clase debe estar abonada previo a su realización."
    },
    {
      icon: "bi-clock",
      title: "Puntualidad",
      description: "Todas las clases comienzan en punto y finalizan menos diez."
    },
    {
      icon: "bi-door-closed",
      title: "Límite de Ingreso",
      description: "Una vez pasados los diez minutos de comenzada la clase, no se podrá ingresar a la misma."
    },
    {
      icon: "bi-calendar-event",
      title: "Reprogramación",
      description: "Para reprogramar una clase, es necesario hacerlo con 8 horas de anticipación."
    },
    {
      icon: "bi-calendar-x",
      title: "Límite de Reprogramación",
      description: "La clase que fue una vez reprogramada no puede volver a reprogramarse."
    },
    {
      icon: "bi bi-ban",
      title: "Calzado",
      description: "Antes de entrar al salón, recordar sacarse el calzado."
    },
    {
      icon: "bi bi-exclamation-circle",
      title: "Uso de Medias",
      description: "Es obligatorio el uso de medias durante la clase."
    },
    {
      icon: "bi-phone-vibrate",
      title: "Silencio",
      description: "Dejar el celular en 'silencio' durante las clases."
    },
    {
      icon: "bi bi-shuffle",
      title: "No Transferible",
      description: "Las sesiones no son transferibles."
    },
    {
      icon: "bi-chat-dots",
      title: "Comunicación Oficial",
      description: "La comunicación, las altas y las clases asignadas sólo son válidas si figuran en este sitio web."
    },
    {
      icon: "bi-shield-check",
      title: "Derecho de Admisión",
      description: "El estudio se reserva el derecho de admisión."
    }
  ];

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header className='modal-style border-0'>
        <Modal.Title className="w-100 text-center">
          <h3 className="mb-0">Pautas de PilaPilates+</h3>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className='modal-style pt-0'>
        <Card className=" mt-4 w-100 border-0"
          style={{
            backgroundColor: '#2f1d0f', // Transparencia 
          }}>
          <Card.Body className="">
            <div className="row">
              {pautas.map((pauta, index) => (
                <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                  <Container className="text-container h-100">
                    <div className="row w-100 align-items-start h-100 p-3">
                      
                      <div className="col text-start">
                         <h6> <i className={`bi ${pauta.icon}`}></i> </h6> 

                        <h6 className="mb-2  fw-bold">{pauta.title}</h6>

                        <p className="mb-0 text-white small">{pauta.description}</p>
                        
                      </div>
                    </div>
                  </Container>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
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