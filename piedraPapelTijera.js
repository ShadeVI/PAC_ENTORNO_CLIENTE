// Este array no se puede modificar,
var posibilidades = ["piedra", "papel", "tijera"];
//    //

/*

CONFIGURACIÓN Y EVENTOS

*/

// Botones
const botones = document.getElementsByTagName("button");
const botonJugar = botones[0];
const botonYa = botones[1];
const botonReset = botones[2];

// Eventos
botonJugar.addEventListener("click", comprobaciones);
botonYa.addEventListener("click", tirar);
botonReset.addEventListener("click", reset);

// Preparamos las imagenes para el jugador
const imagenesJugador = document.getElementById("jugador").children;
Array.from(imagenesJugador).forEach((imagen, i) => {
  imagen.src = `img/${posibilidades[i]}Jugador.png`;
  imagen.addEventListener("click", aplicarEstiloSeleccionJugador);
});

/* 
ELEMENTOS DOM
*/

const inputNombre = document.querySelector("input[name=nombre]");
const inputPartidas = document.querySelector("input[name=partidas]");
const imagenMaquina = document.getElementById("maquina").children[0];
const historialElemento = document.getElementById("historial");
const jugadasActualesEl = document.getElementById("actual");
const jugadasTotalesEl = document.getElementById("total");

/*
FUNCIONES
*/

function comprobaciones() {
  const esNombreValido = comprobarNombre(inputNombre);
  const esPartidasValido = comprobarPartidasAJugar(inputPartidas);

  aplicarEstiloComprobacion(inputNombre, esNombreValido);
  aplicarEstiloComprobacion(inputPartidas, esPartidasValido);

  if (esNombreValido && esPartidasValido) {
    inputPartidas.disabled = true;
    inputNombre.disabled = true;
    jugadasTotalesEl.innerText = inputPartidas.value;
  }
}

function tirar() {
  // Si ya hemos jugados todas las partidas, no permite tirar
  if (jugadasActualesEl.innerText === jugadasTotalesEl.innerText) {
    return;
  }
  // con el + en frente de una variable, convertimos el valor a numero
  jugadasActualesEl.innerText = +jugadasActualesEl.innerText + 1;
  // obtener index eleccion maquina
  const indexEleccionMaquina = eleccionMaquina();
  // obtener index eleccion jugador
  const indexEleccionJugador = eleccionJugador();
  const resultado = calcular(indexEleccionJugador, indexEleccionMaquina);
  anadirHistorial(resultado);
}

function calcular(indexJugador, indexMaquina) {
  // comprobamos
  let empate = indexJugador === indexMaquina && "Empate";

  if (empate) {
    return "Empate";
  }

  if (
    (indexJugador === 0 && indexMaquina === posibilidades.length - 1) ||
    indexMaquina === indexJugador - 1
  ) {
    return `Gana ${inputNombre.value}`;
  }

  return "Gana Maquina";
}

function reset() {
  inputNombre.disabled = false;
  inputPartidas.disabled = false;
  inputPartidas.value = 0;
  jugadasActualesEl.innerHTML = 0;
  jugadasTotalesEl.innerHTML = "0";
  imagenMaquina.src = `img/defecto.png`;
  resetEstilosJugador(true);
  anadirHistorial("Nueva partida");
}

function resetEstilosJugador(isReset = false) {
  Array.from(imagenesJugador).forEach((imagen, i) => {
    imagen.classList.remove("seleccionado");
    imagen.classList.add("noSeleccionado");
    if (isReset === true && i === 0) {
      imagen.classList.add("seleccionado");
      imagen.classList.remove("noSeleccionado");
    }
  });
}

function aplicarEstiloSeleccionJugador() {
  resetEstilosJugador();
  // este this hace referencia al elemnto del evento que está llamando a esta función, en este caso el evento click del elemento img del jugador
  this.classList.add("seleccionado");
  this.classList.remove("noSeleccionado");
}

function comprobarNombre(elem) {
  return /^[\D]{1,}[\d\w]{3,}/gm.test(elem.value);
}

function comprobarPartidasAJugar(elem) {
  return elem.value > 0;
}

function aplicarEstiloComprobacion(elem, test) {
  if (!test) {
    elem.classList.add("fondoRojo");
  } else {
    elem.classList.remove("fondoRojo");
  }
}

function eleccionMaquina() {
  const index = Math.floor(Math.random() * posibilidades.length);
  imagenMaquina.src = `img/${posibilidades[index]}Ordenador.png`;
  return index;
}

function eleccionJugador() {
  const jugador = document.getElementsByClassName("seleccionado")[0];
  // obtener el nombre de la eleccion del jugador
  const eleccionJugador = jugador.src.match(/img\/([\w]+)Jugador.png/)[1];
  // obtener el index de este valor en el array de posibilidades
  return posibilidades.indexOf(eleccionJugador);
}

function anadirHistorial(resultado) {
  historialElemento.innerHTML += `<li>${resultado}</li>`;
}
