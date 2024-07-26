import React from 'react';
import { MdErrorOutline } from 'react-icons/md'; // Importing the error icon

function NoMoreProducts({message}) {
  return (
    <div className='w-full flex justify-center flex-col items-center py-4 text-[#212121]'>
      <MdErrorOutline className='text-[30px] text-[#e32727]' />
      <p className='text-center font-semibold text-[#212121] mt-2'>{message.toUpperCase()}</p>
    </div>
  );
}

export default NoMoreProducts;
