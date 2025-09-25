import React, { useState } from 'react'
import "./css/Nosotros.css"
import CamilaImg from "../../../../assets/camila-profe.jpg"
import ClaraImg from "../../../../assets/clara-profe.jpg"
import JulietaImg from "../../../../assets/julieta-profe.jpg"
import ModalPautas from './componentes/ModalPautas'

const Nosotros = () => {


    const [showPautas, setShowPautas] = useState(false);

  const handleClosePautas = () => setShowPautas(false);
  const handleShowPautas = () => setShowPautas(true);

    return (
        <>
            <section className='py-5 seccion-nosotros'>
                <div className='container'>
                    <div className='row g-5'>
                        <div className='col-12 col-lg-7 pe-lg-5 position-relative'>
                            <h2 className='display-5 fw-bold mb-4'>Sobre PilaPilates</h2>
                            <p className='txt-parrafo-nosotros'>
                                Somos un estudio ubicado en el barrio porteño de <b>Flores</b>, dedicado a promover el bienestar integral a través del <b>movimiento consciente</b>. Nuestro espacio está diseñado para que cada persona pueda encontrar un <b>momento de conexión entre cuerpo y mente</b>, trabajando la fuerza, la flexibilidad y la postura en un ambiente cálido y personalizado.<br /><br />
                                Creemos que el Pilates es mucho más que un entrenamiento físico: es una herramienta para <b>mejorar la calidad de vida</b>, prevenir lesiones y potenciar la energía en el día a día. Contamos con un equipo de profesoras capacitadas y apasionadas por la disciplina, que acompañan a cada alumno en su proceso, adaptando las clases a sus necesidades y objetivos.<br /><br />
                                Nuestro compromiso es brindar un espacio cercano, profesional y motivador, donde cada sesión sea una <b>experiencia única de cuidado personal y bienestar</b>.
                            </p>
                            <div className='d-flex justify-content-center justify-content-lg-end mt-4'>
                                <button type="button" className='btn btn-home btn-nosotros text-white rounded-pill fw-semibold' onClick={handleShowPautas}>
                                    Pautas del Estudio
                                </button>
                            </div>
                            <span className="divider d-none d-lg-block position-absolute top-0 end-0 h-100" />
                        </div>
                        <div className='col-12 col-lg-5 ps-lg-5'>
                            <h2 className='display-6 fw-bold mb-4'>Profesoras</h2>
                            {/* PROFE 1 */}
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <img src={ClaraImg} alt="Clara Escobar" className='img-profes rounded-circle flex-shrink-0' />
                                <div>
                                    <h5>Clara Escobar</h5>
                                    <div className='txt-profes'>
                                        Prof. Educación Física - ISEF N°2 <br />
                                        Pilates Reformer - Nexo Pilates & Therapy
                                    </div>
                                </div>
                            </div>
                            {/* PROFE 2 */}
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <img src={JulietaImg} alt="Julieta Cuellar" className='img-profes rounded-circle flex-shrink-0' />
                                <div>
                                    <h5>Julieta Cuellar</h5>
                                    <div className='txt-profes'>
                                        Instructora Pilates Mat y Reformer - IPEF
                                    </div>
                                </div>
                            </div>
                            {/* PROFE 3 */}
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <img src={CamilaImg} alt="Camila Crespo" className='img-profes rounded-circle flex-shrink-0' />
                                <div>
                                    <h5>Camila Crespo</h5>
                                    <div className='txt-profes'>
                                        Prof. Educación Física - ISEF N°1 <br />
                                        Instructora Pilates Mat - AMAIP
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ModalPautas show={showPautas} onHide={() => setShowPautas(false)} />
        </>
    )
}

export default Nosotros;