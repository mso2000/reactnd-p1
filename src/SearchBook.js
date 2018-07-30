import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import ListShelf from './ListShelf'
import './App.css'

// TODO: Mostrar erro (e melhorar o texto) apenas quando realizar uma busca
// TODO: Mostrar estado correto de cada livro no dropbox
// TODO: Implementar a atualização em batch de todos os livros ao fechar a página


class SearchBook extends Component {
	state = {
		query: '',
		searchedBooks: []
	}
	
	searchBooks = (query) => {
		this.setState({ query: query.trim() })
		if(!query.trim().length) return
		
		BooksAPI.search(query).then(response => {
			if(response.hasOwnProperty('error')) {
				console.log("Erro")
				this.setState({ searchedBooks: [] })
			} else {
				console.log(response)
				this.setState({ searchedBooks: response })
			}
		})
	}
	
	markBookToMove = (book, shelf) => {
		console.log(`${book.title} => ${shelf}`)
	}
	
	render(){
		const {query, searchedBooks } = this.state
		const { books, shelves, onMoveBook } = this.props
		
		return(
		  <div className="search-books">
			<div className="search-books-bar">
			  <Link className="close-search" to="/">Close</Link>
			  <div className="search-books-input-wrapper">
				<input 
					type="text" 
					placeholder="Search by title or author"
					value = {query}
					onChange={(event) => this.searchBooks(event.target.value)}
				/>

			  </div>
			</div>
			<div className="search-books-results">
			{searchedBooks.length ? (
				<ListShelf
					books={searchedBooks}
					shelf="none"
					shelves={shelves}
					onMoveBook={this.markBookToMove}
				/>
			) : (
			  <p>ERRO</p>
			)}
			</div>
		  </div>
		)
	}
}

export default SearchBook
