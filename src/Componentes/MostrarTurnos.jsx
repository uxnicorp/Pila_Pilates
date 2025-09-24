/**
 * Componente MostrarTurnos
 *
 * Este componente se encarga de mostrar la lista de turnos según el usuario logueado (admin, cliente, empleado).
 * - Admin: ve todos los turnos activos, con info de empleados y clientes, y puede cancelar o modificar turnos.
 * - Empleado: ve sus turnos asignados y puede marcar asistencia de los clientes.
 * - Cliente: ve sus turnos reservados y puede cancelar/modificar si faltan más de 8 horas.
 *
 * ¿Cómo funciona?
 * - Cuando se monta, pide los turnos al backend (solo los activos).
 * - Según el tipo de usuario, muestra distinta info y botones.
 * - Usa estilos para que se vea prolijo y fácil de leer.
 *
 * ¿Cómo usarlo?
 * <MostrarTurnos tipoUsuario="admin" userInfo={usuarioActual} />
 * - tipoUsuario: "admin", "empleado" o "cliente" (si no se pasa, hay un selector para testear)
 * - userInfo: datos del usuario logueado (para filtrar reservas del cliente)
 *
 * El código está comentado en las partes clave nomas.
 */
import React, { useState, useEffect } from "react"; // Importamos React y hooks
import "./MostrarTurnos.css";
import authApi from "../api/authApi";

