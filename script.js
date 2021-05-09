const internals = {};

internals.W = 500;
internals.H = 500;

internals.randomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

internals.materials = {
  orange: new THREE.MeshPhongMaterial({ color: 0xB7513C, flatShading: true }),
  green:  new THREE.MeshPhongMaterial({ color: 0x379351, flatShading: true }),
  brown:  new THREE.MeshPhongMaterial({ color: 0x5C2C22, flatShading: true }),
  pink:   new THREE.MeshPhongMaterial({ color: 0xB1325E, flatShading: true }),
  gray:   new THREE.MeshPhongMaterial({ color: 0x666666, flatShading: true }),
  clouds: new THREE.MeshPhongMaterial({ color: 0xeeeeee, flatShading: true }),
  rabbit: new THREE.MeshPhongMaterial({ color: 0xaaaaaa, flatShading: true })
};

internals.shadowSupport = (group) => {

  group.traverse((object) => {

    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
};


console.log('🥕🐰✈️☁️');


class Cloud {
  constructor(config) {

    console.log('☁️');

    this.mesh = new THREE.Group();

    const cloud = this._createCould();

    this.mesh.position.x = 200;
    this.mesh.position.y = config.y || Math.random();
    this.mesh.position.z = config.z || 0;

    this.mesh.add(cloud);

    this.animate(config);
  }

  animate(config) {

    TweenMax.to(this.mesh.position, 3.5, {
      x: -200,
      repeat: Infinity,
      delay: config.delay || 0,
      onRepeat: () => {

        this.mesh.position.y = internals.randomIntFromInterval(-10, 20);
      }
    });
  }

  _createCould() {

    const group = new THREE.Group();

    const cloudGeo = new THREE.SphereGeometry(5, 4, 6);
    const cloud = new THREE.Mesh(cloudGeo, internals.materials.clouds);
    cloud.scale.set(1, 0.8, 1);

    const cloud2 = cloud.clone();
    cloud2.scale.set(.55, .35, 1);
    cloud2.position.set(5, -1.5, 2);

    const cloud3 = cloud.clone();
    cloud3.scale.set(.75, .5, 1);
    cloud3.position.set(-5.5, -2, -1);

    group.add(cloud);
    group.add(cloud2);
    group.add(cloud3);

    internals.shadowSupport(group);

    return group;
  }
}

class Carrot {
  constructor() {

    console.log('🥕');

    this.mesh = new THREE.Group();

    this.body = this._createBody();
    this.wings = this._createWings();
    this.leafs = this._createLeafs();
    this.pilot = new Pilot();

    this.mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/2);
    this.mesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI/2);

    this.mesh.add(this.body);
    this.mesh.add(this.wings);
    this.mesh.add(this.leafs);
    this.mesh.add(this.pilot.mesh);

    this.animate();
  }

  animate() {

    TweenMax.to(this.mesh.position, 1, {
      x: -2,
      y: 4,
      repeat: Infinity,
      yoyo: true,
      ease: Sine.easeInOut
    });

    TweenMax.to(this.mesh.rotation, 1, {
      x: -1.7,
      repeat: Infinity,
      yoyo: true,
      ease: Sine.easeInOut
    });

    TweenMax.to(this.leafs.rotation, 0.1, {
      y: Math.PI,
      repeat: Infinity,
      ease: Power0.easeNone
    });
  }

  _createBody() {

    const group = new THREE.Group();

    const bodyGeom = new THREE.CylinderGeometry(5, 2, 25);
    bodyGeom.vertices[16].y += 3;
    bodyGeom.vertices[17].y -= 2;

    group.add(new THREE.Mesh(bodyGeom, internals.materials.orange));

    internals.shadowSupport(group);

    return group;
  }

  _createWings() {

    console.log('✈️');

    const group = new THREE.Group();
    const geometry = new THREE.CubeGeometry(7, 7, 0.5);

    geometry.vertices[2].y += 2;
    geometry.vertices[3].y += 2;
    geometry.vertices[2].x -= 1;
    geometry.vertices[3].x -= 1;

    const wingR = new THREE.Mesh(geometry, internals.materials.brown);
    wingR.position.x = 6;
    wingR.position.y = 2;
    wingR.position.z = 1;

    const wingL = wingR.clone();
    wingL.position.x = -6;
    wingL.rotation.y = Math.PI;

    group.add(wingR);
    group.add(wingL);

    internals.shadowSupport(group);

    return group;
  }

  _createLeafs() {

    console.log('🍃');

    const group = new THREE.Group();
    const geometry = new THREE.CylinderGeometry(1.5, 1, 5, 4);

    geometry.vertices[8].y += 0.5;

    const leafA = new THREE.Mesh(geometry, internals.materials.green);
    leafA.position.y = 16;

    const leafB = leafA.clone();
    leafB.position.x = -1.75;
    leafB.position.y = 15;
    leafB.rotation.z = 0.4;

    const leafC = leafB.clone();
    leafC.position.x = leafB.position.x * -1;
    leafC.rotation.z = leafB.rotation.z * -1;

    group.add(leafA);
    group.add(leafB);
    group.add(leafC);

    internals.shadowSupport(group);

    return group;
  }
}

class Pilot {

  constructor() {

    console.log('🐰');

    this.mesh = new THREE.Group();

    this.pilot = this._createPilot();

    this.mesh.rotation.x = 1.5;
    this.mesh.position.set(0, 7, 5);

    this.mesh.add(this.pilot);

    this.animate();
  }

