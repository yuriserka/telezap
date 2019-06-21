package testes

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/yuriserka/lpzin/api/models"
	"github.com/yuriserka/lpzin/schema"

	"github.com/yuriserka/lpzin/api/common"

	"github.com/yuriserka/lpzin/api/repositories"
)

const (
	entrar    = 1
	cadastrar = 2
	getmsgs   = 3
	sair      = 4
)

var (
	repUsr = repositories.RepUser{}
	repCht = repositories.RepChat{}
	repMsg = repositories.RepMessage{}
)

// Init simula de forma simplificada a interação com o banco de dados do sistema a fim de testar suas
// funcionalidades
func Init() {
	db, err := common.ConnDB()
	if err != nil {
		panic(fmt.Sprintf("db: %v", err))
	}

	defer db.Close()

	schema.DropSchema(db)
	schema.CreateSchema(db)

	repUsr.Init(db)
	repCht.Init(db)
	repMsg.Init(db)

	idAdm := repUsr.SetUser("AdmCorno", "kkk bovino", "corno", "corno123")
	repCht.SetChat("Grupo de Testes", idAdm)

	home()
}

func home() {
	var opt int
	for opt != sair {
		fmt.Print("\t\tTeleZap simples\n", "Escolha uma das opções abaixo:\n")
		fmt.Printf("[%d] Entrar\n[%d] Cadastrar\n[%d] Recuperar Mensagens do usuário\n[%d] Sair\n\topção: ", entrar, cadastrar, getmsgs, sair)

		switch fmt.Scanf("%d\n", &opt); opt {
		case entrar:
			if usr, logado := autenticarTest(); logado {
				entrarNoChatTest(usr)
			} else {
				fmt.Println("Pera lá amigão seu username ou senha está incorreto")
			}
		case cadastrar:
			cadastrarTest()
		case getmsgs:
			getUserMsgsTest()
		}
	}
}

func entrarNoChatTest(usr models.Usuario) {
	const chatIDStub = 1
	if usr.ID != 1 {
		repCht.SetChatUser(chatIDStub, usr.ID)
	}
	chat := repCht.GetChat(chatIDStub)
	for {
		msgs := repCht.GetChatMsgs(chatIDStub)

		fmt.Printf("\tta no chat %4s amigo\n", chat.Nome)

		for _, v := range msgs {
			u := repUsr.GetUser(v.Autor)
			fmt.Printf("%s => %-6s %-10s\n", u.Nome, v.Conteudo, v.HoraEnvio)
		}

		fmt.Print("Digite uma mensagem: ")
		reader := bufio.NewReader(os.Stdin)
		msg, _ := reader.ReadString('\n')
		msg = msg[:len(msg)-2] // retira o '\n' da mensagem

		if c := strings.Compare(msg, "quit"); c == 0 {
			break
		}

		repMsg.SetMsg(usr.ID, chat.ID, msg)
	}
}

func autenticarTest() (models.Usuario, bool) {
	var (
		username string
		id       int
		usuario  models.Usuario
		senha    string
		reader   *bufio.Reader
	)

	fmt.Println("\tAutenticar-se")
	fmt.Print("digite seu username: ")
	reader = bufio.NewReader(os.Stdin)
	username, _ = reader.ReadString('\n')
	username = username[:len(username)-2]

	fmt.Print("digite sua senha:")
	reader = bufio.NewReader(os.Stdin)
	senha, _ = reader.ReadString('\n')
	senha = senha[:len(senha)-2]

	id = repUsr.GetUserID(username)

	logado := repUsr.UserAuth(username, senha)
	if logado {
		usuario = repUsr.GetUser(id)
		return usuario, logado
	}
	return usuario, logado
}

func cadastrarTest() int {
	fmt.Println("\tCadastre-se")
	fmt.Print("Digite seu nome: ")
	var (
		nome     string
		username string
		senha    string
		reader   *bufio.Reader
	)
	reader = bufio.NewReader(os.Stdin)
	nome, _ = reader.ReadString('\n')
	nome = nome[:len(nome)-2]

	fmt.Print("Digite seu username: ")
	reader = bufio.NewReader(os.Stdin)
	username, _ = reader.ReadString('\n')
	username = username[:len(username)-2]

	fmt.Print("Digite sua senha: ")
	reader = bufio.NewReader(os.Stdin)
	senha, _ = reader.ReadString('\n')
	senha = senha[:len(senha)-2]

	return repUsr.SetUser(nome, "FOTO DO USUARIO", username, senha)
}

func getUserMsgsTest() {
	fmt.Println("\tDigite seu ID: ")
	var id string
	fmt.Scanln(&id)
	aux, err := strconv.Atoi(id)
	if err != nil {
		log.Panic(fmt.Sprintf("Error %+v\n", err))
	}
	msgs := repUsr.GetUserMsgs(aux)
	fmt.Println(msgs)
}