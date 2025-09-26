import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Container, Row, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

import BotonNotificaciones from '../../Componentes/Notificaciones';
import Swal from 'sweetalert2';
import { NavBar } from '../../Componentes/Navbar';

import { obtenerTurnosParaCalendario } from '../panelAdmin/helper/cargarTurnos'; // O tu función para obtener turnos
import ListaTurnosProfesional from './Componente/ListaTurnosEmpleado';

/**
 * PANEL PROFESIONAL - VERSIÓN SIMPLIFICADA SOLO CON LISTA DE TURNOS
 */

export const PanelEmpleado = () => {
    const location = useLocation();
    const user = location.state;
    const navigate = useNavigate();

    const [turnos, setTurnos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);

    // Cargar todos los turnos
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

    // Función para manejar el marcado de asistencia
    const handleMarcarAsistencia = async (turno, reserva, asistencia) => {
        try {
            // TODO: Integrar con tu API para actualizar la asistencia
            console.log('Marcando asistencia:', {
                turnoId: turno._id,
                reservaId: reserva._id,
                asistencia: asistencia,
                cliente: reserva.usuario || reserva.cliente
            });

            // Simulación de actualización exitosa
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Recargar los turnos para reflejar los cambios
            await cargarTurnos();
            
        } catch (error) {
            console.error('Error al marcar asistencia:', error);
            Swal.fire('Error', 'No se pudo registrar la asistencia', 'error');
        }
    };

    // Estadísticas para el panel del profesional
    const estadisticas = {
        totalTurnos: turnos.filter(t => t.profesional?._id === user?._id).length,
        turnosHoy: turnos.filter(t => {
            const hoy = new Date().toDateString();
            const fechaTurno = new Date(t.fecha).toDateString();
            return t.profesional?._id === user?._id && fechaTurno === hoy;
        }).length,
        turnosProximaSemana: turnos.filter(t => {
            const hoy = new Date();
            const unaSemanaDespues = new Date(hoy);
            unaSemanaDespues.setDate(hoy.getDate() + 7);
            const fechaTurno = new Date(t.fecha);
            return t.profesional?._id === user?._id && 
                   fechaTurno >= hoy && 
                   fechaTurno <= unaSemanaDespues;
        }).length,
        totalReservas: turnos.reduce((total, turno) => {
            if (turno.profesional?._id === user?._id) {
                return total + (turno.reservas?.filter(r => r.estado !== false).length || 0);
            }
            return total;
        }, 0)
    };

    return (
        <div>
            <NavBar user={user} />

            <Container fluid className="mt-4">
                {/* Header informativo */}
                <Row className="mb-4">
                    <Col>
                        <Card className="bg-gradient-info text-white">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col>
                                        <h2 className="mb-1">👨‍🏫 Panel del Profesional</h2>
                                        <p className="mb-0">
                                            Bienvenido/a {user?.nombre || 'Profesional'}. Gestiona las asistencias de tus turnos.
                                        </p>
                                    </Col>
                                    <Col xs="auto">
                                        <BotonNotificaciones />
                                        <Button
                                            variant="light"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => setShowInfoModal(true)}
                                        >
                                            ℹ️ Instrucciones
                                        </Button>
                                        <Button
                                            variant="outline-light"
                                            size="sm"
                                            className="ms-2"
                                            onClick={cargarTurnos}
                                            disabled={cargando}
                                        >
                                            🔄 Actualizar
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Estadísticas del profesional */}
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="text-center border-primary">
                            <Card.Body>
                                <h4 className="text-primary">{estadisticas.totalTurnos}</h4>
                                <p className="mb-0">Total de turnos</p>
                                <small className="text-muted">Asignados a ti</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center border-success">
                            <Card.Body>
                                <h4 className="text-success">{estadisticas.turnosHoy}</h4>
                                <p className="mb-0">Turnos hoy</p>
                                <small className="text-muted">Para hoy</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center border-warning">
                            <Card.Body>
                                <h4 className="text-warning">{estadisticas.turnosProximaSemana}</h4>
                                <p className="mb-0">Próxima semana</p>
                                <small className="text-muted">En 7 días</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center border-info">
                            <Card.Body>
                                <h4 className="text-info">{estadisticas.totalReservas}</h4>
                                <p className="mb-0">Reservas activas</p>
                                <small className="text-muted">En tus turnos</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Filtros rápidos */}
                <Row className="mb-4">
                    <Col>
                        <Card>
                            <Card.Body className="py-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Filtros rápidos:</strong>
                                    </div>
                                    <div>
                                        <small className="text-muted">
                                            Mostrando turnos de: <strong>{user?.nombre || 'Profesional'}</strong>
                                        </small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* CONTENIDO PRINCIPAL - LISTA DE TURNOS */}
                <Row>
                    <Col>
                        {cargando ? (
                            <Card className="text-center py-5">
                                <Card.Body>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                    <p className="mt-3">Cargando turnos del profesional...</p>
                                </Card.Body>
                            </Card>
                        ) : error ? (
                            <Alert variant="danger" className="text-center">
                                <h5>❌ Error al cargar los turnos</h5>
                                <p>{error}</p>
                                <Button variant="outline-danger" onClick={cargarTurnos}>
                                    Reintentar
                                </Button>
                            </Alert>
                        ) : (
                            <ListaTurnosProfesional
                                turnos={turnos}
                                user={user}
                                titulo="Gestión de Asistencias"
                                onMarcarAsistencia={handleMarcarAsistencia}
                            />
                        )}
                    </Col>
                </Row>

                {/* Información de estado de turnos */}
                <Row className="mt-4">
                    <Col>
                        <Card>
                            <Card.Header className="bg-light">
                                <h6 className="mb-0">📊 Leyenda de Estados</h6>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4}>
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="badge bg-success me-2">●</span>
                                            <small>Presente - Cliente asistió</small>
                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="badge bg-danger me-2">●</span>
                                            <small>Ausente - Cliente no asistió</small>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="badge bg-warning me-2">●</span>
                                            <small>Pendiente - Sin registrar</small>
                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="badge bg-secondary me-2">●</span>
                                            <small>Finalizado - Turno completado</small>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="badge bg-primary me-2">●</span>
                                            <small>Hoy - Turno del día actual</small>
                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="badge bg-info me-2">●</span>
                                            <small>Disponible - Cupos libres</small>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modal de instrucciones para profesionales */}
            <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>ℹ️ Instrucciones para Profesionales</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>👥 Gestión de Asistencias:</h6>
                    <ol>
                        <li className="mb-2">
                            <strong>Expande cada turno</strong> para ver la lista de clientes reservados
                        </li>
                        <li className="mb-2">
                            <strong>Marca "Presente"</strong> cuando el cliente asista a la clase
                        </li>
                        <li className="mb-2">
                            <strong>Marca "Ausente"</strong> si el cliente no se presenta
                        </li>
                        <li className="mb-2">
                            Solo puedes modificar asistencias de turnos que aún no han finalizado
                        </li>
                    </ol>

                    <h6>📅 Estados de Turnos:</h6>
                    <ul>
                        <li className="mb-1">
                            <strong>Hoy:</strong> Turnos programados para el día actual
                        </li>
                        <li className="mb-1">
                            <strong>Finalizado:</strong> Turnos que ya pasaron (no editable)
                        </li>
                        <li className="mb-1">
                            <strong>Disponible/Completo:</strong> Estado de cupos del turno
                        </li>
                    </ul>

                    <Alert variant="info" className="small mt-3">
                        💡 <strong>Consejo:</strong> Actualiza regularmente las asistencias para mantener 
                        registros precisos de tus clases.
                    </Alert>

                    <Alert variant="warning" className="small mt-2">
                        ⚠️ <strong>Importante:</strong> Una vez que un turno finaliza, no podrás 
                        modificar las asistencias registradas.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowInfoModal(false)}>
                        Entendido
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
