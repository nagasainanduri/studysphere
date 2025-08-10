import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Option "mo:base/Option";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Types "../types/types";
import User "../user/user";

module {
  public class StudyTokenManager() {
    private var studyTokens = HashMap.HashMap<Types.UserId, Nat>(10, Principal.equal, Principal.hash);
    private var transactions = HashMap.HashMap<Nat, Types.Transaction>(10, Nat.equal, Nat32.fromNat);
    private var nextTransactionId: Nat = 0;
    private let userManager = User.UserManager();

    public func awardTokens(caller: Principal, action: Text): async Bool {
      let isRegistered = Option.isSome(await userManager.getUser(caller));
      if (not isRegistered) { return false };
      let amount = switch (action) {
        case ("mintNote") { 10 };
        case ("postMessage") { 5 };
        case _ { return false };
      };
      let currentBalance = Option.get(studyTokens.get(caller), 0);
      studyTokens.put(caller, currentBalance + amount);
      let transaction: Types.Transaction = {
        from = Principal.fromText("aaaaa-aa"); // System canister
        to = caller;
        amount;
        timestamp = Time.now();
      };
      transactions.put(nextTransactionId, transaction);
      nextTransactionId += 1;
      true
    };

    public func getTokens(caller: Principal): async Nat {
      Option.get(studyTokens.get(caller), 0)
    };

    public func transferTokens(caller: Principal, to: Principal, amount: Nat): async Bool {
      if (amount == 0) { return false };
      let isRegistered = Option.isSome(await userManager.getUser(caller));
      if (not isRegistered) { return false };
      let isRecipientRegistered = Option.isSome(await userManager.getUser(to));
      if (not isRecipientRegistered) { return false };
      if (caller == to) { return false };
      switch (studyTokens.get(caller)) {
        case null { return false };
        case (?senderBalance) {
          if (senderBalance < amount) { return false }; //check before transferring 
          let newSenderBalance = senderBalance - amount; // may create warnings during deployment - needs logic update
          studyTokens.put(caller, newSenderBalance);
          switch (studyTokens.get(to)) {
            case null { studyTokens.put(to, amount); };
            case (?recipientBalance) { studyTokens.put(to, recipientBalance + amount); };
          };
          let transaction: Types.Transaction = {
            from = caller;
            to;
            amount;
            timestamp = Time.now();
          };
          transactions.put(nextTransactionId, transaction);
          nextTransactionId += 1;
          true
        };
      }
    };

    public func spendTokens(caller: Principal, amount: Nat): async Bool {
      if (amount == 0) { return false };
      let isRegistered = Option.isSome(await userManager.getUser(caller));
      if (not isRegistered) { return false };
      switch (studyTokens.get(caller)) {
        case null { return false };
        case (?balance) {
          if (balance < amount) { return false };
          studyTokens.put(caller, balance - amount);
          true
        };
      }
    };

    public func getTokenHistory(caller: Principal): async [Types.Transaction] {
      Array.filter<Types.Transaction>(
        Iter.toArray(transactions.vals()),
        func(t) { t.from == caller or t.to == caller }
      )
    };

    public func getTotalTokens(): async Nat {
      var total: Nat = 0;
      for (balance in studyTokens.vals()) {
        total += balance;
      };
      total
    };
  }
}