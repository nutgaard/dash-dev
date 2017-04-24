function isFunction(functionToCheck) {
    const getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function toMountconfig(sanitizedPath, key, handler) {
    const [type, path] = key.split(/\s/);
    return {
        type,
        handler,
        path: (sanitizedPath + path).replace(/\/\/+/g, '/')
    };
}
function sanitizePath(path) {
    if (path.endsWith('/')) {
        return path;
    }
    return `${path}/`;
}

function mount(app, path, command) {
    const sanitizedPath = sanitizePath(path);

    if (isFunction(command)) {
        // Assume GET
        console.log('mounting', 'get', sanitizedPath);
        app.get(sanitizedPath, (request, response) => {
            command(request.params)
                .then((body) => response.send(body));
        });
    } else {
        // Assume object
        Object
            .keys(command)
            .map((key) => [key, command[key]])
            .map(([key, value]) => toMountconfig(sanitizedPath, key, value))
            .forEach((config) => {
                console.log('mounting', config.type, config.path);
                app[config.type](config.path, (request, response) => {
                    config.handler(request.params, request.body)
                        .then((body) => response.send(body));
                })
            });
    }
}

function asPromised(fn) {
    return new Promise((resolve, reject) => {
        fn((err, result) => {
            console.log('err', err);
            console.log('result', result);
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    mount,
    isFunction,
    asPromised
};
