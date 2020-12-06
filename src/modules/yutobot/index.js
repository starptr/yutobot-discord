const Discord = require("discord.js");
const sixLettersToWarn = require("../vcsyncwarn");
const owoifier = require("../owoifier");
const tweeter = require("../tweeter");
const pkgInfo = require("../../../package.json");

let owoifierEnabled = true;
let owoifierCounter = 0;

const start = () => {
	const client = new Discord.Client({
		presence: {
			activity: {
				type: "LISTENING",
				name: `${process.env.DISCORD_COMMAND_PREFIX}help`,
			},
		},
	});

	tweeter(client);

	client.once("ready", () => {
		console.log("Ready!");
	});

	//Greet new members
	client.on("guildMemberAdd", member => {
		const guildChannelManagerCache = member.guild.channels.cache;
		const welcomeTextChannel = guildChannelManagerCache.get(process.env.DISCORD_CHANNELID_WELCOME);
		const vcSyncTextChannel = guildChannelManagerCache.get(process.env.DISCORD_CHANNELID_VC_SYNC);
		const commandsTextChannl = guildChannelManagerCache.get(process.env.DISCORD_CHANNELID_COMMANDS);
		const spawnTextChannel = guildChannelManagerCache.get(process.env.DISCORD_CHANNELID_SPAWN);
		const readmeTextChannel = guildChannelManagerCache.get(process.env.DISCORD_CHANNELID_README);

		welcomeTextChannel.send(
			`welcome ${member.user}, read ${readmeTextChannel}, ${vcSyncTextChannel} for text messages during voicechat, ${commandsTextChannl} and ${spawnTextChannel} for interacting with bots, enjoy`
		);
	});

	//Listen to commands in the commands channel (except help)
	client.on("message", async message => {
		const prefix = process.env.DISCORD_COMMAND_PREFIX;
		//Check message is in commands channel
		if (message.content.startsWith(prefix)) {
			//Valid command syntax; handle command
			//Tokenize command into words
			const cmd = message.content.slice(1).trim().split(" ");
			switch (cmd[0]) {
				case "ping":
					message.channel.send("Pong! (￣▽￣)ノ");
					break;
				case "help":
					message.channel.send("no 3>");
					break;
				case "uwu":
					message.channel.send("owo (*≧▽≦)");
					break;
				case "owo":
					message.channel.send("uwu (≧∇≦*)");
					break;
				case "v":
				case "version":
					message.channel.send(`Running YutoBot v${pkgInfo.version}`);
					break;
				case "foocheck":
					if (message.member.hasPermission("MANAGE_ROLES")) {
						try {
							const allMembers = (await message.guild.members.fetch()).array().filter(member => !member.user.bot);
							const allMembersWithoutFoo = allMembers.filter(member => !member.roles.cache.array().some(role => role.name === 'foo'));
							message.channel.send(`No foos: \`${allMembersWithoutFoo.map(member => member.nickname || member.user.username).join("`, `")}\``);
						} catch (err) {
							console.error("foocheck failed.")
							console.error(err);
						}
					}
					break;
				case "owoifier":
					if (message.member.hasPermission("ADMINISTRATOR")) {
						if (owoifierEnabled) {
							owoifierEnabled = false;
						} else {
							owoifierEnabled = true;
							owoifierCounter = 0;
						}
						message.channel.send(owoifierEnabled ? "1" : "0");
					}
				default:
					message.channel.send(`sry! idk what \`${cmd[0]}\` means ¯\\_(ツ)_/¯`);
			}
		}

		if (message.channel.id === process.env.DISCORD_CHANNELID_GENERAL && !message.author.bot) {
			console.log(owoifierCounter);
			if (owoifierCounter === 0) {
				owoifier(message);
			}
			owoifierCounter++;
			owoifierCounter %= 100;
		}
	});

	client.login(process.env.DISCORD_BOT_TOKEN);
};

module.exports = start;
