import Layout from '../components/layout/Layout'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMenu, selectMenu } from '../store/slices/menuSlice'
import { selectQrContext } from '../store/slices/qrContextSlice'

export default function Menu() {
  const dispatch = useDispatch()
  const menuData = useSelector(selectMenu)
  const qrContext = useSelector(selectQrContext)
  const [selectedCategory, setSelectedCategory] = useState('breakfast')

  useEffect(() => {
    dispatch(fetchMenu())
  }, [])

  if (!menuData) return <Layout><div>Loading...</div></Layout>

  const selectedCategoryData = menuData.categories?.find(c => c.id === selectedCategory)
  const categoryItems = selectedCategoryData?.items || []

  return (
    <Layout>
      <section className="menu-page">
        {qrContext?.data && (
          <div className="menu-context" data-qr-context={JSON.stringify(qrContext.data)}>
            {qrContext.data.tableName || qrContext.data.name || qrContext.params?.name || ''}
          </div>
        )}
        <h1>{menuData.brand?.name}</h1>
        <p className="tagline">{menuData.brand?.tagline}</p>

        <div className="menu-categories">
          {menuData.categories?.map(cat => (
            <button 
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {selectedCategoryData && (
          <div className="category-section">
            <h2>{selectedCategoryData.name}</h2>
            <p className="description">{selectedCategoryData.blurb}</p>

            <div className="items-grid">
              {categoryItems.map(item => (
                <div key={item.id} className="menu-item">
                  {item.image && (
                    <img src={item.image} alt={item.name} />
                  )}
                  <h3>{item.name}</h3>
                  {item.description && (
                    <p className="item-description">{item.description}</p>
                  )}
                  {item.price && (
                    <p className="item-price">₹{item.price}</p>
                  )}
                  {item.veg !== undefined && (
                    <span className={`veg-badge ${item.veg ? 'veg' : 'non-veg'}`}>
                      {item.veg ? 'Veg' : 'Non-Veg'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  )
}
