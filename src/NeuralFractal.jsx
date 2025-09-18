import React, { useRef, useEffect } from 'react'
import { useGLTF, PerspectiveCamera, useTexture, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'


import gsap from 'gsap'

const modelURL = 'https://imaginethiscode.netlify.app/FractalNeurals.glb'
//const modelURL = "http://localhost:5173/FractalNeurals.glb"


export default function Model({ focusRef, shouldPlayContactIntro, shouldPlayBackContact, shouldPlayHomeToPortfolio, shouldPlayPortfolioToHome, shouldPlayContactToPortfolio, ...props }) {
  const group = useRef()
  const glowingRef = useRef()
  const cameraRef = useRef()
  const wholeModel = useRef()
  const lastPlayedAnimation = useRef(null)

  const { nodes, materials, animations } = useGLTF(modelURL)
  const { actions } = useAnimations(animations, group)


  //const cameraAction = actions["Empty - CameraAction"]

  /** Play animations based on navigation */
  useEffect(() => {
    // Debug: Log all available animations

    
    const contractIntroAction = actions["ContractIntroAction"];
    const backwardsContactAction = actions["BackwardsContact"];
    const homeToPortfolioAction = actions["HomeToPortfolioAction"];
    const portfolioToHomeAction = actions["PortfolioToHomeAction"];
    const contactToPortfolioAction = actions["ContactToPortfolioAction"];

    if (!contractIntroAction || !backwardsContactAction || !homeToPortfolioAction || !portfolioToHomeAction || !contactToPortfolioAction) {



      return;
    }

    // Configure animations
    [contractIntroAction, backwardsContactAction, homeToPortfolioAction, portfolioToHomeAction, contactToPortfolioAction].forEach(action => {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    });

    const playAnimation = (action) => {
      // Stop all animations immediately
      Object.values(actions).forEach(a => {
        a.stop();
        a.enabled = false;
      });

      // Enable and play the target animation
      action.enabled = true;
      action.timeScale = 1;
      action.time = 0;
      action.play();
      lastPlayedAnimation.current = action;
    };

    if (shouldPlayContactIntro && lastPlayedAnimation.current !== contractIntroAction) {


      
      // If no previous animation was played (coming from external page), 
      // we might need to ensure the model is in the correct starting state
      if (!lastPlayedAnimation.current) {

        // Reset all actions to ensure clean state
        Object.values(actions).forEach(action => {
          action.stop();
          action.reset();
          action.enabled = false;
        });
      }
      
      playAnimation(contractIntroAction);
    } else if (shouldPlayBackContact && lastPlayedAnimation.current !== backwardsContactAction) {

      playAnimation(backwardsContactAction);
    } else if (shouldPlayHomeToPortfolio && lastPlayedAnimation.current !== homeToPortfolioAction) {


      
      // If no previous animation was played, reset to ensure clean state
      if (!lastPlayedAnimation.current) {

        Object.values(actions).forEach(action => {
          action.stop();
          action.reset();
          action.enabled = false;
        });
      }
      
      playAnimation(homeToPortfolioAction);
    } else if (shouldPlayContactToPortfolio && lastPlayedAnimation.current !== contactToPortfolioAction) {

      playAnimation(contactToPortfolioAction);
    } else if (shouldPlayPortfolioToHome && lastPlayedAnimation.current !== portfolioToHomeAction) {


      
      // If no previous animation was played, reset to ensure clean state
      if (!lastPlayedAnimation.current) {

        Object.values(actions).forEach(action => {
          action.stop();
          action.reset();
          action.enabled = false;
        });
      }
      
      playAnimation(portfolioToHomeAction);
    }

    return () => {
      // Don't stop animations on cleanup to maintain positions
    };
  }, [shouldPlayContactIntro, shouldPlayBackContact, shouldPlayHomeToPortfolio, shouldPlayContactToPortfolio, shouldPlayPortfolioToHome, actions]);


  // Set glowing mesh to layer 1
  useEffect(() => {
    if (glowingRef.current) {
      glowingRef.current.layers.set(1)
    }
  }, [])


/* Idle animation, mousemove, and device motion */

const baseTime = useRef(0)
const targetRotation = useRef({ x: 0, y: 0 })
const deviceMotionSupported = useRef(false)
const isDeviceMotionActive = useRef(false)

// Finger tracing refs
const fingerRotation = useRef({ x: 0, y: 0 })
const isFingerTracking = useRef(false)
const fingerMomentum = useRef({ x: 0, y: 0 })
const lastFingerPosition = useRef({ x: 0, y: 0 })
const lastFingerTime = useRef(0)

// Device detection (cached to prevent infinite loops)
const isMobileOrTablet = (() => {
  const userAgent = navigator.userAgent
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isTablet = (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform))
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  return isMobile || isTablet || hasTouch
})()

// Debug logging (console only, no visual overlay)
const debugLog = (message) => {
  console.log(message)
}

// Request device motion permission (required for modern mobile browsers)
const requestDeviceMotionPermission = async () => {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.log('Device motion permission error:', error.message)
      return false
    }
  }
  return true // Older mobile browsers don't need explicit permission
}

