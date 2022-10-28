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
        "Content-Type": "application/json",
        "User-Agent": `miki-api-js@${version}`,
      },
    });
  }

  public addExperience(
    guildId: Snowflake,
    userId: Snowflake,
    amount: number,
    bucket?: string
  ): Promise<Maybe<AddExperienceResponse>> {
    return this.axios
      .post("/experience/add", {
        guildId,
        userId,
        amount,
        bucket,
      })
      .then((r) => r.data || null)
      .catch(this.handleError);
  }

  public verifyGrant(clientId: Snowflake, code: string): Promise<OAuth2Grant> {
    return this.axios
      .post(
        `/oauth2/verify?${new URLSearchParams(
          {
            client_id: clientId,
            code,
          }.toString()
        )}`
      )
      .then((r) => r.data)
      .then((r) => {
        if (r.authorized) {
          return r;
        }
        throw new Error("application grant was not authorized");
      })
      .catch(this.handleError);
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
