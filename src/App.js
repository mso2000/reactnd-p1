import React, {Component} from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'

// TODO: Implementar mudança de estado de um livro (mudar de prateleira)
// TODO: Implementar busca e inclusão
// TODO: Implementar ROUTE

class ListShelf extends Component {
	render() {
		const { books, shelf } = this.props
		
		let showingBooks = books.filter(book => book.shelf === shelf.shelf)
		
		return(
			<div className="bookshelf">
			  <h2 className="bookshelf-title">{shelf.name}</h2>
			  <div className="bookshelf-books">
				<ol className="books-grid">
				{showingBooks.map( book => (
				  <li key={book.id}>
					<div className="book">
					  <div className="book-top">
						<div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
						<div className="book-shelf-changer">
						  <select>
							<option value="move" disabled>Move to...</option>
							<option value="currentlyReading">Currently Reading</option>
							<option value="wantToRead">Want to Read</option>
							<option value="read">Read</option>
							<option value="none">None</option>
						  </select>
						</div>
					  </div>
					  <div className="book-title">{book.title}</div>
					  <div className="book-authors">{book.authors[0]}</div>
					</div>
				  </li>
				))}
				</ol>
			  </div>
			</div>
		)
	}
}

class SearchBook extends Component {
	render(){
		return(
		  <div className="search-books">
			<div className="search-books-bar">
			  <a className="close-search" onClick={() => this.props.closeSearch()}>Close</a>
			  <div className="search-books-input-wrapper">
				{/*
				  NOTES: The search from BooksAPI is limited to a particular set of search terms.
				  You can find these search terms here:
				  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

				  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
				  you don't find a specific author or title. Every search is limited by search terms.
				*/}
				<input type="text" placeholder="Search by title or author"/>

			  </div>
			</div>
			<div className="search-books-results">
			  <ol className="books-grid"></ol>
			</div>
		  </div>
		)
	}
}

class BooksApp extends Component {
	state = {
		books: [], 
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
		showSearchPage: false
	}
	
	componentDidMount() {
		BooksAPI.getAll().then( books => {
			this.setState({ books })
		})
	}
	
	closeSearch = () => {
		this.setState({ showSearchPage: false })
	}
	
	render(){
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
			}
		]
		
		return(
		  <div className="app">
			{this.state.showSearchPage ? (
			  <SearchBook closeSearch={this.closeSearch}/>
			) : (
			  <div className="list-books">
				<div className="list-books-title">
				  <h1>MyReads</h1>
				</div>
	            <div className="list-books-content">
				  {shelves.map(shelf => (
					<div key={shelf.shelf}>
						<ListShelf books={this.state.books} shelf={shelf}/>
					</div>
				  ))}
				</div>
				<div className="open-search">
				  <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
				</div>
			  </div>
			)}
		  </div>
		)
	}
}


export default BooksApp
