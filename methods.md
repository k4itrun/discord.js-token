# Methods

### Examples Normal info

```js
const DiscordToken = require('discord.js-token');

const token = 'MTA4ODU1NDY5MDI2ODExOTEwMw.*****'; //Required

const Discord = DiscordToken(token);

console.log(Discord.all);
```

### Examples ALL Info

```js
const DiscordToken = require('discord.js-token');

const token = 'MTA4ODU1NDY5MDI2ODExOTEwMw.*****'; //Required
const password = '123*****'; //Optional
const ipAddress = '199.*****'; //Optional
const ipAddressArray = [
  //Optional
  '199.*****',
  '199.*****',
  '199.*****',
];

const Discord = DiscordToken(token, /*ipAddress or ipAddressArray,*/ password);
console.log(Discord.all);
```

### Examples Guilds

```js
const DiscordToken = require('discord.js-token');
const token = 'MTA4ODU1NDY5MDI2ODExOTEwMw.*****'; //Required

const Discord = DiscordToken(token);
console.log(Discord.guilds);
```

### Examples Friends

```js
const DiscordToken = require('discord.js-token');
const token = 'MTA4ODU1NDY5MDI2ODExOTEwMw.*****'; //Required

const Discord = DiscordToken(token);
console.log(Discord.friends);
```
