import React from 'react';
import { Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Modal from 'react-modal';

export const DeleteConfirmationPopup = ({ isOpen, onClose, onDelete }) => {
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-slate-500 bg-opacity-25"
    >
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 text-center">
        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-yellow-500" />
        
        <h3 className="mb-5 text-lg font-normal text-black">
          Are you sure you want to delete?
        </h3>
        
        <div className="flex justify-center gap-4">
          <Button className="bg-red-600 text-white hover:bg-red-700"  onClick={onDelete}>
            Yes, I'm sure
          </Button>
          
          <Button className="text-black"  onClick={onClose}>
            No, cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationPopup