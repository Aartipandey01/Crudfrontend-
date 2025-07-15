import react,{useState} from "react";

import CrudTable from "./CrudTable";
import Login from "./Login";

function App(){
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  return (
    <div>
      {isLoggedIn ? (
        <CrudTable/>
      ) : (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  )
}
  


export default App;