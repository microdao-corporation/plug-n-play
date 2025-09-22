/**
 * ICRC-21 Consent Message Support for Ledger
 */

import { HttpAgent, Actor } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";

// ICRC-21 IDL type definitions
const createICRC21IDL = () => {
  // Define consent message types
  const TokenAmount = IDL.Record({
    decimals: IDL.Nat8,
    amount: IDL.Nat64,
    symbol: IDL.Text,
  });

  const TimestampSeconds = IDL.Record({
    amount: IDL.Nat64,
  });

  const DurationSeconds = IDL.Record({
    amount: IDL.Nat64,
  });

  const TextValue = IDL.Record({
    content: IDL.Text,
  });

  const Value = IDL.Variant({
    TokenAmount: TokenAmount,
    TimestampSeconds: TimestampSeconds,
    DurationSeconds: DurationSeconds,
    Text: TextValue,
  });

  const icrc21_consent_message = IDL.Variant({
    GenericDisplayMessage: IDL.Text,
    FieldsDisplayMessage: IDL.Record({
      intent: IDL.Text,
      fields: IDL.Vec(IDL.Tuple(IDL.Text, Value)),
    }),
  });

  const icrc21_consent_message_metadata = IDL.Record({
    language: IDL.Text,
    utc_offset_minutes: IDL.Opt(IDL.Int16),
  });

  const icrc21_consent_info = IDL.Record({
    consent_message: icrc21_consent_message,
    metadata: icrc21_consent_message_metadata,
  });

  const icrc21_error_info = IDL.Record({
    description: IDL.Text,
  });

  const icrc21_error = IDL.Variant({
    UnsupportedCanisterCall: icrc21_error_info,
    ConsentMessageUnavailable: icrc21_error_info,
    InsufficientPayment: icrc21_error_info,
    GenericError: IDL.Record({
      error_code: IDL.Nat,
      description: IDL.Text,
    }),
  });

  const icrc21_consent_message_response = IDL.Variant({
    Ok: icrc21_consent_info,
    Err: icrc21_error,
  });

  const icrc21_consent_message_spec = IDL.Record({
    metadata: icrc21_consent_message_metadata,
    device_spec: IDL.Opt(IDL.Variant({
      GenericDisplay: IDL.Null,
      FieldsDisplay: IDL.Null,
    })),
  });

  const icrc21_consent_message_request = IDL.Record({
    method: IDL.Text,
    arg: IDL.Vec(IDL.Nat8),
    user_preferences: icrc21_consent_message_spec,
  });

  return IDL.Service({
    icrc21_canister_call_consent_message: IDL.Func(
      [icrc21_consent_message_request],
      [icrc21_consent_message_response],
      []
    ),
  });
};

/**
 * Format a field value from ICRC-21 response
 */
function formatFieldValue(fieldValue: any): string {
  if ('TokenAmount' in fieldValue) {
    const token = fieldValue.TokenAmount;
    const amount = Number(token.amount) / Math.pow(10, Number(token.decimals));
    return `${amount} ${token.symbol}`;
  } else if ('TimestampSeconds' in fieldValue) {
    const timestamp = new Date(Number(fieldValue.TimestampSeconds.amount) * 1000);
    return timestamp.toLocaleString();
  } else if ('DurationSeconds' in fieldValue) {
    const duration = Number(fieldValue.DurationSeconds.amount);
    return `${duration} seconds`;
  } else if ('Text' in fieldValue) {
    return fieldValue.Text.content;
  } else {
    return JSON.stringify(fieldValue);
  }
}

/**
 * Parse ICRC-21 consent response into a human-readable message
 */
function parseConsentResponse(response: any): string | null {
  if (response.Ok) {
    const consentInfo = response.Ok;
    let message: string;

    // Extract the message based on the variant type
    if (consentInfo.consent_message.GenericDisplayMessage !== undefined) {
      message = consentInfo.consent_message.GenericDisplayMessage;
    } else if (consentInfo.consent_message.FieldsDisplayMessage) {
      // Format the fields display message
      const fieldsMsg = consentInfo.consent_message.FieldsDisplayMessage;
      message = `${fieldsMsg.intent}\n`;

      for (const [fieldName, fieldValue] of fieldsMsg.fields) {
        const value = formatFieldValue(fieldValue);
        message += `${fieldName}: ${value}\n`;
      }
    } else {
      // Fallback to string representation
      message = JSON.stringify(consentInfo.consent_message);
    }

    return message;
  } else if (response.Err) {
    // Handle known error cases
    const error = response.Err;
    if ('UnsupportedCanisterCall' in error) {
      console.log('[ICRC-21] Canister does not support ICRC-21 for this method');
    } else if ('ConsentMessageUnavailable' in error) {
      console.log('[ICRC-21] Consent message unavailable:', error.ConsentMessageUnavailable.description);
    } else {
      console.log('[ICRC-21] Error:', error);
    }
  }

  return null;
}

/**
 * Generate fallback consent message for known ICRC methods
 */
