class Mover {
    constructor(initial_x, initial_y, shape_collector, index) {
        this.initial_X = initial_x
        this.initial_Y = initial_y
        this.shape_collector = shape_collector
        this.index = index
    }

    move(final_x, final_y) {
        let dx = final_x - this.initial_X
        let dy = final_y - this.initial_Y

        this.initial_X = final_x
        this.initial_Y = final_y

        console.log("dx: " + dx)
        console.log("dy: " + dy)

        // update x
        for (let i = 0; i < this.shape_collector.getVertice(this.index).length; i += 2) {
            this.shape_collector.getVertice(this.index)[i] += dx
        }

        // update y
        for (let i = 1; i < this.shape_collector.getVertice(this.index).length; i += 2) {
            this.shape_collector.getVertice(this.index)[i] += dy
        }
    }

}