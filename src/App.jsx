import { Canvas, useThree, useFrame } from "@react-three/fiber";
import React, { useState, useEffect, useRef, Suspense } from "react"

import {useProgress, Environment, OrbitControls, Sparkles, PerspectiveCamera} from "@react-three/drei";

// Debug mode - set to false for production
const DEBUG_MODE = false;
const debugLog = (...args) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

// Mobile viewport height helper - handles iOS Safari address bar
const getMobileViewportHeight = () => {
  // Use the newer dynamic viewport height if available, fallback to window.innerHeight
  if (CSS.supports('height', '100dvh')) {
    return '100dvh';
  } else if (CSS.supports('height', '100svh')) {
    return '100svh';
  } else {
    // Fallback for older browsers - use window.innerHeight
    return `${window.innerHeight}px`;
  }
};

const getMobileViewportCSS = () => {
  const height = getMobileViewportHeight();
  return `position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: ${height} !important;`;
};

// Handle mobile viewport changes (orientation, browser UI)
const setupMobileViewportHandler = () => {
  if (typeof window === 'undefined') return;
  
  let resizeTimeout;
  const handleViewportChange = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Update CSS custom property for dynamic height
      document.documentElement.style.setProperty('--mobile-vh', `${window.innerHeight * 0.01}px`);
      debugLog("📱 Mobile viewport updated:", window.innerHeight, "px");
    }, 100);
  };
  
  // Set initial value
  document.documentElement.style.setProperty('--mobile-vh', `${window.innerHeight * 0.01}px`);
  
  // Listen for viewport changes
  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('orientationchange', handleViewportChange);
  
  return () => {
    window.removeEventListener('resize', handleViewportChange);
    window.removeEventListener('orientationchange', handleViewportChange);
    clearTimeout(resizeTimeout);
  };
};
import { EffectComposer, Bloom, HueSaturation, DepthOfField } from '@react-three/postprocessing';
import Lottie from 'lottie-react';

// Inline Lottie animation data to avoid file loading issues in Webflow
const darkOvalsAnimation = {
  "nm": "Main Scene",
  "ddd": 0,
  "h": 2000,
  "w": 2000,
  "meta": {"g":"@lottiefiles/creator 1.47.2"},
  "layers":[
    {"ty":4,"nm":"Ellipse 2","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[320,320],"t":0},{"s":[0,0],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[2000,0]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 2","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,0.06666666666666667,0.06666666666666667,0.06666666666666667,0.7029702970297029,0.06666666666666667,0.06666666666666667,0.06666666666666667,1,0.06666666666666667,0.06666666666666667,0.06666666666666667,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":1},
    {"ty":4,"nm":"Ellipse 4","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[320,320],"t":8},{"s":[0,0],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[1228.9775,1462.2159]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 2","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,0.06666666666666667,0.06666666666666667,0.06666666666666667,0.7029702970297029,0.06666666666666667,0.06666666666666667,0.06666666666666667,1,0.06666666666666667,0.06666666666666667,0.06666666666666667,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":2},
    {"ty":4,"nm":"Ellipse 5","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[320,320],"t":4},{"s":[0,0],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[834.4533,479.4244]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 2","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,0.06666666666666667,0.06666666666666667,0.06666666666666667,0.7029702970297029,0.06666666666666667,0.06666666666666667,0.06666666666666667,1,0.06666666666666667,0.06666666666666667,0.06666666666666667,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":3},
    {"ty":4,"nm":"Ellipse 6","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[320,320],"t":12},{"s":[0,0],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[669.8444,1615.4442]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 2","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,0.06666666666666667,0.06666666666666667,0.06666666666666667,0.7029702970297029,0.06666666666666667,0.06666666666666667,0.06666666666666667,1,0.06666666666666667,0.06666666666666667,0.06666666666666667,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":4},
    {"ty":4,"nm":"Ellipse 7","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[320,320],"t":16},{"s":[0,0],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[45.8784,0]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 2","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,0.06666666666666667,0.06666666666666667,0.06666666666666667,0.7029702970297029,0.06666666666666667,0.06666666666666667,0.06666666666666667,1,0.06666666666666667,0.06666666666666667,0.06666666666666667,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":5},
    {"ty":4,"nm":"Ellipse 8","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[320,320],"t":20},{"s":[0,0],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[496.4952,1000]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 2","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,0.06666666666666667,0.06666666666666667,0.06666666666666667,0.7029702970297029,0.06666666666666667,0.06666666666666667,0.06666666666666667,1,0.06666666666666667,0.06666666666666667,0.06666666666666667,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":6}
  ],
  "fr":30,
  "op":45,
  "ip":0,
  "assets":[],
  "v":"5.7.0"
};

// White ovals outro animation - builds up (going TO portfolio)
const whiteOvalsOutroAnimation = {
  "nm": "Main Scene",
  "ddd": 0,
  "h": 2000,
  "w": 2000,
  "meta": {"g":"@lottiefiles/creator 1.47.2"},
  "layers":[
    {"ty":4,"nm":"Ellipse 8","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[0,0],"t":0},{"s":[320,320],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[496.4952,1000]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 8","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,1,1,1,0.7029702970297029,1,1,1,1,1,1,1,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":1},
    {"ty":4,"nm":"Ellipse 7","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[0,0],"t":4},{"s":[320,320],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[45.8784,0]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 7","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,1,1,1,0.7029702970297029,1,1,1,1,1,1,1,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":2},
    {"ty":4,"nm":"Ellipse 6","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[0,0],"t":8},{"s":[320,320],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[669.8444,1615.4442]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 6","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,1,1,1,0.7029702970297029,1,1,1,1,1,1,1,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":3},
    {"ty":4,"nm":"Ellipse 5","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[0,0],"t":12},{"s":[320,320],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[834.4533,479.4244]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 5","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,1,1,1,0.7029702970297029,1,1,1,1,1,1,1,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":4},
    {"ty":4,"nm":"Ellipse 4","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[0,0],"t":16},{"s":[320,320],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[1228.9775,1462.2159]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 4","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,1,1,1,0.7029702970297029,1,1,1,1,1,1,1,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":5},
    {"ty":4,"nm":"Ellipse 2","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[0,0],"t":20},{"s":[320,320],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[2000,0]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 2","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,1,1,1,0.7029702970297029,1,1,1,1,1,1,1,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":6}
  ],
  "fr":30,
  "op":45,
  "ip":0,
  "assets":[],
  "v":"5.7.0"
};

