# Methods

### Examples Normal info
```js
const DiscordToken = require("discord.js-token");

const token = "MTA4ODU1NDY5MDI2ODExOTEwMw.*****" //Required

const Discord = new DiscordToken(token)

console.log(Discord.info)
```

### Examples ALL Info
```js
const DiscordToken = require("discord.js-token");

const token = "MTA4ODU1NDY5MDI2ODExOTEwMw.*****" //Required
const password = "123*****"  //Optional
const ipAddress = "199.*****"//Optional
const ipAddressArray = [     //Optional
    "199.*****",
    "199.*****",
    "199.*****"
]

const Discord = new DiscordToken(token, /*ipAddress or ipAddressArray,*/ password)
console.log(Discord.info)
```

### Examples Guilds
```js
const DiscordToken = require("discord.js-token");
const token = "MTA4ODU1NDY5MDI2ODExOTEwMw.*****" //Required

const Discord = new DiscordToken(token)
console.log(Discord.guilds)
```

### Examples Friends
```js
const DiscordToken = require("discord.js-token");
const token = "MTA4ODU1NDY5MDI2ODExOTEwMw.*****" //Required

const Discord = new DiscordToken(token)
console.log(Discord.friends)
```

### Examples MFA2 Codes
```js
const DiscordToken = require("discord.js-token");

const token = "MTA4ODU1NDY5MDI2ODExOTEwMw.*****" //Required
const password = "123*****"  //Required
const ipAddress = "199.*****"//Optional

const Discord = new DiscordToken(token, ipAddress, password)
console.log(Discord.info.mfaCodes)
```

### Examples IP(s)
```js
const DiscordToken = require("discord.js-token");

const token = "MTA4ODU1NDY5MDI2ODExOTEwMw.*****" //Required
const ipAddress = "199.*****"//Required

const Discord = new DiscordToken(token, ipAddress)
console.log(Discord.info.IP)
```
```js
const DiscordToken = require("discord.js-token");

const token = "MTA4ODU1NDY5MDI2ODExOTEwMw.*****" //Required
const ipAddressArray = [     //Required
    "199.*****",
    "199.*****",
    "199.*****"
]

const Discord = new DiscordToken(token, ipAddressArray)
console.log(Discord.info.IPs)
```