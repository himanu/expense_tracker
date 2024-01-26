import {  Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Track from "./Track";
import Home from "./Home";
import { useContext } from "react";
import { UserContext } from "./user-context";
import LoadingSvg from "./Loading";


const PrivateRouteComponent = ({ children, isAllowed, redirectPath, isLoading }) => {
  if (isLoading)
    return <LoadingSvg />
  if (!isAllowed)
    return <Navigate to={redirectPath} replace />
  return children;
}
function App() {
  const { user, isLoading } = useContext(UserContext);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/track",
      element: (
        <PrivateRouteComponent redirectPath="/" isAllowed={!!user} isLoading={isLoading} >
          <Track />
        </PrivateRouteComponent>
      )
    }
  ])
  return (
    <RouterProvider router={router} />
  );
}
export default App;