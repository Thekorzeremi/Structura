import React, { useState } from 'react';

export default function Select({ items }) {
    const [activeIndex, setActiveIndex] = useState(0);
    
    return (
        <div className='w-full h-[36px] flex gap-2'>
            {items && items.map((item, index) => (
                <div 
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`flex-1 h-full ${
                        activeIndex === index 
                            ? 'bg-[#267de1] text-white' 
                            : 'bg-white text-black ring-[0.5px] ring-gray-300 hover:ring-2 hover:ring-gray-400'
                    } rounded-md flex text-sm items-center justify-center cursor-pointer transition-all duration-200`}
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
}