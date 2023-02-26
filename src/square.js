class Square extends Shape {
    constructor() {
        super("square")
        this.temp_square_vertices = []
        this.temp_square_colors = []
    }

    addTempSquareVertice(item) {
        this.temp_square_vertices.push(item)
    }

    addTempSquareColor(item) {
        this.temp_square_colors.push(item)
    }

    addManyTempSquareVertices(...items) {
        items.forEach((item) => {
            this.temp_square_vertices.push(item)
        })
    }

    addManyTempSquareColors(...items) {
        items.forEach((item) => {
            this.temp_square_colors.push(item)
        })
    }

    addManyTempSquareVerticesFromArray(items) {
        items.forEach((item) => {
            this.temp_square_vertices.push(item)
        })
    }

    addManyTempSquareColorsFromArray(items) {
        items.forEach((item) => {
            this.temp_square_colors.push(item)
        })
    }

    clearTempSquareVertices() {
        this.temp_square_vertices = []
    }

    clearTempSquareColors() {
        this.temp_square_colors = []
    }

    getTempSquareVerticesLength() {
        return this.temp_square_vertices.length
    }

    getTempSquareVertice(pos) {
        return this.temp_square_vertices[pos]
    }

    getTempSquareColor(pos) {
        return this.temp_square_colors[pos]
    }

    getTempSquareVertices() {
        return this.temp_square_vertices
    }

    getTempSquareColors() {
        return this.temp_square_colors
    }

    setTempSquareVertice(pos, val) {
        this.temp_square_vertices[pos] = val
    }
}