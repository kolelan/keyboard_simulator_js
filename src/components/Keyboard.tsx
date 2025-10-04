import { useEffect, useState } from 'react';

interface KeyboardProps {
  pressedKey: string;
  isCyrillic?: boolean;
}

// Finger color mapping - standard touch typing
const FINGER_COLORS = {
  leftPinky: '#EF4444',
  leftRing: '#F59E0B',
  leftMiddle: '#EAB308',
  leftIndex: '#22C55E',
  thumb: '#3B82F6',
  rightIndex: '#22C55E',
  rightMiddle: '#EAB308',
  rightRing: '#F59E0B',
  rightPinky: '#EF4444',
};

// Key to finger mapping
const keyFingerMap: Record<string, string> = {
  // Left pinky
  '`': FINGER_COLORS.leftPinky, '1': FINGER_COLORS.leftPinky, 'q': FINGER_COLORS.leftPinky,
  'a': FINGER_COLORS.leftPinky, 'z': FINGER_COLORS.leftPinky,
  '~': FINGER_COLORS.leftPinky, '!': FINGER_COLORS.leftPinky,
  'ё': FINGER_COLORS.leftPinky, 'й': FINGER_COLORS.leftPinky, 'ф': FINGER_COLORS.leftPinky,
  'я': FINGER_COLORS.leftPinky,
  
  // Left ring
  '2': FINGER_COLORS.leftRing, 'w': FINGER_COLORS.leftRing, 's': FINGER_COLORS.leftRing,
  'x': FINGER_COLORS.leftRing, '@': FINGER_COLORS.leftRing,
  'ц': FINGER_COLORS.leftRing, 'ы': FINGER_COLORS.leftRing, 'ч': FINGER_COLORS.leftRing,
  
  // Left middle
  '3': FINGER_COLORS.leftMiddle, 'e': FINGER_COLORS.leftMiddle, 'd': FINGER_COLORS.leftMiddle,
  'c': FINGER_COLORS.leftMiddle, '#': FINGER_COLORS.leftMiddle,
  'у': FINGER_COLORS.leftMiddle, 'в': FINGER_COLORS.leftMiddle, 'с': FINGER_COLORS.leftMiddle,
  
  // Left index
  '4': FINGER_COLORS.leftIndex, '5': FINGER_COLORS.leftIndex,
  'r': FINGER_COLORS.leftIndex, 't': FINGER_COLORS.leftIndex,
  'f': FINGER_COLORS.leftIndex, 'g': FINGER_COLORS.leftIndex,
  'v': FINGER_COLORS.leftIndex, 'b': FINGER_COLORS.leftIndex,
  '$': FINGER_COLORS.leftIndex, '%': FINGER_COLORS.leftIndex,
  'к': FINGER_COLORS.leftIndex, 'е': FINGER_COLORS.leftIndex,
  'а': FINGER_COLORS.leftIndex, 'п': FINGER_COLORS.leftIndex,
  'м': FINGER_COLORS.leftIndex, 'и': FINGER_COLORS.leftIndex,
  
  // Thumbs
  ' ': FINGER_COLORS.thumb,
  
  // Right index
  '6': FINGER_COLORS.rightIndex, '7': FINGER_COLORS.rightIndex,
  'y': FINGER_COLORS.rightIndex, 'u': FINGER_COLORS.rightIndex,
  'h': FINGER_COLORS.rightIndex, 'j': FINGER_COLORS.rightIndex,
  'n': FINGER_COLORS.rightIndex, 'm': FINGER_COLORS.rightIndex,
  '^': FINGER_COLORS.rightIndex, '&': FINGER_COLORS.rightIndex,
  'н': FINGER_COLORS.rightIndex, 'г': FINGER_COLORS.rightIndex,
  'р': FINGER_COLORS.rightIndex, 'о': FINGER_COLORS.rightIndex,
  'т': FINGER_COLORS.rightIndex, 'ь': FINGER_COLORS.rightIndex,
  
  // Right middle
  '8': FINGER_COLORS.rightMiddle, 'i': FINGER_COLORS.rightMiddle, 'k': FINGER_COLORS.rightMiddle,
  ',': FINGER_COLORS.rightMiddle, '*': FINGER_COLORS.rightMiddle,
  'ш': FINGER_COLORS.rightMiddle, 'л': FINGER_COLORS.rightMiddle, 'б': FINGER_COLORS.rightMiddle,
  
  // Right ring
  '9': FINGER_COLORS.rightRing, 'o': FINGER_COLORS.rightRing, 'l': FINGER_COLORS.rightRing,
  '.': FINGER_COLORS.rightRing, '(': FINGER_COLORS.rightRing,
  'щ': FINGER_COLORS.rightRing, 'д': FINGER_COLORS.rightRing, 'ю': FINGER_COLORS.rightRing,
  
  // Right pinky
  '0': FINGER_COLORS.rightPinky, '-': FINGER_COLORS.rightPinky, '=': FINGER_COLORS.rightPinky,
  'p': FINGER_COLORS.rightPinky, '[': FINGER_COLORS.rightPinky, ']': FINGER_COLORS.rightPinky,
  '\\': FINGER_COLORS.rightPinky, ';': FINGER_COLORS.rightPinky, "'": FINGER_COLORS.rightPinky,
  '/': FINGER_COLORS.rightPinky, ')': FINGER_COLORS.rightPinky, '_': FINGER_COLORS.rightPinky,
  '+': FINGER_COLORS.rightPinky, '{': FINGER_COLORS.rightPinky, '}': FINGER_COLORS.rightPinky,
  '|': FINGER_COLORS.rightPinky, ':': FINGER_COLORS.rightPinky, '"': FINGER_COLORS.rightPinky,
  '<': FINGER_COLORS.rightPinky, '>': FINGER_COLORS.rightPinky, '?': FINGER_COLORS.rightPinky,
  'з': FINGER_COLORS.rightPinky, 'х': FINGER_COLORS.rightPinky, 'ъ': FINGER_COLORS.rightPinky,
  'ж': FINGER_COLORS.rightPinky, 'э': FINGER_COLORS.rightPinky,
};

