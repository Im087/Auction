"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var ws_1 = require("ws");
var app = express();
// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     if(req.method=="OPTIONS") res.send(200);
//     else  next();
// });
var products = [
    {
        id: 1,
        title: "item 1",
        price: 1.99,
        rating: 2,
        desc: "This is item 1",
        category: ['A']
    },
    {
        id: 2,
        title: "item 2",
        price: 4.99,
        rating: 3,
        desc: "This is item 2",
        category: ["B"]
    },
    {
        id: 3,
        title: "item 3",
        price: 10.99,
        rating: 4,
        desc: "This is item 3",
        category: ['A', "B"]
    },
    {
        id: 4,
        title: "item 4",
        price: 3.99,
        rating: 5,
        desc: "This is item 4",
        category: ['A', "B", 'C']
    },
    {
        id: 5,
        title: "item 5",
        price: 19.99,
        rating: 3,
        desc: "This is item 5",
        category: ['C']
    },
    {
        id: 6,
        title: "item 6",
        price: 9.99,
        rating: 3,
        desc: "This is item 6",
        category: ["B", 'C']
    }
];
var comments = [
    {
        id: 1,
        productId: 1,
        timeStamp: "2020-01-01 11:11:11",
        user: "Alex",
        rating: 3,
        content: "Not bad"
    },
    {
        id: 2,
        productId: 1,
        timeStamp: "2020-01-01 11:11:11",
        user: "Ana",
        rating: 4,
        content: "Nice"
    },
    {
        id: 3,
        productId: 1,
        timeStamp: "2020-01-01 11:11:11",
        user: "Andres",
        rating: 5,
        content: "Very good"
    },
    {
        id: 4,
        productId: 2,
        timeStamp: "2020-01-01 11:11:11",
        user: "Adriana",
        rating: 1,
        content: "Trash"
    }
];
app.use('/', express.static(path.join(__dirname, '..', 'client')));
app.get('/api/products', function (req, res) {
    var params = req.query;
    var result = products;
    if (Object.keys(params).length != 0) {
        result = products.filter(function (p) { return p.title.includes(params.title || ''); })
            .filter(function (p) { return p.price <= Number(params.price || Infinity); })
            .filter(function (p) { return params.category == '-1' ? true : p.category.includes(params.category); });
    }
    res.json(result);
});
app.get('/api/product/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/product/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log("Server run on http://localhost:8000");
});
var wsServer = new ws_1.Server({ port: 8085 });
var subscription = new Map();
var currentBids = new Map();
wsServer.on("connection", function (websocket) {
    websocket.on('message', function (message) {
        var messageObj = JSON.parse(message);
        var productIds = subscription.get(websocket) || [];
        subscription.set(websocket, __spreadArray(__spreadArray([], productIds), [messageObj.productId]));
    });
});
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 10;
        currentBids.set(p.id, newBid);
    });
    subscription.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (id) { return ({
                productId: id,
                bid: currentBids.get(id)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscription.delete(ws);
        }
    });
}, 2000);
