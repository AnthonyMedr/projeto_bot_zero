import { Core_ } from "../Utils/Types"; 
import { DownloadMedia } from "./types";
import { CutImage, ConvertImage } from "./Utils/ImageProcess"
import { CutVideos, ConvertVideo } from "./Utils/VideoProcess"

async function downloadSrc(core:Core_):Promise<DownloadMedia>{
    return await core.Functions.MediaFunction.downloadMedia(core.is.img)
}

async function MakeSticker(core:Core_){
    let convertMedia:string|Buffer='no-data'
    const msgError:string = "Houve um erro e eu infelizmente não consegui enviar seu sticker.... :("

    const iscut = core.Message.bodyMessage.includes("-c")
    const srcMedia = await downloadSrc(core)

    if(srcMedia == 'no-data') return

    if(!core.is.img){
        if(iscut) convertMedia = await CutVideos(srcMedia as string)
        else convertMedia = await ConvertVideo(srcMedia as string)
    }else{
        if(iscut) convertMedia = await CutImage(srcMedia as Buffer)
        else convertMedia = await ConvertImage(srcMedia as Buffer)
    }
    console.log(convertMedia)
    if(convertMedia != "no-data"){
        await core.Functions.MsgFunction.replySticker(convertMedia)
    }else{
        console.log(convertMedia)
        await core.Functions.MsgFunction.reply(msgError)
    }
}

export {
    MakeSticker
}