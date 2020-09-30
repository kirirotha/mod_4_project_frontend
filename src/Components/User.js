import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import Tiles from './Tiles'

class User extends React.Component {

  state = {
    username: '',
    password: '',
    stayLoggedIn: false,
    friendships: [],
    myFriends: [],
    myGames: []
  }

  componentDidMount(){
    this.getFriendships()
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


  getFriendships = () =>{
      fetch('http://localhost:3001/friendships')
      .then(res => res.json())
      .then(friendships =>{
        // console.log(friendships)
        this.findFriendships(friendships)  
      })
  }

  findFriendships = (friendships) =>{
    let myFriendships = friendships.filter(friends =>{
        if(friends.user1_id === this.props.userId || friends.user2_id === this.props.userId){
            return friends
        }
        return
    })
    this.setState({
        ...this.state,
        friendships: myFriendships
    }, () => this.findFriends())
  }

  findFriends = () =>{
    fetch('http://localhost:3001/users')
      .then(res => res.json())
      .then(users =>{
        // console.log(users)
        this.getFriends(users)
    })
  }

  getFriends = (users) =>{
      //console.log(users)
      let myFriendIds = this.state.friendships.map(friendship =>{
          if(friendship.user1_id === this.props.userId){
            return friendship.user2_id
          }else if(friendship.user2_id === this.props.userId){
            return friendship.user1_id
          }
      })
      let myFriends = myFriendIds.map(id =>{
          for(let i=0; i < users.length; i++){
            if(users[i].id === id){
                return users[i]
            }
          }
      })
      this.setState({
        ...this.state,
        myFriends: myFriends
      }, () => {
            this.renderFriends()
            this.getGames()
        })
  }

  renderFriends = () =>{
    let i = 0
    return this.state.myFriends.map(friend =>{
        i++
        return <div key={i}>
                    <h2 style={{marginTop:'30px'}}>{friend.username}
                        <button id="start-game" type="start-game" 
                        value={friend.id} onClick={this.handleStartNewClick}
                        style={{position:'absolute', right:'20px'}}>Start Game</button>

                    </h2>   
                </div>
    })
  }

  getGames = () =>{
    fetch('http://localhost:3001/games')
    .then(res => res.json())
    .then(games =>{
      this.findGames(games)  
    })
  }

  findGames = (games) =>{
    let myGames = games.filter(game =>{
        if(game.user1_id === this.props.userId || game.user2_id === this.props.userId){
            return game
        }
        return
    })
    // console.log(myGames)
    this.setState({
        ...this.state,
        myGames: myGames
    }, () => this.renderGames())
  }

  renderGames = () =>{
    let i = 0
    return this.state.myGames.map(game =>{
        i++
        let opponentName = this.getOpponentName(game)
        let userScore = this.getUserScore(game)
        return <div key={i}>
                    <h2 style={{marginTop:'30px'}}>
                        {`vs. ${opponentName}`}
                        {this.renderGameButton(game,opponentName,userScore)}
                    </h2>   
                </div>
    })
  }

  renderGameButton = (game, opponentName, userScore) => {
    if(this.props.userId === game.user2_id && game.accepted === false){
      return(<button id="pending" type="pending" 
      value="pending" 
      style={{position:'absolute', right:'20px', backgroundColor: 'red'}}>Pending</button>)
    }else if(this.props.userId === game.user1_id && game.accepted === false){
      return(<Link to='/game'><button id="accept-game" type="accept-game" 
      value="accept-game" onClick={() => this.handleAcceptGameClick(game, opponentName, userScore)}
      style={{position:'absolute', right:'20px', backgroundColor: 'orange'}}>Accept Game Request</button></Link>)
    }else{
      return(<Link to='/game'><button id="continue-game" type="continue-game" 
      value="continue-game" onClick={() => this.handleContinueClick(game, opponentName, userScore)}
      style={{position:'absolute', right:'20px'}}>Continue Game</button></Link>)
    }
  }

  handleAcceptGameClick = (game, opponentName, userScore) =>{
    let newTiles =this.setTiles()
    this.props.setTiles(newTiles, opponentName, game.user1_id, game.user2_id, game.id)
  }

  getOpponentName = (game) =>{
      let opponent = this.state.myFriends.filter(friend =>{
          if(game.user1_id === friend.id || game.user2_id === friend.id){
              return friend
          }
      })
      return opponent[0].username
  }

  getUserScore = (game) =>{
    let userScore = ""
    if (this.props.userId === game.user1_id){
      userScore = game.user1_score
    }else{
      userScore = game.user2_score
    }
    return userScore
  }

  handleLogOutClick = () => {
    // console.log(this.props)
    this.props.handleLogOut()
  }

  handleContinueClick = (game, opponentName, userScore) => {
    // console.log(game)
    this.props.handleContinue(game, opponentName, userScore)
  }
   
  handleStartNewClick = (e) =>{
    // console.log(e.target.value)
    this.createNewGame(e.target.value)
  }


  setTiles = () =>{
    let unusedTiles =['A','A','A','A','A','A','A','A','A','B','B','C','C','D','D','D','E','E','E','E','E','E','E','E','E','E','E','E','F','F','G','G','G','H','H','I','I','I','I','I','I','I','I','I','J','K','L','L','L','L','M','M','N','N','N','N','N','O','O','O','O','O','O','O','O','P','P','P','Q','R','R','R','R','R','R','S','S','S','S','T','T','T','T','T','T','U','U','U','U','V','V','W','W','X','Y','Y', 'Z', '*', '*']
    let userBag1 = []
    let userBag2 = []
    for( let i = 0; i < 7; i++){
      let randIndex = Math.floor(Math.random() * unusedTiles.length)
      let drawnTile = unusedTiles.splice(randIndex, 1)[0]
      userBag1.push(drawnTile)
    }
    for( let i = 0; i < 7; i++){
      let randIndex = Math.floor(Math.random() * unusedTiles.length)
      let drawnTile = unusedTiles.splice(randIndex, 1)[0]
      userBag2.push(drawnTile)
    }
    let user1_bag = userBag1.join('_')
    let user2_bag = userBag2.join('_') 
    this.props.setTiles([user1_bag, user2_bag])
    return[user1_bag, user2_bag]
  }

  createNewGame = (id) => {
    let newTiles =this.setTiles
    let newGame ={
    "user1_id": Number(id),
    "user2_id": this.props.userId,
    "user1_score": 0,
    "user2_score": 0,
    "user1_bag": newTiles[0],
    "user2_bag": newTiles[1],
    "accepted": false,
    "active": true,
    "player1turn": true
    }
    console.log(newGame)
    this.renderNewGame(newGame)
    fetch('http://localhost:3001/games',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newGame)
    })
    .then(res => res.json())
    .then(game =>{
      //console.log(game)
    })
  }

  renderNewGame = (newGame) => {
    let gameList = this.state.myGames
    gameList.push(newGame)
    this.setState({
      ...this.state,
      myGames: gameList
    })
  }


  render(){
    return (
        <div>
            <div className='background'></div>
            <div className='crab1'></div>
            <div className="user-info">
                <div className="username-block">
                    <div className="user-page-form" style={{marginTop:'10px', maxWidth:'900px', textAlign: 'left', padding: '35px'}}>
                        <h2 style={{fontSize: '40px'}}> Hello {this.props.username} ! </h2>   
                        <Link to='/login'><button id="logout" value="logout" onClick={this.handleLogOutClick}
                                            style={{marginTop:'10px', width:'20%'}}>Log Out </button></Link>
                    </div>
                </div>
                <div className="friends-block">
                    <div className="user-page-form" style={{marginTop:'10px', marginBottom:'10px', maxWidth:'100%', height:'640px', textAlign: 'left', padding: '35px'}}>
                        <h2 style={{fontSize: '40px'}}> Friends </h2>   
                        {this.renderFriends()}                       
                    </div>
                </div>
                <div className="active-games-block">
                    <div className="user-page-form" style={{marginTop:'10px', maxWidth:'100%', height:'640px', textAlign: 'left', padding: '35px'}}>
                        <h2 style={{fontSize: '40px'}}> ActiveGames </h2>   
                        {this.renderGames()}   
                    </div>
                </div>
            </div>              
        </div>

        
    )
  }
}

export default withRouter(User);