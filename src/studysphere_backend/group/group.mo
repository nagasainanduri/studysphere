import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Types "../types/types";

module {
  public class GroupManager(nextGroupId: Nat, groups: HashMap.HashMap<Types.GroupId, Types.Group>) {
    private var _nextGroupId: Nat = nextGroupId;

    public func createGroup(caller: Principal, name: Text, isRegistered: Bool): async ?Types.GroupId {
      if (not isRegistered) { return null };
      
      let groupId = _nextGroupId;
      let group: Types.Group = {
        id = groupId;
        name;
        creator = caller;
        members = [caller];
        createdAt = Time.now();
      };
      groups.put(groupId, group);
      _nextGroupId += 1;
      ?groupId
    };

    public func joinGroup(caller: Principal, groupId: Types.GroupId): async Bool {
      Debug.print("joinGroup: groupId=" # Nat.toText(groupId) # ", nextGroupId=" # Nat.toText(_nextGroupId));
      if (groupId >= _nextGroupId) {
        Debug.print("joinGroup: Invalid groupId, too large");
        return false;
      };
      // Additional validation: Ensure groupId is reasonable
      if (groupId > 1_000_000) {
        Debug.print("joinGroup: groupId exceeds reasonable limit");
        return false;
      };
      let hash = Nat32.fromNat(groupId);
      Debug.print("joinGroup: hash=" # Nat32.toText(hash));
      switch (groups.get(groupId)) {
        case null {
          Debug.print("joinGroup: Group not found");
          false
        };
        case (?group) {
          Debug.print("joinGroup: Group found, id=" # Nat.toText(group.id));
          switch (Array.find(group.members, func(m: Types.UserId): Bool { m == caller })) {
            case (?_) {
              Debug.print("joinGroup: Caller already a member");
              false
            };
            case null {
              let updatedMembers = Array.append(group.members, [caller]);
              let updatedGroup: Types.Group = {
                id = group.id;
                name = group.name;
                creator = group.creator;
                members = updatedMembers;
                createdAt = group.createdAt;
              };
              groups.put(groupId, updatedGroup);
              Debug.print("joinGroup: Group updated, new member count=" # Nat.toText(updatedMembers.size()));
              true
            };
          }
        };
      }
    };

    public func getGroups(): [(Types.GroupId, Types.Group)] {
      Iter.toArray(groups.entries())
    };
  }
}