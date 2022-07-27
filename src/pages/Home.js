import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <section className='h-full p-5 flex justify-center align-items-center'>
            <div className="bg-white rounded-md shadow-md p-5 px-10">
                <h1 className="font-bold text-center text-sky-600 text-3xl pt-5">Bienvenido</h1>
                <p className="text-center text-xl font-semibold pt-5">Esta aplicacion genera los calculos de apuestas basado en el sistema labouchere</p>
                <Link to='/play'>Continuar</Link>
            </div>

        </section>
    );
}

export default Home;