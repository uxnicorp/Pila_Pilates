import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';


export const NavBar = ({ user }) => {

    const navigate = useNavigate();

    const ir_Login = () => {
        emailUs = null;
        navigate('/login', { state: emailUs })
    }

    const ir_gestEmp = () => {
        navigate('/gest-emp', { state: usuario })
    }

    const ir_gestCli = () => {
        navigate('/gest-cli', { state: usuario })
    }



    const ir_LogOut = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Se cerrará tu sesión actual.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                user = null;
                navigate("/*");
            }
        });
    }


    const renderNavbarPorRol = () => {
        switch (user.rol) {
            case 'admin': //navbar de administrador

                return (
                    <Navbar
                        collapseOnSelect expand="lg" sticky="top"

                        className="bg-dark navbar-expand-lg "
                    >
                        <Container fluid>
                            <Navbar.Brand onClick={ir_LogOut}>
                                <h3 className="text-light">
                                    <div className=''>
                                        
                                        <h1> + pila pilates -</h1>
                                    </div>
                                </h3>
                            </Navbar.Brand>
                            <Navbar.Toggle
                                aria-controls="responsive-navbar-nav"
                                className="custom-navbar-toggle text-light"
                            />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="me-auto"></Nav>
                                <Nav>




                                    <Button
                                        className="m-2 rounded-3 custom-dropdown-toggle"
                                        variant="outline-light"

                                    >
                                        gestion de usuarios
                                    </Button>



                                    <Button
                                        className="m-2 rounded-3 custom-dropdown-toggle"
                                        variant="outline-light"

                                    >
                                        crear turnos
                                    </Button>

                                    <Button
                                        className="m-2 rounded-3 custom-dropdown-toggle"
                                        variant="outline-light"

                                    >
                                        historial turnos y reservas
                                    </Button>


                                    <Button
                                        className="m-2 rounded-3 custom-dropdown-toggle"
                                        variant="outline-light"
                                        onClick={ir_LogOut}
                                    >
                                        <i className="bi bi-box-arrow-left"> </i>
                                        Salir
                                    </Button>



                                </Nav>

                            </Navbar.Collapse>

                        </Container>
                    </Navbar>

                );

            case 'empleado': //navbar de empleados
                return (
                    <Navbar
                        collapseOnSelect expand="lg" sticky="top"

                        className="bg-dark navbar-expand-lg "
                    >
                        <Container fluid>
                            <Navbar.Brand onClick={ir_LogOut}>
                                <h3 className="text-light">
                                    <div className=''>
                                       <h1> + pila pilates -</h1>
                                    </div>
                                </h3>
                            </Navbar.Brand>
                            <Navbar.Toggle
                                aria-controls="responsive-navbar-nav"
                                className="custom-navbar-toggle text-light"
                            />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="me-auto"></Nav>
                                <Nav>
                                    <Button
                                        className="m-2 rounded-3 custom-dropdown-toggle"
                                        variant="outline-light"

                                    >
                                        Historial
                                    </Button>



                                    <Button
                                        className="m-2 rounded-3 custom-dropdown-toggle"
                                        variant="outline-light"
                                        onClick={ir_LogOut}
                                    >
                                        <i className="bi bi-box-arrow-left"> </i>
                                        Salir
                                    </Button>



                                </Nav>

                            </Navbar.Collapse>

                        </Container>
                    </Navbar>


                );

            default:

                // default para usuarios clientes
                return (
                    <Navbar
                        collapseOnSelect expand="lg" sticky="top"

                        className="bg-dark navbar-expand-lg "
                    >
                        <Container fluid>
                            <Navbar.Brand onClick={ir_LogOut}>
                                <h3 className="text-light">
                                    <div className=''>
                                        <h1> + pila pilates -</h1>
                                        
                                    </div>
                                </h3>
                            </Navbar.Brand>
                            <Navbar.Toggle
                                aria-controls="responsive-navbar-nav"
                                className="custom-navbar-toggle text-light"
                            />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="me-auto"></Nav>
                                <Nav>

                                    <Button
                                        className="m-2 rounded-3 custom-dropdown-toggle"
                                        variant="outline-light"
                                       
                                    >
                                        Reservar turno
                                    </Button>

                                    <Button
                                        className="m-2 rounded-3 custom-dropdown-toggle"
                                        variant="outline-light"
                                        
                                    >
                                        historial
                                    </Button>

                                    <Button
                                        className="m-2 rounded-3 custom-dropdown-toggle"
                                        variant="outline-light"
                                       
                                    >
                                        nuestros profecionales
                                    </Button>



                                    <Button
                                        className="m-2 rounded-3 custom-dropdown-toggle"
                                        variant="outline-light"
                                        onClick={ir_LogOut}
                                    >
                                        <i className="bi bi-box-arrow-left"> </i>
                                        Salir
                                    </Button>



                                </Nav>

                            </Navbar.Collapse>

                        </Container>
                    </Navbar>
                );
        }
    };

    return (
        <div >


            {renderNavbarPorRol()}


        </div>
    )
}
