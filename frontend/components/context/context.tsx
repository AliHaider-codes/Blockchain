"use client";
import { ethers } from "ethers";
import { useEffect } from "react";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface ContextProps {
  userAddress: string;
  setUserAddress: Dispatch<SetStateAction<string>>;
  /*contract: ethers.Contract;
  setContract: Dispatch<SetStateAction<ethers.Contract>>;
  signedContract: ethers.Contract;
  setSignedContract: Dispatch<SetStateAction<ethers.Contract>>;*/
}

const UserContext = createContext<ContextProps>({
  userAddress: "",
  setUserAddress: (): string => "",
  /*contract: new ethers.Contract("", [], new ethers.JsonRpcProvider("")),
  setContract: (): ethers.Contract =>
    new ethers.Contract("", [], new ethers.JsonRpcProvider("")),
  signedContract: new ethers.Contract("", [], new ethers.JsonRpcProvider("")),
  setSignedContract: (): ethers.Contract =>
    new ethers.Contract("", [], new ethers.JsonRpcProvider("")),*/
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          console.log(accounts);
          setUserAddress(accounts[0]);
          // Manually refresh or redirect to the desired page
        }
      });
    }
  }, []);
  const [userAddress, setUserAddress] = useState("");
  /*const [contract, setContract] = useState(
    new ethers.Contract("", [], new ethers.JsonRpcProvider(""))
  );
  const [signedContract, setSignedContract] = useState(
    new ethers.Contract("", [], new ethers.JsonRpcProvider(""))
  );*/
  return (
    <UserContext.Provider
      value={{
        userAddress,
        setUserAddress,
        /*contract,
        setContract,
        signedContract,
        setSignedContract,*/
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);