import { React, useState } from 'react';
import { RiCloseLargeLine } from "react-icons/ri";
import fabricType from '../../helpers/fabric';
import { MdCloudUpload, MdDelete } from "react-icons/md";
import axios from 'axios';
import toast from 'react-hot-toast';
import uploadImage from '../../helpers/uploadImage';
import deleteImage from '../../helpers/deleteSingleImage';
import Loading from '../../components/Loading';

const EditProductsPopUp = ({ close, productData, fetchData }) => {
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    const [data, setData] = useState({
        ...productData,
        productName: productData?.productName,
        category: productData?.category,
        fabric: productData?.fabric,
        productImage: productData?.productImage,
        description: productData?.description,
        price: productData?.price,
        selling: productData?.selling,
        quantity: productData?.quantity,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUploadImage = async (event) => {
        const file = event.target.files[0];
        setImageLoading(true);

        try {
            const uploadToCloud = await uploadImage(file);

            if (uploadToCloud && uploadToCloud.url) {
                setData((prev) => ({
                    ...prev,
                    productImage: [...prev.productImage, uploadToCloud.url],
                }));
            } else {
                throw new Error('Image upload failed, no URL returned.');
            }
        } catch (error) {
            toast.error('Image upload failed: ' + error.message);
        } finally {
            setImageLoading(false);
        }
    };

    const handleDeleteImage = async (index) => {
        setDeleting(true);
        const newImage = [...data.productImage];
        const imageToDelete = newImage[index];
        const publicId = imageToDelete.split('/').pop().split('.')[0];

        try {
            const result = await deleteImage(publicId);
            if (result.message === 'Image deleted successfully') {
                newImage.splice(index, 1);
                setData((prev) => ({
                    ...prev,
                    productImage: newImage,
                }));
                toast.success('Image deleted successfully');
            } else {
                toast.error('Failed to delete the image from Cloudinary');
            }
        } catch (err) {
            toast.error('An error occurred while deleting the image');
        } finally {
            setDeleting(false);
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/update-product`, data, { withCredentials: true });
            fetchData();
            toast.success(response.data.message);
        } catch (err) {
            console.log(err);
            toast.error("Failed to update the product. Please check the console.");
        } finally {
            setLoading(false);
            close();
        }
    };

    return (
        <div className="fixed bg-opacity-15 w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50">
            {(loading || imageLoading || deleting) && (
                <div className="absolute inset-0 z-50 flex justify-center items-center">
                    <div className="bg-white bg-opacity-0 p-4">
                        <Loading />
                    </div>
                </div>
            )}

            <div className='p-4 bg-white w-full max-w-2xl h-full max-h-[80%] overflow-y-hidden z-50'>
                <div className='text-2xl font-sans font-medium flex justify-center'>
                    <h2>Edit Product</h2>
                    <div className='w-fit ml-auto cursor-pointer hover:text-orange-500' onClick={close}>
                        <RiCloseLargeLine />
                    </div>
                </div>

                <form className='grid p-4 gap-3 overflow-y-scroll h-full'>
                    <label htmlFor='product-name' className='font-semibold'>Product Name:</label>
                    <input
                        type='text'
                        placeholder='Enter product name'
                        id='productName'
                        name='productName'
                        value={data.productName}
                        onChange={handleChange}
                        className='p-2 border-black border-2'
                        required
                    />

                    <label htmlFor="category" className="font-semibold">Category:</label>
                    <select
                        id="category"
                        name="category"
                        value={data.category}
                        onChange={handleChange}
                        className="p-2 border-black border-2"
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="Saree">Saree</option>
                        <option value="Chudithar">Chudithar</option>
                    </select>


                    <label htmlFor='fabric' className='font-semibold'>Fabric:</label>
                    <select
                        value={data.fabric}
                        onChange={handleChange}
                        id='fabric'
                        name='fabric'
                        className='p-2 border-black border-2'
                    >
                        <option value={""}>Select Fabric</option>
                        {fabricType.map((element, index) => (
                            <option value={element.value} key={element.value + index}>
                                {element.label}
                            </option>
                        ))}
                    </select>

                    <label htmlFor='productImage' className='font-semibold mt-3'>Product Image:</label>
                    <label htmlFor='uploadImageInput'>
                        <div className='p-2 bg-slate-200 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
                            <div className='flex justify-center items-center flex-col gap-2'>
                                <span className='text-4xl'><MdCloudUpload /></span>
                                <p className='text-sm'>Upload Product Image</p>
                                <input
                                    type='file'
                                    id='uploadImageInput'
                                    name='productImage'
                                    className='hidden'
                                    onChange={handleUploadImage}
                                />
                            </div>
                        </div>
                    </label>

                    <div>
                        {data?.productImage[0] ? (
                            <div className='flex items-center gap-3'>
                                {data.productImage.map((element, index) => (
                                    <div className='relative group cursor-pointer' key={`${index}-${element}`}>
                                        <img
                                            src={element}
                                            alt={element}
                                            width={80}
                                            height={80}
                                            className='bg-slate-100 border'
                                        />
                                        <div
                                            className='absolute bottom-0 right-0 p-1 text-white bg-orange-500 rounded-full hidden group-hover:block'
                                            onClick={() => handleDeleteImage(index)}
                                        >
                                            {deleting ? <Loading /> : <MdDelete />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-red-500'>Please upload a product image</p>
                        )}
                    </div>

                    <label htmlFor='price' className='font-semibold'>Price:</label>
                    <input
                        type='number'
                        placeholder='Enter amount, e.g., 500'
                        id='price'
                        name='price'
                        value={data.price}
                        onChange={handleChange}
                        className='p-2 border-black border-2'
                        required
                    />

                    <label htmlFor='selling' className='font-semibold'>Selling Price:</label>
                    <input
                        type='number'
                        placeholder='Enter selling price, e.g., 100'
                        id='selling'
                        name='selling'
                        value={data.selling}
                        onChange={handleChange}
                        className='p-2 border-black border-2'
                        required
                    />

                    <label htmlFor='quantity' className='font-semibold'>Quantity:</label>
                    <input
                        type='number'
                        placeholder='1'
                        id='quantity'
                        name='quantity'
                        value={data.quantity}
                        onChange={handleChange}
                        min='1'
                        className='p-2 border-black border-2 w-20 text-center'
                        required
                    />

                    <label htmlFor='description' className='font-semibold'>Description:</label>
                    <textarea
                        className='h-32 border-2 border-black resize-none rounded p-1'
                        rows={3}
                        placeholder='Product description goes here...'
                        name='description'
                        id='description'
                        value={data.description}
                        onChange={handleChange}
                        required
                    />

                    <button
                        className='bg-orange-500 px-2 py-3 mb-10 text-white hover:bg-red-700'
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="animate-spin border-t-4 border-b-4 border-white w-6 h-6 rounded-full border-t-transparent mx-auto"></div>
                        ) : (
                            "Update Product"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProductsPopUp;
