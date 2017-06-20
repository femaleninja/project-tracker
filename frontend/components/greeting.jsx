import React from 'react';
import { logout } from '../actions/session_actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Greeting extends React.Component {

  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.props.logout();
  }

  render() {
    const user = this.props.user;

    if (user) {
      return (
        <div className='greeting'>
          <p className='name'>{`${user.name}`}</p>
          <button onClick={this.handleLogout}>Sign Out</button>
        </div>
      );
    } else {
      return (
        <div className='greeting'>
          <Link className='button' to='/login'>Sign In</Link>
          <Link className='button' to='/signup'>Sign Up</Link>
        </div>
      );
    }
  }
}


const mapStateToProps = (state) => ({
  user: state.session.currentUser
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Greeting);