--- load with 
--- psql "dbname='webdb' user='webdbuser' password='password' host='localhost'" -f schema.sql
DROP TABLE IF EXISTS ftduser CASCADE;
DROP TABLE IF EXISTS gamedata CASCADE;
CREATE TABLE ftduser (
	username VARCHAR(20) PRIMARY KEY,
	password BYTEA NOT NULL,
	gamedifficulity VARCHAR(20) NOT NULL
);

CREATE TABLE  gamedata(
	dataid INT NOT NULL,
	username VARCHAR(20) NOT NULL,
	Score_e INT NOT NULL,
	Score_m INT NOT NULL,
	Score_h INT NOT NULL,
	TotalScore INT NOT NULL,
   CONSTRAINT fk_username
      FOREIGN KEY(username) 
	  REFERENCES ftduser(username)
);

