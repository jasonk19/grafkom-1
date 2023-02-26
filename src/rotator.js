class Rotator {
    constructor(shape_collector, index) {
        this.shape_collector = shape_collector
        this.index = index
        this.latest_rotation_degree = 0
    }


    centerPoint(points) {
        let x = 0
        let y = 0
        for (let i = 0; i < points.length; i += 2) {
            x += points[i]
            y += points[i + 1]
        }
        return [x / (points.length / 2), y / (points.length / 2)]
    }

    rotate(degree) {
        console.log("degree: " + degree)
        degree = (degree % 360) * Math.PI / 180
        console.log("degree in rad: " + degree)
        let vertices = this.shape_collector.getVertice(this.index)
        let original = [...vertices]
        let center = this.centerPoint(vertices)
        // update x
        console.log(vertices)
        for (let i = 0; i < vertices.length; i += 2) {
            vertices[i] = Rotator.updateX(original[i], original[i + 1], degree, center[0], center[1])
        }


        //update y
        for (let i = 1; i < vertices.length; i += 2) {
            vertices[i] = Rotator.updateY(original[i - 1], original[i], degree, center[0], center[1])
        }

        this.latest_rotation_degree += degree
    }

    rotateBackToDefault() {
        this.rotate(-this.latest_rotation_degree)
    }

    static updateX(x, y, degree, center_x, center_y) {
        console.log("CHECK MATH: " + Math.cos(degree))
        return (x - center_x) * Math.cos(degree) - (y - center_y) * Math.sin(degree) + center_x
    }

    static updateY(x, y, degree, center_x, center_y) {
        return (x - center_x) * Math.sin(degree) + (y - center_y) * Math.cos(degree) + center_y
    }

}