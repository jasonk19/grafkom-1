const vertexShaderSource = `
attribute vec4 a_position;
attribute vec4 a_color;
varying vec4 f_color;
void main() {
    gl_Position = a_position;
    f_color = a_color;
}`;

const fragmentShaderSource = `
precision mediump float;
varying vec4 f_color;
void main() {
    gl_FragColor = f_color;
}`;

function buildProgram(gl) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    return program
}

function buildBuffer(gl, buffer, data) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
}

function buildVertexAttrib(gl, attrib_location, buffer, size) {
    gl.enableVertexAttribArray(attrib_location);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(attrib_location, size, gl.FLOAT, false, 0, 0)
}