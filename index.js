const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.login(process.env.TOKEN);
const GUILD_ID = "1432785665350828185";
const VOICE_CHANNEL_ID = "1432785666290356321";

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return console.log("❌ السيرفر غير موجود");

  const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);
  if (!channel) return console.log("❌ الروم الصوتي غير موجود");

  joinVoiceChannel({
    channelId: channel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: true
  });

  console.log("✅ البوت دخل الروم الصوتي وباقي ساكت");
});

client.login(process.env.TOKEN);



