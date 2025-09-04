import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import LoaderScreen from "../../Components/LoaderScreen";
import axios from "axios";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

export default function UserProfile() {
  const { user, token,setUser } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
const API_URL = import.meta.env.VITE_API_URL;
  const getUserInfo = () => {
    return axios
      .get(`${API_URL}/user/${user?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // authMiddleWare للتحقق من وجود token
        },
      })
      .then((res) => {
        console.log("userInfo",res.data);
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (user?._id&&token) {
      getUserInfo();
   }
  }, [user?.id, token]);
  useEffect(() => {
    console.log("user", user);
  },[user])
  const updateUserProfile = (values) => {
    axios
      .put(`${API_URL}/user/${user?.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Profile updated:", res.data);
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        toast.success("Successufully to update")
      })
      .catch((err) => {
        console.error("Update failed:", err.response?.data || err.message);
      });
  };

  const formikObj = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      gender: user?.gender || "",
      occupation: user?.occupation || "",
      income: user?.income ?? 0, 
      location: user?.location || "",
      interests: Array.isArray(user?.interests) ? user.interests : [],
      age: user?.age ?? 0,
    },

    onSubmit: (values) => {
      if (user) {
        updateUserProfile(values);
      }
    },
    enableReinitialize: true,
  });
  if (!user) {
    return <LoaderScreen/>
  }
 
  return (
    <div className=" px-4 py-16 profile  min-h-screen">
      <h1 className="text-center text-3xl capitalize font-semibold">
        Complete and edit your profile
      </h1>

      <form onSubmit={formikObj.handleSubmit} className="space-y-12 mt-6">
        {/* Profile Section */}
        <div className="border-b border-white pb-12">
          <h2 className="text-base font-semibold ">Profile</h2>
          <p className="mt-1 text-sm text-gray-400">
            Update your account information.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium ">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={formikObj.handleChange}
                value={formikObj.values.name}
                className="mt-2 block w-full border rounded-md bg-white px-3 py-1.5  placeholder-gray-500 focus:outline-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium ">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={formikObj.handleChange}
                value={formikObj.values.email}
                className="mt-2 block w-full border rounded-md bg-white px-3 py-1.5  placeholder-gray-500 focus:outline-indigo-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium ">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                onChange={formikObj.handleChange}
                value={formikObj.values.gender}
                className="mt-2 block w-full border rounded-md bg-white/5 px-3 py-1.5  focus:outline-indigo-500">
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium ">
                Occupation
              </label>
              <input
                id="occupation"
                name="occupation"
                value={formikObj.values.occupation}
                type="text"
                onChange={formikObj.handleChange}
                className="mt-2 block w-full border rounded-md bg-white/5 px-3 py-1.5  placeholder-gray-500 focus:outline-indigo-500"
              />
            </div>
            {/* password */}
            <div className=" relative">
              <label htmlFor="password" className="block text-sm font-medium ">
                password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formikObj.values.password}
                onChange={formikObj.handleChange}
                className="mt-2 block w-full border rounded-md bg-white/5 px-3 py-1.5  placeholder-gray-500 focus:outline-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute cursor-pointer  right-3 top-[38px] text-gray-500 hover:text-indigo-500">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium ">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formikObj.values.location}
                onChange={formikObj.handleChange}
                className="mt-2 block w-full border rounded-md bg-white/5 px-3 py-1.5  placeholder-gray-500 focus:outline-indigo-500"
              />
            </div>

            {/* Income */}
            <div>
              <label htmlFor="income" className="block text-sm font-medium ">
                Income (USD)
              </label>
              <input
                id="income"
                name="income"
                type="number"
                value={formikObj.values.income}
                onChange={formikObj.handleChange}
                className="mt-2 block w-full  rounded-md bg-white px-3 py-1.5 border placeholder-gray-500 focus:outline-indigo-500"
              />
            </div>
            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium ">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={formikObj.values.age}
                onChange={formikObj.handleChange}
                className="mt-2 block w-full  rounded-md bg-white px-3 py-1.5 border placeholder-gray-500 focus:outline-indigo-500"
              />
            </div>
          </div>
          {/* Interests */}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-white">
              Interests
            </label>
            <div className="mt-2 flex flex-wrap gap-4">
              {[
                "Music",
                "Sports",
                "Travel",
                "Reading",
                "Coding",
                "Tourism",
                "Gaming",
                "Anime",
                "Movies",
              ].map((interest, index) => (
                <label
                  key={interest}
                  htmlFor={`interest${index}`}
                  className="flex  has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-700 has-[:checked]:text-white cursor-pointer border rounded p-2 items-center gap-2">
                  <input
                    type="checkbox"
                    name="interests"
                    value={interest}
                    checked={formikObj.values.interests.includes(interest)} // checked or not
                    onChange={(e) => {
                      //change interstes values if input is checked
                      if (e.target.checked) {
                        formikObj.setFieldValue("interests", [
                          ...formikObj.values.interests,
                          interest,
                        ]);
                      } else {
                        formikObj.setFieldValue(
                          "interests",
                          formikObj.values.interests.filter(
                            (i) => i !== interest
                          )
                        );
                      }
                    }}
                    id={`interest${index}`}
                    className="rounded hidden  peer  border-gray-400 text-indigo-500 focus:ring-indigo-500"
                  />
                  <span>{interest}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Save*/}
        <div className="flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-800 text-white cursor-pointer px-3 py-2 text-sm font-semibold  hover:bg-indigo-600">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
