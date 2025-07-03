import { Suspense, lazy, useState, useRef, useEffect } from 'react';
import { MdOutlineEmojiEmotions } from 'react-icons/md';

const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

const EmojiInput = ({ placeholder = "Type here...", inputClasses, inputText, setInputText }) => {
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const input = inputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newText =
      inputText.substring(0, start) + emoji + inputText.substring(end);

    setInputText(newText);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="relative" ref={wrapperRef}>
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setShowPicker(false);
          }}
          placeholder={placeholder}
          className={`w-full border p-2 pr-10 outline-none ${inputClasses}`}
        />

        <button
          onClick={() => setShowPicker((prev) => !prev)}
          className="absolute right-2 top-2 text-lg"
          type='button'
        >
          <MdOutlineEmojiEmotions className={`text-2xl cursor-pointer ${showPicker ? "text-gray-500" : "text-gray-400"} hover:text-gray-500 transition`} />
        </button>

        {showPicker && (
          <div className="absolute top-full mt-2 z-10 right-0">
            <Suspense fallback={<div className="p-2 text-sm text-gray-500">Loading emojis...</div>}>
              <LazyEmojiPicker
                onEmojiClick={handleEmojiClick}
                disableAutoFocus
                searchDisabled={true}
                skinTonesDisabled={true}
                emojiStyle="native"
                height={300}
                width={300}
                lazyLoadEmojis={true}
                previewConfig={{ showPreview: false }}
                native={true}
                theme="light"
                disableSearchBar={true}
                disableSkinTonePicker={true}
                autoFocusSearch={false}
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiInput;