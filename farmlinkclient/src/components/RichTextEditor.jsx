import React, { useCallback, useEffect, useRef, useState } from 'react';

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const handleKeyCommand = useCallback((command) => {
    const commands = {
      bold: () => {
        document.execCommand('bold', false, null);
        setIsBold(!isBold);
      },
      italic: () => {
        document.execCommand('italic', false, null);
        setIsItalic(!isItalic);
      },
      underline: () => {
        document.execCommand('underline', false, null);
        setIsUnderline(!isUnderline);
      }
    };
    if (commands[command]) {
      commands[command]();
    }
  }, [isBold, isItalic, isUnderline]);

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 border-b border-gray-300">
        <button type="button" onClick={() => handleKeyCommand('bold')} className={`p-1 rounded ${isBold ? 'bg-gray-300' : 'hover:bg-gray-200'}`} title="Bold"><strong>B</strong></button>
        <button type="button" onClick={() => handleKeyCommand('italic')} className={`p-1 rounded ${isItalic ? 'bg-gray-300' : 'hover:bg-gray-200'}`} title="Italic"><em>I</em></button>
        <button type="button" onClick={() => handleKeyCommand('underline')} className={`p-1 rounded ${isUnderline ? 'bg-gray-300' : 'hover:bg-gray-200'}`} title="Underline"><span className="underline">U</span></button>
        <div className="h-4 w-px bg-gray-300 mx-1"></div>
        <button type="button" onClick={() => document.execCommand('insertUnorderedList')} className="p-1 rounded hover:bg-gray-200" title="Bullet List">• List</button>
        <button type="button" onClick={() => document.execCommand('insertOrderedList')} className="p-1 rounded hover:bg-gray-200" title="Numbered List">1. List</button>
        <div className="h-4 w-px bg-gray-300 mx-1"></div>
        <button type="button" onClick={() => document.execCommand('justifyLeft')} className="p-1 rounded hover:bg-gray-200" title="Align Left">←</button>
        <button type="button" onClick={() => document.execCommand('justifyCenter')} className="p-1 rounded hover:bg-gray-200" title="Align Center">↔</button>
        <button type="button" onClick={() => document.execCommand('justifyRight')} className="p-1 rounded hover:bg-gray-200" title="Align Right">→</button>
      </div>

      {/* ContentEditable area */}
      <div
        ref={editorRef}
        contentEditable
        className="w-full p-4 min-h-64 focus:outline-none"
        onInput={handleContentChange}
        onBlur={handleContentChange}
      />
    </div>
  );
};

export default RichTextEditor;
