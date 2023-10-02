import React, { Component } from 'react';
import axios from 'axios';

class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.formFields = [
      { name: 'nome', label: 'Nome do Cliente', type: 'text' },
      { name: 'busto', label: 'Busto', type: 'number' },
      { name: 'quadril', label: 'Quadril', type: 'number' },
      { name: 'cintura', label: 'Cintura', type: 'number' },
      { name: 'tecidoPreferencia', label: 'Tecido de Preferência', type: 'text' },
      { name: 'ultimaCompra', label: 'Última Compra', type: 'date' },
      { name: 'valorUltimaCompra', label: 'Valor da Última Compra', type: 'text' },
      // Adicione mais campos conforme necessário
    ];
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    // Obtenha os valores do estado do formulário
    const formValues = {};
    this.formFields.forEach((field) => {
      formValues[field.name] = this.state[field.name];
    });

    try {
      const response = await axios.post('/api/create_client', formValues);
      // Faça uma requisição POST para criar um registro

      if (response.status === 200) {
        console.log('Registro Criado com sucesso!');

        // Limpe os campos do formulário
        const emptyState = {};
        this.formFields.forEach((field) => {
          emptyState[field.name] = '';
        });
        this.setState(emptyState);
      } else {
        console.error('Erro ao criar registro.');
      }
    } catch (error) {
      console.error('Erro ao criar registro:', error);
    }
  };

  render() {
    return (
      <div>
        <h2>Formulário de Criação</h2>
        <form onSubmit={this.handleSubmit} style={formStyle}>
          {this.formFields.map((field) => (
            <div key={field.name} style={inputContainerStyle}>
              <label style={labelStyle}>{field.label}:</label>
              <input
                type={field.type}
                name={field.name}
                value={this.state[field.name] || ''}
                onChange={this.handleInputChange}
                style={inputStyle}
              />
            </div>
          ))}
          <button type="submit" style={submitButtonStyle}>
            Criar
          </button>
        </form>
      </div>
    );
  }
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '2px solid',
  borderRadius: '10px',
  
};

const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // Centralize os elementos horizontalmente
  marginBottom: '10px',
};

const labelStyle = {
  width: '50%', // Defina a largura da etiqueta para 50%
};

const inputStyle = {
  width: '50%', // Defina a largura das caixas de entrada para 50%
  padding: '5px',
  borderRadius: '5px', // Borda arredondada
  border: '1px solid #ccc',
};
const submitButtonStyle = {
  alignSelf: 'flex-end', // Alinhe o botão à direita
  marginTop: '10px',
  padding: '10px 20px',
  borderRadius: '5px', // Borda arredondada
  backgroundColor: 'orange',
  color: 'white',
  cursor: 'pointer',
};

export default CreateForm;
