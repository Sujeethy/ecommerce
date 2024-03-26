'use client'
import { api } from "~/utils/api";
import React, { useState } from 'react';
import dynamic from "next/dynamic";

import Nav from "~/pages/components/Nb";
import OtpInput from '~/pages/components/Otp';
import { useRouter } from 'next/router';

const Login = () => {
  const createUserMutation = api.post.createUser.useMutation();
  const [otpValue, setOtpValue] = useState(""); 
  const router = useRouter();
  const [error,setError]=useState("");
  let data = null;


  const handleVerify = async () => {

    const inputs = document.getElementsByTagName("input");


    const inputArray = Array.from(inputs);
    let string = "";
    

    inputArray.forEach((input, index) => {
       string += input.value;
    });

    if (string === "12345678") {
      
      console.log("success");
      try {
       

        const dat = await createUserMutation.mutateAsync({name:data.name,email:data.email,password:data.password,verifed:true});

        window.location.href = '/';
        setError("success")
        localStorage.removeItem('verify');
      } catch (error) {
        console.error('An error occurred:', error);

      }
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  };
  


  

if (typeof window !== "undefined") {
  const storedData = window.localStorage.getItem("verify");
   
  if (storedData) {
    try {
      data = JSON.parse(storedData);
    } catch (error) {
      console.error('Error parsing JSON data:', error);
    }
  }
}

  return (
    <div className="fo">
      <Nav />
      <div className="flex justify-center pt-10">
        <div className="w-[576px] h-[453px] border-2 border-gray-300 rounded-lg flex flex-col items-center  flex-wrap content-around">
          <div className="pt-10 font-inter text-3xl font-semibold leading-9 text-left">Verify your email</div>
          <div className='pt-8'>Enter the 8-digit code you have received on</div>
          <div className='font-medium'>
  {data != null ? `${data.email.slice(0, 3)}***@${data.email.slice(data.email.indexOf('@') + 1)}` : ""}
</div>

          <div className='pt-11'>
            Code
            <OtpInput
              numInputs={8}

            />
          </div>
          <button onClick={handleVerify} className='mt-16 bg-black text-white w-[456px] h-[56px] rounded-md'>Verify</button>

          <div className="text-red-600 pb-2 font-inter text-base font-normal leading-5 text-left pt-2"> {error}
</div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Login), { ssr: false });
