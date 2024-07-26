import React, { useEffect, useRef, useState } from 'react';
import { GoArrowLeft } from 'react-icons/go';
import { BiLockOpen } from "react-icons/bi";
import 'tailwindcss/tailwind.css';
import { IoIosArrowDown } from 'react-icons/io';
import UPI from '/Images/checkout/upi.svg';
import GooglePay from '/Images/checkout/google-pay.svg';
import Phonepay from '/Images/checkout/phonepe.svg';
import Cash from '/Images/checkout/cash-icon.svg';
import Gift from '/Images/checkout/gift-card.svg';
import EMI from '/Images/checkout/EMI.svg';
import { CiCreditCard1, CiFaceSmile, CiWallet } from 'react-icons/ci';
import { PiBankLight } from 'react-icons/pi';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { CartActualTotal, formatToINR } from '../../../Utils/function';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../Utils/api';
import Spinner from '../../../Components/Reusable/Spinner';
import { FaSpinner, FaWallet } from 'react-icons/fa6';
import QRCode from 'qrcode.react';
import { clearState } from '../../../ReduxToolKit/AllSlice';



const Payment = () => {
    const [upi, setUpi] = useState(true)
    const [isChecked, setIsChecked] = useState('googlepay');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const addToCart = useSelector(state => state.AllStore.addToCart);
    const userAddress = useSelector(state => state.AllStore.userAddress);
    const [isGoogleEnable, setIsGoogleEnable] = useState(false);
    const [AdminUpi, setAdminUpi] = useState('')
    const [customUpi, setCustomUpi] = useState('');
    const [customupiError, setCustomupiError] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        if (Object.keys(userAddress).length === 0 || addToCart.length === 0) {
            navigate('/');
        }
    }, [userAddress, addToCart, navigate]);

    const PayButton = ({ type }) => {
        const qrCodeRef = useRef();
        const [loading, setLoading] = useState(false);
        const dispath = useDispatch()

        const handlePayClick = async () => {

            const { data } = await api.post('/orders', {
                products: addToCart,
                totalAmount: addToCart.reduce((total, product) => total + (Number(product.subprice) || 0) * (Number(product.quantity) || 1), 0),
                customerDetail: userAddress
            });

            if (type === 'googlepay' && isGoogleEnable) {
                handleShareClick(isGoogleEnable);
            } else if (type === 'googlepay' && !isGoogleEnable) {
                setTimeout(() => {
                    handleShareClick();
                }, 1000);
            } else if (type === 'phonepay') {
                handleShareClick(false, 'phonepe')
            } else if (type === 'upi') {
                if (customUpi === '') {
                    setCustomupiError(true);
                } else {
                    handleShareClick(false, 'upi')
                }
            }
            dispath(clearState());
        };


        const handleShareClick = (isGoogleEnable = false, paytype = 'upi') => {
            const amount = CartActualTotal(addToCart);
            const upiLink = `${paytype}://pay?pa=${encodeURIComponent(AdminUpi)}&pn=YourName&am=${amount}&mc=0000&cu=INR&tn=testing&sign=AAuN7izDWN5cb8A5scnUiNME+LkZqI2DWgkXlN1McoP6WZABa/KkFTiLvuPRP6/nWK8BPg/rPhb+u4QMrUEX10UsANTDbJaALcSM9b8Wk218X+55T/zOzb7xoiB+BcX8yYuYayELImXJHIgL/c7nkAnHrwUCmbM97nRbCVVRvU0ku3Tr`;

            if (isGoogleEnable) {
                setLoading(true);
                setTimeout(async () => {
                    const qrCodeCanvas = qrCodeRef.current.querySelector('canvas');
                    const qrCodeBlob = await new Promise((resolve) => {
                        qrCodeCanvas.toBlob(blob => resolve(blob));
                    });
                    const isAndroid = /Android/i.test(navigator.userAgent);
                    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                    if (isAndroid) {
                        const data = {
                            title: "Title of your share",
                            text: "Description of your share",
                            url: upiLink,
                            files: [qrCodeBlob],
                        };
                        if (navigator.share) {
                            navigator.share(data)
                                .catch(console.error)
                                .finally(() => setLoading(false)); // Stop loading
                        } else {
                            alert('Share not supported on this browser.');
                            setLoading(false); // Stop loading
                        }
                    } else {
                        alert('Share not supported on this Platform.');
                    }
                }, 1000);
            } else {
                setLoading(true);
                setTimeout(() => {
                    if (navigator.share) {
                        navigator.share({
                            title: 'Pay to Flipkart',
                            text: 'Click to pay',
                            url: upiLink
                        }).catch(() => {
                            console.error(error);
                            setLoading(false);
                        });
                    } else {
                        alert('Share not supported on this platform.');
                        setLoading(false);
                    }
                }, 1000);
            }
        };

        return (
            <div className='ml-[30px]'>
                {type === 'upi' && (
                    <div className="">
                        <input
                            type="text"
                            id="upiId"
                            name="upiId"
                            placeholder="example@upi"
                            className={`mt-1 ${customupiError && 'border border-red-500'} block w-full p-2 border border-gray-300 rounded-md text-gray-700`}
                            value={customUpi}
                            onChange={(e) => setCustomUpi(e.target.value)}
                        />
                    </div>
                )}
                <button
                    className='bg-[#ffc200] text-[#212121] h-[40px] text-[14px] w-full rounded font-semibold mt-4 flex items-center justify-center'
                    onClick={handlePayClick}
                >
                    <FaWallet className="mr-2" />
                    {loading ? (
                        <>
                            <FaSpinner className="animate-spin mr-2" /> Please wait...
                        </>
                    ) : (
                        `Pay ${formatToINR(CartActualTotal(addToCart))}`
                    )}

                </button>
                <div className='hidden'>
                    <div ref={qrCodeRef}>
                        <QRCode value={`upi://pay?pa=${encodeURIComponent(AdminUpi)}&pn=YourName&am=${CartActualTotal(addToCart)}&mc=0000&cu=INR&tn=testing&sign=AAuN7izDWN5cb8A5scnUiNME+LkZqI2DWgkXlN1McoP6WZABa/KkFTiLvuPRP6/nWK8BPg/rPhb+u4QMrUEX10UsANTDbJaALcSM9b8Wk218X+55T/zOzb7xoiB+BcX8yYuYayELImXJHIgL/c7nkAnHrwUCmbM97nRbCVVRvU0ku3Tr`} />
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        async function isgoogleenable() {
            setIsLoading(true);
            try {
                const { data } = await api.get('/isGoogleEnable');
                if (data.success) {
                    setIsGoogleEnable(data.isGoogleEnabled)
                    setAdminUpi(data.upi);
                }
            } catch (error) {
                setError(error.response.data);
            } finally {
                setIsLoading(false);
            }
        }
        isgoogleenable()
    }, [navigate]);

    const handleRadioChange = (type) => {
        setIsChecked(type);
    };
    return (
        <div className="max-w-md mx-auto bg-white">
            {
                isLoading && (
                    <div className='w-full flex justify-center mt-4 mb-4 py-4' style={{ height: 'calc(100vh - 100px)' }}>
                        <Spinner />
                    </div>)
            }
            <div>
                <div className='pr-4 pl-2 py-[16px] h-[74px] flex justify-between items-end'>
                    <div onClick={() => {
                        navigate(-1)
                    }} className='flex items-center gap-3'>
                        <GoArrowLeft className='text-[24px]' />
                        <div>
                            <span className='text-[12px]'>Step 3 of 3</span>
                            <h2 className="text-[17px] font-semibold text-[#212121]">
                                Payment
                            </h2>
                        </div>
                    </div>
                    <div className='bg-[#f5f5f5] text-[#424242] text-[12px] font-semibold flex items-center gap-1 px-1 rounded'><BiLockOpen className='' />
                        100% Secure</div>
                </div>
                <div className='px-4'>
                    <div className="mb-4 bg-[#f0f5ff] h-[49px] flex items-center w-full px-3 rounded-lg">
                        <div className="flex justify-between items-center w-full">
                            <div className='flex items-center gap-1'>
                                <span className="text-[#2a55e5] text-[14px]">Total Amount</span>
                            </div>
                            <span className="text-lg font-medium text-[#2a55e5]">{formatToINR(CartActualTotal(addToCart))}</span>
                        </div>
                    </div>
                    <div className="bg-green-100 p-2 rounded mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-[14px] font-semibold discount">10% instant discount</p>
                            <span className="text-[12px] text-[#108934]">Claim now with payment offers</span>
                        </div>
                        <div className='flex items-center'>
                            <div className='w-[36px] h-[36px] rounded-full bg-white flex justify-center items-center border-[3px] border-[#e7f8ec] z-10'>
                                <img src={Phonepay} alt='Phonepay' />
                            </div>
                            <div className='w-[36px] h-[36px] rounded-full bg-white flex justify-center items-center ml-[-6px] border-[3px] border-[#e7f8ec]'>
                                <img src={GooglePay} alt='GooglePay' />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={upi ? 'border-y-[#e0e0e0] border-y-[1px] bg-[#f5f5f5]' : 'border-y-[#e0e0e0] border-y-[1px] '}>
                        <div onClick={() => setUpi(!upi)} className='flex justify-between items-center p-4'>
                            <div className='flex items-center gap-3'>
                                <img src={UPI} alt='UPI' />
                                <p className='text-[14px] text-[#212121] font-medium'>UPI</p>
                            </div>
                            <IoIosArrowDown className={upi ? 'text-[#212121] rotate-180' : 'text-[#212121]'} />
                        </div>
                        {upi &&
                            <div className='bg-white rounded-lg m-4 mt-0'>
                                <div className='p-4 border-b-[#e0e0e0] border-b-[1px]'>
                                    <div className='flex justify-between items-center'>
                                        <div className='flex gap-3'>
                                            <input type="radio" id='googlepay' checked={isChecked === 'googlepay' ? true : false}
                                                onChange={() => handleRadioChange("googlepay")}
                                                className='w-[20px] h-[20px]' />
                                            <label htmlFor="googlepay" className='text-[14px] text-[#212121] font-medium'>Google Pay</label>
                                        </div>
                                        <img src={GooglePay} alt='GooglePay' />
                                    </div>
                                    {isChecked === 'googlepay' && <PayButton type={'googlepay'} />}
                                </div>
                                <div className='p-4 border-b-[#e0e0e0] border-b-[1px]'>
                                    <div className='flex justify-between items-center'>
                                        <div className='flex gap-3'>
                                            <input type="radio" id='phonepay' checked={isChecked === 'phonepay' ? true : false}
                                                onChange={() => handleRadioChange("phonepay")}
                                                className='w-[20px] h-[20px]' />
                                            <label htmlFor="phonepay" className='text-[14px] text-[#212121] font-medium'>PhonePe</label>
                                        </div>
                                        <img src={Phonepay} alt='Phonepay' />
                                    </div>
                                    {isChecked === 'phonepay' && <PayButton type={'phonepay'} />}
                                </div>
                                <div className='p-4 border-b-[#e0e0e0] border-b-[1px]'>
                                    <div className='flex justify-between items-center'>
                                        <div className='flex gap-3'>
                                            <input type="radio" id='upi' checked={isChecked === 'upi' ? true : false}
                                                onChange={() => handleRadioChange("upi")}
                                                className='w-[20px] h-[20px]' />
                                            <label htmlFor="upi" className='text-[14px] text-[#212121] font-medium'>Add new UPI ID</label>
                                        </div>
                                        <p className='text-[#2a55e5] text-[12px] font-semibold'>How to find?</p>
                                    </div>
                                    {isChecked === 'upi' && <PayButton type={'upi'} />}
                                </div>
                            </div>
                        }
                    </div>
                    <div className='opacity-70'>
                        <div className='flex justify-between items-center p-4'>
                            <div className='flex items-center gap-3'>
                                <CiCreditCard1 className='text-[24px]' />
                                <div>
                                    <p className='text-[14px] text-[#212121] font-medium'>Credit / Debit / ATM Card</p>
                                    <p className='text-[12px] text-[#ccc]'>This option is disable for this product.</p>
                                </div>
                            </div>
                            <IoIosArrowDown className='text-[#212121]' />
                        </div>
                        <div className='flex justify-between items-center p-4 border-y-[#e0e0e0] border-y-[1px]'>
                            <div className='flex items-center gap-3'>
                                <PiBankLight className='text-[24px]' />
                                <div>
                                    <p className='text-[14px] text-[#212121] font-medium'>Net Banking</p>
                                    <p className='text-[12px] text-[#ccc]'>This option is disable for this product.</p>
                                </div>
                            </div>
                            <IoIosArrowDown className='text-[#212121]' />
                        </div>
                        <div className='flex justify-between items-center p-4'>
                            <div className='flex items-center gap-3'>
                                <CiWallet className='text-[24px]' />
                                <div>
                                    <p className='text-[14px] text-[#212121] font-medium'>Wallets</p>
                                    <p className='text-[12px] text-[#ccc]'>This option is disable for this product.</p>
                                </div>
                            </div>
                            <IoIosArrowDown className='text-[#212121]' />
                        </div>
                        <div className='flex justify-between items-center p-4 border-y-[#e0e0e0] border-y-[1px]'>
                            <div className='flex items-center gap-3'>
                                <img src={Cash} alt='Cash' />
                                <div>
                                    <p className='text-[14px] text-[#212121] font-medium'>Cash on Delivery</p>
                                    <p className='text-[12px] text-[#ccc]'>This option is disable for this product.</p>
                                </div>
                            </div>
                            <IoIosArrowDown className='text-[#212121]' />
                        </div>
                        <div className='flex justify-between items-center p-4'>
                            <div className='flex items-center gap-3'>
                                <img src={Gift} alt='Gift' />
                                <div>
                                    <p className='text-[14px] text-[#212121] font-medium'>Have a Flipkart Gift Card?</p>
                                    <p className='text-[12px] text-[#ccc]'>This option is disable for this product.</p>
                                </div>
                            </div>
                            <a href="#" className='text-[#2a55e5] text-[12px] font-semibold'>Add</a>
                        </div>
                        <div className='flex justify-between items-center p-4 border-y-[#e0e0e0] border-y-[1px]'>
                            <div className='flex items-center gap-3'>
                                <img src={EMI} alt='EMI' />
                                <div>
                                    <p className='text-[14px] text-[#212121] font-medium'>EMI</p>
                                    <p className='text-[12px] text-[#ccc]'>This option is disable for this product.</p>
                                </div>
                            </div>
                            <div className='text-[#666] flex items-center gap-1'>
                                {/* <p className='text-[12px] font-medium'>Unavailable</p> */}
                                <HiOutlineQuestionMarkCircle />
                            </div>
                        </div>
                    </div>
                    <div className='pt-[32px] pb-[36px] flex justify-center items-center flex-col gap-1'>
                        <p className='text-[#9e9e9e] text-[17px] max-w-[182px] mx-auto text-center font-semibold'>35 Crore happy customers and counting!</p>
                        <CiFaceSmile className='text-[40px] text-[#9e9e9e]' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
