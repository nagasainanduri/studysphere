import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Types "../types/types";
import User "../user/user";
import StudyToken "../token/studyToken";

module {
  public class NoteNFTManager(nextNoteId: Nat, notes: HashMap.HashMap<Types.NoteId, Types.NoteNFT>) {
    private var _nextNoteId: Nat = nextNoteId;
    private let userManager = User.UserManager();
    private let studyTokenManager = StudyToken.StudyTokenManager();

    // Helper function to count words in content
    private func countWords(content: Text): Nat {
      let words = Iter.toArray(Text.split(content, #char ' '));
      let nonEmptyWords = Array.filter<Text>(
        words,
        func(word: Text): Bool { word.size() > 0 }
      );
      nonEmptyWords.size()
    };

    public func mintNoteNFT(caller: Principal, title: Text, subject: Text, content: Text, price: Nat, isRegistered: Bool): async ?Types.NoteId {
      if (not isRegistered) { return null };
      if (title == "" or subject == "" or content == "") { return null };
      if (price > 1_000_000) { return null };
      
      let noteId: Types.NoteId = _nextNoteId;
      _nextNoteId += 1;
      let note: Types.NoteNFT = {
        id = noteId;
        title;
        subject;
        content;
        owner = caller;
        creator = caller; // Both owner and creator set to caller when minting
        createdAt = Time.now();
        price;
      };
      notes.put(noteId, note);
      
      let wordCount = countWords(content);
      let tokenReward = wordCount / 10;
      if (tokenReward > 0) {
        ignore await studyTokenManager.awardTokens(caller, Nat.toText(tokenReward));
      };
      ?noteId
    };

    public func getNoteNFT(noteId: Types.NoteId): ?Types.NoteNFT {
      if (noteId >= _nextNoteId) { return null };
      notes.get(noteId)
    };

    //function to get all notes by user
    public func getUserNotes(userId: Types.UserId): async [Types.NoteNFT] {
      try {
        let _ = Principal.toText(userId);
        Array.map<(Types.NoteId, Types.NoteNFT), Types.NoteNFT>(
          Array.filter<(Types.NoteId, Types.NoteNFT)>(
            Iter.toArray(notes.entries()),
            func((id, note)) : Bool { note.owner == userId }
          ),
          func((id, note)) : Types.NoteNFT { note }
        )
      } catch (_) {
        []
      }
    };


    //function to transfer notes
    public func transferNoteNFT(caller: Principal, noteId: Types.NoteId, to: Principal): async Bool {
      let isRegistered = Option.isSome(await userManager.getUser(caller));
      if (not isRegistered) { return false };
      let isRecipientRegistered = Option.isSome(await userManager.getUser(to));
      if (not isRecipientRegistered) { return false };
      switch (notes.get(noteId)) {
        case (null) { return false };
        case (?note) {
          if (note.owner != caller) { return false };
          let updatedNote: Types.NoteNFT = {
            id = note.id;
            title = note.title;
            subject = note.subject;
            content = note.content;
            owner = to;
            creator = note.owner; // Preserve original creator
            createdAt = note.createdAt;
            price = note.price;
          };
          notes.put(noteId, updatedNote);
          true
        };
      }
    };

    //function to purchase notes
    public func purchaseNoteNFT(caller: Principal, noteId: Types.NoteId): async Bool {
      let isRegistered = Option.isSome(await userManager.getUser(caller));
      if (not isRegistered) { return false };
      switch (notes.get(noteId)) {
        case (null) { return false };
        case (?note) {
          if (note.owner == caller) { return false };
          if (note.price == 0) { return false };
          let success = await studyTokenManager.spendTokens(caller, note.price);
          if (not success) { return false };
          let updatedNote: Types.NoteNFT = {
            id = note.id;
            title = note.title;
            subject = note.subject;
            content = note.content;
            owner = caller;
            creator = note.owner;
            createdAt = note.createdAt;
            price = 0; 
          };
          notes.put(noteId, updatedNote);
          true
        };
      }
    };

    //search notes by title or subject
    public func searchNotes(searchTerm: Text) : async [Types.NoteNFT] {
      let lowerSearch = Text.toLowercase(searchTerm);
      return Array.filter<Types.NoteNFT>(
        Iter.toArray(notes.vals()),
        func(note: Types.NoteNFT): Bool {
          Text.contains(Text.toLowercase(note.title), #text lowerSearch) or
          Text.contains(Text.toLowercase(note.subject), #text lowerSearch)
        }
      );
    };
  }
}