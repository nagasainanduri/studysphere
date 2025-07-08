import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Types "../types/types";

module {
  public class UserManager() {
    private var users = HashMap.HashMap<Types.UserId, Types.User>(10, Principal.equal, Principal.hash);
    private var usernames = HashMap.HashMap<Text, Types.UserId>(10, Text.equal, Text.hash);

    public func registerUser(caller: Principal, username: Text): async Bool {
      if (username == "" or username.size() > 20) {
        return false;
      };
      switch (users.get(caller), usernames.get(username)) {
        case (?_, _) { false }; // User already registered
        case (_, ?_) { false }; // Username already taken
        case (null, null) {
          let user: Types.User = { 
            id = caller;
            username = username;
            registeredAt = Time.now();
          };
          users.put(caller, user);
          usernames.put(username, caller);
          true
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
  }
}