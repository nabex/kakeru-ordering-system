const express = require("express");
const multer = require("multer");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
path = require('path'),
app.use(multer().none());
const orderList = []; //注文一覧の情報格納用の配列
//******************************************************************************//
//****                uuid：UUID生成関数                                      ****//
//******************************************************************************//
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
//******************************************************************************//
//****                index.html TOP画面提供処理                              ****//
//******************************************************************************//
// 静的ファイルの場所を指定する(この配下で、CSS,JS,IMG,音声ファイルなどの静的ファイルが使用可能に)
app.use(express.static(path.join(__dirname, '/')));
//サーバのルートディレクトリに格納されているindex.html(TOP画面)を表示される
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//******************************************************************************//
//****                GET API orderList：注文一覧呼出しAPI                     ****//
//******************************************************************************//
app.get("/api/v1/orderList", (req, res) => {
  console.log("CALL API: app_get_orderList");
  res.json(orderList);
});
//******************************************************************************//
//****              DELETE API orderItem：注文情報削除API　　                  ****//
//******************************************************************************//
app.delete("/api/v1/orderItem/:id", (req, res) => {
  // URLの:idと同じIDを持つ項目を検索
  const index = orderList.findIndex((item) => item.id === req.params.id);
  // 項目が見つかった場合
  if(index >= 0){
    const deleted = orderList.splice(index, 1); // indexの位置にある項目を削除
    console.log('CALL DELETE API: ' + JSON.stringify(deleted[0]));
  }
  // ステータスコード200:OKを送信
  res.sendStatus(200);
})
//******************************************************************************//
//****              PUT API orderItem：注文数量変更API　　                     ****//
//******************************************************************************//
app.put("/api/v1/orderItem/:id", (req, res) => {
  const index = orderList.findIndex((item) => item.id === req.params.id);
  if(index >= 0){
    const item = orderList[index];
    if(req.body.quantity){
      console.log(req.body.quantity);
      item.quantity = req.body.quantity;
    }
    console.log('CALL EDIT API: ' + JSON.stringify(item));
  }
  // ステータスコード200:OKを送信
  res.sendStatus(200);
})
//******************************************************************************//
//****           socket.ioよるリアルタイム注文連携処理TOキッチン 　                ****//
//******************************************************************************//
io.on("connection", (socket) => {
  console.log("client connection!!!");
  //サーバが受け取った注文情報を全員確認できるようにする。クライアントに情報を返却する処理。
  socket.on("orderMenuList", (msg) => {
    //注文情報の文字列データを','で分割し配列化（EX：卓番,商品名,個数,備考,オーダ時刻→[ '卓番', '商品名', '数量', '備考', '注文時刻', '注文時間(UNIX)' ]）
    var orderInfo = msg.split(',');
    var id = uuid();
    const oderItem = {
      id,                     //uuid:一意の識別ID
      table: orderInfo[0],     //卓番
      menu: orderInfo[1],      //商品名
      quantity: orderInfo[2],  //数量
      remarks: orderInfo[3],   //備考
      time: orderInfo[4],      //注文時刻
      unixtime: orderInfo[5]  //注文時間(UNIX時間)
    }
    //注文一覧情報の格納用配列にPUSHする
    orderList.push(oderItem);
    console.log(orderList);
    //全てのクライアントにブロードキャスト
    io.emit("orderMenuList", oderItem);
  });
});
//******************************************************************************//
//****           サーバ起動時初回処理                         　                ****//
//******************************************************************************//
server.listen(process.env.PORT || 3000, () => {
  console.log("listening on HEROKU PORT or 3000");
});