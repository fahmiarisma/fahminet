const { WASocket, proto, getContentType, downloadContentFromMessage } = require('@adiwajshing/baileys')
const axios = require('axios').default
const { PassThrough } = require('stream')
const moment = require('moment-timezone')
const ffmpeg = require('fluent-ffmpeg')
const FormData = require('form-data')
const chalk = require('chalk')
const fs = require('fs')
const crypto = require('crypto') 
const ms = require('parse-ms')
const { menuowner } = require('../utils/menuowner')
const { formatmla } = require('../utils/formatmla')
const { formatmlb } = require('../utils/formatmlb')
const { formatmlc } = require('../utils/formatmlc')
const { formatffa } = require('../utils/formatffa')
const { formathdu } = require('../utils/formathdu')
const { formatgml } = require('../utils/formatgml')
const { formattko } = require('../utils/formattko')
const { formatmld } = require('../utils/formatmld')
const { formatmle } = require('../utils/formatmle')
const { formatuff } = require('../utils/formatuff')
const { formatpbc } = require('../utils/formatpbc')
const { formataov } = require('../utils/formataov')
const { formatlom } = require('../utils/formatlom')
const { formatuhd } = require('../utils/formatuhd')
const { formatcod } = require('../utils/formatcod')
const { formatlot } = require('../utils/formatlot')
const { formatomg } = require('../utils/formatomg')
const { formatgen } = require('../utils/formatgen')
const { formatsus } = require('../utils/formatsus')
const { formatdrj } = require('../utils/formatdrj')
const { getBuffer, serialize, getRandom, fetchJson, runtime, reSize } = require("../utils/myfunc");
const { addResponList, delResponList, resetListAll, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('../utils/respon-list')
const { isSetOpen, addSetOpen, removeSetOpen, changeSetOpen, getTextSetOpen } = require("../utils/setopen");
const { isSetClose, addSetClose, removeSetClose, changeSetClose, getTextSetClose } = require("../utils/setclose");
const afkg = require("../utils/afk");
const { apikey } = require('../config.json')

const apiBaseUrl = {
	lolhuman: 'https://api.lolhuman.xyz',
}

const apiKey = {
	lolhuman: {
		key: 'apikey',
		value: apikey,
	},
}

/**
 *
 * @param { string } apiName
 * @returns { import('axios').AxiosInstance }
 */
const api = (apiName) => {
	return axios.create({
		baseURL: apiBaseUrl[apiName],
		params: {
			[apiKey[apiName].key]: apiKey[apiName].value,
		},
	})
}

let db_respon_list = JSON.parse(fs.readFileSync('./database/list-message.json'))
let set_open = JSON.parse(fs.readFileSync('./database/set_open.json'));
let set_close = JSON.parse(fs.readFileSync('./database/set_close.json'));
let antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
let _afks = JSON.parse(fs.readFileSync('./database/afg.json'));
let mess = JSON.parse(fs.readFileSync('./utils/mess.json'))

/**
 *
 * @param { string } text
 * @param { string } color
 */
const color = (text, color) => {
	return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)]
}

/**
 * @param {WASocket} sock
 * @param {proto.IWebMessageInfo} msg
 */
