"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";

type Person = {
  name: string;
  field: string;
  era: string;
  country: string;
  summary: string;
  tags: string[];
  image: string;
};

const people: Person[] = [
  {
    name: "Ibn Sina",
    field: "Medicine · Philosophy",
    era: "980–1037",
    country: "Persia",
    summary: "A polymath whose medical and philosophical works influenced scholarship across centuries.",
    tags: ["medicine", "philosophy", "science"],
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=82&w=900",
  },
  {
    name: "Marie Curie",
    field: "Physics · Chemistry",
    era: "1867–1934",
    country: "Poland / France",
    summary: "A pioneering scientist whose research on radioactivity changed modern physics and chemistry.",
    tags: ["science", "physics", "chemistry"],
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=82&w=900",
  },
  {
    name: "Albert Einstein",
    field: "Physics",
    era: "1879–1955",
    country: "Germany / Switzerland / USA",
    summary: "Best known for relativity, but his work also reshaped ideas about light, matter and statistical physics.",
    tags: ["science", "physics", "relativity"],
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=82&w=900",
  },
  {
    name: "Allama Iqbal",
    field: "Poetry · Philosophy",
    era: "1877–1938",
    country: "British India",
    summary: "Poet and philosopher whose Urdu and Persian writing became central to South Asian intellectual history.",
    tags: ["culture", "poetry", "philosophy"],
    image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&q=82&w=900",
  },
  {
    name: "Leonardo da Vinci",
    field: "Art · Engineering",
    era: "1452–1519",
    country: "Italy",
    summary: "Renaissance artist and inventor whose notebooks connect observation, design, anatomy and engineering.",
    tags: ["art", "engineering", "renaissance"],
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=82&w=900",
  },
  {
    name: "Abdul Sattar Edhi",
    field: "Humanitarian Work",
    era: "1928–2016",
    country: "Pakistan",
    summary: "A Pakistani humanitarian whose welfare network became known for ambulance and social services.",
    tags: ["pakistan", "humanitarian", "society"],
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=82&w=900",
  },
];

export default function PeoplePage() {
  const [query, setQuery] = useState("");
  const [field, setField] = useState("All");

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
            <article className="personCard" key={person.name}>
              <img src={person.image} alt="" loading="lazy" />
              <div className="personShade" />
              <div className="personCopy">
                <span>{person.field}</span>
                <h2>{person.name}</h2>
                <strong>{person.era} · {person.country}</strong>
                <p>{person.summary}</p>
                <div className="personTags">{person.tags.map((tag) => <i key={tag}>{tag}</i>)}</div>
              </div>
            </article>
          ))}
        </div>

        <div className="peopleFooter">
          <Link href="/search?q=people">Search the whole index ↗</Link>
          <span>{filtered.length} profiles in this edition</span>
        </div>
      </section>
    </PageChrome>
  );
}
