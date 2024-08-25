const fs = require('fs');
const main_view = fs.readFileSync('./main.html', 'utf-8');
const orderlist_view = fs.readFileSync('./orderlist.html','utf-8');

const mariadb = require('./database/connect/mariadb');

function main(response) {
    console.log('main');

    mariadb.query('SELECT * FROM product', function(err, rows) {
        console.log(rows);
    });
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(main_view);
    response.end();
}

function favicon(response) {
    // 여기에 favicon 처리 코드를 추가할 수 있습니다.
}

function redRacket(response) {
    fs.readFile('./img/redRacket.png', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
        } else {
            response.writeHead(200, { 'Content-Type': 'image/png' });
            response.write(data);
            response.end();
        }
    });
}

// 새로운 blueRacket 함수 추가
function blueRacket(response) {
    fs.readFile('./img/blueRacket.png', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
        } else {
            response.writeHead(200, { 'Content-Type': 'image/png' });
            response.write(data);
            response.end();
        }
    });
}

// 새로운 blackRacket 함수 추
//가
function blackRacket(response) {
    fs.readFile('./img/blackRacket.png', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
        } else {
            response.writeHead(200, { 'Content-Type': 'image/png' });
            response.write(data);
            response.end();
        }
    });
}
function order(response, productId) {
    response.writeHead(200, { 'Content-Type': 'text/html' });

    // 현재 날짜를 'YYYY-MM-DD' 형식으로 변환
    const orderDate = new Date().toISOString().split('T')[0];

    // 쿼리 실행: product_id와 order_date를 orderlist에 삽입
    mariadb.query(
        "INSERT INTO orderlist (product_id, order_date) VALUES (?, ?)",
        [productId, orderDate],
        function (err, rows) {
            if (err) {
                console.error("Error inserting into orderlist: ", err);
                response.write('Error occurred while placing order.');
            } else {
                console.log('Order placed successfully:', rows);
                response.write('Order placed successfully.');
            }
            response.end();
        }
    );
}

function orderlist(response){
    console.log('orderlist');
    response.writeHead(200, {'Content-Type': 'text/html'});
    
    // 데이터베이스에서 orderlist 조회
    mariadb.query('SELECT * FROM orderlist', function(err, rows) {
        if (err) {
            console.error("Error fetching orderlist: ", err);
            response.write('Error fetching order list.');
            response.end();
        } else {
            response.write(orderlist_view); // 기본 HTML 출력

            // 테이블 시작 태그
            response.write('<table border="1"><tr><th>Product ID</th><th>Order Date</th></tr>');

            // 테이블 행 추가
            rows.forEach(element => {
                response.write("<tr>"
                    + "<td>" + element.product_id + "</td>"
                    + "<td>" + element.order_date + "</td>"
                    + "</tr>"
                );
            });

            // 테이블 닫기 태그
            response.write("</table>");
            response.end();
        }
    });
}


let handle = {};

// 경로와 처리 함수의 매핑
handle['/'] = main;
handle['/order'] = order;
handle['/orderlist'] = orderlist;
//이미지 디렉터리
handle['/img/redRacket.png'] = redRacket;
handle['/img/blueRacket.png'] = blueRacket;  // blueRacket 함수 정의 후 오류 수정됨
handle['/img/blackRacket.png'] = blackRacket; // blackRacket 함수 정의 후 오류 수정됨
handle['/favicon.ico'] = favicon;

exports.handle = handle;
