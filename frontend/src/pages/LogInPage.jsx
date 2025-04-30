import Login from "../components/Auth/SignIn.jsx";

function LogIn() {
  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col items-center justify-start">
      {/* Intro Section */}
      <div className="w-full bg-blue-800 text-white p-6 text-center shadow-md">
        <h1 className="text-3xl font-bold mb-2">Welcome to Ticket Booking</h1>

      </div>

      {/* Login Form Section */}
    
        <Login />
   
    </div>
  );
}

export default LogIn;