interface KeyProps {
  char: string;
  displayChar?: string;
  isPressed: boolean;
  width?: string;
}

const Key = ({ char, displayChar, isPressed, width = 'w-12' }: KeyProps) => {
  const color = keyFingerMap[char.toLowerCase()] || '#9CA3AF';
  
  return (
    <div
      className={`${width} h-12 rounded border-2 flex items-center justify-center transition-all duration-75 select-none`}
      style={{
        backgroundColor: isPressed ? color : '#FFFFFF',
        borderColor: color,
        color: isPressed ? '#FFFFFF' : color,
        transform: isPressed ? 'scale(0.95) translateY(2px)' : 'scale(1)',
        boxShadow: isPressed ? 'none' : `0 4px 0 ${color}40`,
      }}
    >
      <span className="font-mono">{displayChar || char}</span>
    </div>
  );
};

export const Keyboard = ({ pressedKey, isCyrillic = false }: KeyboardProps) => {
  const [currentKey, setCurrentKey] = useState('');

  useEffect(() => {
    setCurrentKey(pressedKey);
    const timer = setTimeout(() => setCurrentKey(''), 150);
    return () => clearTimeout(timer);
  }, [pressedKey]);

  const isPressed = (key: string) => currentKey.toLowerCase() === key.toLowerCase();

  if (isCyrillic) {
    return (
      <div className="flex flex-col gap-2 p-6 bg-muted/30 rounded-lg">
        {/* Row 1 - Numbers */}
        <div className="flex gap-2 justify-center">
          <Key char="ё" displayChar="Ё" isPressed={isPressed('ё')} />
          <Key char="1" displayChar="!" isPressed={isPressed('1') || isPressed('!')} />
          <Key char="2" displayChar="@" isPressed={isPressed('2') || isPressed('@')} />
          <Key char="3" displayChar="#" isPressed={isPressed('3') || isPressed('#')} />
          <Key char="4" displayChar="$" isPressed={isPressed('4') || isPressed('$')} />
          <Key char="5" displayChar="%" isPressed={isPressed('5') || isPressed('%')} />
          <Key char="6" displayChar="^" isPressed={isPressed('6') || isPressed('^')} />
          <Key char="7" displayChar="&" isPressed={isPressed('7') || isPressed('&')} />
          <Key char="8" displayChar="*" isPressed={isPressed('8') || isPressed('*')} />
          <Key char="9" displayChar="(" isPressed={isPressed('9') || isPressed('(')} />
          <Key char="0" displayChar=")" isPressed={isPressed('0') || isPressed(')')} />
          <Key char="-" displayChar="_" isPressed={isPressed('-') || isPressed('_')} />
          <Key char="=" displayChar="+" isPressed={isPressed('=') || isPressed('+')} />
        </div>

        {/* Row 2 - ЙЦУКЕН */}
        <div className="flex gap-2 justify-center">
          <div className="w-6" />
          <Key char="й" displayChar="Й" isPressed={isPressed('й')} />
          <Key char="ц" displayChar="Ц" isPressed={isPressed('ц')} />
          <Key char="у" displayChar="У" isPressed={isPressed('у')} />
          <Key char="к" displayChar="К" isPressed={isPressed('к')} />
          <Key char="е" displayChar="Е" isPressed={isPressed('е')} />
          <Key char="н" displayChar="Н" isPressed={isPressed('н')} />
          <Key char="г" displayChar="Г" isPressed={isPressed('г')} />
          <Key char="ш" displayChar="Ш" isPressed={isPressed('ш')} />
          <Key char="щ" displayChar="Щ" isPressed={isPressed('щ')} />
          <Key char="з" displayChar="З" isPressed={isPressed('з')} />
          <Key char="х" displayChar="Х" isPressed={isPressed('х')} />
          <Key char="ъ" displayChar="Ъ" isPressed={isPressed('ъ')} />
        </div>

        {/* Row 3 - ФЫВАПРОЛДЖЭ */}
        <div className="flex gap-2 justify-center">
          <div className="w-10" />
          <Key char="ф" displayChar="Ф" isPressed={isPressed('ф')} />
          <Key char="ы" displayChar="Ы" isPressed={isPressed('ы')} />
          <Key char="в" displayChar="В" isPressed={isPressed('в')} />
          <Key char="а" displayChar="А" isPressed={isPressed('а')} />
          <Key char="п" displayChar="П" isPressed={isPressed('п')} />
          <Key char="р" displayChar="Р" isPressed={isPressed('р')} />
          <Key char="о" displayChar="О" isPressed={isPressed('о')} />
          <Key char="л" displayChar="Л" isPressed={isPressed('л')} />
          <Key char="д" displayChar="Д" isPressed={isPressed('д')} />
          <Key char="ж" displayChar="Ж" isPressed={isPressed('ж')} />
          <Key char="э" displayChar="Э" isPressed={isPressed('э')} />
        </div>

        {/* Row 4 - ЯЧСМИТЬБЮ */}
        <div className="flex gap-2 justify-center">
          <div className="w-16" />
          <Key char="я" displayChar="Я" isPressed={isPressed('я')} />
          <Key char="ч" displayChar="Ч" isPressed={isPressed('ч')} />
          <Key char="с" displayChar="С" isPressed={isPressed('с')} />
          <Key char="м" displayChar="М" isPressed={isPressed('м')} />
          <Key char="и" displayChar="И" isPressed={isPressed('и')} />
          <Key char="т" displayChar="Т" isPressed={isPressed('т')} />
          <Key char="ь" displayChar="Ь" isPressed={isPressed('ь')} />
          <Key char="б" displayChar="Б" isPressed={isPressed('б')} />
          <Key char="ю" displayChar="Ю" isPressed={isPressed('ю')} />
          <Key char="." displayChar="," isPressed={isPressed('.') || isPressed(',')} />
        </div>

        {/* Row 5 - Space */}
        <div className="flex gap-2 justify-center">
          <div className="w-32" />
          <Key char=" " displayChar="ПРОБЕЛ" isPressed={isPressed(' ')} width="w-80" />
        </div>
      </div>
    );
  }

  // Latin layout
  return (
    <div className="flex flex-col gap-2 p-6 bg-muted/30 rounded-lg">
      {/* Row 1 - Numbers */}
      <div className="flex gap-2 justify-center">
        <Key char="`" displayChar="~" isPressed={isPressed('`') || isPressed('~')} />
        <Key char="1" displayChar="!" isPressed={isPressed('1') || isPressed('!')} />
        <Key char="2" displayChar="@" isPressed={isPressed('2') || isPressed('@')} />
        <Key char="3" displayChar="#" isPressed={isPressed('3') || isPressed('#')} />
        <Key char="4" displayChar="$" isPressed={isPressed('4') || isPressed('$')} />
        <Key char="5" displayChar="%" isPressed={isPressed('5') || isPressed('%')} />
        <Key char="6" displayChar="^" isPressed={isPressed('6') || isPressed('^')} />
        <Key char="7" displayChar="&" isPressed={isPressed('7') || isPressed('&')} />
        <Key char="8" displayChar="*" isPressed={isPressed('8') || isPressed('*')} />
        <Key char="9" displayChar="(" isPressed={isPressed('9') || isPressed('(')} />
        <Key char="0" displayChar=")" isPressed={isPressed('0') || isPressed(')')} />
        <Key char="-" displayChar="_" isPressed={isPressed('-') || isPressed('_')} />
        <Key char="=" displayChar="+" isPressed={isPressed('=') || isPressed('+')} />
      </div>

      {/* Row 2 - QWERTY */}
      <div className="flex gap-2 justify-center">
        <div className="w-6" />
        <Key char="q" displayChar="Q" isPressed={isPressed('q')} />
        <Key char="w" displayChar="W" isPressed={isPressed('w')} />
        <Key char="e" displayChar="E" isPressed={isPressed('e')} />
        <Key char="r" displayChar="R" isPressed={isPressed('r')} />
        <Key char="t" displayChar="T" isPressed={isPressed('t')} />
        <Key char="y" displayChar="Y" isPressed={isPressed('y')} />
        <Key char="u" displayChar="U" isPressed={isPressed('u')} />
        <Key char="i" displayChar="I" isPressed={isPressed('i')} />
        <Key char="o" displayChar="O" isPressed={isPressed('o')} />
        <Key char="p" displayChar="P" isPressed={isPressed('p')} />
        <Key char="[" displayChar="{" isPressed={isPressed('[') || isPressed('{')} />
        <Key char="]" displayChar="}" isPressed={isPressed(']') || isPressed('}')} />
      </div>

      {/* Row 3 - ASDF */}
      <div className="flex gap-2 justify-center">
        <div className="w-10" />
        <Key char="a" displayChar="A" isPressed={isPressed('a')} />
        <Key char="s" displayChar="S" isPressed={isPressed('s')} />
        <Key char="d" displayChar="D" isPressed={isPressed('d')} />
        <Key char="f" displayChar="F" isPressed={isPressed('f')} />
        <Key char="g" displayChar="G" isPressed={isPressed('g')} />
        <Key char="h" displayChar="H" isPressed={isPressed('h')} />
        <Key char="j" displayChar="J" isPressed={isPressed('j')} />
        <Key char="k" displayChar="K" isPressed={isPressed('k')} />
        <Key char="l" displayChar="L" isPressed={isPressed('l')} />
        <Key char=";" displayChar=":" isPressed={isPressed(';') || isPressed(':')} />
        <Key char="'" displayChar='"' isPressed={isPressed("'") || isPressed('"')} />
      </div>

      {/* Row 4 - ZXCV */}
      <div className="flex gap-2 justify-center">
        <div className="w-16" />
        <Key char="z" displayChar="Z" isPressed={isPressed('z')} />
        <Key char="x" displayChar="X" isPressed={isPressed('x')} />
        <Key char="c" displayChar="C" isPressed={isPressed('c')} />
        <Key char="v" displayChar="V" isPressed={isPressed('v')} />
        <Key char="b" displayChar="B" isPressed={isPressed('b')} />
        <Key char="n" displayChar="N" isPressed={isPressed('n')} />
        <Key char="m" displayChar="M" isPressed={isPressed('m')} />
        <Key char="," displayChar="<" isPressed={isPressed(',') || isPressed('<')} />
        <Key char="." displayChar=">" isPressed={isPressed('.') || isPressed('>')} />
        <Key char="/" displayChar="?" isPressed={isPressed('/') || isPressed('?')} />
      </div>

      {/* Row 5 - Space */}
      <div className="flex gap-2 justify-center">
        <div className="w-32" />
        <Key char=" " displayChar="SPACE" isPressed={isPressed(' ')} width="w-80" />
      </div>
    </div>
  );
};
