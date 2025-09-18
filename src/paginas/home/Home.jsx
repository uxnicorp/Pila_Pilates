import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ModalLogin from './componentes/ModalLogin';
import ModalRegistro from './componentes/ModalRegister';

const Home = () => {

    //PARA MODAL LOG IN
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Para Modal de Register
    const [showR, setShowR] = useState(false);

    const handleCloseReg = () => setShowR(false);
    const handleShowReg = () => setShowR(true);



    return (
        <>
            <Button variant="primary" onClick={handleShow}>Ingresá con tu usuario</Button>
            <Button variant="primary" onClick={handleShowReg}>Inscribite ahora</Button>
            <ModalLogin show={show} handleClose={handleClose} />
            <ModalRegistro show={showR} handleClose={handleCloseReg} />
        </>
    )
}

export default Home;