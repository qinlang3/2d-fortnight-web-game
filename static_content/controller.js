var stage=null;
var view = null;
var interval=null;
var credentials={ "username": "", "password":"" };
var cur_user = null;
var cur_user_psw = null;
var game_difficulity = null;
function setupGame(){
	stage=new Stage(document.getElementById('stage'));

	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', pressKey);
        document.addEventListener('keyup', releaseKey);
        document.getElementById('stage').addEventListener('mousemove', moveMouse);
        document.getElementById('stage').addEventListener('mousedown', mouseClick);
        
    
}
function startGame(){
	interval=setInterval(function(){ stage.step(); stage.draw(); },20);
}
function pauseGame(){
	clearInterval(interval);
	interval=null;
}
function resumeGame(){
        $("#ui_login").hide();
        $("#ui_navigation").show();
        $("#ui_play").show();
        $("#ui_register").hide();
        $("#ui_instruction").hide();
        $("#ui_profile").hide();
        startGame();
}
function restartGame(){
        clearInterval(interval);
	interval=null;
        stage=null;
        stage=new Stage(document.getElementById('stage'));
        interval=setInterval(function(){ stage.step(); stage.draw(); },20);
        $("#ui_login").hide();
        $("#ui_navigation").show();
        $("#ui_play").show();
        $("#ui_register").hide();
        $("#ui_instruction").hide();
        $("#ui_profile").hide();
}
function pressKey(event){
	var key = event.key;
        if(stage.player.health>0){
                if (key=='r') {
                        stage.player.switchWeapon();
                }
                if (key=='f') {
                        stage.player.pickup();
                }
                if (key=='a') {
                        stage.player.setVelocityX(-4);
                }
                if (key=='s') {
                        stage.player.setVelocityY(4);        
                }
                if (key=='d') {
                        stage.player.setVelocityX(4);
                }
                if (key=='w') {
                        stage.player.setVelocityY(-4);
                }
        }    
}
function releaseKey(event) {
        var key = event.key;
        if(stage.player.health>0){
                if (key=='a'||key=='d') {
                        stage.player.setVelocityX(0);
                }
                if (key=='s'||key=='w') {
                        stage.player.setVelocityY(0);
                }
        }
}
function moveMouse(event){
        var x = event.offsetX;
        var y = event.offsetY;
        if(stage.player.health>0){
                stage.player.aim(new Pair(x, y));
        }
}
function mouseClick() {
        if(stage.player.health>0){
                stage.player.fireWeapon();
        }
}


