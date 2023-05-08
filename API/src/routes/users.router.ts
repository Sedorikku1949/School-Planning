import { RequestMethod, Route } from "../structure/Route.struct";

class GetUser extends Route {
    constructor() {
        super("/user", "GET");


        this.strict_route_params_check = false;
    }
}

export default (new GetUser());