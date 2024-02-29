const axios = require("axios");
const fs = require('fs');
const { getStreamFromURL, shortenURL, randomString } = global.utils;

module.exports = {
  config: {
    name: "spotify",
    version: "1.0",
    author: "Kshitiz",
    countDown: 10,
    role: 0,
    shortDescription: "play song from spotify",
    longDescription: "play song from spotify",
    category: "music",
    guide: "{pn} sing songname"
  },

  onStart: async function ({ api, event, args, message }) {
    const songName = args.join(" ");
    if (!songName) {
      return message.reply("Please provide a song name.");
    }

    const loadingMessage = await message.reply("downloading your song🕐..");

    try {
      const spotifyResponse = await axios.get(`https://spotify-klei.onrender.com/spotify?query=${encodeURIComponent(songName)}`);
      const trackURLs = spotifyResponse.data.trackURLs;
      if (!trackURLs || trackURLs.length === 0) {
        throw new Error("No track found for the provided song name.");
      }

      const trackURL = trackURLs[0];
      const KshitizDownloadResponse = await axios.get(`https://spdl.onrender.com/spotify?id=${encodeURIComponent(trackURL)}`);
      const KshitizDownloadLink = KshitizDownloadResponse.data.download_link;

      const KshitizFilePath = await downloadTrack(KshitizDownloadLink);
      console.log("File downloaded successfully:", KshitizFilePath);

      const shortDownloadURL = await shortenURL(KshitizDownloadLink);

      await message.reply({
        body: `🎧 Playing: ${songName}\nDownload Link: ${shortDownloadURL}`,
        attachment: fs.createReadStream(KshitizFilePath)
      });

      console.log("Audio sent successfully.");

    } catch (error) {
      console.error("Error occurred:", error);
      message.reply(`An error occurred: ${error.message}`);
    } finally {
      message.unsend(loadingMessage.messageID);
    }
  }
};

async function downloadTrack(url) {
  const stream = await getStreamFromURL(url);
  const KshitizFilePath = `${__dirname}/cache/${randomString()}.mp3`;
  const writer = fs.createWriteStream(KshitizFilePath);
  stream.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(KshitizFilePath));
    writer.on('error', reject);
  });
}