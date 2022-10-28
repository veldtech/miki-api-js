import { Axios, AxiosError, type AxiosResponse } from "axios";
import { version } from "./version.json";
import { apiUrl } from "./Constants";

/**
 * Type-safe stringified snowflake integers.
 */
type Snowflake = `${bigint}`;

/**
 * A type alias to specify a type response OR null. Useful for optional response types.
 */
type Maybe<T> = T | null;

type AddExperienceResponse = {
  memberId: Snowflake;
  guildId: Snowflake;
  level: number;
  hasLevelledUp: boolean;
};

type Guild = {
  id: Snowflake;
  name: string;
  avatar: string | null;
};

type OAuth2Grant = {
  authorized: boolean;
  guild: Guild;
};

export class MikiApiClient {
  private axios: Axios;

  constructor(token: string) {
    this.axios = new Axios({
      baseURL: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": `miki-api-js@${version}`,
      },
    });
  }

  public async addExperience(
    guildId: Snowflake,
    memberId: Snowflake,
    amount: number,
    bucket?: string
  ): Promise<Maybe<AddExperienceResponse>> {
    const payload = JSON.stringify({
      amount,
      bucket,
    });

    const response = await this.axios
      .post(`guilds/${guildId}/members/${memberId}/experience`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch(this.handleError);
    console.log({ response });
    if (!response.data) {
      return null;
    }

    return JSON.parse(response.data) as AddExperienceResponse;
  }

  public async verifyGrant(
    clientId: Snowflake,
    code: string
  ): Promise<OAuth2Grant> {
    const response = await this.axios
      .post(
        `oauth2/verify?${new URLSearchParams({
          client_id: clientId,
          code,
        }).toString()}`
      )
      .then((r) => JSON.parse(r.data))
      .catch(this.handleError);
    if (!response.authorized) {
      throw new Error("Grant not authorized.");
    }

    return response as OAuth2Grant;
  }

  private handleError<T>(e: Error) {
    if (!(e instanceof AxiosError)) {
      throw e;
    }

    if (e.status === 404) {
      return e.response as AxiosResponse<T, any>;
    }

    throw e;
  }
}
