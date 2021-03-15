var stage=null;
var view = null;
var interval=null;
var credentials={ "username": "", "password":"" };
var cur_user = null;
var cur_user_psw = null;
function setupGame(){
	stage=new Stage(document.getElementById('stage'));

	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', moveByKey);
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
function moveByKey(event){
	var key = event.key;
        if(stage.player.health>0){
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
	credentials =  { 
		"username": $("#username").val(), 
		"password": $("#password").val() 
	};

        $.ajax({
                method: "POST",
                url: "/api/auth/login",
                data: JSON.stringify({}),
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
                $("#cur_user").html("Current User: " + cur_user);
                $("#psw_profile").val(cur_user_psw);
                $("#pswrepeat_profile").val(cur_user_psw);
		setupGame();
		startGame();

        }).fail(function(err){
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


function register(){
	credentials =  { 
		"username": $("#regname").val(), 
		"psw": $("#psw").val(),
                "pswrepeat": $("#pswrepeat").val(),
                "gamedifficulity": $('input:radio[name=skill_reg]:checked').val()
	};
        $.ajax({
                method: "POST",
                url: '/api/authR/register',
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
                method: "POST",
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

$(function(){
        // Setup all events here and display the appropriate UI
        $("#loginSubmit").on('click',function(){ login(); });
        $("#registerSubmit").on('click',function(){ Nav_register(); });
        $("#register").on('click',function(){ register(); });
        $("#logout").on('click',function(){ logout(); });
        $("#instruction").on('click',function(){ instruction(); });
        $("#restart").on('click',function(){ restartGame(); });
        $("#profile").on('click',function(){ profile(); });
        $(".resume").on('click',function(){ resumeGame(); });
        $("#ui_login").show();
        $("#ui_navigation").hide();
        $("#ui_play").hide();
        $("#ui_register").hide();
        $("#ui_instruction").hide();
        $("#ui_profile").hide();
});

