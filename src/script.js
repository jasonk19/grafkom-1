const canvas = document.getElementById("canvas")
const gl = canvas.getContext("webgl")
const line = new Line()
const square = new Square()
const rectangle = new Rectangle()
const polygon = new Polygon()

// UTILS
const color = [0, 0, 0, 1]
const selectionColor = [0, 0, 1, 1]
let count = -1
let line_dragging = false
let square_dragging = false
let rectangle_dragging = false
let polygon_dragging = false
let isConvex = false

// TRANSFORMATION UTILS
const shape_selector = new ShapeSelector()
let active_rotator = null
let move_dragging = false
let active_mover = null
let active_scaler = null


// SELECT
let current_select = null

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

        // POLYGON
        for (let i = 0; i < polygon.getVerticesLength(); i++) {
            let vert = polygon.getVertice(i)
            let color = polygon.getColor(i)
            setBuffer(vert, color)
            count = Math.floor(vert.length / 2)
            gl.drawArrays(gl.TRIANGLE_FAN, 0, count)
        }

        // TEMPORARY POLYGON
        setBuffer(polygon.getTempPolygonVertices(), polygon.getTempPolygonColors());
        count = Math.floor(polygon.getTempPolygonVerticesLength() / 2);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, count);
        window.requestAnimationFrame(draw)

        // SELECT
        for (let i = 0; i < shape_selector.getVerticesLength(); i++) {
            let vert = shape_selector.getVertice(i)
            let color = shape_selector.getColor(i)
            setBuffer(vert, color)
            count = Math.floor(vert.length / 2)
            gl.drawArrays(gl.TRIANGLE_FAN, 0, count)
        }
    }

    function drawSliderPoints(shapeVertexes, color) {
        let c = color.map((c, i) => {
            return c + 0.3 % 1
        })
        console.log("DRAWING DOTS")
        setBuffer(shapeVertexes, c)
        gl.drawArrays(gl.POINTS, 0, Math.floor(shapeVertexes.length / 2))
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
        let distance = Math.abs(x - x0) > Math.abs(y - y0) ? Math.abs(x - x0) : Math.abs(y - y0)
        x = x0 > x ? x0 - distance : x0 + distance
        y = y0 > y ? y0 - distance : y0 + distance
        square.setTempSquareVertice(square.getTempSquareVerticesLength() - 6, x0)
        square.setTempSquareVertice(square.getTempSquareVerticesLength() - 5, y)
        square.setTempSquareVertice(square.getTempSquareVerticesLength() - 4, x)
        square.setTempSquareVertice(square.getTempSquareVerticesLength() - 3, y)
        square.setTempSquareVertice(square.getTempSquareVerticesLength() - 2, x)
        square.setTempSquareVertice(square.getTempSquareVerticesLength() - 1, y0)
    }
}

function handleMoveClick(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2
    let shape = getVertexOwner(x, y)
    current_select = shape


    if (shape != null) {
        move_dragging = true
        active_mover = new Mover(x, y, shape.collector, shape.index)
        return
    }
}

function handleMoveDrag(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2

    if (active_mover == null) {
        return
    }

    active_mover.move(x, y)
}

