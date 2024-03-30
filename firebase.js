const firebaseConfig = {
    apiKey: "AIzaSyAMFeXlWp-3cqN7EHXiMtFD6DIX8PRcQLE",
    authDomain: "myblogproject-6d8d8.firebaseapp.com",
    databaseURL: "https://myblogproject-6d8d8-default-rtdb.firebaseio.com",
    projectId: "myblogproject-6d8d8",
    storageBucket: "myblogproject-6d8d8.appspot.com",
    messagingSenderId: "8410087116",
    appId: "1:8410087116:web:97ca6f7123097eb1fb8c69"
  };
    
      const frb = firebase.initializeApp(firebaseConfig);
      console.log(frb.database);
      const auth = firebase.auth();

      // sign up
    function signup(){
        let email = document.getElementById("email");
        let password = document.getElementById("password")
      
        console.log(email.value, password.value);
      
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
          // Signed in 
          var user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
      
        });
      
      }

         // login

    function login(){
        let email = document.getElementById("emaillogin");
        let password = document.getElementById("passwordlogin")
        
        firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
          var user = userCredential.user;
        console.log('user',user);
        document.getElementsByClassName('login-main').display= 'none'
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log('errorMessage',errorMessage);
        });
      }
      
         // signout

 
    function logOut(){
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log("User signed out successfully");
    
            // Clear the email and password input fields
            let email = document.getElementById("emaillogin");
            let password = document.getElementById("passwordlogin")
    
            if (email && password) {
                email.value = '';
                password.value = '';
            }
    
            // Clear the value of the button
            var logoutButton = document.getElementById('logOut');
            if (logoutButton) {
                logoutButton.value = '';
            }
        }).catch(function(error) {
            // An error happened.
            console.error("Error signing out:", error);
        });
    }
    
        // blog
    
    const my_blog = document.querySelector('.my_blog')
    const login_page = document.querySelector('.login')
    const signupForm = document.querySelector('.signup')
    const loginmain = document.querySelector(".login-main")

  auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('login',user);
        signupForm.style.display = 'none';
        login_page.style.display = 'none';
        loginmain.style.display = 'none'
        my_blog.style.display = 'block';
    } else {
        // User is signed out
        signupForm.style.display = 'block';
        login_page.style.display = 'block';
        loginmain.style.display = 'block'
        my_blog.style.display = 'none';
    }
});
    
    // blog post
const notify = document.querySelector('.notifiy')


function Add_Post(){
  const title = document.querySelector('#title').value;
  const post_content = document.querySelector('#post_content').value;
 
  console.log(title, post_content);

  console.log("add");


  let key = firebase.database().ref("addblog").push().key;
  console.log(key)

let obj ={
        title:title,
        post_content:post_content,
        key:key,
    }
  firebase.database().ref("addblog").child(key).set(obj);

  notify.innerHTML = "data Added"
    document.querySelector('#title').value="";
   document.querySelector('#post_content').value="";
}

firebase.database().ref("addblog").on("child_added", (data) => {
    console.log(data);
    let title = data.val().title;
    let description = data.val().post_content;
    let todo = data.val().value;
    

    let todoElement = document.createElement("div");
    todoElement.classList.add("todo");

   
    let titleElement = document.createElement("h2");
    let descriptionElement = document.createElement("p");
    
    titleElement.textContent = title;
    descriptionElement.textContent = description;
 
    todoElement.appendChild(titleElement);
    todoElement.appendChild(descriptionElement);
   
    let list = document.getElementById("list");
    list.appendChild(todoElement);
// });




    //       Edit Btn

    let editBtn = document.createElement("button");
     let editBtnText = document.createTextNode("Update");

     editBtn.style.margin = "5px"; 
     editBtn.style.backgroundColor = "green"
    editBtn.style.borderRadius = "5px"; 
    editBtn.style.color = "white"; 
    editBtn.style.border = "none";
 
     editBtn.appendChild(editBtnText)

     todoElement.appendChild(editBtn)
   
     editBtn.setAttribute("onclick", "editItem(this)")


     editBtn.setAttribute("id", data.val().key)
  console.log( data.val());

    //  Delete Btn

    let deleteBtn = document.createElement("button");
    let deleteBtnText = document.createTextNode("Delete")
    

    deleteBtn.style.backgroundColor = "red";
deleteBtn.style.margin = "5px"; 
deleteBtn.style.borderRadius = "5px"; 
deleteBtn.style.color = "white"; 
deleteBtn.style.border = "none"; 

    console.log(deleteBtnText);

    deleteBtn.appendChild(deleteBtnText)

    todoElement.appendChild(deleteBtn)

    deleteBtn.setAttribute("id", data.val().key)

    deleteBtn.setAttribute("onclick", "deleteItem(this)")
})

function deleteItem(a){

  console.log(a.id);
 
   firebase.database().ref("addblog").child(a.id).remove();
    a.parentNode.remove();
    notify.innerHTML = "data deleted"
 }




function editItem(e){

console.log(e.parentNode.children[0]);
  let val =e.parentNode.children[0];

  console.log(e.id);
  // let userInput = prompt("Enter Updated Value");
  const title = document.getElementById('title');
  const post_content = document.querySelector('#post_content');
  title.value = e.parentNode.children[0].innerHTML
  post_content.value = e.parentNode.children[1].innerHTML
  const post_btn = document.querySelector('#post_btn');
  post_btn.innerHTML= 'Update Post'
  post_btn.onclick = ()=> updatePost(e)      // console.log(e);


}
function updatePost(e){
const title = document.getElementById('title');
const post_content = document.querySelector('#post_content');
notify.innerHTML = "data updated"
let editTodo ={
    title:title.value,
    post_content:post_content.value,
    key:e.id,
  }

  console.log(editTodo);
  firebase.database().ref("addblog").child(e.id).set(editTodo)

  e.parentNode.children[0].innerHTML = editTodo.title;
  e.parentNode.children[1].innerHTML = editTodo.post_content
}

// // Sign in with google

function signInWithGoogle(){
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    var credential = result.credential;

   
    var token = credential.accessToken;
  
    var user = result.user;
    console.log(user);
   
      // ...
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    console.log(errorMessage);
    // ...
  });
}

// function signInWithGoogle () {
//   var provider = new firebase.auth.GoogleAuthProvider();
// console.log(provider)
//   firebase.auth().signInWithPopup(provider)
// .then((result) => {
//   /** @type {firebase.auth.OAuthCredential} */
//   var credential = result.credential;
//   console.log(credential);
//   // This gives you a Google Access Token. You can use it to access the Google API.
//   var token = credential.accessToken;
//   // The signed-in user info.
//   var user = result.user;
//   console.log(user)
//   sessionStorage.setItem('email', user.email);
//   window.location.href = '../index.html'
//   // IdP data available in result.additionalUserInfo.profile.
// auth.createUserWithEmailAndPassword(email, password)
//   .then(function (userCredential) {
//     // Signed up 
//     var user = userCredential.user;
//     // ...
// }).catch((error) => {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // The email of the user's account used.
//   var email = error.email;
//   // The firebase.auth.AuthCredential type that was used.
//   var credential = error.credential;
//   console.log(error)
//   // ...
// });
// }
// )}