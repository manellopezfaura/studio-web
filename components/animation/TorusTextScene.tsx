"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPos;

  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPos;

  uniform sampler2D uTexture;
  uniform float uTime;

  void main() {
    float time = uTime * 0.5;
    vec2 repeat = -vec2(9.0, 2.6);
    vec2 uv = fract(vUv * repeat - vec2(time, 0.0));
    float shadow = clamp(vPos.z / 5.0, 0.0, 1.0);
    vec3 texture = texture2D(uTexture, uv).rgb;
    gl_FragColor = vec4(texture * shadow, 1.0);
  }
`;

interface TorusTextSceneProps {
  text?: string;
  className?: string;
}

function buildTextTexture(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;

  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.textBaseline = "middle";
  context.textAlign = "left";
  context.fillStyle = "#ffffff";
  context.font = '900 260px "Arial Black", "Helvetica Neue", sans-serif';

  const lineText = `${text} `;
  const metrics = context.measureText(lineText);
  const lineWidth = metrics.width;
  const rowHeight = 320;

  for (let row = 0; row < 3; row += 1) {
    const y = 200 + row * rowHeight;
    const offset = row % 2 === 0 ? 0 : -lineWidth * 0.5;

    for (let x = offset - lineWidth; x < canvas.width + lineWidth; x += lineWidth) {
      context.fillText(lineText, x, y);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return texture;
}

export function TorusTextScene({ text = "107 STUDIO.", className }: TorusTextSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const clock = new THREE.Clock();
    const pointer = { x: 0, y: 0 };
    const easedPointer = { x: 0, y: 0 };
    const dragRotation = { x: 0, y: 0 };
    const dragVelocity = { x: 0, y: 0 };
    const lastPointer = { x: 0, y: 0 };
    const texture = buildTextTexture(text);

    let animationFrame = 0;
    let isHovering = false;
    let isDragging = false;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    mount.style.cursor = "grab";

    camera.position.z = 64;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
      },
    });

    const mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(9, 3, 768, 3, 4, 3), material);
    scene.add(mesh);

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const render = () => {
      animationFrame = requestAnimationFrame(render);

      const elapsedTime = clock.getElapsedTime();
      easedPointer.x += (pointer.x - easedPointer.x) * 0.04;
      easedPointer.y += (pointer.y - easedPointer.y) * 0.04;
      dragVelocity.x *= 0.92;
      dragVelocity.y *= 0.92;

      if (!isDragging) {
        dragRotation.x += dragVelocity.x;
        dragRotation.y += dragVelocity.y;
      }

      const baseRotationX = 0.52;
      const baseRotationY = -0.68;
      const hoverFactor = isHovering ? 1 : 0.45;
      const autoRotationY = baseRotationY + Math.sin(elapsedTime * 0.28) * 0.22;
      const autoRotationX = baseRotationX + Math.cos(elapsedTime * 0.24) * 0.06;
      const pointerRotationX = easedPointer.y * 0.2 * hoverFactor;
      const pointerRotationY = easedPointer.x * 0.24 * hoverFactor;

      mesh.rotation.x += (autoRotationX + pointerRotationX + dragRotation.x - mesh.rotation.x) * 0.08;
      mesh.rotation.y += (autoRotationY + pointerRotationY + dragRotation.y - mesh.rotation.y) * 0.08;
      mesh.rotation.z += (Math.sin(elapsedTime * 0.18) * 0.08 - mesh.rotation.z) * 0.08;

      material.uniforms.uTime.value = elapsedTime;

      renderer.render(scene, camera);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

      if (isDragging) {
        const deltaX = event.clientX - lastPointer.x;
        const deltaY = event.clientY - lastPointer.y;

        dragRotation.y += deltaX * 0.008;
        dragRotation.x += deltaY * 0.006;
        dragVelocity.y = deltaX * 0.0008;
        dragVelocity.x = deltaY * 0.0006;
        lastPointer.x = event.clientX;
        lastPointer.y = event.clientY;
      }
    };

    const handlePointerEnter = () => {
      isHovering = true;
    };

    const handlePointerDown = (event: PointerEvent) => {
      isDragging = true;
      lastPointer.x = event.clientX;
      lastPointer.y = event.clientY;
      mount.style.cursor = "grabbing";
      mount.setPointerCapture(event.pointerId);
    };

    const handlePointerUp = (event: PointerEvent) => {
      isDragging = false;
      mount.style.cursor = "grab";
      mount.releasePointerCapture(event.pointerId);
    };

    const handlePointerLeave = () => {
      isHovering = false;
      pointer.x = 0;
      pointer.y = 0;
    };

    resize();
    render();

    window.addEventListener("resize", resize);
    mount.addEventListener("pointerenter", handlePointerEnter);
    mount.addEventListener("pointerdown", handlePointerDown);
    mount.addEventListener("pointerup", handlePointerUp);
    mount.addEventListener("pointermove", handlePointerMove);
    mount.addEventListener("pointerleave", handlePointerLeave);

    const refreshTextureOnFontReady = () => {
      const refreshedTexture = buildTextTexture(text);

      if (refreshedTexture) {
        material.uniforms.uTexture.value.dispose();
        material.uniforms.uTexture.value = refreshedTexture;
      }
    };

    void document.fonts?.ready.then(refreshTextureOnFontReady).catch(() => {});

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointerenter", handlePointerEnter);
      mount.removeEventListener("pointerdown", handlePointerDown);
      mount.removeEventListener("pointerup", handlePointerUp);
      mount.removeEventListener("pointermove", handlePointerMove);
      mount.removeEventListener("pointerleave", handlePointerLeave);

      material.uniforms.uTexture.value?.dispose?.();
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [text]);

  return <div className={className ?? "torus-scene"} ref={mountRef} />;
}
