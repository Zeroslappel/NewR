const fetch = require("node-fetch");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "lyrics",
    version: "1.0",
    author: "Ohio03 | @tu33rtle.xy",
		countDown: 50,
    role: 0,
    shortDescription: {
      vi: "Get lyrics of a song",
      en: "Get lyrics of a song",
    },
    longDescription: {
      vi: "Get lyrics of a song",
      en: "Get lyrics of a song",
    },
    category: "music",
    guide: {
      en: "{pn} <song name>\nExample:\n{pn} Until it dies",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    const songName = args.join(" ");
		if (!songName) {
      message.reply('❌ | Please Specify The Name Of The Song You Want To Find Lyrics For.');
      return;
		}
    
    try {
      const res = await fetch(`https://lyrics.api-tu33rtle.repl.co/api/lyrics?songName=${encodeURIComponent(songName)}`);
      const data = await res.json();
      
      if (data.lyrics) {
        const title = data.title;
        const artist = data.artist;
        const lyrics = data.lyrics;
        const image = data.image;
        
        const Stream = await getStreamFromURL(image);
        
        const reply = `╭「 Title: ${title} 」\n\n❏ Artist: ${artist}\n❏ Lyrics:\n\n${lyrics}`;
        
        message.reply({
          body: reply,
          attachment: Stream
        });
      } else {
        message.reply("❌ | Lyrics Not Found for That Song.");
      }
    } catch (error) {
      console.error(error);
      message.reply("error");
    }
  }
};