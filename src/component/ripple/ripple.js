import * as THREE from 'three';

export default class RippleRenderer {
   constructor(_texture) {
    // rendering用のシーンとFBOを作成
    this._texture = _texture;
    this._scene = new THREE.Scene();
    this._target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

    // config
    this._frequency = 5; // mouseがどれだけ動いたら波紋を発生させるか
    this._currentWave = 0; // 現在の波紋の数
    this._max = 100; // 最大の波紋の数

    // camera
    const { width, height, near, far } = this._cameraProps();
    this._camera = new THREE.OrthographicCamera(-width, width, height, -height, near, far)
    this._camera.position.z = 2;

    // mesh
    this._meshs = [];
    this._createMesh();

    // event
    this._prevMouse = new THREE.Vector2(0,0);
    this._mouse = new THREE.Vector2(0,0);
    window.addEventListener('mousemove', this._handleMouseMove.bind(this));
   }

   _cameraProps() {
        const frustumSize = window.innerHeight
        const aspect = window.innerWidth / window.innerHeight
        const [w, h] = [(frustumSize * aspect) / 2, frustumSize / 2]
        return { width: w, height: h, near: -1000, far: 1000 }
   }

   _createMesh() {
        // 大元のgeometryとmaterialを作成
        const size = 64;
        const geometry = new THREE.PlaneGeometry(size, size);
        console.log(this._texture)
        const material = new THREE.MeshBasicMaterial({ 
            map: this._texture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
        });

        // 100個のmeshを作成
        for (let i = 0; i < this._max; i++){
            const mesh = new THREE.Mesh(geometry.clone(), material.clone());
            mesh.rotateZ(2 * Math.PI * Math.random());

            // invisibleにしておく
            mesh.visible = false;

            // sceneに追加
            this._scene.add(mesh);

            // meshを保存
            this._meshs.push(mesh);
        }
   }

    _handleMouseMove(e) {
        // update mouse coord ([-1, 1])
        this._mouse.x = e.clientX - window.innerWidth / 2;
        this._mouse.y = window.innerHeight / 2 - e.clientY;
    }

    // 新しい波紋を発生させる
    _setNewWave() {
        const mesh = this._meshs[this._currentWave];
        mesh.visible = true;
        mesh.position.set(this._mouse.x, this._mouse.y, 0);
        mesh.scale.set(0.2, 0.2)
        mesh.material.opacity = 0.5;
        
    }
   
    // Frame毎にマウス位置をチェックして、波紋を発生させる
    _trackMousePos() {
		// 今のマウス座標と前回のフレームのマウス座標の距離
		const distance = this._mouse.distanceTo(this._prevMouse)
		if (this._frequency < distance) {
			this._currentWave = (this._currentWave + 1) % this._max
			this._setNewWave()
		}
		this._prevMouse.x = this._mouse.x
		this._prevMouse.y = this._mouse.y
        // console.log(this._mouse)
    }

    /**
     * 
     * @param {THREE.WebGLRenderer} gl  
     * @param {THREE.IUniform} uTexture shaderPassから渡されるtexture格納用uniform 
     */
    update = (gl, uTexture) => {
		this._trackMousePos()

		gl.setRenderTarget(this._target)
		gl.render(this._scene, this._camera)
		uTexture.value = this._target.texture
		gl.setRenderTarget(null)
		gl.clear()
        // console.log(this._mouse)

        this._meshs.forEach(mesh => {
			if (mesh.visible) {
				const material = mesh.material
				mesh.rotation.z += 0.02
				material.opacity *= 0.97
				mesh.scale.x = 0.98 * mesh.scale.x + 0.17
				mesh.scale.y = mesh.scale.x
				if (material.opacity < 0.002) mesh.visible = false
			}
		})
	}

}