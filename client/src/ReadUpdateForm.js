import axios from 'axios';
import React, { Component } from 'react';

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
      isUpdateFormVisible: false, // Controla a visibilidade do formulário de atualização
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
        this.setState({ clients: response.data });
      })
      .catch((error) => {
        console.error('Erro ao buscar todos os clientes:', error);
      });
  }

  handleClientSelect = (clientId) => {
    // Quando um cliente é selecionado, atualize o estado selectedClientId
    // e limpe os dados do formulário de atualização
    this.setState({
      selectedClientId: clientId,
      isUpdateFormVisible: false, // Feche o formulário de atualização
      updateFormData: {},         // Limpe os dados do formulário de atualização
    });
  };

  handleInputChange = (event) => {
    // Atualize o estado searchQuery com o valor da caixa de pesquisa
    this.setState({ searchQuery: event.target.value });
  };

  handleSearch = () => {
    const { searchQuery } = this.state;

    // Faz uma solicitação para buscar clientes com base na pesquisa
    axios.get(`/api/search_clients?name=${searchQuery}`)
      .then((response) => {
        this.setState({ clients: response.data });
      })
      .catch((error) => {
        console.error('Erro ao pesquisar clientes:', error);
      });
  };

  handleUpdate = () => {
    const { selectedClientId, clients } = this.state;
    // Encontre o cliente selecionado com base no ID
    const selectedClient = clients.find((client) => client.id === selectedClientId);

    // Defina os dados do formulário de atualização com os valores atuais do cliente selecionado
    this.setState({
      isUpdateFormVisible: true,  // Exiba o formulário de atualização
      updateFormData: {
        nome_cliente: selectedClient.nome_cliente,
        busto: selectedClient.busto,
        quadril: selectedClient.quadril,
        cintura: selectedClient.cintura,
        tecido_preferencia: selectedClient.tecido_preferencia,
        ultima_compra: selectedClient.ultima_compra,
        valorUltimaCompra: selectedClient.valorUltimaCompra,
        // Adicione mais campos aqui, se necessário
      },
    });
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
            isUpdateFormVisible: false, // Feche o formulário de atualização
            updateFormData: {},         // Limpe os dados do formulário de atualização
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

  handleCancelUpdate = () => {
    // Limpe os dados do formulário de atualização
    this.setState({
      isUpdateFormVisible: false, // Feche o formulário de atualização
      updateFormData: {},         // Limpe os dados do formulário de atualização
    });
  };

  render() {
    const { clients, selectedClientId, searchQuery, updateFormData, isUpdateFormVisible } = this.state;

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
          <button onClick={this.handleSearch}>Pesquisar</button>
        </div>
        <div>
          {Array.isArray(clients) ? (
            clients.map((client, index) => (
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
                      {/* Botão "Atualizar" agora exibe o formulário */}
                      <button onClick={this.handleUpdate}>Atualizar</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Nenhum resultado encontrado.</p>
          )}
        </div>
        {/* Renderizar o formulário de atualização se isUpdateFormVisible for true */}
        {isUpdateFormVisible && (
          <div>
            <h3>Formulário de Atualização</h3>
            <form onSubmit={this.handleSubmitUpdate}>
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
                <button onClick={this.handleCancelUpdate}>Cancelar</button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default ReadUpdateForm;
