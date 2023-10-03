import React, { Component } from 'react';
import axios from 'axios';
import './celulas.css';
import './formulario.css';

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
    const { selectedClientId } = this.state;

    if (selectedClientId === clientId) {
      // Não faça nada se o mesmo cliente for clicado novamente
      return;
    }

    // Abra o formulário para o cliente selecionado
    this.setState({ selectedClientId: clientId });
    document.body.classList.add('no-scroll'); // Adicione a classe no-scroll
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
    this.setState({ selectedClientId: null, updateFormData: {} });
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
        <div>
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
                        {this.formFields.map((field) => (
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
