import { ParticipantAction, GroupMetadata } from "@whiskeysockets/baileys";

type GroupUpdate = { id: string; participants: string[]; action: ParticipantAction; }
export {
    GroupUpdate,
    GroupMetadata
}