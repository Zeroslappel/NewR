const axios = require('axios');

module.exports = {
  config: {
    name: "fact",
    version: "1.1",
    author: "Shikaki",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get a random fact."
    },
    longDescription: {
      en: "Get a random fact to amaze your friends."
    },
    category: "😄 Fun",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, usersData, commandName, message }) {
    const apiKey = 'PZJExqjRpIey38Z4VArNZg==zRyIHFobjiHepOJE'; // Replace with your actual API key

    try {
      const limit = 1; // You can adjust the limit to get more facts if needed
      const apiUrl = `https://api.api-ninjas.com/v1/facts?limit=${limit}`;
      const headers = {
        'X-Api-Key': apiKey,
      };

      const response = await axios.get(apiUrl, { headers });

      if (response.status === 200) {
        const facts = response.data;

        if (facts.length > 0) {
          const fact = facts[0].fact;

          const msg = {
            body: `
⭐⭐⭐⭐⭐⭐⭐⭐⭐

📚 Random Fact 🤓:

${fact}

⭐⭐⭐⭐⭐⭐⭐⭐⭐
`,
          };

          // Use message.reply to send the random fact
          await message.reply(msg, { typing: true });
        } else {
          // Handle the case where no facts were returned
          message.reply('🤷‍♂ No facts were found. Try again later.');
        }
      } else {
        // Handle errors or unexpected responses from the API
        message.reply('❌ Failed to fetch a random fact. Please try again later.');
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error:', error);
      message.reply('❌ An error occurred while fetching the random fact. Please try again later.');
    }
  }
};