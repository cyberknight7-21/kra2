var email_id;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){

       email_id = user.email;
      document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
	  fetchUserDetail();

 
	  

    }

  } else {
    // No user is signed in.

    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";

  }
});

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function logout(){
  firebase.auth().signOut();
}
 var userInfo;
const fetchUserDetail = async function () {

	var userDetails = firebase.database().ref('userDetails/');
	userDetails.once('value', function(snapshot){
		return  snapshot.forEach(user => {
			if (email_id == user.val().email) {
			userInfo ={
				id: user.key,
				email: user.val().email,
				collection: user.val().collectionName
			}
			fetchData();
			}
		})
		
	});

}
function fetchData(){
 console.log(userInfo)
  var tblUsers = document.getElementById('tbl_users_list');
 var databaseRef;

  var rowIndex = 1;
	 databaseRef = firebase.database().ref(userInfo.collection+'/');  
  databaseRef.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
   var childKey = childSnapshot.key;
   var childData = childSnapshot.val();
	
   var row = tblUsers.insertRow(rowIndex);
   var id = row.insertCell(0);
   var aiic = row.insertCell(1);
   var aiictw = row.insertCell(2);
   var aiicwa = row.insertCell(3);
   var aiicp = row.insertCell(4);
   
   id.appendChild(document.createTextNode(childKey));
   aiic.appendChild(document.createTextNode(childData.aiic));
   aiictw.appendChild(document.createTextNode(childData.aiictw));
   aiicwa.appendChild(document.createTextNode(childData.aiicwa));
   aiicp.appendChild(document.createTextNode(childData.aiicp));
   
   rowIndex = rowIndex + 1;
    });
  });
 
}
  function update_user(){
   var id = document.getElementById('id').value;
   var aiic = document.getElementById('aiic').value;
   var aiictw = document.getElementById('aiictw').value;
var aiicwa = document.getElementById('aiicwa').value;
var aiicpp = aiicwa / aiictw;
var aiicp = aiicpp *100;
   var data = {
    id: id,
    aiic: aiic
   }
   console.log(data)
   
   //update data
   var updates = {};
   updates[userInfo.collection + '/' + id] = data;
   firebase.database().ref().update(updates);
   var updates2 = {};
   updates2[userInfo.collection + '/total'] = data;
   firebase.database().ref().update(updates2);
   alert('The user is updated successfully!');
   
   
  }
  //delete user
  function delete_user(){
   var id = document.getElementById('id').value;
  
   firebase.database().ref().child(userInfo.collection + '/' + id).remove();
   alert('The user is deleted successfully!');
   reload_page();
  }
  
  function reload_page(){
   window.location.reload();
  }
  