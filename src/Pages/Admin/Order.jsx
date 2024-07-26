import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/AdminComponents/Sidebar';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import Spinner from '../NotFoundPage/Spinner';
import { useNavigate } from 'react-router-dom';

const Order = () => {
    const [data, setData] = useState([]);
    const token = localStorage.getItem('token');
    const [isLoading, setLoading] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/orders`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response.data.data);
                setData(response.data.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [token]);

    async function handlerDelete() {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/orders`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.data.message == "Order Deleted") {
                setData([])
                toast.success(response.data.message)
            }
        } catch (error) {
            const token = error?.response?.data?.token
            if (token == false) {
                localStorage.removeItem('token')
                navigate('/admin')
            }
            if (error?.response?.data?.success == false) {
                toast(error?.response?.data?.message)
            }
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Sidebar></Sidebar>
            <main className="py-8 lg:pl-72">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className='flex  justify-between'>

                        <h1 className='text-2xl font-medium'>Order Data</h1>
                        <button className="flex items-center text-white px-3 py-2 rounded-md border-2 bg-red-600 border-red-600 focus:outline-none focus:ring-opacity-75 text-sm"
                            onClick={handlerDelete}
                        ><MdDelete className='text-xl ' />
                            Delete All Orders
                        </button>
                    </div>
                    {isLoading && (
                        <div className='w-full flex justify-center mt-4 mb-4 py-4'>
                            <Spinner />
                        </div>
                    )}
                    <DynamicTable data={data} />

                </div>
            </main>
        </div>
    );
}

const DynamicTable = ({ data }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <p>No data available</p>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Order ID</th>
                        <th>Product Details</th>
                        <th>Total Amount</th>
                        <th>Customer Details</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((order, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>{order.orderId}</td>
                            <td>
                                {order.products.map((product, index) => (
                                    <div key={index}>
                                        <div><strong>Product Name:</strong> {product.productName}</div>
                                        <div><strong>Price:</strong> {product.price}</div>
                                        <div><strong>Size:</strong> {product.size}</div>
                                        <div><strong>Color:</strong> {product.color}</div>
                                        <div><strong>Quantity:</strong> {product.quantity}</div>
                                        <hr />
                                    </div>
                                ))}
                            </td>
                            <td>{order.totalAmount}</td>
                            <td>
                                <div><strong>City:</strong> {order.customerDetail.city}</div>
                                <div><strong>Phone Number:</strong> {order.customerDetail.phoneNumber}</div>
                                <div><strong>Full Name:</strong> {order.customerDetail.fullName}</div>
                                <div><strong>State:</strong> {order.customerDetail.state}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default Order;