module.exports = async (sock, msg) => {
	const { ownerNumber, ownerName, botName } = require('../config.json')

	const time = moment().tz('Asia/Jakarta').format('HH:mm:ss')
	if (msg.key && msg.key.remoteJid === 'status@broadcast') return
	if (msg.key && msg.key.fromMe) return
	if (moment().unix() - msg.messageTimestamp > 5 * 60) return
	if (!msg.message) return

	const type = getContentType(msg.message)
	const quotedType = getContentType(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) || null
	if (type == 'ephemeralMessage') {
		msg.message = msg.message.ephemeralMessage.message
		msg.message = msg.message.ephemeralMessage.message.viewOnceMessage
	}
	if (type == 'viewOnceMessage') {
		msg.message = msg.message.viewOnceMessage.message
	}
    
    m = serialize(sock, msg)
    const pushname = msg.pushName
    const tanggal = moment().tz("Asia/Jakarta").format("dddd, ll")
    const jam = moment().format("HH:mm:ss z")
    const isAfkOn = afkg.checkAfkUser(sender, _afks)
    
	const botId = sock.user.id.includes(':') ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : sock.user.id

	const from = msg.key.remoteJid
	const chata = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type == "templateButtonReplyMessage" && msg.message.templateButtonReplyMessage.selectedId) ? msg.message.templateButtonReplyMessage.selectedId : (type == "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (type == "messageContextInfo") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
	const body = type == 'conversation' ? msg.message?.conversation : msg.message[type]?.caption || msg.message[type]?.text || ''
	const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
	const responseMessage = type == 'listResponseMessage' ? msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId || '' : type == 'buttonsResponseMessage' ? msg.message?.buttonsResponseMessage?.selectedButtonId || '' : ''
	const isGroup = from.endsWith('@g.us')

	var sender = isGroup ? msg.key.participant : msg.key.remoteJid
	sender = sender.includes(':') ? sender.split(':')[0] + '@s.whatsapp.net' : sender
	const senderName = msg.pushName
	const senderNumber = sender.split('@')[0]

	const groupMetadata = isGroup ? await sock.groupMetadata(from) : null
	const groupName = groupMetadata?.subject || ''
	const groupMembers = groupMetadata?.participants || []
	const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)

	var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
	const command = body.toLowerCase().split(' ')[0] || ''
	const isCmd = command.startsWith(prefix)
	const isGroupAdmins = groupAdmins.includes(sender)
	const isBotGroupAdmins = groupMetadata && groupAdmins.includes(botId)
	const isOwner = ownerNumber.includes(sender)
    const argus = chata.split(' ')
    const isAntiLink = antilink.includes(from) ? true : false
    const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
    const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
    const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
    mention != undefined ? mention.push(mentionByReply) : []
    const mentionUser = mention != undefined ? mention.filter(n => n) : []
      
	let responseId = msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId || msg.message?.buttonsResponseMessage?.selectedButtonId || null
	let args = body.trim().split(' ').slice(1)
	let full_args = body.replace(command, '').slice(1).trim()
	let mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
	
    let q = args.join(" ")
       //APIGAMES
    let sct = 'e4ebb2cefd2fb0c01d042f83c585b7f5020f7f30685f17932c313e6163ac36ed';
    let mrc = 'M220622OTRU9713BO';
    let sign = '8fee3c9673c6ea36b9dd4cb27edc1844';
    //TOKOVOUCHER
    let scttko = '1d81818bf534e3779c6927a0fd6b8a6e330d5e69d6fb71b5e79d07e58e430069';
    let mrctko = 'M220908CHPM5840YH';
    let signtko = '1242f37064b4b361d073d83f60a7426c';
    
    let randomString = 'T'
		charSet = "ABCDEF0123456789"
		for (let i = 0; i < 15; i++) {
		let randomPoz = Math.floor(Math.random() * charSet.length)
		randomString += charSet.substring(randomPoz, randomPoz + 1)
	    }
    
	const isImage = type == 'imageMessage'
	const isVideo = type == 'videoMessage'
	const isAudio = type == 'audioMessage'
	const isSticker = type == 'stickerMessage'
	const isContact = type == 'contactMessage'
	const isLocation = type == 'locationMessage'

	const isQuoted = type == 'extendedTextMessage'
	const isQuotedImage = isQuoted && quotedType == 'imageMessage'
	const isQuotedVideo = isQuoted && quotedType == 'videoMessage'
	const isQuotedAudio = isQuoted && quotedType == 'audioMessage'
	const isQuotedSticker = isQuoted && quotedType == 'stickerMessage'
	const isQuotedContact = isQuoted && quotedType == 'contactMessage'
	const isQuotedLocation = isQuoted && quotedType == 'locationMessage'

	var mediaType = type
	var stream
	if (isQuotedImage || isQuotedVideo || isQuotedAudio || isQuotedSticker) {
		mediaType = quotedType
		msg.message[mediaType] = msg.message.extendedTextMessage.contextInfo.quotedMessage[mediaType]
		stream = await downloadContentFromMessage(msg.message[mediaType], mediaType.replace('Message', '')).catch(console.error)
	}

	if (!isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ PRIVATE ]', 'aqua'), color(body.slice(0, 50), 'white'), 'from', color(senderNumber, 'yellow'))
	if (isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[  GROUP  ]', 'aqua'), color(body.slice(0, 50), 'white'), 'from', color(senderNumber, 'yellow'), 'in', color(groupName, 'yellow'))
	if (!isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'aqua'), color(body, 'white'), 'from', color(senderNumber, 'yellow'))
	if (isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'aqua'), color(body, 'white'), 'from', color(senderNumber, 'yellow'), 'in', color(groupName, 'yellow'))

	const reply = async (text) => {
		return sock.sendMessage(from, { text: text.trim() }, { quoted: msg })
	}
	
    var myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var date = new Date();
    var thisDay = date.getDay(),
    thisDay = myDays[thisDay];
    
function mentions(teks, mems = [], id) {
        if (id == null || id == undefined || id == false) {
            let res = sock.sendMessage(from, { text: teks, mentions: mems })
            return res
        } else {
            let res = sock.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
            return res
        }
    }    
    
    const dino = moment().format("ll")
    const wayah = moment().format("HH:mm:ss z")

