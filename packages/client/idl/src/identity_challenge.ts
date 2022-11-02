export type IdentityChallenge = {
  "version": "0.1.0",
  "name": "identity_challenge",
  "instructions": [
    {
      "name": "issuePass",
      "accounts": [
        {
          "name": "cryptidAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "subject",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The owner of the Cryptid instance, typically a DID account",
            "Passed here so that the DID document can be parsed.",
            "The gateway token can be on any key provably owned by the DID."
          ]
        },
        {
          "name": "network",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gatekeeper",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pass",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gatewayProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidCryptidAccount",
      "msg": "Issue was called with an invalid Cryptid Account"
    }
  ]
};

export const IDL: IdentityChallenge = {
  "version": "0.1.0",
  "name": "identity_challenge",
  "instructions": [
    {
      "name": "issuePass",
      "accounts": [
        {
          "name": "cryptidAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "subject",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The owner of the Cryptid instance, typically a DID account",
            "Passed here so that the DID document can be parsed.",
            "The gateway token can be on any key provably owned by the DID."
          ]
        },
        {
          "name": "network",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gatekeeper",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pass",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gatewayProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidCryptidAccount",
      "msg": "Issue was called with an invalid Cryptid Account"
    }
  ]
};
