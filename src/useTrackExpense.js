import { useContext, useEffect, useState } from "react";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./firebase.config";
import { UserContext } from "./user-context";

const useTrackExpense = () => {
    const { user } = useContext(UserContext);
    const [completedExpenses, setCompletedExpenses] = useState([]);
    const [draftExpenses, setDraftExpenses] = useState([]);

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
        const newCompletedExpenses = [], newDraftExpenses = [];
        snapshot.forEach((doc) => {
            const expense = doc.data();
            expense.isCompleted ? newCompletedExpenses.push({ ...expense, id: doc.id }) : newDraftExpenses.push({ ...expense, id: doc.id });
        });
        setCompletedExpenses(newCompletedExpenses);
        setDraftExpenses(newDraftExpenses);
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
        completedExpenses,
        draftExpenses
    }
};

export default useTrackExpense;
