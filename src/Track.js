import { IoMdAdd } from "react-icons/io";
import React, { useState } from 'react';
const Track = () => {
    return (
        <div>
            <h1 className="text-3xl">
                Expenses
            </h1>
            <button className="text-base flex w-[30%] m-auto justify-center gap-2 items-center mt-4 py-3 px-4 rounded-lg bg-gradient-to-l from-blue-700 via-blue-900 to-blue-700">
                Add <IoMdAdd />
            </button>
            <ExpensePopup />
        </div>
    )
};

const ExpensePopup = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [item, setItem] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = () => {
        setFile(null);
        setDate('');
        setLocation('');
        setItem('');
        setAmount('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white text-gray-800 p-8 rounded-md shadow-md w-96">
                <label className="block mb-4">
                    File Input (Image):
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-300 p-2 rounded"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </label>
                <label className="block mb-4">
                    Date:
                    <input
                        type="date"
                        value={date}
                        className="w-full border border-gray-300 p-2 rounded"
                        onChange={(e) => setDate(e.target.value)}
                    />
                </label>
                <label className="block mb-4">
                    Location:
                    <input
                        type="text"
                        value={location}
                        className="w-full border border-gray-300 p-2 rounded"
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </label>
                <label className="block mb-4">
                    Item:
                    <input
                        type="text"
                        value={item}
                        className="w-full border border-gray-300 p-2 rounded"
                        onChange={(e) => setItem(e.target.value)}
                    />
                </label>
                <label className="block mb-4">
                    Amount:
                    <input
                        type="number"
                        min="0"
                        value={amount}
                        className="w-full border border-gray-300 p-2 rounded"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </label>
                <button
                    className="bg-blue-500 text-white px-4 p-2 rounded hover:bg-blue-700"
                    onClick={handleSubmit}
                >
                    Add
                </button>
                <button
                    className="ml-2 px-4 bg-red-500 text-white p-2 rounded hover:bg-red-700"
                    onClick={handleSubmit}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
export default Track;