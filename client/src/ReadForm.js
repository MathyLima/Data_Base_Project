import React, { Component } from 'react';
import axios from 'axios';

class ReadForm extends Component {
  constructor() {
    super();
    this.state = {
      searchQuery: '',
      searchResults: [],
      expandedClientId: null,
    };
  }

  handleInputChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleSearch = () => {
    const { searchQuery } = this.state;

    axios.get(`/api/search_clients?name=${searchQuery}`)
      .then((response) => {
        this.setState({ searchResults: response.data });
      })
      .catch((error) => {
        console.error('Erro ao pesquisar clientes:', error);
      });
  };

  handleExpand = (clientId) => {
    this.setState((prevState) => ({
      expandedClientId: prevState.expandedClientId === clientId ? null : clientId,
    }));
  };

  handleDelete = (clientId) => {
    // Lógica para excluir o cliente com base no ID
    axios.delete(`/api/delete_client`, { data: { id: clientId } })
      .then((response) => {
        if (response.status === 200) {
          console.log(`Cliente com ID ${clientId} excluído com sucesso!`);
          // Atualize a lista de resultados após a exclusão
          this.handleSearch();
        } else {
          console.error('Erro ao excluir o cliente.');
        }
      })
      .catch((error) => {
        console.error('Erro ao excluir o cliente:', error);
      });
  };

  render() {
    const { searchQuery, searchResults, expandedClientId } = this.state;

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
        <h2>Pesquisar Clientes</h2>
        <input
          type="text"
          placeholder="Pesquisar por nome"
          value={searchQuery}
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleSearch}>Pesquisar</button>

        <div>
          {Array.isArray(searchResults) ? (
            searchResults.map((client, index) => (
              <div
                key={client.id}
                style={index % 2 === 0 ? evenCardStyle : oddCardStyle}
                onClick={() => this.handleExpand(client.id)}
              >
                <p>Nome: {client.nome_cliente}</p>
                {expandedClientId === client.id ? (
                  <div style={expandedCardStyle}>
                    <div style={infoContainerStyle}>
                      <p>Busto: {client.busto}</p>
                      <p>Quadril: {client.quadril}</p>
                      <p>Cintura: {client.cintura}</p>
                      <p>Tecido de Preferência: {client.tecido_preferencia}</p>
                      <p>Ultima compra: {client.ultima_compra}</p>
                      <p>Valor da ultima compra: {client.valorUltimaCompra}</p>
                      {/* Adicione mais informações de coluna aqui */}
                    </div>
                    <div>
                      <button onClick={() => this.handleDelete(client.id)}>Excluir</button>
                    </div>
                  </div>
                ) : null}
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

export default ReadForm;
