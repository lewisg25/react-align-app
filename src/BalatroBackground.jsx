import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
  const float contrast = 1.7;
  const float lighting = 1.0;
  const float spinAmount = 0.25;
  const float spinEase = 1.0;

  vec4 color1 = vec4(211.0 / 255.0, 242.0 / 255.0, 220.0 / 255.0, 1.0);
  vec4 color2 = vec4(217.0 / 255.0, 204.0 / 255.0, 227.0 / 255.0, 1.0);
  vec4 color3 = vec4(1.0, 1.0, 1.0, 1.0);

  vec2 screenCoords = vUv * iResolution.xy;
  float pixelSize = length(iResolution.xy) / 1000.0;
  vec2 uv = (floor(screenCoords * (1.0 / pixelSize)) * pixelSize - 0.5 * iResolution.xy) / length(iResolution.xy);
  float uvLength = length(uv);

  float speed = -2.0 * spinEase * 0.2 + 302.2;
  float mouseInfluence = uMouse.x * 2.0 - 1.0;
  speed += mouseInfluence * 0.1;

  float pixelAngle = atan(uv.y, uv.x) + speed - spinEase * 20.0 * (spinAmount * uvLength + (1.0 - spinAmount));
  vec2 middle = (iResolution.xy / length(iResolution.xy)) / 2.0;
  uv = vec2(uvLength * cos(pixelAngle) + middle.x, uvLength * sin(pixelAngle) + middle.y) - middle;

  uv *= 30.0;
  speed = iTime * 7.0 + mouseInfluence * 2.0;
  vec2 uv2 = vec2(uv.x + uv.y);

  for (int i = 0; i < 5; i++) {
    uv2 += sin(max(uv.x, uv.y)) + uv;
    uv += 0.5 * vec2(
      cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121),
      sin(uv2.x - 0.113 * speed)
    );
    uv -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
  }

  float contrastMod = 0.25 * contrast + 0.5 * spinAmount + 1.2;
  float paintResolution = min(2.0, max(0.0, length(uv) * 0.035 * contrastMod));
  float color1Portion = max(0.0, 1.0 - contrastMod * abs(1.0 - paintResolution));
  float color2Portion = max(0.0, 1.0 - contrastMod * abs(paintResolution));
  float color3Portion = 1.0 - min(1.0, color1Portion + color2Portion);
  float light = (lighting - 0.2) * max(color1Portion * 5.0 - 4.0, 0.0) + lighting * max(color2Portion * 5.0 - 4.0, 0.0);

  gl_FragColor = (0.3 / contrast) * color1 + (1.0 - 0.3 / contrast) * (
    color1 * color1Portion + color2 * color2Portion + vec4(color3Portion * color3.rgb, color3Portion * color1.a)
  ) + light;
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message || "Unable to compile the background shader.");
  }

  return shader;
}

function createProgram(gl) {
  const program = gl.createProgram();
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(message || "Unable to link the background shader.");
  }

  return program;
}

export default function BalatroBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: false, antialias: false });

    if (!gl) return undefined;

    let animationFrame;

    try {
      const program = createProgram(gl);
      const positionLocation = gl.getAttribLocation(program, "position");
      const uvLocation = gl.getAttribLocation(program, "uv");
      const timeLocation = gl.getUniformLocation(program, "iTime");
      const resolutionLocation = gl.getUniformLocation(program, "iResolution");
      const mouseLocation = gl.getUniformLocation(program, "uMouse");
      const buffer = gl.createBuffer();
      const vertices = new Float32Array([
        -1, -1, 0, 0,
        1, -1, 1, 0,
        -1, 1, 0, 1,
        -1, 1, 0, 1,
        1, -1, 1, 0,
        1, 1, 1, 1,
      ]);
      const mouse = [0.5, 0.5];

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(uvLocation);
      gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 16, 8);

      const resize = () => {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.round(window.innerWidth * pixelRatio);
        const height = Math.round(window.innerHeight * pixelRatio);

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      };

      const handlePointerMove = (event) => {
        mouse[0] = event.clientX / window.innerWidth;
        mouse[1] = 1 - event.clientY / window.innerHeight;
      };

      const draw = (time) => {
        resize();
        gl.uniform1f(timeLocation, time * 0.001);
        gl.uniform3f(resolutionLocation, canvas.width, canvas.height, canvas.width / canvas.height);
        gl.uniform2f(mouseLocation, mouse[0], mouse[1]);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animationFrame = window.requestAnimationFrame(draw);
      };

      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      animationFrame = window.requestAnimationFrame(draw);

      return () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", handlePointerMove);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      };
    } catch (error) {
      console.warn("The animated background could not start.", error);
      return undefined;
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="balatro-background"
      aria-hidden="true"
    />
  );
}
