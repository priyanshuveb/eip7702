import { createPublicClient, http, createWalletClient, parseEther } from "viem";
import { sepolia as chain } from "viem/chains";
import { createBundlerClient } from "viem/account-abstraction";
import { privateKeyToAccount } from "viem/accounts";
import {
  Implementation,
  toMetaMaskSmartAccount,
  getDeleGatorEnvironment,
} from "@metamask/delegation-toolkit";
import { zeroAddress } from "viem";

import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BUNDLER_URL = process.env.BUNDLER_URL;
if (PRIVATE_KEY === undefined) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}
// ensure the key has the 0x prefix required by the type `0x${string}`
const normalizedPrivateKey = PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`;
export const account = privateKeyToAccount(normalizedPrivateKey as `0x${string}`);

export const walletClient = createWalletClient({
  account,
  chain,
  transport: http(),
});

const publicClient = createPublicClient({
  chain,
  transport: http(),
});

const bundlerClient = createBundlerClient({
  client: publicClient,
  transport: http(BUNDLER_URL as string),
});

const environment = getDeleGatorEnvironment(chain.id);
const contractAddress = environment.implementations.EIP7702StatelessDeleGatorImpl;
// signature for self-execution
const authorization = await walletClient.signAuthorization({
  account, 
  contractAddress,
  executor: "self", 
});

// const hash = await walletClient.sendTransaction({ 
//   authorizationList: [authorization], 
//   data: "0x", 
//   to: zeroAddress, 
// });
// console.log({hash});


const smartAccount = await toMetaMaskSmartAccount({
  implementation: Implementation.Stateless7702,
  address: account.address as `0x${string}`,
  client: publicClient,
  signer: {walletClient},
});
// console.log({smartAccount});


const estimateFees = await publicClient.estimateFeesPerGas();
const maxFeePerGas = 10000000000n;
const maxPriorityFeePerGas = 10000000000n;

console.log(estimateFees);

try {

  const userOperationHash = await bundlerClient.sendUserOperation({
    account: smartAccount,
    calls: [
      {
        to: "0xb62803c3f1c7112cad3f35a503504c3b0920edbf",
        value: parseEther("0.001")
      }
    ],
    maxFeePerGas,
    maxPriorityFeePerGas
  });

  console.log({ userOperationHash });
} catch (error) {
  console.error("Error sending UserOperation:", error);
}
