import { useTexture, Plane } from "@react-three/drei";

export default function ImagePlane() {
    const path = (name) => `/textures/${name}.png`;
    const textures = useTexture([path('thum1'), path('thum2'), path('thum3')]);

    return (
        <>
            {textures.map((texture, index) => (
                <Plane args={[3, 3]} position={[index * 4 - 4, 0, 0]} scale={1}>
                    <meshBasicMaterial map={texture} transparent />
                </Plane>
            ))} 
        </>
       
    )
}
