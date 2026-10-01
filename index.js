const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const P = require("pino")
async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const sock = makeWASocket({ auth: state, logger: P({ level: 'silent' }) })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('messages.upsert', async ({messages}) => {
    const m = messages[0]
    if(!m.message) return
    const text = m.message.conversation || m.message.extendedTextMessage?.text
    const from = m.key.remoteJid
    if(text === '.ping') {
      await sock.sendMessage(from, { text: 'Pong! 🚀 my-first-bot online!' })
    }
  })
}
start()