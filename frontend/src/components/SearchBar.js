import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useBankContext } from '../hooks/useBankContext'
import Bank from './Banks'

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [category, setCategory] = useState('')
    const {banks, dispatch} = useBankContext()
    const { user } = useAuthContext()

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (category == "title") {
            const response = await fetch('/backend/bank/searchTitle?searchTerm='+ searchTerm, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (response.ok) {dispatch({type: 'SHOW_BANKS', payload: json})}
        }
        else if (category == "location") {
            const response = await fetch('/backend/bank/searchLocation?searchTerm='+ searchTerm, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (response.ok) {dispatch({type: 'SHOW_BANKS', payload: json})}
        }
        else {
            const response = await fetch('/backend/bank/searchFood?searchTerm='+ searchTerm, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (response.ok) {dispatch({type: 'SHOW_BANKS', payload: json})}
        }
        
    }

    return (
        <div className="search">
            <form onSubmit={handleSubmit}>
                <label>SEARCH:</label>
                <input
                    type="text"
                    placeholder="ex. bread, rice, meat, etc."
                    onChange={event => setSearchTerm(event.target.value)}
                    value={searchTerm}
                />
                <label>CATEGORY:</label>
                <select 
                    onChange={(event) => setCategory(event.target.value)}
                    value={category}>
                    <option value="food">Food Item</option>
                    <option value="location">Food Bank Location</option>
                    <option value="title">Food Bank Name</option>
                </select>
                <button>SEARCH</button>
            </form>
            <div className="bankResults">
                {banks && banks.map((bank) => (
                    <Bank key={bank._id} bank={bank}/>
                ))}
            </div>
        </div>
    )
}

export default SearchBar