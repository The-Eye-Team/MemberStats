/**
 */
//
const Discord = require("discord.js");
const client = new Discord.Client();

//
const config = require("./config.json");

//
const V_CHANNEL_STAFF = "534369494080946186";
const V_CHANNEL_DONOR = "534369532949692417";
const V_CHANNEL_TOTAL = "533809556166279168";
const V_CHANNEL_NEWST = "533809422917697538";

const ROLE_DONOR = "608769868946473001";
const ROLE_HELPER = "309256061037314058";
const ROLE_EXEC = "309256047049179136";
const ROLE_ROOT = "397541797611438081";

const GUILD_THE_EYE = "302796547656253441";

//
// https://blog.abelotech.com/posts/number-currency-formatting-javascript/
function formatNumber(number) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

//
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const g_eye = client.guilds.get(GUILD_THE_EYE);
    const c_total = g_eye.channels.get(V_CHANNEL_TOTAL);
    const user_count = g_eye.memberCount;
    c_total.setName(`Members: ${formatNumber(user_count)}`);

    const donor_count = g_eye.roles.get(ROLE_DONOR).members.size;
    const c_donor = g_eye.channels.get(V_CHANNEL_DONOR);
    c_donor.setName(`Donators: ${formatNumber(donor_count)}`);
});

client.on("guildMemberAdd", (member) => {
    const c_total = member.guild.channels.get(V_CHANNEL_TOTAL);
    const current = parseInt(c_total.name.split(" ")[1].split(",").join(""));
    c_total.setName(`Members: ${formatNumber(current+1)}`);

    member.guild.channels.get(V_CHANNEL_NEWST).setName(`Newest: ${member.user.username}`);
});

client.on("guildMemberUpdate", (oldM, newM) => {
    if (
        !oldM.roles.has(ROLE_DONOR) && newM.roles.has(ROLE_DONOR) ||
        oldM.roles.has(ROLE_DONOR) && !newM.roles.has(ROLE_DONOR)
    ) {
        const g_eye = newM.guild;
        const donor_count = g_eye.roles.get(ROLE_DONOR).members.size;
        const c_donor = g_eye.channels.get(V_CHANNEL_DONOR);
        c_donor.setName(`Donators: ${formatNumber(donor_count)}`);
    }

    if (
        !oldM.roles.has(ROLE_ROOT) && newM.roles.has(ROLE_ROOT) ||
        oldM.roles.has(ROLE_ROOT) && !newM.roles.has(ROLE_ROOT) ||
        !oldM.roles.has(ROLE_EXEC) && newM.roles.has(ROLE_EXEC) ||
        oldM.roles.has(ROLE_EXEC) && !newM.roles.has(ROLE_EXEC) ||
        !oldM.roles.has(ROLE_HELPER) && newM.roles.has(ROLE_HELPER) ||
        oldM.roles.has(ROLE_HELPER) && !newM.roles.has(ROLE_HELPER)
    ) {
        const g_eye = newM.guild;
        const t_r = g_eye.roles.get(ROLE_ROOT).members.map(x => x.id);
        const t_e = g_eye.roles.get(ROLE_EXEC).members.map(x => x.id);
        const t_h = g_eye.roles.get(ROLE_HELPER).members.map(x => x.id);

        const staff = [];
        staff.push(...t_r);
        staff.push(...t_e);
        staff.push(...t_h);

        const staff_count = new Set(staff).size;
        const c_staff = g_eye.channels.get(V_CHANNEL_STAFF);
        c_staff.setName(`Staff: ${staff_count}`);
    }
});

//
client.login(config.bot_token);
