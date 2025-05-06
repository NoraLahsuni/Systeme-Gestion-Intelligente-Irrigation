import { Button, TextInput, PasswordInput , Modal } from '@mantine/core'
import { useState } from 'react'

const ModalLogin = ({opened, close}: {opened: boolean, close: () => void}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorInputEmail, setErrorInputEmail] = useState('')
    const [errorInputPassword, setErrorInputPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(email === '' || password === '') {
            setErrorInputEmail('Veuillez remplir tous les champs')
            setErrorInputPassword('Veuillez remplir tous les champs')
            return
        }
        setErrorInputEmail('')
        setErrorInputPassword('')
        setError('')
    }

  return (
    <Modal opened={opened} onClose={close} title="Connexion" centered>
        <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-1'>
                <TextInput 
                    label={<span className='text-sm'>Email ou Username <span className='text-red-500'>*</span></span>} 
                    placeholder="Email ou Username" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errorInputEmail}
                />
                <PasswordInput 
                    label={<span className='text-sm'>Mot de passe <span className='text-red-500'>*</span></span>} 
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errorInputPassword}
                />
            </div>
            {error && 
                <p className='text-red-500 text-sm text-center'>{error}</p>
            }
            <Button variant='gradient' gradient={{ from: 'blue', to: 'green' }} type='submit'>
                Connexion
            </Button>
        </form>
    </Modal>
  )
}

export default ModalLogin