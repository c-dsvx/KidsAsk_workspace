
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import FirstQuiz from './pages/FirstQuiz';
import EndQuiz from './pages/EndQuiz';

import SpeQuiz from './pages/SpeQuiz';

import PostExploration from './pages/PostExploration'
import QaPhase from "./pages/QaPhase";
import PreExplorationIntro from "./pages/PreExplorationIntro";
import PreExplorationOutro from "./pages/PreExplorationOutro";
import Exploration from "./pages/Exploration";
import PostExplorationIntroFinished from "./pages/PostExplorationIntroFinished";
import Intro from "./pages/Intro";
import UserContext from "./context/UserContext";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import { addUserInput, updateLastURl } from "./services";

function RouteHOC (props) {
  useEffect(() => {
    console.log(props.location.pathname)
    ;(async function () {
      await updateLastURl(props.user.identifiant, props.location.pathname)
    })()
  }, [props.location.pathname])
  return <>
    {props.render(props)}
  </>
}

function App(props) {
  const [user, updateUser] = useState({
    identified: false,
  })

  console.log({ user })

  const setUser = (u) => {
    updateUser({
      ...user,
      ...u
    })
  }
  const [notLogin, setNotLogin] = useState(false)
  useEffect(() => {
    if (user && user.identified) {
      window.localStorage.setItem('user', JSON.stringify(user))
    }
  }, [user])

  useEffect(() => {
    const savedUser = window.localStorage.getItem('user')
    if (savedUser && JSON.parse(savedUser).identified) {
      setUser(JSON.parse(savedUser))
    } else {
      setNotLogin(true)
    }
  }, [])

  return (
    <div>
      <UserContext.Provider value={{user, setUser}}>
        <Router>
          {
            notLogin &&
            <Redirect to="/" />
          }
          <Switch>
          <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/intro">
              <Intro />
            </Route>
            <Route path="/first-quiz/:id" component={(props) => (<RouteHOC {...props} user={user} render={FirstQuiz} />)} />
            <Route exact path="/spe-quiz/:id"  component={(props) => (<RouteHOC {...props} user={user} render={SpeQuiz} />)} />

            <Route path="/spe-quiz/:id/:exploration" component={(props) => (<RouteHOC {...props} user={user} render={SpeQuiz} />)} />

            <Route path="/end-quiz" component={(props) => (<RouteHOC {...props} user={user} render={EndQuiz} />)} />

            <Route path="/qa-phase/:id/:nextTopic" component={(props) => (<RouteHOC {...props} user={user} render={QaPhase} />)} />

            <Route path="/pre-exploration-intro/:id"  component={(props) => (<RouteHOC {...props} user={user} render={PreExplorationIntro} />)} />

            <Route path="/pre-exploration-outro/:id" component={(props) => (<RouteHOC {...props} user={user} render={PreExplorationOutro} />)} />

            <Route path="/exploration/:id" component={(props) => (<RouteHOC {...props} user={user} render={Exploration} />)} />

            <Route path="/post-exploration/:id" component={(props) => (<RouteHOC {...props} user={user} render={PostExploration} />)} />

            <Route path="/post-exploration-finished/:id" component={(props) => (<RouteHOC {...props} user={user} render={PostExplorationIntroFinished} />)} />
            
          </Switch>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
