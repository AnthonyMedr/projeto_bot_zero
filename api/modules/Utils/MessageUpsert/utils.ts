import { MessageInfo, Quoted, contextInfoMessage, MessageTypes, MediaInfo, commandIsolated, GetMimeType } from "./MessageType"

export function isQuoted(mei:MessageInfo):Quoted{
    const message:string = JSON.stringify(mei.message)
    if(message?.includes('quotedMessage')){
        return mei.message?.extendedTextMessage?.contextInfo?.quotedMessage
    } return false
}

export function contextinfo(mei:MessageInfo):contextInfoMessage{
    const message:string = JSON.stringify(mei.message)
    if(message?.includes('quotedMessage')){
        return mei.message?.extendedTextMessage?.contextInfo
    } return undefined
}

export function GetType(mei:MessageInfo, messageTypes:MessageTypes):string {
    let type:string=""
    if(mei.message){
        const Keys:string[] = Object.keys(mei.message as object)
        type = messageTypes[messageTypes.findIndex(item => Keys.includes(item))]
    }
    if(type==='extendedTextMessage'){
        const keys_ = mei.message?.extendedTextMessage?.contextInfo?.quotedMessage
        if(keys_ != undefined){
            const newKeys = Object.keys(keys_)
            let index:number = messageTypes.findIndex(item => newKeys.includes(item))
            if(index === -1){ return type }
            else{ return messageTypes[index] }   
        }
    }
    return type
}

export function GetMediaInfo(mei:MessageInfo, type:string, quoted:Quoted):MediaInfo{
    const message = (quoted || mei.message);
    const mediaType = type === "imageMessage" ? message?.imageMessage : message?.videoMessage;
    if (mediaType) {
      return {
            mediaKey: mediaType.mediaKey,
            directPath: mediaType.directPath,
            url: mediaType.url
      };
    }
    return {mediaKey:null, directPath:null, url:null};
}

export function getMimeType(obj:MessageInfo, quoted:Quoted):GetMimeType {
    let message:MessageInfo|Quoted;
    let mediaMessage:MessageInfo|Quoted;
    let regex:RegExp = /[^/]+$/

    if(quoted){
        message = (quoted || obj.message)
    }else { message = obj.message}

    if(message?.documentWithCaptionMessage){
        mediaMessage = (message?.documentWithCaptionMessage?.message || message)
    }else{ mediaMessage = message}

    const mediaMessages = 
        mediaMessage?.audioMessage?.mimetype ||
        mediaMessage?.videoMessage?.mimetype ||
        mediaMessage?.imageMessage?.mimetype ||
        mediaMessage?.documentMessage?.mimetype ||
        'no-media'

    if(mediaMessages != 'no-media'){
        const newText:RegExpExecArray|null = regex.exec(mediaMessages)
        if(newText) return `.${newText[0]}`
    }
    return mediaMessages
}

export function getBody (mei:MessageInfo):string{
    const message = mei.message;
    if (message) {
      const caption =
        message.extendedTextMessage?.text ||
        message.imageMessage?.caption ||
        message.documentWithCaptionMessage?.message?.documentMessage?.caption ||
        message.videoMessage?.caption ||
        message.conversation ||
        message.liveLocationMessage?.caption ||
        message.documentMessage?.title ||
        message.contactMessage?.displayName ||
        message.contactsArrayMessage?.contacts?.map(contact => contact.displayName).join('\n') ||
        `${message.locationMessage?.name} ${message.locationMessage?.address}` ||
        `${message.pollCreationMessage?.name} ${message.pollCreationMessage?.options?.map(poll => poll.optionName).join('\n')}`
      if (caption) {
        return caption;
      }
    }
    return "no-text";
}

export function isolateCommand(text: string): commandIsolated {
    if(text === "no-text") return undefined
    const words = text.trim().split(/\s+/);
    if (words.length > 0 && words[0].startsWith('/')) {
      return words[0].substr(1);
    }
    return undefined;
}
