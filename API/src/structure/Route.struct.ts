import {IncomingMessage, ServerResponse} from "http";

type RequestMethod = "POST" | "PUSH" | "DELETE" | "GET";

class Route {
    public path: string;
    public method: RequestMethod;

    public strict_route_params_check: boolean

    constructor(path: string, method: RequestMethod) {
        this.path = path;
        this.method = method;

        this.strict_route_params_check = false;
    }

    gateway(req: IncomingMessage, res: ServerResponse){
        res.writeHead(500, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(
            {
                code: 500,
                message: "This route isn't implemented yet"
            }
        ))
    }
}

export { Route, RequestMethod }