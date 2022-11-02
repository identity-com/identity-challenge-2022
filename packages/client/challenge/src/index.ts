import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Keypair,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { IdentityChallengeClient } from "@identity.com/challenge-client";
import NodeWallet from "./nodewallet";
import {
  BitwiseVerificationMethodFlag,
  DidSolIdentifier,
  DidSolService,
  ExtendedCluster,
  Service,
  VerificationMethodType,
  Wallet,
} from "@identity.com/sol-did-client";
import {
  CHECK_DID_MIDDLEWARE_PROGRAM_ID,
  Cryptid,
  CryptidClient,
} from "@identity.com/cryptid-hh";
import { utils, Wallet as EthWallet } from "ethers";

const cluster: ExtendedCluster = "devnet";

// the challenge program requires middleware at 79Rca2Uu11RJ6i7fbFQPvm2kbTWEEJnzsm8RmWVGwbnB

(async () => {
  const connection = new Connection(clusterApiUrl(cluster));

  // subject is the wallet to which the pass shall be issued
  const subject = Keypair.generate();
  // authority of the DID/Cryptid Account
  const authority = Keypair.generate();
  const wallet = new NodeWallet(authority);

  const client = IdentityChallengeClient.build(
    {
      // the network
      network: new PublicKey("cha3u755qh8GbDayALBwA7ZroFT4NHfPUYgERp16M1z"),
      // the Gatekeeper
      gatekeeper: new PublicKey("43tZqtJB8fZvHe4BgKJFxZU1pDaiTeBBES9DVLjbPATg"),
      // PDA of the challenge Program that is authorized to issue for the gatekeeper
      gatekeeperAuthority: new PublicKey(
        "yQZBNHqdsquLZKfsUfNMcJqrS9F9rAw5oCEqJAH67MN"
      ),
    },
    cluster,
    {
      connection,
      wallet,
    }
  );

  // TODO: Implement: Setup Cryptid account with the required middleware

  // TODO: Implement: The DID that owns the Cryptid account needs to satisfy the middleware requirements

  console.log("Executing Transaction");
  // authority.publicKey needs to be Cryptid account [via CryptidClient]
  const tx = await client.issuePass(authority.publicKey, subject.publicKey);
  // TODO: Propose and execute transaction [via CryptidClient]

  console.log(`Unsuccessfully issued a pass to ${subject.publicKey}`);
})().catch(console.error);