// Handle device orientation
useEffect(() => {
  if (!isMobileOrTablet) {
    return
  }

  const handleDeviceOrientation = (event) => {
    if (!isDeviceMotionActive.current) return

    // Get orientation values
    const { beta, gamma } = event // beta: front-back tilt, gamma: left-right tilt
    
    if (beta !== null && gamma !== null) {
      // Track initial orientation events
      if (!window.orientationEventCount) window.orientationEventCount = 0
      window.orientationEventCount++
      
      // Track orientation events

      // Dynamic orientation and device detection
      const isLandscape = window.innerWidth > window.innerHeight
      const isPortrait = window.innerHeight > window.innerWidth
      
      // Detect if it's a tablet based on screen size and touch capabilities
      const screenArea = window.innerWidth * window.innerHeight
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isTablet = hasTouch && screenArea > 500000 // Tablets typically have larger screen area
      
      let adjustedBeta, adjustedGamma
      
      if (isLandscape) {
        // Landscape mode - swap axes to match rotated grip (both phones and tablets)
        // When device is rotated 90° clockwise:
        // - Device gamma (left-right) becomes our up-down movement
        // - Device beta (front-back) becomes our left-right movement
        adjustedBeta = -gamma  // Swap gamma to beta (with inversion for correct direction)
        adjustedGamma = beta   // Swap beta to gamma
      } else {
        // Portrait mode - keep normal orientation
        adjustedBeta = beta
        adjustedGamma = gamma
      }
      
      // Normalize and scale the values for smooth movement
      const normalizedBeta = Math.max(-45, Math.min(45, adjustedBeta)) / 45 // Clamp to ±45 degrees
      const normalizedGamma = Math.max(-45, Math.min(45, adjustedGamma)) / 45 // Clamp to ±45 degrees
      
      // Adjust sensitivity based on device type and orientation
      let xSensitivity = isTablet ? 0.18 : 0.20  // Increased phone sensitivity
      let ySensitivity = isTablet ? 0.35 : 0.40   // Increased phone sensitivity
      
      // Increase sensitivity in landscape mode for more responsive device tilting
      if (isLandscape) {
        xSensitivity *= 1.4  // 40% more sensitive in landscape
        ySensitivity *= 1.4  // 40% more sensitive in landscape
      }
      
      const deviceRotation = {
        x: normalizedBeta * xSensitivity, // Front-back tilt affects X rotation
        y: normalizedGamma * ySensitivity, // Left-right tilt affects Y rotation
      }
      
      // Combine device orientation with finger tracing
      const combinedRotation = {
        x: deviceRotation.x + fingerRotation.current.x,
        y: deviceRotation.y + fingerRotation.current.y
      }
      
      targetRotation.current = combinedRotation
      
      // Log first successful motion update
      // Motion is working
    }
  }

  // Activate device motion when permission is granted by Webflow
  const activateDeviceMotion = () => {
    // Device motion activated
    deviceMotionSupported.current = true
    isDeviceMotionActive.current = true
    window.addEventListener('deviceorientation', handleDeviceOrientation)
    
    // Test if we're getting orientation events
    // Motion system ready
  }

  // Listen for permission granted event from Webflow
  const handlePermissionGranted = () => {
    // Permission event received
    activateDeviceMotion()
  }

  // Auto-activate device motion for mobile devices (permission handled by HTML)
  if (isMobileOrTablet) {
    activateDeviceMotion()
  }

  // Also listen for permission events from HTML
  if (window.deviceMotionPermissionGranted) {
    activateDeviceMotion()
  } else {
    window.addEventListener('deviceMotionPermissionGranted', handlePermissionGranted)
  }

  // Add orientation change listener for dynamic axis swapping
  const handleOrientationChange = () => {
    // Small delay to ensure window dimensions are updated
    setTimeout(() => {
      // Orientation changed - device motion will automatically adapt on next event
    }, 100)
  }
  
  window.addEventListener('orientationchange', handleOrientationChange)
  window.addEventListener('resize', handleOrientationChange)

  return () => {
    window.removeEventListener('deviceorientation', handleDeviceOrientation)
    window.removeEventListener('deviceMotionPermissionGranted', handlePermissionGranted)
    window.removeEventListener('orientationchange', handleOrientationChange)
    window.removeEventListener('resize', handleOrientationChange)
  }
}, [])

