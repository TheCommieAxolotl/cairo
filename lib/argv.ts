export const args = Bun.argv.slice(2);
export const length = args.length;

export const url = args.find((arg, i) => args[i - 1] === "-u" || args[i - 1] === "--url" || arg.startsWith("http://") || arg.startsWith("https://"));
export const port = parseInt(args.find((arg, i) => args[i - 1] === "-p" || (args[i - 1] === "--port" && !isNaN(parseInt(arg)))) || "");
export const numerical = args.includes("-n") || args.includes("--numerical");

if (args.includes("-h") || args.includes("--help") || !url) {
    console.log("Usage: cairo -p [port] -u [url] [options]");
    console.log("");
    console.log("Options:");
    console.log("  -h, --help        Show this help message and exit");
    console.log("  -p, --port        Specify a port to use");
    console.log("  -u, --url         Specify a target URL");
    console.log("  -n, --numerical   Use numerical subpaths instead of common subpaths");
    console.log("");

    process.exit(1);
}
