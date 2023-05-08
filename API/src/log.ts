const ENDL: string = "\x1b[0m\r\n";

type LogsDetails = string | Array<string | { key: string, message: string }> | null | undefined;

/**
 * This function send a formatted message as an info message
 * @param source {string} The source of the message
 * @param message {string} the message transmitted
 * @param details {LogsDetails} the details for this, if any
 *
 * @example
 * info("Sedorriku", "Hello everyone!")
 * info("Sedorriku", "Hello everyone!", "How are you ?")
 * info("ChatGPT", "Hello!", ["How can I help you", "*of course this code is not ai-made*"])
 */
function info(source: string, message: string, details: LogsDetails = []){
    process.stdout.write(`\x1b[34m[INFO]\x1b[0m \x1b[36m${source}\x1b[0m - ${message}\x1b[0m${ENDL}`);
    send_details(details);
}

function warn(source: string, warning: string, stacktrace: Array<string> = [], details: LogsDetails = []){
    process.stdout.write(`\x1b[33m[WARN]\x1b[0m \x1b[36m${source}\x1b[0m - \x1b[33m${warning}\x1b[0m${ENDL}`);
    // we send stacktrace as if it was details
    if (stacktrace.length > 0){
        process.stdout.write(`  \x1b[33mStacktrace:\x1b[0m${ENDL}`);
        send_details(stacktrace.map((st, index) => `(${index}) ${st}`), "    ")
    }

    // finally, we send details
    if (details && (details instanceof Array ? details.length > 0 : true)){ process.stdout.write(`  \x1b[33mDetails:\x1b[0m${ENDL}`); }
    send_details(details, "    ");
}

function error(source: string, error: string, stacktrace: Array<string> = [], details: LogsDetails = []){
    process.stdout.write(`\x1b[31m[ERROR]\x1b[0m \x1b[34m${source}\x1b[0m - \x1b[31m${error}\x1b[0m${ENDL}`);
    // we send stacktrace as if it was details
    if (stacktrace.length > 0){
        process.stdout.write(`  \x1b[31mStacktrace:\x1b[0m${ENDL}`);
        send_details(stacktrace.map((st, index) => `(${index}) ${st}`), "    ")
    }

    // finally, we send details
    if (details && (details instanceof Array ? details.length > 0 : true)){ process.stdout.write(`  \x1b[31mDetails:\x1b[0m${ENDL}`); }
    send_details(details, "    ");
}

function send_details(details: LogsDetails, before = "  "){
    function send(t: string | { key: string, message: string }){
        if (typeof t == "string"){
            process.stdout.write(`${before}| \x1b[2m${t}\x1b[0m${ENDL}`)
        } else {
            process.stdout.write(`${before}| \x1b[34m${t.key}\x1b[0m: \x1b[2m${t.message}\x1b[0m${ENDL}`)
        }
    }

    // if `details` is an array, we send each detail
    // else, we send directly :)
    if (details instanceof Array){
        details.forEach((dtl) => send(dtl));
    } else if (typeof details == "string") {
        send(details)
    }
}

export { info, warn, error }