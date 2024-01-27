import { IoMdAdd } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import React, { useState, useContext, useRef } from 'react';
import { UserContext } from "./user-context";
import useTrackExpense from "./useTrackExpense";

const Track = () => {
    const [isOpen, toggleIsOpen] = useState(false);
    const [isExpensePopUpOpen, toggleIsExpensePopUpOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef(null);
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [item, setItem] = useState('');
    const [amount, setAmount] = useState('');
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
            setIsUploading(true);
            const formData = new FormData();
            formData.append('image', image);
            const response = await fetch('http://127.0.0.1:5001/fir-384a7/us-central1/on_request_example', {
                method: 'POST',
                body: formData
            });

            console.log("response ", response);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsUploading(false);
            toggleIsOpen(false);
            setImage(null);
            inputRef.current.value = null;
        }
    };
    return (
        <div style={{maxWidth: "900px", margin: "auto"}}>
            <div className="text-2xl flex m-auto items-center gap-2">
                Expenses <IoMdAdd onClick={() => toggleIsOpen(!isOpen)} style={{paddingTop: "3px", fontSize: "28px"}} cursor="pointer" fontWeight="bold" />
            </div>
            <div className="bg-slate-200 font-medium text-gray-600 font-mono rounded-md cursor-pointer px-3 py-1 relative mt-8 flex gap-10  hover:scale-105 transition ease-in-out delay-150 duration-200" onClick={() => toggleIsExpensePopUpOpen(true)}>
                <div className="text-left italic text-violet-500">
                    <div> 12 Jan,2024 </div>
                    <div> $30 </div>
                </div>
                <div style={{ width: "1px", background: "rgba(75, 85, 99, 0.5)"}}></div>
                <div className="text-left font-medium text-violet-700"> 
                    <div> India Gate, New Delhi</div>
                    <div> Pizza, Dal Makhani, Rice, Chappati, Juice </div> 
                </div>
            </div>
            <PopUp isOpen={isOpen}>
                <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h1> Add Expense </h1>
                    <MdOutlineCancel color="rgb(251 113 133)" fontSize="20px" cursor="pointer" onClick={() => toggleIsOpen(false)} />
                </div>
                <label>
                    <input type="file" accept="image/*" className="my-4 text-sm text-slate-500hover:file:bg-violet-100
                      file:bg-violet-50 file:text-violet-700
                        file:text-sm file:font-semibold
                        file:rounded-full file:border-0
                        file:mr-4 file:py-2 file:px-4
                    "

                        onChange={handleImageChange}
                        style={{ cursor: "pointer" }}
                        required
                        disabled={isUploading}
                        ref={inputRef}
                    />
                </label>
                <button
                    onClick={handleUpload}
                    style={{ display: "block", margin: "auto", background: "rgba(107, 114, 128, 0.3)", borderRadius: "5px", fontSize: "14px", padding: "5px 8px", cursor: (!image || isUploading) && "not-allowed", opacity: (!image || isUploading) && "0.5" }}
                    disabled={!image || isUploading}
                >
                    {isUploading ? "Processing ..." : "Submit "}
                </button>
            </PopUp>
            <ExpensePopup isOpen={isExpensePopUpOpen} onClose={toggleIsExpensePopUpOpen}/>
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
            <div className="rounded-md shadow-md" style={{
                width: "fit-content",
                height: "fit-content",
                padding: "1rem 2rem",
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

    return (
        <PopUp isOpen={isOpen}>
            <div className="text-gray-800">
                <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h1> Add Expense </h1>
                    <MdOutlineCancel color="rgb(251 113 133)" fontSize="20px" cursor="pointer" onClick={() => onClose(false)} />
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

                </label>
                <input
                    type="text"
                    value={item}
                    className="w-full border border-gray-300 p-2 rounded"
                    onChange={(e) => setItem(e.target.value)}
                    required
                />
                <label className="block mb-4">
                    Amount ($):
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
                    onClick={() => { }}
                    type="submit"
                >
                    Add
                </button>
                <button
                    className="ml-2 px-4 bg-red-500 text-white p-2 rounded hover:bg-red-700"
                    onClick={() => onClose(false)}
                >
                    Cancel
                </button>
            </div>
        </PopUp>
    );
};
export default Track;