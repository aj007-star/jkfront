import React, { useEffect, useState } from 'react';
import Flipkart from '../../../../public/Images/flipkart.png';
import { IoChevronDownOutline, IoHeart, IoReturnDownBack, IoSearch } from 'react-icons/io5';
import { HiMiniArrowLeft } from 'react-icons/hi2';
import { LuTrendingUp } from 'react-icons/lu';
import { RiDiscountPercentFill, RiStarFill } from 'react-icons/ri';
import { FaCheck, FaChevronRight } from 'react-icons/fa';
import { LiaRulerVerticalSolid, LiaRupeeSignSolid } from 'react-icons/lia';
import { PiTruckLight } from 'react-icons/pi';
import { MdChevronRight } from 'react-icons/md';
import ProductLogo from '../../../../public/Images/product-logo.png';
import Coin from '../../../../public/Images/product-detail/coin.png'
import Coin2 from '../../../../public/Images/product-detail/coin2.png'
import { GoChevronRight } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router-dom';
import { calculateDiscountPercentage, formatToINR, generateRandomNumber, getFutureDate } from '../../../Utils/function';
import api from '../../../Utils/api';
import Spinner from '../../../Components/Reusable/Spinner';
import NoMoreProducts from '../../../Components/Reusable/NoMoreProducts';
import { useDispatch, useSelector } from 'react-redux';
import { addProductDetail, addProductToCart } from '../../../ReduxToolKit/AllSlice';
import { FaCartPlus } from 'react-icons/fa6';

