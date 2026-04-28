import React from "react";

const SignIn = () => {
  return (
    <>
      <main>
        <form action="/action_page.php" method="post">
          <div>
     
            <label htmlFor="uname"><b>Username</b></label>
          
            <input type="text" placeholder="Enter Username" name="uname" required />
          </div>
          <div>
            <label htmlFor="psw"><b>Password</b></label>
          
           <input type="password" placeholder="Enter Password" name="psw" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </main>
    </>
  );
}

export default SignIn;