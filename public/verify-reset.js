const formErrorDOM = document.querySelector('.form-alert-error-message')
const formLoadDOM = document.querySelector('.form-alert-loading')
const formCompletedDOM = document.querySelector('.form-alert-verify-completed')


const params= window.location.search
const verificationToken = new URLSearchParams(params).get('verificationToken');
const email = new URLSearchParams(params).get('email');

const showTask = async()=>
{
 

    try{

       const { data } = await axios.post('/api/v1/auth/resetVerify', {verificationToken, email});
       if(data.msg === 'Password is Verified')
       {
        formLoadDOM.style.display = 'none'
        formCompletedDOM.style.display = 'block'
        formCompletedDOM.classList.add('text-success')
        

       }
    }

    catch(error)
    {
        formLoadDOM.style.display = 'none'
        formErrorDOM.style.display = 'block'
        formErrorDOM.classList.remove('text-success')
    }

    setTimeout(() => {
        location.href="/index.html"
  }, 5000)
}


showTask();


