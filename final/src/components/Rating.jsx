import React from 'react';

function Rating({ value, color, text }) {
  return (
    <div className="flex items-center space-x-1 text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          <i
            style={{ color }}
            className={
              value >= star
                ? 'fas fa-star'
                : value >= star - 0.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          ></i>
        </span>
      ))}
      {text && <span className="ml-2 text-gray-600 text-sm">{text}</span>}
    </div>
  );
}

export default Rating;
