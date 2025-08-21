setupUi();
const baseUrl = "https://tarmeezacademy.com/api/v1";
// login modal logic
const loginBtn = document.getElementById("login-Btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");
loginNav.addEventListener("click", () => {
  const loginUsername = document.getElementById("login-username-input").value;
  const loginPassword = document.getElementById("login-password-input").value;
  const paramt = {
    username: loginUsername,
    password: loginPassword,
  };
  showLoader(true)
  const URL = `${baseUrl}/login`;
  axios
    .post(URL, paramt)
    .then((response) => {
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const modal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("Login Succufully..Enjoy", "success");
      setupUi();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    }).finally(()=>{
      showLoader(false)
    })
});
//end of  login modal logic

// REGISTER MODAL//
registerNav.addEventListener("click", () => {
  const registerName = document.getElementById("register-name-input").value;
  const registerEmail = document.getElementById("register-email-input").value;
  const registerUsername = document.getElementById(
    "register-username-input"
  ).value;
  const registerPassword = document.getElementById(
    "register-password-input"
  ).value;
  const profileImage = document.getElementById("profile-image-input").files[0];
  const formData = new FormData();
  formData.append("name", registerName);
  formData.append("email", registerEmail);
  formData.append("username", registerUsername);
  formData.append("password", registerPassword);
  formData.append("image", profileImage);
  showLoader(true)
  const URL = `${baseUrl}/register`;
  axios
    .post(URL, formData)
    .then((response) => {
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("User Has Been Created Succufully..Enjoy", "success");
      setupUi();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    }).finally(()=>{
      showLoader(false)
    })
});
// -----REGISTER MODAL------//

// log out function
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // alert("logging out");
  showAlert("Logout Succufully", "danger");
  setupUi();
});
// log out function //

function setupUi() {
  const PostBtn = document.getElementById("post-btn");
  const loginBtn = document.getElementById("login-Btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const token = localStorage.getItem("token");
  const commentSection = document.getElementById("comment-section")


  if (token == null) {
    // user is gust
    loginBtn.style.display = "flex";
    registerBtn.style.display = "flex";
    logoutBtn.style.display = "none";
    document
      .getElementById("nav-section")
      .style.setProperty("display", "none", "important");
    //  commentBtn.style.display="none"
    //  commentInput.style.display="none"
  } else {
    // user logged in
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "flex";
    document
      .getElementById("nav-section")
      .style.setProperty("display", "flex", "important");
    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-user-image").src = user.profile_image;
    // commentBtn.style.display="block"
    // commentInput.style.display="block"
  }
}

function getCurrentUser() {
  let user = null;

  const storageUser = localStorage.getItem("user");

  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}

function showAlert(message, type) {
  const alertPlaceholder = document.getElementById("Show-Alert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
    alertPlaceholder.append(wrapper);
  };
  appendAlert(message, type);
}

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postid");
console.log(id);
console.log(urlParams);
getPost();

function getPost() {

  let response = axios.get(`${baseUrl}/posts/${id}`)
  .then((res) => {
   showLoader(true)
    const post = res.data.data;
    const comments = post.comments;
    const author = post.author;
    let userTitle = "";
    if (post.title != null) {
      userTitle = post.title;
    }
    document.getElementById("user-name-span").innerHTML = author.username;

    let commentContent = "";
    for (comment of comments) {
      commentContent += `
        <!-- COMMENT -->
              <div class="" style="background-color:rgb(227, 227, 227) ">
                <!-- USER IMAGE - USERNAME -->
                <div class>
                    <img src="${comment.author.profile_image}" class="rounded circle" style="width: 40px;height: 40px;" alt="">
                    <b>
                        @${comment.author.username}
                    </b>
                </div>
                <!-- USERPIMAGE - USERNAME -->
                <!-- COMMENT BODY -->
              <div>
                   ${comment.body}
                </div>
                <!-- //COMMENT BODY //--> `;
    }
    const postContent = `
             <div class="post">
                <div class="card mb-3">
                <div class="card-header">
                <img class="shadow rounded-5" src="${post.author.profile_image}" alt="Profile Img" style="width:40px;height:40px">
                <b>${post.author.username}</b>
            </div>
            <img src="${post.image}" class="card-img-top img-thumbnail" alt="Post img"; >
            <div class="card-body" style="margin-bottom:10px">
                <h5 class="card-title">${userTitle}</h5>
                <p class="card-text">${post.body}.</p>
                <p class="card-text"><small class="text-body-secondary">Last updated ${post.created_at}  </small></p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                    </svg>
                    <span>
                     (${post.comments_count}) Comments

                  <span id="post-tags-${post.id}">
                 </span>
            </span>  
      </div>
      <div id="comments">
            ${commentContent}
      </div>
      <div class="input-group" id="comment-section">
                <input type="text" class="form-control p-3" id="comment-input" placeholder="Enter Your Comment" >
                <button class="btn btn-outline-primary" type="button" id="comment-btn">Send</button>
              </div>
      </div>
          
             </div>`;
  
      document.querySelector(".posts").innerHTML = postContent;
      showLoader(false)
      let commentBtn = document.getElementById("comment-btn");
      commentBtn.addEventListener("click", () => {
      let commentInput = document.getElementById("comment-input").value;
      const token = localStorage.getItem("token");
      showLoader(true)
      const URL = `${baseUrl}/posts/${id}/comments`;
      axios
        .post(
          URL,
          {
            body: commentInput,
          },
          (headers = {
            headers: {
              authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
        )
        .then((res) => {
          getPost();
          showAlert("Comment Has Been Created Succufully", "success");
        }).catch((error) => {
          showAlert(error.response.data.message, "danger");
        }).finally(()=>{
      showLoader(false)
    })
    });
  });
}

function profileClicked (){
 const user= getCurrentUser() 
 const userid= user.id
  window.location.href = `UserProfile.html?userid=${userid}`;
}

function showLoader(show=true) {
  if(show) {
    document.getElementById("loader").style.visibility= "visible"
  } else {
     document.getElementById("loader").style.visibility= "hidden"
  }
}