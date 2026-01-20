const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

// إعداد البوت مع الصلاحيات اللازمة
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// قراءة الإعدادات من Environment Variables في Render
// تأكد أنك سميت المتغير في موقع ريندر باسم TOKEN
const TOKEN = process.env.TOKEN; 
const GUILD_ID = "1432785665350828185";
const VOICE_CHANNEL_ID = "1432785666290356321";

client.once("ready", () => {
  console.log(`✅ تم تسجيل الدخول باسم: ${client.user.tag}`);

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    return console.log("❌ خطأ: السيرفر غير موجود، تأكد من ID السيرفر");
  }

  const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);
  if (!channel) {
    return console.log("❌ خطأ: الروم الصوتي غير موجود، تأكد من ID الروم");
  }

  try {
    joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false, // لكي لا يكون عليه علامة سماعة مقفولة
      selfMute: true   // ليكون المايك مقفل (ساكت)
    });
    console.log(`🔊 البوت دخل الروم الصوتي [${channel.name}] بنجاح وهو الآن صامت.`);
  } catch (error) {
    console.error("❌ فشل الدخول للروم الصوتي:", error);
  }
});

// تسجيل الدخول باستخدام التوكن المأخوذ من Render
if (!TOKEN) {
  console.error("❌ خطأ: لم يتم العثور على TOKEN في إعدادات Render (Environment Variables)");
} else {
  client.login(TOKEN);
}
