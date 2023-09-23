# cairo

A simple command line tool for enumerating HTTP requests.

```sh
$ cairo https://google.com

https://google.com/ - Using default wordlist (32 paths)

|-----------------------|------------|------------|--------------------|-----------------------------|
| Path                  | Status     | Length     | Content Type       | Document Title              |
|-----------------------|------------|------------|--------------------|-----------------------------|
| /                     | redirected | 0          | text/html          | none                        |
| /index.html           | redirected | 0          | text/html          | none                        |
| /blog                 | redirected | 0          | text/html          | none                        |
| /docs                 | redirected | 0          | text/html          | none                        |
| /images               | redirected | 0          | text/html          | Google Images               |
| /fonts                | redirected | 0          | text/html          | Browse Fonts - Google Fonts |
|----------------------------------------------------------------------------------------------------|
| 32 requests sent in 9.71s. Found 6 unique responses.                                               |
|----------------------------------------------------------------------------------------------------|

$ cairo -h

Usage: cairo -p [port] -u [url] [options]

Options:
  -h, --help        Show this help message and exit
  -p, --port        Specify a port to use
  -u, --url         Specify a target URL
  -n, --numerical   Use numerical subpaths instead of common paths
```