import React, {Component} from 'react'
import './App.css'
import sortBy from 'sort-by'


class ListShelf extends Component {
	render() {
		const { books, shelf, shelves, onMoveBook } = this.props
//		console.log(this.props)
		const showingBooks = books
			.filter(book => book.shelf === shelf.shelf)
			.sort(sortBy('title'))

		return(
			<div className="bookshelf">
			{shelf.shelf !== "none" && (
			<h2 className="bookshelf-title">{shelf.name}</h2>
			)}
			  <div className="bookshelf-books">
				<ol className="books-grid">
				{showingBooks.map( book => (
				  <li key={book.id}>
					<div className="book">
					  <div className="book-top">
						<div className="book-cover" style={
							book.hasOwnProperty('imageLinks')
								? { width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }
								: { width: 128, height: 193 }
							}>
						</div>
						<div className="book-shelf-changer">
						  <select defaultValue={shelf.shelf} onChange={(event) => onMoveBook(book, event.target.value)}>
							<option value="move" disabled>&#8195; Move to...</option>
							{shelves.map( optShelf => (
								<option key={optShelf.shelf} value={optShelf.shelf}>
								{optShelf.shelf === shelf.shelf
									? String.fromCharCode(10004) + String.fromCharCode(8201)
									: String.fromCharCode(8195)} {optShelf.name}
								</option>
							))}
						  </select>
						</div>
					  </div>
					  <div className="book-title">{book.title}</div>
					  {book.hasOwnProperty('authors') && (<div className="book-authors">{book.authors[0]}</div>)}
					</div>
				  </li>
				))}
				</ol>
			  </div>
			</div>
		)
	}
}

export default ListShelf
