// Waiting for the DOM to be fully loaded
window.addEventListener('load', function () {
  console.log('DOM has fully loaded');
  init();
});

// Main function which executes as soon as the DOM is fully loaded
function init() {
  // --------------DOM Elements and Variables Initialisation-----------------
  const three_container = document.getElementById('three-container');
  // ------------------------------------------------------------------------

  // --------------Scene, Camera, Renderer, and Canvas-----------------------
  // Setting scene and camera
  const scene = new THREE.Scene();
  // fov, aspect ratio, near, far
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // Moving the camera along the z axis (towards the computer screen)
  camera.position.z = 4;
  // Setting the renderer, color, size, and appending to the DOM
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor('#202020');
  renderer.setSize(window.innerWidth, window.innerHeight);
  three_container.appendChild(renderer.domElement);
  // ------------------------------------------------------------------------

  // --------------------------------Cube------------------------------------
  const cubeGeometry = new THREE.BoxGeometry();
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xe6ba39 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  scene.add(cube);
  // ------------------------------------------------------------------------

  // ----------------------------Render The Scene----------------------------
  renderer.render(scene, camera);
  // ------------------------------------------------------------------------

  // -----------------------------Events-------------------------------------
  // Resize the renderer on window resize. Also adjust the camera ratio accordingly
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
  // ------------------------------------------------------------------------
}
