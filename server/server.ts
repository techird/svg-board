import * as path from "path";
import * as express from "express";
import * as webpack from "webpack";
import * as serveIndex from "serve-index";

export function serve(port: number) {
    port = process.env.PORT || 8081

    var app = express();

    if (process.env.NODE_ENV !== "production") {
        setupWebpackDevelopmentServer(app);
    }

    const staticPath = path.resolve(__dirname, "../static");
    app.use(express.static(staticPath));

    app.listen(port, function (err) {
        if (err) {
            console.error(JSON.stringify(err));
            return;
        }

        console.log(`\nDevelopment server served at http://localhost:${port}\n\n`);
    });

    return app;
}

function setupWebpackDevelopmentServer(app: express.Express) {
    var config = require('../webpack/webpack.config');
    var compiler = webpack(config);

    var devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        noInfo: true,
        stats: { colors: true },
        poll: true,
        quiet: false,
        reload: true
    });

    var hotMiddleware = require('webpack-hot-middleware')(compiler, { reload: true });

    app.use(devMiddleware);
    app.use(hotMiddleware);
}
