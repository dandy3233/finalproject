import React from 'react';

function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-24 h-24 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
      <span className="sr-only">Please Wait...</span>
    </div>
  );
}

export default Loader;
