import { Button, Container, Text, Title } from '@mantine/core';
import classes from './Hero.module.css';

export function HeroImageRight() {
  return (
    <div className={classes.root}>
        <Container size="lg">
            <div className={classes.inner}>
                <div className={classes.content}>
                    <Title className={classes.title}>
                        Optimisez votre{' '}
                        <Text
                            component="span"
                            inherit
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'green' }}
                        >
                            irrigation agricole
                        </Text>{' '}
                        avec notre système intelligent
                    </Title>

                    <Text className={classes.description} mt={30}>
                        Développé dans le cadre du module Systèmes Répartis & Distribués à 
                        <span className="font-bold">  l'Université Ibn Zohr</span>, 
                        notre projet vise à automatiser et optimiser l'irrigation des fermes grâce à des technologies 
                        distribuées avancées.
                    </Text>

                    <Button
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'green' }}
                        size="xl"
                        className={classes.control}
                        mt={40}
                        onClick={() => window.scrollTo({ top: document.getElementById('solution')?.offsetTop, behavior: 'smooth' })}
                    >
                        En savoir plus
                    </Button>
                </div>
            </div>
        </Container>
    </div>
  );
}