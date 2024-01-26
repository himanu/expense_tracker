import { IoMdAdd } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import React, { useState, useContext } from 'react';
import { UserContext } from "./user-context";
import useTrackExpense from "./useTrackExpense";

const Track = () => {
    const [isOpen, toggleIsOpen] = useState(false);
    const [image, setImage] = useState(null);
    const { completedExpenses, draftExpenses } = useTrackExpense();

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            if (!image) {
                console.error('No image selected');
                return;
            }
            const formData = new FormData();
            formData.append('image', image);
            const response = await fetch('http://127.0.0.1:5001/fir-384a7/us-central1/on_request_example', {
                method: 'POST',
                body: formData
            });

            console.log("response ", response);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    return (
        <div>
            <h1 className="text-3xl">
                Expenses
            </h1>

            <button
                onClick={() => toggleIsOpen(!isOpen)}
                className="text-base w-[30%] flex m-auto justify-center gap-2 items-center mt-4 py-3 px-4 rounded-lg bg-gradient-to-l from-blue-700 via-blue-900 to-blue-700"
            >
                Add <IoMdAdd />
            </button>
            <PopUp isOpen={isOpen}>

                <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h1> Add Expense </h1>
                    <MdOutlineCancel fontSize="20px" cursor="pointer" onClick={() => toggleIsOpen(!isOpen)} />
                </div>
                <label>
                    <input type="file" accept="image/*" className="my-4 text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-700
                            hover:file:bg-violet-100"
                        onChange={handleImageChange}
                        style={{ cursor: "pointer" }}
                        required
                    />
                </label>
                <button
                    onClick={handleUpload}
                    style={{ display: "block", margin: "auto", background: "rgba(107, 114, 128, 0.3)", borderRadius: "5px", fontSize: "14px", padding: "5px 8px" }}
                >
                    Submit
                </button>
            </PopUp>
        </div>
    )
};

const PopUp = ({ children, isOpen }) => {
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center" style={{
            visibility: isOpen ? "visible" : "hidden",
            transition: "visibility 0s, opacity 0.5s linear",
            opacity: isOpen ? 1 : 0
        }}>
            <div style={{
                width: "fit-content",
                height: "fit-content",
                border: "1px solid",
                padding: "1rem",
                background: "#fff",
                color: "black"
            }}>
                {children}
            </div>
        </div>
    )
};

const ExpensePopup = ({ onClose, isOpen }) => {
    const [file, setFile] = useState(null);
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [item, setItem] = useState('');
    const [amount, setAmount] = useState('');
    const { user } = useContext(UserContext);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!date || !location || !item || !amount || !file)
                return;
            // await addDocument({
            //     date,
            //     location,
            //     item,
            //     amount: Number(amount),
            //     uid: user?.uid,
            // })
            setFile(null);
            setDate('');
            setLocation('');
            setItem('');
            setAmount('');
            onClose();
        } catch (err) {
            console.log("Error ", err);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        } else {
            setFile(null);
        }
    };
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center" style={{
            visibility: isOpen ? "visible" : "hidden",
            transition: "visibility 0s, opacity 0.5s linear",
            opacity: isOpen ? 1 : 0
        }}>
            <form className="bg-white text-gray-800 p-8 rounded-md shadow-md w-96">
                <div className="flex justify-center text-lg mb-4 font-bold">
                    Add Expense
                </div>

                <label className="block mb-4">
                    Date:
                    <input
                        type="date"
                        value={date}
                        className="w-full border border-gray-300 p-2 rounded"
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </label>
                <label className="block mb-4">
                    Location:
                    <input
                        type="text"
                        value={location}
                        className="w-full border border-gray-300 p-2 rounded"
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </label>
                <label className="block mb-4">
                    Item:
                    <input
                        type="text"
                        value={item}
                        className="w-full border border-gray-300 p-2 rounded"
                        onChange={(e) => setItem(e.target.value)}
                        required
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
                        required
                    />
                </label>
                <button
                    className="bg-blue-500 text-white px-4 p-2 rounded hover:bg-blue-700"
                    onClick={handleSubmit}
                    type="submit"
                >
                    Add
                </button>
                <button
                    className="ml-2 px-4 bg-red-500 text-white p-2 rounded hover:bg-red-700"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};
export default Track;