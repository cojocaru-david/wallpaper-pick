"use client";
import { useRef, useEffect } from "react";
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Mesh,
  Program,
  Texture,
} from "ogl";

type GL = Renderer["gl"];

function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
  let timeout: number;
  return function (this: unknown, ...args: Parameters<T>) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function createTextTexture(
  gl: GL,
  text: string,
  font: string = "bold 30px monospace",
  color: string = "black"
): { texture: Texture; width: number; height: number } {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get 2d context");

  const screenWidth = window.innerWidth;
  const isMobile = screenWidth < 768;
  const baseFontSize = getFontSize(font);
  const responsiveFontSize = isMobile ? Math.max(baseFontSize * 1.5, 36) : baseFontSize;
  const responsiveFont = font.replace(/\d+px/, `${responsiveFontSize}px`);

  context.font = responsiveFont;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(responsiveFontSize * 1.3);

  canvas.width = textWidth + 40; 
  canvas.height = textHeight + 40;

  context.font = responsiveFont;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.shadowColor = 'rgba(0, 0, 0, 0.5)';
  context.shadowBlur = 4;
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;

  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

interface TitleProps {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor?: string;
  font?: string;
}

class Title {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({
    gl,
    plane,
    renderer,
    text,
    textColor = "#545050",
    font = "30px sans-serif",
  }: TitleProps) {
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;

    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;

    let textScale;
    if (isMobile) {
      textScale = 0.18; 
    } else if (isTablet) {
      textScale = 0.16; 
    } else {
      textScale = 0.15; 
    }

    const textHeightScaled = this.plane.scale.y * textScale;
    const textWidthScaled = textHeightScaled * aspect;
    this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
    this.mesh.position.y =
      -this.plane.scale.y * 0.5 - textHeightScaled * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

interface ScreenSize {
  width: number;
  height: number;
}

interface Viewport {
  width: number;
  height: number;
}

interface MediaProps {
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius?: number;
  font?: string;
  isTouchDevice?: boolean;
}

class Media {
  extra: number = 0;
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius: number;
  font?: string;
  isTouchDevice: boolean;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  scale!: number;
  padding!: number;
  width!: number;
  widthTotal!: number;
  x!: number;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;
  isHovered: boolean = false;
  hoverAnim: number = 0;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
    isTouchDevice = false,
  }: MediaProps) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.isTouchDevice = isTouchDevice;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uHoverAnim;
        uniform bool uIsTouchDevice;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;

          if (!uIsTouchDevice) {
            p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
            float scale = mix(1.0, 1.08, uHoverAnim);
            p.xy *= scale;
          } else {

            p.z = sin(p.x * 2.0 + uTime * 0.5) * 0.02;
          }

          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uHoverAnim;
        uniform bool uIsTouchDevice;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);



          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          if(d > 0.0) {
            discard;
          }

          float border = smoothstep(0.015, 0.0, abs(d + 0.01));
          vec3 borderColor = mix(color.rgb, vec3(1.0, 1.0, 1.0), border * uHoverAnim * 0.7);
          float glow = smoothstep(0.04, 0.0, abs(d + 0.01));
          borderColor = mix(borderColor, vec3(1.0, 1.0, 1.0), glow * uHoverAnim * 0.5);
          gl_FragColor = vec4(borderColor, 1.0);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uHoverAnim: { value: 0 },
        uIsTouchDevice: { value: false },
      },
      transparent: true,
    });

    preloadImage(this.image)
      .then((img) => {
        texture.image = img;
        this.program.uniforms.uImageSizes.value = [
          img.naturalWidth,
          img.naturalHeight,
        ];
      })
      .catch((error) => {
        console.error('Failed to load image:', this.image, error);
      });

    this.program.uniforms.uIsTouchDevice.value = this.isTouchDevice;
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(
    scroll: { current: number; last: number },
    direction: "right" | "left"
  ) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {

      const screenWidth = window.innerWidth;
      const isMobile = screenWidth < 768;
      const bendMultiplier = isMobile ? 0.6 : 1;
      const adjustedBend = this.bend * bendMultiplier;

      const B_abs = Math.abs(adjustedBend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (adjustedBend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }

    const target = this.isHovered ? 1 : 0;
    this.hoverAnim += (target - this.hoverAnim) * 0.25; 
    this.program.uniforms.uHoverAnim.value = this.hoverAnim;
  }

  onResize({
    screen,
    viewport,
  }: { screen?: ScreenSize; viewport?: Viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [
          this.viewport.width,
          this.viewport.height,
        ];
      }
    }

    const isMobile = this.screen.width < 768;
    const isTablet = this.screen.width >= 768 && this.screen.width < 1024;

    let baseWidth, baseHeight;
    if (isMobile) {
      baseWidth = Math.min(this.screen.width * 0.9, 350); 
      baseHeight = Math.min(this.screen.height * 0.5, 260); 
    } else if (isTablet) {
      baseWidth = Math.min(this.screen.width * 0.65, 450);
      baseHeight = Math.min(this.screen.height * 0.55, 320);
    } else {
      baseWidth = Math.min(this.screen.width * 0.45, 600);
      baseHeight = Math.min(this.screen.height * 0.65, 420);
    }

    this.plane.scale.x = (baseWidth / this.screen.width) * this.viewport.width;
    this.plane.scale.y = (baseHeight / this.screen.height) * this.viewport.height;

    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];

    this.padding = isMobile ? 0.8 : 1.5; 
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }

  setHover(hovered: boolean) {
    this.isHovered = hovered;
  }
}

