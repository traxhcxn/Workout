import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import AppHomePage from './pages/AppHomePage'
import ManageRoutinesPage from './pages/ManageRoutinesPage'
import SettingsPage from './pages/SettingsPage'
import RoutinesVarPage from './pages/RoutinesVarPage'
import WorkoutPage from './pages/WorkoutPage'

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/sign-up' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/home' element={<AppHomePage />} />
				<Route path='/manage-routines' element={<ManageRoutinesPage />} />
				<Route path='/routine' element={<RoutinesVarPage />} />
				<Route path='/workout' elemment={<WorkoutPage />} />
				<Route path='/settings' element={<SettingsPage />} />
			</Routes>
		</Router>
	)
}

export default App
