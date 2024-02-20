import { GroupParticipant_ } from "../Utils/MessageUpsert/MessageType";
import {  Core_, Sock } from "../Utils/Types";

export async function getAllMembers(core:Core_, sock:Sock, isDefault = false):Promise<string[] | GroupParticipant_>{
    const groupJid = core.Message.from as string ?? ''
    const groupData = await sock.groupMetadata(groupJid)
    const groupMembers:GroupParticipant_ = groupData.participants

    if(isDefault) return groupMembers
    let members:string[] = []
    for(let i in groupMembers) members.push(groupMembers[i].id)
    return members
}

export async function All(core_:Core_, sock:Sock){
    const members:string[]|GroupParticipant_ = await getAllMembers(core_, sock, false)
    await core_.Functions.MsgFunction.sendMention('_@todos_', members as string[])
}