const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "del",
    aliases: ["d"],
    version: "1.0",
    author: "Mimi",
    countDown: 5,
    role: 2,
    shortDescription: "Delete file and folders",
    longDescription: "Delete file",
    category: "owner",
    guide: "{pn}"
  },

  onStart: async function ({ args, message, event }) {
    const permission = ["100092010460002"];
    if (!permission.includes(event.senderID)) {
      message.reply("Pakk u, You don't have permission to use this command.");
      return;
    }
    let commandName = args[0];

    if (!commandName) {
      return message.reply("Type the file name.");
    }

    if (commandName.endsWith(".js")) {
      commandName = commandName.slice(0, -3);
    }

    const filePath = path.join(__dirname, '..', 'cmds', commandName + ".js");

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        message.reply("✅ | A command file has been deleted: " + commandName + " !!");
      } else {
        message.reply("Command file " + commandName + " unavailable!!");
      }
    } catch (err) {
      console.error(err);
      message.reply("Cannot be deleted because " + commandName + ": " + err.message);
    }
  }
};