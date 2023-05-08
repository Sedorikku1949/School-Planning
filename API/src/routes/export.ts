import user from "./users.router"
import {IncomingMessage, ServerResponse} from "http";

interface RegisteredRoute {
    method: string,
    path: string,
    strict_route_params_check: boolean,
    gateway(req: IncomingMessage, res: ServerResponse)
}

const routes: Array<RegisteredRoute> = [
    user
]

export default routes