function hitungmundur(bulan, tanggal) {
          let from = new Date(`${bulan} ${tanggal}, 2022 00:00:00`).getTime();
          let now = Date.now();
          let distance = from - now;
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
          return days + "Hari " + hours + "Jam " + minutes + "Menit " + seconds + "Detik"
        }
        
        // Store Respon
        if (!isCmd && isGroup && isAlreadyResponList(from, chata, db_respon_list)) {
        var get_data_respon = getDataResponList(from, chata, db_respon_list)
        if (get_data_respon.isImage === false) {
        sock.sendMessage(from, { text: sendResponList(from, chata, db_respon_list) }, {
        quoted: msg
        })
        } else {
        sock.sendMessage(from, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
        quoted: msg
        })
        }
        }
        let runmek = runtime(process.uptime())
        
         //AntiLink
if (isGroup && isAntiLink && !isOwner && !isGroupAdmins && isBotGroupAdmins){
    if (budy.match(/(https:\/\/chat.whatsapp.com)/gi)) {
    if (!isBotGroupAdmins) return reply(`*Selama Bot Bukan Admin Kirim Lah Link Sesuka Mu*`)
    reply(`*「 LINKGROUP DETECTOR 」*\n\n karena kamu melanggar aturan group, yaitu menggirim link group kamu akan di kick dari group! bye bye:)`)
    sock.groupParticipantsUpdate(from, [sender], "remove")
    }
    }
    if (isGroup && isAntiLink && !isOwner && !isGroupAdmins && isBotGroupAdmins){
    if (budy.match('chat.whatsapp.com/')) {
    if (!isBotGroupAdmins) return reply(`*Selama Bot Bukan Admin Kirim Lah Link Sesuka Mu*`)
    reply(`*「 LINKGROUP DETECTOR 」*\n\n karena kamu melanggar aturan group, yaitu menggirim link group kamu akan di kick dari group! bye bye:)`)
    sock.groupParticipantsUpdate(from, [sender], "remove")
    }
    }
     //MULAI AFK
