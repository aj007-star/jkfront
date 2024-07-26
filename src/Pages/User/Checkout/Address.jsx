import React, { useEffect, useState } from 'react';
import { FaBuilding, FaHome } from 'react-icons/fa';
import { GoArrowLeft } from 'react-icons/go';
import { MdOutlineMyLocation } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUserAddress } from '../../../ReduxToolKit/AllSlice';

export const Address = () => {
    const [selected, setSelected] = useState('Home');
    const dispatch = useDispatch();
    const userAddress = useSelector(state => state.AllStore.userAddress);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        pincode: '',
        state: '',
        city: '',
        house: '',
        road: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (userAddress) {
            setFormData(userAddress)
            setSelected(userAddress.type)
        }
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;
    
        // Define the required fields
        const requiredFields = [
            'fullName',
            'phoneNumber',
            'pincode',
            'state',
            'city',
            'house',
            'road'
        ];
    
        requiredFields.forEach(field => {
            if (formData.hasOwnProperty(field)) {
                if (!formData[field].trim()) {
                    errors[field] = 'This field is required';
                    isValid = false;
                } else {
                    errors[field] = '';
                }
            } else {
                errors[field] = 'Field does not exist';
                isValid = false;
            }
        });
    
        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const address = { ...formData, type: selected == undefined ? "Home" : selected };
            dispatch(addUserAddress(address));
            navigate('/order-summary');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white">
            <div className="px-4 shadow-[0_4px_8px_-8px]">
                <h2 onClick={() => navigate(-1)} className="flex items-center gap-3 text-[16px] font-normal h-[52px] mb-2">
                    <GoArrowLeft className="text-[24px]" /> Add delivery address
                </h2>
                <div className="flex flex-col pb-3 px-4">
                    <div className="flex items-center gap-3 px-[11px]">
                        <div className="bg-[#2874f0] min-w-[19px] h-[19px] rounded-full flex justify-center items-center text-[12px] text-white font-semibold">1</div>
                        <div className="bg-[#dbdbdb] w-full h-[2px]"></div>
                        <div onClick={()=>navigate('/order-summary')} className="text-[#2874f0] border-[#2874f0] border-[1px] min-w-[19px] h-[19px] rounded-full flex justify-center items-center text-[12px] font-semibold">2</div>
                        <div className="bg-[#dbdbdb] w-full h-[2px]"></div>
                        <div className="text-[#2874f0] border-[#2874f0] border-[1px] min-w-[19px] h-[19px] rounded-full flex justify-center items-center text-[12px] font-semibold">3</div>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-[12px] whitespace-nowrap">Address</p>
                        <p className="text-[12px] whitespace-nowrap">Order Summary</p>
                        <p className="text-[12px] whitespace-nowrap">Payment</p>
                    </div>
                </div>
            </div>
            <div className="px-4 pt-6">
                <div>
                    <div className="mb-3">
                        <label className="block text-[12px] font-medium text-[#878787]">Full Name (Required)</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full p-2 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md text-[14px] text-[#212121]`}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-[12px] font-medium text-[#878787]">Phone number (Required)</label>
                        <input
                            type="number"
                            minLength={10}
                            maxLength={10}
                            name="phoneNumber"
                            inputMode='numeric'
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full p-2 border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md text-[14px] text-[#212121]`}
                            required
                        />
                    </div>
                    <div className="flex items-end gap-3 mb-3">
                        <div className="w-1/2">
                            <label className="block text-[12px] font-medium text-[#878787]">Pincode (Required)</label>
                            <input
                                type="text"
                                name="pincode"
                                minLength={6}
                                inputMode='numeric'
                                value={formData.pincode}
                                onChange={handleInputChange}
                                className={`flex-grow mt-1 block w-full p-2 border ${formErrors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-md text-[14px] text-[#212121]`}
                                required
                            />
                        </div>
                        <button className="px-2 py-2 gap-2 bg-[#2874f0] text-white text-[14px] rounded-md flex items-center justify-center w-1/2">
                            <MdOutlineMyLocation className="text-white text-[18px]" /> Use my location
                        </button>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1/2">
                            <label className="block text-[12px] font-medium text-[#878787]">State (Required)</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full p-2 border ${formErrors.state ? 'border-red-500' : 'border-gray-300'} rounded-md text-[14px] text-[#212121]`}
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-[12px] font-medium text-[#878787]">City (Required)</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full p-2 border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-md text-[14px] text-[#212121]`}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="block text-[12px] font-medium text-[#878787]">House No., Building Name (Required)</label>
                        <input
                            type="text"
                            name="house"
                            value={formData.house}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full p-2 border ${formErrors.house ? 'border-red-500' : 'border-gray-300'} rounded-md text-[14px] text-[#212121]`}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-[12px] font-medium text-[#878787]">Road name, Area, Colony (Required)</label>
                        <input
                            type="text"
                            name="road"
                            value={formData.road}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full p-2 border ${formErrors.road ? 'border-red-500' : 'border-gray-300'} rounded-md text-[14px] text-[#212121]`}
                            required
                        />
                    </div>
                    <div className="mt-3">
                        <button className="text-[#2874f0] text-[12px] font-medium">+ Add Nearby Famous Shop/Mall/Landmark</button>
                    </div>
                    <p className="text-[#878787] text-[12px] mt-3 pb-2">Type of address</p>
                    <div className="flex space-x-4 mb-3">
                        <button
                            onClick={() => setSelected('Home')}
                            className={`${selected === 'Home' ? 'border border-[#2874f0] text-[#2874f0]' : 'border border-[#dbdbdb] text-black'} flex items-center px-4 py-2 rounded-[16px] h-[32px] text-[14px]`}
                        >
                            <FaHome className={`${selected === 'Home' ? 'text-[#2874f0]' : 'text-[#646464]'} mr-2 text-[18px]`} />
                            Home
                        </button>
                        <button
                            onClick={() => setSelected('Work')}
                            className={`${selected === 'Work' ? 'border border-[#2874f0] text-[#2874f0]' : 'border border-[#dbdbdb] text-black'} flex items-center px-4 py-2 rounded-[16px] h-[32px] text-[14px]`}
                        >
                            <FaBuilding className={`${selected === 'Work' ? 'text-[#2874f0]' : 'text-[#646464]'} mr-2 text-[18px]`} />
                            Work
                        </button>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-[#ff5800] text-white text-[14px] w-full py-3 px-3 rounded-md"
                    >
                        Save and Deliver Here
                    </button>
                </div>
            </div>
        </div>
    );
};
