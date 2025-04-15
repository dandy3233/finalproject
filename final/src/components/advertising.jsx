import React, { useState, useEffect } from 'react';
import axios from 'axios';


// Base URL for the Django server
const API_BASE_URL = 'http://127.0.0.1:8000';

// Header component
const Header = () => {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">Today's Deals</h1>
    </div>
  );
};

// SectionTitle component
const SectionTitle = ({ title, additionalContent }) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-3 rounded-t-lg flex flex-col items-center">
      <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
      {additionalContent && (
        <div className="mt-2 bg-green-700 bg-opacity-30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-md">
          {additionalContent}
        </div>
      )}
    </div>
  );
};

// Countdown component
const Countdown = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = endTime - new Date();
    if (difference > 0) {
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return '00:00:00';
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return <span className="font-mono text-xs sm:text-sm">{timeLeft}</span>;
};

// ProductCard component
const ProductCard = ({ product, section }) => {
  const {
    image,
    name,
    original_price,
    discounted_price,
    discount_percentage,
    save_amount,
    secondary_price,
  } = product;

  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${API_BASE_URL}${image}`
    : 'https://via.placeholder.com/150';

  return (
    <div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
      <img src={imageUrl} alt={name} className="w-full h-40 sm:h-48 object-contain rounded-lg mb-3" />
      <h3 className="text-gray-800 text-xs sm:text-sm font-medium mb-2 truncate">{name}</h3>
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="flex flex-col">
          <span className="line-through text-gray-500 text-[10px] sm:text-xs">{original_price}</span>
          <span className="text-green-600 font-bold text-base sm:text-lg">{discounted_price}</span>
          {section === 'bigSave' && (
            <>
              <span className="text-green-600 text-[10px] sm:text-xs font-medium">You save {save_amount}</span>
              <span className="line-through text-gray-500 text-[10px] sm:text-xs">{secondary_price}</span>
            </>
          )}
        </div>
        {section === 'superDeals' && (
          <span className="bg-green-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] sm:text-xs font-semibold">
            -{discount_percentage}%
          </span>
        )}
      </div>
    </div>
  );
};

// SuperDealsSection component
const SuperDealsSection = ({ products }) => {
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 24);

  const additionalContent = (
    <>
      <span className="bg-white text-green-600 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[8px] sm:text-[10px] font-bold">L</span>
      <span className="text-xs sm:text-sm">Ends in:</span>
      <Countdown endTime={endTime} />
      <span className="text-white text-xs sm:text-sm">→</span>
    </>
  );

  return (
    <div className="border border-gray-200 rounded-lg shadow-md w-full">
      <SectionTitle title="SuperDeals" additionalContent={additionalContent} />
      {products.length === 0 ? (
        <div className="p-4 text-center text-gray-500 text-sm">No products available</div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide">
  <div className="flex gap-4 px-1 sm:px-2 w-max">
    {products.map((product) => (
      <div key={product.id || product.name} className="min-w-[220px] sm:min-w-[250px] max-w-[250px]">
        <ProductCard product={product} section="superDeals" />
      </div>
    ))}
  </div>
</div>
      )}
    </div>
  );
};

// BigSaveSection component with Carousel
const BigSaveSection = ({ products }) => {
  const carouselImages = products.length > 0
    ? products.map((product) => ({
        url: product.image
          ? product.image.startsWith('http')
            ? product.image
            : `${API_BASE_URL}${product.image}`
          : 'https://via.placeholder.com/150',
        name: product.name,
      }))
    : [
        { url: 'https://via.placeholder.com/150', name: 'Placeholder' },
      ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

   // Update your brand logos array with actual image paths
   const brandLogos = [
    '/images/brands/nike.png',
    '/images/brands/adidas.png',
    '/images/brands/puma.png',
    '/images/brands/reebok.png',
  ];
  
  const AdditionalContent = () => {
    const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentLogoIndex((prev) => (prev + 1) % brandLogos.length);
      }, 1000); // change every second
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden shadow-sm">
          <img
            src={brandLogos[currentLogoIndex]}
            alt="Brand"
            className="w-5/6 h-5/6  object-contain rounded-full"
          />
        </span>
  
        <span className="text-xs sm:text-sm">500+ Brands</span>
        <span className="text-white text-xs sm:text-sm">→</span>
      </div>
    );
  };
  

  return (
    <div className="border border-gray-200 rounded-lg shadow-md w-full">
     <SectionTitle title="Big Save" additionalContent={<AdditionalContent />} />

      <div className="relative p-4">
        <div className="relative w-full h-40 sm:h-48 overflow-hidden rounded-lg">
          {carouselImages.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Carousel Image: ${image.name}`}
              className={`absolute w-full h-full object-contain transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-center mt-2 sm:mt-3 gap-1 sm:gap-2">
          {carouselImages.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                index === currentImageIndex ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      {products.length === 0 ? (
        <div className="p-4 text-center text-gray-500 text-sm">No products available</div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide p-4">
  <div className="flex gap-4 w-max">
    {products.map((product) => (
      <div key={product.id || product.name} className="min-w-[220px] sm:min-w-[250px] max-w-[250px]">
        <ProductCard product={product} section="superDeals" />
      </div>
    ))}
  </div>
</div>

      )}
    </div>
  );
};

// Main Advertising component
const Advertising = () => {
  const [superDealsProducts, setSuperDealsProducts] = useState([]);
  const [bigSaveProducts, setBigSaveProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/advertising/`)
      .then((response) => {
        const products = response.data;
        const superDeals = products.filter((product) => product.section === 'superDeals');
        const bigSave = products.filter((product) => product.section === 'bigSave');
        setSuperDealsProducts(superDeals);
        setBigSaveProducts(bigSave);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the advertising data!', error);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-sm sm:text-base">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-sm sm:text-base">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <Header />
      {/* Scrollable Section */}
      <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div className="flex flex-nowrap gap-4 sm:gap-6 w-max px-2">
          <div className="w-[90vw] md:w-[40rem] flex-shrink-0">
            <SuperDealsSection products={superDealsProducts} />
          </div>
          <div className="w-[90vw] md:w-[40rem] flex-shrink-0">
            <BigSaveSection products={bigSaveProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertising;