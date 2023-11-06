// src/components/SignUp.js
import React, { useState } from 'react';
import { Form, Button, Container} from 'react-bootstrap';
import './SignUp.css';

const SignUp = ({ onSignUp }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent form default behavior
    
    // Storing the values in session storage
    sessionStorage.setItem('firstName', firstName);
    sessionStorage.setItem('lastName', lastName);
    sessionStorage.setItem('email', email);
    
    onSignUp(firstName, lastName, email);
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center dark-theme">
      <div className="gradient-border-wrapper">
      <div className="form-container">
        <Form>
          <Form.Group controlId="formFirstName" className="form-group-spacing">
            <Form.Control 
              className="input-field" 
              type="text" 
              placeholder="First name" 
              value={firstName} 
              onChange={e => setFirstName(e.target.value)} 
              required  // This makes the field mandatory
            />
          </Form.Group>

          <Form.Group controlId="formLastName" className="form-group-spacing">
            <Form.Control 
              className="input-field" 
              type="text" 
              placeholder="Last name" 
              value={lastName} 
              onChange={e => setLastName(e.target.value)} 
              required  // This makes the field mandatory
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="form-group-spacing">
            <Form.Control 
              className="input-field" 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required  // This makes the field mandatory
            />
          </Form.Group>

          <Button className="submit-button" type="submit" onClick={handleSubmit}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
            Submit
          </Button>
        </Form>
      </div>
      </div>
    </Container>
  );
};

export default SignUp;
