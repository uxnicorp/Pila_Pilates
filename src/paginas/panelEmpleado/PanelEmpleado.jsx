import React from 'react'
import { useLocation } from 'react-router-dom';
import { NavBar } from '../../Componentes/Navbar';

export const PanelEmpleado = () => {
  
      const location = useLocation();
    const user = location.state;
  
  return (
    <div>
      <NavBar user={user} />
      <h1>PanelEmpleado</h1>
      </div>
  )
}
