function convexHull(points) {
    const pointsArray = []
    for (let i = 0; i < points.length; i += 2) {
        let pointsInner = [points[i], points[i + 1]]
        pointsArray.push(pointsInner);
    }

    pointsArray.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    const [p1, pn] = getExtreme(pointsArray);

    const hull = []
    let simplices = []

    hull.push(p1)
    hull.push(pn)

    const s1 = []
    const s2 = []

    pointsArray.forEach((point) => {
        if (getLocation(p1, pn, point) > 0) {
            s1.push(point)
        }
        if (getLocation(p1, pn, point) < 0) {
            s2.push(point)
        }
    })

    findHull(hull, s1, p1, pn, simplices)
    findHull(hull, s2, pn, p1, simplices)

    simplices = getConnectedSimplex(simplices, hull)

    return simplices.flat()
}

function getExtreme(points) {
    p1 = points[0]
    pn = points[points.length - 1]

    return [p1, pn]
}

function getLocation(p1, p2, p3) {
    const value = (p1[0] * p2[1]) + (p3[0] * p1[1]) + (p2[0] * p3[1]) - (p3[0] * p2[1]) - (p2[0] * p1[1]) - (p1[0] * p3[1])

    if (value > 0) {
        return 1
    } else if (value < 0) {
        return -1
    } else {
        return 0
    }
}

function getLineDistance(p1, p2, p3) {
    const value = (p1[0] * p2[1]) + (p3[0] * p1[1]) + (p2[0] * p3[1]) - (p3[0] * p2[1]) - (p2[0] * p1[1]) - (p1[0] * p3[1])

    return Math.abs(value)
}

function isInsideTriangle(p1, p2, p3, p) {
    const A = area(p1, p2, p3)
    const A1 = area(p, p2, p3)
    const A2 = area(p1, p, p3)
    const A3 = area(p1, p2, p)

    return A === A1 + A2 + A3 ? true : false
}

function area(p1, p2, p3) {
    return Math.abs((p1[0] * (p2[1] - p3[1]) + p2[0] * (p3[1] - p1[1]) + p3[0] * (p1[1] - p2[1]) / 2))
}

function getConnectedSimplex(simplices, hull) {
    const new_simplices = []
    new_simplices.push(simplices[0])

    for (let i = 0; i < hull.length - 1; i++) {
        for (let j = 0; j < simplices.length; j++) {
            if (simplices[j][0] === new_simplices[new_simplices.length - 1][1]) {
                new_simplices.push(simplices[j])
                break
            }
        }
    }
    const vertices = []
    new_simplices.forEach((simplex) => {
        vertices.push(simplex[0])
    })

    return vertices


    // return vertices
}

function findHull(hull, sn, p, q, simplices) {

    if (sn.length === 0) return

    let pMax = [0, 0]
    let maxDist = 0
    let index = -1

    sn.forEach((point) => {
        if (getLineDistance(p, q, point) > maxDist) {
            maxDist = getLineDistance(p, q, point)
            pMax = point
        }
    })

    index = sn.indexOf(pMax)
    if (index > -1) {
        sn.splice(index, 1)
    }

    if (sn.includes(p)) {
        index = sn.indexOf(p)
        if (index > -1) {
            sn.splice(index, 1)
        }
    }
    if (sn.includes(q)) {
        index = sn.indexOf(p)
        if (index > -1) {
            sn.splice(index, 1)
        }
    }

    hull.push(pMax)

    const s1 = []
    const s2 = []


    sn.forEach((el) => {
        if (isInsideTriangle(p, pMax, q, el)) {
            index = sn.indexOf(el)
            if (index > -1) {
                sn.splice(index, 1)
            }
        }
        if (!isInsideTriangle(p, pMax, q, el)) {
            if (getLocation(p, pMax, el) > 0) {
                s1.push(el)
            }
            if (getLocation(pMax, q, el) > 0) {
                s2.push(el)
            }
        }
    })

    findHull(hull, s1, p, pMax, simplices)
    findHull(hull, s2, pMax, q, simplices)

    simplices.push([p, pMax])
    simplices.push([pMax, q])
}



