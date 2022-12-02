/*

    This SQL is runnable to initialize some values in the database.

*/

insert into users values('000000','admin','admin','admin','admin','admin','admin','admin',NULL,NULL,NULL,NULL,NULL);
insert into users values('999999','test','test','test','test','test','test','test',NULL,NULL,NULL,NULL,NULL);

insert into book values('0','Book one','The first book','We Publish Books','Good Generic Name','Comedy','69.0','0.2','100','20');
insert into book values('1','Book two','The second book','We Also Publish Books','Better Generic Name','Horror','420.0','0.2','200','30');
insert into book values('2','Book one:The sequel?','You didnt love the first one so we made another. Not that literally anyone asked for it...','We Publish Books','Good Generic Name','Comedy','69.0','0.2','101','20');

insert into author values('000001','Good Generic Name','Canada');
insert into author values('000002','Better Generic Name','Canada');

insert into publisher values('000001','We Publish Books','123 im tired lane','yeet@email.com','6131001111','1000001');
insert into publisher values('000002','We Also Publish Books','321 im tired lane','dab@email.com','5140909900','1000002');

insert into writtenBy values('0','000001');
insert into writtenBy values('1','000002');
insert into writtenBy values('2','000001');


insert into publishedBy values('0','000001');
insert into publishedBy values('1','000002');
insert into publishedBy values('2','000001');
