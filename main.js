// 1. Mostrar reloj en vivo
function actualizarReloj() {
  const ahora = new Date();
  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fecha = ahora.toLocaleDateString('es-ES', opcionesFecha);
  const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  document.getElementById('reloj').innerText = fecha.charAt(0).toUpperCase() + fecha.slice(1) + " | " + hora;
}
setInterval(actualizarReloj, 1000);
actualizarReloj();

// 2. Lógica de selección
let empleadoSeleccionado = "";
let tipoSeleccionado = "";

function seleccionarEmpleado(nombre) {
  empleadoSeleccionado = nombre;
  document.getElementById('txtEmpleado').innerText = nombre;
  document.getElementById('mensaje').innerText = "";

  document.getElementById('btn-Fernanda').classList.remove('activo');
  document.getElementById('btn-Rocio').classList.remove('activo');
  document.getElementById('btn-' + nombre).classList.add('activo');
}

function seleccionarTipo(tipo) {
  tipoSeleccionado = tipo;
  document.getElementById('txtTipo').innerText = tipo;
  document.getElementById('mensaje').innerText = "";

  document.getElementById('btn-ENTRADA').classList.remove('activo');
  document.getElementById('btn-SALIDA').classList.remove('activo');
  document.getElementById('btn-' + tipo).classList.add('activo');

  // Lógica para mostrar u ocultar la actividad
  const seccionActividad = document.getElementById('seccion-actividad');
  if (tipo === 'SALIDA') {
    seccionActividad.style.display = 'block'; // Mostrar
  } else {
    seccionActividad.style.display = 'none'; // Ocultar
    document.getElementById('actividad').value = ""; // Limpiar texto por si acaso
  }
}

// 3. Guardar datos
function guardarRegistro() {
  if (empleadoSeleccionado === "" || tipoSeleccionado === "") {
    document.getElementById('mensaje').innerText = "⚠️ Por favor seleccione nombre y tipo.";
    document.getElementById('mensaje').style.color = "red";
    return;
  }

  // Recoger actividad (si es entrada, ponemos un texto por defecto)
  let actividadTexto = "";
  if (tipoSeleccionado === 'SALIDA') {
    actividadTexto = document.getElementById('actividad').value;
    if (actividadTexto.trim() === "") {
      document.getElementById('mensaje').innerText = "⚠️ Por favor escriba la actividad del día.";
      document.getElementById('mensaje').style.color = "red";
      return;
    }
  } else {
    actividadTexto = "Ingreso a turno"; // Texto automático para la entrada
  }

  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-ES');
  const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  document.getElementById('mensaje').innerText = "⏳ Guardando...";
  document.getElementById('mensaje').style.color = "blue";

  // URL de tu Google Sheets
  const url = "https://script.google.com/macros/s/AKfycbw0cUW7E5yrB-RvgtbU8NY3VEgjKjyJkp3OVLOvkwULAGWHpGqCflH993icWYgvOIGB/exec";
  
  const datos = new URLSearchParams();
  datos.append('nombre', empleadoSeleccionado);
  datos.append('fecha', fecha);
  datos.append('hora', hora);
  datos.append('tipo', tipoSeleccionado);
  datos.append('actividad', actividadTexto);

  fetch(url, {
    method: 'POST',
    body: datos,
    mode: 'no-cors'
  })
  .then(() => {
    document.getElementById('mensaje').innerText = "✅ ¡Registro guardado exitosamente!";
    document.getElementById('mensaje').style.color = "green";
    
    // Limpiar pantalla
    empleadoSeleccionado = "";
    tipoSeleccionado = "";
    document.getElementById('txtEmpleado').innerText = "-";
    document.getElementById('txtTipo').innerText = "-";
    document.getElementById('actividad').value = "";
    document.getElementById('seccion-actividad').style.display = 'none';
    
    document.getElementById('btn-Fernanda').classList.remove('activo');
    document.getElementById('btn-Rocio').classList.remove('activo');
    document.getElementById('btn-ENTRADA').classList.remove('activo');
    document.getElementById('btn-SALIDA').classList.remove('activo');
  })
  .catch(error => {
    document.getElementById('mensaje').innerText = "❌ Hubo un error al guardar.";
    document.getElementById('mensaje').style.color = "red";
  });
}