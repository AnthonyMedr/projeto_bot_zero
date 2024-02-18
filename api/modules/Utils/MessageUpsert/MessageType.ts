import { ParticipantAction, GroupParticipant, MediaType} from "@whiskeysockets/baileys";
import { proto } from "@whiskeysockets/baileys"

export type MessageKey = (proto.MessageKey|string|null|undefined|proto.IMessageKey)

export type MessageType = 'imageMessage' | 'pollCreationMessage' | 'extendedTextMessage' |
  'videoMessage' | 'documentWithCaptionMessage' | 'conversation' |
  'audioMessage' | 'stickerMessage' | 'liveLocationMessage' |
  'documentMessage' | 'contactMessage' | 'contactsArrayMessage' |
  'locationMessage' | 'viewOnceMessageV2';

export type MessageTypes = MessageType[]
export type MediaType_ = MediaType
export type MessageInfo = proto.IWebMessageInfo
export type Quoted = (false|proto.IMessage|undefined|null)
export type contextInfoMessage = proto.IContextInfo | null | undefined
export type extendedMessage = proto.Message.IExtendedTextMessage

export type commandIsolated = string | undefined

export type GroupParticipant_ = GroupParticipant[]
export type GetMimeType = string | 'no-media';


export interface MediaInfo {
    mediaKey: (Uint8Array|null|undefined),
    directPath: (string|null|undefined)
    url: (string|null|undefined)
}

export type MessageUpsertReturnType = {
    Message: {
      mei: MessageInfo;
      id: MessageKey;
      from: MessageKey;
      sender: MessageKey;
      type: string;
      messageType: string;
      bodyMessage: string;
      quotedMessage: Quoted | false;
      command: string | undefined;
      mediaInfo:MediaInfo
      seconds: number;
      mimetype: string;
      links: string[];
      extendedMessage: contextInfoMessage;
    };
    is: {
      group: boolean;
      cmd: boolean;
      fromPC: boolean;
      voice: boolean;
      music: boolean;
      img: boolean;
      sticker: boolean;
      video: boolean;
      giffromwa: boolean;
      gif: boolean;
      quoted: boolean;
      forwarded: boolean;
      mentioned: boolean;
      vcard: boolean;
      multipleVcard: boolean;
      liveLocation: boolean;
      location: boolean;
      requestPayment: boolean;
      sendPayment: boolean;
      cancelPayment: boolean;
      product: boolean;
      buttonsResponseMessage: boolean;
      templateButtonReplyMessage: boolean;
      singleselectlist: boolean;
      document: boolean;
      docJS: boolean;
      docJson: boolean;
      docPdf: boolean;
      docWordDoc: boolean;
      docHTML: boolean;
      docIMG: boolean;
    };
    Functions: {
      MediaFunction: {
        downloadMedia(buffer_: boolean, maxSize?: number): Promise<Buffer | string>;
      };
      MsgFunction: {
        reply: (text: string, id?: string) => Promise<void>;
        replySticker: (path: string | Buffer, id?: string) => Promise<void>;
        send: (text: string, id: string) => Promise<void>;
        sendMention: (text: string, mentions: string[], id?: string) => Promise<void>;
        sendMedia: (path: string, txt?: string, id?: string) => Promise<void>;
        sendDoc: (
          path: string,
          mimetype_: string,
          txt?: string,
          filename?: string,
          id?: string
        ) => Promise<void>;
        sendReaction: (reaction: string, id?: string) => Promise<void>;
        sendCircleVideo: (path: string, id?: string) => Promise<void>;
        editMessage: (
          newtext: string,
          stanzaid: string,
          participant: string,
          id?: string
        ) => Promise<void>;
      };
      AdminFunctions: {
        ParticipantAction(participants: string[], type: ParticipantAction, id?: string): Promise<void>;
        deleteMessage(): Promise<void>;
      };
    };
  };