import { ParticipantAction } from "@whiskeysockets/baileys";
import { Core_, Sock } from "../Utils/Types";
import { GroupParticipant_ } from "../Utils/MessageUpsert/MessageType";
import {getAllMembers} from "./All"
import { Action, extractNumbersFromString, isAdminOrSuperAdmin, participantExists } from "./utils";

async function validateAddition(core:Core_, sock:Sock): Promise<string[]> {
    const participants = await getAllMembers(core, sock, true)
    const numbers = extractNumbersFromString(core.Message.bodyMessage)
    const quotedParticipant = core.Message.extendedMessage?.participant

    if(quotedParticipant) return [quotedParticipant]
    const newNumbers: string[] = [];
    numbers.forEach((string) => {
      if (participantExists(participants as GroupParticipant_, [string]) === false) {
        const formattedNumber = string.startsWith("55") ? string : "55" + string;
        newNumbers.push(formattedNumber.trim() + '@s.whatsapp.net');
      }
    });

    return newNumbers
}

async function MemberProcess(core:Core_, sock:Sock):Promise<void> {
  const participants = await getAllMembers(core, sock, true)
  const sender = isAdminOrSuperAdmin(participants as GroupParticipant_, core.Message.sender as string)
  const receiver = isAdminOrSuperAdmin(participants as GroupParticipant_, core.Message.extendedMessage?.participant as string)
  
  if(!sender) { await core.Functions.MsgFunction.reply("Você precisar ser admin para isso!"); return }

  const typeOfAction = Action(core.Message.command??''?.replace("/",'').trim())
  if(typeOfAction == "remove"){
      if(receiver){
          await core.Functions.MsgFunction.reply('Ops, não posso fazer isso! Ambos são admins!')
          return
      }
  }

  let isupdate:boolean = false
  if(typeOfAction == 'promote' || typeOfAction == 'demote') isupdate = !isupdate
  const toAdd = await validateAddition(core, sock);

  if(!toAdd){
      await core.Functions.MsgFunction.reply('Ops, não posso fazer isso!')
  }else{
      await core.Functions.AdminFunctions.ParticipantAction(toAdd, typeOfAction as ParticipantAction)
  }
}

async function DeleteMessages(core:Core_, sock:Sock):Promise<void>{
  const participants = await getAllMembers(core, sock, true)
  const sender = isAdminOrSuperAdmin(participants as GroupParticipant_, core.Message.sender as string)
  if(!sender) { await core.Functions.MsgFunction.reply("Você precisar ser admin para isso!"); return }
  if(core.is.quoted){
    await core.Functions.AdminFunctions.deleteMessage()
  }else{
    await core.Functions.MsgFunction.reply("Você precisa marcar uma imagem primeiro!")
  }
}

export {
  MemberProcess,
  DeleteMessages
}