if (isGroup) {
    for (let x of mentionUser) {
        if (afkg.checkAfkUser(x, _afks)) {
        const getId = afkg.getAfkId(x, _afks)
        const getReason = afkg.getAfkReason(getId, _afks)
        const getTime = afkg.getAfkTime(getId, _afks)
        //if (riz.message.extendedTextMessage != undefined){ 
        try {
        var afpk = await sock.profilePictureUrl(mentionUser[0], 'image')
        } catch {
        var afpk = 'https://i.ibb.co/Twkhgy9/images-4.jpg'
        }
        var thumeb = await getBuffer(afpk)
        const cptl = `Saat ini @${mentionUser[0].split("@")[0]} Sedang Tidak Bisa Aktif Di Grup ini dengan alasan ${getReason}

*Tidak Aktif sejak* : Pukul ${getTime}`
  sock.sendMessage(from, { text: cptl }, { quoted: m });
  //sendMess(x, `Assalamualaikum\n\n_Ada Yg Mencari Kamu Saat Kamu Offline/Afk_\n\nNama : ${pushname}\nNomor : wa.me/${sender.split("@")[0]}\nDi Group : ${groupName}\nPesan : ${chata}`)
  }}
  //KEMBALI DARI AFK
  if (afkg.checkAfkUser(sender, _afks)) {
  const getTime = afkg.getAfkTime(sender, _afks)
  const getReason = afkg.getAfkReason(sender, _afks)
  const ittung = ms(await Date.now() - getTime)
  try {
  var afpkk = await sock.profilePictureUrl(mentionUser[0], 'image')
  } catch {
  var afpkk = 'https://i.ibb.co/Twkhgy9/images-4.jpg'
  }
  var thumbw = await getBuffer(afpkk)
  const pep = `*${pushname}* Telah Siap Bekerja Kembali ! `
  sock.sendMessage(from, { text: pep }, { quoted: m });
  _afks.splice(afkg.getAfkPosition(sender, _afks), 1)
  fs.writeFileSync('./database/afkg.json', JSON.stringify(_afks))
  }
  }   
         // Auto Read & Presence Online
          await sock.readMessages([msg.key])
          await sock.sendPresenceUpdate('available', from) 
	switch (command) {
		case 'owner':
			const vcard =
				'BEGIN:VCARD\n' + // metadata of the contact card
				'VERSION:3.0\n' +
				`FN:${ownerName}\n` + // full name
				`ORG:${botName};\n` + // the organization of the contact
				`TEL;type=MSG;type=CELL;type=VOICE;waid=${ownerNumber[ownerNumber.length - 1].split('@')[0]}:+${ownerNumber[ownerNumber.length - 1].split('@')[0]}\n` + // WhatsApp ID + phone number
				'END:VCARD'

			sock.sendMessage(from, {
				contacts: {
					displayName: ownerName,
					contacts: [{ vcard }],
				},
			})
			break
		case 'menuowner':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(menuowner(prefix))
            break
            case 'formatmla':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatmla(prefix))
            break
            case 'formatffa':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatffa(prefix))
            break
            case 'formatmlb':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatmlb(prefix))
            break
            case 'formatmlc':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatmlc(prefix))
            break
            case 'formatgml':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatgml(prefix))
            break
            case 'formathdu':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formathdu(prefix))
            break
            case 'formattko':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formattko(prefix))
            break
            case 'formatuff':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatuff(prefix))
            break
            case 'formataov':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formataov(prefix))
            break
            case 'formatpbc':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatpbc(prefix))
            break
            case 'formatmld':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatmld(prefix))
            break
            case 'formatmle':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatmle(prefix))
            break
            case 'formatuhd':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatuhd(prefix))
            break
            case 'formatcod':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatcod(prefix))
            break
            case 'formatlom':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatlom(prefix))
            break
            case 'formatlot':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatlot(prefix))
            break
            case 'formatdrj':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatdrj(prefix))
            break
            case 'formatgen':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatgen(prefix))
            break
            case 'formatsus':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatsus(prefix))
            break
            case 'formatomg':
            if (!isOwner) return reply(mess.OnlyOwner)   
            reply(formatomg(prefix))
            break

      // Store Menu
        case 'menu': case 'list':        
            if (!isGroup) return reply(mess.OnlyGrup)
            if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
            if (!isAlreadyResponListGroup(from, db_respon_list)) return reply(`Belum ada list message yang terdaftar di group ini\n\n*Untuk Melihat Fitur Bot Ketik* ${prefix}help`)
            var arr_rows = [];
            for (let x of db_respon_list) {
                if (x.id === from) {
                    arr_rows.push({
                        title: x.key,
                        rowId: x.key
                    })
                }
            }
            var listMsg = {
                text: `Hallo kak ${pushname}`,
                buttonText: 'Click here!',
                footer: `*List ${groupName}*\n\n⏳ ${jam}\n📆 ${tanggal}`,
                mentions: [sender],
                sections: [{
                    title: groupName, rows: arr_rows
                }]
            }
           sock.sendMessage(from, listMsg)
            //sendOrder(from, listMsg, "3836", thum, 2022, "MENU PRICELIST", `${owncek}@s.whatsapp.net`, "AR6ebQf7wTuyXrVneA0kUMMbQe67ikT6LZrwT2uge7wIEw==", "9783")
            break
            case 'addlist':        
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            var args1 = q.split("@")[0]
            var args2 = q.split("@")[1]                
            if (!q.includes("@")) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n${command} tes@apa`)
            if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
            if (isImage || isQuotedImage) {
                let media = await downloadAndSaveMediaMessage('image', `./temp/stickers/${sender}`)
                const fd = new FormData();
                fd.append('file', fs.readFileSync(media), '.tmp', '.jpg')
                fetch('https://telegra.ph/upload', {
                    method: 'POST',
                    body: fd
                }).then(res => res.json())
                    .then((json) => {
                        addResponList(from, args1, args2, true, `https://telegra.ph${json[0].src}`, db_respon_list)
                        reply(`Sukses menambah List menu`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
                    })
            } else {
                addResponList(from, args1, args2, false, '-', db_respon_list)
                reply(`Sukses menambah List menu`)
            }
            break    
                  
            
            case 'dellist':        
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
            if (!q) return reply(`Gunakan dengan cara ${command} *key*\n\n_Contoh_\n\n${command} hello`)
            if (!isAlreadyResponList(from, q, db_respon_list)) return reply(`List respon dengan key *${q}* tidak ada di database!`)
            delResponList(from, q, db_respon_list)
            reply(`Sukses menghapus List menu`)
            break
            
            
            
            case 'updatelist': case prefix+'update':        
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            var args1 = q.split("@")[0]
            var args2 = q.split("@")[1]
            if (!q.includes("@")) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n${command} tes@apa`)
            if (!isAlreadyResponListGroup(from, db_respon_list)) return reply(`Maaf, untuk key *${args1}* belum terdaftar di group ini`)
            if (isImage || isQuotedImage) {
                let media = await downloadAndSaveMediaMessage('image', `./temp/stickers/${sender}`)
                const fd = new FormData();
                fd.append('file', fs.readFileSync(media), '.tmp', '.jpg')
                fetch('https://telegra.ph/upload', {
                    method: 'POST',
                    body: fd
                }).then(res => res.json())
                    .then((json) => {
                        updateResponList(from, args1, args2, true, `https://telegra.ph${json[0].src}`, db_respon_list)
                        reply(`Sukses update List menu`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
                    })
            } else {
                updateResponList(from, args1, args2, false, '-', db_respon_list)
                reply(`Sukses update List menu`)
            }
            break

