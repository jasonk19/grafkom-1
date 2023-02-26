class Polygon extends Shape {
    constructor() {
        super("polygon")
        this.temp_polygon_vertices = []
        this.temp_polygon_colors = []
    }

    addTempPolygonVertice(item) {
        this.temp_polygon_vertices.push(item)
    }

    addTempPolygonColor(item) {
        this.temp_polygon_colors.push(item)
    }

    addManyTempPolygonVertices(...items) {
        items.forEach((item) => {
            this.temp_polygon_vertices.push(item)
        })
    }

    addManyTempPolygonColors(...items) {
        items.forEach((item) => {
            this.temp_polygon_colors.push(item)
        })
    }

    addManyTempPolygonVerticesFromArray(items) {
        items.forEach((item) => {
            this.temp_polygon_vertices.push(item)
        })
    }

    addManyTempPolygonColorsFromArray(items) {
        items.forEach((item) => {
            this.temp_polygon_colors.push(item)
        })
    }

    clearTempPolygonVertices() {
        this.temp_polygon_vertices = []
    }

    clearTempPolygonColors() {
        this.temp_polygon_colors = []
    }

    getTempPolygonVerticesLength() {
        return this.temp_polygon_vertices.length
    }

    getTempPolygonVertice(pos) {
        return this.temp_polygon_vertices[pos]
    }

    getTempPolygonColor(pos) {
        return this.temp_polygon_colors[pos]
    }

    getTempPolygonVertices() {
        return this.temp_polygon_vertices
    }

    getTempPolygonColors() {
        return this.temp_polygon_colors
    }

    removeTempPolygonVertice() {
        this.temp_polygon_vertices.pop()
        this.temp_polygon_vertices.pop()
    }

    removeTempPolygonColors() {
        this.temp_polygon_colors.pop()
        this.temp_polygon_colors.pop()
        this.temp_polygon_colors.pop()
        this.temp_polygon_colors.pop()
    }

    setTempPolygonVertice(pos, val) {
        this.temp_polygon_vertices[pos] = val
    }
}