import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../ultils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState({});
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "", // Fixed typo here
    password: "",
  });
  const [loginError, setLoginError] = useState({});
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    name: "",
    email: "", // Fixed typo here
    password: "",
  });

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

   const updateLoginInfo = useCallback((info) => {
     setLoginInfo(info);
   }, []);

  useEffect(() => {
    const user = localStorage.getItem("User");

    setUser(JSON.parse(user));
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);

      const response = await postRequest(
        `${baseUrl}/users/register`,
        registerInfo
      ); // Removed JSON.stringify

      setIsRegisterLoading(false);

      if (response.errCode === 1) {
        return setRegisterError(response); // Save error message
      }
      localStorage.setItem("islogin",true)
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);
      const response = await postRequest(`${baseUrl}/users/login`, loginInfo);
      setIsLoginLoading(false);
      if (response.errCode === 1) {
        return setLoginError(response); // Save error message
      }
      localStorage.setItem("islogin", true);
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response)
      
    },
    [loginInfo]
  );


  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginInfo,
        loginUser,
        loginError,
        updateLoginInfo,
        isLoginLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