async function generateFallbackMessage(method: string, arg: ArrayBuffer): Promise<string | null> {
  if (method !== 'icrc1_transfer' && method !== 'icrc2_approve') {
    return null;
  }

  try {
    const { IDL } = await import("@dfinity/candid");

    if (method === 'icrc1_transfer') {
      // Define ICRC-1 transfer args
      const TransferArg = IDL.Record({
        to: IDL.Record({
          owner: IDL.Principal,
          subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        }),
        fee: IDL.Opt(IDL.Nat),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64),
        amount: IDL.Nat,
      });

      const decoded = IDL.decode([TransferArg], arg)[0] as any;
      const amount = decoded.amount.toString();
      const to = decoded.to.owner.toText();

      return `Transfer ${amount} tokens to ${to}`;
    } else if (method === 'icrc2_approve') {
      // Define ICRC-2 approve args
      const ApproveArg = IDL.Record({
        fee: IDL.Opt(IDL.Nat),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64),
        amount: IDL.Nat,
        expected_allowance: IDL.Opt(IDL.Nat),
        expires_at: IDL.Opt(IDL.Nat64),
        spender: IDL.Record({
          owner: IDL.Principal,
          subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        }),
      });

      const decoded = IDL.decode([ApproveArg], arg)[0] as any;
      const amount = decoded.amount.toString();
      const spender = decoded.spender.owner.toText();

      return `Approve ${spender} to spend ${amount} tokens`;
    }
  } catch (decodeError) {
    console.log('[ICRC-21] Failed to decode arguments for fallback message:', decodeError);
  }

  return null;
}

/**
 * Fetch ICRC-21 consent message for Ledger hardware wallet
 * Returns the raw consent info object for proper CBOR encoding
 * @param canisterId - The canister ID to fetch consent from
 * @param method - The method name being called
 * @param arg - The candid-encoded argument
 * @returns The consent info object or null if not available
 */
export async function fetchConsentMessageForLedger(
  canisterId: string,
  method: string,
  arg: ArrayBuffer
): Promise<any | null> {
  try {
    console.log('[ICRC-21] Attempting to fetch consent message for Ledger for', method);

    // Create an anonymous agent for fetching consent messages
    const agent = new HttpAgent({
      host: "https://icp0.io" // Will use default IC gateway
    });

    // Create actor for the target canister
    const actor = Actor.createActor(createICRC21IDL, {
      agent,
      canisterId,
    });

    // Prepare the request with FieldsDisplay for Ledger
    const request = {
      method,
      arg: Array.from(new Uint8Array(arg)),
      user_preferences: {
        metadata: {
          language: "en",
          utc_offset_minutes: [],
        },
        device_spec: [{ FieldsDisplay: null }],
      },
    };

    // Call the consent message method
    const response: any = await actor.icrc21_canister_call_consent_message(request);

    if (response.Ok) {
      const consentInfo = response.Ok;
      console.log('[ICRC-21] Successfully fetched consent info for Ledger:', consentInfo);

      // Extract just the consent_message part for Ledger
      // The Ledger expects the consent message data, not the full info object
      if (consentInfo.consent_message) {
        return consentInfo.consent_message;
      }
    }

    return null;

  } catch (error) {
    console.log('[ICRC-21] Failed to fetch consent message for Ledger:', error);
    return null;
  }
}

/**
 * Fetch ICRC-21 consent message for a canister call
 * @param canisterId - The canister ID to fetch consent from
 * @param method - The method name being called
 * @param arg - The candid-encoded argument
 * @returns The consent message or null if not available
 */
export async function fetchConsentMessage(
  canisterId: string,
  method: string,
  arg: ArrayBuffer
): Promise<string | null> {
  try {
    console.log('[ICRC-21] Attempting to fetch consent message for', method);

    // Create an anonymous agent for fetching consent messages
    // ICRC-21 spec requires that consent messages be available without authentication
    const agent = new HttpAgent({
      host: "https://icp0.io" // Will use default IC gateway
    });

    // Note: fetchRootKey is only needed for local development
    // The call will still work on mainnet without it

    // Create actor for the target canister
    const actor = Actor.createActor(createICRC21IDL, {
      agent,
      canisterId,
    });

    // Prepare the request
    const request = {
      method,
      arg: Array.from(new Uint8Array(arg)),
      user_preferences: {
        metadata: {
          language: "en",
          utc_offset_minutes: [],
        },
        device_spec: [{ FieldsDisplay: null }],
      },
    };

    // Call the consent message method
    const response: any = await actor.icrc21_canister_call_consent_message(request);
    const message = parseConsentResponse(response);

    if (message) {
      console.log('[ICRC-21] Successfully fetched consent message:', message);
      return message;
    }

    // Try fallback for known ICRC methods
    return await generateFallbackMessage(method, arg);

  } catch (error) {
    // This is expected for canisters that don't implement ICRC-21
    console.log('[ICRC-21] Failed to fetch consent message (canister may not support ICRC-21):', error);

    // Try fallback message generation
    return await generateFallbackMessage(method, arg);
  }
}