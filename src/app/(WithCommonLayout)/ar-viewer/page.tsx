'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

interface Position {
  x: number;
  y: number;
  z: number;
}

export default function ARViewerPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [size, setSize] = useState<number>(1);
  const [color, setColor] = useState<string>('#000000');
  const [position, setPosition] = useState<Position>({ x: 0, y: 0.5, z: 0 });
  const [modelName, setModelName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [link, setLink] = useState<string>('#');
  const [imageSrc, setImageSrc] = useState<string>('');
  const [arModel, setArModel] = useState<string>('');
  const [arMode, setArMode] = useState<'object' | 'face'>('object');
  const [category, setCategory] = useState<string>('');
  const [showColorPicker, setShowColorPicker] = useState<boolean>(true);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Load all parameters from sessionStorage
    const loadSessionData = () => {
      setModelName(sessionStorage.getItem('modelName') || '');
      setSize(Number(sessionStorage.getItem('size')) || 1);
      setColor(sessionStorage.getItem('color') || '#000000');
      setTitle(sessionStorage.getItem('title') || '');
      setDescription(sessionStorage.getItem('description') || '');
      setLink(sessionStorage.getItem('link') || '#');
      setImageSrc(sessionStorage.getItem('imageSrc') || '');
      setArModel(sessionStorage.getItem('arModel') || '');
      setArMode((sessionStorage.getItem('modelType') as 'object' | 'face') || 'object');
      setCategory(sessionStorage.getItem('category') || '');
      
      const positionStr = sessionStorage.getItem('arPosition');
      if (positionStr) {
        try {
          setPosition(JSON.parse(positionStr));
        } catch (e) {
          console.error('Error parsing position:', e);
        }
      }
      
      setShowColorPicker(arMode !== 'face');
    };

    loadSessionData();
  }, []);

  useEffect(() => {
    if (iframeLoaded && iframeRef.current && arModel) {
      const message = { 
        type: 'INITIALIZE_SCENE',
        mode: arMode,
        modelUrl: arModel,
        color,
        size,
        position,
        category
      };
      
      console.log('Sending to AR scene:', message);
      iframeRef.current.contentWindow?.postMessage(message, '*');
    }
  }, [iframeLoaded, arModel, arMode, color, size, position, category]);

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(event.target.value);
    setSize(newSize);
    sessionStorage.setItem('size', newSize.toString());
    
    iframeRef.current?.contentWindow?.postMessage({
      type: 'CHANGE_SIZE',
      size: newSize
    }, '*');
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
    sessionStorage.setItem('color', newColor);
    
    iframeRef.current?.contentWindow?.postMessage({
      type: 'CHANGE_COLOR',
      color: newColor
    }, '*');
  };

  const handlePositionChange = (axis: keyof Position, value: number) => {
    const newPos = { ...position, [axis]: value };
    setPosition(newPos);
    sessionStorage.setItem('arPosition', JSON.stringify(newPos));
    
    iframeRef.current?.contentWindow?.postMessage({
      type: 'CHANGE_POSITION',
      position: newPos
    }, '*');
  };

  return (
    <>
      <Head>
        <title>{title} - AR Viewer</title>
        <meta name="description" content={`AR experience for ${title}`} />
      </Head>
      
      <div className="flex flex-col min-h-screen bg-gray-100 p-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-600">{description}</p>
          <button 
            onClick={() => router.back()}
            className="text-blue-600 hover:underline mt-2"
          >
            ← Back to product
          </button>
        </div>

        <div className="flex-grow flex flex-col lg:flex-row gap-4">
          <div className="lg:w-3/4 h-96 lg:h-auto bg-white rounded-lg shadow-md overflow-hidden">
            <iframe
              ref={iframeRef}
              onLoad={() => setIframeLoaded(true)}
              className="w-full h-full border-none"
              src="/ar-scene.html"
              title={`AR Viewer for ${title}`}
              allow="camera; accelerometer; gyroscope"
              allowFullScreen
            />
          </div>

          <div className="lg:w-1/4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">AR Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode: {arMode === 'face' ? 'Face Tracking' : 'Object View'}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size: {size.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.01"
                  value={size}
                  onChange={handleSizeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {showColorPicker && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    className="w-full h-10 cursor-pointer"
                  />
                </div>
              )}

              {arMode === 'object' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['x', 'y', 'z'] as const).map((axis) => (
                      <div key={axis}>
                        <label className="block text-xs text-gray-500 uppercase">
                          {axis}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={position[axis]}
                          onChange={(e) => handlePositionChange(axis, parseFloat(e.target.value))}
                          className="w-full p-1 border rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}