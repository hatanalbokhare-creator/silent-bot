const sodium = require('libsodium-wrappers');

(async () => {
  await sodium.ready; // ضروري قبل أي اتصال صوتي

  const { Client, GatewayIntentBits } = require("discord.js");
  const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require("@discordjs/voice");
  const http = require("http");

  // خادم وهمي لإبقاء البوت حياً في Render
  http.createServer((req, res) => {
    res.write("Bot is online ✅");
    res.end();
  }).listen(process.env.PORT || 8080);

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates
    ]
  });

  const TOKEN = process.env.TOKEN;
  const GUILD_ID = "1432785665350828185";       // معرف السيرفر
  const VOICE_CHANNEL_ID = "1432785666290356321"; // معرف الروم الصوتي

  // دالة الاتصال بالروم AFK مع إعادة الاتصال التلقائي
  const connectToVoice = async () => {
    try {
      const guild = client.guilds.cache.get(GUILD_ID);
      if (!guild) return;

      const connection = joinVoiceChannel({
        channelId: VOICE_CHANNEL_ID,
        guildId: GUILD_ID,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,  // يمكن تغييره true لو تريد AFK بالكامل
        selfMute: true
      });

      // الانتظار حتى يصبح الاتصال جاهز
      await entersState(connection, VoiceConnectionStatus.Ready, 15000);
      console.log("🔊 البوت متصل بالروم AFK بنجاح.");

      // إعادة الاتصال تلقائيًا عند الانفصال
      connection.on(VoiceConnectionStatus.Disconnected, async () => {
        console.log("⚠️ تم قطع الاتصال، سيتم إعادة الاتصال خلال 5 ثوانٍ...");
        setTimeout(connectToVoice, 5000);
      });

    } catch (error) {
      console.error("❌ خطأ أثناء الاتصال بالروم AFK:", error);
      setTimeout(connectToVoice, 5000); // إعادة المحاولة بعد 5 ثواني
    }
  };

  client.once("ready", () => {
    console.log(`✅ تم تسجيل الدخول باسم: ${client.user.tag}`);
    connectToVoice(); // يبدأ الاتصال بالروم AFK عند التشغيل
  });

  client.login(TOKEN);

})();
