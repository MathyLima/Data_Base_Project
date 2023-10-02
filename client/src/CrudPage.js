import React, { Component } from 'react';
import CreateForm from './CreateForm';
import ReadDeleteForm from './ReadDeleteForm';
import ReadUpdateForm from './ReadUpdateForm';


class CRUDPage extends Component {
  constructor() {
    super();
    this.state = {
      activeSection: 'create', // Define a seção ativa inicialmente
    };
  }

  render() {
    const { activeSection } = this.state;

    return (
      <div style={containerStyle}>
        <nav style={navContainerStyle}>
          <ul style={navStyle}>
            <li
              style={navItemStyle}
              onClick={() => this.setActiveSection('create')}
            >
              Create
            </li>
            <li
              style={navItemStyle}
              onClick={() => this.setActiveSection('read-delete')}
            >
              Search-Delete
            </li>
            <li
              style={navItemStyle}
              onClick={() => this.setActiveSection('update')}
            >
              Search-Update
            </li>
          </ul>
        </nav>

        <div style={formContainerStyle}>
          {activeSection === 'create' && <CreateForm />}
          {activeSection === 'read-delete' && <ReadDeleteForm />}
          {activeSection === 'update' && <ReadUpdateForm />}
        </div>
      </div>
    );
  }

  setActiveSection = (section) => {
    this.setState({ activeSection: section });
  };
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh', // Defina a altura da tela inteira para centralizar verticalmente.
};

const navContainerStyle = {
  width: '50%',
};

const navStyle = {
  listStyleType: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
};

const navItemStyle = {
  flex: 1,
  padding: '10px',
  backgroundColor: '#eee',
  cursor: 'pointer',
  textAlign: 'center',
};

const formContainerStyle = {
  width: '50%', // Define a largura para ocupar a largura total.
  padding: '20px', // Adicione algum espaço ao redor dos formulários.
};

export default CRUDPage;
