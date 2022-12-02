const express = require('express');

let app = express();

//Database variables
let initOptions;
let pgp;
let db;

app.set("view engine", "pug");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.json());

//*** */

let user = "";
let userInfo;
let newuserid = 0;
let userCart = [];

//*** */

//HOMEPAGE
app.get('/',index);

//USER
app.get('/login',login);
app.post('/login',postlogin);

app.get('/logout',logout);

app.get('/register',register);
app.post('/register',postregister);

app.get('/search',search);
app.post('/search',postsearch);

app.get('/search/:isbn',viewBook);

app.get('/authors',authors);
app.get('/author/:aid',viewAuthor);

app.get('/publishers',publishers);

app.get('/cart', cartView);

app.post('/addToCart',addToCart);
app.post('/removeFromCart',removeFromCart);

app.post('/purchase',purchase);

app.get('/allorders',viewAllOrders);
app.get('/track/:num',track);



//ADMIN
app.get("/addbook",addBookView);
app.post("/adminadd",addBook);

app.get("/removebook",removeBookView);
app.post("/adminremove",removeBook);

app.get("/reports",reportsView);


//*** */

//HOMEPAGE
function index(req, res, next){
    res.render('index', {user:user});
}

//USER

//login/out
function login(req, res, next){
    res.render('login',{user:user});
}

async function postlogin(req, res, next){
    uname = req.body.username;
    pword = req.body.password;
    let loginattempt = true;
    let q = await db.query("select * from users where username='"+uname+"'");
    if(q.length == 0){
        loginattempt = true;
        res.render('login', {user:user,loginattempt:loginattempt})
    } else {
        if (q[0].pword == pword){
            user = q[0].username;
            userInfo = q[0];
            loginattempt=false;
            res.render('index',{user:user});
        } else { 
            loginattempt = true;
            res.render('login', {user:user,loginattempt:loginattempt})
        }
        
    }
}

function logout(req, res, next){
    user = null;
    res.render('index',{user:user});

}

//register
function register(req, res, next){
    res.render('register',{user:user});
}

async function postregister(req, res, next){
    r = req.body;

    let newuser = `insert into users values('${newuserid}','${r.fname}','${r.lname}','${r.uname}','${r.pword}','${r.add}','${r.city}','${r.pcode}',`
    if (r.cnum.length > 1){
        newuser += `'${r.cname}','${r.cnum}','${r.cvv}','${r.badd}','${r.bcity}');`
    } else {
        newuser += `NULL,NULL,NULL,NULL,NULL);`
    }
    let q = await db.query(newuser);

    user = r.uname;
    newuserid++;

    res.render('index',{user:user});

}

//search
function search(req, res, next){
    res.render('search',{user:user, queried:false});
}

async function postsearch(req, res, next){



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

    q = await db.query(s);

    res.render('search',{user:user, queried:true, q:q});
}

async function viewBook(req, res, next){
    let q = await db.query(`select * from book natural join writtenBy natural join author where writtenBy.aid=author.aid and isbn='${req.params.isbn}';`);
    res.render('viewBook',{user:user,q:q});
}

async function authors(req, res, next){
    let q = await db.query(`select * from author order by name;`);
    res.render('authors',{user:user, q:q});
}

async function viewAuthor(req, res, next){
    let q = await db.query(`select * from book natural join writtenBy natural join author where writtenBy.aid=author.aid and author.aid='${req.params.aid}';`)
    res.render('viewAuthor',{user:user,q:q});

}

async function publishers(req, res, next){
    let q = await db.query(`select * from publisher order by pname;`);
    res.render('publishers',{user:user, q:q});
}

//CART

function cartView(req, res, next){
    let empty = true;
    if(userCart.length>0){
        empty=false
    }
    res.render('cart',{user:user, userCart:userCart, userInfo:userInfo, empty:empty});
}

//ONLY FOR POSTING, NO VIEW
async function addToCart(req, res, next){    
    let q = await db.query(`select * from book where isbn='${req.body.isbn}';`);
    userCart.push(q[0]);
    let empty = true;
    if(userCart.length>0){
        empty=false
    }
    res.redirect('/cart');
}

//ONLY FOR POSTING, NO VIEW
function removeFromCart(req, res, next){
    let removeindex = -1;
    temparr = [];
    userCart.forEach(function (item, index) {
        if(item.isbn == req.body.isbn){
            removeindex = index;
        }
      });

      for(let i=0; i < userCart.length; i++){
        if(i!=removeindex){
            temparr.push(userCart[i]);
        }
      }
      userCart = temparr;
      console.log(userCart);
    let empty = true;
    if(userCart.length>0){
        empty=false
    }
    res.redirect('/cart');

}

//Purchases the items in cart 
//Checks if stock < 10 and if so increases it by 10
async function purchase(req, res, next){
    let ordernumber = Math.floor(Math.random() * (999999999 - 0 + 1)) + 0;
    let s = ``;
    let amount = 0;

    userCart.forEach(function (item, index) {
        let pid = Math.floor(Math.random() * (999999999 - 0 + 1)) + 0;
        s += `insert into purchases values('${pid}','${item.isbn}','${ordernumber}');`;
        s += `update book set stock = stock -1 where isbn='${item.isbn}';`
        amount += parseInt(item.price);
      });


      s+=`insert into orders values('${ordernumber}','${userInfo.username}','${req.body.address}','${amount}');`
      
    let q = await db.query(s);
    userCart = [];

    let lowStockCheck = await db.query(`update book set stock = stock + 10 where stock<10;`)


    res.redirect(`/track/${ordernumber}`);
}

