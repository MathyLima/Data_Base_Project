import React, { Component } from 'react';
import axios from 'axios';
import './formulario.css'
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
        <h2>Formulário de Cadastro</h2>
        <form className='Formulario' onSubmit={this.handleSubmit}>
          {this.formFields.map((field) => (
            <div className='Container' key={field.name}>
              <label className='Label'>{field.label}:</label>
              <input
                className='Input-Box'
                type={field.type}
                name={field.name}
                value={this.state[field.name] || ''}
                onChange={this.handleInputChange}
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
