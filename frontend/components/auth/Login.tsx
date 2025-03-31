import React from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface LoginProps {
  onSwitchToRegister?: () => void;
  handleLogin?: () => void;
}

const Login = ({ onSwitchToRegister, handleLogin }: LoginProps) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6 text-center">Se connecter</h2>
      
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            className='bg-white'
            placeholder="votre@email.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">
            Mot de passe
          </Label>
          <Input
            id="password"
            type="password"
            className='bg-white'
            placeholder="••••••••"
            required
          />
        </div>
        
        <Button type="submit" className="w-full" onClick={handleLogin}>
          Se connecter
        </Button>
      </form>

      {onSwitchToRegister && (
        <>
          <Separator className="my-6" />
          <div className="text-center">
            <p className="mb-3">Pas encore de compte ?</p>
            <Button 
              variant="secondary" 
              onClick={onSwitchToRegister}
              className="px-6"
            >
              S&apos;inscrire
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default Login