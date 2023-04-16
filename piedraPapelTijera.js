// Este array no se puede modificar,
var posibilidades = ["piedra", "papel", "tijera"];
//    //

/*

CONFIGURACIÓN Y EVENTOS

*/

const botones = document.getElementsByTagName("button");

const botonJugar = botones[0];
const botonYa = botones[1];
const botonReset = botones[2];

botonJugar.addEventListener("click", comprobaciones);
botonYa.addEventListener("click", tirarYCalcular);
botonYa.disabled = true;
botonReset.addEventListener("click", reset);

// Preparamos las imagenes
const imagenes = document.getElementById("jugador").children;
Array.from(imagenes).forEach((imagen, i) => {
  imagen.addEventListener("click", seleccionJugador);
  imagen.src = `img/${posibilidades[i]}Jugador.png`;
  imagen.setAttribute("data-eleccion", posibilidades[i]);
});

/* 
ELEMENTOS DOM
*/

const inputs = document.getElementsByTagName("input");
const inputNombre = inputs[0];
const inputPartidas = inputs[1];
const imagenMaquina = document.getElementById("maquina").children[0];
const historialElemento = document.getElementById("historial");
const actualElemento = document.getElementById("actual");
const totalElemento = document.getElementById("total");
/*

FUNCIONES

*/

function comprobaciones() {
  const esNombreValido = comprobarNombre(inputNombre);
  const esPartidasValido = comprobarPartidas(inputPartidas);

  if (esNombreValido && esPartidasValido) {
    inputPartidas.disabled = true;
    inputNombre.disabled = true;
    totalElemento.innerText = inputPartidas.value;
    botonYa.disabled = false;
  }
}

function tirarYCalcular() {
  if (actualElemento.innerText === totalElemento.innerText) {
    return;
  }
  const jugadasActual = actualElemento.innerText;
  // con el + en frente de una variable, convertimos el valor a numero
  actualElemento.innerHTML = +jugadasActual + 1;
  // random para la maquina
  const indexEleccionMaquina = Math.floor(Math.random() * posibilidades.length);

  imagenMaquina.src = `img/${posibilidades[indexEleccionMaquina]}Ordenador.png`;
  // obtener elemento dom de la imagen seleccionada
  const jugador = document.getElementsByClassName("seleccionado")[0];
  // obtener el nombre de la eleccion segun su atributo data
  const eleccionJugador = jugador.dataset.eleccion;
  // obtener el index de este valor en el array de posibilidades
  const indexEleccionJugador = posibilidades.indexOf(eleccionJugador);
  // comprobamos
  let ganador = undefined;
  let empate = indexEleccionJugador === indexEleccionMaquina && "Empate";

  if (empate) {
    return anadirEmpateHistorial(empate);
  }

  if (
    (indexEleccionJugador === 0 &&
      indexEleccionMaquina === posibilidades.length - 1) ||
    indexEleccionMaquina === indexEleccionJugador - 1
  ) {
    ganador = inputNombre.value;
  } else if (
    (indexEleccionMaquina === 0 &&
      indexEleccionJugador === posibilidades.length - 1) ||
    indexEleccionJugador === indexEleccionMaquina - 1
  ) {
    ganador = "Maquina";
  }
  anadirGanadorHistorial(ganador);
}

function reset() {
  inputNombre.disabled = false;
  inputPartidas.disabled = false;
  inputPartidas.value = 0;
  actualElemento.innerHTML = 0;
  totalElemento.innerHTML = "0";
  imagenMaquina.src = `img/defecto.png`;
}

function seleccionJugador() {
  Array.from(imagenes).forEach((imagen) => {
    imagen.classList.remove("seleccionado");
    imagen.classList.add("noSeleccionado");
  });
  this.classList.add("seleccionado");
  this.classList.remove("noSeleccionado");
}

function comprobarNombre(elem) {
  let test = /^[\D]{1,}[\d\w]{3,}/gm.test(elem.value);
  aplicarEstiloComprobacion(elem, test);
  return test;
}

function comprobarPartidas(elem) {
  let test = elem.value > 0;
  aplicarEstiloComprobacion(elem, test);
  return test;
}

function aplicarEstiloComprobacion(elem, test) {
  if (!test) {
    elem.classList.add("fondoRojo");
  } else {
    elem.classList.remove("fondoRojo");
  }
}

function anadirEmpateHistorial(resultado) {
  historialElemento.innerHTML += `<li>${resultado}</li>`;
}

function anadirGanadorHistorial(ganador) {
  historialElemento.innerHTML += `<li>Gana ${ganador}</li>`;
}
