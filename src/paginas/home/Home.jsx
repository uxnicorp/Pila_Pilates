import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ModalLogin from './componentes/ModalLogin';
import ModalRegistro from './componentes/ModalRegister';
import "./css/Home.css";

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
                <div className="container container-home">
                    <div className="row justify-content-end">
                        <div className="col-12 col-md-6 col-lg-5">
                            <p className="txt-home mb-2 fs-4">
                                Más que un entrenamiento,
                            </p>
                            <h3 className="mb-4 fst-italic fw-bolder fs-1">
                                un momento para reconectar con vos mismo
                            </h3>

                            <div className="d-flex flex-column align-items-center gap-3">
                                <Button className="btn btn-home text-white px-4 py-2 rounded-pill fw-semibold" onClick={handleShowReg}>Inscribite ahora</Button>
                                <Button className="btn btn-home text-white px-4 py-2 rounded-pill fw-semibold" onClick={handleShow}>Ingresá con tu usuario</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalLogin show={show} handleClose={handleClose} />
                <ModalRegistro show={showR} handleClose={handleCloseReg} />
            </section>
        </>
    )
}

export default Home;