import React, { useEffect, useRef } from 'react';

const HighlightedText = ({ text, subtopic, showHighlights }) => {
  const textRef = useRef(null);

  const highlightKeywords = (text, subtopic) => {
    if (!subtopic || subtopic.length === 0) return text;

    const regex = new RegExp(`(${subtopic.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      subtopic.includes(part.toLowerCase()) ? 
        `<span key=${index} style="background-color: yellow; padding: 0 2px; border-radius: 2px;">${part}</span>` : 
        part
    ).join('');
  };

  useEffect(() => {
    if (textRef.current) {
      textRef.current.innerHTML = showHighlights ? highlightKeywords(text, subtopic) : text;
    }
  }, [text, subtopic, showHighlights]);

  return <div ref={textRef} style={{ whiteSpace: 'pre-line' }} />;
};

export default HighlightedText;