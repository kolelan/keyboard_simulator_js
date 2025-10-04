import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Trash2, Search } from 'lucide-react';

interface SavedText {
  id: string;
  text: string;
  preview: string;
  timestamp: number;
}

interface SavedTextsSidebarProps {
  onSelectText: (text: string) => void;
  savedTexts: SavedText[];
  onDeleteText: (id: string) => void;
}

export const SavedTextsSidebar = ({ onSelectText, savedTexts, onDeleteText }: SavedTextsSidebarProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTexts = useMemo(() => {
    if (!searchQuery.trim()) return savedTexts;
    
    const query = searchQuery.toLowerCase();
    return savedTexts.filter(item => 
      item.text.toLowerCase().includes(query)
    );
  }, [savedTexts, searchQuery]);

  return (
    <Card className="p-4 h-full flex flex-col">
      <h3 className="mb-4">Saved Texts</h3>
      
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search texts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="space-y-2">
          {filteredTexts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {searchQuery ? 'No matching texts found.' : 'No saved texts yet. Save a text to get started.'}
            </p>
          ) : (
            filteredTexts.map((item) => (
              <div
                key={item.id}
                className="relative group"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <button
                  onClick={() => onSelectText(item.text)}
                  className="w-full text-left p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <p className="text-muted-foreground line-clamp-1">
                    {item.preview}
                  </p>
                  <span className="text-muted-foreground mt-2 block">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </button>
                
                {hoveredId === item.id && (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 size-8"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onDeleteText(item.id);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
