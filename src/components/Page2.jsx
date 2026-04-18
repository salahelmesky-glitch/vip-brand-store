import { useRef, useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useAdmin } from '../context/AdminContext';

const WHATSAPP = '201006527185';

/* ═══════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════ */
const COLORS = [
  { id: 'white', label: 'أبيض', hex: '#f0f0f0' },
  { id: 'black', label: 'أسود', hex: '#1a1a1a' },
  { id: 'red', label: 'أحمر', hex: '#c62828' },
  { id: 'navy', label: 'كحلي', hex: '#1a237e' },
  { id: 'gray', label: 'رمادي', hex: '#616161' },
  { id: 'olive', label: 'زيتي', hex: '#33691e' },
];

const SIZES = [
  { id: 'M', label: 'M', price: 350 },
  { id: 'L', label: 'L', price: 375 },
  { id: 'XL', label: 'XL', price: 400 },
  { id: 'XXL', label: 'XXL', price: 425 },
];

/* ═══════════════════════════════════════════════════
   PROCEDURAL T-SHIRT GEOMETRY
   Wide oversized crew-neck with realistic proportions
   ═══════════════════════════════════════════════════ */
function createTShirtBody() {
  const segments = 48;
  const profiles = [
    { y: -1.20, rx: 0.72, rz: 0.42 },
    { y: -1.15, rx: 0.73, rz: 0.42 },
    { y: -1.05, rx: 0.73, rz: 0.42 },
    { y: -0.90, rx: 0.72, rz: 0.41 },
    { y: -0.70, rx: 0.71, rz: 0.40 },
    { y: -0.45, rx: 0.69, rz: 0.39 },
    { y: -0.20, rx: 0.68, rz: 0.38 },
    { y: 0.00, rx: 0.68, rz: 0.38 },
    { y: 0.20, rx: 0.70, rz: 0.39 },
    { y: 0.35, rx: 0.72, rz: 0.40 },
    { y: 0.50, rx: 0.74, rz: 0.41 },
    { y: 0.60, rx: 0.75, rz: 0.41 },
    { y: 0.70, rx: 0.75, rz: 0.40 },
    { y: 0.78, rx: 0.72, rz: 0.38 },
    { y: 0.84, rx: 0.58, rz: 0.32 },
    { y: 0.88, rx: 0.40, rz: 0.26 },
    { y: 0.92, rx: 0.26, rz: 0.22 },
    { y: 0.96, rx: 0.19, rz: 0.18 },
    { y: 1.00, rx: 0.18, rz: 0.17 },
  ];

  const verts = [], norms = [], uvs = [], idxs = [];
  for (let p = 0; p < profiles.length; p++) {
    const { y, rx, rz } = profiles[p];
    const v = p / (profiles.length - 1);
    for (let s = 0; s <= segments; s++) {
      const angle = (s / segments) * Math.PI * 2;
      const u = s / segments;
      const frontBulge = Math.max(0, -Math.sin(angle)) * 0.03;
      verts.push(Math.cos(angle) * rx, y, Math.sin(angle) * rz + frontBulge);
      uvs.push(u, 1 - v);
      norms.push(Math.cos(angle), 0, Math.sin(angle));
    }
  }
  for (let p = 0; p < profiles.length - 1; p++) {
    for (let s = 0; s < segments; s++) {
      const a = p * (segments + 1) + s;
      const b = a + 1;
      const c = a + (segments + 1);
      const d = c + 1;
      idxs.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norms, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idxs);
  geo.computeVertexNormals();
  return geo;
}

function createSleeveGeo() {
  const segs = 20, rings = 8;
  const verts = [], norms = [], uvs = [], idxs = [];
  for (let r = 0; r <= rings; r++) {
    const t = r / rings;
    const radius = 0.30 + (0.22 - 0.30) * t;
    const y = -t * 0.42;
    for (let s = 0; s <= segs; s++) {
      const angle = (s / segs) * Math.PI * 2;
      verts.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      norms.push(Math.cos(angle), 0, Math.sin(angle));
      uvs.push(s / segs, t);
    }
  }
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < segs; s++) {
      const a = r * (segs + 1) + s;
      const b = a + 1;
      const c = a + (segs + 1);
      const d = c + 1;
      idxs.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norms, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idxs);
  geo.computeVertexNormals();
  return geo;
}

/* ═══════════════════════════════════════════════════
   CANVAS TEXTURE MANAGER
   Paints color + design directly on fabric for
   a PRINTED look (not a floating plane)
   ═══════════════════════════════════════════════════ */
