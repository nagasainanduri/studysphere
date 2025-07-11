import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import HashMap "mo:base/HashMap";
import Types "../types/types";
import User "../user/user";

module {
  public class StudyTokenManager() {
    private var studyTokens = HashMap.HashMap<Types.UserId, Nat>(10, Principal.equal, Principal.hash);
    private let userManager = User.UserManager();

    public func awardTokens(caller: Principal, amount: Nat): async Bool {
      if (amount == 0) { return false };
      let isRegistered = Option.isSome(await userManager.getUser(caller));
      if (not isRegistered) { return false };
      switch (studyTokens.get(caller)) {
        case null { studyTokens.put(caller, amount); true };
        case (?current) { studyTokens.put(caller, current + amount); true };
      }
    };

    public func getTokens(caller: Principal): async Nat {
      switch (studyTokens.get(caller)) {
        case null { 0 };
        case (?amount) { amount };
      }
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
          if (senderBalance < amount) { return false };
          let newSenderBalance = senderBalance - amount; 
          studyTokens.put(caller, newSenderBalance);
          switch (studyTokens.get(to)) {
            case null { studyTokens.put(to, amount); };
            case (?recipientBalance) { studyTokens.put(to, recipientBalance + amount); };
          };
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
  }
}