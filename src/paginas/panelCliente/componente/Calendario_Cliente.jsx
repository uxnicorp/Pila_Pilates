import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Card, Form, Badge, Spinner, Alert, Row, Col, Modal, Button } from 'react-bootstrap';
import '../css/calendario.css';
import { crearReserva } from '../helper/CrearReserva';

const Calendario = ({
  turnos = [],
  cargando = false,
  error = null,
  usuario = null,
  navigate,
  modoSeleccion = false,
  profesionalSeleccionado = null,
  fechasSeleccionadas = [],
  onFechaSeleccionada = () => {},
  limiteTurnosPorDia = 2,  
}) => {
  const calendarRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [usuarioYaReservado, setUsuarioYaReservado] = useState(false);

  // Verificar si el usuario ya tiene reserva en este turno
  const verificarReservaUsuario = (turno) => {
    if (!usuario || !turno.reservas) return false;
    return turno.reservas.some((reserva) => reserva.usuarioId === usuario.id);
  };

  // Manejar click en evento (turno existente)
  const handleEventClick = (info) => {
    if (modoSeleccion) return; // No hace nada en modo selección para admin

    const turno = turnos.find((t) => {
      const fechaTurno =
        typeof t.fecha === "string"
          ? t.fecha.split("T")[0]
          : t.fecha.toISOString().split("T")[0];
      return (
        fechaTurno === info.event.startStr.split("T")[0] &&
        t.hora_inicio === info.event.startStr.split("T")[1]?.substring(0, 5)
      );
    });

    if (turno) {
      const yaReservado = verificarReservaUsuario(turno);
      setUsuarioYaReservado(yaReservado);
      setTurnoSeleccionado(turno);
      setShowModal(true);
    }
  };

  // Manejar click en fecha (solo en modo selección para admin)
  const handleDateClick = (info) => {
    if (!modoSeleccion || !profesionalSeleccionado) return;

    const fechaSeleccionada = info.dateStr;
    const turnosPorDia = calcularTurnosPorDia();
    const turnosEnFecha = turnosPorDia[fechaSeleccionada] || 0;

    if (turnosEnFecha >= limiteTurnosPorDia) {
      return;
    }

    onFechaSeleccionada(fechaSeleccionada);
  };

  // Calcular turnos por día para el profesional seleccionado
  const calcularTurnosPorDia = () => {
    const turnosPorDia = {};

    if (!profesionalSeleccionado) return turnosPorDia;

    turnos.forEach((turno) => {
      const mismoProfesional =
        turno.profesional.nombre === profesionalSeleccionado.nombre &&
        turno.profesional.apellido === profesionalSeleccionado.apellido;

      if (mismoProfesional) {
        const fecha =
          typeof turno.fecha === "string"
            ? turno.fecha.split("T")[0]
            : turno.fecha.toISOString().split("T")[0];

        turnosPorDia[fecha] = (turnosPorDia[fecha] || 0) + 1;
      }
    });

    return turnosPorDia;
  };

  // Formatear eventos para FullCalendar
  const formatearEventos = () => {
    const eventos = [];

    // 1. Agregar turnos existentes
    turnos.forEach((turno) => {
      const fechaISO =
        typeof turno.fecha === "string"
          ? turno.fecha.split("T")[0]
          : turno.fecha.toISOString().split("T")[0];

      const cuposDisponibles =
        turno.cupo_maximo - (turno.reservas?.length || 0);
      const titulo = `${turno.servicio} - ${turno.profesional.nombre} (${cuposDisponibles} cupos)`;

      eventos.push({
        id: turno._id,
        title: titulo,
        start: `${fechaISO}T${turno.hora_inicio}`,
        end: `${fechaISO}T${turno.hora_fin}`,
        backgroundColor: getEventColor(turno.servicio),
        borderColor: getEventColor(turno.servicio),
        textColor: "white",
        extendedProps: {
          tipo: "turno-existente",
          profesional: turno.profesional,
          servicio: turno.servicio,
          cuposDisponibles: cuposDisponibles,
          cupoMaximo: turno.cupo_maximo,
        },
        className: cuposDisponibles === 0 ? "turno-lleno" : "turno-disponible",
      });
    });

    // 2. Agregar marcadores de fechas seleccionadas (solo en modo selección)
    if (modoSeleccion) {
      fechasSeleccionadas.forEach((fecha) => {
        eventos.push({
          title: "✓ SELECCIONADA",
          start: fecha,
          allDay: true,
          backgroundColor: "#28a745",
          borderColor: "#28a745",
          textColor: "white",
          extendedProps: {
            tipo: "fecha-seleccionada",
          },
          className: "fecha-seleccionada",
        });
      });
    }

    return eventos;
  };

  // Colores para servicios
  const getEventColor = (servicio) => {
    const colores = {
      Pilates: "#28a745",
      Yoga: "#17a2b8",
      Gimnasia: "#ffc107",
      default: "#6c757d",
    };
    return colores[servicio] || colores.default;
  };

  //crear reserva individual predeterminada
  const handleReservaIndividual = async () => {
    try {
      if (!usuario || !usuario._id) {
        Swal.fire("Error", "Usuario no disponible para la reserva", "error");
        return;
      }

      // Preparar datos EXACTAMENTE como los espera el backend
      const reservaData = {
        turnoId: turnoSeleccionado._id,
        usuarioId: usuario._id,
        tipoPago: "individual",
        monto: 2000,
        metodoPago: "mercadopago",
      };

      // Llamar al helper con el formato correcto
      const resultado = await crearReserva(reservaData, navigate);

      if (resultado.ok) {
        setShowModal(false);
        onReservaExitosa(); // Recargar turnos en el padre
      }
    } catch (error) {
      // El error ya se maneja en el helper, solo log para debug
      console.error("Error en handleReservaIndividual:", error);
    }
  };

  // Manejar reserva con membresía - CON EL FORMATO CORRECTO
  const handleReservaMembresia = async () => {
    try {
      if (!usuario || !usuario._id) {
        Swal.fire("Error", "Usuario no disponible para la reserva", "error");
        return;
      }

      // Preparar datos EXACTAMENTE como los espera el backend
      const reservaData = {
        turnoId: turnoSeleccionado._id,
        usuarioId: usuario._id,
        tipoPago: "membresia",
        membresiaId: "membresia-activa", // Esto debería venir de la membresía del usuario
      };

      // Llamar al helper con el formato correcto
      const resultado = await crearReserva(reservaData, navigate);

      if (resultado.ok) {
        setShowModal(false);
        onReservaExitosa(); // Recargar turnos en el padre
      }
    } catch (error) {
      console.error("Error en handleReservaMembresia:", error);
    }
  };

  // Personalizar el contenido de cada día
  const renderDayCellContent = (cellInfo) => {
    const fecha = cellInfo.date;
    const fechaStr = fecha.toISOString().split("T")[0];
    const turnosPorDia = calcularTurnosPorDia();
    const turnosEnFecha = turnosPorDia[fechaStr] || 0;
    const estaSeleccionada = fechasSeleccionadas.includes(fechaStr);
    const estaLlena = turnosEnFecha >= limiteTurnosPorDia;

    return (
      <div className="fc-day-content">
        <div className="fc-daygrid-day-number">{fecha.getDate()}</div>

        {modoSeleccion && profesionalSeleccionado && (
          <div
            className={`disponibilidad-indicator ${
              estaLlena ? "llena" : "disponible"
            }`}
          >
            <small>
              {turnosEnFecha}/{limiteTurnosPorDia}
              {estaSeleccionada && " ✓"}
            </small>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.refetchEvents();

      const dayCells = document.querySelectorAll(".fc-daygrid-day");
      dayCells.forEach((day) => {
        if (modoSeleccion) {
          day.classList.add("modo-seleccion");
        } else {
          day.classList.remove("modo-seleccion");
        }
      });
    }
  }, [turnos, fechasSeleccionadas, modoSeleccion, profesionalSeleccionado]);

  if (cargando) {
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando calendario...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger">{error}</Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Header className="calendar-header">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0 calendar-title">
                <i className="bi bi-calendar-event me-2" aria-hidden="true" />
                {modoSeleccion ? "Seleccionar Fechas" : "Turnos Disponibles"}
              </h5>

              <div className="calendar-subtitle">
                {modoSeleccion
                  ? `Selecciona fechas para ${
                      profesionalSeleccionado?.nombre || "el profesional"
                    }`
                  : `Haz clic en un turno para reservar. Total: ${turnos.length} turnos disponibles`}
              </div>
            </Col>

            <Col xs="auto">
              {modoSeleccion && (
                <Badge bg="light" text="dark">
                  {fechasSeleccionadas.length} fechas seleccionadas
                </Badge>
              )}
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <div className="calendar-container">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]} 
              initialView="dayGridMonth"
              locales={[esLocale]}
              locale="es"
              firstDay={1}
              selectable={false}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "dayGridMonth", 
              }}
              height="500px"
              events={formatearEventos()}
              dayCellContent={renderDayCellContent}
              eventContent={(eventInfo) => (
                <div className="evento-calendario">
                  {eventInfo.event.extendedProps.tipo ===
                  "fecha-seleccionada" ? (
                    <div className="text-center">
                      <strong>✓ SELECCIONADA</strong>
                    </div>
                  ) : (
                    <>
                      <div>
                        <strong>{eventInfo.timeText}</strong>
                      </div>
                      <div>{eventInfo.event.title.split(" - ")[0]}</div>
                      <div>
                        {eventInfo.event.extendedProps.profesional.nombre}
                      </div>
                      <small>
                        {eventInfo.event.extendedProps.cuposDisponibles} cupos
                      </small>
                    </>
                  )}
                </div>
              )}
            />
          </div>

          {/* Leyenda */}
          <div className="mt-3">
            <div className="leyenda">
              <strong>Leyenda:</strong>
              <span className="badge bg-success me-2 ms-2">Pilates</span>
              <span className="badge bg-info me-2">Yoga</span>
              <span className="badge bg-warning me-2">Gimnasia</span>
              <span className="badge bg-secondary me-2">Otros</span>

              {!modoSeleccion && (
                <>
                  <span className="badge bg-success me-2">Disponible</span>
                  <span className="badge bg-danger me-2">Lleno</span>
                </>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de Reserva */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        dialogClassName="modal-reserva"
        contentClassName="modal-reserva-content"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-calendar-event me-2" aria-hidden="true" />
            Reservar Turno
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {turnoSeleccionado && (
            <div>
              <h5>Información del Turno</h5>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Servicio:</strong> {turnoSeleccionado.servicio}
                </Col>
                <Col md={6}>
                  <strong>Profesional:</strong>{" "}
                  {turnoSeleccionado.profesional.nombre}{" "}
                  {turnoSeleccionado.profesional.apellido}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Fecha:</strong>{" "}
                  {new Date(turnoSeleccionado.fecha).toLocaleDateString(
                    "es-ES"
                  )}
                </Col>
                <Col md={6}>
                  <strong>Horario:</strong> {turnoSeleccionado.hora_inicio} -{" "}
                  {turnoSeleccionado.hora_fin}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Cupos disponibles:</strong>{" "}
                  {turnoSeleccionado.cupo_maximo -
                    (turnoSeleccionado.reservas?.length || 0)}
                  /{turnoSeleccionado.cupo_maximo}
                </Col>
                <Col md={6}>
                  <strong>Duración:</strong> 60 minutos
                </Col>
              </Row>

              {usuarioYaReservado ? (
                <Alert variant="warning" className="mt-3">
                  <i
                    className="bi bi-exclamation-triangle me-2"
                    aria-hidden="true"
                  />
                  Ya tienes una reserva en este turno.
                </Alert>
              ) : (
                <Alert variant="info" className="mt-3">
                  <i className="bi bi-lightbulb me-2" aria-hidden="true" />
                  Selecciona tu método de reserva:
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button className="btn-pila" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>

          {!usuarioYaReservado && turnoSeleccionado && (
            <>
              <Button className="btn-pila" onClick={handleReservaIndividual}>
                Pagar Reserva Individual - $2000
              </Button>

              <Button className="btn-pila" onClick={handleReservaMembresia}>
                Reservar con Membresía Mensual
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Calendario;