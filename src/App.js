import {useState} from "react";
function App() {
  const [user, setUser] = useState('');
  
  return (
    <div className="text-white text-center m-auto pt-[5%] bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 h-screen">
      <div className="text-3xl">
        Welcome to Expense Tracker !
      </div>
      <div className="mt-4 text-md">
        Add, View, Edit and Delete your expenses.
      </div>
      <button className="text-sm mt-5 hover:bg-gradient-to-l from-purple-700 via-purple-900 to-purple-700 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900  py-1 px-3 rounded-md">
        Sign In / Log In
      </button>
    </div>
  );
}

export default App;
