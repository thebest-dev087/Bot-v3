const {
  default: makeWASocket, useMultiFileAuthState, DisconnectReason,
  fetchLatestBaileysVersion, Browsers,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const qrcode = require("qrcode-terminal");
const chalk = require("chalk");
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const config = require("./config");
const db = require("./database");
const handler = require("./lib/handler");
const { boreal, bold } = require("./lib/fonts");

const startTime = Date.now();
module.exports.startTime = startTime;

function notifyTermux(title, content) {
  try {
    execSync(
      `termux-notification --title ${JSON.stringify(title)} --content ${JSON.stringify(content)} --priority high --sound`,
      { stdio: "ignore" }
    );
  } catch {}
}

function ask(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(res => rl.question(q, ans => { rl.close(); res(ans.trim()); }));
}

function normalizeNumber(raw) {
  let n = (raw || "").replace(/\D/g, "");
  // Se começa por 8/9 (tipico moçambique sem código país) -> 258
  if (n.length === 9 && /^[28]/.test(n)) n = "258" + n;
  return n;
}

async function start() {
  console.log(chalk.cyan(`\n╭━━━━━━━━━━━━━━━━━━━━━━━━━━━╮`));
  console.log(chalk.cyan(`┃   ${bold(config.botName)} ${config.version}`));
  console.log(chalk.cyan(`┃   by ${config.ownerName}`));
  console.log(chalk.cyan(`╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n`));

  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version } = await fetchLatestBaileysVersion();
  const usePairing = config.loginMode === "pairing" && !state.creds.registered;

  const sock = makeWASocket({
    version, logger: pino({ level: "silent" }),
    printQRInTerminal: !usePairing,
    auth: state, browser: Browsers.macOS("Safari"),
    syncFullHistory: false,
  });
  sock.ev.on("creds.update", saveCreds);

  if (usePairing) {
    setTimeout(async () => {
      try {
        let num = process.env.BOT_NUMBER || "";
        if (!num) {
          console.log(chalk.yellow("📲 Digita o número do BOT (ex: 258841234567 ou +258841234567):"));
          num = await ask("➜ ");
        }
        num = normalizeNumber(num);
        if (num.length < 10) {
          console.log(chalk.red("❌ Número inválido."));
          process.exit(1);
        }
        const code = await sock.requestPairingCode(num);
        const pretty = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(chalk.green(`\n╭━━━━━━━━━━━━━━━━━━━━━━╮`));
        console.log(chalk.green(`┃   📲 ${bold("PAIRING CODE")}`));
        console.log(chalk.yellow(`┃      ${pretty}`));
        console.log(chalk.green(`╰━━━━━━━━━━━━━━━━━━━━━━╯`));
        console.log(chalk.gray(`WhatsApp → Aparelhos conectados → Conectar com nº telefone\n`));
        notifyTermux(`🛡️ ${config.botName}`, `Código pareamento: ${pretty}`);
      } catch (e) { console.log(chalk.red("Erro pairing:"), e.message); }
    }, 3000);
  }

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr && !usePairing) qrcode.generate(qr, { small: true });
    if (connection === "open") {
      console.log(chalk.green(`\n✅ ${config.botName} ${config.version} ONLINE!`));
      notifyTermux(`✅ ${config.botName}`, "Conectado!");
    }
    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      console.log(chalk.red("⚠️ Desconectado:"), reason);
      if (reason !== DisconnectReason.loggedOut) start();
      else console.log(chalk.red("👋 Logged out. Apaga ./session e reinicia."));
    }
  });

  // ════════════ Mensagens ════════════
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    if (!db.global.botOn) return; // bot off (dono)
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;
      if (msg.key.remoteJid === "status@broadcast") continue;

      // ════ ONLINE-ONLY ════ ignora msgs anteriores ao boot
      const ts = (msg.messageTimestamp || 0) * 1000;
      if (config.onlineOnly && ts && ts < startTime) continue;

      const isGroup = msg.key.remoteJid.endsWith("@g.us");
      const sender = isGroup ? msg.key.participant : msg.key.remoteJid;
      if (db.global.banned.includes(sender)) continue;

      // typing effect
      if (db.global.typingEffect) {
        try { await sock.sendPresenceUpdate("composing", msg.key.remoteJid); } catch {}
      }

      try { await handler(sock, msg, { startTime }); } catch (e) { console.error("handler:", e.message); }

      try { await sock.sendPresenceUpdate("paused", msg.key.remoteJid); } catch {}
    }
  });

  // ════════════ Welcome / Goodbye (online-only) ════════════
  const defaultPp = path.join(__dirname, "assets", "default-pp.jpg");
  sock.ev.on("group-participants.update", async (ev) => {
    try {
      // online-only — ignora eventos antigos
      const g = db.getGroup(ev.id);
      const meta = await sock.groupMetadata(ev.id);
      for (const jid of ev.participants) {
        const num = jid.split("@")[0];
        let imgPayload;
        try {
          const url = await sock.profilePictureUrl(jid, "image");
          imgPayload = { image: { url } };
        } catch {
          imgPayload = { image: fs.readFileSync(defaultPp) };
        }
        if (ev.action === "add" && g.welcome) {
          const txt = g.welcomeMsg.replace("@user", `@${num}`).replace("@group", meta.subject);
          const cap = `╭━━〔 🌟 ${bold("WELCOME")} 〕━━╮
┃ ${txt}
┃ 👥 Membro #${meta.participants.length}
┃ 🛡️ ${config.botName} ${config.version}
╰━━━━━━━━━━━━━━━━━━━━╯`;
          await sock.sendMessage(ev.id, { ...imgPayload, caption: cap, mentions: [jid] });
        }
        if (ev.action === "remove" && g.goodbye) {
          // ANTIBAN DONO — se removido for dono, reage triste mas sem ban
          const txt = g.goodbyeMsg.replace("@user", `@${num}`).replace("@group", meta.subject);
          await sock.sendMessage(ev.id, {
            ...imgPayload,
            caption: `╭━〔 👋 ${bold("GOODBYE")} 〕━╮\n┃ ${txt}\n┃ ${config.botName}\n╰━━━━━━━━━━━━━━━━╯`,
            mentions: [jid],
          });
        }
      }
    } catch (e) { console.error("welcome err:", e.message); }
  });

  // ════════════ AUTO-SAIR (timer por grupo) ════════════
  setInterval(async () => {
    const now = Date.now();
    for (const [gid, when] of Object.entries(db.global.autoSair || {})) {
      if (now >= when) {
        try {
          await sock.sendMessage(gid, { text: `╭━━〔 👋 ${bold("ATÉ SEMPRE")} 〕━━╮\n┃ Foi um prazer estar aqui.\n┃ ${config.botName} ${config.version} a sair...\n╰━━━━━━━━━━━━━━━━━━━━╯` });
          await sock.groupLeave(gid);
        } catch {}
        delete db.global.autoSair[gid];
      }
    }
  }, 30000);
}

start().catch(e => console.error("Fatal:", e));
process.on("uncaughtException", e => console.error("uncaught:", e.message));
process.on("unhandledRejection", e => console.error("unhandled:", e?.message || e));
