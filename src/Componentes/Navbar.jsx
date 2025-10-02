import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const NavBar = ({ user = null }) => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(true); // INICIA EXPANDIDO
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showButtons, setShowButtons] = useState(true); // INICIA MOSTRANDO BOTONES

    const toggleExpansion = () => {
        if (isExpanded) {
            // Si está expandido, primero ocultar botones y luego contraer
            setShowButtons(false);
            setTimeout(() => {
                setIsExpanded(false);
            }, 150);
        } else {
            // Si está contraído, primero expandir y luego mostrar botones
            setIsExpanded(true);
            setTimeout(() => {
                setShowButtons(true);
            }, 200);
        }
    };

    // Detectar cambios en el tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Funciones para cuando NO hay usuario (página de inicio)
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

    // Funciones para cuando SÍ hay usuario
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

    // Función para obtener las opciones del menú
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
                    { text: 'Gestión de usuarios', icon: 'bi-people', action: ir_gestEmp },
                    { text: 'Crear turnos', icon: 'bi-calendar-plus', action: () => {} },
                    { text: 'Historial turnos y reservas', icon: 'bi-clock-history', action: () => {} },
                    { text: 'Salir', icon: 'bi-box-arrow-left', action: ir_LogOut, variant: 'danger' }
                ];
            case 'empleado':
                return [
                    { text: 'Historial', icon: 'bi-clock-history', action: () => {} },
                    { text: 'Salir', icon: 'bi-box-arrow-left', action: ir_LogOut, variant: 'danger' }
                ];
            default:
                return [
                    { text: 'Reservar turno', icon: 'bi-calendar-check', action: () => {} },
                    { text: 'Historial', icon: 'bi-clock-history', action: () => {} },
                    { text: 'Nuestros profesionales', icon: 'bi-person-badge', action: ver_Profesionales },
                    { text: 'Salir', icon: 'bi-box-arrow-left', action: ir_LogOut, variant: 'danger' }
                ];
        }
    };

    const menuOptions = getMenuOptions();

    const navbarStyle = {
        position: 'relative',
        width: isMobile ? '100%' : 'auto',
        alignSelf: !isMobile ? 'flex-end' : 'center',
        backgroundColor: '#2f1d0f',
        borderRadius: '25px',
        padding: !isMobile ? '8px 15px' : '10px 20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: !isMobile ? 'flex-end' : 'center',
        marginBottom: '20px',
        marginTop: '20px',
        minWidth: !isMobile && isExpanded ? `${(menuOptions.length * 160) + 200}px` : !isMobile ? '180px' : 'auto',
        height: !isMobile ? '50px' : 'auto',
        overflow: 'hidden'
    };

    const optionsContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        flexWrap: !isMobile ? 'wrap' : 'nowrap',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        maxWidth: !isMobile && isExpanded ? `${menuOptions.length * 160}px` : !isMobile ? '0px' : '100%',
        maxHeight: isMobile && isExpanded ? `${menuOptions.length * 60}px` : isMobile ? '0px' : 'auto',
        opacity: isExpanded ? 1 : 0,
        marginRight: !isMobile && isExpanded ? '15px' : '0px',
        marginTop: isMobile && isExpanded ? '15px' : '0px',
        width: isMobile ? '100%' : 'auto',
        gap: isMobile ? '8px' : '5px'
    };

    const navLinkStyle = {
        padding: !isMobile ? '6px 12px' : '10px 15px',
        fontSize: !isMobile ? '0.8rem' : '0.9rem',
        border: 'none',
        borderRadius: '15px',
        backgroundColor: '#a1835a',
        color: '#fff8ef',
        transition: 'all 0.3s ease 0.1s',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        minWidth: isMobile ? '200px' : 'auto',
        height: !isMobile ? '32px' : 'auto',
        transform: showButtons ? 'translateX(0) scale(1)' : !isMobile ? 'translateX(-10px) scale(0.8)' : 'translateY(-10px) scale(0.8)',
        opacity: showButtons ? 1 : 0,
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <div className="container-fluid px-3">
            <div className="row">
                <div className="col-12" style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' }}>
                    <div style={navbarStyle}>
                        {/* DESKTOP: Opciones con NavLinks */}
                        {!isMobile && (
                            <Nav style={{
                                ...optionsContainerStyle,
                                order: 1
                            }}>
                                {menuOptions.map((option, index) => (
                                    <Nav.Link
                                        key={index}
                                        onClick={() => {
                                            option.action();
                                            if (user && option.text !== 'Salir') {
                                                toggleExpansion();
                                            } else if (!user) {
                                                toggleExpansion();
                                            }
                                        }}
                                        style={{
                                            ...navLinkStyle,
                                            backgroundColor: option.variant === 'danger' ? '#dc3545' : '#a1835a',
                                            transitionDelay: `${index * 0.05 + 0.1}s`
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px) scale(1.05)';
                                            e.target.style.backgroundColor = option.variant === 'danger' ? '#c82333' : '#8a6f4c';
                                            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0px) scale(1)';
                                            e.target.style.backgroundColor = option.variant === 'danger' ? '#dc3545' : '#a1835a';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        <i className={`bi ${option.icon} me-2`}></i>
                                        {option.text}
                                    </Nav.Link>
                                ))}
                            </Nav>
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
                                letterSpacing: '1px',
                                marginRight: !isMobile ? '0px' : '0px'
                            }}>
                                PILA PILATES
                            </h1>
                            
                            <button
                                onClick={toggleExpansion}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: !isMobile ? '1.3rem' : '1.5rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    padding: !isMobile ? '3px 8px' : '5px 10px',
                                    borderRadius: '50%',
                                    transition: 'all 0.3s ease',
                                    minWidth: !isMobile ? '28px' : '35px',
                                    height: !isMobile ? '28px' : '35px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.transform = 'scale(1)';
                                }}
                            >
                                {isExpanded ? '−' : '+'}
                            </button>
                        </div>

                        {/* MÓVIL: Opciones con NavLinks */}
                        {isMobile && (
                            <Nav style={{
                                ...optionsContainerStyle,
                                order: 2
                            }}>
                                {menuOptions.map((option, index) => (
                                    <Nav.Link
                                        key={index}
                                        onClick={() => {
                                            option.action();
                                            if (user && option.text !== 'Salir') {
                                                toggleExpansion();
                                            } else if (!user) {
                                                toggleExpansion();
                                            }
                                        }}
                                        style={{
                                            ...navLinkStyle,
                                            backgroundColor: option.variant === 'danger' ? '#dc3545' : '#a1835a',
                                            transitionDelay: `${index * 0.05 + 0.1}s`
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'scale(1.05)';
                                            e.target.style.backgroundColor = option.variant === 'danger' ? '#c82333' : '#8a6f4c';
                                            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'scale(1)';
                                            e.target.style.backgroundColor = option.variant === 'danger' ? '#dc3545' : '#a1835a';
                                            e.target.style.boxShadow = 'none';
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
        </div>
    )
}