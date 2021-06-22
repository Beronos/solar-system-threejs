document.addEventListener("DOMContentLoaded", function(){
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer(
        {antialias:true}
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    

    //LIGHTS -- Ambient Light
    const ambiColor = 0x8c8c8c;
    const ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    // Directional Ligth
    const dLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
    dLight.position.set(-200, 200, -400);
    scene.add(dLight);

    //Point Light

    const pLight = new THREE.PointLight(0x606060, 1.0);
    pLight.position.set(0, 1, 1).normalize();
    scene.add(pLight);

    //Spot Light

    const spotLight = new THREE.SpotLight(0xFFFFFF, 1.0);
    spotLight.position.set(-400, 1200, 300);
    spotLight.angle = 20 * Math.PI / 180;
    spotLight.exponent = 1.0;
    spotLight.target.position.set(0, 200, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);


    //adding stars
    let starGeo = new THREE.Geometry();
      for(let i=0; i< 12000; i++) {
        let star = new THREE.Vector3(
          Math.random() * 600 - 300,
          Math.random() * 600 - 300,
          Math.random() * 600 - 300
        );
        star.velocity = 0;
        star.acceleration = 0.02;
        starGeo.vertices.push(star);
      }
      
    let sprite = new THREE.TextureLoader().load( 'images/star.png' );
    let starMaterial = new THREE.ParticleBasicMaterial({
    color: 0xaaaaaa,
    size: 0.5,
    map: sprite,
    blending: THREE.AdditiveBlending,
    });

    let stars = new THREE.ParticleSystem(starGeo,starMaterial);
    stars.sortParticles = true;

    scene.add(stars);


    const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(-800, 400, 520);
    camera.lookAt(scene.position);
    scene.add(camera);

    const controls = new THREE.TrackballControls(camera, renderer.domElement);
    
    const keyboard = new THREEx.KeyboardState();

    document.getElementById("WebGL-Output").append(renderer.domElement);




    const solarSystem = new THREE.Object3D();

    createSolarSystem(solarSystem);
    scene.add(solarSystem);


    function createSolarSystem(solarSystem){
        

        for(let obj of celestialObjects){
            console.log(obj);
            let planetTexture = new THREE.ImageUtils.loadTexture(obj.src);
            const planetMaterial = new THREE.MeshPhongMaterial({
                map: planetTexture,
            });

            

            let planet = new THREE.Mesh(new THREE.SphereGeometry(obj.radius,obj.widthSegment,obj.heightSegment), planetMaterial);
            planet.position.x = obj.cords.x;
            planet.position.y = obj.cords.y;
            planet.position.z = obj.cords.z;
            solarSystem.add(planet);
        }

        solarSystem.traverse(function(object){
            if(object instanceof THREE.Mesh){
                object.castShadow = true;
                object.receiveShadow = true;
            }
        })

    }

    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }    

    animate();

    

    function animate(){
        requestAnimationFrame(animate);
        render();
        update();
    }

    function update(){
        if(keyboard.pressed("left")){
            solarSystem.rotation.y -= 0.02;
        }
        if(keyboard.pressed("right")){
            solarSystem.rotation.y += 0.02;
        }
        if(keyboard.pressed("up")){
            solarSystem.rotation.x -= 0.02;
        }
        if(keyboard.pressed("down")){
            solarSystem.rotation.x += 0.02;
        }
        controls.update();
    }

    function render(){
        starGeo.vertices.forEach(p => {
            p.velocity += p.acceleration
            p.y -= p.velocity;
            
            if (p.y < -200) {
              p.y = 200;
              p.velocity = 0;
            }
          });
          starGeo.verticesNeedUpdate = true;
          stars.rotation.y +=0.002;
        solarSystem.rotation.y += 0.003 ;
        renderer.render(scene, camera);
    }
})