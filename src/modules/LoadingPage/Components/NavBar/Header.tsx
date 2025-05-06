import {Box,Button,Group} from '@mantine/core';
import classes from './Header.module.css';
import logo from './SmartIrrigation.png'
import ModalLogin from '../ModalLogin/ModalLogin';
import { useDisclosure } from '@mantine/hooks';
  
 
export function HeaderMegaMenu() {
    const handleScroll = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
        event.preventDefault(); 
        const element = document.getElementById(targetId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth',
            });
        }
    };
    const [opened, { open, close }] = useDisclosure(false);
  
    return (
        <Box>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">

                    <img src={logo} alt="logo" width={80} height={80} style={{scale: 1.5}} onClick={() => window.location.href = '/'}  />
        
                    <Group h="100%" gap={0} visibleFrom="md">
                    
                        <a href="#solution" className={classes.link} onClick={(e) => handleScroll(e, 'solution')}>
                            Notre solution
                        </a>

                        <a href="#equipe" className={classes.link} onClick={(e) => handleScroll(e, 'equipe')}>
                            Équipe du Projet
                        </a>

                        <a href="#technologies" className={classes.link} onClick={(e) => handleScroll(e, 'technologies')}>
                            Technologies Utilisées  
                        </a>
                        
                    </Group>
        
                    <Group visibleFrom="md">
                        <Button variant="default" onClick={open}>Connexion</Button>
                    </Group>
        
                    <Group hiddenFrom="md">
                        <Button variant="default" onClick={open}>Connexion</Button>
                    </Group>
                </Group>
            </header>

            <ModalLogin opened={opened} close={close} />
        </Box>
    );
  }