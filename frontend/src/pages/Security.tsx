import { useState, FormEvent } from "react"
import axios from 'axios'

interface UserCredentials {
  email: string;
  password: string;
}

interface UserRegistration {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const Security = () => {
  const [registerMode, setRegisterMode] = useState(false)
  const [formData, setFormData] = useState<UserRegistration>({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      const endpoint = registerMode ? '/api/register' : '/api/login_check'
      const data = registerMode ? {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password
      } : {
        email: formData.email,
        password: formData.password
      }

      console.log('Sending request to:', `http://localhost:8000${endpoint}`)
      console.log('Request data:', data)

      const response = await axios({
        method: 'post',
        url: `http://localhost:8000${endpoint}`,
        data: data,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      console.log('Response:', response)
      console.log('Response data:', response.data)

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
        }
        // Redirection après connexion réussie
        window.location.href = '/'
      }
    } catch (error: any) {
      console.error('Erreur complète:', error)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)
        console.error('Response data:', error.response.data)
      } else if (error.request) {
        console.error('Request error:', error.request)
      } else {
        console.error('Error message:', error.message)
      }
      setError(error.response?.data?.error || error.message || 'Une erreur est survenue')
    }
  }

  return (    
    <div className="h-screen w-full flex">
        <div className="h-screen w-2/3 relative">
            <img 
              className="h-full w-full object-cover" 
              src="/security_bg.png" 
              alt="Security background"
            />   
        </div>
        <form onSubmit={handleSubmit} className="h-screen bg-[#f7f9fc] w-1/3 p-8 flex flex-col gap-y-4">
            <div className="flex items-center">
                <img className="w-[48px]" src="/logo.png" alt="Logo" />
                <h1 className="text-2xl font-bold ml-4">Structura</h1>
            </div>
            <div className="flex flex-col gap-y-4 mt-2">
               <span className="font-bold text-2xl">{registerMode ? "Bienvenue parmi nous" : "Ravi de vous revoir !"}</span>
               {error && <div className="text-red-500 text-xs">{error}</div>}
               <div className="flex flex-col gap-y-4">
                <div className={registerMode ? "flex gap-x-2" : "hidden"}>
                  <div className="flex flex-col w-[49%]">
                    <label htmlFor="first_name" className="text-xs font-normal mb-1">Prénom</label>
                    <input 
                      type="text" 
                      id="first_name" 
                      placeholder="Lilian" 
                      className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required={registerMode}
                    />
                  </div>
                  <div className="flex flex-col w-[49%]">
                    <label htmlFor="last_name" className="text-xs font-normal mb-1">Nom</label>
                    <input 
                      type="text" 
                      id="last_name" 
                      placeholder="Duvar" 
                      className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required={registerMode}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-xs font-normal mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="lilian.duvar@structura.fr" 
                    className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-xs font-normal mb-1">Mot de passe</label>
                  <input 
                    type="password" 
                    id="password" 
                    placeholder="************" 
                    className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={`flex items-center justify-between ${registerMode ? "hidden" : ""}`}>
                  <div className="flex items-center gap-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        name="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-[#e5e5e5] border border-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#007AFF] peer-checked:after:bg-white"></div>
                    </label>
                    <label htmlFor="remember" className="text-xs font-normal cursor-pointer">Se souvenir de moi</label>
                  </div>
                  <a href="#" className="text-xs font-base text-[#007AFF] hover:cursor-pointer">Mot de passe oublié ?</a>
                </div>
                <div className={`${registerMode ? "" : "hidden"}`}>
                <div className="flex items-center gap-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        required={registerMode} 
                        className="sr-only peer" 
                        name="terms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-[#e5e5e5] border border-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#007AFF] peer-checked:after:bg-white"></div>
                    </label>
                    <label htmlFor="terms" className="text-xs font-normal cursor-pointer">Je consens à ce que mes données soient traitées par Structura Group dans le cadre de l'inscription et l'utilisation de ce service. </label>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="text-white rounded text-sm py-2 my-2 bg-[#007AFF] w-full hover:bg-[#0056b3] transition-colors"
                >
                  {registerMode ? "S'inscrire" : "Se connecter"}
                </button>
               </div>
            </div>
            <div className="w-full bg-gray-300 h-[1px]" />
            <div className="flex justify-center">
              <span className="text-xs font-base hover:cursor-pointer" onClick={() => {
                setRegisterMode(!registerMode)
                setError(null)
                setFormData({
                  first_name: '',
                  last_name: '',
                  email: '',
                  password: ''
                })
              }}>
                {registerMode ? "Vous avez déjà un compte ?" : "Pas encore de compte ?"}
                <span className="text-[#007AFF] ml-2">{registerMode ? "Connectez-vous" : "Inscrivez-vous"}</span>
              </span>
            </div>
        </form>
        <span className="absolute bottom-8 right-8 text-xs font-base"> 2025 Structura. Tous droits réservés.</span>
    </div>
  );
};

export default Security;
