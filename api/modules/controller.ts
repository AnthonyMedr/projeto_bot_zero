import { Mei, Sock } from "./Utils/Types"
import { GroupUpdate } from "./Utils/GroupEvent/types";
import { GroupChat } from "./Group"
import { PrivateChat } from "./Private Chat"
import { MessageUpsert } from "./Utils/MessageUpsert/Message";
import { GroupEvent } from "./Utils/GroupEvent/GroupEvents";
import Queue from 'queue'

const myQueue = new Queue({ concurrency: 3, autostart:true, results:[] });

async function MessageUpsert_(sock: Sock, mei: Mei) {
    myQueue.push(async () => {
        let core = await MessageUpsert(sock, mei);
        if (core.is.group)
        {
            await GroupChat(core, sock)
        }else{
            await PrivateChat(core, sock)
        }
    });
}

async function GroupUpdateEvent_(sock: Sock, mei:GroupUpdate){
    GroupEvent(sock, mei)
}
export {MessageUpsert_, GroupUpdateEvent_}