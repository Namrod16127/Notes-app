import { useState } from "react";
import Navbar from "../../components/Navbar";
import PasswordInput from "../../components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

export default function SignUp() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  

  const navigate = useNavigate();

  const handleSignup = async(e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");

    //Signup API Call

    try {
      const response = await axiosInstance.post("/api/v1/user/create-user", {
        name: name,
        email: email,
        password: password,
      });

      //Handle successful registration response
      if (response.data && response.data.error) {
        setError(response.data.message);
        return
      }

      // if (response.data && response.data.accessToken) {
      //   localStorage.setItem("token", response.data.accessToken)
      //   navigate("/dashboard");
      // }
      if (response.data) {
        navigate("/");
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
  };

  return(
    <>
      <Navbar />
        <div className="h-screen flex items-center justify-center mt-[-50px]">
          <div className="w-96 border rounded bg-white px-7 py-10">
            <form action="" onSubmit={handleSignup}>
              <h4 className="text-2xl font-semibold mb-3">SignUp</h4>

              <input 
              type="text" 
              placeholder="Name" 
              className="input-box"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              />

            <input 
              type="text" 
              placeholder="Email" 
              className="input-box"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              />

              <PasswordInput 
                value={password}
                onChange={((e) => setPassword(e.target.value))}
              />

            {   
              error && <p className="text-red-500 text-xs pb-1">{error}</p>
            }

            <button type="submit" className="btn-primary">
              Create an Account
            </button>
            <p className="font-semibold text-sm text-center mt-4">
              Already have an account? &nbsp;
              <Link to="/" className="font-semibold text-primary underline">
                Login
              </Link>
            </p>
            </form>
            
          </div>
        </div>
      </>
    )
}