function login(){
        $("#login_err").html("")
	credentials =  { 
		"username": $("#username").val(), 
		"password": $("#password").val() 
	};
        if ( credentials["username"] == "" || credentials["password"] == ""){
                $("#login_err").html("Username and password can not be empty");
                return;
        }
        $.ajax({
                method: "POST",
                url: "/api/auth/login",
                data: JSON.stringify({"username": credentials.username, "password": credentials.password}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
                console.log(JSON.stringify(data));  
        	$("#ui_login").hide();
        	$("#ui_play").show();
        	$("#ui_navigation").show();
                cur_user = data['user'];
                cur_user_psw = data['password'];
                game_difficulity = data['game_diff'];
                $('input[name="' + "skill_pro" + '"][value="' + game_difficulity + '"]').attr('checked',true);
                $("#cur_user").html(cur_user);
                $("#psw_profile").val(cur_user_psw);
                $("#pswrepeat_profile").val(cur_user_psw);
		setupGame();
		startGame();
        }).fail(function(err){
                $("#login_err").html("");
                if (err.status == "402"){
                        console.log("Your username and password does not match");
                        $("#login_err").html("Your username and password does not match");
                }
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}


function update_profile(){
        $("#update_msg").html("");
        $("#pswerr_pro").html("");
        $("#emptyerr_pro").html("");
	credentials =  { 
		"username": $("#cur_user").html(), 
		"password": $("#psw_profile").val(),
                "repeatpsw": $('#pswrepeat_profile').val(),
                "gamedifficulity": $('input:radio[name=skill_pro]:checked').val() 
	};
        if ( credentials["username"] == "" || credentials["password"] == "" || credentials["repeatpsw"]=="" || credentials["gamedifficulity"]==""){
                $("#emptyerr_pro").html("All registration field can not be empty");
                return;
        }
        if (credentials["pswrepeat"] != credentials["psw"]){
                $("#pswerr_pro").html("Your two password are not the same");
                return;
        }
        $.ajax({
                method: "PUT",
                url: "/api/authU/update",
                data: JSON.stringify({}),
                headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password + ":" + credentials.repeatpsw + ":" + credentials.gamedifficulity) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
                $("#update_msg").html("User Profile update successfully!"); 


        }).fail(function(err){
                if (err.status == "401"){
                        $("#emptyerr_pro").html("All the registration fields can not be empty");
                }else if (err.status == "402"){
                        $("#pswerr_pro").html("Your two password are not the same");
                }

        });
}

function register(){
        $("#empty_err").html("");
        $("#psw_err").html("");
        $("#usrname_err").html("");
	credentials =  { 
		"username": $("#regname").val(), 
		"psw": $("#psw").val(),
                "pswrepeat": $("#psw-repeat").val(),
                "gamedifficulity": $('input:radio[name=skill_reg]:checked').val()
	};
        if ( credentials["username"] == "" || credentials["psw"] == "" || credentials["pswrepeat"]=="" || credentials["gamedifficulity"]==""){
                $("#empty_err").html("All registration field can not be empty");
                return;
        }
        if (credentials["pswrepeat"] != credentials["psw"]){
                $("#psw_err").html("Your two password are not the same");
                return;
        }
        $.ajax({
                method: "POST",
                url: "/api/authR/register",
                data: JSON.stringify({}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.psw + ":" + credentials.pswrepeat + ":" + credentials.gamedifficulity) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
        	$("#ui_login").show();
        	$("#ui_register").hide();
        }).fail(function(err){
                if (err.status == "401"){
                        $("#empty_err").html("All the registration fields can not be empty");
                }else if (err.status == "402"){
                        $("#psw_err").html("Your two password are not the same");
                        $('#psw-repeat').val("");
                }else if (err.status == "403"){
                        console.log("yoyoyo");
                        $("#usrname_err").html("username already been used");
                        $("#regname").val("");
                }
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

// get request to register page
function Nav_register(){
        $.ajax({
                method: "GET",
                url: '/api/view/register',
                data: JSON.stringify({}),
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
        	$("#ui_login").hide();
        	$("#ui_register").show();
        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

function logout(){
        $.ajax({
                method: "GET",
                url: '/api/view/logout',
                data: JSON.stringify({}),
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
        	$("#ui_login").show();
        	$("#ui_register").hide();
                $("#ui_play").hide();
                $("#ui_navigation").hide();
                $("#ui_instruction").hide();
                $("#ui_profile").hide();
                clearInterval(interval);
                interval=null;
                stage=null;
        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}


function instruction(){
        $.ajax({
                method: "GET",
                url: '/api/view/instruction',
                data: JSON.stringify({}),
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                pauseGame();
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
        	$("#ui_login").hide();
        	$("#ui_register").hide();
                $("#ui_play").hide();
                $("#ui_instruction").show();
                $("#ui_profile").hide();
        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}


function profile(){
        $.ajax({
                method: "GET",
                url: '/api/view/profile',
                data: JSON.stringify({"user": cur_user}),
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                pauseGame();
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
                $("#ui_login").hide();
                $("#ui_navigation").show();
                $("#ui_play").hide();
                $("#ui_register").hide();
                $("#ui_instruction").hide();
                $("#ui_profile").show();
        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}



// Using the /api/auth/test route, must send authorization header
function test(){
        $.ajax({
                method: "GET",
                url: "/api/auth/test",
                data: {},
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}


function delete_account(){
        $.ajax({
                method: "DELETE",
                url: "/api/authD/delete",
                data: {},
		headers: { "Authorization": "Basic " + btoa(credentials.username) },
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
                $("#ui_navigation").hide();
                $("#ui_profile").hide();
                $("#ui_login").show();
        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

$(function(){
        // Setup all events here and display the appropriate UI
        $("#loginSubmit").on('click',function(){ login(); });
        $("#delete").on('click',function(){ delete_account(); });
        $("#registerSubmit").on('click',function(){ Nav_register(); });
        // $("#register").on('click',function(){ register(); });
        $("#logout").on('click',function(){ logout(); });
        $("#instruction").on('click',function(){ instruction(); });
        $("#restart").on('click',function(){ restartGame(); });
        $("#profile").on('click',function(){ profile(); });
        // $("#update").on('click',function(){ update_profile(); });
        $(".resume").on('click',function(){ resumeGame(); });
        $("#ui_login").show();
        $("#ui_navigation").hide();
        $("#ui_play").hide();
        $("#ui_register").hide();
        $("#ui_instruction").hide();
        $("#ui_profile").hide();

});

