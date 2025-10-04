import { useState, useEffect, useRef } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
// import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Label } from './components/ui/label';
import { Progress } from './components/ui/progress';
import { Switch } from './components/ui/switch';
import { Play, Square, Save } from 'lucide-react';
import { Keyboard } from './components/Keyboard';
import { SavedTextsSidebar } from './components/SavedTextsSidebar';
import { toast, Toaster } from 'sonner';  

interface SavedText {
  id: string;
  text: string;
  preview: string;
  timestamp: number;
}

export default function App() {
  const [sourceText, setSourceText] = useState('The quick brown fox jumps over the lazy dog. Practice makes perfect. Keep typing to improve your skills.');
  const [typedText, setTypedText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [maxErrors, setMaxErrors] = useState(5);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [errors, setErrors] = useState(0);
  const [lastPressedKey, setLastPressedKey] = useState('');
  const [isCyrillic, setIsCyrillic] = useState(false);
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);
  const [textAreaHeight, setTextAreaHeight] = useState(256); // Default 16rem (256px)
  const [savedTexts, setSavedTexts] = useState<SavedText[]>([]);
  const typingAreaRef = useRef<HTMLTextAreaElement>(null);
  const sourceTextRef = useRef<HTMLDivElement>(null);
  const typeHereDisplayRef = useRef<HTMLDivElement>(null);

  // Calculate statistics
  const calculateStats = () => {
    const totalChars = typedText.length;
    const correctChars = typedText.split('').filter((char, index) => char === sourceText[index]).length;
    const incorrectChars = totalChars - correctChars;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    const minutes = elapsedTime / 60;
    const words = correctChars / 5; // Standard: 5 chars = 1 word
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
    const progress = sourceText.length > 0 ? Math.round((totalChars / sourceText.length) * 100) : 0;

    return { wpm, accuracy, incorrectChars, progress, totalChars };
  };

  const stats = calculateStats();

  // Load saved texts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('typingSimulatorTexts');
    if (saved) {
      try {
        setSavedTexts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved texts:', e);
      }
    }
  }, []);

  // Save texts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('typingSimulatorTexts', JSON.stringify(savedTexts));
  }, [savedTexts]);

  // Timer effect
  useEffect(() => {
    let interval: number;
    if (isActive && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime]);

  // Check for errors when typing
  useEffect(() => {
    if (!isActive) return;

    const currentErrors = typedText.split('').filter((char, index) => char !== sourceText[index]).length;
    setErrors(currentErrors);

    // Auto-stop if max errors reached
    if (currentErrors >= maxErrors) {
      handleStop();
    }

    // Auto-stop if text completed
    if (typedText.length >= sourceText.length && typedText === sourceText) {
      handleStop();
    }
  }, [typedText, isActive, maxErrors, sourceText]);

  const handleStart = () => {
    setIsActive(true);
    setStartTime(Date.now());
    setTypedText('');
    setErrors(0);
    setElapsedTime(0);
    // Focus typing area
    setTimeout(() => typingAreaRef.current?.focus(), 0);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const handleTypedTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isActive) return;
    const newValue = e.target.value;
    const lastChar = newValue[newValue.length - 1] || '';
    setLastPressedKey(lastChar);
    setTypedText(newValue);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCharacterStyle = (index: number) => {
    if (index >= typedText.length) return 'text-muted-foreground';
    if (typedText[index] === sourceText[index]) return 'text-green-600 bg-green-50';
    return 'text-red-600 bg-red-50';
  };

  const handleSaveText = () => {
    if (!sourceText.trim()) {
      toast.error('Cannot save empty text');
      return;
    }

    const newSavedText: SavedText = {
      id: Date.now().toString(),
      text: sourceText,
      preview: sourceText.slice(0, 100) + (sourceText.length > 100 ? '...' : ''),
      timestamp: Date.now(),
    };

    setSavedTexts([newSavedText, ...savedTexts]);
    toast.success('Text saved successfully');
  };

  const handleSelectSavedText = (text: string) => {
    if (isActive) {
      toast.error('Stop the current session before loading a saved text');
      return;
    }
    setSourceText(text);
    toast.success('Text loaded');
  };

  const handleDeleteSavedText = (id: string) => {
    setSavedTexts(savedTexts.filter(item => item.id !== id));
    toast.success('Text deleted');
  };

  // Synchronous scrolling handler
  const handleSourceScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (typeHereDisplayRef.current) {
      typeHereDisplayRef.current.scrollTop = e.currentTarget.scrollTop;
      typeHereDisplayRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const handleTypeHereScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (sourceTextRef.current) {
      sourceTextRef.current.scrollTop = e.currentTarget.scrollTop;
      sourceTextRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <>
      <Toaster />
      <div className="size-full bg-muted/30 flex gap-6 p-8 overflow-hidden">
        {/* Main Content Area - 80% */}
        <div className="flex-1 overflow-auto">
        <div className="space-y-6">
        {/* Header with Controls */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1>Keyboard Typing Simulator</h1>
            <p className="text-muted-foreground">Practice your typing skills</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="cyrillic-switch">Cyrillic:</Label>
              <Switch 
                id="cyrillic-switch"
                checked={isCyrillic}
                onCheckedChange={setIsCyrillic}
                disabled={isActive}
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="layout-switch">Vertical:</Label>
              <Switch 
                id="layout-switch"
                checked={isVerticalLayout}
                onCheckedChange={setIsVerticalLayout}
                disabled={isActive}
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="area-height">Height:</Label>
              <Select 
                value={textAreaHeight.toString()} 
                onValueChange={(val: string) => setTextAreaHeight(parseInt(val))}
                disabled={isActive}
              >
                <SelectTrigger id="area-height" className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100px</SelectItem>
                  <SelectItem value="150">150px</SelectItem>
                  <SelectItem value="200">200px</SelectItem>
                  <SelectItem value="256">256px</SelectItem>
                  <SelectItem value="300">300px</SelectItem>
                  <SelectItem value="350">350px</SelectItem>
                  <SelectItem value="400">400px</SelectItem>
                  <SelectItem value="450">450px</SelectItem>
                  <SelectItem value="500">500px</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="max-errors">Max Errors:</Label>
              <Select 
                value={maxErrors.toString()} 
                onValueChange={(val: string) => setMaxErrors(parseInt(val))}
                disabled={isActive}
              >
                <SelectTrigger id="max-errors" className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="999">∞</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={isActive ? handleStop : handleStart}
              size="lg"
              className="min-w-32"
            >
              {isActive ? (
                <>
                  <Square className="mr-2 size-4" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="mr-2 size-4" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Statistics Panel - Compact */}
        <Card className="p-4">
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span>{Math.min(stats.progress, 100)}%</span>
              </div>
              <Progress value={Math.min(stats.progress, 100)} />
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-muted-foreground">Time</div>
                <div>{formatTime(elapsedTime)}</div>
              </div>

              <div className="text-center">
                <div className="text-muted-foreground">WPM</div>
                <div>{stats.wpm}</div>
              </div>

              <div className="text-center">
                <div className="text-muted-foreground">Accuracy</div>
                <div>{stats.accuracy}%</div>
              </div>

              <div className="text-center">
                <div className="text-muted-foreground">Errors</div>
                <div className={errors >= maxErrors ? 'text-destructive' : ''}>
                  {errors} / {maxErrors === 999 ? '∞' : maxErrors}
                </div>
              </div>

              <div className="text-center">
                <div className="text-muted-foreground">Chars</div>
                <div>{stats.totalChars}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Area */}
        <div className={isVerticalLayout ? "flex flex-col gap-6" : "grid grid-cols-2 gap-6"}>
          {/* Left: Source Text */}
          <Card className="p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3>Source Text</h3>
              <Button
                size="icon"
                variant="outline"
                onClick={handleSaveText}
                disabled={isActive}
                title="Save text for future use"
              >
                <Save className="size-4" />
              </Button>
            </div>
            <div 
              ref={sourceTextRef}
              onScroll={handleSourceScroll}
              className="overflow-auto rounded-md border bg-background p-3"
              style={{ height: `${textAreaHeight}px` }}
            >
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                disabled={isActive}
                className="w-full h-full font-mono resize-none bg-transparent border-none outline-none"
                placeholder="Enter the text to practice typing..."
              />
            </div>
          </Card>

          {/* Right: Typing Area */}
          <Card className="p-6 flex flex-col">
            <h3 className="mb-4">Type Here</h3>
            <div className="relative" style={{ height: `${textAreaHeight}px` }}>
              {/* Display area showing correctness */}
              {isActive && (
                <div 
                  ref={typeHereDisplayRef}
                  onScroll={handleTypeHereScroll}
                  className="absolute inset-0 font-mono whitespace-pre-wrap break-words p-3 pointer-events-none bg-background rounded-md border overflow-auto"
                >
                  {sourceText.split('').map((char, index) => (
                    <span
                      key={index}
                      className={getCharacterStyle(index)}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Actual typing textarea */}
              <div className={`h-full overflow-auto rounded-md border bg-background p-3 ${isActive ? 'opacity-0' : ''}`}>
                <textarea
                  ref={typingAreaRef}
                  value={typedText}
                  onChange={handleTypedTextChange}
                  disabled={!isActive}
                  className="w-full h-full font-mono resize-none bg-transparent border-none outline-none"
                  placeholder={isActive ? '' : 'Click Start to begin typing...'}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Keyboard Visualization */}
        <Keyboard pressedKey={lastPressedKey} isCyrillic={isCyrillic} />
        </div>
      </div>

      {/* Saved Texts Sidebar - 20% */}
      <div className="w-80 flex-shrink-0 overflow-hidden">
        <SavedTextsSidebar
          savedTexts={savedTexts}
          onSelectText={handleSelectSavedText}
          onDeleteText={handleDeleteSavedText}
        />
      </div>
      </div>
    </>
  );
}
