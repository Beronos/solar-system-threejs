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

    let starGeo = new THREE.Geometry();
      
    let starMaterial = new THREE.ParticleBasicMaterial({
    color: 0xaaaaaa,
    size: 1,
    map: new THREE.TextureLoader().load( 'images/star.png' ),   
    blending: THREE.AdditiveBlending,
    transparent: true
    });

    for(let i = 0; i< 12000; i++) {
        let star = new THREE.Vector3(
          Math.random() * 800 - 450,
          Math.random() * 800 - 450,
          Math.random() * 800 - 450
        );
        star.velocity = 0;
        star.acceleration = 0.02;
        starGeo.vertices.push(star);
      }

    let stars = new THREE.ParticleSystem(starGeo,starMaterial);
    stars.sortParticles = true;
    scene.add(stars);


    const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.01, 5000);
    camera.position.set(-800, 400, 520);
    camera.lookAt(scene.position);
    scene.add(camera);

    const controls = new THREE.TrackballControls(camera, renderer.domElement);
    
    const keyboard = new THREEx.KeyboardState();

    document.getElementById("WebGL-Output").append(renderer.domElement);
    let planets = [];

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }   
        
    function addObject(obj){
        let planetTexture = new THREE.ImageUtils.loadTexture(obj.src);
            const planetMaterial = new THREE.MeshPhongMaterial({
                map: planetTexture,
        });
        
        
        let planet = {
            name: obj.name,
            orbit: obj.orbit,
            speed: obj.speed,
            model: new THREE.Mesh(new THREE.SphereGeometry(obj.radius,obj.widthSegment,obj.heightSegment), planetMaterial)
        };
        planets.push(planet);
        scene.add(planet.model);
        if(planet.name !== 'sun'){

        }
    }

    function addLine(radius){
        material = new THREE.LineBasicMaterial( { color: 0xbecde6 } ),
        geometry = new THREE.CircleGeometry( radius, 64 );

        geometry.vertices.shift();
        let line =  new THREE.Line( geometry, material );
        line.rotation.x = 1.54;
        scene.add(line);
    }

    window.addEventListener("resize", onWindowResize, false);

    addObject(sunObject);
    for(let obj of celestialObjects){
        addObject(obj);
        addLine(obj.orbit);
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
            line.rotation.x += 0.01;
            console.log(line.rotation.x);
        }
        if(keyboard.pressed("down")){
            line.rotation.x -= 0.02;
            console.log(line.rotation.x);
        }
        controls.update();
    }

    function render(){

        let date = Date.now() * 0.0001;
        // p1.position.set(
        // Math.cos(date) * orbitRadius,
        // 0,
        // Math.sin(date) * orbitRadius
        // );
        starGeo.vertices.forEach(s => {
            s.velocity += s.acceleration
            s.y -= s.velocity;
            
            if (s.y < -200) {
              s.y = 200;
              s.velocity = 0;
            }
          });

          planets.forEach(planet => {

            planet.model.rotation.y += 0.05
            
            if(planet.name !== "sun"){
                planet.model.position.x = Math.cos(date * planet.speed) * planet.orbit;
                planet.model.position.z = Math.sin(date * planet.speed) * planet.orbit;
                if(['venus','jupyter'].includes(planet.name)){
                    planet.model.position.x = Math.cos(-date * planet.speed) * planet.orbit;
                    planet.model.position.z = Math.sin(-date * planet.speed) * planet.orbit;
                }
            }



          })
          starGeo.verticesNeedUpdate = true;
          stars.rotation.y +=0.002;
        renderer.render(scene, camera);
    }
})