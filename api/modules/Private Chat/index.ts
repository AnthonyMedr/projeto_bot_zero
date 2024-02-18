import { Core_, Sock } from "../Utils/Types";
import path from "path"

const aliveMedia = path.join(__dirname, 'alive.jpeg')

async function PrivateChat(core:Core_, sock:Sock)
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
    }
    catch(e){
        console.log(e)
    }
}

export {PrivateChat}