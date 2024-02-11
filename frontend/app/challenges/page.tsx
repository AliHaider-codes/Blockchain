import Challenge from "@/components/ui/challenge";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ethers } from "ethers";
import Loading from "@/app/challenges/loading";
import abi from "@/public/abi.json";
import { CONTRACT_ADDRESS } from "@/app/constants";
import { Suspense } from "react";

import AddChallenge from "@/components/ui/addChallenge";
// https://turquoise-neighbouring-nightingale-673.mypinata.cloud
const provider = new ethers.InfuraProvider(
  process.env.ETHEREUM_NETWORK,
  process.env.INFURA_API_KEY
);

const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

async function getChallenge() {
  const challenges = await contract.getChallenges();
  const pinata = "https://gateway.pinata.cloud/ipfs/";

  let challengeObject = await Promise.all(
    challenges.map(async (challenge: any[]) => {
      if (challenge[3] !== "hash") {
        const cid = pinata + challenge[3];
        const res = await (await fetch(cid, { cache: "no-store" })).json();
        return {
          key: challenge[0].toString(),
          reward: challenge[2].toString(),
          name: res.name,
          description: res.description,
        };
      } else {
        return {
          key: challenge[0].toString(),
          reward: challenge[2].toString(),
          name: "Test Name",
          description: "Decrypt a message encrypted with a Caesar cipher.",
        };
      }
    })
  );
  return challengeObject as any[];
}

export default async function ChallengesPage() {
  if (!cookies().has("userAddress")) {
    redirect("/login");
  } else {
    const userAddress = cookies().get("userAddress")!.value;
    const ownerAddress = await contract.getOwner();
    const challenges = await getChallenge();
    //const challenges = await getChallenge(contract, signedContract);
    return (
      <div>
        <Suspense fallback={<Loading />}>
          <h1 className="text-sky-500 text-center my-4 text-xl">Challenges</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-8">
            {challenges?.map((challenge) => {
              return <Challenge key={challenge.key} challenge={challenge} />;
            })}
          </div>
          {userAddress?.toLowerCase() === ownerAddress.toLowerCase() && (
            <AddChallenge />
          )}
        </Suspense>
      </div>
    );
  }
}
