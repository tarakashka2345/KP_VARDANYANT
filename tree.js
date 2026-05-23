 import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
    import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
    import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

    const container = document.querySelector('.glow-container');
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); 
    scene.fog = null; 

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(3, 1.2, 4.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.enableZoom = true;
    controls.target.set(0, 0, 0);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(container.clientWidth, container.clientHeight), 1.3, 0.35, 0.8);
    bloomPass.threshold = 0.05;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0.7;
    
    const effectComposer = new EffectComposer(renderer);
    effectComposer.addPass(renderScene);
    effectComposer.addPass(bloomPass);

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(2, 4, 3);
    scene.add(mainLight);
    
    const backLight = new THREE.PointLight(0x888888, 0.7);
    backLight.position.set(-1.2, 1.2, -2.8);
    scene.add(backLight);
    
    const pulseLight = new THREE.PointLight(0xaaaaaa, 0.8);
    pulseLight.position.set(1.3, 0.6, 1.8);
    scene.add(pulseLight);
    
    const fillLight = new THREE.PointLight(0x666666, 0.5);
    fillLight.position.set(0, -1.3, 0.8);
    scene.add(fillLight);

    const sphereGeometry = new THREE.SphereGeometry(1.1, 128, 128); 
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xc0c0c0,          
        emissive: 0xaaaaaa,       
        emissiveIntensity: 0.75,
        roughness: 0.25,
        metalness: 0.4,
        flatShading: false
    });
    const graySphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    graySphere.castShadow = true;
    graySphere.receiveShadow = false;
    scene.add(graySphere);

    const coreMat = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        emissive: 0xffffff,
        emissiveIntensity: 0.9,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const innerSphere = new THREE.Mesh(new THREE.SphereGeometry(0.65, 64, 64), coreMat);
    scene.add(innerSphere);

    const ringGeo = new THREE.TorusGeometry(1.45, 0.045, 80, 200);
    const ringMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        emissive: 0xbbbbbb,
        emissiveIntensity: 0.9,
        metalness: 0.8,
        roughness: 0.25,
        transparent: true,
        opacity: 0.7
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);
    
    const ring2Geo = new THREE.TorusGeometry(1.68, 0.035, 80, 200);
    const ring2Mat = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0,
        emissive: 0xcccccc,
        emissiveIntensity: 0.75,
        metalness: 0.7,
        roughness: 0.3,
        transparent: true
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = 1.15;
    ring2.rotation.z = 0.7;
    scene.add(ring2);
    
    const particleCount = 1200;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const radius = 1.65 + Math.random() * 1.1;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i*3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i*3+1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i*3+2] = radius * Math.cos(phi);
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const intensity = 0.5 + Math.random() * 0.5;
        colors[i*3] = intensity;
        colors[i*3+1] = intensity;
        colors[i*3+2] = intensity;
    }
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMat = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.7
    });
    const particleSystem = new THREE.Points(particlesGeo, particleMat);
    scene.add(particleSystem);
    
    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.012;
        
        const sphereGlow = 0.6 + Math.sin(time * 2.2) * 0.35;
        sphereMaterial.emissiveIntensity = sphereGlow;
        coreMat.emissiveIntensity = 0.9 + Math.sin(time * 3.5) * 0.55;
        
        ringMat.emissiveIntensity = 0.75 + Math.sin(time * 1.9) * 0.5;
        ring2Mat.emissiveIntensity = 0.7 + Math.sin(time * 2.4) * 0.6;
        
        pulseLight.intensity = 0.7 + Math.sin(time * 2.6) * 0.45;
        pulseLight.color.setHSL(0, 0, 0.55 + Math.sin(time * 1.9) * 0.15);
        backLight.intensity = 0.5 + Math.sin(time * 1.4) * 0.3;
        fillLight.intensity = 0.4 + Math.sin(time * 1.8) * 0.2;
        
        ring1.rotation.z = time * 0.32;
        ring1.rotation.x = Math.sin(time * 0.55) * 0.28;
        ring2.rotation.y = time * 0.23;
        ring2.rotation.x = Math.cos(time * 0.45) * 0.45;
        
        particleSystem.rotation.y = time * 0.12;
        particleSystem.rotation.x = Math.sin(time * 0.25) * 0.1;
        
        graySphere.rotation.y = Math.sin(time * 0.2) * 0.03;
        graySphere.position.y = Math.sin(time * 1.1) * 0.008;
        innerSphere.rotation.y = graySphere.rotation.y;
        innerSphere.position.y = graySphere.position.y;
        
        const bloomStrength = 1.3 + Math.sin(time * 0.85) * 0.35;
        bloomPass.strength = Math.min(1.9, bloomStrength);
        
        controls.update();
        effectComposer.render();
    }
    
    animate();
    
    window.addEventListener('resize', onWindowResize);
    function onWindowResize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        effectComposer.setSize(width, height);
    }
    setTimeout(() => onWindowResize(), 100);
    
    console.log(' Серый светящийся шар | Фон абсолютно черный | Контейнер серый с сияющими краями');