import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserHome from '../../Components/UserComponents/UserHomePage/UserHome';
import Category from './Category/Category';
import ProductDetail from './ProductDetails/ProductDetail';
import { Address } from './Checkout/Address';
import OrderSummary from './Checkout/OrderSummay';
import Payment from './Checkout/Payment';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

const UserPage = () => {
    return (
        <Routes>
            <Route path="/" element={<UserHome />} />
            <Route path="/category" element={<Category />} />
            <Route path="/product-detail/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Address />} />
            <Route path="/order-summary" element={<OrderSummary />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default UserPage;


// this option is disable for this product