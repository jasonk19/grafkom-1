class Shape {
    constructor() {
        this.type = "base_shape"
        this.vertices = []
        this.colors = []
        this.selected_vertices = []
        this.selected_vertices_position = []
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

    getFirstSelected() {
        return this.selected_vertices[0]
    }

    getSecondSelected() {
        return this.selected_vertices[1]
    }

    clearSelectedVertices() {
        this.selected_vertices = []
        this.selected_vertices_position = []
    }

    setSelectedVertices(v1, v2) {
        this.selected_vertices = [v1, v2]
    }

    setSelectedVerticesPosition() {
        const pos1 = this.vertices.indexOf(this.selected_vertices[0])
        const pos2 = this.vertices.indexOf(this.selected_vertices[1])
        this.selected_vertices_position = [pos1, pos2]
    }

}