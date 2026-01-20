const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, VoiceConnectionStatus } = require("@discordjs/voice");
const http = require("http");

// 1. تشغيل سيرفر وهمي لإبقاء الخدمة تعمل على Render
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is Active\n');
});
server.listen(process.env.PORT || 8080);

// 2. إعدادات البوت
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

  const connectToChannel = () => {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return console.log("❌ السيرفر غير موجود");

    const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);
    if (!channel) return console.log("❌ الروم الصوتي غير موجود");

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: true
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      console.log("⚠️ تم قطع الاتصال، محاولة إعادة الاتصال...");
      setTimeout(connectToChannel, 5000);
    });
    
    console.log(`🔊 البوت متصل الآن بـ [${channel.name}]`);
  };

  connectToChannel();
});

// تسجيل الدخول
if (TOKEN) {
  client.login(TOKEN).catch(err => console.error("❌ فشل تسجيل الدخول:", err));
} else {
  console.error("❌ نسيج وضع الـ TOKEN في Environment Variables!");
}
