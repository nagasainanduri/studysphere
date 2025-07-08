import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Types "../types/types";

module {
  public class StudyTokenManager() {
    private var studyTokens = HashMap.HashMap<Types.UserId, Nat>(10, Principal.equal, Principal.hash);

    public func awardTokens(caller: Principal, amount: Nat):async Bool {
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
  }
}