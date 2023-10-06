import axois from "axios";
import { authAPI } from "@/config/urls";
// import Cookies from "js-cookie";

export const loginService= async (email:string,password:string)=>{
  try{
    const response = await axois.post(`${authAPI}/api/auth/login`,{
      email,
      password,
      app_code:"wallboard"
    })
    if(response.status === 201){
      
      console.log("LOGIN SUCCEEDDDDDDDDDDDDDDDDDDDDDDDDDDDD*******");
      localStorage.setItem("user",JSON.stringify(response.data.data))
    }
    return response
  }
  catch(err){
    console.error("AuthService Error: ", err)
  }
    
}

export const logoutService= async ()=>{
  try{
    const currentUser = getCurrentUser();
    const response = await axois.post(`${authAPI}/api/auth/logout`,{},{
      headers:{
        'Authorization' : `Bearer ${currentUser.access_token}`
      }
    })
    if(response.status === 201){
      localStorage.removeItem("user")
    }
    return response;
  }
  catch(err){
    console.error("AuthService Error: ", err)
  }
  
}

// export const verifyToken= async (user?:string)=>{
//   let currentUser;
//   if(user){
//     currentUser = JSON.parse(user)
//   }else{
//     currentUser = getCurrentUser();
//   }
//   const response = await axois.post(`${authAPI}/api/auth/verify/token`,{
//     jwt_token:currentUser.access_token,
//   },{withCredentials:true})
//   return response;
// }

export const verifyToken= async ()=>{
  try{
    const currentUser = getCurrentUser();
    let jwt_token;
    if(currentUser){
      jwt_token=currentUser.access_token
    }else{
      jwt_token="0"
    }
    const response = await axois.post(`${authAPI}/api/auth/verify/token`,{
      jwt_token
    })
    return response;
  }
  catch(err){
    console.error("AuthService Error: ", err)
  }
  
}

const getCurrentUser=()=>{
  try{
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      return JSON.parse(currentUser);
  }}
  catch(err){
    console.error("AuthService Error: ", err)
  }
  
  }