interface AppConfig {
  items?: { image: string; text: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
}

class App {
  container: HTMLElement;
  scroll: {
    ease: number;
    current: number;
    target: number;
    last: number;
    position?: number;
  };
  onCheckDebounce: () => void;
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  mediasImages: { image: string; text: string }[] = [];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf: number = 0;

  boundOnResize!: () => void;
  boundOnWheel!: (e: Event) => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: () => void;

  isDown: boolean = false;
  start: number = 0;
  hoveredMedia: Media | null = null;
  isTouchDevice: boolean = false;
  velocity: number = 0;
  lastTouchX: number = 0;

  constructor(
    container: HTMLElement,
    {
      items,
      bend = 1,
      textColor = "#ffffff",
      borderRadius = 0,
      font = "bold 30px Syne",
    }: AppConfig
  ) {
    document.documentElement.classList.remove("no-js");
    this.container = container;
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const scrollEase = this.isTouchDevice ? 0.12 : 0.08; 
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };

    this.onCheckDebounce = debounce(this.onCheck.bind(this), 150); 
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);

    const canvas = this.renderer.gl.canvas as HTMLCanvasElement;
    canvas.style.display = 'block';
    canvas.style.margin = '0';
    canvas.style.padding = '0';
    canvas.style.border = 'none';
    canvas.style.outline = 'none';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    this.container.appendChild(canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias(
    items: { image: string; text: string }[] | undefined,
    bend: number = 1,
    textColor: string,
    borderRadius: number,
    font: string
  ) {
    const galleryItems = items && items.length ? items : [];
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        isTouchDevice: this.isTouchDevice,
      });
    });
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = 'touches' in e ? e.touches[0].clientX : e.clientX;
    this.lastTouchX = this.start;
    this.velocity = 0;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const isMobile = this.screen.width < 768;
    const sensitivity = isMobile ? 0.06 : 0.04; 
    const distance = (this.start - x) * sensitivity;
    this.scroll.target = (this.scroll.position ?? 0) + distance;
    this.velocity = x - this.lastTouchX;
    this.lastTouchX = x;
  }

  onTouchUp() {
    this.isDown = false;
    const isMobile = this.screen.width < 768;
    const momentumMultiplier = isMobile ? 2.5 : 1.8; 
    if (Math.abs(this.velocity) > 1) {
      this.scroll.target += -this.velocity * momentumMultiplier;
    }
    this.onCheck();
    this.velocity = 0;
  }

  onWheel(e: Event) {
    const wheelEvent = e as WheelEvent;
    wheelEvent.preventDefault();
    const delta = wheelEvent.deltaY || wheelEvent.deltaX;
    const isMobile = this.screen.width < 768;

    const scrollMultiplier = isMobile ? 0.6 : 0.8; 

    if (Math.abs(wheelEvent.deltaY) > Math.abs(wheelEvent.deltaX)) {

      const scrollAmount = Math.sign(delta) * Math.min(Math.abs(delta) / 100, 2) * scrollMultiplier;
      this.scroll.target += scrollAmount;
    } else {

      const scrollAmount = Math.sign(delta) * Math.min(Math.abs(delta) / 100, 2) * scrollMultiplier;
      this.scroll.target += scrollAmount;
    }

    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;

    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    const targetPosition = this.scroll.target < 0 ? -item : item;

    const difference = targetPosition - this.scroll.target;
    if (Math.abs(difference) > 0.1) {
      this.scroll.target += difference * 0.15; 
    } else {
      this.scroll.target = targetPosition; 
    }
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      );
    }
  }

  update() {

    const distance = Math.abs(this.scroll.target - this.scroll.current);
    const adaptiveEase = distance > 1 ? this.scroll.ease * 1.5 : this.scroll.ease; 

    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      adaptiveEase
    );

    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);

    window.addEventListener("resize", this.boundOnResize);
    window.addEventListener("wheel", this.boundOnWheel, { passive: false });
    window.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    window.addEventListener("touchstart", this.boundOnTouchDown, { passive: false });
    window.addEventListener("touchmove", this.boundOnTouchMove, { passive: false });
    window.addEventListener("touchend", this.boundOnTouchUp);

    if (!this.isTouchDevice) {
      this.renderer.gl.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
      this.renderer.gl.canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("wheel", this.boundOnWheel);
    window.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    window.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);

    if (
      this.renderer &&
      this.renderer.gl &&
      this.renderer.gl.canvas.parentNode
    ) {
      this.renderer.gl.canvas.parentNode.removeChild(
        this.renderer.gl.canvas as HTMLCanvasElement
      );
    }

    if (!this.isTouchDevice && this.renderer?.gl?.canvas) {
      this.renderer.gl.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
      this.renderer.gl.canvas.removeEventListener('mouseleave', this.onMouseLeave.bind(this));
    }
  }

  onMouseMove(e: MouseEvent) {
    if (!this.medias) return;
    const rect = this.renderer.gl.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    let found = false;
    for (const media of this.medias) {
      const px = media.plane.position.x / (this.viewport.width / 2);
      const py = media.plane.position.y / (this.viewport.height / 2);
      const sx = media.plane.scale.x / this.viewport.width;
      const sy = media.plane.scale.y / this.viewport.height;
      if (
        x > px - sx && x < px + sx &&
        y > py - sy && y < py + sy
      ) {
        media.setHover(true);
        this.hoveredMedia = media;
        found = true;
      } else {
        media.setHover(false);
      }
    }
    if (!found) this.hoveredMedia = null;
  }

  onMouseLeave() {
    if (this.hoveredMedia) {
      this.hoveredMedia.setHover(false);
      this.hoveredMedia = null;
    }
  }
}

