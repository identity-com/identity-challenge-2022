use anchor_lang::prelude::*;
use cryptid::state::cryptid_account::CryptidAccount;
use std::str::FromStr;

use solana_anchor_gateway::cpi::accounts::IssuePass;
use solana_anchor_gateway::program::SolanaAnchorGateway;
use solana_anchor_gateway::state::{Gatekeeper, GatekeeperNetwork};

declare_id!("chahabA9kRqd7kfdHsxSHTvPgwtfYRChf7u2vZtkDYS");

pub fn required_middleware() -> Pubkey {
    Pubkey::from_str("79Rca2Uu11RJ6i7fbFQPvm2kbTWEEJnzsm8RmWVGwbnB").unwrap()
}

pub const AUTHORITY_SEED: &str = "authority";

#[program]
pub mod identity_challenge {
    use super::*;

    // must be called FROM an CryptidAccount with specific configured middleware
    pub fn issue_pass(ctx: Context<IssuePassProxy>) -> Result<()> {
        // issues an pass to a specified account
        require!(
            ctx.accounts
                .cryptid_account
                .middleware
                .map_or(false, |m| -> bool { m == required_middleware() }),
            ErrorCode::InvalidCryptidAccount
        );

        let subject = ctx.accounts.subject.key();
        let cpi_program = ctx.accounts.gateway_program.to_account_info();
        let cpi_accounts = IssuePass {
            pass: ctx.accounts.pass.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
            network: ctx.accounts.network.to_account_info(),
            gatekeeper: ctx.accounts.gatekeeper.to_account_info(),
            payer: ctx.accounts.authority.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
        };
        let bump = (*ctx.bumps.get("authority").unwrap()).to_le_bytes();
        let network = ctx.accounts.network.key();

        let authority_seed = &[AUTHORITY_SEED.as_bytes(), network.as_ref(), bump.as_ref()][..];

        let key = Pubkey::create_program_address(authority_seed, &id()).unwrap();
        msg!("Authority: {}", key.to_string());

        let signer = &[authority_seed][..];
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

        // execute the CPI
        solana_anchor_gateway::cpi::issue_pass(cpi_ctx, subject, 0)
    }
}

#[derive(Accounts)]
pub struct IssuePassProxy<'info> {
    #[account(mut, signer)]
    pub cryptid_account: Account<'info, CryptidAccount>,
    /// The owner of the Cryptid instance, typically a DID account
    /// Passed here so that the DID document can be parsed.
    /// The gateway token can be on any key provably owned by the DID.
    /// CHECK: DID Account can be generative or not
    #[account()]
    pub subject: UncheckedAccount<'info>,
    pub network: Account<'info, GatekeeperNetwork>,
    pub gatekeeper: Account<'info, Gatekeeper>,

    /// CHECK: Not a Signer from this Tx, but one on the CPI
    #[account(
    mut,
    seeds = [
        AUTHORITY_SEED.as_bytes(),
        network.key().as_ref(),
    ],
    bump
    )]
    pub authority: UncheckedAccount<'info>, // does not need to be a signer

    /// CHECK: Pass gets initialized via CPI
    #[account(mut)]
    pub pass: UncheckedAccount<'info>,
    pub gateway_program: Program<'info, SolanaAnchorGateway>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Issue was called with an invalid Cryptid Account")]
    InvalidCryptidAccount,
}
