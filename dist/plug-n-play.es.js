import { HttpAgent as Cr, Actor as N0, AnonymousIdentity as vt } from "@dfinity/agent";
import { Principal as Et } from "@dfinity/principal";
import { AuthClient as Tr } from "@dfinity/auth-client";
const Fr = ({ IDL: e }) => {
  const v = e.Record({ e8s: e.Nat64 }), c = e.Record({ secs: e.Nat64, nanos: e.Nat32 }), x = e.Record({
    owner: e.Principal,
    subaccount: e.Opt(e.Vec(e.Nat8))
  }), A = e.Record({
    num_blocks_to_archive: e.Nat64,
    max_transactions_per_response: e.Opt(e.Nat64),
    trigger_threshold: e.Nat64,
    max_message_size_bytes: e.Opt(e.Nat64),
    cycles_for_archive_creation: e.Opt(e.Nat64),
    node_max_memory_size_bytes: e.Opt(e.Nat64),
    controller_id: e.Principal
  });
  e.Record({
    send_whitelist: e.Vec(e.Principal),
    token_symbol: e.Opt(e.Text),
    transfer_fee: e.Opt(v),
    minting_account: e.Text,
    transaction_window: e.Opt(c),
    max_message_size_bytes: e.Opt(e.Nat64),
    icrc1_minting_account: e.Opt(x),
    archive_options: e.Opt(A),
    initial_values: e.Vec(e.Tuple(e.Text, v)),
    token_name: e.Opt(e.Text)
  });
  const C = e.Record({
    account: e.Vec(e.Nat8)
  }), b = e.Record({ account: e.Text }), i = e.Record({ canister_id: e.Principal }), E = e.Record({ archives: e.Vec(i) }), a = e.Record({ decimals: e.Nat32 }), s = e.Variant({
    Int: e.Int,
    Nat: e.Nat,
    Blob: e.Vec(e.Nat8),
    Text: e.Text
  }), _ = e.Record({ url: e.Text, name: e.Text }), f = e.Record({
    to: x,
    fee: e.Opt(e.Nat),
    memo: e.Opt(e.Vec(e.Nat8)),
    from_subaccount: e.Opt(e.Vec(e.Nat8)),
    created_at_time: e.Opt(e.Nat64),
    amount: e.Nat
  }), l = e.Variant({
    GenericError: e.Record({
      message: e.Text,
      error_code: e.Nat
    }),
    TemporarilyUnavailable: e.Null,
    BadBurn: e.Record({ min_burn_amount: e.Nat }),
    Duplicate: e.Record({ duplicate_of: e.Nat }),
    BadFee: e.Record({ expected_fee: e.Nat }),
    CreatedInFuture: e.Record({ ledger_time: e.Nat64 }),
    TooOld: e.Null,
    InsufficientFunds: e.Record({ balance: e.Nat })
  }), d = e.Variant({ Ok: e.Nat, Err: l }), F = e.Record({ name: e.Text }), B = e.Record({
    start: e.Nat64,
    length: e.Nat64
  }), w = e.Record({ timestamp_nanos: e.Nat64 }), u = e.Variant({
    Approve: e.Record({
      fee: v,
      from: e.Vec(e.Nat8),
      allowance_e8s: e.Int,
      expires_at: e.Opt(w),
      spender: e.Vec(e.Nat8)
    }),
    Burn: e.Record({ from: e.Vec(e.Nat8), amount: v }),
    Mint: e.Record({ to: e.Vec(e.Nat8), amount: v }),
    Transfer: e.Record({
      to: e.Vec(e.Nat8),
      fee: v,
      from: e.Vec(e.Nat8),
      amount: v
    }),
    TransferFrom: e.Record({
      to: e.Vec(e.Nat8),
      fee: v,
      from: e.Vec(e.Nat8),
      amount: v,
      spender: e.Vec(e.Nat8)
    })
  }), h = e.Record({
    memo: e.Nat64,
    icrc1_memo: e.Opt(e.Vec(e.Nat8)),
    operation: e.Opt(u),
    created_at_time: w
  }), p = e.Record({
    transaction: h,
    timestamp: w,
    parent_hash: e.Opt(e.Vec(e.Nat8))
  }), D = e.Record({ blocks: e.Vec(p) }), m = e.Variant({
    BadFirstBlockIndex: e.Record({
      requested_index: e.Nat64,
      first_valid_index: e.Nat64
    }),
    Other: e.Record({
      error_message: e.Text,
      error_code: e.Nat64
    })
  }), R = e.Record({
    callback: e.Func(
      [B],
      [e.Variant({ Ok: D, Err: m })],
      ["query"]
    ),
    start: e.Nat64,
    length: e.Nat64
  }), T = e.Record({
    certificate: e.Opt(e.Vec(e.Nat8)),
    blocks: e.Vec(p),
    chain_length: e.Nat64,
    first_block_index: e.Nat64,
    archived_blocks: e.Vec(R)
  }), W = e.Record({
    to: e.Text,
    fee: v,
    memo: e.Nat64,
    from_subaccount: e.Opt(e.Vec(e.Nat8)),
    created_at_time: e.Opt(w),
    amount: v
  }), g = e.Record({ symbol: e.Text }), S = e.Record({
    to: e.Vec(e.Nat8),
    fee: v,
    memo: e.Nat64,
    from_subaccount: e.Opt(e.Vec(e.Nat8)),
    created_at_time: e.Opt(w),
    amount: v
  }), P = e.Variant({
    TxTooOld: e.Record({ allowed_window_nanos: e.Nat64 }),
    BadFee: e.Record({ expected_fee: v }),
    TxDuplicate: e.Record({ duplicate_of: e.Nat64 }),
    TxCreatedInFuture: e.Null,
    InsufficientFunds: e.Record({ balance: v })
  }), z = e.Variant({ Ok: e.Nat64, Err: P }), M = e.Record({ transfer_fee: v });
  return e.Service({
    account_balance: e.Func(
      [C],
      [v],
      ["query"]
    ),
    account_balance_dfx: e.Func([b], [v], ["query"]),
    archives: e.Func([], [E], ["query"]),
    decimals: e.Func([], [a], ["query"]),
    icrc1_balance_of: e.Func([x], [e.Nat], ["query"]),
    icrc1_decimals: e.Func([], [e.Nat8], ["query"]),
    icrc1_fee: e.Func([], [e.Nat], ["query"]),
    icrc1_metadata: e.Func(
      [],
      [e.Vec(e.Tuple(e.Text, s))],
      ["query"]
    ),
    icrc1_minting_account: e.Func([], [e.Opt(x)], ["query"]),
    icrc1_name: e.Func([], [e.Text], ["query"]),
    icrc1_supported_standards: e.Func(
      [],
      [e.Vec(_)],
      ["query"]
    ),
    icrc1_symbol: e.Func([], [e.Text], ["query"]),
    icrc1_total_supply: e.Func([], [e.Nat], ["query"]),
    icrc1_transfer: e.Func([f], [d], []),
    name: e.Func([], [F], ["query"]),
    query_blocks: e.Func(
      [B],
      [T],
      ["query"]
    ),
    send_dfx: e.Func([W], [e.Nat64], []),
    symbol: e.Func([], [g], ["query"]),
    transfer: e.Func([S], [z], []),
    transfer_fee: e.Func([e.Record({})], [M], ["query"])
  });
};
var Pt = ((e) => (e[e.FractionalMoreThan8Decimals = 0] = "FractionalMoreThan8Decimals", e[e.InvalidFormat = 1] = "InvalidFormat", e[e.FractionalTooManyDecimals = 2] = "FractionalTooManyDecimals", e))(Pt || {});
BigInt(1e8);
var Nr = "abcdefghijklmnopqrstuvwxyz234567", H0 = /* @__PURE__ */ Object.create(null);
for (let e = 0; e < Nr.length; e++) H0[Nr[e]] = e;
H0[0] = H0.o;
H0[1] = H0.i;
var zt = (e) => {
  let v = e.toUint8Array(), c = new Uint8Array(32);
  return c[0] = v.length, c.set(v, 1), c;
};
class qt {
  constructor() {
    this.url = "https://identity.ic0.app", this.authClient = null, this.agent = null;
  }
  // Checks if the wallet is available
  async isAvailable() {
    return this.authClient || (this.authClient = await Tr.create()), !0;
  }
  // Connects to the wallet using the provided configuration
  async connect(v) {
    return this.authClient || (this.authClient = await Tr.create()), await this.authClient.isAuthenticated() ? this._continueLogin(v.hostUrl || this.url) : new Promise((x, A) => {
      this.authClient.login({
        identityProvider: v.identityProvider || this.url,
        onSuccess: async () => {
          try {
            const C = await this._continueLogin(v.hostUrl || this.url);
            x(C);
          } catch (C) {
            A(C);
          }
        },
        onError: (C) => {
          A(new Error("Authentication failed: " + C));
        }
      });
    });
  }
  async _continueLogin(v) {
    try {
      const c = this.authClient.getIdentity(), x = c.getPrincipal();
      return this.agent = await Cr.create({
        identity: c,
        host: v
      }), (v.includes("localhost") || v.includes("127.0.0.1")) && await this.agent.fetchRootKey(), {
        owner: x,
        subaccount: zt(x)
      };
    } catch (c) {
      throw console.error("Error during _continueLogin:", c), c;
    }
  }
  // Disconnects from the wallet
  async disconnect() {
    this.authClient && (await this.authClient.logout(), this.agent = null, this.authClient = null);
  }
  // Creates an actor for a canister with the specified IDL
  async createActor(v, c) {
    if (!v || !c)
      throw new Error("Canister ID and IDL are required");
    if (!this.agent)
      throw new Error("Agent is not initialized. Ensure the wallet is connected.");
    return N0.createActor(c, { agent: this.agent, canisterId: v });
  }
  // Creates an agent for communication with the Internet Computer
  async createAgent(v) {
    if (!this.authClient)
      throw new Error("AuthClient is not initialized");
    const c = this.authClient.getIdentity(), x = v.host || this.url;
    this.agent = await Cr.create({
      identity: c,
      host: x
    }), (x.includes("localhost") || x.includes("127.0.0.1")) && await this.agent.fetchRootKey();
  }
  // Retrieves the ICRC-1 token balance of the specified account
  async icrc1BalanceOf(v, c) {
    if (!this.agent)
      throw new Error("Agent is not initialized. Ensure the wallet is connected.");
    return await N0.createActor(Fr, {
      agent: this.agent,
      canisterId: v
    }).icrc1_balance_of(c);
  }
  // Performs a transfer of ICRC-1 tokens
  async icrc1Transfer(v, c) {
    if (!this.agent)
      throw new Error("Agent is not initialized. Ensure the wallet is connected.");
    return N0.createActor(Fr, {
      agent: this.agent,
      canisterId: typeof v == "string" ? v : v.toText()
    }).icrc1_transfer(c);
  }
}
typeof window < "u" && (window.ic && window.ic.plug && window.ic.plug.init(), window.addEventListener("load", () => {
  window.ic && window.ic.plug;
}));
const Ot = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2025.1.0,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version='1.1'%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20x='0px'%20y='0px'%20viewBox='0%200%20880%20640'%20style='enable-background:new%200%200%20880%20640;'%20xml:space='preserve'%3e%3cstyle%20type='text/css'%3e%20.st0{fill:none;}%20.st1{fill:url(%23SVGID_1_);}%20.st2{fill:url(%23SVGID_2_);}%20.st3{fill:%2329ABE2;}%20%3c/style%3e%3cg%3e%3cpath%20class='st0'%20d='M671.99,320c0-45.09-37.63-81.78-83.89-81.78c-12.26,0-33.8,6.07-66.78,34.97%20c-17.73,15.54-33.17,32.87-43.85,45.55c17.99,19.05,37.47,39.23,46.31,46.89c3.63,3.14,27.63,22.81,56.09,35.14%20c3.34,0.74,6.06,1,8.16,1C634.34,401.5,671.99,364.84,671.99,320z'/%3e%3cpath%20class='st0'%20d='M522.89,366.54c27.22,23.59,45.72,31.74,56.98,34.24c3.34,0.74,6.06,1,8.16,1%20c46.3-0.28,83.95-36.94,83.95-81.78c0-45.09-37.63-81.78-83.89-81.78c-12.26,0-33.8,6.07-66.78,34.97%20c-17.73,15.54-33.17,32.87-43.85,45.55C477.21,319.05,504.3,350.43,522.89,366.54z'/%3e%3clinearGradient%20id='SVGID_1_'%20gradientUnits='userSpaceOnUse'%20x1='515.2743'%20y1='201.9346'%20x2='705.4849'%20y2='398.9034'%3e%3cstop%20offset='0.21'%20style='stop-color:%23F15A24'/%3e%3cstop%20offset='0.6841'%20style='stop-color:%23FBB03B'/%3e%3c/linearGradient%3e%3cpath%20class='st1'%20d='M588.1,184c-32.16,0-67.28,16.49-104.38,49c-17.57,15.4-32.8,31.88-44.23,45.1c0.02,0.02,0.04,0.04,0.06,0.07%20c0.03-0.04,0.05-0.06,0.05-0.06s18.03,19.63,37.87,40.64c10.68-12.69,26.11-30.01,43.85-45.55c32.98-28.91,54.52-34.97,66.78-34.97%20c46.26,0,83.89,36.69,83.89,81.78c0,44.84-37.65,81.5-83.95,81.78c-2.11,0-4.82-0.26-8.16-1c13.49,5.84,27.99,10.04,41.8,10.04%20c84.79,0,101.36-55.33,102.49-59.25c2.51-10.14,3.84-20.7,3.84-31.56C728,245.01,665.24,184,588.1,184z'/%3e%3cpath%20class='st0'%20d='M208.01,320c0,45.09,37.63,81.78,83.89,81.78c12.26,0,33.8-6.07,66.78-34.97%20c17.73-15.54,33.17-32.87,43.85-45.55c-17.99-19.05-37.47-39.23-46.31-46.89c-3.63-3.14-27.63-22.81-56.09-35.14%20c-3.34-0.74-6.06-1-8.16-1C245.66,238.5,208.01,275.16,208.01,320z'/%3e%3cpath%20class='st0'%20d='M357.11,273.46c-27.22-23.59-45.72-31.74-56.98-34.24c-3.34-0.74-6.06-1-8.16-1%20c-46.3,0.28-83.95,36.94-83.95,81.78c0,45.09,37.63,81.78,83.89,81.78c12.26,0,33.8-6.07,66.78-34.97%20c17.73-15.54,33.17-32.87,43.85-45.55c0.26-0.3,0.52-0.62,0.78-0.92C392.12,307.51,375.7,289.57,357.11,273.46z'/%3e%3clinearGradient%20id='SVGID_2_'%20gradientUnits='userSpaceOnUse'%20x1='-877.3035'%20y1='-1122.6819'%20x2='-687.0928'%20y2='-925.7131'%20gradientTransform='matrix(-1%200%200%20-1%20-512.5778%20-684.6164)'%3e%3cstop%20offset='0.21'%20style='stop-color:%23ED1E79'/%3e%3cstop%20offset='0.8929'%20style='stop-color:%23522785'/%3e%3c/linearGradient%3e%3cpath%20class='st2'%20d='M291.9,456c32.16,0,67.28-16.49,104.38-49c17.57-15.4,32.8-31.88,44.23-45.1c-0.02-0.02-0.04-0.04-0.06-0.07%20c-0.03,0.04-0.05,0.06-0.05,0.06s-18.03-19.63-37.87-40.64c-10.68,12.69-26.11,30.01-43.85,45.55%20c-32.98,28.91-54.52,34.97-66.78,34.97c-46.26,0-83.89-36.69-83.89-81.78c0-44.84,37.65-81.5,83.95-81.78c2.11,0,4.82,0.26,8.16,1%20c-13.49-5.84-27.99-10.04-41.8-10.04c-84.79,0-101.36,55.33-102.49,59.25c-2.51,10.14-3.84,20.7-3.84,31.56%20C152,394.99,214.76,456,291.9,456z'/%3e%3cpath%20class='st3'%20d='M621.52,409.45c-43.41-1.07-88.53-35.3-97.74-43.81c-23.78-21.99-78.66-81.53-82.97-86.2%20C400.58,234.4,346.07,184,291.9,184h-0.07h-0.07c-65.85,0.33-121.19,44.92-135.91,104.44c1.13-3.92,22.76-60.3,102.42-58.34%20c43.41,1.07,88.75,35.76,97.95,44.27c23.78,21.99,78.68,81.54,82.97,86.21C479.42,405.61,533.93,456,588.1,456h0.07h0.07%20c65.85-0.33,121.19-44.92,135.91-104.44C723.03,355.48,701.18,411.41,621.52,409.45z'/%3e%3c/g%3e%3c/svg%3e", Wt = [
  {
    id: "nns",
    name: "Internet Identity",
    icon: Ot,
    adapter: qt
  }
  // {
  //   id: "plug",
  //   name: "Plug Wallet",
  //   icon: plugLogo,
  //   adapter: PlugAdapter,
  // },
];
function Mt(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
const Vt = new Int32Array([
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
]);
function At(e) {
  if (Buffer.isBuffer(e))
    return e;
  if (typeof e == "number")
    return Buffer.alloc(e);
  if (typeof e == "string")
    return Buffer.from(e);
  throw new Error("input must be buffer, number, or string, received " + typeof e);
}
function $t(e) {
  const v = At(4);
  return v.writeInt32BE(e, 0), v;
}
function yr(e, v) {
  e = At(e), Buffer.isBuffer(v) && (v = v.readUInt32BE(0));
  let c = ~~v ^ -1;
  for (var x = 0; x < e.length; x++)
    c = Vt[(c ^ e[x]) & 255] ^ c >>> 8;
  return c ^ -1;
}
function _r() {
  return $t(yr.apply(null, arguments));
}
_r.signed = function() {
  return yr.apply(null, arguments);
};
_r.unsigned = function() {
  return yr.apply(null, arguments) >>> 0;
};
var Gt = _r;
const Kt = /* @__PURE__ */ Mt(Gt);
var X = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {};
function Xt(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function jt(e) {
  if (e.__esModule) return e;
  var v = e.default;
  if (typeof v == "function") {
    var c = function x() {
      return this instanceof x ? Reflect.construct(v, arguments, this.constructor) : v.apply(this, arguments);
    };
    c.prototype = v.prototype;
  } else c = {};
  return Object.defineProperty(c, "__esModule", { value: !0 }), Object.keys(e).forEach(function(x) {
    var A = Object.getOwnPropertyDescriptor(e, x);
    Object.defineProperty(c, x, A.get ? A : {
      enumerable: !0,
      get: function() {
        return e[x];
      }
    });
  }), c;
}
var T0 = {}, U0 = {};
U0.byteLength = Qt;
U0.toByteArray = Jt;
U0.fromByteArray = te;
var d0 = [], h0 = [], Zt = typeof Uint8Array < "u" ? Uint8Array : Array, z0 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var k0 = 0, Yt = z0.length; k0 < Yt; ++k0)
  d0[k0] = z0[k0], h0[z0.charCodeAt(k0)] = k0;
h0[45] = 62;
h0[95] = 63;
function Ct(e) {
  var v = e.length;
  if (v % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var c = e.indexOf("=");
  c === -1 && (c = v);
  var x = c === v ? 0 : 4 - c % 4;
  return [c, x];
}
function Qt(e) {
  var v = Ct(e), c = v[0], x = v[1];
  return (c + x) * 3 / 4 - x;
}
function It(e, v, c) {
  return (v + c) * 3 / 4 - c;
}
function Jt(e) {
  var v, c = Ct(e), x = c[0], A = c[1], C = new Zt(It(e, x, A)), b = 0, i = A > 0 ? x - 4 : x, E;
  for (E = 0; E < i; E += 4)
    v = h0[e.charCodeAt(E)] << 18 | h0[e.charCodeAt(E + 1)] << 12 | h0[e.charCodeAt(E + 2)] << 6 | h0[e.charCodeAt(E + 3)], C[b++] = v >> 16 & 255, C[b++] = v >> 8 & 255, C[b++] = v & 255;
  return A === 2 && (v = h0[e.charCodeAt(E)] << 2 | h0[e.charCodeAt(E + 1)] >> 4, C[b++] = v & 255), A === 1 && (v = h0[e.charCodeAt(E)] << 10 | h0[e.charCodeAt(E + 1)] << 4 | h0[e.charCodeAt(E + 2)] >> 2, C[b++] = v >> 8 & 255, C[b++] = v & 255), C;
}
function Lt(e) {
  return d0[e >> 18 & 63] + d0[e >> 12 & 63] + d0[e >> 6 & 63] + d0[e & 63];
}
function re(e, v, c) {
  for (var x, A = [], C = v; C < c; C += 3)
    x = (e[C] << 16 & 16711680) + (e[C + 1] << 8 & 65280) + (e[C + 2] & 255), A.push(Lt(x));
  return A.join("");
}
function te(e) {
  for (var v, c = e.length, x = c % 3, A = [], C = 16383, b = 0, i = c - x; b < i; b += C)
    A.push(re(e, b, b + C > i ? i : b + C));
  return x === 1 ? (v = e[c - 1], A.push(
    d0[v >> 2] + d0[v << 4 & 63] + "=="
  )) : x === 2 && (v = (e[c - 2] << 8) + e[c - 1], A.push(
    d0[v >> 10] + d0[v >> 4 & 63] + d0[v << 2 & 63] + "="
  )), A.join("");
}
var gr = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
gr.read = function(e, v, c, x, A) {
  var C, b, i = A * 8 - x - 1, E = (1 << i) - 1, a = E >> 1, s = -7, _ = c ? A - 1 : 0, f = c ? -1 : 1, l = e[v + _];
  for (_ += f, C = l & (1 << -s) - 1, l >>= -s, s += i; s > 0; C = C * 256 + e[v + _], _ += f, s -= 8)
    ;
  for (b = C & (1 << -s) - 1, C >>= -s, s += x; s > 0; b = b * 256 + e[v + _], _ += f, s -= 8)
    ;
  if (C === 0)
    C = 1 - a;
  else {
    if (C === E)
      return b ? NaN : (l ? -1 : 1) * (1 / 0);
    b = b + Math.pow(2, x), C = C - a;
  }
  return (l ? -1 : 1) * b * Math.pow(2, C - x);
};
gr.write = function(e, v, c, x, A, C) {
  var b, i, E, a = C * 8 - A - 1, s = (1 << a) - 1, _ = s >> 1, f = A === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, l = x ? 0 : C - 1, d = x ? 1 : -1, F = v < 0 || v === 0 && 1 / v < 0 ? 1 : 0;
  for (v = Math.abs(v), isNaN(v) || v === 1 / 0 ? (i = isNaN(v) ? 1 : 0, b = s) : (b = Math.floor(Math.log(v) / Math.LN2), v * (E = Math.pow(2, -b)) < 1 && (b--, E *= 2), b + _ >= 1 ? v += f / E : v += f * Math.pow(2, 1 - _), v * E >= 2 && (b++, E /= 2), b + _ >= s ? (i = 0, b = s) : b + _ >= 1 ? (i = (v * E - 1) * Math.pow(2, A), b = b + _) : (i = v * Math.pow(2, _ - 1) * Math.pow(2, A), b = 0)); A >= 8; e[c + l] = i & 255, l += d, i /= 256, A -= 8)
    ;
  for (b = b << A | i, a += A; a > 0; e[c + l] = b & 255, l += d, b /= 256, a -= 8)
    ;
  e[c + l - d] |= F * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(e) {
  const v = U0, c = gr, x = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  e.Buffer = i, e.SlowBuffer = u, e.INSPECT_MAX_BYTES = 50;
  const A = 2147483647;
  e.kMaxLength = A, i.TYPED_ARRAY_SUPPORT = C(), !i.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function C() {
    try {
      const n = new Uint8Array(1), r = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(r, Uint8Array.prototype), Object.setPrototypeOf(n, r), n.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(i.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (i.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(i.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (i.isBuffer(this))
        return this.byteOffset;
    }
  });
  function b(n) {
    if (n > A)
      throw new RangeError('The value "' + n + '" is invalid for option "size"');
    const r = new Uint8Array(n);
    return Object.setPrototypeOf(r, i.prototype), r;
  }
  function i(n, r, t) {
    if (typeof n == "number") {
      if (typeof r == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return _(n);
    }
    return E(n, r, t);
  }
  i.poolSize = 8192;
  function E(n, r, t) {
    if (typeof n == "string")
      return f(n, r);
    if (ArrayBuffer.isView(n))
      return d(n);
    if (n == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof n
      );
    if (i0(n, ArrayBuffer) || n && i0(n.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (i0(n, SharedArrayBuffer) || n && i0(n.buffer, SharedArrayBuffer)))
      return F(n, r, t);
    if (typeof n == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const o = n.valueOf && n.valueOf();
    if (o != null && o !== n)
      return i.from(o, r, t);
    const y = B(n);
    if (y) return y;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof n[Symbol.toPrimitive] == "function")
      return i.from(n[Symbol.toPrimitive]("string"), r, t);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof n
    );
  }
  i.from = function(n, r, t) {
    return E(n, r, t);
  }, Object.setPrototypeOf(i.prototype, Uint8Array.prototype), Object.setPrototypeOf(i, Uint8Array);
  function a(n) {
    if (typeof n != "number")
      throw new TypeError('"size" argument must be of type number');
    if (n < 0)
      throw new RangeError('The value "' + n + '" is invalid for option "size"');
  }
  function s(n, r, t) {
    return a(n), n <= 0 ? b(n) : r !== void 0 ? typeof t == "string" ? b(n).fill(r, t) : b(n).fill(r) : b(n);
  }
  i.alloc = function(n, r, t) {
    return s(n, r, t);
  };
  function _(n) {
    return a(n), b(n < 0 ? 0 : w(n) | 0);
  }
  i.allocUnsafe = function(n) {
    return _(n);
  }, i.allocUnsafeSlow = function(n) {
    return _(n);
  };
  function f(n, r) {
    if ((typeof r != "string" || r === "") && (r = "utf8"), !i.isEncoding(r))
      throw new TypeError("Unknown encoding: " + r);
    const t = h(n, r) | 0;
    let o = b(t);
    const y = o.write(n, r);
    return y !== t && (o = o.slice(0, y)), o;
  }
  function l(n) {
    const r = n.length < 0 ? 0 : w(n.length) | 0, t = b(r);
    for (let o = 0; o < r; o += 1)
      t[o] = n[o] & 255;
    return t;
  }
  function d(n) {
    if (i0(n, Uint8Array)) {
      const r = new Uint8Array(n);
      return F(r.buffer, r.byteOffset, r.byteLength);
    }
    return l(n);
  }
  function F(n, r, t) {
    if (r < 0 || n.byteLength < r)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (n.byteLength < r + (t || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let o;
    return r === void 0 && t === void 0 ? o = new Uint8Array(n) : t === void 0 ? o = new Uint8Array(n, r) : o = new Uint8Array(n, r, t), Object.setPrototypeOf(o, i.prototype), o;
  }
  function B(n) {
    if (i.isBuffer(n)) {
      const r = w(n.length) | 0, t = b(r);
      return t.length === 0 || n.copy(t, 0, 0, r), t;
    }
    if (n.length !== void 0)
      return typeof n.length != "number" || u0(n.length) ? b(0) : l(n);
    if (n.type === "Buffer" && Array.isArray(n.data))
      return l(n.data);
  }
  function w(n) {
    if (n >= A)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + A.toString(16) + " bytes");
    return n | 0;
  }
  function u(n) {
    return +n != n && (n = 0), i.alloc(+n);
  }
  i.isBuffer = function(r) {
    return r != null && r._isBuffer === !0 && r !== i.prototype;
  }, i.compare = function(r, t) {
    if (i0(r, Uint8Array) && (r = i.from(r, r.offset, r.byteLength)), i0(t, Uint8Array) && (t = i.from(t, t.offset, t.byteLength)), !i.isBuffer(r) || !i.isBuffer(t))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (r === t) return 0;
    let o = r.length, y = t.length;
    for (let k = 0, N = Math.min(o, y); k < N; ++k)
      if (r[k] !== t[k]) {
        o = r[k], y = t[k];
        break;
      }
    return o < y ? -1 : y < o ? 1 : 0;
  }, i.isEncoding = function(r) {
    switch (String(r).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }, i.concat = function(r, t) {
    if (!Array.isArray(r))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (r.length === 0)
      return i.alloc(0);
    let o;
    if (t === void 0)
      for (t = 0, o = 0; o < r.length; ++o)
        t += r[o].length;
    const y = i.allocUnsafe(t);
    let k = 0;
    for (o = 0; o < r.length; ++o) {
      let N = r[o];
      if (i0(N, Uint8Array))
        k + N.length > y.length ? (i.isBuffer(N) || (N = i.from(N)), N.copy(y, k)) : Uint8Array.prototype.set.call(
          y,
          N,
          k
        );
      else if (i.isBuffer(N))
        N.copy(y, k);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      k += N.length;
    }
    return y;
  };
  function h(n, r) {
    if (i.isBuffer(n))
      return n.length;
    if (ArrayBuffer.isView(n) || i0(n, ArrayBuffer))
      return n.byteLength;
    if (typeof n != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof n
      );
    const t = n.length, o = arguments.length > 2 && arguments[2] === !0;
    if (!o && t === 0) return 0;
    let y = !1;
    for (; ; )
      switch (r) {
        case "ascii":
        case "latin1":
        case "binary":
          return t;
        case "utf8":
        case "utf-8":
          return E0(n).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return t * 2;
        case "hex":
          return t >>> 1;
        case "base64":
          return A0(n).length;
        default:
          if (y)
            return o ? -1 : E0(n).length;
          r = ("" + r).toLowerCase(), y = !0;
      }
  }
  i.byteLength = h;
  function p(n, r, t) {
    let o = !1;
    if ((r === void 0 || r < 0) && (r = 0), r > this.length || ((t === void 0 || t > this.length) && (t = this.length), t <= 0) || (t >>>= 0, r >>>= 0, t <= r))
      return "";
    for (n || (n = "utf8"); ; )
      switch (n) {
        case "hex":
          return J(this, r, t);
        case "utf8":
        case "utf-8":
          return M(this, r, t);
        case "ascii":
          return L(this, r, t);
        case "latin1":
        case "binary":
          return Z(this, r, t);
        case "base64":
          return z(this, r, t);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Y(this, r, t);
        default:
          if (o) throw new TypeError("Unknown encoding: " + n);
          n = (n + "").toLowerCase(), o = !0;
      }
  }
  i.prototype._isBuffer = !0;
  function D(n, r, t) {
    const o = n[r];
    n[r] = n[t], n[t] = o;
  }
  i.prototype.swap16 = function() {
    const r = this.length;
    if (r % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let t = 0; t < r; t += 2)
      D(this, t, t + 1);
    return this;
  }, i.prototype.swap32 = function() {
    const r = this.length;
    if (r % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let t = 0; t < r; t += 4)
      D(this, t, t + 3), D(this, t + 1, t + 2);
    return this;
  }, i.prototype.swap64 = function() {
    const r = this.length;
    if (r % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let t = 0; t < r; t += 8)
      D(this, t, t + 7), D(this, t + 1, t + 6), D(this, t + 2, t + 5), D(this, t + 3, t + 4);
    return this;
  }, i.prototype.toString = function() {
    const r = this.length;
    return r === 0 ? "" : arguments.length === 0 ? M(this, 0, r) : p.apply(this, arguments);
  }, i.prototype.toLocaleString = i.prototype.toString, i.prototype.equals = function(r) {
    if (!i.isBuffer(r)) throw new TypeError("Argument must be a Buffer");
    return this === r ? !0 : i.compare(this, r) === 0;
  }, i.prototype.inspect = function() {
    let r = "";
    const t = e.INSPECT_MAX_BYTES;
    return r = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (r += " ... "), "<Buffer " + r + ">";
  }, x && (i.prototype[x] = i.prototype.inspect), i.prototype.compare = function(r, t, o, y, k) {
    if (i0(r, Uint8Array) && (r = i.from(r, r.offset, r.byteLength)), !i.isBuffer(r))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof r
      );
    if (t === void 0 && (t = 0), o === void 0 && (o = r ? r.length : 0), y === void 0 && (y = 0), k === void 0 && (k = this.length), t < 0 || o > r.length || y < 0 || k > this.length)
      throw new RangeError("out of range index");
    if (y >= k && t >= o)
      return 0;
    if (y >= k)
      return -1;
    if (t >= o)
      return 1;
    if (t >>>= 0, o >>>= 0, y >>>= 0, k >>>= 0, this === r) return 0;
    let N = k - y, K = o - t;
    const e0 = Math.min(N, K), t0 = this.slice(y, k), n0 = r.slice(t, o);
    for (let Q = 0; Q < e0; ++Q)
      if (t0[Q] !== n0[Q]) {
        N = t0[Q], K = n0[Q];
        break;
      }
    return N < K ? -1 : K < N ? 1 : 0;
  };
  function m(n, r, t, o, y) {
    if (n.length === 0) return -1;
    if (typeof t == "string" ? (o = t, t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), t = +t, u0(t) && (t = y ? 0 : n.length - 1), t < 0 && (t = n.length + t), t >= n.length) {
      if (y) return -1;
      t = n.length - 1;
    } else if (t < 0)
      if (y) t = 0;
      else return -1;
    if (typeof r == "string" && (r = i.from(r, o)), i.isBuffer(r))
      return r.length === 0 ? -1 : R(n, r, t, o, y);
    if (typeof r == "number")
      return r = r & 255, typeof Uint8Array.prototype.indexOf == "function" ? y ? Uint8Array.prototype.indexOf.call(n, r, t) : Uint8Array.prototype.lastIndexOf.call(n, r, t) : R(n, [r], t, o, y);
    throw new TypeError("val must be string, number or Buffer");
  }
  function R(n, r, t, o, y) {
    let k = 1, N = n.length, K = r.length;
    if (o !== void 0 && (o = String(o).toLowerCase(), o === "ucs2" || o === "ucs-2" || o === "utf16le" || o === "utf-16le")) {
      if (n.length < 2 || r.length < 2)
        return -1;
      k = 2, N /= 2, K /= 2, t /= 2;
    }
    function e0(n0, Q) {
      return k === 1 ? n0[Q] : n0.readUInt16BE(Q * k);
    }
    let t0;
    if (y) {
      let n0 = -1;
      for (t0 = t; t0 < N; t0++)
        if (e0(n, t0) === e0(r, n0 === -1 ? 0 : t0 - n0)) {
          if (n0 === -1 && (n0 = t0), t0 - n0 + 1 === K) return n0 * k;
        } else
          n0 !== -1 && (t0 -= t0 - n0), n0 = -1;
    } else
      for (t + K > N && (t = N - K), t0 = t; t0 >= 0; t0--) {
        let n0 = !0;
        for (let Q = 0; Q < K; Q++)
          if (e0(n, t0 + Q) !== e0(r, Q)) {
            n0 = !1;
            break;
          }
        if (n0) return t0;
      }
    return -1;
  }
  i.prototype.includes = function(r, t, o) {
    return this.indexOf(r, t, o) !== -1;
  }, i.prototype.indexOf = function(r, t, o) {
    return m(this, r, t, o, !0);
  }, i.prototype.lastIndexOf = function(r, t, o) {
    return m(this, r, t, o, !1);
  };
  function T(n, r, t, o) {
    t = Number(t) || 0;
    const y = n.length - t;
    o ? (o = Number(o), o > y && (o = y)) : o = y;
    const k = r.length;
    o > k / 2 && (o = k / 2);
    let N;
    for (N = 0; N < o; ++N) {
      const K = parseInt(r.substr(N * 2, 2), 16);
      if (u0(K)) return N;
      n[t + N] = K;
    }
    return N;
  }
  function W(n, r, t, o) {
    return s0(E0(r, n.length - t), n, t, o);
  }
  function g(n, r, t, o) {
    return s0(g0(r), n, t, o);
  }
  function S(n, r, t, o) {
    return s0(A0(r), n, t, o);
  }
  function P(n, r, t, o) {
    return s0(S0(r, n.length - t), n, t, o);
  }
  i.prototype.write = function(r, t, o, y) {
    if (t === void 0)
      y = "utf8", o = this.length, t = 0;
    else if (o === void 0 && typeof t == "string")
      y = t, o = this.length, t = 0;
    else if (isFinite(t))
      t = t >>> 0, isFinite(o) ? (o = o >>> 0, y === void 0 && (y = "utf8")) : (y = o, o = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const k = this.length - t;
    if ((o === void 0 || o > k) && (o = k), r.length > 0 && (o < 0 || t < 0) || t > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    y || (y = "utf8");
    let N = !1;
    for (; ; )
      switch (y) {
        case "hex":
          return T(this, r, t, o);
        case "utf8":
        case "utf-8":
          return W(this, r, t, o);
        case "ascii":
        case "latin1":
        case "binary":
          return g(this, r, t, o);
        case "base64":
          return S(this, r, t, o);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return P(this, r, t, o);
        default:
          if (N) throw new TypeError("Unknown encoding: " + y);
          y = ("" + y).toLowerCase(), N = !0;
      }
  }, i.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function z(n, r, t) {
    return r === 0 && t === n.length ? v.fromByteArray(n) : v.fromByteArray(n.slice(r, t));
  }
  function M(n, r, t) {
    t = Math.min(n.length, t);
    const o = [];
    let y = r;
    for (; y < t; ) {
      const k = n[y];
      let N = null, K = k > 239 ? 4 : k > 223 ? 3 : k > 191 ? 2 : 1;
      if (y + K <= t) {
        let e0, t0, n0, Q;
        switch (K) {
          case 1:
            k < 128 && (N = k);
            break;
          case 2:
            e0 = n[y + 1], (e0 & 192) === 128 && (Q = (k & 31) << 6 | e0 & 63, Q > 127 && (N = Q));
            break;
          case 3:
            e0 = n[y + 1], t0 = n[y + 2], (e0 & 192) === 128 && (t0 & 192) === 128 && (Q = (k & 15) << 12 | (e0 & 63) << 6 | t0 & 63, Q > 2047 && (Q < 55296 || Q > 57343) && (N = Q));
            break;
          case 4:
            e0 = n[y + 1], t0 = n[y + 2], n0 = n[y + 3], (e0 & 192) === 128 && (t0 & 192) === 128 && (n0 & 192) === 128 && (Q = (k & 15) << 18 | (e0 & 63) << 12 | (t0 & 63) << 6 | n0 & 63, Q > 65535 && Q < 1114112 && (N = Q));
        }
      }
      N === null ? (N = 65533, K = 1) : N > 65535 && (N -= 65536, o.push(N >>> 10 & 1023 | 55296), N = 56320 | N & 1023), o.push(N), y += K;
    }
    return G(o);
  }
  const V = 4096;
  function G(n) {
    const r = n.length;
    if (r <= V)
      return String.fromCharCode.apply(String, n);
    let t = "", o = 0;
    for (; o < r; )
      t += String.fromCharCode.apply(
        String,
        n.slice(o, o += V)
      );
    return t;
  }
  function L(n, r, t) {
    let o = "";
    t = Math.min(n.length, t);
    for (let y = r; y < t; ++y)
      o += String.fromCharCode(n[y] & 127);
    return o;
  }
  function Z(n, r, t) {
    let o = "";
    t = Math.min(n.length, t);
    for (let y = r; y < t; ++y)
      o += String.fromCharCode(n[y]);
    return o;
  }
  function J(n, r, t) {
    const o = n.length;
    (!r || r < 0) && (r = 0), (!t || t < 0 || t > o) && (t = o);
    let y = "";
    for (let k = r; k < t; ++k)
      y += m0[n[k]];
    return y;
  }
  function Y(n, r, t) {
    const o = n.slice(r, t);
    let y = "";
    for (let k = 0; k < o.length - 1; k += 2)
      y += String.fromCharCode(o[k] + o[k + 1] * 256);
    return y;
  }
  i.prototype.slice = function(r, t) {
    const o = this.length;
    r = ~~r, t = t === void 0 ? o : ~~t, r < 0 ? (r += o, r < 0 && (r = 0)) : r > o && (r = o), t < 0 ? (t += o, t < 0 && (t = 0)) : t > o && (t = o), t < r && (t = r);
    const y = this.subarray(r, t);
    return Object.setPrototypeOf(y, i.prototype), y;
  };
  function H(n, r, t) {
    if (n % 1 !== 0 || n < 0) throw new RangeError("offset is not uint");
    if (n + r > t) throw new RangeError("Trying to access beyond buffer length");
  }
  i.prototype.readUintLE = i.prototype.readUIntLE = function(r, t, o) {
    r = r >>> 0, t = t >>> 0, o || H(r, t, this.length);
    let y = this[r], k = 1, N = 0;
    for (; ++N < t && (k *= 256); )
      y += this[r + N] * k;
    return y;
  }, i.prototype.readUintBE = i.prototype.readUIntBE = function(r, t, o) {
    r = r >>> 0, t = t >>> 0, o || H(r, t, this.length);
    let y = this[r + --t], k = 1;
    for (; t > 0 && (k *= 256); )
      y += this[r + --t] * k;
    return y;
  }, i.prototype.readUint8 = i.prototype.readUInt8 = function(r, t) {
    return r = r >>> 0, t || H(r, 1, this.length), this[r];
  }, i.prototype.readUint16LE = i.prototype.readUInt16LE = function(r, t) {
    return r = r >>> 0, t || H(r, 2, this.length), this[r] | this[r + 1] << 8;
  }, i.prototype.readUint16BE = i.prototype.readUInt16BE = function(r, t) {
    return r = r >>> 0, t || H(r, 2, this.length), this[r] << 8 | this[r + 1];
  }, i.prototype.readUint32LE = i.prototype.readUInt32LE = function(r, t) {
    return r = r >>> 0, t || H(r, 4, this.length), (this[r] | this[r + 1] << 8 | this[r + 2] << 16) + this[r + 3] * 16777216;
  }, i.prototype.readUint32BE = i.prototype.readUInt32BE = function(r, t) {
    return r = r >>> 0, t || H(r, 4, this.length), this[r] * 16777216 + (this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3]);
  }, i.prototype.readBigUInt64LE = l0(function(r) {
    r = r >>> 0, a0(r, "offset");
    const t = this[r], o = this[r + 7];
    (t === void 0 || o === void 0) && x0(r, this.length - 8);
    const y = t + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24, k = this[++r] + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + o * 2 ** 24;
    return BigInt(y) + (BigInt(k) << BigInt(32));
  }), i.prototype.readBigUInt64BE = l0(function(r) {
    r = r >>> 0, a0(r, "offset");
    const t = this[r], o = this[r + 7];
    (t === void 0 || o === void 0) && x0(r, this.length - 8);
    const y = t * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r], k = this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + o;
    return (BigInt(y) << BigInt(32)) + BigInt(k);
  }), i.prototype.readIntLE = function(r, t, o) {
    r = r >>> 0, t = t >>> 0, o || H(r, t, this.length);
    let y = this[r], k = 1, N = 0;
    for (; ++N < t && (k *= 256); )
      y += this[r + N] * k;
    return k *= 128, y >= k && (y -= Math.pow(2, 8 * t)), y;
  }, i.prototype.readIntBE = function(r, t, o) {
    r = r >>> 0, t = t >>> 0, o || H(r, t, this.length);
    let y = t, k = 1, N = this[r + --y];
    for (; y > 0 && (k *= 256); )
      N += this[r + --y] * k;
    return k *= 128, N >= k && (N -= Math.pow(2, 8 * t)), N;
  }, i.prototype.readInt8 = function(r, t) {
    return r = r >>> 0, t || H(r, 1, this.length), this[r] & 128 ? (255 - this[r] + 1) * -1 : this[r];
  }, i.prototype.readInt16LE = function(r, t) {
    r = r >>> 0, t || H(r, 2, this.length);
    const o = this[r] | this[r + 1] << 8;
    return o & 32768 ? o | 4294901760 : o;
  }, i.prototype.readInt16BE = function(r, t) {
    r = r >>> 0, t || H(r, 2, this.length);
    const o = this[r + 1] | this[r] << 8;
    return o & 32768 ? o | 4294901760 : o;
  }, i.prototype.readInt32LE = function(r, t) {
    return r = r >>> 0, t || H(r, 4, this.length), this[r] | this[r + 1] << 8 | this[r + 2] << 16 | this[r + 3] << 24;
  }, i.prototype.readInt32BE = function(r, t) {
    return r = r >>> 0, t || H(r, 4, this.length), this[r] << 24 | this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3];
  }, i.prototype.readBigInt64LE = l0(function(r) {
    r = r >>> 0, a0(r, "offset");
    const t = this[r], o = this[r + 7];
    (t === void 0 || o === void 0) && x0(r, this.length - 8);
    const y = this[r + 4] + this[r + 5] * 2 ** 8 + this[r + 6] * 2 ** 16 + (o << 24);
    return (BigInt(y) << BigInt(32)) + BigInt(t + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24);
  }), i.prototype.readBigInt64BE = l0(function(r) {
    r = r >>> 0, a0(r, "offset");
    const t = this[r], o = this[r + 7];
    (t === void 0 || o === void 0) && x0(r, this.length - 8);
    const y = (t << 24) + // Overflow
    this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r];
    return (BigInt(y) << BigInt(32)) + BigInt(this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + o);
  }), i.prototype.readFloatLE = function(r, t) {
    return r = r >>> 0, t || H(r, 4, this.length), c.read(this, r, !0, 23, 4);
  }, i.prototype.readFloatBE = function(r, t) {
    return r = r >>> 0, t || H(r, 4, this.length), c.read(this, r, !1, 23, 4);
  }, i.prototype.readDoubleLE = function(r, t) {
    return r = r >>> 0, t || H(r, 8, this.length), c.read(this, r, !0, 52, 8);
  }, i.prototype.readDoubleBE = function(r, t) {
    return r = r >>> 0, t || H(r, 8, this.length), c.read(this, r, !1, 52, 8);
  };
  function U(n, r, t, o, y, k) {
    if (!i.isBuffer(n)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (r > y || r < k) throw new RangeError('"value" argument is out of bounds');
    if (t + o > n.length) throw new RangeError("Index out of range");
  }
  i.prototype.writeUintLE = i.prototype.writeUIntLE = function(r, t, o, y) {
    if (r = +r, t = t >>> 0, o = o >>> 0, !y) {
      const K = Math.pow(2, 8 * o) - 1;
      U(this, r, t, o, K, 0);
    }
    let k = 1, N = 0;
    for (this[t] = r & 255; ++N < o && (k *= 256); )
      this[t + N] = r / k & 255;
    return t + o;
  }, i.prototype.writeUintBE = i.prototype.writeUIntBE = function(r, t, o, y) {
    if (r = +r, t = t >>> 0, o = o >>> 0, !y) {
      const K = Math.pow(2, 8 * o) - 1;
      U(this, r, t, o, K, 0);
    }
    let k = o - 1, N = 1;
    for (this[t + k] = r & 255; --k >= 0 && (N *= 256); )
      this[t + k] = r / N & 255;
    return t + o;
  }, i.prototype.writeUint8 = i.prototype.writeUInt8 = function(r, t, o) {
    return r = +r, t = t >>> 0, o || U(this, r, t, 1, 255, 0), this[t] = r & 255, t + 1;
  }, i.prototype.writeUint16LE = i.prototype.writeUInt16LE = function(r, t, o) {
    return r = +r, t = t >>> 0, o || U(this, r, t, 2, 65535, 0), this[t] = r & 255, this[t + 1] = r >>> 8, t + 2;
  }, i.prototype.writeUint16BE = i.prototype.writeUInt16BE = function(r, t, o) {
    return r = +r, t = t >>> 0, o || U(this, r, t, 2, 65535, 0), this[t] = r >>> 8, this[t + 1] = r & 255, t + 2;
  }, i.prototype.writeUint32LE = i.prototype.writeUInt32LE = function(r, t, o) {
    return r = +r, t = t >>> 0, o || U(this, r, t, 4, 4294967295, 0), this[t + 3] = r >>> 24, this[t + 2] = r >>> 16, this[t + 1] = r >>> 8, this[t] = r & 255, t + 4;
  }, i.prototype.writeUint32BE = i.prototype.writeUInt32BE = function(r, t, o) {
    return r = +r, t = t >>> 0, o || U(this, r, t, 4, 4294967295, 0), this[t] = r >>> 24, this[t + 1] = r >>> 16, this[t + 2] = r >>> 8, this[t + 3] = r & 255, t + 4;
  };
  function O(n, r, t, o, y) {
    v0(r, o, y, n, t, 7);
    let k = Number(r & BigInt(4294967295));
    n[t++] = k, k = k >> 8, n[t++] = k, k = k >> 8, n[t++] = k, k = k >> 8, n[t++] = k;
    let N = Number(r >> BigInt(32) & BigInt(4294967295));
    return n[t++] = N, N = N >> 8, n[t++] = N, N = N >> 8, n[t++] = N, N = N >> 8, n[t++] = N, t;
  }
  function q(n, r, t, o, y) {
    v0(r, o, y, n, t, 7);
    let k = Number(r & BigInt(4294967295));
    n[t + 7] = k, k = k >> 8, n[t + 6] = k, k = k >> 8, n[t + 5] = k, k = k >> 8, n[t + 4] = k;
    let N = Number(r >> BigInt(32) & BigInt(4294967295));
    return n[t + 3] = N, N = N >> 8, n[t + 2] = N, N = N >> 8, n[t + 1] = N, N = N >> 8, n[t] = N, t + 8;
  }
  i.prototype.writeBigUInt64LE = l0(function(r, t = 0) {
    return O(this, r, t, BigInt(0), BigInt("0xffffffffffffffff"));
  }), i.prototype.writeBigUInt64BE = l0(function(r, t = 0) {
    return q(this, r, t, BigInt(0), BigInt("0xffffffffffffffff"));
  }), i.prototype.writeIntLE = function(r, t, o, y) {
    if (r = +r, t = t >>> 0, !y) {
      const e0 = Math.pow(2, 8 * o - 1);
      U(this, r, t, o, e0 - 1, -e0);
    }
    let k = 0, N = 1, K = 0;
    for (this[t] = r & 255; ++k < o && (N *= 256); )
      r < 0 && K === 0 && this[t + k - 1] !== 0 && (K = 1), this[t + k] = (r / N >> 0) - K & 255;
    return t + o;
  }, i.prototype.writeIntBE = function(r, t, o, y) {
    if (r = +r, t = t >>> 0, !y) {
      const e0 = Math.pow(2, 8 * o - 1);
      U(this, r, t, o, e0 - 1, -e0);
    }
    let k = o - 1, N = 1, K = 0;
    for (this[t + k] = r & 255; --k >= 0 && (N *= 256); )
      r < 0 && K === 0 && this[t + k + 1] !== 0 && (K = 1), this[t + k] = (r / N >> 0) - K & 255;
    return t + o;
  }, i.prototype.writeInt8 = function(r, t, o) {
    return r = +r, t = t >>> 0, o || U(this, r, t, 1, 127, -128), r < 0 && (r = 255 + r + 1), this[t] = r & 255, t + 1;
  }, i.prototype.writeInt16LE = function(r, t, o) {
    return r = +r, t = t >>> 0, o || U(this, r, t, 2, 32767, -32768), this[t] = r & 255, this[t + 1] = r >>> 8, t + 2;
  }, i.prototype.writeInt16BE = function(r, t, o) {
    return r = +r, t = t >>> 0, o || U(this, r, t, 2, 32767, -32768), this[t] = r >>> 8, this[t + 1] = r & 255, t + 2;
  }, i.prototype.writeInt32LE = function(r, t, o) {
    return r = +r, t = t >>> 0, o || U(this, r, t, 4, 2147483647, -2147483648), this[t] = r & 255, this[t + 1] = r >>> 8, this[t + 2] = r >>> 16, this[t + 3] = r >>> 24, t + 4;
  }, i.prototype.writeInt32BE = function(r, t, o) {
    return r = +r, t = t >>> 0, o || U(this, r, t, 4, 2147483647, -2147483648), r < 0 && (r = 4294967295 + r + 1), this[t] = r >>> 24, this[t + 1] = r >>> 16, this[t + 2] = r >>> 8, this[t + 3] = r & 255, t + 4;
  }, i.prototype.writeBigInt64LE = l0(function(r, t = 0) {
    return O(this, r, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), i.prototype.writeBigInt64BE = l0(function(r, t = 0) {
    return q(this, r, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function r0(n, r, t, o, y, k) {
    if (t + o > n.length) throw new RangeError("Index out of range");
    if (t < 0) throw new RangeError("Index out of range");
  }
  function I(n, r, t, o, y) {
    return r = +r, t = t >>> 0, y || r0(n, r, t, 4), c.write(n, r, t, o, 23, 4), t + 4;
  }
  i.prototype.writeFloatLE = function(r, t, o) {
    return I(this, r, t, !0, o);
  }, i.prototype.writeFloatBE = function(r, t, o) {
    return I(this, r, t, !1, o);
  };
  function c0(n, r, t, o, y) {
    return r = +r, t = t >>> 0, y || r0(n, r, t, 8), c.write(n, r, t, o, 52, 8), t + 8;
  }
  i.prototype.writeDoubleLE = function(r, t, o) {
    return c0(this, r, t, !0, o);
  }, i.prototype.writeDoubleBE = function(r, t, o) {
    return c0(this, r, t, !1, o);
  }, i.prototype.copy = function(r, t, o, y) {
    if (!i.isBuffer(r)) throw new TypeError("argument should be a Buffer");
    if (o || (o = 0), !y && y !== 0 && (y = this.length), t >= r.length && (t = r.length), t || (t = 0), y > 0 && y < o && (y = o), y === o || r.length === 0 || this.length === 0) return 0;
    if (t < 0)
      throw new RangeError("targetStart out of bounds");
    if (o < 0 || o >= this.length) throw new RangeError("Index out of range");
    if (y < 0) throw new RangeError("sourceEnd out of bounds");
    y > this.length && (y = this.length), r.length - t < y - o && (y = r.length - t + o);
    const k = y - o;
    return this === r && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, o, y) : Uint8Array.prototype.set.call(
      r,
      this.subarray(o, y),
      t
    ), k;
  }, i.prototype.fill = function(r, t, o, y) {
    if (typeof r == "string") {
      if (typeof t == "string" ? (y = t, t = 0, o = this.length) : typeof o == "string" && (y = o, o = this.length), y !== void 0 && typeof y != "string")
        throw new TypeError("encoding must be a string");
      if (typeof y == "string" && !i.isEncoding(y))
        throw new TypeError("Unknown encoding: " + y);
      if (r.length === 1) {
        const N = r.charCodeAt(0);
        (y === "utf8" && N < 128 || y === "latin1") && (r = N);
      }
    } else typeof r == "number" ? r = r & 255 : typeof r == "boolean" && (r = Number(r));
    if (t < 0 || this.length < t || this.length < o)
      throw new RangeError("Out of range index");
    if (o <= t)
      return this;
    t = t >>> 0, o = o === void 0 ? this.length : o >>> 0, r || (r = 0);
    let k;
    if (typeof r == "number")
      for (k = t; k < o; ++k)
        this[k] = r;
    else {
      const N = i.isBuffer(r) ? r : i.from(r, y), K = N.length;
      if (K === 0)
        throw new TypeError('The value "' + r + '" is invalid for argument "value"');
      for (k = 0; k < o - t; ++k)
        this[k + t] = N[k % K];
    }
    return this;
  };
  const $ = {};
  function p0(n, r, t) {
    $[n] = class extends t {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: r.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${n}]`, this.stack, delete this.name;
      }
      get code() {
        return n;
      }
      set code(y) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: y,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${n}]: ${this.message}`;
      }
    };
  }
  p0(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(n) {
      return n ? `${n} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), p0(
    "ERR_INVALID_ARG_TYPE",
    function(n, r) {
      return `The "${n}" argument must be of type number. Received type ${typeof r}`;
    },
    TypeError
  ), p0(
    "ERR_OUT_OF_RANGE",
    function(n, r, t) {
      let o = `The value of "${n}" is out of range.`, y = t;
      return Number.isInteger(t) && Math.abs(t) > 2 ** 32 ? y = B0(String(t)) : typeof t == "bigint" && (y = String(t), (t > BigInt(2) ** BigInt(32) || t < -(BigInt(2) ** BigInt(32))) && (y = B0(y)), y += "n"), o += ` It must be ${r}. Received ${y}`, o;
    },
    RangeError
  );
  function B0(n) {
    let r = "", t = n.length;
    const o = n[0] === "-" ? 1 : 0;
    for (; t >= o + 4; t -= 3)
      r = `_${n.slice(t - 3, t)}${r}`;
    return `${n.slice(0, t)}${r}`;
  }
  function R0(n, r, t) {
    a0(r, "offset"), (n[r] === void 0 || n[r + t] === void 0) && x0(r, n.length - (t + 1));
  }
  function v0(n, r, t, o, y, k) {
    if (n > t || n < r) {
      const N = typeof r == "bigint" ? "n" : "";
      let K;
      throw r === 0 || r === BigInt(0) ? K = `>= 0${N} and < 2${N} ** ${(k + 1) * 8}${N}` : K = `>= -(2${N} ** ${(k + 1) * 8 - 1}${N}) and < 2 ** ${(k + 1) * 8 - 1}${N}`, new $.ERR_OUT_OF_RANGE("value", K, n);
    }
    R0(o, y, k);
  }
  function a0(n, r) {
    if (typeof n != "number")
      throw new $.ERR_INVALID_ARG_TYPE(r, "number", n);
  }
  function x0(n, r, t) {
    throw Math.floor(n) !== n ? (a0(n, t), new $.ERR_OUT_OF_RANGE("offset", "an integer", n)) : r < 0 ? new $.ERR_BUFFER_OUT_OF_BOUNDS() : new $.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${r}`,
      n
    );
  }
  const D0 = /[^+/0-9A-Za-z-_]/g;
  function _0(n) {
    if (n = n.split("=")[0], n = n.trim().replace(D0, ""), n.length < 2) return "";
    for (; n.length % 4 !== 0; )
      n = n + "=";
    return n;
  }
  function E0(n, r) {
    r = r || 1 / 0;
    let t;
    const o = n.length;
    let y = null;
    const k = [];
    for (let N = 0; N < o; ++N) {
      if (t = n.charCodeAt(N), t > 55295 && t < 57344) {
        if (!y) {
          if (t > 56319) {
            (r -= 3) > -1 && k.push(239, 191, 189);
            continue;
          } else if (N + 1 === o) {
            (r -= 3) > -1 && k.push(239, 191, 189);
            continue;
          }
          y = t;
          continue;
        }
        if (t < 56320) {
          (r -= 3) > -1 && k.push(239, 191, 189), y = t;
          continue;
        }
        t = (y - 55296 << 10 | t - 56320) + 65536;
      } else y && (r -= 3) > -1 && k.push(239, 191, 189);
      if (y = null, t < 128) {
        if ((r -= 1) < 0) break;
        k.push(t);
      } else if (t < 2048) {
        if ((r -= 2) < 0) break;
        k.push(
          t >> 6 | 192,
          t & 63 | 128
        );
      } else if (t < 65536) {
        if ((r -= 3) < 0) break;
        k.push(
          t >> 12 | 224,
          t >> 6 & 63 | 128,
          t & 63 | 128
        );
      } else if (t < 1114112) {
        if ((r -= 4) < 0) break;
        k.push(
          t >> 18 | 240,
          t >> 12 & 63 | 128,
          t >> 6 & 63 | 128,
          t & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return k;
  }
  function g0(n) {
    const r = [];
    for (let t = 0; t < n.length; ++t)
      r.push(n.charCodeAt(t) & 255);
    return r;
  }
  function S0(n, r) {
    let t, o, y;
    const k = [];
    for (let N = 0; N < n.length && !((r -= 2) < 0); ++N)
      t = n.charCodeAt(N), o = t >> 8, y = t % 256, k.push(y), k.push(o);
    return k;
  }
  function A0(n) {
    return v.toByteArray(_0(n));
  }
  function s0(n, r, t, o) {
    let y;
    for (y = 0; y < o && !(y + t >= r.length || y >= n.length); ++y)
      r[y + t] = n[y];
    return y;
  }
  function i0(n, r) {
    return n instanceof r || n != null && n.constructor != null && n.constructor.name != null && n.constructor.name === r.name;
  }
  function u0(n) {
    return n !== n;
  }
  const m0 = function() {
    const n = "0123456789abcdef", r = new Array(256);
    for (let t = 0; t < 16; ++t) {
      const o = t * 16;
      for (let y = 0; y < 16; ++y)
        r[o + y] = n[t] + n[y];
    }
    return r;
  }();
  function l0(n) {
    return typeof BigInt > "u" ? C0 : n;
  }
  function C0() {
    throw new Error("BigInt not supported");
  }
})(T0);
var Ft = { exports: {} };
function ee(e) {
  throw new Error('Could not dynamically require "' + e + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var q0 = { exports: {} };
const ne = {}, ie = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ne
}, Symbol.toStringTag, { value: "Module" })), xe = /* @__PURE__ */ jt(ie);
var Ur;
function j() {
  return Ur || (Ur = 1, function(e, v) {
    (function(c, x) {
      e.exports = x();
    })(X, function() {
      var c = c || function(x, A) {
        var C;
        if (typeof window < "u" && window.crypto && (C = window.crypto), typeof self < "u" && self.crypto && (C = self.crypto), typeof globalThis < "u" && globalThis.crypto && (C = globalThis.crypto), !C && typeof window < "u" && window.msCrypto && (C = window.msCrypto), !C && typeof globalThis < "u" && globalThis.crypto && (C = globalThis.crypto), !C && typeof ee == "function")
          try {
            C = xe;
          } catch {
          }
        var b = function() {
          if (C) {
            if (typeof C.getRandomValues == "function")
              try {
                return C.getRandomValues(new Uint32Array(1))[0];
              } catch {
              }
            if (typeof C.randomBytes == "function")
              try {
                return C.randomBytes(4).readInt32LE();
              } catch {
              }
          }
          throw new Error("Native crypto module could not be used to get secure random number.");
        }, i = Object.create || /* @__PURE__ */ function() {
          function u() {
          }
          return function(h) {
            var p;
            return u.prototype = h, p = new u(), u.prototype = null, p;
          };
        }(), E = {}, a = E.lib = {}, s = a.Base = /* @__PURE__ */ function() {
          return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function(u) {
              var h = i(this);
              return u && h.mixIn(u), (!h.hasOwnProperty("init") || this.init === h.init) && (h.init = function() {
                h.$super.init.apply(this, arguments);
              }), h.init.prototype = h, h.$super = this, h;
            },
            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function() {
              var u = this.extend();
              return u.init.apply(u, arguments), u;
            },
            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function() {
            },
            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function(u) {
              for (var h in u)
                u.hasOwnProperty(h) && (this[h] = u[h]);
              u.hasOwnProperty("toString") && (this.toString = u.toString);
            },
            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function() {
              return this.init.prototype.extend(this);
            }
          };
        }(), _ = a.WordArray = s.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of 32-bit words.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.create();
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
           */
          init: function(u, h) {
            u = this.words = u || [], h != A ? this.sigBytes = h : this.sigBytes = u.length * 4;
          },
          /**
           * Converts this word array to a string.
           *
           * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
           *
           * @return {string} The stringified word array.
           *
           * @example
           *
           *     var string = wordArray + '';
           *     var string = wordArray.toString();
           *     var string = wordArray.toString(CryptoJS.enc.Utf8);
           */
          toString: function(u) {
            return (u || l).stringify(this);
          },
          /**
           * Concatenates a word array to this word array.
           *
           * @param {WordArray} wordArray The word array to append.
           *
           * @return {WordArray} This word array.
           *
           * @example
           *
           *     wordArray1.concat(wordArray2);
           */
          concat: function(u) {
            var h = this.words, p = u.words, D = this.sigBytes, m = u.sigBytes;
            if (this.clamp(), D % 4)
              for (var R = 0; R < m; R++) {
                var T = p[R >>> 2] >>> 24 - R % 4 * 8 & 255;
                h[D + R >>> 2] |= T << 24 - (D + R) % 4 * 8;
              }
            else
              for (var W = 0; W < m; W += 4)
                h[D + W >>> 2] = p[W >>> 2];
            return this.sigBytes += m, this;
          },
          /**
           * Removes insignificant bits.
           *
           * @example
           *
           *     wordArray.clamp();
           */
          clamp: function() {
            var u = this.words, h = this.sigBytes;
            u[h >>> 2] &= 4294967295 << 32 - h % 4 * 8, u.length = x.ceil(h / 4);
          },
          /**
           * Creates a copy of this word array.
           *
           * @return {WordArray} The clone.
           *
           * @example
           *
           *     var clone = wordArray.clone();
           */
          clone: function() {
            var u = s.clone.call(this);
            return u.words = this.words.slice(0), u;
          },
          /**
           * Creates a word array filled with random bytes.
           *
           * @param {number} nBytes The number of random bytes to generate.
           *
           * @return {WordArray} The random word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.random(16);
           */
          random: function(u) {
            for (var h = [], p = 0; p < u; p += 4)
              h.push(b());
            return new _.init(h, u);
          }
        }), f = E.enc = {}, l = f.Hex = {
          /**
           * Converts a word array to a hex string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The hex string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
           */
          stringify: function(u) {
            for (var h = u.words, p = u.sigBytes, D = [], m = 0; m < p; m++) {
              var R = h[m >>> 2] >>> 24 - m % 4 * 8 & 255;
              D.push((R >>> 4).toString(16)), D.push((R & 15).toString(16));
            }
            return D.join("");
          },
          /**
           * Converts a hex string to a word array.
           *
           * @param {string} hexStr The hex string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
           */
          parse: function(u) {
            for (var h = u.length, p = [], D = 0; D < h; D += 2)
              p[D >>> 3] |= parseInt(u.substr(D, 2), 16) << 24 - D % 8 * 4;
            return new _.init(p, h / 2);
          }
        }, d = f.Latin1 = {
          /**
           * Converts a word array to a Latin1 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Latin1 string.
           *
           * @static
           *
           * @example
           *
           *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
           */
          stringify: function(u) {
            for (var h = u.words, p = u.sigBytes, D = [], m = 0; m < p; m++) {
              var R = h[m >>> 2] >>> 24 - m % 4 * 8 & 255;
              D.push(String.fromCharCode(R));
            }
            return D.join("");
          },
          /**
           * Converts a Latin1 string to a word array.
           *
           * @param {string} latin1Str The Latin1 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
           */
          parse: function(u) {
            for (var h = u.length, p = [], D = 0; D < h; D++)
              p[D >>> 2] |= (u.charCodeAt(D) & 255) << 24 - D % 4 * 8;
            return new _.init(p, h);
          }
        }, F = f.Utf8 = {
          /**
           * Converts a word array to a UTF-8 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-8 string.
           *
           * @static
           *
           * @example
           *
           *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
           */
          stringify: function(u) {
            try {
              return decodeURIComponent(escape(d.stringify(u)));
            } catch {
              throw new Error("Malformed UTF-8 data");
            }
          },
          /**
           * Converts a UTF-8 string to a word array.
           *
           * @param {string} utf8Str The UTF-8 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
           */
          parse: function(u) {
            return d.parse(unescape(encodeURIComponent(u)));
          }
        }, B = a.BufferedBlockAlgorithm = s.extend({
          /**
           * Resets this block algorithm's data buffer to its initial state.
           *
           * @example
           *
           *     bufferedBlockAlgorithm.reset();
           */
          reset: function() {
            this._data = new _.init(), this._nDataBytes = 0;
          },
          /**
           * Adds new data to this block algorithm's buffer.
           *
           * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
           *
           * @example
           *
           *     bufferedBlockAlgorithm._append('data');
           *     bufferedBlockAlgorithm._append(wordArray);
           */
          _append: function(u) {
            typeof u == "string" && (u = F.parse(u)), this._data.concat(u), this._nDataBytes += u.sigBytes;
          },
          /**
           * Processes available data blocks.
           *
           * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
           *
           * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
           *
           * @return {WordArray} The processed data.
           *
           * @example
           *
           *     var processedData = bufferedBlockAlgorithm._process();
           *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
           */
          _process: function(u) {
            var h, p = this._data, D = p.words, m = p.sigBytes, R = this.blockSize, T = R * 4, W = m / T;
            u ? W = x.ceil(W) : W = x.max((W | 0) - this._minBufferSize, 0);
            var g = W * R, S = x.min(g * 4, m);
            if (g) {
              for (var P = 0; P < g; P += R)
                this._doProcessBlock(D, P);
              h = D.splice(0, g), p.sigBytes -= S;
            }
            return new _.init(h, S);
          },
          /**
           * Creates a copy of this object.
           *
           * @return {Object} The clone.
           *
           * @example
           *
           *     var clone = bufferedBlockAlgorithm.clone();
           */
          clone: function() {
            var u = s.clone.call(this);
            return u._data = this._data.clone(), u;
          },
          _minBufferSize: 0
        });
        a.Hasher = B.extend({
          /**
           * Configuration options.
           */
          cfg: s.extend(),
          /**
           * Initializes a newly created hasher.
           *
           * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
           *
           * @example
           *
           *     var hasher = CryptoJS.algo.SHA256.create();
           */
          init: function(u) {
            this.cfg = this.cfg.extend(u), this.reset();
          },
          /**
           * Resets this hasher to its initial state.
           *
           * @example
           *
           *     hasher.reset();
           */
          reset: function() {
            B.reset.call(this), this._doReset();
          },
          /**
           * Updates this hasher with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {Hasher} This hasher.
           *
           * @example
           *
           *     hasher.update('message');
           *     hasher.update(wordArray);
           */
          update: function(u) {
            return this._append(u), this._process(), this;
          },
          /**
           * Finalizes the hash computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The hash.
           *
           * @example
           *
           *     var hash = hasher.finalize();
           *     var hash = hasher.finalize('message');
           *     var hash = hasher.finalize(wordArray);
           */
          finalize: function(u) {
            u && this._append(u);
            var h = this._doFinalize();
            return h;
          },
          blockSize: 16,
          /**
           * Creates a shortcut function to a hasher's object interface.
           *
           * @param {Hasher} hasher The hasher to create a helper for.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
           */
          _createHelper: function(u) {
            return function(h, p) {
              return new u.init(p).finalize(h);
            };
          },
          /**
           * Creates a shortcut function to the HMAC's object interface.
           *
           * @param {Hasher} hasher The hasher to use in this HMAC helper.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
           */
          _createHmacHelper: function(u) {
            return function(h, p) {
              return new w.HMAC.init(u, p).finalize(h);
            };
          }
        });
        var w = E.algo = {};
        return E;
      }(Math);
      return c;
    });
  }(q0)), q0.exports;
}
var O0 = { exports: {} }, Pr;
function P0() {
  return Pr || (Pr = 1, function(e, v) {
    (function(c, x) {
      e.exports = x(j());
    })(X, function(c) {
      return function(x) {
        var A = c, C = A.lib, b = C.Base, i = C.WordArray, E = A.x64 = {};
        E.Word = b.extend({
          /**
           * Initializes a newly created 64-bit word.
           *
           * @param {number} high The high 32 bits.
           * @param {number} low The low 32 bits.
           *
           * @example
           *
           *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
           */
          init: function(a, s) {
            this.high = a, this.low = s;
          }
          /**
           * Bitwise NOTs this word.
           *
           * @return {X64Word} A new x64-Word object after negating.
           *
           * @example
           *
           *     var negated = x64Word.not();
           */
          // not: function () {
          // var high = ~this.high;
          // var low = ~this.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise ANDs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to AND with this word.
           *
           * @return {X64Word} A new x64-Word object after ANDing.
           *
           * @example
           *
           *     var anded = x64Word.and(anotherX64Word);
           */
          // and: function (word) {
          // var high = this.high & word.high;
          // var low = this.low & word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise ORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to OR with this word.
           *
           * @return {X64Word} A new x64-Word object after ORing.
           *
           * @example
           *
           *     var ored = x64Word.or(anotherX64Word);
           */
          // or: function (word) {
          // var high = this.high | word.high;
          // var low = this.low | word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise XORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to XOR with this word.
           *
           * @return {X64Word} A new x64-Word object after XORing.
           *
           * @example
           *
           *     var xored = x64Word.xor(anotherX64Word);
           */
          // xor: function (word) {
          // var high = this.high ^ word.high;
          // var low = this.low ^ word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Shifts this word n bits to the left.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftL(25);
           */
          // shiftL: function (n) {
          // if (n < 32) {
          // var high = (this.high << n) | (this.low >>> (32 - n));
          // var low = this.low << n;
          // } else {
          // var high = this.low << (n - 32);
          // var low = 0;
          // }
          // return X64Word.create(high, low);
          // },
          /**
           * Shifts this word n bits to the right.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftR(7);
           */
          // shiftR: function (n) {
          // if (n < 32) {
          // var low = (this.low >>> n) | (this.high << (32 - n));
          // var high = this.high >>> n;
          // } else {
          // var low = this.high >>> (n - 32);
          // var high = 0;
          // }
          // return X64Word.create(high, low);
          // },
          /**
           * Rotates this word n bits to the left.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotL(25);
           */
          // rotL: function (n) {
          // return this.shiftL(n).or(this.shiftR(64 - n));
          // },
          /**
           * Rotates this word n bits to the right.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotR(7);
           */
          // rotR: function (n) {
          // return this.shiftR(n).or(this.shiftL(64 - n));
          // },
          /**
           * Adds this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to add with this word.
           *
           * @return {X64Word} A new x64-Word object after adding.
           *
           * @example
           *
           *     var added = x64Word.add(anotherX64Word);
           */
          // add: function (word) {
          // var low = (this.low + word.low) | 0;
          // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
          // var high = (this.high + word.high + carry) | 0;
          // return X64Word.create(high, low);
          // }
        }), E.WordArray = b.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.x64.WordArray.create();
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ]);
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ], 10);
           */
          init: function(a, s) {
            a = this.words = a || [], s != x ? this.sigBytes = s : this.sigBytes = a.length * 8;
          },
          /**
           * Converts this 64-bit word array to a 32-bit word array.
           *
           * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
           *
           * @example
           *
           *     var x32WordArray = x64WordArray.toX32();
           */
          toX32: function() {
            for (var a = this.words, s = a.length, _ = [], f = 0; f < s; f++) {
              var l = a[f];
              _.push(l.high), _.push(l.low);
            }
            return i.create(_, this.sigBytes);
          },
          /**
           * Creates a copy of this word array.
           *
           * @return {X64WordArray} The clone.
           *
           * @example
           *
           *     var clone = x64WordArray.clone();
           */
          clone: function() {
            for (var a = b.clone.call(this), s = a.words = this.words.slice(0), _ = s.length, f = 0; f < _; f++)
              s[f] = s[f].clone();
            return a;
          }
        });
      }(), c;
    });
  }(O0)), O0.exports;
}
var W0 = { exports: {} }, zr;
function ae() {
  return zr || (zr = 1, function(e, v) {
    (function(c, x) {
      e.exports = x(j());
    })(X, function(c) {
      return function() {
        if (typeof ArrayBuffer == "function") {
          var x = c, A = x.lib, C = A.WordArray, b = C.init, i = C.init = function(E) {
            if (E instanceof ArrayBuffer && (E = new Uint8Array(E)), (E instanceof Int8Array || typeof Uint8ClampedArray < "u" && E instanceof Uint8ClampedArray || E instanceof Int16Array || E instanceof Uint16Array || E instanceof Int32Array || E instanceof Uint32Array || E instanceof Float32Array || E instanceof Float64Array) && (E = new Uint8Array(E.buffer, E.byteOffset, E.byteLength)), E instanceof Uint8Array) {
              for (var a = E.byteLength, s = [], _ = 0; _ < a; _++)
                s[_ >>> 2] |= E[_] << 24 - _ % 4 * 8;
              b.call(this, s, a);
            } else
              b.apply(this, arguments);
          };
          i.prototype = C;
        }
      }(), c.lib.WordArray;
    });
  }(W0)), W0.exports;
}
var M0 = { exports: {} }, qr;
function oe() {
  return qr || (qr = 1, function(e, v) {
    (function(c, x) {
      e.exports = x(j());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.WordArray, b = x.enc;
        b.Utf16 = b.Utf16BE = {
          /**
           * Converts a word array to a UTF-16 BE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 BE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
           */
          stringify: function(E) {
            for (var a = E.words, s = E.sigBytes, _ = [], f = 0; f < s; f += 2) {
              var l = a[f >>> 2] >>> 16 - f % 4 * 8 & 65535;
              _.push(String.fromCharCode(l));
            }
            return _.join("");
          },
          /**
           * Converts a UTF-16 BE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 BE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
           */
          parse: function(E) {
            for (var a = E.length, s = [], _ = 0; _ < a; _++)
              s[_ >>> 1] |= E.charCodeAt(_) << 16 - _ % 2 * 16;
            return C.create(s, a * 2);
          }
        }, b.Utf16LE = {
          /**
           * Converts a word array to a UTF-16 LE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 LE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
           */
          stringify: function(E) {
            for (var a = E.words, s = E.sigBytes, _ = [], f = 0; f < s; f += 2) {
              var l = i(a[f >>> 2] >>> 16 - f % 4 * 8 & 65535);
              _.push(String.fromCharCode(l));
            }
            return _.join("");
          },
          /**
           * Converts a UTF-16 LE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 LE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
           */
          parse: function(E) {
            for (var a = E.length, s = [], _ = 0; _ < a; _++)
              s[_ >>> 1] |= i(E.charCodeAt(_) << 16 - _ % 2 * 16);
            return C.create(s, a * 2);
          }
        };
        function i(E) {
          return E << 8 & 4278255360 | E >>> 8 & 16711935;
        }
      }(), c.enc.Utf16;
    });
  }(M0)), M0.exports;
}
var V0 = { exports: {} }, Or;
function w0() {
  return Or || (Or = 1, function(e, v) {
    (function(c, x) {
      e.exports = x(j());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.WordArray, b = x.enc;
        b.Base64 = {
          /**
           * Converts a word array to a Base64 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Base64 string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
           */
          stringify: function(E) {
            var a = E.words, s = E.sigBytes, _ = this._map;
            E.clamp();
            for (var f = [], l = 0; l < s; l += 3)
              for (var d = a[l >>> 2] >>> 24 - l % 4 * 8 & 255, F = a[l + 1 >>> 2] >>> 24 - (l + 1) % 4 * 8 & 255, B = a[l + 2 >>> 2] >>> 24 - (l + 2) % 4 * 8 & 255, w = d << 16 | F << 8 | B, u = 0; u < 4 && l + u * 0.75 < s; u++)
                f.push(_.charAt(w >>> 6 * (3 - u) & 63));
            var h = _.charAt(64);
            if (h)
              for (; f.length % 4; )
                f.push(h);
            return f.join("");
          },
          /**
           * Converts a Base64 string to a word array.
           *
           * @param {string} base64Str The Base64 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
           */
          parse: function(E) {
            var a = E.length, s = this._map, _ = this._reverseMap;
            if (!_) {
              _ = this._reverseMap = [];
              for (var f = 0; f < s.length; f++)
                _[s.charCodeAt(f)] = f;
            }
            var l = s.charAt(64);
            if (l) {
              var d = E.indexOf(l);
              d !== -1 && (a = d);
            }
            return i(E, a, _);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        };
        function i(E, a, s) {
          for (var _ = [], f = 0, l = 0; l < a; l++)
            if (l % 4) {
              var d = s[E.charCodeAt(l - 1)] << l % 4 * 2, F = s[E.charCodeAt(l)] >>> 6 - l % 4 * 2, B = d | F;
              _[f >>> 2] |= B << 24 - f % 4 * 8, f++;
            }
          return C.create(_, f);
        }
      }(), c.enc.Base64;
    });
  }(V0)), V0.exports;
}
var $0 = { exports: {} }, Wr;
function ce() {
  return Wr || (Wr = 1, function(e, v) {
    (function(c, x) {
      e.exports = x(j());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.WordArray, b = x.enc;
        b.Base64url = {
          /**
           * Converts a word array to a Base64url string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {string} The Base64url string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
           */
          stringify: function(E, a) {
            a === void 0 && (a = !0);
            var s = E.words, _ = E.sigBytes, f = a ? this._safe_map : this._map;
            E.clamp();
            for (var l = [], d = 0; d < _; d += 3)
              for (var F = s[d >>> 2] >>> 24 - d % 4 * 8 & 255, B = s[d + 1 >>> 2] >>> 24 - (d + 1) % 4 * 8 & 255, w = s[d + 2 >>> 2] >>> 24 - (d + 2) % 4 * 8 & 255, u = F << 16 | B << 8 | w, h = 0; h < 4 && d + h * 0.75 < _; h++)
                l.push(f.charAt(u >>> 6 * (3 - h) & 63));
            var p = f.charAt(64);
            if (p)
              for (; l.length % 4; )
                l.push(p);
            return l.join("");
          },
          /**
           * Converts a Base64url string to a word array.
           *
           * @param {string} base64Str The Base64url string.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
           */
          parse: function(E, a) {
            a === void 0 && (a = !0);
            var s = E.length, _ = a ? this._safe_map : this._map, f = this._reverseMap;
            if (!f) {
              f = this._reverseMap = [];
              for (var l = 0; l < _.length; l++)
                f[_.charCodeAt(l)] = l;
            }
            var d = _.charAt(64);
            if (d) {
              var F = E.indexOf(d);
              F !== -1 && (s = F);
            }
            return i(E, s, f);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
          _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
        };
        function i(E, a, s) {
          for (var _ = [], f = 0, l = 0; l < a; l++)
            if (l % 4) {
              var d = s[E.charCodeAt(l - 1)] << l % 4 * 2, F = s[E.charCodeAt(l)] >>> 6 - l % 4 * 2, B = d | F;
              _[f >>> 2] |= B << 24 - f % 4 * 8, f++;
            }
          return C.create(_, f);
        }
      }(), c.enc.Base64url;
    });
  }($0)), $0.exports;
}
var G0 = { exports: {} }, Mr;
function b0() {
  return Mr || (Mr = 1, function(e, v) {
    (function(c, x) {
      e.exports = x(j());
    })(X, function(c) {
      return function(x) {
        var A = c, C = A.lib, b = C.WordArray, i = C.Hasher, E = A.algo, a = [];
        (function() {
          for (var F = 0; F < 64; F++)
            a[F] = x.abs(x.sin(F + 1)) * 4294967296 | 0;
        })();
        var s = E.MD5 = i.extend({
          _doReset: function() {
            this._hash = new b.init([
              1732584193,
              4023233417,
              2562383102,
              271733878
            ]);
          },
          _doProcessBlock: function(F, B) {
            for (var w = 0; w < 16; w++) {
              var u = B + w, h = F[u];
              F[u] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360;
            }
            var p = this._hash.words, D = F[B + 0], m = F[B + 1], R = F[B + 2], T = F[B + 3], W = F[B + 4], g = F[B + 5], S = F[B + 6], P = F[B + 7], z = F[B + 8], M = F[B + 9], V = F[B + 10], G = F[B + 11], L = F[B + 12], Z = F[B + 13], J = F[B + 14], Y = F[B + 15], H = p[0], U = p[1], O = p[2], q = p[3];
            H = _(H, U, O, q, D, 7, a[0]), q = _(q, H, U, O, m, 12, a[1]), O = _(O, q, H, U, R, 17, a[2]), U = _(U, O, q, H, T, 22, a[3]), H = _(H, U, O, q, W, 7, a[4]), q = _(q, H, U, O, g, 12, a[5]), O = _(O, q, H, U, S, 17, a[6]), U = _(U, O, q, H, P, 22, a[7]), H = _(H, U, O, q, z, 7, a[8]), q = _(q, H, U, O, M, 12, a[9]), O = _(O, q, H, U, V, 17, a[10]), U = _(U, O, q, H, G, 22, a[11]), H = _(H, U, O, q, L, 7, a[12]), q = _(q, H, U, O, Z, 12, a[13]), O = _(O, q, H, U, J, 17, a[14]), U = _(U, O, q, H, Y, 22, a[15]), H = f(H, U, O, q, m, 5, a[16]), q = f(q, H, U, O, S, 9, a[17]), O = f(O, q, H, U, G, 14, a[18]), U = f(U, O, q, H, D, 20, a[19]), H = f(H, U, O, q, g, 5, a[20]), q = f(q, H, U, O, V, 9, a[21]), O = f(O, q, H, U, Y, 14, a[22]), U = f(U, O, q, H, W, 20, a[23]), H = f(H, U, O, q, M, 5, a[24]), q = f(q, H, U, O, J, 9, a[25]), O = f(O, q, H, U, T, 14, a[26]), U = f(U, O, q, H, z, 20, a[27]), H = f(H, U, O, q, Z, 5, a[28]), q = f(q, H, U, O, R, 9, a[29]), O = f(O, q, H, U, P, 14, a[30]), U = f(U, O, q, H, L, 20, a[31]), H = l(H, U, O, q, g, 4, a[32]), q = l(q, H, U, O, z, 11, a[33]), O = l(O, q, H, U, G, 16, a[34]), U = l(U, O, q, H, J, 23, a[35]), H = l(H, U, O, q, m, 4, a[36]), q = l(q, H, U, O, W, 11, a[37]), O = l(O, q, H, U, P, 16, a[38]), U = l(U, O, q, H, V, 23, a[39]), H = l(H, U, O, q, Z, 4, a[40]), q = l(q, H, U, O, D, 11, a[41]), O = l(O, q, H, U, T, 16, a[42]), U = l(U, O, q, H, S, 23, a[43]), H = l(H, U, O, q, M, 4, a[44]), q = l(q, H, U, O, L, 11, a[45]), O = l(O, q, H, U, Y, 16, a[46]), U = l(U, O, q, H, R, 23, a[47]), H = d(H, U, O, q, D, 6, a[48]), q = d(q, H, U, O, P, 10, a[49]), O = d(O, q, H, U, J, 15, a[50]), U = d(U, O, q, H, g, 21, a[51]), H = d(H, U, O, q, L, 6, a[52]), q = d(q, H, U, O, T, 10, a[53]), O = d(O, q, H, U, V, 15, a[54]), U = d(U, O, q, H, m, 21, a[55]), H = d(H, U, O, q, z, 6, a[56]), q = d(q, H, U, O, Y, 10, a[57]), O = d(O, q, H, U, S, 15, a[58]), U = d(U, O, q, H, Z, 21, a[59]), H = d(H, U, O, q, W, 6, a[60]), q = d(q, H, U, O, G, 10, a[61]), O = d(O, q, H, U, R, 15, a[62]), U = d(U, O, q, H, M, 21, a[63]), p[0] = p[0] + H | 0, p[1] = p[1] + U | 0, p[2] = p[2] + O | 0, p[3] = p[3] + q | 0;
          },
          _doFinalize: function() {
            var F = this._data, B = F.words, w = this._nDataBytes * 8, u = F.sigBytes * 8;
            B[u >>> 5] |= 128 << 24 - u % 32;
            var h = x.floor(w / 4294967296), p = w;
            B[(u + 64 >>> 9 << 4) + 15] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360, B[(u + 64 >>> 9 << 4) + 14] = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360, F.sigBytes = (B.length + 1) * 4, this._process();
            for (var D = this._hash, m = D.words, R = 0; R < 4; R++) {
              var T = m[R];
              m[R] = (T << 8 | T >>> 24) & 16711935 | (T << 24 | T >>> 8) & 4278255360;
            }
            return D;
          },
          clone: function() {
            var F = i.clone.call(this);
            return F._hash = this._hash.clone(), F;
          }
        });
        function _(F, B, w, u, h, p, D) {
          var m = F + (B & w | ~B & u) + h + D;
          return (m << p | m >>> 32 - p) + B;
        }
        function f(F, B, w, u, h, p, D) {
          var m = F + (B & u | w & ~u) + h + D;
          return (m << p | m >>> 32 - p) + B;
        }
        function l(F, B, w, u, h, p, D) {
          var m = F + (B ^ w ^ u) + h + D;
          return (m << p | m >>> 32 - p) + B;
        }
        function d(F, B, w, u, h, p, D) {
          var m = F + (w ^ (B | ~u)) + h + D;
          return (m << p | m >>> 32 - p) + B;
        }
        A.MD5 = i._createHelper(s), A.HmacMD5 = i._createHmacHelper(s);
      }(Math), c.MD5;
    });
  }(G0)), G0.exports;
}
var K0 = { exports: {} }, Vr;
function yt() {
  return Vr || (Vr = 1, function(e, v) {
    (function(c, x) {
      e.exports = x(j());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.WordArray, b = A.Hasher, i = x.algo, E = [], a = i.SHA1 = b.extend({
          _doReset: function() {
            this._hash = new C.init([
              1732584193,
              4023233417,
              2562383102,
              271733878,
              3285377520
            ]);
          },
          _doProcessBlock: function(s, _) {
            for (var f = this._hash.words, l = f[0], d = f[1], F = f[2], B = f[3], w = f[4], u = 0; u < 80; u++) {
              if (u < 16)
                E[u] = s[_ + u] | 0;
              else {
                var h = E[u - 3] ^ E[u - 8] ^ E[u - 14] ^ E[u - 16];
                E[u] = h << 1 | h >>> 31;
              }
              var p = (l << 5 | l >>> 27) + w + E[u];
              u < 20 ? p += (d & F | ~d & B) + 1518500249 : u < 40 ? p += (d ^ F ^ B) + 1859775393 : u < 60 ? p += (d & F | d & B | F & B) - 1894007588 : p += (d ^ F ^ B) - 899497514, w = B, B = F, F = d << 30 | d >>> 2, d = l, l = p;
            }
            f[0] = f[0] + l | 0, f[1] = f[1] + d | 0, f[2] = f[2] + F | 0, f[3] = f[3] + B | 0, f[4] = f[4] + w | 0;
          },
          _doFinalize: function() {
            var s = this._data, _ = s.words, f = this._nDataBytes * 8, l = s.sigBytes * 8;
            return _[l >>> 5] |= 128 << 24 - l % 32, _[(l + 64 >>> 9 << 4) + 14] = Math.floor(f / 4294967296), _[(l + 64 >>> 9 << 4) + 15] = f, s.sigBytes = _.length * 4, this._process(), this._hash;
          },
          clone: function() {
            var s = b.clone.call(this);
            return s._hash = this._hash.clone(), s;
          }
        });
        x.SHA1 = b._createHelper(a), x.HmacSHA1 = b._createHmacHelper(a);
      }(), c.SHA1;
    });
  }(K0)), K0.exports;
}
var X0 = { exports: {} }, $r;
function wr() {
  return $r || ($r = 1, function(e, v) {
    (function(c, x) {
      e.exports = x(j());
    })(X, function(c) {
      return function(x) {
        var A = c, C = A.lib, b = C.WordArray, i = C.Hasher, E = A.algo, a = [], s = [];
        (function() {
          function l(w) {
            for (var u = x.sqrt(w), h = 2; h <= u; h++)
              if (!(w % h))
                return !1;
            return !0;
          }
          function d(w) {
            return (w - (w | 0)) * 4294967296 | 0;
          }
          for (var F = 2, B = 0; B < 64; )
            l(F) && (B < 8 && (a[B] = d(x.pow(F, 1 / 2))), s[B] = d(x.pow(F, 1 / 3)), B++), F++;
        })();
        var _ = [], f = E.SHA256 = i.extend({
          _doReset: function() {
            this._hash = new b.init(a.slice(0));
          },
          _doProcessBlock: function(l, d) {
            for (var F = this._hash.words, B = F[0], w = F[1], u = F[2], h = F[3], p = F[4], D = F[5], m = F[6], R = F[7], T = 0; T < 64; T++) {
              if (T < 16)
                _[T] = l[d + T] | 0;
              else {
                var W = _[T - 15], g = (W << 25 | W >>> 7) ^ (W << 14 | W >>> 18) ^ W >>> 3, S = _[T - 2], P = (S << 15 | S >>> 17) ^ (S << 13 | S >>> 19) ^ S >>> 10;
                _[T] = g + _[T - 7] + P + _[T - 16];
              }
              var z = p & D ^ ~p & m, M = B & w ^ B & u ^ w & u, V = (B << 30 | B >>> 2) ^ (B << 19 | B >>> 13) ^ (B << 10 | B >>> 22), G = (p << 26 | p >>> 6) ^ (p << 21 | p >>> 11) ^ (p << 7 | p >>> 25), L = R + G + z + s[T] + _[T], Z = V + M;
              R = m, m = D, D = p, p = h + L | 0, h = u, u = w, w = B, B = L + Z | 0;
            }
            F[0] = F[0] + B | 0, F[1] = F[1] + w | 0, F[2] = F[2] + u | 0, F[3] = F[3] + h | 0, F[4] = F[4] + p | 0, F[5] = F[5] + D | 0, F[6] = F[6] + m | 0, F[7] = F[7] + R | 0;
          },
          _doFinalize: function() {
            var l = this._data, d = l.words, F = this._nDataBytes * 8, B = l.sigBytes * 8;
            return d[B >>> 5] |= 128 << 24 - B % 32, d[(B + 64 >>> 9 << 4) + 14] = x.floor(F / 4294967296), d[(B + 64 >>> 9 << 4) + 15] = F, l.sigBytes = d.length * 4, this._process(), this._hash;
          },
          clone: function() {
            var l = i.clone.call(this);
            return l._hash = this._hash.clone(), l;
          }
        });
        A.SHA256 = i._createHelper(f), A.HmacSHA256 = i._createHmacHelper(f);
      }(Math), c.SHA256;
    });
  }(X0)), X0.exports;
}
var j0 = { exports: {} }, Gr;
function se() {
  return Gr || (Gr = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), wr());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.WordArray, b = x.algo, i = b.SHA256, E = b.SHA224 = i.extend({
          _doReset: function() {
            this._hash = new C.init([
              3238371032,
              914150663,
              812702999,
              4144912697,
              4290775857,
              1750603025,
              1694076839,
              3204075428
            ]);
          },
          _doFinalize: function() {
            var a = i._doFinalize.call(this);
            return a.sigBytes -= 4, a;
          }
        });
        x.SHA224 = i._createHelper(E), x.HmacSHA224 = i._createHmacHelper(E);
      }(), c.SHA224;
    });
  }(j0)), j0.exports;
}
var Z0 = { exports: {} }, Kr;
function _t() {
  return Kr || (Kr = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), P0());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.Hasher, b = x.x64, i = b.Word, E = b.WordArray, a = x.algo;
        function s() {
          return i.create.apply(i, arguments);
        }
        var _ = [
          s(1116352408, 3609767458),
          s(1899447441, 602891725),
          s(3049323471, 3964484399),
          s(3921009573, 2173295548),
          s(961987163, 4081628472),
          s(1508970993, 3053834265),
          s(2453635748, 2937671579),
          s(2870763221, 3664609560),
          s(3624381080, 2734883394),
          s(310598401, 1164996542),
          s(607225278, 1323610764),
          s(1426881987, 3590304994),
          s(1925078388, 4068182383),
          s(2162078206, 991336113),
          s(2614888103, 633803317),
          s(3248222580, 3479774868),
          s(3835390401, 2666613458),
          s(4022224774, 944711139),
          s(264347078, 2341262773),
          s(604807628, 2007800933),
          s(770255983, 1495990901),
          s(1249150122, 1856431235),
          s(1555081692, 3175218132),
          s(1996064986, 2198950837),
          s(2554220882, 3999719339),
          s(2821834349, 766784016),
          s(2952996808, 2566594879),
          s(3210313671, 3203337956),
          s(3336571891, 1034457026),
          s(3584528711, 2466948901),
          s(113926993, 3758326383),
          s(338241895, 168717936),
          s(666307205, 1188179964),
          s(773529912, 1546045734),
          s(1294757372, 1522805485),
          s(1396182291, 2643833823),
          s(1695183700, 2343527390),
          s(1986661051, 1014477480),
          s(2177026350, 1206759142),
          s(2456956037, 344077627),
          s(2730485921, 1290863460),
          s(2820302411, 3158454273),
          s(3259730800, 3505952657),
          s(3345764771, 106217008),
          s(3516065817, 3606008344),
          s(3600352804, 1432725776),
          s(4094571909, 1467031594),
          s(275423344, 851169720),
          s(430227734, 3100823752),
          s(506948616, 1363258195),
          s(659060556, 3750685593),
          s(883997877, 3785050280),
          s(958139571, 3318307427),
          s(1322822218, 3812723403),
          s(1537002063, 2003034995),
          s(1747873779, 3602036899),
          s(1955562222, 1575990012),
          s(2024104815, 1125592928),
          s(2227730452, 2716904306),
          s(2361852424, 442776044),
          s(2428436474, 593698344),
          s(2756734187, 3733110249),
          s(3204031479, 2999351573),
          s(3329325298, 3815920427),
          s(3391569614, 3928383900),
          s(3515267271, 566280711),
          s(3940187606, 3454069534),
          s(4118630271, 4000239992),
          s(116418474, 1914138554),
          s(174292421, 2731055270),
          s(289380356, 3203993006),
          s(460393269, 320620315),
          s(685471733, 587496836),
          s(852142971, 1086792851),
          s(1017036298, 365543100),
          s(1126000580, 2618297676),
          s(1288033470, 3409855158),
          s(1501505948, 4234509866),
          s(1607167915, 987167468),
          s(1816402316, 1246189591)
        ], f = [];
        (function() {
          for (var d = 0; d < 80; d++)
            f[d] = s();
        })();
        var l = a.SHA512 = C.extend({
          _doReset: function() {
            this._hash = new E.init([
              new i.init(1779033703, 4089235720),
              new i.init(3144134277, 2227873595),
              new i.init(1013904242, 4271175723),
              new i.init(2773480762, 1595750129),
              new i.init(1359893119, 2917565137),
              new i.init(2600822924, 725511199),
              new i.init(528734635, 4215389547),
              new i.init(1541459225, 327033209)
            ]);
          },
          _doProcessBlock: function(d, F) {
            for (var B = this._hash.words, w = B[0], u = B[1], h = B[2], p = B[3], D = B[4], m = B[5], R = B[6], T = B[7], W = w.high, g = w.low, S = u.high, P = u.low, z = h.high, M = h.low, V = p.high, G = p.low, L = D.high, Z = D.low, J = m.high, Y = m.low, H = R.high, U = R.low, O = T.high, q = T.low, r0 = W, I = g, c0 = S, $ = P, p0 = z, B0 = M, R0 = V, v0 = G, a0 = L, x0 = Z, D0 = J, _0 = Y, E0 = H, g0 = U, S0 = O, A0 = q, s0 = 0; s0 < 80; s0++) {
              var i0, u0, m0 = f[s0];
              if (s0 < 16)
                u0 = m0.high = d[F + s0 * 2] | 0, i0 = m0.low = d[F + s0 * 2 + 1] | 0;
              else {
                var l0 = f[s0 - 15], C0 = l0.high, n = l0.low, r = (C0 >>> 1 | n << 31) ^ (C0 >>> 8 | n << 24) ^ C0 >>> 7, t = (n >>> 1 | C0 << 31) ^ (n >>> 8 | C0 << 24) ^ (n >>> 7 | C0 << 25), o = f[s0 - 2], y = o.high, k = o.low, N = (y >>> 19 | k << 13) ^ (y << 3 | k >>> 29) ^ y >>> 6, K = (k >>> 19 | y << 13) ^ (k << 3 | y >>> 29) ^ (k >>> 6 | y << 26), e0 = f[s0 - 7], t0 = e0.high, n0 = e0.low, Q = f[s0 - 16], Dt = Q.high, Dr = Q.low;
                i0 = t + n0, u0 = r + t0 + (i0 >>> 0 < t >>> 0 ? 1 : 0), i0 = i0 + K, u0 = u0 + N + (i0 >>> 0 < K >>> 0 ? 1 : 0), i0 = i0 + Dr, u0 = u0 + Dt + (i0 >>> 0 < Dr >>> 0 ? 1 : 0), m0.high = u0, m0.low = i0;
              }
              var mt = a0 & D0 ^ ~a0 & E0, mr = x0 & _0 ^ ~x0 & g0, kt = r0 & c0 ^ r0 & p0 ^ c0 & p0, Rt = I & $ ^ I & B0 ^ $ & B0, St = (r0 >>> 28 | I << 4) ^ (r0 << 30 | I >>> 2) ^ (r0 << 25 | I >>> 7), kr = (I >>> 28 | r0 << 4) ^ (I << 30 | r0 >>> 2) ^ (I << 25 | r0 >>> 7), Ht = (a0 >>> 14 | x0 << 18) ^ (a0 >>> 18 | x0 << 14) ^ (a0 << 23 | x0 >>> 9), Tt = (x0 >>> 14 | a0 << 18) ^ (x0 >>> 18 | a0 << 14) ^ (x0 << 23 | a0 >>> 9), Rr = _[s0], Nt = Rr.high, Sr = Rr.low, f0 = A0 + Tt, F0 = S0 + Ht + (f0 >>> 0 < A0 >>> 0 ? 1 : 0), f0 = f0 + mr, F0 = F0 + mt + (f0 >>> 0 < mr >>> 0 ? 1 : 0), f0 = f0 + Sr, F0 = F0 + Nt + (f0 >>> 0 < Sr >>> 0 ? 1 : 0), f0 = f0 + i0, F0 = F0 + u0 + (f0 >>> 0 < i0 >>> 0 ? 1 : 0), Hr = kr + Rt, Ut = St + kt + (Hr >>> 0 < kr >>> 0 ? 1 : 0);
              S0 = E0, A0 = g0, E0 = D0, g0 = _0, D0 = a0, _0 = x0, x0 = v0 + f0 | 0, a0 = R0 + F0 + (x0 >>> 0 < v0 >>> 0 ? 1 : 0) | 0, R0 = p0, v0 = B0, p0 = c0, B0 = $, c0 = r0, $ = I, I = f0 + Hr | 0, r0 = F0 + Ut + (I >>> 0 < f0 >>> 0 ? 1 : 0) | 0;
            }
            g = w.low = g + I, w.high = W + r0 + (g >>> 0 < I >>> 0 ? 1 : 0), P = u.low = P + $, u.high = S + c0 + (P >>> 0 < $ >>> 0 ? 1 : 0), M = h.low = M + B0, h.high = z + p0 + (M >>> 0 < B0 >>> 0 ? 1 : 0), G = p.low = G + v0, p.high = V + R0 + (G >>> 0 < v0 >>> 0 ? 1 : 0), Z = D.low = Z + x0, D.high = L + a0 + (Z >>> 0 < x0 >>> 0 ? 1 : 0), Y = m.low = Y + _0, m.high = J + D0 + (Y >>> 0 < _0 >>> 0 ? 1 : 0), U = R.low = U + g0, R.high = H + E0 + (U >>> 0 < g0 >>> 0 ? 1 : 0), q = T.low = q + A0, T.high = O + S0 + (q >>> 0 < A0 >>> 0 ? 1 : 0);
          },
          _doFinalize: function() {
            var d = this._data, F = d.words, B = this._nDataBytes * 8, w = d.sigBytes * 8;
            F[w >>> 5] |= 128 << 24 - w % 32, F[(w + 128 >>> 10 << 5) + 30] = Math.floor(B / 4294967296), F[(w + 128 >>> 10 << 5) + 31] = B, d.sigBytes = F.length * 4, this._process();
            var u = this._hash.toX32();
            return u;
          },
          clone: function() {
            var d = C.clone.call(this);
            return d._hash = this._hash.clone(), d;
          },
          blockSize: 1024 / 32
        });
        x.SHA512 = C._createHelper(l), x.HmacSHA512 = C._createHmacHelper(l);
      }(), c.SHA512;
    });
  }(Z0)), Z0.exports;
}
var Y0 = { exports: {} }, Xr;
function fe() {
  return Xr || (Xr = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), P0(), _t());
    })(X, function(c) {
      return function() {
        var x = c, A = x.x64, C = A.Word, b = A.WordArray, i = x.algo, E = i.SHA512, a = i.SHA384 = E.extend({
          _doReset: function() {
            this._hash = new b.init([
              new C.init(3418070365, 3238371032),
              new C.init(1654270250, 914150663),
              new C.init(2438529370, 812702999),
              new C.init(355462360, 4144912697),
              new C.init(1731405415, 4290775857),
              new C.init(2394180231, 1750603025),
              new C.init(3675008525, 1694076839),
              new C.init(1203062813, 3204075428)
            ]);
          },
          _doFinalize: function() {
            var s = E._doFinalize.call(this);
            return s.sigBytes -= 16, s;
          }
        });
        x.SHA384 = E._createHelper(a), x.HmacSHA384 = E._createHmacHelper(a);
      }(), c.SHA384;
    });
  }(Y0)), Y0.exports;
}
var Q0 = { exports: {} }, jr;
function ue() {
  return jr || (jr = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), P0());
    })(X, function(c) {
      return function(x) {
        var A = c, C = A.lib, b = C.WordArray, i = C.Hasher, E = A.x64, a = E.Word, s = A.algo, _ = [], f = [], l = [];
        (function() {
          for (var B = 1, w = 0, u = 0; u < 24; u++) {
            _[B + 5 * w] = (u + 1) * (u + 2) / 2 % 64;
            var h = w % 5, p = (2 * B + 3 * w) % 5;
            B = h, w = p;
          }
          for (var B = 0; B < 5; B++)
            for (var w = 0; w < 5; w++)
              f[B + 5 * w] = w + (2 * B + 3 * w) % 5 * 5;
          for (var D = 1, m = 0; m < 24; m++) {
            for (var R = 0, T = 0, W = 0; W < 7; W++) {
              if (D & 1) {
                var g = (1 << W) - 1;
                g < 32 ? T ^= 1 << g : R ^= 1 << g - 32;
              }
              D & 128 ? D = D << 1 ^ 113 : D <<= 1;
            }
            l[m] = a.create(R, T);
          }
        })();
        var d = [];
        (function() {
          for (var B = 0; B < 25; B++)
            d[B] = a.create();
        })();
        var F = s.SHA3 = i.extend({
          /**
           * Configuration options.
           *
           * @property {number} outputLength
           *   The desired number of bits in the output hash.
           *   Only values permitted are: 224, 256, 384, 512.
           *   Default: 512
           */
          cfg: i.cfg.extend({
            outputLength: 512
          }),
          _doReset: function() {
            for (var B = this._state = [], w = 0; w < 25; w++)
              B[w] = new a.init();
            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
          },
          _doProcessBlock: function(B, w) {
            for (var u = this._state, h = this.blockSize / 2, p = 0; p < h; p++) {
              var D = B[w + 2 * p], m = B[w + 2 * p + 1];
              D = (D << 8 | D >>> 24) & 16711935 | (D << 24 | D >>> 8) & 4278255360, m = (m << 8 | m >>> 24) & 16711935 | (m << 24 | m >>> 8) & 4278255360;
              var R = u[p];
              R.high ^= m, R.low ^= D;
            }
            for (var T = 0; T < 24; T++) {
              for (var W = 0; W < 5; W++) {
                for (var g = 0, S = 0, P = 0; P < 5; P++) {
                  var R = u[W + 5 * P];
                  g ^= R.high, S ^= R.low;
                }
                var z = d[W];
                z.high = g, z.low = S;
              }
              for (var W = 0; W < 5; W++)
                for (var M = d[(W + 4) % 5], V = d[(W + 1) % 5], G = V.high, L = V.low, g = M.high ^ (G << 1 | L >>> 31), S = M.low ^ (L << 1 | G >>> 31), P = 0; P < 5; P++) {
                  var R = u[W + 5 * P];
                  R.high ^= g, R.low ^= S;
                }
              for (var Z = 1; Z < 25; Z++) {
                var g, S, R = u[Z], J = R.high, Y = R.low, H = _[Z];
                H < 32 ? (g = J << H | Y >>> 32 - H, S = Y << H | J >>> 32 - H) : (g = Y << H - 32 | J >>> 64 - H, S = J << H - 32 | Y >>> 64 - H);
                var U = d[f[Z]];
                U.high = g, U.low = S;
              }
              var O = d[0], q = u[0];
              O.high = q.high, O.low = q.low;
              for (var W = 0; W < 5; W++)
                for (var P = 0; P < 5; P++) {
                  var Z = W + 5 * P, R = u[Z], r0 = d[Z], I = d[(W + 1) % 5 + 5 * P], c0 = d[(W + 2) % 5 + 5 * P];
                  R.high = r0.high ^ ~I.high & c0.high, R.low = r0.low ^ ~I.low & c0.low;
                }
              var R = u[0], $ = l[T];
              R.high ^= $.high, R.low ^= $.low;
            }
          },
          _doFinalize: function() {
            var B = this._data, w = B.words;
            this._nDataBytes * 8;
            var u = B.sigBytes * 8, h = this.blockSize * 32;
            w[u >>> 5] |= 1 << 24 - u % 32, w[(x.ceil((u + 1) / h) * h >>> 5) - 1] |= 128, B.sigBytes = w.length * 4, this._process();
            for (var p = this._state, D = this.cfg.outputLength / 8, m = D / 8, R = [], T = 0; T < m; T++) {
              var W = p[T], g = W.high, S = W.low;
              g = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360, S = (S << 8 | S >>> 24) & 16711935 | (S << 24 | S >>> 8) & 4278255360, R.push(S), R.push(g);
            }
            return new b.init(R, D);
          },
          clone: function() {
            for (var B = i.clone.call(this), w = B._state = this._state.slice(0), u = 0; u < 25; u++)
              w[u] = w[u].clone();
            return B;
          }
        });
        A.SHA3 = i._createHelper(F), A.HmacSHA3 = i._createHmacHelper(F);
      }(Math), c.SHA3;
    });
  }(Q0)), Q0.exports;
}
var I0 = { exports: {} }, Zr;
function he() {
  return Zr || (Zr = 1, function(e, v) {
    (function(c, x) {
      e.exports = x(j());
    })(X, function(c) {
      /** @preserve
      			(c) 2012 by Cédric Mesnil. All rights reserved.
      
      			Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
      
      			    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
      			    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
      
      			THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
      			*/
      return function(x) {
        var A = c, C = A.lib, b = C.WordArray, i = C.Hasher, E = A.algo, a = b.create([
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          7,
          4,
          13,
          1,
          10,
          6,
          15,
          3,
          12,
          0,
          9,
          5,
          2,
          14,
          11,
          8,
          3,
          10,
          14,
          4,
          9,
          15,
          8,
          1,
          2,
          7,
          0,
          6,
          13,
          11,
          5,
          12,
          1,
          9,
          11,
          10,
          0,
          8,
          12,
          4,
          13,
          3,
          7,
          15,
          14,
          5,
          6,
          2,
          4,
          0,
          5,
          9,
          7,
          12,
          2,
          10,
          14,
          1,
          3,
          8,
          11,
          6,
          15,
          13
        ]), s = b.create([
          5,
          14,
          7,
          0,
          9,
          2,
          11,
          4,
          13,
          6,
          15,
          8,
          1,
          10,
          3,
          12,
          6,
          11,
          3,
          7,
          0,
          13,
          5,
          10,
          14,
          15,
          8,
          12,
          4,
          9,
          1,
          2,
          15,
          5,
          1,
          3,
          7,
          14,
          6,
          9,
          11,
          8,
          12,
          2,
          10,
          0,
          4,
          13,
          8,
          6,
          4,
          1,
          3,
          11,
          15,
          0,
          5,
          12,
          2,
          13,
          9,
          7,
          10,
          14,
          12,
          15,
          10,
          4,
          1,
          5,
          8,
          7,
          6,
          2,
          13,
          14,
          0,
          3,
          9,
          11
        ]), _ = b.create([
          11,
          14,
          15,
          12,
          5,
          8,
          7,
          9,
          11,
          13,
          14,
          15,
          6,
          7,
          9,
          8,
          7,
          6,
          8,
          13,
          11,
          9,
          7,
          15,
          7,
          12,
          15,
          9,
          11,
          7,
          13,
          12,
          11,
          13,
          6,
          7,
          14,
          9,
          13,
          15,
          14,
          8,
          13,
          6,
          5,
          12,
          7,
          5,
          11,
          12,
          14,
          15,
          14,
          15,
          9,
          8,
          9,
          14,
          5,
          6,
          8,
          6,
          5,
          12,
          9,
          15,
          5,
          11,
          6,
          8,
          13,
          12,
          5,
          12,
          13,
          14,
          11,
          8,
          5,
          6
        ]), f = b.create([
          8,
          9,
          9,
          11,
          13,
          15,
          15,
          5,
          7,
          7,
          8,
          11,
          14,
          14,
          12,
          6,
          9,
          13,
          15,
          7,
          12,
          8,
          9,
          11,
          7,
          7,
          12,
          7,
          6,
          15,
          13,
          11,
          9,
          7,
          15,
          11,
          8,
          6,
          6,
          14,
          12,
          13,
          5,
          14,
          13,
          13,
          7,
          5,
          15,
          5,
          8,
          11,
          14,
          14,
          6,
          14,
          6,
          9,
          12,
          9,
          12,
          5,
          15,
          8,
          8,
          5,
          12,
          9,
          12,
          5,
          14,
          6,
          8,
          13,
          6,
          5,
          15,
          13,
          11,
          11
        ]), l = b.create([0, 1518500249, 1859775393, 2400959708, 2840853838]), d = b.create([1352829926, 1548603684, 1836072691, 2053994217, 0]), F = E.RIPEMD160 = i.extend({
          _doReset: function() {
            this._hash = b.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
          },
          _doProcessBlock: function(m, R) {
            for (var T = 0; T < 16; T++) {
              var W = R + T, g = m[W];
              m[W] = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360;
            }
            var S = this._hash.words, P = l.words, z = d.words, M = a.words, V = s.words, G = _.words, L = f.words, Z, J, Y, H, U, O, q, r0, I, c0;
            O = Z = S[0], q = J = S[1], r0 = Y = S[2], I = H = S[3], c0 = U = S[4];
            for (var $, T = 0; T < 80; T += 1)
              $ = Z + m[R + M[T]] | 0, T < 16 ? $ += B(J, Y, H) + P[0] : T < 32 ? $ += w(J, Y, H) + P[1] : T < 48 ? $ += u(J, Y, H) + P[2] : T < 64 ? $ += h(J, Y, H) + P[3] : $ += p(J, Y, H) + P[4], $ = $ | 0, $ = D($, G[T]), $ = $ + U | 0, Z = U, U = H, H = D(Y, 10), Y = J, J = $, $ = O + m[R + V[T]] | 0, T < 16 ? $ += p(q, r0, I) + z[0] : T < 32 ? $ += h(q, r0, I) + z[1] : T < 48 ? $ += u(q, r0, I) + z[2] : T < 64 ? $ += w(q, r0, I) + z[3] : $ += B(q, r0, I) + z[4], $ = $ | 0, $ = D($, L[T]), $ = $ + c0 | 0, O = c0, c0 = I, I = D(r0, 10), r0 = q, q = $;
            $ = S[1] + Y + I | 0, S[1] = S[2] + H + c0 | 0, S[2] = S[3] + U + O | 0, S[3] = S[4] + Z + q | 0, S[4] = S[0] + J + r0 | 0, S[0] = $;
          },
          _doFinalize: function() {
            var m = this._data, R = m.words, T = this._nDataBytes * 8, W = m.sigBytes * 8;
            R[W >>> 5] |= 128 << 24 - W % 32, R[(W + 64 >>> 9 << 4) + 14] = (T << 8 | T >>> 24) & 16711935 | (T << 24 | T >>> 8) & 4278255360, m.sigBytes = (R.length + 1) * 4, this._process();
            for (var g = this._hash, S = g.words, P = 0; P < 5; P++) {
              var z = S[P];
              S[P] = (z << 8 | z >>> 24) & 16711935 | (z << 24 | z >>> 8) & 4278255360;
            }
            return g;
          },
          clone: function() {
            var m = i.clone.call(this);
            return m._hash = this._hash.clone(), m;
          }
        });
        function B(m, R, T) {
          return m ^ R ^ T;
        }
        function w(m, R, T) {
          return m & R | ~m & T;
        }
        function u(m, R, T) {
          return (m | ~R) ^ T;
        }
        function h(m, R, T) {
          return m & T | R & ~T;
        }
        function p(m, R, T) {
          return m ^ (R | ~T);
        }
        function D(m, R) {
          return m << R | m >>> 32 - R;
        }
        A.RIPEMD160 = i._createHelper(F), A.HmacRIPEMD160 = i._createHmacHelper(F);
      }(), c.RIPEMD160;
    });
  }(I0)), I0.exports;
}
var J0 = { exports: {} }, Yr;
function br() {
  return Yr || (Yr = 1, function(e, v) {
    (function(c, x) {
      e.exports = x(j());
    })(X, function(c) {
      (function() {
        var x = c, A = x.lib, C = A.Base, b = x.enc, i = b.Utf8, E = x.algo;
        E.HMAC = C.extend({
          /**
           * Initializes a newly created HMAC.
           *
           * @param {Hasher} hasher The hash algorithm to use.
           * @param {WordArray|string} key The secret key.
           *
           * @example
           *
           *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
           */
          init: function(a, s) {
            a = this._hasher = new a.init(), typeof s == "string" && (s = i.parse(s));
            var _ = a.blockSize, f = _ * 4;
            s.sigBytes > f && (s = a.finalize(s)), s.clamp();
            for (var l = this._oKey = s.clone(), d = this._iKey = s.clone(), F = l.words, B = d.words, w = 0; w < _; w++)
              F[w] ^= 1549556828, B[w] ^= 909522486;
            l.sigBytes = d.sigBytes = f, this.reset();
          },
          /**
           * Resets this HMAC to its initial state.
           *
           * @example
           *
           *     hmacHasher.reset();
           */
          reset: function() {
            var a = this._hasher;
            a.reset(), a.update(this._iKey);
          },
          /**
           * Updates this HMAC with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {HMAC} This HMAC instance.
           *
           * @example
           *
           *     hmacHasher.update('message');
           *     hmacHasher.update(wordArray);
           */
          update: function(a) {
            return this._hasher.update(a), this;
          },
          /**
           * Finalizes the HMAC computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The HMAC.
           *
           * @example
           *
           *     var hmac = hmacHasher.finalize();
           *     var hmac = hmacHasher.finalize('message');
           *     var hmac = hmacHasher.finalize(wordArray);
           */
          finalize: function(a) {
            var s = this._hasher, _ = s.finalize(a);
            s.reset();
            var f = s.finalize(this._oKey.clone().concat(_));
            return f;
          }
        });
      })();
    });
  }(J0)), J0.exports;
}
var L0 = { exports: {} }, Qr;
function le() {
  return Qr || (Qr = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), wr(), br());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.Base, b = A.WordArray, i = x.algo, E = i.SHA256, a = i.HMAC, s = i.PBKDF2 = C.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hasher to use. Default: SHA256
           * @property {number} iterations The number of iterations to perform. Default: 250000
           */
          cfg: C.extend({
            keySize: 128 / 32,
            hasher: E,
            iterations: 25e4
          }),
          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.PBKDF2.create();
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
           */
          init: function(_) {
            this.cfg = this.cfg.extend(_);
          },
          /**
           * Computes the Password-Based Key Derivation Function 2.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function(_, f) {
            for (var l = this.cfg, d = a.create(l.hasher, _), F = b.create(), B = b.create([1]), w = F.words, u = B.words, h = l.keySize, p = l.iterations; w.length < h; ) {
              var D = d.update(f).finalize(B);
              d.reset();
              for (var m = D.words, R = m.length, T = D, W = 1; W < p; W++) {
                T = d.finalize(T), d.reset();
                for (var g = T.words, S = 0; S < R; S++)
                  m[S] ^= g[S];
              }
              F.concat(D), u[0]++;
            }
            return F.sigBytes = h * 4, F;
          }
        });
        x.PBKDF2 = function(_, f, l) {
          return s.create(l).compute(_, f);
        };
      }(), c.PBKDF2;
    });
  }(L0)), L0.exports;
}
var rr = { exports: {} }, Ir;
function y0() {
  return Ir || (Ir = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), yt(), br());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.Base, b = A.WordArray, i = x.algo, E = i.MD5, a = i.EvpKDF = C.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hash algorithm to use. Default: MD5
           * @property {number} iterations The number of iterations to perform. Default: 1
           */
          cfg: C.extend({
            keySize: 128 / 32,
            hasher: E,
            iterations: 1
          }),
          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.EvpKDF.create();
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
           */
          init: function(s) {
            this.cfg = this.cfg.extend(s);
          },
          /**
           * Derives a key from a password.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function(s, _) {
            for (var f, l = this.cfg, d = l.hasher.create(), F = b.create(), B = F.words, w = l.keySize, u = l.iterations; B.length < w; ) {
              f && d.update(f), f = d.update(s).finalize(_), d.reset();
              for (var h = 1; h < u; h++)
                f = d.finalize(f), d.reset();
              F.concat(f);
            }
            return F.sigBytes = w * 4, F;
          }
        });
        x.EvpKDF = function(s, _, f) {
          return a.create(f).compute(s, _);
        };
      }(), c.EvpKDF;
    });
  }(rr)), rr.exports;
}
var tr = { exports: {} }, Jr;
function o0() {
  return Jr || (Jr = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), y0());
    })(X, function(c) {
      c.lib.Cipher || function(x) {
        var A = c, C = A.lib, b = C.Base, i = C.WordArray, E = C.BufferedBlockAlgorithm, a = A.enc;
        a.Utf8;
        var s = a.Base64, _ = A.algo, f = _.EvpKDF, l = C.Cipher = E.extend({
          /**
           * Configuration options.
           *
           * @property {WordArray} iv The IV to use for this operation.
           */
          cfg: b.extend(),
          /**
           * Creates this cipher in encryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
           */
          createEncryptor: function(g, S) {
            return this.create(this._ENC_XFORM_MODE, g, S);
          },
          /**
           * Creates this cipher in decryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
           */
          createDecryptor: function(g, S) {
            return this.create(this._DEC_XFORM_MODE, g, S);
          },
          /**
           * Initializes a newly created cipher.
           *
           * @param {number} xformMode Either the encryption or decryption transormation mode constant.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
           */
          init: function(g, S, P) {
            this.cfg = this.cfg.extend(P), this._xformMode = g, this._key = S, this.reset();
          },
          /**
           * Resets this cipher to its initial state.
           *
           * @example
           *
           *     cipher.reset();
           */
          reset: function() {
            E.reset.call(this), this._doReset();
          },
          /**
           * Adds data to be encrypted or decrypted.
           *
           * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
           *
           * @return {WordArray} The data after processing.
           *
           * @example
           *
           *     var encrypted = cipher.process('data');
           *     var encrypted = cipher.process(wordArray);
           */
          process: function(g) {
            return this._append(g), this._process();
          },
          /**
           * Finalizes the encryption or decryption process.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
           *
           * @return {WordArray} The data after final processing.
           *
           * @example
           *
           *     var encrypted = cipher.finalize();
           *     var encrypted = cipher.finalize('data');
           *     var encrypted = cipher.finalize(wordArray);
           */
          finalize: function(g) {
            g && this._append(g);
            var S = this._doFinalize();
            return S;
          },
          keySize: 128 / 32,
          ivSize: 128 / 32,
          _ENC_XFORM_MODE: 1,
          _DEC_XFORM_MODE: 2,
          /**
           * Creates shortcut functions to a cipher's object interface.
           *
           * @param {Cipher} cipher The cipher to create a helper for.
           *
           * @return {Object} An object with encrypt and decrypt shortcut functions.
           *
           * @static
           *
           * @example
           *
           *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
           */
          _createHelper: /* @__PURE__ */ function() {
            function g(S) {
              return typeof S == "string" ? W : m;
            }
            return function(S) {
              return {
                encrypt: function(P, z, M) {
                  return g(z).encrypt(S, P, z, M);
                },
                decrypt: function(P, z, M) {
                  return g(z).decrypt(S, P, z, M);
                }
              };
            };
          }()
        });
        C.StreamCipher = l.extend({
          _doFinalize: function() {
            var g = this._process(!0);
            return g;
          },
          blockSize: 1
        });
        var d = A.mode = {}, F = C.BlockCipherMode = b.extend({
          /**
           * Creates this mode for encryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
           */
          createEncryptor: function(g, S) {
            return this.Encryptor.create(g, S);
          },
          /**
           * Creates this mode for decryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
           */
          createDecryptor: function(g, S) {
            return this.Decryptor.create(g, S);
          },
          /**
           * Initializes a newly created mode.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
           */
          init: function(g, S) {
            this._cipher = g, this._iv = S;
          }
        }), B = d.CBC = function() {
          var g = F.extend();
          g.Encryptor = g.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function(P, z) {
              var M = this._cipher, V = M.blockSize;
              S.call(this, P, z, V), M.encryptBlock(P, z), this._prevBlock = P.slice(z, z + V);
            }
          }), g.Decryptor = g.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function(P, z) {
              var M = this._cipher, V = M.blockSize, G = P.slice(z, z + V);
              M.decryptBlock(P, z), S.call(this, P, z, V), this._prevBlock = G;
            }
          });
          function S(P, z, M) {
            var V, G = this._iv;
            G ? (V = G, this._iv = x) : V = this._prevBlock;
            for (var L = 0; L < M; L++)
              P[z + L] ^= V[L];
          }
          return g;
        }(), w = A.pad = {}, u = w.Pkcs7 = {
          /**
           * Pads data using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to pad.
           * @param {number} blockSize The multiple that the data should be padded to.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
           */
          pad: function(g, S) {
            for (var P = S * 4, z = P - g.sigBytes % P, M = z << 24 | z << 16 | z << 8 | z, V = [], G = 0; G < z; G += 4)
              V.push(M);
            var L = i.create(V, z);
            g.concat(L);
          },
          /**
           * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to unpad.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.unpad(wordArray);
           */
          unpad: function(g) {
            var S = g.words[g.sigBytes - 1 >>> 2] & 255;
            g.sigBytes -= S;
          }
        };
        C.BlockCipher = l.extend({
          /**
           * Configuration options.
           *
           * @property {Mode} mode The block mode to use. Default: CBC
           * @property {Padding} padding The padding strategy to use. Default: Pkcs7
           */
          cfg: l.cfg.extend({
            mode: B,
            padding: u
          }),
          reset: function() {
            var g;
            l.reset.call(this);
            var S = this.cfg, P = S.iv, z = S.mode;
            this._xformMode == this._ENC_XFORM_MODE ? g = z.createEncryptor : (g = z.createDecryptor, this._minBufferSize = 1), this._mode && this._mode.__creator == g ? this._mode.init(this, P && P.words) : (this._mode = g.call(z, this, P && P.words), this._mode.__creator = g);
          },
          _doProcessBlock: function(g, S) {
            this._mode.processBlock(g, S);
          },
          _doFinalize: function() {
            var g, S = this.cfg.padding;
            return this._xformMode == this._ENC_XFORM_MODE ? (S.pad(this._data, this.blockSize), g = this._process(!0)) : (g = this._process(!0), S.unpad(g)), g;
          },
          blockSize: 128 / 32
        });
        var h = C.CipherParams = b.extend({
          /**
           * Initializes a newly created cipher params object.
           *
           * @param {Object} cipherParams An object with any of the possible cipher parameters.
           *
           * @example
           *
           *     var cipherParams = CryptoJS.lib.CipherParams.create({
           *         ciphertext: ciphertextWordArray,
           *         key: keyWordArray,
           *         iv: ivWordArray,
           *         salt: saltWordArray,
           *         algorithm: CryptoJS.algo.AES,
           *         mode: CryptoJS.mode.CBC,
           *         padding: CryptoJS.pad.PKCS7,
           *         blockSize: 4,
           *         formatter: CryptoJS.format.OpenSSL
           *     });
           */
          init: function(g) {
            this.mixIn(g);
          },
          /**
           * Converts this cipher params object to a string.
           *
           * @param {Format} formatter (Optional) The formatting strategy to use.
           *
           * @return {string} The stringified cipher params.
           *
           * @throws Error If neither the formatter nor the default formatter is set.
           *
           * @example
           *
           *     var string = cipherParams + '';
           *     var string = cipherParams.toString();
           *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
           */
          toString: function(g) {
            return (g || this.formatter).stringify(this);
          }
        }), p = A.format = {}, D = p.OpenSSL = {
          /**
           * Converts a cipher params object to an OpenSSL-compatible string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The OpenSSL-compatible string.
           *
           * @static
           *
           * @example
           *
           *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
           */
          stringify: function(g) {
            var S, P = g.ciphertext, z = g.salt;
            return z ? S = i.create([1398893684, 1701076831]).concat(z).concat(P) : S = P, S.toString(s);
          },
          /**
           * Converts an OpenSSL-compatible string to a cipher params object.
           *
           * @param {string} openSSLStr The OpenSSL-compatible string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
           */
          parse: function(g) {
            var S, P = s.parse(g), z = P.words;
            return z[0] == 1398893684 && z[1] == 1701076831 && (S = i.create(z.slice(2, 4)), z.splice(0, 4), P.sigBytes -= 16), h.create({ ciphertext: P, salt: S });
          }
        }, m = C.SerializableCipher = b.extend({
          /**
           * Configuration options.
           *
           * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
           */
          cfg: b.extend({
            format: D
          }),
          /**
           * Encrypts a message.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          encrypt: function(g, S, P, z) {
            z = this.cfg.extend(z);
            var M = g.createEncryptor(P, z), V = M.finalize(S), G = M.cfg;
            return h.create({
              ciphertext: V,
              key: P,
              iv: G.iv,
              algorithm: g,
              mode: G.mode,
              padding: G.padding,
              blockSize: g.blockSize,
              formatter: z.format
            });
          },
          /**
           * Decrypts serialized ciphertext.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          decrypt: function(g, S, P, z) {
            z = this.cfg.extend(z), S = this._parse(S, z.format);
            var M = g.createDecryptor(P, z).finalize(S.ciphertext);
            return M;
          },
          /**
           * Converts serialized ciphertext to CipherParams,
           * else assumed CipherParams already and returns ciphertext unchanged.
           *
           * @param {CipherParams|string} ciphertext The ciphertext.
           * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
           *
           * @return {CipherParams} The unserialized ciphertext.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
           */
          _parse: function(g, S) {
            return typeof g == "string" ? S.parse(g, this) : g;
          }
        }), R = A.kdf = {}, T = R.OpenSSL = {
          /**
           * Derives a key and IV from a password.
           *
           * @param {string} password The password to derive from.
           * @param {number} keySize The size in words of the key to generate.
           * @param {number} ivSize The size in words of the IV to generate.
           * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
           *
           * @return {CipherParams} A cipher params object with the key, IV, and salt.
           *
           * @static
           *
           * @example
           *
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
           */
          execute: function(g, S, P, z, M) {
            if (z || (z = i.random(64 / 8)), M)
              var V = f.create({ keySize: S + P, hasher: M }).compute(g, z);
            else
              var V = f.create({ keySize: S + P }).compute(g, z);
            var G = i.create(V.words.slice(S), P * 4);
            return V.sigBytes = S * 4, h.create({ key: V, iv: G, salt: z });
          }
        }, W = C.PasswordBasedCipher = m.extend({
          /**
           * Configuration options.
           *
           * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
           */
          cfg: m.cfg.extend({
            kdf: T
          }),
          /**
           * Encrypts a message using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
           */
          encrypt: function(g, S, P, z) {
            z = this.cfg.extend(z);
            var M = z.kdf.execute(P, g.keySize, g.ivSize, z.salt, z.hasher);
            z.iv = M.iv;
            var V = m.encrypt.call(this, g, S, M.key, z);
            return V.mixIn(M), V;
          },
          /**
           * Decrypts serialized ciphertext using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
           */
          decrypt: function(g, S, P, z) {
            z = this.cfg.extend(z), S = this._parse(S, z.format);
            var M = z.kdf.execute(P, g.keySize, g.ivSize, S.salt, z.hasher);
            z.iv = M.iv;
            var V = m.decrypt.call(this, g, S, M.key, z);
            return V;
          }
        });
      }();
    });
  }(tr)), tr.exports;
}
var er = { exports: {} }, Lr;
function de() {
  return Lr || (Lr = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), o0());
    })(X, function(c) {
      return c.mode.CFB = function() {
        var x = c.lib.BlockCipherMode.extend();
        x.Encryptor = x.extend({
          processBlock: function(C, b) {
            var i = this._cipher, E = i.blockSize;
            A.call(this, C, b, E, i), this._prevBlock = C.slice(b, b + E);
          }
        }), x.Decryptor = x.extend({
          processBlock: function(C, b) {
            var i = this._cipher, E = i.blockSize, a = C.slice(b, b + E);
            A.call(this, C, b, E, i), this._prevBlock = a;
          }
        });
        function A(C, b, i, E) {
          var a, s = this._iv;
          s ? (a = s.slice(0), this._iv = void 0) : a = this._prevBlock, E.encryptBlock(a, 0);
          for (var _ = 0; _ < i; _++)
            C[b + _] ^= a[_];
        }
        return x;
      }(), c.mode.CFB;
    });
  }(er)), er.exports;
}
var nr = { exports: {} }, rt;
function pe() {
  return rt || (rt = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), o0());
    })(X, function(c) {
      return c.mode.CTR = function() {
        var x = c.lib.BlockCipherMode.extend(), A = x.Encryptor = x.extend({
          processBlock: function(C, b) {
            var i = this._cipher, E = i.blockSize, a = this._iv, s = this._counter;
            a && (s = this._counter = a.slice(0), this._iv = void 0);
            var _ = s.slice(0);
            i.encryptBlock(_, 0), s[E - 1] = s[E - 1] + 1 | 0;
            for (var f = 0; f < E; f++)
              C[b + f] ^= _[f];
          }
        });
        return x.Decryptor = A, x;
      }(), c.mode.CTR;
    });
  }(nr)), nr.exports;
}
var ir = { exports: {} }, tt;
function Be() {
  return tt || (tt = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), o0());
    })(X, function(c) {
      /** @preserve
       * Counter block mode compatible with  Dr Brian Gladman fileenc.c
       * derived from CryptoJS.mode.CTR
       * Jan Hruby jhruby.web@gmail.com
       */
      return c.mode.CTRGladman = function() {
        var x = c.lib.BlockCipherMode.extend();
        function A(i) {
          if ((i >> 24 & 255) === 255) {
            var E = i >> 16 & 255, a = i >> 8 & 255, s = i & 255;
            E === 255 ? (E = 0, a === 255 ? (a = 0, s === 255 ? s = 0 : ++s) : ++a) : ++E, i = 0, i += E << 16, i += a << 8, i += s;
          } else
            i += 1 << 24;
          return i;
        }
        function C(i) {
          return (i[0] = A(i[0])) === 0 && (i[1] = A(i[1])), i;
        }
        var b = x.Encryptor = x.extend({
          processBlock: function(i, E) {
            var a = this._cipher, s = a.blockSize, _ = this._iv, f = this._counter;
            _ && (f = this._counter = _.slice(0), this._iv = void 0), C(f);
            var l = f.slice(0);
            a.encryptBlock(l, 0);
            for (var d = 0; d < s; d++)
              i[E + d] ^= l[d];
          }
        });
        return x.Decryptor = b, x;
      }(), c.mode.CTRGladman;
    });
  }(ir)), ir.exports;
}
var xr = { exports: {} }, et;
function ve() {
  return et || (et = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), o0());
    })(X, function(c) {
      return c.mode.OFB = function() {
        var x = c.lib.BlockCipherMode.extend(), A = x.Encryptor = x.extend({
          processBlock: function(C, b) {
            var i = this._cipher, E = i.blockSize, a = this._iv, s = this._keystream;
            a && (s = this._keystream = a.slice(0), this._iv = void 0), i.encryptBlock(s, 0);
            for (var _ = 0; _ < E; _++)
              C[b + _] ^= s[_];
          }
        });
        return x.Decryptor = A, x;
      }(), c.mode.OFB;
    });
  }(xr)), xr.exports;
}
var ar = { exports: {} }, nt;
function Ee() {
  return nt || (nt = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), o0());
    })(X, function(c) {
      return c.mode.ECB = function() {
        var x = c.lib.BlockCipherMode.extend();
        return x.Encryptor = x.extend({
          processBlock: function(A, C) {
            this._cipher.encryptBlock(A, C);
          }
        }), x.Decryptor = x.extend({
          processBlock: function(A, C) {
            this._cipher.decryptBlock(A, C);
          }
        }), x;
      }(), c.mode.ECB;
    });
  }(ar)), ar.exports;
}
var or = { exports: {} }, it;
function Ae() {
  return it || (it = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), o0());
    })(X, function(c) {
      return c.pad.AnsiX923 = {
        pad: function(x, A) {
          var C = x.sigBytes, b = A * 4, i = b - C % b, E = C + i - 1;
          x.clamp(), x.words[E >>> 2] |= i << 24 - E % 4 * 8, x.sigBytes += i;
        },
        unpad: function(x) {
          var A = x.words[x.sigBytes - 1 >>> 2] & 255;
          x.sigBytes -= A;
        }
      }, c.pad.Ansix923;
    });
  }(or)), or.exports;
}
var cr = { exports: {} }, xt;
function Ce() {
  return xt || (xt = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), o0());
    })(X, function(c) {
      return c.pad.Iso10126 = {
        pad: function(x, A) {
          var C = A * 4, b = C - x.sigBytes % C;
          x.concat(c.lib.WordArray.random(b - 1)).concat(c.lib.WordArray.create([b << 24], 1));
        },
        unpad: function(x) {
          var A = x.words[x.sigBytes - 1 >>> 2] & 255;
          x.sigBytes -= A;
        }
      }, c.pad.Iso10126;
    });
  }(cr)), cr.exports;
}
var sr = { exports: {} }, at;
function Fe() {
  return at || (at = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), o0());
    })(X, function(c) {
      return c.pad.Iso97971 = {
        pad: function(x, A) {
          x.concat(c.lib.WordArray.create([2147483648], 1)), c.pad.ZeroPadding.pad(x, A);
        },
        unpad: function(x) {
          c.pad.ZeroPadding.unpad(x), x.sigBytes--;
        }
      }, c.pad.Iso97971;
    });
  }(sr)), sr.exports;
}
var fr = { exports: {} }, ot;
function ye() {
  return ot || (ot = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), o0());
    })(X, function(c) {
      return c.pad.ZeroPadding = {
        pad: function(x, A) {
          var C = A * 4;
          x.clamp(), x.sigBytes += C - (x.sigBytes % C || C);
        },
        unpad: function(x) {
          for (var A = x.words, C = x.sigBytes - 1, C = x.sigBytes - 1; C >= 0; C--)
            if (A[C >>> 2] >>> 24 - C % 4 * 8 & 255) {
              x.sigBytes = C + 1;
              break;
            }
        }
      }, c.pad.ZeroPadding;
    });
  }(fr)), fr.exports;
}
var ur = { exports: {} }, ct;
function _e() {
  return ct || (ct = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), o0());
    })(X, function(c) {
      return c.pad.NoPadding = {
        pad: function() {
        },
        unpad: function() {
        }
      }, c.pad.NoPadding;
    });
  }(ur)), ur.exports;
}
var hr = { exports: {} }, st;
function ge() {
  return st || (st = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), o0());
    })(X, function(c) {
      return function(x) {
        var A = c, C = A.lib, b = C.CipherParams, i = A.enc, E = i.Hex, a = A.format;
        a.Hex = {
          /**
           * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The hexadecimally encoded string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
           */
          stringify: function(s) {
            return s.ciphertext.toString(E);
          },
          /**
           * Converts a hexadecimally encoded ciphertext string to a cipher params object.
           *
           * @param {string} input The hexadecimally encoded string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
           */
          parse: function(s) {
            var _ = E.parse(s);
            return b.create({ ciphertext: _ });
          }
        };
      }(), c.format.Hex;
    });
  }(hr)), hr.exports;
}
var lr = { exports: {} }, ft;
function we() {
  return ft || (ft = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), w0(), b0(), y0(), o0());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.BlockCipher, b = x.algo, i = [], E = [], a = [], s = [], _ = [], f = [], l = [], d = [], F = [], B = [];
        (function() {
          for (var h = [], p = 0; p < 256; p++)
            p < 128 ? h[p] = p << 1 : h[p] = p << 1 ^ 283;
          for (var D = 0, m = 0, p = 0; p < 256; p++) {
            var R = m ^ m << 1 ^ m << 2 ^ m << 3 ^ m << 4;
            R = R >>> 8 ^ R & 255 ^ 99, i[D] = R, E[R] = D;
            var T = h[D], W = h[T], g = h[W], S = h[R] * 257 ^ R * 16843008;
            a[D] = S << 24 | S >>> 8, s[D] = S << 16 | S >>> 16, _[D] = S << 8 | S >>> 24, f[D] = S;
            var S = g * 16843009 ^ W * 65537 ^ T * 257 ^ D * 16843008;
            l[R] = S << 24 | S >>> 8, d[R] = S << 16 | S >>> 16, F[R] = S << 8 | S >>> 24, B[R] = S, D ? (D = T ^ h[h[h[g ^ T]]], m ^= h[h[m]]) : D = m = 1;
          }
        })();
        var w = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], u = b.AES = C.extend({
          _doReset: function() {
            var h;
            if (!(this._nRounds && this._keyPriorReset === this._key)) {
              for (var p = this._keyPriorReset = this._key, D = p.words, m = p.sigBytes / 4, R = this._nRounds = m + 6, T = (R + 1) * 4, W = this._keySchedule = [], g = 0; g < T; g++)
                g < m ? W[g] = D[g] : (h = W[g - 1], g % m ? m > 6 && g % m == 4 && (h = i[h >>> 24] << 24 | i[h >>> 16 & 255] << 16 | i[h >>> 8 & 255] << 8 | i[h & 255]) : (h = h << 8 | h >>> 24, h = i[h >>> 24] << 24 | i[h >>> 16 & 255] << 16 | i[h >>> 8 & 255] << 8 | i[h & 255], h ^= w[g / m | 0] << 24), W[g] = W[g - m] ^ h);
              for (var S = this._invKeySchedule = [], P = 0; P < T; P++) {
                var g = T - P;
                if (P % 4)
                  var h = W[g];
                else
                  var h = W[g - 4];
                P < 4 || g <= 4 ? S[P] = h : S[P] = l[i[h >>> 24]] ^ d[i[h >>> 16 & 255]] ^ F[i[h >>> 8 & 255]] ^ B[i[h & 255]];
              }
            }
          },
          encryptBlock: function(h, p) {
            this._doCryptBlock(h, p, this._keySchedule, a, s, _, f, i);
          },
          decryptBlock: function(h, p) {
            var D = h[p + 1];
            h[p + 1] = h[p + 3], h[p + 3] = D, this._doCryptBlock(h, p, this._invKeySchedule, l, d, F, B, E);
            var D = h[p + 1];
            h[p + 1] = h[p + 3], h[p + 3] = D;
          },
          _doCryptBlock: function(h, p, D, m, R, T, W, g) {
            for (var S = this._nRounds, P = h[p] ^ D[0], z = h[p + 1] ^ D[1], M = h[p + 2] ^ D[2], V = h[p + 3] ^ D[3], G = 4, L = 1; L < S; L++) {
              var Z = m[P >>> 24] ^ R[z >>> 16 & 255] ^ T[M >>> 8 & 255] ^ W[V & 255] ^ D[G++], J = m[z >>> 24] ^ R[M >>> 16 & 255] ^ T[V >>> 8 & 255] ^ W[P & 255] ^ D[G++], Y = m[M >>> 24] ^ R[V >>> 16 & 255] ^ T[P >>> 8 & 255] ^ W[z & 255] ^ D[G++], H = m[V >>> 24] ^ R[P >>> 16 & 255] ^ T[z >>> 8 & 255] ^ W[M & 255] ^ D[G++];
              P = Z, z = J, M = Y, V = H;
            }
            var Z = (g[P >>> 24] << 24 | g[z >>> 16 & 255] << 16 | g[M >>> 8 & 255] << 8 | g[V & 255]) ^ D[G++], J = (g[z >>> 24] << 24 | g[M >>> 16 & 255] << 16 | g[V >>> 8 & 255] << 8 | g[P & 255]) ^ D[G++], Y = (g[M >>> 24] << 24 | g[V >>> 16 & 255] << 16 | g[P >>> 8 & 255] << 8 | g[z & 255]) ^ D[G++], H = (g[V >>> 24] << 24 | g[P >>> 16 & 255] << 16 | g[z >>> 8 & 255] << 8 | g[M & 255]) ^ D[G++];
            h[p] = Z, h[p + 1] = J, h[p + 2] = Y, h[p + 3] = H;
          },
          keySize: 256 / 32
        });
        x.AES = C._createHelper(u);
      }(), c.AES;
    });
  }(lr)), lr.exports;
}
var dr = { exports: {} }, ut;
function be() {
  return ut || (ut = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), w0(), b0(), y0(), o0());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.WordArray, b = A.BlockCipher, i = x.algo, E = [
          57,
          49,
          41,
          33,
          25,
          17,
          9,
          1,
          58,
          50,
          42,
          34,
          26,
          18,
          10,
          2,
          59,
          51,
          43,
          35,
          27,
          19,
          11,
          3,
          60,
          52,
          44,
          36,
          63,
          55,
          47,
          39,
          31,
          23,
          15,
          7,
          62,
          54,
          46,
          38,
          30,
          22,
          14,
          6,
          61,
          53,
          45,
          37,
          29,
          21,
          13,
          5,
          28,
          20,
          12,
          4
        ], a = [
          14,
          17,
          11,
          24,
          1,
          5,
          3,
          28,
          15,
          6,
          21,
          10,
          23,
          19,
          12,
          4,
          26,
          8,
          16,
          7,
          27,
          20,
          13,
          2,
          41,
          52,
          31,
          37,
          47,
          55,
          30,
          40,
          51,
          45,
          33,
          48,
          44,
          49,
          39,
          56,
          34,
          53,
          46,
          42,
          50,
          36,
          29,
          32
        ], s = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28], _ = [
          {
            0: 8421888,
            268435456: 32768,
            536870912: 8421378,
            805306368: 2,
            1073741824: 512,
            1342177280: 8421890,
            1610612736: 8389122,
            1879048192: 8388608,
            2147483648: 514,
            2415919104: 8389120,
            2684354560: 33280,
            2952790016: 8421376,
            3221225472: 32770,
            3489660928: 8388610,
            3758096384: 0,
            4026531840: 33282,
            134217728: 0,
            402653184: 8421890,
            671088640: 33282,
            939524096: 32768,
            1207959552: 8421888,
            1476395008: 512,
            1744830464: 8421378,
            2013265920: 2,
            2281701376: 8389120,
            2550136832: 33280,
            2818572288: 8421376,
            3087007744: 8389122,
            3355443200: 8388610,
            3623878656: 32770,
            3892314112: 514,
            4160749568: 8388608,
            1: 32768,
            268435457: 2,
            536870913: 8421888,
            805306369: 8388608,
            1073741825: 8421378,
            1342177281: 33280,
            1610612737: 512,
            1879048193: 8389122,
            2147483649: 8421890,
            2415919105: 8421376,
            2684354561: 8388610,
            2952790017: 33282,
            3221225473: 514,
            3489660929: 8389120,
            3758096385: 32770,
            4026531841: 0,
            134217729: 8421890,
            402653185: 8421376,
            671088641: 8388608,
            939524097: 512,
            1207959553: 32768,
            1476395009: 8388610,
            1744830465: 2,
            2013265921: 33282,
            2281701377: 32770,
            2550136833: 8389122,
            2818572289: 514,
            3087007745: 8421888,
            3355443201: 8389120,
            3623878657: 0,
            3892314113: 33280,
            4160749569: 8421378
          },
          {
            0: 1074282512,
            16777216: 16384,
            33554432: 524288,
            50331648: 1074266128,
            67108864: 1073741840,
            83886080: 1074282496,
            100663296: 1073758208,
            117440512: 16,
            134217728: 540672,
            150994944: 1073758224,
            167772160: 1073741824,
            184549376: 540688,
            201326592: 524304,
            218103808: 0,
            234881024: 16400,
            251658240: 1074266112,
            8388608: 1073758208,
            25165824: 540688,
            41943040: 16,
            58720256: 1073758224,
            75497472: 1074282512,
            92274688: 1073741824,
            109051904: 524288,
            125829120: 1074266128,
            142606336: 524304,
            159383552: 0,
            176160768: 16384,
            192937984: 1074266112,
            209715200: 1073741840,
            226492416: 540672,
            243269632: 1074282496,
            260046848: 16400,
            268435456: 0,
            285212672: 1074266128,
            301989888: 1073758224,
            318767104: 1074282496,
            335544320: 1074266112,
            352321536: 16,
            369098752: 540688,
            385875968: 16384,
            402653184: 16400,
            419430400: 524288,
            436207616: 524304,
            452984832: 1073741840,
            469762048: 540672,
            486539264: 1073758208,
            503316480: 1073741824,
            520093696: 1074282512,
            276824064: 540688,
            293601280: 524288,
            310378496: 1074266112,
            327155712: 16384,
            343932928: 1073758208,
            360710144: 1074282512,
            377487360: 16,
            394264576: 1073741824,
            411041792: 1074282496,
            427819008: 1073741840,
            444596224: 1073758224,
            461373440: 524304,
            478150656: 0,
            494927872: 16400,
            511705088: 1074266128,
            528482304: 540672
          },
          {
            0: 260,
            1048576: 0,
            2097152: 67109120,
            3145728: 65796,
            4194304: 65540,
            5242880: 67108868,
            6291456: 67174660,
            7340032: 67174400,
            8388608: 67108864,
            9437184: 67174656,
            10485760: 65792,
            11534336: 67174404,
            12582912: 67109124,
            13631488: 65536,
            14680064: 4,
            15728640: 256,
            524288: 67174656,
            1572864: 67174404,
            2621440: 0,
            3670016: 67109120,
            4718592: 67108868,
            5767168: 65536,
            6815744: 65540,
            7864320: 260,
            8912896: 4,
            9961472: 256,
            11010048: 67174400,
            12058624: 65796,
            13107200: 65792,
            14155776: 67109124,
            15204352: 67174660,
            16252928: 67108864,
            16777216: 67174656,
            17825792: 65540,
            18874368: 65536,
            19922944: 67109120,
            20971520: 256,
            22020096: 67174660,
            23068672: 67108868,
            24117248: 0,
            25165824: 67109124,
            26214400: 67108864,
            27262976: 4,
            28311552: 65792,
            29360128: 67174400,
            30408704: 260,
            31457280: 65796,
            32505856: 67174404,
            17301504: 67108864,
            18350080: 260,
            19398656: 67174656,
            20447232: 0,
            21495808: 65540,
            22544384: 67109120,
            23592960: 256,
            24641536: 67174404,
            25690112: 65536,
            26738688: 67174660,
            27787264: 65796,
            28835840: 67108868,
            29884416: 67109124,
            30932992: 67174400,
            31981568: 4,
            33030144: 65792
          },
          {
            0: 2151682048,
            65536: 2147487808,
            131072: 4198464,
            196608: 2151677952,
            262144: 0,
            327680: 4198400,
            393216: 2147483712,
            458752: 4194368,
            524288: 2147483648,
            589824: 4194304,
            655360: 64,
            720896: 2147487744,
            786432: 2151678016,
            851968: 4160,
            917504: 4096,
            983040: 2151682112,
            32768: 2147487808,
            98304: 64,
            163840: 2151678016,
            229376: 2147487744,
            294912: 4198400,
            360448: 2151682112,
            425984: 0,
            491520: 2151677952,
            557056: 4096,
            622592: 2151682048,
            688128: 4194304,
            753664: 4160,
            819200: 2147483648,
            884736: 4194368,
            950272: 4198464,
            1015808: 2147483712,
            1048576: 4194368,
            1114112: 4198400,
            1179648: 2147483712,
            1245184: 0,
            1310720: 4160,
            1376256: 2151678016,
            1441792: 2151682048,
            1507328: 2147487808,
            1572864: 2151682112,
            1638400: 2147483648,
            1703936: 2151677952,
            1769472: 4198464,
            1835008: 2147487744,
            1900544: 4194304,
            1966080: 64,
            2031616: 4096,
            1081344: 2151677952,
            1146880: 2151682112,
            1212416: 0,
            1277952: 4198400,
            1343488: 4194368,
            1409024: 2147483648,
            1474560: 2147487808,
            1540096: 64,
            1605632: 2147483712,
            1671168: 4096,
            1736704: 2147487744,
            1802240: 2151678016,
            1867776: 4160,
            1933312: 2151682048,
            1998848: 4194304,
            2064384: 4198464
          },
          {
            0: 128,
            4096: 17039360,
            8192: 262144,
            12288: 536870912,
            16384: 537133184,
            20480: 16777344,
            24576: 553648256,
            28672: 262272,
            32768: 16777216,
            36864: 537133056,
            40960: 536871040,
            45056: 553910400,
            49152: 553910272,
            53248: 0,
            57344: 17039488,
            61440: 553648128,
            2048: 17039488,
            6144: 553648256,
            10240: 128,
            14336: 17039360,
            18432: 262144,
            22528: 537133184,
            26624: 553910272,
            30720: 536870912,
            34816: 537133056,
            38912: 0,
            43008: 553910400,
            47104: 16777344,
            51200: 536871040,
            55296: 553648128,
            59392: 16777216,
            63488: 262272,
            65536: 262144,
            69632: 128,
            73728: 536870912,
            77824: 553648256,
            81920: 16777344,
            86016: 553910272,
            90112: 537133184,
            94208: 16777216,
            98304: 553910400,
            102400: 553648128,
            106496: 17039360,
            110592: 537133056,
            114688: 262272,
            118784: 536871040,
            122880: 0,
            126976: 17039488,
            67584: 553648256,
            71680: 16777216,
            75776: 17039360,
            79872: 537133184,
            83968: 536870912,
            88064: 17039488,
            92160: 128,
            96256: 553910272,
            100352: 262272,
            104448: 553910400,
            108544: 0,
            112640: 553648128,
            116736: 16777344,
            120832: 262144,
            124928: 537133056,
            129024: 536871040
          },
          {
            0: 268435464,
            256: 8192,
            512: 270532608,
            768: 270540808,
            1024: 268443648,
            1280: 2097152,
            1536: 2097160,
            1792: 268435456,
            2048: 0,
            2304: 268443656,
            2560: 2105344,
            2816: 8,
            3072: 270532616,
            3328: 2105352,
            3584: 8200,
            3840: 270540800,
            128: 270532608,
            384: 270540808,
            640: 8,
            896: 2097152,
            1152: 2105352,
            1408: 268435464,
            1664: 268443648,
            1920: 8200,
            2176: 2097160,
            2432: 8192,
            2688: 268443656,
            2944: 270532616,
            3200: 0,
            3456: 270540800,
            3712: 2105344,
            3968: 268435456,
            4096: 268443648,
            4352: 270532616,
            4608: 270540808,
            4864: 8200,
            5120: 2097152,
            5376: 268435456,
            5632: 268435464,
            5888: 2105344,
            6144: 2105352,
            6400: 0,
            6656: 8,
            6912: 270532608,
            7168: 8192,
            7424: 268443656,
            7680: 270540800,
            7936: 2097160,
            4224: 8,
            4480: 2105344,
            4736: 2097152,
            4992: 268435464,
            5248: 268443648,
            5504: 8200,
            5760: 270540808,
            6016: 270532608,
            6272: 270540800,
            6528: 270532616,
            6784: 8192,
            7040: 2105352,
            7296: 2097160,
            7552: 0,
            7808: 268435456,
            8064: 268443656
          },
          {
            0: 1048576,
            16: 33555457,
            32: 1024,
            48: 1049601,
            64: 34604033,
            80: 0,
            96: 1,
            112: 34603009,
            128: 33555456,
            144: 1048577,
            160: 33554433,
            176: 34604032,
            192: 34603008,
            208: 1025,
            224: 1049600,
            240: 33554432,
            8: 34603009,
            24: 0,
            40: 33555457,
            56: 34604032,
            72: 1048576,
            88: 33554433,
            104: 33554432,
            120: 1025,
            136: 1049601,
            152: 33555456,
            168: 34603008,
            184: 1048577,
            200: 1024,
            216: 34604033,
            232: 1,
            248: 1049600,
            256: 33554432,
            272: 1048576,
            288: 33555457,
            304: 34603009,
            320: 1048577,
            336: 33555456,
            352: 34604032,
            368: 1049601,
            384: 1025,
            400: 34604033,
            416: 1049600,
            432: 1,
            448: 0,
            464: 34603008,
            480: 33554433,
            496: 1024,
            264: 1049600,
            280: 33555457,
            296: 34603009,
            312: 1,
            328: 33554432,
            344: 1048576,
            360: 1025,
            376: 34604032,
            392: 33554433,
            408: 34603008,
            424: 0,
            440: 34604033,
            456: 1049601,
            472: 1024,
            488: 33555456,
            504: 1048577
          },
          {
            0: 134219808,
            1: 131072,
            2: 134217728,
            3: 32,
            4: 131104,
            5: 134350880,
            6: 134350848,
            7: 2048,
            8: 134348800,
            9: 134219776,
            10: 133120,
            11: 134348832,
            12: 2080,
            13: 0,
            14: 134217760,
            15: 133152,
            2147483648: 2048,
            2147483649: 134350880,
            2147483650: 134219808,
            2147483651: 134217728,
            2147483652: 134348800,
            2147483653: 133120,
            2147483654: 133152,
            2147483655: 32,
            2147483656: 134217760,
            2147483657: 2080,
            2147483658: 131104,
            2147483659: 134350848,
            2147483660: 0,
            2147483661: 134348832,
            2147483662: 134219776,
            2147483663: 131072,
            16: 133152,
            17: 134350848,
            18: 32,
            19: 2048,
            20: 134219776,
            21: 134217760,
            22: 134348832,
            23: 131072,
            24: 0,
            25: 131104,
            26: 134348800,
            27: 134219808,
            28: 134350880,
            29: 133120,
            30: 2080,
            31: 134217728,
            2147483664: 131072,
            2147483665: 2048,
            2147483666: 134348832,
            2147483667: 133152,
            2147483668: 32,
            2147483669: 134348800,
            2147483670: 134217728,
            2147483671: 134219808,
            2147483672: 134350880,
            2147483673: 134217760,
            2147483674: 134219776,
            2147483675: 0,
            2147483676: 133120,
            2147483677: 2080,
            2147483678: 131104,
            2147483679: 134350848
          }
        ], f = [
          4160749569,
          528482304,
          33030144,
          2064384,
          129024,
          8064,
          504,
          2147483679
        ], l = i.DES = b.extend({
          _doReset: function() {
            for (var w = this._key, u = w.words, h = [], p = 0; p < 56; p++) {
              var D = E[p] - 1;
              h[p] = u[D >>> 5] >>> 31 - D % 32 & 1;
            }
            for (var m = this._subKeys = [], R = 0; R < 16; R++) {
              for (var T = m[R] = [], W = s[R], p = 0; p < 24; p++)
                T[p / 6 | 0] |= h[(a[p] - 1 + W) % 28] << 31 - p % 6, T[4 + (p / 6 | 0)] |= h[28 + (a[p + 24] - 1 + W) % 28] << 31 - p % 6;
              T[0] = T[0] << 1 | T[0] >>> 31;
              for (var p = 1; p < 7; p++)
                T[p] = T[p] >>> (p - 1) * 4 + 3;
              T[7] = T[7] << 5 | T[7] >>> 27;
            }
            for (var g = this._invSubKeys = [], p = 0; p < 16; p++)
              g[p] = m[15 - p];
          },
          encryptBlock: function(w, u) {
            this._doCryptBlock(w, u, this._subKeys);
          },
          decryptBlock: function(w, u) {
            this._doCryptBlock(w, u, this._invSubKeys);
          },
          _doCryptBlock: function(w, u, h) {
            this._lBlock = w[u], this._rBlock = w[u + 1], d.call(this, 4, 252645135), d.call(this, 16, 65535), F.call(this, 2, 858993459), F.call(this, 8, 16711935), d.call(this, 1, 1431655765);
            for (var p = 0; p < 16; p++) {
              for (var D = h[p], m = this._lBlock, R = this._rBlock, T = 0, W = 0; W < 8; W++)
                T |= _[W][((R ^ D[W]) & f[W]) >>> 0];
              this._lBlock = R, this._rBlock = m ^ T;
            }
            var g = this._lBlock;
            this._lBlock = this._rBlock, this._rBlock = g, d.call(this, 1, 1431655765), F.call(this, 8, 16711935), F.call(this, 2, 858993459), d.call(this, 16, 65535), d.call(this, 4, 252645135), w[u] = this._lBlock, w[u + 1] = this._rBlock;
          },
          keySize: 64 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        function d(w, u) {
          var h = (this._lBlock >>> w ^ this._rBlock) & u;
          this._rBlock ^= h, this._lBlock ^= h << w;
        }
        function F(w, u) {
          var h = (this._rBlock >>> w ^ this._lBlock) & u;
          this._lBlock ^= h, this._rBlock ^= h << w;
        }
        x.DES = b._createHelper(l);
        var B = i.TripleDES = b.extend({
          _doReset: function() {
            var w = this._key, u = w.words;
            if (u.length !== 2 && u.length !== 4 && u.length < 6)
              throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
            var h = u.slice(0, 2), p = u.length < 4 ? u.slice(0, 2) : u.slice(2, 4), D = u.length < 6 ? u.slice(0, 2) : u.slice(4, 6);
            this._des1 = l.createEncryptor(C.create(h)), this._des2 = l.createEncryptor(C.create(p)), this._des3 = l.createEncryptor(C.create(D));
          },
          encryptBlock: function(w, u) {
            this._des1.encryptBlock(w, u), this._des2.decryptBlock(w, u), this._des3.encryptBlock(w, u);
          },
          decryptBlock: function(w, u) {
            this._des3.decryptBlock(w, u), this._des2.encryptBlock(w, u), this._des1.decryptBlock(w, u);
          },
          keySize: 192 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        x.TripleDES = b._createHelper(B);
      }(), c.TripleDES;
    });
  }(dr)), dr.exports;
}
var pr = { exports: {} }, ht;
function De() {
  return ht || (ht = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), w0(), b0(), y0(), o0());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.StreamCipher, b = x.algo, i = b.RC4 = C.extend({
          _doReset: function() {
            for (var s = this._key, _ = s.words, f = s.sigBytes, l = this._S = [], d = 0; d < 256; d++)
              l[d] = d;
            for (var d = 0, F = 0; d < 256; d++) {
              var B = d % f, w = _[B >>> 2] >>> 24 - B % 4 * 8 & 255;
              F = (F + l[d] + w) % 256;
              var u = l[d];
              l[d] = l[F], l[F] = u;
            }
            this._i = this._j = 0;
          },
          _doProcessBlock: function(s, _) {
            s[_] ^= E.call(this);
          },
          keySize: 256 / 32,
          ivSize: 0
        });
        function E() {
          for (var s = this._S, _ = this._i, f = this._j, l = 0, d = 0; d < 4; d++) {
            _ = (_ + 1) % 256, f = (f + s[_]) % 256;
            var F = s[_];
            s[_] = s[f], s[f] = F, l |= s[(s[_] + s[f]) % 256] << 24 - d * 8;
          }
          return this._i = _, this._j = f, l;
        }
        x.RC4 = C._createHelper(i);
        var a = b.RC4Drop = i.extend({
          /**
           * Configuration options.
           *
           * @property {number} drop The number of keystream words to drop. Default 192
           */
          cfg: i.cfg.extend({
            drop: 192
          }),
          _doReset: function() {
            i._doReset.call(this);
            for (var s = this.cfg.drop; s > 0; s--)
              E.call(this);
          }
        });
        x.RC4Drop = C._createHelper(a);
      }(), c.RC4;
    });
  }(pr)), pr.exports;
}
var Br = { exports: {} }, lt;
function me() {
  return lt || (lt = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), w0(), b0(), y0(), o0());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.StreamCipher, b = x.algo, i = [], E = [], a = [], s = b.Rabbit = C.extend({
          _doReset: function() {
            for (var f = this._key.words, l = this.cfg.iv, d = 0; d < 4; d++)
              f[d] = (f[d] << 8 | f[d] >>> 24) & 16711935 | (f[d] << 24 | f[d] >>> 8) & 4278255360;
            var F = this._X = [
              f[0],
              f[3] << 16 | f[2] >>> 16,
              f[1],
              f[0] << 16 | f[3] >>> 16,
              f[2],
              f[1] << 16 | f[0] >>> 16,
              f[3],
              f[2] << 16 | f[1] >>> 16
            ], B = this._C = [
              f[2] << 16 | f[2] >>> 16,
              f[0] & 4294901760 | f[1] & 65535,
              f[3] << 16 | f[3] >>> 16,
              f[1] & 4294901760 | f[2] & 65535,
              f[0] << 16 | f[0] >>> 16,
              f[2] & 4294901760 | f[3] & 65535,
              f[1] << 16 | f[1] >>> 16,
              f[3] & 4294901760 | f[0] & 65535
            ];
            this._b = 0;
            for (var d = 0; d < 4; d++)
              _.call(this);
            for (var d = 0; d < 8; d++)
              B[d] ^= F[d + 4 & 7];
            if (l) {
              var w = l.words, u = w[0], h = w[1], p = (u << 8 | u >>> 24) & 16711935 | (u << 24 | u >>> 8) & 4278255360, D = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360, m = p >>> 16 | D & 4294901760, R = D << 16 | p & 65535;
              B[0] ^= p, B[1] ^= m, B[2] ^= D, B[3] ^= R, B[4] ^= p, B[5] ^= m, B[6] ^= D, B[7] ^= R;
              for (var d = 0; d < 4; d++)
                _.call(this);
            }
          },
          _doProcessBlock: function(f, l) {
            var d = this._X;
            _.call(this), i[0] = d[0] ^ d[5] >>> 16 ^ d[3] << 16, i[1] = d[2] ^ d[7] >>> 16 ^ d[5] << 16, i[2] = d[4] ^ d[1] >>> 16 ^ d[7] << 16, i[3] = d[6] ^ d[3] >>> 16 ^ d[1] << 16;
            for (var F = 0; F < 4; F++)
              i[F] = (i[F] << 8 | i[F] >>> 24) & 16711935 | (i[F] << 24 | i[F] >>> 8) & 4278255360, f[l + F] ^= i[F];
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function _() {
          for (var f = this._X, l = this._C, d = 0; d < 8; d++)
            E[d] = l[d];
          l[0] = l[0] + 1295307597 + this._b | 0, l[1] = l[1] + 3545052371 + (l[0] >>> 0 < E[0] >>> 0 ? 1 : 0) | 0, l[2] = l[2] + 886263092 + (l[1] >>> 0 < E[1] >>> 0 ? 1 : 0) | 0, l[3] = l[3] + 1295307597 + (l[2] >>> 0 < E[2] >>> 0 ? 1 : 0) | 0, l[4] = l[4] + 3545052371 + (l[3] >>> 0 < E[3] >>> 0 ? 1 : 0) | 0, l[5] = l[5] + 886263092 + (l[4] >>> 0 < E[4] >>> 0 ? 1 : 0) | 0, l[6] = l[6] + 1295307597 + (l[5] >>> 0 < E[5] >>> 0 ? 1 : 0) | 0, l[7] = l[7] + 3545052371 + (l[6] >>> 0 < E[6] >>> 0 ? 1 : 0) | 0, this._b = l[7] >>> 0 < E[7] >>> 0 ? 1 : 0;
          for (var d = 0; d < 8; d++) {
            var F = f[d] + l[d], B = F & 65535, w = F >>> 16, u = ((B * B >>> 17) + B * w >>> 15) + w * w, h = ((F & 4294901760) * F | 0) + ((F & 65535) * F | 0);
            a[d] = u ^ h;
          }
          f[0] = a[0] + (a[7] << 16 | a[7] >>> 16) + (a[6] << 16 | a[6] >>> 16) | 0, f[1] = a[1] + (a[0] << 8 | a[0] >>> 24) + a[7] | 0, f[2] = a[2] + (a[1] << 16 | a[1] >>> 16) + (a[0] << 16 | a[0] >>> 16) | 0, f[3] = a[3] + (a[2] << 8 | a[2] >>> 24) + a[1] | 0, f[4] = a[4] + (a[3] << 16 | a[3] >>> 16) + (a[2] << 16 | a[2] >>> 16) | 0, f[5] = a[5] + (a[4] << 8 | a[4] >>> 24) + a[3] | 0, f[6] = a[6] + (a[5] << 16 | a[5] >>> 16) + (a[4] << 16 | a[4] >>> 16) | 0, f[7] = a[7] + (a[6] << 8 | a[6] >>> 24) + a[5] | 0;
        }
        x.Rabbit = C._createHelper(s);
      }(), c.Rabbit;
    });
  }(Br)), Br.exports;
}
var vr = { exports: {} }, dt;
function ke() {
  return dt || (dt = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), w0(), b0(), y0(), o0());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.StreamCipher, b = x.algo, i = [], E = [], a = [], s = b.RabbitLegacy = C.extend({
          _doReset: function() {
            var f = this._key.words, l = this.cfg.iv, d = this._X = [
              f[0],
              f[3] << 16 | f[2] >>> 16,
              f[1],
              f[0] << 16 | f[3] >>> 16,
              f[2],
              f[1] << 16 | f[0] >>> 16,
              f[3],
              f[2] << 16 | f[1] >>> 16
            ], F = this._C = [
              f[2] << 16 | f[2] >>> 16,
              f[0] & 4294901760 | f[1] & 65535,
              f[3] << 16 | f[3] >>> 16,
              f[1] & 4294901760 | f[2] & 65535,
              f[0] << 16 | f[0] >>> 16,
              f[2] & 4294901760 | f[3] & 65535,
              f[1] << 16 | f[1] >>> 16,
              f[3] & 4294901760 | f[0] & 65535
            ];
            this._b = 0;
            for (var B = 0; B < 4; B++)
              _.call(this);
            for (var B = 0; B < 8; B++)
              F[B] ^= d[B + 4 & 7];
            if (l) {
              var w = l.words, u = w[0], h = w[1], p = (u << 8 | u >>> 24) & 16711935 | (u << 24 | u >>> 8) & 4278255360, D = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360, m = p >>> 16 | D & 4294901760, R = D << 16 | p & 65535;
              F[0] ^= p, F[1] ^= m, F[2] ^= D, F[3] ^= R, F[4] ^= p, F[5] ^= m, F[6] ^= D, F[7] ^= R;
              for (var B = 0; B < 4; B++)
                _.call(this);
            }
          },
          _doProcessBlock: function(f, l) {
            var d = this._X;
            _.call(this), i[0] = d[0] ^ d[5] >>> 16 ^ d[3] << 16, i[1] = d[2] ^ d[7] >>> 16 ^ d[5] << 16, i[2] = d[4] ^ d[1] >>> 16 ^ d[7] << 16, i[3] = d[6] ^ d[3] >>> 16 ^ d[1] << 16;
            for (var F = 0; F < 4; F++)
              i[F] = (i[F] << 8 | i[F] >>> 24) & 16711935 | (i[F] << 24 | i[F] >>> 8) & 4278255360, f[l + F] ^= i[F];
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function _() {
          for (var f = this._X, l = this._C, d = 0; d < 8; d++)
            E[d] = l[d];
          l[0] = l[0] + 1295307597 + this._b | 0, l[1] = l[1] + 3545052371 + (l[0] >>> 0 < E[0] >>> 0 ? 1 : 0) | 0, l[2] = l[2] + 886263092 + (l[1] >>> 0 < E[1] >>> 0 ? 1 : 0) | 0, l[3] = l[3] + 1295307597 + (l[2] >>> 0 < E[2] >>> 0 ? 1 : 0) | 0, l[4] = l[4] + 3545052371 + (l[3] >>> 0 < E[3] >>> 0 ? 1 : 0) | 0, l[5] = l[5] + 886263092 + (l[4] >>> 0 < E[4] >>> 0 ? 1 : 0) | 0, l[6] = l[6] + 1295307597 + (l[5] >>> 0 < E[5] >>> 0 ? 1 : 0) | 0, l[7] = l[7] + 3545052371 + (l[6] >>> 0 < E[6] >>> 0 ? 1 : 0) | 0, this._b = l[7] >>> 0 < E[7] >>> 0 ? 1 : 0;
          for (var d = 0; d < 8; d++) {
            var F = f[d] + l[d], B = F & 65535, w = F >>> 16, u = ((B * B >>> 17) + B * w >>> 15) + w * w, h = ((F & 4294901760) * F | 0) + ((F & 65535) * F | 0);
            a[d] = u ^ h;
          }
          f[0] = a[0] + (a[7] << 16 | a[7] >>> 16) + (a[6] << 16 | a[6] >>> 16) | 0, f[1] = a[1] + (a[0] << 8 | a[0] >>> 24) + a[7] | 0, f[2] = a[2] + (a[1] << 16 | a[1] >>> 16) + (a[0] << 16 | a[0] >>> 16) | 0, f[3] = a[3] + (a[2] << 8 | a[2] >>> 24) + a[1] | 0, f[4] = a[4] + (a[3] << 16 | a[3] >>> 16) + (a[2] << 16 | a[2] >>> 16) | 0, f[5] = a[5] + (a[4] << 8 | a[4] >>> 24) + a[3] | 0, f[6] = a[6] + (a[5] << 16 | a[5] >>> 16) + (a[4] << 16 | a[4] >>> 16) | 0, f[7] = a[7] + (a[6] << 8 | a[6] >>> 24) + a[5] | 0;
        }
        x.RabbitLegacy = C._createHelper(s);
      }(), c.RabbitLegacy;
    });
  }(vr)), vr.exports;
}
var Er = { exports: {} }, pt;
function Re() {
  return pt || (pt = 1, function(e, v) {
    (function(c, x, A) {
      e.exports = x(j(), w0(), b0(), y0(), o0());
    })(X, function(c) {
      return function() {
        var x = c, A = x.lib, C = A.BlockCipher, b = x.algo;
        const i = 16, E = [
          608135816,
          2242054355,
          320440878,
          57701188,
          2752067618,
          698298832,
          137296536,
          3964562569,
          1160258022,
          953160567,
          3193202383,
          887688300,
          3232508343,
          3380367581,
          1065670069,
          3041331479,
          2450970073,
          2306472731
        ], a = [
          [
            3509652390,
            2564797868,
            805139163,
            3491422135,
            3101798381,
            1780907670,
            3128725573,
            4046225305,
            614570311,
            3012652279,
            134345442,
            2240740374,
            1667834072,
            1901547113,
            2757295779,
            4103290238,
            227898511,
            1921955416,
            1904987480,
            2182433518,
            2069144605,
            3260701109,
            2620446009,
            720527379,
            3318853667,
            677414384,
            3393288472,
            3101374703,
            2390351024,
            1614419982,
            1822297739,
            2954791486,
            3608508353,
            3174124327,
            2024746970,
            1432378464,
            3864339955,
            2857741204,
            1464375394,
            1676153920,
            1439316330,
            715854006,
            3033291828,
            289532110,
            2706671279,
            2087905683,
            3018724369,
            1668267050,
            732546397,
            1947742710,
            3462151702,
            2609353502,
            2950085171,
            1814351708,
            2050118529,
            680887927,
            999245976,
            1800124847,
            3300911131,
            1713906067,
            1641548236,
            4213287313,
            1216130144,
            1575780402,
            4018429277,
            3917837745,
            3693486850,
            3949271944,
            596196993,
            3549867205,
            258830323,
            2213823033,
            772490370,
            2760122372,
            1774776394,
            2652871518,
            566650946,
            4142492826,
            1728879713,
            2882767088,
            1783734482,
            3629395816,
            2517608232,
            2874225571,
            1861159788,
            326777828,
            3124490320,
            2130389656,
            2716951837,
            967770486,
            1724537150,
            2185432712,
            2364442137,
            1164943284,
            2105845187,
            998989502,
            3765401048,
            2244026483,
            1075463327,
            1455516326,
            1322494562,
            910128902,
            469688178,
            1117454909,
            936433444,
            3490320968,
            3675253459,
            1240580251,
            122909385,
            2157517691,
            634681816,
            4142456567,
            3825094682,
            3061402683,
            2540495037,
            79693498,
            3249098678,
            1084186820,
            1583128258,
            426386531,
            1761308591,
            1047286709,
            322548459,
            995290223,
            1845252383,
            2603652396,
            3431023940,
            2942221577,
            3202600964,
            3727903485,
            1712269319,
            422464435,
            3234572375,
            1170764815,
            3523960633,
            3117677531,
            1434042557,
            442511882,
            3600875718,
            1076654713,
            1738483198,
            4213154764,
            2393238008,
            3677496056,
            1014306527,
            4251020053,
            793779912,
            2902807211,
            842905082,
            4246964064,
            1395751752,
            1040244610,
            2656851899,
            3396308128,
            445077038,
            3742853595,
            3577915638,
            679411651,
            2892444358,
            2354009459,
            1767581616,
            3150600392,
            3791627101,
            3102740896,
            284835224,
            4246832056,
            1258075500,
            768725851,
            2589189241,
            3069724005,
            3532540348,
            1274779536,
            3789419226,
            2764799539,
            1660621633,
            3471099624,
            4011903706,
            913787905,
            3497959166,
            737222580,
            2514213453,
            2928710040,
            3937242737,
            1804850592,
            3499020752,
            2949064160,
            2386320175,
            2390070455,
            2415321851,
            4061277028,
            2290661394,
            2416832540,
            1336762016,
            1754252060,
            3520065937,
            3014181293,
            791618072,
            3188594551,
            3933548030,
            2332172193,
            3852520463,
            3043980520,
            413987798,
            3465142937,
            3030929376,
            4245938359,
            2093235073,
            3534596313,
            375366246,
            2157278981,
            2479649556,
            555357303,
            3870105701,
            2008414854,
            3344188149,
            4221384143,
            3956125452,
            2067696032,
            3594591187,
            2921233993,
            2428461,
            544322398,
            577241275,
            1471733935,
            610547355,
            4027169054,
            1432588573,
            1507829418,
            2025931657,
            3646575487,
            545086370,
            48609733,
            2200306550,
            1653985193,
            298326376,
            1316178497,
            3007786442,
            2064951626,
            458293330,
            2589141269,
            3591329599,
            3164325604,
            727753846,
            2179363840,
            146436021,
            1461446943,
            4069977195,
            705550613,
            3059967265,
            3887724982,
            4281599278,
            3313849956,
            1404054877,
            2845806497,
            146425753,
            1854211946
          ],
          [
            1266315497,
            3048417604,
            3681880366,
            3289982499,
            290971e4,
            1235738493,
            2632868024,
            2414719590,
            3970600049,
            1771706367,
            1449415276,
            3266420449,
            422970021,
            1963543593,
            2690192192,
            3826793022,
            1062508698,
            1531092325,
            1804592342,
            2583117782,
            2714934279,
            4024971509,
            1294809318,
            4028980673,
            1289560198,
            2221992742,
            1669523910,
            35572830,
            157838143,
            1052438473,
            1016535060,
            1802137761,
            1753167236,
            1386275462,
            3080475397,
            2857371447,
            1040679964,
            2145300060,
            2390574316,
            1461121720,
            2956646967,
            4031777805,
            4028374788,
            33600511,
            2920084762,
            1018524850,
            629373528,
            3691585981,
            3515945977,
            2091462646,
            2486323059,
            586499841,
            988145025,
            935516892,
            3367335476,
            2599673255,
            2839830854,
            265290510,
            3972581182,
            2759138881,
            3795373465,
            1005194799,
            847297441,
            406762289,
            1314163512,
            1332590856,
            1866599683,
            4127851711,
            750260880,
            613907577,
            1450815602,
            3165620655,
            3734664991,
            3650291728,
            3012275730,
            3704569646,
            1427272223,
            778793252,
            1343938022,
            2676280711,
            2052605720,
            1946737175,
            3164576444,
            3914038668,
            3967478842,
            3682934266,
            1661551462,
            3294938066,
            4011595847,
            840292616,
            3712170807,
            616741398,
            312560963,
            711312465,
            1351876610,
            322626781,
            1910503582,
            271666773,
            2175563734,
            1594956187,
            70604529,
            3617834859,
            1007753275,
            1495573769,
            4069517037,
            2549218298,
            2663038764,
            504708206,
            2263041392,
            3941167025,
            2249088522,
            1514023603,
            1998579484,
            1312622330,
            694541497,
            2582060303,
            2151582166,
            1382467621,
            776784248,
            2618340202,
            3323268794,
            2497899128,
            2784771155,
            503983604,
            4076293799,
            907881277,
            423175695,
            432175456,
            1378068232,
            4145222326,
            3954048622,
            3938656102,
            3820766613,
            2793130115,
            2977904593,
            26017576,
            3274890735,
            3194772133,
            1700274565,
            1756076034,
            4006520079,
            3677328699,
            720338349,
            1533947780,
            354530856,
            688349552,
            3973924725,
            1637815568,
            332179504,
            3949051286,
            53804574,
            2852348879,
            3044236432,
            1282449977,
            3583942155,
            3416972820,
            4006381244,
            1617046695,
            2628476075,
            3002303598,
            1686838959,
            431878346,
            2686675385,
            1700445008,
            1080580658,
            1009431731,
            832498133,
            3223435511,
            2605976345,
            2271191193,
            2516031870,
            1648197032,
            4164389018,
            2548247927,
            300782431,
            375919233,
            238389289,
            3353747414,
            2531188641,
            2019080857,
            1475708069,
            455242339,
            2609103871,
            448939670,
            3451063019,
            1395535956,
            2413381860,
            1841049896,
            1491858159,
            885456874,
            4264095073,
            4001119347,
            1565136089,
            3898914787,
            1108368660,
            540939232,
            1173283510,
            2745871338,
            3681308437,
            4207628240,
            3343053890,
            4016749493,
            1699691293,
            1103962373,
            3625875870,
            2256883143,
            3830138730,
            1031889488,
            3479347698,
            1535977030,
            4236805024,
            3251091107,
            2132092099,
            1774941330,
            1199868427,
            1452454533,
            157007616,
            2904115357,
            342012276,
            595725824,
            1480756522,
            206960106,
            497939518,
            591360097,
            863170706,
            2375253569,
            3596610801,
            1814182875,
            2094937945,
            3421402208,
            1082520231,
            3463918190,
            2785509508,
            435703966,
            3908032597,
            1641649973,
            2842273706,
            3305899714,
            1510255612,
            2148256476,
            2655287854,
            3276092548,
            4258621189,
            236887753,
            3681803219,
            274041037,
            1734335097,
            3815195456,
            3317970021,
            1899903192,
            1026095262,
            4050517792,
            356393447,
            2410691914,
            3873677099,
            3682840055
          ],
          [
            3913112168,
            2491498743,
            4132185628,
            2489919796,
            1091903735,
            1979897079,
            3170134830,
            3567386728,
            3557303409,
            857797738,
            1136121015,
            1342202287,
            507115054,
            2535736646,
            337727348,
            3213592640,
            1301675037,
            2528481711,
            1895095763,
            1721773893,
            3216771564,
            62756741,
            2142006736,
            835421444,
            2531993523,
            1442658625,
            3659876326,
            2882144922,
            676362277,
            1392781812,
            170690266,
            3921047035,
            1759253602,
            3611846912,
            1745797284,
            664899054,
            1329594018,
            3901205900,
            3045908486,
            2062866102,
            2865634940,
            3543621612,
            3464012697,
            1080764994,
            553557557,
            3656615353,
            3996768171,
            991055499,
            499776247,
            1265440854,
            648242737,
            3940784050,
            980351604,
            3713745714,
            1749149687,
            3396870395,
            4211799374,
            3640570775,
            1161844396,
            3125318951,
            1431517754,
            545492359,
            4268468663,
            3499529547,
            1437099964,
            2702547544,
            3433638243,
            2581715763,
            2787789398,
            1060185593,
            1593081372,
            2418618748,
            4260947970,
            69676912,
            2159744348,
            86519011,
            2512459080,
            3838209314,
            1220612927,
            3339683548,
            133810670,
            1090789135,
            1078426020,
            1569222167,
            845107691,
            3583754449,
            4072456591,
            1091646820,
            628848692,
            1613405280,
            3757631651,
            526609435,
            236106946,
            48312990,
            2942717905,
            3402727701,
            1797494240,
            859738849,
            992217954,
            4005476642,
            2243076622,
            3870952857,
            3732016268,
            765654824,
            3490871365,
            2511836413,
            1685915746,
            3888969200,
            1414112111,
            2273134842,
            3281911079,
            4080962846,
            172450625,
            2569994100,
            980381355,
            4109958455,
            2819808352,
            2716589560,
            2568741196,
            3681446669,
            3329971472,
            1835478071,
            660984891,
            3704678404,
            4045999559,
            3422617507,
            3040415634,
            1762651403,
            1719377915,
            3470491036,
            2693910283,
            3642056355,
            3138596744,
            1364962596,
            2073328063,
            1983633131,
            926494387,
            3423689081,
            2150032023,
            4096667949,
            1749200295,
            3328846651,
            309677260,
            2016342300,
            1779581495,
            3079819751,
            111262694,
            1274766160,
            443224088,
            298511866,
            1025883608,
            3806446537,
            1145181785,
            168956806,
            3641502830,
            3584813610,
            1689216846,
            3666258015,
            3200248200,
            1692713982,
            2646376535,
            4042768518,
            1618508792,
            1610833997,
            3523052358,
            4130873264,
            2001055236,
            3610705100,
            2202168115,
            4028541809,
            2961195399,
            1006657119,
            2006996926,
            3186142756,
            1430667929,
            3210227297,
            1314452623,
            4074634658,
            4101304120,
            2273951170,
            1399257539,
            3367210612,
            3027628629,
            1190975929,
            2062231137,
            2333990788,
            2221543033,
            2438960610,
            1181637006,
            548689776,
            2362791313,
            3372408396,
            3104550113,
            3145860560,
            296247880,
            1970579870,
            3078560182,
            3769228297,
            1714227617,
            3291629107,
            3898220290,
            166772364,
            1251581989,
            493813264,
            448347421,
            195405023,
            2709975567,
            677966185,
            3703036547,
            1463355134,
            2715995803,
            1338867538,
            1343315457,
            2802222074,
            2684532164,
            233230375,
            2599980071,
            2000651841,
            3277868038,
            1638401717,
            4028070440,
            3237316320,
            6314154,
            819756386,
            300326615,
            590932579,
            1405279636,
            3267499572,
            3150704214,
            2428286686,
            3959192993,
            3461946742,
            1862657033,
            1266418056,
            963775037,
            2089974820,
            2263052895,
            1917689273,
            448879540,
            3550394620,
            3981727096,
            150775221,
            3627908307,
            1303187396,
            508620638,
            2975983352,
            2726630617,
            1817252668,
            1876281319,
            1457606340,
            908771278,
            3720792119,
            3617206836,
            2455994898,
            1729034894,
            1080033504
          ],
          [
            976866871,
            3556439503,
            2881648439,
            1522871579,
            1555064734,
            1336096578,
            3548522304,
            2579274686,
            3574697629,
            3205460757,
            3593280638,
            3338716283,
            3079412587,
            564236357,
            2993598910,
            1781952180,
            1464380207,
            3163844217,
            3332601554,
            1699332808,
            1393555694,
            1183702653,
            3581086237,
            1288719814,
            691649499,
            2847557200,
            2895455976,
            3193889540,
            2717570544,
            1781354906,
            1676643554,
            2592534050,
            3230253752,
            1126444790,
            2770207658,
            2633158820,
            2210423226,
            2615765581,
            2414155088,
            3127139286,
            673620729,
            2805611233,
            1269405062,
            4015350505,
            3341807571,
            4149409754,
            1057255273,
            2012875353,
            2162469141,
            2276492801,
            2601117357,
            993977747,
            3918593370,
            2654263191,
            753973209,
            36408145,
            2530585658,
            25011837,
            3520020182,
            2088578344,
            530523599,
            2918365339,
            1524020338,
            1518925132,
            3760827505,
            3759777254,
            1202760957,
            3985898139,
            3906192525,
            674977740,
            4174734889,
            2031300136,
            2019492241,
            3983892565,
            4153806404,
            3822280332,
            352677332,
            2297720250,
            60907813,
            90501309,
            3286998549,
            1016092578,
            2535922412,
            2839152426,
            457141659,
            509813237,
            4120667899,
            652014361,
            1966332200,
            2975202805,
            55981186,
            2327461051,
            676427537,
            3255491064,
            2882294119,
            3433927263,
            1307055953,
            942726286,
            933058658,
            2468411793,
            3933900994,
            4215176142,
            1361170020,
            2001714738,
            2830558078,
            3274259782,
            1222529897,
            1679025792,
            2729314320,
            3714953764,
            1770335741,
            151462246,
            3013232138,
            1682292957,
            1483529935,
            471910574,
            1539241949,
            458788160,
            3436315007,
            1807016891,
            3718408830,
            978976581,
            1043663428,
            3165965781,
            1927990952,
            4200891579,
            2372276910,
            3208408903,
            3533431907,
            1412390302,
            2931980059,
            4132332400,
            1947078029,
            3881505623,
            4168226417,
            2941484381,
            1077988104,
            1320477388,
            886195818,
            18198404,
            3786409e3,
            2509781533,
            112762804,
            3463356488,
            1866414978,
            891333506,
            18488651,
            661792760,
            1628790961,
            3885187036,
            3141171499,
            876946877,
            2693282273,
            1372485963,
            791857591,
            2686433993,
            3759982718,
            3167212022,
            3472953795,
            2716379847,
            445679433,
            3561995674,
            3504004811,
            3574258232,
            54117162,
            3331405415,
            2381918588,
            3769707343,
            4154350007,
            1140177722,
            4074052095,
            668550556,
            3214352940,
            367459370,
            261225585,
            2610173221,
            4209349473,
            3468074219,
            3265815641,
            314222801,
            3066103646,
            3808782860,
            282218597,
            3406013506,
            3773591054,
            379116347,
            1285071038,
            846784868,
            2669647154,
            3771962079,
            3550491691,
            2305946142,
            453669953,
            1268987020,
            3317592352,
            3279303384,
            3744833421,
            2610507566,
            3859509063,
            266596637,
            3847019092,
            517658769,
            3462560207,
            3443424879,
            370717030,
            4247526661,
            2224018117,
            4143653529,
            4112773975,
            2788324899,
            2477274417,
            1456262402,
            2901442914,
            1517677493,
            1846949527,
            2295493580,
            3734397586,
            2176403920,
            1280348187,
            1908823572,
            3871786941,
            846861322,
            1172426758,
            3287448474,
            3383383037,
            1655181056,
            3139813346,
            901632758,
            1897031941,
            2986607138,
            3066810236,
            3447102507,
            1393639104,
            373351379,
            950779232,
            625454576,
            3124240540,
            4148612726,
            2007998917,
            544563296,
            2244738638,
            2330496472,
            2058025392,
            1291430526,
            424198748,
            50039436,
            29584100,
            3605783033,
            2429876329,
            2791104160,
            1057563949,
            3255363231,
            3075367218,
            3463963227,
            1469046755,
            985887462
          ]
        ];
        var s = {
          pbox: [],
          sbox: []
        };
        function _(B, w) {
          let u = w >> 24 & 255, h = w >> 16 & 255, p = w >> 8 & 255, D = w & 255, m = B.sbox[0][u] + B.sbox[1][h];
          return m = m ^ B.sbox[2][p], m = m + B.sbox[3][D], m;
        }
        function f(B, w, u) {
          let h = w, p = u, D;
          for (let m = 0; m < i; ++m)
            h = h ^ B.pbox[m], p = _(B, h) ^ p, D = h, h = p, p = D;
          return D = h, h = p, p = D, p = p ^ B.pbox[i], h = h ^ B.pbox[i + 1], { left: h, right: p };
        }
        function l(B, w, u) {
          let h = w, p = u, D;
          for (let m = i + 1; m > 1; --m)
            h = h ^ B.pbox[m], p = _(B, h) ^ p, D = h, h = p, p = D;
          return D = h, h = p, p = D, p = p ^ B.pbox[1], h = h ^ B.pbox[0], { left: h, right: p };
        }
        function d(B, w, u) {
          for (let R = 0; R < 4; R++) {
            B.sbox[R] = [];
            for (let T = 0; T < 256; T++)
              B.sbox[R][T] = a[R][T];
          }
          let h = 0;
          for (let R = 0; R < i + 2; R++)
            B.pbox[R] = E[R] ^ w[h], h++, h >= u && (h = 0);
          let p = 0, D = 0, m = 0;
          for (let R = 0; R < i + 2; R += 2)
            m = f(B, p, D), p = m.left, D = m.right, B.pbox[R] = p, B.pbox[R + 1] = D;
          for (let R = 0; R < 4; R++)
            for (let T = 0; T < 256; T += 2)
              m = f(B, p, D), p = m.left, D = m.right, B.sbox[R][T] = p, B.sbox[R][T + 1] = D;
          return !0;
        }
        var F = b.Blowfish = C.extend({
          _doReset: function() {
            if (this._keyPriorReset !== this._key) {
              var B = this._keyPriorReset = this._key, w = B.words, u = B.sigBytes / 4;
              d(s, w, u);
            }
          },
          encryptBlock: function(B, w) {
            var u = f(s, B[w], B[w + 1]);
            B[w] = u.left, B[w + 1] = u.right;
          },
          decryptBlock: function(B, w) {
            var u = l(s, B[w], B[w + 1]);
            B[w] = u.left, B[w + 1] = u.right;
          },
          blockSize: 64 / 32,
          keySize: 128 / 32,
          ivSize: 64 / 32
        });
        x.Blowfish = C._createHelper(F);
      }(), c.Blowfish;
    });
  }(Er)), Er.exports;
}
(function(e, v) {
  (function(c, x, A) {
    e.exports = x(j(), P0(), ae(), oe(), w0(), ce(), b0(), yt(), wr(), se(), _t(), fe(), ue(), he(), br(), le(), y0(), o0(), de(), pe(), Be(), ve(), Ee(), Ae(), Ce(), Fe(), ye(), _e(), ge(), we(), be(), De(), me(), ke(), Re());
  })(X, function(c) {
    return c;
  });
})(Ft);
var Se = Ft.exports;
const gt = /* @__PURE__ */ Xt(Se);
typeof window < "u" && (window.Buffer = T0.Buffer);
const He = T0.Buffer.alloc(32), Te = `
account-id`, Ne = (e) => e < 0 ? (Number(e) >>> 0).toString(16) : Number(e).toString(16), Bt = (e) => {
  const v = [];
  for (let c = 0; c < e.length; c += 1)
    v[c / 4 | 0] |= e[c] << 24 - 8 * (c % 4);
  return gt.lib.WordArray.create(v, e.length);
}, Ue = (e, v) => {
  const c = [];
  return v > 0 && c.push(e >>> 24), v > 1 && c.push(e >>> 16 & 255), v > 2 && c.push(e >>> 8 & 255), v > 3 && c.push(e & 255), c;
}, Pe = (e, v) => {
  "sigBytes" in e && "words" in e && (v = e.sigBytes, e = e.words);
  let c = [], x, A = 0;
  for (; v > 0; )
    x = Ue(e[A], Math.min(4, v)), v -= x.length, c = [...c, ...x], A++;
  return c;
}, ze = (e) => {
  const v = new Uint8Array(e), c = Kt.unsigned(T0.Buffer.from(v));
  return Ne(c).padStart(8, "0");
}, wt = (e, v = "") => {
  try {
    const c = Et.from(e), x = gt.algo.SHA224.create();
    x.update(Te), x.update(Bt(c.toUint8Array()));
    const A = T0.Buffer.from(He);
    v && A.writeUInt32BE(Number(v)), x.update(Bt(A));
    const C = x.finalize(), b = Pe(C, 28);
    return ze(b) + C.toString();
  } catch (c) {
    return console.error(c), !1;
  }
};
class qe {
  constructor(v = {}) {
    this.state = {
      account: null,
      activeWallet: null,
      provider: null,
      canisterActors: {},
      anonCanisterActors: {},
      config: {
        hostUrl: v.hostUrl || "http://localhost:4943",
        localStorageKey: v.localStorageKey || "pnpConnectedWallet",
        identityProvider: v.identityProvider,
        ...v
      }
    };
  }
  getAccountId() {
    if (!this.state.provider || !this.state.account) return null;
    const v = this.state.account.owner.toString();
    return wt(v) || null;
  }
  getPrincipalId() {
    return this.state.provider && this.state.account ? this.state.account.owner : null;
  }
  async connect(v) {
    const c = Oe.find((b) => b.id === v);
    if (!c)
      throw new Error(`Wallet with ID "${v}" not found.`);
    const x = new c.adapter();
    if (!await x.isAvailable())
      throw new Error(
        `Wallet "${v}" is not available. Please install or enable it.`
      );
    const C = await x.connect(this.state.config);
    if (!C || typeof C == "boolean")
      throw new Error(`Failed to connect to wallet "${v}".`);
    return this.state.account = C, this.state.activeWallet = v, this.state.provider = x, localStorage.setItem(this.state.config.localStorageKey, v), C;
  }
  async disconnect() {
    this.state.provider && await this.state.provider.disconnect(), localStorage.removeItem(this.state.config.localStorageKey), this.state.account = null, this.state.activeWallet = null, this.state.provider = null, this.state.canisterActors = {}, this.state.anonCanisterActors = {};
  }
  async callCanister(v, c, x = [], A, C) {
    const { isAnon: b = !1, isSigned: i = !1 } = C || {};
    if (!this.state.provider && !b)
      throw new Error("Wallet not connected");
    try {
      const E = await this.getActor(v, A || Fr, {
        isAnon: b,
        isSigned: i
      });
      if (typeof E[c] != "function")
        throw new Error(
          `Method "${c}" not found on canister "${v}"`
        );
      return await E[c](...x);
    } catch (E) {
      throw console.error(
        `Error calling method "${c}" on canister "${v}":`,
        E
      ), E;
    }
  }
  async getActor(v, c, x) {
    const { isAnon: A = !1, isForced: C = !1, isSigned: b = !1 } = x || {};
    if (b)
      return this.createSignedActor(v, c);
    const i = A ? this.state.anonCanisterActors : this.state.canisterActors;
    if (!C && i[v])
      return i[v];
    const E = A ? await this.createAnonymousActor(v, c) : await this.createSignedActor(v, c);
    return i[v] = E, E;
  }
  async createAnonymousActor(v, c) {
    var A;
    const x = await Cr.create({
      identity: new vt(),
      host: this.state.config.hostUrl
    });
    return (A = this.state.config.hostUrl) != null && A.includes("localhost") && await x.fetchRootKey(), N0.createActor(c, { agent: x, canisterId: v });
  }
  async createSignedActor(v, c) {
    if (!this.state.provider) throw new Error("Wallet not connected");
    return this.state.provider.createActor(v, c);
  }
  async createAgent(v) {
    if (v != null && v.host ? this.state.config.hostUrl = v.host : v = {
      whitelist: this.state.config.whitelist || [],
      host: this.state.config.hostUrl
    }, !this.state.provider) throw new Error("Wallet not connected");
    await this.state.provider.createAgent({
      whitelist: v.whitelist || [],
      host: v.host
    });
  }
  isWalletConnected() {
    return !!this.state.activeWallet;
  }
  activeWallet() {
    return this.state.account;
  }
}
const Oe = Wt, bt = (e = {}) => new qe(e);
class We {
  constructor(v = {}, c) {
    this.state = "idle", this.transactionLlist = {}, this.stepsList = [], this.completed = [], this.activeStep = "", this.failedSteps = [], this.transactionResults = {}, this.trxArray = [], this._info = !1, this._adapterObj = !1, !(!c || !c.provider) && (Object.entries(v).forEach(([x, A]) => {
      typeof A == "object" && (this.transactionLlist[x] = A);
    }), Object.keys(this.transactionLlist).length > 0 && (this.stepsList = Object.keys(this.transactionLlist), this._adapterObj = c));
  }
  _prepareTrxArry() {
    this.trxArray = [];
    let v = [];
    Object.values(this.transactionLlist).forEach((x) => {
      v.push(x), x.updateNextStep && (this.trxArray.push(v), v = []);
    }), v.length > 0 && this.trxArray.push(v);
    let c = 0;
    return this.trxArray.forEach((x, A) => {
      x.forEach((C, b) => {
        this.trxArray[A][b].stepIndex = c, this.trxArray[A][b].state = "idle", this.trxArray[A][b].onSuccessMain = async (i, E) => {
          const a = E.stepIndex, s = C.onSuccess, _ = C.onFail;
          if (i.err || i.Err || i.ERR)
            return this.failedSteps.push(this.stepsList[a]), this.transactionResults[this.stepsList[a]] = i, this.state = "error", E.state = "error", _ && await _(i), !1;
          this.completed.push(this.stepsList[a]), this.activeStep = this.stepsList[a + 1], this.transactionResults[this.stepsList[a]] = i, E.state = "done", E.updateNextStep && this.trxArray[A + 1] && await E.updateNextStep(i, this.trxArray[A + 1][0]), s && await s(i);
        }, this.trxArray[A][b].onFailMain = async (i, E) => {
          const a = C.onFail, s = E.stepIndex;
          return console.error(`error in  ${this.stepsList[s]} `, this.trxArray[A][b]), console.error(i), this.failedSteps.push(this.stepsList[s]), this.activeStep = this.stepsList[s], this.state = "error", E.state = "error", a && await a(i), !1;
        }, c++;
      });
    }), this.trxArray;
  }
  // ... rest of the methods (retryExecute, execute, _processBatch) remain the same,
  // but you should add type annotations to their parameters and return types.
}
const Me = "http://localhost:4943", Ve = "ryjl3-tyaaa-aaaaa-aaaba-cai", Ze = wt;
let Ar = null;
function $e() {
  return Ar || (Ar = bt({
    whitelist: [Ve],
    host: Me,
    identityProvider: ""
  })), Ar;
}
typeof window < "u" && (window.pnp = {
  PNP: bt,
  BatchTransact: We,
  nns: { AnonymousIdentity: vt, Principal: Et },
  getPNPAdapter: $e
});
export {
  We as BatchTransact,
  bt as createPNP,
  wt as getAccountIdentifier,
  $e as getPNPAdapter,
  Ze as principalIdFromHex,
  Oe as walletsList
};
//# sourceMappingURL=plug-n-play.es.js.map
