import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CustomCard({ title, description, buttonText, route, image, icon, badge, gradient = false }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (route) {
      navigate(route);
    }
  };


  return (
    <div
      className={`group relative overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 ${
        gradient ? 'card-gradient' : 'card-modern'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            badge === 'New' ? 'bg-farm-green-500 text-white' :
            badge === 'Popular' ? 'bg-yellow-500 text-white' :
            badge === 'Recommended' ? 'bg-blue-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {badge}
          </span>
        </div>
      )}

      {/* Image/Icon Section */}
      <div className="relative mb-4 flex justify-center">
        <div className={`relative transition-all duration-300 ${
          isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'
        }`}>
          {image && (
            <img
              src={image}
              alt={title}
              className="w-16 h-16 object-contain filter drop-shadow-lg"
            />
          )}
          {icon && (
            <div className="w-16 h-16 flex items-center justify-center text-4xl">
              {icon}
            </div>
          )}
          {/* Hover Glow Effect */}
          <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
            isHovered ? 'opacity-20' : 'opacity-0'
          } bg-farm-green-400 blur-xl`}></div>
        </div>
      </div>

      {/* Content */}
      <div className="text-center space-y-3">
        <h3 className="text-xl font-display font-semibold text-gray-800 group-hover:text-farm-green-700 transition-colors duration-300">
          {title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>

        {/* Button */}
        <div className="pt-2">
          <button
            onClick={handleClick}
            className="btn-primary text-sm px-6 py-2 w-full group-hover:shadow-lg group-hover:shadow-farm-green-500/25 transition-all duration-300"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>{buttonText}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  isHovered ? 'translate-x-1' : 'translate-x-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-farm-green-500/5 to-farm-green-600/5 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>

      {/* Animated Border */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-farm-green-400 via-farm-green-500 to-farm-green-600 p-0.5">
          <div className="w-full h-full bg-white rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}

export default CustomCard;
