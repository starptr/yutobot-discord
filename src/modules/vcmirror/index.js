const path = require("path");
const fs = require("fs");

const Discord = require("discord.js");

//VC output client
const client = new Discord.Client({
	presence: {
		activity: {
			type: "LISTENING",
			name: `YutoBot`,
		},
	},
});

client.once("ready", () => console.log("VCMirror Ready!"));

let connection;
let dispatcher;

const start = async (audios, message) => {
	connection = await client.channels.cache.get(process.env.DISCORD_CHANNELID_VC_GRAVEYARD).join();
	//dispatcher = connection.play(audio, { type: "opus" });
	dispatchers = audios.map(audio => connection.play(audio, { type: "opus" }));
};

const stop = async () => {
	connection.disconnect();
};

client.login(process.env.DISCORD_VCMIRROR_BOT_TOKEN);

module.exports = { start, stop };
