import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.jsx";
import Login from "./pages/LogInPage.jsx";
import SeatBookingForm from "./components/SeatBookingForm.jsx";
import SeatGrid from "./components/SeatBooking.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected homepage */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <>
                <SeatBookingForm />
               
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
