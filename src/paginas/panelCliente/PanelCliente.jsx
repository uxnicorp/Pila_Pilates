import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Container, Row, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

import BotonNotificaciones from '../../Componentes/Notificaciones';
import Swal from 'sweetalert2';
import { NavBar } from '../../Componentes/Navbar';
import Calendario from './componente/Calendario_Cliente';
import { obtenerTurnosParaCalendario } from '../panelAdmin/helper/cargarTurnos';
import ListaTurnos from './componente/ListaTurnosCliente';


/**
 * PANEL CLIENTE - VERSIÓN COMPLETA CON LISTATURNOS
 */

export const PanelCliente = () => {
    const location = useLocation();
    const user = location.state;
    const navigate = useNavigate();

    const [turnos, setTurnos] = useState([]);
    const [turnosCompletos, setTurnosCompletos] = useState([]); // ← NUEVO ESTADO para todos los turnos
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [vistaActiva, setVistaActiva] = useState('calendario'); // 'calendario' o 'lista'

    // Cargar todos los turnos disponibles
    const cargarTurnos = async () => {
        try {
            setCargando(true);
            setError(null);
            const todosLosTurnos = await obtenerTurnosParaCalendario();

            // Guardar todos los turnos para la lista
            setTurnosCompletos(todosLosTurnos);

            // Filtrar solo turnos con cupos disponibles para el calendario
            const turnosDisponibles = todosLosTurnos.filter(turno => {
                const cuposDisponibles = turno.cupo_maximo - (turno.reservas?.length || 0);
                return cuposDisponibles > 0;
            });

            setTurnos(turnosDisponibles);
        } catch (err) {
            setError('No se pudieron cargar los turnos disponibles');
            console.error('Error:', err);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarTurnos();
    }, []);

    // Función para recargar turnos después de una reserva
    const handleReservaExitosa = async () => {
        await cargarTurnos();
    };

    // Función para manejar la reserva individual
    const handleReservaIndividual = async (turno) => {
        try {
            Swal.fire({
                title: '¿Confirmar reserva individual?',
                text: `Reservar ${turno.servicio} con ${turno.profesional.nombre} el ${new Date(turno.fecha).toLocaleDateString()} a las ${turno.hora_inicio}`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, reservar ($2000)',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // TODO: Integrar lógica de pago real aquí
                    Swal.fire('¡Reserva exitosa!', 'Tu turno ha sido reservado correctamente. Recibirás un recordatorio.', 'success');
                    await cargarTurnos(); // Recargar turnos después de la reserva
                }
            });
        } catch (error) {
            console.error('Error en reserva individual:', error);
            Swal.fire('Error', 'No se pudo completar la reserva', 'error');
        }
    };

    // Función para manejar la reserva con membresía
    const handleReservaMembresia = async (turno) => {
        try {
            Swal.fire({
                title: '¿Confirmar reserva con membresía?',
                text: `Reservar ${turno.servicio} con ${turno.profesional.nombre} usando tu membresía mensual`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#007bff',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, reservar con membresía',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // TODO: Integrar lógica de membresía real aquí
                    Swal.fire('¡Reserva exitosa!', 'Tu turno ha sido reservado usando tu membresía. Recibirás un recordatorio.', 'success');
                    await cargarTurnos(); // Recargar turnos después de la reserva
                }
            });
        } catch (error) {
            console.error('Error en reserva con membresía:', error);
            Swal.fire('Error', 'No se pudo completar la reserva', 'error');
        }
    };

    // Filtrar turnos para mostrar solo los del cliente (opcional)
    const turnosDelCliente = turnosCompletos.filter(turno => {
        // Si quieres mostrar solo los turnos donde el cliente tiene reserva:
        return turno.reservas?.some(reserva =>
            reserva.usuario?._id === user?._id ||
            reserva.cliente?.id === user?._id
        );
    });

    return (
        <div>
            <NavBar user={user} />

            <Container fluid className="mt-4">
                {/* Header informativo */}
                <Row className="mb-4">
                    <Col>
                        <Card className="bg-gradient-primary text-white">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col>
                                        <h2 className="mb-1">📅 Panel del Cliente</h2>
                                        <p className="mb-0">
                                            Bienvenido/a {user?.nombre || 'Cliente'}. Gestiona tus reservas y turnos.
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
                                            ℹ️ Cómo reservar
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Selector de vista */}
                <Row className="mb-4">
                    <Col>
                        <Card>
                            <Card.Body className="py-3">
                                <div className="d-flex justify-content-center">
                                    <Button
                                        variant={vistaActiva === 'calendario' ? 'primary' : 'outline-primary'}
                                        className="me-3"
                                        onClick={() => setVistaActiva('calendario')}
                                    >
                                        📅 Vista Calendario
                                    </Button>
                                    <Button
                                        variant={vistaActiva === 'lista' ? 'success' : 'outline-success'}
                                        onClick={() => setVistaActiva('lista')}
                                    >
                                        📋 Mis Turnos
                                    </Button>
                                </div>

                                {/* Información de la vista activa */}
                                <div className="text-center mt-2">
                                    <small className="text-muted">
                                        {vistaActiva === 'calendario'
                                            ? 'Visualiza y reserva turnos disponibles en el calendario'
                                            : 'Explora todos los turnos del sistema con información detallada'
                                        }
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Estadísticas rápidas */}
                {vistaActiva === 'calendario' && (
                    <Row className="mb-4">
                        <Col md={3}>
                            <Card className="text-center">
                                <Card.Body>
                                    <h4 className="text-primary">{turnos.length}</h4>
                                    <p className="mb-0">Turnos disponibles</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center">
                                <Card.Body>
                                    <h4 className="text-success">
                                        {turnos.filter(t => t.servicio === 'Pilates').length}
                                    </h4>
                                    <p className="mb-0">Clases de Pilates</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center">
                                <Card.Body>
                                    <h4 className="text-info">
                                        {turnos.filter(t => t.servicio === 'Yoga').length}
                                    </h4>
                                    <p className="mb-0">Clases de Yoga</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center">
                                <Card.Body>
                                    <h4 className="text-warning">
                                        {turnos.filter(t => t.servicio === 'Gimnasia').length}
                                    </h4>
                                    <p className="mb-0">Clases de Gimnasia</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* CONTENIDO PRINCIPAL SEGÚN VISTA */}
                {vistaActiva === 'calendario' ? (
                    /* VISTA CALENDARIO */
                    <Row>
                        <Col>
                            <Calendario
                                turnos={turnos}
                                cargando={cargando}
                                error={error}
                                usuario={user}
                                navigate={navigate}
                                modoSeleccion={false}
                                onReservaIndividual={handleReservaIndividual}
                                onReservaMembresia={handleReservaMembresia}
                                onReservaExitosa={handleReservaExitosa}
                            />
                        </Col>
                    </Row>
                ) : (
                    /* VISTA LISTA DE TURNOS */
                    <Row>
                        <Col>
                            {cargando ? (
                                <Card className="text-center py-5">
                                    <Card.Body>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                        <p className="mt-3">Cargando todos los turnos...</p>
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
                                <ListaTurnos
                                    turnos={turnosCompletos}
                                    user={user} // ← Nueva prop requerida
                                    titulo="Mis Turnos Reservados"
                                />
                            )}
                        </Col>
                    </Row>
                )}

                {/* Información de métodos de pago */}
                {vistaActiva === 'calendario' && (
                    <Row className="mt-4">
                        <Col md={6}>
                            <Card>
                                <Card.Header className="bg-success text-white">
                                    <h6 className="mb-0">💳 Reserva Individual</h6>
                                </Card.Header>
                                <Card.Body>
                                    <p className="mb-2">
                                        <strong>Precio: $2000 por clase</strong>
                                    </p>
                                    <p className="small text-muted mb-0">
                                        Ideal si quieres probar o asistir ocasionalmente. Pago seguro por Mercado Pago.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card>
                                <Card.Header className="bg-primary text-white">
                                    <h6 className="mb-0">🏆 Membresía Mensual</h6>
                                </Card.Header>
                                <Card.Body>
                                    <p className="mb-2">
                                        <strong>$15.000 por mes (8 clases)</strong>
                                    </p>
                                    <p className="small text-muted mb-0">
                                        Acceso ilimitado a todas las clases. Ahorrás 25% respecto al precio individual.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>

            {/* Modal de instrucciones */}
            <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>ℹ️ Cómo usar el panel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>📅 Vista Calendario:</h6>
                    <ol>
                        <li className="mb-2">Haz clic en un turno disponible (verde)</li>
                        <li className="mb-2">Elige entre reserva individual o con membresía</li>
                        <li className="mb-2">Confirma tu reserva</li>
                    </ol>

                    <h6>📋 Vista Lista de Turnos:</h6>
                    <ol>
                        <li className="mb-2">Explora todos los turnos del sistema</li>
                        <li className="mb-2">Haz clic en cada turno para ver detalles completos</li>
                        <li className="mb-2">Revisa las reservas existentes en cada turno</li>
                    </ol>

                    <Alert variant="info" className="small mt-3">
                        🔔 <strong>Activa las notificaciones</strong> para recibir recordatorios de tus clases.
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
