import React, { useState } from 'react';
import { Accordion, Card, Badge, Row, Col, Button, Table, Alert, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ListaTurnos = ({ 
    turnos = [], 
    user = null,
    titulo = "Mis Turnos Reservados", 
    mostrarAcciones = false,
    onCancelarReserva = () => {}
}) => {
    const [activeKey, setActiveKey] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [reservaACancelar, setReservaACancelar] = useState(null);

    // FUNCIÓN PARA FORMATEAR FECHA - Mismo método que en calendario
    const formatearFecha = (fecha) => {
        // Si la fecha es string, extraer solo la parte de la fecha (YYYY-MM-DD)
        const fechaStr = typeof fecha === 'string' 
            ? fecha.split('T')[0] 
            : fecha.toISOString().split('T')[0];
        
        // Crear array de nombres de días y meses en español
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        // Parsear la fecha string (YYYY-MM-DD)
        const [anio, mes, dia] = fechaStr.split('-').map(Number);
        const fechaObj = new Date(anio, mes - 1, dia); // mes - 1 porque JavaScript cuenta meses desde 0
        
        return `${dias[fechaObj.getDay()]} ${dia} de ${meses[mes - 1]} de ${anio}`;
    };

    // FUNCIÓN PARA VALIDAR SI PUEDE CANCELAR (8 horas antes) - Corregida
    const puedeCancelarReserva = (turno) => {
        const ahora = new Date();
        
        // Obtener la fecha del turno en el mismo formato que el calendario
        const fechaTurnoStr = typeof turno.fecha === 'string' 
            ? turno.fecha.split('T')[0] 
            : turno.fecha.toISOString().split('T')[0];
        
        const [anio, mes, dia] = fechaTurnoStr.split('-').map(Number);
        const fechaTurno = new Date(anio, mes - 1, dia);
        
        // Agregar la hora del turno
        const [horas, minutos] = turno.hora_inicio.split(':').map(Number);
        fechaTurno.setHours(horas, minutos, 0, 0);
        
        // Calcular diferencia en horas
        const diferenciaMs = fechaTurno.getTime() - ahora.getTime();
        const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);
        
        return diferenciaHoras > 8; // Más de 8 horas de diferencia
    };

    // FUNCIÓN PARA CANCELAR RESERVA
    const handleCancelarReserva = async (turno, reserva) => {
        // Primero verificar si puede cancelar
        if (!puedeCancelarReserva(turno)) {
            Swal.fire({
                title: 'No se puede cancelar',
                text: 'Solo puedes cancelar hasta 8 horas antes del turno .',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        try {
            const resultado = await Swal.fire({
                title: '¿Cancelar reserva?',
                html: `
                    <div class="text-left">
                        <p><strong>Servicio:</strong> ${turno.servicio} (Ilustracion solo para la demo) </p>
                        <p><strong>Fecha:</strong> ${formatearFecha(turno.fecha)}</p>
                        <p><strong>Horario:</strong> ${turno.hora_inicio} - ${turno.hora_fin}</p>
                        <p><strong>Profesional:</strong> ${turno.profesional?.nombre} ${turno.profesional?.apellido}</p>
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, cancelar reserva',
                cancelButtonText: 'Mantener reserva',
            });

            if (resultado.isConfirmed) {
                await onCancelarReserva(turno, reserva);
            }
        } catch (error) {
            console.error('Error al cancelar reserva:', error);
            Swal.fire('Error', 'No se pudo cancelar la reserva', 'error');
        }
    };

    // Resto de las funciones (igual que antes)
    const filtrarTurnosDelUsuario = (turnos, usuario) => {
        if (!usuario || !usuario._id) return turnos;
        
        return turnos.filter(turno => {
            return turno.reservas?.some(reserva => {
                return reserva.usuario?._id === usuario._id || 
                       reserva.cliente?.id === usuario._id ||
                       reserva.usuario === usuario._id;
            });
        });
    };

    const turnosFiltrados = filtrarTurnosDelUsuario(turnos, user);

    const getColorServicio = (servicio) => {
        const colores = {
            'Pilates': 'success',
            'Yoga': 'info',
            'Gimnasia': 'warning',
            'default': 'secondary'
        };
        return colores[servicio] || colores.default;
    };

    const calcularCuposDisponibles = (turno) => {
        return turno.cupo_maximo - (turno.reservas?.length || 0);
    };

    const getEstadoTurno = (turno) => {
        if (!turno.activo) return { texto: 'Cancelado', variante: 'danger' };

        const cuposDisponibles = calcularCuposDisponibles(turno);
        if (cuposDisponibles === 0) return { texto: 'Completo', variante: 'dark' };
        if (cuposDisponibles <= 2) return { texto: 'Últimos cupos', variante: 'warning' };

        return { texto: 'Disponible', variante: 'success' };
    };

    const getReservaDelUsuario = (turno, usuario) => {
        if (!usuario) return null;
        
        return turno.reservas?.find(reserva => {
            return reserva.usuario?._id === usuario._id || 
                   reserva.cliente?.id === usuario._id ||
                   reserva.usuario === usuario._id;
        });
    };

    if (!turnos || turnos.length === 0) {
        return (
            <Alert variant="info" className="text-center">
                <h5>📅 No hay turnos para mostrar</h5>
                <p className="mb-0">No se encontraron turnos en el sistema.</p>
            </Alert>
        );
    }

    if (turnosFiltrados.length === 0) {
        return (
            <Alert variant="warning" className="text-center">
                <h5>👤 No tienes turnos reservados</h5>
                <p className="mb-0">
                    {user ? `No se encontraron reservas para ${user.nombre || 'el usuario'}` : 'Usuario no identificado'}
                </p>
            </Alert>
        );
    }

    return (
        <div className="lista-turnos">
            {/* Header del componente */}
            <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-gradient-primary text-white py-3">
                    <Row className="align-items-center">
                        <Col>
                            <h4 className="mb-0">
                                <i className="bi bi-calendar3 me-2"></i>
                                {titulo}
                            </h4>
                            <small>
                                {user ? `Turnos de ${user.nombre || 'usuario'}` : 'Todos los turnos'} • 
                                Total: {turnosFiltrados.length} turnos
                            </small>
                        </Col>
                    </Row>
                </Card.Header>
            </Card>

            {/* Acordeón de turnos */}
            <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
                {turnosFiltrados.map((turno, index) => {
                    const estado = getEstadoTurno(turno);
                    const cuposDisponibles = calcularCuposDisponibles(turno);
                    const reservaUsuario = getReservaDelUsuario(turno, user);
                    const puedeCancelar = puedeCancelarReserva(turno);

                    return (
                        <Accordion.Item key={turno._id || index} eventKey={index.toString()} className="mb-3 border-0 shadow-sm">

                            {/* Header del acordeón */}
                            <Accordion.Header className="py-3">
                                <Row className="w-100 align-items-center">
                                    <Col md={3}>
                                        <div className="d-flex align-items-center">
                                            <Badge bg={getColorServicio(turno.servicio)} className="me-2">
                                                {turno.servicio}
                                            </Badge>
                                            <strong>{formatearFecha(turno.fecha)}</strong>
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <span className="text-muted">
                                            <i className="bi bi-clock me-1"></i>
                                            {turno.hora_inicio} - {turno.hora_fin}
                                        </span>
                                    </Col>
                                    <Col md={2}>
                                        <small className="text-muted">
                                            <i className="bi bi-person-badge me-1"></i>
                                            {turno.profesional?.nombre} {turno.profesional?.apellido}
                                        </small>
                                    </Col>
                                    <Col md={2}>
                                        <Badge bg={estado.variante} className="me-2">
                                            {estado.texto}
                                        </Badge>
                                    </Col>
                                    <Col md={3} className="text-end">
                                        {reservaUsuario && (
                                            <Badge bg={reservaUsuario.estado ? 'success' : 'secondary'} className="me-2">
                                                {reservaUsuario.estado ? '✅ Tu reserva' : '❌ Cancelada'}
                                            </Badge>
                                        )}
                                        <Badge bg="outline-secondary">
                                            {cuposDisponibles}/{turno.cupo_maximo}
                                        </Badge>
                                    </Col>
                                </Row>
                            </Accordion.Header>

                            {/* Contenido desplegable */}
                            <Accordion.Body className="bg-light">
                                {/* Información básica del turno */}
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Card className="h-100 border-0 bg-white shadow-sm">
                                            <Card.Header className="bg-white py-2">
                                                <h6 className="mb-0">
                                                    <i className="bi bi-info-circle me-2 text-primary"></i>
                                                    Información del Turno
                                                </h6>
                                            </Card.Header>
                                            <Card.Body>
                                                <Table borderless size="sm" className="mb-0">
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>Servicio:</strong></td>
                                                            <td>
                                                                <Badge bg={getColorServicio(turno.servicio)}>
                                                                    {turno.servicio}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Fecha:</strong></td>
                                                            <td>{formatearFecha(turno.fecha)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Horario:</strong></td>
                                                            <td>{turno.hora_inicio} - {turno.hora_fin}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Profesional:</strong></td>
                                                            <td>{turno.profesional?.nombre} {turno.profesional?.apellido}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="h-100 border-0 bg-white shadow-sm">
                                            <Card.Header className="bg-white py-2">
                                                <h6 className="mb-0">
                                                    <i className="bi bi-person-check me-2 text-success"></i>
                                                    Mi Reserva
                                                </h6>
                                            </Card.Header>
                                            <Card.Body>
                                                {reservaUsuario ? (
                                                    <>
                                                        <Table borderless size="sm" className="mb-3">
                                                            <tbody>
                                                                <tr>
                                                                    <td><strong>Estado:</strong></td>
                                                                    <td>
                                                                        <Badge bg={reservaUsuario.estado ? 'success' : 'danger'}>
                                                                            {reservaUsuario.estado ? 'Confirmada' : 'Cancelada'}
                                                                        </Badge>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><strong>Asistencia:</strong></td>
                                                                    <td>
                                                                        <Badge bg={reservaUsuario.asistencia ? 'success' : 'warning'}>
                                                                            {reservaUsuario.asistencia ? 'Registrada' : 'Pendiente'}
                                                                        </Badge>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><strong>Tipo de pago:</strong></td>
                                                                    <td>
                                                                        {reservaUsuario.pago_unico ? 'Individual' :
                                                                         reservaUsuario.membresias ? 'Membresía' : 'No especificado'}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                        
                                                        {/* BOTÓN DE CANCELACIÓN */}
                                                        {reservaUsuario.estado && puedeCancelar && (
                                                            <Button 
                                                                variant="outline-danger" 
                                                                size="sm" 
                                                                className="w-100"
                                                                onClick={() => handleCancelarReserva(turno, reservaUsuario)}
                                                            >
                                                                <i className="bi bi-x-circle me-2"></i>
                                                                Cancelar Reserva
                                                            </Button>
                                                        )}
                                                        
                                                        {reservaUsuario.estado && !puedeCancelar && (
                                                            <Alert variant="warning" className="text-center py-2 mb-0">
                                                                <small>
                                                                    <i className="bi bi-clock me-1"></i>
                                                                    No puedes cancelar. Faltan menos de 8 horas para el turno.
                                                                </small>
                                                            </Alert>
                                                        )}
                                                    </>
                                                ) : (
                                                    <Alert variant="warning" className="text-center mb-0 py-2">
                                                        <small>No se encontró tu reserva en este turno</small>
                                                    </Alert>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* ... resto del contenido ... */}
                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </div>
    );
};

export default ListaTurnos;