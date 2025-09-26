import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Card, Form, Badge, Spinner, Alert, Row, Col } from 'react-bootstrap';
import '../css/calendario.css'; // Importamos el CSS

const Calendario = ({
  // Props para visualización
  turnos = [],
  cargando = false,
  error = null,
  
  // Props para modo selección
  modoSeleccion = false,
  profesionalSeleccionado = null,
  fechasSeleccionadas = [],
  onFechaSeleccionada = () => {},
  limiteTurnosPorDia = 2
}) => {
  const calendarRef = useRef(null);

  // Calcular turnos por día para el profesional seleccionado
  const calcularTurnosPorDia = () => {
    const turnosPorDia = {};
    
    if (!profesionalSeleccionado) return turnosPorDia;

    turnos.forEach(turno => {
      const mismoProfesional = 
        turno.profesional.nombre === profesionalSeleccionado.nombre &&
        turno.profesional.apellido === profesionalSeleccionado.apellido;
      
      if (mismoProfesional) {
        const fecha = typeof turno.fecha === 'string' 
          ? turno.fecha.split('T')[0] 
          : turno.fecha.toISOString().split('T')[0];
        
        turnosPorDia[fecha] = (turnosPorDia[fecha] || 0) + 1;
      }
    });
    
    return turnosPorDia;
  };

  // Formatear eventos para FullCalendar
  const formatearEventos = () => {
    const eventos = [];

    // 1. Agregar turnos existentes
    turnos.forEach(turno => {
      const fechaISO = typeof turno.fecha === 'string' 
        ? turno.fecha.split('T')[0] 
        : turno.fecha.toISOString().split('T')[0];

      eventos.push({
        title: `${turno.servicio} - ${turno.profesional.nombre}`,
        start: `${fechaISO}T${turno.hora_inicio}`,
        end: `${fechaISO}T${turno.hora_fin}`,
        backgroundColor: getEventColor(turno.servicio),
        borderColor: getEventColor(turno.servicio),
        textColor: 'white',
        extendedProps: {
          tipo: 'turno-existente',
          profesional: turno.profesional,
          servicio: turno.servicio
        }
      });
    });

    // 2. Agregar marcadores de fechas seleccionadas (solo en modo selección)
    if (modoSeleccion) {
      fechasSeleccionadas.forEach(fecha => {
        eventos.push({
          title: '✓ SELECCIONADA',
          start: fecha,
          allDay: true,
          backgroundColor: '#28a745',
          borderColor: '#28a745',
          textColor: 'white',
          extendedProps: {
            tipo: 'fecha-seleccionada'
          },
          className: 'fecha-seleccionada'
        });
      });
    }

    return eventos;
  };

  // Colores para servicios
  const getEventColor = (servicio) => {
    const colores = {
      'Pilates': '#28a745',
      'Yoga': '#17a2b8',
      'Gimnasia': '#ffc107',
      'default': '#6c757d'
    };
    return colores[servicio] || colores.default;
  };

  // Manejar clic en fecha (solo en modo selección)
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

  // Personalizar el contenido de cada día
  const renderDayCellContent = (cellInfo) => {
    const fecha = cellInfo.date;
    const fechaStr = fecha.toISOString().split('T')[0];
    const turnosPorDia = calcularTurnosPorDia();
    const turnosEnFecha = turnosPorDia[fechaStr] || 0;
    const estaSeleccionada = fechasSeleccionadas.includes(fechaStr);
    const estaLlena = turnosEnFecha >= limiteTurnosPorDia;

    return (
      <div className="fc-day-content">
        <div className="fc-daygrid-day-number">
          {fecha.getDate()}
        </div>
        
        {/* Indicador de disponibilidad (solo en modo selección) */}
        {modoSeleccion && profesionalSeleccionado && (
          <div className={`disponibilidad-indicator ${estaLlena ? 'llena' : 'disponible'}`}>
            <small>
              {turnosEnFecha}/{limiteTurnosPorDia}
              {estaSeleccionada && ' ✓'}
            </small>
          </div>
        )}
      </div>
    );
  };

  // Aplicar clase de modo selección a los días del calendario
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.refetchEvents();
      
      // Aplicar clase CSS para el modo selección
      const dayCells = document.querySelectorAll('.fc-daygrid-day');
      dayCells.forEach(day => {
        if (modoSeleccion) {
          day.classList.add('modo-seleccion');
        } else {
          day.classList.remove('modo-seleccion');
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
    <Card>
      <Card.Header className={modoSeleccion ? "bg_head_calendar text-white" : "bg_head_calendar text-white"}>
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-0">
              {modoSeleccion ? ' Seleccionar Fechas' : ' Turnos Existentes'}
            </h5>
            <Form.Text className="text-light">
              {modoSeleccion 
                ? `Selecciona fechas para ${profesionalSeleccionado?.nombre || 'el profesional'} (Límite: ${limiteTurnosPorDia} turnos/día)`
                : `Total: ${turnos.length} turnos - Haz clic en los eventos para detalles`
              }
            </Form.Text>
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

      <Card.Body className='bg_calendar'>
        <div className="calendar-container ">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locales={[esLocale]}
            locale="es"
            firstDay={1}
            selectable={false}
            dateClick={handleDateClick}
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            height="500px"
            events={formatearEventos()}
            dayCellContent={renderDayCellContent}
            eventContent={(eventInfo) => (
              <div className="evento-calendario">
                {eventInfo.event.extendedProps.tipo === 'fecha-seleccionada' ? (
                  <div className="text-center">
                    <strong>✓ SELECCIONADA</strong>
                  </div>
                ) : (
                  <>
                    <div><strong>{eventInfo.timeText}</strong></div>
                    <div>{eventInfo.event.title.split(' - ')[0]}</div>
                    <div>{eventInfo.event.extendedProps.profesional.nombre}</div>
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
         
            
            {modoSeleccion && (
              <>
                <span className="badge bg-primary me-2">✓ Fecha seleccionada</span>
                <span className="badge bg-success me-2">Disponible</span>
                <span className="badge bg-danger">Lleno</span>
              </>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Calendario;