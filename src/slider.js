class Slider extends Shape {
    constructor() {
        super("slider")
        this.temp_rectangle_vertices = []
        this.temp_rectangle_colors = []
    }

    addTempRectangleVertice(item) {
        this.temp_rectangle_vertices.push(item)
    }

    addTempRectangleColor(item) {
        this.temp_rectangle_colors.push(item)
    }

    addManyTempRectangleVertices(...items) {
        items.forEach((item) => {
            this.temp_rectangle_vertices.push(item)
        })
    }

    addManyTempRectangleColors(...items) {
        items.forEach((item) => {
            this.temp_rectangle_colors.push(item)
        })
    }

    addManyTempRectangleVerticesFromArray(items) {
        items.forEach((item) => {
            this.temp_rectangle_vertices.push(item)
        })
    }

    addManyTempRectangleColorsFromArray(items) {
        items.forEach((item) => {
            this.temp_rectangle_colors.push(item)
        })
    }

    clearTempRectangleVertices() {
        this.temp_rectangle_vertices = []
    }

    clearTempRectangleColors() {
        this.temp_rectangle_colors = []
    }

    getTempRectangleVerticesLength() {
        return this.temp_rectangle_vertices.length
    }

    getTempRectangleVertice(pos) {
        return this.temp_rectangle_vertices[pos]
    }

    getTempRectangleColor(pos) {
        return this.temp_rectangle_colors[pos]
    }

    getTempRectangleVertices() {
        return this.temp_rectangle_vertices
    }

    getTempRectangleColors() {
        return this.temp_rectangle_colors
    }

    setTempRectangleVertice(pos, val) {
        this.temp_rectangle_vertices[pos] = val
    }
}