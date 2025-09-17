import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ModalLogin from './componentes/ModalLogin';

const Home = () => {

    //PARA MODAL LOG IN
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    return (
        <>
            <Button variant="primary" onClick={handleShow}>Ingresá con tu usuario</Button>
            <ModalLogin show={show} handleClose={handleClose}/>
        </>
    )
}

export default Home;