import { PublicKey, Transaction } from "@solana/web3.js";
import { Wallet } from "@identity.com/cryptid-hh";

export class NonSigningWallet implements Wallet {
  publicKey: PublicKey;

  constructor() {
    this.publicKey = new PublicKey('11111111111111111111111111111111');
  }

  signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return Promise.resolve(txs);
  }

  signTransaction(tx: Transaction): Promise<Transaction> {
    return Promise.resolve(tx);
  }
}
