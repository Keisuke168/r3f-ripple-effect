import { useEffect  } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { EffectComposer, RenderPass } from 'three-stdlib'
import RipplePassNew from './RipplePass'

export default function Effect() {
    const { gl, scene, camera, size } = useThree()

    // instanciate EffectComposer
    const effectComposer = new EffectComposer(gl);
   
    // instanciate Passes
    const renderPass = new RenderPass(scene, camera);

    // adding Passes
    effectComposer.addPass(renderPass);
    effectComposer.addPass(RipplePassNew());

    useEffect(() => {
        effectComposer.setSize(size.width, size.height);
    }, size)

    // Priorityを1にすることで、一番最後に実行される
    useFrame(() => {
        effectComposer.render();
    }, 1)

    return null;
}
