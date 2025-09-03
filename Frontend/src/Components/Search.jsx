import { IoSearchSharp } from "react-icons/io5";

export default function Search({ onChange, placeHolder }) {
  return (
    <div className="search relative">
      <input
        type="search"
        className="border  rounded-lg px-8 py-2 bg-white"
        placeholder={placeHolder}
        onChange={onChange}
        
      />
      <div className="searchIcon absolute left-2 top-[50%] translate-y-[-50%]">
        <IoSearchSharp size={25} />
      </div>
    </div>
  );
}
