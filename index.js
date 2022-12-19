const { default: WASocket, fetchLatestBaileysVersion, DisconnectReason, useMultiFileAuthState } = require('@adiwajshing/baileys')
const Pino = require('pino')
const express = require('express')
const { sessionName } = require('./config.json')
const { Boom } = require('@hapi/boom')
const { existsSync, watchFile } = require('fs')
const path = require('path')
let messageHandler = require('./handler/message')

watchFile('./handler/message.js', () => {
	const dir = path.resolve('./handler/message.js')
	if (dir in require.cache) {
		delete require.cache[dir]
		messageHandler = require('./handler/message')
		console.log(`reloaded message.js`)
	}
})
const app = express()
const host = process.env.HOST ?? '127.0.0.1'
const port = parseInt(process.env.PORT ?? 8000)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/', routes)

app.listen(port, host, () => {
    whatsapp.init()
    console.log(`Server is listening on http://${host}:${port}`)
})
const connect = async () => {
	const { state, saveCreds } = await useMultiFileAuthState(path.resolve(`${sessionName}-session`), Pino({ level: 'silent' }))
	let { version, isLatest } = await fetchLatestBaileysVersion()

	console.log(`Using: ${version}, newer: ${isLatest}`)
	const sock = WASocket({
		printQRInTerminal: true,
		auth: state,
		logger: Pino({ level: 'silent' }),
		version,
	})
	

	sock.ev.on('creds.update', saveCreds)
	sock.ev.on('connection.update', async (up) => {
		const { lastDisconnect, connection } = up
		if (connection) {
			console.log('Connection Status: ', connection)
		}

		if (connection === 'close' && lastDisconnect?.error?.output?.statusCode != 401) {
			console.log('Reconnecting...')
			connect()
		}
	})

	// messages.upsert
	sock.ev.on('messages.upsert', ({ messages, type }) => {
		if (type !== 'notify') return
		messageHandler(sock, messages[0])
	})

	process.on('uncaughtException', (err) => {
		console.error(err?.message)
	})

}
connect()

