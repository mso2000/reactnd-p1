import React from 'react'
import PropTypes from 'prop-types'
import './App.css'
import sortBy from 'sort-by'

/*
* Cada livro é renderizado seguindo certas condições:
* - Se a pratileira a ser construída for "none" (Ex: resultado da busca), todos os livros serão renderizados
*   nela (que não exibirá um nome). Caso contrário, apenas os livros pertencentes à prateleira informada serão
*   renderizados
* - Se o livro não possuir imagem, será apenas exibido um fundo cinza no lugar
* - Se o livro não possuir autor, essa informação será omitida
* - O dropbox de cada livro já estará com a prateleira correspondente selecionada.
*/
const ListShelf = (props) => {
	const { books, shelf, shelves, onMoveBook } = props
	const showingBooks = books
		.filter(book => shelf.shelf === 'none' ? true : book.shelf === shelf.shelf)
		.sort(sortBy('title'))

  return (
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
  								<select defaultValue={book.shelf} onChange={(event) => onMoveBook(book, event.target.value)}>
  									<option value="move" disabled>&#8195; Move to...</option>
  									{shelves.map( optShelf => (
  										<option key={optShelf.shelf} value={optShelf.shelf}>
  										{optShelf.shelf === book.shelf
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
)}

ListShelf.propTypes = {
  books: PropTypes.array.isRequired,
  shelf: PropTypes.object.isRequired,
  shelves: PropTypes.array.isRequired,
  onMoveBook: PropTypes.func.isRequired
}



export default ListShelf
