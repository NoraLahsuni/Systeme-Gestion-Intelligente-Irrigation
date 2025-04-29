import { Group, Avatar, Text, Title ,  Container, Grid, Button } from '@mantine/core';
import classes from './Team.module.css';
import Nora from './Nora.jpg';
import Alaeddine from './alae.jpeg';
import Abdelghani from './abdelghani.jpeg';

export function Team() {
  return (
    <Container py={70} size="2xl" className={classes.section} id="equipe">
        <Title order={2} className={classes.sectionTitle} ta="center" mb={50}>
          Notre équipe
        </Title>
        
        <Grid 
            justify="center"
            gutter="xl"
            styles={{
                inner: {
                    justifyContent: 'center',
                }
            }}  
        >
            <Grid.Col key={1} span={{ base: 12, sm: 6, md: 6 , xl: 4 }}>
                <Group wrap='nowrap' justify="center">
                    <Avatar
                        src={Alaeddine}
                        size={94}
                        radius="md"
                    />
                    <div>
                        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                            Développeur Logiciel Embarqué
                        </Text>
                        <Text fz="lg" fw={500} className={classes.name}>
                            Alaeddine Bara
                        </Text>
                        <Group wrap="nowrap" gap={5} mt={5}>
                            <Button variant='transparent' className='p-0' 
                            onClick={() => window.open('https://www.linkedin.com/in/alaeddine-bara', '_blank')}>
                                <img src="https://img.icons8.com/color/48/linkedin-circled--v1.png" 
                                    alt="linkedin" width={30}
                                />
                            </Button>
                            <Button variant='transparent' className='p-0' 
                            onClick={() => window.open('https://github.com/AlaeBara', '_blank')}>
                                <img src="https://img.icons8.com/sf-black/64/github.png" 
                                alt="github" width={30}  style={{scale: 1.2}}/>
                            </Button>
                        </Group>
                    </div>
                </Group>
            </Grid.Col>

            <Grid.Col key={3} span={{ base: 12, sm: 6, md: 6 , xl: 4  }}>
                <Group wrap="nowrap" justify="center">
                <Avatar
                    src={Nora}
                    size={94}
                    radius="md"
                />
                <div>
                    <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                        Développeur Logiciel Embarqué
                    </Text>
                    <Text fz="lg" fw={500} className={classes.name}>
                        Nora Lahsuni
                    </Text>
                    <Group wrap="nowrap" gap={5} mt={5}>
                        <Button variant='transparent' className='p-0' 
                        onClick={() => window.open('https://www.linkedin.com/in/nora-lahsuni-0415a2220/', '_blank')}>
                            <img src="https://img.icons8.com/color/48/linkedin-circled--v1.png" 
                                alt="linkedin" width={30}
                            />
                        </Button>
                        <Button variant='transparent' className='p-0' 
                        onClick={() => window.open('https://github.com/NoraLahsuni', '_blank')}>
                            <img src="https://img.icons8.com/sf-black/64/github.png" 
                            alt="github" width={30}  style={{scale: 1.2}} />
                        </Button>
                    </Group>
                </div>
                </Group>
            </Grid.Col>

            <Grid.Col key={2} span={{ base: 12, sm: 6, md: 6 , xl: 4 }} >
                <Group wrap="nowrap" justify="center">
                <Avatar
                    src={Abdelghani}
                    size={94}
                    radius="md"
                />
                <div>
                    <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                        Développeur Logiciel Embarqué
                    </Text>
                    <Text fz="lg" fw={500} className={classes.name}>
                        Abdelghani Amejoud
                    </Text>
                    <Group wrap="nowrap" gap={5} mt={5}>
                        <Button variant='transparent' className='p-0' 
                        onClick={() => window.open('https://www.linkedin.com/in/amejoud-abdelghani-1b577317a/', '_blank')}>
                            <img src="https://img.icons8.com/color/48/linkedin-circled--v1.png" 
                                alt="linkedin" width={30}
                            />
                        </Button>
                        <Button variant='transparent' className='p-0' 
                        onClick={() => window.open('https://github.com/AbdoAMD', '_blank')}>
                            <img src="https://img.icons8.com/sf-black/64/github.png" 
                            alt="github" width={30}  style={{scale: 1.2}} />
                        </Button>
                    </Group>
                </div>
                </Group>
            </Grid.Col>

            <Grid.Col key={4} span={{ base: 12, sm: 6, md: 6 , xl: 4 }}>
                <Group wrap="nowrap" justify="center">
                <Avatar
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                    size={94}
                    radius="md"
                />
                <div>
                    <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                    Développeur Logiciel Embarqué
                    </Text>
                    <Text fz="lg" fw={500} className={classes.name}>
                        Youssef Amzil
                    </Text>
                    <Group wrap="nowrap" gap={5} mt={5}>
                        <Button variant='transparent' className='p-0' 
                        onClick={() => window.open('https://www.linkedin.com/in/youssef-a-218b46194/', '_blank')}>
                            <img src="https://img.icons8.com/color/48/linkedin-circled--v1.png" 
                                alt="linkedin" width={30}
                            />
                        </Button>
                        <Button variant='transparent' className='p-0' 
                        onClick={() => window.open('https://github.com/ysf-uiz', '_blank')}>
                            <img src="https://img.icons8.com/sf-black/64/github.png" 
                            alt="github" width={30}  style={{scale: 1.2}} />
                        </Button>
                    </Group>
                </div>
                </Group>
            </Grid.Col>
        </Grid>
    </Container>
  );
}