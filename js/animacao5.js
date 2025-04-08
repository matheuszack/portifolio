import * as  THREE from "three";

document.addEventListener("DOMContentLoaded", () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("three-canvas"), alpha: true });

    renderer.setSize(window.innerWidth, 400);
    document.querySelector(".three-container").appendChild(renderer.domElement);

    // Criando partículas (nós da rede)
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleObjects = [];

    for (let i = 0; i < particleCount; i++) {
        let x = (Math.random() - 0.5) * 7;
        let y = (Math.random() - 0.5) * 7;
        let z = (Math.random() - 0.5) * 7;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        particleObjects.push(new THREE.Vector3(x, y, z));
    }

    particles.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({ color: "#008000", size: 0.2 });
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Criando as linhas conectando as partículas
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff99, transparent: true, opacity: 0.5 });
    const lineGeometry = new THREE.BufferGeometry();
    const lineVertices = [];

    for (let i = 0; i < particleObjects.length; i++) {
        for (let j = i + 1; j < particleObjects.length; j++) {
            if (particleObjects[i].distanceTo(particleObjects[j]) < 2) {
                lineVertices.push(
                    particleObjects[i].x, particleObjects[i].y, particleObjects[i].z,
                    particleObjects[j].x, particleObjects[j].y, particleObjects[j].z
                );
            }
        }
    }

    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(lineVertices, 3));
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        particleSystem.rotation.y += 0.001;
        lineMesh.rotation.y += 0.001;
        renderer.render(scene, camera);
    }

    animate();

    // Efeito de explosão ao clicar
   window.addEventListener("click", () => {
    for (let i = 0; i < positions.length; i += 3) {
        // Aumente a magnitude da força para 5x
        
        let forceX = (Math.random() - 0.5) * 222;
        let forceY = (Math.random() - 0.5) * 5;
        let forceZ = (Math.random() - 0.5) * 5;
       
        positions[i] += forceX;
        positions[i + 1] += forceY;
        positions[i + 2] += forceZ;
      
        
    }
    particles.attributes.position.needsUpdate = true;
   
    
});

    // Ajuste responsivo
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / 400;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, 400);
    });
});