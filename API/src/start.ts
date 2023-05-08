import Api from "./api"

// We initialise the api
let api = new Api({
    port: 5500,
    hostname: "0.0.0.0"
});

// we run it
api.run();