// Finger tracing motion system (works alongside device orientation)
useEffect(() => {
  if (!isMobileOrTablet) return // Only for touch devices

  const handleTouchStart = (event) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      isFingerTracking.current = true
      lastFingerPosition.current = { x: touch.clientX, y: touch.clientY }
      lastFingerTime.current = Date.now()
      
      // Reset momentum when starting new touch
      fingerMomentum.current = { x: 0, y: 0 }
      
      // Dispatch event to hide drag hint when finger tracing starts
      window.dispatchEvent(new CustomEvent('fingerTracingStarted'))
    }
  }

  const handleTouchMove = (event) => {
    if (!isFingerTracking.current || event.touches.length === 0) return
    
    event.preventDefault() // Prevent scrolling while tracing
    
    const touch = event.touches[0]
    const currentTime = Date.now()
    
    // Calculate finger position relative to screen center
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const fingerX = touch.clientX - centerX
    const fingerY = touch.clientY - centerY
    
           // Convert to rotation values (normalized to screen size)
           // Increase sensitivity for landscape mode
           const isLandscape = window.innerWidth > window.innerHeight
           const maxRotationX = isLandscape ? 0.8 : 0.6 // Increased base sensitivity
           const maxRotationY = isLandscape ? 0.8 : 0.5 // More sensitive in landscape
    
    const normalizedX = Math.max(-1, Math.min(1, fingerY / centerY)) // Up/down finger = X rotation
    const normalizedY = Math.max(-1, Math.min(1, fingerX / centerX)) // Left/right finger = Y rotation
    
    // Adjust the X rotation mapping for better vertical movement (reduced sensitivity)
    let adjustedX = normalizedX
    if (normalizedX > 0) {
      // Forward tilt (finger dragged down) - reduce to 20%
      adjustedX = normalizedX * 0.2
    } else {
      // Backward tilt (finger dragged up) - increase to 200%
      adjustedX = normalizedX * 2.0
    }
    
    // Increase left/right sensitivity in landscape mode
    const landscapeYMultiplier = isLandscape ? 1.3 : 1.0
    
    fingerRotation.current = {
      x: adjustedX * maxRotationX * 0.7, // Reduce overall finger sensitivity
      y: normalizedY * maxRotationY * landscapeYMultiplier
    }
    
    // If device motion is not active, use finger tracing as primary motion
    if (!isDeviceMotionActive.current) {
      targetRotation.current = {
        x: fingerRotation.current.x,
        y: fingerRotation.current.y
      }
    }
    
    // Calculate velocity for momentum (if finger moves quickly)
    const deltaTime = currentTime - lastFingerTime.current
    if (deltaTime > 0) {
      const deltaX = touch.clientX - lastFingerPosition.current.x
      const deltaY = touch.clientY - lastFingerPosition.current.y
      
      fingerMomentum.current = {
        x: (deltaY / deltaTime) * 0.001, // Convert to rotation velocity
        y: (deltaX / deltaTime) * 0.001
      }
    }
    
    lastFingerPosition.current = { x: touch.clientX, y: touch.clientY }
    lastFingerTime.current = currentTime
  }

  const handleTouchEnd = () => {
    isFingerTracking.current = false
    
    // Apply momentum decay over time
    const decayMomentum = () => {
      if (!isFingerTracking.current && (Math.abs(fingerMomentum.current.x) > 0.001 || Math.abs(fingerMomentum.current.y) > 0.001)) {
        // Gradually reduce finger rotation with momentum
        fingerRotation.current.x += fingerMomentum.current.x
        fingerRotation.current.y += fingerMomentum.current.y
        
        // Apply decay to momentum
        fingerMomentum.current.x *= 0.95
        fingerMomentum.current.y *= 0.95
        
        // Gradually return finger rotation to neutral
        fingerRotation.current.x *= 0.98
        fingerRotation.current.y *= 0.98
        
        requestAnimationFrame(decayMomentum)
      } else {
        // Reset when momentum is negligible
        fingerMomentum.current = { x: 0, y: 0 }
        fingerRotation.current = { x: 0, y: 0 }
      }
    }
    
    requestAnimationFrame(decayMomentum)
  }

  // Add touch event listeners
  window.addEventListener('touchstart', handleTouchStart, { passive: false })
  window.addEventListener('touchmove', handleTouchMove, { passive: false })
  window.addEventListener('touchend', handleTouchEnd)
  window.addEventListener('touchcancel', handleTouchEnd)

  return () => {
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
    window.removeEventListener('touchcancel', handleTouchEnd)
  }
}, [])

