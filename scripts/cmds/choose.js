module.exports = {
  config: {
    name: "choose",
    version: 2.0,
    author: "OtinXSandip",
    longDescription: "choose",
    category: "ai",
    guide: {
      en: "{p}{n} cat | dog",
    },
  },
  onStart: async function ({ message, usersData, event, args }) {
    if (args.length < 2) {
      message.reply("Please provide two options Eg pussy | dick .");
      return;
    }

    const options = args.join(" ").split("|").map((option) => option.trim());

    const randomNumber = Math.floor(Math.random() * options.length);
    const chosenOption = options[randomNumber];

    const fontMap = {
      a: "𝗮",
      b: "𝗯",
      c: "𝗰",
      d: "𝗱",
      e: "𝗲",
      f: "𝗳",
      g: "𝗴",
      h: "𝗵",
      i: "𝗶",
      j: "𝗷",
      k: "𝗸",
      l: "𝗹",
      m: "𝗺",
      n: "𝗻",
      o: "𝗼",
      p: "𝗽",
      q: "𝗾",
      r: "𝗿",
      s: "𝘀",
      t: "𝘁",
      u: "𝘂",
      v: "𝘃",
      w: "𝘄",
      x: "𝘅",
      y: "𝘆",
      z: "𝘇",
      A: "𝗔",
      B: "𝗕",
      C: "𝗖",
      D: "𝗗",
      E: "𝗘",
      F: "𝗙",
      G: "𝗚",
      H: "𝗛",
      I: "𝗜",
      J: "𝗝",
      K: "𝗞",
      L: "𝗟",
      M: "𝗠",
      N: "𝗡",
      O: "𝗢",
      P:"𝗣",
      Q: "𝗤",
      R: "𝗥",
      S: "𝗦",
      T: "𝗧",
      U: "𝗨",
      V: "𝗩",
      W: "𝗪",
      X: "𝗫",
      Y: "𝗬",
      Z: "𝗭"
    };

    const formattedOption = chosenOption
      .split("")
      .map((char) => fontMap[char] || char)
      .join("");

    message.reply(` ${formattedOption}`);
  },
};