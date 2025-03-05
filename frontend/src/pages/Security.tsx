import { useState } from "react"

const Security = () => {
  const [registerMode, setRegisterMode] = useState(false)

  return (    
    <div className="h-screen w-full flex">
        <div className="h-screen w-2/3 relative">
            <img 
              className="h-full w-full object-cover" 
              src="/security_bg.png" 
              alt="Security background"
            />   
        </div>
        <div className="h-screen bg-[#f7f9fc] w-1/3 p-8 flex flex-col gap-y-4">
            <div className="flex items-center">
                <img className="w-[48px]" src="/logo.png" alt="Logo" />
                <h1 className="text-2xl font-bold ml-4">Structura</h1>
            </div>
            <div className="flex flex-col gap-y-4 mt-2">
               <span className="font-bold text-2xl">{registerMode ? "Bienvenue parmi nous" : "Ravi de vous revoir !"}</span>
               <div className="flex flex-col gap-y-4">
                <div className={registerMode ? "flex gap-x-2" : "hidden"}>
                  <div className="flex flex-col w-[49%]">
                    <label htmlFor="email" className="text-xs font-normal mb-1">Prénom</label>
                    <input 
                      type="text" 
                      id="firstname" 
                      placeholder="Lilian" 
                      className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                      name="firstname" 
                    />
                  </div>
                  <div className="flex flex-col w-[49%]">
                    <label htmlFor="email" className="text-xs font-normal mb-1">Nom</label>
                    <input 
                      type="text" 
                      id="lastname" 
                      placeholder="Duvar" 
                      className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                      name="lastname" 
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-xs font-normal mb-1">Email</label>
                  <input 
                    type="text" 
                    id="email" 
                    placeholder="lilian.duvar@structura.fr" 
                    className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                    name="email" 
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
                  />
                </div>
                <div className={`flex items-center justify-between ${registerMode ? "hidden" : ""}`}>
                  <div className="flex items-center gap-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" name="remember" />
                      <div className="w-9 h-5 bg-[#e5e5e5] border border-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#007AFF] peer-checked:after:bg-white"></div>
                    </label>
                    <label htmlFor="remember" className="text-xs font-normal cursor-pointer">Se souvenir de moi</label>
                  </div>
                  <a href="#" className="text-xs font-base text-[#007AFF] hover:cursor-pointer">Mot de passe oublié ?</a>
                </div>
                <div className={`${registerMode ? "" : "hidden"}`}>
                <div className="flex items-center gap-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" required className="sr-only peer" name="remember" />
                      <div className="w-9 h-5 bg-[#e5e5e5] border border-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#007AFF] peer-checked:after:bg-white"></div>
                    </label>
                    <label htmlFor="remember" className="text-xs font-normal cursor-pointer">Je conssens à ce que mes données soient traitées par Structura Group dans le cadre de l'inscription et l'utilisation de ce service. </label>
                  </div>
                </div>
                <button className="text-white rounded text-sm py-2 my-2 bg-[#007AFF] w-full">{registerMode ? "S'inscrire" : "Se connecter"}</button>
               </div>
            </div>
            <div className="w-full bg-gray-300 h-[1px]" />
            <div className="flex justify-center">
              <span className="text-xs font-base hover:cursor-pointer" onClick={() => setRegisterMode(!registerMode)}>{registerMode ? "Vous avez déjà un compte ?" : "Pas encore de compte ?"}<span className="text-[#007AFF] ml-2">{registerMode ? "Connectez-vous" : "Inscrivez-vous"}</span></span>
            </div>
        </div>
        <span className="absolute bottom-8 right-8 text-xs font-base"> 2025 Structura. Tous droits réservés.</span>
    </div>
  );
};

export default Security;
