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
        this.shape_collector.getVertice(this.index)[this.point_index] = final_x
        this.shape_collector.getVertice(this.index)[this.point_index+1] = final_y
        let dx = Math.abs(final_x - this.initial_X)
        let dy = Math.abs(final_y - this.initial_Y)

        this.initial_X = final_x
        this.initial_Y = final_y

        let opposite_vertice = -1
        if (this.point_index == 0) {
            opposite_vertice = 4
        } 
        else if (this.point_index == 2) {
            opposite_vertice = 6
        }
        else if (this.point_index == 4) {
            opposite_vertice = 0
        }
        else if (this.point_index == 6) {
            opposite_vertice = 2
        }

        var firstIter = true;
        for (let i = 0; i < 8; i += 2) {
            if (i != this.point_index && i != opposite_vertice) {
                if (firstIter) {
                    this.shape_collector.getVertice(this.index)[i] = this.shape_collector.getVertice(this.index)[opposite_vertice];
                    this.shape_collector.getVertice(this.index)[i + 1] = final_y
                    firstIter = false;
                }
                else {
                    this.shape_collector.getVertice(this.index)[i] = final_x;
                    this.shape_collector.getVertice(this.index)[i+1] = this.shape_collector.getVertice(this.index)[opposite_vertice + 1]
                }

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