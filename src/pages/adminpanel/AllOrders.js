import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading';

const AllOrders = () => {
	const [orders, setOrders] = useState([]);
	const [orderStatus, setOrderStatus] = useState({});
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(false);

	// Fetch all orders
	useEffect(() => {
		const fetchAllOrders = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`${process.env.REACT_APP_API_URL}/all-orders`);
				console.log(response.data); // For debugging

				setOrders(response.data.data); // Set orders in the state
				const initialStatuses = response.data.data.reduce((acc, order) => {
					acc[order._id] = order.orderStatus; // Set default order status for each order
					return acc;
				}, {});
				setOrderStatus(initialStatuses); // Set the initial order statuses
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchAllOrders();
	}, []);

	const handleStatusChange = async (orderId, newStatus) => {
		setLoading(true);
		try {
			setOrderStatus((prevState) => ({
				...prevState,
				[orderId]: newStatus,
			}));

			await axios.post(`${process.env.REACT_APP_API_URL}/update-order`, { orderId, orderStatus: newStatus });
			toast.success("Order Status Updated Successfully")
		} catch (err) {
			toast.error("Failed to Update the order status")
			console.error('Error updating order status:', err);
		} finally {
			setLoading(false);
		}
	};
	// Filter orders based on the search query
	const filteredOrders = orders.filter((order) => {
		const query = searchQuery.toLowerCase();
		return (
			order._id.toLowerCase().includes(query) ||
			order.userId.toLowerCase().includes(query) ||
			order.orderStatus.toLowerCase().includes(query) ||
			order.address.fullname.toLowerCase().includes(query) ||
			order.product.some((product) => product.productName.toLowerCase().includes(query)) // Check products for matching name
		);
	});

	if(loading) {
		return <Loading />
	}

	return (
		<div className="max-w-7xl mx-auto p-6">
			<div className="flex justify-between items-center mb-8">
				<div className="flex items-center space-x-4">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search orders..."
						className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
					/>
				</div>
				<h1 className="text-3xl font-semibold text-gray-800 text-center w-full">All Orders</h1>
			</div>

			<div className="overflow-y-auto max-h-[80vh]"> {/* Container for scrollable cards */}
				<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{filteredOrders.length === 0 ? (
						<p className="text-center text-lg text-gray-500">No orders found.</p>
					) : (
						filteredOrders.map((order) => (
							<div key={order._id} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-lg transition duration-300 transform">
								<div className="mb-3">
									<h2 className="text-lg font-semibold text-gray-800 mb-1">Order ID</h2>
									<p className="text-gray-700 text-sm">{order._id}</p>
								</div>

								<div className="mb-3">
									<h3 className="text-lg font-semibold text-gray-800 mb-1">User ID</h3>
									<p className="text-gray-700 text-sm">{order.userId}</p>
								</div>

								<div className="mb-3">
									<p className="font-medium text-gray-700">Total: ₹{order.total}</p>
								</div>

								{/* Full Address Details */}
								<div className="mb-3">
									<h3 className="text-sm font-semibold text-gray-800">Full Address:</h3>
									<p className="text-xs text-gray-700">Name: {order.address.fullname}</p>
									<p className="text-xs text-gray-700">Address: {order.address.addressContent}</p>
									<p className="text-xs text-gray-700">Landmark: {order.address.landmark}</p>
									<p className="text-xs text-gray-700">Phone: {order.address.phone}</p>
									<p className="text-xs text-gray-700">Pincode: {order.address.pincode}</p>
									<p className="text-xs text-gray-700">Email: {order.address.email}</p>
								</div>

								{/* Status Dropdown */}
								<div className="mb-3">
									<strong className="text-gray-700 text-sm">Status:</strong>
									<select
										value={orderStatus[order._id]}
										onChange={(e) => handleStatusChange(order._id, e.target.value)}
										className="block w-full mt-2 bg-gray-100 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
									>
										<option value="Pending">Pending</option>
										<option value="Shipped">Shipped</option>
										<option value="Out for Delivery">Out for Delivery</option>
										<option value="Delivered">Delivered</option>
										<option value="Cancelled">Cancelled</option>
									</select>
								</div>

								{/* Product List */}
								<div className="mt-3">
									<h3 className="text-sm font-semibold text-gray-800">Products:</h3>
									<ul className="space-y-3 mt-3">
										{order.product.map((product, index) => (
											<li key={index} className="border-b border-gray-200 pb-3">
												<p className="text-xs font-medium text-gray-800">{product.productName}</p>
												<p className="text-xs text-gray-500">Quantity: {product.quantity}</p>
												<p className="text-xs text-gray-500">Price: ₹{product.selling}</p>
											</li>
										))}
									</ul>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default AllOrders;
