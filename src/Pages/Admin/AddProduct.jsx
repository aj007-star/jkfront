import React, { useEffect } from "react";
import { useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { FaCaretDown, FaExternalLinkSquareAlt } from "react-icons/fa";
import { RiExpandUpDownFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import {
  BsArrowsFullscreen,
  BsCloudUpload,
  BsTrash,
  BsUpload,
} from "react-icons/bs";
import { MdCloudUpload } from "react-icons/md";
import Sidebar from "../../Components/AdminComponents/Sidebar";
import { FaUser, FaLock, FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import api from "../../Utils/api";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import axios from "axios";
import Spinner from "../NotFoundPage/Spinner";

function AddProduct() {
  const navigate = useNavigate();

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const productId = query.get("productId");

  const Category = useSelector((state) => state.AllStore.categories);
  const [categories, setCategories] = useState(Category[0]);

  const [productName, setProductName] = useState();
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState(1);
  const [subprice, setSubPrice] = useState(1);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [rank, setRank] = useState(0);
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  async function getProductDetail() {
    try {
      if (productId) {
        setIsLoading(true);

        const { data } = await api.get(`/products/${productId}`);
        const productData = data.data;

        const selectedCategory = Category.find(
          (cat) => cat.id == productData.CategoryId
        );

        setProductName(productData.productName || "");
        setCategories(selectedCategory || "");
        setProductDescription(productData.productDescription || "");
        setPrice(productData.price || 1);
        setSubPrice(productData.subprice || 1);
        setStockQuantity(productData.stockQuantity || 0);
        // setProductImages(productImages || []);
        setSize(productData.size || "");
        setColor(productData.color || "");
        setRank(productData.rank || 0);
      }
    } catch (error) {
      const token = error?.response?.data?.token;
      if (token == false) {
        console.log("first");
        localStorage.removeItem("token");
        navigate("/admin");
      }
      setError(error.response.data);

      if (error?.response?.data?.success == false) {
        toast.error(error?.response?.data?.message);
      }
      console.log("Error in fetching products", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getProductDetail();
  }, [productId]);

  const [errors, setErrors] = useState({});

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + productImages.length > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImages((prevState) => [...prevState, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageDelete = (index) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    setProductImages(updatedImages);
  };

  function validate() {
    const errors = {};
    if (!productName) errors.productName = "ProductName is required";
    if (!price) errors.price = "Price is required";
    if (!subprice) errors.subprice = "Subprice is required";
    return errors;
  }

  const handlerAdd = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    AddProducts();
  };

  const AddProducts = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("productDescription", productDescription);
      formData.append("CategoryId", categories?.id);
      productImages.forEach((file, index) => {
        formData.append("files", file);
      });
      formData.append("price", price);
      formData.append("subprice", subprice);
      formData.append("stockQuantity", stockQuantity);
      formData.append("size", size);
      formData.append("color", color);
      formData.append("rank", rank);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success == true) {
        navigate("/admin/productlist");
        toast.success(data.message);
      }
    } catch (error) {
      console.log("Error in Product Adding", error.message);
      setError(error.response.data);

      const token = error?.response?.data?.token;
      if (token == false) {
        console.log("first");
        localStorage.removeItem("token");
        navigate("/admin");
      }
      if (error?.response?.data?.success == false) {
        toast.error(error?.response?.data?.message);
      }
      console.log("Error in Product Adding", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const EditProduct = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const data1 = {
        productName,
        productDescription,
        price,
        subprice,
        stockQuantity,
        size,
        color,
        rank,
      };
      const { data } = await api.put(`/products/${productId}`, data1, token);
      if (data.success == true) {
        navigate("/admin/productlist");
        toast.success(data.message);
      }
    } catch (error) {
      const token = error?.response?.data?.token;
      if (token == false) {
        console.log("first");
        localStorage.removeItem("token");
        navigate("/admin");
        setError(error.response.data);
      }
      if (error?.response?.data?.success == false) {
        toast.error(error?.response?.data?.message);
      }
      console.log("Error in updating", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlerEdit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    EditProduct();
  };

  console.log(productId);

  return (
    <>
      <Sidebar />
      <section>
        <main className="py-8 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            <h1 className="font-[700] text-[20px]">
              {productId ? "Edit" : "Add"} Product
            </h1>
            <form>
              <div className="space-y-12">
                <div className="">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Product Name
                      </label>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-300 sm:max-w-md">
                          <input
                            type="text"
                            placeholder="Iphone 12"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="block flex-1 border-0 bg-transparent p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          />
                        </div>
                        {errors.productName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.productName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Description
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="about"
                          name="about"
                          placeholder="Type here..."
                          rows={3}
                          value={productDescription}
                          className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6 outline-none"
                          onChange={(e) =>
                            setProductDescription(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    {console.log(productImages)}
                    {productImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group rounded-md overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Product"
                          className="w-full h-auto rounded-md border-2 border-gray-300 group-hover:opacity-50 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>
                        <div className="absolute bottom-2 left-[1.5rem] flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                          <button
                            type="button"
                            className="bg-white text-gray-500 rounded-full p-1"
                            onClick={() => handleImageDelete(index)}
                          >
                            <BsTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {productId === null && (
                      <div className="flex justify-center items-center col-span-1">
                        <div className="w-full max-w-xs flex flex-col items-center h-full">
                          <label className="relative w-full h-full image-class sm:h-[80px] xs:h-[60px] flex flex-col items-center justify-center border-2 border-gray-300 rounded-md bg-gray-100 hover:border-gray-300">
                            <input
                              type="file"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={handleImageUpload}
                              accept=".jpeg, .jpg, .png"
                              multiple
                            />
                            <div className="flex flex-col items-center justify-center">
                              <MdCloudUpload className="h-6 w-6 text-gray-500" />
                              <span className="mt-2 text-gray-500">Upload</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                    <div className="sm:col-span-3 gap-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Category
                      </label>
                      <div className="mt-2">
                        <Listbox
                          value={categories?.id}
                          onChange={setCategories}
                        >
                          <div className="relative mt-2">
                            <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:text-sm sm:leading-6">
                              <span className="block truncate">
                                {categories?.name}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <RiExpandUpDownFill
                                  aria-hidden="true"
                                  className="h-5 w-5 text-gray-400"
                                />
                              </span>
                            </ListboxButton>

                            <ListboxOptions
                              transition
                              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                            >
                              {Category.map((person) => (
                                <ListboxOption
                                  key={person?.id}
                                  value={person}
                                  className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-[#3069ea] data-[focus]:text-white"
                                >
                                  <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                    {person.name}
                                  </span>
                                </ListboxOption>
                              ))}
                            </ListboxOptions>
                          </div>
                        </Listbox>
                      </div>
                    </div>

                    <div className="sm:col-span-3 flex gap-2">
                      <div className="w-1/2">
                        <label
                          htmlFor="color"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Color
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="color"
                            name="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="relative w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:text-sm sm:leading-6"
                            placeholder="ex:- red, blue"
                          />
                        </div>
                      </div>

                      <div className="w-1/2">
                        <label
                          htmlFor="size"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Size
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="size"
                            name="size"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            className="relative w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:text-sm sm:leading-6"
                            placeholder="ex:- XS, SM, MD, LG, XL, XXl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-4 flex gap-2">
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Price(₹)
                        </label>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          <div className="rounded-md flex-1 min-w-[calc(50%-0.25rem)] shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-300 sm:max-w-md">
                            <input
                              type="number"
                              placeholder="Type here"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="block w-full border-0 bg-transparent p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        {errors.price && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.price}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="subprice"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Sub Price(₹)
                        </label>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          <div className="rounded-md flex-1 min-w-[calc(50%-0.25rem)] shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-300 sm:max-w-md">
                            <input
                              type="number"
                              placeholder="Type here"
                              value={subprice}
                              onChange={(e) => setSubPrice(e.target.value)}
                              className="block w-full border-0 bg-transparent p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        {errors.subprice && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.subprice}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="stockQuantity"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Stock Quantity
                        </label>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          <div className="rounded-md flex-1 min-w-[calc(50%-0.25rem)] shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-300 sm:max-w-md">
                            <input
                              type="number"
                              min="0"
                              placeholder="Type here"
                              value={stockQuantity}
                              onChange={(e) => setStockQuantity(e.target.value)}
                              className="block w-full border-0 bg-transparent p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="rank"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Rank
                        </label>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          <div className="rounded-md flex-1 min-w-[calc(50%-0.25rem)] shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-300 sm:max-w-md">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="Type here"
                              value={rank}
                              onChange={(e) => setRank(e.target.value)}
                              className="block w-full border-0 bg-transparent p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-start gap-x-6">
                {productId ? (
                  <button
                    type="submit"
                    onClick={handlerEdit}
                    disabled={isLoading} // Consider disabling the button during loading
                    className={` rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${
                      isLoading
                        ? "bg-gradient-to-r from-blue-300 via-yellow-200 to-blue-300 cursor-not-allowed"
                        : "bg-[#3069ea] hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" /> Please
                        wait...
                      </div>
                    ) : (
                      "Edit"
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={handlerAdd}
                    disabled={isLoading} // Consider disabling the button during loading
                    className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${
                      isLoading
                        ? "bg-gradient-to-r from-blue-300 via-yellow-200 to-blue-300 cursor-not-allowed"
                        : "bg-[#3069ea] hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" /> Please
                        wait...
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </button>
                )}
              </div>
            </form>
            {isLoading && (
              <div className="w-full flex justify-center mt-4 mb-4 py-4">
                <Spinner />
              </div>
            )}
            {error && <NoMoreProducts message={error.message} />}
          </div>
        </main>
      </section>
    </>
  );
}

export default AddProduct;
