import Login from "../components/Auth/SignIn.jsx";

function LogIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome
          </h2>
        </div>
        <div className="mt-6">
          <Login />
        </div>
      </div>
    </div>
  );
}

export default LogIn;