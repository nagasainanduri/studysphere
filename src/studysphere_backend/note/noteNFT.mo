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
      if (title == "" or subject == "" or content == "") { return null }; // Validate non-empty fields
      if (price > 1_000_000) { return null }; // Prevent unreasonably high prices
      
      let noteId: Types.NoteId = _nextNoteId;
      _nextNoteId += 1;
      let note: Types.NoteNFT = {
        id = noteId;
        title;
        subject;
        content;
        owner = caller;
        createdAt = Time.now();
        price;
      };
      notes.put(noteId, note);
      
      // Award tokens based on word count (1 token per 10 words, rounded down)
      let wordCount = countWords(content);
      let tokenReward = wordCount / 10;
      if (tokenReward > 0) {
        ignore await studyTokenManager.awardTokens(caller, tokenReward);
      };
      ?noteId
    };

    public func getNoteNFT(noteId: Types.NoteId): ?Types.NoteNFT {
      if (noteId >= _nextNoteId) { return null };
      notes.get(noteId)
    };

    public func getUserNotes(userId: Types.UserId): async [Types.NoteNFT] {
      try {
        let _ = Principal.toText(userId);
        Array.map<(Types.NoteId, Types.NoteNFT), Types.NoteNFT>(
          Array.filter<(Types.NoteId, Types.NoteNFT)>(
            Iter.toArray(notes.entries()),
            func((id: Types.NoteId, note: Types.NoteNFT)) : Bool {
              note.owner == userId
            }
          ),
          func((id: Types.NoteId, note: Types.NoteNFT)) : Types.NoteNFT {
            note
          }
        )
      } catch (_) {
        []
      }
    };

    public func transferNoteNFT(caller: Principal, noteId: Types.NoteId, to: Principal): async Bool {
      let isRegistered = Option.isSome(await userManager.getUser(caller));
      if (not isRegistered) { return false };
      let isRecipientRegistered = Option.isSome(await userManager.getUser(to));
      if (not isRecipientRegistered) { return false };
      switch (notes.get(noteId)) {
        case null { return false };
        case (?note) {
          if (note.owner != caller) { return false };
          let updatedNote: Types.NoteNFT = {
            id = note.id;
            title = note.title;
            subject = note.subject;
            content = note.content;
            owner = to;
            createdAt = note.createdAt;
            price = note.price;
          };
          notes.put(noteId, updatedNote);
          true
        };
      }
    };

    public func purchaseNoteNFT(caller: Principal, noteId: Types.NoteId): async Bool {
      let isRegistered = Option.isSome(await userManager.getUser(caller));
      if (not isRegistered) { return false };
      switch (notes.get(noteId)) {
        case null { return false };
        case (?note) {
          if (note.owner == caller) { return false }; // Cannot purchase own note
          if (note.price == 0) { return false }; // Note not for sale
          let success = await studyTokenManager.spendTokens(caller, note.price);
          if (not success) { return false }; // Insufficient tokens or other error
          let updatedNote: Types.NoteNFT = {
            id = note.id;
            title = note.title;
            subject = note.subject;
            content = note.content;
            owner = caller;
            createdAt = note.createdAt;
            price = 0; 
          };
          notes.put(noteId, updatedNote);
          true
        };
      }
    };
  }
}