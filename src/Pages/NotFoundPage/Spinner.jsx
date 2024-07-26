import React from 'react';

function Spinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-10 h-10 border-4 border-t-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
    </div>
  );
}

export default Spinner;
