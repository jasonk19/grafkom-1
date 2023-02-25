const canvas = document.getElementById("canvas")
const gl = canvas.getContext("webgl")
const line = new Line()
const square = new Square()
const rectangle = new Rectangle()

// UTILS
const color = [0, 0, 0, 1]
let count = -1
let line_dragging = false
let square_dragging = false
let rectangle_dragging = false

// MAIN PROGRAM
function main() {
    const program = buildProgram(gl);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const colorAttributeLocation = gl.getAttribLocation(program, "a_color")

    const colorBuffer = gl.createBuffer()
    const positionBuffer = gl.createBuffer();

    draw()

    function setBuffer(vertex_array, color_array) {
        // position
        buildBuffer(gl, positionBuffer, vertex_array)
        buildVertexAttrib(gl, positionAttributeLocation, positionBuffer, 2)

        // color
        buildBuffer(gl, colorBuffer, color_array)
        buildVertexAttrib(gl, colorAttributeLocation, colorBuffer, 4);
    }

    function draw() {
        const width = canvas.clientWidth
        const height = canvas.clientHeight

        if (canvas.width !== width) canvas.width = width
        if (canvas.height !== height) canvas.height = height

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.depthFunc(gl.LEQUAL)
        gl.enable(gl.DEPTH_TEST)

        gl.useProgram(program);

        // LINE
        setBuffer(line.getVertices(), line.getColors())
        count = Math.floor(line.getVerticesLength() / 2)
        gl.drawArrays(gl.LINES, 0, count)

        // SQUARE
        for (let i = 0; i < square.getVerticesLength(); i++) {
            let vert = square.getVertice(i)
            let color = square.getColor(i)
            setBuffer(vert, color)
            count = Math.floor(vert.length / 2)
            gl.drawArrays(gl.TRIANGLE_FAN, 0, count)
        }

        // TEMPORARY SQUARE
        setBuffer(square.getTempSquareVertices(), square.getTempSquareColors());
        count = Math.floor(square.getTempSquareVerticesLength() / 2);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, count);


        // RECTANGLE
        for (let i = 0; i < rectangle.getVerticesLength(); i++) {
            let vert = rectangle.getVertice(i)
            let color = rectangle.getColor(i)
            setBuffer(vert, color)
            count = Math.floor(vert.length / 2)
            gl.drawArrays(gl.TRIANGLE_FAN, 0, count)
        }

        // TEMPORARY RECTANGLE
        setBuffer(rectangle.getTempRectangleVertices(), rectangle.getTempRectangleColors());
        count = Math.floor(rectangle.getTempRectangleVerticesLength() / 2);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, count);

        window.requestAnimationFrame(draw)
    }
}

// Line
function handleLineClick(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2

    if (!line_dragging) {
        line.addVertices(x, y)
        line.addColorsFromArray(color)
    } else {
        line_dragging = false
    }
}

function handleLineDrag(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2

    if (line.getVerticesLength() % 4 == 2 && !line_dragging) {
        line_dragging = true
        line.addVertices(x, y)
        line.addColorsFromArray(color)
    } else if (line_dragging) {
        line.setVertice(line.getVerticesLength() - 2, x)
        line.setVertice(line.getVerticesLength() - 1, y)
    }
}

// Square
function handleSquareClick(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2

    if (!square_dragging) {
        square.addManyTempSquareVertices(x, y);
        square.addManyTempSquareColorsFromArray(color);
    } else {
        square_dragging = false
        square.addVertice(square.temp_square_vertices)
        square.addColor(square.temp_square_colors)

        square.clearTempSquareVertices()
        square.clearTempSquareColors()
    }
}

function handleSquareDrag(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2

    if (square.getTempSquareVerticesLength() % 8 == 2 && !square_dragging) {
        square_dragging = true
        square.addManyTempSquareVertices(0, 0, 0, 0, 0, 0)
        square.addManyTempSquareColors(
            color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3],
        )
    } else if (square_dragging) {
        const x0 = square.getTempSquareVertice(square.getTempSquareVerticesLength() - 8)
        const y0 = square.getTempSquareVertice(square.getTempSquareVerticesLength() - 7)
        square.setTempSquareVertice(square.getTempSquareVerticesLength() - 6, x0)
        square.setTempSquareVertice(square.getTempSquareVerticesLength() - 5, y)
        square.setTempSquareVertice(square.getTempSquareVerticesLength() - 4, x)
        square.setTempSquareVertice(square.getTempSquareVerticesLength() - 3, y)
        square.setTempSquareVertice(square.getTempSquareVerticesLength() - 2, x)
        square.setTempSquareVertice(square.getTempSquareVerticesLength() - 1, y0)
    }
}

// Rectangle
function handleRectangleClick(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2

    if (!rectangle_dragging) {
        rectangle.addManyTempRectangleVertices(x, y);
        rectangle.addManyTempRectangleColorsFromArray(color);
    } else {
        rectangle_dragging = false
        rectangle.addVertice(rectangle.temp_rectangle_vertices)
        rectangle.addColor(rectangle.temp_rectangle_colors)

        rectangle.clearTempRectangleVertices()
        rectangle.clearTempRectangleColors()
    }
}

function handleRectangleDrag(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2

    if (rectangle.getTempRectangleVerticesLength() % 8 == 2 && !rectangle_dragging) {
        rectangle_dragging = true
        rectangle.addManyTempRectangleVertices(0, 0, 0, 0, 0, 0)
        rectangle.addManyTempRectangleColors(
            color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3],
        )
    } else if (rectangle_dragging) {
        const x0 = rectangle.getTempRectangleVertice(rectangle.getTempRectangleVerticesLength() - 8)
        const y0 = rectangle.getTempRectangleVertice(rectangle.getTempRectangleVerticesLength() - 7)
        rectangle.setTempRectangleVertice(rectangle.getTempRectangleVerticesLength() - 6, x0)
        rectangle.setTempRectangleVertice(rectangle.getTempRectangleVerticesLength() - 5, y)
        rectangle.setTempRectangleVertice(rectangle.getTempRectangleVerticesLength() - 4, x)
        rectangle.setTempRectangleVertice(rectangle.getTempRectangleVerticesLength() - 3, y)
        rectangle.setTempRectangleVertice(rectangle.getTempRectangleVerticesLength() - 2, x)
        rectangle.setTempRectangleVertice(rectangle.getTempRectangleVerticesLength() - 1, y0)
    }
}

function drawLine() {
    modeText.innerText = "Line tool";
    canvas.onmousedown = function (e) { handleLineClick(e) };
    canvas.onmousemove = function (e) { handleLineDrag(e) };
}

function drawSquare() {
    modeText.innerText = "Square tool";
    canvas.onmousedown = function (e) { handleSquareClick(e) }
    canvas.onmousemove = function (e) { handleSquareDrag(e) }
}

function drawRectangle() {
    modeText.innerText = "Rectangle tool";
    canvas.onmousedown = function (e) { handleRectangleClick(e) }
    canvas.onmousemove = function (e) { handleRectangleDrag(e) }
}

function drawPolygon() {
    modeText.innerText = "Polygon tool";
    canvas.onmousedown = function (e) { console.log(e.clientX) }
    canvas.onmousemove = function (e) { console.log(e.clientX) }
}

btnLine.addEventListener("click", drawLine)
btnSquare.addEventListener("click", drawSquare)
btnRectangle.addEventListener("click", drawRectangle)
btnPolygon.addEventListener("click", drawPolygon)

window.onload = main