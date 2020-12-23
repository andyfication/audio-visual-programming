// Waiting for the DOM to be fully loaded
window.addEventListener('load', function () {
  console.log('DOM has fully loaded');
  init();
});

// Main function which executes as soon as the DOM is fully loaded
function init() {
  // --------------DOM Elements and Variables Initialisation-----------------
  const three_container = document.getElementById('three-container');
  const ambient_light_button = document.getElementById('ambient-light');
  const animate_camera_button = document.getElementById('animate-camera');
  const directional_light_button = document.getElementById('directional-light');
  const animate_cube_button = document.getElementById('animate-cube');

  let AmbientLightOn = false;
  let DirectionalLightOn = false;
  let animatingCube = false;
  let cameraOrigin = true;
  // ------------------------------------------------------------------------

  // --------------Scene, Camera, Renderer, and Canvas-----------------------
  // Setting scene and camera
  const scene = new THREE.Scene();
  // fov, aspect ratio, near, far
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / (window.innerHeight / 1.5),
    0.1,
    1000
  );
  // Moving the camera along the z axis (towards the computer screen)
  camera.position.z = 4;
  // Setting the renderer, color, size, enable shadows, and appending to the DOM
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor('#202020');
  renderer.setSize(window.innerWidth, window.innerHeight / 1.5);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  three_container.appendChild(renderer.domElement);
  // ------------------------------------------------------------------------

  // -----------------------------Lights-------------------------------------
  // Ambient light to lit the scene evenly
  const ambientLight = new THREE.AmbientLight(0x000000, 0.5);
  scene.add(ambientLight);
  // Directional light to lit the scene from a specific angle
  const directionalLight = new THREE.DirectionalLight(0x00000, 1);
  directionalLight.position.set(-1, 1, 0.3);
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  scene.add(directionalLight.target);
  // Setting shadows for the directional light
  directionalLight.shadow.mapSize.width = 512; // default
  directionalLight.shadow.mapSize.height = 512; // default
  directionalLight.shadow.camera.near = 0.5; // default
  directionalLight.shadow.camera.far = 500; // default

  // ------------------------------------------------------------------------

  // --------------------------------Cube------------------------------------
  const cubeGeometry = new THREE.BoxGeometry();
  const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xe6ba39 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  cube.receiveShadow = false;
  scene.add(cube);
  // ------------------------------------------------------------------------

  // -------------------------------Ground-----------------------------------
  const groundGeometry = new THREE.BoxGeometry();
  const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.set(0, -0.6, 0);
  ground.scale.set(30, 0.2, 30);
  ground.receiveShadow = true;
  scene.add(ground);
  // ------------------------------------------------------------------------

  // --------------------------------Loop------------------------------------
  function update() {
    requestAnimationFrame(update);
    // Camera animation
    if (!cameraOrigin) {
      moveCameraToTarget(new THREE.Vector3(2, 0, 3));
    } else {
      moveCameraToOrigin();
    }
    // Rendering the scene and the camera
    renderer.render(scene, camera);
  }
  // This function is called 60 frames per second
  update();
  // ------------------------------------------------------------------------

  // -----------------------------Events-------------------------------------
  // Resize the renderer on window resize. Also adjust the camera ratio accordingly
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight / 1.5);
    camera.aspect = window.innerWidth / (window.innerHeight / 1.5);
    camera.updateProjectionMatrix();
  });
  // Turn on and off the ambient light on button click
  ambient_light_button.addEventListener('click', () => {
    if (AmbientLightOn) {
      ambientLight.color.setHex(0x000000);
    } else {
      ambientLight.color.setHex(0xffffff);
    }
    AmbientLightOn = !AmbientLightOn;
  });
  // Turn on and off the directional light on button click
  directional_light_button.addEventListener('click', () => {
    if (DirectionalLightOn) {
      directionalLight.color.setHex(0x000000);
    } else {
      directionalLight.color.setHex(0xffffff);
    }
    DirectionalLightOn = !DirectionalLightOn;
  });
  // Enable and disable the camera animation on button click
  animate_camera_button.addEventListener('click', () => {
    cameraOrigin = !cameraOrigin;
  });
  // Animate the cube on button click
  animate_cube_button.addEventListener('click', () => {
    if (!animatingCube) {
      animateCube();
    }
  });
  // ------------------------------------------------------------------------

  //-----------------------Supporting Functions------------------------------
  // Move and rotate the camera to the target position
  function moveCameraToTarget(target) {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 10);
    camera.position.lerp(target, 0.01);
    camera.quaternion.slerp(quaternion, 0.01);
  }
  //Move and rotate the camera back to the origin
  function moveCameraToOrigin() {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);

    camera.position.lerp(new THREE.Vector3(0, 0, 4), 0.01);
    camera.quaternion.slerp(quaternion, 0.01);
  }
  // Animate the cube using GSAP library
  function animateCube() {
    animatingCube = true;
    let tl = new TimelineMax().delay(0.3);
    tl.to(cube.scale, 1, { x: 2, ease: Expo.easeOut });
    tl.to(cube.scale, 1, { x: 1, ease: Expo.easeOut });
    tl.to(cube.position, 1, { y: 1.5, ease: Expo.easeOut });
    tl.to(cube.rotation, 2, { z: Math.PI, ease: Expo.easeOut }).addCallback(
      () => {
        cube.rotation.z = 0;
      }
    );
    tl.to(cube.position, 1, { y: 0, ease: Expo.easeOut }).addCallback(() => {
      animatingCube = false;
    });
  }
  //------------------------------------------------------------------------
}
