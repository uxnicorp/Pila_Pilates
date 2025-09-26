import React from 'react'
import "./css/Footer.css"

const Footer = () => {
    return (
        <footer className='container-footer py-5 text-white'>
            <div className='container'>
                <div className='row align-items-center g-4'>
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
                            <span className="footer-dir fst-italic">Av. Coronel Esteban Bonorino 149, CABA</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;