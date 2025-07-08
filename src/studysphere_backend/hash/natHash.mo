import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";

module {
  /// Custom hash function for Nat using prime multipliers and bitwise operations.
  public func natHash(n: Nat) : Nat {
    let n64 = Nat64.fromNat(n);
    let prime1 : Nat64 = 0x9e3779b97f4a7c15;
    let prime2 : Nat64 = 0xc2b2ae3d27d4eb4f;
    let h1 = n64 * prime1;
    let h2 = (n64 ^ (n64 >> 33)) * prime2;
    let hash64 = h1 ^ h2;
    Nat64.toNat(hash64)
  }
}