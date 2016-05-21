/**
 * Created by JounQin on 16/4/29.
 */
// 监听端口号
const PORT = 9090;

// NodeJs 内置工具
const fs = require('fs'),
    http = require('http'),
    path = require('path'),
    url = require("url"),
    zlib = require("zlib");

// 项目资源配置信息
const config = require("./config"),
    utils = require('./utils'),
    Compress = config.Compress,
    Expires = config.Expires,
    MimeTypes = config.MimeTypes,
    Welcome = config.Welcome;

// 常量
const CONTEXT = '/HashRev',
    TEXT_MIME = 'text/plain',
    ASSETS = 'dist';

const server = http.createServer(function (request, response) {
    'use strict';

    response.setHeader("Server", "Node/V8");

    const manifest = require('./build/rev-manifest.json');

    let pathname = url.parse(request.url).pathname;

    if (pathname.slice(-1) === "/") {
        pathname += Welcome.file;
    }

    let originalRelativePath = path.normalize(pathname.replace(new RegExp(`(^(${CONTEXT})?/)|(\\.{2,})`, 'g'), '')),
        relativePath = originalRelativePath.replace(/(build|dist)\//, ''),
        dir = RegExp.$1,
        ext = path.extname(relativePath);

    if (!ext) {
        response.writeHead(302, {
            Location: `${CONTEXT}/${relativePath}/`
        });
        return response.end();
    }
    
    let realPath = path.join(originalRelativePath === relativePath ? ASSETS : dir, manifest[relativePath] || relativePath);

    ext = ext.slice(1);

    let compressHandle = function (raw, statusCode, reasonPhrase) {
            let stream = raw;
            let acceptEncoding = request.headers['accept-encoding'] || "";
            let matched = ext.match(Compress.match);

            if (matched && acceptEncoding.match(/\bgzip\b/)) {
                response.setHeader("Content-Encoding", "gzip");
                stream = raw.pipe(zlib.createGzip());
            } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                response.setHeader("Content-Encoding", "deflate");
                stream = raw.pipe(zlib.createDeflate());
            }

            response.writeHead(statusCode, reasonPhrase);
            stream.pipe(response);
        },
        pathHandle = function (realPath) {
            fs.stat(realPath, function (err, stats) {
                if (err) {
                    response.writeHead(404, "Not Found", {'Content-Type': 'text/plain'});
                    response.write("This request URL " + pathname + " was not found on this server.");
                    return response.end();
                }

                // if (stats.isDirectory()) {
                //     realPath = path.join(realPath, "/", Welcome.file);
                //     return pathHandle(realPath);
                // }

                let contentType = MimeTypes[ext] || TEXT_MIME;
                response.setHeader("Content-Type", contentType);

                let lastModified = stats.mtime.toUTCString();
                let ifModifiedSince = "If-Modified-Since".toLowerCase();
                response.setHeader("Last-Modified", lastModified);

                if (ext.match(Expires.fileMatch) && Welcome.file !== path.basename(relativePath)) {
                    let expires = new Date();
                    expires.setTime(expires.getTime() + Expires.maxAge * 1000);
                    response.setHeader("Expires", expires.toUTCString());
                    response.setHeader("Cache-Control", "max-age=" + Expires.maxAge);
                }

                if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
                    response.writeHead(304, "Not Modified");
                    return response.end();
                }

                let range = request.headers["range"];

                if (!range) {
                    return compressHandle(fs.createReadStream(realPath), 200, "Ok");
                }

                range = utils.parseRange(range, stats.size);

                if (!range) {
                    response.removeHeader("Content-Length");
                    response.writeHead(416, "Request Range Not Satisfiable");
                    return response.end();
                }

                response.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stats.size);
                response.setHeader("Content-Length", (range.end - range.start + 1));
                compressHandle(fs.createReadStream(realPath, {
                    "start": range.start,
                    "end": range.end
                }), 206, "Partial Content");
            });
        };

    pathHandle(realPath);
});


server.listen(PORT);

console.log("Server runing at port: " + PORT + ".");