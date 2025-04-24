import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages';
import { MainLayout } from './components/home';


function App() {
  return (
   <div>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path='/' element={<Home />}/>
      </Route>
    </Routes>
   </div>
  );
}

export default App;
