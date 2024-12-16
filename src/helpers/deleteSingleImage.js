import axios from 'axios';

const deleteImage = async (publicId) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/delete-image`,
            { publicId }
        );
        return response.data;
    } catch (err) {
        console.error('Error deleting image:', err.response || err.message);
        throw new Error('Failed to delete image');
    }
};


export default deleteImage;