export default function ProductDetail() {
    const [highlight, setHighlight] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);
    const addToCartLength = useSelector(state=>state.AllStore.addToCart);
    const productDetail = useSelector(state => state.AllStore.productdetail);
    const [productMainImage, setProductMainImage] = useState(import.meta.env.VITE_BASE_URL + productDetail.productImages[0]);

    const fetchProductBySimilar = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/category/${productDetail.CategoryId}?pageNumber=1`);
            setSimilarProducts(response.data.data)
        } catch (error) {
            console.error(error);
            setError(error.response.data);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllProduct = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/products?pageNumber=1`);
            setAllProducts(response.data.data);
        } catch (error) {
            setError(error.response.data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            fetchProductBySimilar()
            fetchAllProduct();
        }, 1000);
    }, [id]);

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

    const handleBuyButton = ()=>{
        dispatch(addProductToCart({...productDetail,selectedSize,selectedColor}));
        navigate('/checkout');
    }

    return (
        <div>
            <div className='flex justify-between items-center h-[52px]'>
                <div className='flex items-center'>
                    <button onClick={() => navigate(-1)} className='text-[24px] w-[42px] flex justify-center'><HiMiniArrowLeft /></button>
                    <div className='flex gap-[12px] items-center'>
                        <img src={Flipkart} alt='Flipkart' className='w-[23px]' />
                        <p className='text-sm'>{productDetail.productName}</p>
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
            {isLoading ? (
                <div className='w-full flex justify-center mt-4 mb-4 py-4' style={{ height: 'calc(100vh - 100px)' }}>
                    <Spinner />
                </div>
            ) : error ? (<NoMoreProducts message={error.message} />) : (<div>
                <div className='slider-main product-detail-slider pb-[60px]'>
                    <div className='px-[30px]'>
                        <div>
                            <img src={productMainImage} alt='slider-img' className='w-full' />
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center p-[5px_12px_16px] gap-2 mt-4'>
                            <div className='bg-[#e9f9ea] text-[#108934] w-[24px] h-[24px] flex justify-center items-center rounded-full'>
                                <LuTrendingUp />
                            </div>
                            <p className='text-[14px]'><span>{generateRandomNumber(600, 2345)}+</span> people ordered this in the last 30 days</p>
                        </div>
                        <div className='flex justify-between items-center p-[0_16px_8px]'>
                            <div className='flex items-center'>
                                <p className='text-[14px] mr-1'>Color: </p>
                                <div className='flex gap-1'>
                                    {
                                        productDetail.color.split(',').map((va,index) => (
                                            <p key={index} onClick={() => setSelectedColor(va)} className={`text-[14px] p-1 rounded-md border ${va === selectedColor && 'bg-amber-300'}`}>{va}</p>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <p className='text-[12px] text-[#878787]'>Available Color : </p>
                                <p className='text-[12px] text-[#878787]'>{productDetail.color.split(',').length}</p>
                            </div>
                        </div>
                    </div>
                    <div className='overflow-auto'>
                        <div className='px-[12px] pb-1 flex w-full'>
                            {
                                productDetail.productImages.map((val, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setProductMainImage(import.meta.env.VITE_BASE_URL + val)}
                                        className={`m-1 min-w-[76px] h-[76px] px-2 rounded-md cursor-pointer transition-transform duration-300 ease-in-out ${val === productMainImage
                                            ? 'bg-amber-400 transform scale-105 shadow-lg'
                                            : ''
                                            }`}
                                    >
                                        <img
                                            src={import.meta.env.VITE_BASE_URL + val}
                                            alt='Product'
                                            className='w-full h-full object-cover object-top'
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className='px-4 pt-[12px]'>
                        {/* <a href="#" className='text-[#212121] text-[14px] font-semibold underline'>View more from mokshi</a> */}
                        <p className='text-[14px] mt-[6px] mb-1'>{productDetail.productDescription}</p>
                        <div className='flex gap-2 items-center'>
                            <div className='flex gap-[2px]'>
                                <RiStarFill className='text-[#000] text-[14px]' />
                                <RiStarFill className='text-[#000] text-[14px]' />
                                <RiStarFill className='text-[#000] text-[14px]' />
                                <RiStarFill className='text-[#000] text-[14px]' />
                                <RiStarFill className='text-[#e1e1e1] text-[14px]' />
                            </div>
                            <span className='text-[#111112] text-[12px] font-semibold'>Very Good  • </span>
                            <span className='text-[#111112] text-[12px]'>{formatToINR(generateRandomNumber(10000, 165000), 'decimal')} ratings</span>
                        </div>
                    </div>
                    <div className='px-[16px] mt-[24px]'>
                        <div className='flex'>
                            <button className='text-white bg-[rgb(16,137,52)] p-[5px_6px_6px] text-[12px] relative pt-[8px] font-semibold'>Lowest Price in 30 days</button>
                            <div className="w-0 h-0 border-b-[25px] border-b-[#108934] border-r-[12.5px] border-r-transparent border-t-solid border-l-solid"></div>
                        </div>
                        <div className='bg-[#e7f8ec] flex gap-2 p-[10px_16px] rounded mt-2'>
                            <p className='text-[#108934] text-[20px] font-semibold'>{calculateDiscountPercentage(productDetail.price, productDetail.subprice)}% off</p>
                            <span className='text-[20px] text-[#717478] font-semibold line-through'>{formatToINR(productDetail.price)}</span>
                            <span className='text-[20px] font-semibold'>{formatToINR(productDetail.subprice)}</span>
                        </div>
                        <div className='border-[1px] border-[#e0e0e0] rounded mt-3 p-[8px_12px] flex justify-between items-start'>
                            <div className='flex gap-2'>
                                <div className='text-[#0e5c28] border-[1px] border-[#aaa] rounded-full w-[21px] h-[21px] flex justify-center items-center'>
                                    <RiDiscountPercentFill />
                                </div>
                                <div>
                                    <p className='text-[14px]'>Get ₹47 extra Off</p>
                                    <p className='text-[12px] mt-[6px]'>Ends in  <span className='text-[#d23c33]'> 08d 06h 41m 12s </span></p>
                                </div>
                            </div>
                            <div className='flex items-center text-[#108934] text-[14px] gap-1'>
                                <FaCheck />
                                <p>Applied</p>
                            </div>
                        </div>
                        <p className='text-[12px] mt-4'>Free delivery by <span>{getFutureDate(2)}</span></p>
                    </div>
                    <div className='bg-white shadow-[rgba(0,0,0,0.1)_0px_1px_6px_0px] px-[14px] pb-[24px] mb-2'>
                        <div className='flex justify-between h-[46px] items-center py-2'>
                            <p className='text-[17px] text-black font-semibold h-[30px]'>Size: <span className='text-sm'>{productDetail.size}</span></p>
                            <div className='flex items-center gap-2'>
                                <LiaRulerVerticalSolid className='text-[26px] rotate-[90deg]' />
                                <p className='underline text-[#212121] text-[12px] font-semibold'>Size Chart</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            {productDetail.size !== '' ? (productDetail.size.split(',').map((va,index) => (
                                <button key={index} onClick={() => setSelectedSize(va)} className={`w-[50px] h-[50px] relative rounded-full border-[#000] border-[1px] flex justify-center items-center text-[#000] text-[18px] ${va === selectedSize && 'bg-black'}`}>
                                    <span className={`block text-[14px] mt-[-2px]  ${va === selectedSize && 'text-white'}`}>{va}</span>
                                </button>
                            ))) : (<p className='underline text-[#212121] text-[12px] font-semibold'>
                                Size not Available
                            </p>)
                            }
                        </div>
                    </div>
                    <div className='bg-[#fff] shadow-[rgba(0,0,0,0.1)_0px_1px_6px_0px]'>
                        <div className='p-[4px_12px_8px_16px]'>
                            <div className='flex justify-between items-center gap-2 py-[6px]'>
                                <div className='flex items-center gap-[16px]'>
                                    <PiTruckLight className='text-[#a0a0a2] text-[24px]' />
                                    <div className='text-[14px]'>
                                        <span className='text-[#008c00] text-[14px] font-semibold'>FREE Delivery </span>
                                        <span className='text-[#717478]'>₹ 40 </span>
                                        <span> • </span>
                                        <span className='text-[#212121] text-sm'>Delivery by <br />{getFutureDate(2)}<br /> <span className='text-[#606265]'>If ordered within</span></span>
                                        <span className='text-[#c70055]'> 01h 30m  04s</span>
                                    </div>
                                </div>
                                <button><MdChevronRight /></button>
                            </div>
                            <div className='flex justify-between items-center gap-2 py-[6px]'>
                                <div className='flex items-center gap-[16px]'>
                                    <IoReturnDownBack className='text-[#a0a0a2] text-[24px]' />
                                    <div className='text-[14px]'>
                                        <span className='text-[#212121]'>10 Days Return Policy</span>
                                    </div>
                                </div>
                                <button><MdChevronRight /></button>
                            </div>
                            <div className='flex justify-between items-center gap-2 py-[6px]'>
                                <div className='flex items-center gap-[16px]'>
                                    <LiaRupeeSignSolid className='text-[#a0a0a2] text-[24px]' />
                                    <div className='text-[14px]'>
                                        <span className='text-[#212121]'>Cash on Delivery Available</span>
                                    </div>
                                </div>
                                <button><MdChevronRight /></button>
                            </div>
                        </div>
                    </div>
                    <div className='bg-[#fff] shadow-[rgba(0,0,0,0.1)_0px_1px_6px_0px] flex justify-between items-center gap-2 my-2 p-[12px_18px_12px_16px]'>
                        <span className='text-[#212121] text-[14px]'>All Offers & Coupons</span>
                        <button className='text-[20px]'><GoChevronRight /></button>
                    </div>
                    <div className='bg-[#fff] shadow-[rgba(0,0,0,0.1)_0px_1px_6px_0px]'>
                        <div className="flex justify-between items-center p-[12px_16px] ">
                            <h2 className="text-[#212121] font-semibold text-[17px]">Similar Products</h2>
                            <button className="rounded-full w-[24px] h-[24px] flex justify-center items-center text-[#2a55e5] text-[12px] border-[1px] border-[#aaa]"><FaChevronRight /></button>
                        </div>
                        <div className='flex overflow-auto gap-2 px-[16px] pb-4'>
                            {similarProducts.map((data, index) =>
                                <div key={index} onClick={()=>handleDetailProduct(data.productId)} className="flex flex-col border-[.5px] border-gray-200 lg:rounded-md bg-white min-w-[148px] w-full rounded">
                                    <div className='relative px-[14px]'>
                                        <img src={import.meta.env.VITE_BASE_URL + data.productImages[0]} alt="T-shirt" className="w-full sm:h-[300px] h-[163px] object-cover object-top" />
                                    </div>
                                    <div className="flex flex-col p-[10px_4px_8px_8px] overflow-hidden">
                                        <p className='text-[10px] text-[#b8bbbf]'>Sponsered</p>
                                        <p className='text-[#212121] text-[14px] truncate'>{data.productName}</p>
                                        <div className="flex sm:gap-5 gap-2 items-center mb-1">
                                            <span className="text-[14px] text-[#878787] line-through">{formatToINR(data.price)}</span>
                                            <span className="text-[14px] text-[#000]">{formatToINR(data.subprice)}</span>
                                        </div>
                                        <div className='flex gap-3 items-center'>
                                            <span className="text-[#4bb550] text-[14px] block mb-1">{calculateDiscountPercentage(data.price, data.subprice)}% off</span>
                                            <img src={ProductLogo} alt='ProductLogo' className='w-[50px]' />
                                        </div>
                                        <div className='flex items-center gap-[2px]'>
                                            <div className='flex items-center'>
                                                <RiStarFill className='text-[#008c00] text-[14px]' />
                                                <RiStarFill className='text-[#008c00] text-[14px]' />
                                                <RiStarFill className='text-[#008c00] text-[14px]' />
                                                <RiStarFill className='text-[#008c00] text-[14px]' />
                                                <RiStarFill className='text-[#e1e1e1] text-[14px]' />
                                            </div>
                                            <span className='text-[#878787] text-[12px]'>{generateRandomNumber(1050, 10000)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-[2px]">
                                            <span className="text-[#000] text-[12px]">Free delivery</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='bg-[#fff] shadow-[rgba(0,0,0,0.1)_0px_1px_6px_0px] mt-2 p-[8px_8px_8px_16px]'>
                        <div className='border-b-[#eaeaea] border-b-[1px] pb-2'>
                            <div className='text-[14px] text-[#212121] flex items-center'><img src={Coin} alt='Coin' className='w-[24px] mr-3' /> You will earn <img src={Coin2} alt='Coin' className='w-[14px] mx-1' /> 4 SuperCoins cashback</div>
                        </div>
                        <p className='text-[12px] text-[#212121] mt-2'>Use it to save on your next order. <a href="#" className='text-[#2a55e5] font-semibold'>How?</a></p>
                    </div>
                    <div className='bg-[#fff] shadow-[rgba(0,0,0,0.1)_0px_1px_6px_0px] my-2'>
                        <div onClick={() => setHighlight(!highlight)} className='flex justify-between items-center gap-2 p-4'>
                            <span className='text-[#212121] text-[14px]'>Product Highlights</span>
                            <button className='text-[18px]'><IoChevronDownOutline /></button>
                        </div>
                        {highlight &&
                            <div className='p-4 pt-0'>
                                <p className='mb-2 text-[14px]'>About Product</p>
                                <p className='text-[#212121] text-[14px] font-medium'>
                                    {productDetail.productDescription}
                                </p>
                            </div>
                        }

                        <div className='flex justify-between items-center gap-2 p-4'>
                            <span className='text-[#212121] text-[14px]'>All Offers & Coupons</span>
                            <button className='text-[20px]'><GoChevronRight /></button>
                        </div>
                    </div>
                    <div className='bg-[#fff] shadow-[rgba(0,0,0,0.1)_0px_1px_6px_0px]'>
                        <div className='flex justify-between items-center gap-2 p-4'>
                            <span className='text-[#212121] text-[14px]'>Product Details</span>
                        </div>
                        <div className='px-4 grid grid-cols-2'>
                            <p className='text-[#878787] text-[14px] pb-4'>Product Name</p>
                            <p className='text-[#212121] text-[14px] pb-4'>{productDetail.productName}</p>
                            <p className='text-[#878787] text-[14px] pb-4'>Color</p>
                            <p className='text-[#212121] text-[14px] pb-4'>{productDetail.color}</p>
                            <p className='text-[#878787] text-[14px] pb-4'>Size</p>
                            <p className='text-[#212121] text-[14px] pb-4'>{productDetail.size}</p>
                        </div>
                        <div className='flex justify-between items-center gap-2 p-4'>
                            <span className='text-[#212121] text-[14px]'>Similar Products On this sale</span>
                        </div>
                    </div>
                    <div className='grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 lg:gap-[30px] max-w-[1600px] mx-auto sm:px-[40px] md:my-[30px]'>
                        {allProducts.map((data, index) =>
                            <div onClick={()=>handleDetailProduct(data.productId)} key={index} className="flex flex-col border-[.5px] border-gray-200 lg:rounded-md bg-white">
                                <div className='relative'>
                                    <img src={import.meta.env.VITE_BASE_URL + data.productImages[0]} alt="T-shirt" className="w-full sm:h-[300px] h-[250px] object-cover object-top" />
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
                </div>
                <div className='flex items-center w-full fixed bottom-0'>
                    <button onClick={()=>dispatch(addProductToCart({...productDetail,selectedSize,selectedColor}))} className='h-[50px] bg-white text-center flex justify-center items-center w-1/2'>Add to cart</button>
                    <button onClick={handleBuyButton} className='h-[50px] bg-[#ffc200] text-center flex justify-center items-center w-1/2'>Buy now</button>
                </div>
            </div>)
            }

        </div>
    )
}
