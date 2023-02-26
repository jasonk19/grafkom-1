class ShapeSelector extends Shape {
    constructor(owner) {
        super("shape_selector")
        this.owner = owner
    }

    static getVertexOwner(collectors, x, y) {
        for (let i = 0; i < collectors.length; i += 1) {
            let collector = collectors[i]
            let vertices = collector.getVertices()
            for (let j = 0; j < vertices.length; j += 1) {
                if (x >= vertices[j][0] && x <= vertices[j][4] && y <= vertices[j][1] && y >= vertices[j][3]) {
                    return {
                        "type": collector.getType(),
                        "vertices": vertices[j],
                        "color": collector.getColor(j),
                        "collector": collector,
                        "index": j,
                    }
                }
            }
        }
        return null
    }
}