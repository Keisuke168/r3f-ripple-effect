import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import ImagePlane from "./ImagePlane";
import Effect from "./Effect";

export default function App() {
    return (
        <Canvas>
            <color attach="background" args={["#000"]} />
            <Suspense fallback={null}>
                <ImagePlane />
            </Suspense>
            <Suspense fallback={null}>
                <Effect />
            </Suspense>
        </Canvas>
    )
}