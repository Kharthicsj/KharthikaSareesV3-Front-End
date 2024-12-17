import React, { useState } from 'react';
import { RiCloseLargeLine } from "react-icons/ri";
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

const AddAddressPopup = ({ close, fetchData }) => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    fullname: "",
    addressName: "",
    type: "",
    phone: "",
    addressContent: "",
    state: "",
    pincode: "",
    email: "",
    landmark: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/add-new-address`,
        {
          ...data,
          address: [data]
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      toast.success("Successfully Uploaded User Data");
      fetchData();
      close();
    } catch (err) {
      console.log(err);
      toast.error("Failed to Upload the data, check Console");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed bg-slate-500 bg-opacity-15 w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      {(loading) && (
        <div className="absolute inset-0 z-50 flex justify-center items-center">
          <div className="bg-white bg-opacity-0 p-4">
            <Loading />
          </div>
        </div>
      )}

      <div className='p-4 bg-white w-full max-w-2xl h-full max-h-[80%] overflow-y-hidden'>
        <div className='text-2xl font-sans font-medium flex justify-center'>
          <h2>Add New Address</h2>
          <div className='w-fit ml-auto cursor-pointer hover:text-orange-500' onClick={close}>
            <RiCloseLargeLine />
          </div>
        </div>

        <form className='grid p-4 gap-3 overflow-y-scroll h-full'>

          <label htmlFor='fullname' className='font-semibold'>Full Name:</label>
          <input
            type='text'
            placeholder='Enter your full name'
            id='fullname'
            name='fullname'
            value={data.fullname}
            onChange={handleChange}
            className='p-2 border-black border-2'
            required
          />

          <label htmlFor='product-name' className='font-semibold'>Address/Building Name:</label>
          <input
            type='text'
            placeholder='Can be a Building name'
            id='addressName'
            name='addressName'
            value={data.addressName}
            onChange={handleChange}
            className='p-2 border-black border-2'
            required
          />

          <label htmlFor="type" className="font-semibold">Address Type:</label>
          <select
            id="type"
            name="type"
            value={data.type}
            onChange={handleChange}
            className="p-2 border-black border-2"
            required
          >
            <option value="">Select a type</option>
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor='phone' className='font-semibold'>Phone Number:</label>
          <input
            type='text'
            placeholder='+91 1234567890'
            id='phone'
            name='phone'
            value={data.phone}
            onChange={handleChange}
            className='p-2 border-black border-2'
            required
          />

          <label htmlFor='email' className='font-semibold'>Email:</label>
          <input
            type='text'
            placeholder='contact_mail@example.com'
            id='email'
            name='email'
            value={data.email}
            onChange={handleChange}
            className='p-2 border-black border-2'
            required
          />


          <label htmlFor='pincode' className='font-semibold'>Pincode:</label>
          <input
            type='number'
            placeholder='your pincode'
            id='pincode'
            name='pincode'
            value={data.pincode}
            onChange={handleChange}
            className='p-2 border-black border-2'
            required
          />

          <label htmlFor='addressContent' className='font-semibold'>Address:</label>
          <textarea
            className='border-2 border-black resize-none rounded h-24'
            placeholder='Please enter your full address here'
            name='addressContent'
            id='addressContent'
            value={data.addressContent}
            onChange={handleChange}
            required
          />

          <label htmlFor='state' className='font-semibold'>State:</label>
          <input
            className='p-2 border-black border-2'
            placeholder='Please enter your state'
            name='state'
            id='state'
            value={data.state}
            onChange={handleChange}
            required
          />

          <label htmlFor='landmark' className='font-semibold'>Landmark:</label>
          <input
            className='border-2 border-black resize-none rounded p-2'
            placeholder='near some building name'
            name='landmark'
            id='landmark'
            value={data.landmark}
            onChange={handleChange}
            required
          />

          <button className='bg-orange-500 px-2 py-3 mb-10 text-white hover:bg-red-700'
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin border-t-4 border-b-4 border-white w-6 h-6 rounded-full border-t-transparent mx-auto"></div>
            ) : (
              "Upload"
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddAddressPopup;
