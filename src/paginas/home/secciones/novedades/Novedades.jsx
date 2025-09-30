import React from 'react'
import ImgHero1 from "../../../../assets/news-pila-madres.PNG"
import "./css/Novedades.css"

const Novedades = () => {
    return (
        <>
            <section className="eventos-section py-5">
                <div className="container">
                    <h2 className="mb-4 title-novedades">Últimas novedades en Pila</h2>
                    <div className="row g-4 align-items-center mb-5">

                        {/*Imagen*/}
                        <div className="col-12 col-lg-7">
                            <img
                                src={ImgHero1}
                                alt="Clase de Pilates"
                                className="img-fluid rounded-5 event-hero-img"
                            />
                        </div>

                        {/* Texto*/}
                        <div className="col-12 col-lg-5">
                            <h4 className="event-title mb-3 fs-2">Día de la Madre en Pila</h4>
                            <p className="txt-parrafo-evento mb-3 ">
                                Vení a festejar este día tan especial con nosotros
                                y conocé el nuevo salón. Este 19 de Octubre te invitamos a hacer
                                una clase en nuestro estudio y luego se ofrecerá una merienda
                                para todos los participantes.
                                <br /><br />Apurate a reservar tu lugar, ¡los cupos son limitados!
                            </p>

                            <div className="d-flex justify-content-center">
                                <a
                                    href="https://wa.me/5491112345678"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-home text-white rounded-pill fw-semibold d-inline-flex align-items-center gap-2"
                                >
                                    Reservá tu lugar por Whatsapp
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
                                    <img
                                        src={ImgHero1}
                                        alt="Inauguración"
                                        className="thumb rounded-3 flex-shrink-0"
                                    />
                                    {/* Nombre del Evento 1 */}
                                    <div className="ms-3 d-flex flex-column justify-content-between flex-grow-1">
                                        <h5 className="mb-3">
                                            Inauguramos un nuevo salón de Yoga y Pilates Mat
                                        </h5>
                                        <div className="mt-auto d-flex justify-content-end">
                                            <a
                                                href="#"
                                                className="btn btn-evento-inferior rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1"
                                            >
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
                                    <img
                                        src={ImgHero1}
                                        alt="Día de la Madre"
                                        className="thumb rounded-3 flex-shrink-0"
                                    />
                                    {/* Nombre del Evento 2 */}
                                    <div className="ms-3 d-flex flex-column justify-content-between flex-grow-1">
                                        <h5 className="mb-3">Vení a pasar el Día de la madre en Pila</h5>

                                        <div className="mt-auto d-flex justify-content-end">
                                            <a
                                                href="#"
                                                className="btn btn-evento-inferior rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1"
                                            >
                                                Conocé más <i className="bi bi-arrow-right-short fs-5"></i>
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
    )
}

export default Novedades;