// White ovals intro animation - shrinks down (coming FROM portfolio)
const whiteOvalsIntroAnimation = {
  "nm": "Main Scene",
  "ddd": 0,
  "h": 2000,
  "w": 2000,
  "meta": {"g":"@lottiefiles/creator 1.47.2"},
  "layers":[
    {"ty":4,"nm":"Ellipse 2","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[320,320],"t":0},{"s":[0,0],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[2000,0]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 2","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,1,1,1,0.7029702970297029,1,1,1,1,1,1,1,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":1},
    {"ty":4,"nm":"Ellipse 4","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[320,320],"t":8},{"s":[0,0],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[1228.9775,1462.2159]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 4","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,1,1,1,0.7029702970297029,1,1,1,1,1,1,1,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":2},
    {"ty":4,"nm":"Ellipse 5","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[320,320],"t":4},{"s":[0,0],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[834.4533,479.4244]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 5","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,1,1,1,0.7029702970297029,1,1,1,1,1,1,1,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":3},
    {"ty":4,"nm":"Ellipse 6","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[320,320],"t":12},{"s":[0,0],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[669.8444,1615.4442]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 6","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,1,1,1,0.7029702970297029,1,1,1,1,1,1,1,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":4},
    {"ty":4,"nm":"Ellipse 7","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[320,320],"t":16},{"s":[0,0],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[45.8784,0]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 7","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,1,1,1,0.7029702970297029,1,1,1,1,1,1,1,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":5},
    {"ty":4,"nm":"Ellipse 8","sr":1,"st":0,"op":45,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,
      "ks":{"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[320,320],"t":20},{"s":[0,0],"t":45}]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[496.4952,1000]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},
      "shapes":[{"ty":"el","bm":0,"hd":false,"nm":"Ellipse Path 8","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[776,776]}},
      {"ty":"gf","bm":0,"hd":false,"nm":"Fill","e":{"a":0,"k":[388,0]},"g":{"p":3,"k":{"a":0,"k":[0,1,1,1,0.7029702970297029,1,1,1,1,1,1,1,0,1,0.7029702970297029,1,1,0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":0,"k":[0,0]},"r":1,"o":{"a":0,"k":100}}],"ind":6}
  ],
  "fr":30,
  "op":45,
  "ip":0,
  "assets":[],
  "v":"5.7.0"
};

// React Router removed for Webflow compatibility - navigation handled via page detection

import Model from "./NeuralFractal.jsx"

import gsap from "gsap";

// ROBUST: Safe DOM query helper with fallbacks
const safeQuerySelector = (selector, fallbackAction = null) => {
  try {
    const element = document.querySelector(selector);
    if (!element && fallbackAction) {

      fallbackAction();
    }
    return element;
  } catch (error) {

    if (fallbackAction) fallbackAction();
    return null;
  }
};

// ROBUST: Safe DOM query for multiple elements
const safeQuerySelectorAll = (selector, fallbackAction = null) => {
  try {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0 && fallbackAction) {

      fallbackAction();
    }
    return elements;
  } catch (error) {

    if (fallbackAction) fallbackAction();
    return [];
  }
};

// ROBUST: Error boundary for 3D components
class ErrorBoundary3D extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {

    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {

  }

  render() {
    if (this.state.hasError) {
      // Silent fallback - just render empty group
      return <group />;
    }

    return this.props.children;
  }
}
//import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

/* Camera layers for bloom to be only on spheres */
function CameraLayerSetup() {
  const { camera } = useThree();

  useEffect(() => {
    // Enable default layer 0 and bloom layer 1
    camera.layers.enable(0);
    camera.layers.enable(1);
  }, [camera]);

  return null;
}

// Webflow-compatible navigation system
if (typeof window !== 'undefined') {
  window.goToPath = (path) => {
    debugLog("🔧 goToPath called with:", path, "current URL:", window.location.href);
    // For Webflow embedding, we need to handle navigation differently
    if (path === "/contact-us" || path === "/contact") {
      // Handle contact navigation within the same page via DOM manipulation
      const contactContainer = document.querySelector(".container.contact");
      const homeContainer = document.querySelector(".container.home");
      
      if (contactContainer && homeContainer) {
        // Don't dispatch conflicting events - let React handle state management

        window.currentPageState = 'contact';
        
        // Update URL to show /contact-us path (no hash needed)
        const currentPath = window.location.pathname;
        debugLog("🔧 goToPath: Current path:", currentPath, "Target: /contact-us");
        if (currentPath !== '/contact-us') {
          debugLog("🔧 goToPath: Updating URL to /contact-us");
          window.history.pushState(null, null, '/contact-us');
          debugLog("🔧 goToPath: URL updated, new URL:", window.location.href);
          
          // Send Google Analytics page view for Contact page
          if (typeof gtag !== 'undefined') {
            gtag('config', 'G-TK60C3SWSH', {
              page_title: 'Contact Us - Imagine This',
              page_location: window.location.href
            });
            debugLog("📊 GA: Contact page view sent");
          }
        }
        // Clear any existing hash
        if (window.location.hash) {
          debugLog("🔧 goToPath: Clearing hash:", window.location.hash);
          window.history.replaceState(null, null, '/contact-us');
          debugLog("🔧 goToPath: Hash cleared, final URL:", window.location.href);
        }
      }
    } else if (path === "/") {
      // Handle home navigation
      const contactContainer = document.querySelector(".container.contact");
      const homeContainer = document.querySelector(".container.home");
      
      if (contactContainer && homeContainer) {
        // Don't dispatch conflicting events - let React handle state management

        window.currentPageState = 'home';
        
        // Update URL to home path (remove any contact path)
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && currentPath !== '/index.html') {
          window.history.pushState(null, null, '/');
          
          // Send Google Analytics page view for Home page
          if (typeof gtag !== 'undefined') {
            gtag('config', 'G-TK60C3SWSH', {
              page_title: '3D Interactive Web Design Studio | Immersive Websites by Imagine This LLC',
              page_location: window.location.href
            });
            debugLog("📊 GA: Home page view sent");
          }
        }
      }
    } else if (path === "/portfolio") {
      // Handle portfolio navigation - this will trigger animation
      // Note: The actual navigation to portfolio.html is handled by the button click handler
      window.dispatchEvent(new CustomEvent('pageStateChange', { 
        detail: { from: window.currentPageState || 'home', to: 'portfolio' }
      }));
      window.currentPageState = 'portfolio';
    }
  };

  // Initialize page state based on current URL or Webflow page indicators
  window.getCurrentPageState = () => {
    // Try to detect current page state from URL
    const path = window.location.pathname;
    const url = window.location.href;
    
    // Only return portfolio/casestudy if we're actually on those HTML files
    if (path.endsWith('portfolio.html') || url.endsWith('portfolio.html')) return 'portfolio';
    if (path.endsWith('casestudy.html') || url.endsWith('casestudy.html')) return 'casestudy';
    if (path.includes('dopo-casestudy.html') || url.includes('dopo-casestudy.html')) return 'casestudy';
    if (path.includes('oakley-casestudy.html') || url.includes('oakley-casestudy.html')) return 'casestudy';
    
    // Check for contact state via path only
    if (path === '/contact-us' || path.includes('contact')) return 'contact';
    
    // For the main index page or any path that doesn't end with specific HTML files, assume home
    return 'home';
  };

  // Set initial page state
  window.currentPageState = window.getCurrentPageState();
}

function Scene({ shouldPlayContactIntro, shouldPlayBackContact, shouldPlayHomeToPortfolio, shouldPlayContactToPortfolio, shouldPlayPortfolioToHome, isAnimating }) {
  // In Webflow embedding context, detect page type from URL and DOM
  const getCurrentPath = () => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname;
  };

  const currentPath = getCurrentPath();
  const is404 = currentPath !== "/" && 
                currentPath !== "/index.html" && 
                !currentPath.includes('/contact') &&
                !currentPath.includes('/portfolio') &&
                !currentPath.includes('/casestudy') &&
                !currentPath.includes('/thank-you');

  /* Depth of field and blur */
  const focusRef = useRef();
  const [targetReady, setTargetReady] = useState(false);

  useEffect(() => {
    const checkFocusRef = setInterval(() => {
      if (focusRef.current) {
        setTargetReady(true);
        clearInterval(checkFocusRef);
      }
    }, 100);
    return () => clearInterval(checkFocusRef);
  }, []);

    /* Depth of field and blur ENDS*/

   useEffect(() => {
    // Targeted portfolio click interceptor - only log and intercept portfolio-related clicks
    const portfolioClickHandler = (e) => {
      // Only process clicks that might be portfolio-related
      const target = e.target;
      const href = target.href || target.getAttribute('href');
      const text = target.textContent?.trim().toLowerCase();
      
      // Quick check - only log if it might be portfolio-related
      const mightBePortfolio = (
        (href && (href.includes('portfolio') || href.includes('/portfolio'))) ||
        (text && (text.includes('portfolio') || text.includes('work') || text.includes('works'))) ||
        target.className.includes('works') ||
        target.className.includes('portfolio')
      );
      
      if (mightBePortfolio) {

        
        // Check the clicked element and its parents for portfolio links
        let currentElement = target;
        let depth = 0;
        
        while (currentElement && depth < 3) { // Check up to 3 levels up
          const elemHref = currentElement.href || currentElement.getAttribute('href');
          const elemText = currentElement.textContent?.trim().toLowerCase();
          
          // Check if this is definitely a portfolio link
          const isPortfolioLink = (
            (elemHref && (elemHref.includes('portfolio') || elemHref.includes('/portfolio'))) ||
            (elemText && elemText.includes('portfolio'))
          );
          
          if (isPortfolioLink) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Use the href or construct portfolio URL
            const originalHref = elemHref || '/portfolio';
            
            // Check if click is from mobile menu
            const mobileMenuContainer1 = document.querySelector('.menu-open-wrap-dopo');
            const mobileMenuContainer2 = document.querySelector('.menu-open-wrap');
            const isFromMobileMenu1 = mobileMenuContainer1 && mobileMenuContainer1.classList.contains('menu-open');
            const isFromMobileMenu2 = mobileMenuContainer2 && mobileMenuContainer2.classList.contains('menu-open');
            const isFromMobileMenu = isFromMobileMenu1 || isFromMobileMenu2;
            const activeMobileMenu = isFromMobileMenu1 ? mobileMenuContainer1 : mobileMenuContainer2;
            

            
            const startAnimation = () => {

                
                // Step 1: Trigger 3D model animation
                const animEvent = new CustomEvent('directPortfolioAnimation');
                window.dispatchEvent(animEvent);
                
                // Step 2: Start oval animation slightly later
                setTimeout(() => {
                    if (window.playOvalExpandAnimation) {
                        window.playOvalExpandAnimation(() => {
                            // Navigate after oval animation completes
                            const fullUrl = originalHref.startsWith('http') ? originalHref : `${window.location.origin}${originalHref}`;
                            window.location.href = fullUrl;
                        });
                    } else {
                        setTimeout(() => {
                            const fullUrl = originalHref.startsWith('http') ? originalHref : `${window.location.origin}${originalHref}`;
                            window.location.href = fullUrl;
                        }, 800);
                    }
                }, 1300); // Start ovals even later
            };
            
            if (isFromMobileMenu) {
                if (activeMobileMenu) {
                    activeMobileMenu.classList.remove('menu-open');
                }
                setTimeout(startAnimation, 300);
            } else {
                startAnimation();
            }
            
            return false;
          }
          
          currentElement = currentElement.parentElement;
          depth++;
        }
      }
    };
    
    // Add targeted portfolio click listener
    document.addEventListener('click', portfolioClickHandler, true);


    // ROBUST: Initialize oval containers for navigation animations
    const initializeNavigationOvals = () => {
      // Initialize white ovals for navigation (home to portfolio)
      const introAnimContainer = document.querySelector(".intro-anim-home");
      if (introAnimContainer) {
        // DON'T add finished class - it sets opacity: 0 via CSS
        // Instead, just hide it with display: none
        introAnimContainer.style.display = "none";
        
        // Initialize intro ovals (for home to portfolio animation)
        const introOvals = document.querySelectorAll(".intro-anim-home .oval-white-home");
        gsap.set(introOvals, { 
          scale: 0,
          opacity: 0,
          transformOrigin: "center center"
        });
      }
      
      // Ensure white outro container is ready but hidden
      const whiteOutroContainer = document.querySelector(".outro-anim-home");
      if (whiteOutroContainer) {
        // CRITICAL: Remove finished class that would set opacity: 0
        whiteOutroContainer.classList.remove('finished');
        whiteOutroContainer.style.display = 'none'; // Hidden by default
        
        const whiteOvals = whiteOutroContainer.querySelectorAll(".oval-white-home-outro");
        gsap.set(whiteOvals, {
          scale: 1, // Keep at scale 1 (visible size) - will animate to 0 during navigation
          opacity: 1, // Keep at opacity 1 (visible) - will animate to 0 during navigation
          transformOrigin: "center center"
        });
      }
    };
    
    // Initialize with delay to ensure Webflow is ready
    setTimeout(initializeNavigationOvals, 100);

    /**
     * ROBUST: Oval expand animation for Home/Contact to Portfolio navigation
     * 
     * This creates a smooth transition when navigating TO portfolio pages.
     * The sequence is:
     * 1. 3D model animation plays first
     * 2. After delay, this oval animation starts
     * 3. Ovals expand from center outward to cover screen
     * 4. Navigation to portfolio.html happens after animation completes
     */
    // OLD: Oval expand animation - DISABLED: Replaced with Lottie system
    window.playOvalExpandAnimation = (onComplete) => {

      onComplete && onComplete();
      return;
      const introAnimContainer = document.querySelector(".intro-anim-home");
      const introOvals = introAnimContainer?.querySelectorAll(".oval-white-home");
      
      if (!introAnimContainer || !introOvals || introOvals.length === 0) {

        onComplete && onComplete();
        return;
      }
      

      
      // Make container visible
      // Don't use finished class - just control display directly
      introAnimContainer.style.display = 'block';
      introAnimContainer.style.visibility = 'visible';
      introAnimContainer.style.opacity = '1';
      introAnimContainer.style.pointerEvents = 'none';
      
      // Animate ovals expanding from center outward
      const timeline = gsap.timeline();
      
      // Opacity animates first
      timeline.to(introOvals, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        stagger: {
          amount: 0.15,
          from: "center"
        }
      }, 0);
      
      // Scale animates slightly after
      timeline.to(introOvals, {
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: {
          amount: 0.2,
          from: "center"
        }
      }, 0.1);
      
      // Complete animation
      timeline.eventCallback("onComplete", () => {

        
        // Set white background to prevent flicker during navigation
        document.body.style.backgroundColor = '#ffffff';
        
        onComplete && onComplete();
      });
    };

    // Delay setup to ensure DOM is ready and Webflow has initialized
    const setupEventListeners = () => {
      /* ===== BUTTON HOVER EFFECTS START ===== */

      /* ----- Contact Button ----- */
      const contactText = new SplitType(".contactus-text", {
          types: "words, chars",
          tagName: "span",
      });

    const contactAnim = gsap.to(contactText.chars, {
        paused: true,
        yPercent: -100,
        stagger: 0.03,
    });

    const handleContactEnter = () => contactAnim.play();
    const handleContactLeave = () => contactAnim.reverse();

    /* ----- Works Button ----- */
    const worksText = new SplitType(".works-text", {
        types: "words, chars",
        tagName: "span",
    });

    const worksAnim = gsap.to(worksText.chars, {
        paused: true,
        yPercent: -100,
        stagger: 0.03,
    });

    const handleWorksEnter = () => worksAnim.play();
    const handleWorksLeave = () => worksAnim.reverse();

    /* ----- Submit Button ----- */
    const submitText = new SplitType(".submit-text", {
        types: "words, chars",
        tagName: "span",
    });
  
    const submitAnim = gsap.to(submitText.chars, {
        paused: true,
        yPercent: -100,
        stagger: 0.03,
    });
  
    const handleSubmitEnter = () => submitAnim.play();
    const handleSubmitLeave = () => submitAnim.reverse();

    /* ----- Home Button ----- */
    const homeText = new SplitType(".home-text", {
        types: "words, chars",
        tagName: "span",
    });

    const homeAnim = gsap.to(homeText.chars, {
        paused: true,
        yPercent: -100,
        stagger: 0.03,
    });

    const handleHomeEnter = () => homeAnim.play();
    const handleHomeLeave = () => homeAnim.reverse();

    /* ===== ROUTING FUNCTIONS ===== */
    const handleContactClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent clicking during animations to avoid conflicts
        if (isAnimating.current) {
            debugLog("🚫 Menu click blocked - animation in progress");
            return;
        }
        
        // Close mobile menu if clicking from mobile menu
        const mobileMenuContainer = document.querySelector('.menu-open-wrap-dopo');
        if (mobileMenuContainer && mobileMenuContainer.classList.contains('menu-open')) {
            mobileMenuContainer.classList.remove('menu-open');
        }
        
        // Check current page state and trigger proper state change
        const currentPage = window.getCurrentPageState();
        debugLog("🔧 handleContactClick: Current page state:", currentPage);
        
        // Always dispatch the page state change event for proper tracking
        const event = new CustomEvent('pageStateChange', {
            detail: { from: currentPage, to: 'contact' }
        });
        debugLog("🔧 handleContactClick: Dispatching pageStateChange event:", event.detail);
        window.dispatchEvent(event);
        
        debugLog("🔧 handleContactClick: About to call goToPath('/contact-us')");
        window.goToPath("/contact-us");
        debugLog("🔧 handleContactClick: goToPath called, current URL:", window.location.href);
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent clicking during animations to avoid conflicts
        if (isAnimating.current) {
            debugLog("🚫 Menu click blocked - animation in progress");
            return;
        }
        
        // Close mobile menu if clicking from mobile menu
        const mobileMenuContainer = document.querySelector('.menu-open-wrap-dopo');
        if (mobileMenuContainer && mobileMenuContainer.classList.contains('menu-open')) {
            mobileMenuContainer.classList.remove('menu-open');
        }
        
        // Check if we're currently on contact by checking DOM state directly
        const contactContainer = document.querySelector('.container.contact');
        const isOnContact = contactContainer && contactContainer.style.display !== 'none' && 
                           (contactContainer.style.display === 'flex' || contactContainer.style.visibility === 'visible');
        




        
        if (isOnContact) {

            // Dispatch custom event to ensure proper state tracking
            const event = new CustomEvent('pageStateChange', {
                detail: { from: 'contact', to: 'home' }
            });

            window.dispatchEvent(event);
        } else {

        }
        
        // Always navigate to root path, not index.html
        window.goToPath("/");
    };

    const handleContactPortfolioClick = (e) => {
        // Store the original href before preventing default
        const originalHref = e.currentTarget.href;
        
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent clicking during animations to avoid conflicts
        if (isAnimating.current) {
            debugLog("🚫 Contact to Portfolio click blocked - animation in progress");
            return;
        }
        
        // Check if clicking from mobile menu
        const isFromMobileMenu = e.currentTarget.closest('.menu-open-wrap-dopo') !== null;
        const activeMobileMenu = document.querySelector('.menu-open-wrap-dopo.menu-open');
        
        const startAnimation = () => {
            // Trigger contact to portfolio animation

            const animEvent = new CustomEvent('directContactPortfolioAnimation');
            window.dispatchEvent(animEvent);

            
            // Start oval animation with same timing as home to portfolio
            setTimeout(() => {
                if (window.playOvalExpandAnimation) {
                    window.playOvalExpandAnimation(() => {
                        // Navigate after oval animation completes
                        const fullUrl = originalHref.startsWith('http') ? originalHref : `${window.location.origin}${originalHref}`;
                        window.location.href = fullUrl;
                    });
                } else {
                    // Fallback navigation without oval animation

                    document.body.style.backgroundColor = '#ffffff';
                    const fullUrl = originalHref.startsWith('http') ? originalHref : `${window.location.origin}${originalHref}`;
                    window.location.href = fullUrl;
                }
            }, 1300); // Same timing as home to portfolio
        };
        
        if (isFromMobileMenu) {
            if (activeMobileMenu) {
                activeMobileMenu.classList.remove('menu-open');
            }
            
            // Wait for menu close animation to complete before starting portfolio animation
            setTimeout(startAnimation, 300); // Give menu time to close
        } else {
            // Not from mobile menu, start animation immediately
            startAnimation();
        }
    };

    const handleWorksClick = (e) => {
        // Store the original href before preventing default
        const originalHref = e.currentTarget.href;
        
        // Prevent default navigation temporarily
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent clicking during animations to avoid conflicts
        if (isAnimating.current) {
            debugLog("🚫 Works/Portfolio click blocked - animation in progress");
            return;
        }
        
        // ROBUST: Check current page state using React state (more reliable than DOM)
        const isOnContactPage = currentPageState === 'contact';
        


        
        // Use appropriate handler based on current page
        if (isOnContactPage) {

            handleContactPortfolioClick(e);
        } else {

            // Original home to portfolio logic
            // Check if we're clicking from mobile menu (check both possible menu containers)
            const mobileMenuContainer1 = document.querySelector('.menu-open-wrap-dopo');
            const mobileMenuContainer2 = document.querySelector('.menu-open-wrap');
            const isFromMobileMenu1 = mobileMenuContainer1 && mobileMenuContainer1.classList.contains('menu-open');
            const isFromMobileMenu2 = mobileMenuContainer2 && mobileMenuContainer2.classList.contains('menu-open');
            const isFromMobileMenu = isFromMobileMenu1 || isFromMobileMenu2;
            const activeMobileMenu = isFromMobileMenu1 ? mobileMenuContainer1 : mobileMenuContainer2;
            

            
                    const startAnimation = () => {
            // Trigger animation
            const animEvent = new CustomEvent('directPortfolioAnimation');
            window.dispatchEvent(animEvent);
            
            // Start oval animation slightly later
            setTimeout(() => {
                if (window.playOvalExpandAnimation) {
                    window.playOvalExpandAnimation(() => {
                        // Navigate after oval animation completes
                        window.location.href = originalHref;
                    });
                } else {
                    // Fallback navigation without oval animation

                    document.body.style.backgroundColor = '#ffffff';
                    window.location.href = originalHref;
                }
            }, 1300);
        };
            
            if (isFromMobileMenu) {
                if (activeMobileMenu) {
                    activeMobileMenu.classList.remove('menu-open');
                }
                
                // Wait for menu close animation to complete before starting portfolio animation
                setTimeout(startAnimation, 300); // Give menu time to close
            } else {
                // Not from mobile menu, start animation immediately
                startAnimation();
            }
        }
    };



    /* ===== EVENT LISTENERS ===== */
    const contactBtn = document.querySelector(".contactus-btn");
    const worksBtn = document.querySelector(".works-btn");
    const submitBtn = document.querySelector(".submit-button");
    const homeBtn = document.querySelector(".home-btn");
    const logoBtn = document.querySelector(".logo-btn");  // Add logo button selector
    
    // Mobile menu buttons (inside .menu-open-wrap-dopo)
    const mobileContactBtn = document.querySelector(".menu-open-wrap-dopo .one-menu-item[data-path='/contact-us'], .menu-open-wrap-dopo .one-menu-item[data-path='/contact']");
    const mobileHomeBtn = document.querySelector(".menu-open-wrap-dopo .one-menu-item[data-path='/']");
    
    // Try alternative selectors for mobile home button
    const mobileHomeBtnAlt1 = document.querySelector(".menu-open-wrap-dopo a[href='index.html']");
    const mobileHomeBtnAlt2 = document.querySelector(".menu-open-wrap-dopo a[href='/']");
    const mobileHomeBtnAlt3 = document.querySelector(".menu-open-wrap-dopo .one-menu-item");
    
    // Use the first found mobile home button
    const finalMobileHomeBtn = mobileHomeBtn || mobileHomeBtnAlt1 || mobileHomeBtnAlt2;

    // Footer buttons (for case study pages)
    const footerContactBtn = document.querySelector(".footer-contain .contactus-btn[data-path='/contact-us'], .footer-contain .contactus-btn[data-path='/contact']");
    const footerHomeBtn = document.querySelector(".footer-contain .home-btn[data-path='/']");
    const footerLogoBtn = document.querySelector(".footer-contain .logo-btn[data-path='/']");
    
    // Try alternative selectors for footer home button
    const footerHomeBtnAlt1 = document.querySelector(".footer-contain .home-btn");
    const footerHomeBtnAlt2 = document.querySelector(".footer-contain a[href='index.html']");
    const footerHomeBtnAlt3 = document.querySelector(".footer-contain .logo-btn");
    
    // Use the first found footer home button
    const finalFooterHomeBtn = footerHomeBtn || footerHomeBtnAlt1 || footerHomeBtnAlt2 || footerLogoBtn;



    // Contact button listeners
    if (contactBtn) {
        contactBtn.addEventListener("mouseenter", handleContactEnter);
        contactBtn.addEventListener("mouseleave", handleContactLeave);
        contactBtn.addEventListener("click", handleContactClick, true);
    }

    // Works button listeners
    if (worksBtn) {
        worksBtn.addEventListener("mouseenter", handleWorksEnter);
        worksBtn.addEventListener("mouseleave", handleWorksLeave);
        worksBtn.addEventListener("click", handleWorksClick, true);
    }

    // Submit button listeners
    if (submitBtn) {
        submitBtn.addEventListener("mouseenter", handleSubmitEnter);
        submitBtn.addEventListener("mouseleave", handleSubmitLeave);
    }

    // Home button listener
    if (homeBtn) {
        homeBtn.addEventListener("mouseenter", handleHomeEnter);
        homeBtn.addEventListener("mouseleave", handleHomeLeave);
        homeBtn.addEventListener("click", handleHomeClick, true);
    }

    // Logo button listener - same functionality as home button
    if (logoBtn) {
        logoBtn.addEventListener("click", handleHomeClick);
    }

    // Mobile menu button listeners
    if (mobileContactBtn) {
        mobileContactBtn.addEventListener("click", handleContactClick, true);
    }

    if (finalMobileHomeBtn) {
        finalMobileHomeBtn.addEventListener("click", handleHomeClick, true);
    }

    // Footer button listeners
    if (footerContactBtn) {
        footerContactBtn.addEventListener("click", handleContactClick, true);
    }

    if (finalFooterHomeBtn) {
        finalFooterHomeBtn.addEventListener("click", handleHomeClick, true);
    }

    // 🧼 CLEANUP:
    return () => {
        if (contactBtn) {
            contactBtn.removeEventListener("mouseenter", handleContactEnter);
            contactBtn.removeEventListener("mouseleave", handleContactLeave);
            contactBtn.removeEventListener("click", handleContactClick);
        }
        if (worksBtn) {
            worksBtn.removeEventListener("mouseenter", handleWorksEnter);
            worksBtn.removeEventListener("mouseleave", handleWorksLeave);
            worksBtn.removeEventListener("click", handleWorksClick);
        }
        if (submitBtn) {
            submitBtn.removeEventListener("mouseenter", handleSubmitEnter);
            submitBtn.removeEventListener("mouseleave", handleSubmitLeave);
        }
        if (homeBtn) {
            homeBtn.removeEventListener("mouseenter", handleHomeEnter);
            homeBtn.removeEventListener("mouseleave", handleHomeLeave);
            homeBtn.removeEventListener("click", handleHomeClick);
        }
        if (logoBtn) {
            logoBtn.removeEventListener("click", handleHomeClick);
        }
        if (mobileContactBtn) {
            mobileContactBtn.removeEventListener("click", handleContactClick);
        }
        if (finalMobileHomeBtn) {
            finalMobileHomeBtn.removeEventListener("click", handleHomeClick);
        }
        if (footerContactBtn) {
            footerContactBtn.removeEventListener("click", handleContactClick);
        }
        if (finalFooterHomeBtn) {
            finalFooterHomeBtn.removeEventListener("click", handleHomeClick);
        }
    };
    /* ===== BUTTON HOVER EFFECTS END ===== */
    };

    // Setup with delay to ensure Webflow has initialized
    setTimeout(setupEventListeners, 500); // Increased delay for Webflow loading
    
    return () => {
        document.removeEventListener('click', portfolioClickHandler, true);
    };
}, []);

  return (
    <>
      <Canvas 
        shadows
        onCreated={({ gl }) => {
          // Handle WebGL context loss
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.warn('WebGL context lost. Attempting to restore...');
          });
          
          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context restored successfully');
          });
        }}
      >
        <Environment files='https://imaginethiscode.netlify.app/hospital_room_2_1k.hdr' environmentIntensity={0.005}/>
        <CameraLayerSetup />
        <Suspense fallback={null}>
          <group>
            {!is404 ? (
              <ErrorBoundary3D>
                <Model 
                  focusRef={focusRef} 
                  shouldPlayContactIntro={shouldPlayContactIntro}
                  shouldPlayBackContact={shouldPlayBackContact}
                  shouldPlayHomeToPortfolio={shouldPlayHomeToPortfolio}
                  shouldPlayContactToPortfolio={shouldPlayContactToPortfolio}
                  shouldPlayPortfolioToHome={shouldPlayPortfolioToHome}
                />
              </ErrorBoundary3D>
            ) : (
              <group name="Empty_-_Camera" position={[-0.008, 0.823, -0.033]} scale={0.14}>
                <PerspectiveCamera
                  name="Camera"
                  makeDefault={true}
                  far={100}
                  near={0.1}
                  fov={22.895}
                  position={[-0.217, 5.606, 12.792]}
                  rotation={[-0.442, 0.068, 0.032]}
                  scale={7.146}
                />
              </group>
            )}
            <Sparkles
              count={30}
              color="#34ebe8"
              scale={[1.15, 1.15, 1.15]}
              position={[0, 1, 0]}
              speed={0.1}
              baseNoise={40}
            />
            <Sparkles
              count={30}
              color="#365f9c"
              scale={[1.15, 1.15, 1.15]}
              position={[0, 1, 0]}
              speed={0.1}
              baseNoise={40}
            />
            <Sparkles
              count={30}
              color="#f7f389"
              scale={[1.15, 1.15, 1.15]}
              position={[0, 1, 0]}
              speed={0.1}
              baseNoise={40}
            />
            <Sparkles
              count={30}
              color="#ffffff"
              scale={[1.15, 1.15, 1.15]}
              position={[0, 1, 0]}
              speed={0.1}
              baseNoise={40}
            />
          </group>
        </Suspense>
        <EffectComposer multisampling={4}>
          <Bloom
            mipmapBlur
            intensity={0.8}              // Adjust to your taste
            luminanceThreshold={1.0}     // Only bloom > 1.0 colors
            luminanceSmoothing={0.0}
            radius={0.1}
          />
          <HueSaturation saturation={0.45} />
          {!is404 && (
            <DepthOfField
              focalLength={1.6}    // Try larger, e.g. 0.5, 1.0
              bokehScale={50}      // Increase for bigger blur shapes
              focusDistance={0.5}  // You can experiment with this (distance from camera)
              target={focusRef.current}
              layers={[0, 1]}  
            />
          )}
        </EffectComposer>
      </Canvas>
    </>

  );
}

