import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ModalLogin from './componentes/ModalLogin';
import ModalRegistro from './componentes/ModalRegister';
import "./css/Home.css";

import Nosotros from './secciones/nosotros/Nosotros';
import Footer from '../../Componentes/Footer';
import Clases from './secciones/clases/Clases';
import { Palabras } from './secciones/palabras/Palabras';
import Novedades from './secciones/novedades/Novedades';
import NavBarHome from './componentes/NavbarHome';

const Home = () => {

    //Para Modal de Login
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Para Modal de Register
    const [showR, setShowR] = useState(false);

    const handleCloseReg = () => setShowR(false);
    const handleShowReg = () => setShowR(true);

    // Función para abrir WhatsApp
    const openWhatsApp = () => {
        const phoneNumber = "5491162322732"; // Reemplaza con tu número
        const message = "Hola! Me interesa conocer más sobre Pila Pilates";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <>
            <section className="home-section d-flex align-ites-center">
                {/* NavBar posicionado absolutamente */}
                <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 1050 }}>
                    <NavBarHome />
                </div>
                
                {/* Botón flotante de WhatsApp */}
                <div className="whatsapp-floating" style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    zIndex: 1040,
                    animation: 'pulse 2s infinite'
                }}>
                    <Button
                        onClick={openWhatsApp}
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#25D366',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.1)';
                            e.target.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.4)';
                        }}
                    >
                        <i className="bi bi-whatsapp text-white fs-4"></i>
                    </Button>
                    
                    {/* Efecto de burbuja de chat (opcional) */}
                    <div className="whatsapp-tooltip" style={{
                        position: 'absolute',
                        bottom: '70px',
                        right: '0',
                        backgroundColor: 'white',
                        color: '#2f1d0f',
                        padding: '8px 12px',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        whiteSpace: 'nowrap',
                        opacity: 0,
                        transform: 'translateY(10px)',
                        transition: 'all 0.3s ease',
                        pointerEvents: 'none'
                    }}>
                        ¡Contáctanos por WhatsApp!
                    </div>
                </div>

                <div className="container container-home">
                    <div className="row justify-content-end">
                        <div className="col-12 col-md-6 col-lg-5">
                            <p className="txt-home mb-2 fs-4">
                                Más que un entrenamiento,
                            </p>
                            <h3 className="mb-4 fw-bolder">
                                un momento para reconectar con vos mismo
                            </h3>

                            <div className="home-buttons d-flex flex-column align-items-center gap-3">
                                <Button className="btn btn-home text-white px-4 py-2 rounded-pill fw-semibold fs-5" onClick={handleShowReg}>Inscribite ahora</Button>
                                <Button className="btn btn-home text-white px-4 py-2 rounded-pill fw-semibold fs-5" onClick={handleShow}>Ingresá con tu usuario</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalLogin show={show} handleClose={handleClose} />
                <ModalRegistro show={showR} handleClose={handleCloseReg} />
            </section>
            <div id='nosotros'>
                <Nosotros />
            </div>
            <div id='palabras'>
                <Palabras />
            </div>
            <div id='clases'>
                <Clases />
            </div>
            <div id='novedades'>
                <Novedades />
            </div>
            <div id='foother'>
                <Footer />
            </div>

            {/* Agregar animación de pulso en el CSS o aquí mismo */}
            <style>
                {`
                    @keyframes pulse {
                        0% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.05);
                        }
                        100% {
                            transform: scale(1);
                        }
                    }
                    
                    .whatsapp-floating:hover .whatsapp-tooltip {
                        opacity: 1;
                        transform: translateY(0);
                    }
                `}
            </style>
        </>
    )
}

export default Home;
