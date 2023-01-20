import "./styles.css";
import { angleToRadians } from "geometric";

// get canvas related references
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const BB = canvas.getBoundingClientRect();
const offsetX = BB.left;
const offsetY = BB.top;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// drag related variables
let dragok = false;
let startX;
let startY;

// an array of objects that define different shapes
const shapes = [];
// define 2 rectangles
shapes.push({
  x: 10,
  y: 100,
  width: 30,
  height: 30,
  fill: "#444444",
  isDragging: false
});
shapes.push({
  x: 80,
  y: 100,
  width: 30,
  height: 30,
  fill: "#ff550d",
  isDragging: false
});
// define 2 circles
shapes.push({ x: 150, y: 100, r: 10, fill: "#800080", isDragging: false });
shapes.push({ x: 200, y: 100, r: 10, fill: "#0c64e8", isDragging: false });

// listen for mouse events
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.onmousemove = myMove;

// call to draw the scene
draw();

// draw a single rect
function rect(r) {
  ctx.fillStyle = r.fill;
  ctx.fillRect(r.x, r.y, r.width, r.height);
}

// draw a single rect
function circle(c) {
  ctx.fillStyle = c.fill;
  ctx.beginPath();
  ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

// clear the canvas
function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// redraw the scene
function draw() {
  clear();
  // redraw each shape in the shapes[] array
  for (let i = 0; i < shapes.length; i++) {
    // decide if the shape is a rect or circle
    // (it's a rect if it has a width property)
    if (shapes[i].width) {
      rect(shapes[i]);
    } else {
      circle(shapes[i]);
    }
  }
}

// handle mousedown events
function myDown(e) {
  // tell the browser we're handling this mouse event
  e.preventDefault();
  e.stopPropagation();

  // get the current mouse position
  const mx = parseInt(e.clientX - offsetX);
  const my = parseInt(e.clientY - offsetY);

  // test each shape to see if mouse is inside
  dragok = false;
  for (let i = 0; i < shapes.length; i++) {
    var s = shapes[i];
    // decide if the shape is a rect or circle
    if (s.width) {
      // test if the mouse is inside this rect
      if (
        !dragok &&
        mx > s.x &&
        mx < s.x + s.width &&
        my > s.y &&
        my < s.y + s.height
      ) {
        // if yes, set that rects isDragging=true
        dragok = true;
        s.isDragging = true;
      }
    } else {
      const dx = s.x - mx;
      const dy = s.y - my;
      // test if the mouse is inside this circle
      if (!dragok && dx * dx + dy * dy < s.r * s.r) {
        dragok = true;
        s.isDragging = true;
      }
    }
  }
  // save the current mouse position
  startX = mx;
  startY = my;
}

// handle mouseup events
function myUp(e) {
  // tell the browser we're handling this mouse event
  e.preventDefault();
  e.stopPropagation();

  // clear all the dragging flags
  dragok = false;
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].isDragging = false;
  }
}

// handle mouse moves
function myMove(e) {
  // if we're dragging anything...
  if (dragok) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    const mx = parseInt(e.clientX - offsetX);
    const my = parseInt(e.clientY - offsetY);

    // calculate the distance the mouse has moved
    // since the last mousemove
    const dx = mx - startX;
    const dy = my - startY;

    // move each rect that isDragging
    // by the distance the mouse has moved
    // since the last mousemove
    for (let i = 0; i < shapes.length; i++) {
      const s = shapes[i];
      if (s.isDragging) {
        s.x += dx;
        s.y += dy;
      }
    }

    // redraw the scene with the new rect positions
    draw();

    // reset the starting mouse position for the next mousemove
    startX = mx;
    startY = my;
  }
}
