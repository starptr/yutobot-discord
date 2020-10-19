const path = require("path");
const fs = require("fs");

const Discord = require("discord.js");
const sixLettersToWarn = require("../vcsyncwarn");
const vcMirror = require("../vcmirror");

let vConnection, vDispatcher;

const start = () => {
	const client = new Discord.Client({
		presence: {
			activity: {
				type: "LISTENING",
				name: `${process.env.DISCORD_COMMAND_PREFIX}help`,
			},
		},
	});

	/*
	const vcClient = new Discord.Client({
		presence: {
			activity: {
				type: "LISTENING",
				name: `YutoBot`,
			},
		},
	});
	vcClient.once("ready", () => console.log("VCMirror Ready!"));
	vcClient.login(process.env.DISCORD_VCMIRROR_BOT_TOKEN);
	*/

	client.once("ready", () => {
		console.log("Ready!");
	});

	//Greet new members
	client.on("guildMemberAdd", member => {
		const guildChannelManagerCache = member.guild.channels.cache;
		const welcomeTextChannel = guildChannelManagerCache.get(process.env.DISCORD_CHANNELID_WELCOME);
		const vcSyncTextChannel = guildChannelManagerCache.get(process.env.DISCORD_CHANNELID_VC_SYNC);
		const commandsTextChannl = guildChannelManagerCache.get(process.env.DISCORD_CHANNELID_COMMANDS);

		welcomeTextChannel.send(
			`welcome ${member.user}, there's cool shit in ${welcomeTextChannel}, ${vcSyncTextChannel} for text messages during voicechat, and ${commandsTextChannl} for interacting with bots, enjoy`
		);
	});

	//Listen to commands in the commands channel (except help)
	client.on("message", async message => {
		const prefix = process.env.DISCORD_COMMAND_PREFIX;
		//Check message is in commands channel
		if (message.channel.id === process.env.DISCORD_CHANNELID_COMMANDS) {
			if (message.content.startsWith(prefix)) {
				//Valid command syntax; handle command
				//Tokenize command into words
				const cmd = message.content.slice(1).trim().split(" ");
				switch (cmd[0]) {
					case "ping":
						message.channel.send("Pong! (￣▽￣)ノ");
						break;
					case "mirror":
						{
							switch (cmd[1]) {
								case "i":
								case "init":
									{
										if (message.member.voice.channel) {
											try {
												vConnection = await message.member.voice.channel.join();
												//oConnection = await vcClient.channels.cache.get(process.env.DISCORD_CHANNELID_VC_GRAVEYARD).join();
												vDispatcher = vConnection.play(path.resolve(__dirname, "default.mp3"), { volume: 0 });

												//vConnection.on("debug", console.log);

												let audios = Array.from(message.member.voice.channel.members.filter(member => {
													//Ignore Rhythm bot
													console.log(member.id);
													return member.id !== '235088799074484224';
												}).values()).map(member =>
													vConnection.receiver.createStream(member.id, { mode: "opus", end: "manual" })
												);
												/*
												let audios = [
													//Doesn't work; can only stream 1
													vConnection.receiver.createStream("345370431987122180", { mode: "opus", end: "manual" }),
													vConnection.receiver.createStream("756397443565879367", { mode: "opus", end: "manual" }),
												];
												*/

												console.log(audios);

												/*
												const audio = vConnection.receiver.createStream("MY ID", {
													mode: "opus",
													end: "manual",
												});
												*/
												vcMirror.start(audios, message).catch(console.error);
											} catch (e) {
												console.error(e)
											}
										}
									}
									break;
								case "c":
								case "cut":
									{
										//Todo: Handle exception if uninit (.mirror after disconnectino works)
										if (message.member.voice.channel) {
											vcMirror.stop().catch(console.error);
											vConnection.disconnect();
										}
									}
									break;
								default: {
								}
							}
						}
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
					default:
						message.channel.send(`sry! idk what \`${cmd[0]}\` means ¯\\_(ツ)_/¯`);
				}
			}
		} else if (message.content.trim() === `${prefix}help`) {
			//Exception for help
			message.channel.send(`try that in ${message.guild.channels.cache.get(process.env.DISCORD_CHANNELID_COMMANDS)} (｡•̀ᴗ-)✧`);
		} else {
			//Other messages
			if (message.channel.id !== process.env.DISCORD_CHANNELID_VC_SYNC) {
				if (message.content.trim().length == 6) {
					//sixLettersToWarn(client, message);
				}
			}
		}
	});

	client.login(process.env.DISCORD_BOT_TOKEN);
};

module.exports = start;
