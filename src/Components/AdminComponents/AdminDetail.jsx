import Sidebar from './Sidebar'
import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';
import api from '../../Utils/api';

export default function AdminDetail() {



    const [formData, setFormData] = useState({
        isGoogleEnabled: '',
        facebookPixelId: '',
        googlePixelId: '',
        username: '',
        upi: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [AdminId, setAdminId] = useState(1);


    const validate = () => {
        const errors = {};

        if (formData.isGoogleEnabled === '') {
            errors.isGoogleEnabled = 'Please select an option.';
        }
        if (!formData.facebookPixelId) {
            errors.facebookPixelId = 'Facebook Pixel ID is required.';
        }
        if (!formData.googlePixelId) {
            errors.googlePixelId = 'Google Pixel ID is required.';
        }
        if (!formData.username) {
            errors.username = 'Username is required.';
        }
        if (!formData.upi) {
            errors.upi = 'UPI is required.';
        }

        return errors;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true);

            // Simulate a network request
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setIsSubmitting(false);

            alert('Form submitted successfully!');
        }
    };

    const fetchAdminDetail = async () => {
        try {
            const { data } = await api.get('/adminDetail');
            if (data.success) {
                const newObj = {
                    isGoogleEnabled: data.isGoogleEnabled ? 'yes' : 'no',
                    facebookPixelId: data.facebookPixelId,
                    googlePixelId: data.googlePixelId,
                    username: data.username,
                    upi: data.upi,
                }
                setAdminId(data.adminId);
                setFormData(newObj);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        fetchAdminDetail()
    }, []);


    const updateAdminDetail = async () => {
        const updateObj = {
            ...formData,isGoogleEnabled:formData.isGoogleEnabled==='yes'?true:false
        }
        try {
            const { data } = await api.put(`/admin/${AdminId}`,updateObj);
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <>
            <Sidebar />
            <section>
                <main className="py-8 lg:pl-72">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <h1 className='font-[700] text-[20px]'>Admin Detail Page</h1>
                        <div className="max-w-md mx-auto mt-10 p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Is Google Enabled?</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="isGoogleEnabled"
                                                value='yes'
                                                checked={formData.isGoogleEnabled === 'yes'}
                                                onChange={handleChange}
                                                className="form-radio text-blue-600"
                                            />
                                            <span className="ml-2">Yes</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="isGoogleEnabled"
                                                value='no'
                                                checked={formData.isGoogleEnabled === 'no'}
                                                onChange={handleChange}
                                                className="form-radio text-blue-600"
                                            />
                                            <span className="ml-2">No</span>
                                        </label>
                                    </div>
                                    {errors.isGoogleEnabled && <p className="text-red-500 text-xs mt-1">{errors.isGoogleEnabled}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">Facebook Pixel ID</label>
                                    <input
                                        type="text"
                                        name="facebookPixelId"
                                        value={formData.facebookPixelId}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                    {errors.facebookPixelId && <p className="text-red-500 text-xs mt-1">{errors.facebookPixelId}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">Google Pixel ID</label>
                                    <input
                                        type="text"
                                        name="googlePixelId"
                                        value={formData.googlePixelId}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                    {errors.googlePixelId && <p className="text-red-500 text-xs mt-1">{errors.googlePixelId}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">UPI</label>
                                    <input
                                        type="text"
                                        name="upi"
                                        value={formData.upi}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                    {errors.upi && <p className="text-red-500 text-xs mt-1">{errors.upi}</p>}
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        onClick={()=>updateAdminDetail()}
                                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && <FaSpinner className="mr-2 animate-spin" />}
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </section>
        </>
    )
}
