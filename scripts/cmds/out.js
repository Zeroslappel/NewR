

module.exports = {
config: {
name: "out",
category: "owner"
},

onStart: async function ({ api, args }) {

const tid = args[0];

api.removeUserFromGroup(api.getCurrentUserID(), tid);
}
};