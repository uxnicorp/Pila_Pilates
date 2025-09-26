import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { cargarEmpleados } from '../helper/cargarEmpleados';

const SelectEmpleado = ({ onProfesionalSelected, value, navigate }) => {
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerEmpleados = async () => {
      try {
        setCargando(true);
        setError(null);
        await cargarEmpleados(setEmpleados, navigate);
      } catch (error) {
        setError('No se pudieron cargar los profesionales');
        console.error('Error en componente:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerEmpleados();
  }, [navigate]);

  const handleChange = (e) => {
    const selectedId = e.target.value;
    const empleadoSeleccionado = empleados.find(emp => emp._id === selectedId);
    onProfesionalSelected(empleadoSeleccionado);
  };

  // CORRECCIÓN CLAVE: Extraer el ID del objeto empleado
  const getSelectedValue = () => {
    // Si value es undefined o null, retornar string vacío
    if (!value) return '';
    
    // Si value es un string (ID), usarlo directamente
    if (typeof value === 'string') {
      return value;
    }
    
    // Si value es un objeto, extraer el _id
    if (value._id) {
      return value._id;
    }
    
    // Si no coincide con nada, string vacío
    return '';
  };

  const selectedValue = getSelectedValue();

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
      value={selectedValue} // Usar el ID extraído
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