case 'hidetag':
            if (!isGroup) return reply(mess.OnlyGrup)
		    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            let mem = [];
            groupMembers.map( i => mem.push(i.id) )
            sock.sendMessage(from, { text: q ? q : m.quotedMsg.chats, mentions: mem })
            break
            
            case 'open': case 'buka':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
    sock.groupSettingUpdate(from, 'not_announcement')
    .then((res) => {
    let opengc = `Sukses`
    const tettOpen = getTextSetOpen(from, set_open);
    if (tettOpen !== undefined) {
    mentions(tettOpen.replace('admin', sender.split("@")[0]).replace('@jam', jam).replace('@tanggal', tanggal), [sender], true);
    } else {
    mentions(opengc, [sender], true)
    }
    })
    break

case 'close': case 'tutup':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
    sock.groupSettingUpdate(from, 'announcement')
    .then((res) => {
    let closegc = `Sukses`
    const textClose = getTextSetClose(from, set_close);
    if (textClose !== undefined) {
    mentions(textClose.replace('admin', sender.split("@")[0]).replace('@jam', jam).replace('@tanggal', tanggal), [sender], true);
    } else {
    mentions(closegc, [sender], true)
    }
    })
    .catch((err) => reply('Error'))
    break

case 'setopen':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!q) return reply(`Gunakan dengan cara ${command} *teks_open*\n\n_Contoh_\n\n${command} Group telah di buka`)
    if (isSetOpen(from, set_open)) return reply(`Set Open already active`)
    addSetOpen(q, from, set_open)
    reply(`Successfully set Open!`)
    break
case 'updateopen':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!q) return reply(`Gunakan dengan cara ${command} *teks_open*\n\n_Contoh_\n\n${command} Group telah di buka`)
    if (isSetOpen(from, set_open)) {
        changeSetOpen(q, from, set_open)
        reply(`Sukses change set Open teks!`)
    } else {
        addSetOpen(q, from, set_open)
        reply(`Sukses change set Open teks!`)
    }
    break
case 'delsetopen':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!isSetOpen(from, set_open)) return reply(`Belum ada set Open di sini..`)
    removeSetOpen(from, set_open)
    reply(`Sukses delete set Open`)
    break
case 'setclose':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!q) return reply(`Gunakan dengan cara ${command} *teks_close*\n\n_Contoh_\n\n${command} Group telah di tutup`)
    if (isSetClose(from, set_close)) return reply(`Set Close already active`)
    addSetClose(q, from, set_close)
    reply(`Successfully set Close!`)
    break
case 'updateclose':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!q) return reply(`Gunakan dengan cara ${command} *teks_close*\n\n_Contoh_\n\n${command} Group telah di tutup`)
    if (isSetClose(from, set_close)) {
        changeSetClose(q, from, set_close)
        reply(`Sukses change set Close teks!`)
    } else {
        addSetClose(q, from, set_close)
        reply(`Sukses change set Close teks!`)
    }
    break
case 'delsetclose':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!isSetClose(from, set_close)) return reply(`Belum ada set Close di sini..`)
    removeSetClose(from, set_close)
    reply(`Sukses delete set Close`)
    break


case 'antilink':
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                            if (!isGroup) return reply(`Bot Hanya Respon Di Dalam Group`)
                            if (!isBotGroupAdmins) return reply(`*Jadi Kan Bot Admin Sebelum Menggunakan Fitur Antilink*`)
                            if (args.length < 1) return reply(`Untuk Mengaktifkan Ketik 1\nContoh : ${prefix}antilink 1\n\nUntuk Nonaktifkan Antilink Ketik 0\nContoh : ${prefix}antilink 0`)
                            if (Number(args[0]) === 1) {
                            if (isAntiLink) return reply('anti link group sudah aktif')
                            antilink.push(from)
                            fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink))
                            reply('Done Mengaktifkan Antilink Group✅')
                            sock.sendMessage(from, { text: `Perhatian kepada seluruh member anti link group aktif apabila anda mengirim link group anda akan di kick dari group` })
                            } else if (Number(args[0]) === 0) {
                            if (!isAntiLink) return reply('Mode anti link group sudah disable')
                            let anu1 = antilink.indexOf(from)
                            antilink.splice(anu1, 1)
                            fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink))
                            reply('Sukes menonaktifkan anti link group di group ini ✔️')
                            } else {
                            reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
                            }
                            break                   
