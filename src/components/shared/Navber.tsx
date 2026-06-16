import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import logo from "../../assets/logo/logo.png";
import Image from "next/image";

const Navber = () => {
  const NavItems = (
    <>
      <li className="border border-transparent hover:bg-[#FFECDB] hover:border-amber-600 rounded transition-all">
        <Link href="/" className="block px-4 py-2">
          হোম
        </Link>
      </li>
      <li className="border border-transparent hover:bg-[#FFECDB] hover:border-amber-600 rounded transition-all">
        <Link href="/" className="block px-4 py-2">
          আমাদের সম্পর্কে
        </Link>
      </li>
      <li className="border border-transparent hover:bg-[#FFECDB] hover:border-amber-600 rounded transition-all">
        <Link href="/" className="block px-4 py-2">
          কোর্স সমূহ
        </Link>
      </li>
      <li className="border border-transparent hover:bg-[#FFECDB] hover:border-amber-600 rounded transition-all">
        <Link href="/" className="block px-4 py-2">
          শিক্ষম মন্ডলী
        </Link>
      </li>
      <li className="border border-transparent hover:bg-[#FFECDB] hover:border-amber-600 rounded transition-all">
        <Link href="/" className="block px-4 py-2">
          মতামত
        </Link>
      </li>
      <li className="border border-transparent hover:bg-[#FFECDB] hover:border-amber-600 rounded transition-all">
        <Link href="/" className="block px-4 py-2">
          সংবাদ
        </Link>
      </li>
      <li className="border border-transparent hover:bg-[#FFECDB] hover:border-amber-600 rounded transition-all">
        <Link href="/" className="block px-4 py-2">
          যোগাযোগ
        </Link>
      </li>
    </>
  );
  return (
    <div className="navbar shadow-sm bg-white px-4">
      {/* ১. বাম পাশে শুধু লোগো থাকবে */}
      <div className="navbar-start gap-2">
        <Image
          src={logo}
          alt="bright academic school"
          style={{
            width: "70px",
            height: "70px",
          }}
        />
        <h1 className="text-[#F68319] text-[14px] font-semibold">
          ব্রাইট একাডেমিক কেয়ার
        </h1>
      </div>

      {/* বড় স্ক্রিনের জন্য মিডল মেনু */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1">{NavItems}</ul>
      </div>

      {/* ২. ডান পাশে বাটন এবং বার্গার মেনু থাকবে */}
      <div className="navbar-end gap-2">
        {/* বড় স্ক্রিনে বাটনটি আলাদা দেখাবে */}
        <Link
          href="/"
          className="btn bg-[#F68319] hover:bg-[#e07210] hidden sm:inline-flex items-center pl-4 pr-2 gap-2 border-0 rounded-[8px] text-white font-medium transition-all"
        >
          <span className="text-[16px] capitalize">Login</span>

          {/* ডানপাশের আইকন বক্স */}
          <span className="bg-[#da7210] p-2 rounded-[8px] inline-flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </span>
        </Link>

        <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow-lg"
          >
            {NavItems}
            {/* মোবাইল স্ক্রিনে বাটনটি বার্গার মেনুর ভেতরে নিচে দেখাবে */}
            <div className="pt-2 mt-2 border-t border-gray-100 sm:hidden">
              <Link
                href="/"
                className="btn btn-primary btn-sm w-full text-center bg-[#F68319] border-0 rounded-xl"
              >
                login
              </Link>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navber;
