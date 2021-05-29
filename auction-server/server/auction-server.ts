import * as express from 'express';
import * as path from 'path';
import { Server } from 'ws';
import { Product, Comment} from './data-format';

const app = express();

// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     if(req.method=="OPTIONS") res.send(200);
//     else  next();
// });

const products: Product[] = [
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

  const comments: Comment[] = [
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

app.get('/api/products', (req, res) => {

  let params = req.query;
  let result = products;

  if (Object.keys(params).length != 0) {
    result = products.filter(p => p.title.includes(params.title || ''))
    .filter(p => p.price <= Number(params.price || Infinity))
    .filter(p => params.category == '-1'? true: p.category.includes(params.category));
  }

  res.json(result);
});

app.get('/api/product/:id', (req, res) => {
  res.json(products.find(product => product.id == req.params.id));
});

app.get('/api/product/:id/comments', (req, res) => {
  res.json(comments.filter((comment: Comment) => comment.productId == req.params.id));
});

const server = app.listen(8000, "localhost", () => {
  console.log("yeah");
});

const wsServer = new Server({port: 8085});
const subscription = new Map<any, number[]>();
const currentBids = new Map<number, number>();

wsServer.on("connection", websocket => {
  websocket.on('message', message => {
    let messageObj = JSON.parse(message);
    let productIds = subscription.get(websocket) || [];
    subscription.set(websocket, [...productIds, messageObj.productId]);
  });
});

setInterval(() => {
  products.forEach(p => {
    let currentBid = currentBids.get(p.id) || p.price;
    let newBid = currentBid + Math.random() * 10;
    currentBids.set(p.id, newBid);
  });

  subscription.forEach((productIds: number[], ws) => {
    if (ws.readyState === 1) {
      let newBids = productIds.map(id => ({
        productId: id,
        bid: currentBids.get(id)
      }));
      ws.send(JSON.stringify(newBids));
    } else {
      subscription.delete(ws);
    }
  });
}, 2000);
