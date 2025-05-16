import React from 'react';
import { Image } from 'antd';

interface ThinkingCardProps {
  description: string;
  images: string[];
  descriptionBackgroundColor?: string;
}

const ThinkingCard: React.FC<ThinkingCardProps> = ({ 
  description, 
  images,
  descriptionBackgroundColor = '#F2FFB1' // Default color used in both components
}) => {
  return (
    <div className="flex flex-col max-w-[838px]">
      <div className="flex overflow-hidden flex-col justify-center self-end p-6 max-w-full bg-white rounded-[40px] w-[468px] max-md:px-5">
        <div className="flex flex-col w-full max-md:max-w-full">
          <div className="flex flex-col w-full text-base text-black max-md:max-w-full">
            <div className="font-semibold leading-tight">Description</div>
            <div 
              className="flex-1 shrink gap-2.5 p-4 mt-3 w-full font-medium leading-5 rounded-3xl max-md:max-w-full"
              style={{ backgroundColor: descriptionBackgroundColor }}
            >
              {description}
            </div>
          </div>
          {images.length > 0 && (
            <div className="flex flex-col mt-4 w-full">
              <div className="text-base font-semibold leading-tight text-black">
                Attachments
              </div>
              <div className="flex gap-2 items-start self-start mt-2">
                {images.map((image, index) => (
                  <div key={index} className="w-24 h-24 overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={`Attachment ${index + 1}`}
                      className="object-cover w-full h-full"
                      preview={{
                        mask: null,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThinkingCard; 