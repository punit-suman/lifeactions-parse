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
);

insert into apps_m(app_name) values ('others');
insert into apps_m(app_name, category_id, packageName) values ('hotstar', 2, 'in.startv.hotstar');
insert into apps_m(app_name, category_id, packageName) values ('youtube', 2, 'com.google.android.youtube');
insert into apps_m(app_name, category_id, packageName) values ('netflix', 2, 'com.netflix.mediaclient');
insert into apps_m(app_name, category_id, packageName) values ('amazon prime', 2, 'com.amazon.avod.thirdpartyclient');

create table app_category_m (
	id int PRIMARY KEY AUTO_INCREMENT,
    category_name varchar(255),
	description text,
    created_at TIMESTAMP default now(),
	created_by int default 1,
	modified_at TIMESTAMP,
	modified_by int,
	status varchar(10) default 'active'
);

insert into app_category_m (category_name, description) values ('others', null);
insert into app_category_m(category_name, description) values('ott', null);

-- create table data_patterns_m (
-- 	id int PRIMARY KEY AUTO_INCREMENT,
--     app_id int,
-- 	name varchar(255),
-- 	description text,
-- 	eventInfo varchar(511),
--     created_at TIMESTAMP default now(),
-- 	created_by int default 1,
-- 	modified_at TIMESTAMP,
-- 	modified_by int,
-- 	status varchar(10) default 'active'
-- );

-- insert into data_patterns_m(name) values('others');
-- insert into data_patterns_m(app_id, name, eventInfo) values(2, 'movie', 'in.startv.hotstar*android.widget.FrameLayout*4*1*0');
-- insert into data_patterns_m(app_id, name, eventInfo) values(1, 'phone_home_screen', 'com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0');
-- insert into data_patterns_m(app_id, name, eventInfo) values(1, 'apps_list', 'com.sec.android.app.launcher*android.widget.FrameLayout*4*8*0');
-- insert into data_patterns_m(app_id, name, eventInfo) values(5, 'movie_description', 'com.amazon.avod.thirdpartyclient*android.widget.TextView*4*1*0');
-- insert into data_patterns_m(app_id, name, eventInfo) values(5, 'movie_details_on_screen', 'com.amazon.avod.thirdpartyclient*android.widget.LinearLayout*4*1*0');
-- -- insert into data_patterns_m(app_id, name, eventInfo) values(2, 'movie_description', 'in.startv.hotstar*android.widget.FrameLayout*4*1*0');
-- insert into data_patterns_m(app_id, name, eventInfo) values(2, 'current_plan', 'in.startv.hotstar*android.view.ViewGroup*4*1*0');
-- -- insert into data_patterns_m(app_id, name, eventInfo) values(2, 'movie_description', 'in.startv.hotstar*android.view.ViewGroup*4*1*0');
-- insert into data_patterns_m(app_id, name, eventInfo) values(2, 'account_holder', 'in.startv.hotstar*android.widget.RelativeLayout*4*1*0');
-- insert into data_patterns_m(app_id, name, eventInfo) values(1, 'app_launched', 'com.sec.android.app.launcher*android.widget.TextView*4*1*0');
-- insert into data_patterns_m(app_id, name, eventInfo)
-- values(3, 'playing_shorts', 'com.google.android.youtube*android.widget.Button*4*1*0');
-- insert into data_patterns_m(app_id, name, eventInfo)
-- values(3, 'closed_ad_panel', 'com.google.android.youtube*android.widget.ImageView*4*1*0');
-- insert into data_patterns_m(app_id, name, eventInfo)
-- values(3, 'search_text', 'com.google.android.youtube*android.widget.EditText*4*8*0');
-- insert into data_patterns_m(app_id, name, eventInfo)
-- values(4, 'movie_description', 'com.netflix.mediaclient*android.widget.TextView*4*1*0');
-- insert into data_patterns_m(app_id, name, eventInfo)
-- values(4, 'movie_clicked', 'com.netflix.mediaclient*android.widget.ImageView*4*1*0');


create table event_info_m (
	id int PRIMARY KEY AUTO_INCREMENT,
    app_id int,
	event_info varchar(511),
    name text,
	description text,
    created_at TIMESTAMP default now(),
	created_by int default 1,
	modified_at TIMESTAMP,
	modified_by int,
	status varchar(10) default 'active'
);

