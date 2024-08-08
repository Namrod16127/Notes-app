import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom"
import PasswordInput from "../../components/PasswordInput";
import { useState } from "react";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }
    setError("");

    //Login API call
    try {
      const response = await axiosInstance.post("/api/v1/user/login", {
        email: email,
        password: password,
      });

      //Handle successful login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }

    } catch (error){
      //Handle Login error
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      }
      else {
        setError("An unexpected error has occurred. Please try again later.")
      }
    }
  }
  return(
    <>
      <Navbar />
      <div className="h-screen flex items-center justify-center mt-[-50px]">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-3">Login</h4>
            <input 
              type="text" 
              placeholder="Email" 
              className="input-box"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />


            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

            {
              error && <p className="text-red-500 text-xs pb-1">{error}</p>
            }

            <button type="submit" className="btn-primary">
              Login
            </button>
            <p className="font-semibold text-sm text-center mt-4">
              Not registered yet? &nbsp;
              <Link to="/signup" className="font-semibold text-primary underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}