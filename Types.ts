import makeWASocket, { MessageUpsertType, WAMessage, MessageType, DownloadableMessage,
    MediaType, WAMediaUpload } from "@whiskeysockets/baileys"
import { proto } from "@whiskeysockets/baileys"
import { AxiosError } from 'axios';
import { MessageUpsert } from "./MessageUpsert/Message";

type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer R> ? R : T;

type Mei = {messages: proto.IWebMessageInfo[]; type: MessageUpsertType; }
type Sock = ReturnType<typeof makeWASocket>
type Core_ = AsyncReturnType<typeof MessageUpsert>;


export { Mei, Core_ ,AxiosError, Sock, WAMessage, MessageType, DownloadableMessage, MediaType, WAMediaUpload}