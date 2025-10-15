
import Hero from '../components/Hero'
import Image from 'next/image'

export default function Home(){
  const services=[
    {name:'Plumbing',icon:'/icons/plumbing.svg'},
    {name:'Cleaning',icon:'/icons/cleaning.svg'},
    {name:'Electrical',icon:'/icons/electrical.svg'},
    {name:'Painting',icon:'/icons/painting.svg'},
    {name:'Gardening',icon:'/icons/gardening.svg'},
    {name:'Moving Help',icon:'/icons/moving.svg'},
  ]
  return (
    <div>
      <Hero />
      <main className="container" id="services">
        <h2 className="section-title">Popular Home Services</h2>
        <div className="grid">
          {services.map(s => (
            <article className="card" key={s.name}>
              <Image src={s.icon} width={56} height={56} alt={s.name} className="icon" />
              <h3>{s.name}</h3>
              <p>From €50</p>
              <span className="badge">Verified</span>
            </article>
          ))}
        </div>
      </main>
      <footer className="footer">© {new Date().getFullYear()} FixEasy Ireland</footer>
    </div>
  )
}
