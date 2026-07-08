'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PhotoFrame.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PhotoFrame({ src = '/images/profile.jpg', alt = 'Profile portrait' }) {
  const containerRef = useRef(null);
  const lanyardRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const lanyardEl = lanyardRef.current;
    const frameEl = frameRef.current;

    if (!container || !lanyardEl || !frameEl) return;

    // 1. Setup Matter.js Engine
    const { Engine, Runner, World, Bodies, Constraint, Mouse, MouseConstraint } = Matter;
    const engine = Engine.create();

    // Dimensions matched to your CSS
    const lanyardW = 230;
    const lanyardH = 180; 
    const cardW = 186;
    const cardH = 248;

    // 2. Anchor Positions
    const anchorX = 260 / 2; 
    const targetAnchorY = -20; 
    const startAnchorY = -350; 

    // 3. Create Bodies
    const anchor = Bodies.circle(anchorX, startAnchorY, 2, { isStatic: true });

    const lanyardBody = Bodies.rectangle(anchorX, startAnchorY + lanyardH / 2, lanyardW, lanyardH, {
      collisionFilter: { group: -1 }, 
      frictionAir: 0.04,
      density: 0.001,
    });

    const cardBody = Bodies.rectangle(anchorX, startAnchorY + lanyardH + cardH / 2, cardW, cardH, {
      restitution: 0.2, 
      frictionAir: 0.08, 
      density: 0.002, 
      collisionFilter: { group: -1 },
    });

    // 4. Create Constraints (The bouncy spring effect)
    const topHinge = Constraint.create({
      bodyA: anchor,
      bodyB: lanyardBody,
      pointA: { x: 0, y: 0 },
      pointB: { x: 0, y: -lanyardH / 2 },
      stiffness: 0.04, 
      damping: 0.03,
      length: 0
    });

    const bottomHinge = Constraint.create({
      bodyA: lanyardBody,
      bodyB: cardBody,
      pointA: { x: 0, y: lanyardH / 2 - 15 },
      pointB: { x: 0, y: -cardH / 2 + 15 },
      stiffness: 0.9, 
      length: 0
    });

    World.add(engine.world, [anchor, lanyardBody, cardBody, topHinge, bottomHinge]);

    // 5. Mouse Interaction & Repulsion
    const mouse = Mouse.create(container);
    
    // Unbind wheel/touch events so the user can scroll past the badge easily
    mouse.element.removeEventListener("wheel", mouse.mousewheel);
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    mouse.element.removeEventListener("touchstart", mouse.mousedown);
    mouse.element.removeEventListener("touchmove", mouse.mousemove);
    mouse.element.removeEventListener("touchend", mouse.mouseup);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: false }
      }
    });
    World.add(engine.world, mouseConstraint);

    // --- NEW: Hover Repulsion Logic ---
    const MAX_DISTANCE = 700; // How close the mouse needs to be to push it

    const handleMouseMove = (event) => {
      if (!frameEl) return;
      
      const rect = frameEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from mouse to center of the badge
      const awayX = centerX - event.clientX;
      const awayY = centerY - event.clientY;
      const distance = Math.hypot(awayX, awayY);

      if (distance < MAX_DISTANCE && distance > 0) {
        // Exponential force: pushes much harder as the mouse gets closer
        const force = 1 - distance / MAX_DISTANCE;
        const power = force * force * 0.025; 

        // Apply physical push to the Matter.js body
        Matter.Body.applyForce(cardBody, cardBody.position, {
          x: (awayX / distance) * power,
          y: (awayY / distance) * power
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Run Engine
    const runner = Runner.create();
    Runner.run(runner, engine);

    // 7. Sync Physics with React DOM
    let raf;
    const updateDOM = () => {
      if (lanyardEl && frameEl) {
        const maxAngle = 0.8; 
        if (cardBody.angle > maxAngle) Matter.Body.setAngle(cardBody, maxAngle);
        if (cardBody.angle < -maxAngle) Matter.Body.setAngle(cardBody, -maxAngle);

        lanyardEl.style.transform = `translate(${lanyardBody.position.x - lanyardW / 2}px, ${lanyardBody.position.y - lanyardH / 2}px) rotate(${lanyardBody.angle}rad)`;
        frameEl.style.transform = `translate(${cardBody.position.x - cardW / 2}px, ${cardBody.position.y - cardH / 2}px) rotate(${cardBody.angle}rad)`;
      }
      raf = requestAnimationFrame(updateDOM);
    };
    updateDOM();

    // 8. Entrance Animation Trigger 
    let dropTween;

    const triggerDrop = () => {
      if (dropTween) dropTween.kill();

      Matter.Body.setPosition(anchor, { x: anchorX, y: startAnchorY });
      Matter.Body.setPosition(lanyardBody, { x: anchorX, y: startAnchorY + lanyardH / 2 });
      Matter.Body.setPosition(cardBody, { x: anchorX, y: startAnchorY + lanyardH + cardH / 2 });

      Matter.Body.setVelocity(lanyardBody, { x: 0, y: 0 });
      Matter.Body.setVelocity(cardBody, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(lanyardBody, 0);
      Matter.Body.setAngularVelocity(cardBody, 0);

      const proxy = { y: startAnchorY };
      dropTween = gsap.to(proxy, {
        y: targetAnchorY,
        duration: 1.0,
        ease: 'power3.out', 
        onUpdate: () => {
          Matter.Body.setPosition(anchor, { x: anchorX, y: proxy.y });
        }
      });

      setTimeout(() => {
        Matter.Body.applyForce(cardBody, cardBody.position, { x: 0.012, y: 0 });
      }, 400); 
    };

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 85%',
      end: 'bottom 15%',
      onEnter: triggerDrop,     
      onEnterBack: triggerDrop, 
      onLeave: () => {
        if (dropTween) dropTween.kill();
        Matter.Body.setPosition(anchor, { x: anchorX, y: startAnchorY }); 
      },
      onLeaveBack: () => {
        if (dropTween) dropTween.kill();
        Matter.Body.setPosition(anchor, { x: anchorX, y: startAnchorY });
      }
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      trigger.kill();
      cancelAnimationFrame(raf);
      Runner.stop(runner);
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, [src]);

  return (
    <div ref={containerRef} className={styles.photoSlot}>
      <div ref={lanyardRef} className={styles.lanyard} aria-hidden="true">
        <span className={styles.ribbonLeft} />
        <span className={styles.ribbonRight} />
        <span className={styles.punchHole} />
      </div>

      <div ref={frameRef} className={styles.frame}>
        <span className={styles.energy} aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={styles.photo} />
      </div>
    </div>
  );
}