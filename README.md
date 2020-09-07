# yutobot-discord
My online presence automator.

## Deploy
1. `touch .env` at the project root and define these:
```
DISCORD_BOT_TOKEN=
DISCORD_CHANNELID_WELCOME=
DISCORD_CHANNELID_VC_SYNC=
DISCORD_CHANNELID_COMMANDS=
DISCORD_COMMAND_PREFIX=
```
2. Run:
```
yarn install
yarn build
yarn deploy
```
