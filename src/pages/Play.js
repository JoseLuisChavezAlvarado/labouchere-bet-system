import { useState } from 'react';
import { Simulate } from 'react-dom/test-utils';
import { Link } from 'react-router-dom';
import generarId from '../helpers/generarId';

const Play = () => {

    const INITIAL_SUCCESSION = [1, 1, 1, 1, 1]
    const CHIP_VALUE = 20

    const [hands, setHands] = useState([])

    const addHand = () => {

        const hand = {
            id: generarId(),
            currentBet: calculateBet(INITIAL_SUCCESSION),
            succession: INITIAL_SUCCESSION,
            history: []
        }

        setHands([...hands, hand])
    }

    const calculateBet = (succession) => {
        if (succession.length > 1) {
            return succession[0] + succession[succession.length - 1]
        } else if (succession.length === 1) {
            return succession[0]
        } else {
            return 0
        }
    }

    const removeHand = (id) => {
        const confirmation = window.confirm('¿Está seguro que desea elminar la mano seleccionada?')
        if (confirmation) {
            const updatedHands = hands.filter(hand => hand.id !== id)
            setHands(updatedHands)
        }
    }

    const setLoss = (id) => {
        const copiedArray = [...hands]
        const index = copiedArray.findIndex((hand => hand.id === id))
        const element = copiedArray[index]

        element.history.push([...element.succession])
        element.succession.push(element.currentBet)
        element.currentBet = calculateBet(element.succession)

        copiedArray[index] = element

        setHands(copiedArray)
    }

    const setWin = (id) => {

        const reduceSuccesion = (succesion) => {
            succesion.shift()
            succesion.pop()
            return succesion
        }

        const copiedArray = [...hands]
        const index = copiedArray.findIndex((hand => hand.id === id))
        copiedArray[index].history.push([...copiedArray[index].succession])

        if (!copiedArray[index].succession.length) {
            copiedArray[index].succession = INITIAL_SUCCESSION
        } else {
            copiedArray[index].succession = reduceSuccesion(copiedArray[index].succession)
        }
        copiedArray[index].currentBet = calculateBet(copiedArray[index].succession)

        setHands(copiedArray)
    }

    const setPrevBet = (id) => {

        const copiedArray = [...hands]
        const index = copiedArray.findIndex((hand => hand.id === id))

        if (copiedArray[index].history.length) {
            copiedArray[index].succession = [...copiedArray[index].history.pop()]
            copiedArray[index].currentBet = calculateBet(copiedArray[index].succession)
            setHands(copiedArray)
        }
    }

    const getLoss = (id) => {
        const index = hands.findIndex((hand => hand.id === id))
        const element = hands[index]
        return calculateBet([...element.succession, element.currentBet])
    }

    const getWin = (id) => {
        const reduceSuccesion = (succesion) => {
            succesion.shift()
            succesion.pop()
            return succesion
        }

        const index = hands.findIndex((hand => hand.id === id))
        const element = hands[index]

        const newSuccession = reduceSuccesion([...element.succession])
        return calculateBet(newSuccession)
    }

    return (
        <section className='box-border'>
            <nav className="flex justify-between bg-sky-500 p-8">
                <h2 className='font-bold text-2xl text-white'>Labuocher Betting App</h2>
                <div className='my-auto'>
                    <Link to={'/'}>Volver a Inicio</Link>
                </div>
            </nav>
            <main className='p-16'>

                <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-2'>
                    {
                        hands.map(hand => (
                            <div key={hand.id} className='bg-white rounded-md border-b-slate-500 shadow-md p-6'>
                                <header className='flex justify-between'>
                                    <p>{`${hand.succession.length ? hand.currentBet + ' fichas' : 'Apuesta completada'} `}</p>
                                    <div>
                                        <button className='mx-1'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => removeHand(hand.id)}
                                            className='mx-1 hover:text-red-500 transition'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </header>
                                <main className='flex justify-center flex-col items-center'>
                                    {
                                        hand.succession.length
                                            ? <h1 className='text-6xl font-bold p-6 text-center'>{`$${CHIP_VALUE * hand.currentBet}`}</h1>
                                            : <h1 className='text-5xl font-bold p-6 text-center'>{`Net Win $${CHIP_VALUE * INITIAL_SUCCESSION.reduce((sum, current) => sum + current)}`}</h1>
                                    }
                                    <div>
                                        <h2 className='text-center'>Sucesión</h2>
                                        <p className='text-center font-bold text-sm pt-2'>
                                            {
                                                hand.succession.map((number) => {
                                                    return number + " "
                                                })
                                            }
                                        </p>
                                    </div>
                                </main>
                                <footer className='pt-10 flex flex-col'>
                                    <div className='flex justify-evenly'>
                                        {
                                            hand.succession.length
                                                ? <button onClick={() => setLoss(hand.id)} className='px-4 py-2 rounded-md cursor-pointer text-white font-semibold bg-red-500 hover:bg-red-700 transition'>{`Pérdida: $${getLoss(hand.id) * CHIP_VALUE}`}</button>
                                                : null
                                        }
                                        <button onClick={() => setWin(hand.id)} className='px-4 py-2 rounded-md cursor-pointer text-white font-semibold bg-green-500 hover:bg-green-700 transition'>
                                            {
                                                hand.succession.length
                                                    ? `Victoría: $${getWin(hand.id) * CHIP_VALUE}`
                                                    : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                            }
                                        </button>
                                    </div>
                                    <button onClick={() => setPrevBet(hand.id)} className='pt-6 text-sm font-bold cursor-pointer text-center'>Volver a la apuesta enterior</button>
                                </footer>
                            </div>
                        ))
                    }



                </div>

            </main>
            <button onClick={addHand} className='m-10 z-10 absolute bottom-0 right-0 rounded-full bg-blue-500 w-14 h-14 text-2xl text-white'>
                <img className='w-6 h-6 m-auto' alt='icon' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAANElEQVRIiWNgGAVUBv+hmGjARCOHjFowagEVASMan6Q0Toy5NPcBqWA0J49aMBwtGAUEAQDVUQUcE0vhCwAAAABJRU5ErkJggg==" />
            </button>
        </section>
    );
}

export default Play;