import { Mei, Sock } from "../Types"
import { MediaInfo, MessageUpsertReturnType, Quoted, MessageInfo, contextInfoMessage, MessageTypes, MessageKey, GroupParticipant_, MediaType_ } from "./MessageType"

import {  ParticipantAction, downloadContentFromMessage, generateWAMessageContent} from "@whiskeysockets/baileys"
import { isQuoted, contextinfo, GetType, GetMediaInfo, getMimeType, getBody, isolateCommand } from "./utils"
import { extractLinks } from "../Utils"

import { writeFileSync, readFileSync } from "fs"
import { join } from "path"


const messageTypes_:MessageTypes = [
    'imageMessage', 'pollCreationMessage', 'extendedTextMessage',
    'videoMessage', 'documentWithCaptionMessage', 'conversation',
    'audioMessage', 'stickerMessage', 'liveLocationMessage', 
    'documentMessage', 'contactMessage', 'contactsArrayMessage', 
    'locationMessage', 'viewOnceMessageV2'
]

const getValidMessage = (messages: Mei): MessageInfo => messages.messages.length > 0 ? messages.messages[0] : messages.messages[1];

const MessageUpsert = async (sock:Sock, meiBruto:Mei):Promise<MessageUpsertReturnType> => {

        let mei:MessageInfo = getValidMessage(meiBruto)

        const content:string = JSON.stringify(mei.message)
        const key:MessageKey = mei.key
        const from:MessageKey = key.remoteJid
        const id:MessageKey = key.id   
        
        const group:(boolean) = from?.endsWith('@g.us') ? true : false
        let sender:MessageKey = group ? key.participant : from

        let fromPC:boolean = group ? sender?.includes(':') ? true : false : false
        sender = fromPC ? sender?.split(':')[0] + '@s.whatsapp.net' : sender
        
        const type:string|undefined = GetType(mei, messageTypes_)
        const quotedMessage:Quoted= isQuoted(mei)
        const extendedMessage:contextInfoMessage = contextinfo(mei)
        const bodyMessage:string = getBody(mei).toLowerCase()
        const mediaInfo:MediaInfo = GetMediaInfo(mei, type, quotedMessage)
        let messageType:MediaType_ = type?.replace("Message", "") as MediaType_

        let links:string[]=[]
        if(bodyMessage){ links = extractLinks(bodyMessage) }
    
        const mimetype:string= getMimeType(mei, quotedMessage)
        let seconds:number = 0

        if(type == "videoMessage" && quotedMessage == false){
            seconds = mei.message?.videoMessage?.seconds as number
        }else if(type == "videoMessage" && quotedMessage != false){
            seconds = quotedMessage?.videoMessage?.seconds as number
        }
        
        const command:(string|undefined) = isolateCommand(bodyMessage)
        const quoted = quotedMessage == false ? false : true
        const cmd:boolean = command!=undefined?true:false
        
        const voice:                     boolean = /audioMessage.*"ptt":true/.test(content) ? true : false;
        const music:                     boolean = /audioMessage.*"ptt":false/.test(content)? true : false;
        const img:                       boolean = /imageMessage/.test(content)? true : false;
        const sticker:                   boolean = /stickerMessage/.test(content)? true : false;
        const video:                     boolean = /videoMessage/.test(content)? true : false;
        const giffromwa:                 boolean = /"gifAttribution":"GIPHY"/.test(content)? true : false;
        const gif:                       boolean = /"gifPlayback":true/.test(content)? true : false;
        const vcard:                     boolean = /contactMessage/.test(content)? true : false;
        const multipleVcard:             boolean = /contactsArrayMessage/.test(content)? true : false;
        const liveLocation:              boolean = /liveLocationMessage/.test(content)? true : false;
        const location:                  boolean = /locationMessage/.test(content)? true : false;
        const document:                  boolean = /documentMessage/.test(content)? true : false;
        const product:                   boolean = /productMessage/.test(content)? true : false;
        const forwarded:                 boolean = /forwardingScore/.test(content)? true : false;
        const mentioned:                 boolean = /mentionedJid/.test(content)? true : false;
        const requestPayment:            boolean = /requestPaymentMessage/.test(content)? true : false;
        const sendPayment:               boolean = /sendPaymentMessage/.test(content)? true : false;
        const cancelPayment:             boolean = /cancelPaymentRequestMessage/.test(content)? true : false;
        const templateButtonReplyMessage:boolean = /templateButtonReplyMessage/.test(content)? true : false;
        const buttonsResponseMessage:    boolean = /buttonsResponseMessage/.test(content)? true : false;
        const singleselectlist:          boolean = /singleSelectReply/.test(content)? true : false;
        const docJS:                     boolean = document && /text\/javascript/.test(content)? true : false;
        const docJson:                   boolean = document && /application\/json/.test(content)? true : false;
        const docPdf:                    boolean = document && /application\/pdf/.test(content)? true : false;
        const docWordDoc:                boolean = document && /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/.test(content)? true : false;
        const docHTML:                   boolean = document && /text\/html/.test(content)? true : false;
        const docIMG:                    boolean = document && /"mimetype":"image\//.test(content)? true : false;

        const DataInfo = {
            Message:{
                mei, id, from, sender,
                type, messageType,bodyMessage,quotedMessage, command,
                mediaInfo, seconds, mimetype, links, extendedMessage
            },

            is:{
                group, cmd, fromPC,
                voice, music, img, sticker, video, giffromwa, gif, quoted, 
                forwarded, mentioned, vcard, multipleVcard, liveLocation, location,
                requestPayment, sendPayment, cancelPayment, product,
                buttonsResponseMessage, templateButtonReplyMessage, singleselectlist,
                document, docJS, docJson, docPdf, docWordDoc, docHTML, docIMG
            },
            Functions:{
                MediaFunction:{
                    async downloadMedia(buffer_:boolean, maxSize:number=17) {
                        if(Object.keys(mediaInfo).length == 0) {return "no-data"}
                        if(seconds>maxSize) {return "no-data"}
                        const path_:string = join(__dirname, "..", "..", "temp", "/")
                        let mediaPath:string = ''

                        let buffer:Buffer = await downloadContentFromMessage(mediaInfo, messageType).then(async (stream)=>{
                            let buffer = Buffer.from([])
                            for await (const chunk of stream) {
                                buffer = Buffer.concat([buffer, chunk])
                            }
                            return buffer
                        })

                        if (mimetype === '.mp4') {
                            mediaPath = path_ + ((Math.random() + 1).toString(36).substring(7) + mimetype).toString();
                            writeFileSync(mediaPath, buffer);
                        }
                        else{
                            mediaPath = path_ + (Math.random() + 1).toString(36).substring(7) + mimetype
                            writeFileSync(mediaPath, buffer)
                        }
                        if(mediaPath == 'no-data') {return "no-data"}
                        if(buffer_){ return buffer }
                        return mediaPath
                    }
                },
                MsgFunction:{
                    async reply(text:string, id:string = from??''){
                        await sock.sendMessage(id, { text: text }, { quoted: mei })
                    },

                    async replySticker(path:string|Buffer, id:string = from??'') {
                        let stream_:string|Buffer
                        if(path){
                            if(typeof path === "string"){
                                stream_ = readFileSync(path)
                            }else stream_ = path
                            
                            await sock.sendMessage(id, { sticker: stream_ }) 
                        }
                    },
        
                    async send(text:string, id:string = from??''){
                        await sock.sendMessage(id, { text: text })
                    },
        
                    async sendMention(text:string, mentions:string[], id:string = from??''){
                        await sock.sendMessage(id, { text: text, mentions: mentions })
                    },

                    async sendMedia(path:string, txt:string='', id:string = from??'') {
                        await sock.sendMessage(id, { image: { url: path }, caption: txt??'' })
                    },

                    
                    async sendDoc(path:string, mimetype_:string, txt = '', filename:string = '', id:string = from??'') {
                        await sock.sendMessage(id, { document: { url: path }, caption: txt, mimetype:mimetype_, fileName:filename })
                    },

                    async sendReaction(reaction:string, id:string = from??''){
                        const reactionMessage = {
                            react: { text: reaction, key: key }
                        }
                        await sock.sendMessage(id, reactionMessage)
                    },

                    async sendCircleVideo(path:string, id:string = from??'') {
                        const msg = await generateWAMessageContent(
                            {video: readFileSync(path)},
                            {upload: sock.waUploadToServer },
                        );
                        await sock.relayMessage(id, { ptvMessage: msg.videoMessage },{});
                    },

                    async editMessage(newtext:string, stanzaid:string, participant:string, id:string = from??''){

                        const key:MessageKey = {
                            remoteJid:from,
                            fromMe:true,
                            id:stanzaid,
                            participant:participant
                        }

                        await sock.relayMessage(id, {
                            protocolMessage: {
                              key: key,
                              type: 14,
                              editedMessage: {
                                conversation: newtext
                              }
                            }
                          }, {})
                    }
                },
                AdminFunctions:{
                    async ParticipantAction(participants:string[], type:ParticipantAction, id:string = from??'') {
                        await sock.groupParticipantsUpdate(id, participants, type)
                    },  

                    async deleteMessage() {
                        const key = {
                            remoteJid: from,
                            fromMe: false,
                            id: extendedMessage?.stanzaId??'',
                            participant: extendedMessage?.participant
                        }
                        await sock.sendMessage(from??'', { delete: key })
                    },
                }
            }
        }
        return DataInfo
}

export {MessageUpsert}