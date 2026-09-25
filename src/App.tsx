import './App.css'
import { useState } from 'react'

const saetze = {
  A: [
    { frage: '1', antwort: 'Flächensuche' },
    { frage: '2', antwort: 'Deutsch-Französischer Krieg' },
    { frage: '3', antwort: '300 Millionen' },
    { frage: '4', antwort: 'Oberschenkelinnenseite' },
  ],
  B: [
    { frage: '1', antwort: '1945' },
    { frage: '2', antwort: 'Trümmersuche' },
    { frage: '3', antwort: 'Jagd' },
    { frage: '4', antwort: 'Kenndecke' },
  ],
  C: [
    { frage: '1', antwort: 'Mantrailer' },
    { frage: '2', antwort: 'BRH' },
    { frage: '3', antwort: 'Wind' },
    { frage: '4', antwort: '2 Sekunden' },
  ],
  D: [
    { frage: '1', antwort: 'Grundlinie' },
    { frage: '2', antwort: 'Diskriminierung' },
    { frage: '3', antwort: 'Verbellen' },
    { frage: '4', antwort: 'Schweiz' },
  ],
  E: [
    { frage: '1', antwort: 'Wegesuche' },
    { frage: '2', antwort: 'Rückverweisen' },
    { frage: '3', antwort: '1940er' },
    { frage: '4', antwort: 'Sonne' },
  ],
  F: [
    { frage: '1', antwort: 'Parzellensuche' },
    { frage: '2', antwort: 'Bringseln' },
    { frage: '3', antwort: '1990' },
    { frage: '4', antwort: 'Impulskontrolle' },
  ],
}

type SatzName = keyof typeof saetze

const standardZiffern: Record<SatzName, string[]> = {
  A: ['', '', '', ''],
  B: ['', '', '', ''],
  C: ['', '', '', ''],
  D: ['', '', '', ''],
  E: ['', '', '', ''],
  F: ['', '', '', ''],
}

