"use client";
import { ethers } from "ethers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/components/context/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { set_cookie } from "@/app/actions/actions";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

declare global {
  interface Window {
    ethereum: any;
  }
}

if (typeof window !== "undefined") {
  window.ethereum = window.ethereum || {};
}

export default function LoginPage() {
  const router = useRouter();
  const { userAddress, setUserAddress } = useUser();
  /*const { contract, setContract } = useUser();
  const { signedContract, setSignedContract } = useUser();*/
  const { toast } = useToast();

  /*useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            // MetaMask is connected
            setUserAddress(accounts[0]);
            //router.push("/challenges");
          }
        })
        .catch(console.error);
    }
  }, []);*/

  const connectMetaMask = async (e: React.MouseEvent) => {
    e.preventDefault();
    let user: any;
    let provider;

    // Check if MetaMask is installed
    if (window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
      user = await provider.getSigner();
    } else {
      // If MetaMask is not installed, use the default provider
      toast({
        title: "MetaMask not installed. Using read-only defaults.",
        description: "Install MetaMask to continue",
      });
      user = ethers.getDefaultProvider("mainnet");
    }
    const addr = await user.getAddress();
    setUserAddress(addr);

    // Connect to the MetaMask EIP-1193 object. Read only.
    /*const address = "0xE62A58CB599ee66E724f84B7D0c7F3fc71eDD462";
    const abi = await (await fetch("/abi.json")).json();
    const contract = new ethers.Contract(address, abi, provider);
    //setContract(contract);
    const SignedContract = new ethers.Contract(address, abi, user);
    //setSignedContract(SignedContract);*/
    await set_cookie(userAddress);
  };

  return (
    <Card className="mx-auto h-56 w-80 sm:w-[28rem] rounded-2xl shadow-xl">
      <CardHeader className="mx-4 mt-4">
        <CardTitle>Sign in</CardTitle>
        <CardDescription className="font-medium sm:text-base">
          to continue to SmartChallenge
        </CardDescription>
      </CardHeader>
      <CardFooter className="mx-4 mt-4 flex justify-center">
        <Button
          className="w-80 border-2 rounded-lg relative group bg-white font-medium justify-between"
          variant="outline"
          onClick={connectMetaMask}
        >
          <div className="flex font-normal">
            <Image
              className="mr-4"
              src="/metamask-fox.svg"
              alt="Picture"
              width={20}
              height={20}
            />
            <h2>Continue with MetaMask</h2>
          </div>
          <svg
            className="hidden sm:block w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-200 ease-in-out transform"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Button>
      </CardFooter>
    </Card>
  );
}
