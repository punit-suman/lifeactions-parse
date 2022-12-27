CREATE TABLE users (
    user_id int PRIMARY KEY AUTO_INCREMENT,
    about varchar(511),
    education varchar(255),
    occupation varchar(255),
    durables_used varchar(511),
	created_at TIMESTAMP default now()
);

create table apps_m (
	app_id int PRIMARY KEY AUTO_INCREMENT,
    app_name varchar(255),
	description text,
	category_id int,
	packageName varchar(255),
    created_at TIMESTAMP default now(),
	created_by int default 1,
	modified_at TIMESTAMP,
	modified_by int,
	status varchar(25) default 'active'
)

insert into apps_m(app_name) values ('others')
insert into apps_m(app_name, category_id, packageName) values ('hotstar', 2, 'in.startv.hotstar')
insert into apps_m(app_name, category_id, packageName) values ('youtube', 2, 'com.google.android.youtube')
insert into apps_m(app_name, category_id, packageName) values ('netflix', 2, 'com.netflix.mediaclient')
insert into apps_m(app_name, category_id, packageName) values ('amazon prime', 2, 'com.amazon.avod.thirdpartyclient')

create table app_category_m (
	id int PRIMARY KEY AUTO_INCREMENT,
    category_name varchar(255),
	description text,
    created_at TIMESTAMP default now(),
	created_by int default 1,
	modified_at TIMESTAMP,
	modified_by int,
	status varchar(10) default 'active'
)

insert into app_category_m (category_name, description) values ('others', null)
insert into app_category_m(category_name, description) values('ott', null)

create table data_patterns_m (
	id int PRIMARY KEY AUTO_INCREMENT,
    app_id int,
	name varchar(255),
	description text,
	eventInfo varchar(511),
    created_at TIMESTAMP default now(),
	created_by int default 1,
	modified_at TIMESTAMP,
	modified_by int,
	status varchar(10) default 'active'
)

insert into data_patterns_m(name) values('others')
insert into data_patterns_m(app_id, name, eventInfo) values(2, 'movie', 'in.startv.hotstar*android.widget.FrameLayout*4*1*0')
insert into data_patterns_m(app_id, name, eventInfo) values(1, 'phone_home_screen', 'com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0')
insert into data_patterns_m(app_id, name, eventInfo) values(1, 'apps_list', 'com.sec.android.app.launcher*android.widget.FrameLayout*4*8*0')
insert into data_patterns_m(app_id, name, eventInfo) values(5, 'movie_description', 'com.amazon.avod.thirdpartyclient*android.widget.TextView*4*1*0')
insert into data_patterns_m(app_id, name, eventInfo) values(5, 'movie_details_on_screen', 'com.amazon.avod.thirdpartyclient*android.widget.LinearLayout*4*1*0')
--insert into data_patterns_m(app_id, name, eventInfo) values(2, 'movie_description', 'in.startv.hotstar*android.widget.FrameLayout*4*1*0')
insert into data_patterns_m(app_id, name, eventInfo) values(2, 'current_plan', 'in.startv.hotstar*android.view.ViewGroup*4*1*0')
--insert into data_patterns_m(app_id, name, eventInfo) values(2, 'movie_description', 'in.startv.hotstar*android.view.ViewGroup*4*1*0')
insert into data_patterns_m(app_id, name, eventInfo) values(2, 'account_holder', 'in.startv.hotstar*android.widget.RelativeLayout*4*1*0')
insert into data_patterns_m(app_id, name, eventInfo) values(1, 'app_launched', 'com.sec.android.app.launcher*android.widget.TextView*4*1*0')
insert into data_patterns_m(app_id, name, eventInfo)
values(3, 'playing_shorts', 'com.google.android.youtube*android.widget.Button*4*1*0')
insert into data_patterns_m(app_id, name, eventInfo)
values(3, 'closed_ad_panel', 'com.google.android.youtube*android.widget.ImageView*4*1*0')
insert into data_patterns_m(app_id, name, eventInfo)
values(3, 'search_text', 'com.google.android.youtube*android.widget.EditText*4*8*0')
insert into data_patterns_m(app_id, name, eventInfo)
values(4, 'movie_description', 'com.netflix.mediaclient*android.widget.TextView*4*1*0')
insert into data_patterns_m(app_id, name, eventInfo)
values(4, 'movie_clicked', 'com.netflix.mediaclient*android.widget.ImageView*4*1*0')
