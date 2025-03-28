const form =document.getElementById('registerForm');
const messageDiv=document.getElementById('message');

form.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const formData={
        username:form.username.value,
        email: form.email.value,
        password: form.password.value,
    };
    try{
        const response= await fetch('http://localhost:3000/api/users/register',{
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
        });
        if(response.ok){
            messageDiv.style.color = 'green';
            messageDiv.innerHTML = `User registered successfully. <a href="/login" class="text-blue-500 underline ml-2">Login here</a>`;


        }else if(response.status===400){
            // error handlying 
            messageDiv.style.color='red';
            messageDiv.textContent='User Already exist. Please try a different email or username.';

        }else{
            const errorMessage=await response.text();
            messageDiv.style.color='red';
            messageDiv.textContent=errorMessage;
        }
    }catch (err){
        console.error('Error', err);
        messageDiv.style.color='red';
        messageDiv.textContent='Something went wrong. Please try again.';
    }
});