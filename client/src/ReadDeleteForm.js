import React, { Component } from 'react';
import axios from 'axios';
import './celulas.css'
import './formulario.css'

class ReadForm extends Component {
  constructor() {
    super();
    this.state = {
      clients: [],              // Armazena a lista de clientes
      selectedClientId: null,   // Armazena o ID do cliente selecionado ou null se nenhum estiver selecionado
      searchQuery: '',          // Armazena a consulta de pesquisa
      expandedClientId: null,
    };
  }

  componentDidMount() {
    // Chamando seu método para buscar todos os clientes ao inicializar a página
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

  handleInputChange = (event) => {
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
          // Atualize a lista de clientes após a exclusão
          this.handleSearchAllClients();
          // Limpe a consulta de pesquisa após a exclusão
          this.setState({ searchQuery: '' });
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
                onClick={() => this.handleExpand(client.id)}
                className='CardStyle'
              >
                <p>Nome: {client.nome_cliente}</p>
                {expandedClientId === client.id && (
                  <div className='CardStyle'>
                    <div className='infoContainerStyle'>
                      <p>Busto: {client.busto}</p>
                      <p>Quadril: {client.quadril}</p>
                      <p>Cintura: {client.cintura}</p>
                      <p>Tecido de Preferência: {client.tecido_preferencia}</p>
                      <p>Última compra: {client.ultima_compra}</p>
                      <p>Valor da última compra: {client.valorUltimaCompra}</p>
                    </div>
                    <div>
                      <button className='Submit-Bottom' onClick={() => this.handleDelete(client.id)}>Excluir</button>
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

export default ReadForm;

