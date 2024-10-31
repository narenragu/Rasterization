let time = 0;

let vertices = [];
let faces = [];
let normals = [];

class Face {
  constructor(vertices, normals) {
    console.log(normals);
    this.vertices = vertices;

    let normalX = 0;
    let normalY = 0;
    let normalZ = 0;
    normals.forEach((normal) => {
      normalX += normal[0];
      normalY += normal[1];
      normalZ += normal[2];
    });

    normalX /= normals.length;
    normalY /= normals.length;
    normalZ /= normals.length;

    this.normals = [normalX, normalY, normalZ];
  }
}

// parse wavefront obj file and load into arrays
function loadObject(path) {
  const file = fetch(path)
    .then((res) => res.text())
    .then((res) => res.split("\n"))
    .then((res) => {
      res.forEach((line) => {
        line = line.trim();
        // skip comment lines
        if (line.indexOf("#") == 0) {
          return;
        }

        // vertices
        if (line.indexOf("v ") == 0) {
          let split = line.split(" ");
          let vector3 = [];
          // remove first item, should be 'v '
          split.shift();
          split.forEach((coordinate) => {
            vector3.push(parseFloat(coordinate));
          });

          vertices.push(vector3);
        }
      });
      return res;
    })
    .then((res) => {
      res.forEach((line) => {
        line = line.trim();
        // skip comment lines
        if (line.indexOf("#") == 0) {
          return;
        }

        // normals
        if (line.indexOf("vn ") == 0) {
          let split = line.split(" ");
          let normalVector = [];
          // remove first item, should be 'vn '
          split.shift();

          split.forEach((normalCoordinate) => {
            normalVector.push(parseFloat(normalCoordinate));
          });
          normals.push(normalVector);
        }
      });
      return res;
    })
    .then((res) => {
      res.forEach((line) => {
        line = line.trim();
        // skip comment lines
        if (line.indexOf("#") == 0) {
          return;
        }

        // face vertices
        if (line.indexOf("f ") == 0) {
          let split = line.split(" ");
          let face = [];
          let vertexNormals = [];
          // remove first item, should be 'f '
          split.shift();

          split.forEach((vertexData) => {
            vertexData = vertexData.split("/");
            face.push(vertices[vertexData[0] - 1]);
            vertexNormals.push(normals[vertexData[2] - 1]);
          });
          /*
          console.log(face);
          console.log(vertexNormals);
          console.log("=====");
          */

          faces.push(new Face(face, vertexNormals));
        }
      });
      return res;
    })
    //.then(() => console.log(vertices))
    //.then(() => console.log(normals))
    //.then(() => console.log(faces))
    .catch((e) => console.error(e));
}

loadObject("suzanne.obj");

