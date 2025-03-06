import React, { useState, useEffect } from 'react';

interface SelectItem {
  name: string;
  value: string;
}

interface SelectProps {
  items: SelectItem[];
  value?: string;
  onChange?: (value: string) => void;
}

export default function Select({ items, value, onChange }: SelectProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const index = items.findIndex(item => item.value === value);
        if (index !== -1) {
            setActiveIndex(index);
        }
    }, [value, items]);
    
    const handleClick = (index: number) => {
        setActiveIndex(index);
        onChange?.(items[index].value);
    };

    return (
        <div className='w-full h-[36px] flex gap-2'>
            {items && items.map((item, index) => (
                <div 
                    key={index}
                    onClick={() => handleClick(index)}
                    className={`flex-1 h-full ${
                        activeIndex === index 
                            ? 'bg-[#007AFF] text-white' 
                            : 'text-gray-700 border border-[#E5E5E5] hover:border-[#007AFF]'
                    } rounded-md flex text-sm items-center justify-center cursor-pointer transition-colors duration-200`}
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
}