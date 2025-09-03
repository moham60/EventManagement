import ClockLoader from "react-spinners/ClockLoader";

export default function LoaderScreen() {
  return (
    <div className="flex h-screen justify-center items-center">
      <ClockLoader color="aqua" />
    </div>
  );
}