function setup() {
  // webpage references
  let canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  let rotation = document.getElementById("rotation");
  let distance = document.getElementById("distance");
  let height = document.getElementById("height");
  let opacity = document.getElementById("opacity");

  let wireframe = document.getElementById("wireframe");
  let shading = document.getElementById("shading");

  // matrix draw methods
  function moveToTx(x, y, Tx) {
    let z = 0;
    var res = vec3.create();
    vec3.transformMat4(res, [x, y, z], Tx);
    context.moveTo(res[0], canvas.height - res[1]);
  }

  function moveToTx(x, y, z, Tx) {
    var res = vec3.create();
    vec3.transformMat4(res, [x, y, z], Tx);
    context.moveTo(res[0], canvas.height - res[1]);
  }

  function moveToTx(points, Tx) {
    var res = vec3.create();
    vec3.transformMat4(res, [points[0], points[1], points[2]], Tx);
    context.moveTo(res[0], canvas.height - res[1]);
  }

  function lineToTx(x, y, Tx) {
    let z = 0;
    var res = vec3.create();
    vec3.transformMat4(res, [x, y, z], Tx);
    context.lineTo(res[0], canvas.height - res[1]);
  }

  function lineToTx(x, y, z, Tx) {
    var res = vec3.create();
    vec3.transformMat4(res, [x, y, z], Tx);
    context.lineTo(res[0], canvas.height - res[1]);
  }

  function lineToTx(points, Tx) {
    var res = vec3.create();
    vec3.transformMat4(res, [points[0], points[1], points[2]], Tx);
    context.lineTo(res[0], canvas.height - res[1]);
  }

  function draw() {
    if (time > 100) {
      time = 0;
    }

    function drawAxes(Tx) {
      context.strokeStyle = "#00FF00";
      context.lineWidth = 1;

      context.beginPath();
      moveToTx([0, 0, 0], Tx);
      lineToTx([0, 1, 0], Tx);
      lineToTx([0.1, 0.9, 0], Tx);
      moveToTx([0, 1, 0], Tx);
      lineToTx([-0.1, 0.9, 0], Tx);
      moveToTx([0, 1, 0], Tx);
      context.stroke();

      context.strokeStyle = "#FF0000";
      context.beginPath();
      moveToTx([0, 0, 0], Tx);
      lineToTx([1, 0, 0], Tx);
      lineToTx([0.9, 0.1, 0], Tx);
      moveToTx([1, 0, 0], Tx);
      lineToTx([0.9, -0.1, 0], Tx);
      moveToTx([1, 0, 0], Tx);
      moveToTx([0, 0, 0], Tx);
      context.stroke();

      context.strokeStyle = "#0000FF";
      context.beginPath();
      moveToTx([0, 0, 0], Tx);
      lineToTx([0, 0, 1], Tx);
      lineToTx([0.1, 0, 0.9], Tx);
      moveToTx([0, 0, 1], Tx);
      lineToTx([-0.1, 0, 0.9], Tx);
      moveToTx([0, 0, 1], Tx);
      moveToTx([0, 0, 0], Tx);
      context.stroke();
    }

    function drawCircle(Tx) {
      context.strokeStyle = "#000000";
      context.lineWidth = 2;
      context.beginPath();

      let resolution = 30;
      let scale = 1;

      moveToTx([scale * Math.cos(0), scale * Math.sin(0), 0], Tx);

      for (let i = 0; i < 2 * Math.PI; i += (2 * Math.PI) / resolution) {
        lineToTx([scale * Math.cos(i), scale * Math.sin(i), 0], Tx);
      }
      context.closePath();
      context.stroke();
    }

    function drawObject(Tx) {
      for (let faceIndex = 0; faceIndex < faces.length; faceIndex++) {
        context.strokeStyle = "#AAAAAA";
        //context.fillStyle = "#f7dea844";
        context.fillStyle = `rgba(${247}, ${222}, ${168}, ${
          1 - (2.55 / 100) * parseFloat(opacity.value)
        })`;
        context.lineWidth = 1;
        context.beginPath();
        moveToTx(faces[faceIndex].vertices[0], Tx);
        for (
          let vertexIndex = 0;
          vertexIndex < faces[faceIndex].vertices.length;
          vertexIndex++
        ) {
          lineToTx(faces[faceIndex].vertices[vertexIndex], Tx);
        }
        context.closePath();
        wireframe.checked ? context.stroke() : "";
        if (shading) {
          let lightDirection = [1, 1, 0];
          let normal = faces[faceIndex].normals;
          //console.log(normal);
          let lightingFactor = vec3.dot(lightDirection, normal);
          context.fillStyle = `rgba(${247 * lightingFactor}, ${
            222 * lightingFactor
          }, ${168 * lightingFactor}, ${
            1 - (2.55 / 100) * parseFloat(opacity.value)
          })`;
        }
        context.fill();
      }
    }

    let cameraDistance = Number(distance.value);

    let lookAtTransform = mat4.create();
    let cameraPos = vec3.create();
    cameraPos[0] =
      cameraDistance * Math.sin((rotation.value * 2 * Math.PI) / 100);
    cameraPos[1] = height.value;
    cameraPos[2] =
      cameraDistance * Math.cos((rotation.value * 2 * Math.PI) / 100);
    mat4.lookAt(lookAtTransform, cameraPos, [0, 0, 0], [0, 1, 0]);

    context.clearRect(0, 0, canvas.width, canvas.height);

    let canvasTransform = mat4.create();
    mat4.translate(canvasTransform, canvasTransform, [300, 300, 0]);
    mat4.scale(canvasTransform, canvasTransform, [150, 150, 150]);
    let canvasToLookAt = mat4.create();
    mat4.multiply(canvasToLookAt, canvasTransform, lookAtTransform);

    // axes transforms
    let axesToCanvas = mat4.create();
    mat4.multiply(axesToCanvas, canvasToLookAt, axesToCanvas);

    drawAxes(axesToCanvas);

    // object transforms
    let objectToCanvas = mat4.create();
    //mat4.translate(objectToCanvas, objectToCanvas, [100, 100, 50]);
    //mat4.scale(objectToCanvas, objectToCanvas, [100, 100, 100]);
    mat4.multiply(objectToCanvas, canvasToLookAt, objectToCanvas);

    //drawCircle(objectToCanvas);
    drawObject(objectToCanvas, canvasToLookAt);

    window.requestAnimationFrame(draw);
  }
  canvas.addEventListener("mousedown", function (e) {
    //updatePointPosition(canvas, e);
  });

  window.requestAnimationFrame(draw);
}

window.onload = setup;
