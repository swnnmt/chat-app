import { createContext, useCallback, useState, useEffect } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isregisterLoading, setIsregisterLoading] = useState(false);
    const [registerInfor, setRegisterInfor] = useState({
        name:"",
        email:"",
        password:"",
    });
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfor, setLoginInfor] = useState({
        email:"",
        password:"",
    });

   const updateRegisterInfor = (infor)=>{
        setRegisterInfor(infor);
   }

   const updateLoginInfor = (infor)=>{
    setLoginInfor(infor);
}
//    console.log("Userr", user);
//    console.log("loginInfor", loginInfor);
   useEffect(() =>{

    const user = localStorage.getItem("User")
    setUser(JSON.parse(user))

   },[]);
// đăng ký
   const registerUser = useCallback(async(e) =>{
    e.preventDefault();
    setIsregisterLoading(true)
    setRegisterError(null)

   const response = await postRequest(
    `${baseUrl}/users/register`,
    JSON.stringify(registerInfor)
    );

    setIsregisterLoading(false)

   if(response.error){

    return setRegisterError(response);

   }

   localStorage.setItem("User", JSON.stringify(response))
   setUser(response)
   },[registerInfor]);
// đăng nhập
const loginUser = useCallback (async(e)=>{
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError(null);

    const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfor)
        );
    setIsLoginLoading(false);
    if(response.error){
        return setLoginError(response);
    }
    localStorage.setItem("User", JSON.stringify(response))
    setUser(response);
   
},[loginInfor])



// đăng xuất
   const logoutUser = useCallback(()=>{

    localStorage.removeItem("User");
    setUser(null);

   }, [])


   return <AuthContext.Provider
   value={{
    user,
    registerInfor,
    updateRegisterInfor,
    registerUser,
    registerError,
    isregisterLoading,
    logoutUser,
    loginUser,
    loginError,
    loginInfor,
    updateLoginInfor,
    isLoginLoading,
    }} 
   >
        {children}
    </AuthContext.Provider>;
};