//Variables
const formulario = document.getElementById('agregar-gasto');
const listadoDeGastos = document.querySelector('#gastos ul');


//Eventos

eventListener();

function eventListener() {
    document.addEventListener('DOMContentLoaded', pedirPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}



//Classes

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        console.log(this.gastos);
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );

        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    mostrarPresupuesto(cantidad) {
        //Se extraen los valores
        const { presupuesto, restante } = cantidad;

        //Se muestra en el HTML
        document.getElementById('total').textContent = presupuesto;
        document.getElementById('restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        const divAlerta = document.createElement('DIV');
        divAlerta.classList.add('text-center', 'alert');


        if (tipo === 'error') {
            divAlerta.classList.add('alert-danger')
        } else {
            divAlerta.classList.add('alert-success');
        }


        //Mensaje de error

        divAlerta.textContent = mensaje;

        //Insertar en HTML

        document.querySelector('.primario').insertBefore(divAlerta, formulario);

        setTimeout(() => {
            divAlerta.remove();
        }, 3000);


    }
    mostrarGastos(gastos) {

        this.limpiarHTML(); //Para que no se repitan los gastos



        //Iterar sobre los gastos
        gastos.forEach( gasto => {
            const { cantidad, gastoNombre, id } = gasto;

            //Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            //Agregar HTML de cada gasto
            nuevoGasto.innerHTML = `${gastoNombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;

            //Boton para borrar los gastos

            const botonBorrar = document.createElement('button');
            botonBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            botonBorrar.innerHTML = 'Eliminar &times';
            botonBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(botonBorrar);

            //HTML del listado de gastos

            listadoDeGastos.appendChild(nuevoGasto);

        });
    }

    limpiarHTML(){
        while(listadoDeGastos.firstChild){
            listadoDeGastos.removeChild(listadoDeGastos.firstChild);
        }
    }

    actualizarRestante(restante){
        document.getElementById('restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto , restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        //25% gastado

        if(( presupuesto / 4 ) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if( (presupuesto / 2) > restante ){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }


        //Si el restante es <= 0

        if(restante <= 0 ){
            ui.imprimirAlerta('Te quedaste sin presupuesto', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }

    }


}





//Instanciar GLOBALMENTE
const ui = new UI();

let presupuesto;





//Funciones

function pedirPresupuesto() {
    const presupuestoDelUsuario = prompt('Indique su presupuesto');
    // console.log(parseFloat(presupuestoDelUsuario));

    if (presupuestoDelUsuario === '' || presupuestoDelUsuario === null || isNaN(presupuestoDelUsuario) || presupuestoDelUsuario <= 0) {
        window.location.reload();
    }

    //Presupuesto valido 
    presupuesto = new Presupuesto(presupuestoDelUsuario);
    console.log(presupuesto);

    ui.mostrarPresupuesto(presupuesto);
}


//Añade los gastos
function agregarGasto(e) {
    e.preventDefault();

    //Leer datos del formulario

    const gastoNombre = document.getElementById('gasto').value;
    const cantidad = Number(document.getElementById('cantidad').value);

    //Validar

    if (gastoNombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Introduzca una cifra valida', 'error');
        return;
    }


    //Generar objeto con los gastos

    const gasto = { gastoNombre, cantidad, id: Date.now() };

    //Se añade un nuevo gasto

    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Añadido correctamente');

    //Mostrar en pantalla los gastos
    const { gastos , restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //Cuando se añade un nuevo gasto se reinicia el formulario
    formulario.reset();

}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del HTML
    const { gastos , restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}