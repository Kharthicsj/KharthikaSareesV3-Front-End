import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import { RiCloseLargeLine } from 'react-icons/ri';
import imageTobase64 from '../../components/imageTobase64';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const BannerEditPopup = ({ close, bannerData, fetchData }) => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [activeStatus, setActiveStatus] = useState('');
    const [screenType, setScreenType] = useState('mobile');
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (bannerData) {
            setName(bannerData.name || '');
            setActiveStatus(bannerData.active ? 'yes' : 'no');
            setScreenType(bannerData.screen || 'mobile');
            setImagePreview(bannerData.banner || null);
        }
    }, [bannerData]);

    const handleUploadPic = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageBase64 = await imageTobase64(file);
            setImage(imageBase64);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImageRemove = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();

        const updatedBanner = {
            _id: bannerData._id, 
            name,
            banner: image || bannerData.banner,
            active: activeStatus === 'yes',
            screen: screenType,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/edit-banner`,
                updatedBanner,
                { withCredentials: true }
            );

            if (response.data.success) {
                close(); 
                fetchData(); 
            } else {
                toast.error(response.data.message || 'Failed to update banner.');
            }
        } catch (error) {
            console.error('Error updating banner:', error);
            alert('An error occurred while updating the banner.');
        } finally {
            setLoading(false);
            toast.success("Banner Edited Successfully")
        }
    };

    if(loading) {
        return(
            <Loading />
        )
    }

    return (
        <div className="fixed bg-slate-500 bg-opacity-15 w-full h-full top-0 left-0 flex justify-center items-center">
            <div className="p-4 bg-white w-full max-w-lg h-full max-h-[80%] overflow-y-auto">
                <div className="text-2xl font-sans font-medium flex justify-center">
                    <h2>Edit Banner</h2>
                    <div className="w-fit ml-auto cursor-pointer hover:text-orange-500" onClick={close}>
                        <RiCloseLargeLine />
                    </div>
                </div>

                <form className="grid p-4 gap-3" onSubmit={handleSubmit}>
                    <label htmlFor="name" className="font-semibold">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter banner name"
                        className="p-2 border-black border-2"
                        required
                    />

                    <label htmlFor="activeStatus" className="font-semibold">
                        Active:
                    </label>
                    <select
                        id="activeStatus"
                        value={activeStatus}
                        onChange={(e) => setActiveStatus(e.target.value)}
                        className="p-2 border-black border-2"
                        required
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>

                    <label htmlFor="screenType" className="font-semibold">
                        Screen Type:
                    </label>
                    <select
                        id="screenType"
                        value={screenType}
                        onChange={(e) => setScreenType(e.target.value)}
                        className="p-2 border-black border-2"
                        required
                    >
                        <option value="mobile">Mobile</option>
                        <option value="computer">Computer</option>
                    </select>

                    <label htmlFor="bannerImage" className="font-semibold">
                        Banner Image:
                    </label>
                    {imagePreview ? (
                        <div className="relative w-32 h-32">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover border-2"
                            />
                            <div
                                className="absolute top-1 right-1 p-1 text-white bg-orange-500 rounded-full cursor-pointer"
                                onClick={handleImageRemove}
                            >
                                <MdDelete />
                            </div>
                        </div>
                    ) : (
                        <label
                            htmlFor="uploadImageInput"
                            className="p-2 bg-slate-200 border rounded h-32 w-full flex justify-center items-center cursor-pointer"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <MdCloudUpload size={24} />
                                <p className="text-sm">Upload Banner Image</p>
                            </div>
                            <input
                                type="file"
                                id="uploadImageInput"
                                className="hidden"
                                onChange={handleUploadPic}
                                accept="image/*"
                            />
                        </label>
                    )}

                    <button
                        type="submit"
                        className="bg-orange-500 px-4 py-2 text-white hover:bg-red-700 mt-4"
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BannerEditPopup;
