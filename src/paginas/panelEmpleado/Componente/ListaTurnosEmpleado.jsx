import React, { useState } from 'react';
import { Accordion, Card, Badge, Row, Col, Button, Table, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ListaTurnosProfesional = ({ 
    turnos = [], 
    user = null, // El profesional logueado
    titulo = "Mis Turnos Asignados", 
    onMarcarAsistencia = () => {}
}) => {
    const [activeKey, setActiveKey] = useState(null);

    // FUNCIÓN PARA FORMATEAR FECHA
    const formatearFecha = (fecha) => {
        const fechaStr = typeof fecha === 'string' 
            ? fecha.split('T')[0] 
            : fecha.toISOString().split('T')[0];
        
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        const [anio, mes, dia] = fechaStr.split('-').map(Number);
        const fechaObj = new Date(anio, mes - 1, dia);
        
        return `${dias[fechaObj.getDay()]} ${dia} de ${meses[mes - 1]} de ${anio}`;
    };

    // FILTRAR TURNOS DEL PROFESIONAL
 const filtrarTurnosDelProfesional = (turnos, profesional) => {
    if (!profesional || !profesional._id) return turnos;
    
    
    return turnos.filter(turno => {
        console.log(turno)
        // Comparar con el ID dentro del objeto profesional
        return turno.profesional.id?._id === profesional._id || 
               turno.profesional === profesional._id; // por si acaso viene directo el ID
    });
};

    // FUNCIÓN PARA MARCAR ASISTENCIA
    const handleMarcarAsistencia = async (turno, reserva, asistencia) => {
        try {
            const estado = asistencia ? 'presente' : 'ausente';
            const resultado = await Swal.fire({
                title: `¿Marcar como ${estado}?`,
                html: `
                    <div class="text-left">
                        <p><strong>Cliente:</strong> ${reserva.usuario?.nombre || reserva.cliente?.nombre || 'Cliente'} ${reserva.usuario?.apellido || reserva.cliente?.apellido || ''}</p>
                        <p><strong>Servicio:</strong> ${turno.servicio}</p>
                        <p><strong>Fecha:</strong> ${formatearFecha(turno.fecha)}</p>
                        <p><strong>Horario:</strong> ${turno.hora_inicio} - ${turno.hora_fin}</p>
                    </div>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: asistencia ? '#28a745' : '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: `Sí, marcar como ${estado}`,
                cancelButtonText: 'Cancelar',
            });

            if (resultado.isConfirmed) {
                await onMarcarAsistencia(turno, reserva, asistencia);
                
                Swal.fire({
                    title: '¡Asistencia registrada!',
                    text: `El cliente ha sido marcado como ${estado}`,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                });
            }
        } catch (error) {
            console.error('Error al marcar asistencia:', error);
            Swal.fire('Error', 'No se pudo registrar la asistencia', 'error');
        }
    };

    // FUNCIÓN PARA VALIDAR SI EL TURNO YA PASÓ
    const esTurnoPasado = (turno) => {
        const ahora = new Date();
        const fechaTurnoStr = typeof turno.fecha === 'string' 
            ? turno.fecha.split('T')[0] 
            : turno.fecha.toISOString().split('T')[0];
        
        const [anio, mes, dia] = fechaTurnoStr.split('-').map(Number);
        const fechaTurno = new Date(anio, mes - 1, dia);
        
        const [horas, minutos] = turno.hora_fin.split(':').map(Number);
        fechaTurno.setHours(horas, minutos, 0, 0);
        
        return fechaTurno < ahora;
    };

    // FUNCIÓN PARA VALIDAR SI EL TURNO ES HOY
    const esTurnoHoy = (turno) => {
        const hoy = new Date();
        const fechaTurnoStr = typeof turno.fecha === 'string' 
            ? turno.fecha.split('T')[0] 
            : turno.fecha.toISOString().split('T')[0];
        
        const [anio, mes, dia] = fechaTurnoStr.split('-').map(Number);
        const fechaTurno = new Date(anio, mes - 1, dia);
        
        return hoy.toDateString() === fechaTurno.toDateString();
    };

    const turnosFiltrados = filtrarTurnosDelProfesional(turnos, user);

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

    const getEstadoAsistencia = (reserva) => {
        if (reserva.asistencia === true) return { texto: 'Presente', variante: 'success' };
        if (reserva.asistencia === false) return { texto: 'Ausente', variante: 'danger' };
        return { texto: 'Pendiente', variante: 'warning' };
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
                <h5>👨‍🏫 No tienes turnos asignados</h5>
                <p className="mb-0">
                    {user ? `No se encontraron turnos asignados a ${user.nombre || 'el profesional'}` : 'Profesional no identificado'}
                </p>
            </Alert>
        );
    }

    return (
        <div className="lista-turnos-profesional">
            {/* Header del componente */}
            <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-gradient-info text-white py-3">
                    <Row className="align-items-center">
                        <Col>
                            <h4 className="mb-0">
                                <i className="bi bi-clipboard-check me-2"></i>
                                {titulo}
                            </h4>
                            <small>
                                {user ? `Turnos de ${user.nombre || 'profesional'}` : 'Turnos del profesional'} • 
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
                    const turnoPasado = esTurnoPasado(turno);
                    const turnoHoy = esTurnoHoy(turno);
                    const reservasActivas = turno.reservas?.filter(r => r.estado !== false) || [];

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
                                        <Badge bg={estado.variante} className="me-2">
                                            {estado.texto}
                                        </Badge>
                                        {turnoPasado && <Badge bg="secondary">Finalizado</Badge>}
                                        {turnoHoy && !turnoPasado && <Badge bg="warning">Hoy</Badge>}
                                    </Col>
                                    <Col md={3}>
                                        <small className="text-muted">
                                            <i className="bi bi-people me-1"></i>
                                            {reservasActivas.length} reservas activas
                                        </small>
                                    </Col>
                                    <Col md={2} className="text-end">
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
                                                            <td><strong>Estado:</strong></td>
                                                            <td>
                                                                <Badge bg={estado.variante}>{estado.texto}</Badge>
                                                                {turnoPasado && <Badge bg="secondary" className="ms-1">Finalizado</Badge>}
                                                                {turnoHoy && !turnoPasado && <Badge bg="warning" className="ms-1">Hoy</Badge>}
                                                            </td>
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
                                                    <i className="bi bi-graph-up me-2 text-success"></i>
                                                    Estadísticas
                                                </h6>
                                            </Card.Header>
                                            <Card.Body>
                                                <Table borderless size="sm" className="mb-0">
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>Total reservas:</strong></td>
                                                            <td>{turno.reservas?.length || 0}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Reservas activas:</strong></td>
                                                            <td>{reservasActivas.length}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Cupos disponibles:</strong></td>
                                                            <td>{cuposDisponibles}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Asistencias registradas:</strong></td>
                                                            <td>
                                                                {turno.reservas?.filter(r => r.asistencia !== null).length || 0}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Lista de clientes/reservas */}
                                <Card className="border-0 bg-white shadow-sm">
                                    <Card.Header className="bg-white py-2">
                                        <h6 className="mb-0">
                                            <i className="bi bi-people-fill me-2 text-info"></i>
                                            Lista de Clientes ({reservasActivas.length})
                                        </h6>
                                    </Card.Header>
                                    <Card.Body>
                                        {reservasActivas.length === 0 ? (
                                            <Alert variant="info" className="text-center mb-0">
                                                No hay reservas activas para este turno
                                            </Alert>
                                        ) : (
                                            <Table responsive bordered hover>
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th>Cliente</th>
                                                        <th>Contacto</th>
                                                        <th>Estado Reserva</th>
                                                        <th>Asistencia</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {reservasActivas.map((reserva, idx) => {
                                                        const estadoAsistencia = getEstadoAsistencia(reserva);
                                                        const cliente = reserva.usuario || reserva.cliente;
                                                        
                                                        return (
                                                            <tr key={reserva._id || idx}>
                                                                <td>
                                                                    <strong>
                                                                        {cliente?.nombre} {cliente?.apellido}
                                                                    </strong>
                                                                </td>
                                                                <td>
                                                                    {cliente?.email && (
                                                                        <div>
                                                                            <small className="text-muted">
                                                                                <i className="bi bi-envelope me-1"></i>
                                                                                {cliente.email}
                                                                            </small>
                                                                        </div>
                                                                    )}
                                                                    {cliente?.telefono && (
                                                                        <div>
                                                                            <small className="text-muted">
                                                                                <i className="bi bi-phone me-1"></i>
                                                                                {cliente.telefono}
                                                                            </small>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <Badge bg={reserva.estado ? 'success' : 'secondary'}>
                                                                        {reserva.estado ? 'Confirmada' : 'Cancelada'}
                                                                    </Badge>
                                                                </td>
                                                                <td>
                                                                    <Badge bg={estadoAsistencia.variante}>
                                                                        {estadoAsistencia.texto}
                                                                    </Badge>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex gap-2">
                                                                        <Button
                                                                            variant="outline-success"
                                                                            size="sm"
                                                                            disabled={turnoPasado}
                                                                            onClick={() => handleMarcarAsistencia(turno, reserva, true)}
                                                                        >
                                                                            <i className="bi bi-check-lg me-1"></i>
                                                                            Presente
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline-danger"
                                                                            size="sm"
                                                                            disabled={turnoPasado}
                                                                            onClick={() => handleMarcarAsistencia(turno, reserva, false)}
                                                                        >
                                                                            <i className="bi bi-x-lg me-1"></i>
                                                                            Ausente
                                                                        </Button>
                                                                        {turnoPasado && (
                                                                            <small className="text-muted align-self-center">
                                                                                Turno finalizado
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </div>
    );
};

export default ListaTurnosProfesional;