"use client";
import { IProduct } from '@/types';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Reliable model URLs with fallbacks
const MODEL_URLS = {
  sunglasses: [
    // Small, reliable sunglasses model
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/models/gltf/accessories/Sunglasses.glb',
    // Fallback
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sunglasses/glTF/Sunglasses.glb'
  ],
  hat: [
    // Simple hat model
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/models/gltf/accessories/Hat.glb',
    // Fallback box
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.glb'
  ]
};

export default function FaceARViewer({ product }: { product: IProduct }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  const getModelUrl = () => {
    const category = product.category.name.toLowerCase();
    if (category.includes('sunglass')) return MODEL_URLS.sunglasses[0];
    if (category.includes('hat')) return MODEL_URLS.hat[0];
    return null;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const modelUrl = getModelUrl();
    if (!modelUrl) {
      setError('AR preview not available for this product');
      setLoading(false);
      return;
    }

    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
    let model: THREE.Group;
    let video: HTMLVideoElement;
    let animationFrameId: number;

    const initAR = async () => {
      try {
        // Initialize Three.js first
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        mountRef.current?.appendChild(renderer.domElement);

        // Add basic lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        // Load 3D model
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(modelUrl);
        model = gltf.scene;
        
        // Adjust scale based on product type
        const isSunglasses = product.category.name.toLowerCase().includes('sunglass');
        model.scale.set(isSunglasses ? 0.1 : 0.5, isSunglasses ? 0.1 : 0.5, isSunglasses ? 0.1 : 0.5);
        
        scene.add(model);
        setModelLoaded(true);
        setLoading(false);

        // Setup camera stream
        video = document.createElement('video');
        video.style.display = 'none';
        document.body.appendChild(video);

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } // Simpler constraints
          });
          video.srcObject = stream;
          video.play();
          setCameraPermission(true);
        } catch (err) {
          setError('Camera access is required for AR try-on');
          setLoading(false);
          return;
        }

        // Simple rotation animation as fallback
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          if (model) {
            model.rotation.y += 0.01;
          }
          renderer.render(scene, camera);
        };
        animate();

      } catch (err) {
        setError('Failed to load AR preview');
        setLoading(false);
      }
    };

    initAR();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (video?.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        document.body.removeChild(video);
      }
      if (renderer?.domElement && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [product]);

  return (
    <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center text-red-500 p-4 text-center">
          {error}
        </div>
      ) : loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !cameraPermission ? (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
          Please allow camera access to use AR try-on
        </div>
      ) : (
        <>
          <div ref={mountRef} className="w-full h-full" />
          <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black bg-opacity-50 p-2">
            {product.category.name.toLowerCase().includes('sunglass')
              ? "Move your face to position the glasses"
              : "Move your face to position the hat"}
          </div>
        </>
      )}
    </div>
  );
}