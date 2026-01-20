// ضروري جداً لحل مشكلة التشفير في ريندر
const sodium = require('libsodium-wrappers');
(async () => {
    await sodium.ready;
})();

const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, VoiceConnectionStatus } = require("@discordjs/voice");
const http = require("http");

// خادم وهمي لإبقاء البوت حياً في ريندر
http.createServer((req, res) => {
  res.write("Bot is online");
  res.end();
}).listen(process.env.PORT || 8080);

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

  const connectToVoice = () => {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return;

    const connection = joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: true
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      setTimeout(connectToVoice, 5000);
    });
  };

  connectToVoice();
  console.log("🔊 البوت متصل ومستقر الآن.");
});

client.login(TOKEN);
