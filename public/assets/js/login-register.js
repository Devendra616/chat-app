/*
 *
 * login-register modal
 * Autor: Creative Tim
 * Web-autor: creative.tim
 * Web script: http://creative-tim.com
 * 
 */
function showRegisterForm(){
    $('.loginBox').fadeOut('fast',function(){
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast',function(){
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('Register with');
    }); 
    $('.error').removeClass('alert alert-danger').html('');       
}

function showLoginForm(){
    $('#loginModal .registerBox').fadeOut('fast',function(){
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');    
        });
        
        $('.modal-title').html('Login with');
    });       
     $('.error').removeClass('alert alert-danger').html(''); 
}

function openLoginModal(){
    showLoginForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);    
}

function openRegisterModal(){
    showRegisterForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);    
}

function loginAjax(){
    /*   Remove this comments when moving to server */
    const sapid = $("#sapId").val();
    const password = $("#password").val();
    const formData = {
        sapid,password
    }
    if(!sapid || !password) {
        shakeModal();
    }

    $.post("/login", formData).done(function (data){
        console.log("🚀 ~ file: login-register.js ~ line 49 ~ $.post ~ data", data);
        
        if(data.error) {
            shakeModal(data.error);
        } else if(data.success){
            window.location.replace("/chat.html");            
        } else {
            shakeModal(); 
        }
    })
/*   Simulate error message from the server   */
    // shakeModal();
}

function shakeModal(message) {
    const displayMessage = message || "Invalid SAP ID/Password combination";
    $('#loginModal .modal-dialog').addClass('shake');
            $('.error').addClass('alert alert-danger').html(displayMessage);
            $('input[type="password"]').val('');
            setTimeout( function() { 
                $('#loginModal .modal-dialog').removeClass('shake'); 
    }, 1000); 
}