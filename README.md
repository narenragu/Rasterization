# Javascript Rasterizer
<img src="https://github.com/user-attachments/assets/7f567a22-8907-46cc-843a-8ae3807ce57f" width="512">

### You can demo this project [here!](https://rawcdn.githack.com/narenragu/Rasterization/d407d402149e92041574c9b793cac074e31c9d3f/a5.html)

## Background

I made this during the course of my Computer Graphics class because I wanted to see if I could apply what I learned and try and make something on my own.

This project is an (almost) pure javascript rasterizer that uses the 2D Canvas with matrix transformations to render a 3d object and apply lighting.

By "almost pure javascript" what I mean is I made use of a matrix transformation library ([gl-matrix](https://glmatrix.net)) to aid with matrix calculations, but the rendering uses the default javascript 2D canvas which has no understanding of 3D. With the 2D canvas, you can draw lines, fill shapes, and color either the lines or the filled shape.

## Features
* Fully javascript, doesn't use WebGL or any 3D library for rendering
* Camera can be moved and rotated around object
* Customizable rendering
  * Can change the object being rendered with the dropdown (3 objects: suzanne, teapot, cube)
  * Wireframe rendering mode toggled with checkbox
  * Can change rendered transparency with slider
  * Switch between orthographic and perspective projections
  * Primitive backface culling
* Directional lighting (visualized as a yellow sphere with an arrow indicating direction)
  * Can change brightness and position of directional light
  * Light can be made to follow camera (point in direction of view)

## Limitations
* Due to nature of drawing in javascript canvas, filled shapes are single color meaning the object has flat shading
  * TODO: Possibility of adding smooth vertex-lighting using linear gradients
* Z-Testing implementation is primitive (orders triangles based on distance to camera and renders last to first)
  * Occasional artifacts caused by certain faces being determined to being closer due to inividual vertex locations
 
## Images
<img src="https://github.com/user-attachments/assets/efd3b6a9-83a1-4648-9b19-72794f3d83c5" width="512">
<img src="https://github.com/user-attachments/assets/71d2fe5d-fa71-4a13-b7cd-468cff06a5d3" width="512">
