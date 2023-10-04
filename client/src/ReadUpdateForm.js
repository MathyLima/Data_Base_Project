import React, { Component } from 'react';
import axios from 'axios';
import { formFields } from './components/formField';
import './celulas.css';
import './formulario.css';

class ReadUpdateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      selectedClientId: null,
      searchQuery: '',
      updateFormData: {
        nome_cliente: '',
        busto: '',
        quadril: '',
        cintura: '',
        tecido_preferencia: '',
        // Removi o campo ultima_compra e valorUltimaCompra
      },
      originalClientData: {},
    };
  }

  componentDidMount() {
    this.handleSearchAllClients();
  }

  handleSearchAllClients = () => {
    axios.get(`/api/search_all_clients`)
      .then((response) => {
        this.setState({ clients: response.data, searchResults: response.data });
      })
      .catch((error) => {
        console.error('Erro ao buscar todos os clientes:', error);
      });
  }

  handleClientSelect = (clientId) => {
    const { selectedClientId } = this.state;

    if (selectedClientId === clientId) {
      return;
    }

    this.setState({
      selectedClientId: clientId,
      originalClientData: { ...this.state.clients.find((client) => client.id === clientId) },
    });
    document.body.classList.add('no-scroll');
  };

  handleInputChange = (event) => {
    const searchQuery = event.target.value;
    this.setState({ searchQuery }, () => {
      if (searchQuery === '') {
        this.handleSearchAllClients();
      } else {
        axios.get(`/api/search_clients?name=${searchQuery}`)
          .then((response) => {
            console.log('Solicitação para /api/search_clients concluída com sucesso!');
            this.setState({ searchResults: response.data });
          })
          .catch((error) => {
            console.error('Erro ao fazer uma solicitação para /api/search_clients:', error);
          });
      }
    });
  };

  handleUpdateFormChange = (field) => (event) => {
    const { updateFormData } = this.state;
    updateFormData[field] = event.target.value;
    this.setState({ updateFormData });
  };

  handleSubmitUpdate = (event) => {
    event.preventDefault();
    const { selectedClientId, updateFormData, originalClientData } = this.state;

    const updatedData = { ...updateFormData };
    for (const fieldName in updatedData) {
      if (updatedData[fieldName] === '') {
        updatedData[fieldName] = originalClientData[fieldName];
      }
    }

    axios.put(`/api/update_client/${selectedClientId}`, updatedData)
      .then((response) => {
        if (response.status === 200) {
          console.log(`Dados do cliente com ID ${selectedClientId} atualizados com sucesso!`);
          this.setState({
            updateFormData: {},
          });
          this.handleSearchAllClients();
        } else {
          console.error('Erro ao atualizar os dados do cliente.');
        }
      })
      .catch((error) => {
        console.error('Erro ao atualizar os dados do cliente:', error);
      });
    this.setState({ selectedClientId: null, updateFormData: {}, originalClientData: {} });
    document.body.classList.remove('no-scroll');
  };

  render() {
    const { searchQuery, searchResults, selectedClientId, updateFormData } = this.state;
    return (
      <div>
        <h2>Lista de Clientes</h2>
        <div>
          <input
            type="text"
            placeholder="Pesquisar por nome"
            value={searchQuery}
            onChange={this.handleInputChange}
          />
        </div>
        <div className='container-infos'>
          {Array.isArray(searchResults) ? (
            searchResults.map((client, index) => (
              <div
                key={client.id}
                className='CardStyle'
                onClick={() => this.handleClientSelect(client.id)}
              >
                <p>Nome: {client.nome_cliente}</p>
                {selectedClientId === client.id && (
                  <div className='CardStyle'>
                    <div className='CardStyle'>
                      <p>Busto Largura: {client.busto_largura}</p>
                      <p>Busto Altura: {client.busto_altura}</p>
                      <p>Cintura Largura: {client.cintura_largura}</p>
                      <p>Cintura Altura: {client.cintura_altura}</p>
                      <p>Quadril Largura: {client.quadril_largura}</p>
                      <p>Quadril Altura: {client.quadril_altura}</p>
                    </div>
                    <div className='form-container'>
                      <h3>Formulário de Atualização</h3>
                      <form onSubmit={this.handleSubmitUpdate}>
                        {formFields.map((field) => (
                          <div className='Container' key={field.name}>
                            <label className='Label'>{field.label}:</label>
                            <input
                              className='Input-Box'
                              type={field.type}
                              name={field.name}
                              value={updateFormData[field.name] || ''}
                              onChange={this.handleUpdateFormChange(field.name)}
                            />
                          </div>
                        ))}
                        <button type="submit" className='Submit-Bottom'>
                          Salvar
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Nenhum resultado encontrado.</p>
          )}
        </div>
      </div>
    );
  }
}

export default ReadUpdateForm;
