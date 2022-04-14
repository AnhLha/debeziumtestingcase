const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// const webpack = require('webpack');
// const devMiddleware = require('webpack-dev-middleware');
// const  hotMiddleware = require('webpack-hot-middleware');
// const config = require('../webpack.config');
// const compiler = webpack(config);

//Enable "webpack-dev-middleware"
// app.use(webpackDevMiddleware(compiler, {
//   publicPath: config.output.publicPath,
//   stats: {
//       chunks: false,
//       hash: false,
//       modules: false,
//       version: false,
//       assets: false,
//       entrypoints: false,
//       builtAt: false,
//   }
// }));

// app.use(webpackHotMiddleware(compiler));

// app.use(express.static('./dist'));

const connectionLocal = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'root',
    database: 'debeziumdb'
  });

const connectionRemote = mysql.createConnection({
    host: '18.132.196.73',
    user: 'kelvin.vuminh',
    password:'abc13579',
    database: 'debeziumdb'
  });

const queryLocal = function (sql) {
    connectionLocal.query(
        sql,
        function (err, results, fields) {
            console.log("sql Local", sql); //
            console.log("result Local", results); // results contains rows returned by server
            console.log("result Local", fields); // fields contains extra meta data about results, if available
        }
    );
}

const queryRemote = function (sql) {
    connectionRemote.query(
        sql,
        function (err, results, fields) {
            console.log("sql Remote", sql); //
            console.log("result Remote", results); // results contains rows returned by server
            console.log("result Remote", fields); // fields contains extra meta data about results, if available
        }
    );
}

app.get('/', function (req, res) {
    res.sendFile('index.html', {
        root: __dirname
    })
});

app.get('/queryLocal', function (req, res) {
    console.log("param", req.query.query);
    try {
        queryLocal(req.query.query);
    } catch (e) {
        res.send({
            "message": "some error"+e.toString()
        });
    }
    res.send({
        "message": "success"
    });
});

app.get('/queryRemote', function (req, res) {
    console.log("param", req.query.query);
    try {
        queryRemote(req.query.query);
    } catch (e) {
        res.send({
            "message": "some error"+e.toString()
        });
    }
    res.send({
        "message": "success"
    });
});

app.listen(3000, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})