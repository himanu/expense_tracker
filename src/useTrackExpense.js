import { useContext, useEffect, useState } from "react";
import { collection, query, where, getDocs, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase.config";
import { UserContext } from "./user-context";

const useTrackExpense = () => {
    const { user } = useContext(UserContext);
    const [expenses, setExpenses] = useState([]);

    const getExpenses = async () => {
        try {
            const q = query(collection(db, "expenses"), where("uid", "==", user?.uid));
            const querySnapshot = await getDocs(q);
            readExpenses(querySnapshot);
        } catch (err) {
            console.log("Error ", err);
        }
    }

    const readExpenses = (snapshot) => {
        const newExpenses = [];
        snapshot.forEach((doc) => {
            const expense = doc.data();
            newExpenses.push({ ...expense, id: doc.id });
        });
        setExpenses(newExpenses);
    }

    const deleteExpense = async (id) => deleteDoc(doc(db, "expenses", id))

    useEffect(() => {
        user && getExpenses();
        const unSubscribe = onSnapshot(
            query(collection(db, "expenses"), where("uid", "==", user?.uid)),
            readExpenses
        )
        return unSubscribe;
    }, []);

    return {
        expenses,
        deleteExpense
    }
};

export default useTrackExpense;
