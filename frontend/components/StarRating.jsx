import React, { useState } from 'react';

export function StarDisplay({ rating, size = 16 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i;
        const half = !filled && rating >= i - 0.5;
        return (
          <span
            key={i}
            className={`star ${filled ? 'filled' : half ? 'half' : ''}`}
            style={{ fontSize: size }}
          >
            {filled ? '★' : half ? '★' : '☆'}
          </span>
        );
      })}
    </span>
  );
}

export function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-input">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= (hovered || value) ? 'active' : ''}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}