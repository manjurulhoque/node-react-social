import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import HomePage from './pages/HomePage';

function App() {
    return (
        <Router basename={'/'}>
            <main className='py-3'>
                <Container>
                    <Routes>
                        <Route exact path="/" element={<HomePage />} />
                    </Routes>
                </Container>
            </main>
        </Router>
    );
}

export default App;
