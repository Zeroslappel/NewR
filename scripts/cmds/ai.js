const axios = require("axios");

const Prefixes = ["II", "ii",".."];

module.exports = {
  config: {
    name: "ai",
    version: "2.6.6",
    author: "JV Barcenas | Shikaki", // do not change
    role: 0,
    category: "ai",
    shortDescription: {
      en: "Asks AI for an answer.",
    },
    longDescription: {
      en: "Asks AI for an answer based on the user prompt.",
    },
    guide: {
      en: "{pn} [prompt]",
    },
  },
  onStart: async function ({ message, api, event, args }) {
    try {
      let content = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
      if (content != "" || event.type == "message_reply") {

        api.setMessageReaction("⌛", event.messageID, () => { }, true);

        const startTime = new Date().getTime();

        let updatedPrompt = `Mostly answer in short like 1 or 2 sentences unless it requires a long answer such as an essay, poem, or story. Analyze the prompt and answer as instructed and only include the necessary parts. No additional fillers. Now: ${content}`;
        const url = `https://pi.aliestercrowley.com/api?prompt=${encodeURIComponent(updatedPrompt)}&uid=${event.senderID}`;

        const response = await axios.get(url);
        const result = response.data.response;

        const endTime = new Date().getTime();
        const completionTime = ((endTime - startTime) / 1000).toFixed(2);

        const totalWords = result.split(/\s+/).filter(word => word !== '').length;

        message.reply(`${result}\n\nCompletion time: ${completionTime} seconds\nTotal words: ${totalWords}`, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
            });
          }
        });

        api.setMessageReaction("✅", event.messageID, () => { }, true);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      message.reply('An error occurred.');
      api.setMessageReaction("❌", event.messageID, () => { }, true);
    }
  },
  onChat: async function ({ api, event }) {
    try {
      const prefix = Prefixes.find(
        (p) => event.body && event.body.toLowerCase().startsWith(p)
      );

      if (!prefix) {
        return;
      }

      const prompt = event.body.substring(prefix.length).trim();

      if (prompt === "") {
        await api.sendMessage(
          "Kindly provide the question at your convenience and I shall strive to deliver an effective response. Your satisfaction is my top priority.",
          event.threadID
        );
        return;
      }

      api.setMessageReaction("⌛", event.messageID, () => { }, true);

      const updatedPrompt = `Follow as written: Mostly answer in 1 word or 1 sentence. For any affirmation to your answers only yes or no. Answer in 1-2 sentences for generic questions and longer for complex questions. Mostly stick to 1 sentence unless asked long answers. Now: ${prompt}`;

      const response = await axios.get(
        `https://pi.aliestercrowley.com/api?prompt=${encodeURIComponent(updatedPrompt)}&uid=${event.senderID}`
      );

      if (response.status !== 200 || !response.data) {
        throw new Error("Invalid or missing response from API");
      }

      const messageText = response.data.response;

      await api.sendMessage(messageText, event.threadID);

      api.setMessageReaction("✅", event.messageID, () => { }, true);
    } catch (error) {
      console.error("Error in onChat:", error);
      await api.sendMessage(
        `Failed to get answer: ${error.message}`,
        event.threadID
      );
    }
  },
};