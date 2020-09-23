const fs = require("fs");
const path = require("path");

const amongUs = {
	regex: /^[a-z]+$/i,
	ignore: fs.readFileSync(path.resolve(__dirname, "wordlist.txt"), "utf-8").split("\n"),
};

const sixLettersToWarn = (client, message) => {
	console.log(message.content);
	const msgStr = message.content;
	if (msgStr.match(amongUs.regex) && !amongUs.ignore.includes(msgStr)) {
		const vc_sync_channel = message.guild.channels.cache.get(process.env.DISCORD_CHANNELID_VC_SYNC);
		vc_sync_channel.send(`Hey ${message.member.user}! It looks like you sent an Among Us room code in ${message.channel}. To help prevent spam, please send codes into this channel, ${vc_sync_channel}.
For everybody else, the room code is \`${message.content}\`. Have fun! (o´∀\`o)
(This Anti-spam feature is currently in beta. If you notice any problems, please ping @*ptr.)`);
	}
};

module.exports = sixLettersToWarn;
