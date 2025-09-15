
const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => (
  categories.length > 0 && (
    <section className="categories">
      <div className="custom-select">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </section>
  )
);

export default CategoryFilter;
