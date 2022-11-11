import { Axios, AxiosError } from "axios";
import { version } from "./version.json";
import { apiUrl } from "./Constants";
import { ApiError, ImpossibleError } from "./ApiError";
import { ValidationError } from "./ValidationError";

/**
 * Stringified snowflake.
 */
type Snowflake = string;

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
      validateStatus: (status) => status >= 200 && status < 300,
      transformRequest: (data) => JSON.stringify(data),
      transformResponse: (data) => JSON.parse(data),
    });
  }

  public async addExperience(
    guildId: Snowflake,
    memberId: Snowflake,
    amount: number,
    bucket?: string
  ): Promise<Maybe<AddExperienceResponse>> {
    const response = await this.axios
      .post(
        `guilds/${guildId}/members/${memberId}/experience`,
        {
          amount,
          bucket: bucket ?? "default",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .catch(this.handleError);
    return response?.data ?? null;
  }

  public async verifyGrant(
    clientId: Snowflake,
    code: string
  ): Promise<OAuth2Grant> {
    const response = await this.axios
      .post<OAuth2Grant>(
        `oauth2/verify?${new URLSearchParams({
          client_id: clientId,
          code,
        }).toString()}`
      )
      .catch(this.handleError);
    if (!response?.data.authorized) {
      throw new Error("Grant not authorized.");
    }

    return response!.data;
  }

  private handleError<T>(e: Error) {
    if (!(e instanceof AxiosError<T>)) {
      throw new ImpossibleError(e);
    }

    if (e.response?.status === 404) {
      return null;
    }

    if (e.response?.status === 400) {
      throw new ValidationError(e);
    }

    throw new ApiError(e);
  }
}
