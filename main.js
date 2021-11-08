const { TranslationServiceClient } = require("@google-cloud/translate").v3;
const { Client, Intents, MessageFlags } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const projectId = process.env.G_PEOJECT_ID;
const location = "us-central1";


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
    if(! msg.flags.has(MessageFlags.FLAGS.IS_CROSSPOST)) return
    const result = await translate(msg.content,"en","ja")
    msg.channel.send(result)
  });


client.login(process.env.D_TOKEN);

async function translate(text, sourceLang, targetLang) {
    const translationClient = new TranslationServiceClient();
    const req = {
        parent: translationClient.locationPath(projectId, location),
        contents: [text],
        mimeType: "text/plain",
        sourceLanguageCode: sourceLang,
        targetLanguageCode: targetLang,
    };
    const res = await translationClient.translateText(req);
    for (const elem of res) {
        if (elem == null)
            continue;
        return elem["translations"][0]["translatedText"];
    }
}