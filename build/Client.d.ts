/**
 * Type-safe stringified snowflake integers.
 */
declare type Snowflake = `${bigint}`;
/**
 * A type alias to specify a type response OR null. Useful for optional response types.
 */
declare type Maybe<T> = T | null;
declare type AddExperienceResponse = {
    memberId: Snowflake;
    guildId: Snowflake;
    level: number;
    hasLevelledUp: boolean;
};
declare type Guild = {
    id: Snowflake;
    name: string;
    avatar: string | null;
};
declare type OAuth2Grant = {
    authorized: boolean;
    guild: Guild;
};
export declare class MikiApiClient {
    private axios;
    constructor(token: string);
    addExperience(guildId: Snowflake, userId: Snowflake, amount: number, bucket?: string): Promise<Maybe<AddExperienceResponse>>;
    verifyGrant(clientId: Snowflake, guildId: Snowflake, code: string): Promise<OAuth2Grant>;
    private handleError;
}
export {};
