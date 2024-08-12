const axios = require('axios');
const cheerio = require('cheerio');

async function scraperSite(url) {
  try {
    const {data} = await axios.get(url);
    const $ = cheerio.load(data);
    const products = [];

    $('.product-card').each((index, element) => {
      const produtoNome = $(element).find('.list-card-body h6.product-title').text().trim();
      const produtoPreco = $(element).find('.list-card-body p.time span.text-green').text().trim().replace(/[^0-9.,]/g, '').replace(',', '.');
    
      products.push({nome: produtoNome, preco: produtoPreco});
    
    });

    console.log(products);


  } catch (error) {
    console.error(`Erro ao acessar o site: ${error.message}`);
  } 
}

const url = 'https://www.deliway.com.br/assisi-vino-e-bar-delivery-teresina-pi'
scraperSite(url);