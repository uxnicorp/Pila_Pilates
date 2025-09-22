import React from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';


const SelectorHoras = ({ horariosSeleccionados, setHorariosSeleccionados }) => {
  // Horarios predefinidos (puedes modificarlos)
  const horariosDisponibles = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30'
  ];

  const toggleHorario = (horario) => {
    const nuevosHorarios = horariosSeleccionados.includes(horario)
      ? horariosSeleccionados.filter(h => h !== horario)
      : [...horariosSeleccionados, horario];

    // Limitar a máximo 2 horarios seleccionados
    if (nuevosHorarios.length <= 2) {
      setHorariosSeleccionados(nuevosHorarios);
    }
  };

  const calcularHoraFin = (horaInicio) => {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos + 60; // +60 minutos de duración
    const nuevasHoras = Math.floor(totalMinutos / 60);
    const nuevosMinutos = totalMinutos % 60;
    return `${nuevasHoras.toString().padStart(2, '0')}:${nuevosMinutos.toString().padStart(2, '0')}`;
  };

  return (
       <Card>
      <Card.Header>
        <h5>🕐 Seleccionar Dos Horarios</h5>
        <Form.Text className="text-muted">
          Elige dos horarios diferentes. Cada fecha tendrá turnos en ambos horarios.
          {horariosSeleccionados.length === 2 && (
            <span className="text-success"> ✓ Máximo alcanzado</span>
          )}
        </Form.Text>
      </Card.Header>
      <Card.Body>
        <Row>
          {horariosDisponibles.map((horario) => {
            const estaSeleccionado = horariosSeleccionados.includes(horario);
            const estaDeshabilitado = horariosSeleccionados.length === 2 && !estaSeleccionado;

            return (
              <Col key={horario} md={3} className="mb-2">
                <Card
                  onClick={() => !estaDeshabilitado && toggleHorario(horario)}
                  style={{
                    cursor: estaDeshabilitado ? 'not-allowed' : 'pointer',
                    backgroundColor: estaSeleccionado ? '#28a745' : '#f8f9fa',
                    color: estaSeleccionado ? 'white' : 'inherit',
                    opacity: estaDeshabilitado ? 0.5 : 1,
                    border: estaSeleccionado ? '2px solid #28a745' : '1px solid #dee2e6',
                    transition: 'all 0.2s ease'
                  }}
                  className="h-100 text-center"
                >
                  <Card.Body className="py-3">
                    <h6 className="mb-1">{horario}</h6>
                    <small className="text-muted">
                      a {calcularHoraFin(horario)}
                    </small>
                    {estaSeleccionado && (
                      <div className="mt-2">
                        <span className="badge bg-light text-dark">
                          ✓ Seleccionado
                        </span>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {horariosSeleccionados.length > 0 && (
          <div className="mt-3 p-3 bg-light rounded">
            <h6>Horarios seleccionados:</h6>
            {horariosSeleccionados.map((horario, index) => (
              <div key={horario} className="text-success">
                {index + 1}. {horario} - {calcularHoraFin(horario)}
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SelectorHoras;