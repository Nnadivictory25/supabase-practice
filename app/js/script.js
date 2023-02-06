const signUpForm = document.querySelector("#signUpform");
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
let userId

if (signUpForm) {
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          username: userName.value,
        },
      },
    });

    console.log(data, error);

    if (data.user) {
      alert('Check your email for confirmation')
      window.location.href = "login.html"
    } else if (error) {
      alert(error)
    }
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
    if (data.session !== null) {
      isLoggedIn = true;
      userSession = data.session;
      login();
    } else {
      isLoggedIn = false
    }
    console.log(data);
    console.log(error);

    error && alert(error)
  });
}

const getUserSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  console.log(data);
  if (data.session !== null) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }
  return isLoggedIn;
};

const login = () => {
  if (isLoggedIn) {
    setTimeout(() => {
      window.location.href = "logged.html";
    }, 2000);
  }
};

const updateUsername = () => {
  const userNameEl = document.querySelector(".username");
  userNameEl.textContent = userSession.session.user.user_metadata.username;
}

const logOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
  }
  alert('You have been signed out')
  
  window.location.href = "login.html"
};

const checkUser = async () => {
  getUserSession()

  if (!isLoggedIn) {
    window.location.href = "login.html"
  } else {
    updateUsername()
    updateUI()
  }

}

const checkLoginStaus = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (data.session !== null) {
    isLoggedIn = true;
    userSession = data;
    userId = userSession.session.user.id
    if (!window.location.href.includes('logged')) {
      window.location = "logged.html"
      updateUsername()
    }
    console.log(isLoggedIn, userId)
  } else {
    isLoggedIn = false
  }
}
checkLoginStaus()


const updateUI = async () => {
  const todoDataStatus = document.querySelector('#todoDataStatus')
  const todoList = document.querySelector('.todoList')
  todoList.innerHTML = 'Loading...'
  

  
  const { data, error } = await supabase
  .from('todos')
  .select('*')
  .eq('user_id', userId) 
  
  error && alert(error)
  let todos = data
  console.log(data)
  console.log(error)

  if (todos.length == 0) {
    console.log('empty todo')
    todoDataStatus.textContent = 'No todos found!'
    todoList.innerHTML = ''
  } else {
    todoList.innerHTML = ''
    todoDataStatus.textContent = ""
    todos.forEach(todoObj => {
      const { done, id, todo } = todoObj;
      todoList.innerHTML += 
      `<li id=${id} class="todoListItem bg-slate-500 p-3 text-white w-96 my-4">
      <p class="todo">${todo}</p>
      <p class="done">Done: <span id="bool">${done}</span></p>
      <div onclick="deleteTodo(this)" class="deleteBtn"><i class="bi bi-trash3"></i></div>
    </li>`
    })
  }
}

const addTodo = async (todoELe) => {
  let todo = todoELe.value
  const { data, error } = await supabase
  .from('todos')
  .insert({user_id: userId, todo: todo })
  .select('*')
  
  if (data) {
    updateUI()
    todoELe.value = ''
    console.log(this)
  }

  console.log(data)
  console.log(error)
}

const deleteTodo = async (ele) => {
  let id = ele.parentElement.id
  console.log(id)

  const { error } = await supabase
  .from('todos')
  .delete()
  .eq('id', id)
  
  error && alert(error)

  updateUI()
}