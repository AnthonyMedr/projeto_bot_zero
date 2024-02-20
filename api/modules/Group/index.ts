import { Core_, Sock } from "../Utils/Types";
import path from "path"
import { MakeSticker } from "../functions/stickers";
import { MemberProcess, DeleteMessages } from "../functions/admin";

const aliveMedia = path.join(__dirname, 'alive.jpeg')

async function GroupChat(core:Core_, sock:Sock)
{
    try
    {
        if(core.is.cmd)
        {
            let command: string | undefined = core.Message.command;
            if(command == "bot")
            {
                await core.Functions.MsgFunction.sendMedia(aliveMedia, "Estou aqui! Porém ainda estou em processo de desenvolvimento e apredizagem");
                return 0
            }
            

        }3

        {
            let command: string | undefined = core.Message.command;
            if(command == "palpite")
            {
                await core.Functions.MsgFunction.reply("Hoje dá Flamengo");
                return 0
            }
            

        }3
        
        {
        let command: string | undefined = core.Message.command;
        if(command == "fig"){
            await MakeSticker(core)

    }
}
    let command: string | undefined = core.Message.command;
    if(command == "ban"){
       await  MemberProcess(core,sock)
    }

    {
        let command: string | undefined = core.Message.command;
        if(command == "del"){
            await DeleteMessages(core,sock)
        }
    }


    }
    catch(e){
        console.log(e)
    }
}

export {GroupChat}