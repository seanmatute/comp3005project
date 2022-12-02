--find user for login
select * from users where username='"+uname+"'

--register new user in db
insert into users values('${newuserid}','${r.fname}','${r.lname}','${r.uname}','${r.pword}','${r.add}','${r.city}','${r.pcode}',
    --if user did enter card info
    '${r.cname}','${r.cnum}','${r.cvv}','${r.badd}','${r.bcity}');
    --if user did not enter card info
    NULL,NULL,NULL,NULL,NULL);

--searching non-case sensitive
/*

    let s = "select isbn, title, author from book ";
    let q;
    let searchBy = req.body.searchBy;
    let query = req.body.search.toLowerCase();

    if(searchBy == "ALL"){
        s+=";";
    } else if (searchBy == "Title") {
        s+=`where lower(title) like '%${query}%';`;
    } else if (searchBy == "Author") {
        s+=`where lower(author) like '%${query}%';`;
    } else if (searchBy == "ISBN") {
        s+=`where isbn=${query};`;
    } else if (searchBy == "Genre") {
        s+=`where lower(genre) like '%${query}%';`;
    } else if (searchBy == "Publisher") {
        s+=`where lower(publisher) like '%${query}%';`;
    } else if (searchBy == "Max_Pages") {
        s+=`where numPages <= '${query}';`;
    } else if (searchBy == "Min_Price") {
        s+=`where price >= '${query}';`;
    }else if (searchBy == "Max_Price") {
        s+=`where price <= '${query}';`;
    }

*/

--viewing specific book
select * from book natural join writtenBy natural join author where writtenBy.aid=author.aid and isbn='${req.params.isbn}';

--viewing all authors alphabetically 
select * from author order by name;

--viewing specific authors books
select * from book natural join writtenBy natural join author where writtenBy.aid=author.aid and author.aid='${req.params.aid}';

--viewing all publishers alphabetically
select * from publisher order by pname;

--adding specific book to cart (POST request)
select * from book where isbn='${req.body.isbn}';

--purchasing books
insert into purchases values('${pid}','${item.isbn}','${ordernumber}');
update book set stock = stock -1 where isbn='${item.isbn}';
insert into orders values('${ordernumber}','${userInfo.username}','${req.body.address}','${amount}');
update book set stock = stock + 10 where stock<10;
select * from purchases natural join orders natural join book;

--view all orders
select * from purchases natural join orders natural join book;

--view specific order
select * from orders where ordernum='${req.params.num}';

--add book
insert into book values('${r.isbn}','${r.title}','${r.descrip}','${r.publisher}','${r.author}','${r.genre}','${r.price}','${r.pubPercent}','${r.numPages}','${r.stock}');
    --if adding new publisher
    insert into publisher values('${r.pid}','${r.publisher}','${r.paddress}','${r.pemail}','${r.pphonenum}','${r.pbankaccount}');
    --if adding new author
    insert into author values('${r.aid}','${r.author}','${r.acountry}');
    --then
    insert into writtenBy values('${r.isbn}','${r.aid}');
    insert into publishedBy values('${r.isbn}','${r.pid}');

--remove books view /removebook
select * from book;

--deleting a book
delete from writtenBy where isbn='${req.body.isbn}'; delete from publishedBy where isbn='${req.body.isbn}'; delete from book where isbn='${req.body.isbn}';

--viewing reports
select * from book natural join purchases;

/*
CONNECTING TO DB: 
    db = pgp('postgres://USERNAME:PASSWORD@localhost:5432/DB_NAME');

*/