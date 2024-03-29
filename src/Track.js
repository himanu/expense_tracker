import { IoMdAdd } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import React, { useState, useContext, useRef, useEffect } from 'react';
import { UserContext } from "./user-context";
import useTrackExpense from "./useTrackExpense";
import { LoaderContext } from "./loader-context";
import { toast } from "react-toastify";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Track = () => {
    const [isOpen, toggleIsOpen] = useState(false);
    const [image, setImage] = useState(null);
    const inputRef = useRef(null);
    const { expenses, deleteExpense, updateExpense } = useTrackExpense();
    const [selectedExpense, selectExpense] = useState("");
    const { user, signOutUser } = useContext(UserContext);
    const {toggleLoader, loader} = useContext(LoaderContext);
    const navigate = useNavigate();
    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            if (!image) {
                console.error('No image selected');
                return;
            }
            toggleLoader(true)
            const formData = new FormData();
            formData.append('image', image);
            formData.append("access_token", user?.accessToken)
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/on_request_example`, {
                method: 'POST',
                body: formData,
            });
            const json = await response.json();
            console.log("response ", json);
            if (json.error)
                toast.error(json.error)
            else
                toast.success("Successfully processed the bill!!!")
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            toggleLoader(false)
            toggleIsOpen(false);
            setImage(null);
            inputRef.current.value = null;
        }
    };
    return (
        <div style={{maxWidth: "900px", margin: "auto", padding: "10px 20px"}}>
            <div className="flex justify-between items-center pb-10">
                <IoMdArrowBack fontSize="20px" cursor="pointer" onClick={() => navigate("/")} />
                <span style={{cursor: "pointer"}} onClick={signOutUser}> Log Out </span>
            </div>
            <div className="text-2xl flex m-auto items-center gap-2">
                Expenses <IoMdAdd onClick={() => toggleIsOpen(!isOpen)} style={{paddingTop: "3px", fontSize: "28px"}} cursor="pointer" fontWeight="bold" />
            </div>
            {expenses.map((expense) => (
                <div key={expense.id} style={{ background: "hsla(0,0%,100%,.3)"}}className="font-medium text-white font-mono rounded-md cursor-pointer px-3 py-1 relative mt-8 flex gap-5  hover:scale-105 transition ease-in-out delay-150 duration-200" onClick={() => selectExpense(expense)}>
                    <div className="text-left min-w-fit">
                        <div className="font-semibold"> {expense.date} </div>
                        <div> ₹{expense.amount} </div>
                    </div>
                    <div style={{ width: "1px", background: "rgba(75, 85, 99, 0.5)" }}></div>
                    <div className="text-left font-medium">
                        <div className="font-semibold"> {expense.location}</div>
                        <div> {expense.item} </div>
                    </div>
                </div>
            ))}

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
                        disabled={loader}
                        ref={inputRef}
                    />
                </label>
                <button
                    onClick={handleUpload}
                    style={{ display: "block", margin: "auto", background: "rgba(107, 114, 128, 0.3)", borderRadius: "5px", fontSize: "14px", padding: "5px 8px", cursor: (!image || loader) && "not-allowed", opacity: (!image || loader) && "0.5" }}
                    disabled={!image || loader}
                >
                    {loader ? "Processing ..." : "Submit "}
                </button>
            </PopUp>
            <ExpensePopup expense={selectedExpense} onClose={() => selectExpense(null)} deleteExpense={deleteExpense} toggleLoader={toggleLoader} updateExpense={updateExpense} />
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

const ExpensePopup = ({ onClose, expense, deleteExpense, toggleLoader, updateExpense }) => {
    const [newExpense, setExpense] = useState(expense);

    const handleUpdate = async (e) => {
        try {
            e.preventDefault();
            toggleLoader(true);
            await updateExpense(expense.id, newExpense, expense)
            toggleLoader(false);
            onClose();
            toast.success("Successfully updated expense!")
        } catch (err) {
            console.log("Error ", err);
        }
    };

    const handleDelete = async () => {
        toggleLoader(true);
        await deleteExpense(expense.id);
        toggleLoader(false);
        onClose();
    }
    useEffect(()=> {
        setExpense(expense);
    }, [expense]);
    const isUpdatedBtnDisabled = JSON.stringify(newExpense) === JSON.stringify(expense);
    return (
        <PopUp isOpen={!!expense}>
            <div className="text-gray-800">
                <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h1> Add Expense </h1>
                    <MdOutlineCancel color="rgb(251 113 133)" fontSize="20px" cursor="pointer" onClick={onClose} />
                </div>

                <label className="block mb-4">
                    Date:
                    <input
                        type="date"
                        value={newExpense?.date}
                        className="w-full border border-gray-300 p-2 rounded"
                        onChange={(e) => setExpense((expense) => ({
                            ...expense,
                            date: e.target.value
                        }))}
                        required
                    />
                </label>
                <label className="block mb-4">
                    Location:
                    <input
                        type="text"
                        value={newExpense?.location}
                        className="w-full border border-gray-300 p-2 rounded"
                        onChange={(e) => setExpense((expense) => ({
                            ...expense,
                            location: e.target.value
                        }))}
                        required
                    />
                </label>
                <label className="block mb-4">
                    Item:
                </label>
                <input
                    type="text"
                    value={newExpense?.item}
                    className="w-full border border-gray-300 p-2 rounded"
                    onChange={(e) => setExpense((expense) => ({
                        ...expense,
                        item: e.target.value
                    }))}
                    required
                />
                <label className="block mb-4">
                    Amount (₹):
                    <input
                        type="number"
                        min="0"
                        step=".01"
                        value={newExpense?.amount}
                        className="w-full border border-gray-300 p-2 rounded"
                        onChange={(e) => setExpense((expense) => ({
                            ...expense,
                            amount: e.target.value
                        }))}
                        required
                    />
                </label>
                <button
                    className={`bg-blue-500 opacity-1 disabled:opacity-80 text-white px-4 p-2 rounded ${isUpdatedBtnDisabled ? "cursor-not-allowed" : "hover:bg-blue-700"}`}
                    onClick={handleUpdate}
                    type="submit"
                    disabled={isUpdatedBtnDisabled}
                    title={isUpdatedBtnDisabled ? "Found no changes" : ""}
                >
                    Update
                </button>
                <button
                    className="ml-2 px-4 bg-red-500 text-white p-2 rounded hover:bg-red-700"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </PopUp>
    );
};
export default Track;