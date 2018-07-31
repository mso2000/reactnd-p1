import React, {Component} from 'react'
import { Route , Link } from 'react-router-dom'
import SearchBook from './SearchBook'
import ListShelf from './ListShelf'
import * as BooksAPI from './BooksAPI'
import './App.css'


class BooksApp extends Component {
	state = {
		books: [],
	}

	componentDidMount() {
		BooksAPI.getAll().then( books => {
			this.setState({ books })
		})
	}

	/*
	* Método para atualizar o atributo "shelf" de um determinado livro da coleção
	* e atualizar o estado do componente.
	*/
	setShelf = (book, shelf) => {
		book["shelf"] = shelf
		this.setState(state => ({
			books: state.books.filter(b => b.id !== book.id).concat([book])
		}))
	}

	/*
	* Método para mover um livro para uma nova prateleira (shelf). 
	* Caso haja algum problema com o update na API, será realizado um rollback das
	* alterações na UI
	*/
	moveBookToShelf = (book, shelf) => {
		const previousShelf = book.shelf
		this.setShelf(book, shelf)

		BooksAPI.update(book, shelf)
		.then(resp => {
			// Se o livro foi marcado como "none", mas ainda consta em alguma
			// prateleira, faça o rollback
			const {currentlyReading, read, wantToRead} = resp
			const allBooksResp  = [...currentlyReading, ...read, ...wantToRead]
			if(shelf === 'none'){
				if(allBooksResp.filter(id => id === book.id).length)
					this.setShelf(book, previousShelf)
				return
			}

			// Se o livro foi movido, mas não consta na nova prateleira, faça o
			// rollback
			if(!resp[shelf].filter(id => id === book.id).length)
				this.setShelf(book, previousShelf)
		})
		.catch(() => this.setShelf(book, previousShelf))
	}

	render(){
		/*
		* Prateleiras disponíveis e códigos correspondentes na API
		*
		* Obs: Não existe prateleira "None" na API, mas no app ele será tratado como
		* uma prateleira para exibição dessa opção nos "dropboxes" e exibição dos resultados 
		* da busca, que não são atrelados a prateleiras.
		*/
		const shelves = [
			{
				name: "Currently Reading",
				shelf: "currentlyReading"
			},
			{
				name: "Want to Read",
				shelf: "wantToRead"
			},
			{
				name: "Read",
				shelf: "read"
			},
			{
				name: "None",
				shelf: "none"
			}
		]

		return(
			<div className="app">
				<Route exact path='/' render={() => (
					<div className="list-books">
						<div className="list-books-title">
							<h1>MyReads</h1>
						</div>
						<div className="list-books-content">
							{shelves.filter(shelf => shelf.shelf !== "none").map(shelf => (
							<div key={shelf.shelf}>
								<ListShelf
									books={this.state.books}
									shelf={shelf}
									shelves={shelves}
									onMoveBook={this.moveBookToShelf}
								/>
							</div>
							))}
						</div>
						<div className="open-search">
							<Link to='/search'>Add a book</Link>
						</div>
					</div>
				)}/>
				<Route path='/search' render={({ history }) => (
					<SearchBook
						books={this.state.books}
						shelves={shelves}
						onMoveBook={this.moveBookToShelf}
					/>
				)}/>
			</div>
		)
	}
}


export default BooksApp
