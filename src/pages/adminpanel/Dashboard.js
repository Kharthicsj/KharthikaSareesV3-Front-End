import React, { useEffect, useState } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { FaBox, FaUsers, FaCartPlus, FaRegSadCry } from 'react-icons/fa';
import ChartZoom from 'chartjs-plugin-zoom';
import { Chart as ChartJS, registerables, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';
import Loading from '../../components/Loading';
import SalesLineChart from '../../components/SalesLineChart';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend, ArcElement);
ChartJS.register(...registerables, ChartZoom);

const Dashboard = () => {

    const nav = useNavigate()

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [outOfStock, setOutOfStock] = useState(0);
    const [bestSelling, setBestSelling] = useState([]);
    const [fabric, setFabric] = useState([]);
    const [category, setCategory] = useState([]);
    const [ordersTrackingData, setOrdersTrackingData] = useState([]);
    const [profitTrackingData, setProfitTrackingData] = useState([]);
    const [monthlyOrders, setMonthlyOrders] = useState([]);
    const [loading, setLoading] = useState(false)
    const [dailySales, setDailySales] = useState([]);

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());




    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard-data?year=${selectedYear}`)
                const responseData = response?.data?.data;

                console.log(responseData);

                setTotalUsers(responseData?.userCount);
                setTotalProducts(responseData?.inStock);
                setFabric(responseData?.productCountByFabric);
                setCategory(responseData?.productCountByCategory);
                setOutOfStock(responseData?.outOfStockCount);
                setDailySales(responseData?.dailySales);
                setMonthlyOrders(responseData?.monthlyOrderCount);
                setProfitTrackingData(responseData?.monthlySalesData);

                setOrdersTrackingData({
                    delivered: responseData?.orderStatusCounts?.delivered || 0,
                    outForDelivery: responseData?.orderStatusCounts?.outForDelivery || 0,
                    pending: responseData?.orderStatusCounts?.pending || 0,
                    shipped: responseData?.orderStatusCounts?.shipped || 0,
                    cancelled: responseData?.orderStatusCounts?.cancelled || 0,
                });

                if (responseData?.topSellingProducts) {
                    const mappedProducts = responseData.topSellingProducts.map((product) => ({
                        _id: product._id,
                        name: product.productName,
                        selling: `₹${product.selling.toFixed(2)}`,
                        qtyLeft: product.quantity,
                        totalPurchaseCount: product.totalSold, 
                        imageUrl: product.productImage[0] || "https://via.placeholder.com/150",
                    }));

                    setBestSelling(mappedProducts);
                }

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchAllOrders = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/all-orders?year=${selectedYear}`);
                setTotalOrders(response?.data?.count);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
        fetchAllOrders();
    }, [selectedYear]);


    const categoryData = {
        labels: ['Chudithar', 'Saree'],
        datasets: [
            {
                data: Object.values(category),
                backgroundColor: ['rgba(206, 32, 91, 0.8)', 'rgba(0, 89, 161, 0.8)'],
                hoverOffset: 4,
            },
        ],
    };

    const ordersTrackingChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Orders Tracking',
                data: monthlyOrders,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const profitTrackingChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Profit Tracking',
                data: profitTrackingData,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const ordersCancelledPieData = {
        labels: [
            `Cancelled Orders (${ordersTrackingData.cancelled})`,  // Custom count for Cancelled Orders
            `Delivered (${ordersTrackingData.delivered})`,
            `Out for Delivery (${ordersTrackingData.outForDelivery})`,
            `Pending (${ordersTrackingData.pending})`,
            `Shipped (${ordersTrackingData.shipped})`
        ],
        datasets: [
            {
                data: [
                    ordersTrackingData.cancelled,
                    ordersTrackingData.delivered,
                    ordersTrackingData.outForDelivery,
                    ordersTrackingData.pending,
                    ordersTrackingData.shipped
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                hoverOffset: 4,
            },
        ],
    };



    // Fabric Data for Sarees
    const sareeFabricData = {
        labels: ['Cotton', 'Pochampalli', 'Silk Cotton', 'Soft Silk'],
        datasets: [
            {
                data: [
                    fabric['Cotton']?.Saree || 0,
                    fabric['Pochampalli']?.Saree || 0,
                    fabric['Silk Cotton']?.Saree || 0,
                    fabric['Soft Silk']?.Saree || 0,
                ],
                backgroundColor: [
                    'rgba(246, 29, 67, 0.8)',  // Bright Red
                    'rgba(22, 223, 255, 0.8)',  // Bright Blue
                    'rgba(0, 161, 26, 0.8)',  // Dark green
                    'rgba(255, 159, 64, 0.6)',  // Bright Orange
                ],
                hoverOffset: 4,
            },
        ],
    };

    // Fabric Data for Chudithars
    const chuditharFabricData = {
        labels: ['Cotton', 'Pochampalli', 'Silk Cotton', 'Soft Silk'],
        datasets: [
            {
                data: [
                    fabric['Cotton']?.Chudithar || 0,
                    fabric['Pochampalli']?.Chudithar || 0,
                    fabric['Silk Cotton']?.Chudithar || 0,
                    fabric['Soft Silk']?.Chudithar || 0,
                ],
                backgroundColor: [
                    'rgba(255, 46, 154, 0.8)',  // Bright Pink
                    'rgba(52, 248, 37, 0.8)',  // Bright Green
                    'rgba(75, 192, 192, 0.6)',  // Turquoise
                    'rgba(99, 22, 245, 0.8)', // Lavender
                ],
                hoverOffset: 4,
            },
        ],
    };


    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="p-6">
            <h2 className="text-3xl font-semibold text-center mb-6 font-poppins">Admin Dashboard</h2>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
                    <div className="text-xl font-semibold">Total Users</div>
                    <div className="text-3xl font-bold text-orange-600">{totalUsers}</div>
                    <FaUsers className="text-4xl text-orange-600" />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
                    <div className="text-xl font-semibold">Total Orders</div>
                    <div className="text-3xl font-bold text-blue-600">{totalOrders}</div>
                    <FaCartPlus className="text-4xl text-blue-600" />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
                    <div className="text-xl font-semibold">In Stock Products</div>
                    <div className="text-3xl font-bold text-green-600">{totalProducts}</div>
                    <FaBox className="text-4xl text-green-600 ml-4" />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
                    <div className="text-xl font-semibold">Out of Stock</div>
                    <div className="text-3xl font-bold text-red-600">{outOfStock}</div>
                    <FaRegSadCry className="text-4xl text-red-600" />
                </div>
            </div>

            {/* First Line - Moved Charts Above Best Selling Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
                {/* Left Column - Single Graph */}
                <div className="bg-white p-6 rounded-xl shadow-lg text-center flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-gray-800">Total Available Products by Category</h3>
                    <div className="w-full h-72 flex justify-center items-center">
                        <Pie data={categoryData} />
                    </div>
                    <div className="w-full max-w-xs text-lg font-medium text-gray-700">
                        <div className="flex justify-between items-center py-2 border-b border-gray-300">
                            <span className="font-semibold">Saree</span>
                            <span className="text-blue-600">{category.Saree}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-300">
                            <span className="font-semibold">Chudithar</span>
                            <span className="text-blue-600">{category.Chudithar}</span>
                        </div>
                    </div>

                </div>

                {/* Right Column - Two Graphs */}
                <div className="grid grid-cols-1 gap-8">
                    {/* First Graph - Total Available Sarees by Fabric */}
                    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Available Sarees by Fabric</h3>
                        <div className="w-full h-72 flex justify-center items-center">
                            <Doughnut data={sareeFabricData} />
                        </div>
                    </div>

                    {/* Second Graph - Total Available Chudithars by Fabric */}
                    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Available Chudithars by Fabric</h3>
                        <div className="w-full h-72 flex justify-center items-center">
                            <Doughnut data={chuditharFabricData} />
                        </div>
                    </div>
                </div>
            </div>


            {/* Best Selling Products */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h3 className="text-2xl font-semibold mb-4">Best Selling Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bestSelling.map((product, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 w-full max-w-sm mx-auto">
                            {/* Product Image */}
                            <div className="relative w-full h-64 bg-gray-200">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            {/* Product Details */}
                            <div className="p-4">
                                <h4 className="text-xl font-semibold text-gray-800 truncate">{product.name}</h4>
                                <p className="text-gray-600 mt-1">Selling Price: <span className="font-medium text-orange-600">{product.selling}</span></p>
                                <p className="text-gray-600">Qty Left: {product.qtyLeft}</p>
                                <p className="text-gray-600">Total Purchases: {product.totalPurchaseCount}</p>
                            </div>

                            {/* Product Footer */}
                            <div className="bg-gray-100 p-4 flex justify-between items-center">
                                <div className="text-orange-600 font-semibold">{product.sales} Sales</div>
                                <button 
                                    className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition duration-200"
                                    onClick={() => nav(`/product/${product._id}`)}    
                                >View Product</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Second Line - Sales Data (Monthly) */}
            <h1 className='font-poppins text-2xl text-center font-bold'>Daily Data Analysis</h1>
            <div className='mt-6'>
                <SalesLineChart salesData={dailySales} />
            </div>

            {/* Third Line - Orders Tracking and Profit Tracking */}
            <h1 className='font-poppins text-center font-bold text-2xl'>Yearly Analysis</h1>
            <div>
                <div className="mb-4">
                    <label htmlFor="year" className="text-lg font-semibold">Select Year:</label>
                    <input
                        id="year"
                        type="number"
                        value={selectedYear}
                        onChange={(e) => {
                            const newYear = Number(e.target.value);
                            if (newYear >= 2024) {
                                setSelectedYear(newYear);
                            }
                        }}
                        min="2024"
                        className="ml-4 p-2 border rounded w-32"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders Tracking</h3>
                        <div className="w-full h-full md:h-72 lg:h-72">
                            <Bar data={ordersTrackingChartData} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Tracking</h3>
                        <div className="w-full h-full md:h-72 lg:h-72">
                            <Bar data={profitTrackingChartData} />
                        </div>
                    </div>
                </div>
            </div>


            {/* Fourth Line - Cancelled & Completed Orders and Orders (Pie) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8 text-center">
                {/* <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Cancelled & Completed Orders</h3>
                    <div className="w-full h-72 flex justify-center">
                        <Pie data={ordersCancelledChartData} />
                    </div>
                </div> */}

            </div>

            <h1 className='font-poppins text-2xl font-bold text-center'>Orders Tracker</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Orders (Pie)</h3>
                <div className="w-auto h-72 flex justify-center">
                    <Pie data={ordersCancelledPieData} />
                </div>
            </div>
        </div>

    );
};

export default Dashboard;