function useBodyTexture(color, designImg) {
  const texRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  if (!canvasRef.current) {
    canvasRef.current = document.createElement('canvas');
    canvasRef.current.width = 1024;
    canvasRef.current.height = 1024;
    ctxRef.current = canvasRef.current.getContext('2d');
    texRef.current = new THREE.CanvasTexture(canvasRef.current);
    texRef.current.colorSpace = THREE.SRGBColorSpace;
  }

  useEffect(() => {
    const ctx = ctxRef.current;
    const W = 1024, H = 1024;

    // 1) Base color fill
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, W, H);

    // 2) Subtle fabric grain noise
    ctx.globalAlpha = 0.035;
    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
      ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
    }
    ctx.globalAlpha = 1;

    // 3) Draw design on FRONT face
    // UV: front is at U=0.25, chest center ≈ UV.v=0.5
    if (designImg && designImg.complete && designImg.naturalWidth > 0) {
      const dw = 310, dh = 370;
      const dx = W * 0.25 - dw / 2;
      const dy = H * 0.44 - dh / 2;
      ctx.globalAlpha = 0.94;
      ctx.drawImage(designImg, dx, dy, dw, dh);
      ctx.globalAlpha = 1;
    }

    texRef.current.needsUpdate = true;
  }, [color, designImg]);

  return texRef.current;
}

/* ═══════════════════════════════════════════════════
   3D T-SHIRT MODEL (R3F Component)
   ═══════════════════════════════════════════════════ */
const bodyGeoCache = { current: null };
const sleeveGeoCache = { current: null };

function TShirtModel({ color, designImg }) {
  const groupRef = useRef();
  const bodyTexture = useBodyTexture(color, designImg);

  // Cache geometries (create once)
  if (!bodyGeoCache.current) bodyGeoCache.current = createTShirtBody();
  if (!sleeveGeoCache.current) sleeveGeoCache.current = createSleeveGeo();

  // Subtle floating animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.7) * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body — uses canvas texture (design PRINTED on fabric) */}
      <mesh geometry={bodyGeoCache.current}>
        <meshStandardMaterial
          map={bodyTexture}
          roughness={0.78}
          metalness={0.0}
          side={THREE.DoubleSide}
          color="#ffffff"
        />
      </mesh>

      {/* Left Sleeve */}
      <mesh geometry={sleeveGeoCache.current} position={[-0.72, 0.68, 0]} rotation={[0.08, 0, 0.65]}>
        <meshStandardMaterial color={color} roughness={0.78} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Right Sleeve */}
      <mesh geometry={sleeveGeoCache.current} position={[0.72, 0.68, 0]} rotation={[0.08, 0, -0.65]}>
        <meshStandardMaterial color={color} roughness={0.78} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.185, 0.025, 8, 48]} />
        <meshStandardMaterial color={color} roughness={0.78} metalness={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   GLB MODEL LOADER (for when user uploads .glb)
   ═══════════════════════════════════════════════════ */
function GLBTShirtModel({ url, color, designImg }) {
  const { scene } = useGLTF(url);
  const bodyTexture = useBodyTexture(color, designImg);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: bodyTexture,
          roughness: 0.78,
          metalness: 0.0,
          side: THREE.DoubleSide,
          color: 0xffffff,
        });
      }
    });
  }, [scene, bodyTexture]);

  return <primitive object={scene} />;
}

/* ═══════════════════════════════════════════════════
   SHOWCASE STAGE (platform + neon ring)
   ═══════════════════════════════════════════════════ */
