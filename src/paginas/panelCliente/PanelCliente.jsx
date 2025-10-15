import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Modal,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import BotonNotificaciones from "../../Componentes/Notificaciones";
import Swal from "sweetalert2";

import { NavBar } from "../../Componentes/Navbar";
import Calendario from "./componente/Calendario_Cliente";
import { obtenerTurnosParaCalendario } from "../panelAdmin/helper/cargarTurnos";
import ListaTurnos from "./componente/ListaTurnosCliente";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/PanelCliente.css";

export const PanelCliente = () => {
  const location = useLocation();
  const user = location.state;
  const navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [turnosCompletos, setTurnosCompletos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [vistaActiva, setVistaActiva] = useState("calendario");

  const cargarTurnos = async () => {
    try {
      setCargando(true);
      setError(null);
      const todosLosTurnos = await obtenerTurnosParaCalendario();
      setTurnosCompletos(todosLosTurnos);

      const turnosDisponibles = todosLosTurnos.filter((turno) => {
        const cuposDisponibles =
          turno.cupo_maximo - (turno.reservas?.length || 0);
        return cuposDisponibles > 0;
      });

      setTurnos(turnosDisponibles);
    } catch (err) {
      setError("No se pudieron cargar los turnos disponibles");
      console.error("Error:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  const handleReservaIndividual = async (turno) => {
    try {
      Swal.fire({
        title: "¿Confirmar reserva individual?",
        text: `Reservar ${turno.servicio} con ${
          turno.profesional.nombre
        } el ${new Date(turno.fecha).toLocaleDateString()} a las ${
          turno.hora_inicio
        }`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, reservar ($2000)",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire(
            "¡Reserva exitosa!",
            "Tu turno ha sido reservado correctamente.",
            "success"
          );
          await cargarTurnos();
        }
      });
    } catch (error) {
      console.error("Error en reserva individual:", error);
      Swal.fire("Error", "No se pudo completar la reserva", "error");
    }
  };

  const handleReservaMembresia = async (turno) => {
    try {
      Swal.fire({
        title: "¿Confirmar reserva con membresía?",
        text: `Reservar ${turno.servicio} con ${turno.profesional.nombre} usando tu membresía mensual`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, reservar con membresía",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire(
            "¡Reserva exitosa!",
            "Tu turno ha sido reservado con tu membresía.",
            "success"
          );
          await cargarTurnos();
        }
      });
    } catch (error) {
      console.error("Error en reserva con membresía:", error);
      Swal.fire("Error", "No se pudo completar la reserva", "error");
    }
  };

  return (
    <div className="panel-cliente-page">
      {/* ===== HERO ===== */}
      <header
        className="cliente-hero"
        style={{ backgroundImage: "url(/pilates-hero.jpg)" }}
      >
        <div className="cliente-hero__overlay">
          <div className="cliente-hero__navbar">
            <NavBar user={user} />
          </div>

          <div className="cliente-hero__copy">
            <p className="frase-principal">
              El lugar donde el movimiento se convierte en energía renovada
            </p>
            <p className="frase-secundaria">Pensamos en tu bienestar</p>
          </div>
        </div>
      </header>

      {/* ===== CONTENIDO ===== */}
      <Container fluid className="mt-4">
        {/* Header informativo */}
        <Row className="mb-4" id="calendario-section">
          <Col>
            <Card className="bg-gradient-info text-white">
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <h2 className="mb-1 panel-cliente-title">
                      Panel del Cliente
                    </h2>
                    <p className="mb-0">
                      Bienvenido/a {user?.nombre || "Cliente"}. Gestiona tus
                      reservas y turnos.
                    </p>
                  </Col>

                  <Col xs="auto">
                    <div className="panel-actions">
                      <BotonNotificaciones
                        className="panel-linkbtn"
                        iconColor="#3e2214"
                      />

                      <Button
                        variant="light"
                        size="sm"
                        className="panel-linkbtn"
                        onClick={() => setShowInfoModal(true)}
                      >
                        <i
                          className="bi bi-info-circle btn-ico"
                          style={{ color: "#3e2214" }}
                        />
                        Instrucciones
                      </Button>

                      <Button
                        variant="outline-light"
                        size="sm"
                        className="panel-linkbtn"
                        onClick={cargarTurnos}
                        disabled={cargando}
                      >
                        <i
                          className="bi bi-arrow-clockwise btn-ico"
                          style={{ color: "#3e2214" }}
                        />
                        Actualizar
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Selector de vista */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body className="py-3">
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    className="panel-pill-btn me-3"
                    onClick={() => setVistaActiva("calendario")}
                  >
                    <i className="bi bi-calendar-event" aria-hidden="true" />
                    <span>Vista Calendario</span>
                  </Button>
                  <Button
                    variant="primary"
                    className="panel-pill-btn"
                    onClick={() => setVistaActiva("lista")}
                  >
                    <i className="bi bi-clipboard" aria-hidden="true" />
                    <span>Mis Turnos</span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Contenido principal */}
        {vistaActiva === "calendario" ? (
          <Row>
            <Col>
              <Calendario
                turnos={turnos}
                cargando={cargando}
                error={error}
                usuario={user}
                navigate={navigate}
                modoSeleccion={false}
                onReservaIndividual={handleReservaIndividual}
                onReservaMembresia={handleReservaMembresia}
                onReservaExitosa={cargarTurnos}
              />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col>
              {cargando ? (
                <Card className="text-center py-5">
                  <Card.Body>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3">Cargando todos los turnos...</p>
                  </Card.Body>
                </Card>
              ) : error ? (
                <Alert variant="danger" className="text-center">
                  <h5>Error al cargar los turnos</h5>
                  <p>{error}</p>
                  <Button variant="outline-danger" onClick={cargarTurnos}>
                    Reintentar
                  </Button>
                </Alert>
              ) : (
                <ListaTurnos
                  turnos={turnosCompletos}
                  user={user}
                  titulo="Mis Turnos Reservados"
                />
              )}
            </Col>
          </Row>
        )}
      </Container>

      {/* ===== Modal Instrucciones ===== */}
      <Modal
        show={showInfoModal}
        onHide={() => setShowInfoModal(false)}
        size="lg"
        dialogClassName="modal-instrucciones"
        contentClassName="modal-instrucciones-content"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-info-circle me-2" />
            Instrucciones para Clientes
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h6>
            <i className="bi bi-calendar-check me-2" />
            Cómo Reservar:
          </h6>
          <ol>
            <li className="mb-2">
              Haz clic en un turno disponible (verde) del calendario
            </li>
            <li className="mb-2">
              Elige entre reserva individual o con membresía
            </li>
            <li className="mb-2">Confirma tu reserva</li>
          </ol>

          <h6>
            <i className="bi bi-clipboard2-check me-2" />
            Consultar tus Turnos:
          </h6>
          <ol>
            <li className="mb-2">Cambia a la vista "Mis Turnos"</li>
            <li className="mb-2">
              Visualiza tus reservas confirmadas o pendientes
            </li>
          </ol>

          <Alert variant="info" className="small mt-3">
            <i className="bi bi-lightbulb me-2" />
            Activa las notificaciones para recibir recordatorios de tus clases.
          </Alert>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowInfoModal(false)}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PanelCliente;
