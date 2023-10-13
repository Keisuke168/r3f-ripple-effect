import { useMemo, useRef } from "react";
import { ShaderPass } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import RippleRenderer from "./ripple";



export default function RipplePassNew (){
    const shaderRef = useRef();
    const rippleTexture = useTexture("/textures/ripple.png");
    const effect = useMemo(() => new RippleRenderer(rippleTexture), [rippleTexture]);

	const shader = useMemo(() => {
		return {
			uniforms: {
				tDiffuse: { value: null },
				u_displacement: { value: null }
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		}
	}, [])

    shaderRef.current = new ShaderPass(shader)

    useFrame(({gl}) => {
        effect.update(gl, shaderRef.current.uniforms.u_displacement);
    })

    return shaderRef.current;
}


const vertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const fragmentShader = `
uniform sampler2D tDiffuse;
uniform sampler2D u_displacement;
varying vec2 v_uv;

float PI = 3.141592653589;

void main() {
  vec2 uv = v_uv;

  vec4 disp = texture2D(u_displacement, uv);
  float theta = disp.r * 2.0 * PI;
  vec2 dir = vec2(sin(theta), cos(theta));
  uv += dir * disp.r * 0.1;

  vec4 color = texture2D(tDiffuse, uv);

  gl_FragColor = color;
}
`