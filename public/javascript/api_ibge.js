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

async function popularUfs() {
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then(response => response.json())
    .then(json => {
      console.log(json);
      const ufHtml = document.getElementById("uf");
      const siglas = json.map(item => item.sigla).sort();

      siglas.forEach(item => {
        const opt = document.createElement("option");
        opt.innerText = item;
        ufHtml.add(opt);
      }); 

    <%
      if (customer.uf) {
        %>
          ufHtml.value = "<%= customer.uf %>";
        <%
        if (customer.cidade) {
        %>
          const cidade = "<%= customer.cidade %>";
          popularMunicipios("<%= customer.uf %>", cidade); 
        <%
        }
      }
    %>

        ufHtml.addEventListener('change', (event) => {
          const ufSelecionada = event.target.value;
          const cidade = "<%= customer.cidade %>";
          popularMunicipios(ufSelecionada, cidade);
        });
    })
    .catch(error => {
      console.error(error);
      alert(error);
    });

}  