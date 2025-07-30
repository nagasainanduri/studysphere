import _Principal "mo:base/Principal";
import Option "mo:base/Option";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Time "mo:base/Time";
import User "user/user";
import Group "group/group";
import NoteNFT "note/noteNFT";
import StudyToken "token/studyToken";
import Types "types/types";

persistent actor StudySphere {
  // Stable arrays for persistence
  private var groupEntries: [(Types.GroupId, Types.Group)] = [];
  private var messageEntries: [(Nat, Types.Message)] = [];
  private var noteEntries: [(Types.NoteId, Types.NoteNFT)] = [];
  private var nextGroupId: Nat = 0;
  private var nextMessageId: Nat = 0;
  private var nextNoteId: Nat = 0;

  // Runtime HashMaps
  private transient var groups = HashMap.HashMap<Types.GroupId, Types.Group>(
    10,
    Nat.equal,
    func(gid: Types.GroupId) : Hash.Hash {
      Nat32.fromNat(gid)
    }
  );
  private transient var messages = HashMap.HashMap<Nat, Types.Message>(
    10,
    Nat.equal,
    func(mid: Nat) : Hash.Hash {
      Nat32.fromNat(mid)
    }
  );
  private transient var notes = HashMap.HashMap<Types.NoteId, Types.NoteNFT>(
    10,
    Nat.equal,
    func(noteId: Types.NoteId) : Hash.Hash {
      Nat32.fromNat(noteId)
    }
  );
  
  // Initialize managers
  private transient let userManager = User.UserManager();
  private transient let groupManager = Group.GroupManager(nextGroupId, groups);
  private transient let noteNFTManager = NoteNFT.NoteNFTManager(nextNoteId, notes);
  private transient let studyTokenManager = StudyToken.StudyTokenManager();

  // System methods for persistence
  system func preupgrade() {
    groupEntries := Iter.toArray(groups.entries());
    messageEntries := Iter.toArray(messages.entries());
    noteEntries := Iter.toArray(notes.entries());
    nextGroupId := nextGroupId;
    nextMessageId := nextMessageId;
    nextNoteId := nextNoteId;
  };

  system func postupgrade() {
    groups := HashMap.fromIter<Types.GroupId, Types.Group>(
      groupEntries.vals(), 
      10, 
      Nat.equal, 
      func(gid: Types.GroupId) : Hash.Hash { Nat32.fromNat(gid) }
    );
    messages := HashMap.fromIter<Nat, Types.Message>(
      messageEntries.vals(),
      10,
      Nat.equal,
      func(mid: Nat) : Hash.Hash { Nat32.fromNat(mid) }
    );
    notes := HashMap.fromIter<Types.NoteId, Types.NoteNFT>(
      noteEntries.vals(), 
      10, 
      Nat.equal, 
      func(noteId: Types.NoteId) : Hash.Hash { Nat32.fromNat(noteId) }
    );
    groupEntries := [];
    messageEntries := [];
    noteEntries := [];

    let highestGroupId = Array.foldLeft<(Types.GroupId, Types.Group), Nat>(
      groupEntries, 
      0, 
      func(acc, (gid, _)) = if (gid >= acc) gid + 1 else acc
    );
    nextGroupId := highestGroupId;

    let highestMessageId = Array.foldLeft<(Nat, Types.Message), Nat>(
      messageEntries,
      0,
      func(acc, (mid, _)) = if (mid >= acc) mid + 1 else acc
    );
    nextMessageId := highestMessageId;

    let highestNoteId = Array.foldLeft<(Types.NoteId, Types.NoteNFT), Nat>(
      noteEntries, 
      0, 
      func(acc, (nid, _)) = if (nid >= acc) nid + 1 else acc
    );
    nextNoteId := highestNoteId;
  };

  // User Management
  public shared(msg) func registerUser(username: Text): async Bool {
    let result = await userManager.registerUser(msg.caller, username);
    switch (result) {
      case (#ok(())) { true };
      case (#err(_)) { false };
    }
  };

  public shared(msg) func updateUser(username: Text): async Bool {
    let result = await userManager.updateUser(msg.caller, username);
    switch (result) {
      case (#ok(())) { true };
      case (#err(_)) { false };
    }
  };

  public shared(msg) func getUser(): async ?Types.User {
    await userManager.getUser(msg.caller)
  };

  public func getUserCount(): async Nat {
    await userManager.getUserCount();
  };

  public shared func getUserByUsername(username: Text): async ?Types.User {
    await userManager.getUserByUsername(username)
  };

  // Group Management
  public shared(msg) func createGroup(name: Text): async ?Types.GroupId {
    let isRegistered = Option.isSome(await userManager.getUser(msg.caller));
    let result = await groupManager.createGroup(msg.caller, name, isRegistered);
    switch (result) {
      case (?newId) { nextGroupId := newId + 1; ?(newId : Types.GroupId) };
      case null { null };
    }
  };

  public shared(msg) func joinGroup(groupId: Types.GroupId): async Bool {
    await groupManager.joinGroup(msg.caller, groupId)
  };

  public shared(msg) func removeMember(groupId: Types.GroupId, member: Principal): async Bool {
    await groupManager.removeMember(msg.caller, groupId, member)
  };

  public shared(msg) func deleteGroup(groupId: Types.GroupId): async Bool {
    await groupManager.deleteGroup(msg.caller, groupId)
  };

  public shared(msg) func sendMessage(groupId: Types.GroupId, content: Text): async Bool {
    let isRegistered = Option.isSome(await userManager.getUser(msg.caller));
    if (not isRegistered) { return false };
    switch (groups.get(groupId)) {
      case null { return false };
      case (?group) {
        switch (Array.find(group.members, func(m: Types.UserId): Bool { m == msg.caller })) {
          case null { return false };
          case (?_) {
            let messageId = nextMessageId;
            let message: Types.Message = {
              id = messageId;
              groupId = groupId;
              content = content;
              sender = msg.caller;
              timestamp = Time.now();
            };
            messages.put(messageId, message);
            nextMessageId += 1;
            return true;
          };
        }
      };
    }
  };

  public shared(msg) func getMessages(groupId: Types.GroupId): async ?[Types.Message] {
    let isRegistered = Option.isSome(await userManager.getUser(msg.caller));
    if (not isRegistered) { return null };
    switch (groups.get(groupId)) {
      case null { return null };
      case (?group) {
        switch (Array.find(group.members, func(m: Types.UserId): Bool { m == msg.caller })) {
          case null { return null };
          case (?_) {
            let groupMessages = Array.filter<Types.Message>(
              Iter.toArray(messages.vals()),
              func(msg: Types.Message): Bool { msg.groupId == groupId }
            );
            return ?groupMessages;
          };
        }
      };
    }
  };

  public shared(msg) func deleteMessage(groupId: Types.GroupId, messageId: Nat): async Bool {
    let isRegistered = Option.isSome(await userManager.getUser(msg.caller));
    if (not isRegistered) { return false };
    switch (groups.get(groupId)) {
      case null { return false };
      case (?group) {
        if (group.creator != msg.caller) { return false };
        switch (messages.get(messageId)) {
          case null { return false };
          case (?message) {
            if (message.groupId != groupId) { return false };
            messages.delete(messageId);
            true
          };
        }
      };
    }
  };

  public query func getGroups(): async [(Types.GroupId, Types.GroupInfo)] {
    let entries = groupManager.getGroups();
    Array.map<(Types.GroupId, Types.Group), (Types.GroupId, Types.GroupInfo)>(
      entries,
      func((id, group)) {
        (id, {
          id = group.id;
          name = group.name;
          creator = group.creator;
          members = group.members;
          createdAt = group.createdAt;
        })
      }
    )
  };

  // Note NFT Management
  public shared(msg) func mintNoteNFT(title: Text, subject: Text, content: Text, price: Nat): async ?Types.NoteId {
    let isRegistered = Option.isSome(await userManager.getUser(msg.caller));
    let result = await noteNFTManager.mintNoteNFT(msg.caller, title, subject, content, price, isRegistered);
    switch (result) {
      case (?newId) { nextNoteId := newId + 1; ?newId };
      case null { null };
    }
  };

  public shared(msg) func transferNoteNFT(noteId: Types.NoteId, to: Principal): async Bool {
    let isRegistered = Option.isSome(await userManager.getUser(msg.caller));
    if (not isRegistered) { return false };
    await noteNFTManager.transferNoteNFT(msg.caller, noteId, to)
  };

  public shared(msg) func purchaseNoteNFT(noteId: Types.NoteId): async Bool {
    let isRegistered = Option.isSome(await userManager.getUser(msg.caller));
    if (not isRegistered) { return false };
    await noteNFTManager.purchaseNoteNFT(msg.caller, noteId)
  };

  public shared query func getNoteNFT(noteId: Types.NoteId): async ?Types.NoteNFT {
    noteNFTManager.getNoteNFT(noteId)
  };

  public shared func getUserNotes(userId: Types.UserId): async [Types.NoteNFT] {
    await noteNFTManager.getUserNotes(userId)
  };

  public func searchNotes(searchTerm: Text) : async [Types.NoteNFT] {
    await noteNFTManager.searchNotes(searchTerm)
  };

  // StudyTokens
  public shared(msg) func awardTokens(amount: Text): async Bool {
    let isRegistered = Option.isSome(await userManager.getUser(msg.caller));
    if (not isRegistered) { return false };
    await studyTokenManager.awardTokens(msg.caller, amount)
  };

  public shared(msg) func transferTokens(to: Principal, amount: Nat): async Bool {
    let isRegistered = Option.isSome(await userManager.getUser(msg.caller));
    if (not isRegistered) { return false };
    await studyTokenManager.transferTokens(msg.caller, to, amount)
  };

  public shared(msg) func getTokens(): async Nat {
    await studyTokenManager.getTokens(msg.caller)
  };
}