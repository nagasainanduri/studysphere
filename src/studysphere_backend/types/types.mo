import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";

module {
  public type UserId = Principal;
  public type GroupId = Nat;
  public type NoteId = Nat;

  public type User = {
    id: Principal;
  };

  public type Group = {
    id: GroupId;
    name: Text;
    creator: Principal;
    members: [Principal];
    createdAt: Time.Time;
  };

  public type NoteNFT = {
    id: NoteId;
    title: Text;
    subject: Text;
    content: Text;
    owner: Principal;
    createdAt: Int;
  };
}