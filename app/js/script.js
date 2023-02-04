const signUpForm = document.querySelector("signUpform");
const email = document.querySelector("#email");
const userName = document.querySelector("#username");
const password = document.querySelector("#password");
const SUPABASE_URL = "https://wxrsbfqvdbnwzvrrkgbx.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4cnNiZnF2ZGJud3p2cnJrZ2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU0NjA1MTEsImV4cCI6MTk5MTAzNjUxMX0.icOcvlPstzy4-XZWCxYThM-t7icPouOZBRntfjSEaUs";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let userSession;
let currentUserName;
let isLoggedIn;

if (signUpForm) {
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          uername: userName.value,
        },
      },
    });

    console.log(data, error);
  });
}

// ! LOGIN

if (window.location.href.includes("login")) {
  const loginForm = document.querySelector("#loginForm");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (data) {
      isLoggedIn = true;
      userSession = data;
      login();
    }
    console.log(data);
    console.log(error);
  });
}

const getUserSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  console.log(data.session.user);
  if (data) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }
};

const login = () => {
  if (isLoggedIn) {
    setTimeout(() => {
      window.location.href = "logged.html";
      setTimeout(() => {
        console.log(userSession);
        console.log(isLoggedIn);
      }, 5000);
    }, 2000);
    const userNameEl = document.querySelector(".username");
    // userNameEl.textContent = userSession.user.user_metadata
  }
};

const logOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
  }
  
  window.location.href = "login.html"
};