  animate() {

    TweenMax.to(this.earPivotL.rotation, 0.1, {
      x: Math.sin(-Math.PI/3),
      repeat: Infinity,
      yoyo: true
    });

    TweenMax.to(this.earPivotR.rotation, 0.1, {
      x: -Math.PI/2.25,
      repeat: Infinity,
      yoyo: true
    });

    TweenMax.to(this.eye.scale, 0.5, {
      y: 0.1,
      repeat: Infinity,
      yoyo: true,
      delay: 5,
      repeatDelay: 3
    });

    TweenMax.to(this.eyeb.scale, 0.5, {
      y: 0.1,
      repeat: Infinity,
      yoyo: true,
      delay: 5,
      repeatDelay: 3
    });
  }

  _createPilot() {

    const group = new THREE.Group();

    const bodyGeo = new THREE.CubeGeometry(5, 5, 5);
    bodyGeo.vertices[3].y += 0.5;
    bodyGeo.vertices[6].y += 0.5;

    const body = new THREE.Mesh(bodyGeo, internals.materials.rabbit);
    body.position.y = 1;
    body.position.z = 4;

    const seatGeo = new THREE.CubeGeometry(6, 1, 6);
    const seat = new THREE.Mesh(seatGeo, internals.materials.brown);
    seat.position.set(0, -2.5, 0);
    seat.rotation.set(.25, 0, 0);
    body.add(seat);

    this.earPivotL = new THREE.Object3D();
    this.earPivotL.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2.5, 0));
    this.earPivotL.rotation.x = -Math.PI/2.25;

    this.earPivotR = this.earPivotL.clone();
    this.earPivotR.rotation.x = -Math.PI/3;

    const earGeo = new THREE.CubeGeometry(2, 6, 0.5);
    earGeo.vertices[2].x -= 0.5;
    earGeo.vertices[3].x -= 0.5;
    earGeo.vertices[6].x += 0.5;
    earGeo.vertices[7].x += 0.5;

    const ear = new THREE.Mesh(earGeo, internals.materials.rabbit);
    ear.position.x = -1.5;
    ear.position.y = 2.5;

    const earInside = new THREE.Mesh(earGeo, internals.materials.pink);
    earInside.scale.set(.5, .7, .5);
    earInside.position.set(0, 0, .25);
    ear.add(earInside);

    this.earPivotL.add(ear);
    body.add(this.earPivotL);

    const ear2 = ear.clone();
    ear2.position.x = ear.position.x * -1;
    this.earPivotR.add(ear2);
    body.add(this.earPivotR);

    const eyeGeo = new THREE.CubeGeometry(0.5, 1, 0.5);
    const eye = new THREE.Mesh(eyeGeo, internals.materials.gray);
    eye.position.set(1, 0.5, 2.5);
    body.add(eye);
    this.eye = eye;

    const eyeb = eye.clone();
    eyeb.position.x = eye.position.x * -1;
    this.eyeb = eyeb;
    body.add(eyeb);

    const noseGeo = new THREE.CubeGeometry(0.5, 0.5, 0.5);
    noseGeo.vertices[2].x = 0;
    noseGeo.vertices[3].x = 0;
    noseGeo.vertices[6].x = 0;
    noseGeo.vertices[7].x = 0;
    const nose = new THREE.Mesh(noseGeo, internals.materials.pink);
    nose.position.set(0, -.5, 2.5);
    body.add(nose);

    const mouthGeo = new THREE.CubeGeometry(.25, 0.25, 0.5);
    const mouth = new THREE.Mesh(mouthGeo, internals.materials.gray);
    mouth.position.set(0, -1.5, 2.5);
    body.add(mouth);

    group.add(body);

    internals.shadowSupport(group);

    return group;
  }
}


console.log('🥕🐰✈️☁️');


internals.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
internals.camera = new THREE.PerspectiveCamera(45, (internals.W/internals.H), 1, 1000);
internals.scene = new THREE.Scene();
internals.scene.fog = new THREE.Fog(0xd5f8f8, 100, 300);

// setup renderer
internals.renderer.setPixelRatio(window.devicePixelRatio);
internals.renderer.setClearColor(0xc5f5f5, .7);
internals.renderer.setSize(internals.W, internals.H);
internals.renderer.shadowMap.enabled = true;
document.body.appendChild(internals.renderer.domElement);

// setup camera
internals.camera.position.set(40, 20, 100);
internals.scene.add(internals.camera);

// controls
internals.controls = new THREE.OrbitControls(internals.camera, internals.renderer.domElement);
internals.controls.minDistance = 50;
internals.controls.maxDistance = 250;

(function setupLights() {

  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(30, 20, 0);
  directional.castShadow = true;

  internals.scene.add(new THREE.AmbientLight(0xc5f5f5, 1));
  internals.scene.add(directional);
}());

(function createFloor(){

  const floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,1000), new THREE.MeshBasicMaterial({color: 0xe0dacd}));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -100;

  internals.scene.add(floor);
}());

(function addElements() {

  internals.scene.add(new Carrot().mesh);
  internals.scene.add(new Cloud({ y: -5, z: 20 }).mesh);
  internals.scene.add(new Cloud({ y: 0, z: 10, delay: 1 }).mesh);
  internals.scene.add(new Cloud({ y: 15, z: -10, delay: .5 }).mesh);
  internals.scene.add(new Cloud({ y: -15, z: 10, delay: 2 }).mesh);
}())

internals.resizeHandler = () => {

  internals.W = window.innerWidth;
  internals.H = window.innerHeight;

  internals.renderer.setSize(internals.W, internals.H);
  internals.camera.aspect = internals.W / internals.H;
  internals.camera.updateProjectionMatrix()
}
window.addEventListener('resize', internals.resizeHandler, false);
internals.resizeHandler();

internals.render = () => internals.renderer.render(internals.scene, internals.camera)
TweenLite.ticker.addEventListener("tick", internals.render);