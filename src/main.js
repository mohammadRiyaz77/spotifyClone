import './style.css';

document.addEventListener("DOMContentLoaded",()=>{
  // check if we login we are in dashboard else login page
  if(localStorage.getItem("accessToken")){
    window.location.href="dashboard/dashboard.html";
  }
  else{
    window.location.href = "login/login.html";
  }
});

