import * as http from "node:http";
import {info} from "./log";
import {IncomingMessage, ServerResponse} from "http";
import {DEBUG} from "./constants";
import routes from "./routes/export";
import ServiceError, {ServiceErrorCodes} from "./errors/Service.error";

type ApiConfig = {
    port: number,
    hostname: string
}

/**
 * This class is the main handler, each request pass here
 */
class Api {
    private config: ApiConfig;
    private server: http.Server;

    constructor(config: ApiConfig) {
        this.config = config;

        this.server = new http.Server();
        this.server.on("request", this.gateway);

        console.log(routes)
    }

    gateway(req: IncomingMessage, res: ServerResponse){
        // log entries when debugging
        if (DEBUG){
            info(
                "Api",
                "New request received",
                [
                    { key: "url", message: req.url },
                    { key: "method", message: req.method },
                    { key: "ip", message: req.socket.remoteAddress }
                ]
            )
        }

        const route = routes.find(({ method, path }) => req.method == method && req.url == path);

        if (!route){
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                code: 404,
                message: "Can't find this route, are you sure this is the right url?",
                wanted_path: req.url
            }));
        } else {

            const url_params = Api.get_url_params(req.url, route.path);

            if ((url_params instanceof ServiceError) && !route.strict_route_params_check) {
                res.writeHead(url_params.code, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    code: 404,
                    message: url_params.message,
                    wanted_path: req.url
                }));
            } else {
                route.gateway(req, res)
            }
        }
    }

    static get_url_params(url: string, wanted: string): Map<string, string> | ServiceError {
        const reg = /[^A-Za-z0-9:\u0600-\u06ff]/g;

        let split_url: string[] = url.split(reg);
        let temp: Map<string, string> = new Map();
        wanted.split(reg).forEach((u, index) => {
            if (u.startsWith(":")){
                let given = split_url[index]
                if (!given) return new ServiceError("Bad url", ServiceErrorCodes.BAD_URL, 400)

                temp.set(u.replace(/^:/, ""), given)
            }
        })

        return temp;
    }

    run(){
        this.server.listen(this.config.port, this.config.hostname, () => {
            info(
                "Api",
                "Server is running",
                [
                    { key: "hostname", message: this.config.hostname},
                    { key: "port", message: String(this.config.port) }
                ]
            )
        })
    }
}

export default Api;