import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import * as BooksAPI from './BooksAPI'
import ListShelf from './ListShelf'
import './App.css'
import debounce from 'lodash/debounce';


class SearchBook extends Component {
	static propTypes = {
		books: PropTypes.array.isRequired,
		shelves: PropTypes.array.isRequired,
		onMoveBook: PropTypes.func.isRequired
	}

	/*
	* @query: Texto digitado pelo usuário no campo de busca
	* @emptyStatus: Texto a ser exibido quando não há livros sendo exibidos
	* @search-books: livros retornados pela busca da API
	*/
	state = {
		query: '',
		emptyStatus: '',
		searchedBooks: []
	}

	/*
	* Os métodos abaixo promovem o "debouncing" da entrada de texto para não 
	* gerar consultas na API a cada letra digitada
	*/
	componentDidMount() {
        this.sendTextChange = debounce(this.sendTextChange, 1500);
        this.setState({query: this.state.query});
    }
	
	handleTextChange = (e) => {
        this.setState({query: e.target.value});
        this.sendTextChange(e.target.value.trim())
    };
    
    sendTextChange = (query) => {
        this.searchBooks(query);
    };
		
	/*
	* Se o texto da query estiver vazio, não será feito nenhum request para a API
	* Se o termo não for encontrado pela API (quando o objeto de retorno possui
	* atributo "error"), então é exibido um erro na UI
	*/
	searchBooks = (query) => {
		this.setState({
			query: query.trim(),
			emptyStatus: 'Searching...'
		})
		if(!query.trim().length) return

		BooksAPI.search(query).then(response => {
			const stateToSave = response.hasOwnProperty('error') ? [] : response
			this.setState( {
				searchedBooks: stateToSave,
				emptyStatus: 'No books found. Try a different term.'
			})
		})
	}

	/*
	* Livros retornados pela busca da API não possuem atributo "shelf"
	* A idéia aqui é criar e preencher esse atributo para cada livro de acordo com os
	* livros atuais nas prateleiras
	*/
	detectShelves = (searchedBooks, currentbooks) => {
		return searchedBooks.map(book =>
		  currentbooks.find(b => b.id === book.id)
		  || { ...book, shelf: 'none'}
		)
	}

	render(){
		const {query, emptyStatus, searchedBooks } = this.state
		const { books, shelves, onMoveBook } = this.props
		const showingBooks = this.detectShelves(searchedBooks, books)

		return(
			<div className="search-books">
				<div className="search-books-bar">
					<Link className="close-search" to="/">Close</Link>
					<div className="search-books-input-wrapper">
						<input
							type="text"
							placeholder="Search by title or author"
							value = {query}
							onChange={this.handleTextChange}
						/>

					</div>
				</div>
				<div className="search-books-results">
				{searchedBooks.length ? (
					<ListShelf
						books={showingBooks}
						shelf={{shelf: 'none'}}
						shelves={shelves}
						onMoveBook={onMoveBook}
					/>
				) : (query.length ? (
				  <h2 className="search-error">{emptyStatus}</h2>
				) : '')}
				</div>
			</div>
		)
	}
}


export default SearchBook
