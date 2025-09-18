import React from 'react'
import "../styles/Recipe.css"
import '../styles/Home.css'

function Recipe({ recipe, onDelete }) {
    const formattedDate = new Date(recipe.created_at).toLocaleDateString("en-US")
    
    return (
        <div className="recipe-container">
            <h4 className='recipe-title'>{recipe.title}</h4>
            <p className='recipe-description'>{recipe.description}</p>
            <p className='recipe-date'>{formattedDate}</p>
            <button className='delete-button' onClick={() => onDelete(recipe.id)}>Delete</button>
        </div>
    )
}

export default Recipe;
