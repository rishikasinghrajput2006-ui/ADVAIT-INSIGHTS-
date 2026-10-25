import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GradeLevel } from '../../types/index.ts';
import {
  MousePointer,
  Move,
  RotateCcw,
  RotateCw,
  Trash2,
  Copy,
  Pen,
  Highlighter,
  Eraser,
  Square,
  Circle,
  Triangle,
  Minus,
  MoveRight,
  Type,
  Image as ImageIcon,
  Download,
  Sparkles,
  Bot,
  Maximize2,
  Minimize2,
  Layers,
  FilePlus,
  Play,
  Pause,
  Timer,
  Smile,
  Check,
  Palette,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Sliders,
  Maximize,
  Plus,
  Monitor,
} from 'lucide-react';

interface MathCanvasBoardProps {
  grade: GradeLevel;
  onAskAIGuruWithDrawing?: (questionPrompt: string) => void;
}

export type ToolType =
  | 'select'
  | 'pen'
  | 'highlighter'
  | 'laser'
  | 'line'
  | 'arrow'
  | 'circle'
  | 'rectangle'
  | 'triangle'
  | 'text'
  | 'stamp'
  | 'eraser';

export type PaperPattern = 'plain' | 'ruled' | 'grid' | 'dots';

export interface BlankPaperOption {
  id: string;
  name: string;
  hex: string;
  textDark: boolean;
  border: string;
  badge: string;
}

export const BLANK_PAPER_PRESETS: BlankPaperOption[] = [
  { id: 'white', name: 'Pure White Paper', hex: '#FFFFFF', textDark: true, border: '#CBD5E1', badge: '⚪ White' },
  { id: 'yellow', name: 'Yellow Exam Pad', hex: '#FEF9C3', textDark: true, border: '#FACC15', badge: '🟡 Yellow' },
  { id: 'cream', name: 'Vintage Parchment', hex: '#FDF6E2', textDark: true, border: '#E2D4B7', badge: '📜 Cream' },
  { id: 'blue', name: 'Pastel Sky Blue', hex: '#E0F2FE', textDark: true, border: '#7DD3FC', badge: '🔵 Blue' },
  { id: 'green', name: 'Mint Green Paper', hex: '#DCFCE7', textDark: true, border: '#86EFAC', badge: '🟢 Mint' },
  { id: 'pink', name: 'Soft Rose Pink', hex: '#FCE7F3', textDark: true, border: '#F472B6', badge: '🌸 Pink' },
  { id: 'purple', name: 'Lavender Purple', hex: '#F3E8FF', textDark: true, border: '#C084FC', badge: '🟣 Lavender' },
  { id: 'peach', name: 'Warm Peach Orange', hex: '#FFEDD5', textDark: true, border: '#FB923C', badge: '🟠 Peach' },
  { id: 'chalkboard', name: 'Classroom Chalkboard', hex: '#113524', textDark: false, border: '#10B981', badge: '🎓 Chalkboard' },
  { id: 'dark', name: 'OLED Midnight Dark', hex: '#050811', textDark: false, border: '#38BDF8', badge: '🖤 Dark Pro' },
  { id: 'navy', name: 'Deep Royal Navy', hex: '#0B192C', textDark: false, border: '#60A5FA', badge: '🌌 Navy' },
];

export interface CanvasElement {
  id: string;
  type: 'path' | 'line' | 'arrow' | 'rectangle' | 'circle' | 'triangle' | 'text' | 'stamp' | 'image';
  x: number; // center X
  y: number; // center Y
  width: number;
  height: number;
  rotation: number; // in degrees (-360 to 360)
  color: string;
  lineWidth: number;
  opacity?: number;
  points?: { x: number; y: number }[]; // relative to center (x, y)
  text?: string;
  fontSize?: number;
  stamp?: string;
  imageUrl?: string;
  img?: HTMLImageElement;
  name?: string;
}

interface StickyNote {
  id: string;
  x: number;
  y: number;
  text: string;
  color: 'yellow' | 'blue' | 'green' | 'pink';
}

interface WhiteboardSlide {
  id: string;
  name: string;
  elements: CanvasElement[];
  notes: StickyNote[];
  paperColor: string;
  paperPattern: PaperPattern;
}

const MATH_STAMPS = [
  { symbol: 'π', label: 'Pi' },
  { symbol: 'θ', label: 'Theta' },
  { symbol: 'α', label: 'Alpha' },
  { symbol: 'β', label: 'Beta' },
  { symbol: '√', label: 'Root' },
  { symbol: '∫', label: 'Integral' },
  { symbol: '∑', label: 'Sum' },
  { symbol: '∞', label: 'Infinity' },
  { symbol: '≈', label: 'Approx' },
  { symbol: '≠', label: 'Not Equal' },
  { symbol: '±', label: 'Plus-Minus' },
  { symbol: '∆', label: 'Delta' },
  { symbol: '∠', label: 'Angle' },
  { symbol: '⊥', label: 'Perpendicular' },
];

const PRESET_SAMPLE_DIAGRAMS = [
  {
    id: 'pythagoras',
    title: 'Pythagoras Theorem Right Triangle',
    category: 'Class 10 Triangles',
    description: 'Constructs right triangle with base, perpendicular, hypotenuse and formula a² + b² = c²',
  },
  {
    id: 'bpt',
    title: 'Basic Proportionality Theorem (Thales)',
    category: 'Class 10 Triangles',
    description: 'Triangle ABC with parallel line DE to BC, establishing AD/DB = AE/EC',
  },
  {
    id: 'tangents',
    title: 'Tangents to Circle from External Point',
    category: 'Class 10 Circles',
    description: 'Circle with center O, external point P, tangents PA and PB proven equal',
  },
  {
    id: 'parabola',
    title: 'Quadratic Polynomial Parabola Graph',
    category: 'Class 10 Polynomials',
    description: 'U-shaped parabola f(x) = x² - 4 intersecting x-axis at two distinct zeroes',
  },
  {
    id: 'trig',
    title: 'Trigonometric Ratios Triangle with θ',
    category: 'Class 10 Trigonometry',
    description: 'Right triangle with θ marked, highlighting Sin=P/H, Cos=B/H, Tan=P/B',
  },
  {
    id: 'cartesian',
    title: 'Cartesian Coordinate Graph Grid',
    category: 'Class 9 Coordinate Geometry',
    description: '4-quadrant grid with labeled X-axis, Y-axis, quadrants and origin (0,0)',
  },
];

