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
			// Se o livro foi marcado como "none", mas ainda consta em alguma
			// prateleira, faça o rollback
			const {currentlyReading, read, wantToRead} = resp
			const allBooksResp  = [...currentlyReading, ...read, ...wantToRead]
			if(shelf === 'none'){
				if(allBooksResp.filter(id => id === book.id).length)
					this.restoreState(book, previousShelf)
				return
			}

			// Se o livro foi movido, mas não consta na nova prateleira, faça o
			// rollback
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