const MostrarTurnos = ({ tipoUsuario = null, userInfo = null }) => {

  const [tipoUsuarioTest, setTipoUsuarioTest] = useState("admin");

  const tipoUsuarioActual = tipoUsuario || tipoUsuarioTest;

  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pide los turnos al backend. Solo trae los activos (por el endpoint)
  const obtenerTurnos = async () => {
    try {
      setLoading(true);

      const response = await authApi.get("turnos/mis?type=active");

      if (response.data.ok) {
        setTurnos(response.data.turnos);
      } else {
        setError("Error al cargar los turnos");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Admin puede cancelar un turno. Llama al backend y actualiza la lista
  const darDeBajaTurno = async (turnoId) => {
    try {
      const response = await authApi.put(`turnos/baja/${turnoId}`);

      if (response.data.ok) {
        // Actualizar la lista de turnos
        obtenerTurnos();
        // alert("Turno cancelado correctamente");
      } else {
        // alert("Error al cancelar el turno");
      }
    } catch (error) {
      console.error("Error:", error);
      // alert("Error de conexión");
    }
  };

  // Para saber si se puede cancelar/modificar: si faltan menos de 8 horas, no se puede
  const faltanMenosDe8Horas = (fecha, horaInicio) => {
    const ahora = new Date();
    const fechaTurno = new Date(fecha);
    const [horas, minutos] = horaInicio.split(":");
    fechaTurno.setHours(parseInt(horas), parseInt(minutos), 0, 0);

    const diferenciaMs = fechaTurno.getTime() - ahora.getTime();
    const diferencia8Horas = 8 * 60 * 60 * 1000; // 8 horas en milisegundos

    return diferenciaMs < diferencia8Horas;
  };

  // Para saber si el turno ya terminó (para mostrarlo como "pasado")
  const turnoYaPaso = (fecha, horaFin) => {
    const ahora = new Date();
    const fechaTurno = new Date(fecha);
    const [horas, minutos] = horaFin.split(":");
    fechaTurno.setHours(parseInt(horas), parseInt(minutos), 0, 0);

    return fechaTurno.getTime() < ahora.getTime();
  };

  // Deja la fecha linda para mostrar
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Botón de modificar turno (todavía no implementado, solo muestra un alert)
  const modificarTurno = (turnoId) => {
    alert(`Modificar turno ${turnoId} - Funcionalidad por implementar papilo`);
  };

  // El cliente puede cancelar su reserva si faltan más de 8 horas
  const cancelarReserva = async (reservaId) => {
    try {
      const response = await authApi.put(`/reserva/cancelar/${reservaId}`);
      if (response.data.ok) {
        obtenerTurnos();
        // alert("Reserva cancelada correctamente");
      } else {
        // alert(response.data.msg || "No se pudo cancelar la reserva");
      }
    } catch (error) {
      console.error("Error:", error);
      // alert("Error de conexión");
    }
  };

  // El empleado puede marcar si el cliente fue o no al turno
  const marcarAsistencia = async (reservaId) => {
    try {
      const response = await authApi.put(`/reserva/asistencia/${reservaId}`);
      if (response.data.ok) {
        obtenerTurnos();
        // alert(response.data.msg);
      } else {
        // alert(response.data.msg || "No se pudo cambiar la asistencia");
      }
    } catch (error) {
      console.error("Error:", error);
      // alert("Error de conexión");
    }
  };

  // Cuando se monta el componente, pide los turnos
  useEffect(() => {
    obtenerTurnos();
  }, []);

  // Si está cargando, muestra el cartel de carga
  if (loading) {
    return <div className="turnos-loading">Cargando turnos...</div>;
  }

  // Si hay error, lo muestra
  if (error) {
    return <div className="turnos-error">{error}</div>;
  }

  return (
    <div className="mostrar-turnos">
      {/* Si no se pasa tipoUsuario, aparece un selector para testear como admin/cliente/empleado */}
      {!tipoUsuario && (
        <div className="tipo-usuario-control">
          <label>Tipo de usuario (para testing): </label>
          <select
            value={tipoUsuarioTest}
            onChange={(e) => setTipoUsuarioTest(e.target.value)}
            className="select-tipo-usuario"
          >
            <option value="admin">Admin</option>
            <option value="cliente">Cliente</option>
            <option value="empleado">Empleado</option>
          </select>
        </div>
      )}

      {/* Título según el tipo de usuario */}
      <h2 className="turnos-titulo">
        {tipoUsuarioActual === "admin"
          ? "Todos los Turnos"
          : tipoUsuarioActual === "empleado"
          ? "Mis Turnos Asignados"
          : "Mis Turnos"}
      </h2>

      {/* Si no hay turnos, muestra el cartel. Si hay, los lista. */}
      {turnos.length === 0 ? (
        <div className="no-turnos">No hay turnos disponibles</div>
      ) : (
        <div className="turnos-lista turnos-lista-columna">
          {/* Separar turnos en pasados y futuros */}
          {(() => {
            const turnosOrdenados = turnos
              .slice()
              .sort((a, b) => {
                const fechaA = new Date(a.fecha);
                const fechaB = new Date(b.fecha);
                if (fechaA.getTime() === fechaB.getTime()) {
                  const [horaA, minA] = a.hora_inicio.split(":").map(Number);
                  const [horaB, minB] = b.hora_inicio.split(":").map(Number);
                  return (horaB * 60 + minB) - (horaA * 60 + minA);
                }
                return fechaB.getTime() - fechaA.getTime();
              });
            const turnosPasados = turnosOrdenados.filter(t => turnoYaPaso(t.fecha, t.hora_fin));
            const turnosFuturos = turnosOrdenados.filter(t => !turnoYaPaso(t.fecha, t.hora_fin));
            
            return (
              <>
                {turnosPasados.length > 0 && (
                  <div className="seccion-turnos-pasados">
                    <h3 style={{marginTop: '16px', marginBottom: '8px'}}>Turnos ya ocurridos</h3>
                    {turnosPasados.map((turno) => {
                      const yaPaso = true;
                      const menosDe8Horas = faltanMenosDe8Horas(turno.fecha, turno.hora_inicio);
                      if (tipoUsuarioActual === "admin" && turno.activo === false) return null;
                      
                      return (
                        <div
                          key={turno._id}
                          className={`turno-card turno-pasado`}
                        >
                          {/* Header con fecha, horario y servicio */}
                          <div className="turno-header">
                            <div className="turno-fecha">
                              <h3>{formatearFecha(turno.fecha)}</h3>
                              <p className="turno-horario">
                                {turno.hora_inicio} - {turno.hora_fin}
                              </p>
                            </div>
                            <div className="turno-servicio">
                              <span className="servicio-badge">{turno.servicio}</span>
                            </div>
                          </div>

                          {/* Cuerpo con info de profesional, clientes, etc. */}
                          <div className="turno-body">
                            {/* ADMIN: ve todo: empleado, clientes, info completa y botones */}
                            {tipoUsuarioActual === "admin" && (
                              <>
                                <div className="turno-profesional" style={{background: '#e3f6fc', padding: '16px', borderRadius: '8px', marginBottom: '16px'}}>
                                  <h4 style={{marginBottom: '8px'}}>Empleado a cargo:</h4>
                                  <div><b>Nombre:</b> {turno.profesional.nombre}</div>
                                  <div><b>Apellido:</b> {turno.profesional.apellido}</div>
                                  {turno.profesional.telefono && (
                                    <div><b>Teléfono:</b> {turno.profesional.telefono}</div>
                                  )}
                                </div>
                                <div className="turno-reservas" style={{background: '#fff3cd', padding: '16px', borderRadius: '8px', marginBottom: '16px'}}>
                                  <h4 style={{marginBottom: '8px'}}>Clientes en este turno:</h4>
                                  {turno.reservas.map((reserva, index) => (
                                    <div key={index} style={{background: '#fff', borderRadius: '6px', padding: '12px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
                                      <div style={{fontWeight: 'bold', marginBottom: '4px'}}>{reserva.cliente?.nombre} {reserva.cliente?.apellido}</div>
                                      {reserva.cliente?.telefono && (
                                        <div><b>Teléfono:</b> {reserva.cliente.telefono}</div>
                                      )}
                                      <div><b>Hora de reserva:</b> {reserva.hora_reserva}</div>
                                      <div><b>Método de pago:</b> {reserva.pago_unico?.metodo || 'N/A'} {reserva.pago_unico?.monto ? `($${reserva.pago_unico.monto})` : ''}</div>
                                      {reserva.membresias && (
                                        <div><b>Membresía:</b> {reserva.membresias.fecha_inicio ? `Desde ${new Date(reserva.membresias.fecha_inicio).toLocaleDateString()}` : ''} {reserva.membresias.fecha_fin ? `hasta ${new Date(reserva.membresias.fecha_fin).toLocaleDateString()}` : ''}</div>
                                      )}
                                      <div><b>Estado:</b> {reserva.estado ? 'Activa' : 'Cancelada'}</div>
                                      <div><b>Asistencia:</b> {reserva.asistencia ? 'Presente' : 'Ausente'}</div>
                                    </div>
                                  ))}
                                </div>
                                <div className="turno-info" style={{background: '#e3f6fc', padding: '16px', borderRadius: '8px'}}>
                                  <h4 style={{marginBottom: '8px'}}>Información del turno:</h4>
                                  <div><b>Fecha:</b> {formatearFecha(turno.fecha)}</div>
                                  <div><b>Hora inicio:</b> {turno.hora_inicio}</div>
                                  <div><b>Hora fin:</b> {turno.hora_fin}</div>
                                  <div><b>Cupos ocupados:</b> {turno.reservas.length}/{turno.cupo_maximo}</div>
                                </div>
                              </>
                            )}

                            {/* CLIENTE: ve cupos disponibles */}
                            {tipoUsuarioActual === "cliente" && (
                              <>
                                <div className="turno-cupos">
                                  <p>
                                    Cupos disponibles:{" "}
                                    {turno.cupo_maximo - (turno.reservas?.length || 0)}/
                                    {turno.cupo_maximo}
                                  </p>
                                </div>
                                <div className="turno-empleado" style={{background: '#ede7f6', padding: '12px', borderRadius: '8px', marginTop: '8px'}}>
                                  <span style={{fontWeight: 'bold'}}>Empleado que te atenderá:</span>
                                  <div>Nombre: {turno.profesional?.nombre} {turno.profesional?.apellido}</div>
                                  {turno.profesional?.telefono && (
                                    <div>Teléfono: {turno.profesional.telefono}</div>
                                  )}
                                </div>
                              </>
                            )}

                            {/* EMPLEADO: ve sus turnos y puede marcar asistencia */}
                            {tipoUsuarioActual === "empleado" && (
                              <>
                                <div className="turno-profesional">
                                  <h4>Tu turno asignado</h4>
                                  <p>
                                    {turno.profesional.nombre}{" "}
                                    {turno.profesional.apellido}
                                  </p>
                                </div>
                                <div className="turno-reservas">
                                  <h4>Clientes en este turno:</h4>
                                  <ul className="lista-clientes">
                                    {turno.reservas.map((reserva, index) => (
                                      <li
                                        key={index}
                                        className={`cliente-item ${
                                          !reserva.estado ? "cancelado" : ""
                                        }`}
                                      >
                                        <div>
                                          <b>
                                            {reserva.cliente?.nombre}{" "}
                                            {reserva.cliente?.apellido}
                                          </b>
                                        </div>
                                        <div>
                                          Asistencia:{" "}
                                          {reserva.asistencia ? "Presente" : "Ausente"}
                                        </div>
                                        {reserva.estado &&
                                          faltanMenosDe8Horas(turno.fecha, turno.hora_inicio) &&
                                          !turnoYaPaso(turno.fecha, turno.hora_fin) && (
                                            <button
                                              className="btn-asistencia"
                                              style={{ marginLeft: "8px" }}
                                              onClick={async () => {
                                                await marcarAsistencia(reserva._id);
                                              }}
                                            >
                                              Marcar como{" "}
                                              {reserva.asistencia ? "ausente" : "presente"}
                                            </button>
                                          )}
                                        {!reserva.estado && (
                                          <span className="estado-cancelado">
                                            {" "}(Cancelado)
                                          </span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Si el turno ya pasó, muestra el cartel de completado */}
                          {yaPaso && (
                            <div className="turno-completado">
                              <span>✅ Turno completado</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {turnosFuturos.length > 0 && (
                  <div className="seccion-turnos-futuros">
                    <h3 style={{marginTop: '16px', marginBottom: '8px'}}>Próximos turnos</h3>
                    {turnosFuturos.map((turno) => {
                      const yaPaso = false;
                      const menosDe8Horas = faltanMenosDe8Horas(turno.fecha, turno.hora_inicio);
                      if (tipoUsuarioActual === "admin" && turno.activo === false) return null;
                      
                      return (
                        <div
                          key={turno._id}
                          className={`turno-card`}
                        >
                          {/* Header con fecha, horario y servicio */}
                          <div className="turno-header">
                            <div className="turno-fecha">
                              <h3>{formatearFecha(turno.fecha)}</h3>
                              <p className="turno-horario">
                                {turno.hora_inicio} - {turno.hora_fin}
                              </p>
                            </div>
                            <div className="turno-servicio">
                              <span className="servicio-badge">{turno.servicio}</span>
                            </div>
                          </div>

                          {/* Cuerpo con info de profesional, clientes, etc. */}
                          <div className="turno-body">
                            {/* ADMIN: ve todo: empleado, clientes, info completa y botones */}
                            {tipoUsuarioActual === "admin" && (
                              <>
                                <div className="turno-profesional" style={{background: '#e3f6fc', padding: '16px', borderRadius: '8px', marginBottom: '16px'}}>
                                  <h4 style={{marginBottom: '8px'}}>Empleado a cargo:</h4>
                                  <div><b>Nombre:</b> {turno.profesional.nombre}</div>
                                  <div><b>Apellido:</b> {turno.profesional.apellido}</div>
                                  {turno.profesional.telefono && (
                                    <div><b>Teléfono:</b> {turno.profesional.telefono}</div>
                                  )}
                                </div>
                                <div className="turno-reservas" style={{background: '#fff3cd', padding: '16px', borderRadius: '8px', marginBottom: '16px'}}>
                                  <h4 style={{marginBottom: '8px'}}>Clientes en este turno:</h4>
                                  {turno.reservas.map((reserva, index) => (
                                    <div key={index} style={{background: '#fff', borderRadius: '6px', padding: '12px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
                                      <div style={{fontWeight: 'bold', marginBottom: '4px'}}>{reserva.cliente?.nombre} {reserva.cliente?.apellido}</div>
                                      {reserva.cliente?.telefono && (
                                        <div><b>Teléfono:</b> {reserva.cliente.telefono}</div>
                                      )}
                                      <div><b>Hora de reserva:</b> {reserva.hora_reserva}</div>
                                      <div><b>Método de pago:</b> {reserva.pago_unico?.metodo || 'N/A'} {reserva.pago_unico?.monto ? `($${reserva.pago_unico.monto})` : ''}</div>
                                      {reserva.membresias && (
                                        <div><b>Membresía:</b> {reserva.membresias.fecha_inicio ? `Desde ${new Date(reserva.membresias.fecha_inicio).toLocaleDateString()}` : ''} {reserva.membresias.fecha_fin ? `hasta ${new Date(reserva.membresias.fecha_fin).toLocaleDateString()}` : ''}</div>
                                      )}
                                      <div><b>Estado:</b> {reserva.estado ? 'Activa' : 'Cancelada'}</div>
                                      <div><b>Asistencia:</b> {reserva.asistencia ? 'Presente' : 'Ausente'}</div>
                                    </div>
                                  ))}
                                </div>
                                <div className="turno-info" style={{background: '#e3f6fc', padding: '16px', borderRadius: '8px'}}>
                                  <h4 style={{marginBottom: '8px'}}>Información del turno:</h4>
                                  <div><b>Fecha:</b> {formatearFecha(turno.fecha)}</div>
                                  <div><b>Hora inicio:</b> {turno.hora_inicio}</div>
                                  <div><b>Hora fin:</b> {turno.hora_fin}</div>
                                  <div><b>Cupos ocupados:</b> {turno.reservas.length}/{turno.cupo_maximo}</div>
                                </div>
                              </>
                            )}

                            {/* CLIENTE: ve cupos disponibles */}
                            {tipoUsuarioActual === "cliente" && (
                              <>
                                <div className="turno-cupos">
                                  <p>
                                    Cupos disponibles:{" "}
                                    {turno.cupo_maximo - (turno.reservas?.length || 0)}/
                                    {turno.cupo_maximo}
                                  </p>
                                </div>
                                <div className="turno-empleado" style={{background: '#ede7f6', padding: '12px', borderRadius: '8px', marginTop: '8px'}}>
                                  <span style={{fontWeight: 'bold'}}>Empleado que te atenderá:</span>
                                  <div>Nombre: {turno.profesional?.nombre} {turno.profesional?.apellido}</div>
                                  {turno.profesional?.telefono && (
                                    <div>Teléfono: {turno.profesional.telefono}</div>
                                  )}
                                </div>
                              </>
                            )}

                            {/* EMPLEADO: ve sus turnos y puede marcar asistencia */}
                            {tipoUsuarioActual === "empleado" && (
                              <>
                                <div className="turno-profesional">
                                  <h4>Tu turno asignado</h4>
                                  <p>
                                    {turno.profesional.nombre}{" "}
                                    {turno.profesional.apellido}
                                  </p>
                                </div>
                                <div className="turno-reservas">
                                  <h4>Clientes en este turno:</h4>
                                  <ul className="lista-clientes">
                                    {turno.reservas.map((reserva, index) => (
                                      <li
                                        key={index}
                                        className={`cliente-item ${
                                          !reserva.estado ? "cancelado" : ""
                                        }`}
                                      >
                                        <div>
                                          <b>
                                            {reserva.cliente?.nombre}{" "}
                                            {reserva.cliente?.apellido}
                                          </b>
                                        </div>
                                        <div>
                                          Asistencia:{" "}
                                          {reserva.asistencia ? "Presente" : "Ausente"}
                                        </div>
                                        {reserva.estado &&
                                          faltanMenosDe8Horas(turno.fecha, turno.hora_inicio) &&
                                          !turnoYaPaso(turno.fecha, turno.hora_fin) && (
                                            <button
                                              className="btn-asistencia"
                                              style={{ marginLeft: "8px" }}
                                              onClick={async () => {
                                                await marcarAsistencia(reserva._id);
                                              }}
                                            >
                                              Marcar como{" "}
                                              {reserva.asistencia ? "ausente" : "presente"}
                                            </button>
                                          )}
                                        {!reserva.estado && (
                                          <span className="estado-cancelado">
                                            {" "}(Cancelado)
                                          </span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Botones de acción según el usuario y el estado del turno */}
                          {!yaPaso && (
                            <div className="turno-acciones">
                              {tipoUsuarioActual === "admin" && (
                                <>
                                  <button
                                    className="btn-modificar"
                                    onClick={() => modificarTurno(turno._id)}
                                  >
                                    Modificar
                                  </button>
                                  <button
                                    className="btn-cancelar"
                                    onClick={() => darDeBajaTurno(turno._id)}
                                  >
                                    Cancelar Turno
                                  </button>
                                </>
                              )}

                              {tipoUsuarioActual === "cliente" &&
                                !menosDe8Horas &&
                                turno.reservas &&
                                turno.reservas.length > 0 && (
                                  <>
                                    {/* Mostrar botones solo para la reserva activa del usuario */}
                                    {(() => {
                                      const reservasUsuario = turno.reservas.filter(
                                        (reserva) =>
                                          reserva.cliente?.id?.toString() ===
                                            userInfo?._id?.toString() && reserva.estado
                                      );
                                      if (reservasUsuario.length === 0) {
                                        return (
                                          <div
                                            style={{
                                              color: "red",
                                              fontSize: "0.9em",
                                            }}
                                          >
                                            No hay reservas activas tuyas en este turno.
                                          </div>
                                        );
                                      }
                                      return reservasUsuario.map((reserva) => (
                                        <React.Fragment key={reserva._id}>
                                          <button
                                            className="btn-modificar"
                                            onClick={() => modificarTurno(reserva._id)}
                                          >
                                            Modificar
                                          </button>
                                          <button
                                            className="btn-cancelar"
                                            onClick={() => cancelarReserva(reserva._id)}
                                          >
                                            Cancelar Reserva
                                          </button>
                                        </React.Fragment>
                                      ));
                                    })()}
                                  </>
                                )}

                              {tipoUsuarioActual === "cliente" && menosDe8Horas && (
                                <div className="mensaje-restriccion">
                                  <p>
                                    ⚠️ No se puede modificar o cancelar (faltan menos de 8
                                    horas)
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Si el turno ya pasó, muestra el cartel de completado */}
                          {yaPaso && (
                            <div className="turno-completado">
                              <span>✅ Turno completado</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default MostrarTurnos;
