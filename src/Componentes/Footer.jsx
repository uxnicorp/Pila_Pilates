import React from 'react'
import "./css/Footer.css"

const Footer = () => {
    return (
        <footer className='container-footer py-5 text-white'>
            <div className='container'>
                <div className='row align-items-center g-4'>
                    {/* Columna info redes */}
                    <div className='col-12 col-md-6 d-flex flex-column align-items-start'>
                        <div className="brand d-flex align-items-center mb-4">
                            <span className="me-2">-</span>
                            <span className="brand-pila">pila</span>
                            <span className="brand-pilates">pilates</span>
                            <span className="ms-1">+</span>
                        </div>

                        <div className="social-info d-flex align-items-center mb-2 fs-5">
                            <i className="bi bi-whatsapp me-2" aria-hidden="true"></i>
                            <span>+54 11 6232-2732</span>
                        </div>

                        <div className="social-info d-flex align-items-center mb-2 fs-5">
                            <i className="bi bi-instagram me-2" aria-hidden="true"></i>
                            <span>@pilapilatesok</span>
                        </div>

                        <div className="d-flex align-items-center fs-5 mt-2">
                            <i className="bi bi-geo-alt me-2" aria-hidden="true"></i>
                            <span className="footer-dir fst-italic">
                                Av. Coronel Esteban Bonorino 149, CABA
                            </span>
                        </div>
                    </div>

                    {/* Columna mapa */}
                    <div className='col-12 col-md-6'>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.9913429576713!2d-58.46179432336012!3d-34.62965905887021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca26270d29f5%3A0x1364679fe48b79a2!2sAv.%20Coronel%20Esteban%20Bonorino%20149%2C%20C1406DMC%20C1406DMC%2C%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1sen!2sar!4v1759197465741!5m2!1sen!2sar"
                            width="100%"
                            height="250"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-3 shadow-sm"
                        ></iframe>
                    </div>
                </div>

                {/* copyright */}
                <div className="text-center mt-4 small">
                    <p className="mb-0">Pila Pilates 2025 - Todos los derechos reservados</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;