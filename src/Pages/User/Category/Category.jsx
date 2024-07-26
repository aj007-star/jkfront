import React, { useCallback, useEffect, useState } from 'react';
import Flipkart from '/Images/flipkart.png';
import { IoHeart, IoSearch } from 'react-icons/io5';
import { HiMiniArrowLeft } from 'react-icons/hi2';
import { BsCart3 } from 'react-icons/bs';
import { PiSortAscending } from 'react-icons/pi';
import { RiStarFill } from 'react-icons/ri';
import Discount from '/Images/category/discount.png';
import LoewstPrice from '/Images/category/lowest-price.png';
import Premium from '/Images/category/premium-brand.png';
import Toprated from '/Images/category/top-rated.jpeg';
import NewArrive from '/Images/category/new-arrive.png';
import ProductLogo from '/Images/product-logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../../Utils/api'
import { calculateDiscountPercentage, formatToINR, generateRandomNumber } from '../../../Utils/function';
import NoMoreProducts from '../../../Components/Reusable/NoMoreProducts';
import Spinner from '../../../Components/Reusable/Spinner';
import { addProductDetail } from '../../../ReduxToolKit/AllSlice';
import { FaCartPlus } from 'react-icons/fa6';



export default function Category() {

    const categories = useSelector(state => state.AllStore.categories);
    const categoryPage = useSelector(state => state.AllStore.categoryPage);
    const [pageDetail, setPageDetail] = useState({});
    const [pageNumber, setPageNumber] = useState(1);
    const [productCategory, setProductCategory] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const addToCartLength = useSelector(state=>state.AllStore.addToCart);



    const fetchProductCategoryWise = async () => {
        setIsLoading(true);
        try {
            let data;
            if (hasMore) {
                if (categoryPage === 'All' || categoryPage === 'More') {
                    const response = await api.get(`/products?pageNumber=${pageNumber}`);
                    data = response.data.data;
                } else {
                    const response = await api.get(`/category/${categoryPage}?pageNumber=${pageNumber}`);
                    data = response.data.data;
                }
                setProductCategory(prevProducts => [...prevProducts, ...data]);
            }
        } catch (error) {
            setHasMore(false);
            setError(error.response.data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            fetchProductCategoryWise();
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


    useEffect(() => {
        const detail = async () => {
            let data = {};
            if (categoryPage === 'All' || categoryPage === 'More') {
                data = { name: 'Products' };
            } else {
                data = categories.find((item) => item.id === categoryPage);
            }
            setPageDetail(data);
        };
        detail();
    }, [categoryPage, categories]);

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
        <div>
            <div className='flex justify-between items-center h-[52px]'>
                <div className='flex items-center'>
                    <button onClick={() => navigate(-1)} className='text-[24px] w-[42px] flex justify-center'><HiMiniArrowLeft /></button>
                    <div className='flex gap-[12px] items-center'>
                        <img src={Flipkart} alt='Flipkart' className='w-[23px]' />
                        <p className='overflow-hidden text-[#212121] whitespace-nowrap'>{pageDetail.name}</p>
                    </div>
                </div>
                <div className='flex'>
                    <button className='w-[42px] flex justify-center'>
                        <IoSearch className='text-[20px]' />
                    </button>
                    <div className="relative">
                        <button onClick={()=>navigate('/order-summary')} className="text-[22px]">
                            <FaCartPlus />
                        </button>
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {addToCartLength.length}
                        </span>
                    </div>
                    <p className='w-[90px] flex justify-center'>Login</p>
                </div>
            </div>
            <div className='border-y-[#d1d1d1] border-y-[1px] flex justify-between items-center h-[48px]'>
                <button className='flex gap-2 w-full justify-center'><PiSortAscending className='text-[20px]' /><span className='text-[#111112] text-[14px] font-semibold'>Sort</span></button>
                <div className='bg-[#d1d1d1] w-[1px] h-[16px]'></div>
                <button className='flex gap-2 w-full justify-center'>
                    <div className='relative'>
                        <svg width="20" height="20" viewBox="0 0 256 256"><path fill="none" d="M0 0h256v256H0z"></path><path fill="none" stroke="#111112" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" d="M148 172H40M216 172h-28"></path><circle cx="168" cy="172" r="20" fill="none" stroke="#111112" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></circle><path fill="none" stroke="#111112" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" d="M84 84H40M216 84h-92"></path><circle cx="104" cy="84" r="20" fill="none" stroke="#111112" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></circle></svg>
                        <span className='bg-[#e32727] text-white w-[10px] h-[10px] text-[8px] block absolute top-0 right-[-1px] rounded-full'>1</span>
                    </div>
                    <span className='text-[#111112] text-[14px] font-semibold'>Filter</span>
                </button>
            </div>
            <div className='overflow-auto'>
                <div className='px-[11px] flex items-center min-w-full mb-4'>
                    <div className='border-[#dbdbdb] border-[1px] w-full p-[0_8px_0_4px] rounded-[4px] m-[8px_4px_0] flex items-center gap-2 min-w-fit'>
                        <img src={Discount} alt='Discount' className='w-[32px]' />
                        <p className='text-[12px] text-[#212121] w-full'>Top Sale <br />
                            Discounts </p>
                    </div>
                    <div className='border-[#dbdbdb] border-[1px] w-full p-[0_8px_0_4px] rounded-[4px] m-[8px_4px_0] flex items-center gap-2 min-w-fit'>
                        <img src={LoewstPrice} alt='Discount' className='w-[32px]' />
                        <p className='text-[12px] text-[#212121] w-full'>Lowest Price <br />
                            in July </p>
                    </div>
                    <div className='border-[#dbdbdb] border-[1px] w-full p-[0_8px_0_4px] rounded-[4px] m-[8px_4px_0] flex items-center gap-2 min-w-fit'>
                        <img src={Premium} alt='Discount' className='w-[32px]' />
                        <p className='text-[12px] text-[#212121] w-full'>Premium <br />
                            Brands  </p>
                    </div>
                    <div className='border-[#dbdbdb] border-[1px] w-full p-[0_8px_0_4px] rounded-[4px] m-[8px_4px_0] flex items-center gap-2 min-w-fit'>
                        <img src={Toprated} alt='Discount' className='w-[32px]' />
                        <p className='text-[12px] text-[#212121] w-full'>Top <br />
                            Rated  </p>
                    </div>
                    <div className='border-[#dbdbdb] border-[1px] w-full p-[0_8px_0_4px] rounded-[4px] m-[8px_4px_0] flex items-center gap-2 min-w-fit'>
                        <img src={NewArrive} alt='Discount' className='w-[32px]' />
                        <p className='text-[12px] text-[#212121] w-full'>New <br />
                            Arrivals </p>
                    </div>
                </div>
            </div>
            <div className='grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 lg:gap-[30px] max-w-[1600px] mx-auto sm:px-[40px] md:my-[30px]'>
                {productCategory.map((data, index) =>
                    <div onClick={() => handleDetailProduct(data.productId)} key={index} className="flex flex-col border-[.5px] border-gray-200 lg:rounded-md bg-white">
                        <div className='relative'>
                            <img src={import.meta.env.VITE_BASE_URL + data.productImages[0]} alt="Product" className="w-full sm:h-[300px] h-[250px] object-fit" />
                            <button className='text-[#fff] text-[24px] absolute right-[8px] top-[8px] heart-icon'><IoHeart /></button>
                        </div>
                        <div className="flex flex-col p-[10px_4px_8px_8px] overflow-hidden">
                            <p className='text-[10px] text-[#b8bbbf]'>Sponsered</p>
                            <p className='text-[#212121] text-[14px]'>{data.productName}</p>
                            <div className="flex sm:gap-5 gap-2 items-center">
                                <span className="text-[14px] text-[#878787] line-through font-semibold">{formatToINR(data.price)}</span>
                                <span className="text-[14px] font-bold text-[#000]">{formatToINR(data.subprice)}</span>
                            </div>
                            <div>
                                <span className="text-[#4bb550] text-[14px] font-semibold">{calculateDiscountPercentage(data.price, data.subprice)}% off</span>
                            </div>
                            <div className='flex items-center gap-[2px]'>
                                <div className='flex items-center'>
                                    <RiStarFill className='text-[#008c00] text-[16px]' />
                                    <RiStarFill className='text-[#008c00] text-[16px]' />
                                    <RiStarFill className='text-[#008c00] text-[16px]' />
                                    <RiStarFill className='text-[#008c00] text-[16px]' />
                                    <RiStarFill className='text-[#e1e1e1] text-[16px]' />
                                </div>
                                <span className='text-[#878787] text-[12px]'>{generateRandomNumber(1050, 5400)}</span>
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
