import React, {Component} from 'react'
// TODO: Apenas para orientar a criação da interface. Deve ser removido até o fim do projeto.
import Template from './Template'
import * as BooksAPI from './BooksAPI'
import './App.css'

class ListShelf extends React.Component {
	render() {
		const { books, shelf } = this.props
//		books.map(b => {console.log(b.title)})
//		const b = books[0]
//		console.log(books[0] && books[0].title)
		
		let showingBooks = books.filter(book => book.shelf === shelf.shelf)
		
		return(
			<div>
			<p>{shelf.name}</p>
			<ol>
			  {showingBooks.map( book => (
				  <li>
					<div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
					<div>{book.title}</div>
					<div>{book.authors[0]}</div>
					<div>{book.shelf}</div>
				  </li>
			  ))}
			</ol>
			</div>
		)
	}
}

class BooksApp extends React.Component {
	state = {
		books: []
	}
	
	componentDidMount() {
		BooksAPI.getAll().then( books => {
			this.setState({ books })
		})
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
		  <div>
		  {shelves.map(shelf => (
			<ListShelf books={this.state.books} shelf={shelf}/>
		  ))}
		    <Template/>
		  </div>
		)
	}
}


export default BooksApp
