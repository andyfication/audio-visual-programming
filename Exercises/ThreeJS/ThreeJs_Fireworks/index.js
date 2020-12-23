// Waiting for the DOM to be fully loaded
window.addEventListener('load', function () {
  console.log('DOM has fully loaded');
  init();
});

// Main function which executes as soon as the DOM is fully loaded
function init() {
  // --------------------------------Firework------------------------------
  class Firework {
    // A firework contains the shell particle
    constructor() {
      this.firework = new Particle(
        Math.random() * 6 * (Math.round(Math.random()) * 2 - 1),
        0,
        Math.random() * 20 * (Math.round(Math.random()) * 2 - 1),
        true
      );
      this.bursted = false;
      // A firework contains multiple particle
      this.particles = [];
    }
    // Check if the shell bursted and apply forces to the particles
    update() {
      if (!this.bursted) {
        this.firework.applyForce(gravity);
        this.firework.update();
        // When the shell velocity is 0, the shell bursted
        if (this.firework.velocity.y < 0) {
          this.bursted = true;
          this.firework.remove();
          this.burst();
        }
      }
      // Apply forces to the firework particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].applyForce(gravity);
        this.particles[i].update();
        // Remove the particles than are not longer needed
        if (this.particles[i].complete()) {
          this.particles.splice(i, 1);
        }
      }
    }
    // Creates 100 particles for the shell particle
    burst() {
      for (let i = 0; i < 100; i++) {
        const particle = new Particle(
          this.firework.particle.position.x,
          this.firework.particle.position.y,
          this.firework.particle.position.z,
          false
        );
        this.particles.push(particle);
      }
    }
    // Check if we still need the firework
    complete() {
      if (this.bursted && this.particles.length === 0) {
        return true;
      }
      return false;
    }
  }
  // --------------------------------------------------------------------

  // ------------------------------Particle------------------------------
  class Particle {
    // Dynamically create a particle according to the type
    constructor(x, y, z, shell) {
      this.shell = shell;
      this.position = new THREE.Vector3(x, y, z);
      // Assign velocity according to the type
      if (this.shell) {
        this.velocity = new THREE.Vector3(0, Math.random() * 0.4, 0);
      } else {
        this.velocity = new THREE.Vector3(
          Math.random() * 0.4 * (Math.round(Math.random()) * 2 - 1),
          Math.random() * 0.4 * (Math.round(Math.random()) * 2 - 1),
          Math.random() * 0.4 * (Math.round(Math.random()) * 2 - 1)
        );
        this.velocity.multiplyScalar(
          Math.random() * 0.5 * (Math.round(Math.random()) * 2 - 1)
        );
      }
      this.acceleration = new THREE.Vector3(0, 0, 0);
      this.geometry = new THREE.Geometry();
      // Assign material according to the type
      if (this.shell) {
        this.material = new THREE.PointsMaterial({
          color: 'rgb(255,255,255)',
          transparent: true,
          opacity: 1,
          size: 0.06,
        });
      } else {
        this.material = new THREE.PointsMaterial({
          color: `rgb( ${Math.floor(
            Math.random() * Math.floor(255)
          )},${Math.floor(Math.random() * Math.floor(255))},${Math.floor(
            Math.random() * Math.floor(255)
          )})`,
          transparent: true,
          opacity: 1,
          size: 0.05,
        });
      }
      // Construct and render particle on scene
      this.particle = this.show();
    }
    // Construct and render particle on scene
    show() {
      this.geometry.vertices.push(this.position);
      const particle = new THREE.Points(this.geometry, this.material);
      particle.position.x = this.position.x;
      particle.position.z = this.position.z;
      scene.add(particle);
      return particle;
    }
    // Apply force to the acceleration
    applyForce(vector) {
      this.acceleration.add(vector);
    }
    // Adding forces to the particle position
    // Fade color for non-shell particle types
    update() {
      this.velocity.add(this.acceleration);
      this.particle.position.add(this.velocity);
      if (!this.shell) {
        this.particle.material.opacity -= 0.03;
      }
    }
    // Clear the memory manually in Three.js
    remove() {
      scene.remove(this.particle);
      this.geometry.dispose();
      this.material.dispose();
      renderer.renderLists.dispose();
    }
    // Checking if we need the particle
    complete() {
      if (this.particle.material.opacity < 0) {
        this.remove();
        return true;
      }
      return false;
    }
  }
  // --------------------------------------------------------------------

  // --------------Scene, Camera, Renderer, and Canvas-------------------
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
  // Moving the camera along the y axis (upwards)
  camera.position.z = 10;
  camera.position.y = 8;
  camera.rotation.x = 0;
  // Setting the renderer, color, size, and appending to the DOM
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor('#202020');
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  //--------------------------------------------------------------------

  // ----------------------Variables Initialisation---------------------
  const movement = [1, 0, -1];
  const rotation = [-0.01, 0, 0.01];
  let moveDirection = 'neutral';
  let rotateDirection = 'neutral';

  const fireworks = [];
  const gravity = new THREE.Vector3(0, -0.0002, 0);
  //--------------------------------------------------------------------

  // --------------------------------Loop------------------------------------
  function animate() {
    // Create Fireworks with a 50% of chance every frame
    if (Math.random() < 0.5) {
      fireworks.push(new Firework());
      fireworks.push(new Firework());
    }
    // Update and track each firework
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      if (fireworks[i].complete()) {
        fireworks.splice(i, 1);
      }
    }
    // Rendering the scene and the camera
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    // Update camera position according to key pressed
    switch (moveDirection) {
      case 'neutral':
        camera.position.z += movement[1];
        break;
      case 'backwards':
        camera.position.z += movement[0];
        break;
      case 'forward':
        camera.position.z += movement[2];
        break;
    }
    // Update camera rotation according to key pressed
    switch (rotateDirection) {
      case 'neutral':
        camera.rotation.x += rotation[1];
        break;
      case 'backwards':
        camera.rotation.x += rotation[0];
        break;
      case 'forward':
        camera.rotation.x += rotation[2];
        break;
    }
  }
  // This function is called 60 frames per second
  animate();
  // ------------------------------------------------------------------------

  // -----------------------------Events-------------------------------------
  // Resize the renderer on window resize. Also adjust the camera ratio accordingly
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // W pressed then move forward
  document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyW') {
      moveDirection = 'forward';
    }
  });
  // W released then do not move
  document.addEventListener('keyup', function (event) {
    if (event.code == 'KeyW') {
      moveDirection = 'neutral';
    }
  });
  // S pressed then move backwards
  document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyS') {
      moveDirection = 'backwards';
    }
  });
  // S released then do not move
  document.addEventListener('keyup', function (event) {
    if (event.code == 'KeyS') {
      moveDirection = 'neutral';
    }
  });
  // I pressed then rotate forward
  document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyI') {
      rotateDirection = 'forward';
    }
  });
  // I released then do not rotate
  document.addEventListener('keyup', function (event) {
    if (event.code == 'KeyI') {
      rotateDirection = 'neutral';
    }
  });
  // K pressed then rotate backwards
  document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyK') {
      rotateDirection = 'backwards';
    }
  });
  // K released then do not rotate
  document.addEventListener('keyup', function (event) {
    if (event.code == 'KeyK') {
      rotateDirection = 'neutral';
    }
  });
}
