/**
 * Created by JounQin on 16/4/29.
 */
module.exports = {
    Compress: {
        match: /css|js|html/ig
    },
    Expires: {
        fileMatch: /^(gif|png|jpg|js|css|html)$/ig,
        maxAge: 60 * 60 * 24 * 365
    },
    MimeTypes: {
        "css": "text/css",
        "gif": "image/gif",
        "html": "text/html",
        "ico": "image/x-icon",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "js": "text/javascript",
        "json": "application/json",
        "pdf": "application/pdf",
        "png": "image/png",
        "svg": "image/svg+xml",
        "swf": "application/x-shockwave-flash",
        "tiff": "image/tiff",
        "txt": "text/plain",
        "wav": "audio/x-wav",
        "wma": "audio/x-ms-wma",
        "wmv": "video/x-ms-wmv",
        "xml": "text/xml"
    },
    Welcome: {
        file: "index.html"
    }
};