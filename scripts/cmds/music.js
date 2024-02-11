const axios = require("axios");
module.exports = {
  config: {
    name: "music",
    version: "1.1",
    author: "Otinxsandip",
    countDown: 150,
    role: 0,
    longDescription: "voice",
    category: "media",
    guide: {
      en: "{pn} music name"
    }
  },

  onStart: async function ({ api, event, args, getLang, message, usersData }) {
    try {
      const text = args.join(' ');
      if (!text) {
        return message.reply('Please provide song name.');
      }
      const link = `https://sandipapi.onrender.com/music?song=${encodeURIComponent(text)}`;

      message.reply({
        body: '𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭𝐞𝐝 𝐦𝐮𝐬𝐢𝐜:',
        attachment: await global.utils.getStreamFromURL(link)
      });
    } catch (error) {
      console.error(error);
    }
  }
};