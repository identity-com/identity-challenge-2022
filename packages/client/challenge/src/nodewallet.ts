import { Buffer } from "buffer";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { Wallet } from "@identity.com/sol-did-client";

/**
 * Node only wallet.
 */
export default class NodeWallet implements Wallet {
  constructor(readonly payer: Keypair) {}

  async signTransaction(tx: Transaction): Promise<Transaction> {
    console.log(`Signing tx with ${this.payer.publicKey.toBase58()}`);
    tx.partialSign(this.payer);
    return tx;
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    console.log(`Signing txs with ${this.payer.publicKey.toBase58()}`);
    return txs.map((t) => {
      t.partialSign(this.payer);
      return t;
    });
  }

  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }
}
