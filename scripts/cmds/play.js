const axios = require("axios");
const fs = require("fs-extra");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

module.exports = {
  config: {
    name: "play",
    version: "2.0",
    role: 0,
    author: "Music",
    cooldowns: 5,
    shortDescription: "Music & Lyrics",
    longDescription: "Music & Lyrics",
    category: "media",
    usages: "{pn} <song>",
    dependencies: {
      "fs-extra": "",
      "request": "",
      "axios": "",
      "ytdl-core": "",
      "yt-search": ""
    }
  },

  onStart: async ({ api, event }) => {
    const input = event.body;
    const text = input.substring(12);
    const data = input.split(" ");

    if (data.length < 2) {
      return api.sendMessage("Please write music name", event.threadID);
    }

    data.shift();
    const song = data.join(" ");

    try {

api.setMessageReaction("⌛", event.messageID, () => { }, true);

      const [lyricsResponse, searchResults] = await Promise.all([
        axios.get(`https://lyrist.vercel.app/api/${encodeURIComponent(song)}`),
        yts(song)
      ]);

      const lyrics = lyricsResponse.data.lyrics || "Not found!";
      const title = lyricsResponse.data.title || "Not found!";
      const artist = lyricsResponse.data.artist || "Not found!";

      if (!searchResults.videos.length) {
        return api.sendMessage("Error: Invalid request.", event.threadID, event.messageID);
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;

      const stream = ytdl(videoUrl, { filter: "audioonly" });

      const fileName = `${event.senderID}.mp3`;
      const filePath = __dirname + `/cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded');

        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage('[ERR] The file could not be sent because it is larger than 25MB.', event.threadID);
        }

api.setMessageReaction("✅", event.messageID, () => { }, true);

        const message = {
          body: `╭ Title: ${title}\n╰ Artist: ${artist}\n\n- Lyrics: ${lyrics}`,
          attachment: fs.createReadStream(filePath)
        };

        api.sendMessage(message, event.threadID, () => {
          fs.unlinkSync(filePath);
        }, event.messageID);
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('Try again later - an error occurred.', event.threadID, event.messageID);
    }
  }
};