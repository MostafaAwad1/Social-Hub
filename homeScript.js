setupUi();
const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;

window.addEventListener("scroll", () => {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    getPosts(false, currentPage);
  }
});

getPosts();
function getPosts(reload = true, page = 1) {
  showLoader(true)
  let response = axios
    .get(`${baseUrl}/posts?limit=4&page=${page}`)
    .then((res) => {
      let posts = res.data.data;
      lastPage = res.data.meta.last_page;
      if (reload) {
        document.querySelector(".posts").innerHTML = "";
      }
      for (post of posts) {
        let delBtnContent = ""
        let user = getCurrentUser()
        let isMyPost = user != null && post.author.id == user.id
        let editBtnContent = ""
        if (isMyPost) {
          editBtnContent = ` <button class="btn btn-secondary" id="commentModalBtn"  data-bs-toggle="modal" data-bs-target="#edit-post-modal"style="float:right" onclick="editPostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Edit</button>`
          delBtnContent = ` <button class="btn btn-danger mx-3" id="commentModalBtn"  data-bs-toggle="modal" data-bs-target="#delete-post-modal"style="float:right" onclick="deletePostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Delete</button>`

        }
        let userTitle = "";
        if (post.title != null) {
          userTitle = post.title;
        }
        let content = `<div class="post">
        <div class="card mb-3">
         <div class="card-header">
           <span onclick="userClicked(${post.author.id})" style="cursor:pointer" >
            <img class="shadow rounded-5" src="${post.author.profile_image
          }" alt="Profile Img" style="width: 40px;height: 40px;">
            <b>${post.author.username}</b>
            </span>
             ${editBtnContent}
             ${delBtnContent}
         </div>
        <img src="${post.image
          }" class="card-img-top img-thumbnail r" alt="Post img" >
        <div class="card-body" onclick="postClicked(${post.id
          })" style="cursor: pointer;">
            <h5 class="card-title">${userTitle}</h5>
            <p class="card-text">${post.body}.</p>
            <p class="card-text"><small class="text-body-secondary">Last updated ${post.created_at
          }  </small></p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                           <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                   </svg>
                <span>
                     (${post.comments_count}) Comments
                  <span id="post-tags-${post.id}">
                 </span>
            </span>  
      </div>
          </div>
             </div>`;
        document.querySelector(".posts").innerHTML += content;
        const currentPostTags = `post-tags-${post.id}`;
        document.getElementById(currentPostTags).innerHTML = "";
        for (tag of post.tags) {
          console.log(tag);
          let tagsContent = `<button class="btn btn-sm rounded-5" style="background-color:gray;color:white">
                      ${tag.name}
                    </button>`;
          document.getElementById(currentPostTags).innerHTML += tagsContent;
        }
      }
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    }).finally(()=>{
      showLoader(false)
    })
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
  //TODO:=>
  // const alert = bootstrap.Alert.getOrCreateInstance('#Show-Alert')
  //  alert.close()
}

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
      getPosts();
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

// CREATE POST MODAL//
PostNav.addEventListener("click", () => {
  const postTitle = document.getElementById("post-title-input").value;
  const PostBody = document.getElementById("post-body-input").value;
  const PostImage = document.getElementById("post-image-input").files[0];
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("title", postTitle);
  formData.append("body", PostBody);
  formData.append("image", PostImage);
  showLoader(true)
  const URL = `${baseUrl}/posts`;
  axios
    .post(
      URL,
      formData,
      (headers = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
    )
    .then((response) => {
      
      console.log(response);
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("Post Has Been Created", "success");
      setupUi();
      getPosts();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    }).finally(()=>{
      showLoader(false)
    })
});

// --CREATE POST MODAL---//
//function setup ui switch between login/logout
function setupUi() {
  const PostBtn = document.getElementById("post-btn");
  const loginBtn = document.getElementById("login-Btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const token = localStorage.getItem("token");

  if (token == null) {
    // user is gust
    PostBtn.style.display = "none";
    loginBtn.style.display = "flex";
    registerBtn.style.display = "flex";
    logoutBtn.style.display = "none";
    document
      .getElementById("nav-section")
      .style.setProperty("display", "none", "important");
  } else {
    // user logged in
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "flex";
    PostBtn.style.display = "flex";
    document
      .getElementById("nav-section")
      .style.setProperty("display", "flex", "important");
    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-user-image").src = user.profile_image;
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

function postClicked(postId) {
  window.location.href = `PostDetails.html?postid=${postId}`;
}

function userClicked(userId) {
  window.location.href = `UserProfile.html?userid=${userId}`;
}

function profileClicked() {
  const user = getCurrentUser()
  const userid = user.id
  window.location.href = `UserProfile.html?userid=${userid}`;
}
function editPostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  console.log(post);

  const postTitle = (document.getElementById("post-title-edit").value =
    post.title);
  const PostBody = (document.getElementById("post-body-edit").value =
    post.body);
  const postId = (document.getElementById("post-id").value = post.id);
  console.log(postId);
}
// EDIT POST LOGIC REQUEST
EditPostNav.addEventListener("click", () => {
  let postid = document.getElementById("post-id").value;
  const postTitle = document.getElementById("post-title-edit").value;
  const PostBody = document.getElementById("post-body-edit").value;
  const PostImage = document.getElementById("post-image-edit").files[0];
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("title", postTitle);
  formData.append("body", PostBody);
  formData.append("image", PostImage);
  showLoader(true)
  const URL = `${baseUrl}/posts/${postid}`;
  axios
    .post(
      URL,
      formData,
      (headers = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
    )
    .then((response) => {
      showLoader(false)
      console.log(response);
      const modal = document.getElementById("edit-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("Post Has Been Updated", "success");
      getPosts();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
});


function deletePostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("del-post-id").value = post.id
  console.log(post);
}

delPostNav.addEventListener("click", () => {
  console.log()
  const token = localStorage.getItem("token");
  let postId = document.getElementById("del-post-id").value;
  showLoader(true)
  const URL = `${baseUrl}/posts/${postId}`;
  axios
    .delete(
      URL,
      (headers = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
    )
    .then((response) => {
      showLoader(false)
      console.log(response);
      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("Post Has Been Deleted", "danger");
      getPosts();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
});


function showLoader(show=true) {
  if(show) {
    document.getElementById("loader").style.visibility= "visible"
  } else {
     document.getElementById("loader").style.visibility= "hidden"
  }
}