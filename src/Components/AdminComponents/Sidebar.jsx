import React from 'react'

import { useState } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
} from '@headlessui/react'
import { IoCartOutline, IoClose } from "react-icons/io5";
import { HiMiniPaintBrush } from "react-icons/hi2";
import { FaBars, FaBell } from "react-icons/fa";
import { MdDashboard, MdLocalOffer, MdPeople } from "react-icons/md";
import { FaChartSimple, FaChevronDown, FaMagnifyingGlass, FaMoneyCheck } from 'react-icons/fa6';
import { IoMdSettings, IoMdSunny } from 'react-icons/io';
import { BiSolidComment } from 'react-icons/bi';
import { AiOutlineGlobal } from 'react-icons/ai';
import { HiTemplate } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { RiAdminFill } from 'react-icons/ri';

const navigation = [
    { name: 'Dashboard', href: '/admin/productlist', icon: MdDashboard, current: false },
    { name: 'Products', href: '/admin/productlist', icon: HiTemplate, current: false, submenu: [{ name: 'Add Product', href: '/admin/add-product' }, { name: 'Product list', href: '#' }, { name: 'Categories', href: '#' }, { name: 'Brands', href: '#' }] },
    { name: 'Orders', href: '/admin/order', icon: IoCartOutline, current: false },
    { name: 'AdminDetail', href: '/admin/detail', icon: RiAdminFill, current: false },
    { name: 'Customers', href: '#', icon: MdPeople, current: false, submenu: [{ name: 'All Customers', href: '#' }, { name: 'Add Customer', href: '#' }] },
    { name: 'Statistics', href: '#', icon: FaChartSimple, current: false },
    { name: 'Review', href: '#', icon: BiSolidComment, current: false },
    { name: 'Transaction', href: '#', icon: FaMoneyCheck, current: false },
    { name: 'Sellers', href: '#', icon: AiOutlineGlobal, current: false },
    { name: 'Hot offers', href: '#', icon: MdLocalOffer, current: false },
    { name: 'Appearance', href: '#', icon: HiMiniPaintBrush, current: false },
    { name: 'Settings', href: '#', icon: IoMdSettings, current: false },
]
const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [dropdown, setDropdown] = useState({});

    const toggleDropdown = (name) => {
        setDropdown((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <div>
            <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                />

                <div className="fixed inset-0 flex">
                    <DialogPanel
                        transition
                        className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                    >
                        <TransitionChild>
                            <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                    <span className="sr-only">Close sidebar</span>
                                    <IoClose aria-hidden="true" className="h-6 w-6 text-white" />
                                </button>
                            </div>
                        </TransitionChild>
                        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                            <div className="flex h-16 shrink-0 items-center">
                                <img
                                    alt="Your Company"
                                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                    className="h-8 w-auto"
                                />
                            </div>
                            <nav className="flex flex-1 flex-col">
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <React.Fragment key={item.name}>
                                            <li>
                                                <Link
                                                    to={item.href}
                                                    onClick={() => item.submenu && toggleDropdown(item.name)}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-[#e8f0fd] text-[#3069ea]'
                                                            : 'text-gray-700 hover:bg-[#e8f0fd] hover:text-[#3069ea]',
                                                        'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6',
                                                    )}
                                                >
                                                    <item.icon
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            item.current ? 'text-[#3069ea]' : 'text-gray-400 group-hover:text-[#3069ea]',
                                                            'h-6 w-6 shrink-0',
                                                        )}
                                                    />
                                                    {item.name}
                                                    {item.submenu && (
                                                        <FaChevronDown
                                                            className={classNames(
                                                                dropdown[item.name] ? 'text-[#3069ea]' : 'text-gray-400 group-hover:text-[#3069ea]',
                                                                'ml-auto h-5 w-5 shrink-0'
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </Link>
                                                {item.submenu && dropdown[item.name] && (
                                                    <ul className="ml-6 mt-1 space-y-1">
                                                        {item.submenu.map((submenuItem) => (
                                                            <li key={submenuItem.name}>
                                                                <Link
                                                                    to={submenuItem.href}
                                                                    className="text-gray-700 hover:bg-[#e8f0fd] hover:text-[#3069ea] group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                                                >
                                                                    {submenuItem.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        </React.Fragment>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog >

            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col" >
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                        <img
                            alt="Your Company"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            className="h-8 w-auto"
                        />
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                to={item.href}
                                                className={classNames(
                                                    item.current
                                                        ? 'bg-[#e8f0fd] text-[#3069ea]'
                                                        : 'text-gray-700 hover:bg-[#e8f0fd] hover:text-[#3069ea]',
                                                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                                )}
                                            >
                                                <item.icon
                                                    aria-hidden="true"
                                                    className={classNames(
                                                        item.current ? 'text-[#3069ea]' : 'text-gray-400 group-hover:text-[#3069ea]',
                                                        'h-6 w-6 shrink-0',
                                                    )}
                                                />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div >


            {/* ------------------------------ desktop sidebar ---------------------------- */}
            <div className="lg:pl-72" >
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
                        <span className="sr-only">Open sidebar</span>
                        <FaBars aria-hidden="true" className="h-6 w-6" />
                    </button>

                    {/* Separator */}
                    <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <form action="#" method="GET" className="relative flex flex-1">
                            <label htmlFor="search-field" className="sr-only">
                                Search
                            </label>
                            <FaMagnifyingGlass
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                            />
                            <input
                                id="search-field"
                                name="search"
                                type="search"
                                placeholder="Search..."
                                className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                            />
                        </form>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                <span className="sr-only">View notifications</span>
                                <IoMdSunny aria-hidden="true" className="h-6 w-6" />
                            </button>
                            <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                <span className="sr-only">View notifications</span>
                                <FaBell aria-hidden="true" className="h-6 w-6" />
                            </button>

                            {/* Separator */}
                            <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                            {/* Profile dropdown */}
                            <Menu as="div" className="relative">
                                <MenuButton className="-m-1.5 flex items-center p-1.5">
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        alt=""
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        className="h-8 w-8 rounded-full bg-[#e8f0fd]"
                                    />
                                    <span className="hidden lg:flex lg:items-center">
                                        <FaChevronDown aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400" />
                                    </span>
                                </MenuButton>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    {userNavigation.map((item) => (
                                        <MenuItem key={item.name}>
                                            <a
                                                href={item.href}
                                                className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-[#e8f0fd]"
                                            >
                                                {item.name}
                                            </a>
                                        </MenuItem>
                                    ))}
                                </MenuItems>
                            </Menu>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default Sidebar
