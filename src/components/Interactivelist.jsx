import React, { useState } from "react";
import { LiaUserCheckSolid } from "react-icons/lia";
import DeleteConfirmationPopup from "./DeleteConfirmationPopup"; 
import toast from "react-hot-toast";
import axios from "axios";

const InteractiveList = ({ users, setUsers }) => { 
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const toggleExpand = (id) => {
    setExpandedUserId((prev) => (prev === id ? null : id));
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    console.log(`User with ID ${userToDelete._id} has been deleted.`);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/delete-user`,
        userToDelete,
        { withCredentials: true }
      );
      console.log(response);
      toast.success("User deleted successfully");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete._id));
    } catch (err) {
      console.log(err);
      toast.error("Error while deleting user")
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user._id} className="border p-4 rounded-lg bg-slate-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {user.profilepic ? (
                <img
                  src={user.profilepic}
                  alt={user.name}
                  className="w-15 h-10 rounded-full object-cover"
                />
              ) : (
                <LiaUserCheckSolid className="w-10 h-10 text-gray-400" />
              )}
              <h3 className="font-semibold">{user.name}</h3>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleExpand(user._id)}
                className="text-blue-500"
              >
                {expandedUserId === user._id ? "Collapse" : "Expand"}
              </button>
              {/* Delete Button */}
              <button
                onClick={() => openDeleteModal(user)}
                className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
          {expandedUserId === user._id && (
            <div className="mt-3">
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <p>Id: {user._id}</p>
              <p>Join Date: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationPopup
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default InteractiveList;
