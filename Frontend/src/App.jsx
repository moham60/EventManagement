import { createHashRouter, RouterProvider } from "react-router-dom"
import "./App.css"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
  import { ToastContainer } from "react-toastify";
import ManageEvents from "./Pages/ManageEvents";
import Layout from "./Layout/Layout";
import DahboardAdmin from "./Pages/DahboardAdmin";
import UserDashboard from './Pages/UserDashboard';
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import EventDetails from "./Pages/EventDetails";
import EventContext from "./Contexts/EventContext";
import AllInsights from "./Pages/AllInsights";
import SeatContex from "./Contexts/SeatContex";
import AuthProvider from "./Contexts/AuthContext";
import Payment from "./Pages/Payment";
import BrowseEvents from './Pages/UserPages/BrowseEvents';
import { QueryClient, QueryClientProvider } from "react-query";
import BookingAndTicket from "./Pages/BookingAndTicket";
import Reports from "./Pages/Reports";
import AttendeeInsightSingle from "./Pages/AttendeeInsightSingle";
import UserProfile from "./Pages/UserPages/UserProfile";


function App() {

  const route = createHashRouter([
    {
      path: "/login",
      element: (
        <ProtectedRoute>
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      index: true,
      element: (
        <ProtectedRoute>
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "ManageEvents",
          element: <ManageEvents />,
        },
        {
          path: "tickets",
          element: <BookingAndTicket />,
        },
        {
          path: "allAttendeeInsights",
          element: <AllInsights />,
        },
        {
          path: "/adminDashboard",
          element: <DahboardAdmin />,
        },

        {
          path: "reportsAndAnalytics",
          element: <Reports />,
        },
        {
          path: "eventDetails/:eventId",
          element: <EventDetails />,
        },
        {
          path: "/payment",
          element: <Payment />,
        },
        {
          path: "insightEvent/:eventId",
          element: <AttendeeInsightSingle />,
        },
      ],
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/userDashboard",
          element: <UserDashboard />,
        },
        {
          path: "browseEvents",
          element: <BrowseEvents />,
        },
        {
          path: "reportsAndAnalytics",
          element: <Reports />,
        },
        {
          path: "eventDetails/:eventId",
          element: <EventDetails />,
        },
        {
          path: "tickets",
          element: <BookingAndTicket />,
        },
        {
          path: "profile",
          element: <UserProfile/>,
        },
      ],
    },
  ]);
  const queryClient = new QueryClient();
  return (
    <>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
      
            <EventContext>
              <SeatContex>
                <RouterProvider router={route}></RouterProvider>
              </SeatContex>
            </EventContext>
          
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App
