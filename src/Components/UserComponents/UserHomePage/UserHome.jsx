import React, { useCallback, useEffect, useState } from 'react';
import Slider from "react-slick";
import { FaChevronRight } from "react-icons/fa6";
import { RiStarFill } from "react-icons/ri";
import Navbar from '../../../Components/UserComponents/Navbar/Navbar';
import ProductLogo from '/Images/product-logo.png';
import Shirt from '/Images/menshirt.webp';
import { IoHeart } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addCategoryPage, addProductDetail } from '../../../ReduxToolKit/AllSlice';
import Spinner from '../../Reusable/Spinner';
import NoMoreProducts from '../../Reusable/NoMoreProducts';
import { calculateDiscountPercentage, formatToINR, generateRandomNumber } from '../../../Utils/function';
import api from '../../../Utils/api';

export default function UserHome() {
    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    const SliderData = [
        {
            img: "https://rukminim2.flixcart.com/fk-p-flap/716/350/image/4129256db1490942.jpg?q=60"
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/960/460/image/bb26535571f46160.jpeg?q=60'
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/960/460/image/3f838a657c29a495.jpeg?q=60'
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/960/460/image/4b2f7135615125a6.jpeg?q=60'
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/960/460/image/b1c0378d1bd85a37.jpeg?q=60'
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/960/460/image/fc60b98c782400ee.jpg?q=60'
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/960/460/image/30d98a523f4bd85e.jpeg?q=60'
        },
    ]
    const ProductData = [
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/126/126/image/ac8ae38a7d93283b.jpg?q=60',
            name: "Mobile",
            description: "1"
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/126/126/image/240ecca6a557f30c.jpg?q=60',
            name: "Grocery",
            description: "2"
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/126/126/image/11425150b071f19d.jpg?q=60',
            name: "Electronics",
            description: "3"
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/126/126/image/9f58cf265eb3c589.jpg?q=60',
            name: "Fashion",
            description: "4"
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/126/126/image/51b0d5f9aabc2462.jpg?q=60',
            name: "Appliances",
            description: "5"
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/106/106/image/8123975742d5c3ee.jpg?q=60',
            name: "Beauty",
            description: "6"
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/106/106/image/d71e924a3d3c5ffa.jpg?q=60',
            name: "Toys",
            description: "7"
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/106/106/image/c632b839ac6d183e.jpg?q=60',
            name: "Sports",
            description: "8"
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/106/106/image/63de2d8f2afd51cb.jpg?q=60',
            name: "Home & Kitchen",
            description: "9"
        },
        {
            img: 'https://rukminim2.flixcart.com/fk-p-flap/106/106/image/e1b4ec56637b0ac0.jpg?q=60',
            name: "Trendz",
            description: "10"
        },
    ]
    const dispatch = useDispatch();
    const categories = useSelector(state => state.AllStore.categories);
    const [pageNumber, setPageNumber] = useState(1);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);

    const handleLinkClick = (name) => {
        let linkdata;
        if (name === 'All') {
            linkdata = 'All'
        } else if (name === 'More') {
            linkdata = 'More'
        } else {
            const newdata = categories.find((n) => n.name === name);
            linkdata = newdata.id
        }
        dispatch(addCategoryPage(linkdata));
    };

    const fetchAllProduct = async () => {
        setIsLoading(true);
        try {
            let data;
            if (hasMore) {
                const response = await api.get(`/products?pageNumber=${pageNumber}`);
                data = response.data.data;
                setAllProducts(prevProducts => [...prevProducts, ...data]);
            }
        } catch (error) {
            setHasMore(false);
            setError(error.response.data.data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            fetchAllProduct();
        }, 1000);
    }, [pageNumber]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500 && !isLoading && hasMore) {
            setPageNumber(prevPageNumber => prevPageNumber + 1);
        }
    }, [isLoading, hasMore]);

    const debounce = (func, delay) => {
        let debounceTimer;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    };

    useEffect(() => {
        const debouncedHandleScroll = debounce(handleScroll, 200);
        window.addEventListener('scroll', debouncedHandleScroll);
        return () => window.removeEventListener('scroll', debouncedHandleScroll);
    }, [handleScroll]);

    const handleDetailProduct = async (id) => {
        setIsLoading(true);
        try {
            const response = await api.get(`/products/${id}`);
            dispatch(addProductDetail(response.data.data));
            navigate(`/product-detail/${id}`)
        } catch (error) {
            console.error(error);
            setError(error.response.data);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='bg-[#fff]'>
            <Navbar />
            <div className='pt-[20px] bg-[#fff] mt-1 px-2'>
                <div className='slider-main'>
                    <Slider {...settings}>
                        {SliderData.map((val, index) =>
                            <div key={index}>
                                <img src={val.img} alt='slider-img' className='w-full rounded-xl' />
                            </div>
                        )}
                    </Slider>
                </div>
            </div>
            <div className='flex items-center justify-center flex-wrap pb-[20px] bg-[#fff]'>
                {ProductData.map((val, index) => (
                    <div key={index} className='text-center' onClick={()=>navigate(`/category/${val.description+"-"+val.name}`)}>
                        <img
                            onClick={() => handleLinkClick(val.description)}
                            src={val.img}
                            alt="product"
                            className={`w-[70px] ${index === ProductData.length - 1 && 'w-[65px] opacity-70'}`}
                        />
                        <p className="text-[10px] mt-1 font-semibold">{val.name}</p>
                        {index === ProductData.length - 1 && val.description === 'More' && <p className='text-xs font-semibold'>More</p>}
                    </div>
                ))}
            </div>
            {/* <div className='flex justify-between items-center p-[12px_16px]'>
                <h2 className='text-[#212121] font-semibold text-[17px]'>Recently Viewed Stores</h2>
                <button className='bg-[#2a55e5] rounded-full w-[24px] h-[24px] flex justify-center items-center text-white text-[12px]'><FaChevronRight />
                </button>
            </div>
            <div className='flex gap-2 mb-4 px-4 overflow-x-auto'>
                <Link to={'/category'} onClick={() => handleLinkClick('Mobiles')} className='p-1 border-[1px] border-[rgb(204,204,204)] rounded'>
                    <div className='w-[90px] h-[120px] p-1'>
                        <img src={'https://rukminim2.flixcart.com/image/940/940/xif0q/mobile/c/s/x/-original-imagzjhwaaewgj8r.jpeg?q=60'} alt='Laptop' className='w-full h-full object-cover' />
                    </div>
                    <p className='text-[#333333] text-[12px] mt-1 text-center max-w-[100px]'>Mobiles</p>
                </Link>
                <Link to={'/category'} onClick={() => handleLinkClick('Electronics')} className='p-1 border-[1px] border-[rgb(204,204,204)] rounded'>
                    <div className='w-[90px] h-[120px] p-1'>
                        <img src={'https://rukminim2.flixcart.com/image/360/432/kz4gh3k0/headphone/f/v/b/-original-imagb7bmqzt7hn75.jpeg?q=60&crop=false'} alt='Laptop' className='w-full h-full object-cover' />
                    </div>
                    <p className='text-[#333333] text-[12px] mt-1 text-center max-w-[100px]'>Headphone & Earphone</p>
                </Link>
                <Link to={'/category'} onClick={() => handleLinkClick('Fashion')} className='p-1 border-[1px] border-[rgb(204,204,204)] rounded'>
                    <div className='w-[90px] h-[120px] p-1'>
                        <img src={Shirt} alt='Laptop' className='w-full h-full object-cover' />
                    </div>
                    <p className='text-[#333333] text-[12px] mt-1 text-center object-top object-cover max-w-[100px] break-words'>Men's Shirt and Trouser Fabrics</p>
                </Link>
            </div> */}
            <div className='grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 lg:gap-[30px] max-w-[1600px] mx-auto sm:px-[40px] md:my-[30px] mt-2'>
                {allProducts.map((data, index) =>
                    <div onClick={() => handleDetailProduct(data.productId)} key={index} className="flex flex-col border-[.5px] border-gray-200 lg:rounded-md bg-white">
                        <div className='relative'>
                            <img src={import.meta.env.VITE_BASE_URL + JSON.parse(data.productImages)[0]} alt="T-shirt" className="w-full sm:h-[300px] h-[250px] object-cover object-top" />
                            <button className='text-[#fff] text-[24px] absolute right-[8px] top-[8px] heart-icon'><IoHeart /></button>
                        </div>
                        <div className="flex flex-col p-[10px_4px_8px_8px] overflow-hidden">
                            <p className='text-[10px] text-[#b8bbbf]'>Sponsered</p>
                            <p className='text-[#212121] text-[14px]'>{data.productName}</p>
                            <div className="flex sm:gap-5 gap-2 items-center mb-1">
                                <span className="text-[#4bb550] text-[14px] font-semibold">{calculateDiscountPercentage(data.price, data.subprice)}% off</span>
                                <span className="text-[14px] text-[#878787] line-through font-semibold">{formatToINR(data.price)}</span>
                                <span className="text-[14px] font-bold text-[#000]">{formatToINR(data.subprice)}</span>
                            </div>
                            <div className='flex items-center gap-[2px]'>
                                <div className='flex items-center'>
                                    <RiStarFill className='text-[#008c00] text-[16px]' />
                                    <RiStarFill className='text-[#008c00] text-[16px]' />
                                    <RiStarFill className='text-[#008c00] text-[16px]' />
                                    <RiStarFill className='text-[#008c00] text-[16px]' />
                                    <RiStarFill className='text-[#e1e1e1] text-[16px]' />
                                </div>
                                <span className='text-[#878787] text-[12px]'>{generateRandomNumber(1050, 10000)}</span>
                                <img src={ProductLogo} alt='ProductLogo' className='w-[55px]' />
                            </div>
                            <div className="flex justify-between items-center mt-[2px]">
                                <span className="text-[#000] text-[12px]">Free delivery</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isLoading && (
                <div className='w-full flex justify-center mt-4 mb-4 py-4'>
                    <Spinner />
                </div>
            )}
            {error && <NoMoreProducts message={error.message} />}
        </div>
    )
}
