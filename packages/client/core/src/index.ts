
import { ConfirmOptions, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { IdentityChallenge, IdentityChallengeIDL } from "@identity.com/challenge-idl";
import { ExtendedCluster, Wallet } from "@identity.com/cryptid-hh";
import { NonSigningWallet } from "./utils";
import { getConnectionByCluster } from "./connection";
import { GatekeeperService } from "@identity.com/gateway-solana-client";



export const IDENTITY_CHALLENGE_PROGRAM_ID = new PublicKey(
  "chahabA9kRqd7kfdHsxSHTvPgwtfYRChf7u2vZtkDYS"
);

export type GatekeeperConfig = {
  network: PublicKey,
  gatekeeper: PublicKey,
  gatekeeperAuthority: PublicKey,
}

type IdentityChallengeClientOptions = {
  connection?: Connection,
  wallet?: Wallet,
  confirmOptions?: ConfirmOptions,
}

export class IdentityChallengeClient {

  private constructor(
    private _program: Program<IdentityChallenge>,
    private _config: GatekeeperConfig
  ) {
  }

  static build(
    config: GatekeeperConfig,
    cluster: ExtendedCluster,
    options: IdentityChallengeClientOptions = {}
  ): IdentityChallengeClient {
    const wallet = options.wallet || new NonSigningWallet();
    const confirmOptions =
      options.confirmOptions || AnchorProvider.defaultOptions();
    const connection =
      options.connection ||
      getConnectionByCluster(
        cluster,
        confirmOptions.preflightCommitment
      );

    return new IdentityChallengeClient(
      IdentityChallengeClient.getProgram(
        connection,
        wallet,
        confirmOptions
      ),
      config
    )
  }


  private static getProgram(
    connection: Connection,
    wallet: Wallet,
    confirmOptions: ConfirmOptions,
  ): Program<IdentityChallenge> {

    const anchorProvider = new AnchorProvider(
      connection,
      wallet,
      confirmOptions
    );

    return new Program<IdentityChallenge>(
      IdentityChallengeIDL,
      IDENTITY_CHALLENGE_PROGRAM_ID,
      anchorProvider
    );
  }

  public async issuePass(
    cryptidAccount: PublicKey,
    subject: PublicKey
  ): Promise<Transaction> {
    const pass = await GatekeeperService.createPassAddress(subject, this._config.network)

    return this._program.methods
      .issuePass()
      .accounts({
        cryptidAccount,
        subject,
        pass,
        network: this._config.network,
        gatekeeper: this._config.gatekeeper,
        authority: this._config.gatekeeperAuthority,
        gatewayProgram: new PublicKey("gate2TBGydKNyMNUqz64s8bz4uaWS9PNreMbmAjb1Ft")
      })
      .transaction();
  }
}