function App() {
  const [seite, setSeite] = useState('start')
  const [satz, setSatz] = useState<SatzName | null>(null)
  const [frageIndex, setFrageIndex] = useState<number | null>(null)
  const [antwort, setAntwort] = useState('')
  const [richtig, setRichtig] = useState<boolean | null>(null)
  const [pinEingabe, setPinEingabe] = useState('')
  const pruefePin = () => {
  if (pinEingabe === '8521') {
    setPinEingabe('')
    setSeite('einstellungen')
  } else {
    alert('PIN falsch. Bitte erneut versuchen.')
    setPinEingabe('')
  }
}
const [geloesteFragen, setGeloesteFragen] = useState<number[]>([])
const [gemeinsameZiffern, setGemeinsameZiffern] = useState<string[]>([
  '',
  '',
  '',
  '',
])
  const [loesungsziffern, setLoesungsziffern] = useState<
  Record<SatzName, string[]>
>(() => {
  const gespeichert = localStorage.getItem('loesungsziffern')

  if (gespeichert) {
    return JSON.parse(gespeichert)
  }

  return standardZiffern
})
const [richtigeAntworten, setRichtigeAntworten] = useState<
  Record<SatzName, string[]>
>(() => {
  const gespeichert = localStorage.getItem('richtigeAntworten')

  if (gespeichert) {
    return JSON.parse(gespeichert)
  }

  return {
    A: ['', '', '', ''],
    B: ['', '', '', ''],
    C: ['', '', '', ''],
    D: ['', '', '', ''],
    E: ['', '', '', ''],
    F: ['', '', '', ''],
  }
})
const aendereRichtigeAntwort = (
  satzName: SatzName,
  index: number,
  wert: string
) => {
  const neueAntworten = {
    ...richtigeAntworten,
    [satzName]: [...richtigeAntworten[satzName]],
  }

  neueAntworten[satzName][index] = wert

  setRichtigeAntworten(neueAntworten)
  localStorage.setItem('richtigeAntworten', JSON.stringify(neueAntworten))
}
const loescheRichtigeAntworten = () => {
  const bestaetigt = window.confirm(
  'Möchtest du wirklich alle gespeicherten Antworten löschen?'
)

if (!bestaetigt) return
  const leereAntworten: Record<SatzName, string[]> = {
    A: ['', '', '', ''],
    B: ['', '', '', ''],
    C: ['', '', '', ''],
    D: ['', '', '', ''],
    E: ['', '', '', ''],
    F: ['', '', '', ''],
  }

  setRichtigeAntworten(leereAntworten)
  localStorage.removeItem('richtigeAntworten')
}
  const frage =
    satz && frageIndex !== null
      ? saetze[satz][frageIndex]
      : null

  const pruefeAntwort = () => {
  if (!frage || frageIndex === null) return

  const eingegeben = antwort.trim().toLowerCase()
  const korrekt = satz
  ? richtigeAntworten[satz][frageIndex].trim().toLowerCase()
  : ''
  const istRichtig = korrekt !== '' && eingegeben === korrekt

  setRichtig(istRichtig)

  if (istRichtig && !geloesteFragen.includes(frageIndex)) {
  const neueGeloesteFragen = [...geloesteFragen, frageIndex]

  setGeloesteFragen(neueGeloesteFragen)

  if (neueGeloesteFragen.length === 4) {
    setSeite('abschluss')
  }
}
}

  const aendereZiffer = (
    satzName: SatzName,
    index: number,
    wert: string
  ) => {
    const neueZiffern = {
      ...loesungsziffern,
      [satzName]: [...loesungsziffern[satzName]],
    }

    neueZiffern[satzName][index] = wert.slice(0,9)

    setLoesungsziffern(neueZiffern)
    
    localStorage.setItem(
  'loesungsziffern',
  JSON.stringify(neueZiffern)
   )
  }

  const uebernehmeFuerAlleTeams = (werte: string[]) => {
  const neueZiffern: Record<SatzName, string[]> = {
    A: [...werte],
    B: [...werte],
    C: [...werte],
    D: [...werte],
    E: [...werte],
    F: [...werte],
  }

  setLoesungsziffern(neueZiffern)

  localStorage.setItem(
    'loesungsziffern',
    JSON.stringify(neueZiffern)
  )
}

  return (
    <div className="mission-start">

      {seite === 'start' && (
  <>
 <img src="./startseite.png" className="startbild" alt="" />
    
    

    <button
      className="mission-button"
      onClick={() => setSeite('auswahl')}
    >
      Übung starten
    </button>

    <button
  className="einstellungen-zahnrad"
  onClick={() => setSeite('pin')}
  aria-label="Einstellungen"
  title="Einstellungen"
>
  ⚙
</button>
  </>
)}
{seite === 'pin' && (
  <>
    <h1>Einstellungen</h1>
    <p>Bitte PIN eingeben.</p>

    <input
      className="pin-eingabe"
      type="text"
      value={pinEingabe}
      onChange={(e) => setPinEingabe(e.target.value)}
      placeholder="PIN eingeben"
      inputMode="numeric"
    />

    <button
      className="mission-button"
      onClick={pruefePin}
    >
      PIN prüfen
    </button>

    <button
      className="zurueck-button"
      onClick={() => setSeite('start')}
    >
      ← Zurück
    </button>
  </>
)}
      {seite === 'auswahl' && (
  <div className="team-auswahl">
    <h1>Wähle ein Team</h1>

    <div className="satz-container">
      {(Object.keys(saetze) as SatzName[]).map((name) => (
        <button
          key={name}
          className={`satz-button satz-${name.toLowerCase()}`}
onClick={() => {
  setSatz(name)
  setGeloesteFragen([])
  setFrageIndex(null)
  setAntwort('')
  setRichtig(null)
  setSeite('fragen')
}}
        >
          {{
  A: 'Team Anouk',
  B: 'Team Ava',
  C: 'Team Cora',
  D: 'Team Gizmo',
  E: 'Team Loki',
  F: 'Team Nayeli',
}[name]}
        </button>
      ))}
    </div>
<button
  className="team-einstellungen"
  onClick={() => setSeite('pin')}
  aria-label="Einstellungen"
  title="Einstellungen"
>
  ⚙
</button>
  </div>
)}
{seite === 'abschluss' && satz && (
  <div className="utm-abschluss">

    <h1 className="fragen-titel">
  UTM Koordinate
</h1>

    <div className="utm-anzeige">
  Zone {loesungsziffern[satz][0]}
  {' | '}
  E {loesungsziffern[satz][1]}
  {loesungsziffern[satz][2]}
  {' | '}
  N {loesungsziffern[satz][3]}
</div>
<button
  className="utm-zurueck"
  onClick={() => {
    setSatz(null)
    setGeloesteFragen([])
    setSeite('auswahl')
  }}
>
  ← Team-Auswahl
</button>

  </div>
)}
      {seite === 'fragen' && satz && (
        <div className="fragen-seite">
          <h1 className="fragen-titel">
  {{
    A: 'Team Anouk',
    B: 'Team Ava',
    C: 'Team Cora',
    D: 'Team Gizmo',
    E: 'Team Loki',
    F: 'Team Nayeli',
  }[satz]}
</h1>
          <p>Wähle eine Frage aus.</p>

          <div className="satz-container">
            {saetze[satz].map((_, index) => (
              <button
                key={index}
                className="satz-button"
                onClick={() => {
                  setFrageIndex(index)
                  setAntwort('')
                  setRichtig(null)
                  setSeite('frage')
                }}
              >
                {geloesteFragen.includes(index) && '✓ '}
Frage {index + 1}
              </button>
            ))}
          </div>

      <button
        className="team-zurueck"
        onClick={() => setSeite('auswahl')}
      >
        ← Team-Auswahl
      </button>
    </div>
)}

      {seite === 'frage' && frage && frageIndex !== null && (
        <div
  className={`frage-seite ${
    richtig === true
      ? 'frage-richtig'
      : richtig === false
        ? 'frage-falsch'
        : ''
  }`}
>
          <h1 className="frage-titel">Frage {frageIndex + 1}</h1>

          

          <input
            className={`antwort-feld ${richtig === false ? 'antwort-falsch' : ''}`}
            type="text"
            value={antwort}
            onChange={(e) => setAntwort(e.target.value)}
            onKeyDown={(e) => {
  if (e.key === 'Enter') {
    pruefeAntwort()
  }
}}
            placeholder="Deine Antwort..."
            
            />

          <button
            className="mission-button"
            onClick={pruefeAntwort}
          >
            Antwort prüfen
          </button>

          {richtig === false && (
  <div className="feedback-falsch">
    <div className="falsch-titel">✕ Leider falsch</div>
    <div className="falsch-text">
      Versuche es noch einmal.
    </div>
  </div>
)}

          {richtig === true && (
  <div className="feedback-richtig">
    <div className="richtig-titel">✓ Richtig!</div>

    <div className="loesung-label">
      Deine Lösungsziffer
    </div>

    <div className="loesung-ziffer">
      {loesungsziffern[satz!][frageIndex]}
    </div>
  </div>
)}

          <button
            className="zurueck-button"
            onClick={() => setSeite('fragen')}
          >
            ← Zurück zu den Fragen
          </button>
        </div>
      )}

      {seite === 'einstellungen' && (
  <>
    <h1 className="fragen-titel">
      Einstellungen
    </h1>

    <p>Hier kannst du die Lösungsziffern und richtige Antworten für die Teams festlegen.</p>
    <div className="alle-teams-box">
  <h2>Für alle Teams</h2>

  <div className="alle-teams-felder">
    {gemeinsameZiffern.map((wert, index) => (
      <div className="einstellungen-zeile" key={index}>
        <span className="einstellungen-label">
          Frage {index + 1}
        </span>

        <input
          className="einstellungen-eingabe"
          type="text"
          inputMode="numeric"
          maxLength={9}
          value={wert}
          onChange={(e) => {
            const neueWerte = [...gemeinsameZiffern]

            neueWerte[index] = e.target.value
              .replace(/\D/g, '')
              .slice(0, 9)

            setGemeinsameZiffern(neueWerte)
          }}
          placeholder="Lösungsziffer"
        />
      </div>
    ))}
  </div>

  <button
    className="mission-button"
    onClick={() => uebernehmeFuerAlleTeams(gemeinsameZiffern)}
  >
    Auf alle Teams übertragen
  </button>
</div>
<div className="einstellungen-grid">
    {(Object.keys(saetze) as SatzName[]).map((name) => (
      <div
        key={name}
        className="einstellungen-team-box"
      >
        <h2 className="einstellungen-team">
          {{
            A: 'Team Anouk',
            B: 'Team Ava',
            C: 'Team Cora',
            D: 'Team Gizmo',
            E: 'Team Loki',
            F: 'Team Nayeli',
          }[name]}
        </h2>

        <div className="einstellungen-fragen">
          {saetze[name].map((_, index) => (
            <div
              className="einstellungen-zeile"
              key={index}
            >
              <span className="einstellungen-label">
                Frage {index + 1}
              </span>

              <input
                className="einstellungen-eingabe"
                type="text"
                inputMode="numeric"
                maxLength={9}
                value={loesungsziffern[name][index]}
                onChange={(e) =>
                  aendereZiffer(
                    name,
                    index,
                    e.target.value.replace(/\D/g, '')
                  )
                }
                placeholder="Lösungsziffer"
              />
              <input
  className="einstellungen-eingabe"
  type="text"
  value={richtigeAntworten[name][index]}
  onChange={(e) =>
    aendereRichtigeAntwort(
      name,
      index,
      e.target.value
    )
  }
  placeholder="Richtige Antwort"
/>
            </div>
          ))}
        </div>
      </div>
    ))}
</div>
<button
  className="zurueck-button"
  onClick={loescheRichtigeAntworten}
>
  🗑️ Gespeicherte Antworten löschen
</button>
    <div className="einstellungen-navigation">
  <button
    className="zurueck-button"
    onClick={() => setSeite('auswahl')}
  >
    ← Zur Team-Auswahl
  </button>

  <button
    className="zurueck-button"
    onClick={() => setSeite('start')}
  >
    🏠 Zur Startseite
  </button>
</div>
  </>
)}

    </div>
  )
}

  export default App