case 'kick':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins) return reply(mess.GrupAdmin)
            if (!isBotGroupAdmins) return reply(mess.BotAdmin)
            var number;
            if (mentionUser.length !== 0) {
                number = mentionUser[0]
                sock.groupParticipantsUpdate(from, [number], "remove")
                .then( res => reply(`Success kick @${number.split('@')[0]}`))
                .catch((err) => reply(`Error`))
            } else if (isQuoted) {
                number = quotedMsg.sender
                sock.groupParticipantsUpdate(from, [number], "remove")
                .then( res => reply(`Success kick @${number.split('@')[0]}`))
                .catch((err) => reply(`Error`))
            } else {
                reply(`Tag atau balas pesan orang yang ingin dikeluarkan dari grup`)
            }
            break 
  case 'afk': 
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
              if (!isGroup) return 
              if (isAfkOn) return reply('Kalo Mau Afk Jangan Nimbrung di sini')
              const reason = q ? q : '*No Pesan*'
              afkg.addAfkUser(sender, time, reason, _afks)
              const aluty = `${pushname} Meninggalkan Grup dengan alasan ${reason}`
              //sock.sendMessage(from, aluty, text)
              sock.sendMessage(from, { text: aluty }, { quoted: m });
              break          
            
            case 'mla':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=ML${args[0]}&tujuan=${args[1]}${args[2]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Mobile Legends
*› Order ID* : ${args[1]} (${args[2]})
*› Item* : ${args[0]} Diamonds 
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'mla2':{
if (!isOwner) return reply(mess.OnlyOwner)   
let suju = crypto.createHash('md5').update(`${mrc}:${sct}:${randomString}`).digest("hex")
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/v2/transaksi?ref_id=${randomString}&merchant_id=${mrc}&produk=ML${args[0]}&tujuan=${args[1]}&signature=${suju}&server_id=${args[2]}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi Telah Diproses」*

*› Game* : Mobile Legends
*› Order ID* : ${args[1]}|${args[2]}
*› Item* : ${response.data.data.product_detail.name}
*› Date* : ${thisDay}, ${dino}
*› Nick Name* : ${response.data.data.sn}

*Untuk Cek Status Selanjutnya*
Ketik TX ${randomString}`);
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'tx':{
let suju = crypto.createHash('md5').update(`${mrc}:${sct}:${args[0]}`).digest("hex")
var axios = require('axios');
var config = {
  method: 'get',
  url: `https://v1.apigames.id/v2/transaksi/status?merchant_id=${mrc}&ref_id=${args[0]}&signature=${suju}`,
  headers : {
  }
};  
axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Mobile Legends
*› Order ID* : ${response.data.data.destination}
*› Item* : ${response.data.data.product_detail.name}
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`);
})
.catch(function (error) {
  reply(`Format Yang Anda Masukan Salah`);
});     
break
}     

case 'mlb':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=UBRMBL${args[0]}&tujuan=${args[1]}${args[2]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Mobile Legends
*› Order ID* : ${args[1]} (${args[2]})
*› Item* : ${args[0]} Diamonds 
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'mlc':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=UPMYMBL${args[0]}&tujuan=${args[1]}${args[2]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Mobile Legends
*› Order ID* : ${args[1]} (${args[2]})
*› Item* : ${args[0]} Diamonds 
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'mld':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=UPMBL${args[0]}&tujuan=${args[1]}${args[2]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Mobile Legends
*› Order ID* : ${args[1]} (${args[2]})
*› Item* : ${args[0]} Diamonds 
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'mle':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=ZIDMBL${args[0]}&tujuan=${args[1]}${args[2]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Mobile Legends
*› Order ID* : ${args[1]} (${args[2]})
*› Item* : ${args[0]} Diamonds 
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'uhd':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=UPHGDE${args[0]}&tujuan=${args[1]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Higgs Domino
*› Order ID* : ${args[1]}
*› Item* : ${args[0]} Chip 
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'uff':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=UPF${args[0]}&tujuan=${args[1]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Free Fire
*› Order ID* : ${args[1]}
*› Item* : ${args[0]} Diamonds
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'lom':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=UPLM${args[0]}&tujuan=${args[1]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Lord Mobile
*› Order ID* : ${args[1]}
*› Item* : ${args[0]} Diamonds
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'cod':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=UPCOM${args[0]}&tujuan=${args[1]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Call Of Duty
*› Order ID* : ${args[1]}
*› Item* : ${args[0]} UP
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'aov':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=UPAO${args[0]}&tujuan=${args[1]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Arena Of Valor
*› Order ID* : ${args[1]}
*› Item* : ${args[0]} Voucher
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'pbc':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=UPPB${args[0]}&tujuan=${args[1]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Point Blank
*› Order ID* : ${args[1]}
*› Item* : ${args[0]} Cash
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'gml':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=GPMBL${args[0]}&tujuan=${args[1]}${args[2]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Mobile Legends
*› Order ID* : ${args[1]} (${args[2]})
*› Item* : ${args[0]} Diamonds 
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'lot':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=GPLOT${args[0]}&tujuan=${args[1]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Light Of Thel
*› Order ID* : ${args[1]}
*› Item* : ${args[0]} Crystals
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'drj':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=GPDR${args[0]}&tujuan=${args[1]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Dragon Raja
*› Order ID* : ${args[1]}
*› Item* : ${args[0]} Coupons
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'gen':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=GPGI${args[0]}&tujuan=${args[1]}${args[2]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Genshin Impact
*› Order ID* : (${args[1]}) ${args[2]}
*› Item* : ${args[0]} Crystals
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'gens':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=GPB${args[0]}&tujuan=${args[1]}${args[2]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Genshin Impact
*› Order ID* : (${args[1]}) ${args[2]}
*› Item* : Blessing of the Welkin Moon
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'sus':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=GPSM${args[0]}&tujuan=${args[1]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Sausage Man
*› Order ID* : ${args[1]}
*› Item* : ${args[0]} Candies
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'omg':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=GPOL${args[0]}&tujuan=${args[1]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Omega Legends
*› Order ID* : ${args[1]}
*› Item* : ${args[0]} Gold
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'ffa':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=FF${args[0]}&tujuan=${args[1]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
    reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Free Fire
*› Order ID* : ${args[1]}
*› Item* : ${args[0]} Diamonds 
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}

case 'hdu':{
if (!isOwner) return reply(mess.OnlyOwner)   
var axios = require('axios');
var config = {
  method: 'get',
  url: (`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=HGDU${args[0]}&tujuan=${args[1]}&ref=${randomString}`),
                
  headers: { }
};

axios(config)
.then(function (response) {
  reply(`*「 Transaksi ${response.data.data.status} 」*

*› Game* : Higgs Domino
*› Order ID* : ${args[1]}
*› Item* : ${args[0]} Chip Ungu 
*› Date* : ${thisDay}, ${dino}
*› Nick Name/SN* : ${response.data.data.sn}

*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`)
})
.catch(function (error) {
  reply(`Masukan Format Yang Benar`)
});

break
}
case 'tkos':{
if (!isOwner) return reply(mess.OnlyOwner)
var axios = require('axios');
var config = {
  method: 'get', 
  url: `https://api.tokovoucher.id/v1/transaksi?ref_id=${randomString}&produk=${args[0]}&tujuan=${args[1]}&secret=${scttko}&member_code=${mrctko}&server_id=${args[2]}`,
  headers : {
  }
};
axios(config)
.then(function (response) {
  reply(`${response.data.message}

*Untuk Cek Pesanan*
Ketik TRX ${randomString}`);
})
.catch(function (error) {
  reply(`Format Yang Anda Masukan Salah`);
});     
break
}       
case 'tko':{
if (!isOwner) return reply(mess.OnlyOwner)
var axios = require('axios');
var config = {
  method: 'get', 
  url: `https://api.tokovoucher.id/v1/transaksi?ref_id=${randomString}&produk=${args[0]}&tujuan=${args[1]}&secret=${scttko}&member_code=${mrctko}&server_id`,
  headers : {
  }
};
axios(config)
.then(function (response) {
  reply(`${response.data.message}

*Untuk Cek Pesanan*
Ketik TRX ${randomString}`);
})
.catch(function (error) {
  reply(`Format Yang Anda Masukan Salah`);
});     
break
}       
case 'trx':{
let suju = crypto.createHash('md5').update(`${mrctko}:${scttko}:${args[0]}`).digest("hex")
var axios = require('axios');
var config = {
  method: 'get',
  url: `https://api.tokovoucher.id/v1/transaksi/status?ref_id=${args[0]}&member_code=${mrctko}&signature=${suju}`,
  headers : {
  }
};  
axios(config)
.then(function (response) {
  reply(`${response.data.message}
  
*Terima Kasih Sudah Order*
_*FAHMINET.STORE*_`);
})
.catch(function (error) {
  reply(`Format Yang Anda Masukan Salah`);
});     
break
}          

       case 'nickml': {      
 if (!isOwner) return reply(mess.OnlyOwner)                     
 var axios = require('axios');

var config = {
  method: 'get',
  url: (`https://v1.apigames.id/merchant/${mrc}/cek-username/mobilelegend?user_id=${args[0]}${args[1]}&signature=${sign}`),
   headers: { }
};

axios(config)
.then(function (response) {
 reply(`*「 CEK USERNAME ML 」*

› *ID Akun* : ${args[0]}
› *Username* : ${response.data.data.username}

_Cek Username Mobile Legends_`)
})
.catch(function (error) {
  reply(`ID Akun Yang Anda Masukan Salah`)
});     

break
        }        
                
                case 'nickff': {      
 if (!isOwner) return reply(mess.OnlyOwner)                     
 var axios = require('axios');

var config = {
  method: 'get',
  url: (`https://v1.apigames.id/merchant/${mrc}/cek-username/freefire?user_id=${args[0]}&signature=${sign}`),
   headers: { }
};

axios(config)
.then(function (response) {
 reply(`*「 CEK USERNAME FF 」*

› *ID Akun* : ${args[0]}
› *Username* : ${response.data.data.username}

_Cek Username Free Fire_`)
})
.catch(function (error) {
  reply(`ID Akun Yang Anda Masukan Salah`)
});     

break
        }   
                 case 'nickdomino': {      
 if (!isOwner) return reply(mess.OnlyOwner)                     
 var axios = require('axios');

var config = {
  method: 'get',
  url: (`https://v1.apigames.id/merchant/${mrc}/cek-username/higgs?user_id=${args[0]}&signature=${sign}`),
   headers: { }
};

axios(config)
.then(function (response) {
 reply(`*「 CEK USERNAME HIGGS 」*

› *ID Akun* : ${args[0]}
› *Username* : ${response.data.data.username}

_Cek Username Higgs Domino_`)
})
.catch(function (error) {
  reply(`ID Akun Yang Anda Masukan Salah`)
});     

break
        }   
                                  
    
                 case 'cekgamepoint': {      
 if (!isOwner) return reply(mess.OnlyOwner)                       
     var axios = require('axios');

var config = {
  method: 'get',
  url: (`https://v1.apigames.id/merchant/${mrc}/cek-koneksi?engine=gamepoint&signature=${sign}`),
  headers: { }
};
axios(config)
.then(function (response) {
   reply(`*「 CEK KONEKSI GAMEPOINT 」*

› *Status* : ${response.data.data.status}
› *User IDN* : ${response.data.data.user_idn}
› *Saldo* : ${response.data.data.gp_balance} GP

_Berikut di atas Data Akun Gamepoint kamu_`)
})
.catch(function (error) {
  reply(`Gamepoint Belum Tersambung DI Apigames`)
});

               
     break
        }   
        
        case 'cekkiosgamer': {      
 if (!isOwner) return reply(mess.OnlyOwner)                       
     var axios = require('axios');

var config = {
  method: 'get',
  url: (`https://v1.apigames.id/merchant/${mrc}/cek-koneksi?engine=kiosgamer&signature=${sign}`),
  headers: { }
};

axios(config)
.then(function (response) {
   reply(`*「 CEK KONEKSI KIOSGAMER 」*

› *Nama Akun* : ${response.data.data.data.username}
› *Garena ID* : ${response.data.data.data.garena_id}
› *Saldo* : ${response.data.data.data.shell_balance} Garena Shell

_Berikut di atas Data Akun Kiosgamer kamu_`)
})
.catch(function (error) {
  reply(`Kiosgamer Belum Tersambung DI Apigames`)
});
               
     break
        }        
        
        case 'cekunipin': {      
 if (!isOwner) return reply(mess.OnlyOwner)                       
     var axios = require('axios');

var config = {
  method: 'get',
  url: (`https://v1.apigames.id/merchant/${mrc}/cek-koneksi?engine=unipin&signature=${sign}`),
  headers: { }
};

axios(config)
.then(function (response) {
   reply(`*「 CEK KONEKSI UNIPIN 」*

› *Status* : ${response.data.message}


_Berikut di atas Data Akun Unipin kamu_`)
})
.catch(function (error) {
  reply(`Unipin Ketiganya Belum Tersambung DI Apigames (wajib tersambung ketiganya)`)
});


               
     break
        }         
        
        case 'ceksmileone': {      
 if (!isOwner) return reply(mess.OnlyOwner)                       
     var axios = require('axios');

var config = {
  method: 'get',
  url: (`https://v1.apigames.id/merchant/${mrc}/cek-koneksi?engine=smileone&signature=${sign}`),
  headers: { }
};

axios(config)
.then(function (response) {
   reply(`*「 CEK KONEKSI SMILEONE 」*

› *Nama Akun* : ${response.data.data.data.customer_name}
› *Saldo* : ${response.data.data.data.balance} Coin

_Berikut di atas Data Akun Smileone kamu_`)
})
.catch(function (error) {
  reply(`Smileone Belum Tersambung DI Apigames`)
});


               
     break
        } 
        case 'cekdomino': {      
 if (!isOwner) return reply(mess.OnlyOwner)                       
     var axios = require('axios');

var config = {
  method: 'get',
  url: (`https://v1.apigames.id/merchant/${mrc}/cek-koneksi?engine=higgs&signature=${sign}`),
  headers: { }
};

axios(config)
.then(function (response) {
   reply(`*「 CEK KONEKSI MITRA HIGGS DOMINO 」*

 ${response.data.message}`)
})
.catch(function (error) {
  reply(`Smileone Belum Tersambung DI Apigames`)
});
break
}

case 'cektko': {      
 if (!isOwner) return reply(mess.OnlyOwner)                       
     var axios = require('axios');

var config = {
  method: 'get',
  url: (`https://api.tokovoucher.id/member?member_code=${mrctko}&signature=${signtko}`),
  headers: { }
};
axios(config)
.then(function (response) {
   reply(`*「 CEK SALDO TOKOVOUCHER 」*

${response.data.message}
› *Saldo* : ${response.data.data.saldo}
› *nama* : ${response.data.data.nama}
› *member* : ${response.data.data.member_code}

_Berikut di atas Saldo Tokovoucher kamu_`)
})
.catch(function (error) {
  reply(`Tokovoucher Belum Tersambung`)
});

               
     break
        }                       
		default:
	}
}
