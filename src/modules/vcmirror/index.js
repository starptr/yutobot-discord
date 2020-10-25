const path = require("path");
const fs = require("fs");

const Discord = require("discord.js");

const discordTokens = require("./tokens.json");
/*
//VC output client
const client = new Discord.Client({
	presence: {
		activity: {
			type: "LISTENING",
			name: `aaaaa`,
		},
	},
});

const client2 = new Discord.Client({
	presence: {
		activity: {
			type: "LISTENING",
			name: `aa222`,
		},
	},
});
*/

const clients = [...new Array(10)].map((_, index) => new Discord.Client({
	presence: {
		activity: {
			type: "LISTENING",
			name: `test ${index}`,
		},
	},
}));

//client.once("ready", () => console.log("VCMirror Ready!"));
//client2.once("ready", () => console.log("VCMir2 Ready!"));
clients.forEach((client, index) => {
	client.once("ready", () => console.log(`Wormhole ${index} ready!`));
});

let connections;
/*
let connection;
let connection2;
let dispatcher;
let dispatcher1;
let dispatcher2;
*/

const start = async (audios, message) => {
	connections = await Promise.all(clients.map(client => client.channels.cache.get(process.env.DISCORD_CHANNELID_VC_GRAVEYARD).join()));
	//connection = await client.channels.cache.get(process.env.DISCORD_CHANNELID_VC_GRAVEYARD).join();
	//connection2 = await client2.channels.cache.get(process.env.DISCORD_CHANNELID_VC_GRAVEYARD).join();
	//dispatcher = connection.play(audio, { type: "opus" });
	dispatchers = audios.map((audio,index) => connections[index].play(audio, { type: "opus", volume: 0.45 }));
	//dispatcher1 = connection.play(audios[0], { type: "opus" });
	//dispatcher2 = connection2.play(audios[1], { type: "opus" });
};

const stop = async () => {
	/*
	connection.disconnect();
	connection2.disconnect();
	*/
	connections.forEach(connection => connection.disconnect());
};
/*
client.login(process.env.DISCORD_VCMIRROR_BOT_TOKEN);
client2.login(process.env.DISCORD_VCMIR2_BOT_TOKEN);
*/
clients.forEach((client, index) => client.login(discordTokens[index]));

module.exports = { start, stop };
