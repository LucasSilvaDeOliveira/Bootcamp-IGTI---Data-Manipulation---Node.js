//Importações

import { promises } from 'fs';

const { readFile, writeFile } = promises;

//Variáveis

const ufNum = [];
const ufTamMaior = [];
const ufTamMenor = [];

//Inicialização

init();

async function init() {
  try {
    const resEstados = await readFile('./Estados.json', 'utf8');
    const dataEstados = JSON.parse(resEstados);
    const resCidades = await readFile('./Cidades.json', 'utf8');
    const dataCidades = JSON.parse(resCidades);

    // 1 - Criar um documento para cada Estado com nome de sua UF e cidades

    dataEstados.forEach((estado) => {
      let sigla = estado.Sigla;
      let idEstado = estado.ID;
      let cidadesDoEstado = dataCidades.filter(
        (est) => est.Estado === idEstado
      );
      async function write() {
        await writeFile(
          `./estados/${sigla}.json`,
          JSON.stringify(cidadesDoEstado)
        );
      }
      write();
    });

    // 2 - Função que lê uma UF e devover o número de cidades

    //Criando lista de estados e nº de cidades recebendo 0

    dataEstados.forEach((estado) => {
      ufNum.push({ uf: estado.Sigla, cidades: 0 });
    });

    async function qtdCidades(UF) {
      const resCidadesDados = await readFile(`./estados/${UF}.json`, 'utf8');
      const dadosCidades = JSON.parse(resCidadesDados);

      function nCidade(cidades) {
        return cidades.reduce((acc, cur) => {
          return acc + 1;
        }, 0);
      }
      return nCidade(dadosCidades);
    }

    // Preenxer lista de estados com nº cidades

    for (let i = 0; i < ufNum.length; i++) {
      ufNum[i].cidades = await qtdCidades(ufNum[i].uf);
    }

    // 3 - Função devolve array com 5 estados com maior nº de cidades
    function cincoMaiores(lista) {
      let cinMaiores = [];
      lista.sort((a, b) => {
        return b.cidades - a.cidades;
      });
      for (let i = 0; i < 5; i++) {
        cinMaiores.push(lista[i]);
      }
      return cinMaiores;
    }

    // 4 - Função devolve array com 5 estados com menor nº de cidades
    //em ordem descrescente
    function cincoMenores(lista) {
      let cinMenores = [];
      lista.sort((a, b) => {
        return a.cidades - b.cidades;
      });
      for (let i = 0; i < 5; i++) {
        cinMenores.push(lista[i]);
      }
      cinMenores.sort((a, b) => {
        return b.cidades - a.cidades;
      });
      return cinMenores;
    }

    // 5 - Função que lê cidade de menor nome de cada estado

    async function tamanhoCidadeEstados(UF) {
      const resCidadesDados = await readFile(`./estados/${UF}.json`, 'utf8');
      const dadosCidades = JSON.parse(resCidadesDados);
      let tamanhoCidades = [];
      let maiorNome = null;
      let menorNome = null;

      dadosCidades.forEach((cidade) => {
        tamanhoCidades.push({
          Nome: cidade.Nome,
          TamanhoNome: cidade.Nome.length,
        });
      });
      tamanhoCidades.sort((a, b) => {
        return a.Nome.localeCompare(b.Nome);
      });
      tamanhoCidades.sort((a, b) => {
        return a.TamanhoNome - b.TamanhoNome;
      });
      menorNome = tamanhoCidades[0];
      maiorNome = tamanhoCidades[tamanhoCidades.length - 1];

      //Montando e tratando lista - Maiores
      ufTamMaior.push({
        uf: UF,
        Nome: maiorNome.Nome,
        Tamanho: maiorNome.TamanhoNome,
      });
      ufTamMaior.sort((a, b) => {
        return a.Nome.localeCompare(b.Nome);
      });
      ufTamMaior.sort((a, b) => {
        return b.Tamanho - a.Tamanho;
      });

      //Montando e tratando lista - Menores
      ufTamMenor.push({
        uf: UF,
        Nome: menorNome.Nome,
        Tamanho: menorNome.TamanhoNome,
      });
      ufTamMenor.sort((a, b) => {
        return a.Nome.localeCompare(b.Nome);
      });
      ufTamMenor.sort((a, b) => {
        return a.Tamanho - b.Tamanho;
      });
    }

    //Percorrendo todos os estados
    for (let i = 0; i < ufNum.length; i++) {
      await tamanhoCidadeEstados(ufNum[i].uf);
    }

    //Imprimindo metódos no console
    //3
    console.log(cincoMaiores(ufNum));
    //4
    console.log(cincoMenores(ufNum));
    //5
    console.log(ufTamMaior);
    //6
    console.log(ufTamMenor);
    //7
    console.log(ufTamMaior[0]);
    //8
    console.log(ufTamMenor[0]);
  } catch (err) {
    console.log(err);
  }
}
