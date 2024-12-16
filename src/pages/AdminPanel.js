import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { LiaUserCheckSolid } from "react-icons/lia";
import { Link, Outlet, useNavigate } from 'react-router-dom';


const AdminPanel = () => {

  const userData = useSelector((state) => state?.user?.user)
  const nav = useNavigate();

  useEffect(() => {
    if (userData?.data?.role !== "admin") {
      nav('/')
    }
  }, [userData, nav])

  return (
    <div className='min-h-[calc(100vh)] md:flex hidden'>
      <aside className='bg-orange-500 min-h-full w-full max-w-80 shadow-2xl text-white'>
        <div className='h-32 flex justify-center items-center flex-col mt-6'>
          <div className="text-4xl cursor-pointer flex justify-center items-center">
            {userData?.data?.profilepic ? (
              <img
                src={userData?.data?.profilepic}
                alt="profile-pic"
                className="w-24 h-24 rounded-full mt-6"
              />
            ) : (
              <LiaUserCheckSolid />
            )}
          </div>
          <p className='capitalize font-poppins font-light text-xl p-1'>{userData?.data?.name}</p>
          <p className='capitalize font-poppins'>{userData?.data?.role}</p>
        </div>
        <div className='mt-12'>
          <nav className='grid text-lg p-8 gap-5'>
            <Link to={"dashboard"} className='px-2 py-1 hover:bg-white hover:text-black text-white'>Dashboard</Link>
            <Link to={"all-users"} className='px-2 py-1 hover:bg-white hover:text-black text-white'>All Users</Link>
            <Link to={"products"} className='px-2 py-1 hover:bg-white hover:text-black text-white'>Products</Link>
            <Link to={"out-of-stock"} className='px-2 py-1 hover:bg-white hover:text-black text-white'>Out of Stock</Link>
            <Link to={"banner"} className='px-2 py-1 hover:bg-white hover:text-black text-white'>Banner Image</Link>
            <Link to={"all-orders"} className='px-2 py-1 hover:bg-white hover:text-black text-white'>All Orders</Link>
          </nav>
        </div>

      </aside>

      <main className='w-full h-full p-2'>
        <Outlet />
      </main>

    </div>
  )
}

export default AdminPanel