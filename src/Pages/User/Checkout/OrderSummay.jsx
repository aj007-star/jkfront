import React from 'react';
import { FaChevronRight, FaRegEnvelope } from 'react-icons/fa';
import { GoArrowLeft } from 'react-icons/go';
import ProductLogo from '../../../../public/Images/product-logo.png';
import Express from '../../../../public/Images/checkout/express.png';
import Donate from '../../../../public/Images/checkout/donate.png';
import Shield from '../../../../public/Images/checkout/shield.png';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa6';
import { calculateDiscountPercentage, calculateTotalPriceDifference, CartActualTotal, CartTotal, formatToINR, getFutureDate } from '../../../Utils/function';
import { removeAddToCartProduct, updateAddCartProduct } from '../../../ReduxToolKit/AllSlice';

const OrderSummary = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userAddress = useSelector(state => state.AllStore.userAddress);
    const addToCart = useSelector(state => state.AllStore.addToCart);


    const handleQuantityChange = (e, productId) => {
        dispatch(updateAddCartProduct({ productId, quantity: e.target.value }));
    }

    const handleOrderSummary = () => {
        if (Object.keys(userAddress).length > 0 && addToCart.length > 0) {
            navigate('/payment')
        } else {
            alert('Please Add Address or Products in cart')
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white">
            <div className='px-4 shadow-[0_4px_8px_-8px]'>
                <h2 className="flex items-center gap-3 text-[16px] font-normal h-[52px] mb-2"><GoArrowLeft onClick={() => navigate(-1)} className='text-[24px]' /> Add delivery address</h2>
                <div className='flex flex-col pb-3 px-4'>
                    <div className='flex items-center gap-3 px-[11px]'>
                        <div onClick={() => navigate('/checkout')} className='text-[#2874f0] border-[#2874f0] border-[1px] min-w-[19px] h-[19px] rounded-full flex justify-center items-center text-[12px] font-semibold'>1</div>
                        <div className='bg-[#dbdbdb] w-full h-[2px]'></div>
                        <div onClick={() => navigate('/order-summary')} className='bg-[#2874f0] min-w-[19px] h-[19px] rounded-full flex justify-center items-center text-[12px] text-white font-semibold'>2</div>
                        <div className='bg-[#dbdbdb] w-full h-[2px]'></div>
                        <div className='text-[#2874f0] border-[#2874f0] border-[1px] min-w-[19px] h-[19px] rounded-full flex justify-center items-center text-[12px] font-semibold'>3</div>
                    </div>
                    <div className='flex justify-between'>
                        <p className='text-[12px] whitespace-nowrap'>Address</p>
                        <p className='text-[12px] whitespace-nowrap'>Order Summary</p>
                        <p className='text-[12px] whitespace-nowrap'>Payment</p>
                    </div>
                </div>
            </div>
            <div className='bg-[#fff] shadow-[rgba(0,0,0,0.1)_0px_1px_6px_0px] my-2 p-4'>
                <div className='flex justify-between items-center'>
                    <h3 className="text-[#111112]">Deliver to:</h3>
                    <button onClick={() => navigate('/checkout')} className='border-[1px] border-[#ccc] text-[#2874f0] p-2 flex justify-center items-center text-[14px] rounded h-[34px]'>Change</button>
                </div>
                {
                    Object.keys(userAddress).length > 0 && (
                        <div className="mt-2">
                            <span className="block mb-[6px]">{userAddress.fullName}<span className="bg-[#f0f2f5] px-2 py-1 rounded-[4px] text-[12px] text-[#717478] shadow-sm ml-4 font-semibold">{userAddress.type.toUpperCase()}</span></span>
                            <p className='text-[14px]'>{userAddress.house}, {userAddress.city}</p>
                            <p className='text-[14px]'>{userAddress.state}, {userAddress.pincode}</p>
                            <p className='text-[14px] text-[#111112] mt-2'>Phone No: {userAddress.phoneNumber}</p>
                        </div>
                    )
                }
            </div>
            <div className='flex flex-col gap-2'>
                {
                    addToCart.map((data, index) => (
                        <div key={index} className="p-2 bg-[#fff] shadow-[rgba(0,0,0,0.1)_0px_1px_6px_0px]">
                            <div className='bg-[#f2f9f2] text-[#008c00] text-[12px] p-[2px_4px] w-fit font-medium mb-3'>Saver Deal</div>
                            <div className="flex pl-2 items-center">
                                <div className='flex flex-col items-center'>
                                    <img src={import.meta.env.VITE_BASE_URL + data.mainImage} alt="product" className="min-w-[72px] h-[72px] object-cover px-2" />
                                    <select value={data.quantity || "1"} onChange={(event) => handleQuantityChange(event, data.productId)} className='border-[1px] border-[#c9c9c9] w-full h-[32px] mt-3 text-[14px] rounded-[2px]'>
                                        <option value="1">Qty: 1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                    <button onClick={() => dispatch(removeAddToCartProduct(data.productId))} className='flex items-center justify-center px-3 py-1 text-red-600 text-sm rounded-sm mt-2 border focus:outline-none focus:ring-2 focus:ring-red-500'>
                                        <FaTrash className='mr-2' />
                                        Remove
                                    </button>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-[15px] font-medium text-[#000] break-words">{data.productName}</h3>
                                    {data.size && <p className="text-sm text-[#878787]">Size: {data.size}</p>}
                                    {data.color && <p className="text-sm text-[#878787]">Color: {data.color}</p>}
                                    <div className="flex items-center text-[#008c00]">
                                        <span>★★★★☆</span>
                                        <span className="mx-2 text-gray-500 text-sm font-medium">(6,850)</span>
                                        <img src={ProductLogo} alt='ProductLogo' className='h-[20px]' />
                                    </div>
                                    <div className="mt-2">
                                        <div className='flex gap-2'>
                                            <p className='text-[#008c00] text-[16px] font-semibold'>{calculateDiscountPercentage(data.price, data.subprice)}% off</p>
                                            <span className='text-[16px] text-[#717478] font-semibold line-through'>{formatToINR(data.price)}</span>
                                            <span className='text-[16px] font-semibold'>{formatToINR(data.subprice)}</span>
                                        </div>
                                        <p className='text-[#008c00] text-[12px] font-semibold flex items-center gap-1'>1 coupon & 2 offers applied <FaChevronRight className='mt-[2px] text-[10px]' />
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-4 mt-3 px-2'>
                                <div className='flex items-center gap-1'>
                                    <img src={Express} alt="Express" className='w-[21px]' />
                                    <p className='italic font-bold text-[12px]'>EXPRESS</p>
                                </div>
                                <p className="text-[12px]">Delivery by {getFutureDate()}<span className="line-through">₹40</span> <span className="text-[#008c00]">FREE</span></p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="pt-2 bg-[#fff] shadow-[rgba(0,0,0,0.1)_0px_1px_6px_0px] my-2">
                <div>
                    <div className='flex items-center justify-between pb-1'>
                        <div className='p-[12px_16px]'>
                            <h3 className="text-[14px]">Donate to Flipkart Foundation</h3>
                            <p className="text-[12px] text-[#717478]">Support transformative social work in India</p>
                        </div>
                        <img src={Donate} alt='Donate' className='w-[85px]' />
                    </div>
                    <div className="flex mt-2 px-2 overflow-auto border-y-[#e4e7ed] border-y-[1px] ">
                        <button className="p-[8px_24px] m-[16px_6px] border-[#d5d7db] border-[1px] rounded-[20px] h-[37px] flex justify-center items-center text-[14px]">₹10</button>
                        <button className="p-[8px_24px] m-[16px_6px] border-[#d5d7db] border-[1px] rounded-[20px] h-[37px] flex justify-center items-center text-[14px]">₹20</button>
                        <button className="p-[8px_24px] m-[16px_6px] border-[#d5d7db] border-[1px] rounded-[20px] h-[37px] flex justify-center items-center text-[14px]">₹50</button>
                        <button className="p-[8px_24px] m-[16px_6px] border-[#d5d7db] border-[1px] rounded-[20px] h-[37px] flex justify-center items-center text-[14px]">₹100</button>
                    </div>
                    <p className="text-[12px] text-[#717478] font-medium  p-[8px_16px]">Note: GST and No cost EMI will not be applicable</p>
                </div>
            </div>
            <div className=" bg-[#fff] shadow-[rgba(0,0,0,0.1)_0px_1px_6px_0px]">
                <div className='px-4'>
                    <h3 className="h-[47px] flex items-center">Price Details</h3>
                    <div className="mt-2">
                        <div className="flex justify-between my-[6px]">
                            <span className='text-[14px] text-[#212121]'>Price ({addToCart.length} item)</span>
                            <span className='text-[14px] text-[#212121]'>{formatToINR(CartTotal(addToCart))}</span>
                        </div>
                        <div className="flex justify-between my-[6px]">
                            <span className='text-[14px] text-[#212121]'>Discount</span>
                            <span className='text-[14px] text-[#008c00]'>-{formatToINR(calculateTotalPriceDifference(addToCart))}</span>
                        </div>
                        <div className="flex justify-between my-[6px]">
                            <span className='text-[14px] text-[#212121]'>Coupons for you <FaRegEnvelope className="inline-block text-gray-500" /></span>
                            <span className='text-[14px] text-[#212121]'>-₹0</span>
                        </div>
                        <div className="flex justify-between my-[6px]">
                            <span className='text-[14px] text-[#212121]'>Delivery Charges</span>
                            <span className='text-[14px] text-[#008c00]'>FREE Delivery</span>
                        </div>
                        <div className="flex justify-between pt-3 mt-3 border-dashed border-t-[2px] border-t-[#e0e0e0] rounded-[1px]">
                            <span className='text-[14px]'>Total Amount</span>
                            <span className='text-[14px]'>{formatToINR(CartActualTotal(addToCart))}</span>
                        </div>
                    </div>
                </div>
                <p className="text-[#008c00] font-medium text-sm mt-2 border-t-[#f0f0f0] border-t-[1px] h-[48px] flex items-center px-4">You will save ₹752 on this order</p>
            </div>

            <div className="border-t pt-2 bg-[#f1f3f6] h-[66px] flex items-center justify-center gap-4 mb-[78px]">
                <img src={Shield} alt='Shield' className='w-[26px]' />
                <span className="text-[12px] font-bold text-[#717478] max-w-[200px]">Safe and secure payments. Easy returns. 100% Authentic products.</span>
            </div>

            <div className="pt-2 fixed bottom-0 w-full bg-white flex justify-between items-center shadow-[rgba(0,0,0,0.15)0px_-4px_4px_-2px] px-4 pb-2">
                <div className="flex justify-between flex-col">
                    <p className='line-through text-[#878787] text-[12px]'>{formatToINR(CartTotal(addToCart))}</p>
                    <span className="text-xl text-[#212121] block leading-[22px]">{formatToINR(CartActualTotal(addToCart))}</span>
                    <button className="text-[#2a55e5] text-[14px]">View price details</button>
                </div>
                <button onClick={() => handleOrderSummary()} className="px-4 py-2 bg-[#ffc200] max-w-[168px] w-full rounded">Continue</button>
            </div>
        </div>
    );
};

export default OrderSummary;
