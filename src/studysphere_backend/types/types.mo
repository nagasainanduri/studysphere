import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import _HashMap "mo:base/HashMap";

module {
  public type UserId = Principal;
  public type GroupId = Nat;
  public type NoteId = Nat;

  public type User = {
    id: UserId;
    username : Text;
    registeredAt: Int;
  };

  public type Group = {
    id: GroupId;
    name: Text;
    creator: Principal;
    members: [UserId];
    createdAt: Int;
  };

  public type GroupInfo = {
    id : GroupId;
    name : Text;
    creator : UserId;
    members : [UserId];
    createdAt : Int;
  };

  public type Message = {
    id: Nat;
    groupId: GroupId;
    sender: UserId;
    content: Text;
    timestamp: Int;
  };

  public type NoteNFT = {
    id: NoteId;
    title: Text;
    subject: Text;
    content: Text;
    owner: Principal;
    creator: Principal; 
    createdAt: Int;
    price: Nat; 
  };

  public type Transaction = {
    from: Principal;
    to: Principal;
    amount: Nat;
    timestamp: Int;
  };

}