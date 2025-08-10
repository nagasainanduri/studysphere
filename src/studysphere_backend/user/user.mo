import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Types "../types/types";

module {
  public class UserManager() {
    private var users = HashMap.HashMap<Types.UserId, Types.User>(10, Principal.equal, Principal.hash);
    private var usernames = HashMap.HashMap<Text, Types.UserId>(10, Text.equal, Text.hash);

    public func registerUser(caller: Principal, username: Text): async Result.Result<(), Text> {
      if (Text.size(username) == 0 or Text.size(username) > 20) {
        return #err("Username must be 1-20 characters");
      };
      switch (users.get(caller), usernames.get(username)) {
        case (?_, _) { #err("User already registered") };
        case (_, ?_) { #err("Username taken") };
        case (null, null) {
          let user: Types.User = { 
            id = caller;
            username = username;
            registeredAt = Time.now();
          };
          users.put(caller, user);
          usernames.put(username, caller);
          #ok(())
        };
      }
    };

    public func updateUser(caller: Principal, username: Text): async Result.Result<(), Text> {
      if (Text.size(username) == 0 or Text.size(username) > 20) {
        return #err("Username must be 1-20 characters");
      };
      switch (users.get(caller)) {
        case null { #err("User not registered") };
        case (?user) {
          switch (usernames.get(username)) {
            case (?existingId) {
              if (existingId != caller) { return #err("Username taken") };
            };
            case null {};
          };
          let updatedUser: Types.User = {
            id = user.id;
            username;
            registeredAt = user.registeredAt;
          };
          users.put(caller, updatedUser);
          usernames.delete(user.username);
          usernames.put(username, caller);
          #ok(())
        };
      }
    };

    public func getUser(caller: Principal): async ?Types.User {
      users.get(caller)
    };

    public func getUserByUsername(username: Text): async ?Types.User {
      switch (usernames.get(username)) {
        case null { null };
        case (?userId) { users.get(userId) };
      }
    };

    public func getUserCount(): async Nat {
      users.size()
    };
  }
}