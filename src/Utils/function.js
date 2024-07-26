export function calculateDiscountPercentage(actualPrice, sellingPrice) {
  if (actualPrice <= 0) {
    throw new Error('Actual price must be greater than 0.');
  }
  if (sellingPrice < 0) {
    throw new Error('Selling price cannot be negative.');
  }
  if (sellingPrice > actualPrice) {
    throw new Error('Selling price cannot be greater than the actual price.');
  }

  const discount = actualPrice - sellingPrice;
  const discountPercentage = (discount / actualPrice) * 100;

  return discountPercentage.toFixed(0);
}

export function generateRandomNumber(min, max) {
  if (min > max) {
    throw new Error('Minimum value cannot be greater than the maximum value.');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatToINR(price, style = 'currency') {
  if (typeof price !== 'number') {
    return 'Invalid input';
  }

  return price.toLocaleString('en-IN', {
    style: style,
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}


export function formatDate(date) {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
    (day % 10 === 2 && day !== 12) ? 'nd' :
      (day % 10 === 3 && day !== 13) ? 'rd' : 'th';

  return `${day}${suffix} ${month}`;
}

export function getFutureDate(days = 2) {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return formatDate(now);
}


export function CartTotal (addToCart){
  const totalPrice = addToCart.reduce((total, product) => {
    const price = Number(product.price) || 0;
    const quantity = Number(product.quantity) || 1;
    return total + price * quantity;
  }, 0);
  return totalPrice;
}

export function calculateTotalPriceDifference (addToCart) {
  const totalPrice = addToCart.reduce((total, product) => total + (Number(product.price) || 0) * (Number(product.quantity) || 1), 0);
  const totalSubprice = addToCart.reduce((total, product) => total + (Number(product.subprice) || 0) * (Number(product.quantity) || 1), 0);
  return totalPrice - totalSubprice;
};

export function CartActualTotal (addToCart){
  const totalPrice = addToCart.reduce((total, product) => {
    const price = Number(product.subprice) || 0;
    const quantity = Number(product.quantity) || 1;
    return total + price * quantity;
  }, 0);
  return totalPrice;
}