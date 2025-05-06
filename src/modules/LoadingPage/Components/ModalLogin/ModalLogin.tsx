import { Button, TextInput, PasswordInput , Modal } from '@mantine/core'
import { useState } from 'react'
import axios from 'axios'

const ModalLogin = ({opened, close}: {opened: boolean, close: () => void}) => {

    const [emailOrUsername, setEmailOrUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorInputEmailOrUsername, setErrorInputEmailOrUsername] = useState('')
    const [errorInputPassword, setErrorInputPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(emailOrUsername === '' || password === '') {
            setErrorInputEmailOrUsername('Veuillez entrer votre email ou username')
            setErrorInputPassword('Veuillez entrer votre mot de passe')
            return
        }
        setErrorInputEmailOrUsername('')
        setErrorInputPassword('')
        setIsLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACK_END}/api/login`, {
                username: emailOrUsername,
                password: password,
            });
            const data = response.data;
            if (response.status === 200) {
                setError('')
                localStorage.setItem('token', data.access_token);
            }
            else {
                setError(data.message)
            }
            setIsLoading(false)
        } catch (error: any) {
            setError('errore servenu lors de la connexion au serveur')
            setIsLoading(false)
        }
    }

  return (
    <Modal opened={opened} onClose={close} title="Connexion" centered>
        <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-1'>
                <TextInput 
                    label={<span className='text-sm'>Email ou Username <span className='text-red-500'>*</span></span>} 
                    placeholder="Email ou Username" 
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    error={errorInputEmailOrUsername}
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
            <Button 
                variant='gradient' 
                gradient={{ from: 'blue', to: 'green' }} 
                type='submit'
                loading={isLoading}
            >
                Connexion
            </Button>
        </form>
    </Modal>
  )
}

export default ModalLogin