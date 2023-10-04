import React, { Component } from 'react';
import axios from 'axios';
import { formFields } from './components/formField'; // Certifique-se de que o caminho do seu módulo está correto
import './formulario.css';

class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: '',
      busto: '',
      quadril: '',
      cintura: '',
      tecidoPreferencia: '',
      ultimaCompra: '',
      valorUltimaCompra: '',
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    // Verifique se todos os campos obrigatórios estão preenchidos
    const requiredFields = formFields.filter((field) => !this.state[field.name]);
    if (requiredFields.length > 0) {
      alert('Todos os campos são obrigatórios. Por favor, preencha todos os campos.');
      return;
    }

    // Obtenha os valores do estado do formulário
    const formValues = {};
    formFields.forEach((field) => {
      formValues[field.name] = this.state[field.name];
    });

    try {
      const response = await axios.post('/api/create_client', formValues);
      // Faça uma requisição POST para criar um registro
      if (response.status === 200) {
        console.log('Registro Criado com sucesso!');

        // Limpe os campos do formulário
        const emptyState = {};
        formFields.forEach((field) => {
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
        <h2>Formulário de Cadastro</h2>
        <form className='Formulario' onSubmit={this.handleSubmit}>
          {formFields.map((field) => (
            <div className='Container' key={field.name}>
              <label className='Label'>{field.label}:</label>
              <input
                className='Input-Box'
                type={field.type}
                name={field.name}
                value={this.state[field.name]}
                onChange={this.handleInputChange}
                required // Adicione o atributo required para tornar o campo obrigatório
              />
            </div>
          ))}
          <button type="submit" className='Submit-Bottom'>
            Cadastrar
          </button>
        </form>
      </div>
    );
  }
}

export default CreateForm;
