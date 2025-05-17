const formDOM = document.querySelector('.form')
const passwordInputDOM = document.querySelector('.password-input')
const emailInputDOM = document.querySelector('.email-input')
const formAlertDOM = document.querySelector('.form-alert-user')
const btnLoginDOM = document.querySelector('.btn-login')


btnLoginDOM.addEventListener('click', async (e) => {

  e.preventDefault();
  password = passwordInputDOM.value;
  email = emailInputDOM.value;

  try
  {
    const { data } = await axios.post('/api/v1/auth/login', {email, password });
    console.log(data.user)
    location.href='./tasks.html'
    console.log(document.cookie)
    
  }
  catch(error)
  {
    formAlertDOM.style.display = 'block'
     formAlertDOM.classList.add('text-success')
    formAlertDOM.textContent = error.response.data.msg
   
  }
 
  
  
});



