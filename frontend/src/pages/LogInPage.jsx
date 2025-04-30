import Login from "../components/Auth/SignIn.jsx";

function LogIn() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-start">
      {/* Intro Section */}
      <div className="w-full bg-blue-600 text-white p-6 text-center shadow-md">
        <h1 className="text-3xl font-bold mb-2">Welcome to Ticket Booking</h1>

      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center w-full p-4">
        <Login />
      </div>
    </div>
  );
}

export default LogIn;