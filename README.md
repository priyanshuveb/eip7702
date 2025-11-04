### EIP7702
The script here takes your EOA and makes it a eip7702 compatible wallet by assigning it a delegator contract `Delegator.sol` by sending a Type 4 transaction. <br>
<br>
The Delegator contract can be customised as per requirements. Here it is being used to do batch token approvals. <br>
<br>
It's cool how this all comes together and makes things so easy, use this as reference and give it a try with different contract functionalities.<br>
<br>
We can use this for gasless transactions as well, will post that code too

### Few Things
- EIP-7702 is not a permanent account abstraction
- Think of 7702 as “opt-in smart account mode” per transaction
- The `walletClient.sendTransaction()` when sending transaction, the decision to either delegate this tx or not (sending as normal tx) is decided by the `to` field. If the address is `self` or of `relayer` (assinged in `signAuthorization`), gets delegated.

### Setup

```bash
cd wallet
npm install
```

### Delegating

```bash
npx tsx wallet.ts
```