delete from lifeactions.event_info_m;
insert into lifeactions.event_info_m(event_info, name) values('com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0', 'navigation');
insert into lifeactions.event_info_m(event_info, name) values('com.sec.android.app.launcher*android.widget.ListView*4*32*0', 'navigation');
insert into lifeactions.event_info_m(event_info, name) values('com.sec.android.app.launcher*android.widget.TextView*4*1*0', 'app_clicked');
insert into lifeactions.event_info_m(app_id, event_info, name) values(3, 'com.google.android.youtube*android.widget.ImageView*4*1*0', 'image_btn_click');
insert into lifeactions.event_info_m(app_id, event_info, name) values(3, 'com.google.android.youtube*android.widget.FrameLayout*4*8*0', 'miniplayer_data');
insert into lifeactions.event_info_m(app_id, event_info, name) values(3, 'com.google.android.youtube*android.widget.Button*4*4*0', 'button_click');
insert into lifeactions.event_info_m(app_id, event_info, name) values(3, 'com.google.android.youtube*android.widget.FrameLayout*4*1*0', 'tile_clicked');
insert into lifeactions.event_info_m(app_id, event_info, name) values(3, 'com.google.android.youtube*android.widget.EditText*4*8192*0', 'input_box');
insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*android.widget.FrameLayout*4*1*0', 'tile_clicked');
insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*android.view.ViewGroup*4*1*0', 'btn_clicked');
insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*android.widget.EditText*4*8192*0', 'input_box');
insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*in.startv.hotstar.rocky.home.search.SearchActivity*4*32*0', 'search_box');
insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*android.widget.RelativeLayout*4*1*0', 'window');
insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*in.startv.hotstar.rocky.launch.splash.SplashActivity*4*32*0', 'app_opened');
insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*android.widget.TextView*4*1*0', 'text_clicked');


create table data_patterns_m (
	id int PRIMARY KEY AUTO_INCREMENT,
    app_id int,
	name varchar(255),
	description text,
	event_info varchar(511),
    prefix text,
    suffix text,
    data text,
    created_at TIMESTAMP default now(),
	created_by int default 1,
	modified_at TIMESTAMP,
	modified_by int,
	status varchar(10) default 'active'
);

delete from lifeactions.data_patterns_m;
insert into lifeactions.data_patterns_m(name, event_info)
values('app_launch', 'com.sec.android.app.launcher*android.widget.TextView*4*1*0');
insert into lifeactions.data_patterns_m(name, event_info, data)
values('phone_home_screen', 'com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0', 'Home');
insert into lifeactions.data_patterns_m(name, event_info, data)
values('recent_apps_clicked', 'com.sec.android.app.launcher*android.widget.ListView*4*32*0', 'Recent apps');
insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
values(3, 'play_video', 'com.google.android.youtube*android.widget.ImageView*4*1*0', 'Play video');
insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
values(3, 'pause_video', 'com.google.android.youtube*android.widget.ImageView*4*1*0', 'Pause video');
insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
values(3, 'search_box_clicked', 'com.google.android.youtube*android.widget.ImageView*4*1*0', 'Search');
insert into lifeactions.data_patterns_m(app_id, name, event_info)
values(3, 'search_text', 'com.google.android.youtube*android.widget.EditText*4*8192*0');
insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
values(3, 'ad_closed', 'com.google.android.youtube*android.widget.ImageView*4*1*0', 'Close ad panel');
insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
values(3, 'miniplayer_closed', 'com.google.android.youtube*android.widget.ImageView*4*1*0', 'Close miniplayer');
insert into lifeactions.data_patterns_m(app_id, name, event_info, suffix)
values(3, 'miniplayer_video_title', 'com.google.android.youtube*android.widget.FrameLayout*4*8*0', ', Pause video');
insert into lifeactions.data_patterns_m(app_id, name, event_info, prefix)
values(3, 'miniplayer_video_channel', 'com.google.android.youtube*android.widget.FrameLayout*4*8*0', 'Close miniplayer, ');
insert into lifeactions.data_patterns_m(app_id, name, event_info, suffix)
values(3, 'video_title', 'com.google.android.youtube*android.widget.FrameLayout*4*1*0', ', More, ');
insert into lifeactions.data_patterns_m(app_id, name, event_info, prefix, suffix)
values(3, 'video_views', 'com.google.android.youtube*android.widget.FrameLayout*4*1*0', ', More, ', ' · ');
insert into lifeactions.data_patterns_m(app_id, name, event_info, prefix)
values(3, 'video_uploaded', 'com.google.android.youtube*android.widget.FrameLayout*4*1*0',' · ');
insert into lifeactions.data_patterns_m(app_id, name, event_info, prefix)
values(2, 'movie_tile_clicked', 'in.startv.hotstar*android.widget.FrameLayout*4*1*0', 'Movie Name');
insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
values(2, 'watch_movie', 'in.startv.hotstar*android.widget.FrameLayout*4*1*0', 'Watch');
insert into lifeactions.data_patterns_m(app_id, name, event_info)
values(2, 'search_text', 'in.startv.hotstar*android.widget.EditText*4*8192*0');
insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
values(2, 'search_box_clicked', 'in.startv.hotstar*in.startv.hotstar.rocky.home.search.SearchActivity*4*32*0', 'Search');
insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
values(2, 'account_holder', 'in.startv.hotstar*android.widget.RelativeLayout*4*1*0', ', +91');
insert into lifeactions.data_patterns_m(app_id, name, event_info)
values(2, 'hotstar_app_opened', 'in.startv.hotstar*in.startv.hotstar.rocky.launch.splash.SplashActivity*4*32*0');
insert into lifeactions.data_patterns_m(app_id, name, event_info)
values(2, 'movie_genre', 'in.startv.hotstar*android.widget.TextView*4*1*0');
insert into lifeactions.data_patterns_m(app_id, name, event_info)
values(2, 'movie_description', 'in.startv.hotstar*android.widget.FrameLayout*4*1*0');