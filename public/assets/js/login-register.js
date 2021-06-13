/*
 *
 * login-register modal
 * Autor: Creative Tim
 * Web-autor: creative.tim
 * Web script: http://creative-tim.com
 *
 */
function showRegisterForm() {
  $(".loginBox").fadeOut("fast", function () {
    $(".registerBox").fadeIn("fast");
    $(".login-footer").fadeOut("fast", function () {
      $(".register-footer").fadeIn("fast");
    });
    $(".modal-title").html("Register with");
  });
  $(".error").removeClass("alert alert-danger").html("");
}

function showLoginForm() {
  $("#loginModal .registerBox").fadeOut("fast", function () {
    $(".loginBox").fadeIn("fast");
    $(".register-footer").fadeOut("fast", function () {
      $(".login-footer").fadeIn("fast");
    });

    $(".modal-title").html("Login with");
  });
  $(".error").removeClass("alert alert-danger").html("");
}

function openLoginModal() {
  showLoginForm();
  setTimeout(function () {
    $("#loginModal").modal("show");
  }, 230);
}

function openRegisterModal() {
  showRegisterForm();
  setTimeout(function () {
    $("#loginModal").modal("show");
  }, 230);
}

function loginAjax() {
  const sapid = $(".loginBox #sapId").val();
  const password = $(".loginBox #password").val();
  const formData = {
    sapid,
    password,
  };
  if (!sapid || !password) {
    shakeModal("All fields are mandatory");
    return;
  }

  $.ajax({
    url: "/login",
    type: "POST",
    data: formData,
  })
    .done(function (data) {
      console.log(data);
      if (data && data.success) {
        $(".error")
          .removeClass("alert alert-danger")
          .addClass("alert alert-success")
          .html("Login success!, continue to chat");
        setTimeout(function () {
          $(".error").removeClass("alert alert-success");
          $(".error").html("");
          alert(data.name);
          window.location.replace(
            `/chat.html?source=${data.authorization}&name=${data.name}`
          );
        }, 2000);
      } else {
        $(".error")
          .removeClass("alert alert-success")
          .addClass("alert alert-danger")
          .html("Sorry, some issue occured! Try again...");
        setTimeout(function () {
          $(".error").removeClass("alert alert-danger");
          $(".error").html("");
          window.location.replace("index.html");
        }, 2000);
      }
    })
    .fail(function (data) {
      shakeModal(data.responseJSON.message);
    });

  /*   $.post("/login", formData).done(function (data) {
    console.log("🚀 ~ file: login-register.js ~ line 59 ~ data", data);
    console.log(data.errorCode);
    // from handleError
    if (data.errorCode) {
      console.log(1111);
      shakeModal(data.error);
    } else if (data.message) {
      window.location.replace("/chat.html");
    } else {
      shakeModal();
    }
  }); */
  /*   Simulate error message from the server   */
  // shakeModal();
}

function registerAjax() {
  const sapid = $(".registerBox #sapId").val();
  const password = $(".registerBox #password").val();
  const confirmPassword = $(".registerBox #password_confirmation").val();
  const formData = {
    sapid,
    password,
    confirmPassword,
  };
  if (!sapid || !password || !confirmPassword) {
    shakeModal("All fields are mandatory");
    return;
  }

  if (!(password === confirmPassword)) {
    shakeModal("Password and Repeat Password don't match!");
    return;
  }

  $.ajax({
    url: "/users",
    type: "POST",
    data: formData,
  })
    .done(function (data) {
      $(".error")
        .removeClass("alert alert-danger")
        .addClass("alert alert-success")
        .html("You are now registered, Login to chat");
      setTimeout(function () {
        $(".error").removeClass("alert alert-success");
        $(".error").html("");
        window.location.replace("/index.html");
      }, 2000);
    })
    .fail(function (data) {
      let errArr = [];
      messages = data.responseJSON.message;
      messages.forEach((err) => errArr.push(Object.values(err)));
      shakeModal(errArr.join(". "));
    });
}

function shakeModal(message) {
  const displayMessage = message || "Invalid SAP ID/Password combination";
  $("#loginModal .modal-dialog").addClass("shake");
  $(".error").addClass("alert alert-danger").html(displayMessage);
  $('input[type="password"]').val("");
  setTimeout(function () {
    $("#loginModal .modal-dialog").removeClass("shake");
  }, 1000);
}