function ShowcaseStage() {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.material.opacity = 0.4 + Math.sin(clock.getElapsedTime() * 2.5) * 0.15;
    }
  });

  return (
    <group>
      {/* Dark reflective platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.3, 0.08, 64]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.15} metalness={0.9} />
      </mesh>

      {/* Neon green ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.30, 0]}>
        <ringGeometry args={[1.22, 1.26, 64]} />
        <meshBasicMaterial color="#00ff66" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.29, 0]}>
        <ringGeometry args={[1.10, 1.14, 64]} />
        <meshBasicMaterial color="#00ff66" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   CINEMATIC LIGHTING (matching VIP Brand Showcase)
   ═══════════════════════════════════════════════════ */
function CinematicLights() {
  return (
    <>
      {/* Ambient fill — strong enough to see the shirt */}
      <ambientLight intensity={0.7} color="#d0d8e8" />

      {/* Key light — main from upper-right front */}
      <spotLight
        position={[3, 5, 5]}
        intensity={3.0}
        angle={0.6}
        penumbra={0.5}
        color="#ffffff"
        castShadow
      />

      {/* Fill light — from left front */}
      <spotLight
        position={[-4, 3, 4]}
        intensity={1.5}
        angle={0.6}
        penumbra={0.7}
        color="#ddeeff"
      />

      {/* Front light — direct illumination */}
      <directionalLight position={[0, 2, 6]} intensity={1.0} color="#ffffff" />

      {/* Rim/back light */}
      <spotLight
        position={[0, 3, -4]}
        intensity={0.8}
        angle={0.5}
        penumbra={0.5}
        color="#ffffff"
      />

      {/* Top spotlight */}
      <spotLight
        position={[0, 8, 0]}
        intensity={1.0}
        angle={0.4}
        penumbra={0.4}
        color="#f0f0ff"
      />

      {/* Green accent from neon ring */}
      <pointLight position={[0, -1.2, 0]} intensity={0.3} color="#00ff66" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   THE FULL 3D SCENE
   ═══════════════════════════════════════════════════ */
function Scene3D({ color, designImg, glbUrl }) {
  return (
    <>
      <CinematicLights />

      {/* Very subtle distant fog only */}
      <fog attach="fog" args={['#050010', 8, 25]} />

      {/* T-Shirt Model — GLB or procedural */}
      <Suspense fallback={null}>
        {glbUrl ? (
          <GLBTShirtModel url={glbUrl} color={color} designImg={designImg} />
        ) : (
          <TShirtModel color={color} designImg={designImg} />
        )}
      </Suspense>

      {/* Showcase Stage */}
      <ShowcaseStage />

      {/* Contact shadows under the shirt */}
      <ContactShadows
        position={[0, -1.31, 0]}
        opacity={0.4}
        scale={4}
        blur={2.5}
        far={4}
        color="#000000"
      />

      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        enableZoom
        minDistance={3.5}
        maxDistance={8}
        enablePan={false}
        autoRotate
        autoRotateSpeed={2.0}
        target={[0, -0.1, 0]}
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.7}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   UI COMPONENTS
   ═══════════════════════════════════════════════════ */
function ColorSelector({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {COLORS.map((c) => {
        const sel = active === c.hex;
        return (
          <button key={c.id} onClick={() => onChange(c.hex)} title={c.label}
            style={{
              width: 44, height: 44, borderRadius: '50%', background: c.hex,
              border: sel ? '3px solid #00ff66' : '2px solid rgba(255,255,255,0.12)',
              cursor: 'pointer', transition: 'all 0.3s', outline: 'none', position: 'relative',
              boxShadow: sel ? '0 0 14px rgba(0,255,102,0.5)' : 'none',
            }}
          >
            {sel && (
              <svg viewBox="0 0 24 24" fill="none" stroke={c.id === 'white' || c.id === 'gray' ? '#111' : '#fff'} strokeWidth="3" strokeLinecap="round" style={{ width: 18, height: 18, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

function SizeSelector({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {SIZES.map((s) => {
        const sel = active === s.id;
        return (
          <button key={s.id} onClick={() => onChange(s.id)}
            style={{
              flex: 1, padding: '12px 0', borderRadius: 10,
              background: sel ? 'rgba(0,255,102,0.12)' : 'rgba(255,255,255,0.03)',
              border: sel ? '1.5px solid #00ff66' : '1px solid rgba(255,255,255,0.08)',
              color: sel ? '#00ff66' : '#999', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.3s', outline: 'none',
              boxShadow: sel ? '0 0 12px rgba(0,255,102,0.2)' : 'none',
            }}
          >{s.label}</button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE 2 — PREMIUM T-SHIRT CUSTOMIZER
   ═══════════════════════════════════════════════════ */
export default function Page2() {
  const { products } = useAdmin();
  const [shirtColor, setShirtColor] = useState('#616161');
  const [size, setSize] = useState('L');
  const [designUrl, setDesignUrl] = useState(null);
  const [designImg, setDesignImg] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [glbUrl, setGlbUrl] = useState(null);
  const fileInputRef = useRef(null);
  const glbInputRef = useRef(null);

  const selectedSize = SIZES.find((s) => s.id === size) || SIZES[1];
  const price = selectedProduct ? (selectedProduct.price || selectedSize.price) : selectedSize.price;

  /* Load design image whenever URL changes */
  useEffect(() => {
    if (!designUrl) { setDesignImg(null); return; }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setDesignImg(img);
    img.onerror = () => setDesignImg(null);
    img.src = designUrl;
  }, [designUrl]);

  /* Select a product from the gallery */
  const selectProduct = useCallback((product) => {
    setSelectedProduct(product);
    setDesignUrl(product.img);
  }, []);

  /* Upload custom design */
  const handleDesignUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setDesignUrl(evt.target.result);
    reader.readAsDataURL(file);
  }, []);

  /* Upload GLB model */
  const handleGlbUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setGlbUrl(url);
  }, []);

  const removeDesign = useCallback(() => {
    setDesignUrl(null);
    setDesignImg(null);
    setSelectedProduct(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const colorLabel = COLORS.find((c) => c.hex === shirtColor)?.label || shirtColor;
  const designLabel = selectedProduct
    ? `تصميم: ${selectedProduct.name || selectedProduct.nameAr}`
    : designUrl ? 'تصميم مخصوص' : 'سادة بدون تصميم';
  const waText = encodeURIComponent(
    `مرحباً VIP! 👋\nحابب أطلب تيشيرت مخصوص:\n` +
    `🎨 اللون: ${colorLabel}\n📏 المقاس: ${size}\n💰 السعر: ${price} EGP\n🎯 ${designLabel}\n`
  );
  const waLink = `https://wa.me/${WHATSAPP}?text=${waText}`;

  return (
    <div style={{ background: '#050010', minHeight: '100vh', color: '#f2f2f7', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'rgba(5,0,16,0.88)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#aaa', fontSize: 12, letterSpacing: '0.1em' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
          VIP BRAND
        </Link>
        <span style={{ fontSize: 10, letterSpacing: '0.3em', color: '#00ff66', textTransform: 'uppercase', fontWeight: 600 }}>
          ★ T-Shirt Studio ★
        </span>
      </header>

      {/* Main Grid */}
      <div className="p2-grid" style={{ display: 'grid', minHeight: '100vh', paddingTop: 52 }}>

        {/* ═══ 3D VIEWER (R3F Canvas) ═══ */}
        <div style={{ position: 'relative', minHeight: 380 }}>
          <Canvas
            camera={{ position: [0, 0.2, 5.5], fov: 38 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.6 }}
            style={{ background: '#050010', touchAction: 'none' }}
          >
            <Scene3D color={shirtColor} designImg={designImg} glbUrl={glbUrl} />
          </Canvas>

          {/* Bottom hint */}
          <div style={{
            position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center',
            fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', pointerEvents: 'none',
          }}>
            🖱️ DRAG TO ROTATE · SCROLL TO ZOOM · حرّكه بإصبعك
          </div>
        </div>

        {/* ═══ CONTROL PANEL ═══ */}
        <div style={{
          padding: '20px', overflowY: 'auto',
          borderLeft: '1px solid rgba(255,255,255,0.04)',
          background: 'linear-gradient(180deg, rgba(15,5,30,0.95), rgba(5,0,16,0.98))',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>

          {/* Title */}
          <div>
            <p style={{ fontSize: 9, letterSpacing: '0.5em', color: '#00ff66', textTransform: 'uppercase', margin: 0 }}>
              VIP BRAND SHOWCASE
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: 1, lineHeight: 1.2, margin: '4px 0 0' }}>
              صمّم تيشيرتك
            </h1>
            <p style={{ fontSize: 12, color: '#666', marginTop: 3 }}>
              عرض 3D فاخر · Design Your Premium T-Shirt
            </p>
          </div>

          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,255,102,0.25), transparent)' }} />

          {/* Color */}
          <div>
            <label style={sLabel}>🎨 اللون · COLOR</label>
            <ColorSelector active={shirtColor} onChange={setShirtColor} />
          </div>

          {/* Size */}
          <div>
            <label style={sLabel}>📏 المقاس · SIZE</label>
            <SizeSelector active={size} onChange={setSize} />
          </div>

          {/* Price */}
          <div style={{
            padding: '14px 16px', borderRadius: 12,
            background: 'rgba(0,255,102,0.04)', border: '1px solid rgba(0,255,102,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 12, color: '#aaa' }}>السعر / Price</span>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#00ff66', fontFamily: 'monospace' }}>
              {price} <span style={{ fontSize: 12, fontWeight: 600, color: '#66ffaa' }}>EGP</span>
            </span>
          </div>

          {/* ═══ PRODUCT GALLERY ═══ */}
          <div>
            <label style={sLabel}>👕 اختار تصميم · CHOOSE DESIGN</label>
            <div style={{
              display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8,
              scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,255,102,0.3) transparent',
            }}>
              {products.slice(0, 20).map((product) => {
                const sel = selectedProduct?.id === product.id;
                return (
                  <button key={product.id} onClick={() => selectProduct(product)} style={{
                    flexShrink: 0, width: 72, height: 72, borderRadius: 10, overflow: 'hidden',
                    cursor: 'pointer', padding: 0, background: '#111', position: 'relative',
                    border: sel ? '2px solid #00ff66' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: sel ? '0 0 14px rgba(0,255,102,0.4)' : 'none',
                    transition: 'all 0.3s', outline: 'none',
                  }}>
                    <img src={product.img} alt={product.name} loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    {sel && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,255,102,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#00ff66" strokeWidth="3" strokeLinecap="round" style={{ width: 24, height: 24 }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedProduct && (
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#00ff66' }}>✅ {selectedProduct.name || selectedProduct.nameAr}</span>
                <button onClick={removeDesign} style={{ fontSize: 10, color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', outline: 'none' }}>
                  إزالة
                </button>
              </div>
            )}
          </div>

          {/* ═══ UPLOAD DESIGN ═══ */}
          <div>
            <label style={sLabel}>🖼️ ارفع تصميمك · UPLOAD</label>
            <button onClick={() => fileInputRef.current?.click()} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              width: '100%', padding: 16, borderRadius: 12,
              background: 'rgba(255,255,255,0.02)', border: '1.5px dashed rgba(0,255,102,0.3)',
              cursor: 'pointer', outline: 'none',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ff66" strokeWidth="1.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#00ff66' }}>ارفع تصميمك</span>
              <span style={{ fontSize: 10, color: '#555' }}>يظهر مطبوع على القماش 3D</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleDesignUpload} style={{ display: 'none' }} />

            {designUrl && !selectedProduct && (
              <div style={{
                marginTop: 10, padding: 10, borderRadius: 10,
                background: 'rgba(0,255,102,0.05)', border: '1px solid rgba(0,255,102,0.12)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <img src={designUrl} alt="Design" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, color: '#00ff66', fontWeight: 600, margin: 0 }}>✅ التصميم مطبوع على التيشيرت</p>
                  <p style={{ fontSize: 9, color: '#555', margin: '2px 0 0' }}>Printed on 3D fabric</p>
                </div>
                <button onClick={removeDesign} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,50,50,0.12)', border: '1px solid rgba(255,50,50,0.25)', color: '#ff5555', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none' }}>✕</button>
              </div>
            )}
          </div>

          {/* ═══ GLB UPLOAD (advanced) ═══ */}
          <div>
            <label style={sLabel}>🧊 موديل 3D · GLB MODEL (اختياري)</label>
            <button onClick={() => glbInputRef.current?.click()} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '10px 14px', borderRadius: 10,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer', outline: 'none', fontSize: 11, color: '#777',
            }}>
              <span>📦</span>
              <span>{glbUrl ? '✅ تم رفع الموديل' : 'ارفع ملف .glb / .gltf'}</span>
            </button>
            <input ref={glbInputRef} type="file" accept=".glb,.gltf" onChange={handleGlbUpload} style={{ display: 'none' }} />
          </div>

          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }} />

          {/* Order Summary */}
          <div style={{ padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', color: '#666', textTransform: 'uppercase', margin: '0 0 10px' }}>
              ORDER SUMMARY — ملخص الطلب
            </p>
            {[['اللون', colorLabel], ['المقاس', size], ['التصميم', designUrl ? 'مرفق ✓' : 'بدون']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#aaa', marginBottom: 4 }}>
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
              <span>الإجمالي</span><span style={{ color: '#00ff66' }}>{price} EGP</span>
            </div>
          </div>

          {/* WhatsApp */}
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '16px 0', borderRadius: 12,
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: 0.5,
            textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
          }}>
            <svg viewBox="0 0 24 24" fill="white" style={{ width: 22, height: 22 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            اطلب الآن عبر واتساب
          </a>

          <p style={{ textAlign: 'center', fontSize: 9, color: 'rgba(255,255,255,0.15)', margin: 0 }}>
            عرض 3D فاخر للفيديو الإعلاني &nbsp; VIP Brand Showcase
          </p>

        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        .p2-grid {
          grid-template-columns: minmax(0,1fr) minmax(300px,400px);
        }
        @media (max-width: 860px) {
          .p2-grid {
            grid-template-columns: 1fr !important;
          }
          .p2-grid > div:first-child {
            min-height: 360px !important;
            max-height: 440px;
          }
          .p2-grid > div:last-child {
            border-left: none !important;
            border-top: 1px solid rgba(255,255,255,0.04);
          }
        }
      `}</style>
    </div>
  );
}

const sLabel = {
  display: 'block', fontSize: 10, letterSpacing: '0.2em',
  textTransform: 'uppercase', color: '#777', marginBottom: 10, fontWeight: 600,
};
