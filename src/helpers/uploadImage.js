import axios from "axios"

const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`

const uploadImage = async (image) => {
    const formData = new FormData()
    formData.append("file", image)
    formData.append("upload_preset", "KharthikaSarees")

    
    try{
        const response = await axios.post(url, formData)
        return response.data

    }catch(err){
        console.log(err)
    }


}

export default uploadImage