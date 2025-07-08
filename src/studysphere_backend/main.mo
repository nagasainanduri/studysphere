import _Principal "mo:base/Principal";
import Option "mo:base/Option";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import User "user/user";
import Group "group/group";
import NoteNFT "note/noteNFT";
import StudyToken "token/studyToken";
import Types "types/types";

actor StudySphere {
  // Stable arrays for persistence
  private stable var groupEntries: [(Types.GroupId, Types.Group)] = [];
  private stable var noteEntries: [(Types.NoteId, Types.NoteNFT)] = [];
  private stable var nextGroupId: Nat = 0;
  private stable var nextNoteId: Nat = 0;

  // Runtime HashMaps
  private var groups = HashMap.HashMap<Types.GroupId, Types.Group>(
    10,
    Nat.equal,
    func(gid: Types.GroupId) : Hash.Hash {
      Nat32.fromNat(gid)
    }
  );
  private var notes = HashMap.HashMap<Types.NoteId, Types.NoteNFT>(
    10,
    Nat.equal,
    func(noteId: Types.NoteId) : Hash.Hash {
      Nat32.fromNat(noteId)
    }
  );
  
  // Initialize managers
  private let userManager = User.UserManager();
  private let groupManager = Group.GroupManager(nextGroupId, groups);
  private let noteNFTManager = NoteNFT.NoteNFTManager(nextNoteId, notes);
  private let studyTokenManager = StudyToken.StudyTokenManager();

  // System methods for persistence
  system func preupgrade() {
    groupEntries := Iter.toArray(groups.entries());
    noteEntries := Iter.toArray(notes.entries());
    nextGroupId := nextGroupId;
    nextNoteId := nextNoteId;
  };

  system func postupgrade() {
    groups := HashMap.fromIter<Types.GroupId, Types.Group>( groupEntries.vals(), 10, Nat.equal, func(gid: Types.GroupId) : Hash.Hash { Nat32.fromNat(gid) } );
    notes := HashMap.fromIter<Types.NoteId, Types.NoteNFT>(noteEntries.vals(), 10, Nat.equal, func(noteId: Types.NoteId) : Hash.Hash { Nat32.fromNat(noteId) });
    groupEntries := [];
    noteEntries := [];

    let highestGroupId = Array.foldLeft<(Types.GroupId, Types.Group), Nat>(groupEntries, 0, func(acc, (gid, _)) = if (gid >= acc) gid + 1 else acc);
    nextGroupId := highestGroupId;
    groupEntries := [];

    let highestNoteId = Array.foldLeft<(Types.NoteId, Types.NoteNFT), Nat>(noteEntries, 0, func(acc, (nid, _)) = if (nid >= acc) nid + 1 else acc);
    nextNoteId := highestNoteId;
  };

  // User Management
  public shared(msg) func registerUser(): async Bool {
    await userManager.registerUser(msg.caller);
  };

  public shared(msg) func getUser(): async ?Types.User {
    await userManager.getUser(msg.caller)
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

  public query func getGroups(): async [(Types.GroupId, Types.Group)] {
    groupManager.getGroups()
  };

  // Note NFT Management
  public shared(msg) func mintNoteNFT(title: Text, subject: Text, content: Text): async ?Types.NoteId {
    let isRegistered = Option.isSome(await userManager.getUser(msg.caller));
    let result = await noteNFTManager.mintNoteNFT(msg.caller, title, subject, content, isRegistered);
    switch (result) {
      case (?newId) { nextNoteId := newId + 1; ?newId };
      case null { null };
    }
  };

  public shared query func getNoteNFT(noteId: Types.NoteId): async ?Types.NoteNFT {
    noteNFTManager.getNoteNFT(noteId)
  };

  public shared func getUserNotes(userId: Types.UserId): async [Types.NoteNFT] {
    await noteNFTManager.getUserNotes(userId)
  };

  // StudyTokens
  public shared(msg) func awardTokens(amount: Nat): async Bool {
    let isRegistered = Option.isSome(await userManager.getUser(msg.caller));
    if (not isRegistered) { return false };
    await studyTokenManager.awardTokens(msg.caller, amount)
  };

  public shared(msg) func getTokens(): async Nat {
    await studyTokenManager.getTokens(msg.caller)
  };
}