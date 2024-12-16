import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaCheck, FaTimes, FaTrashAlt } from "react-icons/fa";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import AddAddressPopup from "../pages/addAddressPopup";
import toast from "react-hot-toast";
import { MdCloudUpload } from "react-icons/md";
import imageTobase64 from "../components/imageTobase64";
import EditAddressPopup from "./EditAddressPopup";
import LoginGif from "../assets/User.gif"

const Account = () => {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const [editMode, setEditMode] = useState({
        name: false,
        phone: false,
        profilepic: false,
        address: null,
    });

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        profilepic: "",
        address: [],
    });

    const [tempData, setTempData] = useState({
        name: "",
        phone: "",
        profilepic: "",
        address: [],
    });

    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/account-details`,
                { withCredentials: true }
            );
            setUserData(response?.data?.data);
            setTempData(response?.data?.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleProfilePicSave = async (file) => {
        const image = await imageTobase64(file);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/update-profile-pic`,
                { profilepic: image },
                { withCredentials: true }
            );
            if (response.status === 200) {
                toast.success("Profile picture updated successfully");
                fetchUser();
            } else {
                toast.error("Failed to update profile picture");
            }
        } catch (err) {
            console.log(err);
            toast.error("An error occurred while updating profile picture");
        }

        setTempData({ ...tempData, profilepic: image });
        setEditMode({ ...editMode, profilepic: false });
    };


    const updateAccountDetails = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/update-account-details`,
                tempData,
                { withCredentials: true }
            );
            if (response.status === 200) {
                toast.success("Account details updated successfully");
                fetchUser();
                setEditMode({ name: false, phone: false, profilepic: false, address: null });
            } else {
                toast.error("Failed to update account details");
            }
        } catch (err) {
            console.log(err);
            toast.error("An error occurred while updating account details");
        }
    };

    const handleCancel = () => {
        setTempData({ ...userData });
        setEditMode({ name: false, phone: false, profilepic: false, address: null });
    };

    const deleteAddress = async (addressId) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/delete-address`, { addressId },
                { withCredentials: true }
            );
            if (response.status === 200) {
                toast.success("Address deleted successfully");
                fetchUser();
            } else {
                toast.error("Failed to delete address");
            }
        } catch (err) {
            console.log(err);
            toast.error("An error occurred while deleting address");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const ProfilePicEdit = ({ profilePic, onSave, onCancel }) => {
        const [file, setFile] = useState(null);
        const [preview, setPreview] = useState(profilePic);

        const handleImageChange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                const image = await imageTobase64(file);
                setFile(file);
                setPreview(image); // Update the preview image with base64 string
            }
        };

        const handleSave = () => {
            if (file) {
                onSave(file); // Save the file
            }
        };

        return (
            <div className="relative">
                <label htmlFor="uploadImageInput" className="block mt-3">
                    <div className="p-2 bg-slate-200 border h-72 w-72 flex justify-center items-center cursor-pointer rounded-full">
                        <div className="flex justify-center items-center flex-col gap-2">
                            <span className="text-4xl"><MdCloudUpload /></span>
                            <p className="text-sm">Upload Profile Picture</p>
                            <input
                                type="file"
                                id="uploadImageInput"
                                name="profileImage"
                                className="hidden"
                                onChange={handleImageChange}
                                required
                            />
                        </div>
                        {preview && (
                            <img
                                src={preview}
                                alt="Selected Profile Pic"
                                className="absolute top-0 left-0 w-full h-full object-cover rounded-full"
                            />
                        )}
                    </div>
                </label>
                {file && (
                    <div className="absolute bottom-2 left-2 flex gap-2">
                        <button onClick={handleSave} className="text-green-500">
                            <FaCheck />
                        </button>
                        <button onClick={onCancel} className="text-red-500">
                            <FaTimes />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            {open && (
                <div className="absolute top-0 left-0 right-0 z-50">
                    <AddAddressPopup close={() => setOpen(false)} fetchData={fetchUser} />
                </div>
            )}

            <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 relative">
                <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
                        {/* Profile Picture */}
                        <div className="relative">
                            {!editMode.profilepic ? (
                                <>
                                    <img
                                        src={userData.profilepic || LoginGif}
                                        alt="Profile"
                                        className="w-48 h-48 sm:w-72 sm:h-72 rounded-full object-cover border-4 border-gray-300"
                                    />
                                    <button
                                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
                                        aria-label="Edit Profile Picture"
                                        onClick={() => setEditMode({ ...editMode, profilepic: true })}
                                    >
                                        <FaPencilAlt className="text-gray-600" />
                                    </button>
                                </> 
                            ) : (
                                <ProfilePicEdit
                                    onSave={handleProfilePicSave}
                                    onCancel={() => setEditMode({ ...editMode, profilepic: false })}
                                />
                            )}
                        </div>

                        {/* User Details */}
                        <div className="flex-grow w-full lg:w-auto flex flex-col gap-6 mt-10">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                    Name
                                </label>
                                <div className="flex items-center gap-4">
                                    {!editMode.name ? (
                                        <>
                                            <input
                                                type="text"
                                                value={userData.name}
                                                readOnly
                                                className="w-full border-b border-gray-400 bg-transparent focus:outline-none text-gray-600"
                                            />
                                            <FaPencilAlt
                                                className="text-gray-500 cursor-pointer"
                                                onClick={() => setEditMode({ ...editMode, name: true })}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                type="text"
                                                value={tempData.name}
                                                onChange={(e) =>
                                                    setTempData({ ...tempData, name: e.target.value })
                                                }
                                                className="w-full border-b border-gray-400 focus:outline-none text-gray-600"
                                            />
                                            <FaCheck
                                                className="text-green-500 cursor-pointer"
                                                onClick={updateAccountDetails}
                                            />
                                            <FaTimes
                                                className="text-red-500 cursor-pointer"
                                                onClick={handleCancel}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="cursor-not-allowed">
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={userData.email}
                                    readOnly
                                    className="w-full border-b border-gray-400 bg-transparent focus:outline-none text-gray-600 cursor-not-allowed"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                    Phone
                                </label>
                                <div className="flex items-center gap-4">
                                    {!editMode.phone ? (
                                        <>
                                            <PhoneInput
                                                international
                                                defaultCountry="US"
                                                value={userData.phone}
                                                onChange={(value) => setTempData({ ...tempData, phone: value })}
                                                className="w-full border-b border-gray-400 bg-transparent focus:outline-none text-gray-600"
                                                readOnly
                                            />
                                            <FaPencilAlt
                                                className="text-gray-500 cursor-pointer"
                                                onClick={() => setEditMode({ ...editMode, phone: true })}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <PhoneInput
                                                international
                                                defaultCountry="US"
                                                value={tempData.phone}
                                                onChange={(value) =>
                                                    setTempData({ ...tempData, phone: value })
                                                }
                                                className="w-full border-b border-gray-400 focus:outline-none text-gray-600"
                                            />
                                            <FaCheck
                                                className="text-green-500 cursor-pointer"
                                                onClick={updateAccountDetails}
                                            />
                                            <FaTimes
                                                className="text-red-500 cursor-pointer"
                                                onClick={handleCancel}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Addresses Section */}
                    <div className="mt-12">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">My Addresses</h2>
                        <div className="grid gap-6">
                            {userData.address && userData.address.length > 0 ? (
                                userData.address.map((address, index) => (
                                    <div key={index} className="relative bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                                        {editOpen && editOpen.id === address._id && (
                                            <div className="absolute top-0 left-0 right-0 z-50">
                                                <EditAddressPopup
                                                    close={() => setEditOpen(null)}
                                                    fetchData={fetchUser}
                                                    userData={{
                                                        addressName: address.addressName || "",
                                                        type: address.type || "",
                                                        fullname: address.fullname || "",
                                                        phone: address.phone || "",
                                                        addressContent: address.addressContent || "",
                                                        pincode: address.pincode || "",
                                                        email: address.email || "",
                                                        landmark: address.landmark || "",
                                                    }}
                                                    id={address._id}
                                                />
                                            </div>
                                        )}
                                        <FaPencilAlt
                                            className="absolute top-2 right-2 text-gray-500 cursor-pointer"
                                            aria-label="Edit Address"
                                            onClick={() => setEditOpen({ id: address._id, data: address })}
                                        />
                                        <FaTrashAlt
                                            className="absolute top-2 right-10 text-red-600 cursor-pointer"
                                            aria-label="Delete Address"
                                            onClick={() => deleteAddress(address._id)}
                                        />
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                                            {address.addressName} ({address.type})
                                        </h3>
                                        <p className="text-gray-600">
                                            <strong>Full Name:</strong> {address.fullname}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Phone:</strong> {address.phone}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Address:</strong> {address.addressContent}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Pincode:</strong> {address.pincode}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Email:</strong> {address.email}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Landmark:</strong> {address.landmark}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">No addresses found.</div>
                            )}
                        </div>

                        <div className="flex justify-center align-middle">
                            <button
                                className="p-2 mt-6 bg-blue-500 rounded-lg text-white"
                                onClick={() => setOpen(true)}
                            >
                                + Add address
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
