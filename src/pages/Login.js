import { React, useContext, useState } from 'react'
import LoginGif from '../assets/User.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Context from '../context';
import Logo from "../assets/KS-Detailed Logo.png"
import { setSessionExpired } from '../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import ForgotPasswordValidator from './ForgotPasswordValidator';

const Login = () => {

    const nav = useNavigate();
    const { fetchUser } = useContext(Context)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)

    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleFormSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        try {
            const dataFetch = await axios.post(`${process.env.REACT_APP_API_URL}/login`, data, { withCredentials: true })
            if (dataFetch.status === 201) {
                toast.success("Login Successful")
                console.log("Login Successful")
                nav('/')
                fetchUser()
            }
        } catch (err) {
            if (err.response?.status === 403) {
                toast.error("Session expired. Please log in again.");
                dispatch(setSessionExpired());
            } else if (err.response?.data?.message.includes("Please enter the Correct Password")) {
                toast.error("Please enter the Correct Password");
            }
        } finally {
            setLoading(false);
            setInterval(() => {
                window.location.reload()
            }, 2500)
        }
    }

    const [showPassword, setShowPassword] = useState(false);

    let icon;
    if (showPassword) {
        icon = <FaEyeSlash />
    } else {
        icon = <FaEye />
    }

    return (
        <section id='login' className='mt-20 h-[75vh]'>

            <div className='mx-auto container p-4'>

                <div className='bg-white p-5 w-full max-w-sm mx-auto'>

                    <div className='w-10 h-10 absolute '>
                        <img src={LoginGif} alt='LoginGif'></img>
                    </div>

                    <div className='h-20 ml-14 w-56 mx-auto'>
                        <img src={Logo} alt='logo' />
                    </div>

                    <form className='pt-6 flex flex-col gap-2 mt-20' onSubmit={handleFormSubmit}>

                        <div className='grid gap-3'>
                            <label className='font-semibold'>Email id:</label>
                            <div className='bg-slate-100 p-2'>
                                <input
                                    className='w-full h-full outline-none bg-transparent'
                                    type='email'
                                    placeholder='Your mail id'
                                    onChange={handleFormChange}
                                    name='email'
                                    value={data.email}
                                    required
                                />
                            </div>
                        </div>
                        <div className='grid gap-3'>
                            <label className='font-semibold'>Password:</label>
                            <div className='bg-slate-100 p-2 flex'>
                                <input
                                    className='w-full h-full outline-none bg-transparent'
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Your Password'
                                    name='password'
                                    value={data.password}
                                    onChange={handleFormChange}
                                    required
                                />
                                <div className='cursor-pointer text-xl' onClick={() => setShowPassword((preve) => !preve)}>
                                    <span>
                                        {icon}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button className='bg-orange-500 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'
                            onClick={handleFormSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin border-t-4 border-b-4 border-white w-6 h-6 rounded-full border-t-transparent mx-auto"></div>
                            ) : (
                                "Login"
                            )}
                        </button>

                    </form>

                    <div className='mt-5 font-thin flex justify-between text-sm'>
                        <p>Don't have an Account ?
                            <Link to={"/signup"} className='text-orange-500'> Sign up</Link>
                        </p>

                        <p>
                            <button
                                className='text-orange-500'
                                onClick={() => setOpen(true)}
                            >Forgot password?</button>
                        </p>
                    </div>

                </div>
            </div>
            {/* Popup Component */}
            {open && <ForgotPasswordValidator close={() => setOpen(false)} />}
        </section>
    )
}

export default Login