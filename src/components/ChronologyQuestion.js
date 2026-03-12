import React, { useState, useEffect } from "react";

const ChronologyQuestion = ({ questionData, onValidate, onAnswerChange }) => {
  const [items, setItems] = useState([...questionData.options]);

  // ⚠️ Reset les items quand la question change
  useEffect(() => {
    setItems([...questionData.options]);
  }, [questionData]);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData("draggedIndex");

    if (draggedIndex !== null) {
      let newItems = [...items];
      const [movedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(index, 0, movedItem);
      setItems(newItems);

      // ✅ Met à jour la réponse dans `responses`
      onAnswerChange(newItems);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-4">
      <ul className="drag-container">
        {items.map((item, index) => (
          <li
            key={index}
            className="draggable-option"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChronologyQuestion;
