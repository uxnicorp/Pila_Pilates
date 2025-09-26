import React, { useState } from 'react';
import { Accordion, Card, Badge, Row, Col, Button, Table, Alert } from 'react-bootstrap';

const ListaTurnos = ({ turnos = [], titulo = "Listado de Turnos", mostrarAcciones = false }) => {
    const [activeKey, setActiveKey] = useState(null);

    // Función para formatear la fecha
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

    // Función para obtener el color según el servicio
    const getColorServicio = (servicio) => {
        const colores = {
            'Pilates': 'success',
            'Yoga': 'info',
            'Gimnasia': 'warning',
            'default': 'secondary'
        };
        return colores[servicio] || colores.default;
    };

    // Función para calcular cupos disponibles
    const calcularCuposDisponibles = (turno) => {
        return turno.cupo_maximo - (turno.reservas?.length || 0);
    };

    // Función para obtener estado del turno
    const getEstadoTurno = (turno) => {
        if (!turno.activo) return { texto: 'Cancelado', variante: 'danger' };

        const cuposDisponibles = calcularCuposDisponibles(turno);
        if (cuposDisponibles === 0) return { texto: 'Completo', variante: 'dark' };
        if (cuposDisponibles <= 2) return { texto: 'Últimos cupos', variante: 'warning' };

        return { texto: 'Disponible', variante: 'success' };
    };

    if (!turnos || turnos.length === 0) {
        return (
            <Alert variant="info" className="text-center">
                <h5>📅 No hay turnos para mostrar</h5>
                <p className="mb-0">No se encontraron turnos en el sistema.</p>
            </Alert>
        );
    }

    return (
        <div className="lista-turnos">
            {/* Header del componente */}
            <Card className=" bg_head_calendar mb-4 border-0 shadow-sm">
                <Card.Header className="bg-gradient-primary text-white py-3">
                    <Row className="align-items-center">
                        <Col>
                            <h4 className="mb-0">
                                <i className="bi bi-calendar3 me-2"></i>
                                {titulo}
                            </h4>
                            <small>Total: {turnos.length} turnos</small>
                        </Col>
                        <Col xs="auto">
                            <Badge bg="light" text="dark" className="fs-6">
                                {turnos.filter(t => t.activo).length} activos
                            </Badge>
                        </Col>
                    </Row>
                </Card.Header>
            </Card>

            {/* Acordeón de turnos */}
            <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
                {turnos.map((turno, index) => {
                    const estado = getEstadoTurno(turno);
                    const cuposDisponibles = calcularCuposDisponibles(turno);

                    return (
                        <Accordion.Item key={turno._id || index} eventKey={index.toString()} className="mb-3 border-0 shadow-sm">

                            {/* Header del acordeón */}
                            <Accordion.Header className="py-3">
                                <Row className="w-100 align-items-center">
                                    <Col md={3}>
                                        <div className="d-flex align-items-center">
                                            <Badge
                                                bg={getColorServicio(turno.servicio)}
                                                className="me-2"
                                            >
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
                                    <Col md={3}>
                                        <small className="text-muted">
                                            <i className="bi bi-person-badge me-1"></i>
                                            {turno.profesional?.nombre || 'Profesional'} {turno.profesional?.apellido || 'No asignado'}
                                        </small>
                                    </Col>
                                    <Col md={2}>
                                        <Badge bg={estado.variante} className="me-2">
                                            {estado.texto}
                                        </Badge>
                                        <Badge bg="outline-secondary">
                                            {cuposDisponibles}/{turno.cupo_maximo}
                                        </Badge>
                                    </Col>
                                    <Col md={2} className="text-end">
                                        <Badge bg={turno.reservas?.length > 0 ? 'primary' : 'secondary'}>
                                            {turno.reservas?.length || 0} reservas
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
                                                            <td><strong>Duración:</strong></td>
                                                            <td>60 minutos</td>
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
                                                    <i className="bi bi-person-badge me-2 text-success"></i>
                                                    Información del Profesional
                                                </h6>
                                            </Card.Header>
                                            <Card.Body>
                                                <Table borderless size="sm" className="mb-0">
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>Nombre:</strong></td>
                                                            <td>{turno.profesional?.nombre} {turno.profesional?.apellido}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Estado:</strong></td>
                                                            <td>
                                                                <Badge bg={turno.activo ? 'success' : 'danger'}>
                                                                    {turno.activo ? 'Activo' : 'Cancelado'}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Cupos:</strong></td>
                                                            <td>
                                                                <Badge bg={cuposDisponibles > 0 ? 'success' : 'dark'}>
                                                                    {cuposDisponibles} disponibles de {turno.cupo_maximo}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Lista de reservas */}
                                <Card className="border-0 bg-white shadow-sm">
                                    <Card.Header className="bg-white py-2">
                                        <h6 className="mb-0">
                                            <i className="bi bi-people me-2 text-info"></i>
                                            Reservas ({turno.reservas?.length || 0})
                                        </h6>
                                    </Card.Header>
                                    <Card.Body>
                                        {turno.reservas && turno.reservas.length > 0 ? (
                                            <div className="table-responsive">
                                                <Table striped bordered hover size="sm">
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th>Cliente</th>
                                                            <th>Estado</th>
                                                            <th>Asistencia</th>
                                                            <th>Tipo de Pago</th>
                                                            <th>Monto</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {turno.reservas.map((reserva, idx) => (
                                                            <tr key={reserva._id || idx}>
                                                                <td>
                                                                    <strong>
                                                                        {reserva.cliente?.nombre || 'Nombre'} {reserva.cliente?.apellido || 'Apellido'}
                                                                    </strong>
                                                                </td>
                                                                <td>
                                                                    <Badge bg={reserva.estado ? 'success' : 'secondary'}>
                                                                        {reserva.estado ? 'Confirmada' : 'Cancelada'}
                                                                    </Badge>
                                                                </td>
                                                                <td>
                                                                    <Badge bg={reserva.asistencia ? 'success' : 'warning'}>
                                                                        {reserva.asistencia ? 'Presente' : 'Pendiente'}
                                                                    </Badge>
                                                                </td>
                                                                <td>
                                                                    {reserva.pago_unico ? 'Individual' :
                                                                        reserva.membresias ? 'Membresía' : 'No especificado'}
                                                                </td>
                                                                <td>
                                                                    {reserva.pago_unico ? `$${reserva.pago_unico.monto}` : 'Membresía'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <Alert variant="light" className="text-center mb-0">
                                                <i className="bi bi-info-circle me-2"></i>
                                                No hay reservas para este turno
                                            </Alert>
                                        )}
                                    </Card.Body>
                                </Card>

                                {/* Acciones (opcional) */}
                                {mostrarAcciones && (
                                    <div className="mt-3 text-end">
                                        <Button variant="outline-primary" size="sm" className="me-2">
                                            <i className="bi bi-pencil me-1"></i>
                                            Editar
                                        </Button>
                                        <Button variant="outline-danger" size="sm">
                                            <i className="bi bi-trash me-1"></i>
                                            Cancelar Turno
                                        </Button>
                                    </div>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </div>
    );
};

export default ListaTurnos;