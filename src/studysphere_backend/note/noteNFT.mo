import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Types "../types/types";

module {
  public class NoteNFTManager(nextNoteId: Nat, notes: HashMap.HashMap<Types.NoteId, Types.NoteNFT>) {
    private var _nextNoteId: Nat = nextNoteId;

    public func mintNoteNFT(caller: Principal, title: Text, subject: Text, content: Text, isRegistered: Bool): async ?Types.NoteId {
      if (not isRegistered) { return null };
      
      let noteId: Types.NoteId = _nextNoteId;
      _nextNoteId += 1;
      let note: Types.NoteNFT = {
        id = noteId;
        title;
        subject;
        content;
        owner = caller;
        createdAt = Time.now();
      };
      notes.put(noteId, note);
      ?noteId
    };

    public func getNoteNFT(noteId: Types.NoteId):?Types.NoteNFT {
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
  }
}