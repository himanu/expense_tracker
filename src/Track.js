import { IoMdAdd } from "react-icons/io";
import React, { useState, useContext } from 'react';
import { uploadFile } from "./storage";
import { UserContext } from "./user-context";
import { addDocument } from "./firestore";

const Track = () => {
    const [isOpen, toggleIsOpen] = useState(false);
    const [image, setImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        try {
            if (!image) {
                console.error('No image selected');
                return;
            }

            // Make a POST request to your Cloud Function
            const response = await fetch('https://us-central1-fir-384a7.cloudfunctions.net/processImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageBase64: image.split(',')[1] }), // Send base64-encoded image
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Expense details:', data.expenseDetails);
                // Handle the extracted expense details as needed
            } else {
                console.error('Error processing image:', response.statusText);
            }
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
                onClick={() => toggleIsOpen(true)}
                className="text-base flex w-[30%] m-auto justify-center gap-2 items-center mt-4 py-3 px-4 rounded-lg bg-gradient-to-l from-blue-700 via-blue-900 to-blue-700"
            >
                Add <IoMdAdd />
            </button>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleUpload}>Upload Image</button>
            {isOpen && <ExpensePopup onClose={() => toggleIsOpen(false)} /> }
        </div>
    )
};

const ExpensePopup = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [item, setItem] = useState('');
    const [amount, setAmount] = useState('');
    const { user }  = useContext(UserContext);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!date || !location || !item || !amount || !file)
                return;
            const filePath = await uploadFile(file, user?.uid);
            await addDocument({
                date,
                location,
                item,
                amount: Number(amount),
                uid: user?.uid,
                receipt:  filePath ?? ""
            })
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <form className="bg-white text-gray-800 p-8 rounded-md shadow-md w-96">
                <div className="flex justify-center text-lg mb-4 font-bold">
                    Add Expense
                </div>
                <label className="block mb-4">
                    <span className="sr-only">Choose Receipt</span>
                    <input type="file" accept="image/*"  className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100"
                      onChange={handleFileChange}
                      required
                    />
                </label>
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