export const MathCanvasBoard: React.FC<MathCanvasBoardProps> = ({
  grade,
  onAskAIGuruWithDrawing,
}) => {
  // Container & Canvas references
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Board Height & Viewport settings (BADA SIZE PRESETS)
  const [boardHeight, setBoardHeight] = useState<number>(950);

  // Active Tool & Style State
  const [tool, setTool] = useState<ToolType>('pen');
  const [color, setColor] = useState<string>('#38BDF8');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [eraserSize, setEraserSize] = useState<number>(35);
  const [activeStamp, setActiveStamp] = useState<string>('π');

  // Blank Color Paper State
  const [paperColor, setPaperColor] = useState<string>('#050811'); // OLED dark by default
  const [paperPattern, setPaperPattern] = useState<PaperPattern>('grid');

  // Structured Elements on the Board
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Transform Interaction State (Moving, Rotating, Resizing)
  const [transformMode, setTransformMode] = useState<'move' | 'rotate' | 'resize' | null>(null);
  const [transformStart, setTransformStart] = useState<{
    mouseX: number;
    mouseY: number;
    elemX: number;
    elemY: number;
    elemW: number;
    elemH: number;
    elemRot: number;
  } | null>(null);

  // Live Freehand Drawing State
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [livePoints, setLivePoints] = useState<{ x: number; y: number }[]>([]);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Laser pointer glow coordinates
  const [laserPoints, setLaserPoints] = useState<{ x: number; y: number; time: number }[]>([]);

  // Text insertion modal
  const [textInputOpen, setTextInputOpen] = useState<boolean>(false);
  const [textInputPos, setTextInputPos] = useState<{ x: number; y: number }>({ x: 200, y: 200 });
  const [textValue, setTextValue] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(24);

  // Sticky Notes
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([
    {
      id: 'welcome-note',
      x: 30,
      y: 30,
      text: '✨ #ADVAITIN Bada Smart Whiteboard!\n• 📏 Bohot Bada Size (750px - 2400px & Full Screen)\n• 👆 "Select & Move" tool: Draw & move/rotate anything!\n• 🎨 Blank Color Papers (Yellow, Blue, Mint, Pink, White)\n• 📷 Upload photo or paste with Ctrl+V',
      color: 'yellow',
    },
  ]);

  // Slides / Pages
  const [slides, setSlides] = useState<WhiteboardSlide[]>([
    {
      id: 'slide-1',
      name: 'Page 1',
      elements: [],
      notes: [],
      paperColor: '#050811',
      paperPattern: 'grid',
    },
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Lossless Undo / Redo history stacks
  const [undoStack, setUndoStack] = useState<CanvasElement[][]>([]);
  const [redoStack, setRedoStack] = useState<CanvasElement[][]>([]);

  // UI Modals & Popovers
  const [showBlueprintsModal, setShowBlueprintsModal] = useState<boolean>(false);
  const [showPaperModal, setShowPaperModal] = useState<boolean>(false);
  const [showSizeModal, setShowSizeModal] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCopyBanner, setShowCopyBanner] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Ready to draw on Advaitin Smart Whiteboard');

  // Timed Solving Drill Stopwatch
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
  const [stopwatchRunning, setStopwatchRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to test if background color is light
  const isLightColor = useCallback((hexColor: string) => {
    const hex = hexColor.replace('#', '');
    if (hex.length !== 6) return false;
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  }, []);

  // Background Theme / Blank Color Paper Renderer
  const drawPaperBackground = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      bgHex: string,
      pattern: PaperPattern
    ) => {
      ctx.save();
      // 1. Fill solid blank paper color
      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, width, height);

      const isLight = isLightColor(bgHex);

      // 2. Render selected pattern (plain, ruled, grid, dots)
      if (pattern === 'plain') {
        ctx.restore();
        return;
      }

      if (pattern === 'ruled') {
        const lineSpacing = 32;
        const marginX = 75;

        // Red left vertical margin line
        ctx.strokeStyle = isLight ? '#EF4444' : '#F87171';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(marginX, 0);
        ctx.lineTo(marginX, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(marginX + 4, 0);
        ctx.lineTo(marginX + 4, height);
        ctx.stroke();

        // Horizontal ruled lines
        ctx.strokeStyle = isLight ? '#CBD5E1' : '#1E293B';
        ctx.lineWidth = 1;
        for (let y = lineSpacing * 1.5; y < height; y += lineSpacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (pattern === 'grid') {
        ctx.strokeStyle = isLight ? '#E2E8F0' : '#1E293B';
        ctx.lineWidth = 1;
        const step = 28;
        for (let x = 0; x < width; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Center origin axes
        const midX = Math.floor(width / 2);
        const midY = Math.floor(height / 2);
        ctx.strokeStyle = isLight ? '#0284C7' : '#38BDF8';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(width, midY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(midX, 0);
        ctx.lineTo(midX, height);
        ctx.stroke();

        ctx.fillStyle = isLight ? '#475569' : '#94A3B8';
        ctx.font = '10px monospace';
        ctx.fillText('+X', width - 24, midY - 6);
        ctx.fillText('-X', 8, midY - 6);
        ctx.fillText('+Y', midX + 6, 16);
        ctx.fillText('-Y', midX + 6, height - 8);
        ctx.fillText('(0,0)', midX + 6, midY + 16);
      } else if (pattern === 'dots') {
        ctx.fillStyle = isLight ? '#94A3B8' : '#334155';
        const spacing = 28;
        for (let x = 14; x < width; x += spacing) {
          for (let y = 14; y < height; y += spacing) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }

      ctx.restore();
    },
    [isLightColor]
  );

  // Push elements state to undo history
  const pushElementsState = (newElements: CanvasElement[]) => {
    setUndoStack((prev) => [...prev.slice(-30), elements]);
    setRedoStack([]);
    setElements(newElements);
  };

  // Render an individual element onto canvas context
  const renderSingleElement = (ctx: CanvasRenderingContext2D, el: CanvasElement) => {
    ctx.save();
    ctx.translate(el.x, el.y);
    ctx.rotate((el.rotation * Math.PI) / 180);

    const w = el.width;
    const h = el.height;

    ctx.strokeStyle = el.color;
    ctx.fillStyle = el.color;
    ctx.lineWidth = el.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = el.opacity || 1.0;

    if (el.type === 'path' && el.points && el.points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(el.points[0].x, el.points[0].y);
      for (let i = 1; i < el.points.length; i++) {
        ctx.lineTo(el.points[i].x, el.points[i].y);
      }
      ctx.stroke();
    } else if (el.type === 'line' && el.points && el.points.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(el.points[0].x, el.points[0].y);
      ctx.lineTo(el.points[1].x, el.points[1].y);
      ctx.stroke();
    } else if (el.type === 'arrow' && el.points && el.points.length >= 2) {
      const p1 = el.points[0];
      const p2 = el.points[1];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const headLength = 16;
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(
        p2.x - headLength * Math.cos(angle - Math.PI / 6),
        p2.y - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        p2.x - headLength * Math.cos(angle + Math.PI / 6),
        p2.y - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    } else if (el.type === 'rectangle') {
      ctx.strokeRect(-w / 2, -h / 2, w, h);
    } else if (el.type === 'circle') {
      const radius = Math.min(w, h) / 2;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, radius), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, 2 * Math.PI);
      ctx.fill();
    } else if (el.type === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(0, -h / 2);
      ctx.lineTo(-w / 2, h / 2);
      ctx.lineTo(w / 2, h / 2);
      ctx.closePath();
      ctx.stroke();
    } else if (el.type === 'text') {
      ctx.font = `bold ${el.fontSize || 24}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.text || '', 0, 0);
    } else if (el.type === 'stamp') {
      ctx.font = `bold ${el.fontSize || 28}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.stamp || '', 0, 0);
    } else if (el.type === 'image' && el.img) {
      ctx.drawImage(el.img, -w / 2, -h / 2, w, h);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-w / 2, -h / 2, w, h);
    }

    ctx.restore();
  };

  // Redraw the entire canvas
  const redrawCanvas = useCallback(
    (currentElements: CanvasElement[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width || 1200;
      const h = boardHeight;

      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Draw background
      drawPaperBackground(ctx, w, h, paperColor, paperPattern);

      // Draw all elements in order
      currentElements.forEach((el) => {
        renderSingleElement(ctx, el);
      });

      // If actively drawing a live stroke or shape preview
      if (isDrawing) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (tool === 'eraser') {
          ctx.strokeStyle = paperColor;
          ctx.lineWidth = eraserSize;
        } else if (tool === 'highlighter') {
          ctx.lineWidth = lineWidth * 4;
          ctx.globalAlpha = 0.35;
        } else {
          ctx.globalAlpha = 1.0;
        }

        if ((tool === 'pen' || tool === 'highlighter' || tool === 'eraser') && livePoints.length > 0) {
          ctx.beginPath();
          ctx.moveTo(livePoints[0].x, livePoints[0].y);
          for (let i = 1; i < livePoints.length; i++) {
            ctx.lineTo(livePoints[i].x, livePoints[i].y);
          }
          ctx.stroke();
        } else if (tool === 'line') {
          ctx.beginPath();
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(currentPos.x, currentPos.y);
          ctx.stroke();
        } else if (tool === 'arrow') {
          ctx.beginPath();
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(currentPos.x, currentPos.y);
          ctx.stroke();

          const headLength = 16;
          const angle = Math.atan2(currentPos.y - startPos.y, currentPos.x - startPos.x);
          ctx.beginPath();
          ctx.moveTo(currentPos.x, currentPos.y);
          ctx.lineTo(
            currentPos.x - headLength * Math.cos(angle - Math.PI / 6),
            currentPos.y - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            currentPos.x - headLength * Math.cos(angle + Math.PI / 6),
            currentPos.y - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        } else if (tool === 'rectangle') {
          const rw = currentPos.x - startPos.x;
          const rh = currentPos.y - startPos.y;
          ctx.strokeRect(startPos.x, startPos.y, rw, rh);
        } else if (tool === 'circle') {
          const radius = Math.sqrt(
            Math.pow(currentPos.x - startPos.x, 2) + Math.pow(currentPos.y - startPos.y, 2)
          );
          ctx.beginPath();
          ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(startPos.x, startPos.y, 3, 0, 2 * Math.PI);
          ctx.fill();
        } else if (tool === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(currentPos.x, currentPos.y);
          ctx.lineTo(startPos.x - (currentPos.x - startPos.x), currentPos.y);
          ctx.closePath();
          ctx.stroke();
        }
      }

      ctx.restore();
    },
    [boardHeight, color, drawPaperBackground, eraserSize, isDrawing, lineWidth, livePoints, paperColor, paperPattern, startPos, currentPos, tool]
  );

  // Redraw when elements, paper, or dimensions change
  useEffect(() => {
    redrawCanvas(elements);
  }, [elements, paperColor, paperPattern, boardHeight, redrawCanvas]);

  // Handle window resizing cleanly
  useEffect(() => {
    const handleResize = () => {
      redrawCanvas(elements);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [elements, redrawCanvas]);

  // Coordinate helper with boundary safety
  const getCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(boardHeight, clientY - rect.top));
    return { x, y };
  };

  // Hit-testing an element with full rotation support
  const hitTestElement = (el: CanvasElement, px: number, py: number): boolean => {
    const dx = px - el.x;
    const dy = py - el.y;
    const rad = (-el.rotation * Math.PI) / 180;
    const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
    const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

    const halfW = Math.max(el.width / 2, 16) + 12;
    const halfH = Math.max(el.height / 2, 16) + 12;
    return Math.abs(localX) <= halfW && Math.abs(localY) <= halfH;
  };

  // Find topmost clicked element
  const findElementAt = (px: number, py: number): CanvasElement | null => {
    for (let i = elements.length - 1; i >= 0; i--) {
      if (hitTestElement(elements[i], px, py)) {
        return elements[i];
      }
    }
    return null;
  };

  // Pointer Down Handler
  const handlePointerDown = (clientX: number, clientY: number) => {
    const pos = getCoords(clientX, clientY);
    setCurrentPos(pos);
    setStartPos(pos);

    // If Select Tool is active:
    if (tool === 'select') {
      const clickedEl = findElementAt(pos.x, pos.y);
      if (clickedEl) {
        setSelectedId(clickedEl.id);
        setTransformMode('move');
        setTransformStart({
          mouseX: pos.x,
          mouseY: pos.y,
          elemX: clickedEl.x,
          elemY: clickedEl.y,
          elemW: clickedEl.width,
          elemH: clickedEl.height,
          elemRot: clickedEl.rotation,
        });
        setStatusMessage(`Selected "${clickedEl.name || clickedEl.type}". Drag anywhere to move, or twist rotate knob!`);
      } else {
        setSelectedId(null);
        setTransformMode(null);
        setTransformStart(null);
      }
      return;
    }

    // In drawing mode, deselect any active element
    setSelectedId(null);

    if (tool === 'laser') {
      setLaserPoints([{ x: pos.x, y: pos.y, time: Date.now() }]);
      return;
    }

    if (tool === 'text') {
      setTextInputPos(pos);
      setTextInputOpen(true);
      setTextValue('');
      setIsDrawing(false);
      return;
    }

    if (tool === 'stamp') {
      const newEl: CanvasElement = {
        id: `stamp-${Date.now()}`,
        type: 'stamp',
        x: pos.x,
        y: pos.y,
        width: 40,
        height: 40,
        rotation: 0,
        color,
        lineWidth,
        fontSize: fontSize + 4,
        stamp: activeStamp,
        name: `Symbol ${activeStamp}`,
      };
      pushElementsState([...elements, newEl]);
      setStatusMessage(`Placed symbol "${activeStamp}". Switch to "Select & Move" to rotate or drag it!`);
      return;
    }

    // Freehand or Shape Drawing
    setIsDrawing(true);
    setLivePoints([pos]);
  };

  // Pointer Move Handler
  const handlePointerMove = (clientX: number, clientY: number) => {
    const pos = getCoords(clientX, clientY);
    setCurrentPos(pos);

    if (tool === 'laser') {
      setLaserPoints((prev) => [...prev.slice(-25), { x: pos.x, y: pos.y, time: Date.now() }]);
      return;
    }

    // Handle Transform (Move / Rotate / Resize)
    if (tool === 'select' && transformMode && transformStart && selectedId) {
      const currentElement = elements.find((e) => e.id === selectedId);
      if (!currentElement) return;

      if (transformMode === 'move') {
        const deltaX = pos.x - transformStart.mouseX;
        const deltaY = pos.y - transformStart.mouseY;
        const newX = Math.round(transformStart.elemX + deltaX);
        const newY = Math.round(transformStart.elemY + deltaY);

        setElements((prev) =>
          prev.map((el) => (el.id === selectedId ? { ...el, x: newX, y: newY } : el))
        );
        setStatusMessage(`Moving item to (${newX}, ${newY})`);
      } else if (transformMode === 'rotate') {
        const center = { x: currentElement.x, y: currentElement.y };
        const angleRad = Math.atan2(pos.y - center.y, pos.x - center.x);
        let angleDeg = Math.round((angleRad * 180) / Math.PI + 90);
        if (angleDeg < 0) angleDeg += 360;

        setElements((prev) =>
          prev.map((el) => (el.id === selectedId ? { ...el, rotation: angleDeg } : el))
        );
        setStatusMessage(`Rotating item: ${angleDeg}°`);
      } else if (transformMode === 'resize') {
        const deltaX = pos.x - transformStart.mouseX;
        const deltaY = pos.y - transformStart.mouseY;
        const newW = Math.max(20, Math.round(transformStart.elemW + deltaX));
        const newH = Math.max(20, Math.round(transformStart.elemH + deltaY));

        setElements((prev) =>
          prev.map((el) => (el.id === selectedId ? { ...el, width: newW, height: newH } : el))
        );
        setStatusMessage(`Resizing: ${newW}px × ${newH}px`);
      }
      return;
    }

    if (!isDrawing) return;

    if (tool === 'pen' || tool === 'highlighter' || tool === 'eraser') {
      setLivePoints((prev) => [...prev, pos]);
    }
  };

  // Pointer Up Handler: Commit Drawing to Element
  const handlePointerUp = () => {
    if (transformMode) {
      setUndoStack((prev) => [...prev.slice(-30), elements]);
      setRedoStack([]);
      setTransformMode(null);
      setTransformStart(null);
      return;
    }

    if (!isDrawing) return;
    setIsDrawing(false);

    if ((tool === 'pen' || tool === 'highlighter' || tool === 'eraser') && livePoints.length > 0) {
      if (tool === 'eraser') {
        const remaining = elements.filter((el) => {
          return !livePoints.some((p) => hitTestElement(el, p.x, p.y));
        });
        if (remaining.length !== elements.length) {
          pushElementsState(remaining);
          setStatusMessage('Erased items from board');
        }
        setLivePoints([]);
        return;
      }

      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      livePoints.forEach((p) => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });

      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const w = Math.max(24, maxX - minX);
      const h = Math.max(24, maxY - minY);

      const relPoints = livePoints.map((p) => ({
        x: p.x - cx,
        y: p.y - cy,
      }));

      const newEl: CanvasElement = {
        id: `path-${Date.now()}`,
        type: 'path',
        x: Math.round(cx),
        y: Math.round(cy),
        width: Math.round(w),
        height: Math.round(h),
        rotation: 0,
        color,
        lineWidth: tool === 'highlighter' ? lineWidth * 4 : lineWidth,
        opacity: tool === 'highlighter' ? 0.35 : 1.0,
        points: relPoints,
        name: tool === 'highlighter' ? 'Highlighter Stroke' : 'Pen Stroke',
      };

      pushElementsState([...elements, newEl]);
      setLivePoints([]);
      setStatusMessage('Drawn stroke saved! Click "Select & Move" to move or rotate it anytime.');
      return;
    }

    // Geometry Shapes
    if (
      tool === 'line' ||
      tool === 'arrow' ||
      tool === 'rectangle' ||
      tool === 'circle' ||
      tool === 'triangle'
    ) {
      const cx = (startPos.x + currentPos.x) / 2;
      const cy = (startPos.y + currentPos.y) / 2;
      const w = Math.abs(currentPos.x - startPos.x);
      const h = Math.abs(currentPos.y - startPos.y);

      let newEl: CanvasElement;

      if (tool === 'line' || tool === 'arrow') {
        const p1 = { x: startPos.x - cx, y: startPos.y - cy };
        const p2 = { x: currentPos.x - cx, y: currentPos.y - cy };
        newEl = {
          id: `${tool}-${Date.now()}`,
          type: tool,
          x: Math.round(cx),
          y: Math.round(cy),
          width: Math.max(24, Math.round(w)),
          height: Math.max(24, Math.round(h)),
          rotation: 0,
          color,
          lineWidth,
          points: [p1, p2],
          name: tool === 'arrow' ? 'Vector Arrow' : 'Ruler Line',
        };
      } else {
        newEl = {
          id: `${tool}-${Date.now()}`,
          type: tool,
          x: Math.round(cx),
          y: Math.round(cy),
          width: Math.max(20, Math.round(w)),
          height: Math.max(20, Math.round(h)),
          rotation: 0,
          color,
          lineWidth,
          name: `${tool.charAt(0).toUpperCase() + tool.slice(1)} Shape`,
        };
      }

      pushElementsState([...elements, newEl]);
      setStatusMessage(`Created ${newEl.name}! Can be moved and rotated with Select Tool.`);
    }
  };

  // Dedicated Rotate & Transform functions for selected element
  const handleRotateSelected = (deltaAngle: number) => {
    if (!selectedId) return;
    setUndoStack((prev) => [...prev.slice(-30), elements]);
    setRedoStack([]);
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== selectedId) return el;
        let newRot = (el.rotation + deltaAngle) % 360;
        if (newRot < 0) newRot += 360;
        return { ...el, rotation: newRot };
      })
    );
    setStatusMessage(`Rotated ${deltaAngle > 0 ? '+' : ''}${deltaAngle}°`);
  };

  const handleResetRotation = () => {
    if (!selectedId) return;
    setUndoStack((prev) => [...prev.slice(-30), elements]);
    setRedoStack([]);
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, rotation: 0 } : el))
    );
    setStatusMessage('Rotation reset to 0°');
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    setUndoStack((prev) => [...prev.slice(-30), elements]);
    setRedoStack([]);
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
    setStatusMessage('Removed selected item from board');
  };

  const handleDuplicateSelected = () => {
    const el = elements.find((e) => e.id === selectedId);
    if (!el) return;
    const cloned: CanvasElement = {
      ...el,
      id: `${el.type}-${Date.now()}`,
      x: el.x + 30,
      y: el.y + 30,
    };
    pushElementsState([...elements, cloned]);
    setSelectedId(cloned.id);
    setStatusMessage('Duplicated item');
  };

  const handleNudgeSelected = (dx: number, dy: number) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedId ? { ...el, x: el.x + dx, y: el.y + dy } : el
      )
    );
  };

  const handleLayerOrder = (direction: 'up' | 'down') => {
    if (!selectedId) return;
    const idx = elements.findIndex((e) => e.id === selectedId);
    if (idx === -1) return;
    const newElements = [...elements];
    if (direction === 'up' && idx < newElements.length - 1) {
      const temp = newElements[idx];
      newElements[idx] = newElements[idx + 1];
      newElements[idx + 1] = temp;
      pushElementsState(newElements);
    } else if (direction === 'down' && idx > 0) {
      const temp = newElements[idx];
      newElements[idx] = newElements[idx - 1];
      newElements[idx - 1] = temp;
      pushElementsState(newElements);
    }
  };

  const handleChangeSelectedColor = (newColor: string) => {
    if (!selectedId) return;
    setUndoStack((prev) => [...prev.slice(-30), elements]);
    setRedoStack([]);
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, color: newColor } : el))
    );
    setColor(newColor);
  };

  // Keyboard shortcuts (Delete, Escape, Arrows, Rotate [ and ])
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (textInputOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        handleDeleteSelected();
      } else if (e.key === 'Escape') {
        setSelectedId(null);
      } else if (selectedId && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNudgeSelected(-5, 0);
      } else if (selectedId && e.key === 'ArrowRight') {
        e.preventDefault();
        handleNudgeSelected(5, 0);
      } else if (selectedId && e.key === 'ArrowUp') {
        e.preventDefault();
        handleNudgeSelected(0, -5);
      } else if (selectedId && e.key === 'ArrowDown') {
        e.preventDefault();
        handleNudgeSelected(0, 5);
      } else if (selectedId && e.key === '[') {
        handleRotateSelected(-15);
      } else if (selectedId && e.key === ']') {
        handleRotateSelected(15);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Undo & Redo Handlers
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [elements, ...prev]);
    setUndoStack((prev) => prev.slice(0, -1));
    setElements(previous);
    setSelectedId(null);
    setStatusMessage('Undone last action');
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setUndoStack((prev) => [...prev, elements]);
    setRedoStack((prev) => prev.slice(1));
    setElements(next);
    setSelectedId(null);
    setStatusMessage('Redone action');
  };

  // Clear Board
  const handleClear = () => {
    pushElementsState([]);
    setSelectedId(null);
    setStatusMessage('Whiteboard cleared');
  };

  // Add Photo Upload as movable element
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const rect = canvas ? canvas.getBoundingClientRect() : { width: 1000 };
        const maxW = rect.width * 0.7;
        const maxH = boardHeight * 0.7;
        let scale = Math.min(maxW / img.width, maxH / img.height);
        if (scale > 1) scale = 1;

        const targetW = Math.round(img.width * scale);
        const targetH = Math.round(img.height * scale);
        const targetX = Math.round(rect.width / 2);
        const targetY = Math.round(boardHeight / 2);

        const newEl: CanvasElement = {
          id: `image-${Date.now()}`,
          type: 'image',
          x: targetX,
          y: targetY,
          width: targetW,
          height: targetH,
          rotation: 0,
          color: '#38BDF8',
          lineWidth: 2,
          imageUrl: dataUrl,
          img,
          name: file.name,
        };

        pushElementsState([...elements, newEl]);
        setSelectedId(newEl.id);
        setTool('select');
        setStatusMessage(`📷 Added "${file.name}"! You can move, rotate, scale, or draw on it.`);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag & Drop Photo
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const coords = getCoords(e.clientX, e.clientY);
            const scale = Math.min(450 / img.width, 350 / img.height, 1);
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);

            const newEl: CanvasElement = {
              id: `image-${Date.now()}`,
              type: 'image',
              x: Math.round(coords.x),
              y: Math.round(coords.y),
              width: w,
              height: h,
              rotation: 0,
              color: '#38BDF8',
              lineWidth: 2,
              imageUrl: ev.target?.result as string,
              img,
              name: file.name,
            };

            pushElementsState([...elements, newEl]);
            setSelectedId(newEl.id);
            setTool('select');
            setStatusMessage(`Dropped image "${file.name}"! Ready to move and annotate.`);
          };
          img.src = ev.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Clipboard Paste Support (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const img = new Image();
              img.onload = () => {
                const canvas = canvasRef.current;
                const rect = canvas ? canvas.getBoundingClientRect() : { width: 1000 };
                const scale = Math.min(550 / img.width, 450 / img.height, 1);
                const w = Math.round(img.width * scale);
                const h = Math.round(img.height * scale);

                const newEl: CanvasElement = {
                  id: `image-${Date.now()}`,
                  type: 'image',
                  x: Math.round(rect.width / 2),
                  y: Math.round(boardHeight / 2),
                  width: w,
                  height: h,
                  rotation: 0,
                  color: '#10B981',
                  lineWidth: 2,
                  imageUrl: ev.target?.result as string,
                  img,
                  name: 'Pasted Screenshot',
                };

                pushElementsState([...elements, newEl]);
                setSelectedId(newEl.id);
                setTool('select');
                setStatusMessage('Pasted screenshot! Drag to move or rotate.');
              };
              img.src = ev.target?.result as string;
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [boardHeight, elements]);

  // Insert Text on Whiteboard
  const handleCommitText = () => {
    if (!textValue.trim()) {
      setTextInputOpen(false);
      return;
    }

    const newEl: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: textInputPos.x,
      y: textInputPos.y,
      width: Math.max(80, textValue.length * (fontSize * 0.65)),
      height: fontSize * 1.5,
      rotation: 0,
      color,
      lineWidth: 2,
      text: textValue,
      fontSize,
      name: `Text: "${textValue.slice(0, 15)}"`,
    };

    pushElementsState([...elements, newEl]);
    setSelectedId(newEl.id);
    setTool('select');
    setTextInputOpen(false);
    setTextValue('');
    setStatusMessage('Added text! Move or rotate with Select Tool.');
  };

  // Sticky Notes Handlers
  const handleAddStickyNote = (colorName: 'yellow' | 'blue' | 'green' | 'pink') => {
    const newNote: StickyNote = {
      id: `note-${Date.now()}`,
      x: 100 + (stickyNotes.length % 5) * 40,
      y: 100 + (stickyNotes.length % 4) * 40,
      text: '📌 Type math doubt or key formula here...',
      color: colorName,
    };
    setStickyNotes((prev) => [...prev, newNote]);
    setStatusMessage('Added colorful sticky note');
  };

  const handleUpdateNote = (id: string, text: string) => {
    setStickyNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  const handleDeleteNote = (id: string) => {
    setStickyNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Insert CBSE Theorem Blueprint
  const handleInsertBlueprint = (bpId: string) => {
    const canvas = canvasRef.current;
    const rect = canvas ? canvas.getBoundingClientRect() : { width: 1100 };
    const midX = Math.round(rect.width / 2);
    const midY = Math.round(boardHeight / 2);

    const bpElements: CanvasElement[] = [];

    if (bpId === 'pythagoras') {
      bpElements.push({
        id: `bp-pyth-tri-${Date.now()}`,
        type: 'triangle',
        x: midX,
        y: midY,
        width: 240,
        height: 200,
        rotation: 0,
        color: '#38BDF8',
        lineWidth: 3,
        name: 'Right Triangle',
      });
      bpElements.push({
        id: `bp-pyth-txt-${Date.now()}`,
        type: 'text',
        x: midX,
        y: midY - 140,
        width: 320,
        height: 30,
        rotation: 0,
        color: '#F59E0B',
        lineWidth: 2,
        fontSize: 20,
        text: 'Pythagoras Theorem: a² + b² = c²',
        name: 'Pythagoras Formula',
      });
    } else if (bpId === 'bpt') {
      bpElements.push({
        id: `bp-bpt-tri-${Date.now()}`,
        type: 'triangle',
        x: midX,
        y: midY,
        width: 300,
        height: 240,
        rotation: 0,
        color: '#10B981',
        lineWidth: 3,
        name: 'Thales Triangle',
      });
      bpElements.push({
        id: `bp-bpt-line-${Date.now()}`,
        type: 'line',
        x: midX,
        y: midY + 10,
        width: 180,
        height: 2,
        rotation: 0,
        color: '#EF4444',
        lineWidth: 3,
        points: [{ x: -90, y: 0 }, { x: 90, y: 0 }],
        name: 'Parallel Line DE',
      });
      bpElements.push({
        id: `bp-bpt-txt-${Date.now()}`,
        type: 'text',
        x: midX,
        y: midY + 160,
        width: 340,
        height: 30,
        rotation: 0,
        color: '#38BDF8',
        lineWidth: 2,
        fontSize: 18,
        text: 'DE ∥ BC  ⟹  AD / DB = AE / EC',
        name: 'BPT Ratio',
      });
    } else if (bpId === 'tangents') {
      bpElements.push({
        id: `bp-circle-${Date.now()}`,
        type: 'circle',
        x: midX + 80,
        y: midY,
        width: 200,
        height: 200,
        rotation: 0,
        color: '#A855F7',
        lineWidth: 3,
        name: 'Circle O',
      });
      bpElements.push({
        id: `bp-tan1-${Date.now()}`,
        type: 'line',
        x: midX - 50,
        y: midY - 45,
        width: 240,
        height: 90,
        rotation: 0,
        color: '#38BDF8',
        lineWidth: 2.5,
        points: [{ x: -120, y: 45 }, { x: 120, y: -45 }],
        name: 'Tangent PA',
      });
      bpElements.push({
        id: `bp-tan2-${Date.now()}`,
        type: 'line',
        x: midX - 50,
        y: midY + 45,
        width: 240,
        height: 90,
        rotation: 0,
        color: '#38BDF8',
        lineWidth: 2.5,
        points: [{ x: -120, y: -45 }, { x: 120, y: 45 }],
        name: 'Tangent PB',
      });
      bpElements.push({
        id: `bp-tan-txt-${Date.now()}`,
        type: 'text',
        x: midX,
        y: midY + 160,
        width: 420,
        height: 30,
        rotation: 0,
        color: '#22C55E',
        lineWidth: 2,
        fontSize: 18,
        text: 'Theorem: Tangents from external point are equal (PA = PB)',
        name: 'Tangents Theorem',
      });
    } else {
      setPaperPattern('grid');
    }

    if (bpElements.length > 0) {
      pushElementsState([...elements, ...bpElements]);
      setSelectedId(bpElements[0].id);
      setTool('select');
    }

    setShowBlueprintsModal(false);
    setStatusMessage(`Constructed ${bpId.toUpperCase()} Blueprint! Use "Select & Move" to arrange.`);
  };

  // Change Board Height (BADA SIZE HANDLER)
  const handleSetHeight = (newHeight: number) => {
    const validHeight = Math.max(500, Math.min(3500, Math.round(newHeight)));
    setBoardHeight(validHeight);
    setStatusMessage(`Whiteboard size changed to ${validHeight}px!`);
  };

  // Quick adjust board height (+ / - 150px)
  const handleAdjustHeight = (delta: number) => {
    handleSetHeight(boardHeight + delta);
  };

  // Auto-fit to viewport screen height
  const handleFitScreenHeight = () => {
    const screenH = window.innerHeight;
    const targetH = Math.max(700, screenH - 180);
    handleSetHeight(targetH);
    setStatusMessage(`Whiteboard auto-fitted to screen (${targetH}px)!`);
  };

  // Change Blank Paper Color
  const handleSelectPaperColor = (colorHex: string) => {
    setPaperColor(colorHex);
    if (isLightColor(colorHex) && (color === '#FFFFFF' || color === '#38BDF8')) {
      setColor('#0F172A');
    } else if (!isLightColor(colorHex) && color === '#0F172A') {
      setColor('#38BDF8');
    }
    setStatusMessage(`Paper changed to ${colorHex}!`);
  };

  // Change Paper Pattern
  const handleSelectPaperPattern = (pat: PaperPattern) => {
    setPaperPattern(pat);
    setStatusMessage(`Paper pattern: ${pat}`);
  };

  // Download high-resolution PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Advaitin-Bada-Whiteboard-${grade}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setStatusMessage('Downloaded high-resolution PNG!');
  };

  // Copy to clipboard
  const handleCopyClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setShowCopyBanner(true);
        setTimeout(() => setShowCopyBanner(false), 3000);
        setStatusMessage('Copied whiteboard image to clipboard!');
      });
    } catch {
      setStatusMessage('Clipboard copy not supported in this browser, use Download PNG!');
    }
  };

  // Send to AI Guru Doubt Solver
  const handleSendToAIGuru = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prompt = `Harsh Sir / AI Guru, please review this mathematical construction on my smart whiteboard and explain the solution step-by-step for ${
      grade === 'class10' ? 'CBSE Class 10' : 'CBSE Class 9'
    }: "${statusMessage}"`;
    if (onAskAIGuruWithDrawing) {
      onAskAIGuruWithDrawing(prompt);
    }
  };

  // Slide Switching
  const handleAddSlide = () => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex] = {
      ...updatedSlides[currentSlideIndex],
      elements: [...elements],
      notes: [...stickyNotes],
      paperColor,
      paperPattern,
    };

    const newSlideId = `slide-${Date.now()}`;
    const newSlide: WhiteboardSlide = {
      id: newSlideId,
      name: `Page ${updatedSlides.length + 1}`,
      elements: [],
      notes: [],
      paperColor,
      paperPattern,
    };

    setSlides([...updatedSlides, newSlide]);
    setCurrentSlideIndex(updatedSlides.length);
    setElements([]);
    setSelectedId(null);
    setUndoStack([]);
    setRedoStack([]);
    setStatusMessage(`Created Page ${updatedSlides.length + 1}`);
  };

  const handleSwitchSlide = (targetIndex: number) => {
    if (targetIndex === currentSlideIndex) return;

    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex] = {
      ...updatedSlides[currentSlideIndex],
      elements: [...elements],
      notes: [...stickyNotes],
      paperColor,
      paperPattern,
    };
    setSlides(updatedSlides);

    const targetSlide = updatedSlides[targetIndex];
    setCurrentSlideIndex(targetIndex);
    setElements(targetSlide.elements || []);
    setSelectedId(null);
    setStickyNotes(targetSlide.notes || []);
    setPaperColor(targetSlide.paperColor || '#050811');
    setPaperPattern(targetSlide.paperPattern || 'grid');
    setUndoStack([]);
    setRedoStack([]);
    setStatusMessage(`Switched to ${targetSlide.name}`);
  };

  // Get currently selected element details
  const selectedElement = elements.find((e) => e.id === selectedId);

  return (
    <div
      ref={containerRef}
      onScroll={(e) => {
        // Prevent horizontal screen shifting in fullscreen and standard modes
        if (e.currentTarget.scrollLeft !== 0) {
          e.currentTarget.scrollLeft = 0;
        }
      }}
      style={{
        overscrollBehaviorX: 'none',
        touchAction: 'pan-y',
        maxWidth: '100%',
      }}
      className={`transition-all duration-300 w-full max-w-full overflow-x-hidden ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-2 sm:p-4 overflow-y-auto overflow-x-hidden w-full h-full box-border'
          : 'max-w-7xl mx-auto space-y-3'
      }`}
    >
      {/* Hidden file input for Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Top Banner: Header & Big Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-sky-950/50 to-slate-900 border border-sky-900/50 p-3 sm:p-4 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-orange-500/30 shrink-0">
            🎨
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                ✨ BADA WHITEBOARD STUDIO
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                👆 Select & Rotate
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Blank Papers
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
              <span>World-Class Smart Whiteboard</span>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/90 px-2.5 py-0.5 rounded-lg border border-amber-500/50 flex items-center gap-1">
                <span>📏 Height:</span>
                <span className="text-amber-400 font-black">{boardHeight}px</span>
              </span>
            </h1>
            <p className="text-xs text-slate-300">
              Draw, select, move, and rotate any drawing or photo! Supports blank color papers, CBSE theorems, and AI Guru.
            </p>
          </div>
        </div>

        {/* Header Right Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-stretch lg:self-auto justify-end">
          {/* PROMINENT WHITEBOARD SIZE BUTTON */}
          <button
            onClick={() => setShowSizeModal(!showSizeModal)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 ring-2 ring-amber-300"
            title="Change Whiteboard Size (छोटा / बड़ा करें: 750px - 2400px & Full Screen)"
          >
            <Sliders className="w-4 h-4 text-slate-950" />
            <span>📏 Board Size: {boardHeight}px ▾</span>
          </button>

          {/* Upload Photo Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Upload any image, NCERT problem, homework photo, or screenshot"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>📷 Add Photo</span>
          </button>

          {/* Blank Color Paper Selector Button */}
          <button
            onClick={() => setShowPaperModal(!showPaperModal)}
            className="px-3 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs rounded-xl shadow-lg shadow-sky-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Choose Blank Color Papers: Yellow, Blue, Pink, Mint, Chalkboard, or Custom"
          >
            <Palette className="w-4 h-4 text-white" />
            <span>🎨 Color Papers</span>
          </button>

          {/* 1-Click CBSE Theorem Blueprints */}
          <button
            onClick={() => setShowBlueprintsModal(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>CBSE Blueprints</span>
          </button>

          {/* Timer Toggle */}
          <button
            onClick={() => setShowTimer(!showTimer)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              showTimer
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span>{stopwatchRunning ? formatTimer(stopwatchSeconds) : 'Timer'}</span>
          </button>

          {/* Fullscreen Theatre Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isFullscreen
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 ring-2 ring-purple-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Open Fullscreen Whiteboard'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="font-black">{isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}</span>
          </button>
        </div>
      </div>

      {/* DEDICATED WHITEBOARD SIZE MASTER BAR (व्हाइटबोर्ड का साइज बार - BADA YA CHOTA KAREN) */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-sky-950/40 border-2 border-amber-500/40 p-3 rounded-2xl shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Left: Size label and 1-Click Size Preset Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl shrink-0">
            <span className="text-sm">📏</span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">
              Board Size (साइज):
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { label: 'Standard', h: 750, badge: '750px' },
              { label: 'Bada', h: 950, badge: '950px' },
              { label: 'Mega', h: 1300, badge: '1300px' },
              { label: 'Giant', h: 1800, badge: '1800px' },
              { label: 'Super Giant', h: 2400, badge: '2400px' },
            ].map((preset) => (
              <button
                key={preset.h}
                onClick={() => handleSetHeight(preset.h)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                  boardHeight === preset.h
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 ring-2 ring-amber-300 scale-105 shadow-md shadow-amber-500/30'
                    : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
                title={`Set whiteboard height to ${preset.h}px`}
              >
                <span>{preset.label}</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  boardHeight === preset.h ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-sky-400'
                }`}>
                  {preset.badge}
                </span>
              </button>
            ))}

            {/* Auto Fit-to-Screen Button */}
            <button
              onClick={handleFitScreenHeight}
              className="px-2.5 py-1.5 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="Automatically fit whiteboard height to full screen window"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>🖥️ Fit Screen</span>
            </button>
          </div>
        </div>

        {/* Right: Quick +/- 150px Increments & Live Height Slider */}
        <div className="flex items-center gap-2 self-stretch lg:self-auto justify-end flex-wrap">
          {/* Minus 150px */}
          <button
            onClick={() => handleAdjustHeight(-150)}
            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
            title="Make whiteboard 150px smaller"
          >
            ➖ -150px
          </button>

          {/* Plus 150px */}
          <button
            onClick={() => handleAdjustHeight(150)}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
            title="Make whiteboard 150px bigger ('और बड़ा करो')"
          >
            ➕ +150px Bada
          </button>

          {/* Continuous Height Range Slider */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">Custom:</span>
            <input
              type="range"
              min="600"
              max="3000"
              step="50"
              value={boardHeight}
              onChange={(e) => handleSetHeight(Number(e.target.value))}
              className="w-24 sm:w-32 accent-amber-400 cursor-pointer"
            />
            <span className="text-xs font-mono font-black text-amber-400 min-w-[50px] text-right">
              {boardHeight}px
            </span>
          </div>
        </div>
      </div>

      {/* Blank Color Paper Quick-Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Quick Blank Color Paper Swatches */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1 shrink-0">
            <span>🎨 Blank Papers:</span>
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {BLANK_PAPER_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPaperColor(p.hex)}
                style={{ backgroundColor: p.hex, color: p.textDark ? '#0F172A' : '#FFFFFF' }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 transition-all cursor-pointer shadow-sm shrink-0 flex items-center gap-1 ${
                  paperColor.toLowerCase() === p.hex.toLowerCase()
                    ? 'scale-110 ring-2 ring-sky-400 border-sky-500 shadow-md'
                    : 'border-slate-700 hover:scale-105 opacity-90 hover:opacity-100'
                }`}
                title={p.name}
              >
                <span>{p.badge}</span>
              </button>
            ))}

            {/* Custom Color Paper Picker */}
            <label
              className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Pick any custom blank color paper"
            >
              <span>🎨 Custom Color:</span>
              <input
                type="color"
                value={paperColor}
                onChange={(e) => handleSelectPaperColor(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              />
            </label>
          </div>
        </div>

        {/* Paper Pattern Option (Plain Blank, Ruled Notebook, Graph Grid, Dots) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <span className="text-[10px] text-slate-400 px-1 font-mono uppercase">Pattern:</span>
          {[
            { id: 'plain', label: '📄 Plain' },
            { id: 'ruled', label: '📝 Ruled' },
            { id: 'grid', label: '📐 Grid' },
            { id: 'dots', label: '📜 Dots' },
          ].map((pat) => (
            <button
              key={pat.id}
              onClick={() => handleSelectPaperPattern(pat.id as PaperPattern)}
              className={`px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                paperPattern === pat.id
                  ? 'bg-slate-800 text-sky-400 border border-sky-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {pat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Stopwatch Widget if active */}
      {showTimer && (
        <div className="flex items-center justify-between bg-slate-900/95 border border-amber-500/40 px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              ⏱️ Timed Solving Drill:
            </span>
            <span className="font-mono text-xl font-black text-white">{formatTimer(stopwatchSeconds)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStopwatchRunning(!stopwatchRunning)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
            >
              {stopwatchRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{stopwatchRunning ? 'Pause' : 'Start'}</span>
            </button>
            <button
              onClick={() => {
                setStopwatchRunning(false);
                setStopwatchSeconds(0);
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Toolbar */}
      <div className="flex flex-col gap-2.5 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-xl">
        {/* Row 1: Tools Group + Eraser & Brush Size Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Tools Group */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {/* 1. SELECT & MOVE TOOL (Highlighted prominently) */}
            <button
              onClick={() => {
                setTool('select');
                setStatusMessage('👆 Select & Move active: Click any drawing, shape, or photo to move and rotate it!');
              }}
              className={`px-3 py-1.5 rounded-lg font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                tool === 'select'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-md shadow-amber-500/30 scale-105 ring-2 ring-amber-300'
                  : 'text-amber-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Select any drawn line, shape, text, or photo to move, rotate, and scale!"
            >
              <MousePointer className="w-4 h-4" />
              <span>👆 Select &amp; Move</span>
            </button>

            {[
              { id: 'pen', label: 'Pen', icon: Pen },
              { id: 'highlighter', label: 'Highlighter', icon: Highlighter },
              { id: 'laser', label: 'Laser Pointer', icon: Sparkles },
              { id: 'line', label: 'Ruler', icon: Minus },
              { id: 'arrow', label: 'Arrow', icon: MoveRight },
              { id: 'circle', label: 'Circle', icon: Circle },
              { id: 'rectangle', label: 'Box', icon: Square },
              { id: 'triangle', label: 'Triangle', icon: Triangle },
              { id: 'text', label: 'Text', icon: Type },
              { id: 'stamp', label: 'Math Stamp', icon: Smile },
              { id: 'eraser', label: 'Eraser', icon: Eraser },
            ].map((t) => {
              const IconComp = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTool(t.id as ToolType);
                    setSelectedId(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    tool === t.id
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Brush / Stroke Size Presets */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono uppercase px-1">Pen Size:</span>
            {[
              { label: 'Fine (2px)', val: 2 },
              { label: 'Medium (4px)', val: 4 },
              { label: 'Thick (8px)', val: 8 },
              { label: 'Bold (14px)', val: 14 },
              { label: 'Marker (24px)', val: 24 },
            ].map((sz) => (
              <button
                key={sz.val}
                onClick={() => setLineWidth(sz.val)}
                className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  lineWidth === sz.val
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                {sz.val}px
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Pen Colors, Thickness Slider, Sticky Notes & Export */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          {/* Pen Color Palette */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Ink Color:</span>
            <div className="flex items-center gap-1.5">
              {[
                { hex: '#38BDF8', name: 'Sky Cyan' },
                { hex: '#10B981', name: 'Emerald Green' },
                { hex: '#F59E0B', name: 'Amber Yellow' },
                { hex: '#EF4444', name: 'Rose Red' },
                { hex: '#A855F7', name: 'Purple' },
                { hex: '#EC4899', name: 'Pink' },
                { hex: '#FFFFFF', name: 'Pure White' },
                { hex: '#0F172A', name: 'Navy Black' },
              ].map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    setColor(c.hex);
                    if (selectedId) handleChangeSelectedColor(c.hex);
                  }}
                  style={{ backgroundColor: c.hex }}
                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer shadow-sm ${
                    color === c.hex
                      ? 'scale-125 border-white shadow-md ring-2 ring-sky-400'
                      : 'border-slate-700 hover:scale-110'
                  }`}
                  title={c.name}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  if (selectedId) handleChangeSelectedColor(e.target.value);
                }}
                className="w-6 h-6 rounded-full border-0 cursor-pointer bg-transparent"
                title="Custom Ink Color"
              />
            </div>
          </div>

          {/* Stroke Width Slider */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400">Width:</span>
            <input
              type="range"
              min="1"
              max="28"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-20 accent-sky-400 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-sky-400 w-6">{lineWidth}px</span>
          </div>

          {/* Eraser Size Presets if eraser selected */}
          {tool === 'eraser' && (
            <div className="flex items-center gap-1 bg-rose-950/40 border border-rose-500/40 px-2 py-1 rounded-xl">
              <span className="text-[10px] text-rose-300 font-mono">Eraser:</span>
              {[
                { label: 'Small', sz: 15 },
                { label: 'Medium', sz: 35 },
                { label: 'Large', sz: 70 },
                { label: 'Mega', sz: 120 },
              ].map((e) => (
                <button
                  key={e.sz}
                  onClick={() => setEraserSize(e.sz)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                    eraserSize === e.sz ? 'bg-rose-500 text-white' : 'text-rose-300 hover:bg-rose-900/60'
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          )}

          {/* Sticky Notes Inserter */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono">Sticky Note:</span>
            {(['yellow', 'blue', 'green', 'pink'] as const).map((col) => (
              <button
                key={col}
                onClick={() => handleAddStickyNote(col)}
                className={`w-5 h-5 rounded cursor-pointer transition-transform hover:scale-110 border ${
                  col === 'yellow'
                    ? 'bg-amber-400 border-amber-300'
                    : col === 'blue'
                    ? 'bg-sky-400 border-sky-300'
                    : col === 'green'
                    ? 'bg-emerald-400 border-emerald-300'
                    : 'bg-pink-400 border-pink-300'
                }`}
                title={`Add ${col} sticky note`}
              />
            ))}
          </div>

          {/* Action Tools: Undo, Redo, Clear, Save, Copy, AI Guru */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                undoStack.length > 0
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-900 text-slate-600 cursor-not-allowed'
              }`}
              title="Undo last action"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                redoStack.length > 0
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-900 text-slate-600 cursor-not-allowed'
              }`}
              title="Redo action"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleClear}
              className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              title="Clear entire whiteboard"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              onClick={handleCopyClipboard}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Copy entire board to clipboard"
            >
              <Copy className="w-3.5 h-3.5 text-sky-400" />
              <span>Copy</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-md shadow-emerald-600/30 cursor-pointer"
              title="Download full whiteboard as high-res PNG image"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save PNG</span>
            </button>

            {onAskAIGuruWithDrawing && (
              <button
                onClick={handleSendToAIGuru}
                className="px-3 py-1.5 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-sky-600/30 cursor-pointer"
                title="Send current drawing to AI Guru Doubt Solver to review and solve"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Verify with AI Guru</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Math Stamp Symbols (if stamp tool selected) */}
        {tool === 'stamp' && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 border-t border-slate-800 max-w-full">
            <span className="text-[11px] text-slate-400 shrink-0">Click symbol to stamp on canvas:</span>
            {MATH_STAMPS.map((s) => (
              <button
                key={s.symbol}
                onClick={() => setActiveStamp(s.symbol)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs border transition-all cursor-pointer shrink-0 ${
                  activeStamp === s.symbol
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black scale-110 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
                title={s.label}
              >
                {s.symbol}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pages / Slides Bar (Slide 1, Slide 2, Add Page) */}
      <div className="flex items-center justify-between bg-slate-900/70 border border-slate-800 px-4 py-2 rounded-xl text-xs">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Classroom Slides:</span>
          </span>
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleSwitchSlide(idx)}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                idx === currentSlideIndex
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s.name}
            </button>
          ))}
          <button
            onClick={handleAddSlide}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/30 rounded-lg font-bold flex items-center gap-1 cursor-pointer shrink-0"
            title="Add a new blank slide page"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>+ New Slide</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono hidden md:flex items-center gap-3 shrink-0">
          <span>Slide {currentSlideIndex + 1} of {slides.length}</span>
          <span>•</span>
          <span className="text-amber-400 font-bold">Board Size: {boardHeight}px</span>
          <span>•</span>
          <span>Elements: {elements.length}</span>
        </div>
      </div>

      {/* Main Canvas Viewport Area - BADA SIZE WITH ZERO HORIZONTAL SHIFT */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          height: `${boardHeight}px`,
          touchAction: 'none',
          overscrollBehavior: 'none',
        }}
        className="relative w-full max-w-full border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl select-none"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
              handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
              handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handlePointerUp();
          }}
          className={`w-full block select-none ${
            tool === 'select' ? 'cursor-default' : 'cursor-crosshair'
          }`}
          style={{ height: `${boardHeight}px`, touchAction: 'none' }}
        />

        {/* Selected Element Interactive Transform Box (Move, Rotate, Resize, Toolbar) */}
        {selectedElement && (
          <div
            style={{
              left: `${selectedElement.x}px`,
              top: `${selectedElement.y}px`,
              width: `${Math.max(selectedElement.width + 16, 48)}px`,
              height: `${Math.max(selectedElement.height + 16, 48)}px`,
              transform: `translate(-50%, -50%) rotate(${selectedElement.rotation}deg)`,
              transformOrigin: 'center center',
            }}
            className="absolute pointer-events-auto border-2 border-dashed border-sky-400 rounded-lg shadow-xl shadow-sky-500/20 z-30 select-none group"
          >
            {/* Move Area (Drag from center to move anywhere) */}
            <div
              onMouseDown={(e) => {
                e.stopPropagation();
                setTransformMode('move');
                const pos = getCoords(e.clientX, e.clientY);
                setTransformStart({
                  mouseX: pos.x,
                  mouseY: pos.y,
                  elemX: selectedElement.x,
                  elemY: selectedElement.y,
                  elemW: selectedElement.width,
                  elemH: selectedElement.height,
                  elemRot: selectedElement.rotation,
                });
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.touches.length > 0) {
                  setTransformMode('move');
                  const pos = getCoords(e.touches[0].clientX, e.touches[0].clientY);
                  setTransformStart({
                    mouseX: pos.x,
                    mouseY: pos.y,
                    elemX: selectedElement.x,
                    elemY: selectedElement.y,
                    elemW: selectedElement.width,
                    elemH: selectedElement.height,
                    elemRot: selectedElement.rotation,
                  });
                }
              }}
              className="absolute inset-0 cursor-move flex items-center justify-center bg-sky-400/5 hover:bg-sky-400/15 transition-colors rounded-lg"
              title="Drag anywhere to move ('इधर-उधर करें')"
            >
              <div className="opacity-0 group-hover:opacity-80 transition-opacity bg-slate-900/90 text-sky-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 border border-sky-500/40 pointer-events-none">
                <Move className="w-3 h-3" />
                <span>Move</span>
              </div>
            </div>

            {/* Rotation Stem Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0.5 h-6 bg-sky-400 pointer-events-none" />

            {/* Interactive Rotate Knob at top */}
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                setTransformMode('rotate');
                const pos = getCoords(e.clientX, e.clientY);
                setTransformStart({
                  mouseX: pos.x,
                  mouseY: pos.y,
                  elemX: selectedElement.x,
                  elemY: selectedElement.y,
                  elemW: selectedElement.width,
                  elemH: selectedElement.height,
                  elemRot: selectedElement.rotation,
                });
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.touches.length > 0) {
                  setTransformMode('rotate');
                  const pos = getCoords(e.touches[0].clientX, e.touches[0].clientY);
                  setTransformStart({
                    mouseX: pos.x,
                    mouseY: pos.y,
                    elemX: selectedElement.x,
                    elemY: selectedElement.y,
                    elemW: selectedElement.width,
                    elemH: selectedElement.height,
                    elemRot: selectedElement.rotation,
                  });
                }
              }}
              className="absolute -top-9 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 border-2 border-white shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-40"
              title="Drag knob to Rotate element in 360°"
            >
              <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Corner Scale Handle (Bottom-Right) */}
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                setTransformMode('resize');
                const pos = getCoords(e.clientX, e.clientY);
                setTransformStart({
                  mouseX: pos.x,
                  mouseY: pos.y,
                  elemX: selectedElement.x,
                  elemY: selectedElement.y,
                  elemW: selectedElement.width,
                  elemH: selectedElement.height,
                  elemRot: selectedElement.rotation,
                });
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.touches.length > 0) {
                  setTransformMode('resize');
                  const pos = getCoords(e.touches[0].clientX, e.touches[0].clientY);
                  setTransformStart({
                    mouseX: pos.x,
                    mouseY: pos.y,
                    elemX: selectedElement.x,
                    elemY: selectedElement.y,
                    elemW: selectedElement.width,
                    elemH: selectedElement.height,
                    elemRot: selectedElement.rotation,
                  });
                }
              }}
              className="absolute -bottom-2 -right-2 w-5 h-5 rounded-md bg-sky-500 border-2 border-white shadow-lg cursor-nwse-resize hover:scale-125 transition-transform"
              title="Resize / Scale element"
            />

            {/* Other 3 Corner Dots for Visual Bounding */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border border-sky-500" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border border-sky-500" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border border-sky-500" />

            {/* Floating Inspector Ribbon (Un-rotated directly beneath element) */}
            <div
              style={{
                transform: `rotate(${-selectedElement.rotation}deg)`,
              }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-sky-500/50 p-1.5 rounded-2xl shadow-2xl flex items-center gap-1 backdrop-blur-md z-40 whitespace-nowrap"
            >
              {/* Rotation Angle Badge */}
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-500/40">
                {Math.round(selectedElement.rotation)}°
              </span>

              {/* Rotate Left 15° */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRotateSelected(-15);
                }}
                className="p-1.5 hover:bg-slate-800 text-sky-400 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-0.5 cursor-pointer"
                title="Rotate Left 15°"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[10px]">-15°</span>
              </button>

              {/* Rotate Right 15° */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRotateSelected(15);
                }}
                className="p-1.5 hover:bg-slate-800 text-sky-400 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-0.5 cursor-pointer"
                title="Rotate Right 15°"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="text-[10px]">+15°</span>
              </button>

              {/* Quick 90° Turn */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRotateSelected(90);
                }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg text-[10px] font-bold cursor-pointer"
                title="Rotate 90 degrees"
              >
                90°
              </button>

              {/* Reset to 0° */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetRotation();
                }}
                className="px-1.5 py-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-[10px] cursor-pointer"
                title="Reset angle to 0°"
              >
                0°
              </button>

              <div className="w-px h-4 bg-slate-800 mx-0.5" />

              {/* Layer Up */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLayerOrder('up');
                }}
                className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded text-xs cursor-pointer"
                title="Bring Forward"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>

              {/* Layer Down */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLayerOrder('down');
                }}
                className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded text-xs cursor-pointer"
                title="Send Backward"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-4 bg-slate-800 mx-0.5" />

              {/* Duplicate */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicateSelected();
                }}
                className="p-1.5 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 rounded-lg text-xs cursor-pointer"
                title="Duplicate / Copy Element"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              {/* Delete / Remove */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSelected();
                }}
                className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg text-xs font-bold cursor-pointer"
                title="Delete element ('हटाएं')"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Laser Pointer Glowing Red Trail */}
        {tool === 'laser' && (
          <div className="pointer-events-none absolute inset-0 z-20">
            {laserPoints.map((p, idx) => {
              const age = Date.now() - p.time;
              if (age > 1200) return null;
              const opacity = Math.max(0, 1 - age / 1200);
              return (
                <div
                  key={idx}
                  style={{
                    left: `${p.x}px`,
                    top: `${p.y}px`,
                    opacity,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/80 animate-ping"
                />
              );
            })}
            <div
              style={{
                left: `${currentPos.x}px`,
                top: `${currentPos.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-xl shadow-red-600/90 pointer-events-none"
            />
          </div>
        )}

        {/* Draggable Sticky Notes rendered over canvas */}
        {stickyNotes.map((note) => (
          <div
            key={note.id}
            style={{
              left: `${note.x}px`,
              top: `${note.y}px`,
            }}
            className={`absolute z-20 p-3 rounded-xl shadow-2xl border w-64 backdrop-blur-md transition-shadow group ${
              note.color === 'yellow'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-500/20'
                : note.color === 'blue'
                ? 'bg-sky-400 text-slate-950 border-sky-300 shadow-sky-500/20'
                : note.color === 'green'
                ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-emerald-500/20'
                : 'bg-pink-400 text-slate-950 border-pink-300 shadow-pink-500/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                📌 Sticky Note
              </span>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="opacity-60 hover:opacity-100 text-slate-950 font-bold text-xs p-0.5 rounded cursor-pointer"
                title="Remove sticky note"
              >
                ✕
              </button>
            </div>
            <textarea
              value={note.text}
              onChange={(e) => handleUpdateNote(note.id, e.target.value)}
              rows={3}
              className="w-full bg-transparent text-xs font-semibold resize-none focus:outline-none placeholder-slate-800"
              placeholder="Write math formula or question..."
            />
          </div>
        ))}

        {/* Direct Text Insertion Popup Modal */}
        {textInputOpen && (
          <div
            style={{
              left: `${Math.min(textInputPos.x, 700)}px`,
              top: `${Math.min(textInputPos.y, boardHeight - 120)}px`,
            }}
            className="absolute z-30 bg-slate-900 border-2 border-sky-500 p-3 rounded-xl shadow-2xl flex flex-col gap-2 w-72"
          >
            <div className="flex items-center justify-between text-xs text-sky-400 font-bold">
              <span>✍️ Insert Text on Board</span>
              <button
                onClick={() => setTextInputOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              autoFocus
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCommitText();
                if (e.key === 'Escape') setTextInputOpen(false);
              }}
              placeholder="Type equation, formula, or notes..."
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-sky-400"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span>Font:</span>
                <input
                  type="range"
                  min="12"
                  max="48"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-16 accent-sky-400"
                />
                <span className="font-mono">{fontSize}px</span>
              </div>
              <button
                onClick={handleCommitText}
                className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                Place Text
              </button>
            </div>
          </div>
        )}

        {/* Live Status Bar at bottom of canvas */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 font-mono pointer-events-none bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Tool: <strong className="text-sky-400 uppercase">{tool}</strong>
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              Size: <strong className="text-amber-400">{boardHeight}px</strong>
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              Pos: ({Math.round(currentPos.x)}, {Math.round(currentPos.y)})
            </span>
            {selectedElement && (
              <span className="text-amber-400 font-bold hidden md:inline">
                | Selected: {selectedElement.name || selectedElement.type} ({Math.round(selectedElement.rotation)}°)
              </span>
            )}
          </div>
          <div className="truncate text-amber-300 font-semibold max-w-[50%] text-right">
            {statusMessage}
          </div>
        </div>

        {/* Copy confirmation toast */}
        {showCopyBanner && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce z-40">
            <Check className="w-4 h-4" />
            <span>Whiteboard copied to clipboard! Paste anywhere (Ctrl+V)</span>
          </div>
        )}
      </div>

      {/* Quick Help / Usage Highlights Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 text-base">📏</div>
          <div>
            <h4 className="font-bold text-white">Bada Whiteboard Size (750px - 2400px)</h4>
            <p className="text-slate-400 mt-0.5 leading-relaxed">
              Click &quot;Board Size&quot; or use the 1-click pills above to expand your whiteboard to Standard (750px), Bada (950px), Mega (1300px), or Giant (1800px-2400px)!
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 text-base">👆</div>
          <div>
            <h4 className="font-bold text-white">Select, Move &amp; Rotate Anything</h4>
            <p className="text-slate-400 mt-0.5 leading-relaxed">
              Use &quot;👆 Select &amp; Move&quot; to click any drawing, shape, or photo. Drag anywhere or twist the top knob to rotate 360°!
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-base">🤖</div>
          <div>
            <h4 className="font-bold text-white">1-Click AI Guru Doubt Solver</h4>
            <p className="text-slate-400 mt-0.5 leading-relaxed">
              Click &quot;Verify with AI Guru&quot; to send your whiteboard construction to AI Guru for instant step-by-step review!
            </p>
          </div>
        </div>
      </div>

      {/* POPUP MODAL 1: WHITEBOARD SIZE CUSTOMIZER MODAL */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📏</span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Whiteboard Size (बोर्ड का साइज चुनें)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Choose from standard size, mega bada size, giant size, or customize exactly in pixels
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSizeModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { title: 'Standard', h: 750, desc: 'Compact single question solving' },
                { title: 'Bada Board', h: 950, desc: 'Default studio size with room' },
                { title: 'Mega Bada', h: 1300, desc: 'Long equations & step-by-step proofs' },
                { title: 'Giant Board', h: 1800, desc: 'Blackboard classroom lecture space' },
                { title: 'Super Giant', h: 2400, desc: 'Unlimited full-chapter math notes' },
                { title: 'Full Window', h: Math.max(700, window.innerHeight - 180), desc: 'Auto-fit entire screen height' },
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() => {
                    handleSetHeight(item.h);
                    setShowSizeModal(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    boardHeight === item.h
                      ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-400/50 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{item.title}</span>
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded">
                        {item.h}px
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-sky-400">
                    {boardHeight === item.h ? '✓ Active Size' : 'Select Size →'}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Slider in Modal */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Custom Height Adjustment:</span>
                <span className="font-mono font-black text-amber-400 text-sm">{boardHeight}px</span>
              </div>
              <input
                type="range"
                min="600"
                max="3000"
                step="50"
                value={boardHeight}
                onChange={(e) => handleSetHeight(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Small (600px)</span>
                <span>Normal (950px)</span>
                <span>Giant (1800px)</span>
                <span>Super (3000px)</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowSizeModal(false)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Apply Size
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: BLANK COLOR PAPER MODAL */}
      {showPaperModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-sky-500/50 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Blank Color Papers (ब्लैंक कलर पेपर चुनें)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Switch to yellow exam pad, mint green, soft pink, blackboard, or custom paper
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPaperModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {BLANK_PAPER_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    handleSelectPaperColor(p.hex);
                    setShowPaperModal(false);
                  }}
                  style={{
                    backgroundColor: p.hex,
                    color: p.textDark ? '#0F172A' : '#FFFFFF',
                    borderColor: p.border,
                  }}
                  className={`p-3 rounded-2xl border-2 font-black text-xs text-left transition-all cursor-pointer shadow-sm hover:scale-105 flex items-center justify-between ${
                    paperColor.toLowerCase() === p.hex.toLowerCase()
                      ? 'ring-4 ring-sky-400 scale-105'
                      : 'opacity-95 hover:opacity-100'
                  }`}
                >
                  <span>{p.badge}</span>
                  {paperColor.toLowerCase() === p.hex.toLowerCase() && (
                    <span className="text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Color Picker in Modal */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300">Custom Paper Color:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={paperColor}
                  onChange={(e) => handleSelectPaperColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono font-bold text-sky-400">{paperColor}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowPaperModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL 3: CBSE THEOREM BLUEPRINTS MODAL */}
      {showBlueprintsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📐</span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    1-Click CBSE Theorem Blueprints
                  </h3>
                  <p className="text-xs text-slate-400">
                    Insert accurate mathematical constructions directly onto the whiteboard
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBlueprintsModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {PRESET_SAMPLE_DIAGRAMS.map((d) => (
                <div
                  key={d.id}
                  onClick={() => handleInsertBlueprint(d.id)}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/60 p-3.5 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] space-y-1.5 group"
                >
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
                    {d.category}
                  </span>
                  <h4 className="text-xs font-bold text-white group-hover:text-sky-300">
                    {d.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {d.description}
                  </p>
                  <div className="pt-2 text-[11px] text-sky-400 font-bold flex items-center gap-1">
                    <span>Insert on Board</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowBlueprintsModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
