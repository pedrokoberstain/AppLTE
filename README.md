# 📡 AppLTE

Aplicação web desenvolvida como uma **solução rápida e leve para testes de cobertura e funcionamento da rede LTE**, permitindo o registro de dados diretamente em campo, de forma simples e eficiente.

---

## 🎯 Objetivo do Projeto

O **AppLTE** foi criado com o objetivo de oferecer uma **solução ágil para realizar testes da área de funcionamento da rede LTE**, especialmente em ambientes externos ou de difícil acesso.

A aplicação permite o **registro imediato das informações de conectividade**, utilizando apenas um navegador web, sem necessidade de instalação de aplicativos nativos ou infraestrutura complexa.  
Os dados são armazenados em nuvem através do **Google Firebase**, possibilitando acesso em tempo real e análise posterior.

---

## 🚀 Funcionalidades

- ✔️ Aplicação web leve e responsiva  
- ✔️ Uso direto em celular ou desktop  
- ✔️ Integração com **Google Firebase** como banco de dados  
- ✔️ Armazenamento de dados em tempo real  
- ✔️ Ideal para testes de cobertura LTE em campo  
- ✔️ Estrutura simples e fácil de manter  

---

## 🧰 Tecnologias Utilizadas

- **React**
- **Vite**
- **JavaScript**
- **HTML / CSS**
- **Google Firebase**
  - Realtime Database ou Firestore
- **ESLint**

---

## 🏗️ Arquitetura da Solução

Usuário (Browser / Celular)
|
v
Aplicação Web (React + Vite)
|
v
Google Firebase
(Banco de Dados em Nuvem)


A aplicação se comunica diretamente com o Firebase, eliminando a necessidade de um backend próprio e tornando a solução mais rápida de implantar.

---

## 🔥 Firebase como Banco de Dados

O projeto utiliza o **Google Firebase** para armazenar os dados coletados durante os testes de rede LTE.

Vantagens do uso do Firebase:
- Persistência em nuvem
- Atualização em tempo real
- Baixa latência
- Facilidade de configuração
- Ideal para soluções rápidas e temporárias

---

## ⚙️ Configuração do Firebase

1. Crie um projeto no **Firebase Console**
2. Ative:
   - **Realtime Database** ou **Cloud Firestore**
3. Crie um aplicativo Web
4. Copie as credenciais do Firebase
5. Configure o arquivo de conexão no projeto

Exemplo de configuração:

```js
// src/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "ID",
  appId: "APP_ID"
};

export const app = initializeApp(firebaseConfig);



🛠️ Instalação

Clone o repositório:

git clone https://github.com/pedrokoberstain/AppLTE.git


Acesse a pasta do projeto:

cd AppLTE


Instale as dependências:

npm install


Execute o projeto:

npm run dev

▶️ Uso

Acesse a aplicação pelo endereço exibido no terminal (ex: http://localhost:5173)

Utilize a interface para registrar os dados de teste

As informações serão salvas automaticamente no Firebase

📁 Estrutura do Projeto
AppLTE/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── firebase.js
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── package.json
├── vite.config.js
└── README.md

📄 Licença

Este projeto está sob a licença MIT.

👤 Autor

Pedro Henrique Koberstain
💻 Desenvolvedor
🔗 GitHub: https://github.com/pedrokoberstain
