//******************************************************************************//
//****                   HTML読込後に実行処理する関数一覧                        ****//
//******************************************************************************//
$(document).ready(function () {
    table();                        //テーブル表示関数
    getMenuList();                  //商品一覧取得関数
    fetchOrderList();               //リロード時配列から注文一覧取得関数
    getOrderMenuList();             //注文追加・キッチン連携関数
    startCustomize();               //商品一覧変更シート遷移関数
    setInterval(showtime, 1000);    //時刻リアルタイム表示関数
    //renderOrderList();            //(グローバル指定)リロード時注文一覧表示関数
    //deleteOrderMenuItem();        //(グローバル指定)注文一覧削除関数
    //deleteButtonListener();       //(グローバル指定)配列操作:DELETE API呼出し関数_注文処理完了時
    //editOrderMenuItemQuantity();  //(グローバル指定)配列操作:PUT API呼出し関数_数量変更時
});
//******************************************************************************//
//****       startCustomize:商品一覧変更用のシートを遷移させる処理　　　　　　       ****//
//******************************************************************************//
function startCustomize() {
    $("#startCustomize").on("click", function () {
        const url = 'https://docs.google.com/spreadsheets/d/1GWbxTcwg0jFoESiucSXHrzzgu0fVtpS_Ir3fFi30Ndo/edit#gid=1330995100';
        window.open(url, "_blunk");
    });
};
//******************************************************************************//
//****   quantityCountDownListener:注文情報の数量に変更あったときに配列修正する処理 ****//
//******************************************************************************//
function CountDownListener(id, quantity) {
    const body = new FormData();
    console.log(quantity);
    body.append("quantity", quantity.toString());
    fetch(`./api/v1/orderItem/${id}`, { method: 'PUT', body })
        .then(() => fetchOrderList());
}
//******************************************************************************//
//****      deleteButtonListener:注文の提供完了した際に配列から削除する処理        ****//
//******************************************************************************//
function deleteButtonListener(id) {
    // DELETEメソッドでAPIにアクセス
    // 削除後にリスト更新
    fetch(`./api/v1/orderItem/${id}`, { method: 'DELETE' })
        .then(() => fetchOrderList());
}
//******************************************************************************//
//****　renderOrderList:　注文情報が格納された配列情報に基づきキッチン画面に表示する処理****//
//******************************************************************************//
function renderOrderList(orderList) {
    $("#orderMenuList").empty();;
    for (const msg of orderList) {
        console.log(msg);
        $("#orderMenuList").append(
            '<div class="col" id="' + msg.id + '">' +
            '<div class="list-group-item list-group-item-action shadow-sm p-2 mb-3 bg-body rounded" aria-current="true">' +
            '<div class="d-flex w-100 justify-content-between">' +
            '<h6 class="mb-1 fw-bold"><span class="badge bg-secondary fs-8">TABLE #0' + msg.table + '</span>&emsp;' + msg.menu + '</h6>' +
            '<small class="text-muted">' + msg.time + '</small>' +
            '</div>' +
            '<small id="time" class="text-muted" data-livestamp="' + msg.unixtime + '"></small>' +
            '<div class="input-group mt-2 mb-2">' +
            '<div class="input-group-text bg-secondary text-white border border-2 border-secondary" id="btnGroupAddon">数量</div>' +
            '<button id="" type="button" class="btn btn-outline-danger fs-6" id="editOrderMenuItemQuantity" value="' + msg.id + '" onclick="window.editOrderMenuItemQuantity(this.value,' + msg.quantity + ');">-0.5</button>' +
            '<input id="" type="number" min="0" max="' + msg.quantity + '" step="0.5" class="form-control fw-bold fs-4" placeholder="" aria-label="" aria-describedby="btnGroupAddon" value="' + msg.quantity + '" disabled>' +
            '<button type="button" class="btn btn-outline-primary" id="deleteOrderMenuItem" value="' + msg.id + '" onclick="window.deleteOrderMenuItem(this.value);">DONE</button>' +
            '</div>' +
            '<small>備考：<span class="text-danger fw-bold">' + msg.remarks + '<span></small>' +
            '</div>' +
            '</div>'
        );
    }
}
//******************************************************************************//
//****　fetchOrderList:　配列い格納された注文情報をGET APIで呼び出す処理　　　　　　　****//
//******************************************************************************//
async function fetchOrderList() {
    // APIからJSONを取得する
    return fetch('./api/v1/orderList')
        .then((response) => response.json())
        .then((orderList) => {
            renderOrderList(orderList)
        })
}
//******************************************************************************//
//****            showtime:リアルタイム時刻表示する処理（キッチン画面）            ****//
//******************************************************************************//
function showtime() {
    var today = new Date();
    $weekday = ['日', '月', '火', '水', '木', '金', '土'];
    month = today.getMonth() + 1;
    $('#showtime').html(month + "月" + today.getDate() + "日（" + $weekday[today.getDay()] + "） " + today.getHours() + ":" + ('0' + today.getMinutes()).slice(-2) + ":" + ('0' + today.getSeconds()).slice(-2));
}
//******************************************************************************//
//****                   table:テーブル一覧を表示する処理                       ****//
//******************************************************************************//
function table() {
    for (let i = 1; i <= 6; i++) {
        $("#table").append(
            '<div class="col">' +
            '<div class="card shadow-sm">' +
            '<svg class="bd-placeholder-img card-img-top fs-1" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">0' + i + '</text></svg>' +
            '<div class="card-body">' +
            '<p class="card-text">TABLE #0' + i + '</p>' +
            '<div class="d-flex justify-content-between align-items-center">' +
            '<div class="btn-group">' +
            '<button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="showOderListBtn' + i + '" data-id="' + i + '">注文追加</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );
        //テーブルナンバーを取得し、モーダルのトップタイトルに数字を反映
        $("#showOderListBtn" + i).on("click", function () {
            var num = $(this).data('id');
            $("#tableNumber").text(num);
        });
    }
}
//******************************************************************************//
//****                getMenuList：商品一覧情報取得処理                         ****//
//******************************************************************************//
function getMenuList() {
    //yakiniku_base_kakeru_getMenuData APIのURLを登録し、for文でメニュー一覧を生成するメソッド
    let getMenuListUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=EZXmzoBafbyPS-6Ixc6DRwqb_15rw39a2WZB21vm3zureTeQMeKPliUW6nZQnHWqtyBBqrs4W9rtwnmrs32ZaaWxuiIjU9K0m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnKRx4GluyHKPsrb7MZoYGSx9aLlJMtuH1A999yVfFgGKCzQSEfljAkUMW9-RxnHaRcTvy1m0tLyP&lib=McBVuQVLovZoHBxBRGy3jZPlRnzlbkUi4";
    $.getJSON(getMenuListUrl, function (data) {
        for (let i in data) {
            //DBは100行を最大にしており、メニュー登録ない配列も取得するAPIの仕様になっているため、
            //配列内に文字列が存在するもののみhtml描写する。※つまりは、文字列なかったらスルー処理。
            if (data[i].item != '') {
                $("#menulist").append(
                    '<li class="list-group-item">' +
                    '<div class="row">' +
                    '<div class="col-md-6">' +
                    //商品名表示
                    '<input class="form-check-input me-1" type="checkbox" name="menu" id="name' + i + '" value="' + data[i].item + '" aria-label="">' + data[i].item +
                    '</div>' +
                    '<div class="col-md-2 input-group-sm btn-group">' +
                    //個数入力欄
                    '<input type="number" min="0" max="99" step="0.5" class="form-control" name="menu_" id="quantity' + i + '" placeholder="個数">' +
                    //'<button type="button" class="btn btn-plus btn-increment btn-primary" id="addQuantity' + i + '">+1</button>' +
                    '</div>' +
                    '<div class="col-md-4 input-group-sm">' +
                    //備考入力欄
                    '<input type="test" class="form-control" name="menu_" id="remarks' + i + '" placeholder="備考">' +
                    '</div>' +
                    '</div>' +
                    '</li>'
                );
            }
        }//for文終了
        //注文確定ボタン押下時にチェック入っているメニューの一覧取得し、キッチンメニューに一覧表示。サーバに注文情報を送信。
        $(function () {
            $('#sendOrderList').click(function () {
                var unixtime = Math.round((new Date()).getTime() / 1000);

                var toDoubleDigits = function (num) {
                    num += "";
                    if (num.length === 1) {
                        num = "0" + num;
                    }
                    return num;
                };
                var now = new Date();                                 //時間を取得する関数の呼び出し
                var time = (toDoubleDigits(now.getHours()) + ':' + toDoubleDigits(now.getMinutes())); //時刻表示のフォーマット作成し変数に代入
                var sendOrderFlg = "";                                //個数の記載が漏れていないかチェックする変数
                for (let i in data) {                                 //SpreadSheetから全行呼び出し
                    if (data[i].item != '') {                         //空欄は読み取らない
                        if ($("#name" + i).prop("checked")) {         //チェックが入っている場合
                            if ($("#quantity" + i).val() == '') {
                                sendOrderFlg = "NG";                   //個数の記載に漏れ有り。case "NG"へ
                            } else {
                                sendOrderFlg = "OK";                   //個数の記載に漏れ無し。case "OK"へ
                            }
                        } else if ($("#quantity" + i).val() != '') {
                            sendOrderFlg = "NG";                       //個数の記載あるがチェック漏れ。case "NG"へ
                        } else if ($("#remarks" + i).val() != '') {
                            sendOrderFlg = "NG";                       //備考の記載あるが個数又はチェック漏れ。case "NG"へ
                        }
                    }
                }
                switch (sendOrderFlg) {
                    case "OK":
                        for (let i in data) {
                            if (data[i].item != '') {
                                if ($("#name" + i).prop("checked")) {             //チェックが入っている場合
                                    var tablenumber = $("#tableNumber").text();   //テーブルナンバーを変数に代入
                                    var name = $("#name" + i).val();              //商品名を変数に代入
                                    var quantity = $("#quantity" + i).val();      //個数を変数に代入
                                    var remarks = $("#remarks" + i).val();        //備考を変数に代入
                                    let socket = io();

                                    //上記の変数を結合。//server.jsに一覧情報を送信し、クライアントにブロードキャスト。
                                    socket.emit("orderMenuList", tablenumber + ',' + name + ',' + quantity + ',' + remarks + ',' + time + ',' + unixtime);
                                    //処理完了後、全てのINPUTボックスの値をリセットする
                                    $("#name" + i).removeAttr("checked").prop("checked", false).change(); //チェックボックスのリセット
                                    $("#quantity" + i).val('');                                           //入力した数量のリセット
                                    $("#remarks" + i).val('');                                            //入力した備考のリセット
                                }
                            }
                        }
                        break;
                    //個数の記載に漏れがあった場合のケース
                    case "NG":
                        alert("個数の記載又はチェックが漏れてます。見直してください");
                        for (let i in data) {
                            if (data[i].item != '') {
                                //処理完了後、全てのINPUTボックスの値をリセットする
                                $("#name" + i).removeAttr("checked").prop("checked", false).change(); //チェックボックスのリセット
                                $("#quantity" + i).val('');                                           //入力した数量のリセット
                                $("#remarks" + i).val('');                                            //入力した備考のリセット
                            }
                        }
                        break;
                }
            });
            //Closeを押下した時、入力欄をリセット
            $("#postOrderAppScreenClose").click(function () {
                for (let i in data) {                                 //SpreadSheetから全行呼び出し
                    if (data[i].item != '') {                         //空欄は読み取らない
                        //全てのINPUTボックスの値をリセットする
                        $("#name" + i).removeAttr("checked").prop("checked", false).change(); //チェックボックスのリセット
                        $("#quantity" + i).val('');                                           //入力した数量のリセット
                        $("#remarks" + i).val('');                                            //入力した備考のリセット
                    }
                }
            });
        });
    });
}
//******************************************************************************//
//****        getOrderMenuList:注文一覧の取得・表示(リアルタイム)                ****//
//******************************************************************************//
function getOrderMenuList() {
    let socket = io();
    socket.on("orderMenuList", function (msg) {
        console.log(msg);
        $("#orderMenuList").append(
            '<div class="col" id="' + msg.id + '">' +
            '<div class="list-group-item list-group-item-action shadow-sm p-2 mb-3 bg-body rounded" aria-current="true">' +
            '<div class="d-flex w-100 justify-content-between">' +
            '<h6 class="mb-1 fw-bold"><span class="badge bg-secondary fs-8">TABLE #0' + msg.table + '</span>&emsp;' + msg.menu + '</h6>' +
            '<small class="text-muted">' + msg.time + '</small>' +
            '</div>' +
            '<small id="time" class="text-muted" data-livestamp="' + msg.unixtime + '"></small>' +
            '<div class="input-group mt-2 mb-2">' +
            '<div class="input-group-text bg-secondary text-white border border-2 border-secondary" id="btnGroupAddon">数量</div>' +
            '<button id="" type="button" class="btn btn-outline-danger fs-6" id="editOrderMenuItemQuantity" value="' + msg.id + '" onclick="window.editOrderMenuItemQuantity(this.value,' + msg.quantity + ');">-0.5</button>' +
            '<input id="" type="number" min="0" max="' + msg.quantity + '" step="0.5" class="form-control fw-bold fs-4" placeholder="" aria-label="" aria-describedby="btnGroupAddon" value="' + msg.quantity + '" disabled>' +
            '<button type="button" class="btn btn-outline-primary" id="deleteOrderMenuItem" value="' + msg.id + '" onclick="window.deleteOrderMenuItem(this.value);">DONE</button>' +
            '</div>' +
            '<small>備考：<span class="text-danger fw-bold">' + msg.remarks + '<span></small>' +
            '</div>' +
            '</div>'
        );
        $("#playAudio").get(0).play();//音楽再生
    });
}
//******************************************************************************//
//****                 deleteOrderMenuItem:注文一覧の削除                     ****//
//******************************************************************************//
function deleteOrderMenuItem(id) {
    console.log("DELETE ID: " + id);
    $("#" + id).remove();
    deleteButtonListener(id);
};
//******************************************************************************//
//****                 deleteOrderMenuItem:注文一覧の削除                     ****//
//******************************************************************************//
function editOrderMenuItemQuantity(id, quantity) {
    console.log("EDIT ID: " + id + ',QUANTITY: ' + quantity);
    quantity = quantity - 0.5;
    if (quantity < 0) {
        alert("当該注文は全て対応済です。注文情報を一覧から削除します。");
        deleteButtonListener(id);
        //quantity = 0;
    } else {
        CountDownListener(id, quantity);
    }
}
