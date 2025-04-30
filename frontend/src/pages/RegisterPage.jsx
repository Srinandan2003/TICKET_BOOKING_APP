import Register from "../components/Auth/SignUp.jsx";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-start">
      {/* Intro Section */}
      <div className="w-full bg-blue-600 text-white p-6 text-center shadow-md">
        <h1 className="text-3xl font-bold mb-2">Join Ticket Booking</h1>
        <p className="text-sm max-w-md mx-auto">
          Sign up to start booking seats for your favorite events! Enjoy a seamless and secure experience with real-time updates.
        </p>
      </div>

      {/* Register Form Section */}
      <div className="flex-1 flex items-center justify-center w-full p-4">
        <Register />
      </div>
    </div>
  );
};

export default RegisterPage;