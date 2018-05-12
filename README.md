
# Nextbus: Visualización de horarios de buses

Este repositorio contiene el parcial final de la materia de programación en tencologías web.
El propósito era interactuar con el API de nextbus, plataforma con información de buses en estados unidos, y desplegar un gráfico con los horarios de cada bus para diferentes rutas.

## Herramientas utilizadas

* React (interactividad de componentes)
* Meteor (ambiente de servidor y conexión DDL con cliente)
* D3 (anclaje con HTML, elaboración de gráficos)
* MongoDB (Almacenamiento de usuarios e información de buses)

## Ejecución del proyecto

[El proyecto se encuentra desplegado en heroku](https://parcial-2.herokuapp.com/)

Si se quiere correr localmente el proyecto, se deben ejecutar los siguientes comandos:

```
git clone https://github.com/falopez10/parcial-2.git
cd parcial-2
meteor npm install
meteor
```

## Funcionalidades especiales

* Almacenamiento de comentarios de diferentes usuarios
* Interfaz de usuario que incluye todas las agencias disponibles para el API de nextbus (Se almacena en *MongoDB*)
* Interfaz de usuario que actualiza las rutas dependiendo de la agencia escogida (se realiza petición *HTTP* según agencia)
*  **Filtro por horas**: Esta funcionalidad permite solo visualizar los buses que pasan a cierta hora.
*  **Gráfica en D3** que permite observar, bus por bus para determinada ruta, la hora a la que se programa su llegada en cada estación.
* Se corrigen errores concernientes al lapso de tiempo considerado (de 22 a 24 horas)

## Autor

Realizado por [Fabio López](https://falopez10.github.io). Universidad de los Andes 2018.

