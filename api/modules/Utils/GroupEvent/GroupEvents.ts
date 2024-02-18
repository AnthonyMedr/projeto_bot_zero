import { Sock } from "../Types"
import {GroupUpdate, GroupMetadata} from './types'


async function GroupEvent(sock: Sock, mei:GroupUpdate){
    const members:string[] = mei.participants
    const group:string = mei.id

    const actualGroup:GroupMetadata = await sock.groupMetadata(group)
    const groupName:string|undefined = actualGroup?.subject
    const groupDesc:string|undefined = actualGroup?.desc

    let queryGroup:string

    if(group){
        if(mei.action == "add"){
            queryGroup = `BEM VINDO A :\n*${groupName}*\n\n${groupDesc}`
            await sock.sendMessage(group, {text: queryGroup, mentions: members})
        }
    }
}

export {
    GroupEvent
}