function handleMoveRelease(e) {
    if (active_mover != null) {
        active_mover = null
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

function getVertexOwner(x, y) {
    const squares = square.getVertices()
    const rectangles = rectangle.getVertices()
    const polygons = polygon.getVertices()
    const lines = line.getVertices()
    for (let i = 0; i < squares.length; i += 1) {
        if (x >= squares[i][0] && x <= squares[i][4] && y <= squares[i][1] && y >= squares[i][3]) {
            return {
                "type": "square",
                "vertices": squares[i],
                "color": square.getColor(i),
                "collector": square,
                "index": i,
            }
        }
    }

    for (let i = 0; i < rectangles.length; i += 1) {
        if (x >= rectangles[i][0] && x <= rectangles[i][4] && y <= rectangles[i][1] && y >= rectangles[i][3]) {
            return {
                "type": "rectangle",
                "vertices": rectangles[i],
                "color": rectangle.getColor(i),
                "collector": rectangle,
                "index": i,
            }
        }
    }

    return null
}

// Polygon
function handlePolygonClick(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2

    polygon.addManyTempPolygonVertices(x, y)
    polygon.addManyTempPolygonColorsFromArray(color)

    if (polygon.getTempPolygonVerticesLength() > 8) {
        btnStopPolygonDraw.removeAttribute("disabled")
    }
}

function handleChangeRotation(e) {
    const value = e.target.value
    console.log("CALLED ROTATION")
    if (active_rotator === null) {
        active_rotator = new Rotator(shape_selector.owner.collector, shape_selector.owner.index)
    }

    if (value === "") {
        active_rotator.rotateBackToDefault()
    } else {
        active_rotator.rotate(value)
    }
}

function handlePolygonDrag(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2

    if (polygon.getTempPolygonVerticesLength() == 2 && !polygon_dragging) {
        polygon_dragging = true
        polygon.addManyTempPolygonVertices(x, y)
        polygon.addManyTempPolygonColorsFromArray(color)
    } else if (polygon_dragging) {
        polygon.setTempPolygonVertice(polygon.getTempPolygonVerticesLength() - 2, x)
        polygon.setTempPolygonVertice(polygon.getTempPolygonVerticesLength() - 1, y)
    }
}

function stopPolygonDraw() {
    polygon_dragging = false
    polygon_dragging = false
    polygon.removeTempPolygonVertice()
    polygon.removeTempPolygonColors()

    if (isConvex) {
        const convexHullPolygon = convexHull(polygon.temp_polygon_vertices)
        const convexHullPolygonColors = []
        for (let i = 0; i < Math.floor(convexHullPolygon.length / 2); i++) {
            convexHullPolygonColors.push(color[0], color[1], color[2], color[3])
        }

        polygon.addVertice(convexHullPolygon)
        polygon.addColor(convexHullPolygonColors)
    } else {
        polygon.addVertice(polygon.temp_polygon_vertices)
        polygon.addColor(polygon.temp_polygon_colors)
    }

    polygon.clearTempPolygonVertices()
    polygon.clearTempPolygonColors()
}

function drawLine() {
    modeText.innerText = "Line tool";
    canvas.onmousedown = function (e) {
        handleLineClick(e)
    };
    canvas.onmousemove = function (e) {
        handleLineDrag(e)
    };
}

function drawSquare() {
    modeText.innerText = "Square tool";
    canvas.onmousedown = function (e) {
        handleSquareClick(e)
    }
    canvas.onmousemove = function (e) {
        handleSquareDrag(e)
    }
}

function drawRectangle() {
    modeText.innerText = "Rectangle tool";
    canvas.onmousedown = function (e) {
        handleRectangleClick(e)
    }
    canvas.onmousemove = function (e) {
        handleRectangleDrag(e)
    }
}

function handleSelectClick(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2

    shape_selector.setVertices([])
    shape_selector.setColors([])

    active_rotator = null
    active_scaler = null

    const owner = getVertexOwner(x, y)
    shape_selector.owner = owner
    if (owner != null) {
        console.log("OWNER FOUND")
        shape_selector.addVertice(owner.vertices)

        let selected_color = owner.color.map((x, i) => {
            if (i % 4 === 3) {
                return 0.5
            }
            return x
        })
        shape_selector.addColor(selected_color)
    }
}

function handleChangeScaleFactor(e) {
    const value = e.target.value
    if (active_scaler === null) {
        active_scaler = new Scaler(null, null, shape_selector, 0, 0)
    }

    if (value !== "") {
        active_scaler.scaleByFactor(value)
    }
}

function doSelect() {
    modeText.innerText = "Select tool";
    transformationTool.style.display = "flex"
    canvas.onmousedown = function (e) {
        handleSelectClick(e)
    }
    inputRotationDegree.onchange = function (e) {
        handleChangeRotation(e)
    }
    inputScaleFactor.onchange = function (e) {
        handleChangeScaleFactor(e)
    }
}


function doMove() {
    modeText.innerText = "Move tool";
    canvas.onmousedown = function (e) {
        handleMoveClick(e)
    }
    canvas.onmousemove = function (e) {
        handleMoveDrag(e)
    }
    canvas.onmouseup = function (e) {
        handleMoveRelease(e)
    }
}

function drawPolygon() {
    modeText.innerText = "Polygon tool";
    canvas.onmousedown = function (e) {
        handlePolygonClick(e)
    }
    canvas.onmousemove = function (e) {
        handlePolygonDrag(e)
    }
}


function saveGraphic() {
    let element = document.createElement("a")
    const data = {
        line: {
            vertices: line.getVertices(),
            colors: line.getColors()
        },
        square: {
            vertices: square.getVertices(),
            colors: square.getColors()
        },
        rectangle: {
            vertices: rectangle.getVertices(),
            colors: rectangle.getColors()
        },
        polygon: {
            vertices: polygon.getVertices(),
            colors: polygon.getColors()
        }
    }
    const dataText = JSON.stringify(data)
    element.setAttribute("href", "data:text/json, " + encodeURIComponent(dataText))
    element.setAttribute("download", "graphic.json")

    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

function loadGraphic() {
    const data = fileInput.files[0]

    if (!data) {
        alert("Input file failed!")
        return;
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        const graphics = JSON.parse(e.target.result)

        if (!graphics) return;
        line.setVertices(graphics.line.vertices)
        line.setColors(graphics.line.colors)
        square.setVertices(graphics.square.vertices)
        square.setColors(graphics.square.colors)
        rectangle.setVertices(graphics.rectangle.vertices)
        rectangle.setColors(graphics.rectangle.colors)
        polygon.setVertices(graphics.polygon.vertices)
        polygon.setColors(graphics.polygon.colors)
    }
    reader.readAsText(data)
}

function hexToRGB(hex) {
    const R = parseInt(hex.slice(1, 3), 16);
    const G = parseInt(hex.slice(3, 5), 16);
    const B = parseInt(hex.slice(5, 7), 16);
    return [R, G, B];
}

function disableSelect() {
    active_rotator = null
    move_dragging = false
    active_mover = null
    active_scaler = null
    shape_selector.setVertices([])
    shape_selector.setColors([])
}

function changeColor() {
    var hexColor = btnColor.value;
    RGBColor = hexToRGB(hexColor);
    color[0] = RGBColor[0] / 255 //R
    color[1] = RGBColor[1] / 255 //G
    color[2] = RGBColor[2] / 255 //B
    color[3] = 1.0             //A
}

function dist(x1, y1, x2, y2) {
    // euclidean distance
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function handleColorVerticeClick(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2

    let distance = 0.05

    // Find the closest vertice to the lines
    for (let i = 0; i < line.getVerticesLength(); i += 2) {
        let lineIdx = i / 2
        if (dist(x, y, line.getVertice(i), line.getVertice(i + 1)) <= distance) {
            colorIdxStart = lineIdx * 4
            line.setColor(colorIdxStart, color[0])      //R
            line.setColor(colorIdxStart + 1, color[1])    //G
            line.setColor(colorIdxStart + 2, color[2])    //B
            line.setColor(colorIdxStart + 3, color[3])    //A
        }
    }

    // Find the closest vertice to the squares
    for (let i = 0; i < square.getVerticesLength(); i++) {
        squareVertices = square.getVertice(i)
        squareColor = square.getColor(i)
        for (let j = 0; j < squareVertices.length; j += 2) {
            colorIdxStart = j / 2 * 4
            if (dist(x, y, squareVertices[j], squareVertices[j + 1]) <= distance) {
                squareColor[colorIdxStart] = color[0]
                squareColor[colorIdxStart + 1] = color[1]
                squareColor[colorIdxStart + 2] = color[2]
                squareColor[colorIdxStart + 3] = color[3]
                square.setColor(i, squareColor)
            }
        }
    }

    // Find the closest vertice to the rectangles
    for (let i = 0; i < rectangle.getVerticesLength(); i++) {
        rectangleVertices = rectangle.getVertice(i)
        rectangleColor = rectangle.getColor(i)
        for (let j = 0; j < rectangleVertices.length; j += 2) {
            colorIdxStart = j / 2 * 4
            if (dist(x, y, rectangleVertices[j], rectangleVertices[j + 1]) <= distance) {
                rectangleColor[colorIdxStart] = color[0]
                rectangleColor[colorIdxStart + 1] = color[1]
                rectangleColor[colorIdxStart + 2] = color[2]
                rectangleColor[colorIdxStart + 3] = color[3]
                rectangle.setColor(i, rectangleColor)
            }
        }
    }

    // Find the closest vertice to the polygons
    for (let i = 0; i < polygon.getVerticesLength(); i++) {
        polygonVertices = polygon.getVertice(i)
        polygonColor = polygon.getColor(i)
        for (let j = 0; j < polygonVertices.length; j += 2) {
            colorIdxStart = j / 2 * 4
            if (dist(x, y, polygonVertices[j], polygonVertices[j + 1]) <= distance) {
                polygonColor[colorIdxStart] = color[0]
                polygonColor[colorIdxStart + 1] = color[1]
                polygonColor[colorIdxStart + 2] = color[2]
                polygonColor[colorIdxStart + 3] = color[3]
                polygon.setColor(i, polygonColor)
            }
        }
    }

}

function colorOneVertice() {
    disableSelect()
    modeText.innerText = "Color Vertice";
    canvas.onmousedown = function (e) {
        handleColorVerticeClick(e)
    }
}

function handleConvex() {
    isConvex = !isConvex
}

// Point Selection
function handleSelectPointClick(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2

    let distance = 0.05

    // console.log(line_dragging)
    // console.log(line.selected_vertices_position)

    if (line_dragging && line.selected_vertices_position.length === 0) {
        line_dragging = false
    }

    if (!line_dragging && line.selected_vertices_position.length === 0) {
        // Find the closest vertice to the lines
        for (let i = 0; i < line.getVerticesLength(); i += 2) {
            if (dist(x, y, line.getVertice(i), line.getVertice(i + 1)) <= distance) {
                line.setSelectedVertices(line.getVertice(i), line.getVertice(i + 1))
                line.setSelectedVerticesPosition()
            }
        }
    } else {
        line.clearSelectedVertices()
        line_dragging = false
    }

    // // Find the closest vertice to the squares
    // for (let i = 0; i < square.getVerticesLength(); i++) {
    //     squareVertices = square.getVertice(i)
    //     for (let j = 0; j < squareVertices.length; j += 2) {

    //     }
    // }

    // // Find the closest vertice to the rectangles
    // for (let i = 0; i < rectangle.getVerticesLength(); i++) {
    //     rectangleVertices = rectangle.getVertice(i)
    //     for (let j = 0; j < rectangleVertices.length; j += 2) {

    //     }
    // }

    // // Find the closest vertice to the polygons
    // for (let i = 0; i < polygon.getVerticesLength(); i++) {
    //     polygonVertices = polygon.getVertice(i)
    //     for (let j = 0; j < polygonVertices.length; j += 2) {
    //         colorIdxStart = j / 2 * 4
    //         if (dist(x, y, polygonVertices[j], polygonVertices[j + 1]) <= distance) {

    //         }
    //     }
    // }
}

function handleSelectPointDrag(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x / canvas.width * 2 - 1
    y = 1 - y / canvas.height * 2

    if (line_dragging && line.selected_vertices_position) {
        line.setVertice(line.selected_vertices_position[0], x)
        line.setVertice(line.selected_vertices_position[1], y)
    } else if (!line_dragging) {
        line_dragging = true
    }
}

function handleSelectPoint() {
    modeText.innerText = "Select Point tool"
    canvas.onmousedown = function (e) { handleSelectPointClick(e) }
    canvas.onmousemove = function (e) { handleSelectPointDrag(e) }
}

btnLine.addEventListener("click", drawLine)
btnSquare.addEventListener("click", drawSquare)
btnRectangle.addEventListener("click", drawRectangle)
btnPolygon.addEventListener("click", drawPolygon)
btnStopPolygonDraw.addEventListener("click", stopPolygonDraw)
btnSave.addEventListener("click", saveGraphic)
fileInput.addEventListener("change", loadGraphic)
btnColor.addEventListener("change", changeColor)
colorVertice.addEventListener("click", colorOneVertice)
btnSelect.addEventListener("click", doSelect)
btnMove.addEventListener("click", doMove)
checkConvex.addEventListener("change", handleConvex)
btnSelectPoint.addEventListener("click", handleSelectPoint)
window.onload = main