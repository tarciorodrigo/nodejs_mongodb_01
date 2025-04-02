async function popularMunicipios(uf, cidade) {
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      const selectMunicipios = document.getElementById('cidades');
      selectMunicipios.innerHTML = ''; // Limpa opções anteriores
  
      const option = document.createElement('option');
      option.value = null;
      option.textContent = "Selecione a Cidade";
      selectMunicipios.appendChild(option);

      await data.forEach(municipio => {
        const option = document.createElement('option');
        option.value = municipio.nome;
        option.textContent = municipio.nome;
        selectMunicipios.appendChild(option);
      });      

      if (cidade)
        selectMunicipios.value = cidade;
    } catch (error) {
      console.error('Erro ao buscar municípios:', error);
    }
  }