import { useState } from 'react';
import Login from './components/Login';
import BackendApp from './components/BackendApp';
import type { LoginResponse } from './config/api';

export default function App() {
  const [user,setUser]=useState<LoginResponse|null>(()=>{try{return JSON.parse(localStorage.getItem('wordtruck_user')||'null')}catch{return null}});
  if(!user) return <Login onLogin={setUser}/>;
  return <BackendApp user={user} onLogout={()=>{localStorage.removeItem('wordtruck_user');setUser(null)}}/>;
}
