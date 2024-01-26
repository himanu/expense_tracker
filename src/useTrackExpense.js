import { useContext, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase.config";
import { UserContext } from "./user-context";

const useTrackExpense = () => {
    const { user } = useContext(UserContext);
    const getExpenses = async () => {
        const q = query(collection(db, "expenses"), where("uid", "==", user?.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    }
    useEffect(() => {
        user && getExpenses();
        console.log("user ", user);
    }, []);
};

export default useTrackExpense;
