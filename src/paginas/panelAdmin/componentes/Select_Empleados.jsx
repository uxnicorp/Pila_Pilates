import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios'; // Asegúrate de tener axios instalado
import { cargarEmpleados } from '../helper/cargarEmpleados';

const SelectEmpleado = ({ onProfesionalSelected, value, navigate }) => {
  // Estado para almacenar la lista de empleados
  const [empleados, setEmpleados] = useState([]);
  // Estado para manejar la carga
  const [cargando, setCargando] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);

  // useEffect para hacer la petición al montar el componente
 useEffect(() => {
    const obtenerEmpleados = async () => {
      try {
        setCargando(true);
        setError(null);
        // Usamos el helper personalizado
        await cargarEmpleados(setEmpleados, navigate);
      } catch (error) {
        // El helper ya mostró la alerta, pero podemos capturar el error localmente
        setError('No se pudieron cargar los profesionales');
        console.error('Error en componente:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerEmpleados();
  }, [navigate]); // navigate como dependencia

  // Manejar cambio de selección
  const handleChange = (e) => {
    const selectedId = e.target.value;
    // Encontrar el empleado completo basado en el ID seleccionado
    const empleadoSeleccionado = empleados.find(emp => emp._id === selectedId);
    // Llamar a la función callback con el objeto completo del empleado
    onProfesionalSelected(empleadoSeleccionado);
  };

  if (cargando) {
    return (
      <Form.Select disabled>
        <option>Cargando profesionales...</option>
      </Form.Select>
    );
  }

  if (error) {
    return (
      <Form.Select disabled>
        <option>{error}</option>
      </Form.Select>
    );
  }

  return (
    <Form.Select 
      onChange={handleChange}
      value={value || ''}
      required
    >
      <option value="">Seleccionar profesional</option>
      {empleados.map((empleado) => (
        <option key={empleado._id} value={empleado._id}>
          {empleado.nombre} {empleado.apellido}
        </option>
      ))}
    </Form.Select>
  );
};

export default SelectEmpleado;