function PageContent() {
  // ROBUST: Global error handler to ensure website always works
  useEffect(() => {
    const handleGlobalError = (error) => {

      // Ensure website remains functional
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
      
      // Hide any stuck preloader
      const preloader = safeQuerySelector('.pre-loader');
      if (preloader) {
        preloader.style.display = 'none';
      }
    };

    const handleUnhandledRejection = (event) => {

      // Don't let promise rejections break the website
      event.preventDefault();
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // SIMPLIFIED: Track 3D model loading progress
  const { progress } = useProgress();
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // SIMPLIFIED: Single state for preloader status
  const [preloaderState, setPreloaderState] = useState(() => {
    if (typeof window === 'undefined') return 'hidden';
    
    // ROBUST: Use multiple methods to detect actual reload vs navigation
    const navigationType = performance.getEntriesByType('navigation')[0]?.type;
    const isHardReload = navigationType === 'reload';
    
    // Additional detection methods for more reliability
    const hasReferrer = !!document.referrer;
    const isDirectAccess = !hasReferrer || document.referrer === window.location.href;
    
    // ENHANCED: Consider it a "fresh load" if any of these conditions are met
    const isFreshLoad = isHardReload || isDirectAccess;
    






          debugLog("  - isFreshLoad:", isFreshLoad);
    
    // Check if coming from portfolio pages (more comprehensive check)
    const referrer = document.referrer;
    const currentUrl = window.location.href;
    
    // CRITICAL: Fresh load should NEVER be considered "from portfolio"
    // Even if referrer shows portfolio, a fresh load means user accessed directly
    const isFromPortfolio = !isFreshLoad && referrer && (
      referrer.includes('portfolio') || 
      referrer.includes('casestudy') ||
      referrer.includes('oakley') ||
      referrer.includes('dopo')
    );
    
    // Check if we're on the home page (not portfolio)
    const isOnHomePage = currentUrl.includes('index.html') || 
                        currentUrl.endsWith('/') || 
                        (!currentUrl.includes('portfolio') && !currentUrl.includes('casestudy'));
    
    // BULLETPROOF RULE: Show preloader ONLY on:
    // 1. Hard reload (F5, Ctrl+R, browser refresh)
    // 2. AND we're on the home page
    // 3. AND we're NOT coming from portfolio pages
    // Note: Reset session storage on hard reload to ensure fresh state
    let hasPreloaderShown = sessionStorage.getItem('preloaderShown') === 'true';
    
    // CRITICAL: Reset preloader session on fresh load (unless from portfolio)
    debugLog("🔍 DEBUG: Fresh load check - isFreshLoad:", isFreshLoad, "isFromPortfolio:", isFromPortfolio);
    debugLog("🔍 DEBUG: hasPreloaderShown before reset:", hasPreloaderShown);
    
    if (isFreshLoad && !isFromPortfolio) {
      sessionStorage.removeItem('preloaderShown');
      hasPreloaderShown = false;
      debugLog("🔄 Fresh load detected - reset preloader session");
      debugLog("🔍 DEBUG: hasPreloaderShown after reset:", hasPreloaderShown);
    } else {
      debugLog("🔍 DEBUG: No session reset - conditions not met");
    }
    
    // Check if we should skip preloader (e.g., coming from 404 page)
    const skipPreloader = sessionStorage.getItem('skipPreloader') === 'true';
    if (skipPreloader) {
      sessionStorage.removeItem('skipPreloader'); // Clear the flag
    }
    
    // Match the Webflow script logic exactly (enhanced with better detection)
    const shouldHidePreloader = isFromPortfolio && isOnHomePage && !isFreshLoad;
    const shouldShowPreloader = isFreshLoad && isOnHomePage && !isFromPortfolio && !hasPreloaderShown && !skipPreloader;
    
    debugLog("🔍 PRELOADER DECISION:", {
      shouldShowPreloader,
      shouldHidePreloader,
      isFreshLoad,
      isHardReload,
      isOnHomePage,
      isFromPortfolio,
      hasPreloaderShown
    });
    
    // Simple approach: Trust the Webflow script for hiding, we only handle showing
    debugLog("🎯 WEBFLOW SCRIPT HANDLES HIDING - React handles showing and animations");
    
    debugLog("🎯 PRELOADER INIT:", {
      navigationType,
      isHardReload,
      isFromPortfolio,
      isOnHomePage,
      hasPreloaderShown,
      shouldShowPreloader,
      referrer,
      currentUrl
    });
    
    // If Webflow script already hid preloader, start hidden
    // Otherwise, show preloader for hard reloads on home page
    return shouldShowPreloader ? 'visible' : 'hidden';
  });
  
  // Track preloader timing
  const [preloaderStartTime] = useState(Date.now());

  // REMOVED: useEffect was interfering - finishPreloader handles everything


  
  // ROBUST: Single source of truth for page state
  const [currentPageState, setCurrentPageState] = useState(() => {
    if (typeof window === 'undefined') return 'home';
    
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    debugLog("🔍 Initial page detection - path:", path, "hash:", hash);
    
    // Portfolio/casestudy pages
    if (path.includes('portfolio') || path.includes('casestudy')) {
      return path.includes('portfolio') ? 'portfolio' : 'casestudy';
    }
    
    // Contact via hash or path
    if (hash === '#contact' || path === '/contact-us') {
      debugLog("🎯 DETECTED CONTACT PAGE from", hash === '#contact' ? 'hash' : 'path');
      return 'contact';
    }
    
    // Default to home
    debugLog("🎯 DEFAULTING TO HOME PAGE");
    return 'home';
  });

  // DEBUG: Monitor page state changes
  useEffect(() => {
    debugLog("🎯 PAGE STATE CHANGED TO:", currentPageState);
  }, [currentPageState]);
  
  // ROBUST: Animation state management
  const prevPageState = useRef('home');
  const [shouldPlayContactIntro, setShouldPlayContactIntro] = useState(false);
  const [shouldPlayBackContact, setShouldPlayBackContact] = useState(false);
  const [shouldPlayHomeToPortfolio, setShouldPlayHomeToPortfolio] = useState(false);
  const [shouldPlayContactToPortfolio, setShouldPlayContactToPortfolio] = useState(false);
  const [shouldPlayPortfolioToHome, setShouldPlayPortfolioToHome] = useState(false);
  const isAnimating = useRef(false);
  const hasInitialized = useRef(false);
  const contactAnimationTriggered = useRef(false);
  const lastContactTriggerTime = useRef(0);
  const whiteIntroBlocked = useRef(false);
  
  // SIMPLIFIED: Monitor 3D model loading progress
  useEffect(() => {
    debugLog("🔍 3D Model loading progress:", progress, "%");
    
    if (progress === 100 && !modelLoaded) {
      debugLog("🎯 3D Model fully loaded!");
      debugLog("🔍 DEBUG: About to set modelLoaded=true, current preloaderState:", preloaderState);
      setModelLoaded(true);
    }
  }, [progress, modelLoaded]);

  // Setup mobile viewport handler
  useEffect(() => {
    const cleanup = setupMobileViewportHandler();
    return cleanup;
  }, []);

  // Block white intro animations after user has been on page for a while
  useEffect(() => {
    const timer = setTimeout(() => {
      whiteIntroBlocked.current = true;
      debugLog("🚫 White intro animations blocked - user settled on page");
    }, 3000); // Block after 3 seconds

    return () => {
      clearTimeout(timer);
      whiteIntroBlocked.current = false;
    };
  }, [currentPageState]); // Reset timer when page changes

  // Additional mobile white flash prevention
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // More aggressive white flash prevention on mobile
      const mobileTimer = setTimeout(() => {
        whiteIntroBlocked.current = true;
        debugLog("📱 Mobile white intro animations blocked - preventing mobile flashes");
      }, 800); // Block after 0.8 seconds on mobile (more aggressive)

      return () => clearTimeout(mobileTimer);
    }
  }, [currentPageState]);

  // Extra aggressive mobile white flash prevention on page load
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // Immediately block white flashes on mobile after any navigation
      const immediateTimer = setTimeout(() => {
        whiteIntroBlocked.current = true;
        debugLog("📱 Immediate mobile white flash block activated");
      }, 500); // Very quick block

      return () => clearTimeout(immediateTimer);
    }
  }, []);

  // ROBUST FALLBACK SYSTEM: Multiple safety nets to ensure website always loads
  useEffect(() => {
    // Set up fallbacks if preloader exists (regardless of React state)
    const preloaderExists = safeQuerySelector('.pre-loader');
    const hasPreloaderBeenShown = sessionStorage.getItem('preloaderShown') === 'true';
    
    if (!preloaderExists || hasPreloaderBeenShown) {
      debugLog("🛡️ SKIPPING fallback system - no preloader or already shown");
      return;
    }
    
    debugLog("🛡️ Setting up preloader fallback system (preloaderState:", preloaderState, ")");
    
    // LEVEL 1: Quick fallback - if model doesn't load in 2s, assume it's loaded
    const quickFallback = setTimeout(() => {
      if (!modelLoaded) {
        debugLog("🎯 LEVEL 1 FALLBACK: Model loading timeout (2s) - assuming loaded");
        setModelLoaded(true);
      }
    }, 2000);
    
    // LEVEL 2: Medium fallback - force preloader finish after 5s regardless
    const mediumFallback = setTimeout(() => {
      debugLog("🚨 LEVEL 2 FALLBACK: Force preloader finish (5s) - ensuring website accessibility");
      try {
        finishPreloader();
      } catch (error) {
        console.error("❌ Preloader finish failed, using nuclear option:", error);
        // Nuclear option: just hide preloader completely
        const preloader = safeQuerySelector('.pre-loader');
        if (preloader) {
          preloader.style.display = 'none';
          setPreloaderState('finished');
        }
      }
    }, 5000);
    
    // LEVEL 3: Ultimate fallback - nuclear option after 10s
    const ultimateFallback = setTimeout(() => {
      debugLog("💥 LEVEL 3 FALLBACK: Nuclear option (10s) - customer must see website!");
      
      // Hide preloader by any means necessary
      const preloader = safeQuerySelector('.pre-loader');
      if (preloader) {
        preloader.remove(); // Just remove it completely
      }
      
      // Ensure body is visible
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
      
      // Force state update
      setPreloaderState('finished');
      setModelLoaded(true);
      
      debugLog("💥 NUCLEAR OPTION COMPLETE - Website should be accessible now");
    }, 10000);
    
    // Cleanup all timers
    return () => {
      clearTimeout(quickFallback);
      clearTimeout(mediumFallback);  
      clearTimeout(ultimateFallback);
    };
  }, [preloaderState, modelLoaded]);

  // DEBUG: Monitor 3D animation state changes
  useEffect(() => {
    debugLog("🎬 3D Animation State Changed - shouldPlayPortfolioToHome:", shouldPlayPortfolioToHome);
  }, [shouldPlayPortfolioToHome]);

  useEffect(() => {
    debugLog("🎬 3D Animation State Changed - shouldPlayContactToPortfolio:", shouldPlayContactToPortfolio);
  }, [shouldPlayContactToPortfolio]);

  useEffect(() => {
    debugLog("🎬 3D Animation State Changed - shouldPlayHomeToPortfolio:", shouldPlayHomeToPortfolio);
  }, [shouldPlayHomeToPortfolio]);

  // ROBUST: Handle preloader completion when model loads
  useEffect(() => {
    debugLog("🔍 DEBUG: Preloader completion useEffect triggered - preloaderState:", preloaderState, "modelLoaded:", modelLoaded);
    
    // FIX: Also trigger if preloader is hidden but model loads (handles race condition)
    // BUT only if we haven't already shown the preloader (avoid navigation triggers)
    const hasPreloaderBeenShown = sessionStorage.getItem('preloaderShown') === 'true';
    const preloaderDOMExists = safeQuerySelector('.pre-loader');
    
    // EMERGENCY FALLBACK: If there's any JavaScript error or preloader gets stuck, force complete
    const emergencyFallback = () => {
      const preloader = safeQuerySelector('.pre-loader');
      if (preloader) {
        preloader.style.transition = 'opacity 0.3s ease';
        preloader.style.opacity = '0';
        setTimeout(() => {
          if (preloader && preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
          }
        }, 300);
      }
      setPreloaderState('finished');
      sessionStorage.setItem('preloaderShown', 'true');
    };
    
    // Set up emergency timeout - always force complete after 4 seconds
    const emergencyTimeout = setTimeout(() => {
      if (preloaderDOMExists && preloaderState !== 'finished') {
        debugLog("🚨 EMERGENCY: Preloader stuck - forcing immediate completion");
        emergencyFallback();
      }
    }, 4000);
    
    const shouldTriggerCompletion = modelLoaded && (
      // Normal case: preloader is visible and hasn't been shown
      (preloaderState === 'visible' && !hasPreloaderBeenShown) ||
      // Race condition case: preloader DOM exists but state is hidden, and hasn't been shown
      (preloaderState === 'hidden' && preloaderDOMExists && !hasPreloaderBeenShown)
    );
    
    debugLog("🔍 DEBUG: Preloader completion check:");
    debugLog("  - modelLoaded:", modelLoaded);
    debugLog("  - preloaderState:", preloaderState);
    debugLog("  - hasPreloaderBeenShown:", hasPreloaderBeenShown);
    debugLog("  - preloaderDOMExists:", !!preloaderDOMExists);
    debugLog("  - shouldTriggerCompletion:", shouldTriggerCompletion);
    
    // EMERGENCY: Only trigger if preloader is still in a state that needs completion
    // Don't trigger emergency if preloader is already finished or being processed
    const needsEmergencyFallback = modelLoaded && 
                                  !shouldTriggerCompletion && 
                                  preloaderDOMExists && 
                                  preloaderState !== 'finished' &&
                                  !hasPreloaderBeenShown;
    
    if (needsEmergencyFallback) {
      debugLog("🚨 EMERGENCY: Model loaded but completion not triggering - forcing in 1s");
      setTimeout(() => {
        debugLog("🚨 EMERGENCY FALLBACK: Forcing preloader completion");
        // Force preloader completion without relying on finishPreloader function
        const preloader = safeQuerySelector('.pre-loader');
        if (preloader) {
          preloader.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          preloader.style.opacity = '0';
          preloader.style.transform = 'translateY(-100%)';
          setTimeout(() => {
            if (preloader && preloader.parentNode) {
              preloader.parentNode.removeChild(preloader);
            }
            setPreloaderState('finished');
            sessionStorage.setItem('preloaderShown', 'true');
          }, 500);
        } else {
          setPreloaderState('finished');
          sessionStorage.setItem('preloaderShown', 'true');
        }
      }, 1000);
    }
    
    if (shouldTriggerCompletion) {
      debugLog("🎯 MODEL LOADED - Processing preloader completion (state:", preloaderState, ")");
      
      const elapsed = Date.now() - preloaderStartTime;
      const minDisplayTime = 2000; // 2 seconds minimum
      
      // Calculate delay to ensure minimum display time
      const delay = Math.max(0, minDisplayTime - elapsed);
      
      debugLog("🕐 Preloader timing:", {
        elapsed: elapsed + "ms",
        delay: delay + "ms",
        decision: delay > 0 ? "Wait for minimum 2s" : "Finish immediately"
      });
      
      setTimeout(() => {
        debugLog("🎯 Starting preloader finish sequence");
        finishPreloader();
      }, delay);
    }
    
    // Cleanup function
    return () => {
      clearTimeout(emergencyTimeout);
    };
  }, [preloaderState, modelLoaded, preloaderStartTime]);

  // State for Lottie animation - EXPLICITLY FALSE initially
  const [shouldPlayLottie, setShouldPlayLottie] = useState(false);
  const lottieRef = useRef(null);
  
  // White ovals Lottie animation states (animations now embedded)
  const [shouldPlayWhiteLottie, setShouldPlayWhiteLottie] = useState(false); // Outro: going TO portfolio
  const [shouldPlayWhiteIntroLottie, setShouldPlayWhiteIntroLottie] = useState(false); // Intro: coming FROM portfolio
  const [showWhiteOverlay, setShowWhiteOverlay] = useState(false); // White overlay to cover glitches
  
  // Safety flags to prevent conflicts
  const canPlayLottie = useRef(false);
  const preloaderAnimating = useRef(false);
  const darkOvalsStarted = useRef(false);
  
  // White ovals animations are now embedded - no loading needed

  


  // ROBUST PRELOADER FINISH - with comprehensive error handling
  const finishPreloader = () => {
    debugLog("🔥 FINISHPRELOADER CALLED");
    
    try {
      const preloader = safeQuerySelector('.pre-loader', () => {
        debugLog("🔥 NO PRELOADER FOUND - probably already removed");
        setPreloaderState('finished');
      });
      
      if (!preloader) {
        return; // Fallback already executed
      }
      
      debugLog("🔥 FOUND PRELOADER, CURRENT CLASSES:", preloader.className);
      debugLog("🔥 CURRENT COMPUTED STYLE:", window.getComputedStyle(preloader).transition);
      
      // ROBUST: Try GSAP animation first, fallback to direct removal
      debugLog("🔥 ATTEMPTING GSAP ANIMATION");
      
      // Clear all CSS classes and transitions
      preloader.className = 'pre-loader';
      preloader.style.transition = 'none';
      
      // Ensure proper positioning for GSAP animation
      gsap.set(preloader, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transformOrigin: 'center center'
      });
      
      // Set up fallback timer in case GSAP fails
      const gsapFallback = setTimeout(() => {
        debugLog("⚠️ GSAP TIMEOUT - Using direct removal fallback");
        if (preloader && preloader.parentNode) {
          preloader.remove();
          setPreloaderState('finished');
        }
      }, 2000);
      
      // Use GSAP to animate with error handling
      gsap.to(preloader, {
        opacity: 0,
        y: '-100%',
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          clearTimeout(gsapFallback);
          debugLog("🔥 GSAP ANIMATION COMPLETE");
          try {
            if (preloader && preloader.parentNode) {
              preloader.parentNode.removeChild(preloader);
              debugLog("🔥 PRELOADER REMOVED FROM DOM");
            }
          } catch (removeError) {
            console.error("❌ Error removing preloader:", removeError);
            // Force removal
            if (preloader) preloader.style.display = 'none';
          }
        },
        onError: () => {
          clearTimeout(gsapFallback);
          console.error("❌ GSAP ANIMATION FAILED - Using fallback");
          if (preloader) {
            preloader.style.display = 'none';
            setPreloaderState('finished');
          }
        }
      });
      
      debugLog("🔥 GSAP ANIMATION STARTED");
      
                  // Check transition progress at different intervals
      setTimeout(() => {
              debugLog("🔥 500MS - MID TRANSITION:");
              debugLog("🔥 Opacity:", window.getComputedStyle(preloader).opacity);
              debugLog("🔥 Transform:", window.getComputedStyle(preloader).transform);
            }, 500);
            
            setTimeout(() => {
              debugLog("🔥 1.5S - SHOULD BE COMPLETE:");
              debugLog("🔥 Opacity:", window.getComputedStyle(preloader).opacity);
              debugLog("🔥 Transform:", window.getComputedStyle(preloader).transform);
              debugLog("🔥 Display:", window.getComputedStyle(preloader).display);
            }, 1500);
      
      // Start 3D animation ONLY if this is the initial preloader sequence
      const wasPreloaderShown = sessionStorage.getItem('preloaderShown') !== 'true';
      
      if (wasPreloaderShown) {
        // This is the initial preloader - check if we're actually coming from portfolio
        const referrer = document.referrer;
        const navigationType = performance.getEntriesByType('navigation')[0]?.type;
        const isHardReload = navigationType === 'reload';
        
        const isFromPortfolio = !isHardReload && referrer && (
          referrer.includes('portfolio') || 
          referrer.includes('casestudy') ||
          referrer.includes('oakley') ||
          referrer.includes('dopo')
        );
        
        const isContactPage = window.location.pathname === '/contact-us';
        
        if (isContactPage && isFromPortfolio) {
          // Check if contact animation is already playing to prevent duplicates
          if (!shouldPlayContactIntro && !contactAnimationTriggered.current) {
            debugLog("🎬 Starting contact intro animation (portfolio → contact)");
            contactAnimationTriggered.current = true;
            // Reset conflicting animations first
            setShouldPlayPortfolioToHome(false);
            setShouldPlayHomeToPortfolio(false);
            setShouldPlayContactToPortfolio(false);
            setShouldPlayContactIntro(true);
            // Reset after animation completes
            setTimeout(() => {
              setShouldPlayContactIntro(false);
              contactAnimationTriggered.current = false;
            }, 2000);
          } else {
            debugLog("🚫 SKIPPED: Contact intro animation already playing (finishPreloader)");
          }
        } else if (!isContactPage && isFromPortfolio) {
          debugLog("🎬 Starting portfolio-to-home animation (portfolio → home)");
          setShouldPlayPortfolioToHome(true);
          debugLog("🎬 DEBUG: shouldPlayPortfolioToHome set to TRUE");
        } else {
          debugLog("🚫 No 3D animation needed - not from portfolio or direct load");
        }
      } else {
        debugLog("🚫 SKIPPED 3D animation in finishPreloader (navigation scenario)");
      }
        
      // Start Lottie animation ONLY if this is the initial preloader sequence
      // (reuse the same wasPreloaderShown check from above)
      
      debugLog("🔍 DEBUG: Dark ovals Lottie check:");
      debugLog("  - sessionStorage.preloaderShown:", sessionStorage.getItem('preloaderShown'));
      debugLog("  - wasPreloaderShown:", wasPreloaderShown);
      
      if (wasPreloaderShown && !darkOvalsStarted.current) {
        canPlayLottie.current = true;
        setShouldPlayLottie(true);
        darkOvalsStarted.current = true;
        debugLog("🔥 STARTED DARK OVALS LOTTIE (initial preloader)");
      } else {
        debugLog("🚫 SKIPPED DARK OVALS LOTTIE (navigation scenario or already started)");
      }
      
      // Update state immediately - no race conditions
      setPreloaderState('finished');
      sessionStorage.setItem('preloaderShown', 'true');
      
    } catch (error) {
      console.error("❌ Error in finishPreloader:", error);
      // Fallback: ensure preloader is hidden and state is updated
      const preloader = safeQuerySelector('.pre-loader');
          if (preloader) {
            preloader.style.display = 'none';
      }
          setPreloaderState('finished');
          sessionStorage.setItem('preloaderShown', 'true');
    }
  };

  // DEBUGGING: Add manual testing functions for development
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.debugPreloader = () => {
        debugLog("🔍 Preloader debug:", {
          preloaderState,
          modelLoaded,
          progress,
          preloaderElement: document.querySelector(".pre-loader"),
          whiteContainer: document.querySelector(".outro-anim-home"),
          darkContainer: document.querySelector(".outro-anim-home-dark")
        });
      };
      
      window.forceFinishPreloader = () => {
        debugLog("🎯 Manually finishing preloader");
        finishPreloader();
      };
      
      // DEBUG: Check preloader state
      window.debugPreloader = () => {
        debugLog("🔍 PRELOADER DEBUG:", {
          preloaderState,
          modelLoaded,
          progress,
          preloaderElement: !!document.querySelector('.pre-loader')
        });
      };

      window.resetPreloader = () => {
        debugLog("🔄 Resetting preloader state");
        sessionStorage.removeItem('preloaderShown');
        setPreloaderState('visible');
        setModelLoaded(false);
        debugLog("🔄 State reset - reload page to see preloader");
      };

      window.testNavigationOvals = () => {
        debugLog("🧪 Testing navigation oval animation");
        playNavigationOvalAnimation(() => {
          debugLog("🧪 Navigation oval test completed");
        });
      };

      window.testExpandOvals = () => {
        debugLog("🧪 Testing expand oval animation");
        if (window.playOvalExpandAnimation) {
          window.playOvalExpandAnimation(() => {
            debugLog("🧪 Expand oval test completed");
          });
        }
      };

      window.testLottie = () => {
        debugLog("🧪 Testing Lottie animation");
        setShouldPlayLottie(true);
      };
    }
  }, [preloaderState, modelLoaded, progress]);

  // PROTECTION: Prevent multiple white oval animations
  const isWhiteOvalAnimating = useRef(false);

  // OLD: White oval animation for navigation FROM portfolio TO home/contact
  // DISABLED: Replaced with Lottie animation system
  const playNavigationOvalAnimation = (onComplete) => {
    debugLog("🚫 OLD white ovals DOM animation disabled - using Lottie instead");
    onComplete && onComplete();
    return;
    debugLog("🔍 playNavigationOvalAnimation CALLED - this should appear when navigating from portfolio");
    
    // Prevent multiple simultaneous animations
    if (isWhiteOvalAnimating.current) {
      console.warn("⚠️ White oval animation already running - skipping");
      onComplete && onComplete();
      return;
    }
    isWhiteOvalAnimating.current = true;
    
    // Find the white oval container and ovals
    
    const whiteContainer = document.querySelector(".outro-anim-home");
    const whiteOvals = whiteContainer?.querySelectorAll(".oval-white-home-outro");
    
    if (!whiteContainer || !whiteOvals || whiteOvals.length === 0) {
      console.warn("⚠️ White oval container or ovals not found for navigation");
      onComplete && onComplete();
      return;
    }

    // Ensure dark container is hidden during navigation
      const darkContainer = document.querySelector('.outro-anim-home-dark');
      if (darkContainer) {
      darkContainer.style.display = 'none';
    }

    // CRITICAL: Set body background to white immediately to prevent dark flash
    document.body.style.backgroundColor = 'white';
    
    // Set up white container for navigation animation
    // CRITICAL: Remove finished class that sets opacity: 0
    whiteContainer.classList.remove('finished');
    whiteContainer.style.display = 'block';
    whiteContainer.style.visibility = 'visible';
    whiteContainer.style.opacity = '1'; // Explicitly set opacity to 1
    whiteContainer.style.position = 'fixed';
    whiteContainer.style.top = '0';
    whiteContainer.style.left = '0';
    whiteContainer.style.width = '100vw';
    whiteContainer.style.height = getMobileViewportHeight();
    whiteContainer.style.zIndex = '999999'; // Much higher z-index
    whiteContainer.style.pointerEvents = 'none';
    // CRITICAL: Override Webflow's 'overflow: clip' with cssText
    whiteContainer.style.cssText += 'overflow: visible !important;';
    


    // GENTLE RESET: Use GSAP-friendly initialization
    whiteOvals.forEach((oval, index) => {
      // Add visible class for Webflow combo class
      oval.classList.add('visible');
    });
    
    // Set initial state via GSAP only (no cssText interference)
    gsap.set(whiteOvals, {
      scale: 1,
      opacity: 1,
      display: "block",
      transformOrigin: "center center"
    });





    // Start immediately - no delay, sync with 3D animation
    setTimeout(() => {
      
      // CRITICAL: Remove 'finished' class and aggressive protection
      whiteContainer.classList.remove('finished');
      
      // SETUP-ONLY PROTECTION: Aggressive protection during setup, then stop completely
      let protectionInterval;
      
      const setupProtection = () => {
        let setupChecks = 0;
        const maxSetupChecks = 10; // Run for about 0.5 seconds (10 * 50ms)
        
        protectionInterval = setInterval(() => {
          setupChecks++;
          
          // CRITICAL: Prevent 'finished' class from being added by Webflow
          if (whiteContainer.classList.contains('finished')) {
            whiteContainer.classList.remove('finished');
          }
          
          // Force container properties during setup
          const containerStyles = window.getComputedStyle(whiteContainer);
          if (containerStyles.display === 'none') {
            whiteContainer.style.display = 'block';
          }
          if (containerStyles.visibility === 'hidden') {
            whiteContainer.style.visibility = 'visible';
          }
          
          // Gentle oval protection during setup only
          whiteOvals.forEach((oval, index) => {
            const computed = window.getComputedStyle(oval);
            if (computed.display === 'none') {
              oval.style.display = 'block';
            }
            // Don't force transform during setup to avoid GSAP conflicts
          });
          
          // Stop protection after setup period
          if (setupChecks >= maxSetupChecks) {
            clearInterval(protectionInterval);
            debugLog("🛡️ Setup protection completed - ready for flicker-free animation");
          }
        }, 50); // Fast checks during setup only
      };
      
      // Start setup protection immediately
      setupProtection();

      // Delay animation start until after setup protection completes
      setTimeout(() => {
        debugLog("🎬 Starting flicker-free GSAP animation");
        
        // Use GSAP timeline for smooth animation
        const timeline = gsap.timeline({
          onStart: () => {
            // Reset body background as soon as animation starts (brief white flash only)
        document.body.style.backgroundColor = '';
            debugLog("🎬 Animation started - body background reset");
          },
          onComplete: () => {
            debugLog("🟣 TIMELINE COMPLETED - animation finished");
            
            // Hide the container
            whiteContainer.style.display = 'none';
            whiteContainer.style.visibility = 'hidden';
            
            // Reset animation flag
            isWhiteOvalAnimating.current = false;
      
      onComplete && onComplete();
          }
        });
      
      // Add scale animation to timeline (starts immediately)
      timeline.to(whiteOvals, {
        scale: 0,
        duration: 1.2, // Visible duration: 1.2s
        ease: "power2.out",
        stagger: 0.12, // Visible stagger: 0.12s

        onStart: () => {
          debugLog("🟣 White ovals scale animation STARTED");
        }
      }, 0); // Start at time 0
      
      // Add opacity animation to timeline (starts 0.3s later)
      timeline.to(whiteOvals, {
        opacity: 0,
        duration: 1.0, // Visible duration: 1.0s
        ease: "power2.out",
        stagger: 0.12, // Visible stagger: 0.12s
  
        onStart: () => {
          debugLog("🟣 White ovals opacity animation STARTED");
        }
      }, 0.3); // Start 0.3 seconds after timeline begins
      
      }, 600); // Wait for setup protection to complete (0.6 seconds)
      
    }, 100); // Minimal delay - start almost immediately
  };

  // OLD: Contact-specific oval animation for navigation FROM portfolio TO contact  
  // DISABLED: Replaced with Lottie animation system
  const playContactNavigationOvalAnimation = (onComplete) => {
    debugLog("🚫 OLD contact white ovals DOM animation disabled - using Lottie instead");
    onComplete && onComplete();
    return;
    
    // Prevent multiple simultaneous animations
    if (isWhiteOvalAnimating.current) {
      console.warn("⚠️ White oval animation already running - skipping contact animation");
      onComplete && onComplete();
      return;
    }
    isWhiteOvalAnimating.current = true;
    
    // Use white container for contact navigation (same as home navigation)
    const whiteContainer = document.querySelector(".outro-anim-home");
    const whiteOvals = whiteContainer?.querySelectorAll(".oval-white-home-outro");
    
    if (!whiteContainer || !whiteOvals || whiteOvals.length === 0) {
      console.warn("⚠️ White oval container or ovals not found for contact navigation");
      onComplete && onComplete();
      return;
    }

    debugLog("🟣 Found", whiteOvals.length, "white ovals for contact navigation");

    // Ensure dark container is hidden
    const darkContainer = document.querySelector('.outro-anim-home-dark');
    if (darkContainer) {
      darkContainer.style.display = 'none';
    }

    // CRITICAL: Set body background to white immediately to prevent dark flash
    document.body.style.backgroundColor = 'white';

    // Set up container for animation
    // CRITICAL: Remove finished class that sets opacity: 0
    whiteContainer.classList.remove('finished');
    whiteContainer.style.display = 'block';
    whiteContainer.style.visibility = 'visible';
    whiteContainer.style.opacity = '1'; // Explicitly set opacity to 1
    whiteContainer.style.position = 'fixed';
    whiteContainer.style.top = '0';
    whiteContainer.style.left = '0';
    whiteContainer.style.width = '100vw';
    whiteContainer.style.height = getMobileViewportHeight();
    whiteContainer.style.zIndex = '9999';
    whiteContainer.style.pointerEvents = 'none';
    // CRITICAL: Override Webflow's 'overflow: clip' with cssText
    whiteContainer.style.cssText += 'overflow: visible !important;';

    // Set up ovals for animation
    whiteOvals.forEach((oval, index) => {
      oval.classList.add('visible');
      
      // FIX Z-FIGHTING: Give each oval a distinct z-index to prevent layering conflicts
      oval.style.zIndex = 100 + index; // Each oval gets a unique z-index
      oval.style.position = 'relative'; // Ensure z-index takes effect
      
      // Restore original radial gradient background
      oval.style.backgroundImage = ''; // Reset to CSS default
      oval.style.backgroundColor = '';
      oval.style.borderRadius = '50%';
    });

    // Set ovals to full visibility initially
    gsap.set(whiteOvals, {
      scale: 1,
      opacity: 1,
      transformOrigin: "center center"
    });

    // Start FAST outro animation immediately - sync with 3D, scale first

    
    // Start scale animation immediately
    gsap.to(whiteOvals, {
      scale: 0,
      duration: 1.2, // Visible duration: 1.2s
        ease: "power2.out",
      stagger: 0.12, // Visible stagger: 0.12s

      z: 0.01, // Maintain 3D context
      onStart: () => {
        // Reset body background as soon as animation starts (brief white flash only)
        document.body.style.backgroundColor = '';
        debugLog("🎬 Contact animation started - body background reset");
      }
    });
    
    // Start opacity animation slightly later (0.3s delay)
    gsap.to(whiteOvals, {
      opacity: 0,
      duration: 1.0, // Visible duration: 1.0s
      ease: "power2.out",
      stagger: 0.12, // Visible stagger: 0.12s
      delay: 0.3, // Start 0.3 seconds after scale begins

      onComplete: () => {
        
        // Hide the container
        whiteContainer.style.display = 'none';
        whiteContainer.style.visibility = 'hidden';
        
        // Reset animation flag
        isWhiteOvalAnimating.current = false;
      
      onComplete && onComplete();
      }
    });
  };

  
  // ROBUST: Handle navigation from portfolio pages
  useEffect(() => {
    // Only run this logic if NOT showing preloader (i.e., navigation scenario)
    if (preloaderState !== 'visible') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const referrer = document.referrer;
      const currentUrl = window.location.href;
    
      debugLog("🔍 Navigation intro logic - path:", path, "hash:", hash);
      debugLog("🔍 Referrer:", referrer);
    
      // ROBUST: Check if this is navigation from portfolio
      // CRITICAL: Only consider it navigation from portfolio if it's NOT a hard reload
      const navigationType = performance.getEntriesByType('navigation')[0]?.type;
      const isHardReload = navigationType === 'reload';
    
      const isNavigationFromPortfolio = !isHardReload && referrer && (
        referrer.includes('portfolio') || 
        referrer.includes('casestudy') ||
        referrer.includes('oakley') ||
        referrer.includes('dopo')
      );
    
      // Ensure we're on the home page (not on portfolio pages)
      const isOnHomePage = currentUrl.includes('index.html') || 
                          currentUrl.endsWith('/') || 
                          (!currentUrl.includes('portfolio') && !currentUrl.includes('casestudy'));
      
      // Handle different navigation scenarios
      if (isNavigationFromPortfolio && isOnHomePage) {
        // Check if this is actually going to contact (intended route scenario)
        const intendedRoute = sessionStorage.getItem('intendedRoute');
        const isActuallyGoingToContact = intendedRoute === '/contact-us' || intendedRoute === '/contact' || currentPageState === 'contact';
        
        if (isActuallyGoingToContact) {
          debugLog("🔍 Navigation FROM portfolio TO contact detected (via intended route)");
          // This will be handled by handleIntendedRoute, don't start home animation
          return;
        }
        
        debugLog("🔍 Navigation FROM portfolio TO home detected - using NEW Lottie system");
        

        // Check if animation is already playing to prevent duplicates
        if (!shouldPlayWhiteIntroLottie && !shouldPlayPortfolioToHome && !isAnimating.current && !whiteIntroBlocked.current) {
          // NEW: Use Lottie-based white intro animation system
          setShouldPlayWhiteIntroLottie(true);
          debugLog("⚪ Started white intro Lottie animation (portfolio → home)");
          
          setShouldPlayPortfolioToHome(true);
          debugLog("🎬 Started PortfolioToHome 3D animation");
          
          isAnimating.current = true;
          setTimeout(() => { isAnimating.current = false; }, 2000);
        } else {
          debugLog("🚫 SKIPPED: Portfolio→Home animation already playing");
        }
        
        return; // Skip the old DOM-based system below
      }
      
      if (isNavigationFromPortfolio && !isOnHomePage) {
        debugLog("🔍 Navigation from portfolio detected but not to home page - skipping oval animation");
        return;
      }
      
      if (!isNavigationFromPortfolio) {
        debugLog("🔍 Not navigation from portfolio - no oval animation needed");
        return;
      }
      
      // If we reach here, handle the old DOM-based system (fallback)
      debugLog("🔍 Navigation not handled by new Lottie system - checking old system");
        
      const whiteContainer = document.querySelector(".outro-anim-home");
      if (whiteContainer) {
        debugLog("⚠️ White oval container found - but this should use Lottie system");
        // CRITICAL: Set body background to white immediately to prevent dark flash
        document.body.style.backgroundColor = 'white';
        
        // Set up immediate outro overlay (covers screen during navigation)
        whiteContainer.style.display = 'block';
        whiteContainer.style.visibility = 'visible';
        whiteContainer.style.position = 'fixed';
        whiteContainer.style.top = '0';
        whiteContainer.style.left = '0';
        // FIX: Use window dimensions instead of viewport units to prevent flicker
        whiteContainer.style.width = window.innerWidth + 'px';
        whiteContainer.style.height = getMobileViewportHeight();
        whiteContainer.style.zIndex = '9999';
        whiteContainer.style.pointerEvents = 'none';
        // CRITICAL: Override Webflow's 'overflow: clip' with cssText
        whiteContainer.style.cssText += 'overflow: visible !important;';
        
        // CRITICAL: Set ovals to FULL visibility initially (scale 1, opacity 1)
        const whiteOvals = whiteContainer.querySelectorAll(".oval-white-home-outro");
        if (whiteOvals.length > 0) {
          debugLog("🟣 Setting up", whiteOvals.length, "white ovals for outro animation");
          
          // DEBUG: Check initial oval state
          debugLog("🔍 INITIAL WHITE OVAL STATE:", {
            containerFound: !!whiteContainer,
            containerClasses: whiteContainer.className,
            ovalCount: whiteOvals.length,
            firstOvalClasses: whiteOvals[0]?.className,
            containerRect: whiteContainer.getBoundingClientRect(),
            firstOvalRect: whiteOvals[0]?.getBoundingClientRect()
          });
          
          // Set up ovals for animation
          whiteOvals.forEach((oval, index) => {
            oval.classList.add('visible');
            
            // FIX Z-FIGHTING: Give each oval a distinct z-index to prevent layering conflicts
            oval.style.zIndex = 100 + index; // Each oval gets a unique z-index
            oval.style.position = 'relative'; // Ensure z-index takes effect
            
            // Restore original radial gradient background
            oval.style.backgroundImage = ''; // Reset to CSS default
            oval.style.backgroundColor = '';
            oval.style.borderRadius = '50%';
          });

          gsap.set(whiteOvals, {
            scale: 1,
            opacity: 1,
            transformOrigin: "center center"
          });
          
          // Determine destination and play appropriate animation
          // ROBUST: Check path and intended route for contact detection (no hash needed)
          const intendedRoute = sessionStorage.getItem('intendedRoute');
          const isContactPage = path === '/contact-us' || intendedRoute === '/contact-us' || intendedRoute === '/contact' || currentPageState === 'contact';
          const isHomePage = (path === '/' || path === '/index.html') && path !== '/contact-us' && intendedRoute !== '/contact-us' && intendedRoute !== '/contact' && currentPageState !== 'contact';
          
          debugLog("🔍 DEBUG: Navigation destination check:");
          debugLog("  - hash:", hash);
          debugLog("  - intendedRoute:", intendedRoute);
          debugLog("  - isContactPage:", isContactPage);
          debugLog("  - isHomePage:", isHomePage);
          
          if (isContactPage) {
            // Check if contact animation is already playing to prevent duplicates
            const now = Date.now();
            const timeSinceLastTrigger = now - lastContactTriggerTime.current;
            
            if (!shouldPlayContactIntro && !contactAnimationTriggered.current && timeSinceLastTrigger > 500) {
              // NEW: Start white intro Lottie + 3D animation (portfolio → contact)
              debugLog("🎯 PORTFOLIO TO CONTACT: Starting white intro Lottie + 3D animation");
              
              contactAnimationTriggered.current = true;
              lastContactTriggerTime.current = now;
              
              // Reset conflicting animations first
              setShouldPlayPortfolioToHome(false);
              setShouldPlayHomeToPortfolio(false);
              setShouldPlayContactToPortfolio(false);
              
              setShouldPlayWhiteIntroLottie(true);
              debugLog("⚪ Started white intro Lottie animation");
              
              setShouldPlayContactIntro(true);
              // Reset after animation completes
              setTimeout(() => {
                setShouldPlayContactIntro(false);
                contactAnimationTriggered.current = false;
              }, 2000);
              debugLog("🎬 Started PortfolioToContact 3D animation");
            } else {
              debugLog("🚫 SKIPPED: Portfolio→Contact animation already playing or too soon (hash change)", {
                shouldPlayContactIntro,
                contactAnimationTriggered: contactAnimationTriggered.current,
                timeSinceLastTrigger
              });
            }
            
          } else if (isHomePage) {
            // Check if animation is already playing to prevent duplicates
            if (!shouldPlayWhiteIntroLottie && !shouldPlayPortfolioToHome && !isAnimating.current && !whiteIntroBlocked.current) {
              // NEW: Start white intro Lottie + 3D animation (portfolio → home)
              debugLog("🎯 PORTFOLIO TO HOME: Starting white intro Lottie + 3D animation");
              
              setShouldPlayWhiteIntroLottie(true);
              debugLog("⚪ Started white intro Lottie animation");
              
              setShouldPlayPortfolioToHome(true);
              debugLog("🎬 Started PortfolioToHome 3D animation");
              
              isAnimating.current = true;
              setTimeout(() => { isAnimating.current = false; }, 2000);
            } else {
              debugLog("🚫 SKIPPED: Portfolio→Home animation already playing (old system)");
            }
          }
        } else {
          console.warn("⚠️ No white ovals found for navigation animation");
        }
      } else {
        console.warn("⚠️ White oval container not found");
      }
    }
  }, [preloaderState]); // Only depend on preloader state

  // Background flicker prevention is handled in oval animations

  // Set up simple global animation trigger
  useEffect(() => {
    window.triggerHomeToPortfolioAnimation = () => {
      setShouldPlayHomeToPortfolio(true);
      setShouldPlayContactIntro(false);
      setShouldPlayBackContact(false);
      setShouldPlayPortfolioToHome(false);
    };

    // Listen for direct animation trigger - NEW: Play white Lottie + 3D animation
    const handleDirectPortfolioAnimation = () => {
      debugLog("🎯 HOME TO PORTFOLIO: Starting white Lottie + 3D animation");
      
      // Reset all animation states first to prevent conflicts
      setShouldPlayContactIntro(false);
      setShouldPlayBackContact(false);
      setShouldPlayPortfolioToHome(false);
      setShouldPlayContactToPortfolio(false);
      setShouldPlayWhiteIntroLottie(false);
      setShowWhiteOverlay(false);
      
      // Start white ovals Lottie animation (now embedded)
      setShouldPlayWhiteLottie(true);
      debugLog("🟣 Started white ovals outro Lottie animation");
      
      // Start 3D animation simultaneously
      setShouldPlayHomeToPortfolio(true);
      
      debugLog("🎬 Started HomeToPortfolio 3D animation");
    };

    window.addEventListener('directPortfolioAnimation', handleDirectPortfolioAnimation);

    // Handle contact to portfolio animation trigger - NEW: Play white Lottie + 3D animation
    const handleDirectContactPortfolioAnimation = () => {
      debugLog("🎯 CONTACT TO PORTFOLIO: Starting white Lottie + 3D animation");
      debugLog("🎯 DEBUG: Current page state when contact→portfolio triggered:", currentPageState);
      debugLog("🎯 DEBUG: Event handler called successfully");
      
      // Reset all animation states first to prevent conflicts
      setShouldPlayContactIntro(false);
      setShouldPlayBackContact(false);
      setShouldPlayHomeToPortfolio(false);
      setShouldPlayPortfolioToHome(false);
      setShouldPlayWhiteIntroLottie(false);
      setShowWhiteOverlay(false);
      
      // Start white ovals Lottie animation (now embedded)
      setShouldPlayWhiteLottie(true);
      debugLog("🟣 Started white ovals outro Lottie animation");
      
      // Start 3D animation simultaneously
      setShouldPlayContactToPortfolio(true);
      setTimeout(() => setShouldPlayContactToPortfolio(false), 2000);
      
      debugLog("🎬 Started ContactToPortfolio 3D animation");
      debugLog("🎬 DEBUG: shouldPlayContactToPortfolio set to TRUE");
    };

    window.addEventListener('directContactPortfolioAnimation', handleDirectContactPortfolioAnimation);

    // ROBUST: Handle intended routes from external pages
    const handleIntendedRoute = () => {
      const intendedRoute = sessionStorage.getItem('intendedRoute');
      
      if (intendedRoute === '/contact-us' || intendedRoute === '/contact') {
        debugLog("🎯 handleIntendedRoute: Processing contact route, current URL:", window.location.href);
        
        // Update URL first to ensure consistency
        if (window.location.pathname !== '/contact-us') {
          debugLog("🎯 handleIntendedRoute: Updating URL to /contact-us");
          window.history.pushState(null, null, '/contact-us');
        }
        
        setCurrentPageState('contact');
        
        // Check if contact animation is already playing to prevent duplicates
        if (!shouldPlayContactIntro && !contactAnimationTriggered.current) {
          contactAnimationTriggered.current = true;
          
          // Start both white intro Lottie and 3D contact animation
          setShouldPlayWhiteIntroLottie(true);
          debugLog("⚪ Started white intro Lottie animation (portfolio → contact)");
          
          setShouldPlayContactIntro(true);
          // Reset after animation completes
          setTimeout(() => {
            setShouldPlayContactIntro(false);
            contactAnimationTriggered.current = false;
          }, 2000);
          debugLog("🎯 Handled intended contact route - URL:", window.location.href);
        } else {
          debugLog("🚫 SKIPPED: Contact intro animation already playing (intended route)");
        }
        sessionStorage.removeItem('intendedRoute');
      }
    };

    handleIntendedRoute();
    
    // SINGLE hash change handler
    const handleHashChange = () => {
      const newHash = window.location.hash;
      const path = window.location.pathname;
      debugLog("🔧 Hash/URL changed to:", newHash, "path:", path, "current state:", currentPageState);
      
      if (path === '/contact-us') {
        debugLog("🔧 Setting state to contact");
        setCurrentPageState('contact');
      } else if (path === '/' || path === '/index.html') {
        // Going back to home (either from contact or direct navigation)
        debugLog("🏠 Detected navigation to home from state:", currentPageState);
        // Manually update prevPageState to ensure proper transition detection
        if (currentPageState === 'contact') {
          debugLog("🏠 Manually setting prevPageState to contact for proper transition");
          prevPageState.current = 'contact';
        }
        setCurrentPageState('home');
      }
    };
    
    // Also listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      debugLog("🔧 Popstate event - checking current state");
      handleHashChange();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.triggerHomeToPortfolioAnimation = null;
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('directPortfolioAnimation', handleDirectPortfolioAnimation);
      window.removeEventListener('directContactPortfolioAnimation', handleDirectContactPortfolioAnimation);
    };
  }, []);

  // Listen for page state changes from navigation system (for contact/home only)
  useEffect(() => {
    const handlePageStateChange = (event) => {
      const { from, to } = event.detail;
      debugLog("🔄 Page state change event received:", from, "→", to);
      debugLog("🔄 Event detail:", event.detail);
      debugLog("🔄 Current prevPageState before update:", prevPageState.current);
      
      prevPageState.current = from;
      setCurrentPageState(to);
      
      debugLog("🔄 Set prevPageState to:", from, "and currentPageState to:", to);
    };

    window.addEventListener('pageStateChange', handlePageStateChange);
    
    return () => {
      window.removeEventListener('pageStateChange', handlePageStateChange);
    };
  }, []);

  // Container management is now handled by individual animation functions



  // Handle fade between home and contact containers
  useEffect(() => {
    const homeContainer = document.querySelector(".container.home");
    const contactContainer = document.querySelector(".container.contact");

    const showHome = currentPageState === "home";
    const showContact = currentPageState === "contact";
    
    // ROBUST: Hide containers when white ovals are playing to prevent z-index conflicts
    // IMPORTANT: Only hide content containers, NOT the 3D canvas
    const isWhiteOvalsPlaying = shouldPlayWhiteLottie || shouldPlayWhiteIntroLottie;
    
    // Debug container visibility
    debugLog("🎨 Container visibility - showHome:", showHome, "showContact:", showContact, "pageState:", currentPageState);
    debugLog("🎨 White ovals playing:", isWhiteOvalsPlaying);
    
    // Container management with smooth animation for contact
    // CRITICAL: Only hide content containers (.container.home/.container.contact), preserve 3D canvas
    if (homeContainer && contactContainer) {
      if (isWhiteOvalsPlaying) {
        // SMOOTH: Gradually hide CONTENT containers only to prevent glitch when white ovals start
        // Do NOT hide the main page wrapper or canvas
        homeContainer.style.transition = 'opacity 0.2s ease-out';
        contactContainer.style.transition = 'opacity 0.2s ease-out';
        
        // Use opacity for smoother transition - keep 3D canvas visible
        homeContainer.style.opacity = '0';
        contactContainer.style.opacity = '0';
        
        // Delay the z-index change but keep 3D canvas unaffected
        setTimeout(() => {
          homeContainer.style.zIndex = '-1';
          contactContainer.style.zIndex = '-1';
          // Use display instead of visibility to ensure 3D canvas stays visible
          homeContainer.style.display = 'none';
          contactContainer.style.display = 'none';
        }, 200);
        
        debugLog("🎨 SMOOTHLY HIDDEN content containers (3D canvas preserved)");
      } else if (showHome) {
        // Clear any transition and restore home container properly
        homeContainer.style.transition = '';
        homeContainer.style.display = 'flex';
        homeContainer.style.visibility = 'visible';
        homeContainer.style.opacity = '1';
        homeContainer.style.zIndex = '25'; // Restore original z-index
        contactContainer.style.display = 'none';
        contactContainer.style.opacity = '1'; // Reset for next time
      } else if (showContact) {
        // Clear any transition and restore contact container  
        contactContainer.style.transition = '';
        // Smooth animation for contact container
        contactContainer.style.display = 'flex';
        contactContainer.style.visibility = 'visible';
        contactContainer.style.zIndex = '25'; // Restore original z-index
        
        // Animate contact container in smoothly
        gsap.fromTo(contactContainer, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
        
        homeContainer.style.display = 'none';
      }
    }
  }, [currentPageState, shouldPlayWhiteLottie, shouldPlayWhiteIntroLottie]);

  // Hide menu during Lottie animations - simple and effective approach
  useEffect(() => {
    const isLottieAnimationPlaying = shouldPlayWhiteLottie || shouldPlayWhiteIntroLottie || shouldPlayLottie;
    
    // Get the specific Webflow menu element
    const menuWrap = document.querySelector('.menu-wrap.dopo');
    
    if (menuWrap) {
      if (isLottieAnimationPlaying) {
        // Hide menu during animation
        menuWrap.style.visibility = 'hidden';
        menuWrap.style.opacity = '0';
        debugLog("🎨 Menu hidden during Lottie animation");
      } else {
        // Show menu slightly before animation fully completes for smoother transition
        setTimeout(() => {
          menuWrap.style.visibility = 'visible';
          menuWrap.style.opacity = '1';
          debugLog("🎨 Menu restored with faster timing");
        }, 100); // 100ms early return for smoother feel
      }
    }
  }, [shouldPlayWhiteLottie, shouldPlayWhiteIntroLottie, shouldPlayLottie]);
    




  // Handle animation triggers based on page state changes
  useEffect(() => {
    const from = prevPageState.current;
    const to = currentPageState;
    
    // Helper function to check if a state is portfolio/casestudy page
    const isPortfolioOrCasestudy = (state) => {
      return state === 'portfolio' || state === 'casestudy';
    };
    
    debugLog("🎯 ANIMATION TRIGGER - from:", from, "to:", to);
    debugLog("🎯 URL:", window.location.pathname + window.location.hash);
    debugLog("🎯 prevPageState.current:", prevPageState.current);
    debugLog("🎯 DEBUG - isPortfolioOrCasestudy(from):", isPortfolioOrCasestudy(from));
    debugLog("🎯 DEBUG - to === 'home':", to === 'home');
    debugLog("🎯 DEBUG - Should trigger portfolio→home:", to === "home" && isPortfolioOrCasestudy(from));

    // Initialize properly on first run
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      prevPageState.current = to;
      return; // Don't trigger animations on initialization
    }

    if (isAnimating.current) {
      return;
    }

    // Reset all animations first
    const resetAnimations = () => {
      setShouldPlayContactIntro(false);
      setShouldPlayBackContact(false);
      setShouldPlayHomeToPortfolio(false);
      setShouldPlayContactToPortfolio(false);
      setShouldPlayPortfolioToHome(false);
      // Also reset Lottie animation states to prevent glitches
      setShouldPlayWhiteLottie(false);
      setShouldPlayWhiteIntroLottie(false);
      setShowWhiteOverlay(false);
      // Reset animation flags
      contactAnimationTriggered.current = false;
      lastContactTriggerTime.current = 0;
      whiteIntroBlocked.current = false;
    };



    // ROBUST: Handle page transitions with appropriate animations
    if (to === "contact" && from !== "contact") {
      debugLog("🎯 Transitioning TO contact");
      // Check if contact animation is already playing to prevent duplicates
      if (!shouldPlayContactIntro && !contactAnimationTriggered.current) {
        isAnimating.current = true;
        contactAnimationTriggered.current = true;
        resetAnimations();
        setShouldPlayContactIntro(true);
        setTimeout(() => { 
          isAnimating.current = false;
          contactAnimationTriggered.current = false;
        }, 1000);
      } else {
        debugLog("🚫 SKIPPED: Contact intro animation already playing (page transition)");
      }
      
    } else if (from === "contact" && to === "home") {
      debugLog("🎯 Transitioning FROM contact TO home");
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayBackContact(true);
      setTimeout(() => { isAnimating.current = false; }, 1000);
      
    } else if (to === "home" && isPortfolioOrCasestudy(from)) {
      debugLog("🎯 Transitioning FROM portfolio TO home");
      
      // Check if animation is already playing to prevent duplicates  
      if (!shouldPlayPortfolioToHome && !shouldPlayWhiteIntroLottie && !isAnimating.current) {
        isAnimating.current = true;
        resetAnimations();
        setShouldPlayPortfolioToHome(true);
        setTimeout(() => { isAnimating.current = false; }, 1000);
      } else {
        debugLog("🚫 SKIPPED: Portfolio→Home animation already playing (transition system)");
      }
      
    } else if (isPortfolioOrCasestudy(to) && from === "home") {
      debugLog("🎯 Transitioning FROM home TO portfolio");
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayHomeToPortfolio(true);
      setTimeout(() => { isAnimating.current = false; }, 1000);
      
    } else if (isPortfolioOrCasestudy(to) && from === "contact") {
      debugLog("🎯 Transitioning FROM contact TO portfolio");
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayContactToPortfolio(true);
      setTimeout(() => { isAnimating.current = false; }, 1000);
      
    } else {
      debugLog("🎯 No animation needed for:", from, "→", to);
      resetAnimations();
    }

    // ALWAYS update prevPageState at the end
    prevPageState.current = to;
    debugLog("🎯 Updated prevPageState to:", to);
  }, [currentPageState]);

  

  return (
    <>
      {/* CRITICAL: Always render 3D Scene - never hide this */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: getMobileViewportHeight(),
          zIndex: 10, // Higher z-index to ensure visibility above content
          pointerEvents: 'none'
        }}
      >
        <Scene 
          shouldPlayContactIntro={shouldPlayContactIntro}
          shouldPlayBackContact={shouldPlayBackContact}
          shouldPlayHomeToPortfolio={shouldPlayHomeToPortfolio}
          shouldPlayContactToPortfolio={shouldPlayContactToPortfolio}
          shouldPlayPortfolioToHome={shouldPlayPortfolioToHome}
          isAnimating={isAnimating}
        />
      </div>
      
      {/* Lottie Dark Ovals Animation Overlay - ROBUST with error handling */}
      {shouldPlayLottie && canPlayLottie.current && (
        <div 
          className="lottie-background-overlay"
          ref={(el) => {
            if (el) {
              const mobileCSS = getMobileViewportCSS();
              el.style.cssText = `${mobileCSS} z-index: 2147483647 !important; pointer-events: none !important; overflow: hidden !important; background-color: transparent !important; display: flex !important; align-items: center !important; justify-content: center !important; isolation: isolate !important; transform: translateZ(0) !important;`;
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: getMobileViewportHeight(),
            zIndex: 2147483647, // Higher than preloader to ensure visibility
            pointerEvents: 'none',
            overflow: 'hidden', // Crop anything outside the screen bounds
            backgroundColor: 'transparent', // Clean background
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            isolation: 'isolate',
            transform: 'translateZ(0)'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `max(100vw, ${getMobileViewportHeight()})`,
            height: `max(100vw, ${getMobileViewportHeight()})`,
            minWidth: '100vw',
            minHeight: getMobileViewportHeight()
          }}>
            {/* ROBUST: Try-catch wrapper for Lottie with fallback */}
            {(() => {
              try {
                return (
          <Lottie
            animationData={darkOvalsAnimation}
            loop={false}
                    autoplay={true}
            style={{
              width: '100%',
                      height: '100%'
            }}
            onComplete={() => {
                      debugLog("🟣 Lottie animation completed naturally (45 frames = 1.5 seconds)");
                      setShouldPlayLottie(false);
                      debugLog("🟣 Lottie hidden immediately");
                    }}
                    onEnterFrame={(e) => {
                      // Only log every 10 frames to reduce spam
                      if (Math.floor(e.currentTime) % 10 === 0) {
                        debugLog(`🟣 Lottie frame: ${Math.floor(e.currentTime)} / ${Math.floor(e.totalTime)}`);
                      }
                    }}
                    onDOMLoaded={() => {
                      debugLog("🟣 Lottie DOM loaded - animation is exactly 45 frames (1.5 seconds at 30fps)");
                    }}
                    onLoadedData={() => {
                      debugLog("🟣 Lottie data loaded successfully");
                    }}
                    onError={(error) => {
                      console.error("❌ Lottie animation error:", error);
                      // Hide Lottie on error - website continues working
              setShouldPlayLottie(false);
            }}
          />
                );
              } catch (error) {
                console.error("❌ Lottie component error:", error);
                // Auto-hide on error and continue
                setTimeout(() => setShouldPlayLottie(false), 100);
                return (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    {/* Silent fallback - no error shown to user */}
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}
      
      {/* White Ovals Lottie Animation for Navigation to Portfolio */}
      {shouldPlayWhiteLottie && (
        <div 
          className="white-lottie-overlay"
          ref={(el) => {
            if (el) {
              const mobileCSS = getMobileViewportCSS();
              el.style.cssText = `${mobileCSS} z-index: 2147483647 !important; pointer-events: none !important; overflow: hidden !important; background-color: transparent !important; display: flex !important; align-items: center !important; justify-content: center !important; isolation: isolate !important; transform: translateZ(0) !important;`;
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: getMobileViewportHeight(),
            zIndex: 2147483647, // Force maximum z-index above Webflow animations and menu
            pointerEvents: 'none',
            overflow: 'hidden',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            isolation: 'isolate',
            transform: 'translateZ(0)'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `max(100vw, ${getMobileViewportHeight()})`,
            height: `max(100vw, ${getMobileViewportHeight()})`,
            minWidth: '100vw',
            minHeight: getMobileViewportHeight()
          }}>
            <Lottie
              animationData={whiteOvalsOutroAnimation}
              loop={false}
              autoplay={true}
              style={{
                width: '100%',
                height: '100%'
              }}
              onComplete={() => {
                debugLog("⚪ White ovals Lottie animation completed (45 frames = 1.5 seconds)");
                setShouldPlayWhiteLottie(false);
                // Also reset 3D animation states to prevent conflicts
                setShouldPlayHomeToPortfolio(false);
                setShouldPlayContactToPortfolio(false);
                // Show white overlay to cover any glitches
                setShowWhiteOverlay(true);
                debugLog("⚪ White Lottie hidden - showing white overlay and navigating to portfolio");
                
                // After 1.5s animation, navigate to portfolio
                setTimeout(() => {
                  window.location.href = '/portfolio';
                }, 100); // Small delay to ensure smooth transition
              }}
              onEnterFrame={(e) => {
                // Only log every 10 frames to reduce spam
                if (Math.floor(e.currentTime) % 10 === 0) {
                  debugLog(`⚪ White Lottie frame: ${Math.floor(e.currentTime)} / ${Math.floor(e.totalTime)}`);
                }
              }}
              onDOMLoaded={() => {
                debugLog("⚪ White Lottie DOM loaded - building up white ovals (1.5 seconds)");
              }}
            />
          </div>
        </div>
      )}
      
      {/* White Intro Ovals Lottie Animation for Navigation FROM Portfolio */}
      {shouldPlayWhiteIntroLottie && (
        <div 
          className="white-intro-lottie-overlay"
          ref={(el) => {
            if (el) {
              const mobileCSS = getMobileViewportCSS();
              el.style.cssText = `${mobileCSS} z-index: 2147483647 !important; pointer-events: none !important; overflow: hidden !important; background-color: transparent !important; display: flex !important; align-items: center !important; justify-content: center !important; isolation: isolate !important; transform: translateZ(0) !important;`;
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: getMobileViewportHeight(),
            zIndex: 2147483647, // Force maximum z-index above Webflow animations and menu
            pointerEvents: 'none',
            overflow: 'hidden',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            isolation: 'isolate',
            transform: 'translateZ(0)'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `max(100vw, ${getMobileViewportHeight()})`,
            height: `max(100vw, ${getMobileViewportHeight()})`,
            minWidth: '100vw',
            minHeight: getMobileViewportHeight()
          }}>
            <Lottie
              animationData={whiteOvalsIntroAnimation}
              loop={false}
              autoplay={true}
              style={{
                width: '100%',
                height: '100%'
              }}
              onComplete={() => {
                debugLog("⚪ White intro Lottie animation completed (45 frames = 1.5 seconds)");
                setShouldPlayWhiteIntroLottie(false);
                // Also reset 3D animation states to prevent conflicts
                setShouldPlayPortfolioToHome(false);
                // Block further white intro animations for a while
                whiteIntroBlocked.current = true;
                debugLog("⚪ White intro Lottie hidden - navigation from portfolio complete");
                debugLog("🚫 White intro blocked to prevent flashes");
              }}
              onEnterFrame={(e) => {
                // Only log every 10 frames to reduce spam
                if (Math.floor(e.currentTime) % 10 === 0) {
                  debugLog(`⚪ White intro frame: ${Math.floor(e.currentTime)} / ${Math.floor(e.totalTime)}`);
                }
              }}
              onDOMLoaded={() => {
                debugLog("⚪ White intro Lottie DOM loaded - shrinking white ovals (1.5 seconds)");
              }}
            />
          </div>
        </div>
      )}
      
      {/* White Overlay to Cover Glitches After Lottie Completes */}
      {showWhiteOverlay && (
        <div 
          className="white-overlay-cover"
          ref={(el) => {
            if (el) {
              const mobileCSS = getMobileViewportCSS();
              el.style.cssText = `${mobileCSS} z-index: 2147483647 !important; pointer-events: none !important; overflow: hidden !important; background-color: white !important; display: block !important; isolation: isolate !important; transform: translateZ(0) !important;`;
            }
          }}
        />
      )}
    </>
  );
}

// End of PageContent function

// Simplified app content for Webflow embedding - no routing needed
function AppContent() {
  useEffect(() => {
    // Send initial page view to Google Analytics
    const currentPath = window.location.pathname;
    if (typeof gtag !== 'undefined') {
      if (currentPath === '/contact-us' || currentPath.includes('contact')) {
        gtag('config', 'G-TK60C3SWSH', {
          page_title: 'Contact Us - Imagine This',
          page_location: window.location.href
        });
        debugLog("📊 GA: Initial Contact page view sent");
      } else {
        gtag('config', 'G-TK60C3SWSH', {
          page_title: '3D Interactive Web Design Studio | Immersive Websites by Imagine This LLC',
          page_location: window.location.href
        });
        debugLog("📊 GA: Initial Home page view sent");
      }
    }
    
    // Check for intended route from sessionStorage (for navigation from standalone pages)
    const intendedRoute = sessionStorage.getItem('intendedRoute');
    if (intendedRoute) {
      sessionStorage.removeItem('intendedRoute');
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (intendedRoute === '/contact-us' || intendedRoute === '/contact') {
          window.goToPath('/contact-us');
        }
      }, 200);
    }
  }, []);

  return <PageContent />;
}

export function App() {
  // No BrowserRouter needed for Webflow embedding
  return <AppContent />;
}

export default App;