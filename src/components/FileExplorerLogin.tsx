import { useState } from "react"

function FileExplorerLogin([onSubmittingForm]){

    // creating a state management of email
    const [email,setEmail] = useState("");


    return(
        <>
          <div>
            <form onSubmit={onSubmittingForm} action={"/submit"} method="POST">
                <label className="email">Email Id: </label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button id="btn-submit">Submit</button>
            </form>
          </div>
        </>
    )
}