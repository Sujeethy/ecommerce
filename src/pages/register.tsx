
'use client'
import Link from "next/link";
import { useState } from 'react';
import { api } from "~/utils/api";
import Nav from "~/pages/components/Nb";

import { useRouter } from 'next/router';
export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [error,setError]=useState("");
 const router =useRouter();
  interface UserData {
    name: string;
    email: string;
    password: string;
  }
  
  
  interface UserResponse {
    id: number;
    name: string;
    email: string;
  }

  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
  });

  
  const createUserMutation = api.post.createUser.useMutation<UserResponse>();
  
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    
    
    if (name==""){
      setError("Name is required");
      return;
    }
    if (email==""){
      setError("Email is required");
      return;
    }
    if (password=="") {
      setError("Password is required");
      return;
    }
    try {
      


      

      
      
      console.log(userData)
      const data = await createUserMutation.mutateAsync({name,email,password,verifed:false});
      localStorage.setItem("verify",JSON.stringify(data))
      router.push("/verify")
      setError("")
      console.log('User registered successfully:', data)

      if (error!=""){
        setError('Email already exists');
      };
    } catch (error) {
        
      console.error(error.message);
      
        setError('Error registering user: '+JSON.parse(error.message)[0].message);
      

    }
  };

  return (
    <div>
      <Nav />
      <div className="flex justify-center pt-10">
        <form onSubmit={handleSubmit} className="w-[576px] h-[691px] border-2 border-gray-300 rounded-lg flex flex-col items-center gap-y-8 flex-wrap content-around">
          <div className="pt-10 font-inter text-3xl font-semibold leading-9 text-left">Create your account</div>
          
          <div className="flex flex-col items-start w-64 flex-wrap content-around">
            <label htmlFor="name" className="text-gray-600 pb-2 font-inter text-base font-normal leading-5 text-left">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="border border-gray-400 rounded-lg px-3 py-2 w-[456px] h-[48px]"
            />
          </div>
          <div className="flex flex-col items-start w-64 flex-wrap content-around">
            <label htmlFor="email" className="text-gray-600 pb-2 font-inter text-base font-normal leading-5 text-left">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border border-gray-400 rounded-lg px-3 py-2 w-[456px] h-[48px]"
            />
          </div>
          <div className="flex flex-col items-start w-64 flex-wrap content-around">
            <label htmlFor="password" className="text-gray-600 pb-2 font-inter text-base font-normal leading-5 text-left">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border border-gray-400 rounded-lg px-3 py-2 w-[456px] h-[48px]"
            />
          </div>
          <button type="submit" className="border-2 border-black w-[456px] h-[58px] mt-2 rounded-lg bg-black text-white rounded-lg px-[148px] py-[18px] flex-wrap content-around tracking-widest">Create Account</button>
        
        
          <div className="text-gray-600 pb-2 font-inter text-base font-normal leading-5 text-left pt-2"> Have an Account? 
            <Link href="/login">
              <button className="pl-2 font-medium tracking-widest">LOGIN</button>
            </Link>
          </div>
          <div className="text-red-600 pb-2 font-inter text-base font-normal leading-5 text-left pt-2"> {error}
</div>
        </form>
      </div>
    </div>
  );
}
