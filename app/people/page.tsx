"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";

type Person = {
  name: string;
  field: string;
  era: string;
  country: string;
  born: string;
  died: string;
  knownFor: string;
  summary: string;
  milestones: string[];
  related: string[];
  tags: string[];
  image: string;
};

const people: Person[] = [
  {
    name: "Ibn Sina",
    field: "Medicine · Philosophy",
    era: "980–1037",
    country: "Persia",
    born: "c. 980",
    died: "1037",
    knownFor: "The Canon of Medicine; philosophy and natural science",
    summary: "A polymath whose medical and philosophical works influenced scholarship across centuries.",
    milestones: ["Early education and medical studies", "Major philosophical and scientific writings", "The Canon of Medicine becomes an influential medical text"],
    related: ["Islamic Golden Age", "Medicine", "Philosophy"],
    tags: ["medicine", "philosophy", "science"],
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=82&w=900",
  },
  {
    name: "Marie Curie",
    field: "Physics · Chemistry",
    era: "1867–1934",
    country: "Poland / France",
    born: "7 November 1867",
    died: "4 July 1934",
    knownFor: "Research on radioactivity; Nobel Prizes in Physics and Chemistry",
    summary: "A pioneering scientist whose research on radioactivity changed modern physics and chemistry.",
    milestones: ["Researches uranium radiation", "Coins and develops the study of radioactivity", "Wins Nobel Prizes in Physics and Chemistry"],
    related: ["Radioactivity", "Physics", "Chemistry"],
    tags: ["science", "physics", "chemistry"],
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=82&w=900",
  },
  {
    name: "Albert Einstein",
    field: "Physics",
    era: "1879–1955",
    country: "Germany / Switzerland / USA",
    born: "14 March 1879",
    died: "18 April 1955",
    knownFor: "Relativity; work on light quanta and statistical physics",
    summary: "Best known for relativity, but his work also reshaped ideas about light, matter and statistical physics.",
    milestones: ["Publishes influential 1905 papers", "Develops general relativity", "Receives the 1921 Nobel Prize in Physics"],
    related: ["Relativity", "Quantum theory", "Modern physics"],
    tags: ["science", "physics", "relativity"],
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=82&w=900",
  },
  {
    name: "Allama Iqbal",
    field: "Poetry · Philosophy",
    era: "1877–1938",
    country: "British India",
    born: "9 November 1877",
    died: "21 April 1938",
    knownFor: "Urdu and Persian poetry; philosophical writing",
    summary: "Poet and philosopher whose Urdu and Persian writing became central to South Asian intellectual history.",
    milestones: ["Studies philosophy and law", "Publishes major Urdu and Persian works", "Becomes an influential voice in South Asian intellectual life"],
    related: ["Urdu literature", "Philosophy", "South Asian history"],
    tags: ["culture", "poetry", "philosophy"],
    image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&q=82&w=900",
  },
  {
    name: "Leonardo da Vinci",
    field: "Art · Engineering",
    era: "1452–1519",
    country: "Italy",
    born: "15 April 1452",
    died: "2 May 1519",
    knownFor: "Painting, anatomy studies, engineering and invention",
    summary: "Renaissance artist and inventor whose notebooks connect observation, design, anatomy and engineering.",
    milestones: ["Works in Florence and Milan", "Creates major paintings and studies anatomy", "Leaves extensive engineering and scientific notebooks"],
    related: ["Renaissance", "Art", "Engineering"],
    tags: ["art", "engineering", "renaissance"],
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=82&w=900",
  },
  {
    name: "Abdul Sattar Edhi",
    field: "Humanitarian Work",
    era: "1928–2016",
    country: "Pakistan",
    born: "1 January 1928",
    died: "8 July 2016",
    knownFor: "Edhi Foundation; ambulance and welfare services",
    summary: "A Pakistani humanitarian whose welfare network became known for ambulance and social services.",
    milestones: ["Begins a small welfare dispensary", "Builds a nationwide ambulance network", "Expands shelter, orphan care and welfare services"],
    related: ["Pakistan", "Humanitarianism", "Social welfare"],
    tags: ["pakistan", "humanitarian", "society"],
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=82&w=900",
  },
];

export default function PeoplePage() {
  const [query, setQuery] = useState("");
  const [field, setField] = useState("All");
  const [selected, setSelected] = useState<Person | null>(null);

  const fields = ["All", ...Array.from(new Set(people.map((item) => item.field.split(" · ")[0])))];
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return people.filter((person) => {
      const matchesField = field === "All" || person.field.includes(field);
      const text = (person.name + " " + person.field + " " + person.country + " " + person.summary + " " + person.tags.join(" ")).toLowerCase();
      return matchesField && (!term || text.includes(term));
    });
  }, [field, query]);

  return (
    <PageChrome>
      <section className="pageHero compactHero">
        <span className="heroTag">GLOBALPEDIA · PEOPLE</span>
        <h1>Meet the people behind the <em>ideas.</em></h1>
        <p>Scientists, writers, thinkers, artists and humanitarian figures connected through the wider knowledge index.</p>
        <div className="peopleSearch">
          <span>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a person, field or country..." aria-label="Search people" />
        </div>
      </section>

      <section className="peoplePage sectionWrap">
        <div className="peopleFilters">
          {fields.map((item) => (
            <button key={item} className={field === item ? "active" : ""} onClick={() => setField(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="peopleGrid">
          {filtered.map((person) => (
            <button className="personCard personCardButton" key={person.name} onClick={() => setSelected(person)}>
              <img src={person.image} alt="" loading="lazy" />
              <div className="personShade" />
              <div className="personCopy">
                <span>{person.field}</span>
                <h2>{person.name}</h2>
                <strong>{person.era} · {person.country}</strong>
                <p>{person.summary}</p>
                <div className="personTags">{person.tags.map((tag) => <i key={tag}>{tag}</i>)}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="peopleFooter">
          <Link href="/search?q=people">Search the whole index ↗</Link>
          <span>{filtered.length} profiles in this edition</span>
        </div>
      </section>

      {selected && (
        <div className="personModal" role="dialog" aria-modal="true" aria-label={selected.name}>
          <button className="personModalBackdrop" aria-label="Close profile" onClick={() => setSelected(null)} />
          <article className="personModalPanel">
            <button className="personModalClose" onClick={() => setSelected(null)} aria-label="Close">×</button>
            <div className="personModalHero">
              <img src={selected.image} alt="" />
              <div>
                <span>{selected.field}</span>
                <h2>{selected.name}</h2>
                <strong>{selected.era} · {selected.country}</strong>
              </div>
            </div>
            <div className="personFacts">
              <div><span>Born</span><strong>{selected.born}</strong></div>
              <div><span>Died</span><strong>{selected.died}</strong></div>
              <div><span>Known for</span><strong>{selected.knownFor}</strong></div>
            </div>
            <p className="personModalSummary">{selected.summary}</p>
            <div className="personMilestones">
              <span>TIMELINE</span>
              {selected.milestones.map((milestone, index) => <div key={milestone}><b>{String(index + 1).padStart(2, "0")}</b><p>{milestone}</p></div>)}
            </div>
            <div className="personRelated">
              <span>RELATED KNOWLEDGE</span>
              <div>{selected.related.map((item) => <Link href={"/search?q=" + encodeURIComponent(item)} key={item}>{item} ↗</Link>)}</div>
            </div>
          </article>
        </div>
      )}
    </PageChrome>
  );
}
