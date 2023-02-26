class Scaler {
    constructor(initial_x, initial_y, shape_collector, index, point_index){
        this.initial_X = initial_x
        this.initial_Y = initial_y
        this.point_index = point_index
        this.shape_collector = shape_collector
        this.index = index
        this.latest_scaling_factor = 1
    }

    scale(final_x, final_y) {
        let dx = final_x - this.initial_X
        let dy = final_y - this.initial_Y

        this.initial_X = final_x
        this.initial_Y = final_y

        console.log("dx: " + dx)
        console.log("dy: " + dy)

        // update x
        for (let i = 0; i < this.shape_collector.getVertice(this.index).length; i += 2) {
            if (this.shape_collector.getVertice(this.index)[i] >= this.shape_collector.getVertice(this.index)[this.point_index]) {
                this.shape_collector.getVertice(this.index)[i] += dx
            } else {
                this.shape_collector.getVertice(this.index)[i] -= dx
            }
        }

        // update y
        for (let i = 0; i < this.shape_collector.getVertice(this.index).length; i += 2) {
            // update below
            if (this.shape_collector.getVertice(this.index)[i] < this.shape_collector.getVertice(this.index)[this.point_index]) {
                this.shape_collector.getVertice(this.index)[i] -= dx
            } else {
                this.shape_collector.getVertice(this.index)[i] += dx
            }
        }
    }

    scaleByFactor(factor) {
        if (factor < 0) {
            factor = 1
        }
        this.latest_scaling_factor = factor

        let x = this.shape_collector.getVertice(this.index)[this.point_index]
        let y = this.shape_collector.getVertice(this.index)[this.point_index + 1]

        for (let i = 0; i < this.shape_collector.getVertice(this.index).length; i += 2) {
            this.shape_collector.getVertice(this.index)[i] = x + (this.shape_collector.getVertice(this.index)[i] - x) * factor
        }

        for (let i = 1; i < this.shape_collector.getVertice(this.index).length; i += 2) {
            this.shape_collector.getVertice(this.index)[i] = y + (this.shape_collector.getVertice(this.index)[i] - y) * factor
        }

    }
}