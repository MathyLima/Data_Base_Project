import React,{Component} from "react";
import CreateForm from './CreateForm';
import ReadDeleteForm from './ReadDeleteForm';
import ReadUpdateForm from './ReadUpdateForm';
import './nav.css';

class CRUDPage extends Component{
    constructor(){
        super();
        this.state = {
            activeSection: 'cadastro', //Inicia com a seção de criação
        };
    }

    render(){
        const {activeSection} = this.state;

        return(
            <div className="containerStyle">
                <nav className="navContainerStyle">
                    <ul className="navStyle">
                    <li
                        className="navItemStyle"
                        onClick={() => this.setActiveSection('cadastro')}
                    >
                        Cadastrar
                    </li>
                    <li
                        className="navItemStyle"
                        onClick={() => this.setActiveSection('le_remove')}
                    >
                        Remover
                    </li>
                    <li
                        className="navItemStyle"
                        onClick={() => this.setActiveSection('le_update')}
                    >
                        Atualizar
                    </li>
                    
                    </ul>
                </nav>

                <div className="formContainerStyle">
                    {activeSection === 'cadastro' && <CreateForm/>}
                    {activeSection === 'le_remove' && <ReadDeleteForm/>}
                    {activeSection === 'le_update' && <ReadUpdateForm/>}

                </div>
            </div>
        );
    }
    setActiveSection = (section) =>{
        this.setState({activeSection:section});
    };
}

export default CRUDPage;