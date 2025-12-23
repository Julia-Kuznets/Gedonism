import React from 'react';
import { Slide } from '../types';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';

interface SlideViewProps {
  slide: Slide;
}

const SlideView: React.FC<SlideViewProps> = ({ slide }) => {
  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-white rounded-xl overflow-hidden shadow-2xl">
      {/* Text Section */}
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-slate-50 relative overflow-y-auto">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-yellow-300" />
        
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
          {slide.title}
        </h1>
        
        <div className="prose prose-lg text-slate-600 mb-8 whitespace-pre-wrap">
          {slide.content}
        </div>

        {slide.groundingUrls && slide.groundingUrls.length > 0 && (
          <div className="mt-auto pt-6 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-2">
              <ExternalLink className="w-4 h-4" /> Sources
            </h4>
            <div className="flex flex-wrap gap-2">
              {slide.groundingUrls.map((url, idx) => (
                <a 
                  key={idx} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-500 hover:text-orange-500 hover:border-orange-300 transition-colors truncate max-w-[200px]"
                >
                  {new URL(url).hostname}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Section */}
      <div className="flex-1 bg-slate-100 relative min-h-[300px] md:min-h-full flex items-center justify-center p-4">
        {slide.imageData ? (
          <img 
            src={slide.imageData} 
            alt={slide.imagePrompt}
            className="w-full h-full object-contain drop-shadow-lg rounded-lg"
          />
        ) : (
          <div className="text-center text-slate-400 flex flex-col items-center">
            <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-sm max-w-xs mx-auto mb-2">"{slide.imagePrompt}"</p>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-50">Image Not Generated Yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideView;
