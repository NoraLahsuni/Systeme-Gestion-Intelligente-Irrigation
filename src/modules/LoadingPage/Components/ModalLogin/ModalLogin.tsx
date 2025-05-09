import { Button, TextInput, PasswordInput , Modal ,Alert} from '@mantine/core'
import { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const ModalLogin = ({opened, close}: {opened: boolean, close: () => void}) => {

    const [emailOrUsername, setEmailOrUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorInputEmailOrUsername, setErrorInputEmailOrUsername] = useState('')
    const [errorInputPassword, setErrorInputPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(emailOrUsername === '' || password === '') {
            setErrorInputEmailOrUsername('Veuillez entrer votre email ou username')
            setErrorInputPassword('Veuillez entrer votre mot de passe')
            return;
        }

        setErrorInputEmailOrUsername('')
        setErrorInputPassword('')
        setIsLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACK_END}/api/login`, {
                username: emailOrUsername,
                password: password,
            });
            const data = response?.data;
            if (response.status === 200) {
                setError('')
                Cookies.set('token', data?.access_token);
                navigate('/dashboard')
            }
            else {
                setError(data.message)
            }
            setIsLoading(false)
        } catch (error: any) {
            setError(error?.response?.data?.message)
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setError('');
        setErrorInputEmailOrUsername('');
        setErrorInputPassword('');
        setEmailOrUsername('');
        setPassword('');
        close();
    }

  return (
    <Modal opened={opened} onClose={handleClose} centered>
        <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-1'>
                <TextInput 
                    label={<span className='text-sm'>Email ou Username</span>} 
                    placeholder="Email ou Username" 
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    error={errorInputEmailOrUsername}
                    withAsterisk
                    classNames={{
                        label: 'mb-[8px]'
                    }}
                />
                <PasswordInput 
                    label={<span className='text-sm'>Mot de passe</span>} 
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errorInputPassword}
                    withAsterisk
                    classNames={{
                        label: 'mb-[8px]'
                    }}
                />
                {error && 
                    <Alert className='text-sm text-center' variant='filled' color='red'>
                        {error}
                    </Alert>
                }
            </div>
            
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