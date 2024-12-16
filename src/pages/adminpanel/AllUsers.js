import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InteractiveList from '../../components/Interactivelist';
import Loading from '../../components/Loading';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false)
  const usersPerPage = 7;

  const fetchAllUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/all-users`);
      if (response.data.success) {
        setUsers(response.data.message);
        setFilteredUsers(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const searchResults = users.filter((user) =>
      Object.values(user).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredUsers(searchResults);
    setCurrentPage(1);
  }, [searchQuery, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if(loading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-lg p-2 w-1/3"
        />
        <h2 className="text-2xl font-bold text-center flex-grow">
          All Users
        </h2>
      </div>

      {currentUsers.length > 0 ? (
        <InteractiveList users={currentUsers} setUsers={setUsers}/>
      ) : (
        <p>No users found.</p>
      )}

      {filteredUsers.length > usersPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
              }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
              }`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
