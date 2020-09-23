const http = require("http");
const fs = require("fs");
const path = require("path");
const port = 53134;

const Discord = require("discord.js");

http.createServer((req, res) => {
	let responseCode = 404;
	let content = "404 Error";

	if (req.url === "/") {
		responseCode = 200;
		content = fs.readFileSync(path.resolve(__dirname, "index.html"));
	}

	res.writeHead(responseCode, {
		"content-type": "text/html;charset=utf-8",
	});

	res.write(content);
	res.end();
}).listen(port);

const start = () => {
	const client = new Discord.Client();
	client.login(process.env.DISCORD_USER_TOKEN).then(console.log).catch(console.error);
	const clientUser = new Discord.ClientUser(client, { id: process.env.DISCORD_USER_ID });

	clientUser.setStatus("online");
};

module.exports = start;
