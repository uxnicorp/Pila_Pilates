import React, { useState } from 'react';
import ImgMadre from "../../../../assets/news-pila-madres.PNG";
import ImgInauguracion from "../../../../assets/news-pila-nuevo-salon.PNG";
import "./css/Novedades.css";

const Novedades = () => {
    const EVENTS = {
        diaDeLaMadre: {
            id: "diaDeLaMadre",
            title: "Día de la Madre en Pila",
            desc: `Vení a festejar este día tan especial con nosotros y conocé el nuevo salón.
            Este 19 de Octubre te invitamos a hacer una clase en nuestro estudio y luego se ofrecerá una merienda para todos los participantes.
            
            Apurate a reservar tu lugar, ¡los cupos son limitados!`,
            img: ImgMadre,
            cta: "https://wa.me/5491112345678",
        },
        inauguracion: {
            id: "inauguracion",
            title: "Inauguramos un nuevo salón de Yoga y Pilates Mat",
            desc: `Abrimos un nuevo espacio pensado para mejorar tu experiencia: más luz natural, más equipamiento y un ambiente cálido para tus clases.
            
            Sumate a la inauguración con clases abiertas y promos especiales.`,
            img: ImgInauguracion,
            cta: "https://wa.me/5491112345678",
        }
    };

    const [activeEvent, setActiveEvent] = useState(EVENTS.diaDeLaMadre);

    //Para la animacion
    const [fading, setFading] = useState(false);
    //Hace fade out, cambia el evento, hace fade in
    const handleShowEvent = (evt, eventObj) => {
        evt.preventDefault();
        setFading(true);
        setTimeout(() => {
            setActiveEvent(eventObj);
            setFading(false);
        }, 250);
    };

    return (
        <>
            <section className="eventos-section py-5">
                <div className="container">
                    <h2 className="mb-4 title-novedades">Últimas novedades en Pila</h2>

                    {/* Evento principal */}
                    <div className={`row g-4 align-items-center mb-5 fade-wrapper ${fading ? 'fade-out' : 'fade-in'}`}>
                        {/*Imagen */}
                        <div className="col-12 col-lg-7">
                            <img
                                src={activeEvent.img}
                                alt={activeEvent.title}
                                className="img-fluid rounded-5 img-novedades"
                            />
                        </div>
                        {/*Texto evento Principal */}
                        <div className="col-12 col-lg-5">
                            <h4 className="title-evento mb-3 fs-2">{activeEvent.title}</h4>
                            <p className="txt-parrafo-evento mb-3" style={{ whiteSpace: 'pre-line' }}>
                                {activeEvent.desc}
                            </p>

                            <div className="d-flex justify-content-center">
                                <a href={activeEvent.cta} target="_blank" rel="noreferrer" className="btn btn-home btn-novedades text-white rounded-pill fw-semibold d-inline-flex align-items-center text-center gap-2" >
                                    Reservá tu lugar
                                    <i className="bi bi-arrow-right-short fs-4"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Cards inferiores */}
                    <div className="row g-4 align-items-stretch">

                        {/* card 1 */}
                        <div className="col-12 col-lg-6 d-flex">
                            <div className="d-flex align-items-stretch gap-3 w-100">
                                <div className="plus-col d-flex align-items-center justify-content-center">
                                    <i className="bi bi-plus-lg plus-inline"></i>
                                </div>
                                <article className="card-promo rounded-4 shadow-sm p-3 p-md-4 w-100 d-flex h-100">
                                    <img src={EVENTS.inauguracion.img} alt="Inauguración" className="thumb rounded-3 flex-shrink-0" />

                                    <div className="ms-3 d-flex flex-column justify-content-between flex-grow-1">
                                        <h5 className="mb-3">
                                            {EVENTS.inauguracion.title}
                                        </h5>
                                        <div className="mt-auto d-flex justify-content-end">
                                            <a href="#" className="btn btn-evento-inferior rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1" onClick={(e) => handleShowEvent(e, EVENTS.inauguracion)}>
                                                Conocé más <i className="bi bi-arrow-right-short fs-5"></i>
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>

                        {/* card 2 */}
                        <div className="col-12 col-lg-6 d-flex">
                            <div className="d-flex align-items-stretch gap-3 w-100">
                                <div className="plus-col d-flex align-items-center justify-content-center">
                                    <i className="bi bi-plus-lg plus-inline"></i>
                                </div>

                                <article className="card-promo rounded-4 shadow-sm p-3 p-md-4 w-100 d-flex h-100">
                                    <img src={EVENTS.diaDeLaMadre.img} alt="Día de la Madre" className="thumb rounded-3 flex-shrink-0" />

                                    <div className="ms-3 d-flex flex-column justify-content-between flex-grow-1">
                                        <h5 className="mb-3">{EVENTS.diaDeLaMadre.title}</h5>

                                        <div className="mt-auto d-flex justify-content-end">
                                            <a href="#" className="btn btn-evento-inferior rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1" onClick={(e) => handleShowEvent(e, EVENTS.diaDeLaMadre)}>
                                                Conocé más
                                                <i className="bi bi-arrow-right-short fs-5"></i>
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default Novedades;
