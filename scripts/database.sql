drop table waiters, weekdays, shifts cascade;

create table waiters
(
    id serial not null primary key,
    waiter_name text not null
   
);

create table weekdays
(
    id serial not null primary key,
    week_day text not null
);

create table shifts
(
    id serial not null primary key,
     waiter_id int not null,
     day_id int not null,
     checked text,
    foreign key (waiter_id) references waiters(id),
    foreign key (day_id) references weekdays(id)
    );
    