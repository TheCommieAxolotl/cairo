import * as argv from "./argv";

import paths from "./paths.txt" assert { type: "txt" };

let CANCEL = false;

const log = async (response: Response, subpath: string) => {
    const color = `\u001b[${
        response.status >= 200 && response.status < 300
            ? "32m"
            : response.status >= 300 && response.status < 400
            ? "33m"
            : response.status >= 400 && response.status < 500
            ? "31m"
            : response.status >= 500
            ? "35m"
            : "0m"
    }`;

    const reset = "\u001b[0m";

    const status = response.redirected ? "redirected" : response.status.toString();
    const contentLength = (response.headers.get("content-length") || "0").toString();
    const contentType = (response.headers.get("content-type") || "none").split(";")[0];

    let title = "none";

    const doc = new HTMLRewriter();

    doc.on("title", {
        text(text) {
            if (text.text) title = text.text;
        },
    });

    if (contentType === "text/html") doc.transform(response);

    console.log(
        "| " +
            color +
            subpath.padEnd(21) +
            reset +
            " | " +
            color +
            status.padEnd(10) +
            reset +
            " | " +
            color +
            contentLength.padEnd(10) +
            reset +
            " | " +
            color +
            contentType.padEnd(18) +
            reset +
            " | " +
            color +
            title.padEnd(28) +
            reset +
            "|"
    );
};

process.on("SIGINT", () => {
    CANCEL = true;
});

if (argv.length < 1) {
    console.log("Usage: cairo -p [port] -u [url] [options]");

    process.exit(1);
}

let target: URL | undefined;
let hasWildcard = false;

if (argv.url) {
    target = new URL(argv.url);
} else {
    if (argv.port) {
        target = new URL("http://localhost:" + argv.port);
    }
}

if (!target) {
    console.log("No target specified. Please specify a target using the -u or --url option.");

    process.exit(1);
}

if (target.href.includes("*")) {
    hasWildcard = true;
}

console.log();
console.log(`${target.href} - Using ${"default"} wordlist (${argv.numerical ? "100" : paths.split("\n").length} paths)`);
console.log();
console.log("|-----------------------|------------|------------|--------------------|-----------------------------|");
console.log("| Path                  | Status     | Length     | Content Type       | Document Title              |");
console.log("|-----------------------|------------|------------|--------------------|-----------------------------|");

const requests = [];
const found = [];

if (argv.numerical) {
    for (let i = 0; i < 100; i++) {
        if (CANCEL) {
            break;
        }

        let url = new URL(target.href);

        if (hasWildcard) {
            url.href = url.href.replace("*", i.toString());
        } else {
            if (!url.href.endsWith("/")) {
                url.href += "/";
            }

            url.href += i.toString();
        }

        const response = await fetch(url.href, {});

        requests.push({ url, response });

        if (!(response.status >= 400)) {
            found.push({ url, response });
        }

        log(response, url.pathname);
    }
} else {
    for (const subpath of paths.split("\n")) {
        if (CANCEL) {
            break;
        }

        let url = new URL(target.href);

        if (hasWildcard) {
            url.href = url.href.replace("*", subpath);
        } else {
            if (!url.href.endsWith("/")) {
                url.href += "/";
            }

            url.href += subpath;
        }

        let response: Response;

        try {
            response = await fetch(url.href);
        } catch (e) {
            CANCEL = true;

            setTimeout(() => {
                console.log("");
                console.log("\u001b[31m" + "An error occurred while sending a request to " + url.href + ": " + e + "\u001b[0m");
            }, 10);

            break;
        }

        requests.push({ url, response });

        if (!(response.status >= 400)) {
            found.push({ url, response });
        } else {
            continue;
        }

        log(response, url.pathname);
    }
}
const elapsed = performance.now();

if (found.length) console.log("|----------------------------------------------------------------------------------------------------|");
console.log(`| ${requests.length} requests sent in ${elapsed < 1000 ? elapsed.toFixed(2) + "ms" : (elapsed / 1000).toFixed(2) + "s"}. Found ${found.length} unique responses.`.padEnd(100) + " |");
console.log("|----------------------------------------------------------------------------------------------------|");
