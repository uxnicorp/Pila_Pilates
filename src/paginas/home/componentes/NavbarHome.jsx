import React, { useState, useEffect } from 'react';
import { Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function NavBar() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showButtons, setShowButtons] = useState(true);

    // Función para hacer scroll a las secciones
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Cerramos el navbar después de hacer click (especialmente útil en móvil)
        if (isMobile) {
            toggleExpansion();
        }
    };

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

    // Opciones del menú actualizadas con los IDs correctos
    const menuOptions = [
        { text: 'Nosotros', icon: 'bi bi-people-fill', section: 'nosotros' },
        { text: 'beneficios', icon: 'bi bi-caret-up-fill', section: 'palabras' },
        { text: 'Clases', icon: 'bi bi-person-arms-up', section: 'clases' },
        { text: 'Novedades', icon: 'bi bi-newspaper', section: 'novedades' },
        { text: 'Encontranos', icon: 'bi bi-geo-alt-fill', section: 'foother' }
    ];

    // En móvil, filtramos para mostrar solo "Nuestros Profesionales"
    const mobileMenuOptions = menuOptions.filter(option =>
        option.text === 'Clases'
    );

    // Calculamos el ancho exacto basado en el número de opciones
    const desktopOptionsWidth = menuOptions.length * 140;
    const mobileOptionsWidth = 200;
    const titleWidth = 120;
    const buttonsWidth = 60;

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
        flexDirection: 'row',
        justifyContent: !isMobile ? 'flex-end' : 'space-between',
        marginBottom: '20px',
        marginTop: '20px',
        minWidth: !isMobile && isExpanded ? 
            `${desktopOptionsWidth + titleWidth + buttonsWidth}px` : 
            isMobile && isExpanded ? 
            `${mobileOptionsWidth + titleWidth + buttonsWidth}px` : 
            `${titleWidth + buttonsWidth}px`,
        height: '50px',
        overflow: 'hidden'
    };

    const optionsContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        maxWidth: !isMobile && isExpanded ? `${desktopOptionsWidth}px` :
            isMobile && isExpanded ? `${mobileOptionsWidth}px` : '0px',
        opacity: isExpanded ? 1 : 0,
        marginRight: !isMobile && isExpanded ? '10px' : '0px',
        width: 'auto',
        gap: '5px'
    };

    const getNavLinkStyle = (index, variant) => ({
        padding: !isMobile ? '6px 12px' : '8px 12px',
        fontSize: !isMobile ? '0.8rem' : '0.8rem',
        border: 'none',
        borderRadius: '15px',
        backgroundColor: 'transparent',
        color: variant === 'primary' ? '#0d6efd' : '#a1835a',
        transition: 'all 0.3s ease 0.1s',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        height: '32px',
        transform: showButtons ? 'translateX(0) scale(1)' : 'translateX(-10px) scale(0.8)',
        opacity: showButtons ? 1 : 0,
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transitionDelay: `${index * 0.05 + 0.1}s`,
        fontWeight: '500',
        position: 'relative'
    });

    const toggleButtonStyle = {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '1.3rem',
        fontWeight: 'bold',
        padding: '3px 8px',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        minWidth: '28px',
        height: '28px',
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
                        {/* DESKTOP: Botón izquierdo + Todas las opciones */}
                        {!isMobile && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                order: 1
                            }}>
                                {/* Botón izquierdo (- cuando expandido, + cuando comprimido) */}
                                <button
                                    onClick={toggleExpansion}
                                    style={toggleButtonStyle}
                                    onMouseEnter={handleToggleMouseEnter}
                                    onMouseLeave={handleToggleMouseLeave}
                                >
                                    {isExpanded ? '−' : '+'}
                                </button>

                                {/* Opciones del menú completas */}
                                <Nav style={optionsContainerStyle}>
                                    {menuOptions.map((option, index) => (
                                        <Nav.Link
                                            className='fw-bolder text-navbar-options'
                                            key={index}
                                            as="button" // Cambiamos a button para evitar el href
                                            style={getNavLinkStyle(index, option.variant)}
                                            onClick={() => scrollToSection(option.section)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                                                e.currentTarget.style.color = option.variant === 'primary' ? '#0b5ed7' : '#8a6f4c';
                                                e.currentTarget.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
                                                e.currentTarget.style.textDecoration = 'underline';
                                                e.currentTarget.style.textUnderlineOffset = '3px';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                                                e.currentTarget.style.color = option.variant === 'primary' ? '#0d6efd' : '#a1835a';
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

                        {/* MÓVIL: Botón izquierdo + Solo "Nuestros Profesionales" */}
                        {isMobile && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                order: 1
                            }}>
                                {/* Botón izquierdo (- cuando expandido, + cuando comprimido) */}
                                <button
                                    onClick={toggleExpansion}
                                    style={toggleButtonStyle}
                                    onMouseEnter={handleToggleMouseEnter}
                                    onMouseLeave={handleToggleMouseLeave}
                                >
                                    {isExpanded ? '−' : '+'}
                                </button>

                                {/* Solo "Nuestros Profesionales" en móvil */}
                                <Nav style={optionsContainerStyle}>
                                    {mobileMenuOptions.map((option, index) => (
                                        <Nav.Link
                                            key={index}
                                            as="button"
                                            style={getNavLinkStyle(index, option.variant)}
                                            onClick={() => scrollToSection(option.section)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                                                e.currentTarget.style.color = option.variant === 'primary' ? '#0b5ed7' : '#8a6f4c';
                                                e.currentTarget.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
                                                e.currentTarget.style.textDecoration = 'underline';
                                                e.currentTarget.style.textUnderlineOffset = '3px';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                                                e.currentTarget.style.color = option.variant === 'primary' ? '#0d6efd' : '#a1835a';
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

                        {/* Header principal con botón derecho */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            width: 'auto',
                            order: 2,
                            gap: '8px'
                        }}>
                            {/* Título */}
                            <h1 className='txt-navbar-tit mb-2 fs-4'>
                                Pila Pilates
                            </h1>

                            {/* Botón derecho (+ cuando expandido, - cuando comprimido) */}
                            <button
                                onClick={toggleExpansion}
                                style={toggleButtonStyle}
                                onMouseEnter={handleToggleMouseEnter}
                                onMouseLeave={handleToggleMouseLeave}
                            >
                                {isExpanded ? '+' : '−'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}