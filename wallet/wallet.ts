import { createPublicClient, http, createWalletClient, parseEther, encodeFunctionData } from "viem";
import { sepolia as chain } from "viem/chains";
// import { createBundlerClient } from "viem/account-abstraction";
import { privateKeyToAccount } from "viem/accounts";
// import {
//   Implementation,
//   toMetaMaskSmartAccount,
//   getDeleGatorEnvironment,
// } from "@metamask/delegation-toolkit";
import { zeroAddress } from "viem";

import dotenv from "dotenv";
dotenv.config();

const abi =[
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "token",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "spender",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"internalType": "struct Delegator.ApproveData[]",
				"name": "approveData",
				"type": "tuple[]"
			}
		],
		"name": "approveMany",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "initialize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "LetsGo",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "poke",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
;

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

// const bundlerClient = createBundlerClient({
//   client: publicClient,
//   transport: http(BUNDLER_URL as string),
// });

// const environment = getDeleGatorEnvironment(chain.id);
// const contractAddress = environment.implementations.EIP7702StatelessDeleGatorImpl;

// signature for self-execution
const authorization = await walletClient.signAuthorization({
  account, 
  contractAddress: "0xe9cF9d5d6b018924a4852C024a01364BC179EaDc",
  executor: "self", // Not using the relayer and executing the transaction ourselves
});

// Once authorized, the authorizationList parameter shall be excluded in the following transactions unless new authorization is needed.
const hash = await walletClient.sendTransaction({ 
  authorizationList: [authorization], 
  data: encodeFunctionData({
    abi,
    functionName: 'approveMany',
    args: [[
      {
        token: "0x086CB56a4daAF82048E444c9D4CA7F9a78c55255",
        spender: "0xb62803c3f1c7112cad3f35a503504c3b0920edbf",
        amount: parseEther("0.1"),
      }
    ]],
  }), 
  to: account.address, 
});
console.log({hash});


// const smartAccount = await toMetaMaskSmartAccount({
//   implementation: Implementation.Stateless7702,
//   address: account.address as `0x${string}`,
//   client: publicClient,
//   signer: {walletClient},
// });
// // console.log({smartAccount});


// const estimateFees = await publicClient.estimateFeesPerGas();
// const maxFeePerGas = 10000000000n;
// const maxPriorityFeePerGas = 10000000000n;

// console.log(estimateFees);

// try {

//   const userOperationHash = await bundlerClient.sendUserOperation({
//     account: smartAccount,
//     calls: [
//       {
//         to: "0xb62803c3f1c7112cad3f35a503504c3b0920edbf",
//         value: parseEther("0.001")
//       }
//     ],
//     maxFeePerGas,
//     maxPriorityFeePerGas
//   });

//   console.log("UserOperation Hash:", userOperationHash);

//   // Wait for the user operation to be included in a block
//   const receipt = await bundlerClient.waitForUserOperationReceipt({
//     hash: userOperationHash,
//   });

//   console.log("Transaction Hash:", receipt.receipt.transactionHash);
//   console.log("Block Number:", receipt.receipt.blockNumber);

// } catch (error) {
//   console.error("Error sending UserOperation:", error);
// }

