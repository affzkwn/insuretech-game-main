import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import 'assets/scss/app.scss';
import Homepage from './modules/homepage/Homepage';
import PersonalInfo from './modules/personalInfo/PersonalInfo';
import Game from './modules/phaser/Game';
import Takaful from './modules/takaful/Takaful';

import bg from 'assets/images/orange.jpg'

function App() {
  return (
    <div className="app bg-light d-flex justify-content-center align-items-center position-relative rounded-3" id={"app"} style={{ background: `url(${bg}) center center`, backgroundSize: '360px 640px'}}>
      <Router>
        
        <Switch>
          <Route
            path={"/info"}
            render={(props) => <PersonalInfo {...props} />}
          />

          <Route
            path={"/plan"}
            render={(props) => <Takaful {...props} />}
          />

          <Route
            path={"/game"}
            render={(props) => <Game {...props} />}
          />

          <Route
            path={"/"}
            render={(props) => <Homepage {...props} />}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
