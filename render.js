// import * as THREE from './node_modules/three/build/three.js';
// import { PCDLoader } from './node_modules/three/examples/jsm/loaders/PCDLoader.js';

// const THREE = require('three'); 
// const PCDLoader = require('three/examples/jsm/loaders/PCDLoader').PCDLoader


import * as THREE from 'three';
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import { Leva, useControls } from 'leva';
let camera, scene, renderer, gui, points;

init();
render();

function init(){
  scene = new THREE.Scene();
  // camera = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.01, 40 );
  let SCREEN_WIDTH = window.innerWidth;
  let SCREEN_HEIGHT = window.innerHeight;
  let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  const frustumSize = 600;
  camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.01, 1000 );
  // camera = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 20, 100 );
  
  camera.position.set( 0, 0, 1 );
  scene.add(camera);
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.getElementById("webglviewer").appendChild(renderer.domElement);

  gui = new GUI();

  // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  // const cube = new THREE.Mesh( geometry, material );
  // scene.add( cube );
  addBox(0,0,0, 1, 2, 3, 0, 0xff0000);
  addBox(2,0,0, 1, 2, 3, 0, 0x00ff00);
  addBox(0,2,0, 1, 2, 3, 0, 0x0000ff);
  // 检查立方体是否使用默认坐标系
  let usingDefaultCoordinateSystem = true;
  console.log("usingDefaultCoordinateSystem");
  console.log(usingDefaultCoordinateSystem);
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render ); // use if there is no animation loop
  controls.minDistance = 0.5;
  controls.maxDistance = 200;
}

function animate() {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );
}

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  render();
}

function addBox(centerX, centerY, centerZ, width, height, depth, yaw, boxcolor){
  const boxGeo = new THREE.BoxGeometry(width, height, depth);
  const boxMat = new THREE.MeshBasicMaterial({
    color: boxcolor,
    wireframe: true
  });
  const box = new THREE.Mesh(boxGeo, boxMat);  
  // 设置中心位置
  box.position.set(centerX, centerY, centerZ);
  // 设置Yaw角
  box.rotation.y = yaw;
  scene.add(box);
}

function PCDViewer(pcdPath) {
  
  var loader = new PCDLoader();
  loader.load(pcdPath, 
    // called when the resource is loaded
    function ( points ) {
      // 创建点云对象
      // points.geometry.center();
      // points.geometry.rotateX( Math.PI );
      points.name = 'Zaghetto.pcd';
      scene.add( points ); 
      console.log(points.count)
      gui.add( points.material, 'size', 0.01, 0.5 ).onChange( render );
      gui.addColor( points.material, 'color' ).onChange( render );
      gui.open();
      // 检查点云是否使用了非默认坐标系
      console.log('points coor')
      render();
      
    },
    // called when loading is in progresses
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
      console.log( 'An error happened', error );
    });
};

function render() {
  renderer.clear();  
  renderer.render( scene, camera );
}

$('#select-file-button').click(function(){
  $('#select-file-input').click();
});

$('#select-file-input').change(function(event){
  let path = event.target.files[0].path;
  console.log(path);
  PCDViewer(path);
});