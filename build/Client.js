"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MikiApiClient = void 0;
const axios_1 = require("axios");
const version_json_1 = require("./version.json");
const Constants_1 = require("./Constants");
class MikiApiClient {
    constructor(token) {
        this.axios = new axios_1.Axios({
            baseURL: Constants_1.apiUrl,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "User-Agent": `miki-api-js@${version_json_1.version}`,
            },
        });
    }
    addExperience(guildId, userId, amount, bucket) {
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
    verifyGrant(clientId, guildId, code) {
        return this.axios
            .post(`/oauth2/verify?${new URLSearchParams({
            client_id: clientId,
            guild_id: guildId,
            code,
        }.toString())}`)
            .then((r) => r.data)
            .then((r) => {
            if (r.authorized) {
                return r;
            }
            throw new Error("application grant was not authorized");
        })
            .catch(this.handleError);
    }
    handleError(e) {
        if (!(e instanceof axios_1.AxiosError)) {
            throw e;
        }
        if (e.status === 404) {
            return e.response;
        }
        throw e;
    }
}
exports.MikiApiClient = MikiApiClient;
