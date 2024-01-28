import { useContext, useEffect, useState } from "react";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
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
    }
};

export default useTrackExpense;
