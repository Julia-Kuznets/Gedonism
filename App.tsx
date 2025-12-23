
import React, { useState } from 'react';
import SlideView from './components/SlideView';
import Controls from './components/Controls';
import { Slide, ImageGenerationConfig } from './types';
import { generateSlideContent, generateImage, editImage } from './services/geminiService';

const INITIAL_SLIDES: Slide[] = [
  {
    id: 1,
    title: "Hedonism & The Art of the Nap",
    content: "Hedonism is often misunderstood as reckless indulgence. In reality, it is the philosophical pursuit of pleasure as the highest good. And who understands this better than a cat? While humans complicate happiness, cats have perfected it: Find a sunbeam, stretch out, and let the world fade away.",
    imagePrompt: "A fluffy ginger cat sleeping blissfully in a warm sunbeam on a wooden floor, hyper-realistic, 4k, cozy atmosphere."
  },
  {
    id: 2,
    title: "Aristippus of Cyrene",
    content: "The story begins with Aristippus of Cyrene (c. 435–356 BCE), a student of Socrates. While Socrates sought truth, Aristippus sought enjoyment. He founded the Cyrenaic school of philosophy, teaching that the goal of life is to experience pleasure in the present moment. He was, effectively, the first human to adopt the 'If I fits, I sits' mentality of prioritizing immediate comfort.",
    imagePrompt: "An ancient greek philosopher looking happy and relaxed, holding a cat, oil painting style, warm colors."
  },
  {
    id: 3,
    title: "The Nature of Pleasure",
    content: "For Aristippus, pleasure was 'kinetic'—an active sensation of enjoyment, like eating delicious food or feeling the warmth of a fire. He believed we should not defer happiness for the future. Like a cat chasing a laser pointer, the joy is in the *now*. Past pleasures are gone; future pleasures are uncertain. Only the present sensation matters.",
    imagePrompt: "Close up of a happy cat face eating a delicious treat, eyes closed in delight, soft lighting."
  },
  {
    id: 4,
    title: "Epicurus vs. Aristippus",
    content: "Later, Epicurus (341–270 BCE) refined Hedonism. Unlike Aristippus, who sought intense sensory pleasure, Epicurus sought 'ataraxia'—tranquility and freedom from fear. Think of Aristippus as a kitten playing wildly (Kinetic Pleasure), and Epicurus as an old cat loafing contentedly on a sofa (Katastematic/Static Pleasure). Both are valid forms of the good life.",
    imagePrompt: "Two cats, one jumping playfully in the air, the other sleeping soundly on a velvet cushion, renaissance art style."
  },
  {
    id: 5,
    title: "Avoiding Pain (Aponia)",
    content: "A key part of Hedonism is the avoidance of pain. Aristippus believed that physical pain is the only true evil. Cats are masters of this: they instantly retreat from loud noises (vacuum cleaners) and uncomfortable situations. They do not tolerate 'bad vibes'. They teach us that setting boundaries for our own comfort is a philosophical virtue.",
    imagePrompt: "A cat hiding safely in a cardboard box, peeking out with big eyes, cozy and safe, cute illustration."
  },
  {
    id: 6,
    title: "Sensory Delight",
    content: "Hedonism is grounded in the senses. We know something is good because it *feels* good. The softness of a blanket, the taste of fresh fish, the sound of birds chirping. To be a hedonist is to be fully embodied. Observe a cat receiving a chin scratch: they are completely lost in the sensory experience, unburdened by guilt or worry.",
    imagePrompt: "A hand scratching a cat's chin, the cat's head tilted back in pure ecstasy, macro photography, detailed fur."
  },
  {
    id: 7,
    title: "The Wisdom of Relaxation",
    content: "In our modern hustle culture, we often feel guilty for resting. Cyrenaic Hedonism challenges this. If the goal of life is pleasure, then rest is productive. A sleeping cat is not 'lazy'; they are successfully achieving the highest philosophical good. They are winning at life by simply being comfortable.",
    imagePrompt: "A pile of three cats sleeping on top of each other, tangled limbs, very fluffy, soft pastel colors."
  },
  {
    id: 8,
    title: "Adaptability",
    content: "Aristippus was known for his adaptability. He could enjoy luxury, but he could also be content with little if necessary. He famously said, 'I possess, I am not possessed.' This is the way of the cat: they rule the house like royalty, yet can find infinite joy in a simple cardboard box or a piece of string.",
    imagePrompt: "A regal cat sitting in a simple cardboard box but wearing a small golden crown, majestic lighting."
  },
  {
    id: 9,
    title: "Social Pleasure vs. Solitude",
    content: "While Epicurus valued friendship highly, Aristippus was more individualistic, though he was a charmer in court. Cats balance this perfectly. They seek affection on their own terms, rubbing against your legs when they want love, and walking away when they need 'me time'. They prioritize their own emotional state above social expectations.",
    imagePrompt: "A cat walking away with tail held high, confident silhouette, sunset background."
  },
  {
    id: 10,
    title: "Conclusion: Be More Cat",
    content: "We can learn much from the founders of Hedonism. Life is fleeting. The future is not promised. The only thing we truly have is this moment. So, take a page from the philosophy of Aristippus and the playbook of the cat: Seek the sunbeam. Eat the treat. Nap without guilt. Purr loudly.",
    imagePrompt: "A very happy smiling cat looking directly at the camera, giving a thumbs up (paw up), bright cheerful background."
  }
];

const App: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(INITIAL_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentSlide = slides[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleGenerateText = async () => {
    setIsGenerating(true);
    try {
      const result = await generateSlideContent(currentSlide.title, currentSlide.content);
      const updatedSlides = [...slides];
      updatedSlides[currentSlideIndex] = {
        ...currentSlide,
        content: result.text,
        groundingUrls: result.urls
      };
      setSlides(updatedSlides);
    } catch (error) {
      alert("Failed to generate text. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async (config: ImageGenerationConfig, prompt: string) => {
    setIsGenerating(true);
    try {
      const imageData = await generateImage(prompt, config);
      const updatedSlides = [...slides];
      updatedSlides[currentSlideIndex] = {
        ...currentSlide,
        imageData: imageData,
        imagePrompt: prompt
      };
      setSlides(updatedSlides);
    } catch (error) {
      alert("Failed to generate image. Please ensure your API key allows this model.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditImage = async (prompt: string) => {
    if (!currentSlide.imageData) return;
    setIsGenerating(true);
    try {
      const editedImageData = await editImage(currentSlide.imageData, prompt);
      const updatedSlides = [...slides];
      updatedSlides[currentSlideIndex] = {
        ...currentSlide,
        imageData: editedImageData
      };
      setSlides(updatedSlides);
    } catch (error) {
      alert("Failed to edit image.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-7xl h-[85vh] relative">
        <SlideView slide={currentSlide} />
        <Controls 
          currentSlide={currentSlideIndex}
          totalSlides={slides.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onGenerateText={handleGenerateText}
          onGenerateImage={handleGenerateImage}
          onEditImage={handleEditImage}
          isGenerating={isGenerating}
          slide={currentSlide}
        />
      </div>
    </div>
  );
};

export default App;
