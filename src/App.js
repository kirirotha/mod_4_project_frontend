import React, { Component } from 'react';
import './App.css';

import Login from './Components/auth/Login'
import SignUp from './Components/auth/SignUp'
import User from './Components/User'
import Game from './Components/Game'




import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

// import staticBooks from './books'

class App extends Component {
  state ={
    loggedIn: false,
    username: "",
    userId: "",
    game: "",
    opponentName: ""
  }

  componentDidMount(){
    if(localStorage.getItem('auth_key')){
      this.setState({
        ...this.state,
        username: localStorage.getItem('username'),
        userId: localStorage.getItem('userId'),
        loggedIn: true
      })
      
    }
  }

  handleLogIn = (username, userId) =>{
    if(localStorage.getItem('auth_key')){
      this.setState({
        ...this.state,
        loggedIn: true,
        username: username,
        userId: userId
      })
      // console.log('logging in')
    }
  }

  failedLogIn = () =>{
    localStorage.clear()
    this.setState({
      ...this.state,
      loggedIn: false,
      username: ""
    }, () =>{
      return <Redirect push to="/login" />
    })
  }

  handleLogOut = () =>{
    localStorage.clear()
    this.setState({
      ...this.state,
      loggedIn: false,
      username: "",
      userId: ""
    }, () =>{
      return <Redirect push to="/login" />
    })
  }

  handleContinue = (game, opponentName) =>{
    // console.log(game)
    this.setState({
      ...this.state,
      game: game,
      opponentName: opponentName
    })
  }

  backToUser = () =>{

  }

  render(){

    // const loggedIn = () =>{localStorage.getItem('auth_key') ? true : false }

    return (
      <div className="parent" >
        <BrowserRouter>


          <Switch>

            <Route exact path="/" component={() => {
              if(localStorage.getItem('auth_key')){
                return <User handleLogOut={this.handleLogOut}/>
              }else{
                return <Redirect to="/login" />
              }
            }} />

            <Route path="/login" component={() =>{
              return <Login handleLogIn={this.handleLogIn} failedLogIn={this.failedLogIn}/> 
            }}/>

            <Route path="/signup" component={SignUp} />

            <Route path="/user" component={() => {
              return <User handleLogOut={this.handleLogOut} username={this.state.username} userId={this.state.userId} handleContinue={this.handleContinue}/>}} />

            <Route path="/game" component={() => {
              return <Game handleLogOut={this.handleLogOut} username={this.state.username} opponentName={this.state.opponentName}
                            userId={this.state.userId} backToUser={this.backToUser} game={this.state.game}/>}} />

            <Route path="/logout" component={() => {
              localStorage.clear()
              this.handleLogOut()
              return <Redirect to="/login" />
            }} />

            <Route>
              <Redirect to="/" />
            </Route>

          </Switch>

        </BrowserRouter>
      </div>
    );
  }
}

export default App;