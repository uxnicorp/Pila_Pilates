import React, { useEffect, useState } from 'react';
import { Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const NavBar = ({ user = null }) => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showButtons, setShowButtons] = useState(true);

    const toggleExpansion = () => {
        if (isExpanded) {
            setShowButtons(false);
            setTimeout(() => {
                setIsExpanded(false);
            }, 150);
        } else {
            setIsExpanded(true);
            setTimeout(() => {
                setShowButtons(true);
            }, 200);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ===== FUNCIONES PARA CUANDO NO HAY USUARIO =====
    const ir_Login = () => {
        navigate('/login');
    }

    const ir_Registro = () => {
        navigate('/registro');
    }

    const ver_Profesionales = () => {
        navigate('/profesionales');
    }

    const ver_Clases = () => {
        navigate('/clases');
    }

    const ver_Contacto = () => {
        navigate('/contacto');
    }

    // ===== FUNCIONES PARA CUANDO SÍ HAY USUARIO =====
    const ir_gestEmp = () => {
        navigate('/gest-emp', { state: user })
    }

    const ir_gestCli = () => {
        navigate('/gest-cli', { state: user })
    }

    const ir_LogOut = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Se cerrará tu sesión actual.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#2f1d0f",
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar",
            background:"#f4dd99"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                navigate("/*");
            }
        });
    }

    // ===== FUNCIONES DE SCROLL INTERNO PARA PANELES =====
    
    // Para Panel Admin
    const ir_CrearTurno = () => {
        const crearTurnosSection = document.getElementById('crear-turnos-section');
        if (crearTurnosSection) {
            crearTurnosSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    const ir_HistorialAdmin = () => {
        const historialSection = document.getElementById('historial-section');
        if (historialSection) {
            historialSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Para Panel Cliente
    const ir_CalendarioTurnos = () => {
        const calendarioSection = document.getElementById('calendario-section');
        if (calendarioSection) {
            calendarioSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    const ir_MisTurnos = () => {
        const misTurnosSection = document.getElementById('mis-turnos-section');
        if (misTurnosSection) {
            misTurnosSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Para Panel Empleado
    const ir_HistorialEmpleado = () => {
        const historialSection = document.getElementById('historial-section');
        if (historialSection) {
            historialSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // ===== FUNCIÓN PARA OBTENER LAS OPCIONES DEL MENÚ =====
    const getMenuOptions = () => {
        if (!user) {
            return [
                { text: 'Iniciar Sesión', icon: 'bi-box-arrow-in-right', action: ir_Login },
                { text: 'Registrarse', icon: 'bi-person-plus', action: ir_Registro },
                { text: 'Nuestros Profesionales', icon: 'bi-person-badge', action: ver_Profesionales },
                { text: 'Nuestras Clases', icon: 'bi-calendar-check', action: ver_Clases },
                { text: 'Contacto', icon: 'bi-telephone', action: ver_Contacto }
            ];
        }

        switch (user.rol) {
            case 'admin':
                return [
                   // { text: 'Gestión de usuarios', icon: 'bi-people', action: ir_gestEmp },
                    { text: 'Crear turnos', icon: 'bi-calendar-plus', action: ir_CrearTurno },
                    { text: 'Historial', icon: 'bi-clock-history', action: ir_HistorialAdmin },
                    { text: 'Salir', icon: 'bi-box-arrow-left', action: ir_LogOut, variant: 'danger' }
                ];
            case 'empleado':
                return [
                    { text: 'clases', icon: 'bi-clock-history', action: ir_HistorialEmpleado },
                    { text: 'Salir', icon: 'bi-box-arrow-left', action: ir_LogOut, variant: 'danger' }
                ];
            default: // cliente
                return [
                    { text: 'Calendario de turnos', icon: 'bi-calendar-event', action: ir_CalendarioTurnos },
                   // { text: 'Mis turnos', icon: 'bi-clipboard-check', action: ir_MisTurnos },
                    { text: 'Salir', icon: 'bi-box-arrow-left', action: ir_LogOut, variant: 'danger' }
                ];
        }
    };

    const menuOptions = getMenuOptions();

    // ===== ESTILOS (MANTENIENDO LA ESTRUCTURA ORIGINAL) =====
    
    // CÁLCULOS DE ANCHO
    const desktopOptionsWidth = menuOptions.length * 140;
    const mobileOptionsWidth = 150;
    const titleWidth = 120;
    const buttonsWidth = 60;

    // NAVBAR STYLE
    const navbarStyle = {
        position: 'relative',
        width: isMobile ? '100%' : 'auto',
        alignSelf: !isMobile ? 'flex-end' : 'center',
        backgroundColor: '#2f1d0f',
        borderRadius: '25px',
        padding: !isMobile ? '8px 15px' : '10px 15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: !isMobile ? 'flex-end' : 'space-between',
        marginBottom: '20px',
        marginTop: '20px',
        minWidth: !isMobile && isExpanded ? 
            `${desktopOptionsWidth + titleWidth + buttonsWidth}px` : 
            isMobile && isExpanded ? 
            `${mobileOptionsWidth + titleWidth + buttonsWidth}px` : 
            `${titleWidth + buttonsWidth}px`,
        height: !isMobile ? '50px' : 'auto',
        overflow: 'hidden'
    };

    // OPTIONS CONTAINER STYLE
    const optionsContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        maxWidth: !isMobile && isExpanded ? `${desktopOptionsWidth}px` : !isMobile ? '0px' : '100%',
        maxHeight: isMobile && isExpanded ? `${menuOptions.length * 60}px` : isMobile ? '0px' : 'auto',
        opacity: isExpanded ? 1 : 0,
        marginRight: !isMobile && isExpanded ? '10px' : '0px',
        marginTop: isMobile && isExpanded ? '15px' : '0px',
        width: isMobile ? '100%' : 'auto',
        gap: isMobile ? '8px' : '5px',
        flexWrap: 'nowrap'
    };

    // GET NAVLINK STYLE
    const getNavLinkStyle = (index, variant) => ({
        padding: !isMobile ? '6px 12px' : '10px 15px',
        fontSize: !isMobile ? '0.8rem' : '0.9rem',
        border: 'none',
        borderRadius: '15px',
        backgroundColor: 'transparent',
        color: variant === 'danger' ? '#dc3545' : '#a1835a',
        transition: 'all 0.3s ease 0.1s',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        minWidth: isMobile ? '200px' : 'auto',
        height: !isMobile ? '32px' : 'auto',
        transform: showButtons ? 
            (isMobile ? 'translateY(0) scale(1)' : 'translateX(0) scale(1)') : 
            (isMobile ? 'translateY(-10px) scale(0.8)' : 'translateX(-10px) scale(0.8)'),
        opacity: showButtons ? 1 : 0,
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transitionDelay: `${index * 0.05 + 0.1}s`,
        fontWeight: '500',
        position: 'relative',
        flexShrink: 0
    });

    // TOGGLE BUTTON STYLE
    const toggleButtonStyle = {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: !isMobile ? '1.3rem' : '1.5rem',
        fontWeight: 'bold',
        padding: !isMobile ? '3px 8px' : '5px 10px',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        minWidth: !isMobile ? '28px' : '35px',
        height: !isMobile ? '28px' : '35px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    };

    const handleToggleMouseEnter = (e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.transform = 'scale(1.1)';
    };

    const handleToggleMouseLeave = (e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
    };

    return (
        <Container fluid className="px-3">
            <div className="row">
                <div className="col-12" style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' }}>
                    <div style={navbarStyle}>
                        {/* DESKTOP */}
                        {!isMobile && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                order: 1,
                                flexWrap: 'nowrap'
                            }}>
                                {/* Botón izquierdo */}
                                <button
                                    onClick={toggleExpansion}
                                    style={toggleButtonStyle}
                                    onMouseEnter={handleToggleMouseEnter}
                                    onMouseLeave={handleToggleMouseLeave}
                                >
                                    {isExpanded ? '−' : '+'}
                                </button>

                                {/* Opciones del menú */}
                                <Nav style={optionsContainerStyle}>
                                    {menuOptions.map((option, index) => (
                                        <Nav.Link
                                            className='fw-bolder text-navbar-options'
                                            key={index}
                                            as="button"
                                            style={getNavLinkStyle(index, option.variant)}
                                            onClick={() => {
                                                option.action();
                                                if (user && option.text !== 'Salir') {
                                                    toggleExpansion();
                                                } else if (!user) {
                                                    toggleExpansion();
                                                }
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                                                e.currentTarget.style.color = option.variant === 'danger' ? '#c82333' : '#8a6f4c';
                                                e.currentTarget.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
                                                e.currentTarget.style.textDecoration = 'underline';
                                                e.currentTarget.style.textUnderlineOffset = '3px';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                                                e.currentTarget.style.color = option.variant === 'danger' ? '#dc3545' : '#a1835a';
                                                e.currentTarget.style.textShadow = 'none';
                                                e.currentTarget.style.textDecoration = 'none';
                                            }}
                                        >
                                            <i className={`bi ${option.icon} me-2`}></i>
                                            {option.text}
                                        </Nav.Link>
                                    ))}
                                </Nav>
                            </div>
                        )}

                        {/* Header principal */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: isMobile ? 'space-between' : 'flex-end',
                            width: isMobile ? '100%' : 'auto',
                            order: isMobile ? 1 : 2,
                            gap: !isMobile ? '8px' : '0px'
                        }}>
                            <h1 style={{
                                color: 'white',
                                margin: '0',
                                fontSize: !isMobile ? '1.1rem' : '1.1rem',
                                fontWeight: 'bold',
                                letterSpacing: '1px'
                            }}>
                                PILA PILATES
                            </h1>
                            
                            <button
                              
                                style={toggleButtonStyle}
                                onMouseEnter={handleToggleMouseEnter}
                                onMouseLeave={handleToggleMouseLeave}
                            >
                                {isExpanded ? '+' : '−'}
                            </button>
                        </div>

                        {/* MÓVIL */}
                        {isMobile && (
                            <Nav style={{
                                ...optionsContainerStyle,
                                order: 2
                            }}>
                                {menuOptions.map((option, index) => (
                                    <Nav.Link
                                        key={index}
                                        as="button"
                                        style={getNavLinkStyle(index, option.variant)}
                                        onClick={() => {
                                            option.action();
                                            if (user && option.text !== 'Salir') {
                                                toggleExpansion();
                                            } else if (!user) {
                                                toggleExpansion();
                                            }
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.color = option.variant === 'danger' ? '#c82333' : '#8a6f4c';
                                            e.currentTarget.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
                                            e.currentTarget.style.textDecoration = 'underline';
                                            e.currentTarget.style.textUnderlineOffset = '3px';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.color = option.variant === 'danger' ? '#dc3545' : '#a1835a';
                                            e.currentTarget.style.textShadow = 'none';
                                            e.currentTarget.style.textDecoration = 'none';
                                        }}
                                    >
                                        <i className={`bi ${option.icon} me-2`}></i>
                                        {option.text}
                                    </Nav.Link>
                                ))}
                            </Nav>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    )
}