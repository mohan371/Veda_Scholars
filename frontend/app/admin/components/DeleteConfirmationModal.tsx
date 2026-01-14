"use client";

import { Modal, ModalBody, ModalHeader } from "flowbite-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
    isProcessing?: boolean;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    itemName = "item",
    isProcessing = false
}: DeleteConfirmationModalProps) {
    return (
        <Modal show={isOpen} size="md" onClose={onClose} popup>
            <ModalHeader />
            <ModalBody>
                <div className="text-center">
                    <svg className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this {itemName}?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {isProcessing ? "Deleting..." : "Yes, I'm sure"}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                        >
                            No, cancel
                        </button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
}
