import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import {MessageUpsert_, GroupUpdateEvent_} from './modules/controller'
import { Boom } from '@hapi/boom'
import fs from "fs"
import path from 'path'

const temp_path = path.join(__dirname, 'temp', '/')
async function connectToWhatsApp () {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({
        auth:state,
        printQRInTerminal: true
    })
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        let shouldReconnect;
        if(connection === 'close') {
            if(lastDisconnect != undefined){
                shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            }
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log("Please Wait...")
            if (!fs.existsSync(temp_path)){
                fs.mkdirSync(temp_path);
            }
            console.log('opened connection')
        }
    })
    sock.ev.on('messages.upsert', async mei => {
        try{
            await MessageUpsert_(sock, mei)
        }catch(e){
            console.log(e)
        }         
    })
    sock.ev.on('group-participants.update', async event =>{ await GroupUpdateEvent_(sock, event) })
    sock.ev.on ('creds.update', saveCreds)
}
// run in main file
connectToWhatsApp()