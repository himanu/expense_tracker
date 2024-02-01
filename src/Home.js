import { useContext } from "react";
import { UserContext } from "./user-context";
import { StyledFirebaseAuth } from "react-firebaseui";
import { auth } from "./firebase.config";
import { Link } from "react-router-dom";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";

const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID,
    ],
};
const Home = () => {
    const { user, isLoading, signOutUser} = useContext(UserContext);
    return (
        <div className="mt-16">
            <div className="text-3xl">
                {user.displayName ? `Hey ${user.displayName.split(" ")[0]}, ` : ""}Welcome to Expense Tracker!
            </div>
            <div className="mt-4 text-md">
                Add, View, Edit and Delete your expenses.
            </div>
            {
                isLoading ? "" : (
                    !user ? <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} /> : (
                        <button
                            className="text-sm mt-5 hover:bg-gradient-to-l from-purple-700 via-purple-900 to-purple-700 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900  py-2 px-3 rounded-md"
                            onClick={signOutUser}
                        >
                            Log Out
                        </button>
                    )
                )
            }

            {!isLoading && user && (
                <Link to="/track" className="text-sm mt-5 bg-gradient-to-l from-blue-700 via-blue-900 to-blue-700 ml-3  py-2 px-3 rounded-md">
                    Track Expenses
                </Link>
            )}

        </div>
    )
}
export default Home;