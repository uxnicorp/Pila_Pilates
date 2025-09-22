import React from 'react'
import { NavBar } from '../../Componentes/Navbar'
import { useLocation } from 'react-router-dom';

export const PanelCliente = () => {

    const location = useLocation();
    const user = location.state;

  return (
    <div>
      <NavBar user={user} />
      <h1>PanelCliente</h1>
      </div>
  )
}
