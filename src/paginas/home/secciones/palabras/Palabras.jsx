import React from 'react'
import "./css/Palabras.css"

export const Palabras = () => {
  return (
    <>
    <section className="contrastes py-5">
      <div className="container">
        <div className="row align-items-center text-light">
          {/* Columna - */}
          <div className="col-12 col-lg-6 d-flex align-items-center gap-4 mb-5 mb-lg-0">
            <span className="signo menos" aria-hidden="true" />
            <h3 className="lista m-0">
              <span>estrés</span>
              <span>tensiones</span>
              <span>límites</span>
            </h3>
          </div>

          {/* Columna + */}
          <div className="col-12 col-lg-6 d-flex align-items-center gap-4">
            <span className="signo mas" aria-hidden="true" />
            <h3 className="lista m-0">
              <span>movimiento</span>
              <span>consciencia</span>
              <span>fuerza</span>
            </h3>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
