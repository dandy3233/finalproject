import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';


const API_BASE_URL = 'http://localhost:8000';

const Header = () => (
  <div className="text-center mb-6 sm:mb-8">
    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
      Today's Deals
    </h1>
  </div>
);

const SectionTitle = ({ title, additionalContent }) => (
  <div className="bg-gradient-to-r from-green-600 to-teal-500 text-white p-3 rounded-t-lg flex flex-col items-center">
    <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
    {additionalContent && (
      <div className="mt-2 bg-green-700 bg-opacity-30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-md">
        {additionalContent}
      </div>
    )}
  </div>
);

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
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return <span className="font-mono text-xs sm:text-sm animate-pulse text-yellow-300">{timeLeft}</span>;
};

const ProductCard = ({ product, section }) => {
  const dispatch = useDispatch(); // Add this
  const navigate = useNavigate();

  const {
    id,
    image,
    name,
    original_price,
    discounted_price,
    discount_percentage,
    save_amount,
    secondary_price,
    countInStock = 10 // Default value
  } = product;

  const imageUrl = image?.startsWith('http') ? image : `${API_BASE_URL}${image}`;
  // const navigate = useNavigate();
  // Default quantity is set to 1 but not used

  const handleAddToCart = () => {
    dispatch(addToCart(
      id,
      1, // qty
      {
        name,
        image: imageUrl,
        price: discounted_price,
        // countInStock,
        // Add other necessary fields from advertising endpoint
        original_price,
        discount_percentage,
        countInStock
      }
    ));
    navigate('/cart');
  };

  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-green-500 w-full">
      <img
        src={imageUrl || 'https://via.placeholder.com/150'}
        alt={name}
        className="w-full h-44 sm:h-52 object-contain rounded-xl bg-gray-50 mb-4 transition-transform duration-300 hover:scale-105"
      />

      <h3 className="text-gray-800 text-sm sm:text-base font-semibold mb-2 line-clamp-2">{name}</h3>

      <div className="flex items-start justify-between">
        {/* Pricing Info */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="line-through text-gray-400 text-xs sm:text-sm">{original_price}</span>
            <span className="text-green-600 font-extrabold text-lg sm:text-xl">{discounted_price}</span>
          </div>

          {section === 'bigSave' && (
            <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
              <span className="text-green-500 font-medium">You save {save_amount}</span>
              <span className="line-through text-gray-400">{secondary_price}</span>
            </div>
          )}
        </div>

        {/* Discount Tag or Cart */}
        <div className="flex items-center gap-2">
          {section === 'superDeals' && (
            <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md animate-bounce">
              -{discount_percentage}%
            </span>
          )}

          {/* 🛒 Cart Button */}
          <button
        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-700 transition"
        onClick={handleAddToCart}
      >
        <FontAwesomeIcon icon={faShoppingCart} />
      </button>
        </div>
      </div>
    </div>
  );
};


const ProductCarousel = ({ products, section }) => (
  <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4">
    <div className="flex gap-4 w-max">
      {products.map((product) => (
        <div key={product.id || product.name} className="w-[80vw] sm:w-[40vw] md:w-[20rem] flex-shrink-0 snap-center">
          <ProductCard product={product} section={section} />
        </div>
      ))}
    </div>
  </div>
);

const SuperDealsSection = ({ products }) => {
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 24);

  const additionalContent = (
    <>
      <div className="flex flex-col gap-1 w-full">
    {/* Countdown Row */}
    <div className="flex justify-center">
  <div className="flex items-center gap-3 flex-wrap">
    <span className="bg-white text-green-600 rounded-full w-6 h-8 sm:w-7 sm:h-7 flex items-center justify-center text-[10px] sm:text-[11px] font-bold">
      L
    </span>
    <span className="text-xs sm:text-sm h-5 sm:h-6 flex items-center">Ends in:</span>
    <span className="w-16 h-6 sm:h-6 flex items-center">
      <Countdown endTime={endTime} />
    </span>
    <span className="text-white text-xs font-bold sm:text-sm w-4 h-5 sm:w-5 sm:h-6 flex items-center">→</span>
  </div>
</div>

    {/* Marquee Text */}
    <div className="overflow-hidden w-full">
      <div className="animate-marquee whitespace-nowrap text-white text-sm font-semibold">
        <span className="inline-block mx-4">🔥 Hottest 🔥 Deals 🔥 Limited 🔥 Time 🔥</span>
      </div>
    </div>
  </div>
    </>
  );
  

  return (
    <div className="border border-gray-200 rounded-lg shadow-md w-full">
      <SectionTitle title="SuperDeals" additionalContent={additionalContent} />
      {products.length === 0 ? (
        <div className="p-4 text-center text-gray-500 text-sm">No products available</div>
      ) : (
        <ProductCarousel products={products} section="superDeals" />
      )}
    </div>
  );
};

const BigSaveSection = ({ products }) => {
  const brandLogos = [
    '/images/brands/nike.png',
    '/images/brands/adidas.png',
    '/images/brands/puma.png',
    '/images/brands/reebok.png',
  ];

  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % brandLogos.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [brandLogos.length]);

  const additionalContent = (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden shadow-sm">
        <img src={brandLogos[currentLogoIndex]} alt="Brand" className="w-5/6 h-5/6 object-contain rounded-full" />
      </span>
      <span className="text-xs sm:text-sm">500+ Brands</span>
      <span className="text-white text-xs sm:text-sm">→</span>
    </div>
  );

  return (
    <div className="border border-gray-200 rounded-lg shadow-md w-full">
      <SectionTitle title="Big Save" additionalContent={additionalContent} />
      {products.length === 0 ? (
        <div className="p-4 text-center text-gray-500 text-sm">No products available</div>
      ) : (
        <ProductCarousel products={products} section="bigSave" />
      )}
    </div>
  );
};

// Updated Advertising component
const Advertising = () => {
  const [superDealsProducts, setSuperDealsProducts] = useState([]);
  const [bigSaveProducts, setBigSaveProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvertisingProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/advertising/`);
        const products = response.data.map(product => ({
          ...product,
          // Transform API response to match needed structure
          price: product.discounted_price,
          originalPrice: product.original_price,
          countInStock: product.stock || 10 // Map stock field if exists
        }));

        setSuperDealsProducts(products.filter(p => p.section === 'superDeals'));
        setBigSaveProducts(products.filter(p => p.section === 'bigSave'));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchAdvertisingProducts();
  }, []);

  if (loading) return <div className="p-6 flex justify-center items-center text-sm">Loading...</div>;
  if (error) return <div className="p-6 text-red-600 text-sm">{error}</div>;

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <Header />
      <div className="flex flex-col lg:flex-row gap-5">
  <div className="w-full lg:w-1/2">
    <SuperDealsSection products={superDealsProducts} />
  </div>
  <div className="w-full lg:w-1/2">
    <BigSaveSection products={bigSaveProducts} />
  </div>
</div>

    </div>
  );
};

export default Advertising;
