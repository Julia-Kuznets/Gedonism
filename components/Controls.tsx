import React, { useState } from 'react';
import { Slide, AspectRatio, ImageSize, ImageGenerationConfig } from '../types';
import { ChevronLeft, ChevronRight, Wand2, Search, Edit, ImagePlus, Loader2 } from 'lucide-react';

interface ControlsProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onGenerateText: () => void;
  onGenerateImage: (config: ImageGenerationConfig, prompt: string) => void;
  onEditImage: (prompt: string) => void;
  isGenerating: boolean;
  slide: Slide;
}

const Controls: React.FC<ControlsProps> = ({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
  onGenerateText,
  onGenerateImage,
  onEditImage,
  isGenerating,
  slide
}) => {
  const [showImageTools, setShowImageTools] = useState(false);
  const [showEditTools, setShowEditTools] = useState(false);
  
  // Image Generation State
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [customPrompt, setCustomPrompt] = useState(slide.imagePrompt);

  // Image Edit State
  const [editPrompt, setEditPrompt] = useState('');

  const handleGenImage = () => {
    onGenerateImage({ aspectRatio, imageSize }, customPrompt);
    setShowImageTools(false);
  };

  const handleEditImage = () => {
    onEditImage(editPrompt);
    setEditPrompt('');
    setShowEditTools(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none flex flex-col justify-end items-center z-50">
      
      {/* Popups */}
      <div className="pointer-events-auto mb-4 w-full max-w-2xl">
        {showImageTools && (
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-2xl mb-2 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-slate-700">Generate New Image (Nano Banana Pro)</h3>
              <button onClick={() => setShowImageTools(false)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Aspect Ratio</label>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm"
                >
                  <option value="1:1">1:1 (Square)</option>
                  <option value="3:4">3:4 (Portrait)</option>
                  <option value="4:3">4:3 (Landscape)</option>
                  <option value="9:16">9:16 (Tall)</option>
                  <option value="16:9">16:9 (Wide)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Size</label>
                <select 
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value as ImageSize)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm"
                >
                  <option value="1K">1K</option>
                  <option value="2K">2K</option>
                  <option value="4K">4K</option>
                </select>
              </div>
            </div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm mb-3 min-h-[80px]"
              placeholder="Describe the happy cat..."
            />
            <button 
              onClick={handleGenImage}
              disabled={isGenerating}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
               {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : <ImagePlus className="w-4 h-4" />}
               Generate
            </button>
          </div>
        )}

        {showEditTools && (
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-2xl mb-2 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-slate-700">Edit Current Image (Nano Banana)</h3>
              <button onClick={() => setShowEditTools(false)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
            </div>
            <input
              type="text"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm mb-3"
              placeholder="e.g., 'Add a party hat', 'Make it a watercolor painting'..."
            />
            <button 
              onClick={handleEditImage}
              disabled={isGenerating}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
               {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Wand2 className="w-4 h-4" />}
               Apply Edit
            </button>
          </div>
        )}
      </div>

      {/* Main Bar */}
      <div className="pointer-events-auto bg-slate-900/90 backdrop-blur text-white p-2 rounded-2xl shadow-2xl flex items-center gap-4">
        
        {/* Nav */}
        <div className="flex items-center gap-2 pr-4 border-r border-slate-700">
          <button 
            onClick={onPrev}
            disabled={currentSlide === 0}
            className="p-2 hover:bg-slate-700 rounded-full disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="font-mono text-sm w-12 text-center text-slate-400">
            {currentSlide + 1} / {totalSlides}
          </span>
          <button 
            onClick={onNext}
            disabled={currentSlide === totalSlides - 1}
            className="p-2 hover:bg-slate-700 rounded-full disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          
          <button 
            onClick={onGenerateText}
            disabled={isGenerating}
            title="Research & Expand Text (Google Search)"
            className="p-2.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span className="hidden sm:inline text-sm font-medium">Research</span>
          </button>

          <button 
            onClick={() => { setShowImageTools(!showImageTools); setShowEditTools(false); setCustomPrompt(slide.imagePrompt); }}
            disabled={isGenerating}
            title="Generate Image"
            className="p-2.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <ImagePlus className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Gen Image</span>
          </button>

          <button 
            onClick={() => { setShowEditTools(!showEditTools); setShowImageTools(false); }}
            disabled={isGenerating || !slide.imageData}
            title="Edit Image"
            className="p-2.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-30"
          >
            <Edit className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Edit</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Controls;
