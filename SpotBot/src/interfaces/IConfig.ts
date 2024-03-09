import { PermissionsBitField } from "discord.js"

export interface IConfig {
    initial_configuration: boolean,
    config_last_modified_dts: Date,
    notify_on_server_leave: boolean,
    configured_for_pkmn_go: boolean,
    spotbot_category_id: null|string,
    guild_id: null|string,
    channels: IChannels,
    roles: any
}

interface IChannels {
    pkmn_go_specific_channels: IChannel[],
    discord_general_channels: IChannel[],
}

export interface IChannel {
    configured: boolean,
    default_name: string,
    purpose: string,
    name: string,
    id: string,
    default_channel_topic: string,
    custom_channel_topic: string,
    slow_mode: boolean,
    roles: any,
    everyone_role_allow: Readonly<PermissionsBitField>,
    everyone_role_deny: Readonly<PermissionsBitField>
}