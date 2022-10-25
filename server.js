const express = require("express");
const multer = require("multer");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
//const PORT = 3000;
app.use(multer().none());

//注文一覧の情報格納用の配列
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

//サーバのルートディレクトリに格納されているindex.html(TOP画面)を表示される
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// http://FQDN/api/v1/orderList にアクセスしてきたときにオーダ一覧のリストを返す
app.get("/api/v1/orderList", (req, res) => {
  console.log("app_get_orderList");
  res.json(orderList);
});


io.on("connection", (socket) => {
  console.log("client connection!!!");
  //サーバが受け取った注文情報を全員確認できるようにする。クライアントに情報を返却する処理。
  socket.on("orderMenuList", (msg) => {
    //注文情報の文字列データを','で分割し配列化（EX：卓番,商品名,個数,備考,オーダ時刻→[ '卓番', '商品名', '数量', '備考', '注文時刻' ]）
    var oderInfo = msg.split(',');
    var id = uuid();
    const oderItem = {
      id,                     //uuid:一意の識別ID
      table: oderInfo[0],     //卓番
      menu: oderInfo[1],      //商品名
      quantity: oderInfo[2],  //数量
      remarks: oderInfo[3],   //備考
      time: oderInfo[4]       //注文時刻
    }
    //注文一覧情報の格納用配列にPUSHする
    orderList.push(oderItem);
    //全てのクライアントにブロードキャスト
    io.emit("orderMenuList", oderItem);
  });
});

//サーバ起動時の初回読込処理
server.listen(process.env.PORT || 3000, () => {
  console.log("listening on heroku port or 3000");
});