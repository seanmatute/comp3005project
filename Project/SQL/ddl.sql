/*

    This sql is runnable to create the relations for the db.

*/

create table book (
    isbn varchar(13) primary key,
    title varchar(300),
    descrip varchar(6000),
    publisher varchar(50),
    author varchar(50),
    genre varchar(30),

    price numeric(6,2),
    pubPercent numeric(4,2),

    numPages numeric(5,0),
    stock numeric(5,0)
);

create table publisher (
    pid varchar(9) primary key,
    pname varchar(50),
    paddress varchar(30),
    pemail varchar(20),

    pphonenum numeric(10,0),
    pbankaccount numeric(10,0)
);

create table author (
    aid varchar(6) primary key,
    name varchar(50),
    country varchar(20)
);

create table users (
    uid varchar(9),
    fname varchar(10),
    lname varchar(10),
    username varchar(20),
    pword varchar(20),
    address varchar(30),
    city varchar(20),
    postalcode varchar(8),

    cardname varchar(40),
    cardnum numeric(20,0),
    cvv numeric(4,0),
    billaddress varchar(30),
    billcity varchar(20),
    primary key (uid, username)

);

create table writtenBy (
    isbn 		varchar(13), 
	 aid		varchar(6),
	 primary key (isbn, aid),
	 foreign key (isbn) references book,
	 foreign key (aid) references author
);


create table publishedBy (
    isbn		varchar(13),
	 pubid		varchar(9),
	 primary key (isbn, pubid),
	 foreign key (isbn) references book,
	 foreign key (pubid) references publisher
);

create table purchases (
    pid varchar(10) primary key,
    isbn varchar(13),
    ordernum varchar(10)

);

create table orders (
    ordernum varchar(10) primary key,
    username varchar(20),
    shipping varchar(50),
    amount numeric(6,2)
);

