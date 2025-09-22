import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import SelectEmpleado from './componentes/Select_Empleados';
import SelectorHoras from './componentes/Selector_horas';
import { crearTurnosPorLote } from './helper/crearTurnos';
import { obtenerTurnosParaCalendario } from './helper/cargarTurnos';
import Calendario from './componentes/Calendario';
import { NavBar } from '../../Componentes/Navbar';

export const PanelAdmin = () => {

  const location = useLocation();
  const user = location.state;

  const [paso, setPaso] = useState(1); // 1: Profesional, 2: Fechas, 3: Horarios
  const [profesionalId, setProfesionalId] = useState(null);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState([]);
  const [horariosSeleccionados, setHorariosSeleccionados] = useState([]);
  const [servicio, setServicio] = useState('Pilates');

  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todos los turnos al montar el componente y después de crear turnos
  const cargarTurnos = async () => {
    try {
      setCargando(true);
      setError(null);
      const todosLosTurnos = await obtenerTurnosParaCalendario();
      setTurnos(todosLosTurnos);
    } catch (err) {
      setError('No se pudieron cargar los turnos');
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  const navigate = useNavigate();

  // Manejar selección/deselección de fechas
  const handleFechaSeleccionada = (fecha) => {
    const nuevasFechas = fechasSeleccionadas.includes(fecha)
      ? fechasSeleccionadas.filter(f => f !== fecha)
      : [...fechasSeleccionadas, fecha];
    setFechasSeleccionadas(nuevasFechas);
  };

  // En tu handleSubmit del PanelAdmin
  const handleSubmit = async () => {
    if (!profesionalId) {
      Swal.fire('Error', 'Debe seleccionar un profesional', 'error');
      return;
    }

    const turnosParaEnviar = [];

    fechasSeleccionadas.forEach(fecha => {
      horariosSeleccionados.forEach(horario => {
        turnosParaEnviar.push({
          fecha: fecha,
          hora_inicio: horario,
          hora_fin: calcularHoraFin(horario),
          servicio: servicio,
          cupo_maximo: 5,
          profesional: {
            nombre: profesionalId.nombre,
            apellido: profesionalId.apellido
          }
        });
      });
    });

    try {
      await crearTurnosPorLote(turnosParaEnviar, navigate);

      // ✅ ACTUALIZACIÓN AUTOMÁTICA: Recargar turnos después de crear
      await cargarTurnos();

      // Limpiar formulario y volver al inicio
      setFechasSeleccionadas([]);
      setHorariosSeleccionados([]);
      setProfesionalId(null);
      setPaso(1);

      Swal.fire('¡Éxito!', `Se crearon ${turnosParaEnviar.length} turnos correctamente`, 'success');
    } catch (error) {
      console.error('Error creando turnos:', error);
      Swal.fire('Error', 'No se pudieron crear los turnos', 'error');
    }
  };

  const calcularHoraFin = (horaInicio) => {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos + 60;
    const nuevasHoras = Math.floor(totalMinutos / 60);
    const nuevosMinutos = totalMinutos % 60;
    return `${nuevasHoras.toString().padStart(2, '0')}:${nuevosMinutos.toString().padStart(2, '0')}`;
  };

  // Limpiar selección cuando cambia el profesional
  useEffect(() => {
    if (paso === 2) {
      setFechasSeleccionadas([]);
    }
  }, [profesionalId, paso]);

  return (
    <Container fluid>

      <NavBar user={user} />

      {/* Header con Pasos */}
      <Row className="mb-4">
        <Col>
          <h2>Crear Turnos Masivos</h2>
          <div className="steps mb-3">
            <span className={paso >= 1 ? 'text-primary fw-bold' : 'text-muted'}>1. Profesional</span>
            {' → '}
            <span className={paso >= 2 ? 'text-primary fw-bold' : 'text-muted'}>2. Fechas</span>
            {' → '}
            <span className={paso >= 3 ? 'text-primary fw-bold' : 'text-muted'}>3. Horarios</span>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Columna Principal - Formulario y Calendario Unificado */}
        <Col lg={8}>
          {paso === 1 && (
            <Card className="mb-4">
              <Card.Body>
                <h5>👨‍💼 Paso 1: Seleccionar Profesional</h5>
                <SelectEmpleado onProfesionalSelected={setProfesionalId} />
                <Button
                  className="mt-3"
                  disabled={!profesionalId}
                  onClick={() => setPaso(2)}
                >
                  Siguiente → Seleccionar Fechas
                </Button>
              </Card.Body>
            </Card>
          )}

          {paso === 2 && (
            <Card className="mb-4">
              <Card.Body>
                <h5>📅 Paso 2: Seleccionar Fechas para {profesionalId?.nombre}</h5>
                <Alert variant="info" className="small">
                  <strong>Instrucciones:</strong> Haz clic en las fechas disponibles del calendario.
                  Cada fecha permite máximo 2 turnos. Las fechas llenas aparecen en rojo.
                </Alert>

                {/* Resumen de selección actual */}
                {fechasSeleccionadas.length > 0 && (
                  <Alert variant="success" className="small">
                    <strong>Fechas seleccionadas: {fechasSeleccionadas.length}</strong>
                    <br />
                    {fechasSeleccionadas.slice(0, 5).map(fecha =>
                      new Date(fecha).toLocaleDateString('es-AR')
                    ).join(', ')}
                    {fechasSeleccionadas.length > 5 && ` ... y ${fechasSeleccionadas.length - 5} más`}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          )}

          {paso === 3 && (
            <Card className="mb-4">
              <Card.Body>
                <h5>⏰ Paso 3: Seleccionar Horarios</h5>
                <Alert variant="warning" className="small">
                  <strong>Recordatorio:</strong> Creando turnos para {profesionalId?.nombre} en {fechasSeleccionadas.length} fechas
                </Alert>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Columna Lateral - Controles del Paso Actual */}
        <Col lg={4}>
          {paso === 2 && (
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">Controles de Fechas</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setPaso(1)}
                  >
                    ← Volver a Profesional
                  </Button>
                  <Button
                    variant="success"
                    disabled={fechasSeleccionadas.length === 0}
                    onClick={() => setPaso(3)}
                  >
                    Continuar a Horarios →
                  </Button>
                </div>

                {fechasSeleccionadas.length > 0 && (
                  <div className="mt-3">
                    <hr />
                    <h6>Fechas seleccionadas:</h6>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {fechasSeleccionadas.map(fecha => (
                        <div key={fecha} className="d-flex justify-content-between align-items-center small py-1">
                          <span>{new Date(fecha).toLocaleDateString('es-AR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}</span>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleFechaSeleccionada(fecha)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="w-100 mt-2"
                      onClick={() => setFechasSeleccionadas([])}
                    >
                      Limpiar todas
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {paso === 3 && (
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Header className="bg-success text-white">
                <h6 className="mb-0">Controles de Horarios</h6>
              </Card.Header>
              <Card.Body>
                <SelectorHoras
                  horariosSeleccionados={horariosSeleccionados}
                  setHorariosSeleccionados={setHorariosSeleccionados}
                />

                <div className="mt-3 p-3 bg-light rounded">
                  <h6>Resumen final:</h6>
                  <p className="mb-1">
                    <strong>{fechasSeleccionadas.length} fechas</strong> ×
                    <strong> {horariosSeleccionados.length} horarios</strong>
                  </p>
                  <h5 className="text-primary">
                    Total: {fechasSeleccionadas.length * horariosSeleccionados.length} turnos
                  </h5>
                </div>

                <div className="d-grid gap-2 mt-3">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setPaso(2)}
                  >
                    ← Volver a Fechas
                  </Button>
                  <Button
                    variant="success"
                    disabled={horariosSeleccionados.length === 0}
                    onClick={handleSubmit}
                  >
                    🚀 Crear Turnos
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* CALENDARIO UNIFICADO - Ocupa todo el ancho */}
      <Row>
        <Col>
          <Calendario
            turnos={turnos}
            cargando={cargando}
            error={error}

            // Modo selección solo activo en paso 2
            modoSeleccion={paso === 2}
            profesionalSeleccionado={profesionalId}
            fechasSeleccionadas={fechasSeleccionadas}
            onFechaSeleccionada={handleFechaSeleccionada}
            limiteTurnosPorDia={2}
          />
        </Col>
      </Row>
    </Container>
  );
}
