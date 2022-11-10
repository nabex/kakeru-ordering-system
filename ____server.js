
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
//const multer = require('multer'); // multerモジュールを読み込む
const PORT = 3000;
const orderList = [];

//UUID生成関数
function uuid() {
    var uuid = "", i, random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += "-"
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
}

app.use(bodyParser.json());


//TOP表示処理
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

//注文一覧取得処理
app.get("/api/v1/orderList", (req, res) => {
    const orderList = [
        { id: "11111", menu: 'TEST0000'},
        { id: "11112", menu: 'TEST1000'},
        { id: "11113", menu: 'TEST2000'}
    ];
    res.json(orderList);
});

//商品一覧取得処理
app.get("/api/v1/menuList", (req, res) => {
    res.send("menuList");
})


app.post('/test', (req, res) => {
    console.log(req.item);
    res.status(200).json({
      message: 'Hello!'
    });
});

//注文追加処理
app.post("/api/v1/addOrderItem", (req, res) => {
    const itemData = req.item;
    const id = uuid();
    const orderItem = {
        id,
        menu: itemData.menu
    }
    orderList.push(orderItem);
    console.log("Add: " + JSON.stringify(orderItem));
    res.json(orderItem);
});

io.on("connection", (socket) => {
    console.log("client connection");
});

server.listen(PORT, () => {
    console.log("listening on PORT");
});