interface CircularGalleryProps {
  items?: { image: string; text: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
}

export default function CircularGallery({
  items,
  bend = 2,
  textColor,
  borderRadius,
  font = "bold 30px Syne",
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);

  const getResponsiveMarginTop = () => {
    if (typeof window === 'undefined') return '-9rem'; 

    const screenWidth = window.innerWidth;

    if (screenWidth < 640) {

      return '-10rem';
    } else if (screenWidth < 768) {

      return '-9rem';
    } else if (screenWidth < 1024) {

      return '-6rem';
    } else if (screenWidth < 1280) {

      return '-4rem';
    } else {

      return '-3rem';
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const cssTextColor = textColor || getComputedStyle(document.documentElement).getPropertyValue('--color-foreground').trim() || '#222';
    const cssFont = font || 'bold 30px Syne, sans-serif';
    const cssBorderRadius = borderRadius !== undefined ? borderRadius : parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--radius').trim()) / 16 || 0.05;

    if (appRef.current && appRef.current.container !== containerRef.current) {
      appRef.current.destroy();
      appRef.current = null;
    }

    const updateMarginTop = () => {
      if (containerRef.current) {
        containerRef.current.style.marginTop = getResponsiveMarginTop();
      }
    };

    updateMarginTop();
    window.addEventListener('resize', updateMarginTop);

    if (appRef.current) {
      appRef.current.destroy();
      appRef.current = null;
    }
    appRef.current = new App(containerRef.current, {
      items,
      bend,
      textColor: cssTextColor,
      borderRadius: cssBorderRadius,
      font: cssFont,
    });

    return () => {
      window.removeEventListener('resize', updateMarginTop);
      if (appRef.current) {
        appRef.current.destroy();
        appRef.current = null;
      }
    };
  }, [items, bend, textColor, borderRadius, font]);

  return (
    <div
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing touch-pan-x"
      style={{
        background: 'transparent',
        color: 'var(--color-foreground)',
        position: 'relative',
        display: 'block',
        margin: 0,
        padding: 0,
        top: 0,
        left: 0,
        boxSizing: 'border-box',
        touchAction: 'pan-x',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        marginTop: getResponsiveMarginTop(), 
      }}
      ref={containerRef}
    />
  );
}