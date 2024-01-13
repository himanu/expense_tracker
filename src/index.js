import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { UserContextProvider } from './user-context';
import Track from './Track';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/track",
    element: <Track />
  }
]);

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <div className="text-white text-center m-auto pt-[5%] bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 h-screen">
        <RouterProvider router={router} />
      </div>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

