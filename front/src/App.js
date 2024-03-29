import React from 'react';
import ListaMensagens from './components/ListaMensagens';
import Sidebar from './components/Sidebar';
import CaixaEnvio from './components/CaixaEnvio';
import Header from './components/Header';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
})

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      chats: null,
      chatAtual: null,
      error: null,
      usuarioAtual: null,
      loaded: false,
      usuariosAtivos: null,
    };
  }

  getAppStyle = () => {
    return {
      backgroundImage: `url(${process.env.PUBLIC_URL + '/images/defaultBG.jpg'})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: '650px',
      maxWidth: '1010px',
      minWidth: '300px',
      display: 'block',
      borderBottom: '0',
      borderRadius: '0',
      boxShadow: 'none',
      margin: '0 auto',
      borderLeft: '1px solid #dfe5ec',
      borderRight: '1px solid #dfe5ec',
      overflow: 'hidden',
    }
  }

  addChat = (chat, usuarios) => {
    if (usuarios.length < 1) {
      alert('É necessário selecionar pelo menos um usuário')
      return
    }

    chat.Mensagens = []
    chat.Usuarios = usuarios
    chat.Usuarios.push(this.state.usuarioAtual)
    const noSelecionado = chat.Usuarios.map(u => { delete u.Selecionado; return u.ID })
    chat.Usuarios = noSelecionado

    delete chat.CriadorID

    const t = this.state.chats === null ? [] : this.state.chats
    t.push(chat)

    api.post('/chats', chat).then(
      (_) => {
        this.setState({
          chats: t
        }, this.getChats)
      }
    )

  }

  getChat = (IDchatClicado) => {
    const url = `/chats/${IDchatClicado}`
    api.get(url).then(
      (res) => {
        this.setState({
          chatAtual: res.data
        }, () => { console.log('chat atual', this.state.chatAtual) })
      },
      (error) => {
        this.setState({
          error: error
        })
      }
    )
  }

  addMensagem = (msg) => {
    const url = `/chats/${String(msg.ChatID)}/mensagens`
    api.post(url, {
      Conteudo: msg.Conteudo,
      AutorID: msg.AutorID,
    })
      .then(
        (_) => {
          const { chats } = this.state
          const chatAlvo = chats.find(c => c.ID === msg.ChatID)
          chatAlvo.Mensagens.push(msg)
          this.setState({
            chatAtual: chatAlvo
          }, () => console.log('mensagens chat atual', this.state.chatAtual.Mensagens))
        },
        (error) => {
          this.setState({ error: error })
        }
      )
  }

  getChats = () => {
    const url = `/usuarios/${this.state.usuarioAtual.ID}/chats`
    api.get(url).then(
      (res) => {
        this.setState({
          chats: res.data,
        }, () => { console.log('chats', this.state.chats) })
      }, (error) => {
        this.setState({
          error: error,
        })
      }
    )
  }

  getUsuarioAtual = async () => {
    api.get('/usuarios/')
      .then(
        (res) => {
          this.setState({
            usuarioAtual: res.data[0]
          }, this.getChats)
        },
        (error) => {
          this.setState({ error: error })
        }
      )
  }

  getUsuariosAtivos = async () => {
    api.get('/usuarios')
      .then(
        (res) => {
          this.setState({
            usuariosAtivos: res.data
          }, () => console.log('usuarios ativos', this.state.usuariosAtivos))
        },
        (error) => {
          this.setState({ error: error })
        }
      )
  }

  async componentDidMount() {
    await this.getUsuarioAtual()
    await this.getUsuariosAtivos()

    this.setState({ loaded: true })
  }

  render() {
    const { chatAtual, usuarioAtual } = this.state
    const ehGrupo = chatAtual === null ? false : (chatAtual.Usuarios.length > 2 ? true : false)
    if (!this.state.loaded) {
      return <div>Carregando</div>
    }
     else {
      return (
        <div >
          {
            usuarioAtual && this.state.usuariosAtivos &&
            <div className="App" style={this.getAppStyle()}>
              <Header chatAtual={chatAtual} usuarioAtual={usuarioAtual} ehGrupo={ehGrupo} />
              <Sidebar chats={this.state.chats} myID={usuarioAtual.ID} getChat={this.getChat}
                addChat={this.addChat} usuariosAtivos={this.state.usuariosAtivos} />
              <ListaMensagens chatAtual={chatAtual} myID={usuarioAtual.ID} ehGrupo={ehGrupo} />
              <CaixaEnvio chatAtual={chatAtual} usuarioAtual={usuarioAtual} addMensagem={this.addMensagem}
                ehGrupo={ehGrupo} />
            </div>
          }
        </div>
      );
    }
  }
}

export default App;
