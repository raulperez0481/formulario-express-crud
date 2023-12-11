const express = require("express");
const app = express();

const animales = [
  { id: 1, nombre: "Luna", tipo: "Perro", edad: 3 },
  { id: 2, nombre: "Mittens", tipo: "Gato", edad: 5 },
  { id: 3, nombre: "Charlie", tipo: "Caballo", edad: 8 }
];

let idCounter = animales.length + 1;

app.use(express.static("public"));
app.use(express.json());

app.get("/animales", (req, res) => {
  res.json(animales);
});

app.post("/sumar-animal", (req, res) => {
  const animal = req.body;
  animal.id = idCounter++;
  animales.push(animal);
  res.json(animales);
});

app.delete('/adoptar', (req, res) => {
  const id = req.query.id;
  const indice = animales.findIndex(animal => animal.id === parseInt(id));
  
  if (indice === -1) {
    res.status(404).send(`No se encontró el animal con id ${id}`);
    return;
  }
  animales.splice(indice, 1);
  res.json(animales);
});

app.put('/editar-animal', (req, res) => {
  const id = req.query.id;
  const { nombre, tipo, edad } = req.body;

  const indice = animales.findIndex(animal => animal.id === parseInt(id));
  if (indice === -1) {
    res.status(404).send(`No se encontró el animal con id ${id}`);
    return;
  }

  animales[indice].nombre = nombre;
  animales[indice].tipo = tipo;
  animales[indice].edad = edad;

  res.json(animales);
});

app.listen(3000, () => {
  console.log("Servidor iniciado en puerto 3000");
});
