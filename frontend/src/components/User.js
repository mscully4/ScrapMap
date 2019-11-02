import React from 'react';
import PropTypes from 'prop-types';

function User(props) {
    const logged_out_user = (
      <ul>
        <li onClick={() => props.display_form('login')}>login</li>
        <li onClick={() => props.display_form('signup')}>signup</li>
      </ul>
    );

    const logged_in_user = (
      <ul>
        <li onClick={props.handle_logout}>Logout</li>
      </ul>    
    );

    return <div> { props.logged_in ? logged_in_user : logged_out_user }</div>
}

export default User;

User.propTypes = {
    logged_in: PropTypes.bool.isRequired,
    display_form: PropTypes.func.isRequired,
    handle_logout: PropTypes.func.isRequired,
};
