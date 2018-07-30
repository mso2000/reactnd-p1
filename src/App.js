import React, {Component} from 'react'
import SearchBook from './SearchBook'
import ListShelf from './ListShelf'
import * as BooksAPI from './BooksAPI'
import './App.css'

// TODO: Implementar busca e inclusão
// TODO: Implementar ROUTE


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
			console.log(books)
			BooksAPI.search("Android").then(response => console.log(response))
		})
	}

	closeSearch = () => {
		this.setState({ showSearchPage: false })
	}

	restoreState = (book, shelf) => {
		book["shelf"] = shelf
		this.setState(state => ({
			books: state.books.filter(b => b.id !== book.id).concat([book])
		}))
	}

	moveBookToShelf = (book, shelf) => {
		const previousShelf = book.shelf
		book["shelf"] = shelf
		this.setState(state => ({
			books: state.books.filter(b => b.id !== book.id).concat([book])
		}))

		BooksAPI.update(book, shelf)
		.then(resp => {
			if(!resp[shelf].filter(id => id === book.id).length)
				this.restoreState(book, previousShelf)
		})
		.catch(() => this.restoreState(book, previousShelf))
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
			},
			{
				name: "None",
				shelf: "none"
			}
		]

		console.log(this.state)

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
				  <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
				</div>
			  </div>
			)}
		  </div>
		)
	}
}


export default BooksApp
