import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import App from './App';
import { UserContextProvider } from './user-context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoaderContextProvider } from './loader-context';


ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <LoaderContextProvider>
        <div className="text-white text-center m-auto pt-[5%] bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 h-screen">
          <App />
          <ToastContainer />
        </div>
      </LoaderContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


