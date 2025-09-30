import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ModalLogin from './componentes/ModalLogin';
import ModalRegistro from './componentes/ModalRegister';
import "./css/Home.css";
import { NavBar } from '../../Componentes/Navbar';
import Nosotros from './secciones/nosotros/Nosotros';
import Footer from '../../Componentes/Footer';
import Clases from './secciones/clases/Clases';
import { Palabras } from './secciones/palabras/Palabras';
import Novedades from './secciones/novedades/Novedades';

const Home = () => {

    //Para Modal de Login
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Para Modal de Register
    const [showR, setShowR] = useState(false);

    const handleCloseReg = () => setShowR(false);
    const handleShowReg = () => setShowR(true);

    return (
        <>
            <section className="home-section d-flex align-ites-center">
                {/* NavBar posicionado absolutamente */}
    <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 1050 }}>
        <NavBar/>
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
            <Nosotros/>
            <Palabras/>
            <Clases/>
            <Novedades/>
            <Footer/>
        </>
    )
}

export default Home;