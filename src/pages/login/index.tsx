import React, { useEffect, useState } from "react";
import { socket } from "@/config/socket";
import axois from "axios";
import { useRouter } from 'next/router'
import { authAPI } from "@/config/urls";
import { loginService } from "@/services/authServices";
import withAuth from "@/helpers/withAuth";
import Head from "next/head";

const LoginPage: React.FC = () => {

  const [isRemember, setisRemember] = useState<boolean>(false);
  const [isLoginFail, setisLoginFail] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const router = useRouter()

  useEffect(()=>{
    const storedEmail = localStorage.getItem("email");
    if(storedEmail){
      setEmail(storedEmail)
      handleEmailChange
    }
  },[])

  const handleCheckboxClick = () => {
    setisRemember(!isRemember);
  }
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
    setEmail(event.target.value)
  }
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
    setPassword(event.target.value)
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(email !== undefined && password !== undefined){
      try{
        const response = await loginService(email,password);
        if(response?.status === 201){
          router.push('/dashboard/main')
          setisLoginFail(false)
        }else{
          console.log("login again please")
          setisLoginFail(true)
        }

        if(isRemember){
          localStorage.setItem("email",email)
        }
      }catch(err){
        console.log(err)
      }
    }
    
    
    
  };
  return (
    <div className="login-page flex justify-center items-center h-screen bg-slate-300">
      <Head>
        <title>Wallboard Login</title>
      </Head>
      <div className="login-box max-h-screen sm:w-max bg-gray-50 rounded-xl shadow-md p-2 sm:flex-row flex flex-col justify-between drop-shadow-2xl">
        <div className="image-container flex items-end rounded-xl overflow-hidden w-fit ">
          <img src="/LoginPhoto.png" alt="Login" className="" />
        </div>
        <div className="form-container sm:w-96 w-fit flex-auto p-6 flex items-center">
          
          <form className="w-full" onSubmit={handleSubmit}>
          
          <h2 className="text-3xl font-bold mb-6 text-gray-700 text-center">Welcome</h2>
          {isLoginFail && <h3 className="text-l text-red-700 mb-6 text-center">Error, Retry Login.</h3>}
            <div className="mb-4">
              {/* <label htmlFor="email" className="block font-medium mb-1 text-slate-700">Email</label> */}
              <input type="email"
               id="email" 
               placeholder="Email"
               className="w-full rounded-2xl py-2 px-3 bg-slate-200 outline-cyan-600 text-slate-800"
               value={email}
               onChange={handleEmailChange}/>
            </div>
            <div className="mb-4">
              {/* <label htmlFor="password" className="block font-medium mb-1 text-black">Password</label> */}
              <input 
              type="password" 
              id="password" 
              placeholder="Password" 
              className="w-full rounded-2xl py-2 px-3 bg-slate-200 outline-cyan-600 text-slate-800"
              value={password}
              onChange={handlePasswordChange} />
            </div>
            <div className={`mb-4 flex items-center border-2 border-sky-600  border-opacity-90	py-1 px-3 rounded-2xl w-max ${isRemember ? 'bg-sky-600' : 'bg-transparent'} hover:cursor-pointer`}>
              <input type="checkbox" id="rememberMe" className="mr-2 sr-only" onClick={handleCheckboxClick} />
              <label htmlFor="rememberMe" className={`${isRemember ? 'text-slate-200' : 'text-sky-600'} hover:cursor-pointer`}>Remember Me</label>
            </div>
            <button type="submit" className="bg-sky-600 text-white py-2 px-4 rounded-2xl w-full">Login</button>
          </form>
        </div>
     
      </div>
    </div>
  );
};

export default withAuth(LoginPage);
