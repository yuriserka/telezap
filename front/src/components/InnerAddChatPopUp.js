import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ListaUsuarios from './ListaUsuarios';

const Input = styled.input`
  height: 48px;
  resize: none;
  width: 100%;
  border-radius: 100px;
  outline: none;
  border: none !important;
  padding-left: 10px;
`;

export class InnerAddChatPopUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nome: '',
      usuariosSelecionados: [],
    }
  }

  changeHandler = (e) => {
    this.setState({ nome: e.target.value })
  }

  addChatHandler = (e) => {
    if (e.keyCode === 13 && e.target.value.length > 0) {
      console.log('this.state.usuariosSelecionados', this.state.usuariosSelecionados)
        this.props.addChat({
          ID: this.props.chats.length,
          Nome: e.target.value,
          CriadorID: this.props.myID,
          FotoPerfil: '',
        }, this.state.usuariosSelecionados)
      this.setState({ nome: '', usuariosSelecionados: []})
    }
  }

  getInnerStyle = () => {
    return {
      height: '250px',
      margin: '15px 10px',
      background: 'red',
      padding: '15px',
      justifyContent: 'center',
    }
  }

  selecionar = (usuario) => {
    const usa = this.state.usuariosSelecionados
    if (usuario.Selecionado) {
      usa.push(usuario)
      this.setState({
        usuariosSelecionados: usa
      })
    }
  }

  render() {
    return (
      <div style={this.getInnerStyle()}>
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: '10px', height: '64px' }}>
            <Input placeholder="Digite o nome do Chat" onChange={this.changeHandler} value={this.state.nome}
              onKeyDown={this.addChatHandler} />
          </div>
          <ListaUsuarios usuariosAtivos={this.props.usuariosAtivos} myID={this.props.myID} 
            selecionar={this.selecionar}/>
        </div>
      </div>
    )
  }
}

InnerAddChatPopUp.propTypes = {
  chats: PropTypes.array.isRequired,
  usuariosAtivos: PropTypes.array.isRequired,
  myID: PropTypes.number.isRequired,
  addChat: PropTypes.func.isRequired,
}

export default InnerAddChatPopUp
