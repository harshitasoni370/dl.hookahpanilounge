import Layout from '../components/layout/Layout'
import { useEffect, useState } from 'react'

export default function BoardGames() {
  const [games, setGames] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetch('/assets/data/board-games.json')
      .then(res => res.json())
      .then(data => setGames(data.games || []))
  }, [])

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(g => g.categories?.includes(selectedCategory))

  return (
    <Layout className="bg-games-shell">
      <section className="board-games-page">
        <h1>Board Games Collection</h1>
        <p>Explore our extensive collection of board games for all ages and preferences</p>

        <div className="category-filter">
          <button 
            className={selectedCategory === 'all' ? 'active' : ''} 
            onClick={() => setSelectedCategory('all')}
          >
            All Games
          </button>
          <button 
            className={selectedCategory === 'family' ? 'active' : ''} 
            onClick={() => setSelectedCategory('family')}
          >
            Family
          </button>
          <button 
            className={selectedCategory === 'kids' ? 'active' : ''} 
            onClick={() => setSelectedCategory('kids')}
          >
            Kids
          </button>
          <button 
            className={selectedCategory === 'strategy' ? 'active' : ''} 
            onClick={() => setSelectedCategory('strategy')}
          >
            Strategy
          </button>
        </div>

        <div className="games-grid">
          {filteredGames.map(game => (
            <div key={game.id} className="game-card">
              {game.image && (
                <img src={game.image} alt={game.name} />
              )}
              <h3>{game.name}</h3>
              <p className="game-category">{game.players} players</p>
              {game.description && <p>{game.description}</p>}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
