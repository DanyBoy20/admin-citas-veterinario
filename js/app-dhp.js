// CAMPOS DEL FORMULARIO
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// UI
/* Formulario nuevas citas */
const formulario = document.querySelector('#nueva-cita');
/* Contenedor para las citas */
const contenedorCitas = document.querySelector('#citas');

let editando = false;

/* **** */
// CLASES

class Citas {
  // Constructor de la clase
  constructor(){
    this.citas = [];
  }

  agregarCita(cita){
    this.citas = [...this.citas, cita];

    console.log(this.citas);
  }

  eliminarCita(id){
    this.citas = this.citas.filter( cita => cita.id !== id);
  }

  editarCita(citaActualizada){
    this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita );
  }

}

class UI{
  imprimirAlerta(mensaje, tipo){
    // Crear el div
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

    // Agregar clase en base al tipo de error
    if(tipo === 'error'){
      divMensaje.classList.add('alert-danger');
    } else {
      divMensaje.classList.add('alert-success');
    }

    // Mensaje de error
    divMensaje.textContent = mensaje;

    // Agregar al DOM insertBefore(elementoAInsertar, elementoreferencia)
    document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

    // Quitar la alerta despues de 5 segundos
    setTimeout( () => {
      divMensaje.remove();
    }, 5000);
  }

  // Imprime las citas del objeto
  imprimirCitas({citas}){ // aplico destructuring ({citas}) desde el parametro de la funcion
    // si no destructuro en el parametro (citas), aqui quedaria asi: const {citas} = citas;

    this.limpiarHTML();

    citas.forEach(cita => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

      const divCita = document.createElement('div');
      divCita.classList.add('cita', 'p-3');
      divCita.dataset.id = id;

      // scripting de los elementos de la cita
      const mascotaParrafo = document.createElement('h2');
      mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement('p');
      propietarioParrafo.innerHTML = `<span class='font-weight-bolder'>Propietario: </span> ${propietario}`;

      const telefonoParrafo = document.createElement('p');
      telefonoParrafo.innerHTML = `<span class='font-weight-bolder'>Telefono: </span> ${telefono}`;

      const fechaParrafo = document.createElement('p');
      fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

      const horaParrafo = document.createElement('p');
      horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

      const sintomasParrafo = document.createElement('p');
      sintomasParrafo.innerHTML = `<span class="font-weight-bolder">S??ntomas: </span> ${sintomas}`;

      // Agregar boton para eliminar cita
      const btnEliminar = document.createElement('button');
      btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
      btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
      btnEliminar.onclick = () => eliminarCita(id);


      // Agregar boton para editar cita
      const btnEditar = document.createElement('button');
      btnEditar.classList.add('btn', 'btn-info');
      btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
      btnEditar.onclick = () => cargarEdicion(cita);


      // Agregar los parrafos al divCita
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      // Insertar las citas en el HTML
      contenedorCitas.appendChild(divCita);
      
    });
    
  }

  // Limpiar el HTML que muestra las citas guardadas
  limpiarHTML(){
    while(contenedorCitas.firstChild){
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }

}

// Instanciamos las clases de forma global por que tendre diferentes funciones
const ui = new UI();
const administrarCitas = new Citas();

// FIN CLASES
/* ******* */

eventListeners();
// REGISTRAR EVENTOS
function eventListeners(){
  mascotaInput.addEventListener('input', datosCita);
  propietarioInput.addEventListener('input', datosCita);
  telefonoInput.addEventListener('input', datosCita);
  fechaInput.addEventListener('input', datosCita);
  horaInput.addEventListener('input', datosCita);
  sintomasInput.addEventListener('input', datosCita);

  formulario.addEventListener('submit', nuevaCita);
}

// Objeto con la informaci??n de la cita
const citaObj = {
  mascota: '',
  propietario: '',
  telefono: '',
  fecha: '',
  hora: '',
  sintomas: ''
}

// Funciones
/* Agrega datos al objeto citas */
function datosCita(e){
  // sintaxis de corchetes para acceder a una propiedad (name en este caso) de un objeto
  citaObj[e.target.name] = e.target.value;
  /* console.log(citaObj) */
}

// Valida y agrega una nueva cita a la clase de citas
function nuevaCita(e){
  e.preventDefault();

  // extraer la informaci??n del objeto de cita
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  // Validar
  if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
    ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
    return;
  }

  if(editando){

    // Pasar el objeto de la cita a edici??n
    administrarCitas.editarCita({...citaObj});

    // Mostrar mensaje de editado correctamente
    ui.imprimirAlerta('Editado correctamente');

    // Regresar texto del boton a su estado original
    formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

    // Quitar modo edici??n
    editando = false;

  }else{
    // Generar un ID unico
    citaObj.id = Date.now();

    // Creando una nueva cita
    administrarCitas.agregarCita({...citaObj});

    // Muestrar mensaje agregado correctamente
    ui.imprimirAlerta('Se agrego correctamente');
  }

  // Reiniciar el objeto para la validaci??n
  reiniciarObjeto();

  // Reiniciar el objeto para la validaci??n
  formulario.reset();

  // Mostrar el HTML de las citas
  ui.imprimirCitas(administrarCitas);

}

// Reinicia el objeto
function reiniciarObjeto(){
  citaObj.mascota = '';
  citaObj.propietario = '';
  citaObj.telefono = '';
  citaObj.fecha = '';
  citaObj.hora = '';
  citaObj.sintomas = '';
};

// Elimina una cita
function eliminarCita(id){
  // Eliminar la cita
  administrarCitas.eliminarCita(id);

  // Muestrar mensaje
  ui.imprimirAlerta('La cita se elimin?? correctamente');

  // Refrescar las citas
  ui.imprimirCitas(administrarCitas);

}

function cargarEdicion(cita){

  const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  // Llenar los inputs del formulario
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  // Llenar el objeto
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

  editando = true;

}
