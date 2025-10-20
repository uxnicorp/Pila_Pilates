import React from 'react'
import ReformerImg from "../../../../assets/pilates-reformer.PNG"
import MatImg from "../../../../assets/pilates-mat.PNG"
import "./css/Clases.css"

const Clases = () => {
    return (
        <section className="py-5">
            <div className="container-clases">
                <h2 className="text-center mb-5">Conocé nuestras clases</h2>
                <div className="row g-5 align-items-start">
                    {/* PILATES REFORMER */}
                    <div className="col-12 col-lg-6">
                        <div className="text-center mb-3">
                            <h5 className="mb-3">Pilates Reformer</h5>
                            <figure className="m-0">
                                <img
                                    src={ReformerImg}
                                    alt="Pilates Reformer"
                                    className="img-clases img-fluid rounded-4 shadow-sm"
                                />
                            </figure>
                        </div>
                        <p className="txt-info-clases text-center px-lg-4 fs-6">
                            Se realiza en una <b>camilla</b> especial con resortes y correas que aportan resistencia. Permite un
                            entrenamiento más profundo y versátil, adaptado a todos los niveles, ideal para ganar fuerza, control y
                            elongación.
                        </p>
                        <div className="txt-horarios-clases text-center fw-bold mt-4">Horarios de la clase</div>
                        <div className="txt-horarios-clases text-center small">
                            Lunes, Miércoles, Viernes | 10:00h, 15:00h
                            <br />
                            Martes, Jueves | 16:00h
                        </div>
                    </div>
                    {/* PILATES MAT */}
                    <div className="col-12 col-lg-6">
                        <div className="text-center mb-3">
                            <h5 className="mb-3">Pilates Mat</h5>
                            <figure className="m-0">
                                <img
                                    src={MatImg}
                                    alt="Pilates Mat"
                                    className="img-clases img-fluid rounded-4 shadow-sm"
                                />
                            </figure>
                        </div>


                        <p className="txt-info-clases text-center px-lg-4 fs-6">
                            Se practica en <b>colchoneta</b> utilizando el propio peso corporal y pequeños accesorios. Mejora la
                            postura, fortalece el <b>core</b> y aumenta la flexibilidad con movimientos controlados y fluidos.
                        </p>


                        <div className="txt-horarios-clases text-center fw-bold mt-4">Horarios de la clase</div>
                        <div className="txt-horarios-clases text-center small">
                            Lunes, Miércoles | 12:00h, 14:00h
                            <br />
                            Martes, Jueves | 13:00h
                            <br />
                            Viernes | 11:00h
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Clases