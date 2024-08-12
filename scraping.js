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

    // console.log(products);

    let sql = '';
    products.forEach(product => {
      sql += `insert into ITENS (
        COD_ITEM, 
        DESCRICAO, 
        DESCRICAO_TOUCH, 
        DESCRICAO_TOUCH1, 
        DESCRICAO_TOUCH2, 
        MOSTRA_TOUCH, 
        NCM, COD_ESTRUTURA, 
        COD_ATIVIDADE, 
        FIS_COD_SIT_ECF, 
        JUR_COD_SIT_ECF, 
        NAOBAIXAESTOQUE, 
        NAOINVENTARIO, 
        VENDAS_NAO_FRACIONA, 
        CMV, COD_TIPO_PROD, 
        FIS_COD_SITTRIB, 
        JUR_COD_SITTRIB, 
        FORA_FIS_COD_SITTRIB, 
        FORA_JUR_COD_SITTRIB, 
        FORAFIS_COD_SIT_ECF, 
        FORAJUR_COD_SIT_ECF, 
        EREVENDA, 
        EIMOBILIZADO, 
        ECONSUMO, 
        BLOQ_VENDA_APRAZO, 
        PROMOCAO, 
        COD_ORIGEM, 
        COD_UNIDADE, 
        QTD_EMBALAGEM, 
        COD_SITUACAO

        )VALUES           
        ((GEN_ID(GNT_CODITEM,1)), 
        '${product.nome.replace(/'/g, "''")}',
        '', 
        '', 
        '', 
        'S',
        '21069090',
        '15', 
        '00', 
        'T17', 
        'T17', 
        'S', 
        'S', 
        'S', 
        'N', 
        'P', 
        'T', 
        'T', 
        'T', 
        'T', 
        'T', 
        'T', 
        'S', 
        'N', 
        'N', 
        'N', 
        'N', 
        '0', 
        'UND', 
        '1', 
        0
        ); \n

        insert into ITENS_ESTOQUE (
        COD_ITEM, COD_EMPRESA,
        PRECO_VENDA, 
        PRECO_ANT1, 
        DT_ANT1
        )
        VALUES
        ((SELECT MAX(COD_ITEM) FROM ITENS),
        2, 
        '${product.preco}', 
        0, 
        CURRENT_DATE); \n`;
    });
    
    console.log(sql);


  } catch (error) {
    console.error(`Erro ao acessar o site: ${error.message}`);
  } 
}

const url = 'https://www.deliway.com.br/assisi-vino-e-bar-delivery-teresina-pi'
scraperSite(url);