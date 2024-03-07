import './App.css'
import { useState, useEffect } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit'

const abecedario = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

function App () {
  const [celda, setCelda] = useState([])

  const { speak, voices } = useSpeechSynthesis()

  const handleSpeak = () => {
    console.log(voices)
    const palabra = celda.join('')
    speak({ text: palabra, rate: 0.7, voice: voices[235] })
  }

  const handleClick = (letra) => {
    setCelda(prevCelda => [...prevCelda, letra])
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Backspace') {
        setCelda(prevCelda => {
          const newCelda = [...prevCelda]
          newCelda.pop() // Borra el último elemento
          return newCelda
        })
      }
      if (!abecedario.includes(event.key)) return
      setCelda(prevCelda => [...prevCelda, event.key])
    }

    // Agregar el event listener cuando el componente se monta
    window.addEventListener('keydown', handleKeyPress)

    // Limpiar el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const startDrag = (evt, letra) => {
    evt.dataTransfer.setData('letra', letra)
  }

  const draggingOver = (evt) => {
    evt.preventDefault()
  }

  const onDrop = (evt) => {
    evt.preventDefault() // Agrega esta línea para evitar el comportamiento predeterminado del navegador al soltar
    const letra = evt.dataTransfer.getData('letra')
    setCelda(prevCelda => [...prevCelda, letra]) // Usa el callback de setCelda para acceder al estado actualizado
  }

  const cleanAll = () => {
    setCelda([])
  }

  const cleanOne = (indexLetra) => {
    const newCelda = celda.filter((_, index) => index !== indexLetra)
    setCelda(newCelda)
  }

  return (
    <>
      <header>
        <h1>Aprende a leer formando palabras!</h1>
      </header>

      <main>
      <aside>
        <ul className='abecedario' >
          {
            abecedario.map(letra => (
              <li data-label={letra} key={letra} onClick={() => handleClick(letra)} draggable onDragStart={(evt) => startDrag(evt, letra)}>
                {letra}
              </li>
            ))
          }
        </ul>
      </aside>
        <section className='container'>
          <div className="clean">
            <img src="/clean.png" alt="Icono de limpiar" title='Limpiar' onClick={cleanAll} />
          </div>
          <div className='tablero-container' onDragOver={(evt) => draggingOver(evt) } onDrop={(evt) => onDrop(evt)}>
          <ul className='tablero' >
          {celda.map((letra, index) => (
              <li key={index} onClick={() => cleanOne(index)}>
                {letra}
              </li>
          ))}
          </ul>
          </div>
          <footer className='container__footer'>
            <img src="/speaker.png" alt="Icono de reproducir" title='Reproducir' onClick={handleSpeak} />
          </footer>
        </section>
      </main>
    </>
  )
}

export default App
