const categories = ["Science", "History", "Technology", "Geography", "Culture", "Space"];

const articles = [
  {
    category: "SCIENCE",
    title: "How the universe keeps expanding",
    text: "A visual journey through cosmic expansion, dark energy, and the structure of space-time.",
  },
  {
    category: "TECHNOLOGY",
    title: "The architecture of modern AI",
    text: "From neural networks to large language models, explore the systems shaping intelligent software.",
  },
  {
    category: "HISTORY",
    title: "How cities became centers of civilization",
    text: "Discover how trade, geography, power, and human migration transformed cities into global hubs.",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <div className="brand">GLOBAL<span>PEDIA</span></div>
        <div className="navLinks">
          <a href="#explore">Explore</a>
          <a href="#featured">Featured</a>
          <a href="#about">About</a>
        </div>
        <button className="navButton">Explore Knowledge</button>
      </nav>

      <section className="hero">
        <div className="orb orbOne" />
        <div className="orb orbTwo" />
        <div className="heroContent">
          <p className="eyebrow">THE WORLD, EXPLAINED</p>
          <h1>Knowledge<br /><em>without boundaries.</em></h1>
          <p className="heroText">
            Explore science, history, technology, culture, geography, and the universe through a modern encyclopedia built for curious minds.
          </p>
          <div className="search">
            <span>⌕</span>
            <input placeholder="Search anything..." aria-label="Search GlobalPedia" />
            <kbd>⌘ K</kbd>
          </div>
        </div>
      </section>

      <section id="explore" className="section">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">EXPLORE</p>
            <h2>Choose a world.</h2>
          </div>
          <p>Thousands of ideas, places, discoveries and stories waiting to be explored.</p>
        </div>
        <div className="categories">
          {categories.map((category, index) => (
            <article className="categoryCard" key={category}>
              <span>0{index + 1}</span>
              <h3>{category}</h3>
              <p>Discover more →</p>
            </article>
          ))}
        </div>
      </section>

      <section id="featured" className="section featuredSection">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">EDITORIAL</p>
            <h2>Featured knowledge.</h2>
          </div>
        </div>
        <div className="articleGrid">
          {articles.map((article, index) => (
            <article className={`articleCard article${index + 1}`} key={article.title}>
              <div className="articleGlow" />
              <div className="articleContent">
                <p className="eyebrow">{article.category}</p>
                <h3>{article.title}</h3>
                <p>{article.text}</p>
                <a href="#">Read article ↗</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="manifesto">
        <p className="eyebrow">GLOBALPEDIA</p>
        <h2>Curiosity is where<br /><em>everything begins.</em></h2>
      </section>

      <footer>
        <div className="brand">GLOBAL<span>PEDIA</span></div>
        <p>Knowledge without boundaries.</p>
        <small>© 2026 GlobalPedia</small>
      </footer>
    </main>
  );
}
