import React, {Component} from 'react';

class Login extends Component {
  constructor(props){
    super(props)

    this.state = {
      username:"",
      password:""
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    fetch(`http://localhost:3005/login`,{
      method: `POST`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user:this.state.username, pass:this.state.password })
    }).then(response => response.json())
    .then(json => {
      if(json.err)
        throw new Error(json.err)
      else
        this.props.loginCallback(json.token)
    })
    .catch(console.error)

    event.preventDefault();
  }

  render(){
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="Login">
          username:<input id="user" onChange={evt => {this.setState({username: evt.target.value})}}/>
          password:<input id="pass" onChange={evt => {this.setState({password: evt.target.value})}}/>
          <input type="submit" />
        </div>
      </form>
    );
  }
}
  
  export default Login;
  