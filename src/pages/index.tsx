import Link from 'next/link';
import React, { useState } from 'react';
import { api } from "~/utils/api";
import Nav from "~/pages/components/Nb";
import { useRouter } from 'next/router';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const login = api.post.login.useMutation<UserResponse>();
  const router = useRouter(); 

  interface UserResponse {
    email: string;
    password: string;
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === "") {
      setError("Email is required");
      return;
    }
    if (password === "") {
      setError("Password is required");
      return;
    }

    try {
      const { error, user } = await login.mutateAsync({ email, password });

      if (error === "Success") {
        localStorage.setItem("User", JSON.stringify(user));
        router.push('/home'); 
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Nav />
      <div className="flex justify-center pt-10">
        <form className="w-[576px] h-[614px] border-2 border-gray-300 rounded-lg flex flex-col items-center  flex-wrap content-around">
          <div className="pt-10 font-inter text-3xl font-semibold leading-9 text-left">Login</div>
          <div className='pt-9 font-semibold leading-7 text-2xl'>Welcome back to ECOMMERCE</div>
          <div className='pt-3 '>The next gen business marketplace</div>

          <div className="flex flex-col items-start w-64 flex-wrap content-around pt-8">
            <label htmlFor="name" className="text-gray-600 pb-2 font-inter text-base font-normal leading-5 text-left">Email</label>
            <input
              type="text"
              id="name"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border border-gray-400 rounded-lg px-3 py-2 w-[456px] h-[48px]"
            />
          </div>

          <div className="flex flex-col items-start w-64 flex-wrap content-around pt-8">
            <label htmlFor="password" className="text-gray-600 pb-2 font-inter text-base font-normal leading-5 text-left">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="border border-gray-400 rounded-lg pl-3 pr-10 py-2 w-[456px] h-[48px]"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 outline-none focus:outline-none"
                onClick={handleTogglePassword}
              >
                {showPassword ? (
                  <div className='underline underline-offset-4'>HIDE</div>
                ) : (
                  <div className='underline underline-offset-4'>SHOW</div>
                )}
              </button>
            </div>
          </div>

          <button onClick={handleLogin} className='mt-10 bg-black text-white w-[456px] h-[56px] rounded-md tracking-widest'>LOGIN</button>
          <div className="w-[456px] h-[1px] bg-[#C1C1C1] mt-7"></div>

          <div className="text-gray-600 pt-8 font-inter text-base font-normal leading-5 text-left">Don’t have an Account?
          <Link href="/register">
              <span className="pl-2 font-medium tracking-widest">SIGN UP</span>
            </Link>

          </div>

          <div className="text-red-600 pb-2 font-inter text-base font-normal leading-5 text-left pt-2"> {error}</div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
