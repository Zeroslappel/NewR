const axios = require('axios');

module.exports = {
  config: {
    name: "liner",
aliases: ["linerai"],
    version: 2.0,
    author: "OtinXSandip",
    longDescription: "liner ai",
    category: "ai",
    guide: {
      en: "{p}{n} questions",
    },
  },
  onStart: async function ({ message, event, Reply, args, api, usersData }) {
    try {
      const id = event.senderID;
      const userData = await usersData.get(id);
      const name = userData.name;
      const ment = [{ id, tag: name }];
      const encodedPrompt = encodeURIComponent(args.join(" "));
      
      if (!encodedPrompt) {
        return message.reply("Please provide questions");
      }
      const a = "repl";
      const response = await axios.get(`https://sdxl.otinxsandeep.${a}.co/linerai?prompt=${encodedPrompt}`);
      const lado = response.data.answer;

      message.reply({
        body: `${name} ${lado}`,
        mentions: ment,
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  },
};