// Heavy scroll navigation system (all devices)
useEffect(() => {
  let startY = 0
  let startTime = 0
  let isScrolling = false
  let wheelAccumulator = 0
  let wheelTimeout = null
  
  // Touch events for mobile/tablet
  const handleScrollTouchStart = (event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0]
      startY = touch.clientY
      startTime = Date.now()
      isScrolling = false
      console.log('🔄 Scroll touch start:', startY)
    }
  }
  
  // Wheel events for desktop (immediate response)
  const handleWheel = (event) => {
    if (isScrolling) return
    
    // Accumulate wheel delta
    wheelAccumulator += event.deltaY
    const absAccumulator = Math.abs(wheelAccumulator)
    
    // Clear previous timeout
    if (wheelTimeout) {
      clearTimeout(wheelTimeout)
    }
    
    // Immediate check for heavy scroll (no delay)
    if (absAccumulator > 80) { // Lower threshold for faster response
      // Get current page state to determine navigation direction
      const currentPage = window.getCurrentPageState ? window.getCurrentPageState() : 'home'
      
      if (wheelAccumulator > 0 && currentPage === 'home') {
        // Scrolling down from home → trigger contact navigation
        console.log('⬇️ Wheel: Home → Contact')
        
        // Prevent multiple attempts
        isScrolling = true
        wheelAccumulator = 0 // Reset immediately
        
        // Dispatch the exact same pageStateChange event as the contact button
        const navEvent = new CustomEvent('pageStateChange', {
          detail: { from: 'home', to: 'contact' }
        })
        window.dispatchEvent(navEvent)
        
        // Call the same goToPath function as the contact button
        if (window.goToPath) {
          window.goToPath("/contact-us")
        }
        
        // Reset scrolling flag after animation completes
        setTimeout(() => {
          isScrolling = false
        }, 2000)
        
        // Prevent default scrolling
        event.preventDefault()
        return
        
      } else if (wheelAccumulator < 0 && currentPage === 'contact') {
        // Scrolling up from contact → trigger home navigation
        console.log('⬆️ Wheel: Contact → Home')
        
        // Prevent multiple attempts
        isScrolling = true
        wheelAccumulator = 0 // Reset immediately
        
        // Dispatch the exact same pageStateChange event as the home button
        const navEvent = new CustomEvent('pageStateChange', {
          detail: { from: 'contact', to: 'home' }
        })
        window.dispatchEvent(navEvent)
        
        // Call the same goToPath function as the home button
        if (window.goToPath) {
          window.goToPath("/")
        }
        
        // Reset scrolling flag after animation completes
        setTimeout(() => {
          isScrolling = false
        }, 2000)
        
        // Prevent default scrolling
        event.preventDefault()
        return
        
      } else if (wheelAccumulator > 0 && currentPage === 'contact') {
        // Scrolling down from contact → trigger portfolio navigation
        console.log('⬇️ Wheel: Contact → Portfolio')
        
        // Prevent multiple attempts
        isScrolling = true
        wheelAccumulator = 0 // Reset immediately
        
        // Trigger the exact same contact to portfolio animation as the portfolio button
        const animEvent = new CustomEvent('directContactPortfolioAnimation')
        window.dispatchEvent(animEvent)
        
        // Start oval animation and navigation after delay (same as button click)
        setTimeout(() => {
          if (window.playOvalExpandAnimation) {
            window.playOvalExpandAnimation(() => {
              // Navigate to portfolio page after oval animation completes
              window.location.href = `${window.location.origin}/portfolio.html`
            })
          } else {
            // Fallback navigation without oval animation
            setTimeout(() => {
              window.location.href = `${window.location.origin}/portfolio.html`
            }, 800)
          }
        }, 1300) // Same timing as portfolio button
        
        // Reset scrolling flag after full animation sequence
        setTimeout(() => {
          isScrolling = false
        }, 3000) // Longer timeout for full navigation
        
        // Prevent default scrolling
        event.preventDefault()
        return
      }
    }
    
    // Reset accumulator after short delay if no navigation triggered
    wheelTimeout = setTimeout(() => {
      wheelAccumulator = 0
    }, 50) // Very short reset delay
  }
  
  // Touch move for mobile/tablet (using same system as desktop)
  const handleScrollTouchMove = (event) => {
    if (event.touches.length !== 1 || isScrolling) return
    
    const touch = event.touches[0]
    const currentY = touch.clientY
    const currentTime = Date.now()
    
    const deltaY = startY - currentY
    const deltaX = Math.abs(touch.clientX - (window.innerWidth / 2))
    const distance = Math.abs(deltaY)
    const duration = currentTime - startTime
    const velocity = distance / (duration || 1) * 1000 // px/second
    
    // Touch-based heavy scroll detection (more lenient for mobile)
    const isHeavyScroll = (
      velocity > 200 &&                              // Fast movement (reduced for touch)
      distance > 40 &&                               // Significant distance
      duration < 1000 &&                             // Quick gesture
      duration > 50 &&                               // Not too quick (avoid accidental)
      Math.abs(deltaY) > Math.abs(deltaX) * 0.6     // Mostly vertical (more lenient)
    )
    
    if (isHeavyScroll) {
      isScrolling = true
      console.log('🚀 Heavy touch scroll detected!')
      
      // Get current page state to determine navigation direction
      const currentPage = window.getCurrentPageState ? window.getCurrentPageState() : 'home'
      
      if (deltaY > 0 && currentPage === 'home') {
        // Scrolling down from home → trigger contact navigation
        console.log('⬇️ Touch: Home → Contact')
        
        // Dispatch the exact same pageStateChange event as the contact button
        const event = new CustomEvent('pageStateChange', {
          detail: { from: 'home', to: 'contact' }
        })
        window.dispatchEvent(event)
        
        // Call the same goToPath function as the contact button
        if (window.goToPath) {
          window.goToPath("/contact-us")
        }
        
        // Reset scrolling flag after animation completes
        setTimeout(() => {
          isScrolling = false
        }, 2000)
        
      } else if (deltaY < 0 && currentPage === 'contact') {
        // Scrolling up from contact → trigger home navigation
        console.log('⬆️ Touch: Contact → Home')
        
        // Dispatch the exact same pageStateChange event as the home button
        const navEvent = new CustomEvent('pageStateChange', {
          detail: { from: 'contact', to: 'home' }
        })
        window.dispatchEvent(navEvent)
        
        // Call the same goToPath function as the home button
        if (window.goToPath) {
          window.goToPath("/")
        }
        
        // Reset scrolling flag after animation completes
        setTimeout(() => {
          isScrolling = false
        }, 2000)
        
      } else if (deltaY > 0 && currentPage === 'contact') {
        // Scrolling down from contact → trigger portfolio navigation
        console.log('⬇️ Touch: Contact → Portfolio')
        
        // Trigger the exact same contact to portfolio animation as the portfolio button
        const animEvent = new CustomEvent('directContactPortfolioAnimation')
        window.dispatchEvent(animEvent)
        
        // Start oval animation and navigation after delay (same as button click)
        setTimeout(() => {
          if (window.playOvalExpandAnimation) {
            window.playOvalExpandAnimation(() => {
              // Navigate to portfolio page after oval animation completes
              window.location.href = `${window.location.origin}/portfolio.html`
            })
          } else {
            // Fallback navigation without oval animation
            setTimeout(() => {
              window.location.href = `${window.location.origin}/portfolio.html`
            }, 800)
          }
        }, 1300) // Same timing as portfolio button
        
        // Reset scrolling flag after full animation sequence
        setTimeout(() => {
          isScrolling = false
        }, 3000) // Longer timeout for full navigation
      }
      
      // Prevent default scrolling during heavy scroll navigation
      event.preventDefault()
    }
  }
  
  const handleScrollTouchEnd = () => {
    isScrolling = false
    console.log('🔄 Scroll touch end')
  }
  
  // Add scroll navigation listeners with priority handling
  let scrollTouchStartTime = 0
  let scrollTouchId = null
  
  // Enhanced touch start to avoid conflicts with finger tracing
  const handleScrollTouchStartEnhanced = (event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0]
      scrollTouchId = touch.identifier
      scrollTouchStartTime = Date.now()
      handleScrollTouchStart(event)
    }
  }
  
  // Enhanced touch move to prioritize scroll detection over finger tracing
  const handleScrollTouchMoveEnhanced = (event) => {
    if (event.touches.length === 1 && scrollTouchId !== null) {
      const touch = event.touches[0]
      if (touch.identifier === scrollTouchId) {
        const currentTime = Date.now()
        const timeSinceStart = currentTime - scrollTouchStartTime
        
        // If it's been less than 300ms and moving fast, prioritize scroll detection
        if (timeSinceStart < 300) {
          handleScrollTouchMove(event)
        }
      }
    }
  }
  
  // Enhanced touch end
  const handleScrollTouchEndEnhanced = () => {
    scrollTouchId = null
    scrollTouchStartTime = 0
    handleScrollTouchEnd()
  }
  
  // Touch events for mobile/tablet (with conflict resolution)
  if (isMobileOrTablet) {
    window.addEventListener('touchstart', handleScrollTouchStartEnhanced, { passive: true })
    window.addEventListener('touchmove', handleScrollTouchMoveEnhanced, { passive: false })
    window.addEventListener('touchend', handleScrollTouchEndEnhanced, { passive: true })
  }
  
  // Wheel events for desktop (no conflict with existing mouse move)
  window.addEventListener('wheel', handleWheel, { passive: false })
  
  return () => {
    if (isMobileOrTablet) {
      window.removeEventListener('touchstart', handleScrollTouchStartEnhanced)
      window.removeEventListener('touchmove', handleScrollTouchMoveEnhanced)
      window.removeEventListener('touchend', handleScrollTouchEndEnhanced)
    }
    window.removeEventListener('wheel', handleWheel)
    
    // Clear any pending wheel timeout
    if (wheelTimeout) {
      clearTimeout(wheelTimeout)
    }
  }
}, [])

