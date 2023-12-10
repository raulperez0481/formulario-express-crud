const listaAnimales = document.getElementById("animales");
const formEditar = document.querySelector("#form-editar");

function actualizarListaAnimales(animales) {
  listaAnimales.innerHTML = "";
  animales.forEach(animal => {
    const li = document.createElement("li");
    li.textContent = `${animal.nombre} - ${animal.tipo} - ${animal.edad}`;

    const buttonEliminar = document.createElement("button");
    buttonEliminar.textContent = "Eliminar";
    buttonEliminar.addEventListener("click", async () => {
      try {
        await eliminarAnimal(animal.id);
      } catch (error) {
        console.error("Error al eliminar animal:", error);
      }
    });

    const buttonEditar = document.createElement("button");
    buttonEditar.textContent = "Editar";
    buttonEditar.addEventListener("click", () => {
      mostrarFormularioEditar(animal);
    });

    li.appendChild(buttonEliminar);
    li.appendChild(buttonEditar);
    listaAnimales.appendChild(li);
  });
}

async function eliminarAnimal(id) {
  const response = await fetch(`/adoptar?id=${id}`, {
    method: "DELETE",
  });

  const animales = await response.json();
  actualizarListaAnimales(animales);
}

function mostrarFormularioEditar(animal) {
  document.querySelector("#form-sumar").style.display = "none";
  formEditar.style.display = "block";
  formEditar.nombre.value = animal.nombre;
  formEditar.tipo.value = animal.tipo;
  formEditar.edad.value = animal.edad;
  formEditar.idAnimalEditar.value = animal.id;
}

async function agregarAnimal(event) {
  event.preventDefault();
  const nombre = document.getElementById("nombreSumar").value;
  const tipo = document.getElementById("tipoSumar").value;
  const edad = document.getElementById("edadSumar").value;

  try {
    const response = await fetch("/sumar-animal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: null, nombre, tipo, edad }),
    });

    const animales = await response.json();
    document.querySelector("#form-sumar").reset();
    actualizarListaAnimales(animales);
  } catch (error) {
    console.error("Error al agregar animal:", error);
  }
}

async function obtenerAnimales() {
  try {
    const response = await fetch("/animales");
    const animales = await response.json();
    actualizarListaAnimales(animales);
  } catch (error) {
    console.error("Error al obtener animales:", error);
  }
}

document.querySelector("#form-sumar").addEventListener("submit", agregarAnimal);

obtenerAnimales();
