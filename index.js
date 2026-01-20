const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const http = require("http");

// 1. إنشاء سيرفر وهمي لمنع Render من إغلاق البوت
http.createServer((req, res) => {
  res.write("Bot is running!");
  res.end();
}).listen(process.env.PORT || 8080);

// 2. إعداد البوت
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const TOKEN = process.env.TOKEN; 
const GUILD_ID = "1432785665350828185";
const VOICE_CHANNEL_ID = "1432785666290356321";

client.once("ready", () => {
  console.log(`✅ تم تسجيل الدخول باسم: ${client.user.tag}`);

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return console.log("❌ السيرفر غير موجود");

  const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);
  if (!channel) return console.log("❌ الروم الصوتي غير موجود");

  try {
    joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: true
    });
    console.log(`🔊 البوت دخل الروم الصوتي [${channel.name}] بنجاح.`);
  } catch (error) {
    console.error("❌ فشل الدخول للروم الصوتي:", error);
  }
});

// تسجيل الدخول
if (TOKEN) {
  client.login(TOKEN);
} else {
  console.error("❌ TOKEN missing in Environment Variables!");
}