// Track mouse movement relative to screen (fallback for desktop)
useEffect(() => {
  if (isMobileOrTablet) return // Skip mouse events on mobile devices

  const handleMouseMove = event => {
    const canvas = document.getElementById("root")
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    // Normalize to range [-1, 1], then scale
    targetRotation.current = {
      x: (y - 0.5) * 0.1,
      y: (x - 0.5) * 0.3,
    }
  }

  document.addEventListener("mousemove", handleMouseMove)
  return () => document.removeEventListener("mousemove", handleMouseMove)
}, [])

useFrame((_, delta) => {
  if (!wholeModel.current) return

  baseTime.current += delta

  // Base idle animation (slow sway)
  const idleX = Math.sin(baseTime.current * 0.5) * 0.04
  const idleY = Math.cos(baseTime.current * 0.5) * 0.08

  // Combined target rotation
  const finalX = idleX + targetRotation.current.x
  const finalY = idleY + targetRotation.current.y

  // Smoothly interpolate (lerp)
  wholeModel.current.rotation.x += (finalX - wholeModel.current.rotation.x) * 0.03
  wholeModel.current.rotation.y += (finalY - wholeModel.current.rotation.y) * 0.03
})

/* Idle animation and mousemove ENDS*/

  return (
      <group ref={group} {...props} dispose={null} >
      <pointLight
        intensity={0.054351413}
        decay={2}
        position={[4.076, 5.904, -1.005]}
        rotation={[-1.839, 0.602, 1.932]}
      />
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
      <group ref={wholeModel}>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes.NeuralFractal.geometry}
        material={materials.NeuralMaterial}
        position={[0.022, 0, -0.024]}
        rotation={[Math.PI, 0, Math.PI]}
      />

        <mesh
          ref={glowingRef}
          castShadow
          receiveShadow
          geometry={nodes.Spheres.geometry}
          //material={materials.Spheres}
          position={[0, 0.853, 0]}
          rotation={[Math.PI, 0, Math.PI]}
        >
      
        <meshStandardMaterial
                  //color="#c7eded"
                  color="#3a73ff"
                  emissive={[0.78 * 2, 0.93 * 2, 0.93 * 2]}
                  emissiveIntensity={1.5}
                  toneMapped={false}
                />
      
        </mesh>
      </group>
      <pointLight
        intensity={0.0363054}
        decay={2}
        color="#3a73ff"
        position={[-0.004, 0.526, -0.131]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <spotLight
        intensity={0.0463054}
        angle={Math.PI / 8}
        penumbra={0.15}
        decay={2}
        color="#ffe58e"
        position={[0, 1.523, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
         <mesh
        castShadow
        receiveShadow
        geometry={nodes.FocusTarget.geometry}
        material={nodes.FocusTarget.material}
        position={[-0.199, 0.788, 0.054]}
        ref={focusRef}
        visible={false}
      />
</group>

    
  )
}

useGLTF.preload(modelURL)