async function viewAllOrders (req, res, next) {

    let q = await db.query(`select * from purchases natural join orders natural join book;`);
    res.render('allorders',{user:user,q:q});
}

async function track (req, res, next){
    let q = await db.query(`select * from orders where ordernum='${req.params.num}';`);

    res.render('tracker',{user:user,q:q});
}


//ADMIN

async function addBookView(req, res, next) {

    res.render('addbookview',{user:user});
}

async function addBook (req, res, next) {

    let r = req.body;

    let s = `insert into book values('${r.isbn}','${r.title}','${r.descrip}','${r.publisher}','${r.author}','${r.genre}','${r.price}','${r.pubPercent}','${r.numPages}','${r.stock}');`;


    if (r.paddress.length > 0){
        let p = await db.query(`insert into publisher values('${r.pid}','${r.publisher}','${r.paddress}','${r.pemail}','${r.pphonenum}','${r.pbankaccount}');`);
    }

    if (r.acountry.length > 0){
        let a = await db.query(`insert into author values('${r.aid}','${r.author}','${r.acountry}');`);
    }

    s += `insert into writtenBy values('${r.isbn}','${r.aid}');`;
    s += `insert into publishedBy values('${r.isbn}','${r.pid}');`;



    let q = await db.query(s);

    res.redirect(`/search/${r.isbn}`);
}

async function removeBookView (req, res, next) {
    let q = await db.query(`select * from book;`);

    res.render('removebookview',{user:user,q:q});

}

async function removeBook (req, res, next) {

    let q = await db.query(`delete from writtenBy where isbn='${req.body.isbn}'; delete from publishedBy where isbn='${req.body.isbn}'; delete from book where isbn='${req.body.isbn}';`);
    
    res.redirect("/removebook");

}

//messy but gets all purchase data and creates arrays for byisbn, bygenre, bypublisher and byauthor to view in reportsview
async function reportsView(req, res, next){

    let q = await db.query(`select * from book natural join purchases;`);
    let byisbn = [];
    let byauthor = [];
    let bypublisher = [];
    let bygenre =[];
    let x = [];
    let search = 0;
    let num = 0;
    let found = false;
    let foundindex = 0;
    byisbn.push({isbn:parseInt(q[0].isbn),amount:parseInt(q[0].price)});
    bygenre.push({genre:q[0].genre,amount:parseInt(q[0].price)});
    bypublisher.push({publisher:q[0].publisher,amount:parseInt(q[0].price)});
    byauthor.push({author:q[0].author,amount:parseInt(q[0].price)});

    for (let i=1;i<q.length;i++){

        //by isbn
        search = parseInt(q[i].isbn);
        num = parseInt(q[i].price);
        found = false;
        foundindex = 0;
        for(let j=0;j<byisbn.length;j++){
            if (byisbn[j]["isbn"] == search)
                found = true;
        }

        if(found){
            byisbn[foundindex].amount += num;
        } else {
            byisbn.push({isbn: search, amount: num});
        }

        //by genre
        search = q[i].genre;
        num = parseInt(q[i].price);
        found = false;
        foundindex = 0;
        for(let j=0;j<bygenre.length;j++){
            if (bygenre[j]["genre"] == search)
                found = true;
        }

        if(found){
            bygenre[foundindex].amount += num;
        } else {
            bygenre.push({genre: search, amount: num});
        }

        //by publisher
        search = q[i].publisher;
        num = parseInt(q[i].price);
        found = false;
        foundindex = 0;
        for(let j=0;j<bypublisher.length;j++){
            if (bypublisher[j]["publisher"] == search)
                found = true;
        }

        if(found){
            bypublisher[foundindex].amount += num;
        } else {
            bypublisher.push({publisher: search, amount: num});
        }

        //by author
        search = q[i].author;
        num = parseInt(q[i].price);
        found = false;
        foundindex = 0;
        for(let j=0;j<byauthor.length;j++){
            if (byauthor[j]["author"] == search)
                found = true;
        }

        if(found){
            byauthor[foundindex].amount += num;
        } else {
            byauthor.push({author: search, amount: num});
        }
        


    }


    res.render("report",{user:user, byisbn:byisbn, bygenre:bygenre, bypublisher:bypublisher, byauthor:byauthor});

}



//*** */

app.listen(3000, function(){
    initOptions = {
      connect(client, dc, useCount){
        const cp = client.connectionParameters;
        console.log('Connected to database: ' + cp.database);
      }
    };
    pgp = require('pg-promise')(initOptions);
    /*

    */
    //CHANGE THIS TO WORK WITH YOUR POSTGRES DATABASE
    db = pgp('postgres://USERNAME:PASSWORD@localhost:5432/DBNAME');

    /*

    */
    console.log("Listening on port 3000");
});