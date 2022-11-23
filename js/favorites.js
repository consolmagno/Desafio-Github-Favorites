export class GithubUser {
  static search(username) {
    const endppoint = `https://api.github.com/users/${username}`

    return fetch(endppoint)
      .then(data => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers
      }))
  }
}

//Classe que vai conter a lógica dos dados
//Como os dados serão estruturados
export class favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  async add(username) {
    const user = await GithubUser.search(username)
  }

  delete(user) {
    // Higther-order functions (map, filters, find, reduce)
    const filteredEntries = this.entries.filter(
      entry => entry.login !== user.login
    )
    this.entries = filteredEntries
    this.update()
  }
}

//Classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement('tr')
    const content = `          
    <td class="user">
      <img
        src="https://github.com/consolmagno.png"
        alt="Imagem de consolmagno"
      />
      <a href="https://github.com/consolmagno" target="_blank"
        ><p>Sofia Consolmagno</p>
        <span>consolmagno</span></a
      >
    </td>
    <td class="repositories">20</td>
    <td class="followers">1</td>
    <td>
      <button class="remove">&times;</button>
    </td>
    `
    tr.innerHTML = content
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }
}
