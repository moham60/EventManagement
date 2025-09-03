import axios from "axios";
import { useFormik } from "formik";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {  AuthContext } from "../Contexts/AuthContext";
import eventLogo from "../assets/Images/Event.png"
export default function Login() {

  const {settoken,setUser}=useContext(AuthContext)
  const values = {
    email: "",
    password: "",
    
  }
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
   const registerNewUser = async (values, { resetForm }) => {
     try {
       const res = await axios.post(
         `${API_URL}/auth/login`,
         values
       );
       toast.success(res.data.msg);
       console.log(res.data)
       console.log(res.data.token);
       localStorage.setItem("token", res.data.token);
       localStorage.setItem("user", JSON.stringify(res.data.user));
       setUser(res.data.user)
      settoken(res.data.token);
       const role = res.data.user.role;
       if (role == "admin") {
          setTimeout(() => {
            navigate("/adminDashboard");
          }, 500);
       }
       else {
         setTimeout(() => {
           navigate("/userDashboard");
         }, 500);
       }

       // إعادة تهيئة الفورم بعد النجاح
       resetForm();
     } catch (err) {
       console.log("Axios error:", err.response); // للفحص

       const message =
         err.response && err.response.data && err.response.data.msg
           ? err.response.data.msg
           : "❌ Something went wrong";

       toast.error(message);
     }
   };
  const formikObj = useFormik({
    initialValues: values,
    onSubmit: (values, actions) => {
      registerNewUser(values, actions);
    },
  });
  return (
    <div>
      <div className="flex bg-gray-900 min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src={eventLogo}
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={formikObj.handleSubmit} className="space-y-6">
           
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-100">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formikObj.values.email}
                  onChange={formikObj.handleChange}
                  
                  autoComplete="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-100">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formikObj.values.password}
                  onChange={formikObj.handleChange}
                  
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                Login
              </button>
            </div>
          </form>

          <Link
            to={"/register"}
            className=" underline mt-4  block text-center text-blue-400">
              Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
}
