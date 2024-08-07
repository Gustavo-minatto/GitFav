import { GithubUser } from "./githubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }


  async add(username) {
    try {
      const userExist = this.entries.find(entry => entry.login === username)

      if (userExist) {
        throw new Error('Usuario ja cadastrado')
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()


    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
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
    this.removeAlltr()


    if (this.entries.length === 0) {
      const emptyRow = this.createRowEmpty();

      const windowWidth = window.innerWidth;
      const imgLeft = windowWidth <= 480 ? '50%' : '22rem';
      const pTop = windowWidth <= 480 ? '10%' : '26.2rem';
      const pLeft = windowWidth <= 480 ? '10%' : '43rem';

      emptyRow.style.height = '60rem';
      emptyRow.style.position = 'relative';
      emptyRow.querySelector('img').style.position = 'absolute';
      emptyRow.querySelector('img').style.top = '21.0rem';
      emptyRow.querySelector('img').style.left = imgLeft;
      emptyRow.querySelector('img').style.width = '13.2rem';
      emptyRow.querySelector('p').style.position = 'absolute';
      emptyRow.querySelector('p').style.top = pTop;
      emptyRow.querySelector('p').style.left = pLeft;
      emptyRow.querySelector('p').style.fontSize = '4.0rem';
      emptyRow.querySelector('p').style.lineHeight = '2.5rem';
      emptyRow.querySelector('p').style.color = '#4E5455';

      this.tbody.append(emptyRow);
    }



    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
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

    tr.innerHTML = `
    <td class="user">
    <img src="https://github.com/Gustavo-minatto.png" alt="Imagem de Gustavo">
    <a href="https://github.com/Gustavo-minatto" target="_blank">
      <p>Gustavo Minatto</p>
      <span>gustavominatto</span>
    </a>
  </td>
  <td class="repositories">
    15
  </td>
  <td class="followers">
    0
  </td>
  <td>
  <button class="remove">&times;</button>
  </td>
  `

    return tr
  }

  removeAlltr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })
  }

  createRowEmpty() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
        <td>
        <img src="./assets/Estrela.svg" alt="">
        <p>Nenhum Favorito ainda</p>
        </td>
        <td></td>
        <td></td>
        <td></td>`

    return tr
  }
}