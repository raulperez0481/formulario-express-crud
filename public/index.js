const listaAnimales = document.getElementById("animales");
const form = document.querySelector("#form-sumar");


let isEditing = false;

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
  isEditing = true;
  form.nombre.value = animal.nombre;
  form.tipo.value = animal.tipo;
  form.edad.value = animal.edad;
  form.idAnimal.value = animal.id;
  document.querySelector("button[type='submit']").innerText = "Guardar cambios";  
}

async function agregarAnimal(event) {
  event.preventDefault();
  const nombre = document.getElementById("nombreSumar").value;
  const tipo = document.getElementById("tipoSumar").value;
  const edad = document.getElementById("edadSumar").value;
  const id = document.getElementById("idAnimal").value;

    //si estoy editando un objeto del array(persona)
  if (isEditing) {   
    try {
      const response = await fetch("/editar-animal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, nombre, tipo, edad }),
      });

      if (!response.ok) {
        throw new Error(`Error al editar animal: ${response.statusText}`);
      }
  
      const animales = await response.json();
      isEditing = false;
      form.reset();
      document.querySelector("button[type='submit']").innerText = "Añadir";
      actualizarListaAnimales(animales);

    } catch (error) {
      console.error(error);
    }
  }
  else{
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

form.addEventListener("submit", agregarAnimal);

obtenerAnimales();
