import { GroupParticipant } from "@whiskeysockets/baileys/lib/Types";

export function isAdminOrSuperAdmin(participants: GroupParticipant[], idToCheck:string):boolean {
    const participant = participants.find(participant => participant.id === idToCheck);
    if (!participant) {
      return false;
    }
    return participant.admin === 'admin' || participant.admin === 'superadmin';
  }
  
  export function Action(str: string): string {
    const action =
      str === "add"
        ? "add"
        : str === "ban"
        ? "remove"
        : str === "up"
        ? "promote"
        : str === "down"
        ? "demote"
        : "unknown";
        
    return action;
  }
  
  export function participantExists(participants: GroupParticipant[], numbers: string[]): boolean {
    for (const number of numbers) {
      const found = participants.find((participant) => participant.id === number);
      if (!found) {
        return false;
      }
    }
    return true;
  }
  
  export function extractNumbersFromString(input: string): string[] {
      const numbersRegex = /(\d+)/g;
      const numbersArray: string[] = [];
    
      let match;
      while ((match = numbersRegex.exec(input)) !== null) {
        numbersArray.push(match[0]);
      }
    
      return numbersArray;
    }