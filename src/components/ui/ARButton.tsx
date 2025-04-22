import { Rocket } from "lucide-react";

interface ARButtonProps {
  modelName: string;
  title: string;
  description: string;
  link?: string;
  arModel?: string;
  arScale?: number;
  arPosition?: { x: number; y: number; z: number };
  arRotation?: { x: number; y: number; z: number };
  category?: string;
  color?: string;
}

export const ARButton: React.FC<ARButtonProps> = ({
  title,
  description,
  link,
  arModel,
  arScale = 1,
  arPosition = { x: 0, y: 0.5, z: 0 },
  arRotation = { x: 0, y: 0, z: 0 },
  category,
  color = '#000000'
}) => {
  const launchAR = () => {
    if (!arModel) {
      console.error('AR model URL is missing');
      alert('Cannot launch AR viewer: No model URL provided');
      return;
    }

    const isFaceItem = category && ['sunglass', 'glasses', 'hat', 'hats',"cap", 'mask'].includes(category.toLowerCase());
    const modelType = isFaceItem ? 'face' : 'object';
    
    // Store all parameters in sessionStorage
    sessionStorage.setItem('modelName', title);
    sessionStorage.setItem('title', title);
    sessionStorage.setItem('description', description);
    sessionStorage.setItem('link', link || '#');
    sessionStorage.setItem('modelType', modelType);
    sessionStorage.setItem('arModel', arModel);
    sessionStorage.setItem('color', color);
    sessionStorage.setItem('size', arScale.toString());
    sessionStorage.setItem('arPosition', JSON.stringify(arPosition));
    sessionStorage.setItem('arRotation', JSON.stringify(arRotation));
    if (category) sessionStorage.setItem('category', category.toLowerCase());

    window.open('/ar-viewer', '_blank');
  };

  return (
    <button
      onClick={launchAR}
      className="flex items-center justify-center gap-2 w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
      aria-label={`View ${title} in AR`}
    >
      <Rocket className="w-5 h-5" />
      View in AR
    </button>
  );
};