import React, { Component } from 'react';
import axios from 'axios';

class ReadUpdateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],              // Armazena a lista de clientes
      selectedClientId: null,   // Armazena o ID do cliente selecionado ou null se nenhum estiver selecionado
      searchQuery: '',          // Armazena a consulta de pesquisa
      updateFormData: {
        nome_cliente: '',
        busto: '',
        quadril: '',
        cintura: '',
        tecido_preferencia: '',
        ultima_compra: '',
        valorUltimaCompra: '',
        // Adicione mais campos aqui, se necessário
      },
    };
  }

  componentDidMount() {
    // Chamando seu método search_all para buscar todos os clientes
    this.handleSearchAllClients();
  }

  handleSearchAllClients = () => {
    // Faz uma solicitação para buscar todos os clientes diretamente em /api/search_all_clients
    axios.get(`/api/search_all_clients`)
      .then((response) => {
        this.setState({ clients: response.data, searchResults: response.data });
      })
      .catch((error) => {
        console.error('Erro ao buscar todos os clientes:', error);
      });
  }

  handleClientSelect = (clientId) => {
    // Quando um cliente é selecionado, atualize o estado selectedClientId
    this.setState({ selectedClientId: clientId });
  };

  handleInputChange = (event) => {
    // Atualize o estado searchQuery com o valor da caixa de pesquisa
    const searchQuery = event.target.value;
    this.setState({ searchQuery }, () => {
      // Após atualizar a consulta de pesquisa, filtre a lista de clientes
      this.filterClients();
    });
  };

  filterClients = () => {
    const { searchQuery, clients } = this.state;
    // Caso contrário, filtre a lista de clientes com base na consulta de pesquisa
    const filteredClients = clients.filter((client) => {
      return client.nome_cliente.toLowerCase().includes(searchQuery.toLowerCase());
    });
    this.setState({ searchResults: filteredClients });
  };

  handleUpdateFormChange = (field) => (event) => {
    // Atualize o estado do formulário de atualização com os novos valores
    const { updateFormData } = this.state;
    updateFormData[field] = event.target.value;
    this.setState({ updateFormData });
  };

  handleSubmitUpdate = (event) => {
    event.preventDefault();
    const { selectedClientId, updateFormData } = this.state;

    // Faça uma solicitação para atualizar os dados do cliente com base no ID selecionado
    axios.put(`/api/update_client/${selectedClientId}`, updateFormData)
      .then((response) => {
        if (response.status === 200) {
          console.log(`Dados do cliente com ID ${selectedClientId} atualizados com sucesso!`);
          // Limpe os dados do formulário de atualização e atualize a lista de clientes
          this.setState({
            selectedClientId: null, // Desmarque o cliente selecionado
            updateFormData: {},     // Limpe os dados do formulário de atualização
          });
          this.handleSearchAllClients();
        } else {
          console.error('Erro ao atualizar os dados do cliente.');
        }
      })
      .catch((error) => {
        console.error('Erro ao atualizar os dados do cliente:', error);
      });
  };

  render() {
    const { searchQuery, searchResults, selectedClientId, updateFormData } = this.state;

    const cardStyle = {
      width: '90%',
      backgroundColor: '#f0f0f0', // Cor de fundo cinza claro
      padding: '10px',
      margin: '10px',
      cursor: 'pointer',
      borderRadius: '5px',
      transition: 'background-color 0.3s',
      display: 'flex',
      flexDirection: 'column', // Exibir informações em coluna
    };

    const evenCardStyle = {
      ...cardStyle,
      backgroundColor: '#f0f0f0',
    };

    const oddCardStyle = {
      ...cardStyle,
      backgroundColor: '#f0f0f0',
    };

    const expandedCardStyle = {
      ...cardStyle,
      backgroundColor: '#ccc', // Cor de fundo um pouco mais escura quando expandida
    };

    const infoContainerStyle = {
      display: 'flex',
      flexDirection: 'row', // Exibir informações uma ao lado da outra
      justifyContent: 'space-between', // Espaçamento entre as informações
    };

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
        <div>
          {Array.isArray(searchResults) ? (
            searchResults.map((client, index) => (
              <div
                key={client.id}
                style={index % 2 === 0 ? evenCardStyle : oddCardStyle}
                onClick={() => this.handleClientSelect(client.id)}
              >
                <p>Nome: {client.nome_cliente}</p>
                {selectedClientId === client.id && (
                  <div style={expandedCardStyle}>
                    <div style={infoContainerStyle}>
                      <p>Busto: {client.busto}</p>
                      <p>Quadril: {client.quadril}</p>
                      <p>Cintura: {client.cintura}</p>
                      <p>Tecido de Preferência: {client.tecido_preferencia}</p>
                      <p>Última compra: {client.ultima_compra}</p>
                      <p>Valor da última compra: {client.valorUltimaCompra}</p>
                      {/* Adicione mais informações de coluna aqui */}
                    </div>
                    <div>
                      <h3>Formulário de Atualização</h3>
                      <form onSubmit={this.handleSubmitUpdate}>
                        {/* Campos de entrada e manipuladores de alteração */}
                        <div>
                          <label>Nome:</label>
                          <input
                            type="text"
                            value={updateFormData.nome_cliente || ''}
                            onChange={this.handleUpdateFormChange('nome_cliente')}
                          />
                        </div>
                        <div>
                          <label>Busto:</label>
                          <input
                            type="text"
                            value={updateFormData.busto || ''}
                            onChange={this.handleUpdateFormChange('busto')}
                          />
                        </div>
                        <div>
                          <label>Quadril:</label>
                          <input
                            type="text"
                            value={updateFormData.quadril || ''}
                            onChange={this.handleUpdateFormChange('quadril')}
                          />
                        </div>
                        <div>
                          <label>Cintura:</label>
                          <input
                            type="text"
                            value={updateFormData.cintura || ''}
                            onChange={this.handleUpdateFormChange('cintura')}
                          />
                        </div>
                        <div>
                          <label>Tecido de Preferência:</label>
                          <input
                            type="text"
                            value={updateFormData.tecido_preferencia || ''}
                            onChange={this.handleUpdateFormChange('tecido_preferencia')}
                          />
                        </div>
                        <div>
                          <label>Última compra:</label>
                          <input
                            type="text"
                            value={updateFormData.ultima_compra || ''}
                            onChange={this.handleUpdateFormChange('ultima_compra')}
                          />
                        </div>
                        <div>
                          <label>Valor da última compra:</label>
                          <input
                            type="text"
                            value={updateFormData.valorUltimaCompra || ''}
                            onChange={this.handleUpdateFormChange('valorUltimaCompra')}
                          />
                        </div>
                        {/* Adicione mais campos do formulário aqui */}
                        <div>
                          <button type="submit">Salvar Atualizações</button>
                        </div>
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
