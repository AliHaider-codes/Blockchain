import { ethers } from "ethers";
import Loading from "@/app/challenges/loading";
import abi from "@/public/abi.json";
import { CONTRACT_ADDRESS } from "@/app/constants";
import { Suspense } from "react";
import InvisibleDiv from "@/components/ui/InvisibleDiv";
import Link from "next/link";
import SubmissionForm from "@/components/ui/SubmissionForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

const apiUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://smartchallenge.vercel.app/api";

const provider = new ethers.InfuraProvider(
  process.env.ETHEREUM_NETWORK,
  process.env.INFURA_API_KEY
);

const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

async function getChallengeByID(id: string) {
  const challenges = await contract.getChallenges();
  const pinata =
    "https://turquoise-neighbouring-nightingale-673.mypinata.cloud/ipfs/";
  try {
    const challengeObject = await Promise.all(
      challenges.map(async (challenge: any[]) => {
        // we retrieve the challenge information by its id
        if (challenge[0].toString() === id) {
          const cid = pinata + challenge[3];
          const res = await (await fetch(cid, { cache: "no-store" })).json();
          return {
            key: Number(challenge[0]),
            reward: Number(challenge[2]),
            name: res.name,
            description: res.description,
            category: res.category,
          };
        }
      })
    );
    return challengeObject.filter(Boolean) as any[];
  } catch (error) {
    console.log(error);
  }
}

function getChallengeContent(challenge: any[]) {
  let content;
  const challengeKey = Number(challenge.map((c) => c.key));
  const challengeCategory = challenge.map((c) => c.category).toString();
  switch (challengeCategory) {
    case "Web":
      content = <InvisibleDiv challengeKey={challengeKey} apiUrl={apiUrl} />;
      break;

    case "SQL injection":
      content = <SubmissionForm challengeKey={challengeKey} apiUrl={apiUrl} />;
      break;

    case "Maths":
      content = <SubmissionForm challengeKey={challengeKey} apiUrl={apiUrl} />;
      break;

    case "Coding":
      content = <SubmissionForm challengeKey={challengeKey} apiUrl={apiUrl} />;
      break;

    default:
      content = <h1>Coming Soon...</h1>;
      break;
  }
  return content;
}

export default async function Challenge({
  params,
}: {
  params: { id: string };
}) {
  const challenge = (await getChallengeByID(params.id)) || []; // Provide a default value for challenge
  const content = getChallengeContent(challenge);

  return (
    <div>
      <Suspense fallback={<Loading />}>
        {challenge && (
          <>
            <h1 className="text-sky-500 text-center my-4 text-xl">
              {challenge.map((c) => c.key).toString()}
            </h1>
            <div className="justify-center">
              {challenge.map((c) => (
                <Card
                  key={c.key}
                  className="mx-auto min-w-80 min-h-32 flex flex-wrap items-center justify-center w-90 rounded-lg shadow-lg"
                >
                  <CardHeader>
                    <CardTitle>{c.name}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            {content}
          </>
        )}
      </Suspense>
      <Link
        className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-4 rounded fixed bottom-10 left-10"
        href={"/challenges"}
      >
        Go back to challenges
      </Link>
    </div>
  );
}
