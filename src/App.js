import {useState, useEffect} from "react";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { auth } from "./firebase.config";
import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
};

function App() {
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unregister = auth.onAuthStateChanged((user) => {
      setUser(user ?? "");
      setIsLoading(false);
    });
    return () => unregister();
  }, []);

  return (
    <div className="text-white text-center m-auto pt-[5%] bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 h-screen">
      <div className="text-3xl">
        Welcome to Expense Tracker !
      </div>
      <div className="mt-4 text-md">
        Add, View, Edit and Delete your expenses.
      </div>
      {
        isLoading ? "" : (
          !user ? <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} /> : (
            <button 
              className="text-sm mt-5 hover:bg-gradient-to-l from-purple-700 via-purple-900 to-purple-700 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900  py-1 px-3 rounded-md"
              onClick={() => auth.signOut()}
            >
              Sign Out
            </button>
          )
        )
      }
      
      
    </div>
  );
}
export default App;
// https://fir-384a7.firebaseapp.com/__/auth/handler?apiKey=AIzaSyAaWOflD1Hg4VmQJSvlqtdsiIi1HcdNbnk&appName=%5BDEFAULT%5D-firebaseui-temp&authType=signInViaPopup&redirectUrl=http%3A%2F%2Flocalhost%3A3000%2F&v=9.1.3&eventId=0157483846&providerId=google.com&scopes=profile