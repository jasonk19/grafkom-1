class Shape {
    constructor() {
        this.vertices = []
        this.colors = []
    }

    getVertices() {
        return this.vertices
    }

    getColors() {
        return this.colors
    }

    getVertice(pos) {
        return this.vertices[pos]
    }

    getColor(pos) {
        return this.colors[pos]
    }

    addVertice(item) {
        this.vertices.push(item)
    }

    addColor(item) {
        this.colors.push(item)
    }

    addVerticesFromArray(items) {
        items.forEach((item) => {
            this.vertices.push(item)
        })
    }

    addVertices(...items) {
        items.forEach((item) => {
            this.vertices.push(item)
        })
    }

    addColorsFromArray(items) {
        items.forEach((item) => {
            this.colors.push(item)
        })
    }

    addColors(...items) {
        items.forEach((item) => {
            this.colors.push(item)
        })
    }

    setVertice(pos, vertice) {
        this.vertices[pos] = vertice
    }

    setColor(pos, color) {
        this.colors[pos] = color
    }

    setVertices(items) {
        this.vertices = items
    }

    setColors(items) {
        this.colors = items
    }

    getVerticesLength() {
        return this.vertices.length
    }
}