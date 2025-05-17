const formDOM = document.querySelector('.form')
const usernameInputDOM = document.querySelector('.username-input')
const passwordInputDOM = document.querySelector('.password-input')
const emailInputDOM = document.querySelector('.email-input')
const formAlertDOM = document.querySelector('.form-alert-user')
const resultDOM = document.querySelector('.result')
const btnRegDOM = document.querySelector('.btn-register')


btnRegDOM.addEventListener('click', async (e) => {

  e.preventDefault();
  password = passwordInputDOM.value;
  email = emailInputDOM.value;

  try
  {
    const { data } = await axios.post('/api/v1/auth/resetPassword', {email, password});
    formAlertDOM.style.display = 'block'
    formAlertDOM.classList.add('text-success')
    formAlertDOM.textContent=data.msg
    setTimeout(() => {
    formAlertDOM.style.display = 'none'
    usernameInputDOM.value= ''
    passwordInputDOM.value=''
    emailInputDOM.value=''
    location.href="/index.html"
  }, 10000)
  }
  catch(error)
  {
    formAlertDOM.style.display = 'block'
     formAlertDOM.classList.add('text-success')
    formAlertDOM.textContent = error.response.data.msg
    setTimeout(() => {
    formAlertDOM.style.display = 'none'
    location.href="/index.html"
  }, 10000)
  }
 
  
  
});



