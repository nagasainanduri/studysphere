import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Types "../types/types";

module {
  public class UserManager() {
    private var users = HashMap.HashMap<Types.UserId, Types.User>(10, Principal.equal, Principal.hash);

    public func registerUser(caller: Principal): async Bool {
      // Skip anonymous principal check, as II authentication is handled by frontend
      switch (users.get(caller)) {
        case (?_) { false };
        case null {
          let user: Types.User = { id = caller};
          users.put(caller, user);
          true
        };
      }
    };

    public func getUser(caller: Principal): async ?Types.User {
      users.get(caller)
    };
  }
}