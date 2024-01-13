import {useContext} from "react";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { auth } from "./firebase.config";
import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import { UserContext } from "./user-context";
import { Link } from "react-router-dom";

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
};

function App() {
  const { user, isLoading, signOutUser } = useContext(UserContext);
  return (
    <div>
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
              className="text-sm mt-5 hover:bg-gradient-to-l from-purple-700 via-purple-900 to-purple-700 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900  py-1 px-3 rounded-md"
              onClick={signOutUser}
            >
              Sign Out
            </button>
          )
        )
      }
      
      {!isLoading && user && (
        <Link to="/track" className="text-sm mt-5 bg-gradient-to-l from-blue-700 via-blue-900 to-blue-700 ml-3  py-1 px-3 rounded-md">
          Track Expenses
        </Link>
      )}
      
    </div>
  );
}
export default App;
// https://fir-384a7.firebaseapp.com/__/auth/handler?apiKey=AIzaSyAaWOflD1Hg4VmQJSvlqtdsiIi1HcdNbnk&appName=%5BDEFAULT%5D-firebaseui-temp&authType=signInViaPopup&redirectUrl=http%3A%2F%2Flocalhost%3A3000%2F&v=9.1.3&eventId=0157483846&providerId=google.com&scopes=profile