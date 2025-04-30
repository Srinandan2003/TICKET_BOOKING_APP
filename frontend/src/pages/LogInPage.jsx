import Login from "../components/Auth/SignIn.jsx";

function LogIn() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex flex-col items-center justify-center px-4">
      
      {/* Header */}
      <div className="bg-blue-700 text-white rounded-md shadow-lg px-6 py-4 w-full max-w-md text-center mb-6">
        <h1 className="text-2xl font-semibold">Welcome to Ticket Booking</h1>
        <p className="text-sm text-blue-100 mt-1">Please sign in to continue</p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <Login />
      </div>
      
    </div>
  );
}

export default LogIn;
