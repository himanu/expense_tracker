import { useContext, useEffect, useState } from "react";
import { collection, query, where, getDocs, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.config";
import { UserContext } from "./user-context";

const useTrackExpense = () => {
    const { user } = useContext(UserContext);
    const [expenses, setExpenses] = useState([]);

    const getExpenses = async () => {
        try {
            const q = query(collection(db, "expenses"));
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

    const updateExpense = async (id, newExpense, originalExpense) => {
        const expenseRef = doc(db, "expenses", id);

        await updateDoc(expenseRef, getChangedKeys(originalExpense, newExpense));
    }

    const getChangedKeys = (oldObj, newObj) => {
        const changedKeys = {};

        for (const key in newObj) {
            if (oldObj.hasOwnProperty(key)) {
                if (oldObj[key] !== newObj[key]) {
                    changedKeys[key] = newObj[key];
                }
            } else {
                changedKeys[key] = newObj[key];
            }
        }

        return changedKeys;
    }
    useEffect(() => {
        user && getExpenses();
        const unSubscribe = onSnapshot(
            query(collection(db, "expenses"), where("uid", "==", user?.uid)),
            readExpenses
        )
        return unSubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        expenses,
        deleteExpense,
        updateExpense
    }
};

export default useTrackExpense;
